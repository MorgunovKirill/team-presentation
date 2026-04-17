<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMembersQuery } from '@/entities/member'
import HeroSection from '@/widgets/hero-section/ui/hero-section.vue'

const { t } = useI18n()
const { data: members, isPending, isError } = useMembersQuery()
</script>

<template>
  <main>
    <HeroSection v-if="members" :members="members" />
    <p v-else-if="isPending" :class="$style.status">{{ t('common.loading') }}</p>
    <p v-else-if="isError" :class="$style.status">{{ t('common.error') }}</p>
  </main>
</template>

<style module>
.status {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}
</style>
