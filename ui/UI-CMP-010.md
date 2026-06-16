# UI-CMP-010: Combo List

## Метадані

- Код: `UI-CMP-010`
- Назва: `Combo List`
- Тип: `component / catalog results`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Власник: `UI-PAGE-003 Catalog`
- Child components: `UI-CMP-011 Combo Card`
- Пов'язані компоненти: [`UI-CMP-012 Combo List Config Module`](./UI-CMP-012.md), [`UI-CMP-013 Filter Control Group`](./UI-CMP-013.md), `UI-CMP-015 Notation Renderer`, `UI-CMP-021 Add-To-List Dialog`, `UI-CMP-029 Empty State`, `UI-CMP-030 Error State`
- Variant docs: [MKXL](./UI-PAGE-003-MKXL.md), [MK1](./UI-PAGE-003-MK1.md)
- Пов'язані UX сценарії: `US-003`, `US-004`, `US-005`, `US-006`, `US-007`, `US-012`, `US-014`, `US-019`

## Призначення

`UI-CMP-010 Combo List` показує visible combo results для поточного Catalog context.

Компонент розташований після `UI-CMP-012 Combo List Config Module` і є контейнером для `UI-CMP-011 Combo Card`. Він отримує вже підготовлений список `visible combos` від `UI-PAGE-003 Catalog`, рендерить cards у переданому порядку і передає user actions нагору.

`UI-CMP-010` не є selector-ом, filter engine, route handler або persistence surface.

## Роль і межі

`UI-PAGE-003 Catalog` володіє active game, selected character, selected game-specific context, optional filters, seeded combo data, page-level dialogs і routing.

`UI-CMP-010` відповідає за:

- рендер list region для visible combos;
- рендер одного `UI-CMP-011 Combo Card` для кожного visible combo summary;
- підтримку stable reading order і focus order для поточного списку;
- показ loading, disabled або empty presentation, якщо відповідний state передано Catalog;
- keyboard і semantic controller focus між combo cards;
- передачу card/list actions у Catalog;
- збереження source card focus target для повернення focus після page-level dialog.

`UI-CMP-010` не відповідає за:

- фільтрацію global combo data;
- обчислення result count або available facets;
- зміну selected character, variation, kameo або optional filters;
- зміну route напряму;
- відкриття власного dialog instance;
- створення custom combo;
- зміну named lists або user data;
- зміну `movePath`, `cachedNotation` або seeded combo data;
- читання Browser Gamepad API напряму.

## Anatomy

```text
UI-CMP-010 Combo List
  ├─ listRoot / results region
  ├─ optional list status
  │  ├─ loading state
  │  ├─ disabled/context guidance state
  │  └─ UI-CMP-029 Empty State
  └─ comboCardCollection
     └─ UI-CMP-011 Combo Card
        └─ UI-CMP-015 Notation Renderer
```

### `listRoot`

`listRoot` є focus zone після `UI-CMP-012 Combo List Config Module`.

Root має:

- readable label або accessible name для combo results;
- stable layout для переходу між cards;
- visible focus target для focused combo;
- `aria-busy` або еквівалентний state під час `loadingCombos`, якщо список ще готується.

`UI-CMP-010` не дублює result count, active optional-filter chips або `Clear filters`, бо ці controls належать `UI-CMP-013 Filter Control Group`.

### `comboCardCollection`

`comboCardCollection` містить один `UI-CMP-011 Combo Card` для кожного item із `visible combos`.

Порядок cards відповідає порядку, який передав Catalog. У v1 `UI-CMP-010` не додає власні rules для sorting, pagination або virtualization.

Кожна card отримує:

- combo summary;
- active language;
- notation display mode;
- focused/selected state;
- available contextual actions;
- named list availability або membership hint, якщо доступний;
- active game-specific context summary.

## Interface Contract

### Inputs

- `visibleCombos`: ordered combo summaries після required context і optional filters.
- `activeCatalogContext`: active game, selected character і selected game-specific context.
- `selectedOptionalFilters`: optional filters, які вже застосовані до `visibleCombos`.
- `activeLanguage`: `EN` або `UA`.
- `notationDisplayMode`: `FGC`, `PlayStation` або `Xbox`.
- `focusedComboId` або focused combo index.
- `availableActionsByCombo`: open detail, add to list, duplicate або contextual actions.
- `namedListAvailability`: optional hint для add-to-list availability.
- `namedListMembershipHints`: optional current membership hints для combo cards.
- `loadingState`: combo results ще готуються.
- `emptyState`: `contextIncomplete`, `noCombos` або `noFilterResults`.
- `disabledState`: list тимчасово disabled через incomplete або blocked context.
- `controllerFocusState`: active focus zone і focused card/action.

