# UI-CMP-007: Character Picker

## Метадані

- Код: `UI-CMP-007`
- Назва: `Character Picker`
- Тип: `component / catalog context selector`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Власник: [`UI-CMP-012 Combo List Config Module`](./UI-CMP-012.md)
- Батьківська сторінка: [`UI-PAGE-003 Catalog`](./UI-PAGE-003.md)
- Variant docs: [MKXL](./UI-PAGE-003-MKXL.md), [MK1](./UI-PAGE-003-MK1.md)
- Пов'язані компоненти: [`UI-CMP-008 Variation Picker`](./UI-CMP-008.md), [`UI-CMP-009 Kameo Picker`](./UI-CMP-009.md)
- Пов'язані UX сценарії: `US-003`, `US-004`, `US-005`, `US-006`, `US-019`

## Призначення

`UI-CMP-007 Character Picker` є required context selector у `UI-CMP-012 Combo List Config Module`.

Компонент дає вибрати main character у межах active game і показує повний roster у
fluid portrait grid зі стабільним game-owned порядком:

- `MKXL.character`: full `MKXL` roster layout;
- `MK1.character`: full `MK1` main fighter roster layout.

Picker не є alphabetic list, dropdown або generic card grid. Порядок персонажів
задається explicit `responsiveOrder`, а кількість combo не впливає на сортування чи
розмір slot-а.

## Володіння

`UI-PAGE-003 Catalog` володіє active `gameId`, selected character і route context. Character options, disabled reasons і layout data приходять із active game catalog business.

`UI-CMP-012 Combo List Config Module` рендерить picker як єдину required-context surface кроку `01 / Fighter roster` і отримує controlled focus від Catalog page model.

`UI-CMP-007` відповідає тільки за:

- рендер full roster layout для active game;
- рендер controlled selected, focused, disabled і placeholder state roster slots;
- keyboard/controller navigation intent усередині roster grid;
- semantic selection intent для parent flow.

`UI-CMP-007` не змінює active game і не вибирає variation або kameo.

Компонент не імпортує `mkxl/*` або `mk1/*` напряму; він рендерить descriptors, передані parent flow.

Вихідні handlers приймають abstract payloads із slot/character identifiers і не передають browser event objects.

## Контракт даних розміщення

Picker layout має бути data-driven. `responsiveOrder` і authored coordinates
зберігаються у roster layout registry, а не виводяться з alphabetic sort, localized
label або combo count.

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

Для `UI-CMP-007` дозволені layout keys:

- `MKXL.character`;
- `MK1.character`.

`optionId` є stable character id із seeded/domain registry. `slotId` не має залежати від localized label.

### Fluid character placement

`commandDeck` Character Picker використовує однакову fluid-модель на `mobile`,
`tablet` і `desktop`:

- grid template: `repeat(auto-fit, minmax(min(7.5rem, 100%), 1fr))`;
- grid має максимальну ширину `96rem` і центрується в доступному workspace;
- visual і logical order завжди визначає prepared `responsiveOrder`;
- authored `row` і `column` не додаються як inline placement для character mode;
- disabled і placeholder slots не змінюють порядок сусідніх character options;
- selected і focused identity зберігаються під час reflow.

`row` і `column` залишаються в стабільному `PickerSlot` contract без змін. Вони
потрібні authored coordinate mode інших picker-ів, зокрема Variation/Kameo на
desktop step `02`; Character Picker не змінює ці consumer contracts.

## Анатомія

Розміщення є picker surface: label стоїть над roster grid, grid містить slots у
prepared `responsiveOrder`, status region стоїть нижче grid.

```jsx
<CharacterPicker ui="UI-CMP-007">
  <CharacterPickerSurface slot="UI-CMP-012 character step">
    <Stack name="CharacterPickerLayout">
      <PickerLabel />

      <RosterGrid>
        <RosterSlot>
          <Stack name="RosterSlotContent">
            <PortraitFrame size="64x64">
              <CharacterPortraitOrFallbackMark />
              <ComboCountBadge placement="top-right" />
            </PortraitFrame>
            <CharacterLabel />
            <CharacterDescriptionOrDisabledReason />
          </Stack>
          <SelectedControllerMarker placement="tile-top-left" />

          <Show when={isDisabledOrPlaceholder}>
            <DisabledPlaceholderState />
          </Show>
        </RosterSlot>
      </RosterGrid>

      <Show when={hasStatusLiveRegion}>
        <StatusLiveRegion />
      </Show>
    </Stack>
  </CharacterPickerSurface>
</CharacterPicker>
```

Правила розміщення:

