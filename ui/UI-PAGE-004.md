# UI-PAGE-004: Combo Detail

## Метадані

- Код: `UI-PAGE-004`
- Назва: `Combo Detail`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані компоненти: `UI-CMP-014`, [`UI-CMP-015`](./UI-CMP-015.md), [`UI-CMP-035`](./UI-CMP-035.md), [`UI-CMP-036`](./UI-CMP-036.md), `UI-CMP-017`, `UI-CMP-018`, `UI-CMP-021`, `UI-CMP-030`, `UI-CMP-031`
- Page-level singleton компонент: `UI-CMP-021 Add-To-List Dialog`
- Пов'язані UX сценарії: `US-007`, `US-009`, `US-012`, `US-014`, `US-015`, `US-016`, `US-019`, `US-023`, `US-024`

## Призначення

`UI-PAGE-004 Combo Detail` є route-level сторінкою для повного read-only перегляду seeded або local custom combo.

Сторінка підтримує:

- перегляд canonical FGC notation і mapped notation для active display mode;
- перегляд `movePath`, `cachedNotation`, runtime summary і frame data без зміни combo data;
- inspection окремих steps у [`UI-CMP-035 Combo Whiteboard`](./UI-CMP-035.md);
- inspection frame timeline у [`UI-CMP-036 Combo Frame Meter`](./UI-CMP-036.md);
- перегляд metadata, localized notes, source і gameVersion;
- додавання combo у named list через page-level singleton `UI-CMP-021 Add-To-List Dialog`;
- дублювання seeded combo у [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md);
- редагування або repair local custom combo через [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md);
- повернення до попереднього list context або fallback до [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md).

Combo Detail працює з already applied app-level settings:

- active `gameId` із route prefix;
- active game business entry point;
- active `language`: `EN` або `UA`;
- active `notation display mode`: `FGC`, `PlayStation` або `Xbox`.

Сторінка не змінює ці settings. Ручна зміна `game`, `language` і `notation display mode` належить `UI-PAGE-008 Settings`, а initial setup належить `UI-PAGE-002 First-Launch Setup`.

## Володіння

## Архітектурний контекст

Combo Detail є shared page. Route має форму `/:gameId/combos/:source/:comboId`. Сторінка делегує seeded/custom lookup, stale detection, detail model creation, duplicate/edit/repair context і source compatibility active game business entry point.

## Володіння

`UI-PAGE-004` володіє detail route context, source return context, page-level actions і controller focus mapping.

Сторінка відповідає за:

- прийом route context із `gameId`, combo id, combo source type і optional source list context;
- запит combo lookup в active game business entry point;
- перевірку через active game business, що combo належить route `gameId`;
- підготовку read-only combo detail model із game business output для header, notation, whiteboard, frame meter і metadata;
- передачу active `language` і `notation display mode` у display components;
- показ stale або invalid custom combo state без автоматичного видалення local combo;
- відкриття page-level singleton `UI-CMP-021 Add-To-List Dialog` для active combo context;
- запуск duplicate flow для seeded combo через builder route;
- запуск edit або repair flow для custom combo через builder route;
- повернення користувача до previous list context або safe Catalog fallback;
- мапінг semantic controller commands на дії detail surface.

Сторінка не відповідає за:

- зміну seeded combo data;
- replay або validation move graph напряму;
- створення composed graph;
- редагування `movePath` усередині detail surface;
- зміну або перерахунок `cachedNotation`;
- збереження custom combo напряму;
- persistence named lists напряму;
- import/export backup;
- ручну зміну `game`, `language` або `notation display mode`;
- читання Browser Gamepad API;
- визначення physical controller profile або button labels.

[`UI-CMP-035 Combo Whiteboard`](./UI-CMP-035.md) і [`UI-CMP-036 Combo Frame Meter`](./UI-CMP-036.md) є shared domain components. Combo Detail координує їхні inputs і focus sync, але не переносить builder mutation behavior у detail surface.

## Контракт Стану Сторінки

Стан у власності сторінки:

- detail route context, combo source type, combo id і previous source context;
- read-only detail loading/error state, source disclosure state і actions menu state;
- active add-to-list dialog state і source focus target;
- frame meter inspection focus, whiteboard read-only focus sync і segment details state;
- duplicate/edit/repair route intent state.

