<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Member } from '@/entities/member'
import BaseTag from '@/shared/ui/base-tag/base-tag.vue'

interface Props {
  member: Member
}
defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div :class="$style.profile">
    <img :src="member.photo" :alt="member.name" :class="$style.avatar" />
    <div :class="$style.info">
      <h1 :class="$style.name">{{ member.name }}</h1>
      <p :class="$style.role">{{ member.role }}</p>
      <p v-if="member.email" :class="$style.email">{{ member.email }}</p>
      <div :class="$style.section">
        <p :class="$style.label">{{ t('member.skills') }}</p>
        <div :class="$style.skills">
          <BaseTag v-for="skill in member.skills" :key="skill" :label="skill" />
        </div>
      </div>
      <div :class="$style.social">
        <a
          v-if="member.social.github"
          :href="member.social.github"
          target="_blank"
          rel="noopener noreferrer"
          :class="$style.socialLink"
        >GitHub</a>
        <a
          v-if="member.social.linkedin"
          :href="member.social.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          :class="$style.socialLink"
        >LinkedIn</a>
        <a
          v-if="member.social.telegram"
          :href="`https://t.me/${member.social.telegram.replace('@', '')}`"
          target="_blank"
          rel="noopener noreferrer"
          :class="$style.socialLink"
        >Telegram</a>
      </div>
    </div>
  </div>
</template>

<style module>
.profile {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-xl);
  background: var(--color-surface);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-m);
}
@media (max-width: 639px) {
  .profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}
.info { flex: 1; }
.name {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}
.role {
  font-size: var(--font-size-m);
  color: var(--color-accent);
  font-weight: 500;
  margin-bottom: var(--space-xs);
}
.email {
  font-size: var(--font-size-s);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-m);
}
.section { margin-bottom: var(--space-m); }
.label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-s);
}
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}
.social {
  display: flex;
  gap: var(--space-m);
  flex-wrap: wrap;
}
.socialLink {
  font-size: var(--font-size-s);
  color: var(--color-accent);
  text-decoration: none;
}
.socialLink:hover {
  text-decoration: underline;
}
</style>
