# UI-PAGE-001: App Shell

## Метадані

- Код: `UI-PAGE-001`
- Назва: `App Shell`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Пов'язані компоненти: [`UI-CMP-001`](./UI-CMP-001.md), [`UI-CMP-002`](./UI-CMP-002.md)
- Вкладені компоненти: [`UI-CMP-005`](./UI-CMP-005.md), [`UI-CMP-002`](./UI-CMP-002.md), [`UI-CMP-032`](./UI-CMP-032.md), [`UI-CMP-033`](./UI-CMP-033.md) всередині `UI-CMP-001`
- Пов'язані UX сценарії: `US-001`, `US-008`, `US-009`, `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## Призначення

`UI-PAGE-001 App Shell` є постійною рамкою застосунку. Вона тримає слот активної
working page, навігаційний каркас, query-controlled Settings modal, системні шари та
передає команди контролера до поточної UI-поверхні.

App Shell має бути присутнім після старту застосунку в усіх режимах, але може блокувати доступ до робочих сторінок, якщо `UI-PAGE-002 First-Launch Setup` ще не завершено. Valid route-prefixed deep link є винятком: App Shell бере `gameId` із URL, знаходить installed business entry point і відкриває target surface без показу setup.

## Архітектурний контекст

App Shell є єдиним місцем, де route prefix перетворюється на active game context для UI surfaces.

Rules:

- installed games приходять із `apps/web/src/game-business/installed-games/value.ts`;
- route prefix `/:gameId/...` є source of truth для active game на deep links;
- App Shell вибирає active business entry point і передає page-level flows підготовлені game capabilities;
- App Shell обробляє game-switch intent із `UI-CMP-002` у tablet/desktop breadcrumbs або mobile menu і виконує analogous navigation;
- App Shell передає `responsiveMode` у `UI-CMP-001`, щоб Top Bar виконував conditional JSX composition;
- App Shell валідить `settings=interface|backup` у search current working route і
  монтує `UI-PAGE-008` як modal, не як route slot;
- App Shell не імпортує game data/rules напряму і не реалізує MKXL або MK1 бізнес-логіку.

App Shell відповідає за:

- глобальну розмітку застосунку;
- резолв `gameId` із route prefix;
- вибір active game business entry point;
- game switch navigation із tablet/desktop breadcrumbs або mobile menu;
- показ активної сторінки або обов'язкового first-launch gate;
- open/section state Settings modal, inert working-page underlay, responsive modal
  placement, dismissal priority і focus restore;
- читання вже застосованих settings з app-level state;
- передавання active settings до активної сторінки;
- передавання active game business capabilities до route-level flows;
- передавання named top-bar layout mode для responsive JSX composition;
- передавання controller connection state і contextual controller hints у `UI-CMP-001`;
- маршрутизацію semantic controller commands до активної сторінки;
- реєстр page/overlay command scopes, resolution active ribbon і shell-level `Menu` action;
- рендер єдиної connected-only controller command ribbon як третього in-flow row;
- показ спільних системних повідомлень, якщо вони не належать конкретній сторінці.

App Shell не відповідає за:

- фільтрацію combo list;
- рендер деталей конкретного combo;
- редагування custom combo path;
- import/export validation;
- пряме читання seeded combo graph;
- ручну зміну `language` або `notation display mode`;
- збереження settings у localStorage;
- пряму зміну стану доменних компонентів.

## Контракт Стану Сторінки

Стан у власності сторінки:

- active working route, route params, validated route search і active surface code;
- Settings query/modal state, opener focus target і prepared nested/busy dismissal barrier;
- applied settings, first-launch completion, active game, initial `defaultGameId`, persisted `lastActiveGameId` і active business entry point;
- controller connection state, semantic command stream і shell-level focus target;
- registered page/overlay command scopes і structurally stable active ribbon snapshot;
- top bar layout mode, breadcrumbs model, top bar menu state і controller hint panel state;
- shell overlays, system messages і safe fallback navigation target.

Підготовлені UI models для дочірніх компонентів:

- `UI-CMP-001` top bar model із breadcrumbs, game switcher data, controller indicator data, menu state і navigation availability;
- active page model із applied settings, active business entry point, controller commands і route context;
- Settings modal model із validated section, responsive mode, opener target і dismissal availability;
- controller ribbon model із localized commands, optional draft notation override і shell append/suppress policy;
- overlay/system message models для Settings і page-level dialogs, яким потрібне shell placement.

