# Spec: Team Pagination, Skill Filters & Favorites

## Context

Текущая страница команды (`/team`) отображает всех участников в виде сетки без пагинации и фильтрации. Данные захардкожены в `public/` как статический JSON. Компонент `member-card` не поддерживает состояние "избранное". Страницы избранного не существует.

## Goals

1. Расширить список участников команды до 30+ человек.
2. Добавить пагинацию на странице `/team`.
3. Добавить фильтрацию карточек по навыкам (skills).
4. Добавить возможность добавлять участников в избранное.
5. Создать отдельную страницу `/favorites` со списком избранных участников.

---

## Requirements

### 1. Данные — расширение списка участников

- В статическом JSON (`public/data/members.json` или аналог) должно быть не менее 30 участников.
- Каждый участник сохраняет текущую схему: `id`, `name`, `role`, `photo`, `skills`, `social`, `email?`.
- Навыки (`skills`) должны охватывать широкий спектр: Frontend, Backend, DevOps, Design, QA, Mobile и т.д. — чтобы фильтрация была наглядной.

### 2. Пагинация на странице команды

- По умолчанию на странице отображается **12 карточек**.
- Под сеткой — компонент пагинации с номерами страниц и кнопками «Назад» / «Вперёд».
- При смене страницы список плавно обновляется (без перехода на новый роут).
- Текущая страница и размер страницы хранятся в `memberListStore` (Pinia).
- При изменении фильтра (см. п. 3) текущая страница сбрасывается на 1.
- Компонент пагинации: `shared/ui/base-pagination/base-pagination.vue`.

### 3. Фильтрация по навыкам

- Над сеткой отображается список уникальных навыков из всех участников в виде кликабельных тегов (`BaseTag`).
- Можно выбрать **несколько** навыков одновременно (мульти-выбор).
- Логика фильтрации: участник отображается, если у него есть **хотя бы один** из выбранных навыков (OR-логика).
- Если ни один фильтр не выбран — показываются все участники.
- Активный фильтр визуально отличается от неактивного (модификатор `--active` или отдельный prop у `BaseTag`).
- Выбранные фильтры хранятся в `memberListStore`.
- Сброс фильтров — кнопка «Сбросить» (появляется только при наличии активных фильтров).

### 4. Избранное

#### 4.1 Добавление/удаление

- На каждой карточке (`member-card`) появляется кнопка-иконка "сердце" в правом верхнем углу.
- Клик по иконке добавляет / убирает участника из избранного.
- Иконка меняет визуальное состояние (заполненное / незаполненное сердце).
- Клик по иконке **не должен** вызывать переход на страницу профиля (stopPropagation).

#### 4.2 Хранение состояния

- Состояние избранного хранится в `favoritesStore` (Pinia, `entities/member/model/` или `features/favorites/`).
- Список ID избранных участников персистируется в `localStorage` через Pinia plugin или `watch`.
- Тип: `Set<string>` или `string[]`.

#### 4.3 Страница избранного `/favorites`

- Новый маршрут `APP_ROUTES.FAVORITES = '/favorites'`.
- Страница: `pages/favorites/ui/favorites-page.vue`.
- Отображает сетку карточек только избранных участников (переиспользует `TeamGrid`).
- Если список пуст — показывает заглушку: иконка + текст «Вы ещё не добавили никого в избранное».
- Ссылка на страницу избранного добавляется в `the-navbar` (иконка сердца + счётчик).
- Пагинация на странице избранного — **опционально** (только если избранных > 12).

### 5. Навигация

- В `the-navbar` добавить ссылку «Избранное» с иконкой сердца.
- На иконке отображается бейдж с количеством избранных (скрыт при 0).

---

## Architecture

### Новые модули / файлы

```
src/
├── features/
│   └── favorites/
│       ├── model/
│       │   └── favorites.store.ts       # Pinia store: ids[], addFavorite, removeFavorite, isFavorite
│       └── index.ts
├── pages/
│   └── favorites/
│       └── ui/
│           └── favorites-page.vue
└── shared/
    └── ui/
        └── base-pagination/
            └── base-pagination.vue      # Props: total, pageSize, modelValue; Emits: update:modelValue
```

### Изменяемые файлы

| Файл | Изменение |
|------|-----------|
| `entities/member/model/member.queries.ts` | Добавить параметры `page`, `pageSize`, `skills` для фильтрации на клиенте |
| `widgets/team-grid/ui/team-grid.vue` | Принимать уже отфильтрованный/paginated список, либо делегировать |
| `pages/team/ui/team-page.vue` | Интегрировать фильтры + пагинацию |
| `widgets/the-navbar/ui/the-navbar.vue` | Добавить ссылку на избранное |
| `shared/lib/routes.constants.ts` | Добавить `FAVORITES` |
| `app/router` | Зарегистрировать маршрут `/favorites` |
| `entities/member/ui/member-card/member-card.vue` | Добавить кнопку избранного |

### Стейт (Pinia)

```typescript
// features/favorites/model/favorites.store.ts
export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>(/* из localStorage */)
  
  function addFavorite(id: string): void { ... }
  function removeFavorite(id: string): void { ... }
  function isFavorite(id: string): boolean { ... }
  
  return { ids, addFavorite, removeFavorite, isFavorite }
})
```

```typescript
// entities/member/model/member-list.store.ts (новый)
export const useMemberListStore = defineStore('member-list', () => {
  const currentPage = ref(1)
  const pageSize = ref(12)
  const activeSkills = ref<string[]>([])
  
  function setPage(page: number): void { ... }
  function toggleSkill(skill: string): void { ... }
  function resetFilters(): void { ... }
  
  return { currentPage, pageSize, activeSkills, setPage, toggleSkill, resetFilters }
})
```

---

## Out of Scope

- Серверная пагинация / фильтрация (данные остаются статическим JSON).
- Аутентификация и синхронизация избранного между устройствами.
- Drag-and-drop сортировка избранного.
- Поиск по имени.
