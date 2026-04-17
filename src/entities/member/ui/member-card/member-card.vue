<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Member } from '../../model/member.schemas'
import { APP_ROUTES } from '@/shared/lib/routes.constants'
import BaseTag from '@/shared/ui/base-tag/base-tag.vue'

interface Props {
  member: Member
}
const props = defineProps<Props>()
const router = useRouter()

function goToProfile(): void {
  router.push(APP_ROUTES.MEMBER_BY_ID(props.member.id))
}
</script>

<template>
  <div :class="$style.card" @click="goToProfile">
    <img :src="member.photo" :alt="member.name" :class="$style.avatar" />
    <h3 :class="$style.name">{{ member.name }}</h3>
    <p :class="$style.role">{{ member.role }}</p>
    <div :class="$style.skills">
      <BaseTag v-for="skill in member.skills" :key="skill" :label="skill" />
    </div>
  </div>
</template>

<style module>
.card {
  background: var(--color-surface);
  border-radius: var(--radius-m);
  box-shadow: var(--shadow-s);
  padding: var(--space-m);
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.card:hover {
  box-shadow: var(--shadow-m);
  transform: translateY(-2px);
}
.avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  object-fit: cover;
  margin: 0 auto var(--space-s);
}
.name {
  font-size: var(--font-size-m);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-xs);
}
.role {
  font-size: var(--font-size-s);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-s);
}
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  justify-content: center;
}
</style>
