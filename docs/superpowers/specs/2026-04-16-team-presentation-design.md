# Team Presentation — Design Spec

**Date:** 2026-04-16  
**Status:** Approved

---

## Overview

Многостраничный сайт-презентация команды. Минималистичная структура из 3 страниц, светлый / clean стиль, двуязычный интерфейс (RU + EN).

---

## Стек

- Vue 3 + `<script setup lang="ts">`
- TypeScript (strict mode)
- Vite
- Pinia (глобальный клиентский стейт)
- TanStack Query / Vue Query (серверный стейт)
- Zod (валидация схем, вывод типов)
- Axios через кастомный `ApiClient`
- Vue Router 4
- vue-i18n (i18n, RU + EN)
- CSS Modules

---

## Архитектура: FSD

```
src/
├── app/
│   ├── router/          # маршруты + lazy-loading страниц
│   ├── i18n/            # инициализация vue-i18n, локали
│   ├── styles/          # глобальные CSS-переменные, reset
│   ├── App.vue
│   └── main.ts
├── pages/
│   ├── home/            # Home page
│   ├── team/            # Team list page
│   └── member/          # Member profile page (dynamic route /team/:id)
├── widgets/
│   ├── hero-section/    # Герой-блок на Home
│   ├── team-grid/       # Responsive сетка карточек на Team page
│   └── member-profile/  # Полный профиль на Member page
├── entities/
│   └── member/
│       ├── api/         # fetchMembers(), fetchMemberById()
│       ├── model/       # Zod-схемы, TypeScript типы, queries
│       ├── ui/          # MemberCard компонент
│       └── index.ts     # публичный API модуля
└── shared/
    ├── api/             # ApiClient, API_ROUTES, обработка ошибок
    ├── ui/              # base-card, base-button, base-tag
    └── lib/             # APP_ROUTES, константы, утилитарные типы
```

Правило импортов: `shared → entities → widgets → pages → app`

---

## Страницы и роутинг

| Путь        | Компонент          | Описание                              |
|-------------|-------------------|---------------------------------------|
| `/`         | `pages/home`      | Hero-секция + превью участников       |
| `/team`     | `pages/team`      | Responsive сетка карточек команды     |
| `/team/:id` | `pages/member`    | Профиль конкретного участника         |

Все страницы — lazy-loaded через `defineAsyncComponent` / динамический `import()`.

---

## Модель данных

```typescript
// entities/member/model/member.schemas.ts

const socialLinksSchema = z.object({
  github:   z.string().url().optional(),
  linkedin: z.string().url().optional(),
  telegram: z.string().optional(),
});

const memberSchema = z.object({
  id:     z.string(),
  name:   z.string(),
  role:   z.string(),       // "Frontend Developer"
  photo:  z.string().url(),
  skills: z.array(z.string()),
  social: socialLinksSchema,
  email:  z.string().email().optional(),
});

type Member = z.infer<typeof memberSchema>;
```

---

## Данные: статика с готовым API-слоем

Данные хранятся в `public/data/members.json`. API-функции написаны так, чтобы замена на реальный endpoint требовала только изменения `API_ROUTES` и убирания моков:

```typescript
// entities/member/api/member.api.ts
export async function fetchMembers(): Promise<Member[]> {
  return apiClient.get(API_ROUTES.MEMBERS.ALL, {
    schema: membersListSchema,
    timeout: API_RESPONSE_TIMEOUT.NORMAL,
  });
}

export async function fetchMemberById(id: string): Promise<Member> {
  return apiClient.get(API_ROUTES.MEMBERS.BY_ID(id), {
    schema: memberSchema,
    timeout: API_RESPONSE_TIMEOUT.NORMAL,
  });
}
```

---

## Визуальный стиль

- **Тема:** Light / Clean
- **Палитра:** белый/серый фон (`#f8fafc`, `#fff`), голубой акцент (`#0ea5e9`), тёмный текст (`#0f172a`), приглушённый текст (`#64748b`)
- **Теги навыков:** `background: #e0f2fe; color: #0284c7`
- **Карточки:** `border-radius: 8px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`
- **CSS-переменные** определены в `app/styles/variables.css`, используются через `var(--color-accent)` и т.д.

---

## Responsive Grid (Team page)

| Брейкпоинт   | Колонок |
|-------------|---------|
| `≥ 1280px`  | 4       |
| `≥ 1024px`  | 3       |
| `≥ 640px`   | 2       |
| `< 640px`   | 1       |

Реализуется через CSS Grid в CSS Modules:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-m);
}
@media (max-width: 1279px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 1023px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 639px)  { .grid { grid-template-columns: 1fr; } }
```

---

## i18n

- Библиотека: `vue-i18n`
- Локали: `ru`, `en`
- JSON-файлы переводов: `app/i18n/locales/ru.json`, `app/i18n/locales/en.json`
- Переключатель языка в навигации (EN / RU)
- Язык по умолчанию: `ru`

---

## Компоненты shared/ui

| Компонент      | Описание                        |
|---------------|---------------------------------|
| `base-tag`    | Тег навыка с цветовым вариантом |
| `base-card`   | Базовая карточка с тенью        |
| `base-button` | Кнопка с вариантами primary/ghost |

---

## Стейт-менеджмент

| Тип данных             | Инструмент     |
|-----------------------|----------------|
| Список участников     | TanStack Query |
| Профиль участника     | TanStack Query |
| Текущий язык интерфейса | vue-i18n (встроен) |

Pinia используется минимально — только если появятся клиентские состояния (фильтры, UI-флаги).

---

## Что НЕ входит в скелет

- Авторизация
- Форма обратной связи
- CMS / редактор контента
- Анимации и transitions (добавляются позже)
