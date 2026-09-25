# AGENTS.md — Adhivasindo Kanban Board (HTML → Vite/Ionic React Slicing)

> This file is written for an AI coding agent (Claude Code, Cursor, Codex, etc.) that will slice
> the existing static prototype (`reference/kanban-board.html`) into a production-grade
> **Vite + TypeScript + Ionic React + React Router + Ionicons + Tailwind CSS** application inside
> the `ayyas-frontend-test/` repo. Read this whole file before writing any code.

## 0. Source of truth

- **Reference prototype**: `reference/kanban-board.html` (single self-contained file, plain HTML + vanilla
  JS + Ionic Web Components via CDN). Treat it as the **visual & behavioral spec**, not as code to
  reuse verbatim — logic must be rewritten in idiomatic React/TypeScript, styling must move to
  Tailwind utilities + design tokens.
- **Reference screenshots**: 4 images of an existing project-management tool (board view, task
  detail view) used as the original design reference for the prototype.
- Whenever this document and the prototype disagree, **this document wins** (it reflects the
  latest approved requirements, including the navbar and "Add new list" updates).

---

## 1. Product Requirements Document (PRD)

### 1.1 Summary
A single-board Kanban task manager ("Adhivasindo Board") for small teams to plan, track, and move
work across customizable columns (lists), with rich task cards, a detail view, filtering/search,
and fully client-side persistence (no backend in this phase).

### 1.2 Goals
- Rebuild the HTML prototype as a maintainable, typed, component-based React app.
- Preserve all existing behavior and visual design (design tokens in section 2).
- Make the codebase easy to extend later (multi-board, real backend/API, auth).

### 1.3 Out of scope (this phase)
- Backend/API, authentication, real-time collaboration.
- Real file upload storage (cover image & attachments remain **local-only**, simulated via
  `FileReader` → base64/data URL, or filename-only for attachments).
- Multi-board switching (data model should *allow* it later, UI does not need to expose it yet).
- "Invite" and "Export/Import" are **visual-only placeholders** (show a toast: "coming soon").

### 1.4 User roles
Single implicit user (no auth). All team "members" are static seed data (see 3.4).

### 1.5 Functional requirements

| # | Feature | Details |
|---|---|---|
| F1 | **Board & Columns** | Board renders N columns horizontally (`To Do`, `Doing`, `Review`, `Done`, `Rework` by default). Columns scroll on the X axis when they overflow the viewport width. |
| F2 | **Add new list** | A column-shaped "+ Add new list" affordance always renders as the *last* item in the board row. Clicking it reveals an inline form (text input + "Add List" + cancel). Submitting appends a new empty column at the end and persists it. |
| F3 | **Task card** | Shows: cover image (optional), label badge, mini progress bar (checklist %), title, 2-line-clamped description, footer with due date, attachment count, and stacked assignee avatars. |
| F4 | **Task detail (modal/sheet)** | Full-screen-ish modal with: Mark Complete toggle, close button, cover image uploader, editable title, Assignee multi-select (avatar picker), Due Date, Board (read-only), Column (select — moves the task), Label (select), Priority (select: Low/Medium/High), Description (textarea), Attachments (dummy add/remove by filename), Checklist (add/remove/toggle subtasks + auto progress bar), Activity log (auto-generated entries), Discard / Save, Delete. |
| F5 | **CRUD** | Create (via column "+" or FAB "+"), Read (cards + modal), Update (modal Save), Delete (modal Delete button) — all persisted to `localStorage`. |
| F6 | **Drag & drop** | Cards can be dragged between columns (HTML5 DnD or a DnD library — see 4). Moving updates `task.columnId`, logs an activity entry, shows a toast, and persists. |
| F7 | **Checklist / subtasks** | Add subtask, toggle done/undone, remove subtask. Progress bar (mini on card, full on modal) auto-recomputes from `done/total`. |
| F8 | **Filtering & search** | Search box filters by title/description substring (debounced). Filter panel filters by assignee (multi), label (multi), and due-date-before. Filters combine with AND logic; search is always applied on top. |
| F9 | **Persistence** | Tasks and the column list are stored in `localStorage` under versioned keys and rehydrated on load; app must work fully offline after first load. |
| F10 | **Notifications** | Toast on create/update/delete/move/list-added, success vs. danger variants. |
| F11 | **Navbar** | Left cluster: brand + dropdown chevron (non-functional for now), overlapping team avatars (max 4 + "+N" bubble), "+ Invite" button (placeholder). Right cluster: "Filter" button (opens filter panel), "Export / Import" button (placeholder), Search bar. |

