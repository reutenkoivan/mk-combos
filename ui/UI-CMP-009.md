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

Компонент показується після selected `MK1` main character і дає вибрати kameo у layout, який повторює in-game MK1 kameo select UI.

Kameo не є optional filter facet. Він належить до required `contextRow` у `UI-CMP-012 Combo List Config Module` і визначає базову область combo list разом із selected main character.

## Володіння

`UI-PAGE-003 MK1 Catalog Variant` володіє selected main character і selected kameo. Available kameo data, disabled reasons, layout descriptors і combo availability приходять із `mk1/catalog` через `@mk-combos/mk1-business`.

`UI-CMP-012 Combo List Config Module` отримує placement picker-а у `contextRow` і controlled focus handoff після main character selection від Catalog page model.

`UI-CMP-009` відповідає тільки за:

- рендер full MK1 kameo layout;
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

### Широке розміщення

Wide layout застосовується для viewport/device class від `13.6-inch` і більше.

Rules:

- використовувати exact `row` і `column` для in-game MK1 kameo select UI;
- не reflow-ити kameo slots;
- не сортувати kameos alphabetically;
- зберігати disabled або placeholder positions.

### Компактне розміщення

Для менших екранів kameo grid може реорганізовуватись.

Rules:

- використовувати `responsiveOrder`, якщо він заданий;
- якщо `responsiveOrder` відсутній, logical order виводиться з `row`, потім `column`;
- selected/focused state зберігається під час переходу між layouts;
- усі non-placeholder kameo slots лишаються reachable або readable.

## Анатомія

Розміщення є picker surface після main character picker: context label стоїть над kameo grid, status region нижче grid.

```jsx
<KameoPicker ui="UI-CMP-009">
  <KameoPickerSurface slot="UI-CMP-012 contextRow">
    <Stack name="KameoPickerLayout">
      <PickerLabel />
      <SelectedMainCharacterContextLabel />

      <KameoGrid>
        <KameoSlot>
          <Stack name="KameoSlotContent">
            <KameoPortraitOrFallbackMark />
            <KameoLabel />
          </Stack>

          <Show when={isSelectedOrFocused}>
            <SelectedFocusedIndicator />
          </Show>

          <Show when={isDisabledOrPlaceholder}>
            <DisabledPlaceholderState />
          </Show>
        </KameoSlot>
      </KameoGrid>

      <Show when={hasStatusLiveRegion}>
        <StatusLiveRegion />
      </Show>
    </Stack>
  </KameoPickerSurface>
</KameoPicker>
```

Правила розміщення:

- У `UI-CMP-012` компонент стоїть поруч із `UI-CMP-007` на `desktop` або нижче нього на `mobile` і `tablet`.
- Kameo slots використовують prepared `MK1.kameo` layout і не додають власне сортування.
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

## Вихідні події

- `requestSelectKameo`: вибрати focused/selectable kameo.
- `requestFocusKameoSlot`: змінити focused kameo slot.
- `requestReturnToCharacterPicker`: optional focus handoff назад до `UI-CMP-007`.
- `requestClearKameo`: optional очистити selected kameo, якщо parent flow дозволяє.

## Межі відповідальності

Компонент відповідає за:

- full MK1 kameo layout;
- exact wide `row`/`column` placement;
- mobile і tablet adaptive order;
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

Kameo існує в in-game layout, але для selected `character + kameo` ще немає combo data.

Очікуваний UI:

- slot лишається видимим у correct in-game position;
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

### Wide And Compact Navigation

На `desktop`:

- directional navigation рухається по `row`/`column`;
- visual positions не reflow-яться;
- disabled slots не selectable.

На `mobile` і `tablet`:

- navigation рухається за `responsiveOrder`;
- wrapping не змінює logical order;
- focus не губиться під час reflow.

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
- Kameo layout після selected main character повторює in-game MK1 kameo select UI на `desktop`.
- Compact layout може реорганізовуватись тільки через stable logical order.
- Slot без combo data показується як `disabledNoComboData` і не selectable.
- Selecting kameo завершує required MK1 context.
- `UI-CMP-009` не показується в `MKXL` variant.
- `UI-CMP-009` не показує variation options.
- Controller/keyboard focus у picker не тригерить combo card actions у background.

## Тестові сценарії

- Без selected main character picker перебуває у `waitingForMainCharacter`.
- Вибір MK1 main character показує `MK1.kameo` layout.
- Wide layout збігається з in-game MK1 kameo slot positions.
- Compact layout не створює overlap і зберігає all non-placeholder slots.
- Selectable kameo емітить `requestSelectKameo`.
- Disabled kameo slot не емітить selection і має readable disabled reason.
- Зміна main character скидає incompatible selected kameo.
- `Clear filters` не очищає selected kameo.
- Controller navigation у wide layout рухається по `row`/`column`.
- Controller navigation у mobile і tablet layout рухається по `responsiveOrder`.

## Відкриті уточнення

- Exact `row`/`column` coordinates для `MK1.kameo` мають бути заведені в layout registry під час data implementation.
- Точний copy disabled reasons має відповідати shared empty/error state style.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
