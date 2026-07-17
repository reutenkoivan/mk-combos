# UI-PAGE-005: Named Lists

## Метадані

- Код: `UI-PAGE-005`
- Назва: `Named Lists`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані компоненти: `UI-CMP-019`, `UI-CMP-020`, [`UI-CMP-011`](./UI-CMP-011.md), `UI-CMP-021`, `UI-CMP-022`, `UI-CMP-029`, `UI-CMP-030`, `UI-CMP-031`
- Page-level singleton компоненти: `UI-CMP-021 Add-To-List Dialog`, `UI-CMP-022 List Edit Dialog`
- Пов'язані UX сценарії: `US-010`, `US-011`, `US-012`, `US-013`, `US-014`, `US-015`, `US-016`, `US-019`, `US-024`

## Призначення

`UI-PAGE-005 Named Lists` є route-level сторінкою для локальної організації seeded і custom combos у власні тренувальні або тематичні списки.

Поточна route implementation лишається placeholder. Опис списків нижче є target
product contract; до його реалізації route не реєструє page controller scope і
показує в connected App Shell ribbon лише global `Menu`.

Named Lists підтримує:

- перегляд списків для active `gameId`;
- створення, перейменування і видалення list;
- перегляд combo items усередині list;
- додавання seeded або custom combo у compatible list через page-level singleton `UI-CMP-021 Add-To-List Dialog`;
- видалення combo зі списку без видалення самого combo;
- зміну порядку combo items усередині list;
- відкриття [`UI-PAGE-004 Combo Detail`](./UI-PAGE-004.md) зі source list context;
- показ stale або invalid custom combo без автоматичного видалення;
- controller navigation для index, detail, dialogs і reorder flow після реалізації target surface.

Named lists є локальними user data і scoped by active `gameId`.

- list може містити тільки combos тієї самої гри;
- зміна game через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) у breadcrumbs перемикає visible `games[gameId]` collection, але не видаляє lists іншої гри.

Сторінка працює з already applied app-level settings:

- active `gameId` із route prefix;
- active game business entry point;
- active `language`: `EN` або `UA`;
- active `notation display mode`: `FGC`, `PlayStation` або `Xbox`.

Named Lists не змінює ці settings. Ручна зміна game належить [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) у breadcrumbs, ручна зміна `language` і `notation display mode` належить [`UI-PAGE-008 Settings`](./UI-PAGE-008.md), а initial setup належить [`UI-PAGE-002 First-Launch Setup`](./UI-PAGE-002.md).

## Володіння

## Архітектурний контекст

Named Lists є shared page. Route має форму `/:gameId/lists`. App-level local state зберігає lists у `games[gameId]`, а active game business entry point валідить combo references і custom combo stale state.

## Володіння

`UI-PAGE-005` володіє route context для lists surface, active `gameId` list collection, selected list, page-level dialogs, list management intents і controller focus mapping.

Сторінка відповідає за:

- прийом active settings від `UI-PAGE-001 App Shell`;
- читання local named lists для active `gameId`;
- lookup seeded або local custom combo для кожного list item через active game business entry point;
- підготовку list summaries для `UI-CMP-019 Named List Index`;
- підготовку combo summaries для `UI-CMP-020 Named List Detail` і [`UI-CMP-011 Combo Card`](./UI-CMP-011.md);
- перевірку, що list і combo належать route `gameId`;
- запобігання duplicate membership одного combo в одному list;
- відкриття page-level singleton `UI-CMP-021 Add-To-List Dialog` для active combo context;
- відкриття page-level singleton `UI-CMP-022 List Edit Dialog` для create, rename і delete flows;
- запуск remove-from-list і reorder intents на page/app-level persistence;
- показ `UI-CMP-031 Stale/Invalid Combo Marker` для stale або invalid custom combos;
- повернення focus після dialog close або route navigation;
- мапінг semantic controller commands на дії lists surface.

