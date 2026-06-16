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

`UI-PAGE-003 MK1 Catalog Variant` володіє selected main character, selected kameo, kameo data і combo availability.

`UI-CMP-012 Combo List Config Module` володіє placement picker-а у `contextRow` і focus handoff після main character selection.

`UI-CMP-009` відповідає тільки за:

- рендер full MK1 kameo layout;
- selected, focused, disabled і placeholder state kameo slots;
- keyboard/controller navigation усередині kameo grid;
- selection event для parent variant flow.

## Layout Data Contract

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
  compactOrder?: number;
  status: "selectable" | "disabledNoComboData" | "placeholder";
};
```

Для `UI-CMP-009` дозволений layout key:

- `MK1.kameo`.

`optionId` є stable kameo id із seeded/domain registry. Kameo layout не має використовувати main character roster coordinates.

### Wide Layout

Wide layout застосовується для viewport/device class від `13.6-inch` і більше.

Rules:

- використовувати exact `row` і `column` для in-game MK1 kameo select UI;
- не reflow-ити kameo slots;
- не сортувати kameos alphabetically;
- зберігати disabled або placeholder positions.

### Compact Layout

Для менших екранів kameo grid може реорганізовуватись.

Rules:

- використовувати `compactOrder`, якщо він заданий;
- якщо `compactOrder` відсутній, logical order виводиться з `row`, потім `column`;
- selected/focused state зберігається під час переходу між layouts;
- усі non-placeholder kameo slots лишаються reachable або readable.

## Anatomy

```text
UI-CMP-009 Kameo Picker
  ├─ Root picker surface
  ├─ Visible label або accessible label
  ├─ Selected main character context label
  ├─ Kameo grid
  │  └─ Kameo slot
  │     ├─ Portrait або fallback mark
  │     ├─ Kameo label
  │     ├─ Selected/focused indicator
  │     └─ Disabled або placeholder state
  └─ Optional status/live region
```

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
- `viewportClass`: `wide13_6Plus` або `compact`.
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
- compact adaptive order;
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

На `wide13_6Plus`:

- directional navigation рухається по `row`/`column`;
- visual positions не reflow-яться;
- disabled slots не selectable.

На `compact`:

- navigation рухається за `compactOrder`;
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
- Layout не покладається тільки на колір.

## Критерії приймання

- `UI-CMP-009` має окрему повну специфікацію.
- `MK1.kameo` є explicit layout key.
- Kameo layout після selected main character повторює in-game MK1 kameo select UI на `wide13_6Plus`.
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
- Controller navigation у compact layout рухається по `compactOrder`.

## Відкриті уточнення

- Exact `row`/`column` coordinates для `MK1.kameo` мають бути заведені в layout registry під час data implementation.
- Точний copy disabled reasons має відповідати shared empty/error state style.