Сторінкові handlers / intents:

- `requestNavigateSurface(payload)`, `requestNavigateBreadcrumb(payload)`, `requestSwitchGame(payload)`;
- `requestOpenTopBarMenu(payload)`, `requestCloseTopBarMenu(payload)`, `requestToggleHints(payload)`;
- `requestOpenSettings(payload)`, `requestSelectSettingsSection(payload)`, `requestDismissSettings(payload)`;
- `requestApplySettings(payload)`, `requestResolveDeepLink(payload)`, `requestHandleControllerCommand(payload)`.

Бізнес-залежності:

- installed game registry in `apps/web/src/game-business/installed-games/value.ts`;
- app-level settings persistence and first-launch marker;
- `@mk-combos/controller-bridge` semantic commands.

Не відповідає за:

- game-specific catalog/detail/list/builder rules;
- direct child UI browser event payloads;
- direct mutation of game-owned seeded data.

## Анатомія

Розміщення читається згори вниз: Top Bar, active route slot і optional connected-only command ribbon утворюють три in-flow grid rows. Overlays і системні повідомлення накладаються поверх page content.

```jsx
<AppShell ui="UI-PAGE-001">
  <Stack name="AppShellLayout">
    <GlobalTopBar ui="UI-CMP-001">
      <ControllerHintStrip ui="UI-CMP-005" />
      <Breadcrumbs ui="UI-CMP-032">
        <GameSwitcher ui="UI-CMP-002" />
      </Breadcrumbs>
      <TopBarDropdownMenu ui="UI-CMP-033" />
    </GlobalTopBar>

    <ActiveRouteSlot>
      <Show when={activeRoute === "firstLaunch"}>
        <FirstLaunchSetupPage ui="UI-PAGE-002" />
      </Show>

      <Show when={activeRoute === "catalog"}>
        <CatalogPage ui="UI-PAGE-003" />
      </Show>

      <Show when={activeRoute === "comboDetail"}>
        <ComboDetailPage ui="UI-PAGE-004" />
      </Show>

      <Show when={activeRoute === "namedLists"}>
        <NamedListsPage ui="UI-PAGE-005" />
      </Show>

      <Show when={activeRoute === "builder"}>
        <CustomComboBuilderPage ui="UI-PAGE-006" />
      </Show>

      <Show when={activeRoute === "recovery"}>
        <RouteRecoveryPage />
      </Show>
    </ActiveRouteSlot>

    <Show when={settingsQuery === "interface" || settingsQuery === "backup"}>
      <SettingsModal ui="UI-PAGE-008" slot="OverlayLayer" />
    </Show>

    <Show when={controllerConnected && activeRibbonCommands.length > 0}>
      <ControllerCommandRibbon
        notationDisplayMode={activeRibbonNotationDisplayMode}
        overflow="horizontal"
        safeArea
      />
    </Show>

    <Show when={hasPageOwnedOverlay}>
      <OverlayLayer />
    </Show>

    <Show when={hasSystemMessages}>
      <SystemMessagesRegion />
    </Show>

    <InstalledGameBusinessRegistry nonVisual />
  </Stack>
</AppShell>
```

Правила розміщення:

- `UI-CMP-001` завжди розташований над active route slot.
- Active page ніколи не рендерить власний global top bar.
- Settings ніколи не займає active route slot; modal лишає working page mounted,
  робить shell underlay inert і відновлює focus після close.
- `ControllerCommandRibbon` належить App Shell, не є `fixed`/`sticky` і не потребує page-level bottom clearance.
- Page-owned dialogs можуть фізично монтуватися в shell overlay layer, але ownership лишається у відповідної active page.

### Кореневий контейнер Shell

Кореневий контейнер Shell є зовнішнім контейнером застосунку. Він задає базову адаптивну сітку, фон, відступи, поведінку focus/skip navigation і місце для активної UI-поверхні.

Кореневий контейнер Shell має:

- займати весь viewport;
- не створювати зайвий контейнер прокручування без потреби;
- дозволяти активній сторінці керувати власним вертикальним прокручуванням;
- тримати стабільну зону для top bar;
- тримати optional третю grid row для command ribbon без overlap з route content;
- не перекривати content top bar або system messages.

### UI-CMP-001 Global Top Bar

Детальна специфікація: [UI-CMP-001.md](./UI-CMP-001.md).

`UI-CMP-001 Global Top Bar` є постійною верхньою панеллю. У `tablet` і `desktop` вона показує однакові breadcrumbs із current game switcher; у `mobile` переносить navigation equivalents у right-pinned burger menu, лишаючи visible controller indicator outside menu.

Top Bar має:

- використовувати `responsiveMode` для conditional JSX composition, а не CSS-only hiding;
- у `tablet` і `desktop` рендерити [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md), де першим item є [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md);
- у `mobile` не монтувати inline breadcrumbs або inline game switcher;
- передавати game-switch intent із tablet/desktop breadcrumbs або mobile menu до App Shell;
- рендерити `UI-CMP-005 Controller Hint Strip` поруч із navigation block у `tablet` і `desktop` або outside dropdown menu у `mobile`;
- у `tablet` і `desktop` рендерити breadcrumbs для active surface і відкривати `UI-PAGE-003 Catalog` через breadcrumb navigation;
- тримати [`UI-CMP-033 Top Bar Dropdown Menu`](./UI-CMP-033.md) прибитим до правої сторони;
- давати доступ до lists і builder navigation та відкриття Settings modal через dropdown menu;
- у `mobile` давати доступ до game switcher, Catalog/current trail navigation і global actions через drawer;
- у `tablet` давати доступ через drawer лише до global actions без duplicate inline navigation;
- давати доступ до backup через `UI-PAGE-008 Settings -> UI-CMP-034 Backup Collapsible Block`;
- керувати місцем, видимістю і open/closed state controller hint panel;
- лишатися keyboard reachable;
- не дублювати локальні controls активної сторінки;
- не містити switchers для `language` або `notation display mode`.

### Слот активної сторінки

Слот активної сторінки є областю, де App Shell показує поточну сторінку:

- `UI-PAGE-002 First-Launch Setup`;
- `UI-PAGE-003 Catalog`;
- `UI-PAGE-004 Combo Detail`;
- `UI-PAGE-005 Named Lists`;
- `UI-PAGE-006 Custom Combo Builder`.

Recoverable invalid route може тимчасово показати unnumbered `RouteRecoveryPage` з одним
Confirm-target для переходу до fallback Catalog.

Застосунок використовує hash history для GitHub Pages: route patterns нижче є logical fragment
paths, а public URL має префікс `/mk-combos/#` (наприклад, logical `/mk1/catalog` відповідає
`/mk-combos/#/mk1/catalog`). Settings додає до цієї самої working route query
`settings=interface|backup`. Logical `/settings`, `/backup` і `/:gameId/backup` не
оголошені та не мають compatibility behavior.

Слот отримує глобальний контекст від App Shell і не має самостійно читати глобальні browser settings.

### Шар накладних панелей і діалогів

Шар накладних панелей і діалогів використовується для елементів, які відкриваються поверх активної сторінки.

У першому релізі в цьому шарі можуть з'являтися:

- `UI-PAGE-008 Settings` як query-controlled shell modal;
- `UI-CMP-013 Filter Control Group` expanded/collapsed state;
- `UI-CMP-018 Combo Actions Menu`;
- `UI-CMP-021 Add-To-List Dialog` як singleton dialog активної сторінки для combo context; App Shell може розміщувати overlay, але не володіє persistence;
- `UI-CMP-022 List Edit Dialog`;
- `UI-CMP-027 Export Dialog`;
- `UI-CMP-028 Import Preview Dialog`.

App Shell має забезпечити, що накладний елемент:

- має керований фокус;
- закривається через `back`, якщо це дозволено поточним flow;
- не губить стан активної сторінки після закриття;
- не блокує first-launch gate правила.

Для Settings shell додатково забезпечує full-screen surface у `mobile`/`tablet`,
tall, wide centered dialog у `desktop`, backdrop dismissal, browser Back dismissal і
semantic controller `Back`. Nested Settings dialog має dismissal precedence; busy
backup barrier блокує Settings close.

