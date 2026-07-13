# UI-PAGE-003: Catalog

## Метадані

- Код: `UI-PAGE-003`
- Назва: `Catalog`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Варіанти сторінки:
  - [UI-PAGE-003 MKXL Catalog Variant](./UI-PAGE-003-MKXL.md)
  - [UI-PAGE-003 MK1 Catalog Variant](./UI-PAGE-003-MK1.md)
- Пов'язані компоненти: `UI-CMP-007`, [`UI-CMP-010`](./UI-CMP-010.md), [`UI-CMP-011`](./UI-CMP-011.md), `UI-CMP-012`, `UI-CMP-013`, [`UI-CMP-015`](./UI-CMP-015.md), `UI-CMP-021`, `UI-CMP-029`, `UI-CMP-030`
- Page-level singleton компонент: `UI-CMP-021 Add-To-List Dialog`
- Game-specific компоненти: `UI-CMP-008` у `MKXL`, `UI-CMP-009` у `MK1`
- Пов'язані UX сценарії: `US-002`, `US-003`, `US-004`, `US-005`, `US-006`, `US-007`, `US-012`, `US-014`, `US-019`, `US-023`, `US-024`

## Призначення

`UI-PAGE-003 Catalog` є route-level сторінкою для перегляду seeded combo data в межах active `gameId`.

## Архітектурний контекст

Catalog є shared page у `apps/web`. Він не читає game data напряму і не реалізує MKXL/MK1 selectors усередині сторінки. App Shell резолвить active business entry point за `/:gameId/catalog`, а Catalog делегує йому route context parsing, context options, filtering, combo summaries і recoverable fallback behavior.

Цей документ описує shared contract Catalog surface:

- прийняти already applied app-level settings і active game business entry point із `UI-PAGE-001 App Shell`;
- показати `UI-CMP-012 Combo List Config Module` для вхідної конфігурації list;
- передати character і game-specific context у відповідний variant flow;
- показати combo list для валідного catalog context;
- звузити list через filters усередині config module;
- відкрити `UI-PAGE-004 Combo Detail`;
- додати seeded combo у named list через page-level singleton `UI-CMP-021 Add-To-List Dialog`;
- дублювати seeded combo у custom combo через `UI-PAGE-006 Custom Combo Builder`;
- підтримати mouse, touch, keyboard і semantic controller commands.

Game-specific поведінка винесена в окремі variant specs:

| Active game | Variant doc | Context flow | Game-specific picker |
| --- | --- | --- | --- |
| `MKXL` | [UI-PAGE-003-MKXL.md](./UI-PAGE-003-MKXL.md) | `Character -> Variation -> Combo list` | `UI-CMP-008 Variation Picker` |
| `MK1` | [UI-PAGE-003-MK1.md](./UI-PAGE-003-MK1.md) | `Main character -> Kameo -> Combo list` | `UI-CMP-009 Kameo Picker` |

`UI-PAGE-003` лишається єдиним стабільним page code для Catalog. `MKXL` і `MK1` є variant docs під цим кодом, а не новими `UI-PAGE-###` identifiers.

Catalog працює тільки з already applied app-level context:

- active `gameId`, отриманий із route prefix або root setup fallback;
- active game business entry point;
- active `language`: `EN` або `UA`;
- active `notation display mode`: `FGC`, `PlayStation` або `Xbox`.

Catalog не змінює `game`, `language` або `notation display mode`. Ручна зміна цих values належить `UI-PAGE-008 Settings`, а initial setup належить `UI-PAGE-002 First-Launch Setup`.

## Володіння

`UI-PAGE-003` володіє shared catalog state і координує common list/filter/detail actions.

Сторінка відповідає за:

- читання active app settings і active game business entry point, переданих через `UI-PAGE-001 App Shell`;
- вибір або відновлення game-specific variant за active `gameId`;
- рендер `UI-CMP-012 Combo List Config Module` як єдиного UX-модуля вхідної конфігурації combo list;
- делегування game-specific config flow у variant spec;
- запит visible combo list model в active game business entry point;
- застосування live optional filter state до visible combo list;
- відкриття detail route для selected combo;
- прийом add-to-list request від [`UI-CMP-011 Combo Card`](./UI-CMP-011.md);
- відкриття одного page-level `UI-CMP-021 Add-To-List Dialog` для active add-to-list context;
- запуск duplicate flow для seeded combo через builder route;
- мапінг semantic controller commands на дії catalog surface.

