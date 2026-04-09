<script setup>
defineProps({
  points: { type: Number, required: true },
  currentTheme: { type: Object, required: true },
})

const emit = defineEmits(['open-theme'])
</script>

<template>
  <div class="profile-top">
    <div class="point-pill" :style="{ backgroundColor: currentTheme.primary, color: currentTheme.accent }">
      <span>포인트</span>
      <strong>{{ points }}P</strong>
    </div>
    <button
      type="button"
      class="chip-button"
      :style="{ backgroundColor: currentTheme.secondary, color: currentTheme.accent }"
      @click="emit('open-theme')"
    >
      테마 변경
    </button>
  </div>
</template>
