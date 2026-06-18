# UI-CMP-001: Global Top Bar

## Метадані

- Код: `UI-CMP-001`
- Назва: `Global Top Bar`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Вкладені компоненти: [`UI-CMP-005 Controller Hint Strip`](./UI-CMP-005.md), `UI-CMP-032 Breadcrumbs`, [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md), [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md)
- Пов'язані UX сценарії: `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-CMP-001 Global Top Bar` є постійною верхньою панеллю застосунку в межах `UI-PAGE-001 App Shell`.

Компонент дає користувачу:

- game switcher як перший interactive item у breadcrumbs;
- controller indicator area поруч із navigation block у `wide13_6Plus` або outside burger menu у `compact`;
- contextual breadcrumbs для active surface;
- праворуч закріплене burger menu для global navigation і utility actions;
- compact burger menu для top-bar navigation, коли viewport менший за desktop layout;
- compact controller indicator і hint panel через вкладений `UI-CMP-005 Controller Hint Strip`.

Top Bar не є сторінкою налаштувань. Він може відкрити `UI-PAGE-008 Settings`, але language і notation display mode лишаються page-owned settings controls. Game switching після first launch відбувається через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) усередині `UI-CMP-032 Breadcrumbs`.

Backup доступний усередині `UI-PAGE-008 Settings` через `UI-CMP-034 Backup Collapsible Block`; Top Bar не має окремого Backup action.

## Володіння

`UI-PAGE-001 App Shell` володіє route, applied settings, controller state, active `gameId`, active business entry point і активною UI-поверхнею.

`UI-CMP-001 Global Top Bar` отримує цей стан через inputs і відповідає тільки за верхню навігаційну панель:

- рендерить `UI-CMP-032 Breadcrumbs`, де першим item є [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md), тільки у `wide13_6Plus` layout;
- рендерить `UI-CMP-005 Controller Hint Strip` поруч із navigation block у `wide13_6Plus` або outside burger menu у `compact`;
- рендерить [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md) як right-pinned burger menu;
- керує responsive composition через conditional JSX на основі `topBarLayoutMode`;
- передає breadcrumb game-switch intent в App Shell;
- контролює місце, видимість і open/closed state hint panel для `UI-CMP-005`;
- контролює open/closed state dropdown menu.

`UI-CMP-001` не є owner для applied settings і не змінює `game`, `language` або `notation display mode` напряму.

## Зони розмітки

```text
UI-CMP-001 Global Top Bar
  ├─ Root bar
  ├─ UI-CMP-032 Breadcrumbs (wide13_6Plus only)
  │  └─ UI-CMP-002 Game Switcher
  ├─ Controller indicator area
  │  └─ UI-CMP-005 Controller Hint Strip
  └─ UI-CMP-033 Top Bar Dropdown Menu
```

На `wide13_6Plus` горизонтальний порядок зон є стабільним:

```text
Breadcrumbs with game switcher -> Controller indicator area -> right-pinned dropdown menu
```

На `compact` inline breadcrumbs і inline game switcher не монтуються:

```text
Controller indicator area, якщо visible -> right-pinned burger menu
```

У `compact` menu surface `UI-CMP-033` монтує equivalents для прихованих navigation affordances: game switcher, Catalog/current trail navigation, Named Lists, Builder і Settings.

### Root bar

Root bar є container верхньої панелі. Він має:

- лишатися видимим у shell layout;
- не перекривати active surface content;
- у `wide13_6Plus` тримати breadcrumbs як головний navigation block;
- у `wide13_6Plus` давати breadcrumbs весь доступний простір між лівим navigation block і правим menu;
- у `compact` не монтувати inline breadcrumbs і inline game switcher;
- тримати visible controller indicator поза menu;
- тримати `UI-CMP-033 Top Bar Dropdown Menu` прибитим до правого краю;
- підтримувати mouse, touch і keyboard input;
- давати помітний `focus-visible` для всіх interactive controls.

### Breadcrumb game switcher