Підготовлені UI models для дочірніх компонентів:

- `UI-CMP-014` header model із combo title, source, primary action availability і stale marker data;
- `UI-CMP-035` read-only whiteboard model із page-level builder UI hook;
- `UI-CMP-036` frame meter model із page-level builder UI hook;
- `UI-CMP-017`, `UI-CMP-018`, `UI-CMP-021`, `UI-CMP-030` і `UI-CMP-031` models.

Сторінкові handlers / intents:

- `requestReturnToSource(payload)`, `requestOpenAddToList(payload)`, `requestSubmitAddToList(payload)`;
- `requestDuplicateCombo(payload)`, `requestEditCustomCombo(payload)`, `requestRepairCustomCombo(payload)`;
- `requestToggleSourceDetails(payload)`, `requestOpenActions(payload)`, `requestFocusDetailRegion(payload)`.

Бізнес-залежності:

- active game business entry point для lookup, stale detection, detail display model і repair availability;
- app-level named-list availability і persistence flow;
- page-level `@mk-combos/builder-ui` hooks для read-only whiteboard/frame models.

Не відповідає за:

- builder graph replay або mutation у detail UI;
- named-list persistence inside `UI-CMP-021`;
- browser event payloads у header/actions/whiteboard/frame callbacks.

## Анатомія

Розміщення починається з header, далі основний detail workspace; у широкому режимі whiteboard і frame meter стоять поруч, у compact вони стають вертикальною послідовністю. Page-owned dialogs і menus відкриваються поверх detail root.

```text
UI-PAGE-004 Combo Detail
  └─ (inside UI-PAGE-001 active route slot) Detail root
     ├─ (top) UI-CMP-014 Combo Detail Header
     │  ├─ (top) title / return action
     │  ├─ (below) combo characteristic chips
     │  ├─ (below, conditional) UI-CMP-031 Stale/Invalid Combo Marker
     │  └─ (right/below) primary Add-To-List action
     ├─ (below header) Detail workspace
     │  ├─ (left, wide13_6Plus / top, compact) UI-CMP-035 Combo Whiteboard
     │  │  └─ (inside path summary) UI-CMP-015 Notation Renderer
     │  └─ (right, wide13_6Plus / below, compact) UI-CMP-036 Combo Frame Meter
     ├─ (below workspace) Combo description
     │  └─ (inside) localized notes, source і gameVersion
     ├─ (below description) UI-CMP-017 Combo Metadata Grid
     ├─ (below content, conditional) UI-CMP-030 Error State
     ├─ (overlay, anchored to action source) UI-CMP-018 Combo Actions Menu
     └─ (overlay, page-owned singleton) UI-CMP-021 Add-To-List Dialog
```

Правила розміщення:

- Header завжди передує read-only whiteboard/frame workspace, щоб combo identity була першою в reading order.
- На `wide13_6Plus` `UI-CMP-035` є головною лівою region, а `UI-CMP-036` стоїть праворуч як inspection panel; на `compact` frame meter іде нижче whiteboard.
- `UI-CMP-018` є anchored overlay від action source, а `UI-CMP-021` є singleton dialog на рівні сторінки.
- Error state стоїть у page content або overlay layer залежно від severity, але його model і recovery intents належать сторінці.

### Detail root

Detail root є page-level container, який рендериться в slot активної сторінки `UI-PAGE-001 App Shell`.

Root має:

- показувати detail content для одного active combo;
- не бути modal, dropdown panel або settings screen;
- не дублювати `UI-CMP-001 Global Top Bar`;
- не містити локальні switchers для game, language або notation display mode;
- тримати стабільну лінійну структуру: header, whiteboard, frame meter, description, metadata, system/modal surfaces;
- дозволяти previous source context для return action;
- показувати recoverable system states без втрати валідного combo context.

### UI-CMP-014 Combo Detail Header

`UI-CMP-014 Combo Detail Header` є першим read area сторінки. Він показує identity, короткі характеристики combo, critical marker і primary action.

Header має показувати:

- combo title або readable fallback;
- combo characteristic chips: source type, active game, character, variation або kameo, stage context, difficulty, route type, starter, position, meter або інші compact fields, якщо вони доступні;
- `UI-CMP-031 Stale/Invalid Combo Marker`, якщо custom combo stale або invalid;
- primary Add-To-List action, яка відкриває page-level `UI-CMP-021 Add-To-List Dialog`;
- primary return action до previous list context або Catalog fallback;
- compact disabled або unavailable reason для primary actions, якщо дія недоступна.