### Область системних повідомлень

Область системних повідомлень показує повідомлення, які стосуються всього застосунку, а не конкретної сторінки.

Приклади:

- localStorage недоступний, app працює в session-only режимі;
- controller disconnected або reconnected;
- settings не вдалося зберегти;
- deep link частково відновлено, але частину context довелося скинути.

Системні повідомлення мають бути неблокувальними, якщо стан не є критичним.

## Контракти компонентів

### UI-CMP-001 Global Top Bar

Детальна специфікація: [UI-CMP-001.md](./UI-CMP-001.md).

Вхідні дані:

- active route або active surface code;
- top bar layout mode: `mobile`, `tablet` або `desktop`;
- active game id і label із active business entry point;
- available games для `UI-CMP-002 Game Switcher`;
- game switcher selected/disabled/busy state;
- breadcrumbs для active surface;
- availability основних actions;
- controller connection state;
- active controller profile;
- hints для активної сторінки;
- last disconnected timestamp або recent disconnect flag;
- hint panel state;
- top bar menu state;
- optional summary стану controller connection.

Вихідні події:

- запит перейти за navigable breadcrumb item, зокрема до `UI-PAGE-003 Catalog`;
- запит змінити game із `UI-CMP-002` у breadcrumbs;
- запит змінити game із `UI-CMP-002` у mobile і tablet menu;
- mobile menu запит перейти до Catalog, якщо inline breadcrumb не змонтований;
- dropdown action для lists/builder navigation або відкриття Settings modal;
- запит відкрити, закрити або toggle hint panel;
- запит відкрити або закрити right-pinned dropdown menu;
- запит виконати dropdown menu action.

Межі відповідальності:

- не зберігає settings напряму;
- не змінює `language` або `notation display mode`;
- не виконує route rewrite після game switch самостійно;
- не залишає mobile-hidden breadcrumbs або game switcher як hidden-but-focusable inline controls;
- не читає seeded combo data;
- не вирішує, які combo показувати;
- не читає Browser Gamepad API напряму;
- не виконує controller commands;
- не виконує import/export.

Повний layout, state map, accessibility rules і test scenarios для Top Bar описані в [UI-CMP-001.md](./UI-CMP-001.md). App Shell лишається owner для route, applied settings і controller command routing, а Top Bar тільки рендерить переданий стан і емітить UI/navigation requests.

### Вкладений компонент UI-CMP-005 Controller Hint Strip

Детальна специфікація: [UI-CMP-005.md](./UI-CMP-005.md).

`UI-CMP-005 Controller Hint Strip` є вкладеним компонентом `UI-CMP-001 Global Top Bar`.

Вхідні дані:

- controller connection state;
- active controller profile;
- hints для активної сторінки;
- active surface code;
- last disconnected timestamp або recent disconnect flag;
- hint panel state: `closed` або `open`.

Вихідні події:

- запит відкрити, закрити або toggle hint panel;
- optional запит відкрити controller help, якщо така UI-поверхня буде додана.

Межі відповідальності:

- показує green connected indicator або yellow disconnect grace indicator;
- відкриває hint panel тільки після взаємодії з indicator;
- показує labels і hints для DualSense, Xbox або Standard Gamepad fallback у hint panel;
- оновлюється через props від `UI-CMP-001`;
- не читає Browser Gamepad API напряму;
- не нормалізує buttons або axes;
- не виконує controller commands;
- не змінює маршрутизацію застосунку.

## Мапа станів

### `ready`

App Shell має доступ до вже застосованих settings, active surface визначено, навігаційні controls доступні.

Очікуваний інтерфейс:

- `UI-CMP-001 Global Top Bar` видимий;
- слот активної сторінки показує поточну сторінку;
- App Shell передає `responsiveMode` у Top Bar;
- `UI-CMP-001 Global Top Bar` рендерить `UI-CMP-005 Controller Hint Strip` тільки за наявності controller або active disconnect grace window;
- system messages приховані, якщо немає активних повідомлень.

### `settingsModalOpen`

Current working route лишається active і mounted, а validated query має
`settings=interface` або `settings=backup`.

Очікуваний інтерфейс:

