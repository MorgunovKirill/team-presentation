<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMembersQuery } from '@/entities/member'
import TeamGrid from '@/widgets/team-grid/ui/team-grid.vue'

const { t } = useI18n()
const { data: members, isPending, isError } = useMembersQuery()
</script>

<template>
  <main :class="$style.page">
    <h1 :class="$style.title">{{ t('team.title') }}</h1>
    <TeamGrid v-if="members" :members="members" />
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
</style>
