<script setup>
import { computed, reactive, ref } from 'vue'
import CategorySelector from '@/components/input/CategorySelector.vue'
import QuickAmountButtons from '@/components/input/QuickAmountButtons.vue'
import TransactionTypeTabs from '@/components/input/TransactionTypeTabs.vue'
import { useFinanceStore } from '@/store/finance'

const financeStore = useFinanceStore()
const categories = ['식비', '교통', '문화', '취미', '교육', '기타']
const quickAmounts = [1000, 3000, 5000, 10000]
const activeTab = ref('expense')
const message = ref('')
const form = reactive({
  amount: '',
  category: '',
  description: '',
  from: '',
  date: '2026-04-08',
})

const submitLabel = computed(() => activeTab.value === 'income' ? '수입 등록하기' : '지출 등록하기')

function resetForm() {
  form.amount = ''
  form.category = ''
  form.description = ''
  form.from = ''
}

function appendAmount(amount) {
  const currentAmount = Number(form.amount || 0)
  form.amount = String(currentAmount + amount)
}

function submitForm() {
  if (!form.amount || !form.date) {
    message.value = '날짜와 금액을 먼저 입력해 주세요.'
    return
  }

  const category = activeTab.value === 'income' ? (form.from || '용돈') : (form.category || '기타')
  const description = activeTab.value === 'income' ? `${form.from || '보호자'}에게 받은 금액` : (form.description || '메모 없음')

  financeStore.addTransaction({
    type: activeTab.value,
    category,
    description,
    amount: Number(form.amount),
    date: form.date,
    time: '',
  })

  message.value = activeTab.value === 'income' ? '수입이 저장되었어요.' : '지출이 저장되었어요.'
  resetForm()
}
</script>

<template>
  <section class="content-page input-page">
    <div class="section-card">
      <h1>용돈과 지출 입력</h1>
      <TransactionTypeTabs :active-tab="activeTab" @change="activeTab = $event" />

      <form class="stack-form" @submit.prevent="submitForm">
        <label>
          <span>날짜</span>
          <input v-model="form.date" type="date" />
        </label>

        <label>
          <span>금액</span>
          <input v-model="form.amount" type="number" placeholder="금액을 입력해 주세요" />
        </label>

        <QuickAmountButtons :amounts="quickAmounts" @select="appendAmount" />

        <template v-if="activeTab === 'income'">
          <label>
            <span>누구에게 받았나요?</span>
            <input v-model="form.from" type="text" placeholder="예: 엄마, 아빠, 할머니" />
          </label>
        </template>

        <template v-else>
          <CategorySelector :categories="categories" :selected-category="form.category" @select="form.category = $event" />

          <label>
            <span>메모</span>
            <textarea v-model="form.description" rows="3" placeholder="무엇을 샀는지 적어 주세요"></textarea>
          </label>
        </template>

        <p v-if="message" class="success-message">{{ message }}</p>
        <button type="submit" class="primary-button">{{ submitLabel }}</button>
      </form>
    </div>
  </section>
</template>
