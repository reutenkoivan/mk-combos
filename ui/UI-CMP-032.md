# UI-CMP-032: Breadcrumbs

## Метадані

- Код: `UI-CMP-032`
- Назва: `Breadcrumbs`
- Тип: `компонент / inline top-bar navigation trail`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власник: [`UI-CMP-001 Global Top Bar`](./UI-CMP-001.md)
- Батьківська сторінка: [`UI-PAGE-001 App Shell`](./UI-PAGE-001.md)
- Вкладені компоненти: [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md)
- Пов'язані компоненти: [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md), [`UI-CMP-005 Controller Hint Strip`](./UI-CMP-005.md)
- Пов'язані UX сценарії: `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-CMP-032 Breadcrumbs` показує contextual navigation trail для active surface у верхній панелі застосунку.

Компонент дає користувачу:

- readable active game як перший interactive crumb через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md);
- quick orientation у поточному route або work surface;
- wide-layout access до `UI-PAGE-003 Catalog` через navigable `Catalog` crumb;
- navigable parent crumbs, якщо App Shell передав безпечний target;
- current crumb, який пояснює поточну surface, але не навігує в той самий route.

`UI-CMP-032` є inline component тільки для `wide13_6Plus` layout. У `compact` layout inline breadcrumbs не монтуються; їхні navigable equivalents рендерить [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md).

Breadcrumbs не замінюють page-level heading, не є router-ом, не змінюють app settings і не виконують route rewrite або persistence самостійно.

## Архітектурний контекст

Архітектурне джерело правди для route ownership, installed games, package boundaries і responsive Top Bar composition знаходиться в [ARCHITECTURE.md](../ARCHITECTURE.md) та [`UI-PAGE-001 App Shell`](./UI-PAGE-001.md).

Для майбутньої реалізації:

- `UI-CMP-001 Global Top Bar` вирішує, чи монтувати breadcrumbs, через `topBarLayoutMode`;
- `UI-CMP-032` рендериться тільки в mounted wide branch і не приховується CSS-only у compact;
- `UI-CMP-002` отримує installed game descriptors від App Shell і не hardcode-ить game ids;
- route changes, analogous game-switch navigation і persistence належать App Shell;
- compact equivalents для breadcrumb actions належать `UI-CMP-033`.

## Володіння

`UI-PAGE-001 App Shell` володіє active route, active `gameId`, installed games, route availability, breadcrumb model і game-switch navigation strategy.

`UI-CMP-001 Global Top Bar` володіє placement breadcrumbs у Top Bar і conditional JSX composition:

- у `wide13_6Plus` монтує `UI-CMP-032`;
- у `compact` не монтує `UI-CMP-032`, а передає equivalent navigation model у `UI-CMP-033`;
- передає events від breadcrumbs до App Shell.

`UI-CMP-032` відповідає тільки за:

- inline rendering переданого breadcrumb trail;
- розміщення `UI-CMP-002 Game Switcher` як першого crumb;
- current, navigable, disabled і truncated presentation для breadcrumb items;
- keyboard/pointer/touch interaction із власними focus targets;
- emission intent events у Top Bar/App Shell.

`UI-CMP-032` не відповідає за:

- route rewrite;
- game switch persistence;
- fallback strategy після game switch;
- first-launch completion marker;
- compact menu content;
- global navigation items `Named Lists`, `Builder`, `Settings`;
- language або notation display mode controls;
- controller indicator або controller hint panel;
- domain mutation активної сторінки.

## Breadcrumb Item Contract

Breadcrumb items готує App Shell або active page flow і передає в Top Bar як already-resolved presentation/navigation model.

```ts
type BreadcrumbItemKind =
  | "catalog"
  | "character"
  | "variation"
  | "kameo"
  | "comboDetail"
  | "namedLists"
  | "namedList"
  | "builder"
  | "settings"
  | "custom";

type BreadcrumbTarget = {
  surfaceCode: string;
  route?: string;
  params?: Record<string, string>;
};

type BreadcrumbItem = {
  id: string;
  label: string;
  kind: BreadcrumbItemKind;
  target?: BreadcrumbTarget;
  current: boolean;
  disabled: boolean;
  disabledReason?: string;
  truncationLabel?: string;
};
```

Rules:

