<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
})

const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0))

const slices = computed(() => {
  let cumulativePercentage = 0
  return props.items.map((item) => {
    const percentage = (item.value / (total.value || 1)) * 100
    const offset = 100 - cumulativePercentage + 25 // +25 to start from top
    cumulativePercentage += percentage
    return {
      ...item,
      percentage,
      offset: offset % 100,
    }
  })
})

const topCategoryName = computed(() => props.items[0]?.name || '없음')
const topCategoryRatio = computed(() => {
  if (!props.items.length || total.value === 0) return 0
  return Math.round((props.items[0].value / total.value) * 100)
})
</script>

<template>
  <div class="section-card category-card">
    <div class="section-headline">
      <div class="headline-copy">
        <h2 class="card-title">카테고리별 지출</h2>
        <p class="card-description">이번 달 지출 구성을 카테고리별로 나눠서 보여줘요.</p>
      </div>
      <span class="top-badge" v-if="items.length > 0">최다: {{ topCategoryName }} {{ topCategoryRatio }}%</span>
    </div>

    <div class="stats-viz-container">
      <div class="chart-box">
        <svg viewBox="0 0 42 42" class="donut-chart">
          <circle cx="21" cy="21" r="15.915494309189533" fill="transparent" stroke="#eef1e8" stroke-width="4"></circle>
          <circle
            v-for="slice in slices"
            :key="slice.name"
            cx="21" cy="21" r="15.915494309189533"
            fill="transparent"
            :stroke="slice.color"
            stroke-width="4"
            :stroke-dasharray="`${slice.percentage} ${100 - slice.percentage}`"
            :stroke-dashoffset="slice.offset"
            class="donut-segment"
          ></circle>
          <g class="chart-text">
            <text x="50%" y="50%" class="chart-number">{{ total.toLocaleString() }}원</text>
            <text x="50%" y="63%" class="chart-label">이번 달 총 지출</text>
          </g>
        </svg>
      </div>

      <div class="category-legend">
        <article
          v-for="(item, index) in items"
          :key="item.name"
          class="legend-row"
          :class="{ 'top-row': index === 0 }"
        >
          <div class="legend-meta">
            <span class="category-dot" :style="{ backgroundColor: item.color }"></span>
            <strong class="category-name">{{ item.name }}</strong>
          </div>
          <div class="legend-values">
            <span class="percentage">{{ Math.round((item.value / (total || 1)) * 100) }}%</span>
            <span class="amount">{{ item.value.toLocaleString() }}원</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-card {
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
  width: 100%;
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

.stats-viz-container {
  display: grid;
  align-items: center;
  justify-items: center;
  gap: 1.25rem;
  align-content: start;
}

.chart-box {
  width: min(100%, 240px);
  aspect-ratio: 1;
  flex-shrink: 0;
  margin: 0 auto;
}

.donut-chart {
  width: 100%;
  height: 100%;
}

.chart-number {
  font-size: 0.34em;
  font-weight: 800;
  text-anchor: middle;
  fill: #1f241b;
  dominant-baseline: middle;
}

.chart-label {
  font-size: 0.115em;
  fill: #7b826f;
  text-anchor: middle;
  font-weight: 500;
}

.category-legend {
  width: 100%;
  display: grid;
  gap: 0.55rem;
}

.legend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
  border-radius: 18px;
  background: #fafbf7;
  border: 1px solid #edf0e6;
}

.top-row {
  background: rgba(255, 230, 109, 0.16);
  border-color: rgba(248, 203, 46, 0.28);
}

.legend-meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  flex-shrink: 0;
}

.category-name {
  font-size: 0.98rem;
  color: #39402f;
  line-height: 1.3;
  word-break: keep-all;
  white-space: nowrap;
}

.legend-values {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;
}

.percentage {
  font-size: 0.85rem;
  color: #7a816f;
  font-weight: 600;
}

.amount {
  font-size: 1rem;
  font-weight: 700;
  color: #2e3428;
  letter-spacing: -0.02em;
  word-break: keep-all;
}

.top-badge {
  display: inline-flex;
  align-items: center;
  background: #f3f4ee;
  padding: 0.35rem 0.7rem;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 600;
  color: #667055;
  word-break: keep-all;
  white-space: nowrap;
}

@media (min-width: 521px) {
  .category-card {
    padding: 1.5rem;
  }

  .section-headline {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

@media (min-width: 900px) {
  .category-card {
    min-height: 100%;
  }
}

@media (max-width: 430px) {
  .category-card {
    border-radius: 26px;
  }

  .chart-box {
    width: min(100%, 220px);
  }

  .legend-row {
    padding: 0.8rem 0.85rem;
  }

  .legend-values {
    gap: 0.55rem;
  }
}
</style>
