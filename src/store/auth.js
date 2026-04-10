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
    userId: (state) => {
      if (state.user?.id == null) return null
      return Number(state.user.id)
    },
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
    async login({ email, password }) {
      this.isLoading = true
      this.error = ''

      try {
        const { data: users } = await api.get('/users', { params: { email } })

        if (users.length === 0) {
          this.error = '등록된 이메일이 아니에요.'
          throw new Error(this.error)
        }

        const matchedUser = users.find((user) => user.password === password)
        if (!matchedUser) {
          this.error = '비밀번호가 올바르지 않아요.'
          throw new Error(this.error)
        }

        this.user = matchedUser
        setSessionUserId(this.user.id)
      } catch (error) {
        if (!this.error) {
          this.error = '로그인 처리 중 오류가 발생했어요.'
        }
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
