# UI-PAGE-003: MK1 Catalog Variant

## Метадані

- Код: `UI-PAGE-003`
- Варіант: `MK1`
- Назва: `Catalog / MK1`
- Тип: `сторінка / variant`
- Статус деталізації: `Описано`
- Батьківська специфікація: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Game-specific component: [`UI-CMP-009 Kameo Picker`](./UI-CMP-009.md)
- Shared components: [`UI-CMP-007`](./UI-CMP-007.md), [`UI-CMP-010`](./UI-CMP-010.md), `UI-CMP-011`, `UI-CMP-012`, `UI-CMP-013`, `UI-CMP-015`, `UI-CMP-021`, `UI-CMP-029`, `UI-CMP-030`
- Page-level singleton component: `UI-CMP-021 Add-To-List Dialog`
- Пов'язані UX сценарії: `US-002`, `US-003`, `US-005`, `US-006`, `US-007`, `US-012`, `US-014`, `US-019`, `US-023`, `US-024`

## Призначення

`UI-PAGE-003 MK1 Catalog Variant` описує behavior Catalog, коли active game дорівнює `MK1`.

MK1 variant веде користувача через flow:

```text
Main character -> Kameo -> Combo list
```

Variant відповідає за:

- показ main character picker для `MK1` через `MK1.character` layout;
- показ `UI-CMP-009 Kameo Picker` через `MK1.kameo` layout після вибору main character;
- побудову combo list для selected `character + kameo`;
- підтримку kameo як required context selector у `UI-CMP-012 Combo List Config Module`;
- передачу MK1 context у detail, page-level add-to-list і duplicate-to-builder flows.

MK1 variant не рендерить `UI-CMP-008 Variation Picker` і не використовує `variation` як filter facet або combo context field.

## Дані та контекст

MK1 combo data contract використовує:

- `id`;
- `game = MK1`;
- `character`;
- `kameo`;
- `movePath`;
- `cachedNotation`;
- `damage`;
- `meter`;
- `position`;
- `starter`;
- `routeType`;
- `difficulty`;
- `tags`;
- `notes.en`;
- `notes.uk`;
- `gameVersion`;
- `source`.

MK1 Catalog context вважається валідним, коли:

- active game дорівнює `MK1`;
- selected main character існує у MK1 seeded data;
- selected kameo існує у MK1 kameo options;
- visible combo list побудований тільки із combo, які відповідають selected `character + kameo`.

## Зони розмітки

```text
UI-PAGE-003 Catalog / MK1 Variant
  ├─ MK1 catalog root
  ├─ UI-CMP-012 Combo List Config Module
  │  ├─ UI-CMP-007 Character Picker
  │  ├─ UI-CMP-009 Kameo Picker
  │  └─ UI-CMP-013 Filter Control Group
  │     ├─ filterHeader / result count / active chips
  │     └─ filterBody
  │        └─ Shared optional filter facets
  ├─ UI-CMP-010 Combo List
  │  └─ UI-CMP-011 Combo Card
  │     └─ UI-CMP-015 Notation Renderer
  ├─ UI-CMP-021 Add-To-List Dialog
  └─ System state area
     ├─ UI-CMP-029 Empty State
     └─ UI-CMP-030 Error State
```

### MK1 Combo List Config Module

`UI-CMP-012 Combo List Config Module` у MK1 variant має:

- показувати `UI-CMP-007 Character Picker` для main character;
- показувати `UI-CMP-009 Kameo Picker` після selected main character;
- не показувати `UI-CMP-008 Variation Picker`;
- передавати picker layout data для `MK1.character` і `MK1.kameo`;
- скидати selected kameo, якщо route або data робить pair несумісним;
- показувати `UI-CMP-013 Filter Control Group` із `filterHeader`, active optional-filter chips і shared optional filters;
- показувати active config summary, якщо shared optional filters застосовані;
- рендерити `UI-CMP-013` expanded за замовчуванням без втрати live configuration після collapse.

### UI-CMP-009 Kameo Picker

Детальна специфікація: [UI-CMP-009.md](./UI-CMP-009.md).

`UI-CMP-009 Kameo Picker` є required game-specific picker для MK1.

Picker має:

- бути доступним після вибору main character;
- показувати available MK1 kameos;
- використовувати `MK1.kameo` layout;
- на viewport/device class від `13.6-inch` повторювати in-game MK1 kameo select `row`/`column` positions;
- на менших екранах дозволяти compact reflow через `compactOrder`;
- позначати selected kameo;
- показувати slots без combo data як disabled і не selectable;
- показувати disabled/loading state, якщо kameo options ще готуються;
- оновлювати combo list після вибору kameo;
- емітити kameo selection у page-level variant flow.

