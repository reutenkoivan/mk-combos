# UI-CMP-012: Combo List Config Module

## Метадані

- Код: `UI-CMP-012`
- Назва: `Combo List Config Module`
- Тип: `full-workspace required-context selector`
- Статус деталізації: `Описано`
- Батьківська сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Child components: [`UI-CMP-007`](./UI-CMP-007.md), [`UI-CMP-008`](./UI-CMP-008.md), [`UI-CMP-009`](./UI-CMP-009.md)

## Призначення

`UI-CMP-012` рендерить один із двох взаємовиключних Command Deck steps:

- `character` — full-workspace character roster;
- `specification` — locked character strip і variation або kameo roster.

Компонент не рендерить result filters. [`UI-CMP-013 Filter Control Group`](./UI-CMP-013.md)
є окремим result-route composite із applied summary та modal draft drawer.

## Public contract

```ts
type ContextSelection =
  | {
      step: "character";
      header: SelectorHeader;
      characterPicker: CharacterPickerProps;
      commands?: readonly CommandHint[];
    }
  | {
      step: "specification";
      header: SelectorHeader;
      lockedCharacter: LockedCharacter;
      gameContextPicker:
        | { kind: "variation"; props: VariationPickerProps }
        | { kind: "kameo"; props: KameoPickerProps };
      commands?: readonly CommandHint[];
    };

type ComboListConfigModuleProps = {
  contextSelection: ContextSelection;
  responsiveMode: "mobile" | "tablet" | "desktop";
  sourceFocusTarget?: string;
  onRequestAction?: (intent: { action: "changeCharacter" }) => void;
};
```

Game ID не є presentation discriminator. Route owner передає вже підготовлений picker.
Optional `commands` лишається backward-compatible лише для standalone
composition. `UI-PAGE-003 Catalog` не передає цей prop: route-level commands
належать app-owned scope і відображаються єдиною App Shell ribbon.
Optional picker `backLabel`/`message`, locked-character `changeLabel` та semantic
back/change handlers також лишаються public standalone API. Catalog specification
не передає їх: guidance показує header description, а повернення належить
breadcrumbs/drawer, browser Back і controller session.

## Anatomy

```text
CommandDeckSelector
├── SelectorHeader
│   ├── numbered step
│   ├── title/description
│   └── game, option count, instruction telemetry
├── LockedCharacterStrip (specification only)
├── CommandDeckPickerRegion
│   └── Character | Variation | Kameo picker
└── OptionalStandaloneCommandRibbon (standalone `commands` only)
```

Surface має graph-paper background, dark command chrome, square borders і не
використовує rounded card composition.

## Character step

- Монтується тільки `UI-CMP-007 Character Picker`.
- Picker примусово отримує `commandDeck` presentation, який вмикає internal
  portrait/fluid grid без розширення public picker contracts.
- Mobile, tablet і desktop використовують prepared
  `responsiveOrder ?? sourceIndex + 1`; authored `row/column` не застосовуються до
  character placement.
- Character header використовує compact density: `12px` inset, короткі vertical
  gaps, `text-3xl` title і `20px` description line-height. Picker region має той
  самий canvas inset, що Catalog result: `8px` до `40rem`, `12px` від `40rem`.
- Prepared `selectedCharacterId` та `focusedSlotId` керовані owner-ом.
- Option selection проходить через picker semantic callback.
- Немає внутрішнього auto-navigation або persistence.

## Specification step

- Character Picker не монтується.
- Locked strip показує `Selected fighter`, portrait/placeholder, label, game і progress.
- Без `changeLabel` strip використовує двоколонкову content geometry без порожнього
  action track; optional standalone Change action лишається підтриманою.
- Монтується рівно один prepared `VariationPicker` або `KameoPicker`.
- Command Deck Variation/Kameo на всіх responsive modes використовує compact
  centered portrait placement і prepared `responsiveOrder ?? sourceIndex + 1`.
- Authored `row/column` не застосовуються до Command Deck placement, але лишаються
  у slot data/public contract для backward compatibility.
- Catalog не показує inline return control, local command ribbon або нижній picker
  status hint. Header description і selected-fighter context збережені.
