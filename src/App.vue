<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'
import { useThemeStore } from '@/store/theme'
import AppHeader from '@/components/common/AppHeader.vue'

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const themeStore = useThemeStore()

onMounted(async () => {
  await authStore.initialize()

  if (authStore.userId) {
    await financeStore.initialize()
    await themeStore.initialize()
  }
})
</script>

<template>
  <AppHeader />
  <RouterView />
</template>