Сторінка не відповідає за:

- зміну seeded combo data;
- зміну `movePath` або `cachedNotation`;
- replay або validation move graph напряму;
- редагування custom combo path;
- видалення custom combo під час видалення list item;
- import/export backup;
- ручну зміну `game`, `language` або `notation display mode`;
- читання Browser Gamepad API;
- визначення physical controller profile або button labels.

[`UI-CMP-011 Combo Card`](./UI-CMP-011.md) використовується як item renderer для combo summary у list detail. Card не мутує named-list membership напряму: вона емітить intent events, а `UI-PAGE-005` координує page/app-level persistence flow.

## Контракт Стану Сторінки

Стан у власності сторінки:

- active `gameId`, selected list id, list index/detail focus state і route context;
- create/rename/delete dialog state, active add-to-list dialog state і source focus target;
- reorder pending state, save/error state і session-only persistence state;
- resolved combo summaries, stale/invalid item markers і not-found fallback state;
- controller command mapping для lists surface.

Підготовлені UI models для дочірніх компонентів:

- `UI-CMP-019` list index model із selected/current list state і counts;
- `UI-CMP-020` list detail model із ordered item summaries і focus state;
- repeated `UI-CMP-011` card models із list-specific action availability;
- singleton `UI-CMP-021` і `UI-CMP-022` dialog models;
- `UI-CMP-029`, `UI-CMP-030` і `UI-CMP-031` system state models.

Сторінкові handlers / intents:

- `requestSelectList(payload)`, `requestCreateList(payload)`, `requestRenameList(payload)`, `requestDeleteList(payload)`;
- `requestOpenComboDetail(payload)`, `requestOpenAddToList(payload)`, `requestSubmitAddToList(payload)`;
- `requestRemoveFromList(payload)`, `requestReorderListItem(payload)`, `requestRepairCombo(payload)`.

Бізнес-залежності:

- active game business entry point для combo reference lookup і stale validation;
- app-level local state envelope і named-list persistence;
- applied language і notation display mode від App Shell.

Не відповідає за:

- custom combo path editing;
- direct localStorage writes inside list/detail/dialog UI;
- browser event payloads у list index, card, reorder або dialog callbacks.

## Анатомія

Розміщення починається з header/toolbar, після нього йде lists workspace: index і detail стоять поруч на широкому екрані або stack-яться на mobile і tablet. Dialogs є page-owned singleton overlays поверх workspace.

```jsx
<NamedListsPage ui="UI-PAGE-005">
  <NamedListsSurface slot="UI-PAGE-001 active route">
    <Stack name="NamedListsLayout">
      <ListsHeaderToolbar>
        <Stack name="ListsHeaderLayout">
          <Group name="ListsHeaderMainRow">
            <ActiveGameContextLabel />
            <CreateListAction />
          </Group>

          <Show when={hasSessionOnlyPersistenceMessage}>
            <SessionOnlyPersistenceMessage />
          </Show>
        </Stack>
      </ListsHeaderToolbar>

      <Show when={isWide13_6Plus}>
        <Group name="ListsWorkspace">
          <NamedListIndex ui="UI-CMP-019" />
          <NamedListDetail ui="UI-CMP-020" />
        </Group>
      </Show>

      <Show when={isCompact}>
        <Stack name="ListsWorkspace">
          <NamedListIndex ui="UI-CMP-019" />
          <NamedListDetail ui="UI-CMP-020" />
        </Stack>
      </Show>

      <Show when={hasSystemState}>
        <SystemStateArea>
          <EmptyState ui="UI-CMP-029" />
          <ErrorState ui="UI-CMP-030" />
        </SystemStateArea>
      </Show>

      <Show when={isAddToListDialogOpen}>
        <AddToListDialog ui="UI-CMP-021" />
      </Show>

      <Show when={isListEditDialogOpen}>
        <ListEditDialog ui="UI-CMP-022" />
      </Show>
    </Stack>
  </NamedListsSurface>
</NamedListsPage>
```

