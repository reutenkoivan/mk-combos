# UI-CMP-008: Variation Picker

## Метадані

- Код: `UI-CMP-008`
- Назва: `Variation Picker`
- Тип: `component / MKXL context selector`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власник: [`UI-CMP-012 Combo List Config Module`](./UI-CMP-012.md)
- Батьківська сторінка: [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md)
- Variant doc: [`UI-PAGE-003 MKXL Catalog Variant`](./UI-PAGE-003-MKXL.md)
- Пов'язані компоненти: [`UI-CMP-007 Character Picker`](./UI-CMP-007.md)
- Пов'язані UX сценарії: `US-003`, `US-004`, `US-006`, `US-019`

## Призначення

`UI-CMP-008 Variation Picker` є required game-specific context selector для `MKXL`.

Компонент показується після selected `MKXL` character і дає вибрати variation з
prepared game-owned options. У Catalog `commandDeck` presentation відображає їх як
compact centered portrait cards; standalone `standard` presentation зберігає
наявний horizontal/authored layout.

Picker не є generic dropdown або optional filter. Variation є required context кроку `02 / Variation` у `UI-CMP-012 Combo List Config Module` і визначає базову область combo list разом із path character.

## Володіння

`UI-PAGE-003 MKXL Catalog Variant` володіє selected character і selected variation. Available variation data, disabled reasons, layout descriptors і combo availability приходять із `mkxl/catalog` через `@mk-combos/mkxl-business`.

`UI-CMP-012 Combo List Config Module` розміщує picker під locked character strip і отримує controlled focus handoff після pathname transition від Catalog page model.

`UI-CMP-008` відповідає тільки за:

- рендер prepared variation layout для selected MKXL character;
- рендер controlled selected, focused, disabled і placeholder state variation slots;
- keyboard/controller navigation intent усередині variation layout;
- semantic selection intent для parent variant flow.

Компонент не імпортує `mkxl/data` напряму і не виконує MKXL validation.

Вихідні handlers приймають abstract payloads із slot/variation identifiers і не передають browser event objects.

## Контракт даних розміщення

`UI-CMP-008` використовує shared picker layout contract із `UI-CMP-007`.

```ts
type PickerLayoutKey =
  | "MKXL.character"
  | "MKXL.variation"
  | "MK1.character"
  | "MK1.kameo";

type PickerSlot = {
  slotId: string;
  optionId?: string;
  row: number;
  column: number;
  responsiveOrder?: number;
  status: "selectable" | "disabledNoComboData" | "placeholder";
};
```

Для `UI-CMP-008` дозволений layout key:

- `MKXL.variation`.

`optionId` є stable variation id для selected character. Реєстр розміщення має підтримувати per-character variation slots, якщо in-game placement або labels відрізняються між characters.

### Presentation policy

- `standard` зберігає наявний horizontal/authored layout і може застосовувати
  `row`/`column` відповідно до standalone contract.
- `commandDeck` на mobile, tablet і desktop ігнорує `row`/`column` для placement
  та використовує `responsiveOrder ?? sourceIndex + 1` для visual і controller order.
- Authored `row`/`column` не видаляються зі schema, types або prepared data: це
  stable public compatibility facts для інших presentations і consumers.
- Command Deck grid: `repeat(auto-fit, minmax(min(8rem, 100%), 10rem))`, `gap-4`,
  centered placement і minimum card height `11rem`.
- Disabled і placeholder slots не сортуються alphabetically; inert slots
  пропускаються controller focus graph-ом.

## Анатомія

Розміщення є picker surface після locked character strip: `parentContextLabel`
(`Selected fighter`) стоїть над variation cards. Catalog guidance існує тільки у
step header; lower status region та inline return control не передаються.

```jsx
<VariationPicker ui="UI-CMP-008">
  <VariationPickerSurface slot="UI-CMP-012 specification step">
    <Stack name="VariationPickerLayout">
      <PickerLabel />
      <SelectedCharacterContextLabel />

      <VariationLayout>
        <VariationSlot>
          <Stack name="VariationSlotContent">
            <VariationIconOrFallback size="64×64" />
            <VariationLabel />
            <NumericCountBadge position="top corner" />
          </Stack>

          <Show when={isSelectedOrFocused}>
            <SelectedFocusedIndicator />
          </Show>

          <Show when={isDisabledOrPlaceholder}>
            <DisabledPlaceholderState />
          </Show>
        </VariationSlot>
      </VariationLayout>

      <Show when={isStandaloneConsumer && hasStatusLiveRegion}>
        <StatusLiveRegion />
      </Show>
    </Stack>
  </VariationPickerSurface>
</VariationPicker>
```

