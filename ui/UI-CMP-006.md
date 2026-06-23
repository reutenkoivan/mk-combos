# UI-CMP-006: First-Launch Setup Form

## Метадані

- Код: `UI-CMP-006`
- Назва: First-Launch Setup Form
- Тип: `component / setup form`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-002 First-Launch Setup`](./UI-PAGE-002.md)

## Призначення

`UI-CMP-006` групує initial settings controls для першого запуску: game, language, notation display mode, read-only notation legend і confirmation action.

## Володіння

`UI-PAGE-002` володіє draft values, validation, persistence/session-only state і completion marker. `UI-CMP-006` отримує controlled form model і емітить semantic intents.

Якщо setup form mechanics винесені в custom hook, hook викликається у `UI-PAGE-002`, а компонент отримує prepared props.

## Анатомія

Розміщення є вертикальною setup form: game selector стоїть першим, потім language, display mode, notation reference, status і confirmation action.

```text
UI-CMP-006 First-Launch Setup Form
  └─ (inside UI-PAGE-002 setup root) Form root
     ├─ (top) Game selector region
     │  └─ (inside) UI-CMP-002 Game Switcher
     ├─ (below) Language selector region
     │  └─ (inside) UI-CMP-003 Language Switcher
     ├─ (below) Display mode selector region
     │  └─ (inside) UI-CMP-004 Display Mode Switcher
     ├─ (below settings controls) Notation reference region
     │  └─ (inside) UI-CMP-037 Notation Legend Table
     ├─ (below reference, conditional) Persistence/session-only message region
     └─ (below, final row) Confirmation action region
```

Правила розміщення:

- Control order matches setup dependency: game, language, display mode, notation reference, then confirm.
- На `wide13_6Plus` окремі field rows можуть мати label/control alignment, але секції форми лишаються у цьому vertical order.
- Анатомія не володіє draft values або completion marker; вони належать `UI-PAGE-002`.

## Вхідні дані

- `selectedGameId`, `selectedLanguage`, `selectedDisplayMode`.
- installed game, language і display mode options.
- `validationState`, `savingState`, `persistenceAvailability`.
- child models для `UI-CMP-002`, `UI-CMP-003`, `UI-CMP-004` і `UI-CMP-037`.
- `confirmAvailability` і readable disabled reason.

## Вихідні події

- `requestSelectInitialGame(payload)`.
- `requestSelectInitialLanguage(payload)`.
- `requestSelectInitialDisplayMode(payload)`.
- `requestConfirmFirstLaunch(payload)`.
- `requestAcknowledgeSessionOnly(payload)`.

Payload містить target value, reason і source focus target. Об'єкти browser events не передаються назовні.

## Межі відповідальності

Компонент не створює completion marker, не виконує route redirect, не читає seeded data і не пише settings persistence напряму.

## Критерії приймання

- Form рендерить усі initial settings controls як controlled inputs.
- Confirmation action disabled або busy згідно з page model.
- Вихідні події мають payload і не містять browser events.
