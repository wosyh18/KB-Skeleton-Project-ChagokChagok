import { defineStore } from 'pinia'

import { defaultThemes } from './data'
import { useFinanceStore } from './finance'
import { STORAGE_KEYS, loadJson, saveJson } from './storage'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    initialized: false,
    selectedThemeId: 'default',
  }),
  getters: {
    themes: () => defaultThemes,
    currentTheme(state) {
      return defaultThemes.find((theme) => theme.id === state.selectedThemeId) || defaultThemes[0]
    },
  },
  actions: {
    initialize() {
      if (this.initialized) return

      const saved = loadJson(STORAGE_KEYS.theme, null)
      this.selectedThemeId = saved?.selectedThemeId ?? 'default'
      this.initialized = true
      this.persist()
    },
    persist() {
      saveJson(STORAGE_KEYS.theme, { selectedThemeId: this.selectedThemeId })
    },
    selectTheme(themeId) {
      const theme = defaultThemes.find((item) => item.id === themeId)
      if (!theme) {
        return { ok: false, message: '존재하지 않는 테마입니다.' }
      }

      const financeStore = useFinanceStore()

      if (theme.cost > financeStore.points && this.selectedThemeId !== themeId) {
        return { ok: false, message: `포인트가 ${theme.cost - financeStore.points}P 부족해요.` }
      }

      if (theme.cost > 0 && this.selectedThemeId !== themeId) {
        financeStore.spendPoints(theme.cost)
      }

      this.selectedThemeId = themeId
      this.persist()
      return { ok: true }
    },
  },
})
