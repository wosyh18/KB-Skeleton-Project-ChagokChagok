<script setup>
import { computed, reactive, ref, watch } from 'vue'
import CategorySelector from '@/components/input/CategorySelector.vue'
import QuickAmountButtons from '@/components/input/QuickAmountButtons.vue'
import TransactionTypeTabs from '@/components/input/TransactionTypeTabs.vue'
import { useFinanceStore } from '@/store/finance'

const props = defineProps({
  selectedDate: { type: String, required: true },
})

const emit = defineEmits(['saved'])

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
  date: props.selectedDate,
})

watch(
  () => props.selectedDate,
  (nextDate) => {
    form.date = nextDate
  },
)

const submitLabel = computed(() =>
  activeTab.value === 'income' ? '수입 등록하기' : '지출 등록하기',
)

function resetForm() {
  form.amount = ''
  form.category = ''
  form.description = ''
  form.from = ''
  form.date = props.selectedDate
}

function appendAmount(amount) {
  const currentAmount = Number(form.amount || 0)
  form.amount = String(currentAmount + amount)
}

function sanitizeAmountInput(event) {
  const value = event.target.value
  if (value === '') {
    form.amount = ''
    return
  }

  const numericValue = Number(value)
  form.amount = Number.isNaN(numericValue)
    ? ''
    : String(Math.max(0, numericValue))
}

function changeTab(tab) {
  activeTab.value = tab
  message.value = ''
  resetForm()
}

async function submitForm() {
  if (!form.date) {
    message.value = '날짜를 선택해 주세요.'
    return
  }

  if (!form.amount || Number(form.amount) <= 0) {
    message.value = '금액을 1원 이상 입력해 주세요.'
    return
  }

  if (activeTab.value === 'income' && !form.from.trim()) {
    message.value = '수입 출처를 입력해 주세요.'
    return
  }

  if (activeTab.value === 'expense' && !form.category) {
    message.value = '지출 카테고리를 선택해 주세요.'
    return
  }

  const category =
    activeTab.value === 'income' ? form.from || '용돈' : form.category || '기타'
  const description =
    activeTab.value === 'income'
      ? `${form.from || '보호자'}에게 받은 금액`
      : form.description || '메모 없음'

  try {
    await financeStore.addTransaction({
      type: activeTab.value,
      category,
      description,
      amount: Number(form.amount),
      date: form.date,
    })

    message.value =
      activeTab.value === 'income'
        ? '수입이 저장되었어요.'
        : '지출이 저장되었어요.'
    emit('saved')
    resetForm()
  } catch {
    message.value = '저장에 실패했어요. 연결 상태를 확인해 주세요.'
  }
}
</script>

<template>
  <aside class="section-card daily-input-panel">
    <h3>빠른 입력</h3>

    <TransactionTypeTabs :active-tab="activeTab" @change="changeTab" />

    <form class="stack-form daily-input-form" @submit.prevent="submitForm">
      <label class="input-field span-two">
        <span>날짜</span>
        <input v-model="form.date" type="date" />
      </label>

      <label class="input-field span-two">
        <span>금액</span>
        <input
          v-model="form.amount"
          type="number"
          min="0"
          placeholder="금액을 입력해 주세요"
          @input="sanitizeAmountInput"
        />
      </label>

      <div class="span-two">
        <QuickAmountButtons :amounts="quickAmounts" @select="appendAmount" />
      </div>

      <template v-if="activeTab === 'income'">
        <label class="input-field span-two">
          <span>누구에게 받았나요?</span>
          <input
            v-model="form.from"
            type="text"
            placeholder="예: 엄마, 아빠, 할머니"
          />
        </label>
      </template>

      <template v-else>
        <div class="span-two">
          <CategorySelector
            :categories="categories"
            :selected-category="form.category"
            @select="form.category = $event"
          />
        </div>

        <label class="input-field span-two">
          <span>메모</span>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="무엇을 샀는지 적어 주세요"
          ></textarea>
        </label>
      </template>

      <p v-if="message" class="success-message span-two">{{ message }}</p>
      <button type="submit" class="primary-button span-two">{{ submitLabel }}</button>
    </form>
  </aside>
</template>