Stale/Invalid marker у header має:

- показувати readable invalid reason;
- не покладатися тільки на колір;
- не видаляти custom combo;
- не приховувати original path;
- давати repair/edit action, якщо repair доступний;
- пояснювати, що repair відкриє guided builder.

Header не має:

- змінювати active game або character;
- відкривати picker;
- редагувати custom combo напряму;
- виконувати named list persistence.

### UI-CMP-035 Combo Whiteboard

Детальна специфікація: [UI-CMP-035 Combo Whiteboard](./UI-CMP-035.md).

У Combo Detail whiteboard є головною секцією, яка показує як вводити combo. Він завжди працює як read-only inspection surface і використовує [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md) для canonical/mapped notation.

Inputs від сторінки:

- `mode`: `detailReadOnly`;
- `movePath`;
- `cachedNotation`;
- active notation display mode;
- active language;
- focused step id або index;
- runtime summary;
- stage context і used interactables, якщо combo stage-specific;
- valid prefix, invalid tail і invalid boundary, якщо custom combo stale або invalid.

Rules:

- seeded combo і custom combo лишаються read-only;
- canonical FGC notation є source display;
- active `notation display mode` змінює тільки rendered tokens;
- `PlayStation` і `Xbox` mapping не змінює `movePath`, `cachedNotation`, seeded data або custom data;
- step focus показує move/runtime details;
- focus на step синхронізується з `UI-CMP-036 Combo Frame Meter`;
- edit custom combo і duplicate seeded combo запускаються тільки через page-level actions;
- invalid custom combo показує original path, valid prefix і invalid boundary без автоматичного обрізання;
- long notation має wrap-итися без overlap із frame meter, description або action controls;
- whiteboard не змінює `movePath`, `cachedNotation`, seeded data або custom data.

### UI-CMP-036 Combo Frame Meter

Детальна специфікація: [UI-CMP-036 Combo Frame Meter](./UI-CMP-036.md).

Frame Meter рендериться поруч із Whiteboard як read-only interactive inspector.

Inputs від сторінки:

- frame meter snapshot для selected move або whole combo;
- focused whiteboard step id або index, якщо є;
- selected timeline segment id або index;
- runtime frame context;
- invalid transition і invalid reason для stale або invalid custom combo;
- controller navigation focus state.

Rules:

- відсутність focused step показує `wholeCombo`;
- focused whiteboard step показує `selectedMove`;
- timeline segment може попросити сфокусувати matching whiteboard step;
- segment details відкривають readable details panel або disclosure;
- `back` закриває segment details і повертає focus на source segment;
- Frame Meter не емітить edit proposals, graph validation або persistence events.

### Combo description

Combo description іде після Frame Meter і показує localized notes, source і gameVersion.

Rules:

- notes використовують active language і fallback, який передав page/data layer;
- source і gameVersion можуть бути collapsed або expanded через `sourceExpanded`;
- disclosure є частиною page surface, не modal;
- unavailable localized content показує readable fallback;
- розгортання не змінює combo data і не впливає на route.

### UI-CMP-017 Combo Metadata Grid

`UI-CMP-017 Combo Metadata Grid` показує structured metadata active combo після description section.

Grid має показувати доступні поля:

- damage;
- meter;
- position;
- starter;
- route type;
- difficulty;
- tags;
- character;
- variation або kameo;
- stage context, якщо combo stage-specific;
- runtime summary, якщо parent передав його як detail metadata.

Grid не має:

- перераховувати metadata з `movePath`;
- приховувати invalid marker для stale custom combo;
- показувати порожні placeholders для absent optional fields;
- виконувати filtering або sorting.

### System states і modal windows

System states і modal windows ідуть після основного content flow. Вони не мають розривати reading order header -> whiteboard -> frame meter -> description -> metadata.

#### UI-CMP-018 Combo Actions Menu

`UI-CMP-018 Combo Actions Menu` містить secondary contextual actions для active combo.

Supported actions:

- duplicate seeded combo to custom combo;
- edit custom combo;
- repair stale або invalid custom combo;
- return to previous source context;
- open expanded actions, якщо viewport або input mode приховує inline actions.

