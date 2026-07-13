# UI-CMP-002: Game Switcher

## Метадані

- Код: `UI-CMP-002`
- Назва: `Game Switcher`
- Тип: `component / global game selector`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власники:
  - [`UI-PAGE-001 App Shell`](./UI-PAGE-001.md) через [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md) у `UI-CMP-001`
  - [`UI-PAGE-002 First-Launch Setup`](./UI-PAGE-002.md) через `UI-CMP-006 First-Launch Setup Form`
- Батьківські компоненти: [`UI-CMP-001 Global Top Bar`](./UI-CMP-001.md), [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md), `UI-CMP-006 First-Launch Setup Form`
- Пов'язані UX сценарії: `US-001`, `US-002`, `US-023`, `US-024`

## Призначення

`UI-CMP-002 Game Switcher` дає користувачу вибрати installed game.

Компонент має два context-и використання:

- `firstLaunch`: pending initial game choice у `UI-PAGE-002 First-Launch Setup`;
- `breadcrumbs`: перший interactive crumb у global breadcrumbs після завершення first launch або valid deep-link auto-config.

У `breadcrumbs` context switcher є primary global спосіб перейти між installed games. Він замінює standalone active game label у Top Bar і не дублюється у `UI-PAGE-008 Settings`.

`UI-CMP-002` не знає game-specific правил. Він показує installed games, отримані від parent flow, і емітить selection intent. Route prefix лишається source of truth для active game на deep links.

## Володіння

`UI-PAGE-001 App Shell` володіє active `gameId`, route, active business entry point, navigation strategy, last active/default game persistence і recoverable fallback behavior.

`UI-CMP-001 Global Top Bar` розміщує [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md). Breadcrumbs рендерить `UI-CMP-002` як перший game crumb і передає selection intent в App Shell.

`UI-PAGE-002 First-Launch Setup` використовує `UI-CMP-002` тільки для pending initial game value. Completion marker, route redirect і persistence створюються після explicit confirmation.

`UI-CMP-002` відповідає тільки за:

- показ current або pending selected game;
- показ available installed games;
- selected, focused, disabled і invalid states;
- keyboard/pointer/controller-friendly single-selection behavior;
- emission selection intent у parent flow.

Компонент не імпортує `mkxl/*` або `mk1/*` напряму і не хардкодить `MKXL`/`MK1` як closed union. `GameId` лишається string value з installed game registry.

## Game Option Contract

Game options приходять із `apps/web/src/game-business/installed-games.ts` через App Shell або First Launch flow.

```ts
type GameSwitcherContext = "firstLaunch" | "breadcrumbs";

type GameSwitcherOption = {
  gameId: string;
  label: string;
  shortLabel?: string;
  description?: string;
  status: "available" | "disabledUnavailable";
  disabledReason?: string;
};
```

`label` має бути readable label active business entry point, наприклад `MKXL` або `MK1`. `gameId` є stable route/persistence id і не залежить від localized label.

## Анатомія

Розміщення є single-select control, який змінює зовнішню оболонку залежно від parent context: inline crumb у breadcrumbs або form row у first-launch setup.

```jsx
<GameSwitcher ui="UI-CMP-002">
  <SingleSelectControl slot="parent">
    <Stack name="SingleSelectLayout">
      <CurrentGameTrigger />

      <Show when={isOpen}>
        <AvailableGameOptions />
      </Show>

      <Show when={hasValidationStatusMessage}>
        <ValidationStatusMessage />
      </Show>
    </Stack>
  </SingleSelectControl>
</GameSwitcher>
```

Правила розміщення:

- У `breadcrumbs` context `SingleSelectControl` займає перший crumb і стоїть лівіше за `Catalog`/current trail items.
- У `firstLaunch` context `SingleSelectControl` стоїть над language і display mode controls усередині `UI-CMP-006`.
- Options list є controlled surface від parent model; selection state не зберігається всередині switcher.

### Breadcrumbs context

У `breadcrumbs` context компонент рендериться як перший breadcrumb item:

```jsx
<Breadcrumbs ui="UI-CMP-032">
  <Group name="BreadcrumbTrail">
    <GameSwitcher ui="UI-CMP-002" />
    <CatalogCrumb />
    <CharacterCrumb />
    <VariationOrKameoCrumb />
    <CurrentSurfaceCrumb />
  </Group>
</Breadcrumbs>
```

Switcher має виглядати як частина breadcrumb trail, але мати зрозумілий selected-game control affordance. Він не має змішуватися з `Catalog` crumb: game switch змінює route prefix, а `Catalog` crumb навігує в межах active game.