### 1.6 Non-functional requirements
- **Responsive**: usable on mobile (narrow viewport, horizontal board scroll, modal near full-screen) and desktop.
- **Type-safe**: strict TypeScript, no `any` in domain logic.
- **Theming**: light theme is default and must match section 2 exactly; app should not break if a
  consumer later adds a dark-mode toggle (tokens are already dark-mode-ready).
- **No remote network calls** for core functionality — everything works from local state/localStorage.
- **Accessible basics**: buttons are real `<button>`/`IonButton`, inputs have labels or `aria-label`, modal traps focus (Ionic handles this).

### 1.7 Tech stack (decided)
- **Vite** (build tool, already scaffolded)
- **TypeScript** (strict mode)
- **Ionic React** (`@ionic/react`, `@ionic/react-router`) for UI primitives (`IonApp`, `IonHeader`,
  `IonModal`, `IonToast`, `IonFab`, `IonButton`, `IonSearchbar`, `IonInput`, `IonSelect`,
  `IonCheckbox`, `IonProgressBar`, etc.)
- **React Router** — via `IonReactRouter` (`react-router-dom` v5, the version Ionic React officially
  integrates with). Do not mix in `react-router-dom` v6 APIs.
- **Ionicons** (`ionicons/icons`) via `<IonIcon icon={...} />` — replaces the emoji/unicode glyphs
  used in the prototype (📅, 📎, ✕, ▾, ⏷, ⇅, etc.) with real icons.
- **Tailwind CSS** for layout/spacing/typography utilities, layered **on top of** Ionic's own
  component styling (Ionic components keep using CSS variables / `part`s for their internals;
  Tailwind handles custom components like cards, badges, avatars).

---

## 2. Design Tokens

All tokens below are taken verbatim from the approved prototype (`reference/kanban-board.html`). They must
be defined once as CSS custom properties (so Ionic's own `--ion-*` overrides and any future
dark-mode toggle stay consistent) **and** exposed to Tailwind via `tailwind.config` so utility
classes like `bg-surface`, `text-muted`, `rounded-lg-token` are available.

### 2.1 Color tokens — light (default)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#fafbfc` | App/page background |
| `--color-surface` | `#ffffff` | Cards, header, modal background |
| `--color-surface-2` | `#f4f5f7` | Inset fields, chips, dropzones, column-empty states |
| `--color-border` | `#ebedf1` | Hairline borders everywhere |
| `--color-text` | `#1c2534` | Primary text |
| `--color-muted` | `#9aa2b1` | Secondary text, placeholders, icons |
| `--color-muted-2` | `#d3d7de` | Dashed borders, disabled affordances |
| `--color-accent` | `#3d7bfc` | Primary actions, links, focus ring, progress |
| `--color-accent-2` | `#2f63e0` | Accent hover/active |
| `--color-accent-soft` | `#eaf1ff` | Accent tinted backgrounds (chips, active states) |
| `--color-danger` | `#ef4b5f` | Delete actions, error toast |
| `--color-danger-soft` | `#ffe6ea` | Danger tinted background |
| `--color-warn` | `#f2994a` | Medium priority |
| `--color-warn-soft` | `#fff2e2` | Warn tinted background |
| `--color-success` | `#1cc88a` | Checklist progress fill, success toast |

### 2.2 Color tokens — dark (prepare, not exposed in UI yet)

| Token | Value |
|---|---|
| `--color-bg` | `#14161c` |
| `--color-surface` | `#1d2029` |
| `--color-surface-2` | `#242833` |
| `--color-border` | `#2b2f3a` |
| `--color-text` | `#eef0f4` |
| `--color-muted` | `#8c93a3` |
| `--color-muted-2` | `#3a3f4c` |
| `--color-accent-soft` | `#1c2740` |

