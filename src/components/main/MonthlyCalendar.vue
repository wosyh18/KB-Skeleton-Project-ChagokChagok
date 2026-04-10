<script setup>
defineProps({
  weekdayLabels: { type: Array, required: true },
  firstDay: { type: Number, required: true },
  daysInMonth: { type: Number, required: true },
  expenseFor: { type: Function, required: true },
  formatDate: { type: Function, required: true },
})

const emit = defineEmits(['select-day'])

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<template>
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
        :class="{ marked: expenseFor(day) > 0, today: formatDate(day) === getTodayDate() }"
        @click="emit('select-day', day)"
      >
        <span>{{ day }}</span>
        <small v-if="expenseFor(day) > 0">-{{ expenseFor(day).toLocaleString() }}</small>
      </button>
    </div>
  </div>
</template>
