# UI-CMP-012: Combo List Config Module

## Метадані

- Код: `UI-CMP-012`
- Назва: `Combo List Config Module`
- Тип: `component / catalog config surface`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Variant docs: [MKXL](./UI-PAGE-003-MKXL.md), [MK1](./UI-PAGE-003-MK1.md)
- Child components: [`UI-CMP-007`](./UI-CMP-007.md), [`UI-CMP-008`](./UI-CMP-008.md), [`UI-CMP-009`](./UI-CMP-009.md), `UI-CMP-013`
- Пов'язані UX сценарії: `US-003`, `US-004`, `US-005`, `US-006`, `US-019`

## Призначення

`UI-CMP-012 Combo List Config Module` є єдиною config surface перед `UI-CMP-010 Combo List`.

Модуль розділяє:

- required context selectors: `character` і active game-specific context;
- `UI-CMP-013 Filter Control Group` для optional filters.

Optional filters застосовуються live до visible combo list. Explicit `Apply` не є частиною основного UX. `Clear filters` очищає optional filters, але не скидає selected `character + variation` для `MKXL` або selected `character + kameo` для `MK1`.

## Роль і межі

`UI-CMP-012` є compact work surface у Catalog, не route, не modal, не settings screen і не app-level toolbar.

Модуль відповідає за:

- показ і зміну required catalog context;
- рендер `UI-CMP-013 Filter Control Group`;
- передачу selected optional filters, available facets, result count і collapse state у `UI-CMP-013`;
- передачу live config events у Catalog;
- controller focus handoff між required context selectors, `UI-CMP-013` і combo list.

Модуль не відповідає за:

- зміну app-level `game`, `language` або `notation display mode`;
- читання Browser Gamepad API;
- фільтрацію global data самостійно, якщо Catalog володіє selectors;
- відкриття combo detail;
- зміну seeded combo data;
- запис route state, localStorage або user data напряму.

## Anatomy

```text
UI-CMP-012 Combo List Config Module
  ├─ contextRow
  │  ├─ UI-CMP-007 Character Picker
  │  └─ Game-specific context picker
  │     ├─ MKXL: UI-CMP-008 Variation Picker
  │     └─ MK1: UI-CMP-009 Kameo Picker
  └─ UI-CMP-013 Filter Control Group
```

### `contextRow`

`contextRow` містить required context selectors:

- [`UI-CMP-007 Character Picker`](./UI-CMP-007.md);
- [`UI-CMP-008 Variation Picker`](./UI-CMP-008.md) тільки для `MKXL`;
- [`UI-CMP-009 Kameo Picker`](./UI-CMP-009.md) тільки для `MK1`.

`character`, `variation` і `kameo` не дублюються як optional filter facets у `UI-CMP-013`. Вони є context selectors і визначають базову область combo list.

Required pickers використовують explicit layout data:

- `MKXL.character`;
- `MKXL.variation`;
- `MK1.character`;
- `MK1.kameo`.

На viewport/device class від `13.6-inch` picker layouts використовують fixed in-game `row`/`column` positions. На менших екранах `UI-CMP-012` дозволяє compact reflow через `compactOrder`, але не змінює logical option order і не перетворює picker-и на generic dropdown/filter controls.

### `UI-CMP-013 Filter Control Group`

[`UI-CMP-013 Filter Control Group`](./UI-CMP-013.md) є єдиним optional filter component у `UI-CMP-012`.

Компонент містить collapsible header і body:

- `filterHeader`: expand/collapse trigger, result count, active optional-filter chips і `Clear filters`;
- `filterBody`: optional facet controls.

`UI-CMP-013` default state є `filterGroupExpanded` під час fresh Catalog entry і context-ready render.

Filter body містить optional facets:

- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags;
- `MKXL` only: stage;
- `MKXL` only: interactable.

`MK1` не показує `variation`, stage або interactable controls у `UI-CMP-013`. `MKXL` не показує `kameo`.

## Variant Rules

### `MKXL`

`MKXL` variant використовує flow `Character -> Variation -> Combo list`.

Rules:

