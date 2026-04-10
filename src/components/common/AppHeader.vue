<template>
  <header class="app-header">
    <div class="header-inner">
      <img src="/images/KB_s_kr3.png" alt="KB 로고" class="header-side-logo" />
      <img
        src="/images/chagok_logo.png"
        alt="차곡차곡 로고"
        class="header-logo"
      />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 62px;
  background: color-mix(in srgb, var(--theme-background) 72%, transparent);
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 900px) {
  .header-inner {
    width: min(100%, 1180px);
  }
}

.header-side-logo {
  position: absolute;
  left: 1rem;
  height: 34px;
  width: auto;
  object-fit: contain;
}

.header-logo {
  height: 42px;
  width: auto;
  object-fit: contain;
}
</style>
