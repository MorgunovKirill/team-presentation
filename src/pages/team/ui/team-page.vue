<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useMembersQuery, useMemberListStore } from '@/entities/member'
import { SkillFilter, filterMembersBySkills } from '@/features/filter-members-by-skill'
import TeamGrid from '@/widgets/team-grid/ui/team-grid.vue'
import BasePagination from '@/shared/ui/base-pagination/base-pagination.vue'

const { t } = useI18n()
const { data: members, isPending, isError } = useMembersQuery()

const store = useMemberListStore()
const { currentPage, pageSize, activeSkills } = storeToRefs(store)

const filtered = computed(() =>
  filterMembersBySkills(members.value ?? [], activeSkills.value),
)

const pageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function updatePage(page: number): void {
  store.setPage(page)
}
</script>

<template>
  <main :class="$style.page">
    <h1 :class="$style.title">{{ t('team.title') }}</h1>
    <template v-if="members">
      <SkillFilter :members="members" />
      <TeamGrid v-if="pageItems.length" :members="pageItems" />
      <p v-else :class="$style.status">{{ t('team.empty') }}</p>
      <div v-if="filtered.length > pageSize" :class="$style.pagination">
        <BasePagination
          :total="filtered.length"
          :page-size="pageSize"
          :model-value="currentPage"
          @update:model-value="updatePage"
        />
      </div>
    </template>
    <p v-else-if="isPending" :class="$style.status">{{ t('common.loading') }}</p>
    <p v-else-if="isError" :class="$style.status">{{ t('common.error') }}</p>
  </main>
</template>

<style module>
.page {
  padding: var(--space-xl) var(--space-l);
  max-width: 1400px;
  margin: 0 auto;
}
.title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xl);
}
.status {
  color: var(--color-text-secondary);
}
.pagination {
  margin-top: var(--space-xl);
}
</style>