Правила розміщення:

- На `desktop` index лишається лівою navigation region, а detail - правою content region.
- На `mobile` і `tablet` index показується над detail або як окрема routed sub-surface, але component models лишаються page-owned.
- `UI-CMP-021` і `UI-CMP-022` не повторюються всередині list rows; сторінка відкриває один активний dialog за prepared context.
- Empty/error states займають workspace slot, якщо list/detail content відсутній, або стоять під workspace як recoverable status.

### NamedListsSurface

NamedListsSurface є page-level container, який рендериться в slot активної сторінки `UI-PAGE-001 App Shell`.

NamedListsSurface має:

- показувати lists collection для active game;
- не бути modal, dropdown panel або settings screen;
- не дублювати `UI-CMP-001 Global Top Bar`;
- не містити локальні switchers для game, language або notation display mode;
- тримати стабільну структуру: header/toolbar, list index, list detail, system/modal surfaces;
- підтримувати index-only layout для narrow viewport і side-by-side index/detail layout для desktop, якщо UI implementation це обере;
- не змішувати lists різних games в одному visible collection.

### Lists header / toolbar

Lists header дає page-level orientation і основні list actions.

Header має показувати:

- page heading `Named Lists` або localized equivalent;
- active game context label із active business entry point;
- count visible lists для active game, якщо доступно;
- primary create list action;
- optional session-only persistence або recoverable save message;
- return або breadcrumb behavior через App Shell, а не дубльований top navigation.

Header не має:

- змінювати active game;
- показувати catalog filters;
- виконувати add-to-list без active combo context;
- видаляти або перейменовувати list без explicit user action.

### UI-CMP-019 Named List Index

`UI-CMP-019 Named List Index` показує перелік named lists для active game.

Index має:

- рендерити тільки lists, де `list.game` дорівнює active game;
- показувати readable list name;
- показувати item count;
- показувати stale/invalid count або marker summary, якщо list містить invalid custom combos;
- показувати selected list state;
- підтримувати open list, rename list і delete list intents;
- підтримувати create list access через page header або index empty state;
- мати stable focus targets для keyboard/controller navigation.

Index не має:

- читати localStorage напряму;
- створювати, перейменовувати або видаляти list самостійно;
- показувати lists іншої гри;
- відкривати Combo Detail напряму;
- рендерити combo cards.

### UI-CMP-020 Named List Detail

`UI-CMP-020 Named List Detail` показує contents selected named list.

Detail має:

- показувати selected list name;
- показувати active game context;
- показувати combo items у збереженому user-defined order;
- використовувати [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) для кожного resolved combo summary;
- показувати item-level `UI-CMP-031 Stale/Invalid Combo Marker` для stale або invalid custom combo;
- дозволяти open detail для combo item;
- дозволяти remove item from list;
- дозволяти reorder items;
- показувати empty state, якщо list існує, але не має combo items;
- показувати readable unresolved state для missing seeded/custom combo reference.

Detail не має:

- видаляти combo data під час remove-from-list;
- змінювати combo source data;
- змінювати order без явного reorder action або equivalent drag/controller command;
- автоматично прибирати invalid custom combo;
- допускати duplicate combo item у тому самому list.

### UI-CMP-011 Combo Card у Named Lists

Детальна специфікація: [UI-CMP-011 Combo Card](./UI-CMP-011.md).

У `UI-PAGE-005` card отримує `presentationContext = namedList` або equivalent context.

Inputs від сторінки:

- prepared combo summary;
- active language;
- notation display mode;
- source list id;
- source focus target;
- named-list membership hint;
- available actions: open detail, add to list, remove from current list, duplicate to custom combo, contextual actions;
- stale або invalid state для custom combo, якщо доступно.

Rules:

