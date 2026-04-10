<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  maxValue: { type: Number, default: 0 },
})

function formatAmount(value) {
  if (value === 0) return '0원'
  if (value >= 10000) return `${(value / 10000).toFixed(1)}만원`
  return `${value.toLocaleString()}원`
}

function getBarHeight(value) {
  if (value <= 0 || props.maxValue === 0) return '4px'
  return `${Math.max((value / props.maxValue) * 100, 8)}%`
}
</script>

<template>
  <div class="section-card weekly-card">
    <div class="section-headline">
      <div class="headline-copy">
        <h2 class="card-title">주차별 지출</h2>
        <p class="card-description">주차별 지출 차이를 그래프로 비교해보세요.</p>
      </div>
      <span class="trend-label" v-if="maxValue > 0">최대 {{ formatAmount(maxValue) }}</span>
    </div>

    <div class="weekly-chart">
      <article
        v-for="item in items"
        :key="item.label"
        class="weekly-bar-card"
        :class="{
          'is-max': maxValue > 0 && item.value === maxValue,
          'is-zero': item.value === 0,
        }"
      >
        <span class="value-label">{{ formatAmount(item.value) }}</span>
        <div class="weekly-bar-track">
          <div class="weekly-bar-fill" :style="{ height: getBarHeight(item.value) }">
            <span v-if="maxValue > 0 && item.value === maxValue" class="max-badge">최고</span>
          </div>
        </div>
        <strong class="label">{{ item.label }}</strong>
      </article>
    </div>
  </div>
</template>

<style scoped>
.weekly-card {
  height: 100%;
  padding: 1.25rem;
  display: grid;
  grid-template-rows: auto 1fr;
}

.section-headline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.headline-copy {
  display: grid;
  gap: 0.3rem;
}

.card-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #31372b;
  line-height: 1.3;
  word-break: keep-all;
}

.card-description {
  font-size: 0.88rem;
  color: #7a806f;
  line-height: 1.45;
  word-break: keep-all;
}

.weekly-chart {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: flex-end;
  gap: 0.75rem;
  min-height: 240px;
  height: 100%;
}

.weekly-bar-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: stretch;
  gap: 0;
  min-width: 0;
  height: 100%;
}

.value-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #4d5641;
  line-height: 1.2;
  text-align: center;
  word-break: keep-all;
  padding-bottom: 0.7rem;
}

.weekly-bar-track {
  width: 100%;
  height: 100%;
  min-height: 0;
  background-color: #f4f5ef;
  border-radius: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.35rem;
  overflow: hidden;
}

.weekly-bar-fill {
  width: 100%;
  background: linear-gradient(
    180deg,
    var(--theme-primary) 0%,
    color-mix(in srgb, var(--theme-primary) 55%, var(--theme-accent)) 100%
  );
  border-radius: 14px;
  transition: height 0.45s ease;
  position: relative;
}

.is-max .weekly-bar-fill {
  background: linear-gradient(180deg, var(--theme-secondary) 0%, var(--theme-accent) 100%);
}

.is-zero .weekly-bar-fill {
  height: 10px !important;
  background: #e2e6da;
}

.label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #4f5843;
  word-break: keep-all;
  text-align: center;
  padding-top: 0.75rem;
}

.max-badge {
  position: absolute;
  top: 0.55rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.92);
  color: var(--theme-accent);
  border: 1px solid color-mix(in srgb, var(--theme-accent) 22%, white);
  box-shadow: 0 6px 14px rgba(76, 126, 53, 0.12);
  white-space: nowrap;
  line-height: 1;
  z-index: 1;
  padding: 0.3rem 0.45rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
}

.trend-label {
  font-size: 0.76rem;
  color: var(--theme-accent);
  font-weight: 600;
  background: color-mix(in srgb, var(--theme-secondary) 20%, white);
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  word-break: keep-all;
}

@media (min-width: 521px) {
  .weekly-card {
    padding: 1.5rem;
  }

  .section-headline {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .weekly-chart {
    gap: 1rem;
    min-height: 260px;
  }
}

@media (max-width: 430px) {
  .weekly-card {
    border-radius: 26px;
  }

  .weekly-chart {
    gap: 0.65rem;
    min-height: 224px;
  }

  .value-label {
    font-size: 0.75rem;
    padding-bottom: 0.55rem;
  }

  .label {
    font-size: 0.85rem;
    padding-top: 0.55rem;
  }
}

@media (max-width: 360px) {
  .weekly-chart {
    gap: 0.55rem;
  }

  .value-label {
    font-size: 0.72rem;
  }

  .weekly-bar-track {
    border-radius: 16px;
  }
}
</style>
