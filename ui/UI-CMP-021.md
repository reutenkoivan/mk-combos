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

```text
UI-CMP-021 Add-To-List Dialog
  └─ (overlay, page-owned singleton) Dialog overlay
     └─ (inside overlay) Dialog surface
        ├─ (top) Dialog header / title
        ├─ (below header) Combo summary region
        ├─ (below summary) Compatible list selection region
        │  └─ (inside list) Compatible list option
        ├─ (below selection, conditional) Current membership/status region
        ├─ (below status, optional) create-list shortcut
        └─ (bottom) Dialog action row
           ├─ Submit action
           └─ Close/cancel action
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
