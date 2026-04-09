<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'
import { useThemeStore } from '@/store/theme'

const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()
const themeStore = useThemeStore()
const form = reactive({ name: '', email: '' })
const errorMessage = ref('')

async function submitForm() {
  if (!form.name.trim() || !form.email.trim()) {
    errorMessage.value = '이름과 이메일을 모두 입력해 주세요.'
    return
  }

  errorMessage.value = ''

  try {
    await authStore.login({ name: form.name.trim(), email: form.email.trim() })
    financeStore.initialized = false
    themeStore.initialized = false
    await financeStore.initialize()
    await themeStore.initialize()
    router.replace('/')
  } catch {
    errorMessage.value = authStore.error || '로그인에 실패했어요. json-server가 실행 중인지 확인해 주세요.'
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <div class="login-logo">차</div>
      <h1>차곡차곡</h1>
      <p>용돈을 차곡차곡 모으는 습관을 시작해요.</p>

      <form class="login-form" @submit.prevent="submitForm">
        <label>
          <span>이름</span>
          <input v-model="form.name" type="text" placeholder="이름을 입력해 주세요" />
        </label>

        <label>
          <span>이메일</span>
          <input v-model="form.email" type="email" placeholder="이메일을 입력해 주세요" />
        </label>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="primary-button">시작하기</button>
      </form>
    </div>
  </section>
</template>
