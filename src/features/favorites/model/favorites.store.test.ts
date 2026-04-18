import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useFavoritesStore } from './favorites.store'

const STORAGE_KEY = 'team-presentation:favorites:v1'

function createMockStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => void data.delete(key),
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

describe('useFavoritesStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMockStorage())
    setActivePinia(createPinia())
  })

  it('initializes empty when storage is empty', () => {
    const store = useFavoritesStore()
    expect(store.ids).toEqual([])
    expect(store.count).toBe(0)
  })

  it('hydrates from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['1', '2']))
    const store = useFavoritesStore()
    expect(store.ids).toEqual(['1', '2'])
    expect(store.count).toBe(2)
  })

  it('addFavorite appends unique ids', () => {
    const store = useFavoritesStore()
    store.addFavorite('1')
    store.addFavorite('2')
    store.addFavorite('1')
    expect(store.ids).toEqual(['1', '2'])
  })

  it('removeFavorite removes id', () => {
    const store = useFavoritesStore()
    store.addFavorite('1')
    store.addFavorite('2')
    store.removeFavorite('1')
    expect(store.ids).toEqual(['2'])
  })

  it('toggleFavorite toggles membership', () => {
    const store = useFavoritesStore()
    store.toggleFavorite('1')
    expect(store.isFavorite('1')).toBe(true)
    store.toggleFavorite('1')
    expect(store.isFavorite('1')).toBe(false)
  })

  it('persists to localStorage', async () => {
    const store = useFavoritesStore()
    store.addFavorite('1')
    store.addFavorite('2')
    await nextTick()
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(['1', '2']))
  })

  it('ignores malformed localStorage payload', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    const store = useFavoritesStore()
    expect(store.ids).toEqual([])
  })
})
