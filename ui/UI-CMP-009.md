# UI-CMP-009: Kameo Picker

## Метадані

- Код: `UI-CMP-009`
- Назва: `Kameo Picker`
- Тип: `component / MK1 context selector`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власник: [`UI-CMP-012 Combo List Config Module`](./UI-CMP-012.md)
- Батьківська сторінка: [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md)
- Variant doc: [`UI-PAGE-003 MK1 Catalog Variant`](./UI-PAGE-003-MK1.md)
- Пов'язані компоненти: [`UI-CMP-007 Character Picker`](./UI-CMP-007.md)
- Пов'язані UX сценарії: `US-003`, `US-005`, `US-006`, `US-019`

## Призначення

`UI-CMP-009 Kameo Picker` є required game-specific context selector для `MK1`.

Компонент показується після selected `MK1` main character і дає вибрати kameo з
prepared game-owned options. У Catalog `commandDeck` presentation відображає їх як
compact centered portrait cards; standalone `standard` presentation зберігає
наявний horizontal/authored layout.

Kameo не є optional filter facet. Він є required context кроку `02 / Kameo` у `UI-CMP-012 Combo List Config Module` і визначає базову область combo list разом із path main character.

## Володіння

`UI-PAGE-003 MK1 Catalog Variant` володіє selected main character і selected kameo. Available kameo data, disabled reasons, layout descriptors і combo availability приходять із `mk1/catalog` через `@mk-combos/mk1-business`.

`UI-CMP-012 Combo List Config Module` розміщує picker під locked character strip і отримує controlled focus handoff після pathname transition від Catalog page model.

`UI-CMP-009` відповідає тільки за:

- рендер prepared MK1 kameo layout;
- рендер controlled selected, focused, disabled і placeholder state kameo slots;
- keyboard/controller navigation intent усередині kameo grid;
- semantic selection intent для parent variant flow.

Компонент не імпортує `mk1/data` напряму і не виконує MK1 validation.

Вихідні handlers приймають abstract payloads із slot/kameo identifiers і не передають browser event objects.

## Контракт даних розміщення

`UI-CMP-009` використовує shared picker layout contract із `UI-CMP-007`.

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

Для `UI-CMP-009` дозволений layout key:

- `MK1.kameo`.

`optionId` є stable kameo id із seeded/domain registry. Kameo layout не має використовувати main character roster coordinates.

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
(`Selected fighter`) стоїть над kameo cards. Catalog guidance існує тільки у
step header; lower status region та inline return control не передаються.

```jsx
<KameoPicker ui="UI-CMP-009">
  <KameoPickerSurface slot="UI-CMP-012 specification step">
    <Stack name="KameoPickerLayout">
      <PickerLabel />
      <SelectedMainCharacterContextLabel />

      <KameoGrid>
        <KameoSlot>
          <Stack name="KameoSlotContent">
            <KameoPortraitOrFallbackMark size="64×64" />
            <KameoLabel />
            <NumericCountBadge position="top corner" />
          </Stack>

          <Show when={isSelectedOrFocused}>
            <SelectedFocusedIndicator />
          </Show>

          <Show when={isDisabledOrPlaceholder}>
            <DisabledPlaceholderState />
          </Show>
        </KameoSlot>
      </KameoGrid>

      <Show when={isStandaloneConsumer && hasStatusLiveRegion}>
        <StatusLiveRegion />
      </Show>
    </Stack>
  </KameoPickerSurface>
</KameoPicker>
```

Правила розміщення:

- У `UI-CMP-012` component є єдиним picker-ом specification step; character grid
  у цей момент не монтується.
- Kameo slots використовують prepared `MK1.kameo` data і не додають alphabetical sorting.
- Indicators і disabled state рендеряться всередині slot, не змінюючи геометрію сусідніх slots.

## Вхідні дані

