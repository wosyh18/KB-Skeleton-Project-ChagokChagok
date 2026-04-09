import { defineStore } from 'pinia'

import { seedTransactions } from './data'
import { STORAGE_KEYS, loadJson, saveJson } from './storage'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    initialized: false,
    monthlyGoal: 150000,
    points: 500,
    transactions: [],
    selectedMonth: '2026-04',
  }),
  getters: {
    currentMonthTotalExpense(state) {
      return state.transactions
        .filter((item) => item.type === 'expense' && item.date.startsWith(state.selectedMonth))
        .reduce((sum, item) => sum + item.amount, 0)
    },
    totalIncome(state) {
      return state.transactions
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0)
    },
    remainingAllowance() {
      return this.monthlyGoal + this.totalIncome - this.currentMonthTotalExpense
    },
  },
  actions: {
    setSelectedMonth(month) {
      this.selectedMonth = month
    },
    initialize() {
      if (this.initialized) return

      const saved = loadJson(STORAGE_KEYS.finance, null)
      this.monthlyGoal = saved?.monthlyGoal ?? 150000
      this.points = saved?.points ?? 500
      this.transactions = Array.isArray(saved?.transactions) && saved.transactions.length
        ? saved.transactions
        : [...seedTransactions]

      this.initialized = true
      this.persist()
    },
    persist() {
      saveJson(STORAGE_KEYS.finance, {
        monthlyGoal: this.monthlyGoal,
        points: this.points,
        transactions: this.transactions,
      })
    },
    getTransactionsByDate(date) {
      return [...this.transactions]
        .filter((item) => item.date === date)
        .sort((a, b) => a.time.localeCompare(b.time))
    },
    getExpenseByDate(date) {
      return this.getTransactionsByDate(date)
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0)
    },
    addTransaction(payload) {
      this.transactions.push({ id: Date.now(), ...payload })
      this.points += payload.type === 'expense' ? 10 : 5
      this.persist()
    },
    updateTransaction(id, payload) {
      const index = this.transactions.findIndex((item) => item.id === id)
      if (index === -1) return
      this.transactions[index] = { ...this.transactions[index], ...payload }
      this.persist()
    },
    deleteTransaction(id) {
      this.transactions = this.transactions.filter((item) => item.id !== id)
      this.persist()
    },
    updateMonthlyGoal(value) {
      this.monthlyGoal = value
      this.persist()
    },
    spendPoints(amount) {
      if (amount > this.points) {
        return false
      }

      this.points -= amount
      this.persist()
      return true
    },
  },
})
