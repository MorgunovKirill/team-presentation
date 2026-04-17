<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { APP_ROUTES } from '@/shared/lib/routes.constants'

const { t, locale } = useI18n()

function toggleLocale(): void {
  locale.value = locale.value === 'ru' ? 'en' : 'ru'
}
</script>

<template>
  <nav :class="$style.nav">
    <RouterLink :to="APP_ROUTES.HOME" :class="$style.logo">TeamName</RouterLink>
    <div :class="$style.links">
      <RouterLink :to="APP_ROUTES.HOME" :class="$style.link">{{ t('nav.home') }}</RouterLink>
      <RouterLink :to="APP_ROUTES.TEAM" :class="$style.link">{{ t('nav.team') }}</RouterLink>
      <button :class="$style.langToggle" @click="toggleLocale">
        {{ locale === 'ru' ? 'EN' : 'RU' }}
      </button>
    </div>
  </nav>
</template>

<style module>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-m) var(--space-l);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo {
  font-weight: 700;
  font-size: var(--font-size-l);
  color: var(--color-text-primary);
  text-decoration: none;
}
.links {
  display: flex;
  align-items: center;
  gap: var(--space-l);
}
.link {
  font-size: var(--font-size-s);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
}
.link:hover {
  color: var(--color-accent);
}
:global(.router-link-active).link {
  color: var(--color-accent);
}
.langToggle {
  background: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-s);
  padding: var(--space-xs) var(--space-m);
  font-size: var(--font-size-xs);
  font-weight: 700;
  cursor: pointer;
}
</style>
