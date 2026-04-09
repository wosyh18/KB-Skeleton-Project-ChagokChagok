<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'

const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()
const { user } = storeToRefs(authStore)
const { monthlyGoal, currentMonthTotalExpense, remainingAllowance, totalIncome } = storeToRefs(financeStore)
const currentDate = ref(new Date(2026, 3, 1))
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
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function openDaily(day) {
  router.push(`/daily/${formatDate(day)}`)
}

function expenseFor(day) {
  return financeStore.getExpenseByDate(formatDate(day))
}
</script>

<template>
  <section class="content-page home-page">
    <div class="hero-card">
      <div class="hero-header">
        <button type="button" class="icon-button" @click="previousMonth">&lt;</button>
        <h1>{{ monthName }}</h1>
        <button type="button" class="icon-button" @click="nextMonth">&gt;</button>
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

    <div class="calendar-card">
      <div class="calendar-weekdays">
        <span v-for="label in weekdayLabels" :key="label">{{ label }}</span>
      </div>

      <div class="calendar-grid">
        <span v-for="blank in firstDay" :key="`blank-${blank}`" class="calendar-blank"></span>
        <button
          v-for="day in daysInMonth"
          :key="day"
          type="button"
          class="calendar-day"
          :class="{ marked: expenseFor(day) > 0, today: formatDate(day) === '2026-04-08' }"
          @click="openDaily(day)"
        >
          <span>{{ day }}</span>
          <small v-if="expenseFor(day) > 0">-{{ Math.round(expenseFor(day) / 1000) }}k</small>
        </button>
      </div>
    </div>

    <div class="floating-tip">
      <div class="floating-icon">기록</div>
      <div>
        <strong>{{ user?.name || '친구' }}님, 오늘도 기록해 볼까요?</strong>
        <p>날짜를 눌러 하루 지출을 확인하거나 입력 화면에서 바로 추가할 수 있어요.</p>
      </div>
    </div>
  </section>
</template>
