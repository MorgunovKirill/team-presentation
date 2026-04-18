# План: Пагинация команды + фильтр по скиллам + избранное

## Context

Страница `/team` сейчас показывает 4 участника из статического JSON (`public/data/members.json`) одной плоской сеткой — без пагинации и фильтрации. У `member-card` нет состояния «избранное», страницы `/favorites` не существует. Нужно расширить датасет до 30+ человек, добавить клиентскую пагинацию (12 на страницу), мульти-фильтр по скиллам (OR), избранное с персистом в localStorage и отдельной страницей. Спека: `specs/team-pagination-filters-favorites.md`.

## Решения (подтверждены пользователем)

- **UI фильтров** живёт в `features/filter-members-by-skill/` (FSD: действие = фича). Состояние `activeSkills` + `currentPage` + `pageSize` — в `entities/member/model/member-list.store.ts`, как в спеке.
- **Иконка сердца** — inline SVG (два варианта: outline / filled) в `member-card` и `the-navbar`. Без новых зависимостей.
- **30 участников** — захардкодить вручную в `public/data/members.json` (детерминированные данные совместимы со снапшотами и тестами).

## Повторно используем

- `useQuery` + `keepPreviousData` из `@tanstack/vue-query` — уже импортируется в `src/entities/member/model/member.queries.ts:2`.
- `BaseTag` (`src/shared/ui/base-tag/base-tag.vue`) — добавим `active` prop для визуального состояния выбранного фильтра.
- `TeamGrid` (`src/widgets/team-grid/ui/team-grid.vue`) — принимает `members: Member[]`, переиспользуется на `/favorites`.
- `ApiClient` + Zod (`membersListSchema`) — схема/pipeline данных не меняются.
- `APP_ROUTES` (`src/shared/lib/routes.constants.ts:1-6`) — добавим `FAVORITES`.
- Паттерн dynamic-import в `src/app/router/index.ts` — новый маршрут регистрируем так же.
- MSW + Vitest — паттерн из `src/entities/member/api/member.api.test.ts` копируется для новых тестов.

## Шаги реализации

### 1. Данные

- `public/data/members.json` — расширить до 30 объектов. Сохранить существующие 4 id, добавить `m-5`…`m-30` с реалистичными ФИО, ролями, скиллами (Frontend/Backend/DevOps/Design/QA/Mobile/DataScience), URL аватаров (dicebear или picsum), соц-ссылками. Скиллы распределить так, чтобы каждый из ~12 уникальных тегов встречался у 3-6 человек (иначе фильтр бесполезен).
- `src/shared/api/mocks/` (MSW) — обновить мок-ответ, если он содержит фикстуры для тестов, либо синхронизировать с `members.json`.

### 2. Pinia stores

- `src/entities/member/model/member-list.store.ts` (новый):
  - `currentPage = ref(1)`, `pageSize = ref(12)`, `activeSkills = ref<string[]>([])`.
  - `setPage(n)`, `toggleSkill(s)` (сбрасывает `currentPage → 1`), `resetFilters()`, `setPageSize(n)`.
  - Экспортировать через `src/entities/member/index.ts`.
- `src/features/favorites/model/favorites.store.ts` (новый):
  - `ids = ref<string[]>(loadFromStorage())`.
  - `addFavorite(id)`, `removeFavorite(id)`, `toggleFavorite(id)`, `isFavorite(id): boolean`, `count = computed(ids.length)`.
  - Персист: `watch(ids, (v) => localStorage.setItem('favorites', JSON.stringify(v)), { deep: true })`.
  - Ключ localStorage: `'team-presentation:favorites:v1'` (версионируем).
- `src/features/favorites/index.ts` — публичный API (`useFavoritesStore`).

### 3. Базовый UI

- `src/shared/ui/base-pagination/base-pagination.vue` (новый):
  - Props: `total: number`, `pageSize: number`, `modelValue: number`.
  - Emits: `update:modelValue`.
  - Рендер: «Назад» + окно номеров (1 … 4 5 [6] 7 8 … 12) + «Вперёд». Использует `BaseButton variant="ghost"` для кнопок и CSS Modules.
  - Вычисляет `totalPages = ceil(total / pageSize)`. При `totalPages <= 1` компонент не рендерится.
- `src/shared/ui/base-tag/base-tag.vue` — добавить необязательный `active?: boolean` + `clickable?: boolean`; при `clickable` делает `role="button"` и курсор pointer. CSS-модификатор `.active`.

### 4. Feature: фильтр по скиллам

- `src/features/filter-members-by-skill/ui/skill-filter.vue`:
  - Props: `members: Member[]` (нужен для расчёта уникальных скиллов).
  - Подключается к `useMemberListStore` — читает `activeSkills`, вызывает `toggleSkill`.
  - Computed `allSkills = computed(() => unique(members.flatMap(m => m.skills)).sort())`.
  - Рендер: заголовок `t('team.filters.title')` + сетка кликабельных `BaseTag :active` + кнопка `BaseButton variant="ghost"` «Сбросить» (`v-if="activeSkills.length"`).
- `src/features/filter-members-by-skill/lib/filter-members.ts`:
  - `filterMembersBySkills(members, activeSkills): Member[]` — чистая функция, OR-логика, пустой массив = все.
- `src/features/filter-members-by-skill/index.ts` — экспортирует `SkillFilter`, `filterMembersBySkills`.

### 5. Feature: избранное (кнопка)

- `src/features/favorites/ui/favorite-toggle.vue`:
  - Props: `memberId: string`.
  - Кнопка-иконка с двумя SVG (outline/filled), aria-label из i18n, `@click.stop.prevent="toggle"`.
  - Читает `isFavorite(memberId)` из стора.
