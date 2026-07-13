# UI-CMP-033: Top Bar Dropdown Menu

## Метадані

- Код: `UI-CMP-033`
- Назва: `Top Bar Dropdown Menu`
- Тип: `компонент / desktop menu popup / responsive drawer`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власник: [`UI-CMP-001 Global Top Bar`](./UI-CMP-001.md)
- Батьківська сторінка: [`UI-PAGE-001 App Shell`](./UI-PAGE-001.md)
- Пов'язані компоненти: [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md), [`UI-CMP-005 Controller Hint Strip`](./UI-CMP-005.md), [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md)
- Пов'язані UX сценарії: `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-CMP-033 Top Bar Dropdown Menu` є праворуч закріпленим burger navigation control у `UI-CMP-001 Global Top Bar`: на `desktop` відкриває anchored dropdown, на `mobile` і `tablet` — правий full-height drawer.

Компонент дає користувачу:

- компактний opener для global navigation і utility actions;
- доступ до `Named Lists`, `Custom Combo Builder` і `Settings`;
- mobile і tablet navigation fallback на екранах менших за desktop layout;
- доступ до `UI-CMP-002 Game Switcher` у mobile і tablet layout, коли breadcrumbs не монтуються inline;
- доступ до `Catalog` у mobile і tablet layout, коли desktop breadcrumb navigation не монтується inline.

`UI-CMP-033` не є page-level router, settings editor або controller input layer. Він рендерить переданий menu model, емітить UI/navigation intents і повертає focus до opener після закриття.

## Архітектурний контекст

Архітектурне джерело правди для package ownership, import direction, icon facade, Base UI і `tailwind-variants` знаходиться в [ARCHITECTURE.md](../ARCHITECTURE.md).

Для майбутньої реалізації:

- desktop menu і responsive drawer мають використовувати shared primitives із `packages/ui`, які wrap-лять Base UI;
- styling має йти через semantic `tailwind-variants` recipes для `control`, `popup`, `item`, `surface`, `panel` і `separator`;
- burger icon має імпортуватися тільки через icon facade `@mk-combos/ui/icons/...`, а не напряму з `lucide-react`;
- app-level route rewrite, settings persistence і game validation лишаються в `UI-PAGE-001 App Shell` та active game business entry point.

## Володіння

`UI-CMP-001 Global Top Bar` володіє місцем `UI-CMP-033` і responsive JSX composition, але `menuState` приходить як controlled input із `UI-PAGE-001 App Shell` або page-level top-bar hook.

`UI-PAGE-001 App Shell` володіє:

- active route і active surface;
- `responsiveMode`;
- installed game list;
- game-switch navigation;
- global route navigation;
- closing menu on route change;
- applied settings і local persistence.

`UI-CMP-033` відповідає тільки за:

- opener button;
- anchored menu surface на `desktop` і modal drawer surface на `mobile`/`tablet`;
- menu item rendering;
- open/closed accessibility semantics;
- keyboard і pointer interaction усередині menu;
- focus return до opener;
- intent events до Top Bar/App Shell.

`UI-CMP-033` не мутує route або menu source of truth напряму. Усі вихідні події мають semantic payload і не передають browser event objects.

## Анатомія

Burger opener стоїть праворуч у Top Bar. На `desktop` menu surface відкривається anchored під trigger; на `mobile` і `tablet` drawer виїжджає справа, займає повну висоту viewport і містить navigation blocks згори вниз.

```jsx
<TopBarDropdownMenu ui="UI-CMP-033">
  <TopBarMenuRegion slot="UI-CMP-001">
    <MenuTriggerSlot pinned>
      <BurgerOpenerButton />
    </MenuTriggerSlot>

    <Show when={responsiveMode === "desktop" && menuState === "open"}>
      <DesktopMenuSurface anchored>
        <Stack name="TopBarMenuLayout">
          <GlobalNavigationItemGroup />

          <Show when={hasUtilityItems}>
            <UtilityItemGroup />
          </Show>

          <Show when={hasDisabledStatusItem}>
            <DisabledStatusItem />
          </Show>
        </Stack>
      </DesktopMenuSurface>
    </Show>

    <Show when={responsiveMode !== "desktop" && menuState === "open"}>
      <ResponsiveDrawerSurface side="right" fullHeight modal>
        <Stack name="ResponsiveDrawerLayout">
          <DrawerHeader />
          <ResponsiveGameSwitcherRegion>
            <GameSwitcher ui="UI-CMP-002" />
          </ResponsiveGameSwitcherRegion>
          <ResponsiveBreadcrumbNavigationRegion />
          <GlobalNavigationItemGroup />
        </Stack>
      </ResponsiveDrawerSurface>
    </Show>
  </TopBarMenuRegion>
</TopBarDropdownMenu>
```

