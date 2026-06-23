# UI-CMP-026: Builder Action Bar

## Метадані

- Код: `UI-CMP-026`
- Назва: Builder Action Bar
- Тип: `component / builder actions`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md)

## Призначення

`UI-CMP-026` показує finish, undo, cancel і optional add saved combo actions для builder flow.

## Володіння

`UI-PAGE-006` володіє dirty state, save state, undo availability, finish availability, cancel confirmation і saved combo context. `UI-CMP-026` рендерить controlled action model.

## Анатомія

Розміщення action bar є нижнім command row builder flow: primary actions стоять поруч, status region прив'язана до цих actions, optional add-to-list action з'являється після save.

```text
UI-CMP-026 Builder Action Bar
  └─ (below UI-CMP-035/UI-CMP-036 workspace) Корінь action bar
     ├─ (left/top) Undo action
     ├─ (left/primary) Finish/save action
     ├─ (right/below) Cancel action
     ├─ (below actions, conditional) Save/busy/error status region
     └─ (right/below after save, optional) add saved combo to list action
```

Правила розміщення:

- На `wide13_6Plus` actions можуть бути в одному horizontal row; на `compact` вони stack-яться з primary action перед destructive/cancel.
- Status region стоїть під affected actions і не змінює availability самостійно.
- Анатомія не вирішує, чи combo валідний; availability приходить із page-level builder flow.

## Вхідні дані

- `canUndo`, `canFinish`, `canCancel`, `dirtyState`, `saveState`.
- finish/cancel/undo disabled reasons.
- optional saved custom combo id and add-to-list availability.
- focus target і active language.

## Вихідні події

- `requestUndoMove(payload)`.
- `requestFinishBuilder(payload)`.
- `requestCancelBuilder(payload)`.
- `requestConfirmCancelBuilder(payload)`.
- `requestOpenSavedComboAddToList(payload)`.

Payload містить action id, builder mode, reason і source focus target.

## Межі відповідальності

Компонент не зберігає custom combo, не пише localStorage, не валідить graph і не читає controller input напряму.

## Критерії приймання

- Busy/disabled states controlled сторінкою.
- Cancel confirmation не запускається без page intent.
- Actions емітять semantic payload.