Сторінка не відповідає за:

- зміну global settings;
- збереження settings у local browser storage;
- зміну seeded combo data;
- створення або редагування custom combo всередині Catalog;
- persistence named lists напряму;
- import/export backup;
- читання Browser Gamepad API;
- визначення controller profile або button labels;
- створення нових page codes для game-specific variants.

`UI-CMP-012 Combo List Config Module` є частиною Catalog surface, але не є окремою route-level page. Він розділяє required context selectors і `UI-CMP-013 Filter Control Group` для optional filters та не змінює app-level settings. Детальний контракт описано в [UI-CMP-012](./UI-CMP-012.md).

## Контракт Стану Сторінки

Стан у власності сторінки:

- route catalog context, active game, selected character і game-specific context;
- optional filter values, filter group expanded/collapsed state і config focus target;
- visible combo query state, focused combo, action menu state і add-to-list dialog state;
- recoverable route/context errors і safe Catalog fallback target;
- controller command mapping для Catalog surface.

Підготовлені UI models для дочірніх компонентів:

- `UI-CMP-012` config model із required context selectors, optional filters, result count і focus state;
- picker models для `UI-CMP-007`, `UI-CMP-008` або `UI-CMP-009`;
- `UI-CMP-010` list model і repeated `UI-CMP-011` card models;
- singleton `UI-CMP-021` dialog model і system state models.

Сторінкові handlers / intents:

- `requestSelectCharacter(payload)`, `requestSelectGameContext(payload)`, `requestUpdateOptionalFilter(payload)`;
- `requestToggleFilterGroup(payload)`, `requestFocusCatalogTarget(payload)`;
- `requestOpenDetail(payload)`, `requestOpenAddToList(payload)`, `requestDuplicateToBuilder(payload)`;
- `requestSubmitAddToList(payload)`, `requestRecoverCatalogContext(payload)`.

Бізнес-залежності:

- active game business entry point для route context parsing, catalog selectors, context options і combo summaries;
- app-level named-list availability і persistence flow;
- applied language і notation display mode від App Shell.

Не відповідає за:

- direct MKXL/MK1 data imports;
- named-list persistence inside list/card/dialog UI;
- browser event payloads у picker, filter, list або card callbacks.

## Анатомія

Розміщення читається згори вниз: config module стоїть над list, page-owned dialogs і system states не є repeated children cards.

```jsx
<CatalogPage ui="UI-PAGE-003">
  <CatalogSurface slot="UI-PAGE-001 active route">
    <Stack name="CatalogLayout">
      <ComboListConfigModule ui="UI-CMP-012">
        <CharacterPicker ui="UI-CMP-007" />

        <GameSpecificContextPicker>
          <Show when={activeGame === "MKXL"}>
            <VariationPicker ui="UI-CMP-008" />
          </Show>

          <Show when={activeGame === "MK1"}>
            <KameoPicker ui="UI-CMP-009" />
          </Show>
        </GameSpecificContextPicker>

        <FilterControlGroup ui="UI-CMP-013" />
      </ComboListConfigModule>

      <ComboList ui="UI-CMP-010">
        <ComboCard ui="UI-CMP-011">
          <NotationRenderer ui="UI-CMP-015" />
        </ComboCard>
      </ComboList>

      <Show when={hasSystemState}>
        <SystemStateArea>
          <EmptyState ui="UI-CMP-029" />
          <ErrorState ui="UI-CMP-030" />
        </SystemStateArea>
      </Show>

      <Show when={isAddToListDialogOpen}>
        <AddToListDialog ui="UI-CMP-021" />
      </Show>
    </Stack>
  </CatalogSurface>
</CatalogPage>
```

Правила розміщення:

- `UI-CMP-012` завжди передує `UI-CMP-010`, щоб filters/context читалися перед results.
- На `desktop` context pickers можуть стояти поруч; на `mobile` і `tablet` вони stack-яться згори вниз.
- `UI-CMP-021` відкривається як singleton overlay, а не всередині кожної card.

### CatalogSurface

CatalogSurface є page-level container, який рендериться в slot активної сторінки `UI-PAGE-001 App Shell`.

