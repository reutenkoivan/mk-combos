# UI-CMP-037: Notation Legend Table

## Метадані

- Код: `UI-CMP-037`
- Назва: `Notation Legend Table`
- Тип: `component / reusable notation reference table`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власники:
  - `packages/ui` для reusable legend table, UI-owned SVG notation icon registry, semantic recipes, states, Storybook stories і visual coverage
  - `apps/web` для localized labels, accessible labels, mode availability descriptors і placement у First Launch або Settings
- Батьківські сторінки: [`UI-PAGE-002 First-Launch Setup`](./UI-PAGE-002.md), [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Пов'язані компоненти: [`UI-CMP-004 Display Mode Switcher`](./UI-CMP-004.md), [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md)
- Пов'язані UX сценарії: `US-001`, `US-009`, `US-023`, `US-024`

## Призначення

`UI-CMP-037 Notation Legend Table` показує read-only reference table для notation markers у supported display modes.

Компонент дає користувачу швидко порівняти, як одна й та сама базова FGC notation виглядає у:

- `FGC`;
- `PlayStation`;
- `Xbox`.

`UI-CMP-037` є окремим компонентом від [`UI-CMP-004 Display Mode Switcher`](./UI-CMP-004.md). First Launch і Settings можуть рендерити його поруч зі switcher-ом як companion reference, але table не є частиною switcher primitive і не емітить selection або mutation events.

`UI-CMP-037` не змінює selected display mode, combo path, canonical FGC notation, seeded data, custom data або `cachedNotation`. Він тільки показує передані legend rows через UI-owned SVG icons.

## Архітектурний контекст

`packages/ui` володіє `Notation Legend Table` і shared notation SVG icon registry.

`packages/ui` відповідає за:

- table/list anatomy і compact responsive layout;
- UI-owned SVG icons для display modes, attack markers, directionals, modifiers, separators, state markers і compact frame-window markers;
- semantic `tailwind-variants` recipes;
- stable marker chip geometry, density, focus-visible-compatible contrast і invalid/unavailable styling;
- Storybook stories, visual coverage і automated accessibility coverage;
- light/dark, standard/increased contrast і reduced-motion behavior.

`apps/web` відповідає за:

- placement table поруч із [`UI-CMP-004`](./UI-CMP-004.md) у First Launch або Settings;
- localized caption, row labels, column labels і accessible labels;
- passing supported display mode descriptors;
- deciding whether optional modifier rows/columns are visible in a given page context.

[`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md) має використовувати той самий UI-owned SVG icon registry, щоб real notation rendering і legend examples збігалися.

## Public Contract

```ts
type NotationDisplayMode = "FGC" | "PlayStation" | "Xbox";

type NotationIconKind =
  | "displayMode"
  | "attack"
  | "direction"
  | "modifier"
  | "separator"
  | "state"
  | "frameWindow";

type NotationIconDescriptor = {
  iconName: string;
  kind: NotationIconKind;
  accessibleLabel: string;
};

type NotationLegendRow = {
  mode: NotationDisplayMode;
  modeLabel: string;
  modeIcon: NotationIconDescriptor;
  markerIcons: NotationIconDescriptor[];
  modifierIcons?: NotationIconDescriptor[];
};
```

`mode`, `iconName` і `kind` є stable UI-facing values. `modeLabel` і `accessibleLabel` є localized presentation text, який передає parent flow або localization layer.

## UI-owned SVG icon registry

Notation icons мають бути SVG components усередині `packages/ui`.

Вимоги:

- не використовувати text glyphs, emoji, icon fonts, external image URLs або hardcoded page-level SVG для notation markers;
- icon names є stable UI identifiers, які можуть бути використані legend table і renderer-ом;
- SVG має наслідувати semantic UI tokens для foreground, muted, selected/current, disabled, invalid, focus і contrast modes;
- кожна icon-only presentation має accessible name або має бути `aria-hidden`, якщо сусідній text/table header уже надає той самий зміст;
- color не є єдиним сигналом для selected, invalid, unavailable, stale або focused/highlighted states.

Icon registry має покривати:

- display mode icons: `FGC`, `PlayStation`, `Xbox`;
- attack markers: FGC `1`, `2`, `3`, `4`; PlayStation square, triangle, cross, circle; Xbox `X`, `Y`, `A`, `B`;
- directionals;
- simultaneous і sequential markers;
- hold/release hints;
- separators, pauses і cancels;
- invalid, unavailable, stale, focused і highlighted states;
- compact frame-window markers для cancel/link/juggle windows, якщо вони рендеряться як notation або timeline badges.

## Зони розмітки

```text
UI-CMP-037 Notation Legend Table
  ├─ Root reference region
  ├─ Caption або accessible name
  ├─ Header row
  │  ├─ Mode column
  │  ├─ Attack marker columns
  │  └─ Optional modifier columns
  └─ Legend rows
     ├─ FGC row
     ├─ PlayStation row
     └─ Xbox row
```

### Root reference region

Root reference region є read-only companion surface у First Launch або Settings.

Вимоги:

- не бути modal, dropdown або standalone page surface;
- не бути nested card;
- мати compact table або table-like layout;
- мати caption або accessible name;
- не містити mutation controls;
- не змінювати surrounding form layout при selected display mode changes.

### Legend rows

Legend rows показують mode label, mode icon і marker icons.

Required base rows:

```text
FGC          [fgcAttack1] [fgcAttack2] [fgcAttack3] [fgcAttack4]
PlayStation  [psSquare]   [psTriangle] [psCross]   [psCircle]
Xbox         [xboxX]      [xboxY]      [xboxA]     [xboxB]
```

Видимі приклади вище є conceptual icon names. Реалізація має використовувати internal SVG icon components із `packages/ui`.

### Modifier icons

Optional modifier columns або compact modifier rows можуть показувати:

- directionals;
- simultaneous і sequential markers;
- hold/release hints;
- separators між moves або steps;
- pauses і cancels;
- invalid, unavailable, stale, focused і highlighted states;
- compact frame-window markers для cancel/link/juggle windows.

Modifier examples мають бути reusable UI descriptors, а не page-specific explanatory copy.

## Вхідні дані

- `legendRows`: список `NotationLegendRow`.
- `caption`: visible localized caption або heading для table, якщо page не надає label зовні.
- `ariaLabel`: accessible name fallback, якщо visible label надається через surrounding form.
- `density`: `small` або `medium`.
- `layout`: `table`, `stacked` або `compact`.
- `showModifiers`: boolean або equivalent descriptor, якщо page хоче показати modifier examples.
- `disabled`: optional boolean, якщо parent form тимчасово disabled і table має перейти в muted presentation.
- `invalid`: optional boolean, якщо related display mode settings invalid і table має показати non-color-only relationship.

## Вихідні події

`UI-CMP-037` не має output events.

Table є read-only reference component:

- не вибирає display mode;
- не відкриває picker або popup;
- не мутує notation;
- не пише settings;
- не змінює focus у [`UI-CMP-004`](./UI-CMP-004.md) або [`UI-CMP-015`](./UI-CMP-015.md).

## Межі відповідальності

Компонент відповідає за:

- reusable notation legend table UI у `packages/ui`;
- SVG icon rendering через UI-owned notation icon registry;
- table semantics, caption/accessibility, row/column relationships і wrapping behavior;
- marker chip styling, density і contrast behavior;
- modifier icon support для notation-related examples;
- Storybook/visual/a11y coverage для table states і responsive scenarios.

Компонент не відповідає за:

- display mode selection;
- Settings save/apply lifecycle;
- first-launch completion marker;
- persistence;
- route navigation;
- parsing, recalculation або mutation notation;
- зміну `movePath`, canonical FGC notation, seeded data, custom combos або `cachedNotation`;
- game-specific graph validation;
- controller input capture.

## Мапа станів

### `ready`

Legend rows готові.

Очікуваний UI:

- base rows для `FGC`, `PlayStation` і `Xbox` visible;
- SVG icons rendered через UI-owned registry;
- table caption або accessible name available;
- row/column relationships readable.

### `withModifiers`

Parent передав modifier icons.

Очікуваний UI:

- modifier icons visible as columns або compact rows;
- layout лишається stable;
- modifier names available through accessible labels.

### `compactStacked`

Viewport, zoom або parent layout не дає достатньо width для horizontal table.

Очікуваний UI:

- rows stack vertically;
- marker chips wrap без overlap;
- row labels лишаються visually і programmatically connected з icons.

### `disabledMuted`

Parent form тимчасово disabled або busy.

Очікуваний UI:

- table лишається readable;
- muted treatment не зменшує contrast нижче accessibility floor;
- table не стає interactive.

### `invalidRelatedState`

Related display mode setting invalid або unsupported.

Очікуваний UI:

- table не приховує supported mode rows;
- invalid relationship не покладається тільки на color;
- validation copy належить parent form або [`UI-CMP-004`](./UI-CMP-004.md), не table.

## UI Behavior

### First Launch Companion

1. `UI-PAGE-002` рендерить [`UI-CMP-004 Display Mode Switcher`](./UI-CMP-004.md).
2. Page рендерить `UI-CMP-037` поруч зі switcher-ом.
3. Користувач читає icon examples без зміни selected display mode.
4. First-launch confirmation застосовує selected display mode через page-level flow.

### Settings Companion

1. `UI-PAGE-008` рендерить [`UI-CMP-004 Display Mode Switcher`](./UI-CMP-004.md).
2. Page рендерить `UI-CMP-037` поруч зі switcher-ом.
3. Користувач порівнює display modes і modifiers.
4. Table не впливає на Settings draft або save/apply state.

### Renderer Consistency

1. [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md) отримує notation і active display mode.
2. Renderer використовує той самий UI-owned SVG icon registry, що й `UI-CMP-037`.
3. Legend examples match rendered notation for equivalent tokens.

## Visual Design Contract

`UI-CMP-037` має відчуватися як compact reference table, а не help card або instructional panel.

Rules:

- використовувати table/list layout, не nested card;
- mode label і mode icon мають бути scannable;
- marker chips мають стабільні dimensions і не змінювати row height між states;
- modifier columns можуть collapse-итися в окремий compact row на narrow layout;
- SVG icons мають лишатися readable у light, dark, standard contrast і increased contrast;
- table не використовує decorative material/glass;
- icon rows не мають overlap-итися з captions, form controls або status messages.

## Recipe і variant requirements

Implementation має використовувати semantic recipes у `packages/ui`.

Recommended shared recipes:

- `item` для legend rows або marker cells;
- `indicator` для marker chips і state icons;
- `separator` для subtle row/column separation;
- `panel` для compact table padding, якщо implementation має shared reference-table primitive.

Allowed semantic axes:

- `density`: `small` або `medium`;
- `layout`: `table`, `stacked` або `compact`;
- `state`: `ready`, `disabled`, `invalid`;
- `tone`: `neutral` або `destructive` для invalid relationship;
- `emphasis`: `normal` або `subtle`;
- `shape`: `fixed`.

Forbidden primary public axes:

- raw color;
- arbitrary radius;
- arbitrary shadow;
- arbitrary blur;
- raw spacing;
- border width;
- direct `className` як primary styling API;
- raw SVG path injection з app/page code.

## Доступність і поведінка вводу

- Table має caption або accessible name.
- Row labels і column labels мають бути programmatically connected з icon cells.
- SVG icons мають accessible names або валідні adjacent-label relationships.
- Decorative duplicated SVG icons мають бути `aria-hidden`.
- Table не має keyboard-only interaction, крім natural reading/navigation behavior.
- Table не має містити focusable controls.
- Long labels і marker rows мають лишатися readable при zoom/text resizing.
- Increased contrast має підсилювати separators, icon foreground і state markers.
- Color не є єдиним сигналом invalid, unavailable, stale або highlighted state.

## Критерії приймання

- `UI-CMP-037` має окрему повну специфікацію.
- `UI.md` посилається на `ui/UI-CMP-037.md`.
- `UI-CMP-037` є reusable `packages/ui` component.
- First Launch може рендерити `UI-CMP-037` поруч із [`UI-CMP-004`](./UI-CMP-004.md).
- Settings може рендерити `UI-CMP-037` поруч із [`UI-CMP-004`](./UI-CMP-004.md).
- Table є read-only і не емітить selection або mutation events.
- SVG icons для display modes, attack markers і notation modifiers містяться в UI.
- [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md) використовує той самий UI-owned notation icon registry, що й table.
- Required base rows покривають `FGC`, `PlayStation` і `Xbox`.
- Table layout лишається readable у light/dark, standard/increased contrast, narrow width і zoom/text resizing.
- Top Bar і Top Bar Dropdown Menu не рендерять Notation Legend Table.

## Storybook і visual coverage

Storybook у `packages/ui` має містити сценарії:

- `Default`;
- `WithModifiers`;
- `CompactStacked`;
- `LongLocalizedLabels`;
- `InvalidUnavailableStates`;
- `DisabledMuted`;
- `IncreasedContrast`;
- `IconAccessibleNames`;
- `ZoomText`.

Visual tests мають покривати:

- light/dark;
- standard/increased contrast;
- `small` і `medium` density;
- base rows для `FGC`, `PlayStation`, `Xbox`;
- modifier icons;
- disabled/muted table state;
- invalid related state;
- long localized labels;
- compact/narrow layout;
- browser zoom/text resizing stress;
- no overlap між caption, rows, marker chips і surrounding form controls;
- SVG icon rendering for all notation icon kinds.

Automated accessibility checks мають перевірити:

- table caption або accessible name;
- row/column relationships;
- SVG icon accessible names або adjacent-label relationships;
- no focusable controls inside read-only table;
- no hidden focusable duplicate controls;
- non-color-only invalid/unavailable/stale state markers.

## Тестові сценарії

- First Launch показує `UI-CMP-037` поруч із `UI-CMP-004`.
- Settings показує `UI-CMP-037` поруч із `UI-CMP-004`.
- Base rows показують FGC, PlayStation і Xbox marker icons.
- Modifier icons render for directionals, simultaneous/sequential markers, hold/release, separators, pauses/cancels, invalid, unavailable, stale і focused/highlighted states.
- `UI-CMP-037` icons match [`UI-CMP-015`](./UI-CMP-015.md) rendered notation icons for the same mode.
- Table не емітить display mode selection.
- Table не змінює `movePath`, canonical FGC notation або `cachedNotation`.
- Narrow layout stack-ить rows без overlap.
- Top Bar не містить Notation Legend Table у wide layout.
- Top Bar Dropdown Menu не містить Notation Legend Table у compact layout.

## Відкриті уточнення

- Exact icon component names будуть визначені під час UI implementation pass, але UI-owned SVG registry requirement є обов'язковим.
- Exact mapping dictionary `FGC -> PlayStation/Xbox` належить shared UI/data layer і має збігатися між `UI-CMP-037` та [`UI-CMP-015`](./UI-CMP-015.md).
- Exact modifier set може розширюватися разом із notation renderer, але нові markers мають додаватися через UI-owned SVG icons.
