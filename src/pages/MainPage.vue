<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import InfoTipCard from '@/components/common/InfoTipCard.vue'
import MainSummaryCard from '@/components/main/MainSummaryCard.vue'
import MonthlyCalendar from '@/components/main/MonthlyCalendar.vue'
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
} = storeToRefs(financeStore)
const currentDate = ref(new Date())
const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

const monthName = computed(() => `${currentDate.value.getMonth() + 1}월`)
const daysInMonth = computed(() => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate())
const firstDay = computed(() => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay())

function formatDate(day) {
  const year = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-${String(day).padStart(2, '0')}`
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  financeStore.setCalendarMonth(formatMonth(currentDate.value))
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  financeStore.setCalendarMonth(formatMonth(currentDate.value))
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
})
</script>

<template>
  <section class="content-page home-page">
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

    <InfoTipCard
      :image="iconPaper"
      :title="`${user?.name || '친구'}님, 오늘도 기록해 볼까요?`"
      description="날짜를 눌러 하루 지출을 확인하거나 입력 화면에서 바로 추가할 수 있어요."
    />
  </section>
</template>
