<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
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
    <div class="profile-top">
      <div class="point-pill" :style="{ backgroundColor: currentTheme.primary, color: currentTheme.accent }">
        <span>포인트</span>
        <strong>{{ points }}P</strong>
      </div>
      <button type="button" class="chip-button" :style="{ backgroundColor: currentTheme.secondary, color: currentTheme.accent }" @click="showThemeDialog = true">
        테마 변경
      </button>
    </div>

    <div class="profile-character">
      <div class="character-orb" :style="{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }">내</div>
      <div class="speech-badge" :style="{ borderColor: currentTheme.accent }">
        <span>이번 달 목표</span>
        <input v-model="goalInput" type="text" inputmode="numeric" />
        <strong>원</strong>
      </div>
    </div>

    <div class="section-card">
      <h2>내 정보</h2>
      <div class="info-list">
        <div><span>이름</span><strong>{{ user?.name }}</strong></div>
        <div><span>나이</span><strong>{{ user?.age }}세</strong></div>
        <div><span>이메일</span><strong>{{ user?.email }}</strong></div>
      </div>
      <p v-if="feedback" class="success-message">{{ feedback }}</p>
      <button type="button" class="ghost-button full-width" @click="logout">로그아웃</button>
    </div>

    <div v-if="showThemeDialog" class="modal-overlay" @click.self="showThemeDialog = false">
      <div class="modal-card large">
        <div class="section-headline">
          <h3>테마 선택</h3>
          <span>포인트로 잠금 해제</span>
        </div>
        <div class="theme-grid">
          <button
            v-for="theme in themes"
            :key="theme.id"
            type="button"
            class="theme-card"
            :class="{ selected: selectedThemeId === theme.id }"
            :style="{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }"
            @click="chooseTheme(theme.id)"
          >
            <strong>{{ theme.name }}</strong>
            <span>{{ theme.cost === 0 ? '무료' : `${theme.cost}P` }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
