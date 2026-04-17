<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost'
}
withDefaults(defineProps<Props>(), { variant: 'primary' })
</script>

<template>
  <button :class="[$style.button, $style[variant]]">
    <slot />
  </button>
</template>

<style module>
.button {
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-m);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-s);
  font-weight: 600;
  transition: opacity 0.15s;
}
.button:hover {
  opacity: 0.85;
}
.primary {
  background: var(--color-accent);
  color: var(--color-white);
}
.ghost {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}
</style>
