# Team Presentation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать скелет многостраничного Vue 3 сайта-презентации команды с FSD-архитектурой, 3 страницами, статическими данными через API-слой и RU/EN i18n.

**Architecture:** FSD (shared → entities → widgets → pages → app). Данные участников хранятся в `public/data/members.json` и читаются через Zod-валидированный ApiClient — функция готова к замене URL без рефакторинга. TanStack Query управляет серверным стейтом.

**Tech Stack:** Vue 3, TypeScript (strict), Vite, Vue Router 4, Pinia, TanStack Vue Query v5, Zod, Axios, vue-i18n v9, Vitest, MSW v2, CSS Modules

---

## File Map

```
team-presentation/
├── public/
│   └── data/
│       └── members.json
└── src/
    ├── app/
    │   ├── main.ts
    │   ├── App.vue
    │   ├── router/index.ts
    │   ├── i18n/
    │   │   ├── index.ts
    │   │   └── locales/
    │   │       ├── ru.json
    │   │       └── en.json
    │   └── styles/
    │       ├── variables.css
    │       └── reset.css
    ├── pages/
    │   ├── home/ui/home-page.vue
    │   ├── team/ui/team-page.vue
    │   └── member/ui/member-page.vue
    ├── widgets/
    │   ├── hero-section/ui/hero-section.vue
    │   ├── team-grid/ui/team-grid.vue
    │   ├── member-profile/ui/member-profile.vue
    │   └── the-navbar/ui/the-navbar.vue
    ├── entities/
    │   └── member/
    │       ├── api/
    │       │   ├── member.api.ts
    │       │   └── member.api.test.ts
    │       ├── model/
    │       │   ├── member.schemas.ts
    │       │   ├── member.schemas.test.ts
    │       │   └── member.queries.ts
    │       ├── ui/member-card/member-card.vue
    │       └── index.ts
    └── shared/
        ├── api/
        │   ├── api-client.ts
        │   ├── api-client-error.ts
        │   ├── api-routes.constants.ts
        │   └── mocks/
        │       ├── handlers.ts
        │       └── server.ts
        ├── ui/
        │   ├── base-tag/base-tag.vue
        │   ├── base-card/base-card.vue
        │   └── base-button/base-button.vue
        └── lib/
            ├── types.ts
            ├── routes.constants.ts
            └── api.constants.ts
```

---

### Task 1: Scaffold Vite project + install dependencies

**Files:**
- Create: `team-presentation/` (весь проект через Vite CLI)

- [ ] **Step 1: Удалить пустую папку-заглушку и создать проект через Vite**

```bash
cd /c/aiProjects/vue-projects
rm -rf team-presentation
npm create vite@latest team-presentation -- --template vue-ts
cd team-presentation
```

- [ ] **Step 2: Установить все зависимости**

```bash
npm install vue-router@4 pinia @tanstack/vue-query zod axios vue-i18n@9
npm install -D vitest @vue/test-utils @testing-library/vue msw @pinia/testing jsdom
```

- [ ] **Step 3: Проверить установку**

```bash
npm run dev
```

Expected: сервер поднялся на `http://localhost:5173`, в браузере видна стандартная Vite-заглушка.

- [ ] **Step 4: Остановить dev-сервер (Ctrl+C)**

- [ ] **Step 5: Коммит**

```bash
git init
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src/
git commit -m "chore: scaffold vite vue-ts project"
```

---

### Task 2: Configure tsconfig + vite aliases + vitest

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Create: `src/test-setup.ts`

- [ ] **Step 1: Заменить `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 2: Обновить `tsconfig.app.json` — включить strict-режим и алиасы**

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noUncheckedIndexAccess": true,
    "verbatimModuleSyntax": true,
    "types": ["vitest/globals"]
  }
}
```

- [ ] **Step 3: Создать `src/test-setup.ts`**

