# UI-CMP-004: Display Mode Switcher

## Метадані

- Код: `UI-CMP-004`
- Назва: `Display Mode Switcher`
- Тип: `component / reusable notation display mode selector`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власники:
  - `packages/ui` для reusable segmented switcher, semantic recipes, states, Storybook stories і visual coverage
  - `apps/web` для selected display mode, validation, Settings save/apply behavior, first-launch confirmation, persistence і localized copy source
- Батьківські сторінки: [`UI-PAGE-002 First-Launch Setup`](./UI-PAGE-002.md), [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Батьківські компоненти: `UI-CMP-006 First-Launch Setup Form`, Settings form
- Пов'язані компоненти: [`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md), [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md)
- Пов'язані UX сценарії: `US-001`, `US-009`, `US-023`, `US-024`

## Призначення

`UI-CMP-004 Display Mode Switcher` дає користувачу вибрати спосіб відображення combo notation.

Компонент має два context-и використання:

- `firstLaunch`: pending initial notation display mode у `UI-PAGE-002 First-Launch Setup`;
- `settings`: draft notation display mode у `UI-PAGE-008 Settings`.

У v1 дозволені display mode values:

- `FGC`;
- `PlayStation`;
- `Xbox`.

Компонент є компактним segmented single-select control, а не dropdown, popup або menu. Він має виглядати як polished desktop control: стабільна висота, subtle border, чіткий selected segment, quiet hover/active feedback, видимий focus і readable mode labels.

`UI-CMP-004` не містить notation legend. Таблиця пояснення позначок винесена в окремий компонент [`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md), який First Launch і Settings можуть рендерити поруч зі switcher-ом як companion reference.

`UI-CMP-004` не змінює selected game, language, route, combo path, canonical FGC notation, seeded data, custom data, `cachedNotation` або backup state. Він тільки показує передані options і емітить display mode selection intent у parent flow.

## Архітектурний контекст

`packages/ui` володіє reusable visual component для Display Mode Switcher.

`packages/ui` відповідає за:

- segmented control anatomy і interaction states;
- semantic `tailwind-variants` recipes;
- stable geometry, density, focus-visible, selected/current і invalid styling;
- icon або indicator facade usage, якщо selected segment має check/current mark;
- Storybook stories, visual coverage і automated accessibility coverage для public states;
- light/dark, standard/increased contrast і reduced-motion behavior.

`apps/web` володіє app-level notation display mode state.

`apps/web` відповідає за:

- current або pending selected display mode;
- validation selected display mode проти supported app display modes;
- Settings draft state, apply/save behavior і persistence;
- first-launch confirmation і completion marker;
- localized copy source, labels, descriptions і validation messages;
- поширення applied display mode в App Shell, active pages і [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md).

`UI-CMP-004` не містить власного notation mapping registry і не вирішує SVG icon rendering. Labels для options приходять із parent/localization layer, а notation icon examples належать [`UI-CMP-037`](./UI-CMP-037.md).

## Display Mode Option Contract

```ts
type DisplayModeSwitcherContext = "firstLaunch" | "settings";

type NotationDisplayMode = "FGC" | "PlayStation" | "Xbox";

type DisplayModeSwitcherOption = {
  mode: NotationDisplayMode;
  label: string;
  shortLabel?: string;
  description?: string;
  status: "available" | "disabledUnavailable";
  disabledReason?: string;
};
```

`mode` є stable settings value. `label`, `shortLabel`, `description` і `disabledReason` є localized presentation text, який передає parent flow.

Recommended option labels:

- `FGC` із `shortLabel = "FGC"`;
- `PlayStation` із `shortLabel = "PS"`;
- `Xbox` із `shortLabel = "XB"`.

Візуальний компонент не має будувати readable label із enum value самостійно. Якщо parent передає інші localized labels, control рендерить їх без зміни selection semantics.

## Анатомія

Розміщення є form-control row: label стоїть перед display-mode segmented control, а validation/status region завжди нижче control group.

```text
UI-CMP-004 Display Mode Switcher
  └─ (inside First Launch або Settings form) Root field/group
     ├─ (top/left) Visible label або accessible name
     ├─ (below/right) Segmented display mode control
     │  ├─ (left/top) Display mode segment: FGC
     │  ├─ (right/below) Display mode segment: PlayStation
     │  └─ (right/below) Display mode segment: Xbox
     └─ (below control, conditional) Optional validation або status message
```

Правила розміщення:

- На wide form layouts label і segmented control можуть стояти поруч; на `compact` label і control stack-яться згори вниз.
- Segments читаються в переданому parent order зліва направо або згори вниз після compact wrap.
- Status message не є source of truth; він рендерить page-prepared validation/status input.

### Root field/group

Root group є form-control region усередині First Launch або Settings form.

Вимоги:

- не бути modal, dropdown або standalone page surface;
- займати стабільне місце між clean, hover, focus, selected, invalid, disabled і busy states;
- мати visible label або accessible name;
- мати programmatic relationship із validation/status message, якщо message передано;
- не змінювати surrounding form layout при selected state.

### Segmented display mode control

Segmented control містить рівно display mode options, які parent передав як available.

Вимоги:

- default v1 options: `FGC`, `PlayStation`, `Xbox`;
- layout: compact horizontal segmented selector на wide layouts;
- narrow layout може wrap-ити segments або перейти в vertical segmented stack, якщо labels і zoom не вміщаються;
- кожен segment показує readable `label` і короткий code, якщо `shortLabel` передано;
- selected segment має clear current indicator: accent fill, check/current mark або equivalent selected treatment;
- hover і active feedback не змінюють розміри segment-а;
- unavailable option лишається readable, але не selectable.

## Contexts

### First-launch context

У `firstLaunch` context `UI-CMP-004` рендериться всередині `UI-CMP-006 First-Launch Setup Form`.

Selection у цьому context:

- оновлює pending initial notation display mode;
- не створює first-launch completion marker;
- не запускає route navigation;
- не persist-ить settings самостійно;
- не перераховує notation;
- не застосовує final app display mode до explicit confirmation parent flow, якщо parent не підтримує live preview.

[`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md) може рендеритися поруч зі switcher-ом у form layout як read-only companion reference.

### Settings context

У `settings` context `UI-CMP-004` рендериться всередині Settings form.

Selection у цьому context:

- оновлює draft notation display mode;
- переводить Settings form у `editing`, якщо value відрізняється від applied display mode;
- не виконує page-level save/apply action;
- не пише localStorage напряму;
- не змінює language або active game;
- не мутує notation source data.

[`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md) може рендеритися поруч зі switcher-ом у Settings як read-only companion reference.

## Вхідні дані

- `context`: `firstLaunch` або `settings`.
- `selectedDisplayMode`: active або pending display mode value.
- `availableDisplayModes`: список `DisplayModeSwitcherOption`.
- `disabled`: boolean для тимчасового блокування selection.
- `busy`: boolean, якщо parent застосовує або зберігає settings.
- `invalidSelectedDisplayMode`: selected mode відсутній в available options або не підтримується app-level settings.
- `validationMessage`: optional readable message для invalid або unavailable state.
- `focusedDisplayMode`: optional focus target для keyboard/controller navigation.
- `label`: visible localized label для control group, якщо page не надає label зовні.
- `ariaLabel`: accessible name fallback, якщо visible label надається через surrounding form.

## Вихідні події

- `requestSelectDisplayMode`: вибрати available display mode option.
- `requestFocusDisplayModeOption`: змінити focused option без selection, якщо implementation expose-ить focus state parent-у.

Parent flow інтерпретує `requestSelectDisplayMode` за context:

- у `firstLaunch` оновлює pending setup value;
- у `settings` оновлює draft settings value і залишає save/apply behavior на Settings page.

## Межі відповідальності

Компонент відповідає за:

- reusable segmented display mode selector UI у `packages/ui`;
- readable display mode labels і short codes;
- selected/current, focused, hover, active, disabled, busy, unavailable і invalid states;
- stable sizing без layout shift;
- keyboard і pointer selection behavior;
- accessible group semantics, names, selected state, disabled state і validation relationship;
- Storybook/visual/a11y coverage для public states.

Компонент не відповідає за:

- rendering notation legend або SVG notation examples;
- persistence у localStorage або session-only storage;
- first-launch completion marker;
- Settings save/apply lifecycle;
- route navigation;
- active/default game;
- language;
- parsing, recalculation або mutation notation;
- зміну `movePath`, canonical FGC notation, seeded data, custom combos або `cachedNotation`;
- backup import/export;
- translation registry або loading localized copy;
- читання Browser Gamepad API напряму.

## Мапа станів

### `ready`

Options готові, selected display mode валідний.

Очікуваний UI:

- selected segment чітко позначений;
- усі available segments reachable;
- save/apply state не показується всередині component, якщо parent не передав `busy`.

### `firstLaunchPending`

Компонент рендериться в setup form.

Очікуваний UI:

- preselected display mode може бути підтверджений разом із іншими setup values;
- change оновлює pending initial display mode;
- confirmation action лишається owner для completion.

### `settingsClean`

Компонент рендериться у Settings form і selected value дорівнює applied display mode.

Очікуваний UI:

- selected display mode readable;
- control enabled, якщо Settings не saving;
- validation/status message прихований, якщо немає проблеми.

### `settingsEditing`

Користувач вибрав display mode, який відрізняється від applied value.

Очікуваний UI:

- draft selected segment позначений як current UI selection;
- page-level apply/save action стає owner для final application;
- component не показує власний save button.

### `saving`

Parent flow застосовує або persist-ить settings.

Очікуваний UI:

- selection тимчасово disabled або busy згідно з parent input;
- repeated activation недоступна;
- busy state оголошується assistive technologies через group або surrounding form.

### `optionUnavailable`

Display mode option існує в descriptor list, але тимчасово недоступний.

Очікуваний UI:

- option видима, якщо parent передав її для пояснення;
- option не selectable;
- disabled reason доступний visible text, tooltip або accessible description;
- color не є єдиним сигналом.

### `invalidSelectedDisplayMode`

Selected display mode не знайдений серед available display modes або більше не підтримується.

Очікуваний UI:

- control показує readable validation message;
- component не auto-select-ить інший display mode без parent decision;
- focus може перейти на first safe available option тільки за parent або user action.

## UI Behavior

### First Launch Selection

1. Користувач фокусує Display Mode Switcher у setup form.
2. Користувач вибирає `FGC`, `PlayStation` або `Xbox`.
3. `UI-CMP-004` емітить `requestSelectDisplayMode(targetMode)`.
4. `UI-PAGE-002` оновлює pending initial notation display mode.
5. First-launch confirmation застосовує selected display mode разом із game і language.

### Settings Draft Selection

1. Користувач відкриває `UI-PAGE-008 Settings`.
2. Settings передає applied notation display mode як `selectedDisplayMode`.
3. Користувач вибирає інший display mode.
4. `UI-CMP-004` емітить `requestSelectDisplayMode(targetMode)`.
5. Settings оновлює draft value і переходить у `editing`.
6. Page-level apply/save action застосовує і persist-ить selected display mode.

### No Top Bar Rendering

`UI-CMP-004` не монтується в `UI-CMP-001 Global Top Bar` або `UI-CMP-033 Top Bar Dropdown Menu`.

Top Bar може відкрити Settings, але inline display mode controls лишаються Settings-owned controls.

## Visual Design Contract

Display Mode Switcher має відчуватися як compact desktop control, який легко scan-ити у формі.

Rules:

- використовувати segmented selector, не dropdown;
- утримувати stable min-height для `small` і `medium` density;
- використовувати subtle outer border і inner selected treatment замість heavy card chrome;
- selected segment використовує semantic accent/selection tokens і лишається readable у dark mode;
- label і short code мають не overlap-итися на wide, compact, zoom і long-label scenarios;
- icon/current mark має резервоване місце або не змінювати width при selection;
- hover, active, focus-visible, disabled, invalid і busy states не змінюють layout dimensions;
- material/glass не використовується, бо control не є owning popup або floating surface.

Suggested anatomy:

```text
[ FGC ] [ PlayStation  PS ] [ Xbox  XB ]
```

Selected segment може мати check/current indicator, але indicator має бути secondary to readable text and semantic selected state.

## Recipe і variant requirements

Implementation має використовувати semantic recipes у `packages/ui`.

Recommended shared recipes:

- `control` для clickable segments;
- `field` або segmented-control wrapper для root bordered group;
- `indicator` для selected/current mark;
- `separator` для subtle segment division, якщо потрібно.

Allowed semantic axes:

- `context`: `firstLaunch` або `settings`;
- `density`: `small` або `medium`;
- `state`: `ready`, `busy`, `disabled`, `invalid`;
- `selection`: `selected` або `none`;
- `tone`: `neutral` або `destructive` для invalid relationship;
- `orientation`: `horizontal` або `vertical`;
- `emphasis`: `normal` або `subtle`;
- `shape`: `fixed`.

Forbidden primary public axes:

- raw color;
- arbitrary radius;
- arbitrary shadow;
- arbitrary blur;
- raw spacing;
- border width;
- direct `className` як primary styling API.

`className` може існувати як integration escape hatch, але visual contract має задаватися semantic variants.

## Доступність і поведінка вводу

- Control має native radio group або equivalent Base UI radio/toggle-group semantics.
- Group має visible label або accessible name.
- Кожен segment має accessible name із display mode label і short code, якщо code видимий.
- Selected segment має semantic checked/selected state.
- Disabled option використовує native disabled або intentional `aria-disabled` behavior і не trap-ить keyboard.
- Invalid state має `aria-invalid` або equivalent relationship на group/field і `aria-describedby` для validation message.
- `Tab` переводить focus до control group або selected segment згідно з chosen primitive.
- `ArrowLeft`/`ArrowRight` або `ArrowUp`/`ArrowDown` переміщують focus між options.
- `Enter` і `Space` вибирають focused available option.
- `focus-visible` має бути помітний у light, dark, standard contrast і increased contrast.
- Busy state під час saving має бути оголошений assistive technologies через component або surrounding form.
- Reduced motion має прибирати або скорочувати selected indicator transitions.
- Color не є єдиним сигналом selected, invalid або unavailable state.

## Критерії приймання

- `UI-CMP-004` має окрему повну специфікацію.
- `UI.md` посилається на `ui/UI-CMP-004.md`.
- `UI-CMP-004` рендериться у `UI-PAGE-002 First-Launch Setup` як pending initial display mode control.
- `UI-CMP-004` рендериться у `UI-PAGE-008 Settings` як draft/apply display mode control.
- Visual component, recipes, states, indicators, Storybook stories і visual coverage належать `packages/ui`.
- App state, validation, Settings save/apply, first-launch confirmation, persistence і localized copy source належать `apps/web`.
- Control є compact segmented selector, а не dropdown або menu.
- Supported display modes у v1: `FGC`, `PlayStation`, `Xbox`.
- Labels приходять від parent/localization layer, а не хардкодяться visual primitive-ом.
- Selection у first launch не завершує setup без explicit confirmation.
- Selection у Settings не persist-иться без page-level apply/save behavior.
- Display mode change не змінює selected game, language, route, combo path, canonical FGC notation, seeded data, custom data, `cachedNotation` або backup state.
- Top Bar і Top Bar Dropdown Menu не рендерять Display Mode Switcher.
- Companion notation examples належать [`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md).

## Storybook і visual coverage

Storybook у `packages/ui` має містити сценарії:

- `Default`;
- `SelectedFGC`;
- `SelectedPlayStation`;
- `SelectedXbox`;
- `FirstLaunch`;
- `SettingsClean`;
- `SettingsEditing`;
- `SavingDisabled`;
- `InvalidSelectedDisplayMode`;
- `UnavailableOption`;
- `FocusVisible`;
- `KeyboardOnly`;
- `LongLabels`;
- `ReducedMotion`;
- `Density`;
- `VerticalCompact`.

Visual tests мають покривати:

- light/dark;
- standard/increased contrast;
- `small` і `medium` density;
- selected `FGC`, `PlayStation` і `Xbox`;
- disabled і busy states;
- invalid state із message;
- unavailable option із disabled reason;
- focus-visible;
- long localized labels;
- compact/narrow layout;
- browser zoom/text resizing stress;
- no layout shift between selected states.

Automated accessibility checks мають перевірити:

- group accessible name;
- option accessible names;
- selected/checked state;
- keyboard operation;
- disabled unavailable option behavior;
- validation relationship;
- busy announcement або surrounding form relationship;
- no hidden focusable duplicate controls.

## Тестові сценарії

- Fresh first launch показує `UI-CMP-004` у setup form із preselected default `FGC`.
- Вибір `Xbox` у setup оновлює pending display mode і не створює completion marker без confirmation.
- Confirmation setup із `Xbox` застосовує app display mode і відкриває selected game Catalog.
- Settings показує current applied display mode.
- Вибір `PlayStation` у Settings переводить form у `editing`.
- Save success застосовує `PlayStation` до notation rendering.
- Save error не стирає selected draft display mode і показує recoverable message.
- localStorage unavailable дозволяє session-only display mode application через page-level flow.
- Invalid selected display mode показує validation message і не auto-select-ить fallback без parent decision.
- Disabled unavailable display mode не емітить `requestSelectDisplayMode`.
- Top Bar не містить Display Mode Switcher у wide layout.
- Top Bar Dropdown Menu не містить Display Mode Switcher у compact layout.
- Long `PlayStation` label не overlap-иться з code або selected indicator.

## Відкриті уточнення

- Exact visual primitive може бути project-owned segmented control або Base UI radio/toggle-group wrapper у `packages/ui`.
- Exact icon/current indicator module залежить від icon facade, який реалізує `packages/ui`.
- Exact mapping dictionary `FGC -> PlayStation/Xbox` належить shared UI/data layer і має збігатися між [`UI-CMP-037`](./UI-CMP-037.md) та [`UI-CMP-015`](./UI-CMP-015.md).
