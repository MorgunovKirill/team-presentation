<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFavoritesStore } from '../model/favorites.store'

interface Props {
  memberId: string
}
const props = defineProps<Props>()

const { t } = useI18n()
const store = useFavoritesStore()

const isFavorite = computed(() => store.isFavorite(props.memberId))

function toggle(event: MouseEvent): void {
  event.stopPropagation()
  event.preventDefault()
  store.toggleFavorite(props.memberId)
}
</script>

<template>
  <button
    type="button"
    :class="[$style.toggle, isFavorite && $style.active]"
    :aria-label="isFavorite ? t('favorites.remove') : t('favorites.add')"
    :aria-pressed="isFavorite"
    @click="toggle"
  >
    <svg
      v-if="isFavorite"
      :class="$style.icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 21s-7-4.35-9.5-8.5C1 9 3 5.5 6.5 5.5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5.5 23 9 21.5 12.5 19 16.65 12 21 12 21z" />
    </svg>
    <svg
      v-else
      :class="$style.icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </button>
</template>

<style module>
.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, transform 0.1s;
  box-shadow: var(--shadow-s);
}
.toggle:hover {
  color: #ef4444;
  border-color: #ef4444;
}
.toggle:active {
  transform: scale(0.92);
}
.toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.active {
  color: #ef4444;
  border-color: #ef4444;
}
.icon {
  width: 18px;
  height: 18px;
  display: block;
}
</style>