`UI-CMP-032 Breadcrumbs` рендерить [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як перший breadcrumb item.

Game switcher показує active game із route prefix або app-level state і дає вибрати іншу installed game. Вибір іншої game емітить game-switch intent у App Shell; Top Bar не виконує route change або persistence самостійно.

У `wide13_6Plus` game switcher монтується inline через breadcrumbs. У `compact` inline breadcrumbs не монтуються, а `UI-CMP-033` монтує `UI-CMP-002` у menu content як breadcrumbs-equivalent game switcher із тим самим App Shell intent.

Game switcher не дублюється в `UI-PAGE-008 Settings`. Settings лишається місцем для `language`, `notation display mode` і backup.

### Controller indicator area

Controller indicator area розташована поруч із breadcrumbs/navigation block у `wide13_6Plus` або outside `UI-CMP-033` у `compact`.

Top Bar контролює:

- місце indicator у лівому блоці;
- чи indicator показаний або прихований;
- де відкривається hint panel;
- чи hint panel закритий під час navigation або menu actions.

Visible connection indicator із `UI-CMP-005` не переноситься в dropdown menu або responsive overflow. Якщо controller indicator видимий, він лишається outside `UI-CMP-033` у Top Bar. Hint panel і далі відкривається тільки через indicator.

`UI-CMP-005` визначає власний display state: `hiddenNoController`, `connectedIndicator`, `disconnectGraceIndicator`, `hintPanelClosed`, `hintPanelOpen`.

### Responsive JSX composition

Top Bar responsive behavior керується через `topBarLayoutMode`, а не через CSS-only hiding.

`topBarLayoutMode` має значення:

- `wide13_6Plus`: desktop layout для MacBook Air-class і ширших viewport/device class;
- `compact`: усі екрани менші за `wide13_6Plus`.

CSS може стилізувати змонтовані гілки, але не визначає presence, focusability або accessibility tree. Якщо компонент прихований у compact layout, він не має бути змонтований як inline focus target.

У `wide13_6Plus` JSX монтує:

- inline `UI-CMP-032 Breadcrumbs`;
- inline [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як перший breadcrumb item;
- visible `UI-CMP-005 Controller Hint Strip`, якщо controller indicator state не hidden;
- [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md) із global actions.

У `compact` JSX монтує:

- visible `UI-CMP-005 Controller Hint Strip`, якщо controller indicator state не hidden;
- [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md) із compact equivalents для `UI-CMP-002`, Catalog/current trail navigation, Named Lists, Builder, Settings і allowed utilities.

У `compact` JSX не монтує inline `UI-CMP-032 Breadcrumbs` або inline `UI-CMP-002`; вони не мають бути hidden-but-focusable.

### UI-CMP-032 Breadcrumbs

`UI-CMP-032 Breadcrumbs` показує contextual navigation trail для active surface.

Breadcrumbs монтуються inline тільки у `wide13_6Plus`. У `compact` їхні navigable equivalents передаються в `UI-CMP-033` menu content.

Breadcrumbs можуть містити:

- [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як перший item;
- `Catalog`;
- character;
- variation або kameo context;
- combo detail;
- named list;
- builder context;
- settings path.

Breadcrumbs не замінюють page-level heading. Вони допомагають швидко зрозуміти шлях і повернутися до попереднього рівня, якщо breadcrumb item є navigable.

`Catalog` є primary Top Bar access до `UI-PAGE-003 Catalog`. Перехід до Catalog із Top Bar відбувається через navigable breadcrumb item і емітить `requestNavigateBreadcrumb` з target `UI-PAGE-003 Catalog`.

Game switcher crumb емітить окремий `requestSwitchGameFromBreadcrumb` intent. App Shell застосовує analogous navigation strategy: Catalog -> target Catalog, Lists -> target Lists, Builder -> target Builder, Combo Detail -> target Catalog fallback, Settings -> лишається `/settings` із оновленим active/default game.

Поточний item має бути позначений як current і не має виконувати navigation у той самий route.

### UI-CMP-033 Top Bar Dropdown Menu

Детальна специфікація: [UI-CMP-033 Top Bar Dropdown Menu](./UI-CMP-033.md).

`UI-CMP-033 Top Bar Dropdown Menu` є окремим праворуч закріпленим burger opener і anchored menu surface.

Menu містить global navigation і utility actions:

- перейти до `UI-PAGE-005 Named Lists`;
- перейти до `UI-PAGE-006 Custom Combo Builder`;
- перейти до `UI-PAGE-008 Settings`;
- optional глобальні actions, якщо App Shell їх дозволяє.

На `wide13_6Plus` menu не дублює breadcrumbs або `UI-CMP-002`.

На `compact` menu є responsive navigation surface для всіх top-bar navigation affordances, які не монтуються inline:

- `UI-CMP-002 Game Switcher` як breadcrumbs-equivalent game switcher;
- `Catalog` або current trail navigation item;
- navigable breadcrumb equivalents, якщо вони доступні;
- Named Lists, Builder, Settings і allowed utility actions.

Visible controller connection indicator не переноситься в `UI-CMP-033` і не дублюється в menu.

Menu не містить inline controls для `language` або `notation display mode`. Game switching належить `UI-CMP-002`: у `wide13_6Plus` він монтується в breadcrumbs, а в `compact` - у `UI-CMP-033` menu content як breadcrumbs-equivalent control.

## Вхідні дані

- `activeSurfaceCode`: code активної UI-поверхні.
- `activeRouteLabel`: localized label активного route або surface.
- `topBarLayoutMode`: `wide13_6Plus` або `compact`; керує conditional JSX composition.
- `activeGameId`: installed game id із route prefix або app-level state.
- `activeGameLabel`: label active business entry point, наприклад `MKXL` або `MK1`.
- `availableGames`: installed game descriptors для `UI-CMP-002`.
- `gameSwitcherState`: selected, disabled, busy або invalid state для `UI-CMP-002`.
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
- `requestNavigateCatalog`: перейти до `UI-PAGE-003 Catalog`, якщо Catalog доступний через compact menu.
- `requestNavigateBreadcrumb`: перейти за navigable breadcrumb item, зокрема до `UI-PAGE-003 Catalog`.
- `requestSwitchGameFromBreadcrumb`: змінити active/default або last active game через App Shell і виконати analogous navigation.
- `requestSwitchGameFromMenu`: compact menu equivalent для `requestSwitchGameFromBreadcrumb`.
- `requestOpenHints`: відкрити hint panel у `UI-CMP-005`.
- `requestCloseHints`: закрити hint panel у `UI-CMP-005`.
- `requestToggleHints`: перемкнути hint panel у `UI-CMP-005`.
- `requestOpenTopBarMenu`: відкрити `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestCloseTopBarMenu`: закрити `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestToggleTopBarMenu`: перемкнути `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestSelectTopBarMenuAction`: виконати navigation або utility action із dropdown menu.

## Межі відповідальності

Компонент відповідає за:

- conditional JSX composition на основі `topBarLayoutMode`;
- показ `UI-CMP-032 Breadcrumbs` у `wide13_6Plus`;
- рендер [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як першого breadcrumb item у `wide13_6Plus`;
- передавання `UI-CMP-002` у `UI-CMP-033` compact menu content у `compact`;
- передачу game-switch intent в App Shell;
- розміщення `UI-CMP-005` поруч із navigation block;
- показ right-pinned `UI-CMP-033 Top Bar Dropdown Menu`;
- open/closed state hint panel;
- open/closed state dropdown menu;
- keyboard accessibility для власних controls.

Компонент не відповідає за:

- збереження settings;
- route rewrite після game switch;
- зміну `game`, `language` або `notation display mode` напряму;
- CSS-only hiding як source of truth для responsive focusability;
- рендер `UI-CMP-003`, `UI-CMP-004` або `UI-CMP-037`;
- читання Browser Gamepad API;
- мапінг controller input у semantic commands;
- виконання controller commands;
- фільтрацію combo list;
- редагування custom combo;
- import/export validation;
- зміну domain state активної сторінки.

## Мапа станів

### `ready`

Top Bar має всі потрібні inputs і може рендерити layout, який відповідає `topBarLayoutMode`.

Очікуваний UI:

- у `wide13_6Plus` first breadcrumb item показує active game через `UI-CMP-002`;
- у `compact` active game доступний через `UI-CMP-002` у `UI-CMP-033` menu content;
- `UI-CMP-005` рендериться відповідно до controller state;
- burger menu trigger прибитий до правого краю;
- inline controls, які не відповідають active layout mode, не монтуються.

### `wideTopBarReady`

`topBarLayoutMode = wide13_6Plus`.

Очікуваний UI:

- `UI-CMP-032 Breadcrumbs` змонтовані inline;
- first breadcrumb item є `UI-CMP-002 Game Switcher`;
- `UI-CMP-033` містить global actions без duplicate game switcher або duplicate breadcrumbs;
- Catalog доступний через breadcrumb item;
- visible controller indicator лишається поруч із navigation block.

### `compactTopBarReady`

`topBarLayoutMode = compact`.

Очікуваний UI:

- inline breadcrumbs не змонтовані;
- inline `UI-CMP-002 Game Switcher` не змонтований;
- visible controller indicator лишається outside `UI-CMP-033`;
- `UI-CMP-033` є burger opener і compact menu surface;
- compact menu content містить `UI-CMP-002`, Catalog/current trail navigation, Named Lists, Builder і Settings;
- hidden inline controls не присутні в tab order або accessibility tree.

### `firstLaunchLimited`

First-launch gate ще не завершено, тому App Shell може обмежити menu actions.

Очікуваний UI:

- setup form містить pending game value через `UI-CMP-002`;
- global breadcrumbs game switcher може бути прихований або disabled до completion;
- робочі pages не відкриваються напряму;
- dropdown menu може бути приховане або мати disabled actions;
- controller indicator може показуватися, якщо controller state доступний.

### `gameSwitcherVisible`

Active game відомий і переданий у Top Bar.

Очікуваний UI:

- `UI-CMP-002` показує readable label active installed game у active JSX location;
- selected/current state зрозумілий;
- available installed games reachable через switcher interaction;
- switcher не виконує route або persistence самостійно.

### `breadcrumbsReady`

App Shell передав breadcrumbs для active surface.

Очікуваний UI:

- у `wide13_6Plus` breadcrumb items показані в navigation block;
- у `compact` navigable breadcrumb equivalents доступні через `UI-CMP-033`;
- first breadcrumb item є `UI-CMP-002 Game Switcher`;
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
- settings action не відкриває inline language/display mode switchers або notation legend у Top Bar;
- current-page state переходить на Settings після успішної navigation.

### `controllerIndicatorHidden`

Controller не підключено і немає active disconnect grace window.

Очікуваний UI:

- `UI-CMP-005` не відображається;
- у `wide13_6Plus` breadcrumbs лишаються на місці;
- у `compact` inline breadcrumbs лишаються unmounted;
- focus order не містить controller indicator.

### `controllerIndicatorConnected`

Controller підключено.

Очікуваний UI:

- `UI-CMP-005` показує green connected indicator поруч із breadcrumbs/navigation block у `wide13_6Plus` або outside `UI-CMP-033` у `compact`;
- indicator доступний як button;
- hint panel лишається закритим до взаємодії з indicator.

### `controllerIndicatorDisconnectGrace`

Controller від'єднано після active connection, і 1-minute disconnect grace window ще активний.

Очікуваний UI:

- `UI-CMP-005` показує yellow disconnect indicator поруч із breadcrumbs/navigation block у `wide13_6Plus` або outside `UI-CMP-033` у `compact`;
- після завершення grace window indicator зникає, якщо reconnect не стався;
- disconnect не забирає focus із active surface або Top Bar control.

### `hintPanelOpen`

Користувач відкрив hint panel через indicator.

Очікуваний UI:

- panel прив'язаний до controller indicator area поруч із navigation block у `wide13_6Plus` або до visible indicator outside menu у `compact`;
- `Escape` закриває panel;
- focus повертається на indicator після закриття;
- navigation або route change закриває panel без втрати active surface state.

### `topBarMenuClosed`

Right-pinned dropdown menu закритий.

Очікуваний UI:

- trigger видимий праворуч;
- menu items не рендеряться як active focus targets;
- у `wide13_6Plus` breadcrumbs отримують доступний простір до trigger;
- у `compact` hidden inline breadcrumbs не змонтовані.

### `topBarMenuOpen`

Користувач відкрив `UI-CMP-033 Top Bar Dropdown Menu`.

Очікуваний UI:

- menu surface вирівняний відносно правого краю Top Bar;
- у `wide13_6Plus` menu містить global navigation і utility actions;
- у `compact` menu містить compact game switcher, Catalog/current trail navigation і global actions;
- `Escape` закриває menu;
- focus повертається до menu trigger після закриття.

## Доступність і поведінка вводу

- Top Bar має бути keyboard reachable.
- `UI-CMP-002` має readable current game text із active business entry point.
- Game switcher має button/listbox/menu semantics відповідно до implementation pattern.
- Breadcrumbs мають navigation semantics і current item.
- Dropdown trigger має accessible name.
- Dropdown menu має menu або navigation semantics відповідно до implementation pattern.
- Burger opener має `aria-expanded` і relationship із menu surface.
- `focus-visible` має бути помітним для breadcrumb links, menu trigger, menu items і controller indicator.
- У `compact` inline breadcrumbs/game switcher не мають лишатися hidden-but-focusable.
- У `compact` game switcher у menu має той самий keyboard behavior і selection intent, що й breadcrumb game switcher.
- Controller connect/disconnect не перехоплює focus.
- Indicator `UI-CMP-005` є button, коли він видимий.
- `Enter` і `Space` на indicator відкривають або toggle hint panel.
- `Escape` закриває hint panel або dropdown menu і повертає focus до відповідного trigger.
- Hover сам по собі не відкриває hint panel.

## Критерії приймання

- `UI-CMP-001` рендериться як прямий компонент `UI-PAGE-001 App Shell`.
- Top Bar отримує `topBarLayoutMode` і використовує його для conditional JSX composition.
- У `wide13_6Plus` Top Bar показує active game через `UI-CMP-002` як перший breadcrumb item.
- У `compact` Top Bar не монтує inline breadcrumbs або inline `UI-CMP-002`.
- `UI-CMP-005` не переноситься в dropdown menu; visible connection indicator лишається outside `UI-CMP-033`.
- У `wide13_6Plus` `UI-CMP-032 Breadcrumbs` показує contextual trail для active surface.
- У `wide13_6Plus` `UI-CMP-032 Breadcrumbs` рендерить `UI-CMP-002 Game Switcher` першим item.
- У `wide13_6Plus` Catalog відкривається з Top Bar через navigable breadcrumb item, а не через dropdown menu.
- У `compact` Catalog доступний через `UI-CMP-033`, бо breadcrumb item не змонтований inline.
- `UI-CMP-033 Top Bar Dropdown Menu` прибитий до правої сторони Top Bar.
- У `wide13_6Plus` dropdown menu має actions до Named Lists, Custom Combo Builder і Settings, але не до Catalog і не до окремого Backup.
- У `compact` dropdown menu має `UI-CMP-002`, Catalog/current trail navigation, Named Lists, Builder і Settings.
- Top Bar не містить `UI-CMP-003`, `UI-CMP-004` або `UI-CMP-037`.
- Breadcrumb game switch емітить intent в App Shell і не змінює route або persistence напряму.
- Compact menu game switch емітить equivalent intent в App Shell і не змінює route або persistence напряму.
- Top Bar не змінює `language` або `notation display mode` напряму.
- Connected controller показує green indicator у `UI-CMP-005`.
- Disconnect після active connection показує yellow indicator протягом 1 хв через `UI-CMP-005`.
- Hint panel відкривається тільки через interaction з indicator.
- Route change або navigation не виконує domain mutation активної сторінки.

## Тестові сценарії

- Route `/mkxl/...` на `wide13_6Plus` показує `MKXL` як selected game у першому breadcrumb item.
- Route `/mk1/...` на `wide13_6Plus` показує `MK1` як selected game у першому breadcrumb item.
- Top Bar не показує окрему назву застосунку замість breadcrumbs game switcher.
- Controller connected показує `UI-CMP-005` поруч із navigation block у `wide13_6Plus` або outside menu у `compact`.
- Controller disconnected після active connection показує yellow indicator протягом 1 хв.
- Breadcrumbs для combo detail показують trail до Catalog, character і combo detail.
- Game switcher у breadcrumbs на `/mkxl/catalog` може вибрати `MK1` і емітить `requestSwitchGameFromBreadcrumb`.
- Catalog breadcrumb емітить `requestNavigateBreadcrumb` з target `UI-PAGE-003 Catalog`.
- Current breadcrumb item позначений як current і не виконує navigation у той самий route.
- Dropdown trigger лишається прибитим до правого краю на `wide13_6Plus` і `compact`.
- Wide dropdown menu відкривається з trigger і містить Named Lists, Builder і Settings без Catalog або окремого Backup.
- Compact Top Bar не має inline breadcrumbs або inline game switcher у tab order.
- Compact dropdown menu відкривається з trigger і містить `UI-CMP-002`, Catalog, Named Lists, Builder і Settings.
- Compact game switcher у menu на `/mkxl/catalog` може вибрати `MK1` і емітить `requestSwitchGameFromMenu`.
- Compact controller connected indicator лишається visible outside dropdown menu.
- `Escape` закриває dropdown menu і повертає focus до trigger.
- Click, tap, `Enter` або `Space` на controller indicator відкриває hint panel.
- Top Bar не рендерить Language Switcher, Display Mode Switcher або Notation Legend Table.

## Відкриті уточнення

- Точний вигляд breadcrumb separators буде визначено під час UI реалізації.
- Точний icon facade module для burger opener буде визначено під час UI реалізації в `packages/ui`.
- Якщо буде додано controller help surface, Top Bar має передавати request із `UI-CMP-005` до App Shell.