- `id` є stable key у межах active trail і не залежить від localized label.
- `label` є readable localized text для visible crumb.
- `kind` використовується тільки для presentation/semantics, не для business branching усередині breadcrumbs.
- `target` існує тільки для navigable crumbs.
- `current = true` означає, що crumb позначений як current і не емітить navigation у той самий route.
- `disabled = true` означає, що crumb visible, але не виконує action; `disabledReason` має бути readable, якщо причина не очевидна з контексту.
- `truncationLabel` може використовуватися як accessible full label або tooltip, якщо visible label скорочено.

Game switcher не є `BreadcrumbItem`. Він рендериться окремо як перший child через [`UI-CMP-002`](./UI-CMP-002.md) і емітить own game selection intent.

## Анатомія

Розміщення breadcrumbs є horizontal trail усередині wide Top Bar: game switcher завжди перший, решта crumbs ідуть праворуч у hierarchy order, overflow affordance стоїть наприкінці.

```text
UI-CMP-032 Breadcrumbs
  └─ (left, inside UI-CMP-001 wide13_6Plus only) Breadcrumb nav root
     ├─ (left, first item) Game crumb
     │  └─ (inside crumb) UI-CMP-002 Game Switcher
     ├─ (between crumbs) Separator group
     ├─ (right of game crumb) Breadcrumb item list
     │  ├─ Navigable crumb
     │  ├─ Disabled crumb
     │  └─ Current crumb
     └─ (right/end, conditional) Optional overflow/truncation affordance
```

Правила розміщення:

- Component монтується inline тільки на `wide13_6Plus`; на `compact` equivalents передаються в `UI-CMP-033`.
- Game crumb завжди лівіший за route crumbs і не змішується з `Catalog` crumb.
- Overflow/truncation affordance стоїть наприкінці trail і не перекриває `UI-CMP-005` або right-pinned menu.

### Breadcrumb nav root

Root є inline navigation region у `UI-CMP-001 Global Top Bar`.

Root має:

- мати navigation semantics або equivalent accessible relationship;
- мати localized accessible name, наприклад `Breadcrumbs`;
- займати доступний простір у wide Top Bar між left navigation start і controller/menu areas;
- не перекривати `UI-CMP-005 Controller Hint Strip` або right-pinned `UI-CMP-033`;
- підтримувати long labels через truncation, wrapping prevention або overflow strategy;
- не створювати hidden focus targets у compact layout, бо компонент там не монтується.

### Game crumb

Game crumb є першим interactive item і завжди рендериться через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md), якщо active game resolved.

Rules:

- `UI-CMP-002` отримує `context = "breadcrumbs"`;
- selected game label відповідає active business entry point, наприклад `MKXL` або `MK1`;
- game switch selection емітить `requestSwitchGameFromBreadcrumb`;
- game switch не змішується з `Catalog` crumb;
- unavailable game option не виконує selection і має readable disabled reason;
- busy game switch не робить breadcrumbs router-ом.

### Separator group

Separators є purely presentational або accessibility-hidden, якщо screen reader отримує semantic list/nav structure.

Rules:

- separator не є focus target;
- separator не має бути єдиним способом зрозуміти hierarchy;
- exact visual separator не фіксується в spec і визначається UI implementation.

### Breadcrumb item list

Item list містить crumbs після game switcher.

Allowed common trail patterns:

```text
Game -> Catalog
Game -> Catalog -> Character -> Variation або Kameo
Game -> Catalog -> Character -> Variation або Kameo -> Combo Detail
Game -> Named Lists
Game -> Named Lists -> Named List
Game -> Builder
Game -> Settings
```

Page або App Shell можуть передати коротший trail, якщо context ще incomplete або current surface не має safe parent target.

### Navigable crumb

Navigable crumb має `target`, `current = false` і `disabled = false`.

Activation через click, tap, `Enter` або `Space` емітить `requestNavigateBreadcrumb` із item id і target. `UI-CMP-032` не виконує route change самостійно.

`Catalog` crumb є primary wide Top Bar access до [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md). У wide layout Catalog не дублюється як global item у `UI-CMP-033`.

### Current crumb

Current crumb має `current = true`.

Expected UI:

- позначений як current через semantic current state;
- може бути plain text або disabled-current control pattern;
- не емітить navigation у той самий route;
- лишається readable після label truncation.

### Disabled crumb

Disabled crumb має `disabled = true`.

Expected UI:

- не виконує navigation;
- не виглядає як active link;
- має readable disabled reason, якщо причина не очевидна;
- не покладається тільки на колір.

### Optional overflow/truncation affordance

Якщо trail не вміщується у wide Top Bar, implementation може:

- truncate middle або end labels;
- collapse low-priority middle crumbs в non-focusable summary;
- показати accessible full label через tooltip або description;
- лишити game switcher, current crumb і primary parent crumb readable.