### 2.3 Label / badge tokens

| Label | Background | Text |
|---|---|---|
| Feature | `#e7f0ff` | `#3d7bfc` |
| Bug | `#ffe3e9` | `#e6396c` |
| Issue | `#fff1de` | `#e8890f` |
| Undefined | `#eef0f3` | `#7c8698` |

### 2.4 Radius tokens

| Token | Value | Usage |
|---|---|---|
| `--radius-lg` | `16px` | Cards, columns, cover images, modal corners |
| `--radius-md` | `12px` | Panels, dropzones, textareas, popovers |
| `--radius-sm` | `8px` | Chips, inputs, small buttons |

### 2.5 Shadow tokens

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(16,24,40,.04), 0 1px 1px rgba(16,24,40,.03)` | Resting task card |
| `--shadow-pop` | `0 12px 32px rgba(16,24,40,.14)` | Filter panel, member popover, modal |

### 2.6 Typography
- Font family: **Inter** (weights 400/500/600/700/800), loaded via `@fontsource/inter` (preferred
  over a Google Fonts `<link>` so it's bundled/offline-safe) — fallback stack:
  `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`.
- Base letter-spacing: `-0.1px` on body text.
- Scale used in the prototype (keep as Tailwind `fontSize` extensions if not already close to
  Tailwind defaults): `11px` (badges/labels), `12–12.5px` (meta/secondary), `13–13.5px` (body/card
  title), `15px` (brand), `19px` (task title in modal).

### 2.7 Implementation notes for the agent
1. Create `src/styles/tokens.css` containing `:root { --color-*: ...; --radius-*: ...; --shadow-*: ...; }`
   and a `:root[data-theme="dark"]` block with the dark values from 2.2 (kept inert until a theme
   toggle is built).
2. In `tailwind.config.ts`, extend `theme.colors`, `theme.borderRadius`, `theme.boxShadow` to read
   from these CSS variables (e.g. `bg: "var(--color-bg)"`) so both Tailwind utilities and raw CSS
   stay in sync — never hardcode hex values in component files.
3. Ionic's own CSS variables (`--ion-color-primary`, `--ion-background-color`, etc.) should be
   mapped once in `tokens.css` to the same values so `IonButton color="primary"` etc. visually
   matches the accent token.

---

## 3. File & Folder Management

### 3.1 Target structure (grow from the current scaffold)

```
ayyas-frontend-test/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                      # keep hero.png; remove unused vite/react placeholder svgs
│   ├── styles/
│   │   ├── tokens.css               # design tokens (section 2)
│   │   └── index.css                # Tailwind directives + global resets + Ionic CSS imports
│   ├── types/
│   │   └── board.types.ts           # Task, Column, Member, Label, Priority, Attachment, ChecklistItem, ActivityEntry
│   ├── data/
│   │   ├── members.ts               # static MEMBERS seed
│   │   ├── labels.ts                # LABEL_TOKENS map (from 2.3)
│   │   └── seed.ts                  # seedTasks() + default COLS
│   ├── lib/
│   │   ├── storage.ts               # typed localStorage get/set helpers (versioned keys)
│   │   └── id.ts                    # crypto.randomUUID wrapper
│   ├── store/                       # state layer (see 4, Phase 2 for the decision)
│   │   ├── BoardProvider.tsx        # React context + reducer (tasks, columns, filters, ui)
│   │   └── useBoard.ts              # hook to consume the context
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # IonApp wrapper
│   │   │   └── TopNavbar.tsx        # brand, avatars, invite, filter, export/import, search
│   │   ├── board/
│   │   │   ├── BoardCanvas.tsx      # horizontal-scroll flex row, owns DnD context
│   │   │   ├── BoardColumn.tsx      # column header + droppable body
│   │   │   ├── AddListColumn.tsx    # "+ Add new list" affordance + inline form
│   │   │   └── TaskCard.tsx         # draggable card
│   │   ├── task-modal/
│   │   │   ├── TaskDetailModal.tsx  # IonModal shell, owns local edit-buffer state
│   │   │   ├── CoverImageField.tsx
│   │   │   ├── AssigneeField.tsx    # avatar row + popover multi-select
│   │   │   ├── ChecklistField.tsx
│   │   │   ├── AttachmentsField.tsx
│   │   │   └── ActivityLog.tsx
│   │   ├── filters/
│   │   │   ├── FilterPanel.tsx
│   │   │   └── SearchBar.tsx
│   │   └── ui/                      # small generic pieces reused across features
│   │       ├── Avatar.tsx
│   │       ├── AvatarStack.tsx
│   │       ├── LabelBadge.tsx
│   │       ├── ProgressBar.tsx
│   │       └── Toast.tsx            # thin wrapper around IonToast + a useToast() hook
│   ├── pages/
│   │   ├── BoardPage.tsx            # composes TopNavbar + BoardCanvas + TaskDetailModal
│   │   └── NotFoundPage.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx            # IonReactRouter + IonRouterOutlet + <Route>s
│   ├── App.tsx                      # setupIonicReact() call site + <AppRoutes/>
│   ├── App.css                      # (remove once fully migrated to Tailwind/tokens)
│   ├── index.css                    # (superseded by src/styles/index.css — remove after migration)
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js                # new
├── tailwind.config.ts               # new
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── vite.config.ts
```

### 3.2 Migration map (prototype → component)

| In `reference/kanban-board.html` | Becomes |
|---|---|
| `<style>` `:root` tokens | `src/styles/tokens.css` |
| `ion-toolbar` / `.topbar-*` | `TopNavbar.tsx` |
| `#board` + `.board` / `.column` loop | `BoardCanvas.tsx` + `BoardColumn.tsx` |
| `.card` / `cardEl()` | `TaskCard.tsx` |
| `.add-list-col` / `addListColEl()` | `AddListColumn.tsx` |
| `#taskModal` (`ion-modal`) | `TaskDetailModal.tsx` (+ its field subcomponents) |
| `#filterPanel` | `FilterPanel.tsx` |
| `#searchBar` | `SearchBar.tsx` |
| `MEMBERS`, `LABELS`, `COLS`, `seed()` | `data/members.ts`, `data/labels.ts`, `data/seed.ts` |
| `tasks` / `save()` / `localStorage` calls | `lib/storage.ts` + `store/BoardProvider.tsx` |
| `#toast` + `toast()` | `components/ui/Toast.tsx` (`useToast()`) |
| Inline drag/drop handlers | DnD logic inside `BoardCanvas.tsx` / `TaskCard.tsx` (see Phase 6, section 4) |

