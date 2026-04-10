import { defineStore } from 'pinia'

import { api } from '@/api/client'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    initialized: false,
    lessons: {
      title: '',
      description: [],
      quiz: {
        question: '',
        answer: true,
        correct: '',
        incorrect: '',
      },
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
  },
})