- card показує notation тільки через [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md);
- active `notation display mode` змінює тільки rendered tokens;
- card не мутує named lists напряму;
- `requestOpenDetail` передає source list context у page/app routing;
- `requestAddToList` відкриває page-level singleton `UI-CMP-021`;
- `requestRemoveFromList` або contextual remove action передається `UI-PAGE-005`;
- invalid custom combo лишається visible, доки користувач не remove item або не repair/edit combo через detail/builder flow.

### UI-CMP-021 Add-To-List Dialog

`UI-CMP-021 Add-To-List Dialog` є page-level singleton action dialog у Named Lists.

Dialog відкривається для active combo context із list detail, combo card, combo detail або builder complete flow.

Dialog має:

- показувати compatible existing lists тільки для гри active combo;
- показувати current membership state;
- не дозволяти duplicate membership у тому самому list;
- підтверджувати idempotent add або показувати already-in-list state без mutation;
- дозволяти закрити dialog без зміни named lists;
- передавати add-to-list intent у page/app-level persistence flow;
- повертати focus до source combo card/action або safe page target.

Dialog не має:

- створювати new list;
- перейменовувати або видаляти list;
- показувати lists іншої гри;
- зберігати named list membership напряму;
- змінювати combo data.

List creation, rename і delete належать `UI-PAGE-005` через `UI-CMP-022 List Edit Dialog`.

### UI-CMP-022 List Edit Dialog

`UI-CMP-022 List Edit Dialog` є page-level singleton dialog для create, rename і delete confirmation flows.

Dialog modes:

- `createList`: користувач створює named list для active game;
- `renameList`: користувач перейменовує selected list;
- `deleteListConfirm`: користувач підтверджує видалення selected list.

Dialog має:

- отримувати active game від сторінки;
- валідити required list name для create/rename;
- показувати readable validation message для empty або duplicate name, якщо app-level policy забороняє duplicates;
- показувати list name і item count у delete confirmation;
- пояснювати, що delete list не видаляє seeded або custom combos;
- повертати focus до source action після close або submit.

Dialog не має:

- додавати combo у list;
- видаляти combo data;
- змінювати active game;
- виконувати import/export backup;
- читати Browser Gamepad API.

### UI-CMP-029 Empty State

`UI-CMP-029 Empty State` використовується для empty situations у Named Lists.

Варіанти:

- `emptyLists`: active game ще не має жодного named list;
- `emptyListDetail`: selected list існує, але не має combo items;
- `noCompatibleLists`: add-to-list dialog відкритий, але для combo game немає compatible lists;
- `missingListSelection`: list id не передано або selected list відсутній, але є recoverable index fallback.

Empty state має:

- пояснювати scope active game;
- давати create list action для `emptyLists` або `noCompatibleLists`;
- не змішувати lists різних games;
- не створювати list автоматично.

### UI-CMP-030 Error State

`UI-CMP-030 Error State` використовується для recoverable list errors.

Приклади:

- local named lists не вдалося прочитати;
- persistence save failed;
- route list id не знайдено;
- list належить іншій грі;
- combo reference не resolved;
- localStorage недоступний і app працює session-only;
- add-to-list або reorder mutation не вдалося зберегти.

Error state має:

- показувати readable reason;
- пропонувати retry, повернення до list index або Catalog fallback, якщо доречно;
- не видаляти local data автоматично;
- не відкривати first-launch setup, якщо settings уже застосовані або valid deep link auto-config був виконаний.

### UI-CMP-031 Stale/Invalid Combo Marker

`UI-CMP-031 Stale/Invalid Combo Marker` показує stale або invalid custom combo усередині list item.

Marker має:

- показувати readable invalid reason;
- не покладатися тільки на колір;
- не видаляти custom combo;
- не видаляти item зі list автоматично;
- дозволяти користувачу відкрити combo detail, якщо це recoverable;
- дозволяти remove item from list;
- давати шлях до repair/edit через [`UI-PAGE-004 Combo Detail`](./UI-PAGE-004.md) і [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md), якщо repair доступний.

