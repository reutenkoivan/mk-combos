# UI-CMP-001: Global Top Bar

## Метадані

- Код: `UI-CMP-001`
- Назва: `Global Top Bar`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Вкладені компоненти: [`UI-CMP-005 Controller Hint Strip`](./UI-CMP-005.md), `UI-CMP-032 Breadcrumbs`, `UI-CMP-033 Top Bar Dropdown Menu`
- Пов'язані UX сценарії: `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-CMP-001 Global Top Bar` є постійною верхньою панеллю застосунку в межах `UI-PAGE-001 App Shell`.

Компонент дає користувачу:

- active game label із installed business entry point;
- controller indicator area поруч із game label;
- contextual breadcrumbs для active surface;
- праворуч закріплене dropdown menu для global navigation і utility actions;
- compact controller indicator і hint panel через вкладений `UI-CMP-005 Controller Hint Strip`.

Top Bar не є сторінкою налаштувань. Він може відкрити `UI-PAGE-008 Settings`, але не містить `UI-CMP-002 Game Switcher`, `UI-CMP-003 Language Switcher` або `UI-CMP-004 Display Mode Switcher`.

Backup доступний усередині `UI-PAGE-008 Settings` через `UI-CMP-034 Backup Collapsible Block`; Top Bar не має окремого Backup action.

## Володіння

`UI-PAGE-001 App Shell` володіє route, applied settings, controller state, active `gameId`, active business entry point і активною UI-поверхнею.

`UI-CMP-001 Global Top Bar` отримує цей стан через inputs і відповідає тільки за верхню навігаційну панель:

- рендерить active game label;
- рендерить `UI-CMP-005 Controller Hint Strip` поруч із game label;
- рендерить `UI-CMP-032 Breadcrumbs` після game/controller блоку;
- рендерить `UI-CMP-033 Top Bar Dropdown Menu` як right-pinned menu;
- контролює місце, видимість і open/closed state hint panel для `UI-CMP-005`;
- контролює open/closed state dropdown menu.

`UI-CMP-001` не є owner для settings switchers і не змінює `game`, `language` або `notation display mode`.

## Зони розмітки

```text
UI-CMP-001 Global Top Bar
  ├─ Root bar
  ├─ Active game label
  ├─ Controller indicator area
  │  └─ UI-CMP-005 Controller Hint Strip
  ├─ UI-CMP-032 Breadcrumbs
  └─ UI-CMP-033 Top Bar Dropdown Menu
```

Горизонтальний порядок зон є стабільним:

```text
Active game label -> Controller indicator area -> Breadcrumbs -> right-pinned dropdown menu
```

### Root bar

Root bar є container верхньої панелі. Він має:

- лишатися видимим у shell layout;
- не перекривати active surface content;
- тримати game label і controller indicator як лівий блок;
- давати breadcrumbs весь доступний простір між лівим блоком і правим menu;
- тримати `UI-CMP-033 Top Bar Dropdown Menu` прибитим до правого краю;
- підтримувати mouse, touch і keyboard input;
- давати помітний `focus-visible` для всіх interactive controls.

### Active game label

Active game label показує active game із route prefix або app-level default.

Label value приходить із active business entry point, наприклад `MKXL` або `MK1`.

Label не є switcher. Ручна зміна game відбувається тільки через `UI-PAGE-008 Settings`, де рендериться `UI-CMP-002 Game Switcher`.

### Controller indicator area

Controller indicator area розташована одразу поруч із active game label.

Top Bar контролює:

- місце indicator у лівому блоці;
- чи indicator показаний або прихований;
- де відкривається hint panel;
- чи hint panel закритий під час navigation або menu actions.

`UI-CMP-005` не переноситься в dropdown menu або responsive overflow. Якщо controller indicator видимий, він лишається поруч із game label.

`UI-CMP-005` визначає власний display state: `hiddenNoController`, `connectedIndicator`, `disconnectGraceIndicator`, `hintPanelClosed`, `hintPanelOpen`.

### UI-CMP-032 Breadcrumbs

`UI-CMP-032 Breadcrumbs` показує contextual navigation trail для active surface.

Breadcrumbs можуть містити:

- `Catalog`;
- selected game context, якщо він потрібен для route;
- character;
- variation або kameo context;
- combo detail;
- named list;
- builder context;
- settings path.

Breadcrumbs не замінюють page-level heading. Вони допомагають швидко зрозуміти шлях і повернутися до попереднього рівня, якщо breadcrumb item є navigable.

`Catalog` є primary Top Bar access до `UI-PAGE-003 Catalog`. Перехід до Catalog із Top Bar відбувається через navigable breadcrumb item і емітить `requestNavigateBreadcrumb` з target `UI-PAGE-003 Catalog`.

Поточний item має бути позначений як current і не має виконувати navigation у той самий route.

### UI-CMP-033 Top Bar Dropdown Menu

`UI-CMP-033 Top Bar Dropdown Menu` є окремим праворуч закріпленим menu trigger і menu surface.