CatalogSurface має:

- показувати active game context;
- не бути modal, dropdown panel або settings screen;
- не дублювати `UI-CMP-001 Global Top Bar`;
- не містити локальні switchers для game, language або notation display mode;
- тримати стабільну структуру для config module і combo list;
- показувати system states без втрати валідного catalog context;
- дозволяти deep link або route context відновити character, game-specific context і filters, якщо вони валідні.

### UI-CMP-012 Combo List Config Module

Детальна специфікація: [UI-CMP-012 Combo List Config Module](./UI-CMP-012.md).

`UI-CMP-012 Combo List Config Module` показує і змінює всю вхідну конфігурацію combo list як одну Catalog surface перед `UI-CMP-010 Combo List`.

Module містить:

- `contextRow`: [`UI-CMP-007 Character Picker`](./UI-CMP-007.md) і game-specific picker із active variant doc;
- [`UI-CMP-013 Filter Control Group`](./UI-CMP-013.md): collapsible filter header, result count, active optional-filter chips, clear filters і optional facet controls.

Config module не має показувати `Game Switcher`. Active game приходить з app-level settings.

### UI-CMP-007 Character Picker

Детальна специфікація: [UI-CMP-007.md](./UI-CMP-007.md).

`UI-CMP-007 Character Picker` дає вибрати character у межах active game.

Picker має:

- показувати тільки characters active game;
- використовувати `MKXL.character` або `MK1.character` layout key;
- на viewport/device class від `13.6-inch` повторювати in-game `row`/`column` positions;
- на менших екранах дозволяти mobile і tablet reflow через `responsiveOrder`;
- позначати selected character;
- показувати full game roster slots, включно з disabled slots без combo data;
- підтримувати empty/loading state, якщо options ще не готові;
- скидати incompatible game-specific context на page-level flow після зміни character;
- не змінювати active game.

### Game-specific context picker

Game-specific picker визначається active game:

- для `MKXL` Catalog рендерить [`UI-CMP-008 Variation Picker`](./UI-CMP-008.md);
- для `MK1` Catalog рендерить [`UI-CMP-009 Kameo Picker`](./UI-CMP-009.md).

Shared Catalog не дублює detailed picker behavior. Деталі picker contract, layout keys, state tokens і responsive rules належать відповідним component specs і variant docs.

`UI-CMP-012` має:

- рендерити `UI-CMP-013` після required context selectors;
- фокусувати filter controls через semantic command `openFilters`, не перейменовуючи command API;
- передавати selected optional filters, available facets, result count і filter group collapse state у `UI-CMP-013`;
- застосовувати optional filters live без explicit `Apply`;
- підтримувати clear filters без втрати selected character і game-specific context;
- відкривати `UI-CMP-013` expanded за замовчуванням у fresh Catalog і context-ready render;
- згортати `UI-CMP-013` без втрати active live configuration;
- показувати result count або no-results state, якщо live configuration не повертає combo;
- використовувати game-specific controls і facets із active variant doc.

Required context selectors:

- character;
- `MKXL`: variation;
- `MK1`: kameo.

Optional filters:

- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags.

Game-specific optional filters:

- `MKXL`: stage і interactable;
- `MK1`: немає additional optional facets у v1.

### UI-CMP-010 Combo List

Детальна специфікація: [UI-CMP-010 Combo List](./UI-CMP-010.md).

`UI-CMP-010 Combo List` показує visible seeded combos для поточного catalog context.

На рівні Catalog page list має:

- отримувати уже підготовлені visible combos від Catalog;
- показувати тільки combos active game, selected character і active variant context;
- відображати результат current live filters без власної фільтрації global data;
- підтримувати keyboard і controller focus між combo cards;
- показувати empty state, якщо context валідний, але combo немає;
- не змінювати seeded combo data.

### UI-CMP-011 Combo Card

Детальна специфікація: [UI-CMP-011 Combo Card](./UI-CMP-011.md).

`UI-CMP-011 Combo Card` є item у combo list.

Card має показувати короткий preview:

- notation через [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md);
- character;
- active game-specific context summary;
- damage;
- meter;
- position;
- starter;
- route type;
- difficulty;
- tags;
- localized notes snippet, якщо він потрібний для list UX.

