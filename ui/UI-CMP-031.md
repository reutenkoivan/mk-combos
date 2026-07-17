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

```jsx
<StaleInvalidComboMarker ui="UI-CMP-031">
  <StaleInvalidMarkerSurface slot="parent marker">
    <Stack name="MarkerLayout">
      <Group name="MarkerSummaryRow">
        <StatusIconLabelRegion />
        <ReadableReasonRegion />
      </Group>

      <Show when={hasAffectedMoveEdgeReference}>
        <AffectedMoveEdgeReference />
      </Show>

      <Show when={hasValidPrefixSummary}>
        <ValidPrefixSummary />
      </Show>

      <Show when={hasRecoveryActions}>
        <RecoveryActionRegion>
          <Group name="MarkerRecoveryActions">
            <OpenDetailAction />
            <RepairEditAction />

            <Show when={canRemoveOrDismiss}>
              <RemoveDismissAction />
            </Show>
          </Group>
        </RecoveryActionRegion>
      </Show>
    </Stack>
  </StaleInvalidMarkerSurface>
</StaleInvalidComboMarker>
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

## Step 26 Localized State Contract

- `state` лишається stable machine token у `data-marker-state`, а required `stateLabel` є localized visible copy.
- Raw tokens на кштал `repairAvailable` не показуються користувачеві як status text.
- Unavailable recovery action показує visible `disabledReason`.
- Edit, view-detail, repair, remove і dismiss actions використовують shared icon facade разом із visible localized labels.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
