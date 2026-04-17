<script setup lang="ts">
interface Props {
  label: string
}
defineProps<Props>()
</script>

<template>
  <span :class="$style.tag">{{ label }}</span>
</template>

<style module>
.tag {
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--radius-s);
  font-size: var(--font-size-xs);
  font-weight: 500;
  white-space: nowrap;
}
</style>