Card може мати contextual actions:

- open detail;
- request add to list;
- duplicate seeded combo to custom combo.

Card не має виконувати persistence mutation або рендерити власний dialog instance. Вона емітить page-level add-to-list request із combo context, а Catalog відкриває свій singleton `UI-CMP-021`.

### UI-CMP-021 Add-To-List Dialog

`UI-CMP-021 Add-To-List Dialog` є page-level singleton action dialog у `UI-PAGE-003 Catalog`.

Dialog має:

- показувати available named lists;
- показувати current membership state, якщо combo вже є у списку;
- дозволяти додати combo до selected list;
- дозволяти закрити dialog без зміни named lists;
- приймати active add-to-list context від сторінки;
- передавати add-to-list intent у page/app-level flow.

Catalog не керує named list storage напряму.

### System state area

System state area показує loading, empty або recoverable error states.

Використовуються:

- `UI-CMP-029 Empty State` для `noCharacterSelected`, `noCombos` і `noFilterResults`;
- `UI-CMP-030 Error State` для recoverable data або route-context errors.

System state не має приховувати валідні recovery actions: clear filters, choose character, choose game-specific context або return to CatalogSurface.

## Контракти компонентів

### UI-CMP-007 Character Picker

Вхідні дані:

- active game;
- available characters;
- picker layout data для active game;
- selected character;
- disabled або loading state;
- optional counts для available combos;
- viewport class: `mobile`, `tablet` або `desktop`;
- controller focus state.

Вихідні події:

- select character;
- focus character option;
- focus character slot за `row`/`column` або `responsiveOrder`;
- clear selected character, якщо page-level UX це дозволяє.

Межі відповідальності:

- не змінює active game;
- не завантажує seeded data самостійно;
- не обирає game-specific context самостійно;
- не відкриває combo detail.
- не сортує roster alphabetically замість layout registry.

### UI-CMP-012 Combo List Config Module

Вхідні дані:

- active game;
- selected character;
- selected game-specific context;
- available context options;
- selected optional filters;
- available optional facets;
- result count;
- disabled або loading state;
- controller focus state;
- filter group expanded або collapsed state, default `expanded`.

Вихідні події:

- select character;
- select variation або kameo через active variant;
- update optional filter facet;
- remove active filter chip;
- clear filters;
- toggle filter group expanded/collapsed;
- close або collapse filter group;
- request focus return to safe Catalog control.

Межі відповідальності:

- не змінює app-level settings;
- не змінює seeded combo data;
- не відкриває combo detail напряму;
- не пише route state або localStorage напряму;
- не читає Browser Gamepad API напряму.

### UI-CMP-013 Filter Control Group

Детальна специфікація: [UI-CMP-013.md](./UI-CMP-013.md).

Вхідні дані:

- selected optional filters;
- available optional facets;
- result count;
- expanded або collapsed state, default `expanded`;
- loading або disabled state;
- validation або compatibility message;
- controller focus state.

Вихідні події:

- update optional filter facet;
- remove active filter chip;
- clear filters;
- toggle expanded/collapsed;
- close або collapse filter group;
- request focus return to safe Catalog target.

Межі відповідальності:

- не застосовує filters самостійно поза update events до parent surface;
- не читає combo data напряму;
- не змінює global settings;
- не вибирає character, variation або kameo.

### UI-CMP-010 Combo List

Детальна специфікація: [UI-CMP-010.md](./UI-CMP-010.md).

Вхідні дані:

- visible combos;
- active catalog context;
- current filters;
- active language;
- notation display mode;
- focused combo id або index;
- loading, empty або disabled state.

Вихідні події:

- focus combo;
- open combo detail;
- open combo actions;
- request add to list;
- request duplicate to custom combo.

Межі відповідальності:

- не фільтрує global data самостійно, якщо filtering виконано page-level selector;
- не змінює route напряму;
- не створює custom combo;
- не змінює named lists.

### UI-CMP-011 Combo Card

Детальна специфікація: [UI-CMP-011 Combo Card](./UI-CMP-011.md).

Вхідні дані:

- combo summary;
- active language;
- notation display mode;
- selected або focused state;
- available contextual actions;
- named list membership hint, якщо доступний;
- named list availability hint для add-to-list action.

Вихідні події:

