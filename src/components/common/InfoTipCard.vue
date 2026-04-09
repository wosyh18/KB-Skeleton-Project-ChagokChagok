<script setup>
defineProps({
  icon: { type: String, default: '' },
  label: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  secondary: { type: Boolean, default: false },
})
</script>

<template>
  <div class="floating-tip" :class="{ secondary }">
    <div v-if="icon" class="floating-icon">{{ icon }}</div>
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
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
}

.secondary {
  background: linear-gradient(135deg, #fdfbf0, #f7f9e8);
  border-color: #f1f4e0;
}

.floating-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: #f8f9fa;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
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
  color: #333;
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