- `activeGame`: завжди `MK1`.
- `selectedCharacterId`: selected MK1 main character.
- `layoutKey`: `MK1.kameo`.
- `pickerSlots`: kameo layout slots.
- `kameosById`: kameo metadata, labels і portrait refs.
- `selectedKameoId`: selected kameo або empty value.
- `availableComboCounts`: optional counts для `character + kameo`.
- `disabledReasons`: readable reasons для `disabledNoComboData`.
- `loadingState`: kameo layout або metadata ще готуються.
- `invalidKameoContext`: selected route/deep link kameo не знайдений або stale.
- `responsiveMode`: `mobile`, `tablet` або `desktop`.
- `focusedSlotId`: поточний focus target.
- `activeLanguage`: `EN` або `UA`.
- `presentation`: `standard | commandDeck`; `UI-CMP-012` примусово використовує
  `commandDeck` без розширення public picker props.
- `backLabel` і `message`: optional standalone copy; Catalog їх не передає.

## Вихідні події

- `requestSelectKameo`: вибрати focused/selectable kameo.
- `requestFocusKameoSlot`: змінити focused kameo slot.
- `requestReturnToCharacterPicker`: optional standalone semantic back intent;
  Catalog повертається через breadcrumb/drawer, browser або controller Back.
- `requestClearKameo`: optional очистити selected kameo, якщо parent flow дозволяє.

## Межі відповідальності

Компонент відповідає за:

- standard authored та Command Deck compact presentation;
- Command Deck portrait placement і `responsiveOrder ?? sourceIndex + 1` на всіх
  responsive modes;
- disabled kameo slots без combo data;
- selected/focused/hover/active states;
- keyboard/controller navigation;
- accessible labels і disabled reasons.

Компонент не відповідає за:

- зміну active game;
- показ або вибір MKXL variation;
- показ main character roster;
- optional filters;
- combo list filtering;
- route або localStorage writes;
- читання Browser Gamepad API;
- відкриття combo detail.

## Мапа станів

### `waitingForMainCharacter`

MK1 main character ще не вибраний.

Очікуваний UI:

- picker hidden або disabled відповідно до parent layout;
- focus не заходить у kameo slots;
- combo list не отримує kameo-dependent actions.

### `loadingKameos`

Kameo layout або metadata ще готуються.

Очікуваний UI:

- layout area зберігає стабільні dimensions;
- selection disabled;
- loading state оголошується assistive technologies.

### `kameoSelection`

Selected main character є, але kameo ще не вибраний.

Очікуваний UI:

- показано full `MK1.kameo` layout;
- жоден kameo slot не selected;
- перший safe selectable kameo може бути focus target.

### `kameoSelected`

Selected `character + kameo` валідні.

Очікуваний UI:

- selected kameo має visible і semantic selected state;
- parent flow може показати combo list;
- result count і active context summary оновлені.

### `disabledNoComboData`

Kameo існує в prepared layout, але для selected `character + kameo` ще немає combo data.

Очікуваний UI:

- slot лишається видимим у prepared order;
- slot не емітить selection;
- disabled reason readable і accessible.

### `invalidKameoContext`

Route або restored context містить kameo, якого немає у current layout/data.

Очікуваний UI:

- parent variant скидає selected kameo або показує recoverable state;
- picker не auto-select-ить інший kameo без explicit user action.

## UI Behavior

### Selection Flow

1. `UI-CMP-007` емітить selected MK1 main character.
2. Parent flow показує `UI-CMP-009` із `MK1.kameo` layout.
3. Користувач фокусує selectable kameo slot.
4. Користувач активує slot через click, tap, `Enter`, `Space` або controller `confirm`.
5. `UI-CMP-009` емітить `requestSelectKameo`.
6. Catalog переходить до valid `character + kameo` context і оновлює combo list.

### Presentation And Navigation

У Catalog `commandDeck` на mobile, tablet і desktop:

- left/up переходить до попереднього, right/down — до наступного selectable slot
  за `responsiveOrder ?? sourceIndex + 1`;