- open detail;
- request duplicate to custom combo;
- open contextual actions;
- request add to list with combo context.

Межі відповідальності:

- не перераховує `movePath`;
- не змінює `cachedNotation`;
- не мутує seeded combo data;
- не пише user data;
- не зберігає named list membership напряму.

### UI-CMP-015 Notation Renderer

Детальна специфікація: [UI-CMP-015 Notation Renderer](./UI-CMP-015.md).

Вхідні дані:

- canonical FGC notation або `cachedNotation`;
- notation display mode;
- active language, якщо labels локалізуються;
- display density або context, якщо card/list UI це підтримує.

Вихідні події:

- display-only component, основних mutation events немає.

Межі відповідальності:

- не змінює `movePath`;
- не змінює source seeded data;
- не вирішує active display mode.

### UI-CMP-021 Add-To-List Dialog

Вхідні дані:

- selected seeded combo id і summary;
- source card focus target;
- active game context;
- available named lists;
- current membership state;
- persistence availability;
- saving або error state.

Вихідні події:

- submit add-to-list intent to page/app-level persistence flow;
- close dialog;
- create list request, якщо page-level flow це дозволяє;
- retry add після recoverable error.

Межі відповідальності:

- не створює named list самостійно;
- не зберігає membership напряму;
- не змінює seeded combo;
- не існує як repeated child instance усередині кожної [`UI-CMP-011 Combo Card`](./UI-CMP-011.md);
- не відкриває backup або settings.

### Page-level catalog flow

Вхідні дані:

- active app settings;
- seeded combo data;
- route context;
- current list configuration;
- named list availability;
- active add-to-list context: combo id/summary, source card focus target, active game context і named list availability;
- controller command stream від App Shell.

Вихідні події:

- select character;
- select active game-specific context через variant flow;
- update optional filter facet;
- remove active filter chip;
- clear filters;
- open `UI-PAGE-004 Combo Detail`;
- receive add-to-list request from [`UI-CMP-011 Combo Card`](./UI-CMP-011.md);
- open page-level singleton `UI-CMP-021 Add-To-List Dialog`;
- submit або cancel add-to-list flow;
- duplicate seeded combo into `UI-PAGE-006 Custom Combo Builder`;
- request route fallback або not-found recovery.

Межі відповідальності:

- не змінює global settings;
- не зберігає settings;
- не змінює seeded combo data;
- не виконує custom builder logic;
- не керує backup;
- не читає Browser Gamepad API напряму.

## Мапа станів

### `loadingData`

Seeded combo data або catalog indexes ще готуються до показу.

Очікуваний UI:

- pickers і combo list показують loading або disabled state;
- active game лишається видимим через `UI-CMP-002` у App Shell breadcrumbs;
- user не може відкрити detail для combo, якого ще немає у visible data.

### `gameContextReady`

Catalog отримав active game, language і notation display mode з app-level settings.

Очікуваний UI:

- active game зрозумілий користувачу;
- character picker готовий або переходить у loading;
- catalog не показує локальні game/language/display mode switchers;
- активний variant визначено як `MKXL` або `MK1`.

### `noCharacterSelected`

Game обрана, але character ще не вибраний.

Очікуваний UI:

- `UI-CMP-007 Character Picker` є primary control;
- combo list показує empty guidance через `UI-CMP-029`;
- game-specific picker disabled або прихований до вибору character.

### `comboList`

Catalog має валідний shared і game-specific context та показує combo list.

Очікуваний UI:

- `UI-CMP-010 Combo List` показує combo cards;
- notation відповідає active notation display mode;
- labels і notes відповідають active language;
- open detail, add-to-list і duplicate actions доступні відповідно до combo state.

### `filteredList`

Visible combo list звужено через optional filters.

Очікуваний UI:

- active config summary видимий;
- clear filters доступний;
- combo count відповідає live configuration;
- context pickers лишаються узгодженими з active game і active variant.

### `noCombos`

Catalog context валідний, але seeded combos для нього відсутні.

Очікуваний UI:

- `UI-CMP-029 Empty State` пояснює, що combo не знайдені для current context;
- користувач може змінити character або game-specific context;
- state не виглядає як fatal error.

### `noFilterResults`

Live configuration не повернула жодне combo.

Очікуваний UI:

- `UI-CMP-029 Empty State` пояснює no-results;
- clear filters доступний як primary recovery;
- selected character і game-specific context не губляться.

### `configFocused`

Focus перебуває у `UI-CMP-012 Combo List Config Module`.

Очікуваний UI:

- focus переходить у config module або на перший safe control;
- combo list не отримує випадкові controller confirm/open detail/add-to-list events;
- close/back повертає focus до safe catalog control;
- live configuration лишається активною після згортання `UI-CMP-013`.

### `filterGroupExpanded`

`UI-CMP-013 Filter Control Group` показує `filterBody`.

Очікуваний UI:

- `UI-CMP-013` відкритий як частина Catalog surface, не modal;
- `openFilters` ставить focus на перший active або available filter;
- `back` або `closePanel` collapse-ить group і повертає focus на filter header trigger;
- combo list не отримує background actions, поки picker або filter body має focus.

### `addToListOpen`

Page-level singleton `UI-CMP-021 Add-To-List Dialog` відкритий для active add-to-list context.

Очікуваний UI:

- dialog має керований focus;
- combo list не отримує background actions;
- cancel/close не змінює named lists;
- після success або close focus повертається до source card focus target або safe list action.

### `notFound`

Route або deep link містить context, який неможливо знайти у current seeded data.

Очікуваний UI:

- `UI-CMP-030 Error State` або recoverable state пояснює проблему;
- доступний fallback до CatalogSurface або valid nearest context;
- `UI-PAGE-002 First-Launch Setup` не показується, якщо settings уже застосовані або deep link auto-config був valid.

### `recoverableError`

Catalog не може підготувати частину даних або виконати page-level action, але app може продовжити роботу.

Очікуваний UI:

- `UI-CMP-030 Error State` показує readable message;
- валідний context не губиться;
- retry, clear filters або return to CatalogSurface доступні відповідно до причини.

## Навігація і потік даних

### Вхід після first-launch setup

1. Користувач завершує `UI-PAGE-002 First-Launch Setup`.
2. App-level state застосовує selected default game, language і notation display mode.
3. `UI-PAGE-001 App Shell` відкриває `/:gameId/catalog`.
4. Catalog отримує active settings і active game business entry point.
5. Catalog вибирає active variant за `gameId` і показує character selection.

### Вхід через breadcrumb або navigation

1. Користувач активує navigable `Catalog` breadcrumb у `UI-CMP-032 Breadcrumbs`.
2. `UI-CMP-001 Global Top Bar` емітить `requestNavigateBreadcrumb`.
3. `UI-PAGE-001 App Shell` відкриває `UI-PAGE-003 Catalog`.
4. Catalog відновлює останній валідний context для active variant або показує `noCharacterSelected`.

### Deep link у catalog context

1. App Shell отримує route context для Catalog.
2. Якщо first-launch marker відсутній, але URL містить installed `gameId`, App Shell застосовує route-derived active game і не показує `UI-PAGE-002`.
3. Catalog визначає active variant за route `gameId`.
4. Catalog просить active game business перевірити character і game-specific context.
5. Якщо context валідний, Catalog відкриває відповідний list або filtered list.
6. Якщо context stale або невалідний, Catalog переходить у `notFound` або найближчий recoverable state.

### Combo list configuration flow

1. Користувач редагує `UI-CMP-012 Combo List Config Module`.
2. Module показує character, active game-specific context, result count, active chips і optional filters.
3. Користувач змінює character, game-specific context або optional filters.
4. Catalog передає configuration в active game business і отримує visible combo list.
5. Якщо results є, сторінка переходить у `filteredList`.
6. Якщо results немає, сторінка переходить у `noFilterResults`.

### Відкриття combo detail

1. Користувач фокусує або обирає combo card.
2. Combo list або card емітить open detail event.
3. Catalog передає `gameId`, combo id і list context у app-level routing.
4. App Shell відкриває `UI-PAGE-004 Combo Detail`.
5. Detail може повернути користувача до попереднього list context.

### Add-to-list flow

