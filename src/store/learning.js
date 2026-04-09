import { defineStore } from 'pinia'

import { api } from '@/api/client'

export const useLearningStore = defineStore('learning', {
  state: () => ({
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
      if (this.lessons.title) return

      this.isLoading = true
      this.error = ''

      try {
        const { data } = await api.get('/economicStories')
        if (data.length > 0) {
          this.lessons = data[0]
        }
      } catch (error) {
        this.error = '학습 데이터를 불러오지 못했어요.'
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