Picker не має:

- змінювати active game;
- показувати variation options;
- мутувати combo data;
- відкривати combo detail напряму.

### MK1 config facets

`UI-CMP-012` у MK1 variant розділяє required context selectors і optional filters.

Required context selectors:

- character;
- kameo;

Optional filter facets:

- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags.

Config module не має показувати `variation` facet або picker у MK1 variant.

Kameo не дублюється як optional filter facet у `UI-CMP-013`; він належить `contextRow`.

### MK1 Combo Card

`UI-CMP-011 Combo Card` у MK1 variant має показувати:

- notation через `UI-CMP-015 Notation Renderer`;
- main character;
- kameo;
- damage;
- meter;
- position;
- starter;
- route type;
- difficulty;
- tags;
- localized notes snippet, якщо він потрібний для list UX.

Card actions лишаються shared:

- open detail;
- request page-level add-to-list dialog;
- duplicate seeded combo to custom combo.

Page-level singleton `UI-CMP-021` отримує MK1 `character + kameo` context від Catalog після request із focused card і повертає add-to-list intent у page/app-level persistence flow.

## Контракти variant flow

### Page inputs

- active game `MK1`;
- available MK1 main characters;
- available MK1 kameos;
- seeded MK1 combos;
- selected character;
- selected kameo;
- shared optional filters;
- active language;
- notation display mode;
- named list availability;
- controller command stream від App Shell.

### Page events

- select main character;
- select kameo;
- update shared optional filters;
- remove active filter chip;
- clear filters;
- open combo detail;
- request page-level add-to-list dialog from `UI-CMP-011 Combo Card`;
- duplicate seeded combo into builder;
- request route fallback або not-found recovery.

### Межі відповідальності

MK1 variant:

- не створює новий stable page code;
- не змінює active game;
- не рендерить variation picker;
- не використовує `variation` у combo context;
- не змінює seeded combo data;
- не зберігає named lists напряму;
- не виконує builder logic.

## Мапа станів

### `kameoSelection`

Main character вибраний, а kameo ще потрібний або редагується.

Очікуваний UI:

- `UI-CMP-009 Kameo Picker` активний;
- variation picker не показується;
- combo list disabled або показує guidance до вибору kameo;
- controller navigation може перейти від character picker до kameo picker.

### `mk1ComboList`

Selected `character + kameo` валідні, і MK1 combo list готовий.

Очікуваний UI:

- combo list показує тільки `MK1` combos selected main character і kameo;
- combo cards показують kameo label;
- shared optional filters можуть звузити list;
- open detail, add-to-list і duplicate actions доступні відповідно до combo state.

### `mk1NoKameoCombos`

Selected `character + kameo` відновлені з route/deep link або stale context, але visible seeded combos для pair відсутні. У звичайному picker flow kameo без combo data має бути `disabledNoComboData` і не selectable.

Очікуваний UI:

- `UI-CMP-029 Empty State` пояснює, що combo для цієї kameo-пари не знайдені;
- користувач може змінити kameo або main character;
- clear filters доступний, якщо empty state спричинений optional filters;
- state не виглядає як fatal error.

## Навігація і потік даних

### MK1 catalog flow

1. Catalog отримує active game `MK1`.
2. MK1 variant показує `UI-CMP-007 Character Picker` для main character.
3. Користувач вибирає main character.
4. MK1 variant показує `UI-CMP-009 Kameo Picker`.
5. Користувач вибирає kameo.
6. Variant переходить у `mk1ComboList`.
7. Користувач може live-фільтрувати list, відкрити detail, add-to-list або duplicate.

### MK1 configuration flow

1. Користувач редагує `UI-CMP-012 Combo List Config Module`.
2. Module показує main character, kameo, result count, active chips і shared optional filters.
3. Користувач змінює main character, kameo або shared optional filters.
4. Variant live-застосовує configuration до MK1 combo list.
5. Якщо result порожній через selected kameo pair, variant показує `mk1NoKameoCombos` або shared `noFilterResults` залежно від причини.

### MK1 duplicate flow

1. Користувач обирає duplicate seeded combo action.
2. Variant передає source combo id, character і kameo у app-level routing.
3. App Shell відкриває `UI-PAGE-006 Custom Combo Builder`.
4. Builder отримує source `movePath`, `cachedNotation` і MK1 context.
5. Seeded combo лишається read-only.

### Data flow

