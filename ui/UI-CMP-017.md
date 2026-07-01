# UI-CMP-017: Combo Metadata Grid

## Метадані

- Код: `UI-CMP-017`
- Назва: Combo Metadata Grid
- Тип: `component / detail metadata`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-004 Combo Detail`](./UI-PAGE-004.md)

## Призначення

`UI-CMP-017` рендерить prepared metadata rows для combo detail: damage, meter, position, starter, route type, difficulty, tags і game-specific readonly descriptors.

## Володіння

`UI-PAGE-004` або active game business готує metadata model. `UI-CMP-017` є display-only pure UI component.

## Анатомія

Розміщення є двоколонковою або stacked metadata таблицею: label стоїть перед value у кожному row, а stale annotation займає окремий row.

```jsx
<ComboMetadataGrid ui="UI-CMP-017">
  <MetadataGrid slot="UI-PAGE-004 combo description">
    <Stack name="MetadataGridLayout">
      <MetadataRowList>
        <MetadataRow>
          <Group name="MetadataRowContent">
            <MetadataLabel />
            <MetadataValue />

            <Show when={hasIconStatusMarker}>
              <IconStatusMarker />
            </Show>
          </Group>
        </MetadataRow>
      </MetadataRowList>

      <Show when={hasStaleInvalidAnnotation}>
        <StaleInvalidAnnotationRow />
      </Show>
    </Stack>
  </MetadataGrid>
</ComboMetadataGrid>
```

Правила розміщення:

- На `wide13_6Plus` label/value можуть бути sibling columns; на `compact` value stack-иться під label.
- Annotation row стоїть після основних rows і не змінює prepared row order.
- Анатомія не визначає порядок rows і не обчислює metadata; вона рендерить prepared rows.

## Вхідні дані

- ordered metadata rows із label, value, optional icon descriptor і importance.
- active language, density і responsive layout mode.
- optional stale/invalid presentation state для affected rows.

## Вихідні події

- Немає mutation events.
- Опційний `requestFocusMetadataRow(payload)`, якщо page робить focus state controlled.

## Межі відповідальності

Компонент не обчислює metadata, не читає game data, не змінює combo і не виконує navigation.

## Критерії приймання

- Rows рендеряться у переданому порядку.
- Long UA labels wrap без overlap.
- Display-only mode не емітить persistence або route intents.
