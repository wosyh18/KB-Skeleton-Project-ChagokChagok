<script setup>
defineProps({
  monthName: { type: String, required: true },
  monthlyGoal: { type: Number, required: true },
  totalIncome: { type: Number, required: true },
  currentMonthTotalExpense: { type: Number, required: true },
  remainingAllowance: { type: Number, required: true },
})

const emit = defineEmits(['previous', 'next'])
</script>

<template>
  <div class="hero-card">
    <div class="hero-header">
      <button type="button" class="icon-button" @click="emit('previous')">&lt;</button>
      <h1>{{ monthName }}</h1>
      <button type="button" class="icon-button" @click="emit('next')">&gt;</button>
    </div>

    <div class="summary-grid">
      <article>
        <span>이번 달 목표</span>
        <strong>{{ monthlyGoal.toLocaleString() }}원</strong>
      </article>
      <article>
        <span>받은 금액</span>
        <strong>{{ totalIncome.toLocaleString() }}원</strong>
      </article>
      <article>
        <span>총 지출</span>
        <strong>{{ currentMonthTotalExpense.toLocaleString() }}원</strong>
      </article>
      <article>
        <span>남은 금액</span>
        <strong>{{ remainingAllowance.toLocaleString() }}원</strong>
      </article>
    </div>
  </div>
</template>