### Outputs

- `requestFocusCombo`: змінити focused combo.
- `requestOpenComboDetail`: відкрити combo detail для focused або activated combo.
- `requestOpenComboActions`: відкрити contextual actions для combo.
- `requestAddToList`: попросити Catalog відкрити page-level singleton `UI-CMP-021` із combo context.
- `requestDuplicateToCustomCombo`: попросити Catalog/App Shell відкрити builder duplicate flow.
- `requestClearFilters`: recovery action із `noFilterResults` empty state.
- `requestReturnFocusToConfig`: повернути focus до safe Catalog/config target.

`UI-CMP-010` outputs є intent events. Route changes, dialog lifecycle і persistence виконуються на page/app рівні.

## State Tokens

- `contextIncomplete`: required character або game-specific context відсутній; cards не рендеряться як actionable results.
- `loadingCombos`: Catalog готує visible combo list або metadata для cards.
- `comboListReady`: valid context має один або більше visible combos.
- `filteredList`: visible combos звужені optional filters.
- `noCombos`: valid context не має seeded combos.
- `noFilterResults`: selected optional filters не повернули combos для valid context.
- `listDisabled`: list не приймає card actions через incomplete context, loading або page-level modal/dialog focus.
- `comboFocused`: конкретний combo card є focused target для keyboard/controller actions.

Recoverable або fatal data errors не є owned state `UI-CMP-010`. Catalog або system state area показує їх через `UI-CMP-030 Error State`.

## UI Behavior

### Visible Combo Rendering

`UI-CMP-010` рендерить тільки `visibleCombos`, які передав Catalog.

Rules:

- не перечитувати seeded combo data напряму;
- не застосовувати optional filters повторно;
- не сортувати combos самостійно;
- не приховувати cards через local UI-only filters;
- не змінювати combo summary перед передачею в `UI-CMP-011`, окрім presentation props.

### Empty And Loading States

Catalog визначає причину empty state і передає її в `UI-CMP-010`.

`contextIncomplete`:

- list показує guidance або disabled area без actionable cards;
- controller `confirm`, `openDetail` і `addToList` не виконують card action;
- recovery полягає у виборі required context у `UI-CMP-012`.

`loadingCombos`:

- list зберігає стабільне місце у layout;
- interactive card actions disabled;
- loading status доступний assistive technologies.

`noCombos`:

- показується `UI-CMP-029 Empty State`;
- copy пояснює, що combo для current valid context не знайдені;
- recovery веде до зміни character або game-specific context.

`noFilterResults`:

- показується `UI-CMP-029 Empty State`;
- primary recovery очищає optional filters;
- selected character і selected variation/kameo не скидаються.

### Card Delegation

`UI-CMP-010` передає card presentation у `UI-CMP-011`.

Card actions bubble up так:

1. Користувач активує card або card action.
2. `UI-CMP-011` емітить intent у `UI-CMP-010`.
3. `UI-CMP-010` додає source focus target, якщо потрібно.
4. Catalog отримує request і виконує page/app-level flow.

`requestAddToList` не створює dialog у list. Catalog відкриває один page-level singleton `UI-CMP-021 Add-To-List Dialog`.

`requestDuplicateToCustomCombo` не створює custom combo всередині list. App Shell відкриває `UI-PAGE-006 Custom Combo Builder` із source combo.

## Variant Rules

### `MKXL`

У `MKXL` variant `visibleCombos` уже мають відповідати selected `character + variation`.

Rules:

- list не показує combos іншої game, character або variation;
- stage/interactable filters уже застосовані Catalog, якщо вони selected;
- stage-specific context передається в card summary для badges і downstream actions;
- stage-agnostic combos не мають показувати порожній stage placeholder;
- `kameo` не використовується як combo context або card metadata.

### `MK1`

У `MK1` variant `visibleCombos` уже мають відповідати selected `character + kameo`.

Rules:

- list не показує combos іншої game, character або kameo;
- shared optional filters уже застосовані Catalog;
- kameo context передається в card summary і downstream actions;
- `variation`, stage і interactable не використовуються як combo context або card metadata.

## Controller Behavior

`UI-CMP-010` отримує semantic commands через Catalog/App Shell і не читає Browser Gamepad API напряму.

### Focus Model

