<script setup>
defineProps({
  icon: { type: String, default: '안내' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  secondary: { type: Boolean, default: false },
})
</script>

<template>
  <div class="floating-tip" :class="{ secondary }">
    <div class="floating-icon">{{ icon }}</div>
    <div>
      <strong>{{ title }}</strong>
      <p>{{ description }}</p>
    </div>
  </div>
</template>