### First-launch context

У `firstLaunch` context компонент рендериться в `UI-CMP-006 First-Launch Setup Form` поруч із language і display mode controls.

Selection у цьому context не запускає route navigation і не завершує setup. Вона тільки оновлює pending initial game value.

## Вхідні дані

- `context`: `firstLaunch` або `breadcrumbs`.
- `selectedGameId`: pending або active installed game id.
- `availableGames`: список `GameSwitcherOption`.
- `disabled`: boolean для тимчасового блокування selection.
- `busy`: boolean, якщо parent застосовує або зберігає selection.
- `invalidSelectedGame`: selected id відсутній в installed games або більше недоступний.
- `validationMessage`: optional readable message для invalid або unavailable state.
- `focusedGameId`: optional focus target для keyboard/controller navigation.
- `activeLanguage`: `EN` або `UA`.

## Вихідні події

- `requestSelectGame`: вибрати available game option.
- `requestOpenGameMenu`: відкрити options surface, якщо implementation використовує menu/listbox.
- `requestCloseGameMenu`: закрити options surface.
- `requestFocusGameOption`: змінити focused option без selection.

Parent flow інтерпретує `requestSelectGame` за context:

- у `firstLaunch` оновлює pending setup value;
- у `breadcrumbs` запускає App Shell game switch navigation.

## Межі відповідальності

Компонент відповідає за:

- single-selection UI для installed games;
- readable current game;
- disabled unavailable options із поясненням;
- invalid selected state без auto-selection іншої гри;
- keyboard, pointer і semantic controller selection;
- accessible labels, selected state і busy/disabled state.

Компонент не відповідає за:

- route redirect або route replacement;
- persistence last active/default game;
- first-launch completion marker;
- browser locale fallback;
- вибір character, variation або kameo;
- відновлення last catalog context;
- перенос combo detail або builder state між games;
- validation game-owned local state;
- видалення named lists, custom combos або game slices;
- import/export backup;
- читання Browser Gamepad API напряму.

## Мапа станів

### `loadingOptions`

Installed games ще готуються.

Очікуваний UI:

- control займає стабільне місце;
- selection недоступний;
- loading/busy state оголошується assistive technologies.

### `ready`

Options готові, selected game валідний.

Очікуваний UI:

- selected game readable;
- available options reachable;
- current option позначений як selected/current.

### `firstLaunchPending`

Компонент рендериться в setup form.

Очікуваний UI:

- selection оновлює pending initial game;
- confirmation action залишається owner для completion;
- route не змінюється до explicit confirmation.

### `breadcrumbCurrent`

Компонент рендериться як перший breadcrumb item для active game.

Очікуваний UI:

- current game показаний перед `Catalog` або surface crumbs;
- option selection емітить game-switch intent;
- control лишається compact і не перекриває breadcrumbs або right-pinned menu.

### `switchingGame`

Parent flow застосовує selected target game.

Очікуваний UI:

- control може показати busy/pressed state;
- repeated selection тимчасово disabled;
- focus не губиться, а після navigation потрапляє на safe top-bar або page heading target.

### `optionUnavailable`

Game option існує в descriptor list, але тимчасово недоступний.

Очікуваний UI:

- option видимий, якщо parent передав його для пояснення;
- option не selectable;
- disabled reason доступний як visible status, tooltip або accessible description;
- color не є єдиним сигналом.

### `invalidSelectedGame`

Selected game id не знайдений серед installed games.

Очікуваний UI:

- показано readable validation message;
- component не auto-select-ить іншу game без parent decision;
- parent може fallback-ити до first installed game, setup required або recoverable error state.

## UI Behavior

### First Launch Selection

1. Користувач вибирає game у setup form.
2. `UI-CMP-002` емітить `requestSelectGame`.
3. `UI-PAGE-002` оновлює pending initial game value.
4. Completion marker і route redirect не створюються до confirmation.
5. Після confirmation App Shell відкриває `/:gameId/catalog` для selected game.

### Breadcrumb Game Switch

У `breadcrumbs` context `UI-CMP-002` є global game-switch affordance.

1. Користувач відкриває game switcher або фокусує target option.
2. Користувач вибирає installed game.
3. `UI-CMP-002` емітить `requestSelectGame(targetGameId)`.
4. `UI-CMP-001` передає intent в `UI-PAGE-001 App Shell`.
5. App Shell передає target game в app-level settings state, який оновлює active/default або last active game і намагається persist-ити його.
6. App Shell виконує analogous navigation або fallback.

