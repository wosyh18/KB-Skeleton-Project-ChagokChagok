import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/components/AppLayout.vue'
import DailyPage from '@/pages/DailyPage.vue'
import EconomyPage from '@/pages/EconomyPage.vue'
import InputPage from '@/pages/InputPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import MyPage from '@/pages/MyPage.vue'
import StatsPage from '@/pages/StatsPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Main', component: MainPage },
      { path: 'daily/:date', name: 'Daily', component: DailyPage },
      { path: 'input', name: 'Input', component: InputPage },
      { path: 'stats', name: 'Stats', component: StatsPage },
      { path: 'economy', name: 'Economy', component: EconomyPage },
      { path: 'mypage', name: 'MyPage', component: MyPage },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const hasUser = Boolean(localStorage.getItem('userId'))

  if (to.meta.requiresAuth && !hasUser) {
    return { name: 'Login' }
  }

  if (to.meta.guestOnly && hasUser) {
    return { name: 'Main' }
  }

  return true
})

export default router
