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

Компонент показується після selected `MKXL` character і дає вибрати variation у layout, який повторює in-game MKXL variation selection UI для цього character.

Picker не є generic dropdown або optional filter. Variation належить до required `contextRow` у `UI-CMP-012 Combo List Config Module` і визначає базову область combo list разом із selected character.

## Володіння

`UI-PAGE-003 MKXL Catalog Variant` володіє selected character, selected variation, available variation data і combo availability.

`UI-CMP-012 Combo List Config Module` володіє placement picker-а у `contextRow` і focus handoff після character selection.

`UI-CMP-008` відповідає тільки за:

- рендер variation layout для selected MKXL character;
- selected, focused, disabled і placeholder state variation slots;
- keyboard/controller navigation усередині variation layout;
- selection event для parent variant flow.

## Layout Data Contract

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
  compactOrder?: number;
  status: "selectable" | "disabledNoComboData" | "placeholder";
};
```

Для `UI-CMP-008` дозволений layout key:

- `MKXL.variation`.

`optionId` є stable variation id для selected character. Layout registry має підтримувати per-character variation slots, якщо in-game placement або labels відрізняються між characters.

### Wide Layout

Wide layout застосовується для viewport/device class від `13.6-inch` і більше.

Rules:

- використовувати exact `row` і `column` для in-game MKXL variation selection UI;
- не reflow-ити variation slots;
- не сортувати variations alphabetically;
- зберігати disabled або placeholder positions.

### Compact Layout

Для менших екранів variation layout може реорганізовуватись.

Rules:

- використовувати `compactOrder`, якщо він заданий;
- якщо `compactOrder` відсутній, logical order виводиться з `row`, потім `column`;
- selected/focused state зберігається під час переходу між layouts;
- усі selectable і disabled variation slots лишаються reachable або readable.

## Anatomy

```text
UI-CMP-008 Variation Picker
  ├─ Root picker surface
  ├─ Visible label або accessible label
  ├─ Selected character context label
  ├─ Variation layout
  │  └─ Variation slot
  │     ├─ Variation label
  │     ├─ Optional short description або icon
  │     ├─ Selected/focused indicator
  │     └─ Disabled або placeholder state
  └─ Optional status/live region
```

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
- `viewportClass`: `wide13_6Plus` або `compact`.
- `focusedSlotId`: поточний focus target.
- `activeLanguage`: `EN` або `UA`.

## Вихідні події

- `requestSelectVariation`: вибрати focused/selectable variation.
- `requestFocusVariationSlot`: змінити focused variation slot.
- `requestReturnToCharacterPicker`: optional focus handoff назад до `UI-CMP-007`.
- `requestClearVariation`: optional очистити selected variation, якщо parent flow дозволяє.

## Межі відповідальності

Компонент відповідає за:

- in-game MKXL variation layout для selected character;
- exact wide `row`/`column` placement;
- compact adaptive order;
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

Variation існує в in-game layout, але для `character + variation` ще немає combo data.

Очікуваний UI:

- slot лишається видимим у correct in-game position;
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
- Layout не покладається тільки на колір.

## Критерії приймання

- `UI-CMP-008` має окрему повну специфікацію.
- `MKXL.variation` є explicit layout key.
- Variation layout після selected character повторює in-game MKXL variation selection UI на `wide13_6Plus`.
- Compact layout може реорганізовуватись тільки через stable logical order.
- Slot без combo data показується як `disabledNoComboData` і не selectable.
- Selecting variation завершує required MKXL context.
- `UI-CMP-008` не показується в `MK1` variant.
- `UI-CMP-008` не показує kameo options.
- Controller/keyboard focus у picker не тригерить combo card actions у background.

## Тестові сценарії

- Без selected character picker перебуває у `waitingForCharacter`.
- Вибір MKXL character показує `MKXL.variation` layout.
- Wide layout збігається з in-game MKXL variation slot positions.
- Compact layout не створює overlap і зберігає all non-placeholder slots.
- Selectable variation емітить `requestSelectVariation`.
- Disabled variation slot не емітить selection і має readable disabled reason.
- Зміна character скидає incompatible selected variation.
- `Clear filters` не очищає selected variation.
- Controller navigation у wide layout рухається по `row`/`column`.
- Controller navigation у compact layout рухається по `compactOrder`.

## Відкриті уточнення

- Exact `row`/`column` coordinates для `MKXL.variation` мають бути заведені в layout registry під час data implementation.
- Точний copy disabled reasons має відповідати shared empty/error state style.