Availability rules:

- duplicate доступний для seeded combo;
- edit доступний для valid custom combo;
- repair доступний для stale або invalid custom combo;
- disabled action має readable disabled reason або не показується;
- actions не мають бути hover-only;
- Add-To-List лишається primary action у header, але compact layouts можуть також показати secondary access у actions menu.

#### UI-CMP-021 Add-To-List Dialog

`UI-CMP-021 Add-To-List Dialog` є page-level singleton action dialog у Combo Detail.

Dialog отримує:

- active combo id;
- combo source type;
- combo summary;
- active game context;
- current named list availability;
- current membership state, якщо доступно;
- source focus target для return focus.

Dialog повертає:

- submit add-to-list intent;
- cancel або close event;
- optional create-list request, якщо page/app-level flow це дозволяє.

Dialog не має:

- створювати власний repeated instance у metadata або action menu;
- змінювати seeded combo;
- редагувати custom combo;
- зберігати named list membership напряму.

#### UI-CMP-030 Error State

`UI-CMP-030 Error State` використовується для `notFound` і recoverable detail errors.

Error state має:

- пояснювати, чому combo не можна показати;
- давати fallback до previous source або Catalog;
- не показувати `UI-PAGE-002 First-Launch Setup`, якщо settings уже застосовані або deep link auto-config був valid;
- не скидати unrelated local custom combos або named lists.

## Контракти компонентів

### Page-level detail flow

Вхідні дані:

- active app settings;
- route combo id;
- route combo source type: seeded або custom;
- optional previous list context;
- seeded combo data;
- local custom combos;
- named list availability і membership hints;
- controller command stream від App Shell.

Вихідні події:

- return to previous source context;
- return to Catalog fallback;
- open page-level singleton `UI-CMP-021 Add-To-List Dialog`;
- submit або cancel add-to-list flow;
- duplicate seeded combo into [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md);
- edit custom combo in [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md);
- repair invalid custom combo in [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md);
- recover from not found.

Межі відповідальності:

- не змінює global settings;
- не змінює seeded combo data;
- не виконує builder replay;
- не зберігає custom combo;
- не зберігає named list membership напряму;
- не читає Browser Gamepad API напряму.

## Мапа станів

### `loadingDetail`

Route context прийнятий, але combo lookup або required data ще готуються.

Очікуваний UI:

- header або detail root показує loading state;
- App Shell top bar лишається доступним;
- actions disabled, доки combo identity не підтверджена;
- previous source context не губиться.

### `seededDetail`

Показане read-only seeded combo.

Очікуваний UI:

- canonical і mapped notation видимі;
- Whiteboard працює у `detailReadOnly`;
- Frame Meter показує selected move або whole combo;
- metadata, notes, source і gameVersion доступні;
- add-to-list і duplicate actions доступні відповідно до availability;
- edit action відсутній або disabled, бо seeded combo не редагується напряму.

### `customDetail`

Показане read-only local custom combo.

Очікуваний UI:

- combo data показується з local custom source;
- Whiteboard і Frame Meter лишаються read-only;
- add-to-list action доступний відповідно до availability;
- edit action відкриває builder;
- duplicate seeded action не показується для custom combo.

### `invalidCustomDetail`

Local custom combo stale або invalid після graph update, data update чи context mismatch.

Очікуваний UI:

- `UI-CMP-031 Stale/Invalid Combo Marker` показує readable reason;
- Whiteboard показує original path, valid prefix і invalid boundary;
- Frame Meter показує invalid transition segment або unavailable reason, якщо snapshot доступний;
- add-to-list може бути disabled або marked risky залежно від app policy;
- repair action відкриває builder repair flow;
- combo не видаляється і invalid tail не обрізається автоматично.

### `notFound`

Route або deep link містить combo id, який неможливо знайти у seeded data або local custom combos.

Очікуваний UI:

- `UI-CMP-030 Error State` пояснює проблему;
- доступний fallback до previous source context або Catalog;
- якщо first-launch marker відсутній, але deep link auto-config був valid, `UI-PAGE-002` не показується;
- route не створює placeholder combo.

### `sourceExpanded`

Source, gameVersion або localized notes відкриті у disclosure.

Очікуваний UI:

- expanded content не перекриває actions або inspection workspace;
- focus може потрапити всередину disclosure через keyboard/controller;
- collapse повертає focus на trigger;
- combo data не змінюється.

### `actionsOpen`

Contextual actions menu або compact action panel відкритий.

Очікуваний UI:

- menu має керований focus;
- background whiteboard/frame meter не отримують випадкові confirm actions;
- disabled actions мають readable reason;
- `back` або `closePanel` закриває menu і повертає focus на source action.

### `addToListOpen`

Page-level singleton `UI-CMP-021 Add-To-List Dialog` відкритий для active combo context.

Очікуваний UI:

- dialog має керований focus;
- detail background не отримує controller actions;
- submit передає intent у app-level persistence flow;
- cancel не змінює named lists;
- після close focus повертається до source action або safe detail action.

### `segmentDetailsOpen`

Frame Meter показує readable details active timeline segment.

Очікуваний UI:

- details є локальним disclosure або panel усередині Frame Meter, не route;
- `back` закриває details і повертає focus на source segment;
- details не мутують combo data;
- invalid або unavailable reason readable без hover-only interaction.

### `returningToSource`

Користувач активував close/detail return action.

Очікуваний UI:

- якщо previous list context валідний, App Shell відкриває його;
- якщо previous list context stale або відсутній, App Shell відкриває Catalog fallback;
- active combo data не мутується під час return;
- focus target відновлюється, якщо source surface може його прийняти.

### `recoverableError`

Detail має валідний combo context, але page-level action або частина derived display data не може бути підготовлена.

Очікуваний UI:

- `UI-CMP-030 Error State` або inline message пояснює проблему;
- валідний combo context не губиться;
- retry, close dialog або return action доступні відповідно до причини;
- failure add-to-list не змінює named list membership.

## Навігація і потік даних

### Вхід із Catalog або filtered list

1. Користувач фокусує combo card у [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md).
2. Combo card або list емітить open detail intent.
3. Catalog передає `gameId`, combo id, active game context і previous list context у app-level routing.
4. App Shell відкриває `/:gameId/combos/:source/:comboId`.
5. Combo Detail просить active game business lookup-нути combo у seeded data або local custom combos.
6. Якщо combo знайдено, сторінка показує `seededDetail` або `customDetail`.
7. Return action повертає користувача до previous list context, якщо він валідний.

### Вхід із Named Lists

1. Користувач відкриває combo item із `UI-PAGE-005 Named Lists`.
2. Named Lists передає combo id, source list id і focus target у app-level routing.
3. Combo Detail показує combo за source type.
4. Add-to-list або edit actions працюють із active combo, але list persistence виконується app-level flow.
5. Return action повертає до list detail, якщо list context ще валідний.

### Deep link у combo detail

1. App Shell отримує route context для combo detail.
2. Якщо first-launch marker відсутній, але URL містить installed `gameId`, App Shell застосовує URL-derived active game, default `notation display mode = FGC` і не показує `UI-PAGE-002`.
3. Combo Detail просить active game business перевірити combo id і source type.
4. Якщо combo існує, сторінка показує detail state.
5. Якщо combo stale або відсутнє, сторінка показує `invalidCustomDetail` або `notFound`.

### Return до source context

1. Користувач активує close/detail return action.
2. Combo Detail просить App Shell відкрити previous source context.
3. Якщо previous source context валідний, App Shell відкриває його і повертає focus на source target.
4. Якщо previous source context stale або відсутній, App Shell відкриває [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md).
5. Combo Detail не змінює combo або list data під час return.

### Add-to-list flow

1. Користувач активує add-to-list action.
2. Combo Detail зберігає active add-to-list context: combo id, source type, summary, source focus target і named list availability.
3. Сторінка відкриває один page-level singleton `UI-CMP-021 Add-To-List Dialog`.
4. Dialog показує available named lists і membership state.
5. Користувач підтверджує або скасовує membership change.
6. Combo Detail передає submit intent у app-level persistence flow.
7. App-level persistence оновлює named lists.
8. Combo Detail показує success або recoverable error без зміни seeded/custom combo data.
9. Після close focus повертається до source action.

### Duplicate seeded combo flow

