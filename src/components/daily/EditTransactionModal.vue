<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  transaction: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])
const form = reactive({ category: '', description: '', amount: '', time: '' })

watch(
  () => props.transaction,
  (transaction) => {
    if (!transaction) return
    form.category = transaction.category
    form.description = transaction.description
    form.amount = String(transaction.amount)
    form.time = transaction.time
  },
  { immediate: true },
)

function submit() {
  emit('save', {
    category: form.category,
    description: form.description,
    amount: Number(form.amount) || 0,
    time: form.time,
  })
}
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
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
        <button type="button" class="ghost-button" @click="emit('close')">취소</button>
        <button type="button" class="primary-button" @click="submit">저장</button>
      </div>
    </div>
  </div>
</template>
