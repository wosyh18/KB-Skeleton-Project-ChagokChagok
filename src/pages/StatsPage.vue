<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import InfoTipCard from '@/components/common/InfoTipCard.vue'
import CategorySpendingList from '@/components/stats/CategorySpendingList.vue'
import WeeklySpendingChart from '@/components/stats/WeeklySpendingChart.vue'
import { useFinanceStore } from '@/store/finance'

const financeStore = useFinanceStore()
const { transactions, currentMonthTotalExpense } = storeToRefs(financeStore)

const categoryData = computed(() => {
  const summary = {}
  transactions.value
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      summary[item.category] = (summary[item.category] || 0) + item.amount
    })

  return Object.entries(summary)
    .map(([name, value], index) => ({
      name,
      value,
      color: ['#ff6b6b', '#4ecdc4', '#95e1d3', '#ffe66d', '#7fb069', '#f4a261'][index % 6],
    }))
    .sort((a, b) => b.value - a.value)
})

const weeklyData = computed(() => {
  const weeks = [
    { label: '1주차', start: 1, end: 7 },
    { label: '2주차', start: 8, end: 14 },
    { label: '3주차', start: 15, end: 21 },
    { label: '4주차', start: 22, end: 31 },
  ]

  return weeks.map((week) => ({
    label: week.label,
    value: transactions.value
      .filter((item) => item.type === 'expense')
      .filter((item) => {
        const day = Number(item.date.split('-')[2])
        return day >= week.start && day <= week.end
      })
      .reduce((sum, item) => sum + item.amount, 0),
  }))
})

const maxWeeklyValue = computed(() => Math.max(...weeklyData.value.map((item) => item.value), 1))

function weeklyHeight(value) {
  return `${Math.max((value / maxWeeklyValue.value) * 100, 8)}%`
}
</script>

<template>
  <section class="content-page stats-page">
    <div class="section-card accent-card">
      <span>4월 총 지출</span>
      <h1>{{ currentMonthTotalExpense.toLocaleString() }}원</h1>
      <p>기록된 지출을 기준으로 가장 많이 쓴 영역을 한눈에 볼 수 있어요.</p>
    </div>

    <CategorySpendingList :items="categoryData" />
    <WeeklySpendingChart :items="weeklyData" :weekly-height="weeklyHeight" />

    <InfoTipCard
      icon="요약"
      title="문화와 식비 지출이 크다면 예산을 따로 잡아보세요."
      description="자주 쓰는 카테고리 한두 개만 먼저 관리해도 소비 습관이 훨씬 선명해집니다."
      secondary
    />
  </section>
</template>
