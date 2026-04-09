<script setup>
import { ref } from 'vue'
import { useLearningStore } from '@/store/learning'

const learningStore = useLearningStore()
const selectedAnswer = ref(null)
const showResult = ref(false)

function answerQuiz(value) {
  selectedAnswer.value = value
  showResult.value = true
}

function resetQuiz() {
  selectedAnswer.value = null
  showResult.value = false
}
</script>

<template>
  <section class="content-page economy-page">
    <div class="section-card lesson-card">
      <div class="lesson-heading">
        <div class="lesson-avatar">경제</div>
        <div>
          <span>오늘의 경제 이야기</span>
          <h1>{{ learningStore.lessons.title }}</h1>
        </div>
      </div>

      <div class="chat-stack">
        <article v-for="line in learningStore.lessons.description" :key="line" class="chat-bubble">
          {{ line }}
        </article>
      </div>
    </div>

    <div class="section-card quiz-card">
      <div class="section-headline vertical-center">
        <div>
          <span>OX 퀴즈</span>
          <h2>{{ learningStore.lessons.quiz.question }}</h2>
        </div>
      </div>

      <div v-if="!showResult" class="quiz-actions">
        <button type="button" class="quiz-button yes" @click="answerQuiz(true)">O</button>
        <button type="button" class="quiz-button no" @click="answerQuiz(false)">X</button>
      </div>

      <div v-else class="quiz-result" :class="selectedAnswer === learningStore.lessons.quiz.answer ? 'correct' : 'incorrect'">
        <strong>{{ selectedAnswer === learningStore.lessons.quiz.answer ? '정답!' : '다시 한 번!' }}</strong>
        <p>
          {{ selectedAnswer === learningStore.lessons.quiz.answer ? learningStore.lessons.quiz.correct : learningStore.lessons.quiz.incorrect }}
        </p>
        <button type="button" class="ghost-button" @click="resetQuiz">다시 풀기</button>
      </div>
    </div>
  </section>
</template>
