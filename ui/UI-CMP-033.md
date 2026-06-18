# UI-CMP-033: Top Bar Dropdown Menu

## Метадані

- Код: `UI-CMP-033`
- Назва: `Top Bar Dropdown Menu`
- Тип: `компонент / menu popup / responsive top-bar overflow`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власник: [`UI-CMP-001 Global Top Bar`](./UI-CMP-001.md)
- Батьківська сторінка: [`UI-PAGE-001 App Shell`](./UI-PAGE-001.md)
- Пов'язані компоненти: [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md), [`UI-CMP-005 Controller Hint Strip`](./UI-CMP-005.md), `UI-CMP-032 Breadcrumbs`
- Пов'язані UX сценарії: `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-CMP-033 Top Bar Dropdown Menu` є праворуч закріпленим burger menu у `UI-CMP-001 Global Top Bar`.

Компонент дає користувачу:

- компактний opener для global navigation і utility actions;
- доступ до `Named Lists`, `Custom Combo Builder` і `Settings`;
- compact navigation fallback на екранах менших за desktop layout;
- доступ до `UI-CMP-002 Game Switcher` у compact layout, коли breadcrumbs не монтуються inline;
- доступ до `Catalog` у compact layout, коли desktop breadcrumb navigation не монтується inline.

`UI-CMP-033` не є page-level router, settings editor або controller input layer. Він рендерить переданий menu model, емітить UI/navigation intents і повертає focus до opener після закриття.

## Архітектурний контекст

Архітектурне джерело правди для package ownership, import direction, icon facade, Base UI і `tailwind-variants` знаходиться в [ARCHITECTURE.md](../ARCHITECTURE.md).

Для майбутньої реалізації:

- menu trigger, menu surface і menu items мають використовувати shared primitives із `packages/ui`, які wrap-лять Base UI;
- styling має йти через semantic `tailwind-variants` recipes для `control`, `popup`, `item`, `surface`, `panel` і `separator`;
- burger icon має імпортуватися тільки через icon facade `@mk-combos/ui/icons/...`, а не напряму з `lucide-react`;
- app-level route rewrite, settings persistence і game validation лишаються в `UI-PAGE-001 App Shell` та active game business entry point.

## Володіння

`UI-CMP-001 Global Top Bar` володіє місцем `UI-CMP-033`, open/closed state menu і responsive JSX composition.

`UI-PAGE-001 App Shell` володіє:

- active route і active surface;
- `topBarLayoutMode`;
- installed game list;
- game-switch navigation;
- global route navigation;
- closing menu on route change;
- applied settings і local persistence.

`UI-CMP-033` відповідає тільки за:

- opener button;
- anchored menu surface;
- menu item rendering;
- open/closed accessibility semantics;
- keyboard і pointer interaction усередині menu;
- focus return до opener;
- intent events до Top Bar/App Shell.

## Зони розмітки

```text
UI-CMP-033 Top Bar Dropdown Menu
  ├─ Burger opener button
  └─ Menu surface
     ├─ Optional compact game switcher region
     │  └─ UI-CMP-002 Game Switcher
     ├─ Optional compact breadcrumb/navigation region
     ├─ Global navigation item group
     ├─ Optional utility item group
     └─ Optional disabled/status item
```

### Burger opener button

Opener є icon-only button із burger/menu icon.

Вимоги:

- має localized accessible name, наприклад `Open main menu`;
- має `aria-expanded`, який відповідає open state;
- має `aria-controls` або equivalent relationship із menu surface;
- відкривається через click, tap, `Enter` і `Space`;
- має visible `focus-visible` у light, dark, standard contrast і increased contrast;
- не змінює розміри Top Bar між idle, hover, active, focus-visible, disabled і open states.

### Menu surface

Menu surface є anchored popup/menu, прив'язаний до burger opener.

Вимоги:

- вирівнюється до правого краю Top Bar;
- використовує functional popup/material тільки як owning menu surface;
- має max available height і scroll behavior, якщо items не вміщаються;
- закривається через `Escape`, outside interaction, route change або successful action;
- повертає focus до burger opener після закриття;
- не лишає hidden-but-focusable items після close.

### Compact game switcher region

У `compact` layout menu surface включає `UI-CMP-002 Game Switcher` як breadcrumbs-equivalent game switcher.

Rules:

- використовувати той самий selection intent, що й `UI-CMP-002` у breadcrumbs;
- не виконувати route rewrite або persistence всередині menu;
- current game має бути readable і semantically selected/current;
- unavailable game options мають disabled reason або accessible description.

### Compact navigation region

У `compact` layout menu surface включає navigation equivalents для прихованого inline breadcrumb trail.

Menu може містити:

- active game switcher через `UI-CMP-002`;
- `Catalog` navigation item;
- current route або current surface item;
- parent breadcrumb-like navigation items, якщо App Shell передав їх як available actions.

