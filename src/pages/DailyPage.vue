<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useFinanceStore } from '@/store/finance'

const route = useRoute()
const router = useRouter()
const financeStore = useFinanceStore()
const { monthlyGoal } = storeToRefs(financeStore)
const selectedDate = computed(() => route.params.date || '2026-04-08')
const transactions = computed(() => financeStore.getTransactionsByDate(selectedDate.value))
const editingId = ref(null)
const deletingId = ref(null)
const form = reactive({ category: '', description: '', amount: '', time: '' })

const todayIncome = computed(() => transactions.value.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0))
const todayExpense = computed(() => transactions.value.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0))
const remaining = computed(() => monthlyGoal.value + todayIncome.value - todayExpense.value)
const title = computed(() => {
  const [year, month, day] = selectedDate.value.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
})

watch(editingId, (id) => {
  if (!id) return
  const target = transactions.value.find((item) => item.id === id)
  if (!target) return
  form.category = target.category
  form.description = target.description
  form.amount = String(target.amount)
  form.time = target.time
})

function saveEdit() {
  if (!editingId.value) return
  financeStore.updateTransaction(editingId.value, {
    category: form.category,
    description: form.description,
    amount: Number(form.amount) || 0,
    time: form.time,
  })
  editingId.value = null
}

function confirmDelete() {
  if (!deletingId.value) return
  financeStore.deleteTransaction(deletingId.value)
  deletingId.value = null
}
</script>

<template>
  <section class="content-page detail-page">
    <button type="button" class="back-button" @click="router.push('/')">달력으로 돌아가기</button>

    <div class="section-card">
      <h1>{{ title }}</h1>
      <div class="summary-grid compact">
        <article>
          <span>오늘 수입</span>
          <strong>+{{ todayIncome.toLocaleString() }}원</strong>
        </article>
        <article>
          <span>오늘 지출</span>
          <strong>-{{ todayExpense.toLocaleString() }}원</strong>
        </article>
        <article>
          <span>하루 잔액</span>
          <strong>{{ remaining.toLocaleString() }}원</strong>
        </article>
      </div>
    </div>

    <div class="section-card">
      <div class="section-headline">
        <h2>거래 내역</h2>
        <button type="button" class="text-button" @click="router.push('/input')">새 거래 추가</button>
      </div>

      <div v-if="transactions.length" class="transaction-list">
        <article v-for="item in transactions" :key="item.id" class="transaction-row">
          <div class="transaction-main">
            <div class="transaction-icon">{{ item.type === 'income' ? '수입' : '지출' }}</div>
            <div>
              <strong>{{ item.category }}</strong>
              <p>{{ item.description }}</p>
              <small>{{ item.time }}</small>
            </div>
          </div>

          <div class="transaction-actions">
            <strong :class="item.type">{{ item.type === 'income' ? '+' : '-' }}{{ item.amount.toLocaleString() }}원</strong>
            <div class="action-group">
              <button type="button" class="chip-button" @click="editingId = item.id">수정</button>
              <button type="button" class="chip-button danger" @click="deletingId = item.id">삭제</button>
            </div>
          </div>
        </article>
      </div>

      <p v-else class="empty-state">이 날짜에는 아직 기록된 거래가 없어요.</p>
    </div>

    <div class="floating-tip secondary">
      <div class="floating-icon">팁</div>
      <div>
        <strong>하루 기록을 꾸준히 남기면 소비 패턴이 보여요.</strong>
        <p>작은 금액도 적어두면 어디에 많이 쓰는지 금방 알 수 있어요.</p>
      </div>
    </div>

    <div v-if="editingId" class="modal-overlay" @click.self="editingId = null">
      <div class="modal-card">
        <h3>거래 수정</h3>
        <label>
          <span>카테고리</span>
          <input v-model="form.category" type="text" />
        </label>
        <label>
          <span>내용</span>
          <input v-model="form.description" type="text" />
        </label>
        <label>
          <span>금액</span>
          <input v-model="form.amount" type="number" />
        </label>
        <label>
          <span>시간</span>
          <input v-model="form.time" type="time" />
        </label>
        <div class="modal-actions">
          <button type="button" class="ghost-button" @click="editingId = null">취소</button>
          <button type="button" class="primary-button" @click="saveEdit">저장</button>
        </div>
      </div>
    </div>

    <div v-if="deletingId" class="modal-overlay" @click.self="deletingId = null">
      <div class="modal-card small">
        <h3>거래 삭제</h3>
        <p>이 거래 내역을 삭제할까요? 삭제 후에는 복구되지 않아요.</p>
        <div class="modal-actions">
          <button type="button" class="ghost-button" @click="deletingId = null">취소</button>
          <button type="button" class="danger-button" @click="confirmDelete">삭제</button>
        </div>
      </div>
    </div>
  </section>
</template>
