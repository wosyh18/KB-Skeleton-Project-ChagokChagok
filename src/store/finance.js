import { defineStore } from 'pinia';

import { seedTransactions } from './data';
import { STORAGE_KEYS, loadJson, saveJson } from './storage';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    initialized: false,
    isLoading: false,
    error: null,
    monthlyGoal: 150000,
    points: 500,
    transactions: [],
  }),
  getters: {
    currentMonthTotalExpense(state) {
      return state.transactions
        .filter(
          (item) => item.type === 'expense' && item.date.startsWith('2026-04'),
        )
        .reduce((sum, item) => sum + item.amount, 0);
    },
    totalIncome(state) {
      return state.transactions
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
    },
    remainingAllowance() {
      return (
        this.monthlyGoal + this.totalIncome - this.currentMonthTotalExpense
      );
    },
  },
  actions: {
    initialize() {
      if (this.initialized) return;

      const saved = loadJson(STORAGE_KEYS.finance, null);
      this.monthlyGoal = saved?.monthlyGoal ?? 150000;
      this.points = saved?.points ?? 500;
      this.transactions =
        Array.isArray(saved?.transactions) && saved.transactions.length
          ? saved.transactions
          : [...seedTransactions];

      this.initialized = true;
      this.persist();
    },
    persist() {
      saveJson(STORAGE_KEYS.finance, {
        monthlyGoal: this.monthlyGoal,
        points: this.points,
        transactions: this.transactions,
      });
    },
    // [이슈 #7] 서버에서 데이터 가져오는 API 함수 추가
    async fetchTransactions() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch('http://localhost:3000/transactions');
        if (!response.ok) throw new Error('서버 통신 에러');

        const data = await response.json();
        this.transactions = Array.isArray(data)
          ? [...data].sort((a, b) => {
              if (a.date === b.date) {
                return a.time.localeCompare(b.time);
              }

              return a.date.localeCompare(b.date);
            })
          : [];
        this.persist();
        return this.transactions;
      } catch (error) {
        this.error = error.message;
        console.error('거래 내역 데이터를 불러오는데 실패했습니다:', error);
        return this.transactions;
      } finally {
        this.isLoading = false;
      }
    },
    getTransactionsByDate(date) {
      return [...this.transactions]
        .filter((item) => item.date === date)
        .sort((a, b) => a.time.localeCompare(b.time));
    },
    getExpenseByDate(date) {
      return this.getTransactionsByDate(date)
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
    },
    addTransaction(payload) {
      this.transactions.push({ id: Date.now(), ...payload });
      this.points += payload.type === 'expense' ? 10 : 5;
      this.persist();
    },
    updateTransaction(id, payload) {
      const index = this.transactions.findIndex((item) => item.id === id);
      if (index === -1) return;
      this.transactions[index] = { ...this.transactions[index], ...payload };
      this.persist();
    },
    deleteTransaction(id) {
      this.transactions = this.transactions.filter((item) => item.id !== id);
      this.persist();
    },
    updateMonthlyGoal(value) {
      this.monthlyGoal = value;
      this.persist();
    },
    spendPoints(amount) {
      if (amount > this.points) {
        return false;
      }

      this.points -= amount;
      this.persist();
      return true;
    },
  },
});
