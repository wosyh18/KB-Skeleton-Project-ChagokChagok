<script setup>
defineProps({
  items: { type: Array, required: true },
  ratio: { type: Function, required: true },
})
</script>

<template>
  <div class="section-card">
    <div class="section-headline">
      <h2>카테고리별 지출</h2>
      <span>{{ items.length }}개 카테고리</span>
    </div>

    <div class="category-list">
      <article v-for="item in items" :key="item.name" class="category-row">
        <div class="category-meta">
          <span class="category-dot" :style="{ backgroundColor: item.color }"></span>
          <strong>{{ item.name }}</strong>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill" :style="{ width: ratio(item.value), backgroundColor: item.color }"></div>
        </div>
        <span>{{ item.value.toLocaleString() }}원</span>
      </article>
    </div>
  </div>
</template>
