# UI-CMP-027: Export Dialog

## Метадані

- Код: `UI-CMP-027`
- Назва: Export Dialog
- Тип: `component / backup dialog`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Батьківський компонент: [`UI-CMP-034 Backup Collapsible Block`](./UI-CMP-034.md)

## Призначення

`UI-CMP-027` показує optional confirmation/details перед export backup для однієї гри.

## Володіння

`UI-PAGE-008` або page-level backup hook володіє export dialog state, backup generation state і download flow. `UI-CMP-027` рендерить controlled dialog model.

## Анатомія

Розміщення dialog читається як overlay -> surface -> export summary -> warning/status -> actions.

```jsx
<ExportDialog ui="UI-CMP-027">
  <Show when={isExportDialogOpen}>
    <ExportDialogOverlay owner="page">
      <ExportDialogSurface>
        <Stack name="ExportDialogLayout">
          <DialogHeaderExportTitle />
          <ExportSummaryRegion />

          <Show when={hasWarningErrorMessage}>
            <WarningErrorMessageRegion />
          </Show>

          <DialogActionRow>
            <Group name="DialogActions">
              <ConfirmExportAction />
              <CancelCloseAction />
            </Group>
          </DialogActionRow>
        </Stack>
      </ExportDialogSurface>
    </ExportDialogOverlay>
  </Show>
</ExportDialog>
```

Правила розміщення:

- Dialog відкривається від Settings backup flow як singleton overlay, а не всередині collapsed block geometry.
- Warning/error message стоїть перед action row і не блокує close action.
- Анатомія не генерує backup envelope і не запускає download; це належить Settings/App Shell flow.

## Вхідні дані

- target `gameId`/game label, backup generation state, export availability і summary цієї game slice.
- optional warning/error message.
- source focus target і active language.

## Вихідні події

- `requestConfirmExport(payload)`.
- `requestCancelExport(payload)`.
- `requestCloseExportDialog(payload)`.

Payload містить action id, reason і source focus target. Об'єкти browser events не передаються.

## Межі відповідальності

Компонент не читає seeded data, не генерує `GameBackupEnvelope`, не запускає browser download і не змінює local state. Він не показує global settings або slices інших ігор як частину export.

## Критерії приймання

- Export busy/error state controlled сторінкою.
- Summary однозначно називає target game і пояснює, що файл містить лише її user slice.
- Cancel не мутує local state.
- Focus повертається до source target після close.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `desktop` dialog центрується відносно viewport, має ширину до `34rem` і `max-height: 88dvh`;
- `mobile` і `tablet` dialog рендериться як bottom sheet: mobile займає всю ширину, tablet обмежений `42rem`, safe-area лишається всередині surface, а overflow не зміщує backdrop або sticky actions;
- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.

## Flat Workspace Visual Contract

- Компонент входить в один page canvas і не створює card wrapper для звичайного content flow.
- Повна border, radius і shadow дозволені тільки owning overlay surface; peer content regions використовують spacing та один separator.
- Standalone icon-only actions використовують transparent `icon` presentation без background, visible border або inset shadow у всіх states; focus лишається зовнішнім ring.
- Text controls, `icon + text` actions, notation keycaps, validation і focus indicators зберігають необхідні interaction boundaries.