Combo List є focus zone після `UI-CMP-012`.

Focus може рухатися:

- з `UI-CMP-012` або `UI-CMP-013` до першої safe combo card;
- між combo cards;
- від focused card до contextual card action;
- з page-level `UI-CMP-021` назад до source card focus target;
- назад до `UI-CMP-012` або safe Catalog target, якщо list empty або disabled.

### Commands

- `navUp` / `navDown`: рух між config module, combo cards і safe list targets.
- `navLeft` / `navRight`: рух між card action targets, якщо card підтримує inline actions.
- `confirm`: активує focused combo або focused card action.
- `openDetail`: відкриває detail тільки для focused valid combo.
- `addToList`: просить focused `UI-CMP-011` емітити add-to-list request.
- `openActions`: відкриває contextual actions для focused combo.
- `openFilters`: передається Catalog, щоб сфокусувати `UI-CMP-013`.
- `back`: повертає focus до попереднього safe Catalog level або закриває відкриті card actions.
- `closePanel`: закриває відкриті card actions або page-level dialog через Catalog flow.

Guard rails:

- Поки picker, `UI-CMP-013` filter body або `UI-CMP-021` dialog має focus, `UI-CMP-010` не отримує `confirm`, `openDetail` або `addToList` як background action.
- У `contextIncomplete`, `loadingCombos`, `noCombos`, `noFilterResults` і `listDisabled` states card actions не виконуються.
- Controller commands не мають відкривати detail або add-to-list без focused valid combo.
- Після close або submit page-level dialog focus повертається до source card focus target або safe list action.

## Accessibility

- Combo list має semantic list/region structure із readable label або accessible name.
- Кожна card має бути reachable keyboard navigation.
- Focus-visible має бути помітний у light, dark, standard contrast і increased contrast.
- Loading state оголошується assistive technologies.
- Empty states мають readable explanation і recovery action або guidance.
- `noFilterResults` recovery має бути доступний keyboard і controller input.
- Card actions доступні не тільки через hover.
- Action labels мають бути зрозумілі без покладання тільки на controller hints.
- Notation rendering не має покладатися тільки на колір для input token differences.
- Mobile/narrow layout має дозволяти пройти config module, list і dialogs без overlap.

## Acceptance Criteria

- `UI-CMP-010` має окремий повний spec.
- `UI.md` і `UI-PAGE-003` посилаються на цей spec.
- Combo List отримує `visibleCombos` від Catalog і не фільтрує global combo data самостійно.
- Valid context із combos рендерить `UI-CMP-011 Combo Card` для кожного visible combo.
- Optional filters оновлюють list через Catalog-selected `visibleCombos`.
- `noCombos` і `noFilterResults` показують `UI-CMP-029 Empty State`.
- `noFilterResults` має clear filters recovery без скидання selected character і variation/kameo.
- Recoverable/fatal errors лишаються за `UI-CMP-030` на page/system-state рівні.
- Add-to-list відкриває page-level singleton `UI-CMP-021`, а не list-owned dialog.
- Duplicate action відкриває builder flow і не змінює seeded combo.
- MKXL list показує тільки combos selected `character + variation`.
- MK1 list показує тільки combos selected `character + kameo`.
- Controller focus переходить між config module, combo cards і dialogs без background card actions.

## Test Scenarios

- Valid MKXL `character + variation` context показує combo cards.
- Valid MK1 `character + kameo` context показує combo cards.
- Optional starter, position, meter, damage, difficulty, route type або tags filter оновлює `visibleCombos`.
- MKXL stage/interactable filters звужують list без показу kameo metadata.
- `contextIncomplete` не дозволяє open detail або add-to-list.
- `loadingCombos` зберігає місце list і блокує card actions.
- Valid context без seeded combos показує `noCombos`.
- Valid context із filters без результатів показує `noFilterResults`.
- Clear filters із `noFilterResults` зберігає selected character і variation/kameo.
- Focus із `UI-CMP-013` переходить до першої safe combo card.
- `openDetail` працює тільки для focused valid combo.
- `addToList` із focused card відкриває page-level singleton `UI-CMP-021`.
- Close `UI-CMP-021` повертає focus до source card focus target.
- Controller commands у picker або filter body не тригерять card actions у background.

## Припущення

- Sorting, pagination і virtualization не входять у v1 contract `UI-CMP-010`.
- Catalog лишається owner-ом data preparation, filters, route changes і page-level dialogs.
- `UI-CMP-011 Combo Card` має власний детальний contract окремо від list container.
