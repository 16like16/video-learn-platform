<script setup>
import TopNav from './components/TopNav.vue';
</script>

<template>
  <div class="app-shell">
    <div class="backdrop"></div>
    <TopNav />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
