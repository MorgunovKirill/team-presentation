<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  pageSize: number
  modelValue: number
  siblingCount?: number
}

const props = withDefaults(defineProps<Props>(), { siblingCount: 1 })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

const pages = computed<PageItem[]>(() => {
  const total = totalPages.value
  const current = props.modelValue
  const sibling = props.siblingCount

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const left = Math.max(2, current - sibling)
  const right = Math.min(total - 1, current + sibling)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < total - 1

  const items: PageItem[] = [1]
  if (showLeftEllipsis) items.push('ellipsis-left')
  for (let i = left; i <= right; i++) items.push(i)
  if (showRightEllipsis) items.push('ellipsis-right')
  items.push(total)
  return items
})

const isFirst = computed(() => props.modelValue <= 1)
const isLast = computed(() => props.modelValue >= totalPages.value)

function go(page: number): void {
  if (page < 1 || page > totalPages.value || page === props.modelValue) return
  emit('update:modelValue', page)
}
</script>

<template>
  <nav v-if="totalPages > 1" :class="$style.pagination" aria-label="Pagination">
    <button
      type="button"
      :class="$style.button"
      :disabled="isFirst"
      aria-label="Previous page"
      @click="go(modelValue - 1)"
    >
      ‹
    </button>
    <template v-for="item in pages" :key="item">
      <span v-if="typeof item === 'string'" :class="$style.ellipsis">…</span>
      <button
        v-else
        type="button"
        :class="[$style.button, $style.page, item === modelValue && $style.active]"
        :aria-current="item === modelValue ? 'page' : undefined"
        @click="go(item)"
      >
        {{ item }}
      </button>
    </template>
    <button
      type="button"
      :class="$style.button"
      :disabled="isLast"
      aria-label="Next page"
      @click="go(modelValue + 1)"
    >
      ›
    </button>
  </nav>
</template>

<style module>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
}
.button {
  min-width: 36px;
  height: 36px;
  padding: 0 var(--space-s);
  border-radius: var(--radius-s);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-s);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.button:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.active {
  background: var(--color-accent);
  color: var(--color-white);
  border-color: var(--color-accent);
}
.active:hover {
  color: var(--color-white);
}
.ellipsis {
  padding: 0 var(--space-xs);
  color: var(--color-text-secondary);
  user-select: none;
}
</style>
