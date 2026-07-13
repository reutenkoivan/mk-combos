# UI-CMP-018: Combo Actions Menu

## Метадані

- Код: `UI-CMP-018`
- Назва: Combo Actions Menu
- Тип: `component / detail actions`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-004 Combo Detail`](./UI-PAGE-004.md)

## Призначення

`UI-CMP-018` показує secondary actions для active combo detail: duplicate, edit, repair, return або compact overflow actions.

## Володіння

`UI-PAGE-004` володіє open/closed state, action availability, selected action і route intents. `UI-CMP-018` отримує controlled menu model.

## Анатомія

Розміщення є anchored menu: trigger лишається у source action area, а menu surface відкривається поруч або поверх content із action list усередині.

```jsx
<ComboActionsMenu ui="UI-CMP-018">
  <ComboActionsMenuRegion slot="UI-PAGE-004 action source">
    <Stack name="MenuRegionLayout">
      <MenuTriggerSlot>
        <ActionsTrigger />
      </MenuTriggerSlot>

      <Show when={menuState === "open"}>
        <ComboActionsMenuSurface anchored>
          <Stack name="MenuSurfaceLayout">
            <PrimarySecondaryActionList />

            <Show when={hasDisabledReasonMessage}>
              <DisabledReasonMessage />
            </Show>

            <ReturnFocusSentinel nonVisual />
          </Stack>
        </ComboActionsMenuSurface>
      </Show>

      <Show when={hasCompactOverflowAffordance}>
        <CompactOverflowAffordance />
      </Show>
    </Stack>
  </ComboActionsMenuRegion>
</ComboActionsMenu>
```

Правила розміщення:

- Surface відкривається від trigger і не займає місце в normal content flow.
- Compact overflow affordance стоїть у source action area, а не всередині list/card content без context.
- Анатомія не володіє `menuState`; open/closed state приходить із `UI-PAGE-004`.

## Вхідні дані

- `menuState`: `closed`, `open`, `disabled` або `busy`.
- ordered action descriptors із id, label, availability і disabled reason.
- active combo id, source type, source focus target і active language.

## Вихідні події

- `requestOpenActions(payload)`.
- `requestCloseActions(payload)`.
- `requestSelectComboAction(payload)`.
- `requestReturnFocusToDetail(payload)`.

Payload містить action id, combo id, source surface і reason. Об'єкти browser events не передаються.

## Межі відповідальності

Компонент не виконує route changes, не валідить repair availability і не мутує combo або named lists.

## Критерії приймання

- Disabled actions мають readable reason або не показуються.
- Menu open state controlled сторінкою.
- Selection event завжди semantic payload.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
