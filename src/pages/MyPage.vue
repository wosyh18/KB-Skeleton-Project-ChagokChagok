<script setup>
import { computed, onMounted, ref } from 'vue'
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
const { points, topCategory } = storeToRefs(financeStore)
const { currentTheme, selectedThemeId, normalizedThemes } = storeToRefs(themeStore)
const showThemeDialog = ref(false)
const feedback = ref('')
const goalInput = computed({
  get: () => {
    const amount = financeStore.monthlyGoal || 0
    return amount.toLocaleString()
  },
  set: (value) => {
    const normalized = value.replace(/,/g, '')
    if (normalized === '' || /^\d+$/.test(normalized)) {
      financeStore.updateMonthlyGoal(Number(normalized || 0))
    }
  },
})

onMounted(async () => {
  if (!themeStore.initialized) {
    await themeStore.initialize()
  }
  if (!financeStore.initialized) {
    await financeStore.initialize()
  }
})

async function chooseTheme(themeId) {
  const result = await themeStore.selectTheme(themeId)
  feedback.value = result.ok ? '테마가 적용되었어요.' : result.message
  if (result.ok) {
    showThemeDialog.value = false
  }
}

function logout() {
  financeStore.resetState()
  themeStore.resetState()
  authStore.logout()
  router.replace('/login')
}
</script>

<template>
  <section class="content-page my-page" :style="{ backgroundColor: currentTheme.background }">
    <ProfileHeader :points="points" :current-theme="currentTheme" @open-theme="showThemeDialog = true" />

    <GoalBadge 
      :current-theme="currentTheme" 
      :goal-input="goalInput" 
      :top-category="topCategory"
      @update:goal-input="goalInput = $event" 
    />
    
    <div class="character-description-card" v-if="topCategory" :style="{ borderColor: currentTheme.primary }">
      <span class="category-tag" :style="{ backgroundColor: currentTheme.primary, color: currentTheme.accent }">
        {{ topCategory.name }} 대장
      </span>
      <h3 class="character-title">{{ topCategory.characterName }}</h3>
      <p class="character-text">{{ topCategory.description }}</p>
    </div>

    <UserInfoCard :user="user" :feedback="feedback" @logout="logout" />

    <ThemeSelectionModal
      :open="showThemeDialog"
      :themes="normalizedThemes"
      :selected-theme-id="selectedThemeId"
      @close="showThemeDialog = false"
      @select="chooseTheme"
    />
  </section>
</template>

<style scoped>
.character-description-card {
  background: #fff;
  border-radius: 24px;
  border: 2px solid;
  padding: 24px;
  margin: 0 20px 24px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.character-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #333;
}

.character-text {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
  word-break: keep-all;
}
</style>