1. Користувач обирає add-to-list action для seeded combo.
2. [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) емітить page-level add-to-list request із combo context.
3. Catalog зберігає active add-to-list context: combo id/summary, source card focus target, active game context і named list availability.
4. Catalog відкриває свій singleton `UI-CMP-021 Add-To-List Dialog`.
5. Dialog показує available named lists і current membership state для active combo.
6. Користувач підтверджує або скасовує list membership change.
7. Catalog передає submit intent у app-level persistence flow.
8. App-level persistence оновлює named lists.
9. Catalog показує success або recoverable error без зміни seeded combo.
10. Після close focus повертається до source card focus target або safe list action.

### Duplicate seeded combo flow

1. Користувач обирає duplicate action для seeded combo.
2. Catalog емітить request duplicate event із seeded combo id.
3. App Shell відкриває `UI-PAGE-006 Custom Combo Builder` із source seeded combo.
4. Builder route отримує `gameId`, initial `movePath` і variant context через active game business entry point.
5. Seeded combo лишається read-only.

### Data flow

```text
UI-PAGE-003 Catalog
  -> active app settings
  -> active game business entry point
  -> game-owned catalog selectors and seeded combo data
  -> combo list configuration
  -> visible combo list
  -> UI-PAGE-004 Combo Detail або page-level singleton UI-CMP-021
  -> optional UI-PAGE-006 Custom Combo Builder duplicate flow
```

`UI-PAGE-003` не пише в seeded data. User-data mutations виконуються app-level flows для named lists або builder.

## Поведінка controller

App Shell передає semantic controller commands активній Catalog сторінці.

`UI-PAGE-003` підтримує:

- `navUp`, `navDown`, `navLeft`, `navRight`: рух між picker options, filter controls і combo cards;
- `confirm`: вибрати focused option або активувати focused combo/action;
- `back`: закрити picker, collapse-ити `UI-CMP-013`, закрити page-level dialog або повернутися до попереднього safe catalog level; для `UI-CMP-021` focus повертається до source card focus target;
- `openFilters`: сфокусувати `UI-CMP-013 Filter Control Group`, лишити або перевести його в expanded state і поставити focus на перший active або available filter;
- `closePanel`: закрити picker, collapse-ити `UI-CMP-013` або закрити page-level `UI-CMP-021`; після dialog focus повертається до source card focus target;
- `openDetail`: відкрити selected/focused combo detail;
- `addToList`: попросити focused [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) емітити request для відкриття page-level singleton `UI-CMP-021`;
- `openActions`: відкрити contextual actions для focused combo або current catalog context.

Variant docs уточнюють, як navigation рухається між character picker і game-specific picker. Детальна focus model `UI-CMP-012` описана в [UI-CMP-012](./UI-CMP-012.md).

Controller commands не мають:

- змінювати global settings;
- відкривати detail, якщо combo не сфокусоване або невалідне;
- тригерити combo card actions, поки picker або `UI-CMP-013` filter body має focus;
- виконувати add-to-list без focused [`UI-CMP-011 Combo Card`](./UI-CMP-011.md);
- читати Browser Gamepad API напряму.

## Доступність і поведінка вводу

- Усі picker controls мають visible label або accessible name.
- Active game має бути зрозумілий без покладання тільки на top bar color або icon.
- Keyboard order іде від page heading до `UI-CMP-012 Combo List Config Module`, combo list і dialogs.
- Focus у combo list має бути помітним для keyboard і controller navigation.
- `UI-CMP-013 Filter Control Group` має керований focus, readable expanded/collapsed state і `aria-expanded` для header trigger.
- Page-level `UI-CMP-021 Add-To-List Dialog` має trap або еквівалентний focus management і повертає focus до source card focus target після закриття.
- Loading state під час `loadingData` має бути оголошений assistive technologies.
- Empty states мають містити recovery action або recovery guidance.
- No-results state має давати clear filters без втрати selected character і game-specific context.
- Combo card actions мають бути доступні keyboard і controller input, не тільки hover.
- Notation rendering не має покладатися тільки на колір для різниці input tokens.
- Controller hints не є єдиним способом зрозуміти доступні дії.
- Mobile layout має дозволяти послідовно пройти config module і list без overlap.
- Desktop layout має підтримувати щільний перегляд і фільтрацію без втрати reading order.

## Критерії приймання