Правила розміщення:

- Opener завжди лишається праворуч у Top Bar; surface не займає місце в normal bar flow.
- На `desktop` menu не дублює breadcrumbs або inline game switcher; на `mobile` і `tablet` ці equivalents стоять у верхній частині drawer.
- Status/disabled items стоять унизу surface і не змішуються з primary navigation group.

### MenuTriggerSlot

`MenuTriggerSlot` містить icon-only burger opener button.

Вимоги:

- має localized accessible name, наприклад `Open main menu`;
- має `aria-expanded`, який відповідає open state;
- має `aria-controls` або equivalent relationship із active desktop menu чи responsive drawer;
- відкривається через click, tap, `Enter` і `Space`;
- має visible `focus-visible` у light, dark, standard contrast і increased contrast;
- не змінює розміри Top Bar між idle, hover, active, focus-visible, disabled і open states.

### DesktopMenuSurface

`DesktopMenuSurface` є anchored popup/menu, прив'язаний до burger opener.

Вимоги:

- вирівнюється до правого краю Top Bar;
- використовує functional popup/material тільки як owning menu surface;
- має max available height і scroll behavior, якщо items не вміщаються;
- закривається через `Escape`, outside interaction, route change або successful action;
- повертає focus до burger opener після закриття;
- не лишає hidden-but-focusable items після close.

### ResponsiveDrawerSurface

`ResponsiveDrawerSurface` є modal dialog/navigation surface для `mobile` і `tablet`.

Вимоги:

- монтується через shared Base UI Drawer primitive та виїжджає справа;
- займає повну висоту viewport і ширину `min(24rem, 100vw)` із safe-area padding;
- має backdrop, focus trap, scroll/overscroll containment і explicit close control;
- закривається через `Escape`, outside interaction, successful action або swipe праворуч;
- повертає focus до burger opener і підтримує reduced motion;
- current breadcrumb є неінтерактивним, а duplicate action з тим самим stable id не рендериться повторно.

### Compact game switcher region

У `mobile` і `tablet` layout drawer включає `UI-CMP-002 Game Switcher` як breadcrumbs-equivalent game switcher.

Rules:

- використовувати той самий selection intent, що й `UI-CMP-002` у breadcrumbs;
- не виконувати route rewrite або persistence всередині menu;
- current game має бути readable і semantically selected/current;
- unavailable game options мають disabled reason або accessible description.

### Compact navigation region

У `mobile` і `tablet` layout drawer включає navigation equivalents для прихованого inline breadcrumb trail.

Menu може містити:

- active game switcher через `UI-CMP-002`;
- `Catalog` navigation item;
- current route або current surface item;
- parent breadcrumb-like navigation items, якщо App Shell передав їх як available actions.

`Catalog` дозволений у mobile і tablet drawer, тому що desktop breadcrumb access не монтується inline у цьому layout. Якщо `Catalog` уже є breadcrumb item, global action із тим самим stable id не дублюється.

### Global navigation item group

Global navigation item group містить:

- `Named Lists`;
- `Custom Combo Builder`;
- `Settings`;
- optional global utility actions, якщо App Shell передав їх як available.

Menu не містить окремий Backup action. Backup доступний через `UI-PAGE-008 Settings -> UI-CMP-034 Backup Collapsible Block`.

Menu не містить inline controls для `language` або `notation display mode`.

## Responsive JSX Composition

Responsive behavior керується conditional JSX composition через `responsiveMode`, а не CSS-only visibility.

CSS може стилізувати змонтовані гілки, але не є source of truth для presence, focusability або accessible tree.

### `desktop`

На `desktop` Top Bar JSX включає:

```text
UI-CMP-001
  ├─ NavigationRegion
  │  ├─ UI-CMP-032 Breadcrumbs
  │  │  └─ UI-CMP-002 Game Switcher
  │  └─ UI-CMP-005 Controller Hint Strip, якщо indicator visible
  └─ ActionRegion
     └─ UI-CMP-033
        ├─ MenuTriggerSlot
        └─ DesktopMenuSurface with global actions
```

Expected behavior:

- breadcrumbs і game switcher є inline focus targets;
- `UI-CMP-005` лишається поруч із navigation block, якщо visible;
- `UI-CMP-033` не дублює `UI-CMP-002` або breadcrumbs;
- `Catalog` доступний через breadcrumb item, а не global action group.

### `tablet`

На `tablet` Top Bar JSX включає current-location identity, controller indicator і burger opener. Inline breadcrumbs/game switcher не монтуються; drawer містить game switcher, full trail, secondary navigation та global actions.

### `mobile` і `tablet`

На `mobile` і `tablet` Top Bar JSX включає:

```text
UI-CMP-001
  ├─ NavigationRegion
  │  └─ UI-CMP-005 Controller Hint Strip, якщо indicator visible
  └─ ActionRegion
     └─ UI-CMP-033
        ├─ MenuTriggerSlot
        └─ ResponsiveDrawerSurface
           ├─ UI-CMP-002 Game Switcher
           ├─ full breadcrumb/navigation items
           └─ global actions
```

Expected behavior:

- inline breadcrumbs не монтуються;
- inline game switcher не монтується;
- hidden inline navigation не присутня в tab order або accessibility tree;
- visible controller connection indicator лишається поза drawer і не дублюється inside drawer;
- `UI-CMP-033` drawer content дає reachable equivalents для прихованих navigation affordances.

## Вхідні дані

- `responsiveMode`: `mobile`, `tablet` або `desktop`.
- `menuState`: `closed` або `open`.
- `activeSurfaceCode`: code активної UI-поверхні.
- `activeRouteLabel`: localized label активного route або surface.
- `activeGameId`: installed game id із route prefix або app-level state.
- `activeGameLabel`: label active business entry point.
- `availableGames`: installed game descriptors для `UI-CMP-002`.
- `gameSwitcherState`: selected, disabled, busy або invalid state для `UI-CMP-002`.
- `breadcrumbs`: ordered list breadcrumb items для active surface.
- `responsiveNavigationLabel`: localized accessible title для mobile/tablet drawer.
- `responsiveCloseLabel`: localized accessible name explicit drawer close control.
- `navigationAvailability`: доступність Catalog, Named Lists, Builder, Settings і breadcrumb navigation.
- `systemActionAvailability`: доступність optional utility actions.
- `firstLaunchNavigationPolicy`: чи global actions hidden, disabled або limited до first-launch completion.
- `activeLanguage`: active UI language для labels.

## Вихідні події

- `requestOpenTopBarMenu`: відкрити menu.
- `requestCloseTopBarMenu`: закрити active surface з semantic reason, включно з `closePress`, `closeWatcher`, `outsidePress`, `escapeKey` або `swipe`.
- `requestToggleTopBarMenu`: перемкнути menu.
- `requestNavigateCatalog`: перейти до `UI-PAGE-003 Catalog`, mobile і tablet-only equivalent для breadcrumb access.
- `requestNavigateNamedLists`: перейти до `UI-PAGE-005 Named Lists`.
- `requestNavigateBuilder`: перейти до `UI-PAGE-006 Custom Combo Builder`.
- `requestNavigateSettings`: перейти до `UI-PAGE-008 Settings`.
- `requestNavigateBreadcrumb`: перейти за navigable breadcrumb item, якщо item включено в mobile і tablet drawer.
- `requestSwitchGameFromMenu`: змінити active/default або last active game через App Shell і виконати analogous navigation.
- `requestSelectTopBarMenuAction`: виконати allowed utility action.

`requestSwitchGameFromMenu` має той самий App Shell effect, що й `requestSwitchGameFromBreadcrumb`.

## Межі відповідальності

Компонент відповідає за:

- opener button semantics;
- desktop menu і responsive drawer semantics;
- conditional content contract для desktop menu і mobile/tablet drawer content;
- disabled/current/selected menu item presentation;
- keyboard і pointer interaction;
- focus restore після close;
- close on route change через input state від App Shell/Top Bar.