```typescript
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './shared/api/mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

- [ ] **Step 4: Добавить скрипт test в `package.json`**

В секцию `"scripts"` добавить:
```json
"test": "vitest"
```

- [ ] **Step 5: Коммит**

```bash
git add vite.config.ts tsconfig.app.json src/test-setup.ts package.json
git commit -m "chore: configure tsconfig strict mode, vite aliases, vitest"
```

---

### Task 3: FSD directory structure + global styles

**Files:**
- Create: `src/app/styles/variables.css`
- Create: `src/app/styles/reset.css`
- Create: все index.ts-заглушки для FSD-слоёв

- [ ] **Step 1: Удалить стандартные файлы Vite-шаблона**

```bash
rm -f src/components/HelloWorld.vue
rm -f src/assets/vue.svg
rmdir src/components 2>/dev/null || true
```

- [ ] **Step 2: Создать FSD-директории**

```bash
mkdir -p src/app/styles src/app/router src/app/i18n/locales
mkdir -p src/pages/home/ui src/pages/team/ui src/pages/member/ui
mkdir -p src/widgets/hero-section/ui src/widgets/team-grid/ui
mkdir -p src/widgets/member-profile/ui src/widgets/the-navbar/ui
mkdir -p src/entities/member/api src/entities/member/model src/entities/member/ui/member-card
mkdir -p src/shared/api/mocks src/shared/ui/base-tag src/shared/ui/base-card src/shared/ui/base-button
mkdir -p src/shared/lib
mkdir -p public/data
```

- [ ] **Step 3: Создать `src/app/styles/variables.css`**

```css
:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-accent: #0ea5e9;
  --color-accent-hover: #0284c7;
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-border: #e2e8f0;
  --color-tag-bg: #e0f2fe;
  --color-tag-text: #0284c7;
  --color-white: #ffffff;

  --shadow-s: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-m: 0 4px 6px rgba(0, 0, 0, 0.07);

  --space-xs: 4px;
  --space-s: 8px;
  --space-m: 16px;
  --space-l: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;

  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 16px;
  --radius-full: 9999px;

  --font-size-xs: 0.75rem;
  --font-size-s: 0.875rem;
  --font-size-m: 1rem;
  --font-size-l: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 2.5rem;
}
```

- [ ] **Step 4: Создать `src/app/styles/reset.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-bg);
  color: var(--color-text-primary);
  line-height: 1.5;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
}

button {
  font-family: inherit;
}
```

- [ ] **Step 5: Коммит**

```bash
git add src/app/styles/ public/
git commit -m "chore: add fsd directory structure and global styles"
```

---

### Task 4: shared/lib — types, constants, routes

**Files:**
- Create: `src/shared/lib/types.ts`
- Create: `src/shared/lib/api.constants.ts`
- Create: `src/shared/lib/routes.constants.ts`

- [ ] **Step 1: Создать `src/shared/lib/types.ts`**

```typescript
export type Nullable<T> = T | null
```

- [ ] **Step 2: Создать `src/shared/lib/api.constants.ts`**

```typescript
export const API_RESPONSE_TIMEOUT = {
  FAST: 5_000,
  NORMAL: 15_000,
  SLOW: 60_000,
} as const
```

- [ ] **Step 3: Создать `src/shared/lib/routes.constants.ts`**

```typescript
export const APP_ROUTES = {
  HOME: '/',
  TEAM: '/team',
  MEMBER: '/team/:id',
  MEMBER_BY_ID: (id: string) => `/team/${id}`,
} as const
```

- [ ] **Step 4: Коммит**

```bash
git add src/shared/lib/
git commit -m "feat(shared): add lib constants and utility types"
```

---

### Task 5: shared/api — ApiClient + ApiClientError + API_ROUTES

**Files:**
- Create: `src/shared/api/api-client-error.ts`
- Create: `src/shared/api/api-client.ts`
- Create: `src/shared/api/api-routes.constants.ts`

- [ ] **Step 1: Создать `src/shared/api/api-client-error.ts`**

```typescript
export class ApiClientError extends Error {
  title: string