- На всіх responsive modes grid читає slots за `responsiveOrder` і fluid reflow не змінює logical order.
- Portrait/fallback має стабільний квадрат `64×64px`; label стоїть під ним по центру без truncation.
- Numeric count badge лежить поверх правого верхнього кута portrait, а selected/controller marker — у протилежному куті.
- Status/live region не розриває grid і не стає source of truth для selection або focus.
- Overlay badges та selected/focused/disabled indicators живуть усередині slot і не змінюють його геометрію.

## Вхідні дані

- `activeGame`: `MKXL` або `MK1`.
- `layoutKey`: `MKXL.character` або `MK1.character`.
- `pickerSlots`: ordered layout slot data для active `layoutKey`.
- `charactersById`: character metadata, labels і portrait refs.
- `selectedCharacterId`: selected character або empty value.
- `availableComboCounts`: optional counts для character context.
- `disabledReasons`: readable reasons для `disabledNoComboData`.
- `loadingState`: roster layout або character metadata ще готуються.
- `invalidCharacterContext`: selected route/deep link character не знайдено або stale.
- `responsiveMode`: `mobile`, `tablet` або `desktop`.
- `focusedSlotId`: поточний focus target для keyboard/controller navigation.
- `activeLanguage`: `EN` або `UA`.

## Вихідні події

- `requestSelectCharacter`: вибрати focused/selectable character.
- `requestFocusCharacterSlot`: змінити focused roster slot.
- `requestClearCharacter`: optional очистити selected character, якщо parent flow дозволяє.
- `requestMoveToGameSpecificPicker`: optional focus handoff після успішного character selection.

## Межі відповідальності

Компонент відповідає за:

- full roster grid active game;
- fluid character placement через `responsiveOrder` на всіх viewport;
- disabled slots без combo data;
- selected/focused/hover/active states;
- keyboard і semantic controller navigation усередині grid;
- accessible labels, selected state і disabled reasons.

Компонент не відповідає за:

- зміну `game`, `language` або notation display mode;
- завантаження seeded data;
- обчислення combo list;
- вибір `MKXL` variation;
- вибір `MK1` kameo;
- відкриття combo detail;
- route або localStorage writes;
- читання Browser Gamepad API.

## Мапа станів

### `loadingRosterLayout`

Roster layout або character metadata ще готуються.

Очікуваний UI:

- grid dimensions або skeleton зберігають місце під picker;
- interactive selection disabled;
- loading state оголошується assistive technologies.

### `fullRosterReady`

Реєстр розміщення і character metadata готові.

Очікуваний UI:

- показано full roster для active game;
- на mobile, tablet і desktop options ідуть за `responsiveOrder` у fluid grid.

### `noCharacterSelected`

Character ще не вибраний.

Очікуваний UI:

- жоден slot не має selected state;
- перший safe selectable slot може бути focus target;
- combo list не отримує confirm/open detail events.

### `characterSelected`

Character вибраний.

Очікуваний UI:

- selected slot має visible і semantic selected state;
- parent flow показує `UI-CMP-008` для `MKXL` або `UI-CMP-009` для `MK1`;
- incompatible downstream context скидається на parent рівні.

### `disabledNoComboData`

Slot відповідає персонажу з full game roster, але для нього ще немає combo data.

Очікуваний UI:

- slot лишається видимим у prepared responsive position;
- slot не емітить selection;
- disabled reason доступний як visible status, tooltip або accessible description;
- color не є єдиним сигналом disabled state.

### `placeholderSlot`

Slot є prepared non-interactive entry без selectable character.

Очікуваний UI:

- slot займає prepared `responsiveOrder` position у grid;
- slot не фокусується і не оголошується як selectable character;
- controller navigation пропускає placeholder на всіх viewport.

### `invalidCharacterContext`

Route або restored context містить character, якого немає у current layout/data.

Очікуваний UI:

- parent surface показує recoverable `notFound` або nearest valid context;
- picker не auto-select-ить інший character без explicit user action.

## UI Behavior

### Full Roster

`UI-CMP-007` показує full game roster для active game, а не тільки персонажів із поточними combo results.

Slot status визначає доступність:

- `selectable`: character має достатні data для переходу до наступного required picker;
- `disabledNoComboData`: character є в full roster, але combo data для v1 ще відсутні;
- `placeholder`: позиційний slot без selectable option.

### Selection Flow

1. Користувач фокусує selectable character slot.
2. Користувач активує slot через click, tap, `Enter`, `Space` або controller `confirm`.
3. `UI-CMP-007` емітить `requestSelectCharacter`.
4. Catalog скидає incompatible variation/kameo.
5. Focus переходить до `UI-CMP-008 Variation Picker` у `MKXL` або `UI-CMP-009 Kameo Picker` у `MK1`.

