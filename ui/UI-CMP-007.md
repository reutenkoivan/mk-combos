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

Компонент дає вибрати main character у межах active game і має повторювати in-game character select layout відповідної гри:

- `MKXL.character`: full `MKXL` roster layout;
- `MK1.character`: full `MK1` main fighter roster layout.

Picker не є alphabetic list, dropdown або generic card grid. Позиції персонажів задаються explicit layout data, щоб desktop layout збігався з in-game character select screen.

## Володіння

`UI-PAGE-003 Catalog` володіє active `gameId`, selected character і route context. Character options, disabled reasons і layout data приходять із active game catalog business.

`UI-CMP-012 Combo List Config Module` отримує placement picker-а у `contextRow`, controlled focus zone і зв'язок із game-specific picker від Catalog page model.

`UI-CMP-007` відповідає тільки за:

- рендер full roster layout для active game;
- рендер controlled selected, focused, disabled і placeholder state roster slots;
- keyboard/controller navigation intent усередині roster grid;
- semantic selection intent для parent flow.

`UI-CMP-007` не змінює active game і не вибирає variation або kameo.

Компонент не імпортує `mkxl/*` або `mk1/*` напряму; він рендерить descriptors, передані parent flow.

Вихідні handlers приймають abstract payloads із slot/character identifiers і не передають browser event objects.

## Контракт даних розміщення

Picker layout має бути data-driven. Exact slot coordinates зберігаються у roster layout registry, а не виводяться з alphabetic sort, localized label або combo count.

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

Для `UI-CMP-007` дозволені layout keys:

- `MKXL.character`;
- `MK1.character`.

`optionId` є stable character id із seeded/domain registry. `slotId` не має залежати від localized label.

### Широке розміщення

Wide layout застосовується для viewport/device class від `13.6-inch` і більше.

Rules:

- використовувати exact `row` і `column` із layout registry;
- не reflow-ити roster slots;
- не сортувати characters alphabetically;
- не ущільнювати grid через combo counts;
- зберігати visual position навіть для disabled або placeholder slots.

`13.6-inch` має бути реалізований як named responsive breakpoint для MacBook Air-class layout.

### Компактне розміщення

Для менших екранів grid може реорганізовуватись.

Rules:

- використовувати `compactOrder`, якщо він заданий;
- якщо `compactOrder` відсутній, logical order виводиться з `row`, потім `column`;
- selected і focused state зберігаються під час переходу між wide і compact layout;
- усі non-placeholder slots лишаються reachable;
- compact layout не має створювати overlap або недоступні controls.

## Анатомія

Розміщення є picker surface: label стоїть над roster grid, grid містить slots у prepared `row`/`column` або `compactOrder`, status region стоїть нижче grid.

```jsx
<CharacterPicker ui="UI-CMP-007">
  <CharacterPickerSurface slot="UI-CMP-012 contextRow">
    <Stack name="CharacterPickerLayout">
      <PickerLabel />

      <RosterGrid>
        <RosterSlot>
          <Stack name="RosterSlotContent">
            <CharacterPortraitOrFallbackMark />
            <CharacterLabel />
          </Stack>

          <Show when={isSelectedOrFocused}>
            <SelectedFocusedIndicator />
          </Show>

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

- На `wide13_6Plus` grid повторює prepared in-game roster positions; на `compact` slots читаються за `compactOrder`.
- Status/live region не розриває grid і не стає source of truth для selection або focus.
- Selected/focused/disabled indicators живуть усередині slot, щоб не зсувати сусідні slots.

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
- `viewportClass`: `wide13_6Plus` або `compact`.
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
- exact in-game slot placement на `wide13_6Plus`;
- adaptive compact layout через `compactOrder`;
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
- на wide layout positions відповідають `row`/`column`;
- на compact layout options ідуть за `compactOrder`.

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

- slot лишається видимим у correct in-game position;
- slot не емітить selection;
- disabled reason доступний як visible status, tooltip або accessible description;
- color не є єдиним сигналом disabled state.

### `placeholderSlot`

Slot потрібний для збереження in-game geometry, але не має selectable character.

Очікуваний UI:

- slot займає позицію у grid;
- slot не фокусується і не оголошується як selectable character;
- compact layout може пропустити placeholder, якщо це не ламає logical order.

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

### Wide And Compact Navigation

На `wide13_6Plus`:

- `navLeft` / `navRight` рухають focus по `column`;
- `navUp` / `navDown` рухають focus по `row`;
- gaps і placeholders пропускаються або проходяться як non-interactive geometry залежно від implementation, але selection не спрацьовує.

На `compact`:

- navigation іде за `compactOrder`;
- visual wrapping не змінює logical order;
- focus не губиться під час reflow.

## Accessibility

- Picker має visible label або accessible name.
- Roster grid має single-selection semantics.
- Кожен selectable slot має accessible name із localized character label.
- Selected slot має semantic selected або pressed state.
- Disabled slot має `aria-disabled` або native disabled behavior і readable reason.
- Placeholder slot не має бути оголошений як selectable option.
- Focus-visible має бути помітний у light, dark, standard contrast і increased contrast.
- Character portrait не є єдиним label.
- Розміщення не покладається тільки на колір для selected, focused або disabled state.
- Passive layout reflow на compact не має перехоплювати focus.

## Критерії приймання

- `UI-CMP-007` має окрему повну специфікацію.
- `MKXL.character` і `MK1.character` є окремими layout keys.
- Wide layout від `13.6-inch` використовує fixed in-game `row`/`column`.
- Compact layout може реорганізовувати grid тільки через stable logical order.
- Full game roster slots лишаються видимими, навіть якщо combo data неповні.
- Slot без combo data показується як `disabledNoComboData` і не selectable.
- Character selection не змінює active game.
- Character selection не вибирає variation або kameo напряму.
- Controller/keyboard focus у picker не тригерить combo card actions у background.

## Тестові сценарії

- `MKXL.character` wide layout збігається з in-game MKXL character select positions.
- `MK1.character` wide layout збігається з in-game MK1 main fighter select positions.
- Compact layout реорганізовує grid без overlap і без втрати non-placeholder slots.
- Fresh Catalog показує `noCharacterSelected`.
- Selectable character емітить `requestSelectCharacter`.
- Disabled character slot не емітить selection і має readable disabled reason.
- Placeholder slot не фокусується як character option.
- Зміна MKXL character скидає incompatible selected variation на parent рівні.
- Зміна MK1 main character скидає incompatible selected kameo на parent рівні.
- `Clear filters` у `UI-CMP-012` не очищає selected character.
- Controller `confirm` на focused selectable slot вибирає character.
- Controller navigation у wide layout рухається по `row`/`column`.
- Controller navigation у compact layout рухається по `compactOrder`.

## Відкриті уточнення

- Exact `row`/`column` coordinates для `MKXL.character` і `MK1.character` мають бути заведені в roster layout registry під час data implementation.
- Exact portraits або fallback visuals будуть визначені під час UI implementation pass.