Overflow strategy не має:

- перекривати controller indicator або right-pinned menu;
- створювати horizontal scroll у Top Bar без явної design decision;
- ховати focusable controls без вилучення їх із focus order;
- робити current location unreadable.

## Вхідні дані

- `topBarLayoutMode`: `wide13_6Plus` або `compact`; `UI-CMP-032` монтується тільки в `wide13_6Plus`.
- `activeSurfaceCode`: code активної UI-поверхні.
- `activeGameId`: installed game id із route prefix або app-level state.
- `activeGameLabel`: readable label active business entry point.
- `availableGames`: installed game descriptors для вкладеного `UI-CMP-002`.
- `gameSwitcherState`: selected, disabled, busy або invalid state для `UI-CMP-002`.
- `breadcrumbs`: ordered list `BreadcrumbItem` після game switcher.
- `navigationAvailability`: доступність breadcrumb navigation targets.
- `activeLanguage`: active UI language для labels.
- `focusedBreadcrumbId`: optional focus target для keyboard/controller handoff.

Inputs мають бути already localized і already validated parent flow-ом. Breadcrumbs не читають route params або installed games registry напряму.

## Вихідні події

- `requestNavigateBreadcrumb`: перейти за navigable breadcrumb item, зокрема до `UI-PAGE-003 Catalog`.
- `requestSwitchGameFromBreadcrumb`: змінити active/default або last active game через App Shell і виконати analogous navigation.
- `requestFocusBreadcrumb`: optional focus movement event, якщо implementation робить focus state controlled.
- `requestOpenGameMenu`: optional event, forwarded із `UI-CMP-002`, якщо game switcher використовує popup/listbox.
- `requestCloseGameMenu`: optional event, forwarded із `UI-CMP-002`.

Events є intent events. Route changes, focus destination після navigation, settings persistence і game-specific fallback виконуються App Shell або active page flow.

## Межі відповідальності

Компонент відповідає за:

- inline wide breadcrumbs rendering;
- перший game crumb через `UI-CMP-002`;
- item order, separators, current/disabled/navigable states;
- keyboard і pointer activation для breadcrumb items;
- accessible nav/list/current semantics;
- truncation або overflow behavior без overlap;
- event emission у Top Bar/App Shell.

Компонент не відповідає за:

- compact responsive equivalents;
- global dropdown menu actions;
- actual route navigation;
- game switch analogous navigation;
- persistence active/default game;
- first-launch setup;
- language або notation display mode changes;
- rendering `UI-CMP-003`, `UI-CMP-004` або `UI-CMP-037`;
- controller input normalization;
- opening controller hint panel;
- filtering catalog або changing active page domain state.

## Мапа станів

### `unmountedCompact`

`topBarLayoutMode = compact`.

Очікуваний UI:

- `UI-CMP-032` не монтується inline;
- inline game switcher не присутній у DOM/focus order;
- `UI-CMP-033` отримує compact equivalents для game switcher і breadcrumb navigation;
- visible controller indicator, якщо є, лишається outside menu.

### `loadingTrail`

App Shell ще готує active game або breadcrumb model.

Очікуваний UI:

- Top Bar тримає стабільне місце або показує safe minimal navigation state;
- не показує stale breadcrumb targets;
- interactive crumbs disabled, якщо target ще не resolved.

### `ready`

Active game і breadcrumb model готові.

Очікуваний UI:

- first item є `UI-CMP-002 Game Switcher`;
- item order відповідає переданому `breadcrumbs`;
- current item позначений як current;
- navigable items reachable keyboard/pointer/touch input.

### `currentOnly`

Trail має active game і один current surface item без safe parent target.

Очікуваний UI:

- game switcher лишається першим item;
- current item readable;
- відсутні parent crumbs не показуються як disabled placeholders.

### `navigationPending`

Користувач активував navigable crumb, і App Shell застосовує navigation.

Очікуваний UI:

- source crumb може показувати busy/pressed state, якщо parent передає pending state;
- repeated activation тимчасово disabled;
- після successful navigation App Shell передає новий trail;
- breadcrumbs не мутують active page state самостійно.

### `gameSwitchPending`

Користувач вибрав іншу installed game у `UI-CMP-002`.

Очікуваний UI:

- game switcher може показати busy state;
- breadcrumbs не переносять game-specific current crumbs у target game;
- App Shell виконує analogous navigation або fallback;
- local user data іншої гри не видаляється.

### `truncated`

Trail або labels не вміщуються в available Top Bar width.

