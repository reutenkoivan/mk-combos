# UI-CMP-014: Combo Detail Header

## Метадані

- Код: `UI-CMP-014`
- Назва: Combo Detail Header
- Тип: `component / detail header`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-004 Combo Detail`](./UI-PAGE-004.md)

## Призначення

`UI-CMP-014` показує title, source/type chips, primary action availability і stale/invalid marker entry point для active combo detail.

## Володіння

`UI-PAGE-004` володіє detail route context, active combo model, actions availability і add-to-list dialog state. `UI-CMP-014` рендерить controlled header model і емітить semantic intents.

## Анатомія

Розміщення header читається як mobile і tablet identity block: title/source зверху, context chips нижче, primary actions праворуч або під title, critical marker і return slot займають окремі predictable positions.

```jsx
<ComboDetailHeader ui="UI-CMP-014">
  <ComboDetailHeaderRegion slot="UI-PAGE-004 DetailSurface">
    <Stack name="HeaderLayout">
      <TitleAndSourceRow />
      <GameContextChipGroup />

      <PrimaryActionGroup>
        <Group name="PrimaryActions">
          <AddToListAction />

          <Show when={hasDuplicateEditRepairPrimaryAction}>
            <DuplicateEditRepairAction />
          </Show>
        </Group>
      </PrimaryActionGroup>

      <Show when={hasStaleInvalidMarker}>
        <StaleInvalidMarkerSlot>
          <StaleInvalidComboMarker ui="UI-CMP-031" />
        </StaleInvalidMarkerSlot>
      </Show>

      <Show when={hasReturnSourceNavigation}>
        <ReturnSourceNavigationSlot />
      </Show>
    </Stack>
  </ComboDetailHeaderRegion>
</ComboDetailHeader>
```

Правила розміщення:

- Title/source region є першим readable block, навіть якщо return action візуально стоїть перед ним.
- На `desktop` action group може бути праворуч від title/chips; на `mobile` і `tablet` він переходить нижче chips.
- Marker slot не приховується всередині actions і не виконує repair самостійно; ці дії лишаються page-level intents.

## Вхідні дані

- combo title, source type, game context і summary chips.
- primary action availability: add-to-list, duplicate, edit або repair.
- stale/invalid marker model для `UI-CMP-031`, якщо потрібно.
- source return label, loading/disabled state і active language.

## Вихідні події

- `requestOpenAddToList(payload)`.
- `requestDuplicateCombo(payload)`.
- `requestEditCustomCombo(payload)`.
- `requestRepairCustomCombo(payload)`.
- `requestReturnToSource(payload)`.

Payload містить combo id, source type, source surface і source focus target.

## Межі відповідальності

Компонент не виконує route navigation, не валідить combo, не зберігає membership і не передає browser events у page handlers.

## Критерії приймання

- Header action availability повністю controlled сторінкою.
- Stale/invalid marker не приховує critical state.
- Keyboard і controller activation емітять semantic payload.

## Step 26 Readability And Actions

- Title, source і context badges wrap-ляться та не мають fixed content height для long UA copy.
- Недоступні primary actions показують visible `label: disabledReason` після action group.
- Return, add-to-list, duplicate, edit і repair використовують shared icon facade; localized visible labels лишаються обов'язковими.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
