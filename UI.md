# UI мапа екранів, компонентів і станів

Цей документ є індексом UI surfaces для `mk-combos`. Він фіксує стабільні page/component codes і коротко пояснює, як surfaces працюють у фінальній архітектурі.

Архітектурне джерело правди: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Архітектурний контекст

UI реалізується як один web app shell у `apps/web`, який встановлює game-specific business entry points:

- `@mk-combos/mkxl-business`;
- `@mk-combos/mk1-business`;
- майбутні `@mk-combos/mk*-business`.

`apps/web` вибирає active business entry point за `gameId` із route prefix. Shared UI pages не містять game-specific бізнес-логіки. Вони делегують catalog, detail, builder, lists, validation і backup behavior активному business entry point.

Generic routes:

```text
/:gameId/catalog
/:gameId/combos/:source/:comboId
/:gameId/lists
/:gameId/builder
/settings
```

Приклади:

```text
/mkxl/catalog
/mk1/catalog
/mkxl/combos/seeded/scorpion-bnb-001
/mk1/builder
```

Shared platform packages:

- `@mk-combos/contracts`;
- `@mk-combos/builder-core`;
- `@mk-combos/builder-ui`;
- `@mk-combos/controller-bridge`;
- `@mk-combos/ui`.

Game-specific UI behavior belongs to `mkxl/*` or `mk1/*` through the game business entry point. Shared components may render game-provided descriptors, summaries, filters, candidates, and state, but do not decide game rules.

## Коди посилань

Коди є стабільними documentation/API identifiers. Назва або деталізація UI entity може змінюватися, але код не можна повторно використати для іншої сутності.

- `UI-PAGE-###`: route-level або screen-level UI surface.
- `UI-CMP-###`: component, panel, dialog, toolbar, list, renderer, marker або shared system state block.
- Deprecated UI entity зберігає код із приміткою `Deprecated`; код не reassigned.
- State tokens лишаються lowercase, наприклад `ready`, `loadingSurface`, `staleCustomCombo`.

## Реєстр кодів

### Pages

- [`UI-PAGE-001`](./ui/UI-PAGE-001.md) App Shell.
- [`UI-PAGE-002`](./ui/UI-PAGE-002.md) First-Launch Setup.
- [`UI-PAGE-003`](./ui/UI-PAGE-003.md) Catalog.
  Варіанти: [`MKXL`](./ui/UI-PAGE-003-MKXL.md), [`MK1`](./ui/UI-PAGE-003-MK1.md).
- [`UI-PAGE-004`](./ui/UI-PAGE-004.md) Combo Detail.
- [`UI-PAGE-005`](./ui/UI-PAGE-005.md) Named Lists.
- [`UI-PAGE-006`](./ui/UI-PAGE-006.md) Custom Combo Builder.
- `UI-PAGE-007` Backup Management. `Deprecated`; перенаправлення до `UI-PAGE-008 Settings -> UI-CMP-034 Backup Collapsible Block`.
- [`UI-PAGE-008`](./ui/UI-PAGE-008.md) Settings.

### Components

- [`UI-CMP-001`](./ui/UI-CMP-001.md) Global Top Bar.
- [`UI-CMP-002`](./ui/UI-CMP-002.md) Game Switcher.
- [`UI-CMP-003`](./ui/UI-CMP-003.md) Language Switcher.
- [`UI-CMP-004`](./ui/UI-CMP-004.md) Display Mode Switcher.
- [`UI-CMP-005`](./ui/UI-CMP-005.md) Controller Hint Strip.
- `UI-CMP-006` First-Launch Setup Form.
- [`UI-CMP-007`](./ui/UI-CMP-007.md) Character Picker.
- [`UI-CMP-008`](./ui/UI-CMP-008.md) Variation Picker.
- [`UI-CMP-009`](./ui/UI-CMP-009.md) Kameo Picker.
- [`UI-CMP-010`](./ui/UI-CMP-010.md) Combo List.
- [`UI-CMP-011`](./ui/UI-CMP-011.md) Combo Card.
- [`UI-CMP-012`](./ui/UI-CMP-012.md) Combo List Config Module.
- [`UI-CMP-013`](./ui/UI-CMP-013.md) Filter Control Group.
- `UI-CMP-014` Combo Detail Header.
- [`UI-CMP-015`](./ui/UI-CMP-015.md) Notation Renderer.
- `UI-CMP-016` Move Path Viewer. `Deprecated`; use `UI-CMP-035 Combo Whiteboard`.
- `UI-CMP-017` Combo Metadata Grid.
- `UI-CMP-018` Combo Actions Menu.
- `UI-CMP-019` Named List Index.
- `UI-CMP-020` Named List Detail.
- `UI-CMP-021` Add-To-List Dialog.
- `UI-CMP-022` List Edit Dialog.
- `UI-CMP-023` Builder Context Setup.
- `UI-CMP-024` Move Picker. `Deprecated`; merged into `UI-CMP-035 Combo Whiteboard` as internal `movePicker` region.
- `UI-CMP-025` Combo Path Preview. `Deprecated`; use `UI-CMP-035 Combo Whiteboard`.
- `UI-CMP-026` Builder Action Bar.
- `UI-CMP-027` Export Dialog.
- `UI-CMP-028` Import Preview Dialog.
- `UI-CMP-029` Empty State.
- `UI-CMP-030` Error State.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-032` Breadcrumbs.
- [`UI-CMP-033`](./ui/UI-CMP-033.md) Top Bar Dropdown Menu.
- [`UI-CMP-034`](./ui/UI-CMP-034.md) Backup Collapsible Block.
- [`UI-CMP-035`](./ui/UI-CMP-035.md) Combo Whiteboard.
- [`UI-CMP-036`](./ui/UI-CMP-036.md) Combo Frame Meter.
- [`UI-CMP-037`](./ui/UI-CMP-037.md) Notation Legend Table.

## Глобальна структура

```text
UI-PAGE-001 App Shell
  -> UI-CMP-001 Global Top Bar
     -> UI-CMP-005 Controller Hint Strip
     -> UI-CMP-032 Breadcrumbs
        -> UI-CMP-002 Game Switcher
     -> UI-CMP-033 Top Bar Dropdown Menu
  -> installed game business registry
     -> @mk-combos/mkxl-business
     -> @mk-combos/mk1-business
  -> active route slot
     -> UI-PAGE-002 First-Launch Setup
     -> UI-PAGE-003 Catalog
     -> UI-PAGE-004 Combo Detail
     -> UI-PAGE-005 Named Lists
     -> UI-PAGE-006 Custom Combo Builder
     -> UI-PAGE-008 Settings
