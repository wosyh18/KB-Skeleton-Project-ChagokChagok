<script setup>
import { ref, onMounted } from 'vue';
import { useLearningStore } from '@/store/learning';

const learningStore = useLearningStore();
const selectedAnswer = ref(null);
const showResult = ref(false);
const rewardMessage = ref('');

onMounted(() => {
  learningStore.fetchDailyLesson();
});

async function answerQuiz(value) {
  selectedAnswer.value = value;
  showResult.value = true;
  rewardMessage.value = '';

  if (value === learningStore.lessons.quiz.answer) {
    const result = await learningStore.rewardForCorrectAnswer();
    rewardMessage.value = result.message || '';
  }
}

function resetQuiz() {
  selectedAnswer.value = null;
  showResult.value = false;
  rewardMessage.value = '';
}
</script>

<template>
  <div class="app-wrapper">
    <section v-if="learningStore.lessons" class="economy-page economy-page">
      <h2 class="page-title">경제 이야기</h2>

      <div class="lesson-card">
        <div class="lesson-header">
          <div class="avatar">🐣</div>
          <div class="topic-info">
            <p class="topic-label">오늘의 주제</p>
            <h3 class="topic-title">{{ learningStore.lessons.title }}</h3>
          </div>
        </div>

        <div class="lesson-body">
          <div
            v-for="(line, index) in learningStore.lessons.description"
            :key="index"
            class="lesson-line"
          >
            <span class="check-icon">✔</span>
            {{ line }}
          </div>
        </div>
      </div>

      <div class="quiz-section gradient-bg">
        <div class="quiz-header">
          <div class="target-icon">🎯</div>
          <h3>O/X 퀴즈</h3>
          <p>배운 내용을 확인해볼까?</p>
        </div>

        <div class="question-card">
          {{ learningStore.lessons.quiz.question }}
        </div>

        <div v-if="!showResult" class="quiz-actions flex-row">
          <button type="button" class="btn-ox" @click="answerQuiz(true)">
            O
          </button>
          <button type="button" class="btn-ox" @click="answerQuiz(false)">
            X
          </button>
        </div>

        <div
          v-else
          class="quiz-result-card"
          :class="
            selectedAnswer === learningStore.lessons.quiz.answer
              ? 'correct'
              : 'incorrect'
          "
        >
          <strong>{{
            selectedAnswer === learningStore.lessons.quiz.answer
              ? '정답!'
              : '다시 한 번!'
          }}</strong>
          <p>
            {{
              selectedAnswer === learningStore.lessons.quiz.answer
                ? learningStore.lessons.quiz.correct
                : learningStore.lessons.quiz.incorrect
            }}
          </p>
          <p v-if="rewardMessage" class="reward-message">
            {{ rewardMessage }}
          </p>
          <button type="button" class="btn-retry" @click="resetQuiz">
            다시 풀기
          </button>
        </div>
      </div>
    </section>

    <div class="completion-card">
      <div class="completion-icon">🐥</div>
      <div class="completion-info">
        <h3>오늘도 경제 공부 잘했어!</h3>
        <p>매일 조금씩 배우면 경제 관련 지식에 박학다식 해질 수 있어요!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ⭐️ 앱 전체 wrapper */
.app-wrapper {
  position: relative;
  min-height: 100vh;
  background-color: var(--theme-background);
}

/* 전체 페이지 배경 및 기본 패딩 */
.economy-page {

  padding: 16px 20px 180px;
  background-color: #f7f4df;
  min-height: 50vh;
  font-family: 'Pretendard', sans-serif;
}

/* 1. 상단 제목: 별도로 분리된 느낌 */
.page-title {
  text-align: center;
  color: var(--theme-accent);
  margin-bottom: 4px;
  font-weight: 850;
  font-size: 35px;
}

/* 2. 오늘의 주제 하얀색 카드 */
.lesson-card {
  background-color: white;
  border-radius: 24px;
  padding: 12px 24px 24px;
  margin: 0 8px 20px 8px;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--theme-accent) 10%, transparent);
}

.lesson-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #eee;
}

.avatar {
  font-size: 36px;
}

.topic-label {
  font-size: 13px;
  color: color-mix(in srgb, var(--theme-accent) 45%, #888);
  margin: 0 0 4px 0;
  font-weight: 600;
}

.topic-title {
  font-size: 19px;
  font-weight: bold;
  color: var(--theme-accent);
  margin: 0;
}

/* 카드 본문 내용 */
.lesson-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lesson-line {
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.check-icon {
  color: var(--theme-primary);
  font-weight: bold;
}

/* 3. 하단 퀴즈 섹션 */
.quiz-section {
  border-radius: 28px;
  padding: 40px 24px;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--theme-primary) 35%, transparent);
}

.gradient-bg {
  background: linear-gradient(180deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
}

.quiz-header {
  text-align: center;
  margin-bottom: 28px;
}

.target-icon {
  font-size: 44px;
  margin-bottom: 8px;
}

.quiz-header h3 {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: var(--theme-accent);
}

.quiz-header p {
  font-size: 15px;
  color: #666;
  margin: 0;
}

.question-card {
  background-color: white;
  padding: 30px 20px;
  border-radius: 20px;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.flex-row {
  display: flex;
  gap: 16px;
}

/* O/X 버튼 */
.btn-ox {
  flex: 1;
  background-color: white;
  border: none;
  border-radius: 20px;
  padding: 24px 0;
  font-size: 36px;
  font-weight: bold;
  color: var(--theme-accent);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ox:active {
  transform: translateY(2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

/* 퀴즈 결과 */
.quiz-result-card {
  background-color: white;
  padding: 32px 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.quiz-result-card strong {
  font-size: 20px;
  display: block;
  margin-bottom: 12px;
}

.quiz-result-card.correct strong {
  color: var(--theme-accent);
}

.quiz-result-card.incorrect strong {
  color: #c62828;
}

.reward-message {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #2e7d32;
}

.btn-retry {
  margin-top: 20px;
  padding: 12px 32px;
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, var(--theme-secondary) 30%, white);
  background-color: color-mix(in srgb, var(--theme-background) 45%, white);
  font-weight: 600;
  color: var(--theme-accent);
  cursor: pointer;
  transition: background 0.2s;
}

.btn-retry:hover {
  background-color: color-mix(in srgb, var(--theme-primary) 18%, white);
}

/* ⭐️ 3. 학습 완료 카드 스타일 */
.completion-card {
  background-color: white;
  border-radius: 24px;
  padding: 24px 20px;
  margin: -52px 8px 96px 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.completion-icon {
  font-size: 40px;
}

.completion-info h3 {
  font-size: 17px;
  font-weight: 800;
  color: #222;
  margin: 0 0 6px 0;
}

.completion-info p {
  font-size: 14px;
  color: #555;
  margin: 0;
  line-height: 1.4;
}

.nav-item {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a0a0a0; /* 비활성화 아이콘 색상 */
  width: 18%;
  height: 70px;
  cursor: pointer;
  transition: all 0.2s;
}

/* 활성화된 탭(경제) 스타일 */
.nav-item.active {
  background-color: #e4f98b; /* 노란색 배경 */
  border-radius: 20px;
  color: #222; /* 텍스트 진하게 */
}

.nav-item .icon {
  font-size: 22px;
  margin-bottom: 4px;
}

.nav-item .label {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 2px;
}

.nav-item .desc {
  font-size: 11px;
  font-weight: 600;
}
</style>