Fresh Catalog не auto-select-ить character.

### Linear Navigation

На `mobile`, `tablet` і `desktop` character focus рухається одним stable sequence за
`responsiveOrder`:

- `navLeft` і `navUp` переходять до попереднього доступного slot-а;
- `navRight` і `navDown` переходять до наступного доступного slot-а;
- disabled і placeholder slots пропускаються;
- visual wrapping не змінює logical order, а focus не губиться під час reflow.

## Accessibility

- Picker має visible label або accessible name.
- Roster grid має single-selection semantics.
- Кожен selectable slot має accessible name із localized character label.
- Якщо option має `count`, accessible name також містить повний localized `countLabel`.
- Numeric overlay badge має `aria-hidden`, не приймає pointer events і не дублює accessible name.
- Selected slot має semantic selected або pressed state.
- Disabled slot має `aria-disabled` або native disabled behavior і readable reason.
- Placeholder slot не має бути оголошений як selectable option.
- Focus-visible має бути помітний у light, dark, standard contrast і increased contrast.
- Character portrait не є єдиним label.
- Розміщення не покладається тільки на колір для selected, focused або disabled state.
- Passive layout reflow на будь-якій ширині не має перехоплювати focus.

## Критерії приймання

- `UI-CMP-007` має окрему повну специфікацію.
- `MKXL.character` і `MK1.character` є окремими layout keys.
- Character grid використовує однаковий fluid template і `responsiveOrder` на всіх viewport.
- Authored `row`/`column` лишаються в public slot contract, але не керують commandDeck character placement.
- Full game roster slots лишаються видимими, навіть якщо combo data неповні.
- Slot без combo data показується як `disabledNoComboData` і не selectable.
- Character selection не змінює active game.
- Character selection не вибирає variation або kameo напряму.
- Controller/keyboard focus у picker не тригерить combo card actions у background.

## Тестові сценарії

- `MKXL.character` і `MK1.character` використовують fluid template на mobile, tablet і desktop.
- `responsiveOrder` стабільно визначає visual та controller order без overlap і втрати non-placeholder slots.
- Fresh Catalog показує `noCharacterSelected`.
- Selectable character емітить `requestSelectCharacter`.
- Disabled character slot не емітить selection і має readable disabled reason.
- Placeholder slot не фокусується як character option.
- Зміна MKXL character скидає incompatible selected variation на parent рівні.
- Зміна MK1 main character скидає incompatible selected kameo на parent рівні.
- `Clear filters` у `UI-CMP-012` не очищає selected character.
- Controller `confirm` на focused selectable slot вибирає character.
- Controller navigation на всіх viewport лінійно рухається по доступних slots у `responsiveOrder`.
- Numeric count badge показує `0`, не скорочує значення до `99+`, а за відсутності count не рендериться.
- Selected/controller marker і numeric badge одночасно видимі та не змінюють геометрію slot-а.

## Step 26 Readability Contract

- `PickerOption.description` рендериться як видимий допоміжний текст, а не лише як прихована metadata.
- Якщо owner передає `count`, він може також передати localized `countLabel`; UI показує
  тільки numeric `count` у круглому destructive/red badge, включно з `0`, а повний
  `countLabel` додає до accessible name.
- Довгі labels, descriptions, counts і disabled reasons переносяться на нові рядки без truncation або overlap.

## Command Deck Presentation

- `presentation = standard | commandDeck`; default `standard` зберігає попередню inline composition.
- `commandDeck` використовується на кроці `01 / Fighter roster` у full-workspace selector surface `UI-CMP-012`.
- Prepared `slotId` є stable focus identifier; DOM id детерміновано складається з `layoutId + slotId`, а `focusedSlotId` керує roving `tabIndex` і `data-controller-focused` без DOM geometry.
- `selectedCharacterId` та `focusedSlotId` є незалежними controlled states. Selected має amber semantic marker/check, controller focus — cool-blue outline; одночасний стан зберігає обидва сигнали.
- Mobile, tablet і desktop поважають `responsiveOrder`; internal portrait/fluid mode не змінює public `CharacterPicker`, `PickerOption` або `PickerSlot` contract.
- Flat vertical option cells не використовують rounded card anatomy. Portrait/fallback має
  `64×64px`, label переноситься під ним, missing portrait показує bordered fallback visual,
  disabled slot — hatch/unavailable presentation із видимою причиною.
- Confirm/click одразу емітить `selectCharacter`; route push, last-selection persistence та перехід на pathname `/:gameId/catalog/:character` належать page owner-у.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- усі responsive modes використовують linear character sequence за `responsiveOrder`;
- `mobile` використовує edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` і `desktop` змінюють лише кількість fluid columns, не logical focus order;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
