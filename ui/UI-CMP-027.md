# UI-CMP-027: Export Dialog

## Метадані

- Код: `UI-CMP-027`
- Назва: Export Dialog
- Тип: `component / backup dialog`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Батьківський компонент: [`UI-CMP-034 Backup Collapsible Block`](./UI-CMP-034.md)

## Призначення

`UI-CMP-027` показує optional confirmation/details перед export full backup.

## Володіння

`UI-PAGE-008` або page-level backup hook володіє export dialog state, backup generation state і download flow. `UI-CMP-027` рендерить controlled dialog model.

## Анатомія

Розміщення dialog читається як overlay -> surface -> export summary -> warning/status -> actions.

```text
UI-CMP-027 Export Dialog
  └─ (overlay, page-owned singleton) Dialog overlay
     └─ (inside overlay) Dialog surface
        ├─ (top) Dialog header / export title
        ├─ (below header) Export summary region
        ├─ (below summary, conditional) Warning/error message region
        └─ (bottom) Dialog action row
           ├─ Confirm export action
           └─ Cancel/close action
```

Правила розміщення:

- Dialog відкривається від Settings backup flow як singleton overlay, а не всередині collapsed block geometry.
- Warning/error message стоїть перед action row і не блокує close action.
- Анатомія не генерує backup envelope і не запускає download; це належить Settings/App Shell flow.

## Вхідні дані

- backup generation state, export availability і local state summary.
- optional warning/error message.
- source focus target і active language.

## Вихідні події

- `requestConfirmExport(payload)`.
- `requestCancelExport(payload)`.
- `requestCloseExportDialog(payload)`.

Payload містить action id, reason і source focus target. Об'єкти browser events не передаються.

## Межі відповідальності

Компонент не читає seeded data, не генерує backup JSON, не запускає browser download і не змінює local state.

## Критерії приймання

- Export busy/error state controlled сторінкою.
- Cancel не мутує local state.
- Focus повертається до source target після close.
