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
const { isLoading, points, topCategory, hasCalendarMonthExpense } = storeToRefs(financeStore)
const { currentTheme, selectedThemeId, normalizedThemes } = storeToRefs(themeStore)
const showThemeDialog = ref(false)
const showAllowanceDialog = ref(false)
const feedback = ref('')
const showNoData = computed(
  () => financeStore.initialized && !isLoading.value && !hasCalendarMonthExpense.value,
)
const coinDrops = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${6 + (index % 7) * 13}%`,
  delay: `${(index % 5) * 0.18}s`,
  duration: `${2 + (index % 4) * 0.24}s`,
  size: `${34 + (index % 3) * 8}px`,
  rotation: `${-18 + (index % 6) * 9}deg`,
}))
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

function openAllowanceDialog() {
  showAllowanceDialog.value = true
}

function closeAllowanceDialog() {
  showAllowanceDialog.value = false
}
</script>

<template>
  <section class="content-page my-page" :style="{ backgroundColor: currentTheme.background }">
    <ProfileHeader :points="points" :current-theme="currentTheme" @open-theme="showThemeDialog = true" />

    <GoalBadge 
      :current-theme="currentTheme" 
      :goal-input="goalInput" 
      :top-category="topCategory"
      :show-no-data="showNoData"
      @update:goal-input="goalInput = $event" 
    />
    
    <div class="character-description-card" v-if="topCategory || showNoData" :style="{ borderColor: currentTheme.primary }">
      <template v-if="showNoData">
        <span class="category-tag" :style="{ backgroundColor: currentTheme.primary, color: currentTheme.accent }">
          기록 없음
        </span>
        <h3 class="character-title">아직 소비 기록이 없어요</h3>
        <p class="character-text">내역이 없습니다.</p>
      </template>
      <template v-else>
        <span class="category-tag" :style="{ backgroundColor: currentTheme.primary, color: currentTheme.accent }">
          {{ topCategory.name }} 대장
        </span>
        <h3 class="character-title">{{ topCategory.characterName }}</h3>
        <p class="character-text">{{ topCategory.description }}</p>
      </template>
    </div>

    <div class="allowance-action">
      <button
        type="button"
        class="allowance-button"
        :style="{ backgroundColor: currentTheme.primary, color: currentTheme.accent }"
        @click="openAllowanceDialog"
      >
        용돈 조르기
      </button>
    </div>

    <UserInfoCard :user="user" :feedback="feedback" @logout="logout" />

    <ThemeSelectionModal
      :open="showThemeDialog"
      :themes="normalizedThemes"
      :selected-theme-id="selectedThemeId"
      @close="showThemeDialog = false"
      @select="chooseTheme"
    />

    <div v-if="showAllowanceDialog" class="allowance-modal-overlay" @click.self="closeAllowanceDialog">
      <div class="allowance-modal-card" :style="{ borderColor: currentTheme.primary }">
        <button
          type="button"
          class="allowance-close"
          :style="{ color: currentTheme.accent }"
          @click="closeAllowanceDialog"
        >
          닫기
        </button>
        <div class="allowance-coin-stage" aria-hidden="true">
          <img
            v-for="coin in coinDrops"
            :key="coin.id"
            src="/images/coin.png"
            alt=""
            class="falling-coin"
            :style="{
              left: coin.left,
              animationDelay: coin.delay,
              animationDuration: coin.duration,
              width: coin.size,
              '--coin-rotation': coin.rotation,
            }"
          />
        </div>
        <div class="allowance-message-wrap">
          <div class="allowance-message-card">
            <span
              class="allowance-badge"
              :style="{ backgroundColor: currentTheme.primary, color: currentTheme.accent }"
            >
              미션 성공
            </span>
            <h3 class="allowance-title">부모님께 용돈 조르기 성공!!</h3>
            <p class="allowance-text">동전이 우수수 떨어지는 오늘의 행운을 받아가세요.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.character-description-card {
  background: color-mix(in srgb, var(--theme-background) 55%, white);
  border-radius: 24px;
  border: 2px solid;
  padding: 24px;
  margin: 0 20px 24px;
  text-align: center;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--theme-accent) 10%, transparent);
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
  color: var(--theme-accent);
}

.character-text {
  font-size: 0.95rem;
  color: color-mix(in srgb, var(--theme-accent) 60%, #666);
  margin: 0;
  line-height: 1.6;
  word-break: keep-all;
}

.allowance-action {
  display: flex;
  justify-content: center;
  margin: 0 20px 24px;
}

.allowance-button {
  border: none;
  border-radius: 999px;
  padding: 14px 28px;
  font-size: 0.98rem;
  font-weight: 800;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--theme-primary) 38%, transparent);
}

.allowance-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(18, 17, 9, 0.34);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.allowance-modal-card {
  position: relative;
  width: min(100%, 360px);
  min-height: 420px;
  overflow: hidden;
  border-radius: 28px;
  border: 3px solid;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--theme-primary) 30%, white) 0%, transparent 48%),
    linear-gradient(180deg, color-mix(in srgb, var(--theme-background) 72%, white) 0%, #fffdf3 100%);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
}

.allowance-close {
  position: absolute;
  top: 16px;
  right: 18px;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 700;
  z-index: 4;
}

.allowance-coin-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 3;
  pointer-events: none;
}

.falling-coin {
  position: absolute;
  top: -56px;
  opacity: 0;
  filter: drop-shadow(0 10px 14px rgba(181, 138, 0, 0.18));
  animation-name: coin-fall;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}

.allowance-message-wrap {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.allowance-message-card {
  width: min(100%, 264px);
  text-align: center;
  padding: 28px 22px;
  border-radius: 24px;
  background: color-mix(in srgb, white 88%, var(--theme-background));
  box-shadow:
    0 18px 34px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  border: 1px solid color-mix(in srgb, var(--theme-primary) 36%, white);
}

.allowance-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 800;
}

.allowance-title {
  margin: 16px 0 10px;
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1.35;
  color: var(--theme-accent);
  word-break: keep-all;
}

.allowance-text {
  margin: 0;
  font-size: 0.96rem;
  line-height: 1.6;
  color: color-mix(in srgb, var(--theme-accent) 62%, #6e6a5d);
  word-break: keep-all;
}

@keyframes coin-fall {
  0% {
    transform: translate3d(0, -24px, 0) rotate(var(--coin-rotation, -12deg)) scale(0.92);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  78% {
    opacity: 1;
  }
  100% {
    transform: translate3d(18px, 290px, 0) rotate(calc(var(--coin-rotation, -12deg) + 280deg)) scale(1.02);
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .allowance-modal-card {
    min-height: 390px;
  }

  .allowance-message-card {
    width: min(100%, 240px);
    padding: 24px 18px;
  }

  .allowance-title {
    font-size: 1.35rem;
  }
}
</style>
