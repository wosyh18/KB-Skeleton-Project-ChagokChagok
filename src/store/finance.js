import { defineStore } from 'pinia'

import { api } from '@/api/client'
import { useAuthStore } from '@/store/auth'

function getCurrentMonth() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
}

function getMonthEndDate(month) {
  const [year, monthNumber] = month.split('-').map(Number)
  const lastDay = new Date(year, monthNumber, 0).getDate()
  return `${year}-${String(monthNumber).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
}

function resolveTopCategory(transactions, categories, month) {
  if (!transactions.length || !categories.length) return null

  let targetTransactions = transactions.filter(
    (item) => item.type === 'expense' && item.date.startsWith(month),
  )

  if (!targetTransactions.length) {
    targetTransactions = transactions.filter((item) => item.type === 'expense')
  }

  if (!targetTransactions.length) return null

  const summary = {}
  targetTransactions.forEach((item) => {
    summary[item.category] = (summary[item.category] || 0) + item.amount
  })

  const sorted = Object.entries(summary).sort((a, b) => b[1] - a[1])
  const topName = sorted[0][0]

  return categories.find((category) => category.name === topName) || null
}

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    initialized: false,
    isLoading: false,
    error: '',
    monthlyGoal: 0,
    points: 0,
    transactions: [],
    categories: [],
    calendarMonth: getCurrentMonth(),
    selectedMonth: getCurrentMonth(),
  }),
  getters: {
    currentMonthTotalExpense(state) {
      return state.transactions
        .filter(
          (item) =>
            item.type === 'expense' &&
            item.date.startsWith(state.selectedMonth),
        )
        .reduce((sum, item) => sum + item.amount, 0)
    },
    totalIncome(state) {
      return state.transactions
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0)
    },
    cumulativeIncomeUntilSelectedMonth(state) {
      const monthEndDate = getMonthEndDate(state.calendarMonth)
      return state.transactions
        .filter((item) => item.type === 'income' && item.date <= monthEndDate)
        .reduce((sum, item) => sum + item.amount, 0)
    },
    cumulativeExpenseUntilSelectedMonth(state) {
      const monthEndDate = getMonthEndDate(state.calendarMonth)
      return state.transactions
        .filter((item) => item.type === 'expense' && item.date <= monthEndDate)
        .reduce((sum, item) => sum + item.amount, 0)
    },
    remainingAllowance() {
      return (
        this.cumulativeIncomeUntilSelectedMonth -
        this.cumulativeExpenseUntilSelectedMonth
      )
    },
    topCategory(state) {
      return resolveTopCategory(state.transactions, state.categories, state.calendarMonth)
    },
  },
  actions: {
    resetState() {
      this.initialized = false
      this.isLoading = false
      this.error = ''
      this.monthlyGoal = 0
      this.points = 0
      this.transactions = []
      this.categories = []
      this.calendarMonth = getCurrentMonth()
      this.selectedMonth = getCurrentMonth()
    },
    setCalendarMonth(month) {
      this.calendarMonth = month
    },
    setSelectedMonth(month) {
      this.selectedMonth = month
    },
    async initialize() {
      if (this.initialized) return

      const authStore = useAuthStore()
      if (!authStore.initialized) {
        await authStore.initialize()
      }

      if (!authStore.userId) {
        this.resetState()
        this.initialized = true
        return
      }

      await Promise.all([this.refreshAll(), this.fetchCategories()])
      this.initialized = true
    },
    async fetchCategories() {
      try {
        const { data } = await api.get('/categories')
        this.categories = data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },
    async refreshAll() {
      const authStore = useAuthStore()
      if (!authStore.userId) return

      this.isLoading = true
      this.error = ''

      try {
        const [userResponse, transactionResponse] = await Promise.all([
          api.get(`/users/${authStore.userId}`),
          api.get('/transactions'),
        ])

        this.monthlyGoal = userResponse.data.monthlyGoal ?? 0
        this.points = userResponse.data.points ?? 0
        this.transactions = transactionResponse.data.filter(
          (item) => String(item.userId) === String(authStore.userId),
        )
      } catch (error) {
        this.error = '가계부 데이터를 불러오지 못했어요.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async fetchTransactions() {
      await this.refreshAll()
      return this.transactions
    },
    getTransactionsByDate(date) {
      return [...this.transactions].filter((item) => item.date === date)
    },
    getExpenseByDate(date) {
      return this.getTransactionsByDate(date)
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0)
    },
    getTransactionsUntilDate(date) {
      return [...this.transactions].filter((item) => item.date <= date)
    },
    getIncomeUntilDate(date) {
      return this.getTransactionsUntilDate(date)
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0)
    },
    getExpenseUntilDate(date) {
      return this.getTransactionsUntilDate(date)
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0)
    },
    getRemainingByDate(date) {
      return this.getIncomeUntilDate(date) - this.getExpenseUntilDate(date)
    },
    async addTransaction(payload) {
      const authStore = useAuthStore()
      if (!authStore.userId) return null

      const transactionPayload = {
        userId: Number(authStore.userId),
        ...payload,
      }

      const { data } = await api.post('/transactions', transactionPayload)
      this.transactions.push(data)

      const nextPoints = this.points + (payload.type === 'expense' ? 10 : 5)
      this.points = nextPoints
      await authStore.updateUser({ points: nextPoints })

      return data
    },
    async updateTransaction(id, payload) {
      const { data } = await api.patch(`/transactions/${id}`, payload)
      const index = this.transactions.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.transactions[index] = data
      }
      return data
    },
    async deleteTransaction(id) {
      await api.delete(`/transactions/${id}`)
      this.transactions = this.transactions.filter((item) => item.id !== id)
    },
    async updateMonthlyGoal(value) {
      const authStore = useAuthStore()
      this.monthlyGoal = value
      await authStore.updateUser({ monthlyGoal: value })
    },
    async spendPoints(amount) {
      const authStore = useAuthStore()
      if (amount > this.points) {
        return false
      }

      const nextPoints = this.points - amount
      this.points = nextPoints
      await authStore.updateUser({ points: nextPoints })
      return true
    },
  },
})
