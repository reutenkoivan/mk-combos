# UI-CMP-001: Global Top Bar

## Метадані

- Код: `UI-CMP-001`
- Назва: `Global Top Bar`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Вкладені компоненти: [`UI-CMP-005 Controller Hint Strip`](./UI-CMP-005.md), [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md), [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md), [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md)
- Пов'язані UX сценарії: `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-CMP-001 Global Top Bar` є постійною верхньою панеллю застосунку в межах `UI-PAGE-001 App Shell`.

Компонент дає користувачу:

- game switcher як перший interactive item у breadcrumbs;
- `ControllerStatusSlot` поруч із active navigation block і завжди outside burger menu/drawer;
- contextual breadcrumbs для active surface;
- праворуч закріплене burger menu для global navigation і utility actions;
- mobile burger menu для breadcrumb-equivalent navigation і tablet drawer для global actions;
- mobile і tablet controller indicator і hint panel через вкладений `UI-CMP-005 Controller Hint Strip`.

Канонічні modes: `mobile` показує current-location identity без inline breadcrumbs/game switcher, а `tablet` і `desktop` показують однаковий повний breadcrumb trail. Start/Menu викликає `openGlobalMenu` з будь-якого active page focus.

Top Bar не є Settings surface. Він може попросити App Shell відкрити
`UI-PAGE-008 Settings` як modal над current working route, але language і notation
display mode лишаються Settings-owned controls. Game switching після first launch
відбувається через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) усередині
[`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md).

Backup доступний усередині `UI-PAGE-008 Settings` через `UI-CMP-034 Backup Collapsible Block`; Top Bar не має окремого Backup action.

## Володіння

`UI-PAGE-001 App Shell` володіє working route, Settings query/modal state, applied
settings, controller state, active `gameId`, active business entry point і активною UI-поверхнею.

`UI-CMP-001 Global Top Bar` отримує цей стан через inputs і відповідає тільки за верхню навігаційну панель:

- рендерить [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md), де першим item є [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md), у `tablet` і `desktop` layout;
- рендерить `UI-CMP-005 Controller Hint Strip` у `ControllerStatusSlot` поруч із active navigation block і outside burger menu/drawer;
- рендерить [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md) як right-pinned burger menu;
- керує responsive composition через conditional JSX на основі `responsiveMode`;
- передає breadcrumb game-switch intent в App Shell;
- рендерить місце і видимість `UI-CMP-005` за controlled inputs від App Shell;
- передає controlled `hintPanelState` і `topBarMenuState` у відповідні child components.

`UI-CMP-001` не є owner для applied settings, route, `game`, `language`, `notation display mode`, `hintPanelState` або `topBarMenuState`. Він емітить semantic intents із payload і не передає browser event objects назовні.

## Анатомія

Розміщення є горизонтальною верхньою панеллю: navigation починається в `NavigationRegion`, controller status стоїть у dedicated slot поруч із navigation, а global actions лишаються в правому pinned `ActionRegion`.

```jsx
<GlobalTopBar ui="UI-CMP-001">
  <Group name="TopBarLayout">
    <NavigationRegion>
      <Group name="NavigationItems">
        <Show when={responsiveMode !== "mobile"}>
          <BreadcrumbsSlot>
            <Breadcrumbs ui="UI-CMP-032">
              <GameSwitcher ui="UI-CMP-002" />
            </Breadcrumbs>
          </BreadcrumbsSlot>
        </Show>

        <ControllerStatusSlot>
          <ControllerHintStrip ui="UI-CMP-005" />
        </ControllerStatusSlot>
      </Group>
    </NavigationRegion>

    <ActionRegion pinned>
      <TopBarDropdownMenu ui="UI-CMP-033" />
    </ActionRegion>
  </Group>
</GlobalTopBar>
```

На `tablet` і `desktop` горизонтальний порядок зон є стабільним:

```jsx
<Show when={responsiveMode !== "mobile"}>
  <Group name="TopBarWideOrder">
    <NavigationRegion>
      <Group name="NavigationItems">
        <BreadcrumbsSlot />
        <ControllerStatusSlot />
      </Group>
    </NavigationRegion>

    <ActionRegion pinned />
  </Group>
</Show>
```

На `mobile` inline breadcrumbs і inline game switcher не монтуються:

```jsx
<Show when={responsiveMode === "mobile"}>
  <Group name="TopBarCompactOrder">
    <NavigationRegion>
      <CurrentLocationIdentity />
      <ControllerStatusSlot />
    </NavigationRegion>

    <ActionRegion pinned />
  </Group>
</Show>
```

У `mobile` правий drawer `UI-CMP-033` монтує equivalents для прихованих navigation affordances: game switcher, Catalog/current trail navigation, Named Lists, Builder і Settings. У `tablet` той самий drawer містить лише global actions, бо breadcrumbs і game switcher вже доступні inline.

Правила розміщення:

- `NavigationRegion`, `ActionRegion`, `BreadcrumbsSlot` і `ControllerStatusSlot` є anatomy/JSX layout names, не новими `UI-CMP-*` специфікаціями.
- На `tablet` і `desktop` порядок завжди: `BreadcrumbsSlot` із game switcher зліва, `ControllerStatusSlot` після нього, `ActionRegion` праворуч.
- На `mobile` inline breadcrumbs і inline `UI-CMP-002` не монтуються; їхні equivalents живуть усередині `UI-CMP-033`.
- Visible controller indicator лишається в `ControllerStatusSlot` outside dropdown на `desktop` і outside drawer на `mobile`/`tablet`.

### NavigationRegion

`NavigationRegion` є left/start region верхньої панелі. Він має:

- лишатися видимим у shell layout;
- не перекривати active surface content;
- у `tablet` і `desktop` тримати `BreadcrumbsSlot` як головний navigation block;
- у `tablet` і `desktop` давати `BreadcrumbsSlot` весь доступний простір між left/start navigation block і `ActionRegion`;
- у `mobile` не монтувати inline breadcrumbs і inline game switcher;
- тримати visible controller indicator поза menu;
- підтримувати mouse, touch і keyboard input;
- давати помітний `focus-visible` для всіх interactive controls.

### BreadcrumbsSlot

`BreadcrumbsSlot` є left/start slot у `NavigationRegion` для inline [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md).

Slot монтується у `tablet` і `desktop`; у `mobile` його navigation equivalents передаються в `UI-CMP-033`.

### ControllerStatusSlot

`ControllerStatusSlot` є slot у `NavigationRegion` для `UI-CMP-005 Controller Hint Strip`.

Slot лишається outside `UI-CMP-033` в усіх modes і не переноситься в desktop dropdown або responsive drawer.

### ActionRegion

`ActionRegion` є right/end pinned region верхньої панелі. Він містить `UI-CMP-033 Top Bar Dropdown Menu` і тримає menu opener біля правого краю Top Bar.

### Breadcrumb game switcher

`UI-CMP-032 Breadcrumbs` рендерить [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як перший breadcrumb item.

Game switcher показує active game із route prefix або app-level state і дає вибрати іншу installed game. Вибір іншої game емітить game-switch intent у App Shell; Top Bar не виконує route change або persistence самостійно.

У `tablet` і `desktop` game switcher монтується inline через breadcrumbs. У `mobile` inline breadcrumbs не монтуються, а `UI-CMP-033` монтує `UI-CMP-002` у drawer content як breadcrumbs-equivalent game switcher із тим самим App Shell intent.

Game switcher не дублюється в `UI-PAGE-008 Settings`. Поки modal open, underlying
Top Bar і game switcher inert. Settings лишається місцем для `language`, `notation
display mode` і backup.

### Controller status behavior

`ControllerStatusSlot` розташований поруч із active breadcrumbs/navigation block і outside `UI-CMP-033` в усіх modes.

Top Bar контролює:

- місце indicator у `ControllerStatusSlot`;
- чи indicator показаний або прихований;
- де відкривається hint panel;
- чи hint panel закритий під час navigation або menu actions.

Visible connection indicator із `UI-CMP-005` не переноситься в dropdown або responsive drawer. Якщо controller indicator видимий, він лишається в `ControllerStatusSlot` outside `UI-CMP-033`. Hint panel і далі відкривається тільки через indicator.

`UI-CMP-005` визначає власний display state: `hiddenNoController`, `connectedIndicator`, `disconnectGraceIndicator`, `hintPanelClosed`, `hintPanelOpen`.

### Responsive JSX composition

Top Bar responsive behavior керується через `responsiveMode`, а не через CSS-only hiding.

`responsiveMode` має значення:

- `mobile`: current-location identity, controller state і global-menu trigger;
- `tablet`: full breadcrumbs із game switcher, controller state і global-menu trigger;
- `desktop`: full breadcrumbs із game switcher, controller state і global-menu trigger.

CSS може стилізувати змонтовані гілки, але не визначає presence, focusability або accessibility tree. Якщо компонент прихований у mobile layout, він не має бути змонтований як inline focus target.

У `tablet` і `desktop` JSX монтує:

- inline `UI-CMP-032 Breadcrumbs`;
- inline [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як перший breadcrumb item;
- visible `UI-CMP-005 Controller Hint Strip`, якщо controller indicator state не hidden;
- [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md) із global actions.

У `mobile` JSX монтує:

- current-location identity без інтерактивного breadcrumb trail;
- visible `UI-CMP-005 Controller Hint Strip`, якщо controller indicator state не hidden;
- [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md) як правий full-height drawer із `UI-CMP-002`, full trail, secondary navigation і global actions.

`mobile` не монтує inline `UI-CMP-032 Breadcrumbs` або inline `UI-CMP-002`; вони не мають бути hidden-but-focusable.

### UI-CMP-032 Breadcrumbs

Детальна специфікація: [UI-CMP-032 Breadcrumbs](./UI-CMP-032.md).

`UI-CMP-032 Breadcrumbs` показує contextual navigation trail для active surface.

Full breadcrumbs монтуються inline у `tablet` і `desktop`. `mobile` рендерить лише current-location identity, а game switcher і full trail передає у drawer content `UI-CMP-033`.

Breadcrumbs можуть містити:

- [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як перший item;
- `Catalog`;
- character;
- variation або kameo context;
- combo detail;
- named list;
- builder context;

Breadcrumbs не замінюють page-level heading. Вони допомагають швидко зрозуміти шлях і повернутися до попереднього рівня, якщо breadcrumb item є navigable.

`Catalog` є primary Top Bar access до `UI-PAGE-003 Catalog`. Перехід до Catalog із Top Bar відбувається через navigable breadcrumb item і емітить `requestNavigateBreadcrumb` з target `UI-PAGE-003 Catalog`.

Game switcher crumb емітить окремий `requestSwitchGameFromBreadcrumb` intent. App
Shell застосовує analogous navigation strategy: Catalog -> target Catalog, Lists ->
target Lists, Builder -> target Builder, Combo Detail -> target Catalog fallback;
post-launch switch не змінює `defaultGameId`. Settings не створює окремого breadcrumb
context, бо current working route trail лишається під modal та inert.

Поточний item має бути позначений як current і не має виконувати navigation у той самий route.

### UI-CMP-033 Top Bar Dropdown Menu

Детальна специфікація: [UI-CMP-033 Top Bar Dropdown Menu](./UI-CMP-033.md).

`UI-CMP-033 Top Bar Dropdown Menu` є окремим праворуч закріпленим burger opener: на `desktop` він відкриває anchored menu surface, на `mobile` і `tablet` — правий full-height drawer.

Menu містить global navigation і utility actions:

- перейти до `UI-PAGE-005 Named Lists`;
- перейти до `UI-PAGE-006 Custom Combo Builder`;
- відкрити `UI-PAGE-008 Settings` над current working route;
- optional глобальні actions, якщо App Shell їх дозволяє.

На `tablet` і `desktop` menu/drawer не дублює breadcrumbs або `UI-CMP-002`.

На `mobile` drawer є responsive navigation surface для всіх top-bar navigation affordances, які не монтуються inline:

- `UI-CMP-002 Game Switcher` як breadcrumbs-equivalent game switcher;
- `Catalog` або current trail navigation item;
- navigable breadcrumb equivalents, якщо вони доступні;
- Named Lists, Builder, Settings і allowed utility actions.

Visible controller connection indicator не переноситься в `UI-CMP-033` і не дублюється в drawer.

Menu/drawer не містить inline controls для `language` або `notation display mode`. Game switching належить `UI-CMP-002`: у `tablet` і `desktop` він монтується в breadcrumbs, а в `mobile` — у `UI-CMP-033` drawer content як breadcrumbs-equivalent control.

## Вхідні дані

- `activeSurfaceCode`: code active working-route surface; Settings modal не підміняє його.
- `activeRouteLabel`: localized label active working route або surface.
- `responsiveMode`: `mobile`, `tablet` або `desktop`; керує conditional JSX composition.
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
- `requestOpenSettings`: попросити App Shell додати `settings=interface` до current working route.
- `requestNavigateCatalog`: перейти до `UI-PAGE-003 Catalog`, якщо Catalog доступний через mobile menu.
- `requestNavigateBreadcrumb`: перейти за navigable breadcrumb item, зокрема до `UI-PAGE-003 Catalog`.
- `requestSwitchGameFromBreadcrumb`: оновити через App Shell тільки post-launch `lastActiveGameId`, не змінювати `defaultGameId` і виконати analogous navigation.
- `requestSwitchGameFromMenu`: mobile menu equivalent для `requestSwitchGameFromBreadcrumb`.
- `requestOpenHints`: відкрити hint panel у `UI-CMP-005`.
- `requestCloseHints`: закрити hint panel у `UI-CMP-005`.
- `requestToggleHints`: перемкнути hint panel у `UI-CMP-005`.
- `requestOpenTopBarMenu`: відкрити `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestCloseTopBarMenu`: закрити `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestToggleTopBarMenu`: перемкнути `UI-CMP-033 Top Bar Dropdown Menu`.
- `requestSelectTopBarMenuAction`: виконати navigation або utility action із dropdown menu.

## Межі відповідальності

Компонент відповідає за:

- conditional JSX composition на основі `responsiveMode`;
- показ `UI-CMP-032 Breadcrumbs` у `tablet` і `desktop`;
- рендер [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як першого breadcrumb item у `tablet` і `desktop`;
- передавання `UI-CMP-002` у `UI-CMP-033` mobile menu content у `mobile`;
- передачу game-switch intent в App Shell;
- розміщення `UI-CMP-005` поруч із navigation block;
- показ right-pinned `UI-CMP-033 Top Bar Dropdown Menu`;
- рендер controlled open/closed state hint panel;
- рендер controlled open/closed state dropdown menu;
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

Top Bar має всі потрібні inputs і може рендерити layout, який відповідає `responsiveMode`.

Очікуваний UI:

- у `tablet` і `desktop` first breadcrumb item показує active game через `UI-CMP-002`;
- у `mobile` active game доступний через `UI-CMP-002` у `UI-CMP-033` menu content;
- `UI-CMP-005` рендериться відповідно до controller state;
- burger menu trigger прибитий до правого краю;
- inline controls, які не відповідають active layout mode, не монтуються.

### `inlineBreadcrumbTopBarReady`

`responsiveMode = tablet` або `responsiveMode = desktop`.

Очікуваний UI:

- `UI-CMP-032 Breadcrumbs` змонтовані inline;
- first breadcrumb item є `UI-CMP-002 Game Switcher`;
- `UI-CMP-033` містить global actions без duplicate game switcher або duplicate breadcrumbs;
- Catalog доступний через breadcrumb item;
- visible controller indicator лишається поруч із navigation block.

### `mobileTopBarReady`

`responsiveMode = mobile`.

Очікуваний UI:

- inline breadcrumbs не змонтовані;
- inline `UI-CMP-002 Game Switcher` не змонтований;
- visible controller indicator лишається outside `UI-CMP-033`;
- `UI-CMP-033` є burger opener і mobile drawer surface;
- mobile menu content містить `UI-CMP-002`, Catalog/current trail navigation, Named Lists, Builder і Settings;
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

- у `tablet` і `desktop` breadcrumb items показані в navigation block;
- у `mobile` navigable breadcrumb equivalents доступні через `UI-CMP-033`;
- first breadcrumb item є `UI-CMP-002 Game Switcher`;
- navigable items мають action;
- current item позначений як current і не веде в той самий route;
- довгий trail стискається без перекриття right-pinned menu.

### `surfaceNavigationActive`

Користувач вибирає breadcrumb item або menu action.

Очікуваний UI:

- target action має pressed/loading/current feedback відповідно до router state;
- unavailable actions не виконують navigation;
- hint panel і dropdown menu закриваються після successful navigation або передачі
  Settings-open intent у App Shell.

### `settingsEntryAvailable`

Dropdown menu має action для відкриття `UI-PAGE-008 Settings`.

Очікуваний UI:

- settings action доступний з mouse, touch і keyboard;
- settings action не відкриває inline language/display mode switchers або notation legend у Top Bar;
- App Shell додає `settings=interface`, лишає current working page mounted і робить
  Top Bar/underlay inert після відкриття modal.

### `controllerIndicatorHidden`

Controller не підключено і немає active disconnect grace window.

Очікуваний UI:

- `UI-CMP-005` не відображається;
- у `tablet` і `desktop` breadcrumbs лишаються на місці;
- у `mobile` inline breadcrumbs лишаються unmounted;
- focus order не містить controller indicator.

### `controllerIndicatorConnected`

Controller підключено.

Очікуваний UI:

- `UI-CMP-005` показує green connected indicator поруч із breadcrumbs/navigation block у `tablet` і `desktop` або outside `UI-CMP-033` у `mobile`;
- indicator доступний як button;
- hint panel лишається закритим до взаємодії з indicator.

### `controllerIndicatorDisconnectGrace`

Controller від'єднано після active connection, і 1-minute disconnect grace window ще активний.

Очікуваний UI:

- `UI-CMP-005` показує yellow disconnect indicator поруч із breadcrumbs/navigation block у `tablet` і `desktop` або outside `UI-CMP-033` у `mobile`;
- після завершення grace window indicator зникає, якщо reconnect не стався;
- disconnect не забирає focus із active surface або Top Bar control.

### `hintPanelOpen`

Користувач відкрив hint panel через indicator.

Очікуваний UI:

- panel прив'язаний до `ControllerStatusSlot` поруч із navigation block у `tablet` і `desktop` або до visible indicator outside menu у `mobile`;
- `Escape` закриває panel;
- focus повертається на indicator після закриття;
- navigation або route change закриває panel без втрати active surface state.

### `topBarMenuClosed`

Right-pinned navigation surface закрита.

Очікуваний UI:

- trigger видимий праворуч;
- menu/drawer items не рендеряться як active focus targets;
- у `tablet` і `desktop` breadcrumbs отримують доступний простір до trigger;
- у `mobile` hidden inline breadcrumbs не змонтовані.

### `topBarMenuOpen`

Користувач відкрив `UI-CMP-033 Top Bar Dropdown Menu`.

Очікуваний UI:

- на `desktop` menu surface вирівняний відносно trigger, а на `mobile` і `tablet` drawer займає правий край на всю висоту viewport;
- у `desktop` menu містить global navigation і utility actions;
- у `mobile` drawer містить game switcher, Catalog/current trail navigation і global actions;
- у `tablet` drawer містить global actions без duplicate breadcrumbs або game switcher;
- `Escape`, outside interaction або swipe праворуч закриває responsive drawer;
- focus повертається до menu trigger після закриття.

## Доступність і поведінка вводу

- Top Bar має бути keyboard reachable.
- `UI-CMP-002` має readable current game text із active business entry point.
- Game switcher має button/listbox/menu semantics відповідно до implementation pattern.
- Breadcrumbs мають navigation semantics і current item.
- Dropdown trigger має accessible name.
- Desktop dropdown має menu semantics; mobile/tablet drawer має modal dialog/navigation semantics.
- Burger opener має `aria-expanded` і relationship із menu surface.
- `focus-visible` має бути помітним для breadcrumb links, menu trigger, menu items і controller indicator.
- У `mobile` inline breadcrumbs/game switcher не мають лишатися hidden-but-focusable.
- У `mobile` game switcher у drawer має той самий keyboard behavior і selection intent, що й inline breadcrumb game switcher.
- Controller connect/disconnect не перехоплює focus.
- Indicator `UI-CMP-005` є button, коли він видимий.
- `Enter` і `Space` на indicator відкривають або toggle hint panel.
- `Escape` закриває hint panel, desktop dropdown або responsive drawer і повертає focus до відповідного trigger.
- Hover сам по собі не відкриває hint panel.

## Критерії приймання

- `UI-CMP-001` рендериться як прямий компонент `UI-PAGE-001 App Shell`.
- Top Bar отримує `responsiveMode` і використовує його для conditional JSX composition.
- У `tablet` і `desktop` Top Bar показує active game через `UI-CMP-002` як перший breadcrumb item.
- У `mobile` Top Bar не монтує inline breadcrumbs або inline `UI-CMP-002`.
- `UI-CMP-005` не переноситься в dropdown/drawer; visible connection indicator лишається outside `UI-CMP-033`.
- У `tablet` і `desktop` `UI-CMP-032 Breadcrumbs` показує contextual trail для active surface.
- У `tablet` і `desktop` `UI-CMP-032 Breadcrumbs` рендерить `UI-CMP-002 Game Switcher` першим item.
- У `tablet` і `desktop` Catalog відкривається з Top Bar через navigable breadcrumb item, а не через menu/drawer.
- У `mobile` Catalog доступний через `UI-CMP-033`, бо breadcrumb item не змонтований inline.
- `UI-CMP-033 Top Bar Dropdown Menu` прибитий до правої сторони Top Bar.
- У `desktop` dropdown menu має actions до Named Lists, Custom Combo Builder і Settings, але не до Catalog і не до окремого Backup.
- У `mobile` drawer має `UI-CMP-002`, Catalog/current trail navigation, Named Lists, Builder і Settings без duplicate `Catalog` action.
- У `tablet` drawer має global actions без duplicate breadcrumbs або `UI-CMP-002`.
- Top Bar не містить `UI-CMP-003`, `UI-CMP-004` або `UI-CMP-037`.
- Breadcrumb game switch емітить intent в App Shell і не змінює route або persistence напряму.
- Responsive drawer game switch емітить equivalent intent в App Shell і не змінює route або persistence напряму.
- Top Bar не змінює `language` або `notation display mode` напряму.
- Settings action емітить open intent; Top Bar не мутує route query самостійно.
- Connected controller показує green indicator у `UI-CMP-005`.
- Disconnect після active connection показує yellow indicator протягом 1 хв через `UI-CMP-005`.
- Hint panel відкривається тільки через interaction з indicator.
- Route change або navigation не виконує domain mutation активної сторінки.

## Тестові сценарії

- Route `/mkxl/...` на `tablet` і `desktop` показує `MKXL` як selected game у першому breadcrumb item.
- Route `/mk1/...` на `tablet` і `desktop` показує `MK1` як selected game у першому breadcrumb item.
- Top Bar не показує окрему назву застосунку замість breadcrumbs game switcher.
- Controller connected показує `UI-CMP-005` поруч із navigation block у `tablet` і `desktop` або outside menu у `mobile`.
- Controller disconnected після active connection показує yellow indicator протягом 1 хв.
- Breadcrumbs для combo detail показують trail до Catalog, character і combo detail.
- Game switcher у breadcrumbs на `/mkxl/catalog` може вибрати `MK1` і емітить `requestSwitchGameFromBreadcrumb`.
- Catalog breadcrumb емітить `requestNavigateBreadcrumb` з target `UI-PAGE-003 Catalog`.
- Current breadcrumb item позначений як current і не виконує navigation у той самий route.
- Burger trigger лишається прибитим до правого краю на `mobile`, `tablet` і `desktop`.
- Wide dropdown menu відкривається з trigger і містить Named Lists, Builder і Settings без Catalog або окремого Backup.
- Settings item на `/mkxl/catalog` емітить `requestOpenSettings`; App Shell відкриває
  `/mkxl/catalog?settings=interface` без unmount Catalog.
- Mobile Top Bar не має inline breadcrumbs або inline game switcher у tab order.
- Mobile drawer відкривається з trigger справа на всю висоту та містить `UI-CMP-002`, один Catalog item, Named Lists, Builder і Settings.
- Tablet drawer відкривається справа на всю висоту, містить global actions і не дублює inline breadcrumbs або game switcher.
- Game switcher у mobile drawer на `/mkxl/catalog` може вибрати `MK1` і емітить `requestSwitchGameFromMenu`.
- Compact controller connected indicator лишається visible outside drawer.
- `Escape`, outside interaction і swipe праворуч закривають drawer та повертають focus до trigger.
- Click, tap, `Enter` або `Space` на controller indicator відкриває hint panel.
- Top Bar не рендерить Language Switcher, Display Mode Switcher або Notation Legend Table.

## Відкриті уточнення

- Breadcrumb separators мають вигляд `/`; точна overflow strategy лишається відповідальністю shared Breadcrumbs.
- Точний icon facade module для burger opener буде визначено під час UI реалізації в `packages/ui`.
- Якщо буде додано controller help surface, Top Bar має передавати request із `UI-CMP-005` до App Shell.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.

## Flat Workspace Visual Contract

- Компонент входить в один page canvas і не створює card wrapper для звичайного content flow.
- Повна border, radius і shadow дозволені тільки owning overlay surface; peer content regions використовують spacing та один separator.
- Standalone icon-only actions використовують transparent `icon` presentation без background, visible border або inset shadow у всіх states; focus лишається зовнішнім ring.
- Text controls, `icon + text` actions, notation keycaps, validation і focus indicators зберігають необхідні interaction boundaries.
