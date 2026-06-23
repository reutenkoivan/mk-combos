# UI-CMP-031: Stale/Invalid Combo Marker

## Метадані

- Код: `UI-CMP-031`
- Назва: Stale/Invalid Combo Marker
- Тип: `component / marker`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські сторінки: Combo Detail, Named Lists, Custom Combo Builder

## Призначення

`UI-CMP-031` показує stale або invalid custom combo state і дає page-provided recovery actions.

## Володіння

Active page і active game business володіють stale detection, invalid reason, repair availability і route/edit flow. `UI-CMP-031` рендерить controlled marker model.

## Анатомія

Розміщення marker є inline/compact status block: status label стоїть перед readable reason, affected reference і recovery actions додаються нижче як optional rows.

```text
UI-CMP-031 Stale/Invalid Combo Marker
  └─ (inside parent marker slot) Корінь marker
     ├─ (top/left) Status icon/label region
     ├─ (top/right або below label) Readable reason region
     ├─ (below reason, optional) affected move/edge reference
     ├─ (below affected reference, optional) valid prefix summary
     └─ (below marker text, conditional) Recovery action region
        ├─ Open detail action
        ├─ Repair/edit action
        └─ Remove/dismiss action, якщо дозволено page model
```

Правила розміщення:

- У card/header contexts marker може бути compact, але readable reason не має ховатися лише в tooltip.
- Recovery action region стоїть після reason/prefix summary і не виконує repair без page-level intent.
- Анатомія не repair-ить path і не приховує critical invalid state; вона рендерить page-provided marker model.

## Вхідні дані

- `state`: `stale`, `invalid`, `repairAvailable`, `repairUnavailable` або `informational`.
- readable reason, affected move/edge id і valid prefix summary, якщо доступні.
- action availability: open detail, repair, edit, remove item або dismiss informational marker.
- source surface, source focus target і active language.

## Вихідні події

- `requestOpenInvalidComboDetail(payload)`.
- `requestRepairInvalidCombo(payload)`.
- `requestEditInvalidCombo(payload)`.
- `requestRemoveInvalidComboFromList(payload)`.
- `requestDismissInvalidMarker(payload)`, тільки для informational marker.

Payload містить combo ref, affected move/edge id, reason, source surface і source focus target.

## Межі відповідальності

Компонент не видаляє combo, не repair-ить path, не приховує critical invalid state і не виконує builder navigation напряму.

## Критерії приймання

- Marker не покладається тільки на колір.
- Critical invalid state не dismiss-иться без альтернативного сигналу.
- Repair/edit actions емітять semantic payload.
