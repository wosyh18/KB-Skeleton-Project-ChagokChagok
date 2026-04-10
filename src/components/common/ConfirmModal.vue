<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmText: { type: String, default: '확인' },
  cancelText: { type: String, default: '취소' },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card small">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button type="button" class="ghost-button" @click="emit('close')">{{ cancelText }}</button>
        <button type="button" class="danger-button" @click="emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-card h3 {
  color: var(--theme-accent);
}

.modal-card p {
  color: color-mix(in srgb, var(--theme-accent) 70%, #5b6650);
}
</style>
