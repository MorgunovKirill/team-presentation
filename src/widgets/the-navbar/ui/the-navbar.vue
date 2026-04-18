<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { APP_ROUTES } from '@/shared/lib/routes.constants'
import { useFavoritesStore } from '@/features/favorites'

const { t, locale } = useI18n()
const { count } = storeToRefs(useFavoritesStore())

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
      <RouterLink
        :to="APP_ROUTES.FAVORITES"
        :class="[$style.link, $style.favorites]"
        :aria-label="t('nav.favorites')"
      >
        <svg
          :class="$style.heart"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{{ t('nav.favorites') }}</span>
        <span v-if="count > 0" :class="$style.badge" :aria-label="String(count)">{{ count }}</span>
      </RouterLink>
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
.favorites {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}
.heart {
  width: 18px;
  height: 18px;
}
.badge {
  position: absolute;
  top: -8px;
  right: -14px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
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
