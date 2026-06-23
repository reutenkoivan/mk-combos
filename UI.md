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

Game-specific UI behavior належить `mkxl/*` або `mk1/*` через game business entry point. Shared components можуть рендерити game-provided descriptors, summaries, filters, candidates і state, але не вирішують game rules.

## Стан На Рівні Сторінки / Pure UI Contract

Кожна route-level сторінка або її page-level custom hook володіє станом, derived models, business orchestration і handler-ами. UI components отримують тільки controlled inputs і semantic callbacks.

Обов'язкові правила для всіх `UI-PAGE-*` і активних `UI-CMP-*`:

- page component декларує бізнес-логіку, викликає active business entry point або page-level hook і передає child components prepared model;
- component inputs містять selected/open/focused/expanded state, availability, validation і display model;
- component outputs мають форму semantic intents, наприклад `requestSelectCharacter(payload)` або `requestToggleBackupBlock(payload)`;
- payload містить domain/UI identifiers, наприклад `id`, `value`, `mode`, `reason`, `sourceSurface`, `sourceFocusTarget`;
- public handlers не передають browser event objects і не залежать від `event.target` або DOM node;
- Browser Gamepad API, DOM events, form-library events і native file picker result мапляться у page-level intent/result перед передачею в UI component;
- компонент може мати internal primitive mechanics для accessibility або focus implementation, але source of truth для route, persistence, selection, open/closed, expanded/collapsed і validation лишається на page/page-hook рівні.

Якщо механіку винесено в module, module має поставляти pair: pure UI component + custom hook. Page component викликає hook, отримує prepared state/handlers і передає їх у UI component. Builder module дотримується цього правила через `useComboWhiteboardModel` + `ComboWhiteboard` і `useComboFrameMeterModel` + `ComboFrameMeter`.

Уся prose-документація пишеться українською. Англійською лишаються стабільні code identifiers, package names, route paths, API names, type names і власні назви UI codes.

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
- [`UI-CMP-006`](./ui/UI-CMP-006.md) First-Launch Setup Form.
- [`UI-CMP-007`](./ui/UI-CMP-007.md) Character Picker.
- [`UI-CMP-008`](./ui/UI-CMP-008.md) Variation Picker.
- [`UI-CMP-009`](./ui/UI-CMP-009.md) Kameo Picker.
- [`UI-CMP-010`](./ui/UI-CMP-010.md) Combo List.
- [`UI-CMP-011`](./ui/UI-CMP-011.md) Combo Card.
- [`UI-CMP-012`](./ui/UI-CMP-012.md) Combo List Config Module.
- [`UI-CMP-013`](./ui/UI-CMP-013.md) Filter Control Group.
- [`UI-CMP-014`](./ui/UI-CMP-014.md) Combo Detail Header.
- [`UI-CMP-015`](./ui/UI-CMP-015.md) Notation Renderer.
- `UI-CMP-016` Move Path Viewer. `Deprecated`; use `UI-CMP-035 Combo Whiteboard`.
- [`UI-CMP-017`](./ui/UI-CMP-017.md) Combo Metadata Grid.
- [`UI-CMP-018`](./ui/UI-CMP-018.md) Combo Actions Menu.
- [`UI-CMP-019`](./ui/UI-CMP-019.md) Named List Index.
- [`UI-CMP-020`](./ui/UI-CMP-020.md) Named List Detail.
- [`UI-CMP-021`](./ui/UI-CMP-021.md) Add-To-List Dialog.
- [`UI-CMP-022`](./ui/UI-CMP-022.md) List Edit Dialog.
- [`UI-CMP-023`](./ui/UI-CMP-023.md) Builder Context Setup.
- `UI-CMP-024` Move Picker. `Deprecated`; merged into `UI-CMP-035 Combo Whiteboard` as internal `movePicker` region.
- `UI-CMP-025` Combo Path Preview. `Deprecated`; use `UI-CMP-035 Combo Whiteboard`.
- [`UI-CMP-026`](./ui/UI-CMP-026.md) Builder Action Bar.
- [`UI-CMP-027`](./ui/UI-CMP-027.md) Export Dialog.
- [`UI-CMP-028`](./ui/UI-CMP-028.md) Import Preview Dialog.
- [`UI-CMP-029`](./ui/UI-CMP-029.md) Empty State.
- [`UI-CMP-030`](./ui/UI-CMP-030.md) Error State.
- [`UI-CMP-031`](./ui/UI-CMP-031.md) Stale/Invalid Combo Marker.
- [`UI-CMP-032`](./ui/UI-CMP-032.md) Breadcrumbs.
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

