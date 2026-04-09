<script setup>
defineProps({
  items: { type: Array, required: true },
  weeklyHeight: { type: Function, required: true },
})
</script>

<template>
  <div class="section-card">
    <div class="section-headline">
      <h2>주차별 지출</h2>
      <span>4월 기준</span>
    </div>

    <div class="weekly-chart">
      <article v-for="item in items" :key="item.label" class="weekly-bar-card">
        <div class="weekly-bar-track">
          <div class="weekly-bar-fill" :style="{ height: weeklyHeight(item.value) }"></div>
        </div>
        <strong>{{ item.label }}</strong>
        <span>{{ item.value.toLocaleString() }}원</span>
      </article>
    </div>
  </div>
</template>