Очікуваний UI:

- немає overlap із controller indicator або menu opener;
- current location лишається readable;
- full label доступний через accessible name, description або tooltip;
- focus outline не обрізається до невидимого стану.

### `disabledItem`

Один або більше crumbs передані як disabled.

Очікуваний UI:

- disabled item visible тільки якщо parent вважає його корисним для orientation;
- disabled item не виконує action;
- reason доступний textually або через accessible description.

## UI Behavior

### Wide render

1. App Shell resolves active route, active game і breadcrumb model.
2. App Shell передає `topBarLayoutMode = wide13_6Plus` у Top Bar.
3. Top Bar монтує `UI-CMP-032`.
4. Breadcrumbs рендерять `UI-CMP-002` як перший item.
5. Breadcrumbs рендерять ordered `breadcrumbs` items після game switcher.
6. Current item позначається як current і не має same-route navigation.

### Compact render

1. App Shell або Top Bar визначає `topBarLayoutMode = compact`.
2. Top Bar не монтує `UI-CMP-032`.
3. Top Bar передає game switcher і breadcrumb-equivalent navigation model у `UI-CMP-033`.
4. Compact menu забезпечує reachable equivalents для hidden inline navigation.

### Breadcrumb navigation

1. Користувач активує navigable crumb.
2. `UI-CMP-032` емітить `requestNavigateBreadcrumb(itemId, target)`.
3. Top Bar передає intent в App Shell.
4. App Shell виконує route navigation або safe fallback.
5. Після route change App Shell передає оновлений breadcrumb model.

`UI-CMP-032` не викликає router API напряму.

### Breadcrumb game switch

1. Користувач відкриває `UI-CMP-002 Game Switcher` у першому crumb.
2. Користувач вибирає target installed game.
3. `UI-CMP-002` емітить selection intent.
4. `UI-CMP-032` або Top Bar forwarding layer передає `requestSwitchGameFromBreadcrumb(targetGameId)` в App Shell.
5. App Shell виконує analogous navigation:
   - Catalog -> `/:targetGameId/catalog`;
   - Lists -> `/:targetGameId/lists`;
   - Builder -> `/:targetGameId/builder`;
   - Combo Detail -> `/:targetGameId/catalog` fallback;
   - Settings -> лишається `/settings` із оновленим active/default або last active game.

Game switch не видаляє named lists, custom combos або local game slices іншої гри.

## Доступність і поведінка вводу

- Breadcrumb root має navigation semantics або equivalent accessible name.
- Game switcher має readable current game state через `UI-CMP-002`.
- Breadcrumb list order має відповідати visual order.
- Navigable crumbs мають accessible names і працюють через click, tap, `Enter` і `Space`.
- Current crumb має semantic current state, наприклад `aria-current="page"` або equivalent pattern.
- Disabled crumbs використовують native disabled або intentional `aria-disabled` behavior і не trap-лять keyboard.
- Disabled reason має бути readable, якщо disabled crumb лишається visible.
- Separators не є focus targets і не засмічують screen reader output.
- Focus-visible має бути помітний для game switcher і navigable crumbs.
- `Escape` закриває popup/listbox вкладеного game switcher, якщо він відкритий, і повертає focus до game trigger.
- Long labels мають truncate або collapse без overlap і без втрати accessible full label.
- У `compact` layout inline breadcrumbs відсутні з DOM, tab order і accessibility tree.
- Browser zoom, increased text size і UA labels не мають ламати Top Bar layout.
- Controller commands приходять через App Shell/Top Bar semantic routing; `UI-CMP-032` не читає Browser Gamepad API напряму.

## Recipe і variant requirements

Implementation має використовувати semantic recipes, якщо breadcrumbs реалізуються в shared UI package:

- `navigation` або `surface` для root region;
- `item` для breadcrumb crumb;
- `control` для nested game switcher trigger через `UI-CMP-002`;
- `separator` для visual dividers;
- `indicator` для current/selected marks, якщо потрібно.

Allowed semantic axes:

- `layout`: `wide13_6Plus`;
- `state`: `ready`, `pending`, `disabled`, `current`;
- `density`: `small` або `medium`;
- `overflow`: `none`, `truncated`, `collapsed`;
- `tone`: `neutral`, `warning`, якщо disabled/current reason цього потребує.

Forbidden primary public axes:

- raw color;
- arbitrary radius;
- arbitrary shadow;
- arbitrary blur;
- raw spacing;
- direct `className` як primary styling API.

## Критерії приймання

