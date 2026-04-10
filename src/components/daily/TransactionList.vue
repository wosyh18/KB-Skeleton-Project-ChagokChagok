<script setup>
import incomeIcon from '@/assets/icons/icon-income.png'
import expenseIcon from '@/assets/icons/icon-outcome.png'
import foodIcon from '@/assets/icons/icons-food.png'
import busIcon from '@/assets/icons/icons8-bus.png'
import cultureIcon from '@/assets/icons/icons8-culture.png'
import educationIcon from '@/assets/icons/icons8-education.png'
import hobbyIcon from '@/assets/icons/icons8-hobby.png'
import etcIcon from '@/assets/icons/icons8-star.png'

defineProps({
  transactions: { type: Array, required: true },
})

const emit = defineEmits(['add', 'edit', 'delete'])

const categoryIconMap = {
  식비: foodIcon,
  교통: busIcon,
  문화: cultureIcon,
  교육: educationIcon,
  취미: hobbyIcon,
  기타: etcIcon,
}

function getTransactionIcon(item) {
  if (item.type === 'income') return incomeIcon
  return categoryIconMap[item.category] || expenseIcon
}

function getTransactionIconAlt(item) {
  if (item.type === 'income') return '수입 아이콘'
  return `${item.category || '지출'} 아이콘`
}
</script>

<template>
  <div class="section-card">
    <div class="section-headline">
      <h2>거래 내역</h2>
      <button type="button" class="text-button" @click="emit('add')">새 거래 추가</button>
    </div>

    <div v-if="transactions.length" class="transaction-list">
      <article v-for="item in transactions" :key="item.id" class="transaction-row">
          <div class="transaction-main">
            <div class="transaction-icon">
              <img
                :src="getTransactionIcon(item)"
                :alt="getTransactionIconAlt(item)"
                class="transaction-icon-image"
              />
            </div>
            <div>
              <strong>{{ item.category }}</strong>
              <p>{{ item.description }}</p>
            </div>
          </div>

        <div class="transaction-actions">
          <strong :class="item.type">{{ item.type === 'income' ? '+' : '-' }}{{ item.amount.toLocaleString() }}원</strong>
          <div class="action-group">
            <button type="button" class="chip-button" @click="emit('edit', item.id)">수정</button>
            <button type="button" class="chip-button danger" @click="emit('delete', item.id)">삭제</button>
          </div>
        </div>
      </article>
    </div>

    <p v-else class="empty-state">이 날짜에는 아직 기록된 거래가 없어요.</p>
  </div>
</template>
