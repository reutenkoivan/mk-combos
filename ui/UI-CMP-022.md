# UI-CMP-022: List Edit Dialog

## Метадані

- Код: `UI-CMP-022`
- Назва: List Edit Dialog
- Тип: `component / dialog`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-005 Named Lists`](./UI-PAGE-005.md)

## Призначення

`UI-CMP-022` рендерить create, rename і delete confirmation flows для named lists.

## Володіння

`UI-PAGE-005` володіє dialog mode, draft list name, validation, selected list, submit state і persistence. `UI-CMP-022` отримує controlled dialog model.

## Анатомія

Розміщення dialog читається як overlay -> surface -> mode message -> mode-specific body -> validation -> actions.

```jsx
<ListEditDialog ui="UI-CMP-022">
  <Show when={isListEditDialogOpen}>
    <ListEditDialogOverlay owner="page">
      <ListEditDialogSurface>
        <Stack name="ListEditDialogLayout">
          <ModeSpecificHeadingMessage />

          <Show when={modeIsCreateOrRename}>
            <DraftNameFieldRegion />
          </Show>

          <Show when={modeIsDelete}>
            <DeleteImpactSummary />
          </Show>

          <Show when={hasValidationErrorMessage}>
            <ValidationErrorMessageRegion />
          </Show>

          <DialogActionRow>
            <Group name="DialogActions">
              <SubmitConfirmAction />
              <CancelAction />
            </Group>
          </DialogActionRow>
        </Stack>
      </ListEditDialogSurface>
    </ListEditDialogOverlay>
  </Show>
</ListEditDialog>
```

Правила розміщення:

- Create/rename body і delete confirmation body є mutually exclusive regions у тій самій surface.
- Validation/error message стоїть між body і action row, щоб не перекривати controls.
- Анатомія не валідить draft name і не пише persistence; це робить `UI-PAGE-005`.

## Вхідні дані

- `mode`: `createList`, `renameList` або `deleteListConfirm`.
- active game id, selected list summary, draft name і validation message.
- item count для delete confirmation.
- submit/cancel availability, busy/error state і source focus target.

## Вихідні події

- `requestChangeListDraftName(payload)`.
- `requestSubmitListEdit(payload)`.
- `requestCloseListEdit(payload)`.
- `requestReturnFocusToLists(payload)`.

Payload містить mode, list id, value, reason і source focus target.

## Межі відповідальності

Компонент не пише local state напряму, не додає combo у list, не видаляє combo data і не читає Browser Gamepad API.

## Критерії приймання

- Validation state controlled сторінкою.
- Delete copy пояснює, що combo data не видаляється.
- Submit/cancel events мають semantic payload.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `desktop` dialog центрується відносно viewport, має ширину до `34rem` і `max-height: 88dvh`;
- `mobile` і `tablet` dialog рендериться як bottom sheet: mobile займає всю ширину, tablet обмежений `42rem`, safe-area лишається всередині surface, а overflow не зміщує backdrop або sticky actions;
- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
