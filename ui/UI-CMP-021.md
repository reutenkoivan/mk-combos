# UI-CMP-021: Add-To-List Dialog

## Метадані

- Код: `UI-CMP-021`
- Назва: Add-To-List Dialog
- Тип: `component / dialog`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські сторінки: [`UI-PAGE-003`](./UI-PAGE-003.md), [`UI-PAGE-004`](./UI-PAGE-004.md), [`UI-PAGE-005`](./UI-PAGE-005.md), [`UI-PAGE-006`](./UI-PAGE-006.md)

## Призначення

`UI-CMP-021` показує compatible named lists для active combo і дозволяє попросити page/app flow додати combo до list.

## Володіння

Active page володіє open/closed state, active combo context, compatible lists, membership state, saving/error state і persistence. `UI-CMP-021` є page-level singleton, не repeated child card instance.

## Анатомія

Розміщення dialog читається як overlay -> surface -> summary/body/status/actions; compatible lists стоять у body між combo summary і action row.

```jsx
<AddToListDialog ui="UI-CMP-021">
  <Show when={isAddToListDialogOpen}>
    <AddToListDialogOverlay owner="page">
      <AddToListDialogSurface>
        <Stack name="AddToListDialogLayout">
          <DialogHeaderTitle />
          <ComboSummaryRegion />

          <CompatibleListSelectionRegion>
            <CompatibleListOption />
          </CompatibleListSelectionRegion>

          <Show when={hasCurrentMembershipStatus}>
            <CurrentMembershipStatusRegion />
          </Show>

          <Show when={hasCreateListShortcut}>
            <CreateListShortcut />
          </Show>

          <DialogActionRow>
            <Group name="DialogActions">
              <SubmitAction />
              <CloseCancelAction />
            </Group>
          </DialogActionRow>
        </Stack>
      </AddToListDialogSurface>
    </AddToListDialogOverlay>
  </Show>
</AddToListDialog>
```

Правила розміщення:

- Dialog не монтується всередині кожної combo card; active page відкриває один singleton surface.
- Action row завжди нижче selection/status body і не містить file/browser events.
- Анатомія не володіє dialog open state або persistence; active page передає prepared dialog model.

## Вхідні дані

- active combo ref, summary, source surface і source focus target.
- compatible named lists for combo game.
- current membership state, persistence availability, saving/error state.
- create-list availability, якщо page дозволяє цей shortcut.

## Вихідні події

- `requestSubmitAddToList(payload)`.
- `requestCloseAddToList(payload)`.
- `requestCreateListFromDialog(payload)`.
- `requestRetryAddToList(payload)`.

Payload містить combo ref, target list id, source surface і source focus target. Об'єкти browser events не передаються.

## Межі відповідальності

Компонент не створює named list самостійно, не пише membership, не змінює combo data і не показує lists іншої гри.

## Критерії приймання

- Dialog singleton controlled active page.
- Duplicate membership показує already-in-list або idempotent state без mutation.
- Close/cancel повертає focus до source target.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
