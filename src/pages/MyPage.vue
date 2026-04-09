<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import GoalBadge from '@/components/my/GoalBadge.vue'
import ProfileHeader from '@/components/my/ProfileHeader.vue'
import ThemeSelectionModal from '@/components/my/ThemeSelectionModal.vue'
import UserInfoCard from '@/components/my/UserInfoCard.vue'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'
import { useThemeStore } from '@/store/theme'

const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()
const themeStore = useThemeStore()
const { user } = storeToRefs(authStore)
const { points } = storeToRefs(financeStore)
const { currentTheme, selectedThemeId } = storeToRefs(themeStore)
const themes = computed(() => themeStore.themes)
const showThemeDialog = ref(false)
const feedback = ref('')
const goalInput = computed({
  get: () => String(financeStore.monthlyGoal || ''),
  set: (value) => {
    const normalized = value.replace(/,/g, '')
    if (normalized === '' || /^\d+$/.test(normalized)) {
      financeStore.updateMonthlyGoal(Number(normalized || 0))
    }
  },
})

function chooseTheme(themeId) {
  const result = themeStore.selectTheme(themeId)
  feedback.value = result.ok ? '테마가 적용되었어요.' : result.message
  if (result.ok) {
    showThemeDialog.value = false
  }
}

function logout() {
  authStore.logout()
  router.replace('/login')
}
</script>

<template>
  <section class="content-page my-page" :style="{ backgroundColor: currentTheme.background }">
    <ProfileHeader :points="points" :current-theme="currentTheme" @open-theme="showThemeDialog = true" />

    <GoalBadge :current-theme="currentTheme" :goal-input="goalInput" @update:goal-input="goalInput = $event" />

    <UserInfoCard :user="user" :feedback="feedback" @logout="logout" />

    <ThemeSelectionModal
      :open="showThemeDialog"
      :themes="themes"
      :selected-theme-id="selectedThemeId"
      @close="showThemeDialog = false"
      @select="chooseTheme"
    />
  </section>
</template>
