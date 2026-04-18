<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useMembersQuery } from '@/entities/member'
import { useFavoritesStore } from '@/features/favorites'
import TeamGrid from '@/widgets/team-grid/ui/team-grid.vue'

const { t } = useI18n()
const { data: members, isPending, isError } = useMembersQuery()
const { ids } = storeToRefs(useFavoritesStore())

const favorites = computed(() =>
  (members.value ?? []).filter((member) => ids.value.includes(member.id)),
)
</script>

<template>
  <main :class="$style.page">
    <h1 :class="$style.title">{{ t('favorites.title') }}</h1>
    <template v-if="members">
      <TeamGrid v-if="favorites.length" :members="favorites" />
      <div v-else :class="$style.empty">
        <svg
          :class="$style.icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <p :class="$style.text">{{ t('favorites.empty') }}</p>
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
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-m);
  padding: var(--space-2xl) var(--space-l);
  color: var(--color-text-secondary);
}
.icon {
  width: 64px;
  height: 64px;
  color: var(--color-text-secondary);
}
.text {
  font-size: var(--font-size-m);
  margin: 0;
  text-align: center;
}
</style>
