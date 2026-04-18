<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { Member } from '@/entities/member'
import { useMemberListStore } from '@/entities/member'
import BaseTag from '@/shared/ui/base-tag/base-tag.vue'
import BaseButton from '@/shared/ui/base-button/base-button.vue'
import { collectUniqueSkills } from '../lib/filter-members'

interface Props {
  members: Member[]
}
const props = defineProps<Props>()

const { t } = useI18n()
const store = useMemberListStore()
const { activeSkills } = storeToRefs(store)

const skills = computed(() => collectUniqueSkills(props.members))
const hasActive = computed(() => activeSkills.value.length > 0)
</script>

<template>
  <section :class="$style.filter" :aria-label="t('team.filters.title')">
    <div :class="$style.header">
      <h2 :class="$style.title">{{ t('team.filters.title') }}</h2>
      <BaseButton v-if="hasActive" variant="ghost" @click="store.resetFilters()">
        {{ t('team.filters.reset') }}
      </BaseButton>
    </div>
    <div :class="$style.tags">
      <BaseTag
        v-for="skill in skills"
        :key="skill"
        :label="skill"
        :active="activeSkills.includes(skill)"
        clickable
        @click="store.toggleSkill(skill)"
      />
    </div>
  </section>
</template>

<style module>
.filter {
  margin-bottom: var(--space-l);
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-m);
  margin-bottom: var(--space-s);
}
.title {
  font-size: var(--font-size-l);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}
</style>
