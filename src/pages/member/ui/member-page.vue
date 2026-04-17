<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMemberQuery } from '@/entities/member'
import MemberProfile from '@/widgets/member-profile/ui/member-profile.vue'

const route = useRoute()
const { t } = useI18n()
const id = computed(() => route.params['id'] as string)
const { data: member, isPending, isError } = useMemberQuery(id)
</script>

<template>
  <main :class="$style.page">
    <MemberProfile v-if="member" :member="member" />
    <p v-else-if="isPending" :class="$style.status">{{ t('common.loading') }}</p>
    <p v-else-if="isError" :class="$style.status">{{ t('common.error') }}</p>
  </main>
</template>

<style module>
.page {
  padding: var(--space-xl) var(--space-l);
  max-width: 900px;
  margin: 0 auto;
}
.status {
  color: var(--color-text-secondary);
}
</style>