## Контракти даних і маршрутів

### Named list entity

Named list є local user-data entity.

Required fields at behavior level:

- stable `listId`;
- `gameId`;
- localized або user-entered `name`;
- ordered list items;
- created/updated metadata, якщо local persistence layer це підтримує.

Rules:

- `gameId` є частиною compatibility boundary;
- list не переноситься між games автоматично;
- list delete прибирає тільки list і membership records;
- backup import/export включає named lists через [`UI-PAGE-008 Settings`](./UI-PAGE-008.md).

### Named list item

List item references combo by source type and id.

Required fields at behavior level:

- `itemId` або stable ordering identity;
- `comboSourceType`: seeded або local custom;
- `comboId`;
- `gameId`;
- ordering position;
- optional addedAt metadata.

Rules:

- `item.gameId` має збігатися з `list.gameId`;
- seeded item resolves через seeded combo data;
- custom item resolves через local custom combos;
- unresolved item не видаляється автоматично;
- same combo source type + combo id не може дублюватися в одному list;
- same combo може бути у кількох lists тієї самої гри.

### Route context

Route context має дозволяти відкрити:

- list index для route `gameId`;
- specific list detail by id;
- recoverable notFound/error state, якщо list id stale або належить іншій грі.

Named Lists deep links використовують generic route `/:gameId/lists`; list id або view state serialization належить app-level route context.

Route context не має:

- вимагати global game switcher на сторінці;
- змішувати lists різних games;
- відкривати `UI-PAGE-002 First-Launch Setup`, якщо App Shell уже має valid applied settings.

## Мапа станів

### `loadingLists`

Сторінка готує local named lists для active game.

Очікуваний UI:

- NamedListsSurface і page heading доступні;
- list index/detail показують busy або skeleton/equivalent state;
- destructive actions disabled;
- controller commands не мутують state.

### `emptyLists`

Active game ще не має named lists.

Очікуваний UI:

- `UI-CMP-029 Empty State` пояснює, що lists scoped to active game;
- primary action створює list через `UI-CMP-022`;
- add-to-list dialog може показати `noCompatibleLists`, якщо opened з combo context.

### `listIndex`

Показаний перелік lists для active game.

Очікуваний UI:

- `UI-CMP-019` показує list summaries;
- selected list може бути absent у index-only layout;
- create, rename і delete actions available відповідно до focus/selection;
- controller navigation рухає focus між list rows і toolbar actions.

### `listDetail`

Відкритий конкретний list.

Очікуваний UI:

- `UI-CMP-020` показує selected list name і combo items;
- combo items показані у saved order;
- open detail, add-to-list, remove item і reorder actions доступні відповідно до focus;
- empty selected list показує `emptyListDetail`;
- invalid custom items показують `UI-CMP-031`.

### `createDialog`

`UI-CMP-022` відкритий у `createList` mode.

Очікуваний UI:

- focus trapped або equivalent managed focus;
- submit створює list для active game;
- cancel не змінює lists;
- після success focus переходить до created list або source create action.

### `renameDialog`

`UI-CMP-022` відкритий у `renameList` mode.

Очікуваний UI:

- dialog показує current list name;
- submit оновлює тільки name selected list;
- cancel не змінює list;
- selected list лишається selected після success.

### `deleteConfirm`

`UI-CMP-022` відкритий у `deleteListConfirm` mode.

Очікуваний UI:

- dialog показує list name і item count;
- confirmation видаляє list і membership records;
- seeded/custom combos не видаляються;
- після success focus переходить до next safe list або create/index action.

### `addToListOpen`

Page-level singleton `UI-CMP-021` відкритий для active combo context.

Очікуваний UI:

- dialog показує compatible existing lists тільки для combo game;
- already-in-list membership позначена;
- submit додає combo тільки в lists, де його ще немає;
- cancel не змінює lists;
- focus повертається до source combo card/action.

