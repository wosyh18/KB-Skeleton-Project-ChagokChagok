<script setup>
import NavigationBar from './navigationBar.vue';
</script>

<template>
  <div class="app-shell">
    <main class="page-shell has-navigation">
      <RouterView />
    </main>
    <NavigationBar />
  </div>
</template>