`Catalog` дозволений у compact menu, тому що desktop breadcrumb access не монтується inline у цьому layout.

### Global navigation item group

Global navigation item group містить:

- `Named Lists`;
- `Custom Combo Builder`;
- `Settings`;
- optional global utility actions, якщо App Shell передав їх як available.

Menu не містить окремий Backup action. Backup доступний через `UI-PAGE-008 Settings -> UI-CMP-034 Backup Collapsible Block`.

Menu не містить inline controls для `language` або `notation display mode`.

## Responsive JSX Composition

Responsive behavior керується conditional JSX composition через `topBarLayoutMode`, а не CSS-only visibility.

CSS може стилізувати змонтовані гілки, але не є source of truth для presence, focusability або accessible tree.

### `wide13_6Plus`

На `wide13_6Plus` Top Bar JSX включає:

```text
UI-CMP-001
  ├─ UI-CMP-032 Breadcrumbs
  │  └─ UI-CMP-002 Game Switcher
  ├─ UI-CMP-005 Controller Hint Strip, якщо indicator visible
  └─ UI-CMP-033
     ├─ Burger opener
     └─ Menu surface with global actions
```

Expected behavior:

- breadcrumbs і game switcher є inline focus targets;
- `UI-CMP-005` лишається поруч із navigation block, якщо visible;
- `UI-CMP-033` не дублює `UI-CMP-002` або breadcrumbs;
- `Catalog` доступний через breadcrumb item, а не global action group.

### `compact`

На `compact` Top Bar JSX включає:

```text
UI-CMP-001
  ├─ UI-CMP-005 Controller Hint Strip, якщо indicator visible
  └─ UI-CMP-033
     ├─ Burger opener
     └─ Menu surface
        ├─ UI-CMP-002 Game Switcher
        ├─ compact breadcrumb/navigation items
        └─ global actions
```

Expected behavior:

- inline breadcrumbs не монтуються;
- inline game switcher не монтується;
- hidden inline navigation не присутня в tab order або accessibility tree;
- visible controller connection indicator лишається поза menu і не дублюється inside menu;
- `UI-CMP-033` menu content дає reachable equivalents для прихованих navigation affordances.

## Вхідні дані

- `topBarLayoutMode`: `wide13_6Plus` або `compact`.
- `menuState`: `closed` або `open`.
- `activeSurfaceCode`: code активної UI-поверхні.
- `activeRouteLabel`: localized label активного route або surface.
- `activeGameId`: installed game id із route prefix або app-level state.
- `activeGameLabel`: label active business entry point.
- `availableGames`: installed game descriptors для `UI-CMP-002`.
- `gameSwitcherState`: selected, disabled, busy або invalid state для `UI-CMP-002`.
- `breadcrumbs`: ordered list breadcrumb items для active surface.
- `navigationAvailability`: доступність Catalog, Named Lists, Builder, Settings і breadcrumb navigation.
- `systemActionAvailability`: доступність optional utility actions.
- `firstLaunchNavigationPolicy`: чи global actions hidden, disabled або limited до first-launch completion.
- `activeLanguage`: active UI language для labels.

## Вихідні події

- `requestOpenTopBarMenu`: відкрити menu.
- `requestCloseTopBarMenu`: закрити menu.
- `requestToggleTopBarMenu`: перемкнути menu.
- `requestNavigateCatalog`: перейти до `UI-PAGE-003 Catalog`, compact-only equivalent для breadcrumb access.
- `requestNavigateNamedLists`: перейти до `UI-PAGE-005 Named Lists`.
- `requestNavigateBuilder`: перейти до `UI-PAGE-006 Custom Combo Builder`.
- `requestNavigateSettings`: перейти до `UI-PAGE-008 Settings`.
- `requestNavigateBreadcrumb`: перейти за navigable breadcrumb item, якщо item включено в compact menu.
- `requestSwitchGameFromMenu`: змінити active/default або last active game через App Shell і виконати analogous navigation.
- `requestSelectTopBarMenuAction`: виконати allowed utility action.

`requestSwitchGameFromMenu` має той самий App Shell effect, що й `requestSwitchGameFromBreadcrumb`.

## Межі відповідальності

Компонент відповідає за:

- opener button semantics;
- menu surface semantics;
- conditional content contract для wide і compact menu content;
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

`topBarLayoutMode = wide13_6Plus`, menu закрите.

Очікуваний UI:

- breadcrumbs і `UI-CMP-002` змонтовані inline;
- burger opener visible right-pinned;
- menu items не є active focus targets;
- controller indicator visible outside menu, якщо `UI-CMP-005` не hidden.

### `wideOpen`

`topBarLayoutMode = wide13_6Plus`, menu відкрите.

Очікуваний UI:

- menu surface aligned до opener;
- menu містить global actions без compact duplicate breadcrumbs;
- `Escape` закриває menu;
- focus повертається до opener після close.