- Подключить в `src/entities/member/ui/member-card/member-card.vue` — абсолютное позиционирование в правом верхнем углу, z-index выше картинки.
  - Проверить, что `@click` карточки продолжает работать (stopPropagation у кнопки).

### 6. Страницы

- `src/pages/team/ui/team-page.vue`:
  - Читает `members` из `useMembersQuery`, `{ currentPage, pageSize, activeSkills }` из `useMemberListStore` (через `storeToRefs`).
  - `filtered = computed(filterMembersBySkills(members, activeSkills))`.
  - `pageItems = computed(() => filtered.slice((currentPage-1)*pageSize, currentPage*pageSize))`.
  - Разметка: `<SkillFilter :members="members ?? []" />` → `<TeamGrid :members="pageItems" />` → `<BasePagination :total="filtered.length" :page-size="pageSize" v-model="currentPage" />`.
  - Пустое состояние при `filtered.length === 0`: локализованное сообщение (`team.empty`).
- `src/pages/favorites/ui/favorites-page.vue` (новая):
  - `const { ids } = storeToRefs(useFavoritesStore())`, `const { data: members } = useMembersQuery()`.
  - `favorites = computed(() => (members.value ?? []).filter(m => ids.value.includes(m.id)))`.
  - Рендер: `<h1>{{ t('favorites.title') }}</h1>` + `<TeamGrid v-if="favorites.length" :members="favorites" />` + иначе `<EmptyState>` (inline, SVG-сердце + текст `t('favorites.empty')`). Пагинацию не добавляем (spec помечает как опциональную).

### 7. Роутер и навбар

- `src/shared/lib/routes.constants.ts` — добавить `FAVORITES: '/favorites'`.
- `src/app/router/index.ts` — зарегистрировать маршрут `{ path: APP_ROUTES.FAVORITES, component: () => import('@/pages/favorites/ui/favorites-page.vue') }`.
- `src/widgets/the-navbar/ui/the-navbar.vue`:
  - Добавить `<RouterLink :to="APP_ROUTES.FAVORITES">` с inline SVG сердцем + бейджем (`v-if="count > 0"`) из `useFavoritesStore().count`.
  - Бейдж — абсолютно позиционированный span, `var(--color-accent)`.

### 8. i18n

- `src/app/i18n/locales/ru.json` / `en.json` — расширить:
  ```json
  {
    "nav": { "favorites": "Избранное" },
    "team": {
      "filters": { "title": "Фильтр по навыкам", "reset": "Сбросить" },
      "empty": "Нет участников, соответствующих фильтру"
    },
    "favorites": {
      "title": "Избранное",
      "empty": "Вы ещё не добавили никого в избранное",
      "add": "Добавить в избранное",
      "remove": "Убрать из избранного"
    }
  }
  ```
  (параллельно для EN).

### 9. Тесты (Vitest)

- `src/features/favorites/model/favorites.store.test.ts` — add/remove/toggle/isFavorite + персист в localStorage (mock через `vi.stubGlobal('localStorage', ...)`).
- `src/features/filter-members-by-skill/lib/filter-members.test.ts` — пустые фильтры → все; один скилл → подмножество; несколько → OR.
- `src/entities/member/model/member-list.store.test.ts` — `toggleSkill` сбрасывает `currentPage`; `setPage`; `resetFilters`.
- `src/shared/ui/base-pagination/base-pagination.test.ts` — рендер номеров, эмит `update:modelValue`, скрытие при `total <= pageSize`.
- Обновить `src/entities/member/api/member.api.test.ts` — ожидаемый `toHaveLength(30)` (либо читать из фикстуры).

## Файлы — сводка

**Новые:**
- `src/entities/member/model/member-list.store.ts` (+ test)
- `src/features/favorites/model/favorites.store.ts` (+ test)
- `src/features/favorites/ui/favorite-toggle.vue`
- `src/features/favorites/index.ts`
- `src/features/filter-members-by-skill/ui/skill-filter.vue`
- `src/features/filter-members-by-skill/lib/filter-members.ts` (+ test)
- `src/features/filter-members-by-skill/index.ts`
- `src/shared/ui/base-pagination/base-pagination.vue` (+ test)
- `src/pages/favorites/ui/favorites-page.vue`

**Изменяемые:**
- `public/data/members.json` — 4 → 30 записей
- `src/shared/lib/routes.constants.ts` — `FAVORITES`
- `src/app/router/index.ts` — регистрация маршрута
- `src/widgets/the-navbar/ui/the-navbar.vue` — ссылка + бейдж
- `src/entities/member/ui/member-card/member-card.vue` — кнопка избранного
- `src/entities/member/index.ts` — экспорт `useMemberListStore`
- `src/shared/ui/base-tag/base-tag.vue` — props `active`, `clickable`
- `src/pages/team/ui/team-page.vue` — фильтр + пагинация
- `src/app/i18n/locales/ru.json`, `en.json`
- `src/entities/member/api/member.api.test.ts` — обновить ожидаемую длину

## Верификация

1. `npm run type-check` — без ошибок (strict TS).
2. `npm run test` — все тесты зелёные, включая новые.
3. `npm run dev` — вручную в браузере:
   - `/team`: показывает 12 карточек, пагинация листает 30 → 3 страницы.
   - Клик по тегу навыка — список сужается; активный тег визуально выделен; `currentPage` сбрасывается.
   - «Сбросить» очищает фильтры, показывается только при активных фильтрах.
   - Клик по сердцу на карточке: иконка переключается, на страницу профиля НЕ переходит.
   - После refresh избранное сохраняется (localStorage).
   - Бейдж в навбаре показывает правильное количество.
   - `/favorites`: пустое состояние → после добавления отображаются избранные. Удаление — карточка исчезает.
4. `npm run build` — production-сборка без ошибок.
