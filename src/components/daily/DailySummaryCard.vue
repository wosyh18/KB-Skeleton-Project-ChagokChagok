<script setup>
defineProps({
  title: { type: String, required: true },
  todayIncome: { type: Number, required: true },
  todayExpense: { type: Number, required: true },
  remaining: { type: Number, required: true },
})
</script>

<template>
  <div class="section-card">
    <h1>{{ title }}</h1>
    <div class="summary-grid compact">
      <article>
        <span>오늘 수입</span>
        <strong>+{{ todayIncome.toLocaleString() }}원</strong>
      </article>
      <article>
        <span>오늘 지출</span>
        <strong>-{{ todayExpense.toLocaleString() }}원</strong>
      </article>
      <article>
        <span>하루 잔액</span>
        <strong>{{ remaining.toLocaleString() }}원</strong>
      </article>
    </div>
  </div>
</template>
