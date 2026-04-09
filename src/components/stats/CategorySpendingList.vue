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
</script>

<template>
  <div class="section-card">
    <div class="section-headline">
      <h2>카테고리별 지출</h2>
      <span>{{ items.length }}개 카테고리</span>
    </div>

    <div class="stats-viz-container">
      <div class="chart-box">
        <svg viewBox="0 0 42 42" class="donut-chart">
          <circle cx="21" cy="21" r="15.915494309189533" fill="transparent" stroke="#f2f2f2" stroke-width="4"></circle>
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
            <text x="50%" y="45%" class="chart-number">{{ total.toLocaleString() }}원</text>

          </g>
        </svg>
      </div>

      <div class="category-legend">
        <article v-for="item in items" :key="item.name" class="legend-row">
          <div class="legend-meta">
            <span class="category-dot" :style="{ backgroundColor: item.color }"></span>
            <strong>{{ item.name }}</strong>
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
.stats-viz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 10px 0;
}

.chart-box {
  width: 200px;
  height: 200px;
}

.donut-chart {
  width: 100%;
  height: 100%;
}

.donut-segment {
  transition: stroke-dashoffset 0.3s ease;
  transform-origin: center;
}

.chart-text {
  fill: #333;
  transform: translateY(0.25em);
}

.chart-number {
  font-size: 0.35em;
  font-weight: 700;
  text-anchor: middle;
}

.chart-label {
  font-size: 0.15em;
  fill: #888;
  text-anchor: middle;
}

.category-legend {
  width: 100%;
}

.legend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.legend-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-values {
  display: flex;
  gap: 12px;
  align-items: center;
}

.percentage {
  font-size: 0.9em;
  color: #888;
  min-width: 40px;
  text-align: right;
}

.amount {
  font-weight: 500;
}
</style>
