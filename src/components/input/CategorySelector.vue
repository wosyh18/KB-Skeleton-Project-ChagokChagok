<script setup>
defineProps({
  categories: { type: Array, required: true },
  selectedCategory: { type: String, default: '' },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div>
    <span class="field-label">카테고리</span>
    <div class="quick-grid categories">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        class="chip-button"
        :class="{ selected: selectedCategory === category }"
        @click="emit('select', category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>
