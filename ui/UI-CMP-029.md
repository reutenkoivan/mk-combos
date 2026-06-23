# UI-CMP-029: Empty State

## Метадані

- Код: `UI-CMP-029`
- Назва: Empty State
- Тип: `component / system state`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські сторінки: Catalog, Named Lists, Builder, Settings

## Призначення

`UI-CMP-029` показує recoverable empty states для відсутніх results, lists, list items або available actions.

## Володіння

Батьківська сторінка володіє state token, recovery actions і route/persistence behavior. `UI-CMP-029` рендерить prepared empty state model.

## Анатомія

Розміщення empty state займає content/status slot parent surface: message стоїть зверху, details нижче, recovery actions внизу.

```text
UI-CMP-029 Empty State
  └─ (inside parent empty slot) Корінь empty state
     ├─ (top) Title/message region
     ├─ (below message, optional) details ділянка
     └─ (below details/message, conditional) Recovery action region
        └─ Recovery action item
```

Правила розміщення:

- Empty state замінює відсутній list/grid/detail content або стоїть у dedicated system state area parent page.
- Recovery actions завжди нижче message/details і емітять page-level intents.
- Анатомія не запускає recovery сама; recovery actions є page-level intents.

## Вхідні дані

- state token, title, message і optional details.
- recovery actions із ids, labels, availability і disabled reasons.
- source surface, source focus target, active language і density.

## Вихідні події

- `requestRunEmptyStateAction(payload)`.
- `requestDismissEmptyState(payload)`, якщо page дозволяє dismiss.

Payload містить action id, state token, source surface і source focus target.

## Межі відповідальності

Компонент не виконує recovery напряму, не мутує local data і не приховує critical invalid state.

## Критерії приймання

- Empty state пояснює recovery без reliance тільки на колір.
- Actions controlled parent page.
- No-results flow не виглядає як fatal error.