`apps/web/src/game-business/installed-games.ts` є єдиною installation point у web app для game business entry points. UI pages отримують active game behavior від resolved business entry point.

## Page Ownership Summary

### `UI-PAGE-001` App Shell

Резолвить active `gameId` із route prefix, вибирає installed business entry point, володіє global routing, передає settings і маршрутизує controller commands до active surface.

### `UI-PAGE-002` First-Launch Setup

Збирає default language, default game і notation display mode для root first launch. Valid route-prefixed deep link обходить setup і виводить active game з URL.

### `UI-PAGE-003` Catalog

Shared catalog page. Делегує game-specific context options, selectors, filters, result counts, combo summaries, route context parsing і recovery behavior активному game business.

- MKXL variant: `Character -> Variation -> Combo list`.
- MK1 variant: `Main character -> Kameo -> Combo list`.

### `UI-PAGE-004` Combo Detail

Shared detail page. Делегує seeded/custom lookup, stale detection, detail display model, duplicate context, edit context і repair availability активному game business.

### `UI-PAGE-005` Named Lists

Shared lists page. Lists scoped by `gameId`; active business entry point валідить combo references і game-owned local data.

### `UI-PAGE-006` Custom Combo Builder

Shared builder page. Використовує `@mk-combos/builder-ui` для whiteboard/frame UI і active game builder behavior для graph composition, replay, valid next moves і custom combo output.

### `UI-PAGE-008` Settings

Global settings page. Language/display mode settings і backup import/export живуть тут. Game switching після first launch відбувається через `UI-CMP-002 Game Switcher` усередині global breadcrumbs.

## Підсумок Володіння Компонентами

- `UI-CMP-001` і `UI-CMP-005` рендерять shell/controller state з `apps/web` і `@mk-combos/controller-bridge`.
- `UI-CMP-002` рендерить installed games з App Shell або First Launch inputs. У global use він є першим item у [`UI-CMP-032 Breadcrumbs`](./ui/UI-CMP-032.md) на wide layouts або compact menu game switcher і емітить game-switch intents до App Shell.
- `UI-CMP-004` рендерить display mode selection з First Launch або Settings inputs. `UI-CMP-037` рендерить reusable UI-owned SVG notation legend table.
- `UI-CMP-033` рендерить Top Bar burger menu з App Shell/Top Bar controlled menu state. На compact layouts він отримує menu equivalents для hidden inline breadcrumbs/game switcher/navigation, а visible controller connection indicator лишається outside menu.
- `UI-CMP-007`, `UI-CMP-008` і `UI-CMP-009` є picker surfaces. Їхні option descriptors і layout data приходять з active game business або game-specific catalog packages.
- `UI-CMP-010`, `UI-CMP-011`, `UI-CMP-012` і `UI-CMP-013` рендерять prepared catalog models і емітять events до page.
- `UI-CMP-015` рендерить notation із provided notation data і display mode через UI-owned notation icon registry; він не мутує combo data.
- `UI-CMP-035` і `UI-CMP-036` є pure components із `@mk-combos/builder-ui`; їхні page-level hooks готують view models і semantic handlers, а graph validity і replay належать active game builder logic.

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

## Правило Документації

Детальна поведінка живе в page/component docs у `ui/`. Architecture details живуть в [ARCHITECTURE.md](./ARCHITECTURE.md). Якщо UI spec має згадати package ownership, він посилається на architecture document і лишає тільки page-specific implication.

Prose документації пишеться українською. Англійською лишаються code identifiers, route/package/API names, type names і стабільні власні назви UI codes.

Кожна активна `UI-PAGE-*` і `UI-CMP-*` специфікація має містити секцію `## Анатомія`. Ця секція описує тільки структурні UI-ділянки і не переносить source of truth або бізнес-логіку з page/page-hook рівня в pure UI component. Застарілі entries без окремих specs не отримують anatomy stubs.

`Анатомія` має пояснювати взаємне розміщення, а не лише перелік зон:

- порядок у схемі читається згори вниз і зліва направо;
- використовуються позначки `(top)`, `(below)`, `(left)`, `(right)`, `(inside)`, `(overlay)`, `(wide13_6Plus)` і `(compact)`;
- діалоги й накладки рівня сторінки позначаються як `(overlay)` або page-owned singleton surface;
- адаптивні перестановки описуються в коротких `Правила розміщення`;
- секція не описує логіку мутацій, правила валідації або ownership persistence.
