<script setup>
defineProps({
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  label: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  secondary: { type: Boolean, default: false },
})
</script>

<template>
  <div class="floating-tip" :class="{ secondary }">
    <div v-if="image || icon" class="floating-icon">
      <img v-if="image" :src="image" alt="icon" class="icon-img" />
      <template v-else>{{ icon }}</template>
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
  overflow: hidden;
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
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
</style>