- `UI-PAGE-008 Settings` змонтований у shell overlay layer;
- working page, Top Bar та їхні focus/controller targets inert;
- `mobile`/`tablet` використовують full-screen surface, `desktop` — tall, wide centered dialog;
- modal scope замінює working-page command scope;
- Settings Close, `Escape`, backdrop, browser Back або controller `Back` прибирають
  query, якщо nested/busy backup barrier не має precedence.

### `mobileTopBar`

Owning width менша за `40rem`.

Очікуваний інтерфейс:

- App Shell передає `responsiveMode = mobile`;
- Top Bar не монтує inline breadcrumbs або inline game switcher;
- `UI-CMP-033` menu містить game switcher, full trail, lists, builder і settings;
- visible controller indicator лишається outside `UI-CMP-033`;
- keyboard focus не потрапляє в приховані inline controls.

### `tabletTopBar`

Owning width від `40rem` до `<70rem`.

Очікуваний інтерфейс:

- App Shell передає `responsiveMode = tablet`;
- Top Bar монтує hybrid game switcher і короткий current location;
- `UI-CMP-033` menu містить full trail, secondary navigation і global actions без duplicate game switcher;
- prepared focus graph враховує portrait/landscape composition;
- visible controller indicator лишається outside `UI-CMP-033`.

### `desktopTopBar`

Viewport/device class відповідає `desktop` або ширший.

Очікуваний інтерфейс:

- App Shell передає `responsiveMode = desktop`;
- Top Bar монтує inline breadcrumbs із `UI-CMP-002`;
- `UI-CMP-033` menu містить global actions без duplicate breadcrumbs або duplicate game switcher;
- visible controller indicator розташований поруч із navigation block.

### `firstLaunchBlocked`

У браузері немає completed first-launch marker або обов'язкових settings.

Очікуваний інтерфейс:

- слот активної сторінки показує `UI-PAGE-002 First-Launch Setup`;
- робочі сторінки недоступні для переходу;
- Top Bar може показувати обмежений набір navigation controls;
- skip або close action для first-launch gate не доступні.

### `deepLinkResolved`

Користувач відкрив URL, який вказує на конкретну сторінку або context, і App Shell успішно відновив цей context.

Очікуваний інтерфейс:

- active surface відповідає deep link;
- active settings передані до active surface;
- якщо частина context неповна, active surface показує найближчий валідний selection state.

### `deepLinkAutoConfigured`

Користувач уперше відкрив valid deep link, а в браузері ще немає local settings або first-launch completion marker.

Очікуваний інтерфейс:

- `UI-PAGE-002 First-Launch Setup` не показується;
- App Shell бере installed `gameId` із route prefix;
- App Shell застосовує URL-derived active game;
- App Shell застосовує `notation display mode = FGC`;
- App Shell створює first-launch completion marker або session-only equivalent;
- active surface відповідає target route з URL;
- first-launch setup selectors для `game`, `language` і `notation display mode` не показуються.

### `settingsUnavailable`

Local persistence недоступна або save operation не може бути завершена.

Очікуваний інтерфейс:

- App Shell показує session-only або recoverable warning;
- користувач може продовжити роботу в межах поточної сесії;
- actions, які потребують persistence, мають пояснювати обмеження.

### `controllerConnected`

Controller підключено, profile визначено або застосовано Standard Gamepad fallback.

Очікуваний інтерфейс:

- `UI-CMP-001 Global Top Bar` отримує controller state і рендерить green indicator у `UI-CMP-005 Controller Hint Strip`;
- active surface отримує semantic commands через App Shell;
- App Shell рендерить одну active command ribbon як in-flow third row;
- keyboard і mouse controls лишаються доступними.

### `controllerDisconnected`

Controller відключено або більше не дає stable input.

Очікуваний інтерфейс:

- nested `UI-CMP-005` у `UI-CMP-001` показує yellow disconnect indicator протягом 1 хв або зникає після завершення grace window;
- command ribbon і controller focus ring не монтуються;
- logical focus target зберігається для відновлення після neutral reconnect;
- active surface не скидається;
- keyboard і mouse flow не змінюються.

## Навігація і потік даних

### Блокування першим запуском

