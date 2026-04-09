<script setup>
import NavigationBar from './NavigationBar.vue'
</script>

<template>
  <div class="app-shell">
    <main class="page-shell has-navigation">
      <RouterView />
    </main>
    <NavigationBar />
  </div>
</template>
