<script setup lang="ts">
interface Props {
  label: string
  active?: boolean
  clickable?: boolean
}
const props = withDefaults(defineProps<Props>(), { active: false, clickable: false })
const emit = defineEmits<{ click: [] }>()

function onClick(): void {
  if (props.clickable) emit('click')
}

function onKeydown(event: KeyboardEvent): void {
  if (!props.clickable) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}
</script>

<template>
  <span
    :class="[$style.tag, active && $style.active, clickable && $style.clickable]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-pressed="clickable ? active : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    {{ label }}
  </span>
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
  border: 1px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.clickable {
  cursor: pointer;
  user-select: none;
}
.clickable:hover {
  border-color: var(--color-accent);
}
.clickable:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.active {
  background: var(--color-accent);
  color: var(--color-white);
  border-color: var(--color-accent);
}
</style>
