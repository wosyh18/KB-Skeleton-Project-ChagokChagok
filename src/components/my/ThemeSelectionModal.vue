<script setup>
defineProps({
  open: { type: Boolean, default: false },
  themes: { type: Array, required: true },
  selectedThemeId: { type: String, required: true },
})

const emit = defineEmits(['close', 'select'])
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card large">
      <div class="section-headline">
        <h3>테마 선택</h3>
        <span>포인트로 잠금 해제</span>
      </div>
      <div class="theme-grid">
        <button
          v-for="theme in themes"
          :key="theme.id"
          type="button"
          class="theme-card"
          :class="{ selected: selectedThemeId === theme.id }"
          :style="{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }"
          @click="emit('select', theme.id)"
        >
          <strong>{{ theme.name }}</strong>
          <span>
            {{
              theme.cost === 0
                ? '무료'
                : theme.unlocked
                  ? '잠금해제'
                  : `${theme.cost}P`
            }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
