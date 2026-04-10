<script setup>
import { computed, reactive, watch } from 'vue'
import CategorySelector from '@/components/input/CategorySelector.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  transaction: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])
const form = reactive({ category: '', description: '', amount: '' })
const isIncomeTransaction = computed(() => props.transaction?.type === 'income')
const expenseCategories = ['식비', '교통', '문화', '취미', '교육', '기타']

watch(
  () => props.transaction,
  (transaction) => {
    if (!transaction) return
    form.category = transaction.category
    form.description = transaction.description
    form.amount = String(transaction.amount)
  },
  { immediate: true },
)

function submit() {
  emit('save', {
    category: form.category,
    description: form.description,
    amount: Number(form.amount) || 0,
  })
}
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <h3>거래 수정</h3>
      <template v-if="isIncomeTransaction">
        <label>
          <span>수입 출처</span>
          <input v-model="form.category" type="text" />
        </label>
      </template>
      <template v-else>
        <CategorySelector
          :categories="expenseCategories"
          :selected-category="form.category"
          @select="form.category = $event"
        />
      </template>
      <label>
        <span>내용</span>
        <input v-model="form.description" type="text" />
      </label>
      <label>
        <span>금액</span>
        <input v-model="form.amount" type="number" />
      </label>
      <div class="modal-actions">
        <button type="button" class="ghost-button" @click="emit('close')">취소</button>
        <button type="button" class="primary-button" @click="submit">저장</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-card h3,
.modal-card label span {
  color: var(--theme-accent);
}

.modal-card label {
  gap: 0.45rem;
}
</style>