```

`apps/web/src/game-business/installed-games.ts` is the only web-app installation point for game business entry points. UI pages receive active game behavior from the resolved business entry point.

## Page Ownership Summary

### `UI-PAGE-001` App Shell

Resolves active `gameId` from route prefix, chooses the installed business entry point, owns global routing, passes settings, and routes controller commands to the active surface.

### `UI-PAGE-002` First-Launch Setup

Collects default language, default game, and notation display mode for root first launch. A valid route-prefixed deep link bypasses setup and derives active game from the URL.

### `UI-PAGE-003` Catalog

Shared catalog page. It delegates game-specific context options, selectors, filters, result counts, combo summaries, route context parsing, and recovery behavior to active game business.

- MKXL variant: `Character -> Variation -> Combo list`.
- MK1 variant: `Main character -> Kameo -> Combo list`.

### `UI-PAGE-004` Combo Detail

Shared detail page. It delegates seeded/custom lookup, stale detection, detail display model, duplicate context, edit context, and repair availability to active game business.

### `UI-PAGE-005` Named Lists

Shared lists page. Lists are scoped by `gameId`; the active business entry point validates combo references and game-owned local data.

### `UI-PAGE-006` Custom Combo Builder

Shared builder page. It uses `@mk-combos/builder-ui` for whiteboard/frame UI and active game builder behavior for graph composition, replay, valid next moves, and custom combo output.

### `UI-PAGE-008` Settings

Global settings page. Language/display mode settings and backup import/export live here. Game switching after first launch happens through `UI-CMP-002 Game Switcher` inside global breadcrumbs.

## Component Ownership Summary

- `UI-CMP-001` and `UI-CMP-005` render shell/controller state from `apps/web` and `@mk-combos/controller-bridge`.
- `UI-CMP-002` renders installed games from App Shell or First Launch inputs. In global use it is the first `UI-CMP-032 Breadcrumbs` item on wide layouts or the compact menu game switcher, and emits game-switch intents to App Shell.
- `UI-CMP-004` renders display mode selection from First Launch or Settings inputs. `UI-CMP-037` renders the reusable UI-owned SVG notation legend table.
- `UI-CMP-033` renders the Top Bar burger menu. On compact layouts it owns the menu equivalents for hidden inline breadcrumbs/game switcher/navigation, while the visible controller connection indicator remains outside the menu.
- `UI-CMP-007`, `UI-CMP-008`, and `UI-CMP-009` are picker surfaces. Their option descriptors and layout data come from active game business or game-specific catalog packages.
- `UI-CMP-010`, `UI-CMP-011`, `UI-CMP-012`, and `UI-CMP-013` render prepared catalog models and emit events to the page.
- `UI-CMP-015` renders notation from provided notation data and display mode using the UI-owned notation icon registry; it does not mutate combo data.
- `UI-CMP-035` and `UI-CMP-036` are owned by `@mk-combos/builder-ui`; graph validity and replay are owned by active game builder logic.

## System States

System states can happen during:

- installed game resolution;
- route-prefixed deep link resolution;
- first-launch setup;
- catalog data loading;
- combo lookup;
- builder graph preparation;
- local state validation;
- backup import validation;
- controller connect/disconnect.

System state components:

- `UI-CMP-029` Empty State;
- `UI-CMP-030` Error State;
- `UI-CMP-031` Stale/Invalid Combo Marker.

## Documentation Rule

Detailed behavior lives in the page/component docs under `ui/`. Architecture details live in [ARCHITECTURE.md](./ARCHITECTURE.md). If a UI spec needs to mention package ownership, it should point to that architecture document and keep only the page-specific implication.
