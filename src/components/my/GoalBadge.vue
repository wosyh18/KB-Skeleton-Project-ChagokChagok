<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentTheme: { type: Object, required: true },
  goalInput: { type: String, required: true },
  topCategory: { type: Object, default: null },
})

const emit = defineEmits(['update:goalInput'])

const dynamicFontSize = computed(() => {
  const len = props.goalInput.length
  if (len <= 6) return '1.4rem'
  if (len <= 8) return '1.2rem'
  if (len <= 10) return '1.05rem'
  return '0.9rem'
})
</script>

<template>
  <div class="character-goal-container">
    <div class="vertical-wrapper">
      <!-- 이번 달 목표 말풍선 (위) -->
      <div class="speech-badge-center" style="border-color: #FFD93D">
        <span class="bubble-label">이번 달 목표</span>
        <div class="goal-input-row" style="border-bottom: 3px solid #FFD93D">
          <input 
            :value="goalInput" 
            type="text" 
            inputmode="numeric" 
            @input="emit('update:goalInput', $event.target.value)" 
            :style="{ fontSize: dynamicFontSize }"
          />
          <strong>원</strong>
        </div>
        <!-- 말풍선 꼬리 (아래쪽 향함) -->
        <div class="badge-tail-down" style="border-top-color: #FFD93D"></div>
      </div>

      <!-- 캐릭터 원형 (아래) -->
      <div class="character-orb-main">
        <img 
          v-if="topCategory" 
          :src="topCategory.characterImg" 
          :alt="topCategory.characterName" 
          class="orb-img-main" 
        />
        <span v-else>나</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-goal-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.vertical-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}

.speech-badge-center {
  background: #fff;
  border: 3px solid;
  border-radius: 20px;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 160px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.21);
  position: relative;
}

.bubble-label {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 4px;
}

.goal-input-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-bottom: 2px;
  width: 100%;
  justify-content: center;
}

.goal-input-row input {
  width: 100px;
  border: none;
  background: transparent;
  font-weight: 800;
  text-align: center;
  padding: 0;
  transition: font-size 0.2s ease;
}

.goal-input-row input:focus {
  outline: none;
}

.goal-input-row strong {
  font-size: 1.1rem;
  font-weight: 700;
}

.badge-tail-down {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 12px solid;
}

.character-orb-main {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
}

.orb-img-main {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
