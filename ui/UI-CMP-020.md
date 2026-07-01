# UI-CMP-020: Named List Detail

## Метадані

- Код: `UI-CMP-020`
- Назва: Named List Detail
- Тип: `component / list detail`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-005 Named Lists`](./UI-PAGE-005.md)

## Призначення

`UI-CMP-020` рендерить ordered combo items для selected named list і координує repeated `UI-CMP-011 Combo Card` models.

## Володіння

`UI-PAGE-005` володіє selected list, ordered membership, reorder state, item actions і persistence. `UI-CMP-020` отримує prepared detail model.

## Анатомія

Розміщення є detail panel для selected list: summary header зверху, combo rows нижче, reorder/status і empty/error slots розміщені поруч із affected list area.

```jsx
<NamedListDetail ui="UI-CMP-020">
  <NamedListDetailRegion slot="UI-PAGE-005 workspace">
    <Stack name="DetailLayout">
      <SelectedListSummaryHeader />

      <ComboItemList>
        <ComboItemRow>
          <Group name="ComboItemRowContent">
            <ComboCard ui="UI-CMP-011" />
            <ReorderAffordance />
            <RemoveActionAffordance />
          </Group>
        </ComboItemRow>
      </ComboItemList>

      <Show when={hasReorderStatus}>
        <ReorderStatusSlot />
      </Show>

      <Show when={hasEmptyErrorState}>
        <EmptyErrorSlot />
      </Show>
    </Stack>
  </NamedListDetailRegion>
</NamedListDetail>
```

Правила розміщення:

- На `wide13_6Plus` detail стоїть праворуч від index; на `compact` він стоїть нижче index або замінює index у routed sub-surface.
- Row actions лишаються всередині відповідного row, а page-level dialogs відкриваються поза detail panel.
- Анатомія не змінює item order; reorder відбувається тільки через page-level intent.

## Вхідні дані

- selected list summary і ordered item models.
- repeated `UI-CMP-011` card models.
- focused item id, reorder state, loading/empty/error state.
- action availability: open detail, add to list, remove, reorder.

## Вихідні події

- `requestOpenComboDetail(payload)`.
- `requestOpenAddToList(payload)`.
- `requestRemoveFromList(payload)`.
- `requestReorderListItem(payload)`.
- `requestFocusListItem(payload)`.

Payload містить list id, item id, combo ref, target index і source focus target.

## Межі відповідальності

Компонент не змінює membership напряму, не видаляє combo source data і не виконує route navigation.

## Критерії приймання

- Item order відповідає page model.
- Reorder не відбувається без page intent.
- Invalid items лишаються visible, доки page не змінить model.