Menu містить global navigation і utility actions:

- перейти до `UI-PAGE-005 Named Lists`;
- перейти до `UI-PAGE-006 Custom Combo Builder`;
- перейти до `UI-PAGE-008 Settings`;
- optional глобальні actions, якщо App Shell їх дозволяє.

Dropdown menu не є responsive-only overflow. Воно існує як окрема права зона Top Bar і лишається прибитим до правої сторони.

Menu не містить inline controls для `game`, `language` або `notation display mode`.

## Вхідні дані

- `activeSurfaceCode`: code активної UI-поверхні.
- `activeRouteLabel`: localized label активного route або surface.
- `activeGameLabel`: label active business entry point, наприклад `MKXL` або `MK1`.
- `breadcrumbs`: ordered list breadcrumb items для active surface.
- `navigationAvailability`: доступність breadcrumbs, lists, builder і settings.
- `controllerConnectionState`: стан підключення controller.
- `activeControllerProfile`: active profile, наприклад DualSense, Xbox або Standard Gamepad fallback.
- `localizedHints`: localized controller hints для active surface.
- `lastDisconnectedAt`: timestamp останнього disconnect event, якщо controller був підключений раніше.
- `hasRecentDisconnect`: boolean, якщо 1-minute disconnect grace window обчислюється вище.
- `hintPanelState`: `closed` або `open`.
- `topBarMenuState`: `closed` або `open`.
- `systemActionAvailability`: доступність глобальних utility actions.

## Вихідні події

- `requestNavigateNamedLists`: перейти до `UI-PAGE-005 Named Lists`.
- `requestNavigateBuilder`: перейти до `UI-PAGE-006 Custom Combo Builder`.
- `requestNavigateSettings`: перейти до `UI-PAGE-008 Settings`.
- `requestNavigateBreadcrumb`: перейти за navigable breadcrumb item, зокрема до `UI-PAGE-003 Catalog`.
- `requestOpenHints`: відкрити hint panel у `UI-CMP-005`.
- `requestCloseHints`: закрити hint panel у `UI-CMP-005`.
- `requestToggleHints`: перемкнути hint panel у `UI-CMP-005`.
- `requestOpenTopBarMenu`: відкрити `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestCloseTopBarMenu`: закрити `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestSelectTopBarMenuAction`: виконати navigation або utility action із dropdown menu.

## Межі відповідальності

Компонент відповідає за:

- показ active game label;
- розміщення `UI-CMP-005` поруч із game label;
- показ `UI-CMP-032 Breadcrumbs`;
- показ right-pinned `UI-CMP-033 Top Bar Dropdown Menu`;
- open/closed state hint panel;
- open/closed state dropdown menu;
- keyboard accessibility для власних controls.

Компонент не відповідає за:

- збереження settings;
- зміну `game`, `language` або `notation display mode`;
- рендер `UI-CMP-002`, `UI-CMP-003` або `UI-CMP-004`;
- читання Browser Gamepad API;
- мапінг controller input у semantic commands;
- виконання controller commands;
- фільтрацію combo list;
- редагування custom combo;
- import/export validation;
- зміну domain state активної сторінки.

## Мапа станів

### `ready`

Top Bar має всі потрібні inputs і може рендерити game label, controller indicator area, breadcrumbs і right-pinned menu.

Очікуваний UI:

- game label показує label active business entry point;
- `UI-CMP-005` рендериться відповідно до controller state;
- breadcrumbs показують route trail для active surface;
- dropdown menu trigger прибитий до правого краю.

### `firstLaunchLimited`

First-launch gate ще не завершено, тому App Shell може обмежити menu actions.

Очікуваний UI:

- game label показує applied або pending game value, якщо він уже відомий;
- робочі pages не відкриваються напряму;
- dropdown menu може бути приховане або мати disabled actions;
- controller indicator може показуватися, якщо controller state доступний.

### `gameVersionVisible`

Active game відомий і переданий у Top Bar.

Очікуваний UI:

- показано readable label active installed game;
- label не поводиться як switcher;
- поруч із label зарезервована позиція для visible controller indicator.

### `breadcrumbsReady`

App Shell передав breadcrumbs для active surface.

Очікуваний UI:

- breadcrumb items показані після game/controller блоку;
- navigable items мають action;
- current item позначений як current і не веде в той самий route;
- довгий trail стискається без перекриття right-pinned menu.

### `surfaceNavigationActive`

Користувач вибирає breadcrumb item або menu action.

Очікуваний UI:

- target action має pressed/loading/current feedback відповідно до router state;
- unavailable actions не виконують navigation;
- hint panel і dropdown menu закриваються після успішної navigation.

### `settingsEntryAvailable`

Dropdown menu має action для переходу до `UI-PAGE-008 Settings`.

Очікуваний UI:

- settings action доступний з mouse, touch і keyboard;
- settings action не відкриває inline switchers у Top Bar;
- current-page state переходить на Settings після успішної navigation.

### `controllerIndicatorHidden`

