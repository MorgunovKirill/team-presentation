<script setup lang="ts">
</script>

<template>
  <div :class="$style.card">
    <slot />
  </div>
</template>

<style module>
.card {
  background: var(--color-surface);
  border-radius: var(--radius-m);
  box-shadow: var(--shadow-s);
  padding: var(--space-m);
}
</style>
