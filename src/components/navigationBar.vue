<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const items = [
  { path: '/', label: '메인', icon: '홈' },
  { path: '/input', label: '입력', icon: '입' },
  { path: '/stats', label: '통계', icon: '통' },
  { path: '/economy', label: '경제', icon: '경' },
  { path: '/mypage', label: '마이', icon: '마' },
]

const currentPath = computed(() => route.path)

function isActive(path) {
  return currentPath.value === path
}

function go(path) {
  router.push(path)
}
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="item in items"
      :key="item.path"
      type="button"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      @click="go(item.path)"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </nav>
</template>
