<script setup>
import logo from '@/assets/icons/kb로고.png';
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <img :src="logo" alt="KB Logo" class="header-logo" />
      <span class="service-name">차곡차곡</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: transparent;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 100;
  display: flex;
  justify-content: center;
}

.header-inner {
  width: min(100%, 480px);
  height: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 900px) {
  .header-inner {
    width: min(100%, 1180px);
  }
}

.header-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.service-name {
  font-family: 'Gowun Dodum', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #253220;
  letter-spacing: -0.3px;
}
</style>