1. App-level settings state завантажує local settings або session settings.
2. Якщо required settings відсутні і route не є valid deep link, shell переходить у `firstLaunchBlocked`.
3. Слот активної сторінки показує `UI-PAGE-002 First-Launch Setup`.
4. Після підтвердження setup app-level state отримує початкові settings.
5. Користувач переходить до `UI-PAGE-003 Catalog`.

Valid route-prefixed deep link є винятком із first-launch gate: якщо URL містить installed `gameId`, App Shell не показує `UI-PAGE-002`, застосовує URL-derived active game, ставить `notation display mode = FGC`, створює completion marker і відкриває target surface.

### Відновлення deep link

1. App Shell отримує route або URL context.
2. Shell визначає, чи URL є valid route-prefixed deep link.
3. Shell бере `gameId` із route prefix і знаходить active business entry point.
4. Якщо local settings відсутні, shell застосовує URL-derived active game, `notation display mode = FGC` і створює completion marker.
5. Shell відновлює character, combo id або builder context через active business entry point, якщо вони є в URL.
6. Якщо context валідний, shell відкриває target surface.
7. Якщо context неповний або stale, shell відкриває найближчий recoverable state або `notFound` state і показує system message без показу `UI-PAGE-002`.

### Відкриття і закриття Settings

1. Shell action на current working route додає `settings=interface`, зберігаючи path,
   params та інші validated search values, і створює history entry.
2. App Shell монтує `UI-PAGE-008 Settings` у overlay layer та робить working underlay inert.
3. Tab selection replace-оновлює query між `settings=interface` і `settings=backup`.
4. Close, `Escape`, Settings backdrop або semantic controller `Back` прибирають
   query; browser Back закриває modal через history entry.
5. Nested export/import dialog перехоплює перший dismissal. Busy backup operation
   блокує Settings close до safe state.
6. Після close working route не реконструюється, а focus повертається opener-у або
   prepared safe shell target.

### Перемикання активної UI-поверхні

App Shell може перемикати active surface через:

- global navigation action;
- `UI-CMP-002 Game Switcher` у breadcrumbs;
- controller command;
- deep link;
- completion action іншої сторінки;
- fallback після recoverable error.

При перемиканні active surface App Shell має:

- передати вже застосовані settings новій активній сторінці;
- закрити несумісні overlays;
- передати оновлений controller state і localized hints у `UI-CMP-001`;
- не скидати local user data;
- не виконувати domain action без явного user command.

### Перемикання game через breadcrumbs або mobile menu

1. Користувач вибирає target game у `UI-CMP-002 Game Switcher`.
2. `UI-CMP-001 Global Top Bar` передає `requestSwitchGameFromBreadcrumb` або `requestSwitchGameFromMenu` в App Shell.
3. App Shell перевіряє, що target `gameId` є installed game.
4. App Shell передає target game в app-level settings state, який оновлює лише `lastActiveGameId` і намагається persist-ити його. `defaultGameId` після initial setup не змінюється.
5. App Shell виконує analogous navigation:
   - Catalog -> `/:targetGameId/catalog` із valid last catalog context або fresh Catalog;
   - Lists -> `/:targetGameId/lists`;
   - Builder -> `/:targetGameId/builder` без перенесення game-specific builder path;
   - Combo Detail -> `/:targetGameId/catalog` fallback.
6. App Shell не видаляє named lists, custom combos або local game slices іншої гри.

### Передача застосованих налаштувань

App Shell читає застосовані settings з app-level state і передає їх вниз:

```text
App-level settings state
  -> UI-PAGE-001 App Shell
     -> Слот активної working page
        -> Page-level components, які потребують settings
        -> Display-only components, які потребують settings
     -> Query-controlled UI-PAGE-008 Settings modal
```

Explicit first-launch confirmation або fresh valid deep-link initialization встановлюють initial `defaultGameId` і `lastActiveGameId`. Після цього `UI-CMP-002` tablet/desktop breadcrumb або mobile-menu switch змінює лише `lastActiveGameId`; `defaultGameId` лишається незмінним. Ручна зміна `language` і `notation display mode` відбувається на `UI-PAGE-008 Settings`.

Initial settings можуть з'явитися двома шляхами:

- root first launch через `UI-PAGE-002 First-Launch Setup`;
- valid route-prefixed deep link через URL-derived `gameId` і default `notation display mode = FGC`.

