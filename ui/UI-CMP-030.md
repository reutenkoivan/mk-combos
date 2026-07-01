# UI-CMP-030: Error State

## Метадані

- Код: `UI-CMP-030`
- Назва: Error State
- Тип: `component / system state`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські сторінки: Catalog, Combo Detail, Named Lists, Settings

## Призначення

`UI-CMP-030` показує recoverable або blocking errors із readable reason і page-provided recovery actions.

## Володіння

Батьківська сторінка володіє error source, retry/fallback behavior, logging/telemetry policy і recovery state. `UI-CMP-030` рендерить prepared error model.

## Анатомія

Розміщення error state займає parent-provided error slot: severity marker і message стоять зверху, technical reference/details нижче, recovery actions замикають block.

```jsx
<ErrorState ui="UI-CMP-030">
  <ErrorStateSurface slot="parent error">
    <Stack name="ErrorStateLayout">
      <Group name="ErrorSummaryRow">
        <SeverityStatusMarker />
        <TitleMessageRegion />
      </Group>

      <Show when={hasTechnicalReference}>
        <TechnicalReferenceRegion />
      </Show>

      <Show when={hasRecoveryAction}>
        <RecoveryActionRegion>
          <RetryFallbackDismissAction />
        </RecoveryActionRegion>
      </Show>
    </Stack>
  </ErrorStateSurface>
</ErrorState>
```

Правила розміщення:

- На `compact` marker і message stack-яться; на wider slots marker може стояти ліворуч від message.
- Recovery actions завжди нижче readable reason і не приховують critical error text.
- Анатомія не виконує retry або navigation; parent page обробляє всі recovery intents.

## Вхідні дані

- error token, severity, title, message і optional technical reference id.
- recovery actions із availability.
- source surface, source focus target, active language і announcement mode.

## Вихідні події

- `requestRetryErrorAction(payload)`.
- `requestNavigateErrorFallback(payload)`.
- `requestDismissRecoverableError(payload)`, якщо page дозволяє dismiss.

Payload містить error token, action id, reason і source focus target.

## Межі відповідальності

Компонент не виконує retry/navigation самостійно, не скидає local data і не відкриває first-launch setup.

## Критерії приймання

- Error message readable для користувача.
- Recovery actions controlled parent page.
- Critical errors announced assistive technologies.
