# UI-PAGE-003: MKXL Catalog Variant

## Метадані

- Код: `UI-PAGE-003`
- Варіант: `MKXL`
- Назва: `Catalog / MKXL`
- Тип: `сторінка / variant`
- Статус деталізації: `Описано`
- Батьківська специфікація: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Game-specific component: [`UI-CMP-008 Variation Picker`](./UI-CMP-008.md)
- Shared components: [`UI-CMP-007`](./UI-CMP-007.md), [`UI-CMP-010`](./UI-CMP-010.md), [`UI-CMP-011`](./UI-CMP-011.md), `UI-CMP-012`, `UI-CMP-013`, [`UI-CMP-015`](./UI-CMP-015.md), `UI-CMP-021`, `UI-CMP-029`, `UI-CMP-030`
- Page-level singleton component: `UI-CMP-021 Add-To-List Dialog`
- Пов'язані UX сценарії: `US-002`, `US-003`, `US-004`, `US-006`, `US-007`, `US-012`, `US-014`, `US-019`, `US-023`, `US-024`, `US-025`

## Призначення

`UI-PAGE-003 MKXL Catalog Variant` описує behavior Catalog, коли active game дорівнює `MKXL`.

Архітектурно цей variant є UI contract для behavior, який надає `mkxl/catalog` через `@mk-combos/mkxl-business`. Shared Catalog page не імпортує MKXL data напряму.

MKXL variant веде користувача через flow:

```text
Character -> Variation -> Combo list
```

Variant відповідає за:

- показ character picker для `MKXL` через `MKXL.character` layout;
- показ `UI-CMP-008 Variation Picker` через `MKXL.variation` layout після вибору character;
- отримання combo list model для selected `character + variation`;
- підтримку variation як required context selector у `UI-CMP-012 Combo List Config Module`;
- підтримку optional stage/interactable filter facet для stage-specific MKXL combos;
- передачу MKXL context у detail, page-level add-to-list і duplicate-to-builder flows.

MKXL variant не рендерить `UI-CMP-009 Kameo Picker` і не використовує `kameo` як filter facet або combo context field.

## Контракт Стану Variant На Рівні Сторінки

Стан у власності сторінки:

- selected MKXL character, selected variation і optional MKXL stage/interactable filters;
- variation picker focus target і filter focus target;
- MKXL route context recovery state;
- page-level add-to-list і duplicate source context.

Підготовлені UI models для дочірніх компонентів:

- `UI-CMP-007` character picker model для `MKXL.character`;
- `UI-CMP-008` variation picker model для `MKXL.variation`;
- `UI-CMP-012` config model із MKXL required context і optional facets;
- combo card context із `character`, `variation` і optional `stageContext`.

Сторінкові handlers / intents:

- `requestSelectCharacter(payload)`, `requestSelectVariation(payload)`;
- `requestUpdateMkxlFilter(payload)`, `requestClearMkxlFilters(payload)`;
- `requestOpenMkxlDetail(payload)`, `requestOpenMkxlAddToList(payload)`, `requestDuplicateMkxlCombo(payload)`.

Бізнес-залежності:

- `@mk-combos/mkxl-business` catalog capabilities для options, route parsing, filtering і summaries.

Не відповідає за:

- direct `mkxl/data` import у shared Catalog page;
- kameo fields у MKXL page model;
- browser event payloads у variation/filter callbacks.

## Дані та контекст

MKXL combo data contract належить `mkxl/data` і `mkxl/rules`. UI variant очікує prepared summary/context із такими полями:

- `id`;
- `game = MKXL`;
- `character`;
- `variation`;
- `stageContext`;
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

`stageContext` має бути:

- `stageAgnostic` для combo, яке не використовує карту або environment interactions;
- `stageSpecific` із `stageId`, optional `zoneId`, optional `segmentId` і `interactableIds`, якщо combo використовує MKXL карту або interactable.

MKXL Catalog context вважається валідним, коли:

- active game дорівнює `MKXL`;
- selected character існує у MKXL seeded data;
- selected variation існує для selected character;
- optional selected stage існує у MKXL stage registry, якщо stage filter застосований;
- visible combo list побудований тільки із combo, які відповідають selected `character + variation`.

Stage selection не є обов'язковим кроком MKXL catalog flow. Fresh MKXL Catalog лишається `Character -> Variation -> Combo list`; stage використовується як optional filter і metadata для stage-specific combos.

## Анатомія

Розміщення читається згори вниз як MKXL specialization загальної Catalog сторінки: character і variation формують required context над filters, optional stage/interactable facet живе всередині filter body, dialog відкривається поверх page content.