Settings не мають змінювати source of truth seeded або custom combo data. Наприклад, notation display mode впливає на rendering, але не змінює `movePath` або `cachedNotation`.

### Передача команд контролера

1. `@mk-combos/controller-bridge` емітить semantic command.
2. App Shell бере active working-page scope або останній active overlay scope;
   Settings modal є overlay scope над working route.
3. `exclusive` overlay блокує нижчі scopes, крім команд з `passThroughCommandIds`.
4. Команда викликає semantic method active scope без synthetic DOM events.
5. Якщо команда не підтримується в поточному context, вона ігнорується без зміни стану.

Active ribbon model резолвиться з того самого scope. Shell `Menu` додається
останнім лише за append policy; contextual command перемагає під час dedupe.
Blocking/busy scopes suppress-ять shell `Menu`. Lists і Builder placeholders не реєструють
page scope, тому мають лише global `Menu`.

Shell scope обробляє лише `openGlobalMenu`. Start/Options/Menu відкриває menu,
а в уже відкритому menu закриває його. Menu overlay пропускає disabled/current
items; D-Pad рухається у rendered order, Confirm активує, Back закриває.
Mobile nested game menu має власний overlay scope і повертає focus до trigger.

## Доступність і поведінка вводу

- Усі navigation controls мають бути доступні з keyboard.
- Focus order починається з App Shell controls і переходить до active surface.
- `focus-visible` має бути помітним на top bar controls, dialogs, panels і controller indicator.
- У mobile Top Bar inline breadcrumbs і inline game switcher не мають бути hidden-but-focusable.
- У tablet Top Bar inline breadcrumbs і game switcher мають лишатися єдиною navigation copy, а modal drawer тимчасово робить underlying shell inert.
- Controller hints не є єдиним способом зрозуміти доступні actions.
- Command ribbon має localized accessible label, а її glyphs не замінюють accessible names реальних controls.
- Top Bar не має перекривати content навіть коли відкритий nested hint panel.
- Disconnect controller не має забирати focus із keyboard/mouse flow.
- Overlay має повертати focus до trigger або безпечного shell control після закриття.
- Settings modal має trap focus і modal semantics; working page та Top Bar inert,
  доки query open. Visible Close, `Escape`, backdrop, browser Back і controller `Back`
  використовують один dismissal contract із nested/busy precedence.
- Non-blocking system messages не мають перехоплювати focus.
- Fatal error state має мати зрозумілий action для reload або повернення до safe surface.

## Критерії приймання

- App Shell показує активну робочу сторінку після завершення first-launch setup.
- Без завершеного first-launch setup App Shell не дозволяє перейти до catalog, detail, lists або builder, крім valid deep link auto-config.
- App Shell дає action для відкриття `UI-PAGE-008 Settings` над current working route
  через `settings=interface`.
- Застосовані settings поширюються на активну сторінку через App Shell.
- App Shell передає `responsiveMode` у `UI-CMP-001`.
- Mobile Top Bar використовує conditional JSX composition і не залишає hidden-but-focusable inline breadcrumbs/game switcher.
- App Shell обробляє `UI-CMP-002` breadcrumb game switch і виконує analogous navigation.
- App Shell обробляє `UI-CMP-002` mobile menu game switch як equivalent game switch intent.
- App Shell не мутує `language` або `notation display mode` напряму.
- Breadcrumb game switch не видаляє named lists, custom combos або local game slices іншої гри.
- Session-only persistence state показує попередження, але не блокує основний flow.
- Deep link відкриває відповідний surface або recoverable fallback state.
- Valid route-prefixed deep link у fresh browser state не показує `UI-PAGE-002`, застосовує URL-derived `gameId`, `FGC` і completion marker.
- Controller connection оновлює `UI-CMP-001 Global Top Bar`, який рендерить green indicator у `UI-CMP-005 Controller Hint Strip`.
- Connected App Shell рендерить рівно одну in-flow command ribbon без overlap або page clearance.
- Ribbon використовує applied notation display mode; First Launch може передати draft override.
- Shell `Menu` є останньою command після dedupe, якщо active scope не suppress-ить її.
- Redirect/loading branch і active native file picker не рендерять ribbon.
- Controller disconnect показує yellow indicator протягом 1 хв, після чого indicator зникає, якщо reconnect не стався.
- Hint panel відкривається тільки через interaction з indicator.
- Controller disconnect/reconnect не скидає active surface і не ламає keyboard/mouse flow.
- Settings tab switch replace-оновлює `settings=interface|backup`, а dismissal
  прибирає query без зміни working route state.
