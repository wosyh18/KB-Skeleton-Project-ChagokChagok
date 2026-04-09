<script setup>
import { computed, reactive, ref } from 'vue';
import CategorySelector from '@/components/input/CategorySelector.vue';
import QuickAmountButtons from '@/components/input/QuickAmountButtons.vue';
import TransactionTypeTabs from '@/components/input/TransactionTypeTabs.vue';
import expenseBadgeIcon from '@/assets/icons/icon-outcome.png';
import incomeBadgeIcon from '@/assets/icons/icon-income.png';
import { useFinanceStore } from '@/store/finance';

const financeStore = useFinanceStore();
const categories = ['식비', '교통', '문화', '취미', '교육', '기타'];
const quickAmounts = [1000, 3000, 5000, 10000];
const activeTab = ref('expense');
const message = ref('');

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

const form = reactive({
  amount: '',
  category: '',
  description: '',
  from: '',
  date: getTodayDate(),
});

const submitLabel = computed(() =>
  activeTab.value === 'income' ? '수입 등록하기' : '지출 등록하기',
);
const pageTitle = computed(() =>
  activeTab.value === 'income' ? '수입 입력' : '지출 입력',
);
const pageBadgeLabel = computed(() =>
  activeTab.value === 'income' ? '수입' : '지출',
);
const pageBadgeIcon = computed(() =>
  activeTab.value === 'income' ? incomeBadgeIcon : expenseBadgeIcon,
);

function resetForm() {
  form.amount = '';
  form.category = '';
  form.description = '';
  form.from = '';
  form.date = getTodayDate();
}

function appendAmount(amount) {
  const currentAmount = Number(form.amount || 0);
  form.amount = String(currentAmount + amount);
}

function sanitizeAmountInput(event) {
  const value = event.target.value;
  if (value === '') {
    form.amount = '';
    return;
  }

  const numericValue = Number(value);
  form.amount = Number.isNaN(numericValue)
    ? ''
    : String(Math.max(0, numericValue));
}

function changeTab(tab) {
  activeTab.value = tab;
  message.value = '';
  resetForm();
}

async function submitForm() {
  if (!form.date) {
    message.value = '날짜를 선택해 주세요.';
    return;
  }

  if (!form.amount) {
    message.value = '금액을 입력해 주세요.';
    return;
  }

  if (Number(form.amount) <= 0) {
    message.value = '금액은 0원보다 크게 입력해 주세요.';
    return;
  }

  if (activeTab.value === 'income' && !form.from.trim()) {
    message.value = '수입 출처를 입력해 주세요.';
    return;
  }

  if (activeTab.value === 'expense' && !form.category) {
    message.value = '지출 카테고리를 선택해 주세요.';
    return;
  }

  const category =
    activeTab.value === 'income'
      ? form.from || '용돈'
      : form.category || '기타';
  const description =
    activeTab.value === 'income'
      ? `${form.from || '보호자'}에게 받은 금액`
      : form.description || '메모 없음';

  try {
    await financeStore.addTransaction({
      type: activeTab.value,
      category,
      description,
      amount: Number(form.amount),
      date: form.date,
      time: '',
    });

    message.value =
      activeTab.value === 'income'
        ? '수입이 저장되었어요.'
        : '지출이 저장되었어요.';
    resetForm();
  } catch {
    message.value = '저장에 실패했어요. json-server 연결을 확인해 주세요.';
  }
}
</script>

<template>
  <section class="content-page input-page">
    <div class="input-layout">
      <aside class="input-intro-card">
        <div class="input-intro-badge">
          <span class="input-intro-badge-icon">
            <img :src="pageBadgeIcon" :alt="`${pageBadgeLabel} 아이콘`" />
          </span>
          <span>{{ pageBadgeLabel }}</span>
        </div>
        <h1>{{ pageTitle }}</h1>
        <p class="input-intro-text">
          {{ activeTab === 'income'
            ? '받은 돈을 바로 남겨두고 이번 달 흐름을 차곡차곡 정리해 보세요.'
            : '오늘 쓴 돈을 가볍게 적어두고 소비 패턴을 한눈에 확인해 보세요.' }}
        </p>

        <div class="input-intro-points">
          <article>
            <span>선택된 날짜</span>
            <strong>{{ form.date }}</strong>
          </article>
          <article>
            <span>현재 입력 금액</span>
            <strong>{{ form.amount ? `${Number(form.amount).toLocaleString()}원` : '0원' }}</strong>
          </article>
        </div>

        <div class="input-intro-tip input-intro-tip-desktop">
          <strong>{{ activeTab === 'income' ? '받은 돈의 출처를 적어두세요.' : '지출 이유를 짧게 남겨두세요.' }}</strong>
          <p>
            {{ activeTab === 'income'
              ? '누가 준 돈인지 적어두면 수입 흐름을 나중에 다시 보기 쉬워요.'
              : '무엇을 왜 샀는지 한 줄 메모만 남겨도 소비 패턴을 찾기 쉬워집니다.' }}
          </p>
        </div>
      </aside>

      <div class="section-card input-form-card">
        <TransactionTypeTabs
          :active-tab="activeTab"
          @change="changeTab"
        />

        <form class="stack-form input-form-grid" @submit.prevent="submitForm">
          <label class="input-field span-two">
            <span>날짜</span>
            <input v-model="form.date" type="date" />
          </label>

          <label class="input-field span-two">
            <span>금액</span>
            <input
              v-model="form.amount"
              type="number"
              min="0"
              placeholder="금액을 입력해 주세요"
              @input="sanitizeAmountInput"
            />
          </label>

          <div class="span-two">
            <QuickAmountButtons :amounts="quickAmounts" @select="appendAmount" />
          </div>

          <template v-if="activeTab === 'income'">
            <label class="input-field span-two">
              <span>누구에게 받았나요?</span>
              <input
                v-model="form.from"
                type="text"
                placeholder="예: 엄마, 아빠, 할머니"
              />
            </label>
          </template>

          <template v-else>
            <div class="span-two">
              <CategorySelector
                :categories="categories"
                :selected-category="form.category"
                @select="form.category = $event"
              />
            </div>

            <label class="input-field span-two">
              <span>메모</span>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="무엇을 샀는지 적어 주세요"
              ></textarea>
            </label>
          </template>

          <p v-if="message" class="success-message span-two">{{ message }}</p>
          <button type="submit" class="primary-button span-two">{{ submitLabel }}</button>
        </form>
      </div>
    </div>
  </section>
</template>