### `reordering`

Користувач змінює порядок combo items усередині selected list.

Очікуваний UI:

- active item має visible reorder state;
- target position readable для keyboard/controller users;
- commit зберігає new order;
- cancel або back повертає previous order;
- failed save показує recoverable error без втрати previous stable order.

### `containsInvalidCombo`

Selected list містить stale або invalid custom combo.

Очікуваний UI:

- item лишається visible;
- marker пояснює invalid reason;
- open detail або repair path доступні, якщо combo can resolve enough context;
- remove item from list доступний;
- automatic delete не виконується.

### `sessionOnlyPersistence`

Local persistence unavailable, але app може працювати session-only.

Очікуваний UI:

- header або `UI-CMP-030` пояснює limitation;
- create/rename/delete/add/reorder можуть бути available для session state, якщо app-level policy це дозволяє;
- message не блокує read-only navigation.

### `saveError`

Останній list mutation не вдалося зберегти.

Очікуваний UI:

- `UI-CMP-030 Error State` або inline error пояснює проблему;
- сторінка не показує optimistic state як confirmed, якщо persistence failed;
- retry або cancel повертає safe state;
- combo data не змінюється.

### `notFound`

Route або list reference не resolved.

Очікуваний UI:

- `UI-CMP-030 Error State` пояснює missing або incompatible list;
- доступний fallback до list index для active game;
- якщо active game має no lists, fallback веде до `emptyLists`.

## Поведінка UI

### Per-game scope

Named Lists завжди фільтрує lists за active game.

Rules:

- active game приходить із App Shell;
- page не має локального game switcher;
- list create використовує current active game;
- add-to-list показує compatible lists by combo game;
- combo game і list game мають збігатися;
- breadcrumb game switch refreshes visible collection без delete іншої collection;
- breadcrumbs/top bar показують active game через `UI-CMP-002`, але не змішують list state.

### Create list

Flow:

1. Користувач активує create list action.
2. `UI-PAGE-005` відкриває `UI-CMP-022 List Edit Dialog` у `createList` mode.
3. Dialog отримує active game.
4. Користувач вводить name і підтверджує.
5. Page/app-level persistence створює list scoped to active game.
6. UI відкриває created list або залишає index із focus на created row.

Cancel не змінює lists.

### Rename list

Flow:

1. Користувач фокусує list у `UI-CMP-019` або list title у `UI-CMP-020`.
2. Користувач активує rename action.
3. `UI-PAGE-005` відкриває `UI-CMP-022` у `renameList` mode.
4. Dialog показує current name.
5. Submit оновлює name selected list.
6. List id і item order не змінюються.

### Delete list

Flow:

1. Користувач активує delete action для selected list.
2. `UI-PAGE-005` відкриває `UI-CMP-022` у `deleteListConfirm` mode.
3. Dialog показує list name і item count.
4. Confirmation видаляє list і membership records.
5. Seeded combos і custom combos не видаляються.
6. UI переходить до next safe list, list index або `emptyLists`.

### Add combo to list

Flow:

1. Користувач активує add-to-list action із combo card, detail або saved combo summary.
2. Active surface передає combo context і source focus target.
3. `UI-PAGE-005` або active page відкриває page-level singleton `UI-CMP-021`.
4. Dialog показує compatible existing lists для combo game.
5. Lists, де combo already member, показані як already-in-list або disabled idempotent targets.
6. Користувач підтверджує membership change.
7. Page/app-level persistence додає combo тільки в lists, де його ще немає.
8. Focus повертається до source target.

Rules:

- duplicate membership у тому самому list не створюється;
- combo не може бути додане у list іншої гри;
- cancel не змінює lists;
- add failure не змінює confirmed membership.

### Remove combo from list

Flow:

1. Користувач фокусує combo item у `UI-CMP-020`.
2. Користувач активує remove-from-list action.
3. Якщо потрібне confirmation, сторінка відкриває page-level confirmation через `UI-CMP-022` або equivalent dialog mode.
4. Confirmation видаляє тільки membership item.
5. Combo source data лишається unchanged.
6. Focus переходить до next item або safe list detail target.

### Reorder list items

Flow:

1. Користувач фокусує combo item.
2. Користувач активує reorder mode.
3. Page показує active reorder state і target position.
4. Navigation moves target position.
5. Confirm commits new order.
6. Back або cancel restores previous order.
7. Save failure показує recoverable error і не губить previous stable order.

Reorder може бути реалізований через drag/drop, keyboard controls або controller pick up/drop, але behavior contract однаковий.

### Open Combo Detail from list

Flow:

1. Користувач активує combo item.
2. `UI-PAGE-005` передає combo id, source type, source list id, active game і source focus target у app-level routing.
3. App Shell відкриває [`UI-PAGE-004 Combo Detail`](./UI-PAGE-004.md).
4. Detail return action повертає до source list detail, якщо list context still valid.
5. Якщо source list stale, return fallback веде до list index або [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md), залежно від app routing policy.

### Invalid custom combo in list

Flow:

1. Local custom combo не проходить актуальну graph validation або stale detection.
2. `UI-PAGE-005` лишає item у list.
3. `UI-CMP-031` показує invalid reason.
4. Користувач може open detail, remove item from list або перейти до repair/edit flow через detail.
5. Automatic delete або truncate не виконується.

## Data flow

```text
UI-PAGE-005 Named Lists
  -> active app settings
  -> active game
  -> local named lists scoped by game
  -> selected list route context
  -> seeded combo data або local custom combos для item lookup
  -> list index summaries
  -> list detail combo summaries
  -> UI-CMP-019 index
  -> UI-CMP-020 detail
     -> UI-CMP-011 combo cards
     -> UI-CMP-031 stale/invalid markers
  -> system/modal surfaces: UI-CMP-021, UI-CMP-022, UI-CMP-029, UI-CMP-030
  -> page/app-level persistence intents
  -> UI-PAGE-004 Combo Detail або fallback route
```

`UI-PAGE-005` не пише в seeded data або custom combo data. User-data mutations для named lists виконуються через page/app-level local persistence flows.

## Поведінка controller

Поточний placeholder не має page focus graph або contextual command scope. App Shell
обробляє лише `openGlobalMenu`, а connected ribbon містить одну команду
`Menu`. Target list navigation, dialogs і reorder controller flows лишаються поза
поточним implementation scope.

## Доступність і поведінка вводу

- Page heading має називати surface і active game context.
- Create, rename, delete, add, remove і reorder actions мають бути keyboard і controller reachable.
- Delete list confirmation має явно сказати, що combo data не видаляється.
- Empty і error states мають readable text, не тільки icon.
- List selected/focused states не мають покладатися тільки на колір.
- Invalid combo marker не має покладатися тільки на колір.
- `UI-CMP-021` і `UI-CMP-022` мають trap або equivalent focus management і повертають focus до source target.
- Reorder mode має readable current position і target position.
- Combo card accessible name має включати combo/context summary.
- Long list names і long notation мають wrap-итися без overlap із actions.
- Mobile layout має дозволяти послідовно пройти index, detail, cards і dialogs без втрати reading order.
- Desktop layout має підтримувати щільний перегляд index/detail без nested card-in-card presentation.
- Hover-only actions не допускаються.

## Критерії приймання