- Якщо standalone consumer передає Change action, вона емітить `changeCharacter`;
  owner вирішує navigation.
- Component не визначає compatibility pair або variation ownership.

## Picker layout

- Character grid на всіх viewport використовує
  `repeat(auto-fit, minmax(min(7.5rem, 100%), 1fr))`, обмежується до `96rem` і
  центрується; visual order визначає `responsiveOrder ?? sourceIndex + 1`.
- Variation/Kameo Command Deck grid на всіх viewport використовує
  `repeat(auto-fit, minmax(min(8rem, 100%), 10rem))`, `gap-4`, centered placement
  і minimum card height `11rem`; visual order визначає
  `responsiveOrder ?? sourceIndex + 1`.
- Specification card має `64×64px` icon/fallback, label під ним, numeric count badge
  у верхньому куті та окремий selected/controller marker. Disabled reason wrap-иться
  без зміни базової геометрії state.
- `standard` picker presentation зберігає наявний horizontal/authored layout;
  compact portrait placement вмикається internal лише через `commandDeck`.
- Stable DOM ID виводиться зі stable layout/slot ID.
- Breakpoint transition не змінює logical order або selected/focused identity.
- Placeholder та disabled slots зберігають prepared order; controller focus їх пропускає.

## States

- `selected`: required option, підготовлений page owner-ом.
- `controllerFocused`: active focus graph node.
- `disabled`: видимий, має reason, `aria-disabled` і не емітить select.
- `missingAsset`: readable fallback без broken image.
- `busy`: picker повідомляє loading state й блокує selection.

Selected і controller-focused стилі відрізняються. Focus не обчислюється через DOM
geometry.

## Motion

Step enter використовує короткий slide/crossfade. `prefers-reduced-motion: reduce`
повністю вимикає animation/transition цієї surface.

## Responsive

- Surface займає доступний workspace на всіх viewport.
- Header/telemetry stack-яться до `640px`.
- Optional locked-strip action переходить у compact row до `390px`; без action
  component не резервує порожню колонку.
- Interactive targets не менші за `44×44px`.
- Text wrapping і `min-width: 0` не допускають зовнішній overflow.

## Accessibility

- Selector `section` посилається на route heading через `aria-labelledby`.
- Heading programmatically focusable після route transition.
- Option count/route announcements мають polite live behavior.
- Locked strip має accessible label; image alt не дублює adjacent text без потреби.
- Optional standalone command ribbon і App Shell ribbon не замінюють accessible names реальних controls.
- Disabled reason доступний pointer, keyboard і assistive technology users.

## Controller contract

UI отримує controlled `focusedSlotId`; page/controller session готує focus graph та
обробляє semantic navigation, `confirm` і `back`. Компонент не читає Gamepad API,
не створює synthetic events і не вимірює DOM. Character scope на всіх viewport
використовує лінійний prepared order: left/up — попередній доступний slot,
right/down — наступний. Specification scope використовує ту саму linear policy на
mobile, tablet і desktop; disabled та placeholder slots пропускаються, краї не
цикляться. Prepared order дорівнює `responsiveOrder ?? sourceIndex + 1`; `back`
доступний на specification step і не потребує inline button.

## Межі

`UI-CMP-012` не відповідає за:

- pathname parsing/building;
- query parsing або canonicalization;
- redirect чи migration;
- local-state persistence;
- game-specific availability/filtering;
- result list і filter drawer;
- browser/controller Back policy.

## Acceptance

- Discriminated union не дозволяє одночасно character і specification surfaces.
- Character step не монтує variation/kameo picker.
- Specification step не монтує character picker.
- Prepared picker kind визначає child component без branching за game ID.
- Fluid character layout і compact portrait specification layout на всіх viewport,
  disabled/missing assets і controlled linear focus покриті tests.
- Catalog route не передає local `commands` і не рендерить component-local ribbon.
- Catalog route не передає `backLabel`, `message` або `changeLabel`; header guidance
  і selected fighter рендеряться один раз без нижнього status hint.
- Standalone consumer може передати optional `commands`, picker back/message та
  locked-character Change action без зміни public contract.
- Reduced motion вимикає step transition.