- `UI-CMP-032` має окрему повну специфікацію.
- [UI.md](../UI.md) посилається на `ui/UI-CMP-032.md`.
- `UI-CMP-032` монтується inline тільки в `wide13_6Plus`.
- У `compact` inline breadcrumbs і inline `UI-CMP-002` не монтуються.
- First breadcrumb item у wide layout є [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md).
- `UI-CMP-002` у breadcrumbs отримує active game і installed games від App Shell/Top Bar inputs.
- `Catalog` crumb є primary wide Top Bar access до `UI-PAGE-003 Catalog`.
- Current crumb має current semantics і не виконує same-route navigation.
- Navigable crumb емітить `requestNavigateBreadcrumb`, а не виконує route change напряму.
- Game switch із breadcrumbs емітить `requestSwitchGameFromBreadcrumb`.
- Compact equivalents для hidden breadcrumbs лишаються у [`UI-CMP-033`](./UI-CMP-033.md).
- `UI-CMP-033` у wide layout не дублює breadcrumbs або game switcher.
- Breadcrumbs не містять `Named Lists`, `Builder` і `Settings` як global menu actions, якщо вони не є active/current trail context.
- Breadcrumbs не містять `UI-CMP-003`, `UI-CMP-004` або `UI-CMP-037`.
- Long UA/EN labels не overlap-яться з controller indicator або right-pinned menu.
- Disabled/current states не покладаються тільки на колір.
- Breadcrumbs не мутують domain state активної сторінки.

## Storybook і visual coverage

Storybook має містити сценарії:

- `WideCatalogCurrent`;
- `WideCatalogContext`;
- `WideComboDetail`;
- `WideNamedLists`;
- `WideBuilder`;
- `WideSettings`;
- `CurrentOnly`;
- `DisabledCrumb`;
- `LongLabels`;
- `TruncatedTrail`;
- `KeyboardOnly`;
- `FocusVisible`;
- `IncreasedTextSize`.

Visual tests мають покривати:

- `wide13_6Plus` viewport;
- light/dark;
- standard/increased contrast;
- long localized UA і EN labels;
- game switcher open popup або listbox, якщо implementation використовує popup;
- no overlap із `UI-CMP-005` і `UI-CMP-033`;
- truncation або collapsed middle crumbs;
- visible focus outlines.

Automated accessibility checks мають перевірити:

- root navigation accessible name;
- game switcher selected/current game;
- current crumb semantics;
- disabled crumb behavior і reason;
- focus order;
- keyboard activation;
- відсутність hidden inline breadcrumbs у compact layout.

## Тестові сценарії

- Wide route `/mkxl/catalog` показує `MKXL` як selected game у першому breadcrumb item.
- Wide route `/mk1/catalog` показує `MK1` як selected game у першому breadcrumb item.
- Wide `/mkxl/catalog` показує `Catalog` як current або safe Catalog crumb згідно з active route model.
- Combo Detail trail містить game switcher, `Catalog`, character/context і combo detail.
- MKXL Catalog context може показати `Character -> Variation` crumbs, якщо parent передав valid context.
- MK1 Catalog context може показати `Character -> Kameo` crumbs, якщо parent передав valid context.
- Current crumb позначений як current і не емітить navigation.
- `Catalog` breadcrumb емітить `requestNavigateBreadcrumb` з target `UI-PAGE-003 Catalog`.
- Game switcher у breadcrumbs на `/mkxl/catalog` може вибрати `MK1` і емітить `requestSwitchGameFromBreadcrumb`.
- Game switcher у breadcrumbs на combo detail із target `MK1` приводить App Shell до target Catalog fallback.
- Disabled crumb не емітить navigation і має readable reason.
- Long UA/EN labels truncate або collapse без overlap із controller indicator чи menu opener.
- Compact layout не монтує inline `UI-CMP-032`.
- Compact `UI-CMP-033` містить game switcher і breadcrumb-equivalent navigation.
- `Escape` закриває opened game switcher popup/listbox і повертає focus до game trigger.
- Keyboard focus переходить game switcher -> navigable crumbs -> next Top Bar control у visual order.
- Breadcrumbs не рендерять Language Switcher, Display Mode Switcher або Notation Legend Table.

## Відкриті уточнення

- Точний вигляд breadcrumb separators буде визначено під час UI реалізації.
- Точна overflow strategy може бути truncation або collapsed middle crumbs, якщо вона відповідає accessibility і no-overlap rules.
- Exact primitive API залежить від shared UI wrappers, доступних у `packages/ui`.
