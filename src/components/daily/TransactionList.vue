<script setup>
defineProps({
  transactions: { type: Array, required: true },
})

const emit = defineEmits(['add', 'edit', 'delete'])
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
            <div class="transaction-icon">{{ item.type === 'income' ? '수입' : '지출' }}</div>
            <div>
              <strong>{{ item.category }}</strong>
              <p>{{ item.description }}</p>
              <small v-if="item.time">{{ item.time }}</small>
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
