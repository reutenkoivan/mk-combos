# UI-CMP-023: Builder Context Setup

## Метадані

- Код: `UI-CMP-023`
- Назва: Builder Context Setup
- Тип: `component / builder setup`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md)

## Призначення

`UI-CMP-023` збирає required builder context перед стартом graph interaction: character, variation або kameo, optional MKXL stage context і runtime start state.

## Володіння

`UI-PAGE-006` володіє draft context, validation, prefilled source data і builder initialization. `UI-CMP-023` рендерить controlled setup model.

## Анатомія

Розміщення setup є staged form перед builder workspace: character і game-specific selectors стоять над optional stage/runtime state, validation і actions завершують form.

```jsx
<BuilderContextSetup ui="UI-CMP-023">
  <BuilderContextSetupRegion slot="Builder summary before workspace">
    <Stack name="BuilderContextSetupLayout">
      <CharacterSelectorRegion />

      <GameSpecificContextSelectorRegion>
        <Show when={activeGame === "MKXL"}>
          <VariationSelector />
        </Show>

        <Show when={activeGame === "MK1"}>
          <KameoSelector />
        </Show>
      </GameSpecificContextSelectorRegion>

      <Show when={activeGame === "MKXL"}>
        <MkxlStageContext />
      </Show>

      <RuntimeStartStateRegion />

      <Show when={hasValidationStatus}>
        <ValidationStatusRegion />
      </Show>

      <ConfirmResetActionRegion />
    </Stack>
  </BuilderContextSetupRegion>
</BuilderContextSetup>
```

Правила розміщення:

- На `desktop` character і game-specific selectors можуть стояти поруч; на `mobile` і `tablet` вони stack-яться.
- Stage context стоїть нижче required selectors і показується тільки для prepared MKXL model.
- Анатомія не створює graph і не застосовує game rules; вона рендерить prepared setup model.

## Вхідні дані

- active game, available characters і game-specific context options.
- optional MKXL stage/zone/segment options.
- prefilled context, runtime start state, validation state і disabled/busy state.
- focus target і active language.

## Вихідні події

- `requestUpdateBuilderContext(payload)`.
- `requestUpdateStageContext(payload)`.
- `requestUpdateRuntimeStartState(payload)`.
- `requestConfirmBuilderContext(payload)`.
- `requestResetBuilderContext(payload)`.

Payload містить field id, value, mode, reason і source focus target.

## Межі відповідальності

Компонент не створює graph, не валідить game rules самостійно, не зберігає custom combo і не показує internal `movePicker`.

## Критерії приймання

- Context validation controlled сторінкою.
- MKXL-only fields не з'являються для MK1.
- Confirm event не містить browser events.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
