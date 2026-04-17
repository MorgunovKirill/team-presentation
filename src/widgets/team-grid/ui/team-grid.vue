<script setup lang="ts">
import type { Member } from '@/entities/member'
import MemberCard from '@/entities/member/ui/member-card/member-card.vue'

interface Props {
  members: Member[]
}
defineProps<Props>()
</script>

<template>
  <div :class="$style.grid">
    <MemberCard v-for="member in members" :key="member.id" :member="member" />
  </div>
</template>

<style module>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-m);
}
@media (max-width: 1279px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 1023px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 639px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
