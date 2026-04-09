<script setup>
defineProps({
  activeTab: { type: String, required: true },
})

const emit = defineEmits(['change'])
</script>

<template>
  <div class="tab-switch">
    <button type="button" :class="{ active: activeTab === 'income' }" @click="emit('change', 'income')">수입</button>
    <button type="button" :class="{ active: activeTab === 'expense' }" @click="emit('change', 'expense')">지출</button>
  </div>
</template>