Правила розміщення:

- У `UI-CMP-012` component є єдиним picker-ом specification step; character grid
  у цей момент не монтується.
- Variation slots використовують prepared `MKXL.variation` data і не додають
  alphabetical sorting.
- Indicators і disabled state рендеряться всередині slot, не змінюючи геометрію сусідніх slots.

## Вхідні дані

- `activeGame`: завжди `MKXL`.
- `selectedCharacterId`: selected MKXL character.
- `layoutKey`: `MKXL.variation`.
- `pickerSlots`: variation layout slots для selected character.
- `variationsById`: variation metadata, localized labels і optional descriptions.
- `selectedVariationId`: selected variation або empty value.
- `availableComboCounts`: optional counts для `character + variation`.
- `disabledReasons`: readable reasons для `disabledNoComboData`.
- `loadingState`: variation layout або metadata ще готуються.
- `invalidVariationContext`: selected route/deep link variation не сумісна з selected character.
- `responsiveMode`: `mobile`, `tablet` або `desktop`.
- `focusedSlotId`: поточний focus target.
- `activeLanguage`: `EN` або `UA`.
- `presentation`: `standard | commandDeck`; `UI-CMP-012` примусово використовує
  `commandDeck` без розширення public picker props.
- `backLabel` і `message`: optional standalone copy; Catalog їх не передає.

## Вихідні події

- `requestSelectVariation`: вибрати focused/selectable variation.
- `requestFocusVariationSlot`: змінити focused variation slot.
- `requestReturnToCharacterPicker`: optional standalone semantic back intent;
  Catalog повертається через breadcrumb/drawer, browser або controller Back.
- `requestClearVariation`: optional очистити selected variation, якщо parent flow дозволяє.

## Межі відповідальності

Компонент відповідає за:

- standard authored та Command Deck compact presentation для selected character;
- Command Deck portrait placement і `responsiveOrder ?? sourceIndex + 1` на всіх
  responsive modes;
- disabled variation slots без combo data;
- selected/focused/hover/active states;
- keyboard/controller navigation;
- accessible labels і disabled reasons.

Компонент не відповідає за:

- зміну active game;
- показ або вибір kameo;
- показ character roster;
- optional stage/interactable filters;
- combo list filtering;
- route або localStorage writes;
- читання Browser Gamepad API;
- відкриття combo detail.

## Мапа станів

### `waitingForCharacter`

MKXL character ще не вибраний.

Очікуваний UI:

- picker hidden або disabled відповідно до parent layout;
- focus не заходить у variation slots;
- combo list не отримує variation-dependent actions.

### `loadingVariations`

Variation layout або metadata ще готуються.

Очікуваний UI:

- layout area зберігає стабільні dimensions;
- selection disabled;
- loading state оголошується assistive technologies.

### `variationSelection`

Selected character є, але variation ще не вибрана.

Очікуваний UI:

- показано variation layout для selected character;
- жоден variation slot не selected;
- перший safe selectable variation може бути focus target.

### `variationSelected`

Selected `character + variation` валідні.

Очікуваний UI:

- selected variation має visible і semantic selected state;
- parent flow може показати combo list;
- result count і active context summary оновлені.

### `disabledNoComboData`

Variation існує в prepared layout, але для `character + variation` ще немає combo data.

Очікуваний UI:

- slot лишається видимим у prepared order;
- slot не емітить selection;
- disabled reason readable і accessible.

### `invalidVariationContext`

Route або restored context містить variation, яка не належить selected character або більше не існує.

Очікуваний UI:

- parent variant скидає selected variation або показує recoverable state;
- picker не auto-select-ить іншу variation без explicit user action.

## UI Behavior

### Selection Flow