- `UI-CMP-008 Variation Picker` показується після selected character;
- `UI-CMP-009 Kameo Picker` ніколи не рендериться;
- `UI-CMP-007` використовує `MKXL.character` layout;
- `UI-CMP-008` використовує `MKXL.variation` layout;
- selected variation скидається, якщо character змінено і попередня variation несумісна;
- slots без combo data лишаються видимими як `disabledNoComboData` і не selectable;
- optional stage/interactable filters доступні тільки в `UI-CMP-013`;
- зміна stage скидає incompatible interactable filter;
- stage selection не блокує combo list і не є required context.

### `MK1`

`MK1` variant використовує flow `Main character -> Kameo -> Combo list`.

Rules:

- `UI-CMP-009 Kameo Picker` показується після selected main character;
- `UI-CMP-008 Variation Picker` ніколи не рендериться;
- `UI-CMP-007` використовує `MK1.character` layout;
- `UI-CMP-009` використовує `MK1.kameo` layout;
- selected kameo скидається, якщо route або data робить pair несумісним;
- slots без combo data лишаються видимими як `disabledNoComboData` і не selectable;
- `variation`, stage і interactable controls ніколи не показуються;
- kameo є required context selector, не optional filter facet.

## Interface Contract

### Inputs

- active game;
- selected character;
- selected game-specific context: `variation` або `kameo`;
- available context options;
- picker layout data для `MKXL.character`, `MKXL.variation`, `MK1.character` або `MK1.kameo`;
- viewport class: `wide13_6Plus` або `compact`;
- selected optional filters;
- available optional facets;
- result count;
- loading або disabled state;
- controller focus state;
- filter group expanded або collapsed state, default `expanded`.

### Outputs

- select character;
- select variation або kameo;
- update optional filter facet;
- remove active filter chip;
- clear filters;
- toggle filter group expanded/collapsed;
- close або collapse filter group;
- request focus return to safe Catalog target;
- request focus handoff між character picker, game-specific picker, `UI-CMP-013` і combo list.

### State Tokens

- `contextIncomplete`: required character або game-specific context відсутній.
- `contextReady`: required `character + variation/kameo` валідні.
- `filterGroupExpanded`: `UI-CMP-013` body показаний; default state для fresh Catalog entry і context-ready render.
- `filterGroupCollapsed`: `UI-CMP-013` показує тільки header; selected filters лишаються active.
- `filterActive`: один або більше optional filters застосовані.
- `loadingFacets`: options або counts для facets ще готуються.
- `noFilterResults`: live configuration не повернула combo.
- `invalidDependentContext`: selected variation, kameo або interactable більше не сумісні з upstream context.
- `wideInGameLayout`: required pickers використовують fixed in-game `row`/`column` positions.
- `compactAdaptiveLayout`: required pickers реорганізовані через stable `compactOrder`.

Deprecated для основного v1 UX:

- `dirty`;
- explicit `apply configuration`;
- draft/applied split для ordinary optional filter changes.

## UI Behavior

### Filter Group Presentation

`UI-CMP-012` рендерить `UI-CMP-013` після required context selectors.

Rules:

- `UI-CMP-013` відкритий за замовчуванням у valid Catalog context;
- collapsed state `UI-CMP-013` не очищає selected filters;
- `UI-CMP-012` не дублює result count, active chips або clear filters поза `UI-CMP-013`;
- focus може перейти з required context selectors у `UI-CMP-013`, а далі у combo list.

### Live Filtering

Optional filters застосовуються live:

1. Користувач змінює optional filter.
2. `UI-CMP-013` емітить update event через `UI-CMP-012` або Catalog.
3. Catalog перераховує visible combo list.
4. Result count і chips оновлюються.
5. Якщо result count дорівнює `0`, Catalog переходить у `noFilterResults`.

### Picker Layouts

`UI-CMP-012` передає required picker-ам layout data і viewport class.

Rules:

- на `wide13_6Plus` character, variation і kameo picker-и не reflow-яться;
- на `compact` picker-и можуть змінити visual grid через `compactOrder`;
- selected/focused state має зберігатися під час breakpoint transition;
- `Clear filters` не очищає selected character, variation або kameo;
- disabled picker slots без combo data не емітять selection;
- picker-и лишаються required context selectors, а не optional filter facets.

### Clear Filters

`Clear filters` очищає:

- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags;
- `MKXL` stage/interactable filters.

`Clear filters` не очищає:

