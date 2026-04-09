<script setup>
defineProps({
  user: { type: Object, default: null },
  feedback: { type: String, default: '' },
})

const emit = defineEmits(['logout'])
</script>

<template>
  <div class="section-card">
    <h2>내 정보</h2>
    <div class="info-list">
      <div><span>이름</span><strong>{{ user?.name }}</strong></div>
      <div><span>나이</span><strong>{{ user?.age }}세</strong></div>
      <div><span>이메일</span><strong>{{ user?.email }}</strong></div>
    </div>
    <p v-if="feedback" class="success-message">{{ feedback }}</p>
    <button type="button" class="ghost-button full-width" @click="emit('logout')">로그아웃</button>
  </div>
</template>