```text
UI-PAGE-003 Catalog / MKXL Variant
  └─ (inside UI-PAGE-001 active route slot) MKXL catalog root
     ├─ (top) UI-CMP-012 Combo List Config Module
     │  ├─ (top/left) UI-CMP-007 Character Picker
     │  ├─ (right/below) UI-CMP-008 Variation Picker
     │  └─ (below both pickers) UI-CMP-013 Filter Control Group
     │     ├─ (top) filterHeader / result count / active chips
     │     └─ (below) filterBody
     │        ├─ (inside) Shared optional filter facets
     │        └─ (inside, after shared facets) Optional stage/interactable facet
     ├─ (below config) UI-CMP-010 Combo List
     │  └─ (inside list) UI-CMP-011 Combo Card
     │     └─ (inside card summary) UI-CMP-015 Notation Renderer
     ├─ (below list, conditional) System state area
     │  ├─ UI-CMP-029 Empty State
     │  └─ UI-CMP-030 Error State
     └─ (overlay, page-owned singleton) UI-CMP-021 Add-To-List Dialog
```

Правила розміщення:

- `UI-CMP-008` стоїть після selected character context і не дублюється як optional filter.
- На `wide13_6Plus` `UI-CMP-007` і `UI-CMP-008` можуть бути сусідніми у `contextRow`; на `compact` вони stack-яться згори вниз.
- Stage/interactable controls лишаються всередині `UI-CMP-013`, нижче shared optional facets.
- `UI-CMP-021` монтується як singleton overlay для focused card, а не як child кожної card.

### MKXL Combo List Config Module

`UI-CMP-012 Combo List Config Module` у MKXL variant має:

- показувати `UI-CMP-007 Character Picker`;
- показувати `UI-CMP-008 Variation Picker` після selected character;
- не показувати `UI-CMP-009 Kameo Picker`;
- передавати picker layout data для `MKXL.character` і `MKXL.variation`;
- скидати selected variation, якщо character змінено і попередня variation несумісна;
- показувати `UI-CMP-013 Filter Control Group` із `filterHeader`, active optional-filter chips, shared optional filters і optional stage/interactable facet;
- показувати active config summary, якщо stage, interactable або shared optional filters застосовані;
- рендерити `UI-CMP-013` expanded за замовчуванням без втрати live configuration після collapse.

### UI-CMP-008 Variation Picker

Детальна специфікація: [UI-CMP-008.md](./UI-CMP-008.md).

`UI-CMP-008 Variation Picker` є required game-specific picker для MKXL.

Picker має:

- бути доступним після вибору character;
- показувати only variations selected MKXL character;
- використовувати `MKXL.variation` layout;
- на viewport/device class від `13.6-inch` повторювати in-game MKXL variation selection `row`/`column` positions;
- на менших екранах дозволяти compact reflow через `compactOrder`;
- позначати selected variation;
- показувати slots без combo data як disabled і не selectable;
- показувати disabled/loading state, якщо variation options ще готуються;
- оновлювати combo list після вибору variation;
- емітити variation selection у page-level variant flow.

Picker не має:

- змінювати active game;
- показувати kameo options;
- мутувати combo data;
- відкривати combo detail напряму.

### MKXL config facets

`UI-CMP-012` у MKXL variant розділяє required context selectors і optional filters.

Required context selectors:

- character;
- variation;

Optional filter facets:

- stage;
- interactable;
- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags.

Config module не має показувати `kameo` facet або picker у MKXL variant.

Variation не дублюється як optional filter facet у `UI-CMP-013`; вона належить `contextRow`.

Stage/interactable facet має:

- бути optional і не блокувати показ combo list;
- показувати тільки MKXL stages із seeded stage registry;
- дозволяти звузити list до stage-specific combos конкретної карти;
- дозволяти звузити list до combo, які використовують конкретний interactable;
- не показувати interactables іншої карти після selected stage;
- скидати incompatible interactable filter після зміни selected stage.

### MKXL Combo Card

[`UI-CMP-011 Combo Card`](./UI-CMP-011.md) у MKXL variant має показувати:

- notation через [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md);
- character;
- variation;
- stage/interactable badges для stage-specific combos;
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

Page-level singleton `UI-CMP-021` отримує MKXL `character + variation` context від Catalog після request із focused card і повертає add-to-list intent у page/app-level persistence flow.

Stage-specific combo card передає `stageContext` разом із source combo context у detail, add-to-list і duplicate flows. Stage-agnostic combo не показує порожній stage placeholder.