  constructor(error: unknown) {
    super(error instanceof Error ? error.message : 'Unknown error')
    this.title = 'Ошибка запроса'
    this.name = 'ApiClientError'
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}
```

- [ ] **Step 2: Создать `src/shared/api/api-client.ts`**

```typescript
import axios, { type AxiosRequestConfig } from 'axios'
import type { ZodSchema } from 'zod'
import { ApiClientError } from './api-client-error'

interface RequestConfig<T> extends AxiosRequestConfig {
  schema: ZodSchema<T>
}

class ApiClient {
  private readonly baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get<T>(url: string, config: RequestConfig<T>): Promise<T> {
    const { schema, ...axiosConfig } = config
    try {
      const response = await axios.get(`${this.baseURL}${url}`, axiosConfig)
      return schema.parse(response.data)
    } catch (error) {
      throw new ApiClientError(error)
    }
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL ?? '')
```

- [ ] **Step 3: Создать `src/shared/api/api-routes.constants.ts`**

```typescript
export const API_ROUTES = {
  MEMBERS: {
    ALL: '/data/members.json',
  },
} as const
```

- [ ] **Step 4: Коммит**

```bash
git add src/shared/api/api-client.ts src/shared/api/api-client-error.ts src/shared/api/api-routes.constants.ts
git commit -m "feat(shared): add ApiClient with Zod validation"
```

---

### Task 6: Mock data + MSW handlers

**Files:**
- Create: `public/data/members.json`
- Create: `src/shared/api/mocks/handlers.ts`
- Create: `src/shared/api/mocks/server.ts`

- [ ] **Step 1: Создать `public/data/members.json`**

```json
[
  {
    "id": "1",
    "name": "Алексей Иванов",
    "role": "Frontend Developer",
    "photo": "https://i.pravatar.cc/150?img=1",
    "skills": ["Vue 3", "TypeScript", "Vite", "CSS Modules"],
    "social": {
      "github": "https://github.com",
      "linkedin": "https://linkedin.com",
      "telegram": "@alexey"
    },
    "email": "alexey@example.com"
  },
  {
    "id": "2",
    "name": "Мария Петрова",
    "role": "Backend Developer",
    "photo": "https://i.pravatar.cc/150?img=2",
    "skills": ["Node.js", "Go", "PostgreSQL", "Docker"],
    "social": {
      "github": "https://github.com",
      "linkedin": "https://linkedin.com"
    },
    "email": "maria@example.com"
  },
  {
    "id": "3",
    "name": "Дмитрий Сидоров",
    "role": "UI/UX Designer",
    "photo": "https://i.pravatar.cc/150?img=3",
    "skills": ["Figma", "Sketch", "Prototyping"],
    "social": {
      "linkedin": "https://linkedin.com",
      "telegram": "@dmitry"
    },
    "email": "dmitry@example.com"
  },
  {
    "id": "4",
    "name": "Анна Козлова",
    "role": "DevOps Engineer",
    "photo": "https://i.pravatar.cc/150?img=4",
    "skills": ["Docker", "Kubernetes", "CI/CD", "AWS"],
    "social": {
      "github": "https://github.com",
      "telegram": "@anna"
    },
    "email": "anna@example.com"
  }
]
```

- [ ] **Step 2: Создать `src/shared/api/mocks/handlers.ts`**

```typescript
import { http, HttpResponse } from 'msw'

const membersData = [
  {
    id: '1',
    name: 'Алексей Иванов',
    role: 'Frontend Developer',
    photo: 'https://i.pravatar.cc/150?img=1',
    skills: ['Vue 3', 'TypeScript'],
    social: { github: 'https://github.com' },
    email: 'alexey@example.com',
  },
  {
    id: '2',
    name: 'Мария Петрова',
    role: 'Backend Developer',
    photo: 'https://i.pravatar.cc/150?img=2',
    skills: ['Node.js', 'Go'],
    social: { linkedin: 'https://linkedin.com' },
    email: 'maria@example.com',
  },
]

export const handlers = [
  http.get('/data/members.json', () => HttpResponse.json(membersData)),
]
```

- [ ] **Step 3: Создать `src/shared/api/mocks/server.ts`**

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

- [ ] **Step 4: Коммит**

```bash
git add public/data/members.json src/shared/api/mocks/
git commit -m "feat(shared): add mock data and MSW handlers"
```

---

### Task 7: entities/member — Zod-схемы + тесты

**Files:**
- Create: `src/entities/member/model/member.schemas.ts`
- Create: `src/entities/member/model/member.schemas.test.ts`

- [ ] **Step 1: Написать тест**

```typescript
// src/entities/member/model/member.schemas.test.ts
import { describe, it, expect } from 'vitest'
import { memberSchema, membersListSchema } from './member.schemas'

const validMember = {
  id: '1',
  name: 'John Doe',
  role: 'Developer',
  photo: 'https://example.com/photo.jpg',
  skills: ['Vue', 'TypeScript'],
  social: { github: 'https://github.com/john' },
}

describe('memberSchema', () => {
  it('parses a valid member', () => {
    expect(() => memberSchema.parse(validMember)).not.toThrow()
  })

  it('parses member without optional fields', () => {
    const { email: _email, ...withoutEmail } = { ...validMember, email: 'a@b.com' }
    expect(() => memberSchema.parse(withoutEmail)).not.toThrow()
  })

  it('rejects missing required fields', () => {
    expect(() => memberSchema.parse({ id: '1' })).toThrow()
  })

  it('rejects invalid photo url', () => {
    expect(() => memberSchema.parse({ ...validMember, photo: 'not-a-url' })).toThrow()
  })

  it('rejects invalid email', () => {
    expect(() => memberSchema.parse({ ...validMember, email: 'not-email' })).toThrow()
  })
})

describe('membersListSchema', () => {
  it('parses array of valid members', () => {
    expect(() => membersListSchema.parse([validMember])).not.toThrow()
  })

  it('rejects non-array input', () => {
    expect(() => membersListSchema.parse(validMember)).toThrow()
  })
})
```

- [ ] **Step 2: Запустить тест — убедиться что падает**

```bash
npx vitest run src/entities/member/model/member.schemas.test.ts
```

Expected: FAIL — `Cannot find module './member.schemas'`

- [ ] **Step 3: Создать `src/entities/member/model/member.schemas.ts`**

```typescript
import { z } from 'zod'

const socialLinksSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  telegram: z.string().optional(),
})

