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
const daysInMonth = computed(() => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate())
const firstDay = computed(() => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay())

const filterCategories = computed(() => ['전체', ...categories.value.map(c => c.name)])

const filteredTransactions = computed(() => {
  const monthTransactions = transactions.value.filter(t => t.date.startsWith(calendarMonth.value))
  if (selectedCategory.value === '전체') return monthTransactions
  return monthTransactions.filter(t => t.category === selectedCategory.value)
})

function formatDate(day) {
  const year = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-${String(day).padStart(2, '0')}`
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  financeStore.setCalendarMonth(formatMonth(currentDate.value))
  financeStore.setSelectedMonth(formatMonth(currentDate.value))
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  financeStore.setCalendarMonth(formatMonth(currentDate.value))
  financeStore.setSelectedMonth(formatMonth(currentDate.value))
}

function formatMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function openDaily(day) {
  router.push(`/daily/${formatDate(day)}`)
}

function expenseFor(day) {
  return financeStore.getExpenseByDate(formatDate(day))
}

onMounted(() => {
  financeStore.setCalendarMonth(formatMonth(currentDate.value))
  financeStore.setSelectedMonth(formatMonth(currentDate.value))
})
</script>

<template>
  <section class="content-page home-page">
    <div class="main-layout">
      <div class="calendar-section">
        <MainSummaryCard
          :month-name="monthName"
          :monthly-goal="monthlyGoal"
          :total-income="currentMonthTotalIncome"
          :current-month-total-expense="currentMonthTotalExpense"
          :remaining-allowance="remainingAllowance"
          @previous="previousMonth"
          @next="nextMonth"
        />

        <MonthlyCalendar
          :weekday-labels="weekdayLabels"
          :first-day="firstDay"
          :days-in-month="daysInMonth"
          :expense-for="expenseFor"
          :format-date="formatDate"
          @select-day="openDaily"
        />
      </div>

      <div class="sidebar-section desktop-only">
        <div class="section-card filter-card">
          <div class="section-headline">
            <h2>필터링</h2>
          </div>
          <div class="quick-grid categories">
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

        <div class="scrollable-list">
          <TransactionList
            :transactions="filteredTransactions"
            :show-actions="false"
          />
        </div>
      </div>
    </div>

    <InfoTipCard
      :image="iconPaper"
      :title="`${user?.name || '친구'}님, 오늘도 기록해 볼까요?`"
      description="날짜를 눌러 하루 지출을 확인하거나 입력 화면에서 바로 추가할 수 있어요."
    />
  </section>
</template>

<style scoped>
.main-layout {
  display: grid;
  gap: 1rem;
}

.calendar-section {
  display: grid;
  gap: 1rem;
}

.sidebar-section {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.filter-card {
  padding: 1rem;
}

.scrollable-list {
  overflow-y: auto;
}

/* Custom scrollbar for better look */
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
    align-items: stretch;
  }

  .calendar-section {
    position: sticky;
    top: 60px; /* Adjust based on header height */
  }

  .sidebar-section {
    display: flex;
    flex-direction: column;
  }

  .scrollable-list {
    flex: 1;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 28px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .desktop-only {
    display: flex;
  }
}
</style>
