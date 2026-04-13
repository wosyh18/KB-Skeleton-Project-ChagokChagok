<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { useFinanceStore } from '@/store/finance';
import { useThemeStore } from '@/store/theme';

const router = useRouter();
const authStore = useAuthStore();
const financeStore = useFinanceStore();
const themeStore = useThemeStore();
const form = reactive({ email: '', password: '' });
const errorMessage = ref('');

async function submitForm() {
  if (!form.email.trim() || !form.password.trim()) {
    errorMessage.value = '이메일과 비밀번호를 모두 입력해 주세요.';
    return;
  }

  errorMessage.value = '';

  try {
    await authStore.login({
      email: form.email.trim(),
      password: form.password,
    });
    financeStore.initialized = false;
    themeStore.initialized = false;
    financeStore.resetState();
    themeStore.resetState();
    await financeStore.initialize();
    await themeStore.initialize();
    router.replace('/');
  } catch {
    errorMessage.value =
      authStore.error ||
      '로그인에 실패했어요. json-server가 실행 중인지 확인해 주세요.';
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <img
          src="/images/chagok_logo.png"
          alt="차곡차곡 로고"
          class="login-logo-image"
        />
      </div>
      <p>용돈을 차곡차곡 모으는 습관을 시작해요.</p>

      <form class="login-form" @submit.prevent="submitForm">
        <label>
          <span>이메일</span>
          <input
            v-model="form.email"
            type="email"
            placeholder="이메일을 입력해 주세요"
          />
        </label>

        <label>
          <span>비밀번호</span>
          <input
            v-model="form.password"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
          />
        </label>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="primary-button">로그인</button>
      </form>
    </div>
  </section>
</template>