export const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  photo: z.string().url(),
  skills: z.array(z.string()),
  social: socialLinksSchema,
  email: z.string().email().optional(),
})

export const membersListSchema = z.array(memberSchema)

export type Member = z.infer<typeof memberSchema>
export type SocialLinks = z.infer<typeof socialLinksSchema>
```

- [ ] **Step 4: Запустить тест — убедиться что проходит**

```bash
npx vitest run src/entities/member/model/member.schemas.test.ts
```

Expected: PASS — все 6 тестов зелёные

- [ ] **Step 5: Коммит**

```bash
git add src/entities/member/model/member.schemas.ts src/entities/member/model/member.schemas.test.ts
git commit -m "feat(member): add zod schemas with tests"
```

---

### Task 8: entities/member — API-функции + тесты

**Files:**
- Create: `src/entities/member/api/member.api.ts`
- Create: `src/entities/member/api/member.api.test.ts`

- [ ] **Step 1: Написать тест**

```typescript
// src/entities/member/api/member.api.test.ts
import { describe, it, expect } from 'vitest'
import { server } from '@/shared/api/mocks/server'
import { http, HttpResponse } from 'msw'
import { fetchMembers, fetchMemberById } from './member.api'

describe('fetchMembers', () => {
  it('returns list of members', async () => {
    const members = await fetchMembers()
    expect(members).toHaveLength(2)
    expect(members[0]).toMatchObject({ id: '1', name: 'Алексей Иванов' })
  })
})

describe('fetchMemberById', () => {
  it('returns member with matching id', async () => {
    const member = await fetchMemberById('1')
    expect(member.id).toBe('1')
    expect(member.name).toBe('Алексей Иванов')
  })

  it('throws ApiClientError when member not found', async () => {
    const member = await fetchMemberById('999').catch(e => e)
    expect(member).toBeInstanceOf(Error)
    expect(member.title).toBe('Участник не найден')
  })

  it('throws ApiClientError on network error', async () => {
    server.use(
      http.get('/data/members.json', () => HttpResponse.error())
    )
    await expect(fetchMemberById('1')).rejects.toMatchObject({ name: 'ApiClientError' })
  })
})
```

- [ ] **Step 2: Запустить тест — убедиться что падает**

```bash
npx vitest run src/entities/member/api/member.api.test.ts
```

Expected: FAIL — `Cannot find module './member.api'`

- [ ] **Step 3: Создать `src/entities/member/api/member.api.ts`**

```typescript
import { apiClient } from '@/shared/api/api-client'
import { API_ROUTES } from '@/shared/api/api-routes.constants'
import { API_RESPONSE_TIMEOUT } from '@/shared/lib/api.constants'
import { isApiClientError } from '@/shared/api/api-client-error'
import { ApiClientError } from '@/shared/api/api-client-error'
import { membersListSchema, memberSchema } from '../model/member.schemas'
import type { Member } from '../model/member.schemas'