- `UI-PAGE-005` є route-level сторінкою, не modal і не dropdown panel.
- `UI-PAGE-005` працює з active app settings і не рендерить локальні game/language/display mode switchers.
- Named lists scoped by `gameId`; lists містять тільки combos тієї самої гри.
- Зміна game через breadcrumbs перемикає visible list collection без видалення lists іншої гри.
- Empty active-game collection показує `UI-CMP-029 Empty State`.
- Create list створює list для route `gameId`.
- Rename list змінює тільки name selected list.
- Delete list видаляє тільки list і membership records.
- Add-to-list показує compatible existing lists only.
- Add-to-list не створює duplicate membership у тому самому list.
- `UI-CMP-021` не створює, не перейменовує і не видаляє lists.
- `UI-CMP-022` відповідає за create, rename і delete confirmation flows.
- Remove combo from list видаляє тільки membership item.
- Reorder змінює порядок combo items тільки після explicit commit.
- [`UI-CMP-011 Combo Card`](./UI-CMP-011.md) використовується для combo items і не мутує named-list membership напряму.
- Invalid custom combo показує `UI-CMP-031`, не видаляється і не обрізається автоматично.
- Opening combo item routes to [`UI-PAGE-004 Combo Detail`](./UI-PAGE-004.md) зі source list context.
- Display mode змінює тільки notation rendering.
- Language змінює UI labels і localized combo summary без зміни membership/order.
- Session-only persistence і recoverable save errors показуються через `UI-CMP-030` або equivalent system message.
- Поточний placeholder не реєструє page controller scope; connected ribbon показує лише `Menu`.
- Named Lists не читає Browser Gamepad API напряму.

## Тестові сценарії

- `UI.md` посилається на `ui/UI-PAGE-005.md`.
- Fresh active game з no lists показує `emptyLists`.
- Create list у `/mkxl/lists` створює list із `gameId = mkxl`.
- Перехід на `/mk1/lists` не показує `mkxl` lists.
- Повернення на `/mkxl/lists` знову показує existing `mkxl` lists.
- Rename selected list оновлює visible name і не змінює list items.
- Delete selected list прибирає list, але seeded/custom combos лишаються available elsewhere.
- Empty selected list показує `emptyListDetail`.
- Seeded `mkxl` combo додається тільки в compatible `mkxl` list.
- `mkxl` combo не показує `mk1` lists у add-to-list dialog.
- Повторне додавання того самого combo у той самий list не створює duplicate item.
- Same combo можна додати у different compatible list.
- Remove item from list не видаляє combo source data.
- Reorder item commit змінює saved order.
- Reorder cancel/back повертає previous order.
- Save failure під час reorder показує `UI-CMP-030` і не губить previous stable order.
- Custom combo item resolves і показується через [`UI-CMP-011`](./UI-CMP-011.md).
- Missing custom combo reference показує recoverable unresolved state без automatic list cleanup.
- Invalid custom combo показує `UI-CMP-031`.
- Invalid custom combo можна remove from list.
- Invalid custom combo open detail веде до detail/repair path, якщо context recoverable.
- Combo item open detail передає source list id і return focus target.
- Return із Combo Detail повертає до list detail, якщо source context still valid.
- Add-to-list dialog cancel не змінює membership.
- Create/rename/delete dialogs повертають focus до source action.
- `back` закриває active dialog перед navigation away.
- Connected placeholder рендерить рівно одну shell-owned ribbon із `Menu`; disconnected state її приховує.
- Session-only persistence message visible, якщо localStorage unavailable.

## Відкриті уточнення

- Named Lists deep links використовують `/:gameId/lists`.
- Exact local persistence schema для list ids, item ids і timestamps буде визначено під час implementation pass, але behavior contract має зберегти per-game scope і source type + combo id references.
- Pixel-level layout для index/detail responsive behavior буде визначено під час UI implementation.
- Окремі повні specs для `UI-CMP-019`, `UI-CMP-020`, `UI-CMP-021` і `UI-CMP-022` можуть бути описані пізніше; цей документ фіксує page-level contracts для їх використання.

## Канонічний Responsive і Controller-only Contract

Поточна placeholder surface рендерить responsive content, але не має
page-owned controller targets. Її єдиний controller contract — shell `Menu`, що
відкриває global menu без synthetic events.
