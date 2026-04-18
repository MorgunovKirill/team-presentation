import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMemberListStore } from './member-list.store'

describe('useMemberListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with defaults', () => {
    const store = useMemberListStore()
    expect(store.currentPage).toBe(1)
    expect(store.pageSize).toBe(12)
    expect(store.activeSkills).toEqual([])
  })

  it('setPage updates current page', () => {
    const store = useMemberListStore()
    store.setPage(3)
    expect(store.currentPage).toBe(3)
  })

  it('toggleSkill adds and removes skills', () => {
    const store = useMemberListStore()
    store.toggleSkill('Vue 3')
    expect(store.activeSkills).toEqual(['Vue 3'])
    store.toggleSkill('React')
    expect(store.activeSkills).toEqual(['Vue 3', 'React'])
    store.toggleSkill('Vue 3')
    expect(store.activeSkills).toEqual(['React'])
  })

  it('toggleSkill resets currentPage to 1', () => {
    const store = useMemberListStore()
    store.setPage(3)
    store.toggleSkill('Vue 3')
    expect(store.currentPage).toBe(1)
  })

  it('resetFilters clears skills and resets page', () => {
    const store = useMemberListStore()
    store.toggleSkill('Vue 3')
    store.setPage(2)
    store.resetFilters()
    expect(store.activeSkills).toEqual([])
    expect(store.currentPage).toBe(1)
  })

  it('setPageSize updates size and resets page', () => {
    const store = useMemberListStore()
    store.setPage(5)
    store.setPageSize(24)
    expect(store.pageSize).toBe(24)
    expect(store.currentPage).toBe(1)
  })
})