### 3.3 Naming & conventions
- Components: `PascalCase.tsx`, one component per file, named export **and** default export only
  for pages/route targets.
- Hooks: `useX.ts`, colocated in `store/` or a per-feature `hooks/` folder if a feature grows its
  own hooks.
- No inline `style={{ background: '#...' }}` — use Tailwind classes bound to the tokens, or CSS
  variables via `style={{ background: 'var(--color-accent)' }}` only for truly dynamic values
  (e.g. a member's per-seed color, a cover image URL).
- Keep `types/board.types.ts` as the single source of truth for domain types; components import
  types from there, never redeclare inline shapes for `Task`/`Column`/etc.

### 3.4 Seed/static data
Port directly from the prototype's JS:
- `MEMBERS`: 5 members (`m1..m5`) with `name` + `color` (see prototype for exact hex values).
- `LABELS`: `Feature | Bug | Issue | Undefined` mapped to the tokens in 2.3.
- `COLS` default: `['To Do', 'Doing', 'Review', 'Done', 'Rework']`.
- 10 seed tasks distributed across the columns (titles/labels/assignees/due dates as in the
  prototype's `seed()` function) so the app isn't empty on first run.

---

## 4. Task Breakdown (Implementation Plan)

Work top-to-bottom; each phase should be a separate PR/commit. Check items off as completed.

### Phase 0 — Project setup
- [x] `npm install @ionic/react @ionic/react-router ionicons react-router-dom@5 @types/react-router-dom@5`
- [x] `npm install -D tailwindcss postcss autoprefixer` → `npx tailwindcss init -p`
- [x] `npm install @fontsource/inter`
- [x] Configure `tailwind.config.ts` `content` globs to include `./index.html` and `./src/**/*.{ts,tsx}`
- [x] Create `src/styles/tokens.css` and `src/styles/index.css` (Tailwind `@tailwind base/components/utilities` + `@import "./tokens.css"` + `@import "@fontsource/inter"` weights 400/500/600/700/800), import `index.css` once in `main.tsx`
- [x] In `main.tsx`/`App.tsx`, import Ionic core CSS (`@ionic/react/css/core.css`, `normalize.css`,
      `structure.css`, `typography.css`, and the optional palette imports) and call `setupIonicReact()`
- [x] Remove unused `src/assets/react.svg`, `src/assets/vite.svg` if not referenced by the final UI

### Phase 1 — Domain types & data layer
- [x] `types/board.types.ts`: `Member`, `LabelName`, `Priority`, `ChecklistItem`, `Attachment`, `ActivityEntry`, `Task`, `ColumnId` (string alias)
- [x] `data/members.ts`, `data/labels.ts`, `data/seed.ts` (port static data 1:1 from prototype)
- [x] `lib/storage.ts`: `getItem<T>(key, fallback)`, `setItem<T>(key, value)` wrapping
      `localStorage`, with the same versioned keys as the prototype (`adhivasindo_kanban_v1`,
      `adhivasindo_columns_v1`)
- [x] `lib/id.ts`: `newId()` wrapping `crypto.randomUUID()`

### Phase 2 — State management
- [x] State approach decision: Using React Context + useReducer in `store/BoardProvider.tsx`
      (keeps app lightweight, provides type-safe state management for single board, scales well,
      can be migrated to Redux/Zustand if multi-board support is added later)
- [x] Reducer actions: `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `MOVE_TASK`, `ADD_COLUMN`,
      `TOGGLE_CHECKLIST_ITEM`, `SET_FILTERS`, `SET_SEARCH`
- [x] Persist on every mutating action (subscribe to state changes → `storage.setItem`)
- [x] `useBoard()` hook exposing state + typed dispatch helpers (`addTask`, `updateTask`, etc.)

### Phase 3 — App shell, routing, theming
- [x] `App.tsx`: `IonApp` → `AppRoutes`
- [x] `routes/AppRoutes.tsx`: `IonReactRouter` + `IonRouterOutlet` with `Route exact path="/" -> BoardPage` and a catch-all `NotFoundPage`
- [x] `components/layout/AppShell.tsx` (if needed) for shared chrome; otherwise keep `BoardPage` as the composition root
- [x] Wrap the router tree with `BoardProvider`

### Phase 4 — Navbar
- [x] `TopNavbar.tsx`: left cluster (brand + `IonIcon icon={chevronDownOutline}`, `AvatarStack`
      showing first 4 members + "+N", `IonButton fill="outline"` "+ Invite" → `useToast()` placeholder)
- [x] Right cluster: Filter `IonButton` (`icon={filterOutline}`) toggling `FilterPanel`,
      Export/Import `IonButton` (`icon={swapVerticalOutline}`) → placeholder toast, `SearchBar`
      (`IonSearchbar`) wired to `SET_SEARCH`
- [x] Match spacing/typography to section 2

### Phase 5 — Board & columns
- [x] `BoardCanvas.tsx`: horizontally scrollable flex container (`overflow-x-auto`), maps over
      `state.columns`, renders `BoardColumn` per column + `AddListColumn` last
- [x] `BoardColumn.tsx`: header (name, count, "+" quick-add button opening the modal in create
      mode) + droppable body listing filtered/sorted `TaskCard`s (see Phase 8 for filtering)
- [x] `AddListColumn.tsx`: idle button state ↔ inline form state (local `useState`), calls
      `addColumn(name)` on submit, `Escape`/cancel reverts
- [x] `TaskCard.tsx`: renders cover, `LabelBadge`, mini `ProgressBar`, title (strikethrough if
      `completed`), clamped description, footer (due date via `IonIcon calendarOutline`,
      attachment count via `IonIcon attachOutline`, `AvatarStack` of assignees); `onClick` opens
      the modal in edit mode

### Phase 6 — Drag & drop
- [x] Implement with native HTML5 DnD (`draggable`, `onDragStart/onDragOver/onDrop`) to match the
      prototype 1:1 with **no extra dependency**, *or* swap in `@hello-pangea/dnd` /
      `@dnd-kit/core` if the team wants keyboard-accessible DnD — record the decision here once made
      **Decision**: Native HTML5 DnD implemented with no extra dependencies
- [x] On drop: dispatch `MOVE_TASK`, push an activity entry ("Dipindahkan ke {column}"), show a toast

### Phase 7 — Task detail modal
- [x] `TaskDetailModal.tsx`: `IonModal` controlled by `isOpen`/`onDidDismiss`, holds a local
      **edit buffer** (draft state) that only commits to the store on Save (mirrors the
      prototype's `temp*` variables) — Discard/close must not mutate global state
- [x] Header: Mark Complete pill (`IonButton`, filled when `completed`), close `IonIcon closeOutline`
- [x] `CoverImageField.tsx`: click/drop → `FileReader.readAsDataURL` → store as `cover: string | null`
- [x] Grid fields: `AssigneeField` (avatar row + `add-av` button opening a small popover of
      `IonCheckbox` per member), Due Date (`IonInput type="date"` or `IonDatetime`), Board
      (`IonInput disabled` value `"Northern Light"`), Column (`IonSelect`), Label (`IonSelect`),
      Priority (`IonSelect`: Low/Medium/High)
- [x] Description `IonTextarea`
- [x] `AttachmentsField.tsx`: dropzone (`IonIcon` + text) + hidden `<input type="file">` storing
      `file.name` only (no upload), list with remove buttons
- [x] `ChecklistField.tsx`: add-subtask input, list of `IonCheckbox` + label + remove, derived
      progress bar (`done/total`)
- [x] `ActivityLog.tsx`: reverse-chronological list of `{ ts, text }`, localized timestamp (`id-ID`)
- [x] Footer: Delete (`color="danger"`, only visible when editing an existing task), Discard,
      Save (validates non-empty title, dispatches `ADD_TASK`/`UPDATE_TASK`, appends the relevant
      activity entry, shows a toast, closes modal)

### Phase 8 — Filtering & search
- [x] `FilterPanel.tsx`: assignee chips (multi-toggle), label chips (multi-toggle), due-before
      date input, "Clear filters" — all read/write `state.filters` via the store
- [x] Selector/util (`lib/filterTasks.ts` or inline `useMemo`) applying search + filters with AND
      logic, consumed by `BoardColumn`

### Phase 9 — Notifications
- [x] `components/ui/Toast.tsx`: single `IonToast` instance mounted once (e.g. in `BoardPage`),
      driven by a small `useToast()` hook/context exposing `showToast(message, color?)`
- [x] Wire into create/update/delete/move/add-column flows exactly as in the prototype

### Phase 10 — Responsiveness, polish, QA
- [ ] Verify board horizontal scroll behavior at narrow widths (mobile) and that `AddListColumn`
      stays reachable via scroll
- [ ] Verify modal becomes near-full-screen on small viewports (Ionic breakpoint or custom CSS)
- [ ] Run `npm run lint` and `npm run build`; fix all TypeScript/ESLint errors
- [ ] Manual pass against the 4 reference screenshots + this document's PRD (section 1.5) as an
      acceptance checklist

---

## 5. Agent working agreement (quick reference)

- Package manager: use whatever lockfile already exists (`package-lock.json` → npm).
- Always run `npm run lint` before considering a phase done; do not silence lint rules to pass.
- Prefer composition over prop-drilling more than 2 levels — use `useBoard()` from the store
  instead of threading task/column state through many components.
- Do not introduce a global CSS reset beyond Tailwind's `preflight` + the tokens file — no
  competing design systems.
- Every new component gets co-located, minimal, focused — if a file exceeds ~150 lines, look for a
  sub-component to extract (mirrors the `*Field.tsx` split in Phase 7).
- When in doubt about a visual detail not covered here, match `reference/kanban-board.html` exactly.