- `UI-PAGE-003` є route-level сторінкою, не modal і не dropdown panel.
- `UI-PAGE-003` лишається єдиним stable page code для Catalog.
- `MKXL` і `MK1` описані як variant docs, а не нові `UI-PAGE-###` codes.
- Catalog відкривається після completion `UI-PAGE-002 First-Launch Setup`.
- Catalog може відкриватися через navigable `Catalog` breadcrumb.
- Catalog працює з active app settings і не рендерить локальні game/language/display mode switchers.
- Active game вибирає відповідний variant flow.
- Required pickers використовують in-game layout data для active variant.
- Combo list показує тільки combos active game і selected context.
- `UI-CMP-012 Combo List Config Module` розділяє required context selectors і `UI-CMP-013 Filter Control Group`.
- `UI-CMP-013` рендериться expanded за замовчуванням.
- Optional filters live-звужують combo list.
- `noFilterResults` дає clear filters без втрати selected character і game-specific context.
- Combo card відкриває `UI-PAGE-004 Combo Detail`.
- Add-to-list flow використовує один page-level singleton `UI-CMP-021` і не змінює seeded combo data.
- Duplicate seeded combo відкриває `UI-PAGE-006 Custom Combo Builder` із source combo.
- Display mode змінює тільки rendering notation і не змінює `movePath`, `cachedNotation` або seeded data.
- Language змінює UI labels і localized content без зміни selected game або combo path.
- Controller commands працюють через semantic page-level handlers.
- Catalog не читає Browser Gamepad API напряму.
- Invalid або stale route context відкриває recoverable `notFound` або nearest valid state.

## Тестові сценарії

- Після first-launch confirmation app відкриває `UI-PAGE-003 Catalog`.
- Catalog breadcrumb відкриває `UI-PAGE-003 Catalog`.
- Fresh Catalog для active game показує character picker і `noCharacterSelected`.
- Active game `MKXL` використовує [UI-PAGE-003 MKXL Catalog Variant](./UI-PAGE-003-MKXL.md).
- Active game `MK1` використовує [UI-PAGE-003 MK1 Catalog Variant](./UI-PAGE-003-MK1.md).
- Wide picker layouts від `13.6-inch` зберігають in-game slot positions.
- Compact picker layouts можуть адаптивно реорганізовуватись без втрати logical order.
- `UI-CMP-013` default state є expanded у valid Catalog context.
- Optional filters за starter, position, meter, damage, difficulty, route type або tags звужують combo list.
- Result count оновлюється після зміни optional filters.
- Clear filters повертає combo list для selected context.
- No-results live configuration показує `UI-CMP-029 Empty State`.
- Context без seeded combos показує `noCombos`, але не fatal error.
- Combo card відкриває `UI-PAGE-004 Combo Detail`.
- Add-to-list action з focused [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) відкриває page-level singleton `UI-CMP-021 Add-To-List Dialog`.
- Add-to-list success оновлює named list membership через app-level persistence.
- Add-to-list cancel не змінює named lists.
- Duplicate seeded combo відкриває `UI-PAGE-006 Custom Combo Builder`.
- Duplicate flow не змінює seeded combo data.
- Перемикання display mode у Settings оновлює notation rendering у Catalog без зміни `movePath`.
- Перемикання language у Settings оновлює labels і localized notes у Catalog.
- Controller navigation рухає focus між picker options і combo cards.
- `openFilters` через controller фокусує `UI-CMP-013 Filter Control Group` і лишає або переводить його в expanded state.
- `confirm`, `back` і `closePanel` у `UI-CMP-012` не тригерять combo card actions у background.
- `closePanel` або `back` закриває picker, collapse-ить `UI-CMP-013` або закриває page-level `UI-CMP-021`; після dialog focus повертається до source card focus target.
- `openDetail` через controller відкриває focused combo detail.
- `addToList` через controller просить focused [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) відкрити page-level singleton add-to-list dialog.
- Invalid catalog deep link показує `notFound` або recoverable fallback без показу first-launch setup, якщо settings уже застосовані.

## Відкриті уточнення

- Catalog deep links використовують generic route `/:gameId/catalog`; game-specific catalog context serialization належить active game business entry point.
- Точний візуальний вигляд expanded/collapsed `UI-CMP-013` буде узгоджено під час UI implementation pass.
- Точне сортування combo list за замовчуванням буде визначено разом із seeded data UX.
- Точний copy для empty і recoverable error states має відповідати shared system message styles.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
