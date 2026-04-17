<script setup lang="ts">
import TheNavbar from '@/widgets/the-navbar/ui/the-navbar.vue'
</script>

<template>
  <div :class="$style.app">
    <TheNavbar />
    <RouterView />
  </div>
</template>

<style module>
.app {
  min-height: 100vh;
  background: var(--color-bg);
}
</style>
