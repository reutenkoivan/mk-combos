# UI-CMP-019: Named List Index

## Метадані

- Код: `UI-CMP-019`
- Назва: Named List Index
- Тип: `component / list navigation`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-005 Named Lists`](./UI-PAGE-005.md)

## Призначення

`UI-CMP-019` рендерить список named lists для active game і дає вибрати list detail.

## Володіння

`UI-PAGE-005` володіє selected list, route context, create/rename/delete flows і persistence. `UI-CMP-019` рендерить controlled index model.

## Анатомія

Розміщення є navigation index: header/action region зверху, list items нижче, empty/error slot займає list area, коли items відсутні або недоступні.

```jsx
<NamedListIndex ui="UI-CMP-019">
  <NamedListIndexRegion slot="UI-PAGE-005 workspace">
    <Stack name="IndexLayout">
      <HeaderActionRegion>
        <CreateListAction />
      </HeaderActionRegion>

      <NamedListItemList>
        <NamedListItem>
          <Group name="NamedListItemContent">
            <ListName />
            <ItemCount />

            <Show when={hasRenameDeleteAffordances}>
              <RenameDeleteActionAffordances />
            </Show>
          </Group>
        </NamedListItem>
      </NamedListItemList>

      <Show when={hasEmptyErrorState}>
        <EmptyErrorSlot />
      </Show>
    </Stack>
  </NamedListIndexRegion>
</NamedListIndex>
```

Правила розміщення:

- На `wide13_6Plus` index стоїть ліворуч від `UI-CMP-020`; на `compact` стоїть над detail або в окремому routed sub-surface.
- Empty/error slot замінює item list, а не додається після порожньої list collection.
- Анатомія не створює і не вибирає list самостійно; selection і mutations належать `UI-PAGE-005`.

## Вхідні дані

- ordered list summaries із id, name, item count і optional updated timestamp.
- selected/current/focused list id.
- create/rename/delete availability і disabled reasons.
- loading, empty або error presentation state.

## Вихідні події

- `requestSelectList(payload)`.
- `requestFocusList(payload)`.
- `requestOpenCreateList(payload)`.
- `requestOpenRenameList(payload)`.
- `requestOpenDeleteListConfirm(payload)`.

Payload містить list id або source action id, source surface і source focus target.

## Межі відповідальності

Компонент не створює, не перейменовує і не видаляє list напряму; persistence належить page/app flow.

## Критерії приймання

- Selected/current state controlled сторінкою.
- Empty state не створює list автоматично.
- Actions емітять semantic payload.