- selected character;
- selected `MKXL` variation;
- selected `MK1` kameo;
- app-level settings.

## Controller Behavior

`UI-CMP-012` є окремою focus zone перед combo list. Компонент отримує semantic commands від Catalog/App Shell і не читає Browser Gamepad API напряму.

### Focus Zones

- `contextRow`;
- `UI-CMP-013 filterHeader`;
- `UI-CMP-013 filterBody`, only when expanded;
- `comboList`, after config module.

### Commands

- `openFilters`: фокусує `UI-CMP-013`, лишає або переводить його в `filterGroupExpanded`, ставить focus на перший active або available filter.
- `navLeft` / `navRight`: рух між controls у поточному row, picker slots або options усередині filter group.
- `navUp` / `navDown`: рух між `contextRow`, picker rows, `UI-CMP-013` header/body і `UI-CMP-010 Combo List`.
- `confirm`: вибирає focused option, відкриває picker/listbox або toggles filter value; зміна застосовується live.
- `back`: закриває відкритий picker/listbox; якщо focus у `UI-CMP-013` body, collapse-ить group і повертає focus на header trigger.
- `closePanel`: закриває picker або collapse-ить `UI-CMP-013` і повертає focus до trigger.
- contextual `clearFilters`: очищає optional filters без скидання selected context.

### Guard Rails

- Поки picker або `UI-CMP-013` body має focus чи listbox open, combo list не отримує `confirm`, `openDetail` або `addToList`.
- Після вибору MKXL character focus переходить до variation picker.
- Після вибору MK1 main character focus переходить до kameo picker.
- На `wide13_6Plus` picker navigation рухається по `row`/`column`.
- На `compact` picker navigation рухається по `compactOrder`.
- `navDown` із valid collapsed filter group може перейти до combo list після `UI-CMP-013` header.
- Controller commands не мають вибирати variation, kameo або interactable, яких немає у current options.

## Accessibility

- Кожен picker і `UI-CMP-013` control має visible label або accessible name.
- `UI-CMP-013` header trigger має `aria-expanded`, що відповідає `filterGroupExpanded` або `filterGroupCollapsed`.
- Result count оголошується через polite live region, якщо зміна впливає на task completion.
- Filter groups мають semantic grouping і readable labels.
- Required picker slots мають accessible names, selected state і disabled reasons.
- Invalid dependent context має видимий і програмний invalid/error relationship.
- Focus-visible має бути помітний у light, dark, standard contrast і increased contrast.
- No-results state дає clear filters без втрати selected context.
- Layout має лишатися usable на mobile/narrow viewport: context, `UI-CMP-013` header/body і list.

## Acceptance Criteria

- `UI-CMP-012` має окремий повний spec.
- `UI-PAGE-003` посилається на цей spec і не дублює повний контракт.
- `character`, `variation` і `kameo` не дублюються як optional filter facets.
- Required pickers використовують explicit layout keys і не alphabetic sorting.
- Wide picker layouts від `13.6-inch` зберігають in-game `row`/`column` positions.
- Compact picker layouts можуть reflow-итись тільки через stable logical order.
- `MK1` variant не містить `variation` controls.
- `MKXL` variant не містить `kameo` controls.
- Clear filters не скидає character + variation/kameo.
- `UI-CMP-013` default state є expanded.
- Optional filters застосовуються live.
- `openFilters`, `confirm`, `back` і `closePanel` не тригерять combo card actions у background.

## Test Scenarios

- Fresh Catalog без character показує `contextIncomplete`.
- MKXL: character -> variation -> combo list.
- MK1: character -> kameo -> combo list.
- `MKXL.character`, `MKXL.variation`, `MK1.character` і `MK1.kameo` wide layouts відповідають in-game slot positions.
- Compact picker layouts не створюють overlap і не втрачають non-placeholder slots.
- Disabled picker slots не selectable і мають readable disabled reason.
- `UI-CMP-013` показаний expanded за замовчуванням.
- Optional filters live-фільтрують combo list.
- Result count оновлюється після зміни optional filters.
- Active chip remove прибирає тільки відповідний filter.
- Stage change у MKXL прибирає incompatible interactable.
- No-results показує recovery action.
- Controller `openFilters`, `confirm`, `back`, `closePanel` не тригерять combo card actions у background.