Controller не підключено і немає active disconnect grace window.

Очікуваний UI:

- `UI-CMP-005` не відображається;
- game label лишається на місці;
- focus order не містить controller indicator.

### `controllerIndicatorConnected`

Controller підключено.

Очікуваний UI:

- `UI-CMP-005` показує green connected indicator поруч із game label;
- indicator доступний як button;
- hint panel лишається закритим до взаємодії з indicator.

### `controllerIndicatorDisconnectGrace`

Controller від'єднано після active connection, і 1-minute disconnect grace window ще активний.

Очікуваний UI:

- `UI-CMP-005` показує yellow disconnect indicator поруч із game label;
- після завершення grace window indicator зникає, якщо reconnect не стався;
- disconnect не забирає focus із active surface або Top Bar control.

### `hintPanelOpen`

Користувач відкрив hint panel через indicator.

Очікуваний UI:

- panel прив'язаний до controller indicator area поруч із game label;
- `Escape` закриває panel;
- focus повертається на indicator після закриття;
- navigation або route change закриває panel без втрати active surface state.

### `topBarMenuClosed`

Right-pinned dropdown menu закритий.

Очікуваний UI:

- trigger видимий праворуч;
- menu items не рендеряться як active focus targets;
- breadcrumbs отримують доступний простір до trigger.

### `topBarMenuOpen`

Користувач відкрив `UI-CMP-033 Top Bar Dropdown Menu`.

Очікуваний UI:

- menu surface вирівняний відносно правого краю Top Bar;
- menu містить global navigation і utility actions;
- `Escape` закриває menu;
- focus повертається до menu trigger після закриття.

## Доступність і поведінка вводу

- Top Bar має бути keyboard reachable.
- Active game label має readable text із active business entry point.
- Active game label не має role button, якщо він не відкриває navigation.
- Breadcrumbs мають navigation semantics і current item.
- Dropdown trigger має accessible name.
- Dropdown menu має menu або navigation semantics відповідно до implementation pattern.
- `focus-visible` має бути помітним для breadcrumb links, menu trigger, menu items і controller indicator.
- Controller connect/disconnect не перехоплює focus.
- Indicator `UI-CMP-005` є button, коли він видимий.
- `Enter` і `Space` на indicator відкривають або toggle hint panel.
- `Escape` закриває hint panel або dropdown menu і повертає focus до відповідного trigger.
- Hover сам по собі не відкриває hint panel.

## Критерії приймання

- `UI-CMP-001` рендериться як прямий компонент `UI-PAGE-001 App Shell`.
- Top Bar показує active game label замість окремої назви застосунку.
- `UI-CMP-005` розташований поруч із game label і не переноситься в dropdown menu.
- `UI-CMP-032 Breadcrumbs` показує contextual trail для active surface.
- Catalog відкривається з Top Bar через navigable breadcrumb item, а не через dropdown menu.
- `UI-CMP-033 Top Bar Dropdown Menu` прибитий до правої сторони Top Bar.
- Dropdown menu має actions до Named Lists, Custom Combo Builder і Settings, але не до Catalog і не до окремого Backup.
- Top Bar не містить `UI-CMP-002`, `UI-CMP-003` або `UI-CMP-004`.
- Top Bar не змінює `game`, `language` або `notation display mode` напряму.
- Connected controller показує green indicator у `UI-CMP-005`.
- Disconnect після active connection показує yellow indicator протягом 1 хв через `UI-CMP-005`.
- Hint panel відкривається тільки через interaction з indicator.
- Route change або navigation не виконує domain mutation активної сторінки.

## Тестові сценарії

- Route `/mkxl/...` показує label `MKXL` у лівій частині Top Bar.
- Route `/mk1/...` показує label `MK1` у лівій частині Top Bar.
- Top Bar не показує окрему назву застосунку замість game label.
- Controller connected показує `UI-CMP-005` поруч із game label.
- Controller disconnected після active connection показує yellow indicator протягом 1 хв.
- Breadcrumbs для combo detail показують trail до Catalog, character і combo detail.
- Catalog breadcrumb емітить `requestNavigateBreadcrumb` з target `UI-PAGE-003 Catalog`.
- Current breadcrumb item позначений як current і не виконує navigation у той самий route.
- Dropdown trigger лишається прибитим до правого краю на desktop і mobile widths.
- Dropdown menu відкривається з trigger і містить Named Lists, Builder і Settings без Catalog або окремого Backup.
- `Escape` закриває dropdown menu і повертає focus до trigger.
- Click, tap, `Enter` або `Space` на controller indicator відкриває hint panel.
- Top Bar не рендерить Game Switcher, Language Switcher або Display Mode Switcher.

## Відкриті уточнення

- Точний вигляд breadcrumb separators буде визначено під час UI реалізації.
- Точний icon для `UI-CMP-033 Top Bar Dropdown Menu` буде визначено під час UI реалізації.
- Якщо буде додано controller help surface, Top Bar має передавати request із `UI-CMP-005` до App Shell.