## Контракти variant flow

### Page inputs

- active game `MKXL`;
- available MKXL characters;
- available variations for selected character;
- available MKXL stages, zones, segments і interactables;
- seeded MKXL combos;
- selected character;
- selected variation;
- optional selected stage filter;
- optional selected interactable filter;
- shared optional filters;
- active language;
- notation display mode;
- named list availability;
- controller command stream від App Shell.

### Page events

- select character;
- select variation;
- select stage filter;
- select interactable filter;
- clear stage/interactable filters;
- update shared optional filters;
- remove active filter chip;
- clear filters;
- open combo detail;
- request page-level add-to-list dialog from [`UI-CMP-011 Combo Card`](./UI-CMP-011.md);
- duplicate seeded combo into builder;
- request route fallback або not-found recovery.

### Межі відповідальності

MKXL variant:

- не створює новий stable page code;
- не змінює active game;
- не рендерить kameo picker;
- не використовує `kameo` у combo context;
- не змінює seeded combo data;
- не компонує builder graph і не вирішує valid next moves;
- не зберігає named lists напряму;
- не виконує builder logic.

## Мапа станів

### `variationSelection`

Character вибраний, а variation ще потрібна або редагується.

Очікуваний UI:

- `UI-CMP-008 Variation Picker` активний;
- kameo picker не показується;
- combo list disabled або показує guidance до вибору variation;
- controller navigation може перейти від character picker до variation picker.

### `mkxlComboList`

Selected `character + variation` валідні, і MKXL combo list готовий.

Очікуваний UI:

- combo list показує тільки `MKXL` combos selected character і variation;
- combo cards показують variation label і stage/interactable badges для stage-specific combos;
- shared optional filters і optional stage/interactable filters можуть звузити list;
- open detail, add-to-list і duplicate actions доступні відповідно до combo state.

### `mkxlNoVariationCombos`

Selected `character + variation` відновлені з route/deep link або stale context, але visible seeded combos для variation відсутні. У звичайному picker flow variation без combo data має бути `disabledNoComboData` і не selectable.

Очікуваний UI:

- `UI-CMP-029 Empty State` пояснює, що combo для цієї variation не знайдені;
- користувач може змінити variation або character;
- clear filters доступний, якщо empty state спричинений optional filters;
- state не виглядає як fatal error.

## Навігація і потік даних

### MKXL catalog flow

1. Catalog отримує active game `MKXL`.
2. MKXL variant показує `UI-CMP-007 Character Picker`.
3. Користувач вибирає character.
4. MKXL variant показує `UI-CMP-008 Variation Picker`.
5. Користувач вибирає variation.
6. Variant переходить у `mkxlComboList`.
7. Користувач може live-фільтрувати list, відкрити detail, add-to-list або duplicate.

### MKXL configuration flow

1. Користувач редагує `UI-CMP-012 Combo List Config Module`.
2. Module показує character, variation, result count, active chips, shared optional filters і optional stage/interactable facet.
3. Користувач змінює character, variation, stage, interactable або shared optional filters.
4. Variant live-застосовує configuration до MKXL combo list.
5. Якщо result порожній через selected variation, stage або interactable, variant показує `mkxlNoVariationCombos` або shared `noFilterResults` залежно від причини.

### MKXL duplicate flow

1. Користувач обирає duplicate seeded combo action.
2. Variant передає source combo id, character, variation і `stageContext` у app-level routing.
3. App Shell відкриває `UI-PAGE-006 Custom Combo Builder`.
4. Builder отримує source `movePath`, `cachedNotation`, MKXL context і stage context.
5. Seeded combo лишається read-only.

### Data flow

```text
UI-PAGE-003 MKXL Variant
  -> active game MKXL
  -> selected character
  -> selected variation
  -> optional selected stage/interactable filters
  -> MKXL seeded combos
  -> combo list configuration
  -> visible MKXL combo list
  -> UI-PAGE-004 Combo Detail або page-level singleton UI-CMP-021
  -> optional UI-PAGE-006 Custom Combo Builder duplicate flow
```

## Поведінка controller

MKXL variant використовує shared controller commands із `UI-PAGE-003 Catalog`.

Variant-specific behavior:

- `navUp`, `navDown`, `navLeft`, `navRight` рухають focus між config controls і combo cards;
- `confirm` на variation option вибирає variation;
- `back` із combo list може повернути focus до variation picker, якщо page-level UX підтримує stepped navigation;
- `openFilters` фокусує `UI-CMP-013`, лишає або переводить його в expanded state і landing на shared optional або stage/interactable filter, якщо це доречно;
- `openDetail` доступний тільки для focused combo;
- `addToList` просить focused [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) відкрити page-level singleton `UI-CMP-021` з MKXL `character + variation` context;
- `closePanel` або `back` закриває page-level `UI-CMP-021` і повертає focus до source card focus target.

Controller commands не мають вибирати variation, якої немає у selected MKXL character, або interactable, якого немає у selected stage.

## Доступність і поведінка вводу

- `UI-CMP-008 Variation Picker` має visible label або accessible name.
- Variation options мають visible selected і focus states.
- Variation slots без combo data мають readable disabled reason.
- Keyboard order іде від heading до `UI-CMP-012 Combo List Config Module`, combo list і dialogs.
- Empty state для missing variation combos має пояснювати recovery без покладання тільки на колір.
- Variation picker у config module має readable label.
- Stage/interactable facet має readable labels і не має бути єдиним способом зрозуміти, що combo stage-specific.
- Controller hints мають називати variation selection тільки у MKXL context.
- MKXL variant не має показувати kameo labels або kameo-only hints.

## Критерії приймання

- MKXL variant описаний як variant `UI-PAGE-003`, не як новий page code.
- Active game `MKXL` відкриває flow `Character -> Variation -> Combo list`.
- `UI-CMP-008 Variation Picker` є required picker після selected character.
- `UI-CMP-007` використовує `MKXL.character` layout.
- `UI-CMP-008` використовує `MKXL.variation` layout.
- Wide picker layouts від `13.6-inch` зберігають in-game slot positions.
- Compact picker layouts можуть reflow-итись через stable logical order.
- `UI-CMP-009 Kameo Picker` не рендериться у MKXL variant.
- Combo list показує тільки MKXL combos selected character і variation.
- Config module містить character, variation і `UI-CMP-013` з result count, active optional-filter chips і optional filters.
- Config module може містити optional stage/interactable facet для MKXL stage-specific combos.
- Config module не містить `kameo` facet або picker.
- MKXL combo cards показують variation context і stage/interactable context для stage-specific combos.
- Empty state для stale або deep-linked variation без visible combos не є fatal error.
- Detail, page-level add-to-list і duplicate flows отримують MKXL `character + variation` context і `stageContext`, якщо combo stage-specific.
- Duplicate flow не змінює seeded combo data.

## Тестові сценарії

- Active game `MKXL` відкриває MKXL variant.
- Fresh MKXL Catalog показує character picker і не показує kameo picker.
- Вибір character показує `UI-CMP-008 Variation Picker`.
- `MKXL.character` wide layout відповідає in-game MKXL character select positions.
- `MKXL.variation` wide layout відповідає in-game MKXL variation selection positions.
- Compact picker layouts не створюють overlap і не втрачають non-placeholder slots.
- Вибір variation показує combo list для selected character і variation.
- Зміна character скидає incompatible selected variation.
- Config module показує variation picker як required context selector.
- `UI-CMP-013` expanded за замовчуванням.
- Config module може показати optional stage/interactable facet.
- Config module не показує `kameo` facet.
- Variation picker визначає required MKXL context.
- Stage filter звужує MKXL combo list до stage-specific combos цієї карти.
- Interactable filter звужує MKXL combo list до combos, які використовують selected interactable.
- Зміна selected stage скидає incompatible interactable filter.
- Disabled variation slot без combo data не selectable і має readable disabled reason.
- Stale або deep-linked variation context без visible combos показує recoverable `mkxlNoVariationCombos`.
- Combo card відкриває `UI-PAGE-004 Combo Detail` із MKXL context.
- Add-to-list action із MKXL [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) відкриває page-level singleton `UI-CMP-021 Add-To-List Dialog`.
- Duplicate action відкриває `UI-PAGE-006 Custom Combo Builder` із source MKXL combo.
- Duplicate stage-specific combo відкриває `UI-PAGE-006 Custom Combo Builder` із source `stageContext`.
- Controller `confirm` на variation option вибирає variation.
- Controller `openFilters` фокусує `UI-CMP-013` із shared optional або stage/interactable filter.

## Відкриті уточнення

- Точний default variation behavior після вибору character буде визначено під час route/state implementation.
- Exact `row`/`column` coordinates для `MKXL.character` і `MKXL.variation` мають бути заведені в layout registry.
- Точний copy для `mkxlNoVariationCombos` має відповідати shared empty state styles.
