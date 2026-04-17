export const APP_ROUTES = {
  HOME: '/',
  TEAM: '/team',
  MEMBER: '/team/:id',
  MEMBER_BY_ID: (id: string) => `/team/${id}`,
} as const