export async function fetchMembers(): Promise<Member[]> {
  try {
    return await apiClient.get(API_ROUTES.MEMBERS.ALL, {
      schema: membersListSchema,
      timeout: API_RESPONSE_TIMEOUT.NORMAL,
    })
  } catch (error) {
    if (isApiClientError(error)) {
      error.title = 'Не удалось получить список команды'
    }
    throw error
  }
}

export async function fetchMemberById(id: string): Promise<Member> {
  try {
    const members = await fetchMembers()
    const member = members.find((m) => m.id === id)
    if (!member) {
      const error = new ApiClientError(new Error(`Member ${id} not found`))
      error.title = 'Участник не найден'
      throw error
    }
    return memberSchema.parse(member)
  } catch (error) {
    if (isApiClientError(error)) throw error
    throw new ApiClientError(error)
  }
}
```

- [ ] **Step 4: Запустить тест — убедиться что проходит**

```bash
npx vitest run src/entities/member/api/member.api.test.ts
```

Expected: PASS — все 4 теста зелёные

- [ ] **Step 5: Коммит**

```bash
git add src/entities/member/api/
git commit -m "feat(member): add api functions with tests"
```

---

### Task 9: entities/member — TanStack Query composables + index.ts

**Files:**
- Create: `src/entities/member/model/member.queries.ts`
- Create: `src/entities/member/index.ts`

- [ ] **Step 1: Создать `src/entities/member/model/member.queries.ts`**

```typescript
import { computed } from 'vue'
import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { keepPreviousData } from '@tanstack/vue-query'
import { fetchMembers, fetchMemberById } from '../api/member.api'

export function useMembersQuery() {
  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    placeholderData: keepPreviousData,
    staleTime: 0,
  })
}

export function useMemberQuery(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['member', id.value]),
    queryFn: () => fetchMemberById(id.value),
    staleTime: 0,
  })
}
```

- [ ] **Step 2: Создать `src/entities/member/index.ts`**

```typescript
export type { Member, SocialLinks } from './model/member.schemas'
export { useMembersQuery, useMemberQuery } from './model/member.queries'
export { default as MemberCard } from './ui/member-card/member-card.vue'
```

- [ ] **Step 3: Коммит**

```bash
git add src/entities/member/model/member.queries.ts src/entities/member/index.ts
git commit -m "feat(member): add tanstack query composables and public api"
```

---

### Task 10: shared/ui — base компоненты

**Files:**
- Create: `src/shared/ui/base-tag/base-tag.vue`
- Create: `src/shared/ui/base-card/base-card.vue`
- Create: `src/shared/ui/base-button/base-button.vue`

- [ ] **Step 1: Создать `src/shared/ui/base-tag/base-tag.vue`**

```vue
<script setup lang="ts">
interface Props {
  label: string
}
defineProps<Props>()
</script>

<template>
  <span :class="$style.tag">{{ label }}</span>
</template>

<style module>
.tag {
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--radius-s);
  font-size: var(--font-size-xs);
  font-weight: 500;
  white-space: nowrap;
}
</style>
```

- [ ] **Step 2: Создать `src/shared/ui/base-card/base-card.vue`**

```vue
<script setup lang="ts">
</script>

<template>
  <div :class="$style.card">
    <slot />
  </div>
</template>

<style module>
.card {
  background: var(--color-surface);
  border-radius: var(--radius-m);
  box-shadow: var(--shadow-s);
  padding: var(--space-m);
}
</style>
```

- [ ] **Step 3: Создать `src/shared/ui/base-button/base-button.vue`**

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost'
}
withDefaults(defineProps<Props>(), { variant: 'primary' })
</script>

<template>
  <button :class="[$style.button, $style[variant]]">
    <slot />
  </button>
</template>

<style module>
.button {
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-m);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-s);
  font-weight: 600;
  transition: opacity 0.15s;
}
.button:hover {
  opacity: 0.85;
}
.primary {
  background: var(--color-accent);
  color: var(--color-white);
}
.ghost {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}
</style>
```

- [ ] **Step 4: Коммит**

