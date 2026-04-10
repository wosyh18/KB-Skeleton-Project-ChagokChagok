<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import InfoTipCard from '@/components/common/InfoTipCard.vue'
import CategorySpendingList from '@/components/stats/CategorySpendingList.vue'
import WeeklySpendingChart from '@/components/stats/WeeklySpendingChart.vue'
import { useFinanceStore } from '@/store/finance'
import { useThemeStore } from '@/store/theme'

const financeStore = useFinanceStore()
const themeStore = useThemeStore()
const { transactions, currentMonthTotalExpense, selectedMonth } = storeToRefs(financeStore)
const { currentTheme } = storeToRefs(themeStore)

const displayMonthFull = computed(() => {
  if (!selectedMonth.value) return ''
  const [year, month] = selectedMonth.value.split('-')
  return `${year}년 ${Number(month)}월`
})

const displayMonthShort = computed(() => {
  if (!selectedMonth.value) return ''
  const [_, month] = selectedMonth.value.split('-')
  return `${Number(month)}월`
})

const filteredTransactions = computed(() => {
  if (!selectedMonth.value) return []
  return transactions.value.filter((t) => t.date.startsWith(selectedMonth.value))
})

const categoryData = computed(() => {
  const palette = [
    currentTheme.value.primary,
    currentTheme.value.secondary,
    currentTheme.value.accent,
    '#ffb86b',
    '#8ecae6',
    '#cdb4db',
  ]
  const summary = {}
  filteredTransactions.value
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      summary[item.category] = (summary[item.category] || 0) + item.amount
    })

  return Object.entries(summary)
    .map(([name, value], index) => ({
      name,
      value,
      color: palette[index % palette.length],
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
    value: filteredTransactions.value
      .filter((item) => item.type === 'expense')
      .filter((item) => {
        const day = Number(item.date.split('-')[2])
        return day >= week.start && day <= week.end
      })
      .reduce((sum, item) => sum + item.amount, 0),
  }))
})

const maxWeeklyValue = computed(() => Math.max(...weeklyData.value.map((item) => item.value), 0))

function changeMonth(delta) {
  if (!selectedMonth.value) return
  const [year, month] = selectedMonth.value.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  
  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  
  financeStore.setSelectedMonth(`${nextYear}-${nextMonth}`)
}

const topCategoryName = computed(() => categoryData.value[0]?.name || '없음')
const tipTitle = computed(() => `${topCategoryName.value} 지출 비중이 가장 높아요`)
</script>

<template>
  <section class="content-page stats-page">
    <div class="section-card summary-card">
      <div class="summary-card-top">
        <div class="summary-copy">
          <span class="summary-eyebrow">월별 지출 요약</span>
          <p class="summary-caption">이번 달 소비 흐름을 한눈에 확인해보세요.</p>
        </div>
        <nav class="month-navigation" aria-label="월 이동">
          <button class="nav-btn" @click="changeMonth(-1)" aria-label="이전 달">←</button>
          <h2 class="current-month-display">{{ displayMonthFull }}</h2>
          <button class="nav-btn" @click="changeMonth(1)" aria-label="다음 달">→</button>
        </nav>
      </div>

      <div class="total-expense-box">
        <span class="label">{{ displayMonthShort }} 총 지출</span>
        <h1 class="total-amount">{{ currentMonthTotalExpense.toLocaleString() }}원</h1>
        <p class="description">지출 데이터를 기반으로 분석한 결과입니다.</p>
      </div>
    </div>

    <div class="stats-insight-grid">
      <CategorySpendingList :items="categoryData" />
      <WeeklySpendingChart :items="weeklyData" :max-value="maxWeeklyValue" />
    </div>

    <InfoTipCard
      icon="💡"
      label="소비 요약"
      :title="tipTitle"
      description="자주 쓰는 항목부터 예산을 정해보면 소비 습관을 더 선명하게 관리할 수 있어요."
      secondary
    />
  </section>
</template>

<style scoped>
.stats-page {
  width: min(100%, 780px);
  gap: 1rem;
  padding: 1rem;
  margin: 0 auto;
}

.stats-insight-grid {
  display: grid;
  gap: 1rem;
}

.summary-card {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--theme-primary) 18%, white) 0%,
    color-mix(in srgb, var(--theme-secondary) 20%, white) 100%
  );
  border: 1px solid color-mix(in srgb, var(--theme-secondary) 22%, white);
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
  text-align: left;
}

.summary-card-top {
  display: grid;
  gap: 0.9rem;
}

.summary-copy {
  display: grid;
  gap: 0.2rem;
}

.summary-eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--theme-accent);
  letter-spacing: 0.04em;
}

.summary-caption {
  font-size: 0.92rem;
  color: color-mix(in srgb, var(--theme-accent) 65%, #65714f);
  line-height: 1.45;
  word-break: keep-all;
}

.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0;
}

.current-month-display {
  flex: 1;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--theme-accent);
  margin: 0;
  text-align: center;
  word-break: keep-all;
}

.nav-btn {
  background: color-mix(in srgb, var(--theme-background) 55%, white);
  border: 1px solid color-mix(in srgb, var(--theme-primary) 20%, white);
  border-radius: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  color: var(--theme-accent);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--theme-accent) 12%, transparent);
  flex-shrink: 0;
}

.total-expense-box {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  background: color-mix(in srgb, var(--theme-background) 35%, white);
  border: 1px solid color-mix(in srgb, var(--theme-primary) 18%, white);
}

.total-expense-box .label {
  font-size: 0.9rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--theme-accent) 65%, #7c8460);
  word-break: keep-all;
}

.total-amount {
  font-size: clamp(2rem, 8vw, 2.8rem);
  font-weight: 800;
  color: var(--theme-accent);
  margin: 0;
  line-height: 1.12;
  letter-spacing: -0.04em;
  word-break: keep-all;
}

.total-expense-box .description {
  font-size: 0.88rem;
  color: color-mix(in srgb, var(--theme-accent) 55%, #7d836f);
  line-height: 1.45;
  word-break: keep-all;
}

@media (min-width: 521px) {
  .stats-page {
    width: min(100%, 820px);
    gap: 1.25rem;
    padding: 1.25rem;
  }

  .stats-insight-grid {
    gap: 1.25rem;
  }

  .summary-card {
    padding: 1.5rem;
  }

  .summary-card-top {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  .month-navigation {
    min-width: 220px;
  }
}

@media (min-width: 900px) {
  .stats-page {
    width: min(100%, 1120px);
  }

  .stats-insight-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
}

@media (max-width: 430px) {
  .stats-page {
    gap: 0.95rem;
    padding: 0.95rem;
  }

  .summary-card {
    border-radius: 26px;
  }

  .total-expense-box {
    padding: 0.95rem 1rem;
  }
}
</style>