1. `UI-CMP-007` емітить selected MKXL character.
2. Parent flow показує `UI-CMP-008` із layout для selected character.
3. Користувач фокусує selectable variation slot.
4. Користувач активує slot через click, tap, `Enter`, `Space` або controller `confirm`.
5. `UI-CMP-008` емітить `requestSelectVariation`.
6. Catalog переходить до valid `character + variation` context і оновлює combo list.

### Presentation And Navigation

У Catalog `commandDeck` на mobile, tablet і desktop:

- left/up переходить до попереднього, right/down — до наступного selectable slot
  за `responsiveOrder ?? sourceIndex + 1`;
- disabled і placeholder slots пропускаються, краї не цикляться;
- wrapping не змінює logical order або selected/focused identity.

Standalone `standard` presentation зберігає authored placement contract.

### Clear Filters

`Clear filters` у `UI-CMP-012` не очищає selected variation.

Variation очищається тільки якщо:

- selected character змінився і variation стала incompatible;
- route/context recovery явно повертає користувача до `variationSelection`;
- користувач виконав explicit clear context action, якщо такий action буде доданий.

## Accessibility

- Picker має visible label або accessible name.
- Selected character context має бути readable.
- Variation slots мають accessible names із localized variation labels.
- Selected variation має semantic selected або pressed state.
- Disabled variation має `aria-disabled` або native disabled behavior і readable reason.
- Placeholder slot не має бути оголошений як selectable option.
- Focus-visible має бути помітний у light, dark, standard contrast і increased contrast.
- Variation description або icon не замінює текстовий label.
- Розміщення не покладається тільки на колір.

## Критерії приймання

- `UI-CMP-008` має окрему повну специфікацію.
- `MKXL.variation` є explicit layout key.
- Command Deck після selected character використовує compact portrait grid на
  mobile, tablet і desktop.
- Visual і controller order на всіх viewport визначає
  `responsiveOrder ?? sourceIndex + 1`.
- Slot без combo data показується як `disabledNoComboData` і не selectable.
- Selecting variation завершує required MKXL context.
- `UI-CMP-008` не показується в `MK1` variant.
- `UI-CMP-008` не показує kameo options.
- Controller/keyboard focus у picker не тригерить combo card actions у background.

## Тестові сценарії

- Без selected character picker перебуває у `waitingForCharacter`.
- Вибір MKXL character показує `MKXL.variation` layout.
- Desktop, tablet і mobile Command Deck не створюють overlap або horizontal overflow
  та зберігають усі non-placeholder slots.
- Selectable variation емітить `requestSelectVariation`.
- Disabled variation slot не емітить selection і має readable disabled reason.
- Зміна character скидає incompatible selected variation.
- `Clear filters` не очищає selected variation.
- Controller navigation на desktop, tablet і mobile рухається лінійно по prepared
  order, пропускає inert slots і clamp-иться на краях.

## Відкриті уточнення

- Точний copy disabled reasons має відповідати shared empty/error state style.

## Step 26 Readability Contract

- `PickerOption.description` і localized `countLabel` є видимими частинами variation option.
- Long UA variation labels, descriptions, counts і disabled reasons wrap-ляться; fixed slot height не може обрізати текст.
- Text label лишається primary affordance навіть коли option має icon або portrait.

## Command Deck Presentation

- `presentation = standard | commandDeck`; `commandDeck` є full-workspace кроком `02 / Variation` і ніколи не рендериться поруч із character grid.
- Character context приходить як locked prepared model від `UI-CMP-012`; picker не читає route, game ID або persistence.
- `focusedSlotId`, stable `slotId`, selected variation та unavailable state мають окреме visible/semantic wiring, і focus не підміняє selection.
- Portrait variation cards показують `64×64px` authored icon або missing-asset
  fallback, label під ним, numeric count badge, окремий selected/controller marker
  і readable disabled reason; fixed-height truncation заборонена.
- Catalog не передає `backLabel` або `message`; header description і selected-fighter
  context збережені. Optional standalone `returnToCharacterPicker` лишається
  semantic back intent, а `selectVariation` — confirm intent.
- Reduced motion прибирає step-enter transition, не змінюючи focus order або content visibility.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile`, `tablet` і `desktop` Command Deck використовують один compact portrait
  grid та linear prepared order navigation;
- left/up — previous, right/down — next; inert slots пропускаються, краї не цикляться;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
