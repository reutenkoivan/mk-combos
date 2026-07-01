# UI-CMP-028: Import Preview Dialog

## Метадані

- Код: `UI-CMP-028`
- Назва: Import Preview Dialog
- Тип: `component / backup dialog`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Батьківський компонент: [`UI-CMP-034 Backup Collapsible Block`](./UI-CMP-034.md)

## Призначення

`UI-CMP-028` показує parsed backup summary, validation result і destructive replace confirmation.

## Володіння

`UI-PAGE-008` або page-level backup hook володіє parsed backup candidate, validation result, import busy state і final replace mutation. `UI-CMP-028` рендерить controlled preview model.

## Анатомія

Розміщення dialog читається як overlay -> surface -> parsed summary -> validation -> replace impact -> warning -> actions.

```jsx
<ImportPreviewDialog ui="UI-CMP-028">
  <Show when={isImportPreviewDialogOpen}>
    <ImportPreviewDialogOverlay owner="page">
      <ImportPreviewDialogSurface>
        <Stack name="ImportPreviewDialogLayout">
          <DialogHeaderImportTitle />
          <ParsedBackupSummaryRegion />
          <ValidationResultRegion />
          <ReplaceImpactSummary />

          <Show when={hasDestructiveConfirmationWarning}>
            <DestructiveConfirmationWarning />
          </Show>

          <DialogActionRow>
            <Group name="DialogActions">
              <ConfirmReplaceAction />
              <RetryFileSelectionAction />
              <CancelCloseAction />
            </Group>
          </DialogActionRow>
        </Stack>
      </ImportPreviewDialogSurface>
    </ImportPreviewDialogOverlay>
  </Show>
</ImportPreviewDialog>
```

Правила розміщення:

- Dialog відкривається тільки після page/app-level file picker result і validation model.
- Retry action повертає в Settings import flow; component не читає native file input і не передає browser event.
- Анатомія не парсить file і не виконує replace; file picker result уже нормалізовано page/app flow.

## Вхідні дані

- parsed backup summary, validation result і replace impact summary.
- import busy/error state, destructive confirmation availability і source focus target.
- active language.

## Вихідні події

- `requestConfirmBackupReplace(payload)`.
- `requestCancelImport(payload)`.
- `requestCloseImportPreview(payload)`.
- `requestRetryBackupFileSelection(payload)`.

Payload містить backup candidate id або validation result id, reason і source focus target. Подія native file input не передається.

## Межі відповідальності

Компонент не парсить JSON, не виконує replace, не приховує validation errors і не змінює seeded combo data.

## Критерії приймання

- Replace action явно destructive.
- Invalid backup не може перейти в confirm replace.
- Cancel/close не мутує local state.