1. Користувач активує duplicate action для seeded combo.
2. Combo Detail емітить request duplicate event із `gameId`, seeded combo id і active game context.
3. App Shell відкриває [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md) із source seeded combo.
4. Active game business prefill-ить character, variation або kameo, `stageContext`, runtime summary і initial `movePath`.
5. Seeded combo лишається read-only.

### Edit custom combo flow

1. Користувач активує edit action для valid custom combo.
2. Combo Detail емітить request edit event із custom combo id.
3. App Shell відкриває [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md) у edit mode.
4. Active game builder adapter replay-ить initial path через актуальний graph.
5. Після finish app-level flow оновлює custom combo.
6. Combo Detail не змінює custom combo напряму.

### Repair invalid custom combo flow

1. Combo Detail показує `invalidCustomDetail`.
2. `UI-CMP-031 Stale/Invalid Combo Marker` пояснює invalid reason.
3. Whiteboard показує original path, valid prefix і invalid boundary.
4. Користувач активує repair action.
5. App Shell відкриває [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md) у repair mode.
6. Active game builder adapter стартує з valid prefix тільки після user action або confirmation.
7. Invalid combo не видаляється і не обрізається у detail surface.

### Data flow

```text
UI-PAGE-004 Combo Detail
  -> active app settings
  -> active game business entry point
  -> route gameId + combo id + source type
  -> game-owned seeded combo data або local custom combos
  -> read-only combo detail model
  -> UI-CMP-014 header title/chips/marker/action
  -> UI-CMP-035 read-only whiteboard із UI-CMP-015 notation rendering
  -> UI-CMP-036 read-only frame meter
  -> combo description
  -> UI-CMP-017 metadata grid
  -> system/modal surfaces: UI-CMP-018, UI-CMP-021 або UI-PAGE-006 builder route
  -> previous source context або Catalog fallback
```

`UI-PAGE-004` не пише в seeded data, custom combo data або named lists напряму. User-data mutations виконуються app-level persistence flows або builder flows.

## Поведінка controller

App Shell передає semantic controller commands активній Combo Detail сторінці.

`UI-PAGE-004` підтримує:

- `navUp`, `navDown`, `navLeft`, `navRight`: рух між header actions, notation, whiteboard steps, frame timeline segments, metadata disclosures і actions;
- `confirm`: активувати focused action, відкрити step details або segment details відповідно до focus zone;
- `back`: закрити segment details, actions menu або add-to-list dialog; якщо локальних overlay немає, виконати return до source context;
- `closeDetail`: виконати return до previous source context або Catalog fallback;
- `openActions`: відкрити `UI-CMP-018 Combo Actions Menu` або segment details, якщо focus перебуває у Frame Meter;
- `addToList`: відкрити page-level singleton `UI-CMP-021`, якщо active combo може бути додане у named list;
- `openDetail`: не має додаткового ефекту, якщо detail уже відкритий;
- `closePanel`: закрити actions menu, source disclosure або `UI-CMP-021` відповідно до active focus.

Focus-zone rules:

- Whiteboard є окремою focus zone для step inspection;
- Frame Meter є окремою focus zone для timeline inspection;
- focus на Whiteboard step оновлює Frame Meter у `selectedMove`;
- focus на Frame Meter segment може попросити Whiteboard сфокусувати matching step;
- page-level dialog блокує background controller actions;
- controller hints пояснюють active context, але не є єдиним способом зрозуміти доступні дії.

Controller commands не мають:

- змінювати global settings;
- мутувати combo path;
- виконувати add-to-list без active combo context;
- запускати duplicate/edit/repair для disabled action;
- читати Browser Gamepad API напряму.

## Доступність і поведінка вводу

- Page heading має називати combo або readable fallback.
- Header return action має бути доступний keyboard і controller input.
- Notation має readable text equivalent у canonical і mapped display modes.
- Whiteboard step focus має бути видимим і не покладатися тільки на колір.
- Frame Meter timeline segments мають readable labels і details через `confirm` або keyboard equivalent.
- Invalid boundary, stale state і unavailable frame segment не мають покладатися тільки на color.
- `UI-CMP-031` має readable invalid reason і repair path.
- `UI-CMP-021` має trap або еквівалентний focus management і повертає focus до source action.
- Actions menu закривається через `Escape`/`back` і повертає focus на source action.
- Source/notes disclosure має `aria-expanded` або equivalent state.
- Mobile layout має дозволяти послідовно пройти header, notation, whiteboard, frame meter, metadata і actions без overlap.
- Desktop layout має підтримувати щільний перегляд detail data без втрати reading order.