### `compactClosed`

`topBarLayoutMode = compact`, menu закрите.

Очікуваний UI:

- inline breadcrumbs не змонтовані;
- inline `UI-CMP-002` не змонтований;
- burger opener visible;
- controller connection indicator visible outside menu, якщо `UI-CMP-005` у visible state;
- tab order не містить приховані breadcrumbs.

### `compactOpen`

`topBarLayoutMode = compact`, menu відкрите.

Очікуваний UI:

- menu містить compact game switcher region;
- menu містить Catalog/current trail navigation equivalents;
- menu містить Named Lists, Builder і Settings;
- current route/action позначений як current або disabled-current;
- visible controller indicator лишається outside menu.

### `firstLaunchLimited`

First-launch gate ще не завершено.

Очікуваний UI:

- unavailable route actions hidden або disabled згідно з policy App Shell;
- disabled actions мають readable reason або accessible description;
- controller indicator може лишатися visible outside menu.

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
- `aria-controls` або Base UI equivalent пов'язує opener із menu surface.
- Menu surface має menu або navigation semantics відповідно до implementation pattern.
- Menu items мають accessible names.
- Current page або selected game мають semantic current/selected state.
- Disabled items використовують native disabled або intentional `aria-disabled` behavior і не trap-лять keyboard.
- `Enter` і `Space` на opener відкривають menu.
- `Escape` у menu закриває menu і повертає focus до opener.
- Outside click/tap закриває menu без виконання action.
- Route change закриває menu без domain mutation активної сторінки.
- Focus order у compact layout: visible controller indicator, burger opener, opened menu items, потім active surface або safe shell target.
- Layout має лишатися usable за browser zoom і increased text size.
- Meaningful transition має reduced-motion behavior.

## Recipe і variant requirements

Implementation має використовувати semantic recipes:

- `control` для burger opener;
- `popup` або `surface` для menu shell;
- `item` для navigation/action rows;
- `panel` для grouped compact content;
- `separator` для group separation;
- `indicator` для current/selected marks, якщо потрібні.

Allowed semantic axes:

- `layout`: `wide13_6Plus` або `compact`;
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
- На `wide13_6Plus` breadcrumbs і `UI-CMP-002` змонтовані inline, а `UI-CMP-033` не дублює їх у menu.
- На `compact` breadcrumbs і inline `UI-CMP-002` не монтуються.
- На `compact` menu містить `UI-CMP-002`, Catalog navigation, current trail equivalents, Named Lists, Builder і Settings.
- Visible controller connection indicator лишається outside menu і не дублюється в menu.
- Compact hiding не реалізується CSS-only visibility; hidden inline controls відсутні з DOM/focus order.
- Successful menu action закриває menu.
- `Escape` закриває menu і повертає focus до opener.
- Route change закриває menu.
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

- `wide13_6Plus` viewport;
- compact viewport;
- light/dark;
- standard/increased contrast;
- open menu portal або popup capture на page level;
- long localized labels;
- zoom/text resizing stress;
- controller indicator outside menu;
- no overlap між opener, controller indicator і menu surface.

Automated accessibility checks мають перевірити:

- opener accessible name;
- expanded state;
- menu roles;
- current/selected states;
- disabled reasons;
- focus return;
- keyboard operation;
- відсутність hidden-but-focusable breadcrumbs у compact layout.

## Тестові сценарії

- Wide route `/mkxl/catalog` показує `MKXL` у inline `UI-CMP-002`, burger menu містить Named Lists, Builder і Settings.
- Wide burger menu не містить duplicate game switcher.
- Wide Catalog доступний через breadcrumb item.
- Compact route `/mkxl/catalog` не монтує inline breadcrumbs.
- Compact burger menu містить `UI-CMP-002` і Catalog navigation item.
- Compact game switch із `MKXL` на `MK1` емітить той самий App Shell intent, що й breadcrumb game switch.
- Compact Named Lists action закриває menu після successful navigation.
- Compact Settings action не відкриває inline language/display mode controls або notation legend у Top Bar.
- Connected controller indicator лишається visible outside menu.
- Disconnect grace indicator лишається visible outside menu протягом 1 хв.
- No controller state не резервує місце під indicator outside menu.
- `Escape` закриває menu і повертає focus до opener.
- Outside click/tap закриває menu без action.
- Disabled first-launch actions не виконують navigation і мають readable reason.
- Long UA labels не overlap-яться з opener або controller indicator.

## Відкриті уточнення

- Точний icon facade module для burger icon буде визначено під час UI реалізації в `packages/ui`.
- Точна popup primitive API залежить від Base UI wrapper, який буде доступний у `packages/ui`.
- Якщо майбутня реалізація додасть secondary utility actions, вони мають пройти App Shell availability model і не дублювати Settings-owned controls.
