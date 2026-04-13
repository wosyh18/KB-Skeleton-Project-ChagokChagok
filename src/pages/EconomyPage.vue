<script setup>
import { computed, onMounted, ref } from 'vue';
import { useLearningStore } from '@/store/learning';

const learningStore = useLearningStore();
const selectedAnswer = ref(null);
const showResult = ref(false);
const rewardMessage = ref('');
const completedLessons = computed(() => learningStore.completedLessons);

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
    <section v-if="learningStore.lessons" class="economy-page">
      <h2 class="page-title">경제 이야기</h2>

      <div class="content-layout">
        <div class="primary-column">
          <div class="lesson-card">
            <div class="lesson-header">
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
        </div>

        <div class="secondary-column">
          <div class="completion-card">
            <div class="completion-icon">🐥</div>
            <div class="completion-info">
              <h3>오늘도 경제 공부 잘했어!</h3>
              <p>
                매일 조금씩 배우면 경제 관련 지식에 박학다식 해질 수 있어요!
              </p>
            </div>
          </div>

          <section class="history-section">
            <div class="history-header">
              <h3>그동안 풀어본 퀴즈</h3>
              <p>정답을 맞힌 경제 이야기를 다시 꺼내볼 수 있어요.</p>
            </div>

            <div class="history-content">
              <div v-if="completedLessons?.length" class="history-grid">
                <article
                  v-for="story in completedLessons"
                  :key="story.id"
                  class="history-card"
                >
                  <span class="history-badge">완료</span>
                  <h4>{{ story.title }}</h4>
                  <p class="history-question">{{ story.quiz.question }}</p>
                  <p class="history-answer">
                    정답: {{ story.quiz.answer ? 'O' : 'X' }}
                  </p>
                  <p class="history-explanation">{{ story.quiz.correct }}</p>
                </article>
              </div>

              <div v-else class="history-empty">
                아직 완료한 퀴즈가 없어요. 정답을 맞히면 여기에 차곡차곡 쌓여요.
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.economy-page {
  padding: 16px 20px 180px;
  background:
    radial-gradient(circle at top, var(--theme-primary-soft), transparent 28%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--theme-background) 88%, white) 0%,
      color-mix(
          in srgb,
          var(--theme-background) 100%,
          var(--theme-secondary-soft)
        )
        100%
    );
  min-height: 50vh;
  font-family: 'Pretendard', sans-serif;
}

.content-layout {
  display: grid;
  gap: 20px;
}

.primary-column,
.secondary-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  text-align: center;
  color: var(--theme-accent);
  margin-top: 12px;
  margin-bottom: 8px;
  font-weight: 850;
  font-size: 35px;
}

.lesson-card,
.completion-card,
.history-section {
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 8px 20px
    color-mix(in srgb, var(--theme-accent) 10%, transparent);
}

.lesson-card {
  padding: 12px 24px 24px;
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
  margin: 0 0 4px;
  font-weight: 600;
}

.topic-title {
  font-size: 19px;
  font-weight: 700;
  color: var(--theme-accent);
  margin: 0;
}

.lesson-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lesson-line {
  font-size: 15px;
  line-height: 1.6;
  color: color-mix(in srgb, var(--theme-accent) 78%, #444);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.check-icon {
  color: var(--theme-primary);
  font-weight: 700;
}

.quiz-section {
  border-radius: 28px;
  padding: 30px 24px;
  box-shadow: 0 8px 24px
    color-mix(in srgb, var(--theme-primary) 35%, transparent);
}

.gradient-bg {
  background: linear-gradient(
    180deg,
    var(--theme-primary) 0%,
    var(--theme-secondary) 100%
  );
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
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
  color: var(--theme-accent);
}

.quiz-header p {
  font-size: 15px;
  color: color-mix(in srgb, var(--theme-accent) 62%, #666);
  margin: 0;
}

.question-card {
  background-color: white;
  padding: 25px 15px;
  border-radius: 20px;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: var(--theme-accent);
  margin-bottom: 24px;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.flex-row {
  display: flex;
  gap: 16px;
}

.btn-ox {
  flex: 1;
  background-color: white;
  border: none;
  border-radius: 15px;
  padding: 18px 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--theme-accent);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ox:active {
  transform: translateY(2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

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

.quiz-result-card p {
  color: color-mix(in srgb, var(--theme-accent) 72%, #555);
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
  color: var(--theme-accent);
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

.completion-card {
  padding: 24px 20px;
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
  color: var(--theme-accent);
  margin: 0 0 6px;
}

.completion-info p {
  font-size: 14px;
  color: color-mix(in srgb, var(--theme-accent) 68%, #555);
  margin: 0;
  line-height: 1.4;
}

.history-section {
  padding: 24px 20px;
  max-height: 460px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-header {
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--theme-accent) 12%, white);
}

.history-header h3 {
  margin: 0 0 6px;
  font-size: 22px;
  color: var(--theme-accent);
}

.history-header p {
  margin: 0;
  font-size: 14px;
  color: color-mix(in srgb, var(--theme-accent) 62%, #666);
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--theme-accent) 28%, transparent)
    transparent;
}

.history-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.history-card,
.history-empty {
  background: color-mix(in srgb, white 92%, var(--theme-background));
  border-radius: 22px;
  padding: 18px;
}

.history-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--theme-primary) 55%, white);
  color: var(--theme-accent);
  font-size: 12px;
  font-weight: 700;
}

.history-card h4 {
  margin: 12px 0 8px;
  font-size: 18px;
  color: var(--theme-accent);
}

.history-question {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.5;
  color: color-mix(in srgb, var(--theme-accent) 80%, #444);
}

.history-answer,
.history-empty {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: color-mix(in srgb, var(--theme-accent) 72%, #555);
}

.history-explanation {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: color-mix(in srgb, var(--theme-accent) 72%, #555);
}

.history-content::-webkit-scrollbar {
  width: 6px;
}

.history-content::-webkit-scrollbar-track {
  background: transparent;
}

.history-content::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--theme-accent) 24%, transparent);
  border-radius: 999px;
}

@media (min-width: 768px) {
  .history-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .economy-page {
    padding-left: 28px;
    padding-right: 28px;
  }

  .content-layout {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    align-items: stretch;
    gap: 28px;
  }

  .secondary-column {
    height: 100%;
    min-height: 0;
  }

  .history-section {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    max-height: 560px;
  }

  .history-content {
    flex: 1;
    min-height: 0;
  }

  .history-grid {
    grid-template-columns: 1fr;
  }
}
</style>
