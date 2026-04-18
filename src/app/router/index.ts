import { createRouter, createWebHistory } from 'vue-router'
import { APP_ROUTES } from '@/shared/lib/routes.constants'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: APP_ROUTES.HOME,
      component: () => import('@/pages/home/ui/home-page.vue'),
    },
    {
      path: APP_ROUTES.TEAM,
      component: () => import('@/pages/team/ui/team-page.vue'),
    },
    {
      path: APP_ROUTES.MEMBER,
      component: () => import('@/pages/member/ui/member-page.vue'),
    },
    {
      path: APP_ROUTES.FAVORITES,
      component: () => import('@/pages/favorites/ui/favorites-page.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: APP_ROUTES.HOME,
    },
  ],
})