```text
UI-PAGE-003 MK1 Variant
  -> active game MK1
  -> selected main character
  -> selected kameo
  -> MK1 seeded combos
  -> combo list configuration
  -> visible MK1 combo list
  -> UI-PAGE-004 Combo Detail або page-level singleton UI-CMP-021
  -> optional UI-PAGE-006 Custom Combo Builder duplicate flow
```

## Поведінка controller

MK1 variant використовує shared controller commands із `UI-PAGE-003 Catalog`.

Variant-specific behavior:

- `navUp`, `navDown`, `navLeft`, `navRight` рухають focus між config controls і combo cards;
- `confirm` на kameo option вибирає kameo;
- `back` із combo list може повернути focus до kameo picker, якщо page-level UX підтримує stepped navigation;
- `openFilters` фокусує `UI-CMP-013`, лишає або переводить його в expanded state і landing на shared optional filter, якщо це доречно;
- `openDetail` доступний тільки для focused combo;
- `addToList` просить focused `UI-CMP-011 Combo Card` відкрити page-level singleton `UI-CMP-021` з MK1 `character + kameo` context;
- `closePanel` або `back` закриває page-level `UI-CMP-021` і повертає focus до source card focus target.

Controller commands не мають вибирати kameo, якого немає у MK1 kameo options.

## Доступність і поведінка вводу

- `UI-CMP-009 Kameo Picker` має visible label або accessible name.
- Kameo options мають visible selected і focus states.
- Kameo slots без combo data мають readable disabled reason.
- Keyboard order іде від heading до `UI-CMP-012 Combo List Config Module`, combo list і dialogs.
- Empty state для missing kameo-pair combos має пояснювати recovery без покладання тільки на колір.
- Kameo picker у config module має readable label.
- Controller hints мають називати kameo selection тільки у MK1 context.
- MK1 variant не має показувати variation labels або variation-only hints.

## Критерії приймання

- MK1 variant описаний як variant `UI-PAGE-003`, не як новий page code.
- Active game `MK1` відкриває flow `Main character -> Kameo -> Combo list`.
- `UI-CMP-009 Kameo Picker` є required picker після selected main character.
- `UI-CMP-007` використовує `MK1.character` layout.
- `UI-CMP-009` використовує `MK1.kameo` layout.
- Wide picker layouts від `13.6-inch` зберігають in-game slot positions.
- Compact picker layouts можуть reflow-итись через stable logical order.
- `UI-CMP-008 Variation Picker` не рендериться у MK1 variant.
- Combo list показує тільки MK1 combos selected main character і kameo.
- Config module містить main character, kameo і `UI-CMP-013` з result count, active optional-filter chips і optional filters.
- Config module не містить `variation` facet або picker.
- MK1 combo cards показують kameo context.
- Empty state для stale або deep-linked kameo pair без visible combos не є fatal error.
- Detail, page-level add-to-list і duplicate flows отримують MK1 `character + kameo` context.
- Duplicate flow не змінює seeded combo data.

## Тестові сценарії

- Active game `MK1` відкриває MK1 variant.
- Fresh MK1 Catalog показує character picker і не показує variation picker.
- Вибір main character показує `UI-CMP-009 Kameo Picker`.
- `MK1.character` wide layout відповідає in-game MK1 main fighter select positions.
- `MK1.kameo` wide layout відповідає in-game MK1 kameo select positions.
- Compact picker layouts не створюють overlap і не втрачають non-placeholder slots.
- Вибір kameo показує combo list для selected main character і kameo.
- Зміна route або data context скидає incompatible selected kameo.
- Config module показує kameo picker як required context selector.
- `UI-CMP-013` expanded за замовчуванням.
- Config module не показує `variation` facet або picker.
- Kameo picker визначає required MK1 context.
- Disabled kameo slot без combo data не selectable і має readable disabled reason.
- Stale або deep-linked kameo context без visible combos показує recoverable `mk1NoKameoCombos`.
- Combo card відкриває `UI-PAGE-004 Combo Detail` із MK1 context.
- Add-to-list action із MK1 `UI-CMP-011 Combo Card` відкриває page-level singleton `UI-CMP-021 Add-To-List Dialog`.
- Duplicate action відкриває `UI-PAGE-006 Custom Combo Builder` із source MK1 combo.
- Controller `confirm` на kameo option вибирає kameo.
- Controller `openFilters` фокусує `UI-CMP-013` із shared optional filter.

## Відкриті уточнення

- Точний default kameo behavior після вибору main character буде визначено під час route/state implementation.
- Exact `row`/`column` coordinates для `MK1.character` і `MK1.kameo` мають бути заведені в layout registry.
- Точний copy для `mk1NoKameoCombos` має відповідати shared empty state styles.
