<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'
import { useThemeStore } from '@/store/theme'
import AppHeader from '@/components/common/AppHeader.vue'

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const themeStore = useThemeStore()
const { currentTheme } = storeToRefs(themeStore)

const appThemeStyle = computed(() => ({
  '--theme-primary': currentTheme.value.primary,
  '--theme-secondary': currentTheme.value.secondary,
  '--theme-accent': currentTheme.value.accent,
  '--theme-background': currentTheme.value.background,
  '--theme-primary-soft': `${currentTheme.value.primary}66`,
  '--theme-secondary-soft': `${currentTheme.value.secondary}55`,
}))

onMounted(async () => {
  themeStore.loadPersistedTheme()
  await authStore.initialize()
  await themeStore.initialize()

  if (authStore.userId) {
    await financeStore.initialize()
  }
})
</script>

<template>
  <div class="app-theme-root" :style="appThemeStyle">
    <AppHeader />
    <RouterView />
  </div>
</template>
