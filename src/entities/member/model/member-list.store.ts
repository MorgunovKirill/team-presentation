import { ref } from 'vue'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = 12

export const useMemberListStore = defineStore('member-list', () => {
  const currentPage = ref(1)
  const pageSize = ref(DEFAULT_PAGE_SIZE)
  const activeSkills = ref<string[]>([])

  function setPage(page: number): void {
    currentPage.value = page
  }

  function setPageSize(size: number): void {
    pageSize.value = size
    currentPage.value = 1
  }

  function toggleSkill(skill: string): void {
    const index = activeSkills.value.indexOf(skill)
    if (index === -1) {
      activeSkills.value = [...activeSkills.value, skill]
    } else {
      activeSkills.value = activeSkills.value.filter((s) => s !== skill)
    }
    currentPage.value = 1
  }

  function resetFilters(): void {
    activeSkills.value = []
    currentPage.value = 1
  }

  return {
    currentPage,
    pageSize,
    activeSkills,
    setPage,
    setPageSize,
    toggleSkill,
    resetFilters,
  }
})