- `/settings` і `/backup` не мають route або redirect behavior.
- Settings є full-screen у `mobile`/`tablet` і tall, wide centered dialog у `desktop`.
- Nested Settings dialog має dismissal precedence; busy backup operation блокує close.
- App Shell не виконує domain-specific mutation напряму: builder, filters і lists лишаються у відповідних surfaces, а backup logic належить `UI-PAGE-008 Settings`.

## Тестові сценарії

- Fresh browser state відкриває root URL і бачить `UI-PAGE-002 First-Launch Setup` у Shell Outlet.
- Після підтвердження first-launch setup App Shell відкриває `UI-PAGE-003 Catalog`.
- Navigation action з Top Bar на `/mkxl/catalog` відкриває
  `/mkxl/catalog?settings=interface` і лишає Catalog mounted/inert.
- `tablet` і `desktop` Top Bar монтують однакові inline breadcrumbs із `UI-CMP-002`.
- Mobile Top Bar не монтує inline breadcrumbs або inline `UI-CMP-002`.
- Mobile burger menu містить `UI-CMP-002`, Catalog, Named Lists, Builder і Settings.
- Tablet drawer містить global actions без duplicate inline breadcrumbs або `UI-CMP-002`.
- Game switcher у breadcrumbs на `/mkxl/catalog` із вибором `MK1` відкриває `/mk1/catalog`.
- Game switcher у mobile menu на `/mkxl/catalog` із вибором `MK1` відкриває `/mk1/catalog`.
- Game switcher у breadcrumbs на `/mkxl/lists` із вибором `MK1` відкриває `/mk1/lists`.
- Game switcher у breadcrumbs на combo detail fallback-ить до target game Catalog.
- Settings tab switch replace-оновлює current route до `settings=backup`, не додаючи
  окремий history entry для tab.
- Close, `Escape`, backdrop, browser Back і controller `Back` прибирають Settings query
  та відновлюють opener focus.
- Nested Import Preview отримує перший Back; busy backup operation не дозволяє
  закрити Settings.
- `/settings` і `/backup` не відкривають Settings і не redirect-ять.
- Після зміни language у `UI-PAGE-008 Settings` App Shell отримує оновлений app-level state і передає language активній сторінці.
- Після зміни notation display mode у `UI-PAGE-008 Settings` App Shell не змінює `movePath` або seeded data.
- Deep link на combo detail відкриває `UI-PAGE-004 Combo Detail`, якщо context валідний.
- Deep link на combo detail у fresh browser state обходить `UI-PAGE-002` і застосовує URL-derived `gameId` та `FGC`.
- Deep link з неповним context відкриває recoverable selection state і показує system message.
- Відкритий overlay перехоплює `back`, якщо overlay може бути закритий.
- Controller connect оновлює `UI-CMP-001`, який показує green indicator у `UI-CMP-005`.
- Connected Catalog, Detail і Settings modal показують одну shell-owned contextual ribbon; Lists і Builder — лише `Menu`.
- Blocking Settings operation suppress-ить `Menu` і не показує порожню ribbon.
- Controller disconnect показує yellow indicator у `UI-CMP-005` протягом 1 хв без скидання active surface.
- Disconnect приховує ribbon/controller ring, а reconnect після neutral відновлює актуальний context.
- Click, tap, `Enter` або `Space` на indicator відкриває hint panel.
- `Escape` закриває hint panel і повертає focus на indicator.
- Keyboard focus лишається видимим під час переходу між top bar, активною UI-поверхнею і накладним елементом.

## Відкриті уточнення

- Route paths для робочих surfaces використовують generic `/:gameId/...` форму, описану в [ARCHITECTURE.md](../ARCHITECTURE.md).
- Візуальна щільність Top Bar із вкладеним Controller Hint Strip і `UI-CMP-033` має бути перевірена на `desktop` і mobile і tablet layouts.
- Custom controller button remapping не входить у перший реліз, якщо це не буде додано окремим UX сценарієм.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
