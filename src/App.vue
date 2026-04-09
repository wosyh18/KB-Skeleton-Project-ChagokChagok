<script setup>
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'
import { useThemeStore } from '@/store/theme'

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const themeStore = useThemeStore()

authStore.initialize()
financeStore.initialize()
themeStore.initialize()
</script>

<template>
  <RouterView />
</template>
