<script setup>
defineProps({
  amounts: { type: Array, required: true },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="quick-grid">
    <button v-for="amount in amounts" :key="amount" type="button" class="chip-button" @click="emit('select', amount)">
      {{ amount.toLocaleString() }}원
    </button>
  </div>
</template>
