import { defineStore } from 'pinia'

import { api } from '@/api/client'
import { useAuthStore } from '@/store/auth'
import { useFinanceStore } from '@/store/finance'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    initialized: false,
    lessons: {
      id: '',
      title: '',
      description: [],
      quiz: {
        question: '',
        answer: true,
        correct: '',
        incorrect: '',
      },
      rewardPoints: 0,
      completedUserIds: [],
    },
    isLoading: false,
    error: '',
  }),
  actions: {
    async initialize() {
      if (this.initialized) return

      await this.fetchDailyLesson()
      this.initialized = true
    },

    async fetchDailyLesson() {
      if (this.isLoading) return
      if (this.lessons.title) return this.lessons

      this.isLoading = true
      this.error = ''

      try {
        const { data } = await api.get('/economicStories')
        if (data.length > 0) {
          this.lessons = data[0]
        }
        return this.lessons
      } catch (error) {
        this.error = '학습 데이터를 불러오지 못했어요.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async rewardForCorrectAnswer() {
      const authStore = useAuthStore()
      const financeStore = useFinanceStore()

      if (!authStore.userId || !this.lessons.id) {
        return { ok: false, message: '보상 정보를 확인할 수 없어요.' }
      }

      const completedUserIds = this.lessons.completedUserIds || []
      const alreadyRewarded = completedUserIds.some(
        (id) => String(id) === String(authStore.userId),
      )

      if (alreadyRewarded) {
        return {
          ok: false,
          alreadyRewarded: true,
          message: '이미 이 퀴즈 보상을 받았어요.',
        }
      }

      const rewardPoints = Number(this.lessons.rewardPoints || 0)
      const nextCompletedUserIds = [...completedUserIds, authStore.userId]

      await api.patch(`/economicStories/${this.lessons.id}`, {
        completedUserIds: nextCompletedUserIds,
      })

      const nextPoints = Number(authStore.user?.points || 0) + rewardPoints
      await authStore.updateUser({ points: nextPoints })

      financeStore.points = nextPoints
      this.lessons.completedUserIds = nextCompletedUserIds

      return {
        ok: true,
        rewardPoints,
        message: `${rewardPoints}포인트를 받았어요!`,
      }
    },
  },
})