Navigation strategy:

| Current surface | Target behavior |
| --- | --- |
| `UI-PAGE-003 Catalog` | Відкрити `/:targetGameId/catalog` із target-game last catalog context, якщо він валідний; інакше fresh Catalog. |
| `UI-PAGE-005 Named Lists` | Відкрити `/:targetGameId/lists`. |
| `UI-PAGE-006 Custom Combo Builder` | Відкрити `/:targetGameId/builder` без перенесення game-specific builder path. |
| `UI-PAGE-004 Combo Detail` | Fallback до `/:targetGameId/catalog`, бо combo ids/context не cross-game. |
| `UI-PAGE-008 Settings` | Лишитися на `/settings`, але оновити active/default або last active game value. |

Game switch не видаляє local user data іншої гри.

### Deep Links

Valid route-prefixed deep link перемагає saved/default game.

Якщо fresh browser відкриває `/mk1/catalog`, App Shell бере `mk1` із route prefix, не показує setup і передає breadcrumbs active game `MK1`. `UI-CMP-002` лише рендерить resolved state.

## Доступність і поведінка вводу

- Control має visible label або accessible name, який пояснює, що це game switcher.
- Current game має readable selected/current state.
- Options мають accessible names із game label.
- Disabled options мають readable disabled reason.
- `focus-visible` має бути помітний у setup form і breadcrumbs.
- `Enter`, `Space`, click або tap на selected/available option виконують expected selection pattern.
- `Escape` закриває menu/listbox surface і повертає focus до trigger, якщо implementation використовує popup.
- Breadcrumbs context має не ламати navigation semantics `UI-CMP-032`.
- Busy state під час game switch має бути оголошений assistive technologies.
- Long game labels мають truncate або wrap-итися без overlap із breadcrumbs і right-pinned dropdown menu.

## Критерії приймання

- `UI-CMP-002` має окрему повну специфікацію.
- `UI.md` посилається на `ui/UI-CMP-002.md`.
- Після first launch `UI-CMP-002` рендериться як перший item у [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md).
- `UI-PAGE-002` лишає `UI-CMP-002` у setup form як pending initial game choice.
- `UI-PAGE-008 Settings` не рендерить page-owned `UI-CMP-002 Game Switcher`.
- Game options приходять із installed games і не є hardcoded closed union.
- Route prefix перемагає saved/default game для valid deep links.
- Breadcrumb game switch емітить intent в App Shell і не виконує routing самостійно.
- Catalog game switch відкриває target game Catalog.
- Lists game switch відкриває target game Lists.
- Builder game switch відкриває target game Builder без перенесення path.
- Detail game switch fallback-ить до target game Catalog.
- Settings game switch лишає route `/settings` і оновлює active/default або last active game.
- Game switch не видаляє named lists, custom combos або local game slices іншої гри.

## Тестові сценарії

- Fresh first launch показує `UI-CMP-002` у setup form.
- Вибір `MK1` у setup і confirmation відкриває `/mk1/catalog`.
- Breadcrumbs на `/mkxl/catalog` показують current game `MKXL` як перший interactive crumb.
- Вибір `MK1` із breadcrumbs на `/mkxl/catalog` відкриває `/mk1/catalog`.
- Вибір `MK1` із breadcrumbs на `/mkxl/lists` відкриває `/mk1/lists` і не показує `mkxl` lists.
- Вибір `MK1` із breadcrumbs на `/mkxl/builder` відкриває `/mk1/builder` без перенесення current builder path.
- Вибір `MK1` із breadcrumbs на `/mkxl/combos/seeded/...` відкриває `/mk1/catalog`.
- Вибір `MK1` із breadcrumbs на `/settings` лишає `/settings` і оновлює active/default game state.
- Direct link `/mk1/catalog` у fresh browser bypass-ить setup і breadcrumbs показують `MK1`.
- Disabled game option не емітить selection і має readable disabled reason.
- Invalid selected game показує recoverable message і не auto-select-ить іншу game без parent decision.

## Відкриті уточнення

- Exact visual primitive для breadcrumbs context може бути menu button, compact listbox або equivalent single-select control.
- Exact persistence policy для last active/default game після breadcrumb switch належить App Shell implementation.
- Повний standalone contract [`UI-CMP-032 Breadcrumbs`](./UI-CMP-032.md) описаний окремо; цей документ фіксує тільки Game Switcher contract усередині breadcrumbs.

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