```bash
git add src/shared/ui/
git commit -m "feat(shared): add base ui components"
```

---

### Task 11: entities/member — MemberCard компонент

**Files:**
- Create: `src/entities/member/ui/member-card/member-card.vue`

- [ ] **Step 1: Создать `src/entities/member/ui/member-card/member-card.vue`**

```vue
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
```

- [ ] **Step 2: Коммит**

```bash
git add src/entities/member/ui/
git commit -m "feat(member): add MemberCard component"
```

---

### Task 12: app/i18n — vue-i18n + locale файлы

**Files:**
- Create: `src/app/i18n/locales/ru.json`
- Create: `src/app/i18n/locales/en.json`
- Create: `src/app/i18n/index.ts`

- [ ] **Step 1: Создать `src/app/i18n/locales/ru.json`**

```json
{
  "nav": {
    "home": "Главная",
    "team": "Команда"
  },
  "home": {
    "title": "Привет, мы — команда",
    "subtitle": "Профессионалы, которые создают крутые продукты вместе",
    "cta": "Познакомиться с командой"
  },
  "team": {
    "title": "Наша команда"
  },
  "member": {
    "skills": "Навыки"
  },
  "common": {
    "loading": "Загрузка...",
    "error": "Что-то пошло не так"
  }
}
```

- [ ] **Step 2: Создать `src/app/i18n/locales/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "team": "Team"
  },
  "home": {
    "title": "Hi, we are a team",
    "subtitle": "Professionals building great products together",
    "cta": "Meet the team"
  },
  "team": {
    "title": "Our Team"
  },
  "member": {
    "skills": "Skills"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong"
  }
}
```

- [ ] **Step 3: Создать `src/app/i18n/index.ts`**

```typescript
import { createI18n } from 'vue-i18n'
import ru from './locales/ru.json'
import en from './locales/en.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages: { ru, en },
})
```

- [ ] **Step 4: Коммит**

```bash
git add src/app/i18n/
git commit -m "feat(app): add vue-i18n with ru/en locales"
```

---

### Task 13: app/router

**Files:**
- Create: `src/app/router/index.ts`

- [ ] **Step 1: Создать `src/app/router/index.ts`**

```typescript
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
      path: '/:pathMatch(.*)*',
      redirect: APP_ROUTES.HOME,
    },
  ],
})
```

- [ ] **Step 2: Коммит**

```bash
git add src/app/router/
git commit -m "feat(app): add vue-router with lazy-loaded pages"
```

---

### Task 14: Widgets — hero-section, team-grid, member-profile, the-navbar

**Files:**
- Create: `src/widgets/hero-section/ui/hero-section.vue`
- Create: `src/widgets/team-grid/ui/team-grid.vue`
- Create: `src/widgets/member-profile/ui/member-profile.vue`
- Create: `src/widgets/the-navbar/ui/the-navbar.vue`

- [ ] **Step 1: Создать `src/widgets/hero-section/ui/hero-section.vue`**

```vue
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
```

- [ ] **Step 2: Создать `src/widgets/team-grid/ui/team-grid.vue`**

```vue
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
```

- [ ] **Step 3: Создать `src/widgets/member-profile/ui/member-profile.vue`**

```vue
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
```

- [ ] **Step 4: Создать `src/widgets/the-navbar/ui/the-navbar.vue`**

```vue
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
```

- [ ] **Step 5: Коммит**

```bash
git add src/widgets/
git commit -m "feat(widgets): add hero-section, team-grid, member-profile, the-navbar"
```

---

### Task 15: Pages + App.vue + main.ts — сборка приложения

**Files:**
- Create: `src/pages/home/ui/home-page.vue`
- Create: `src/pages/team/ui/team-page.vue`
- Create: `src/pages/member/ui/member-page.vue`
- Modify: `src/app/App.vue`
- Modify: `src/app/main.ts` (переместить из `src/main.ts`)

- [ ] **Step 1: Создать `src/pages/home/ui/home-page.vue`**

```vue
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
```

- [ ] **Step 2: Создать `src/pages/team/ui/team-page.vue`**

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMembersQuery } from '@/entities/member'
import TeamGrid from '@/widgets/team-grid/ui/team-grid.vue'

const { t } = useI18n()
const { data: members, isPending, isError } = useMembersQuery()
</script>

