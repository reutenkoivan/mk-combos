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

Розміщення header читається як compact identity block: title/source зверху, context chips нижче, primary actions праворуч або під title, critical marker і return slot займають окремі predictable positions.

```text
UI-CMP-014 Combo Detail Header
  └─ (top of UI-PAGE-004 detail root) Header root
     ├─ (top/left) Title and source row
     ├─ (below title) Game/context chip group
     ├─ (right, wide13_6Plus / below chips, compact) Primary action group
     │  ├─ Add-to-list action
     │  └─ Duplicate/edit/repair action, якщо доступна як primary
     ├─ (below chips/actions, conditional) Stale/invalid marker slot
     │  └─ UI-CMP-031 Stale/Invalid Combo Marker
     └─ (top-left або below, parent-defined) Return/source navigation slot
```

Правила розміщення:

- Title/source region є першим readable block, навіть якщо return action візуально стоїть перед ним.
- На `wide13_6Plus` action group може бути праворуч від title/chips; на `compact` він переходить нижче chips.
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
