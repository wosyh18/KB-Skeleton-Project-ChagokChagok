import { defineStore } from 'pinia'

import { seedLessons } from './data'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    lessons: seedLessons,
  }),
})