- disabled і placeholder slots пропускаються, краї не цикляться;
- wrapping не змінює logical order або selected/focused identity.

Standalone `standard` presentation зберігає authored placement contract.

### Clear Filters

`Clear filters` у `UI-CMP-012` не очищає selected kameo.

Kameo очищається тільки якщо:

- selected main character змінився і kameo pair стала incompatible;
- route/context recovery явно повертає користувача до `kameoSelection`;
- користувач виконав explicit clear context action, якщо такий action буде доданий.

## Accessibility

- Picker має visible label або accessible name.
- Selected main character context має бути readable.
- Kameo slots мають accessible names із localized kameo labels.
- Selected kameo має semantic selected або pressed state.
- Disabled kameo має `aria-disabled` або native disabled behavior і readable reason.
- Placeholder slot не має бути оголошений як selectable option.
- Focus-visible має бути помітний у light, dark, standard contrast і increased contrast.
- Kameo portrait не є єдиним label.
- Розміщення не покладається тільки на колір.

## Критерії приймання

- `UI-CMP-009` має окрему повну специфікацію.
- `MK1.kameo` є explicit layout key.
- Command Deck після selected main character використовує compact portrait grid на
  mobile, tablet і desktop.
- Visual і controller order на всіх viewport визначає
  `responsiveOrder ?? sourceIndex + 1`.
- Slot без combo data показується як `disabledNoComboData` і не selectable.
- Selecting kameo завершує required MK1 context.
- `UI-CMP-009` не показується в `MKXL` variant.
- `UI-CMP-009` не показує variation options.
- Controller/keyboard focus у picker не тригерить combo card actions у background.

## Тестові сценарії

- Без selected main character picker перебуває у `waitingForMainCharacter`.
- Вибір MK1 main character показує `MK1.kameo` layout.
- Desktop, tablet і mobile Command Deck не створюють overlap або horizontal overflow
  та зберігають усі non-placeholder slots.
- Selectable kameo емітить `requestSelectKameo`.
- Disabled kameo slot не емітить selection і має readable disabled reason.
- Зміна main character скидає incompatible selected kameo.
- `Clear filters` не очищає selected kameo.
- Controller navigation на desktop, tablet і mobile рухається лінійно по prepared
  order, пропускає inert slots і clamp-иться на краях.

## Відкриті уточнення

- Точний copy disabled reasons має відповідати shared empty/error state style.

## Step 26 Readability Contract

- `PickerOption.description` і localized `countLabel` є видимими частинами kameo option.
- Long UA kameo labels, descriptions, counts і disabled reasons wrap-ляться; fixed slot height не може обрізати текст.
- Text label лишається primary affordance навіть коли option має icon або portrait.

## Command Deck Presentation

- `presentation = standard | commandDeck`; `commandDeck` є full-workspace кроком `02 / Kameo` і використовує ту саму anatomy, що variation selector.
- Locked fighter та pair availability є prepared inputs. Компонент не виконує MK1 branching і не перевіряє compatibility самостійно.
- `focusedSlotId`, stable `slotId`, selected kameo та unavailable state мають незалежне visible/semantic wiring.
- Count/countLabel описують prepared pair results; unavailable pair лишається видимою, inert і має readable reason.
- Portrait kameo cards показують `64×64px` authored image або missing-asset fallback,
  label під ним, numeric count badge, окремий selected/controller marker і readable
  disabled reason; fixed-height truncation заборонена.
- Catalog не передає `backLabel` або `message`; header description і selected-fighter
  context збережені. Optional standalone `returnToCharacterPicker` лишається
  semantic back intent, а `selectKameo` — confirm intent.
- Prepared order не змінює authored identity, а reduced motion не впливає на доступність surface.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile`, `tablet` і `desktop` Command Deck використовують один compact portrait
  grid та linear prepared order navigation;
- left/up — previous, right/down — next; inert slots пропускаються, краї не цикляться;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