<template>
  <main :class="$style.page">
    <h1 :class="$style.title">{{ t('team.title') }}</h1>
    <TeamGrid v-if="members" :members="members" />
    <p v-else-if="isPending" :class="$style.status">{{ t('common.loading') }}</p>
    <p v-else-if="isError" :class="$style.status">{{ t('common.error') }}</p>
  </main>
</template>

<style module>
.page {
  padding: var(--space-xl) var(--space-l);
  max-width: 1400px;
  margin: 0 auto;
}
.title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xl);
}
.status {
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 3: Создать `src/pages/member/ui/member-page.vue`**

```vue
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
```

- [ ] **Step 4: Создать `src/app/App.vue`** (заменить существующий `src/App.vue`)

```vue
<script setup lang="ts">
import TheNavbar from '@/widgets/the-navbar/ui/the-navbar.vue'
</script>

<template>
  <div :class="$style.app">
    <TheNavbar />
    <RouterView />
  </div>
</template>

<style module>
.app {
  min-height: 100vh;
  background: var(--color-bg);
}
</style>
```

Так как Vite создаёт `src/App.vue`, нужно переместить его в `src/app/App.vue` и обновить `index.html`:

```bash
cp src/App.vue src/app/App.vue
rm src/App.vue
```

- [ ] **Step 5: Создать `src/app/main.ts`** (заменить `src/main.ts`)

```typescript
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './styles/variables.css'
import './styles/reset.css'

createApp(App)
  .use(VueQueryPlugin)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app')
```

```bash
cp src/main.ts src/app/main.ts
rm src/main.ts
```

- [ ] **Step 6: Обновить `index.html` — указать на `src/app/main.ts`**

Найти строку:
```html
<script type="module" src="/src/main.ts"></script>
```
Заменить на:
```html
<script type="module" src="/src/app/main.ts"></script>
```

- [ ] **Step 7: Удалить лишние файлы Vite-шаблона**

```bash
rm -f src/style.css src/assets/vue.svg src/vite-env.d.ts public/vite.svg
```

Добавить `src/vite-env.d.ts` в `src/`:
```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 8: Запустить dev-сервер и проверить**

```bash
npm run dev
```

Проверить вручную:
- `http://localhost:5173/` — Home page с hero-секцией и превью участников
- `http://localhost:5173/team` — Team page с 4 карточками в сетке
- `http://localhost:5173/team/1` — Member page с профилем Алексея Иванова
- Кнопка EN/RU переключает язык навбара и заголовков
- При сужении окна до 1023px сетка перестраивается в 2 колонки, до 639px — в 1

- [ ] **Step 9: Запустить все тесты**

```bash
npm run test
```

Expected: все тесты PASS

- [ ] **Step 10: Коммит**

```bash
git add src/pages/ src/app/App.vue src/app/main.ts src/vite-env.d.ts index.html
git commit -m "feat: wire up pages, app shell and main entry — skeleton complete"
```

---

## Self-Review

**Spec coverage:**

| Требование из спека                          | Задача      |
|----------------------------------------------|-------------|
| 3 страницы: Home, Team, Member               | Task 15     |
| FSD-архитектура со всеми слоями              | Tasks 3–15  |
| Member: фото, имя, должность, навыки, соцсети, email | Tasks 7, 10, 11, 14 |
| Статика в JSON с готовым API-слоем           | Tasks 5, 6, 8 |
| Responsive grid 4→3→2→1                     | Task 14     |
| Light/Clean стиль + CSS-переменные           | Task 3      |
| RU + EN i18n через vue-i18n                  | Task 12     |
| Zod-схемы + TypeScript типы                  | Task 7      |
| TanStack Query                               | Task 9      |
| Тесты: схемы + API функции                   | Tasks 7, 8  |
| MSW для изоляции тестов                      | Task 6      |
| Vue Router с lazy-loading                    | Task 13     |

**Placeholder scan:** все шаги содержат конкретный код, нет TBD/TODO.

**Type consistency:** `Member` определён в `member.schemas.ts` Task 7, экспортируется через `index.ts` Task 9, используется во всех последующих задачах без изменений. `APP_ROUTES.MEMBER_BY_ID` определён в Task 4, используется в Tasks 11 и 14.
