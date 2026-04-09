import { defineStore } from 'pinia'

import { api, clearSessionUserId, getSessionUserId, setSessionUserId } from '@/api/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    initialized: false,
    user: null,
    isLoading: false,
    error: '',
  }),
  getters: {
    userId: (state) => state.user?.id ?? null,
    isLoggedIn: (state) => Boolean(state.user),
  },
  actions: {
    async initialize() {
      if (this.initialized) return

      this.isLoading = true
      this.error = ''

      try {
        const sessionUserId = getSessionUserId()
        if (sessionUserId) {
          const { data } = await api.get(`/users/${sessionUserId}`)
          this.user = data
        }
      } catch {
        this.user = null
        clearSessionUserId()
      } finally {
        this.initialized = true
        this.isLoading = false
      }
    },
    async login({ name, email }) {
      this.isLoading = true
      this.error = ''

      try {
        const { data: users } = await api.get('/users', { params: { email } })

        if (users.length > 0) {
          this.user = users[0]
        } else {
          const payload = {
            email,
            password: '',
            name,
            age: 14,
            monthlyGoal: 150000,
            points: 0,
            currentTheme: 'default',
          }
          const { data } = await api.post('/users', payload)
          this.user = data
        }

        setSessionUserId(this.user.id)
      } catch (error) {
        this.error = '로그인 처리 중 오류가 발생했어요.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.user = null
      clearSessionUserId()
    },
    async refreshUser() {
      if (!this.userId) return
      const { data } = await api.get(`/users/${this.userId}`)
      this.user = data
    },
    async updateUser(patch) {
      if (!this.userId) return null
      const { data } = await api.patch(`/users/${this.userId}`, patch)
      this.user = data
      return data
    },
  },
})