## Критерії приймання

- `UI-PAGE-004` є route-level сторінкою, не modal і не dropdown panel.
- Combo Detail відкривається з Catalog, filtered list, Named Lists або valid deep link.
- Combo Detail працює з active app settings і не рендерить локальні game/language/display mode switchers.
- Seeded detail є read-only.
- Custom detail є read-only, доки користувач не запускає edit або repair через builder.
- Invalid custom combo показує `UI-CMP-031`, original path, valid prefix і invalid boundary.
- Invalid custom combo не видаляється і не обрізається автоматично.
- [`UI-CMP-015`](./UI-CMP-015.md) показує canonical і mapped notation без зміни `movePath` або `cachedNotation`.
- [`UI-CMP-035`](./UI-CMP-035.md) працює у `detailReadOnly` і не емітить mutation events.
- [`UI-CMP-036`](./UI-CMP-036.md) показує selected move або whole combo frame inspection без mutation events.
- Add-to-list flow використовує один page-level singleton `UI-CMP-021`.
- Duplicate seeded combo відкриває [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md) із source combo.
- Edit custom combo відкриває [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md) у edit mode.
- Repair invalid custom combo відкриває [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md) у repair mode.
- Return action веде до previous source context або Catalog fallback.
- Display mode змінює тільки notation rendering.
- Language змінює UI labels і localized notes без зміни combo path.
- Controller commands покривають `openActions`, `addToList`, `closeDetail`, timeline/whiteboard focus і `back`.
- Combo Detail не читає Browser Gamepad API напряму.
- Invalid або stale route context відкриває `notFound` або recoverable state без показу first-launch setup, якщо settings уже застосовані або deep link auto-config був valid.

## Тестові сценарії

- Combo card у Catalog відкриває `UI-PAGE-004 Combo Detail`.
- Filtered list відкриває detail і return повертає до filtered context.
- Named list item відкриває detail і return повертає до list detail, якщо source context валідний.
- Deep link на seeded combo відкриває seeded detail.
- Deep link на custom combo відкриває custom detail, якщо local combo існує.
- Missing combo id показує `UI-CMP-030 Error State` і Catalog fallback.
- Seeded detail показує canonical FGC notation, mapped notation, metadata, notes, source і gameVersion.
- Custom detail показує local combo data read-only.
- Перемикання display mode у Settings оновлює notation rendering без зміни `movePath` або `cachedNotation`.
- Перемикання language у Settings оновлює labels і localized notes.
- Whiteboard step focus оновлює Frame Meter до `selectedMove`.
- Frame Meter segment focus може повернути focus до matching whiteboard step.
- `confirm` на Frame Meter segment відкриває readable segment details.
- `back` закриває segment details і повертає focus на source segment.
- Add-to-list action відкриває один page-level singleton `UI-CMP-021 Add-To-List Dialog`.
- Add-to-list cancel не змінює named lists.
- Add-to-list success оновлює membership через app-level persistence.
- Duplicate seeded combo відкриває builder duplicate flow із source `movePath`, `cachedNotation`, context і runtime summary.
- Edit custom combo відкриває builder edit flow.
- Stale custom combo показує `UI-CMP-031`, original path, valid prefix і invalid boundary.
- Repair stale custom combo відкриває builder repair flow без автоматичного обрізання у detail.
- Controller `openActions` відкриває contextual actions menu.
- Controller `addToList` відкриває page-level singleton dialog для active combo.
- Controller `closeDetail` повертає до previous source context або Catalog fallback.
- Controller `back` спершу закриває local overlay, а без overlay повертає зі сторінки.

## Відкриті уточнення

- Combo detail deep links використовують generic route `/:gameId/combos/:source/:comboId`; game-specific lookup і stale validation належать active game business entry point.
- Точний visual layout для detail workspace, metadata density і action placement буде узгоджено під час UI implementation pass.
- `UI-CMP-014`, `UI-CMP-017` і `UI-CMP-018` лишаються component references у цьому pass; окремі specs для них можуть бути описані пізніше.
- Policy для add-to-list stale custom combo може бути disabled або marked risky залежно від app-level product decision.
