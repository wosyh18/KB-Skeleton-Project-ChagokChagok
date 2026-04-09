<script setup>
defineProps({
  currentTheme: { type: Object, required: true },
  goalInput: { type: String, required: true },
})

const emit = defineEmits(['update:goalInput'])
</script>

<template>
  <div class="profile-character">
    <div class="character-orb" :style="{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }">내</div>
    <div class="speech-badge" :style="{ borderColor: currentTheme.accent }">
      <span>이번 달 목표</span>
      <input :value="goalInput" type="text" inputmode="numeric" @input="emit('update:goalInput', $event.target.value)" />
      <strong>원</strong>
    </div>
  </div>
</template>