Компонент не відповідає за:

- route rewrite;
- settings persistence;
- installed game validation;
- validation game-owned local state;
- import/export backup;
- language або notation display mode controls;
- notation legend table;
- Browser Gamepad API;
- controller input normalization;
- game-specific catalog, detail, list або builder rules;
- domain mutation активної сторінки.

## Мапа станів

### `wideClosed`

`responsiveMode = desktop`, menu закрите.

Очікуваний UI:

- breadcrumbs і `UI-CMP-002` змонтовані inline;
- burger opener visible right-pinned;
- menu items не є active focus targets;
- controller indicator visible outside menu, якщо `UI-CMP-005` не hidden.

### `wideOpen`

`responsiveMode = desktop`, menu відкрите.

Очікуваний UI:

- desktop menu surface aligned до opener;
- menu містить global actions без mobile і tablet duplicate breadcrumbs;
- `Escape` закриває menu;
- focus повертається до opener після close.

### `mobileOrTabletClosed`

`responsiveMode = mobile` або `responsiveMode = tablet`, menu закрите.

Очікуваний UI:

- inline breadcrumbs не змонтовані;
- inline `UI-CMP-002` не змонтований;
- burger opener visible;
- controller connection indicator visible outside drawer, якщо `UI-CMP-005` у visible state;
- tab order не містить приховані breadcrumbs.

### `mobileOrTabletOpen`

`responsiveMode = mobile` або `responsiveMode = tablet`, menu відкрите.

Очікуваний UI:

- drawer містить mobile і tablet game switcher region;
- drawer містить Catalog/current trail navigation equivalents;
- drawer містить Named Lists, Builder і Settings;
- current route/action позначений як current або disabled-current;
- visible controller indicator лишається outside drawer.

### `firstLaunchLimited`

First-launch gate ще не завершено.

Очікуваний UI:

- unavailable route actions hidden або disabled згідно з policy App Shell;
- disabled actions мають readable reason або accessible description;
- controller indicator може лишатися visible outside drawer.

### `navigationPending`

Користувач вибрав route action або game switch, і App Shell застосовує navigation.

Очікуваний UI:

- selected item може мати busy/pressed state;
- repeated activation тимчасово disabled;
- після successful navigation menu закривається;
- focus переходить до safe shell/page target згідно з App Shell navigation behavior.

### `disabledAction`

Action переданий, але тимчасово unavailable.

Очікуваний UI:

- item не виконує navigation;
- disabled reason доступний textually або через accessible description;
- color не є єдиним сигналом.

## Доступність і поведінка вводу

- Opener є button із localized accessible name.
- Icon-only opener має visible tooltip або equivalent accessible relationship, якщо implementation це підтримує.
- `aria-expanded` відповідає open state.
- `aria-controls` або Base UI equivalent пов'язує opener із desktop menu або responsive drawer.
- Desktop surface має menu semantics; responsive drawer має modal dialog/navigation semantics і accessible title.
- Menu items мають accessible names.
- Current page або selected game мають semantic current/selected state.
- Disabled items використовують native disabled або intentional `aria-disabled` behavior і не trap-лять keyboard.
- `Enter` і `Space` на opener відкривають menu.
- `Escape` у menu/drawer закриває surface і повертає focus до opener.
- Responsive drawer також закривається через backdrop interaction, close control і swipe праворуч.
- Outside click/tap закриває active menu/drawer без виконання action.
- Route change закриває active menu/drawer без domain mutation активної сторінки.
- Focus order у mobile і tablet layout: visible controller indicator, burger opener, opened menu items, потім active surface або safe shell target.
- Розміщення має лишатися usable за browser zoom і increased text size.
- Meaningful transition має reduced-motion behavior.

## Recipe і variant requirements

Implementation має використовувати semantic recipes:

- `control` для burger opener;
- `popup` або `surface` для menu shell;
- `item` для navigation/action rows;
- `panel` для grouped mobile і tablet content;
- `separator` для group separation;
- `indicator` для current/selected marks, якщо потрібні.

Allowed semantic axes:

