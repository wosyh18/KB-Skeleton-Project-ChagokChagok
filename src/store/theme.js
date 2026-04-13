import { defineStore } from 'pinia'

import { api } from '@/api/client'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'

const THEME_STORAGE_KEY = 'selectedThemeId'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    initialized: false,
    selectedThemeId: 'default',
    themes: [],
    unlockedThemeIds: [],
    isLoading: false,
    error: '',
  }),
  getters: {
    currentTheme(state) {
      return state.themes.find((theme) => theme.id === state.selectedThemeId) || {
        id: 'default',
        name: '기본 테마',
        primary: '#FFE66D',
        secondary: '#B4E88E',
        accent: '#6B8E23',
        background: '#FFFEF0',
        cost: 0,
      }
    },
    normalizedThemes(state) {
      return state.themes.map((theme) => ({
        ...theme,
        cost: theme.requiredPoints ?? 0,
        unlocked: theme.requiredPoints === 0 || state.unlockedThemeIds.includes(theme.id),
      }))
    },
  },
  actions: {
    loadPersistedTheme() {
      const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY)
      if (savedThemeId) {
        this.selectedThemeId = savedThemeId
      }
    },
    persistTheme(themeId) {
      localStorage.setItem(THEME_STORAGE_KEY, themeId)
    },
    resetState() {
      this.initialized=false
      this.selectedThemeId = localStorage.getItem(THEME_STORAGE_KEY) || 'default'
      this.themes = []
      this.unlockedThemeIds =[]
      this.isLoading = false
      this.error = ''
    },
    async initialize() {
      if (this.initialized) return
      this.loadPersistedTheme()
      
      const authStore = useAuthStore();
      if (!authStore.initialized) {
        await authStore.initialize();
      }

      if (!authStore.userId) {
        this.resetState();
        return;
      }

      await this.refreshAll()
      this.initialized = true
    },
    async refreshAll() {
      const authStore = useAuthStore()
      if (!authStore.userId) return

      this.isLoading = true
      this.error = ''

      try {
        const [themesResponse, userResponse, unlockedResponse] = await Promise.all([
          api.get('/themes'),
          api.get(`/users/${authStore.userId}`),
          api.get('/unlockedThemes'),
        ])

        this.themes = themesResponse.data
        this.selectedThemeId = userResponse.data.currentTheme || 'default'
        this.persistTheme(this.selectedThemeId)
        this.unlockedThemeIds = unlockedResponse.data
          .filter((item) => String(item.userId) === String(authStore.userId))
          .map((item) => item.themeId)
      } catch (error) {
        this.error = '테마 정보를 불러오지 못했어요.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async selectTheme(themeId) {
      const authStore = useAuthStore()
      const financeStore = useFinanceStore()
      const theme = this.normalizedThemes.find((item) => item.id === themeId)

      if (!theme) {
        return { ok: false, message: '존재하지 않는 테마입니다.' }
      }

      const isUnlocked = this.unlockedThemeIds.includes(themeId)
      if (!isUnlocked && theme.cost > financeStore.points) {
        return { ok: false, message: `포인트가 ${theme.cost - financeStore.points}P 부족해요.` }
      }

      if (!isUnlocked && theme.cost > 0) {
        const spent = await financeStore.spendPoints(theme.cost)
        if (!spent) {
          return { ok: false, message: '포인트 사용에 실패했어요.' }
        }

        const { data } = await api.post('/unlockedThemes', {
          userId: Number(authStore.userId),
          themeId,
        })
        this.unlockedThemeIds.push(data.themeId)
      }

      this.selectedThemeId = themeId
      this.persistTheme(themeId)
      await authStore.updateUser({ currentTheme: themeId })
      return { ok: true }
    },
  },
})
