# UI-CMP-003: Language Switcher

## Метадані

- Код: `UI-CMP-003`
- Назва: `Language Switcher`
- Тип: `component / reusable language selector`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власники:
  - `packages/ui` для reusable visual component, semantic recipes, states, icon/indicator usage, Storybook stories і visual coverage
  - `apps/web` для selected language, browser-locale defaulting, validation, Settings save/apply behavior, first-launch confirmation, persistence і localized copy source
- Батьківські сторінки: [`UI-PAGE-002 First-Launch Setup`](./UI-PAGE-002.md), [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Батьківські компоненти: `UI-CMP-006 First-Launch Setup Form`, Settings form
- Пов'язані UX сценарії: `US-001`, `US-008`, `US-023`, `US-024`

## Призначення

`UI-CMP-003 Language Switcher` дає користувачу вибрати мову інтерфейсу і localized content.

Компонент має два context-и використання:

- `firstLaunch`: pending initial language choice у `UI-PAGE-002 First-Launch Setup`;
- `settings`: draft language choice у `UI-PAGE-008 Settings`.

У v1 дозволені language values:

- `EN`;
- `UA`.

Компонент є компактним segmented single-select control, а не dropdown, popup або menu. Він має виглядати як polished desktop control: стабільна висота, subtle border, чіткий selected segment, quiet hover/active feedback, видимий focus і readable language labels.

`UI-CMP-003` не змінює selected game, notation display mode, route, combo path, seeded data, custom data або backup state. Він тільки показує передані options і емітить language selection intent у parent flow.

## Архітектурний контекст

`packages/ui` володіє reusable visual component для Language Switcher.

`packages/ui` відповідає за:

- segmented control anatomy і interaction states;
- semantic `tailwind-variants` recipes;
- stable geometry, density, focus-visible, selected/current і invalid styling;
- icon або indicator facade usage, якщо selected segment має check/current mark;
- Storybook stories, visual coverage і automated accessibility coverage для public states;
- light/dark, standard/increased contrast і reduced-motion behavior.

`apps/web` володіє app-level language state.

`apps/web` відповідає за:

- current або pending selected language;
- browser-locale defaulting для first launch;
- validation selected language проти supported app languages;
- Settings draft state, apply/save behavior і persistence;
- first-launch confirmation і completion marker;
- localized copy source, labels, descriptions і validation messages;
- поширення applied language в App Shell, active pages і game business-provided localized content.

`UI-CMP-003` не містить власного translation registry і не вирішує browser locale fallback. Labels для options приходять із parent/localization layer, щоб visual primitive у `packages/ui` не хардкодив app copy.

## Language Option Contract

```ts
type LanguageSwitcherContext = "firstLaunch" | "settings";

type LanguageCode = "EN" | "UA";

type LanguageSwitcherOption = {
  language: LanguageCode;
  label: string;
  shortLabel?: string;
  description?: string;
  status: "available" | "disabledUnavailable";
  disabledReason?: string;
};
```

`language` є stable settings value. `label`, `shortLabel`, `description` і `disabledReason` є localized presentation text, який передає parent flow.

Recommended option labels:

- `English` із `shortLabel = "EN"`;
- `Українська` із `shortLabel = "UA"`.

Візуальний компонент не має будувати readable label із enum value самостійно. Якщо parent передає інші локалізовані labels, control рендерить їх без зміни selection semantics.

## Зони розмітки

```text
UI-CMP-003 Language Switcher
  ├─ Root field/group
  ├─ Visible label або accessible name
  ├─ Segmented language control
  │  ├─ Language segment: EN
  │  └─ Language segment: UA
  └─ Optional validation або status message
```

### Root field/group

Root group є form-control region усередині First Launch або Settings form.

Вимоги:

- не бути modal, dropdown або standalone page surface;
- займати стабільне місце між clean, hover, focus, selected, invalid, disabled і busy states;
- мати visible label або accessible name;
- мати programmatic relationship із validation/status message, якщо message передано;
- не змінювати surrounding form layout при selected state.

### Segmented language control

Segmented control містить рівно language options, які parent передав як available.

Вимоги:

- default v1 options: `EN` і `UA`;
- layout: compact horizontal segmented selector на wide layouts;
- narrow layout може wrap-ити segments або перейти в vertical segmented stack, якщо labels і zoom не вміщаються;
- кожен segment показує readable `label` і короткий code, якщо `shortLabel` передано;
- selected segment має clear current indicator: accent fill, check/current mark або equivalent selected treatment;
- hover і active feedback не змінюють розміри segment-а;
- unavailable option лишається readable, але не selectable.

## Contexts

### First-launch context

У `firstLaunch` context `UI-CMP-003` рендериться всередині `UI-CMP-006 First-Launch Setup Form`.

Selection у цьому context:

- оновлює pending initial language;
- не створює first-launch completion marker;
- не запускає route navigation;
- не persist-ить settings самостійно;
- не застосовує final app language до explicit confirmation parent flow, якщо parent не підтримує live preview.

### Settings context

У `settings` context `UI-CMP-003` рендериться всередині Settings form.

Selection у цьому context:

- оновлює draft language value;
- переводить Settings form у `editing`, якщо value відрізняється від applied language;
- не виконує page-level save/apply action;
- не пише localStorage напряму;
- не змінює notation display mode або active game.

## Вхідні дані

- `context`: `firstLaunch` або `settings`.
- `selectedLanguage`: active або pending language value.
- `availableLanguages`: список `LanguageSwitcherOption`.
- `disabled`: boolean для тимчасового блокування selection.
- `busy`: boolean, якщо parent застосовує або зберігає settings.
- `invalidSelectedLanguage`: selected language відсутня в available options або не підтримується app-level settings.
- `validationMessage`: optional readable message для invalid або unavailable state.
- `focusedLanguage`: optional focus target для keyboard/controller navigation.
- `label`: visible localized label для control group, якщо page не надає label зовні.
- `ariaLabel`: accessible name fallback, якщо visible label надається через surrounding form.

## Вихідні події

- `requestSelectLanguage`: вибрати available language option.
- `requestFocusLanguageOption`: змінити focused option без selection, якщо implementation expose-ить focus state parent-у.

Parent flow інтерпретує `requestSelectLanguage` за context:

- у `firstLaunch` оновлює pending setup value;
- у `settings` оновлює draft settings value і залишає save/apply behavior на Settings page.

## Межі відповідальності

Компонент відповідає за:

- reusable segmented language selector UI у `packages/ui`;
- readable language labels і short codes;
- selected/current, focused, hover, active, disabled, busy, unavailable і invalid states;
- stable sizing без layout shift;
- keyboard і pointer selection behavior;
- accessible group semantics, names, selected state, disabled state і validation relationship;
- Storybook/visual/a11y coverage для public states.

Компонент не відповідає за:

- browser locale fallback;
- persistence у localStorage або session-only storage;
- first-launch completion marker;
- Settings save/apply lifecycle;
- route navigation;
- active/default game;
- notation display mode;
- seeded combo data, custom combos або named lists;
- backup import/export;
- translation registry або loading localized copy;
- читання Browser Gamepad API напряму.

## Мапа станів

### `ready`

Options готові, selected language валідна.

Очікуваний UI:

- selected segment чітко позначений;
- усі available segments reachable;
- save/apply state не показується всередині component, якщо parent не передав `busy`.

### `firstLaunchPending`

Компонент рендериться в setup form.

Очікуваний UI:

- preselected language може бути підтверджена разом із іншими setup values;
- change оновлює pending initial language;
- confirmation action лишається owner для completion.

### `settingsClean`

Компонент рендериться у Settings form і selected value дорівнює applied language.

Очікуваний UI:

- selected language readable;
- control enabled, якщо Settings не saving;
- validation/status message прихований, якщо немає проблеми.

### `settingsEditing`

Користувач вибрав language, яка відрізняється від applied value.

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

Language option існує в descriptor list, але тимчасово недоступна.

Очікуваний UI:

- option видима, якщо parent передав її для пояснення;
- option не selectable;
- disabled reason доступний visible text, tooltip або accessible description;
- color не є єдиним сигналом.

### `invalidSelectedLanguage`

Selected language не знайдена серед available languages або більше не підтримується.

Очікуваний UI:

- control показує readable validation message;
- component не auto-select-ить іншу language без parent decision;
- focus може перейти на first safe available option тільки за parent або user action.

## UI Behavior

### First Launch Selection

1. Користувач фокусує Language Switcher у setup form.
2. Користувач вибирає `EN` або `UA`.
3. `UI-CMP-003` емітить `requestSelectLanguage(targetLanguage)`.
4. `UI-PAGE-002` оновлює pending initial language.
5. First-launch confirmation застосовує selected language разом із game і notation display mode.

### Settings Draft Selection

1. Користувач відкриває `UI-PAGE-008 Settings`.
2. Settings передає applied language як `selectedLanguage`.
3. Користувач вибирає іншу language.
4. `UI-CMP-003` емітить `requestSelectLanguage(targetLanguage)`.
5. Settings оновлює draft value і переходить у `editing`.
6. Page-level apply/save action застосовує і persist-ить selected language.

### No Top Bar Rendering

`UI-CMP-003` не монтується в `UI-CMP-001 Global Top Bar` або `UI-CMP-033 Top Bar Dropdown Menu`.

Top Bar може відкрити Settings, але inline language controls лишаються Settings-owned controls.

## Visual Design Contract

Language Switcher має відчуватися як compact desktop control, який легко scan-ити у формі.

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
[ English  EN ] [ Українська  UA ]
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
- Кожен segment має accessible name із language label і code, якщо code видимий.
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

- `UI-CMP-003` має окрему повну специфікацію.
- `UI.md` посилається на `ui/UI-CMP-003.md`.
- `UI-CMP-003` рендериться у `UI-PAGE-002 First-Launch Setup` як pending initial language control.
- `UI-CMP-003` рендериться у `UI-PAGE-008 Settings` як draft/apply language control.
- Visual component, recipes, states, indicators, Storybook stories і visual coverage належать `packages/ui`.
- App state, browser-locale defaulting, validation, Settings save/apply, first-launch confirmation, persistence і localized copy source належать `apps/web`.
- Control є compact segmented selector, а не dropdown або menu.
- Supported languages у v1: `EN` і `UA`.
- Labels приходять від parent/localization layer, а не хардкодяться visual primitive-ом.
- Selection у first launch не завершує setup без explicit confirmation.
- Selection у Settings не persist-иться без page-level apply/save behavior.
- Language change не змінює selected game, notation display mode, route, combo path, seeded data, custom data або backup state.
- Top Bar і Top Bar Dropdown Menu не рендерять Language Switcher.

## Storybook і visual coverage

Storybook у `packages/ui` має містити сценарії:

- `Default`;
- `SelectedEN`;
- `SelectedUA`;
- `FirstLaunch`;
- `SettingsClean`;
- `SettingsEditing`;
- `SavingDisabled`;
- `InvalidSelectedLanguage`;
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
- selected EN і selected UA;
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

- Fresh first launch показує `UI-CMP-003` у setup form із preselected default language.
- Вибір `UA` у setup оновлює pending language і не створює completion marker без confirmation.
- Confirmation setup із `UA` застосовує app language і відкриває selected game Catalog.
- Settings показує current applied language.
- Вибір `UA` у Settings переводить form у `editing`.
- Save success застосовує `UA` до UI labels і localized content.
- Save error не стирає selected draft language і показує recoverable message.
- localStorage unavailable дозволяє session-only language application через page-level flow.
- Invalid selected language показує validation message і не auto-select-ить fallback без parent decision.
- Disabled unavailable language не емітить `requestSelectLanguage`.
- Top Bar не містить Language Switcher у wide layout.
- Top Bar Dropdown Menu не містить Language Switcher у compact layout.
- Long `Українська` label не overlap-иться з code або selected indicator.

## Відкриті уточнення

- Exact visual primitive може бути project-owned segmented control або Base UI radio/toggle-group wrapper у `packages/ui`.
- Exact icon/current indicator module залежить від icon facade, який реалізує `packages/ui`.
- Exact browser-locale fallback policy лишається app-level settings decision.