- `layout`: `mobile`, `tablet` або `desktop`;
- `state`: `closed`, `open`, `disabled`, `busy`;
- `placement`: `topBarEnd`;
- `material`: `opaque`, `elevated` або restrained `glass`;
- `density`: `small` або `medium`;
- `selection`: `none`, `current`, `selected`;
- `tone`: `neutral`, `warning`, `destructive`, якщо future utility action цього потребує.

Forbidden primary public axes:

- raw color;
- arbitrary radius;
- arbitrary shadow;
- arbitrary blur;
- raw spacing;
- direct `className` як primary styling API.

## Критерії приймання

- `UI-CMP-033` має burger opener як єдиний opener.
- Opener має accessible name, `aria-expanded` і keyboard activation.
- На `desktop` breadcrumbs і `UI-CMP-002` змонтовані inline, а `UI-CMP-033` не дублює їх у menu.
- На `mobile` і `tablet` breadcrumbs і inline `UI-CMP-002` не монтуються.
- На `mobile` і `tablet` drawer містить `UI-CMP-002`, один Catalog navigation item, current trail equivalents, Named Lists, Builder і Settings.
- Visible controller connection indicator лишається outside drawer і не дублюється в drawer.
- Compact hiding не реалізується CSS-only visibility; hidden inline controls відсутні з DOM/focus order.
- Successful menu/drawer action закриває active surface.
- `Escape` закриває menu/drawer і повертає focus до opener.
- Route change закриває menu/drawer.
- `UI-CMP-033` не містить language або notation display mode controls або `UI-CMP-037 Notation Legend Table`.
- `UI-CMP-033` не містить окремий Backup action.
- Icon usage і shared primitive ownership відповідають [ARCHITECTURE.md](../ARCHITECTURE.md).

## Storybook і visual coverage

Storybook має містити сценарії:

- `WideClosed`;
- `WideOpen`;
- `CompactClosed`;
- `CompactOpen`;
- `ControllerAbsent`;
- `ControllerConnected`;
- `ControllerDisconnectGrace`;
- `FirstLaunchLimited`;
- `LongLabels`;
- `FocusVisible`;
- `KeyboardOnly`;
- `ReducedMotion`;
- `DisabledActions`.

Visual tests мають покривати:

- `desktop` viewport;
- mobile і tablet viewport;
- light/dark;
- standard/increased contrast;
- open desktop menu portal і mobile/tablet drawer capture на page level;
- long localized labels;
- zoom/text resizing stress;
- controller indicator outside menu/drawer;
- no overlap між opener, controller indicator і active navigation surface.

Automated accessibility checks мають перевірити:

- opener accessible name;
- expanded state;
- desktop menu roles і responsive drawer dialog semantics;
- current/selected states;
- disabled reasons;
- focus return;
- keyboard operation;
- відсутність hidden-but-focusable breadcrumbs у mobile і tablet layout.

## Тестові сценарії

- Wide route `/mkxl/catalog` показує `MKXL` у inline `UI-CMP-002`, burger menu містить Named Lists, Builder і Settings.
- Wide burger menu не містить duplicate game switcher.
- Wide Catalog доступний через breadcrumb item.
- Compact route `/mkxl/catalog` не монтує inline breadcrumbs.
- Compact drawer містить `UI-CMP-002` і рівно один Catalog navigation item.
- Compact game switch із `MKXL` на `MK1` емітить той самий App Shell intent, що й breadcrumb game switch.
- Compact Named Lists action закриває drawer після successful navigation.
- Compact Settings action не відкриває inline language/display mode controls або notation legend у Top Bar.
- Connected controller indicator лишається visible outside drawer.
- Disconnect grace indicator лишається visible outside drawer протягом 1 хв.
- No controller state не резервує місце під indicator outside menu/drawer.
- `Escape` закриває menu/drawer і повертає focus до opener.
- Outside click/tap закриває menu/drawer без action.
- Disabled first-launch actions не виконують navigation і мають readable reason.
- Long UA labels не overlap-яться з opener або controller indicator.

## Відкриті уточнення

- Точний icon facade module для burger icon буде визначено під час UI реалізації в `packages/ui`.
- Точна popup primitive API залежить від Base UI wrapper, який буде доступний у `packages/ui`.
- Якщо майбутня реалізація додасть secondary utility actions, вони мають пройти App Shell availability model і не дублювати Settings-owned controls.

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
