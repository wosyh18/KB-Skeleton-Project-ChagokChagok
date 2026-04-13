<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import InfoTipCard from '@/components/common/InfoTipCard.vue'
import MainSummaryCard from '@/components/main/MainSummaryCard.vue'
import MonthlyCalendar from '@/components/main/MonthlyCalendar.vue'
import TransactionList from '@/components/daily/TransactionList.vue'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'
import iconPaper from '@/assets/icons/icon-paper.png'

const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()
const { user } = storeToRefs(authStore)
const {
  monthlyGoal,
  currentMonthTotalIncome,
  currentMonthTotalExpense,
  remainingAllowance,
  transactions,
  categories,
  calendarMonth,
} = storeToRefs(financeStore)

const currentDate = ref(new Date())
const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']
const selectedCategory = ref('전체')

const monthName = computed(() => `${currentDate.value.getMonth() + 1}월`)
const daysInMonth = computed(
  () => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate(),
)
const firstDay = computed(
  () => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay(),
)

const filterCategories = computed(() => {
  const categoryNames = categories.value.map((category) => category.name)
  return [...categoryNames].sort((left, right) => {
    if (left === '기타') return 1
    if (right === '기타') return -1
    return 0
  })
})

const filteredTransactions = computed(() => {
  const monthTransactions = transactions.value.filter((item) =>
    item.date.startsWith(calendarMonth.value),
  )

  if (selectedCategory.value === '전체') {
    return monthTransactions
  }

  return monthTransactions.filter((item) => item.category === selectedCategory.value)
})

function formatDate(day) {
  const year = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-${String(day).padStart(2, '0')}`
}

function formatMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function previousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  )
  const month = formatMonth(currentDate.value)
  financeStore.setCalendarMonth(month)
  financeStore.setSelectedMonth(month)
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  )
  const month = formatMonth(currentDate.value)
  financeStore.setCalendarMonth(month)
  financeStore.setSelectedMonth(month)
}

function openDaily(day) {
  router.push(`/daily/${formatDate(day)}`)
}

function expenseFor(day) {
  return financeStore.getExpenseByDate(formatDate(day))
}

onMounted(() => {
  const month = formatMonth(currentDate.value)
  financeStore.setCalendarMonth(month)
  financeStore.setSelectedMonth(month)
})
</script>

<template>
  <section class="content-page home-page">
    <div class="main-layout">
      <MainSummaryCard
        class="summary-panel"
        :month-name="monthName"
        :monthly-goal="monthlyGoal"
        :total-income="currentMonthTotalIncome"
        :current-month-total-expense="currentMonthTotalExpense"
        :remaining-allowance="remainingAllowance"
        @previous="previousMonth"
        @next="nextMonth"
      />

      <MonthlyCalendar
        class="calendar-panel"
        :weekday-labels="weekdayLabels"
        :first-day="firstDay"
        :days-in-month="daysInMonth"
        :expense-for="expenseFor"
        :format-date="formatDate"
        @select-day="openDaily"
      />

      <div class="desktop-only filter-panel">
        <div class="section-card filter-card">
          <div class="section-headline">
            <h2>카테고리 필터</h2>
          </div>

          <div class="filter-top-row">
            <button
              type="button"
              class="chip-button"
              :class="{ selected: selectedCategory === '전체' }"
              @click="selectedCategory = '전체'"
            >
              전체
            </button>
          </div>

          <div class="filter-category-grid">
            <button
              v-for="cat in filterCategories"
              :key="cat"
              type="button"
              class="chip-button"
              :class="{ selected: selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <div class="scrollable-list transaction-panel desktop-only">
        <TransactionList :transactions="filteredTransactions" :show-actions="false" />
      </div>
    </div>

    <InfoTipCard
      :image="iconPaper"
      :title="`${user?.name || '친구'}의 이번 달 소비를 살펴볼까요?`"
      description="날짜를 눌러 하루 지출을 확인하거나 입력 페이지에서 바로 거래를 추가할 수 있어요."
    />
  </section>
</template>

<style scoped>
.main-layout {
  display: grid;
  gap: 1rem;
}

.filter-card {
  padding: 1rem;
}

.filter-top-row {
  margin-bottom: 0.75rem;
  display: flex;
}

.filter-top-row .chip-button {
  width: calc((100% - 1rem) / 3);
}

.filter-category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.scrollable-list {
  overflow-y: auto;
}

.summary-panel,
.filter-panel,
.filter-card {
  height: 100%;
}

.scrollable-list::-webkit-scrollbar {
  width: 6px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: transparent;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: #d7dec7;
  border-radius: 10px;
}

.desktop-only {
  display: none;
}

@media (min-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr 400px;
    grid-template-areas:
      'summary filter'
      'calendar transactions';
    align-items: stretch;
  }

  .scrollable-list {
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 28px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .summary-panel {
    grid-area: summary;
  }

  .calendar-panel {
    grid-area: calendar;
  }

  .filter-panel {
    grid-area: filter;
    display: block;
  }

  .filter-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .transaction-panel {
    grid-area: transactions;
    min-height: 0;
    max-height: 620px;
  }

  .desktop-only {
    display: block;
  }
}
</style>
