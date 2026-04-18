import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'team-presentation:favorites:v1'

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return []
  }
}

function saveToStorage(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* no-op */
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>(loadFromStorage())

  watch(ids, (value) => saveToStorage(value), { deep: true })

  const count = computed(() => ids.value.length)

  function isFavorite(id: string): boolean {
    return ids.value.includes(id)
  }

  function addFavorite(id: string): void {
    if (!ids.value.includes(id)) {
      ids.value = [...ids.value, id]
    }
  }

  function removeFavorite(id: string): void {
    ids.value = ids.value.filter((v) => v !== id)
  }

  function toggleFavorite(id: string): void {
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  return { ids, count, isFavorite, addFavorite, removeFavorite, toggleFavorite }
})
