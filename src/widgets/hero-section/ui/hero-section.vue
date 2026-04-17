<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Member } from '@/entities/member'
import { APP_ROUTES } from '@/shared/lib/routes.constants'
import BaseButton from '@/shared/ui/base-button/base-button.vue'

interface Props {
  members: Member[]
}
defineProps<Props>()

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <section :class="$style.hero">
    <h1 :class="$style.title">{{ t('home.title') }}</h1>
    <p :class="$style.subtitle">{{ t('home.subtitle') }}</p>
    <BaseButton @click="router.push(APP_ROUTES.TEAM)">
      {{ t('home.cta') }}
    </BaseButton>
    <div :class="$style.preview">
      <div
        v-for="member in members.slice(0, 5)"
        :key="member.id"
        :class="$style.previewItem"
      >
        <img :src="member.photo" :alt="member.name" :class="$style.previewAvatar" />
        <span :class="$style.previewName">{{ member.name.split(' ')[0] }}</span>
        <span :class="$style.previewRole">{{ member.role }}</span>
      </div>
    </div>
  </section>
</template>

<style module>
.hero {
  text-align: center;
  padding: var(--space-2xl) var(--space-l);
  background: linear-gradient(180deg, #f0f9ff 0%, var(--color-bg) 100%);
}
.title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--space-s);
}
.subtitle {
  font-size: var(--font-size-m);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-l);
}
.preview {
  display: flex;
  gap: var(--space-l);
  justify-content: center;
  margin-top: var(--space-xl);
  flex-wrap: wrap;
}
.previewItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}
.previewAvatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  object-fit: cover;
}
.previewName {
  font-size: var(--font-size-s);
  font-weight: 600;
  color: var(--color-text-primary);
}
.previewRole {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
</style>
