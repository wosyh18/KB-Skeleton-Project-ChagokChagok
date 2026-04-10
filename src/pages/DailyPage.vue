<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import InfoTipCard from '@/components/common/InfoTipCard.vue'
import DailySummaryCard from '@/components/daily/DailySummaryCard.vue'
import EditTransactionModal from '@/components/daily/EditTransactionModal.vue'
import TransactionList from '@/components/daily/TransactionList.vue'
import { useFinanceStore } from '@/store/finance'

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const route = useRoute()
const router = useRouter()
const financeStore = useFinanceStore()
const selectedDate = computed(() => route.params.date || getTodayDate())
const transactions = computed(() =>
  financeStore.getTransactionsByDate(selectedDate.value),
)
const editingId = ref(null)
const deletingId = ref(null)

onMounted(async () => {
  await financeStore.fetchTransactions()
})

const selectedTransaction = computed(
  () => transactions.value.find((item) => item.id === editingId.value) || null,
)

const todayIncome = computed(() =>
  transactions.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0),
)

const todayExpense = computed(() =>
  transactions.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0),
)

const remaining = computed(() => financeStore.getRemainingByDate(selectedDate.value))

const title = computed(() => {
  const [year, month, day] = selectedDate.value.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
})

async function saveEdit(payload) {
  if (!editingId.value) return
  await financeStore.updateTransaction(editingId.value, payload)
  editingId.value = null
}

async function confirmDelete() {
  if (!deletingId.value) return
  await financeStore.deleteTransaction(deletingId.value)
  deletingId.value = null
}
</script>

<template>
  <section class="content-page detail-page">
    <button type="button" class="back-button" @click="router.push('/')">
      달력으로 돌아가기
    </button>

    <DailySummaryCard
      :title="title"
      :today-income="todayIncome"
      :today-expense="todayExpense"
      :remaining="remaining"
    />

    <TransactionList
      :transactions="transactions"
      @add="router.push('/input')"
      @edit="editingId = $event"
      @delete="deletingId = $event"
    />

    <InfoTipCard
      icon="팁"
      title="하루 기록이 쌓이면 소비 습관이 보여요"
      description="작은 금액도 적어두면 어디에 많이 쓰는지 금방 알 수 있어요."
      secondary
    />

    <EditTransactionModal
      :open="Boolean(editingId)"
      :transaction="selectedTransaction"
      @close="editingId = null"
      @save="saveEdit"
    />

    <ConfirmModal
      :open="Boolean(deletingId)"
      title="거래 삭제"
      message="이 거래 내역을 삭제할까요? 삭제 후에는 되돌릴 수 없어요."
      confirm-text="삭제"
      cancel-text="취소"
      @close="deletingId = null"
      @confirm="confirmDelete"
    />
  </section>
</template>
