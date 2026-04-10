<script setup>
defineProps({
  icon: { type: String, default: '' },
  iconSrc: { type: String, default: '' },
  label: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  secondary: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <div class="floating-tip" :class="{ secondary, compact }">
    <div v-if="iconSrc || icon" class="floating-icon">
      <img v-if="iconSrc" :src="iconSrc" alt="팁 아이콘" class="floating-icon-image" />
      <span v-else>{{ icon }}</span>
    </div>
    <div class="tip-content">
      <span v-if="label" class="tip-label">{{ label }}</span>
      <h3 class="tip-title">{{ title }}</h3>
      <p class="tip-description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.floating-tip {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem;
  border-radius: 24px;
  background: color-mix(in srgb, var(--theme-background) 55%, white);
  border: 1px solid color-mix(in srgb, var(--theme-secondary) 20%, white);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
}

.secondary {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--theme-primary) 18%, white),
    color-mix(in srgb, var(--theme-secondary) 22%, white)
  );
  border-color: color-mix(in srgb, var(--theme-secondary) 26%, white);
}

.floating-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--theme-primary) 18%, white);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.floating-icon-image {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tip-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--theme-accent);
  margin: 0;
  line-height: 1.3;
}

.tip-description {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.floating-tip.compact {
  gap: 0.7rem;
  padding: 0.72rem 0.82rem;
  border-radius: 18px;
}

.floating-tip.compact .floating-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.floating-tip.compact .floating-icon-image {
  width: 18px;
  height: 18px;
}

.floating-tip.compact .tip-title {
  font-size: 0.92rem;
  line-height: 1.2;
}

.floating-tip.compact .tip-description {
  font-size: 0.76rem;
  line-height: 1.25;
}
</style>
