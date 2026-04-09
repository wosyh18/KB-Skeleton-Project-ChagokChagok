import { defineStore } from 'pinia'

import { STORAGE_KEYS, loadJson, saveJson } from './storage'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    initialized: false,
    user: null,
  }),
  actions: {
    initialize() {
      if (this.initialized) return

      const saved = loadJson(STORAGE_KEYS.auth, null)
      this.user = saved?.user ?? null

      if (!this.user && localStorage.getItem('userId')) {
        this.user = {
          id: localStorage.getItem('userId'),
          name: localStorage.getItem('userName') || '차곡이',
          email: localStorage.getItem('userEmail') || 'chagok@example.com',
          age: 14,
        }
      }

      this.initialized = true
      this.persist()
    },
    persist() {
      saveJson(STORAGE_KEYS.auth, { user: this.user })
    },
    login({ name, email }) {
      this.user = {
        id: `user-${Date.now()}`,
        name,
        email,
        age: 14,
      }

      localStorage.setItem('userId', this.user.id)
      localStorage.setItem('userName', this.user.name)
      localStorage.setItem('userEmail', this.user.email)
      this.persist()
    },
    logout() {
      this.user = null
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      this.persist()
    },
  },
})
