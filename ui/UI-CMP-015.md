# UI-CMP-015: Notation Renderer

## Метадані

- Код: `UI-CMP-015`
- Назва: `Notation Renderer`
- Тип: `component / display renderer`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські поверхні: [UI-PAGE-003 Catalog](./UI-PAGE-003.md), `UI-PAGE-004 Combo Detail`, [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md)
- Батьківські компоненти: [`UI-CMP-011 Combo Card`](./UI-CMP-011.md), [`UI-CMP-035 Combo Whiteboard`](./UI-CMP-035.md)
- Пов'язані компоненти: [`UI-CMP-004 Display Mode Switcher`](./UI-CMP-004.md), [`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md), `UI-CMP-005 Controller Hint Strip`
- Пов'язані UX сценарії: `US-007`, `US-009`, `US-013`, `US-014`, `US-015`, `US-019`, `US-020`, `US-024`

## Призначення

`UI-CMP-015 Notation Renderer` показує combo input notation у вибраному display mode.

Renderer є shared display-only component для Catalog, Combo Detail і Custom Combo Builder. Він приймає canonical FGC notation або `cachedNotation`, active `notationDisplayMode`, active language і presentation context, після чого рендерить readable input tokens через UI-owned SVG notation icon registry.

FGC лишається єдиним storage/cache форматом для combo data. `PlayStation` і `Xbox` є лише display mapping і не змінюють `movePath`, `cachedNotation`, seeded data або custom data.

## Роль і межі

App Shell і Settings володіють active `notationDisplayMode`. Active game business і active game builder adapter володіють `movePath`, graph validation і `cachedNotation`.

`UI-CMP-015` відповідає за:

- parsing або отримання prepared notation tokens для display;
- mapping canonical FGC input labels у `FGC`, `PlayStation` або `Xbox` presentation;
- rendering notation tokens через той самий UI-owned SVG icon registry, який використовує [`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md);
- рендер notation sequence у compact або expanded context;
- readable grouping для sequences, pauses, cancels або separators, якщо вони є у source notation;
- localized labels для token names або assistive text, якщо active language передано;
- disabled/invalid presentation для unavailable або stale notation, якщо parent передав такий state.

`UI-CMP-015` не відповідає за:

- зміну active display mode;
- зміну `movePath`;
- зміну або перерахунок `cachedNotation`;
- graph validation;
- builder replay;
- route changes;
- persistence або localStorage writes;
- читання Browser Gamepad API;
- показ controller hint bindings для app commands.

## Анатомія

Розміщення renderer є inline або compact block sequence: accessible summary стоїть перед token sequence, а tokens читаються зліва направо з wrap на наступний рядок.

```text
UI-CMP-015 Notation Renderer
  └─ (inside parent notation slot) notationRoot
     ├─ (top/visually hidden, conditional) optional accessible summary
     └─ (below/inline) tokenSequence
        ├─ (left-to-right) input token
        ├─ (between tokens) separator token
        ├─ (adjacent to input) modifier token
        └─ (overlay/adjacent, conditional) optional invalid/unavailable marker
```

Правила розміщення:

- Token order follows prepared notation tokens and does not re-parse or reorder combo path.
- Invalid/unavailable markers stay adjacent to the affected token or group, not detached into a separate status block.
- Wrapping may move tokens to the next line, but source order remains left-to-right.

### `notationRoot`

`notationRoot` є display region усередині parent component.

Root має:

- readable label або accessible name, якщо notation не очевидна з parent;
- stable inline або block layout залежно від density;
- wrapping behavior для long combo notation;
- optional invalid/stale state, якщо parent передав його;
- mutation controls відсутні.

### `tokenSequence`

`tokenSequence` показує ordered notation tokens.

Tokens можуть представляти:

- directional inputs;
- attack buttons;
- simultaneous або sequential inputs;
- modifiers або hold/release hints, якщо вони є у notation source;
- separators між moves або steps;
- unavailable/invalid token marker, якщо parent передав stale або invalid state.

Token semantics мають лишатися readable у всіх display modes. Visual styling або color не мають бути єдиним носієм змісту, а icon-only markers мають мати accessible names або valid adjacent-label relationships.

## Interface Contract

### Inputs

- `notation`: canonical FGC notation або `cachedNotation`.
- `notationDisplayMode`: `FGC`, `PlayStation` або `Xbox`.
- `activeLanguage`: `EN` або `UA`, якщо labels або assistive text локалізуються.
- `density`: `compact`, `list`, `detail`, `whiteboard` або equivalent parent density.
- `presentationContext`: card, detail, builder whiteboard, move preview або equivalent parent context.
- `tokenState`: optional invalid, stale, disabled або highlighted token state.
- `focusedTokenId` або selected step token range, якщо parent surface підтримує inspection.
- `wrappingMode`: inline, multiline або parent-controlled wrapping.
- `fallbackLabel`: optional readable fallback, якщо notation unavailable.

### Outputs

Display-only component не має основних mutation events.

Optional presentation-only events можуть існувати тільки для inspection:

- `requestFocusToken`, якщо parent підтримує token-level focus;
- `requestDescribeToken`, якщо parent відкриває read-only token details.

Ці events не змінюють `movePath`, `cachedNotation`, display mode або combo data.

## State Tokens

- `renderReady`: notation отримана і може бути показана.
- `emptyNotation`: notation відсутня або parent передав fallback.
- `mappedNotation`: source FGC notation показана через platform mapping.
- `compactNotation`: renderer працює у compact/list density.
- `expandedNotation`: renderer працює у detail або whiteboard density.
- `tokenFocused`: parent inspection focus вказує на token або token range.
- `invalidNotationToken`: token позначений як invalid/stale parent state.
- `mappingUnavailable`: renderer не має mapping для token і показує readable fallback.

`notationDisplayMode` не є owned state renderer-а. Він завжди приходить від app/page settings.

## UI Behavior

### Display Modes

`FGC`:

- показує canonical FGC labels як primary display;
- не виконує platform button substitution;
- використовується default для valid deep link auto-config.

`PlayStation`:

- мапить FGC attack/button tokens у PlayStation-oriented labels;
- зберігає sequence order і separators;
- не змінює source notation.

`Xbox`:

- мапить FGC attack/button tokens у Xbox-oriented labels;
- зберігає sequence order і separators;
- не змінює source notation.

У всіх modes renderer має показувати fallback для unknown token без silent drop.

### Source Data

Renderer працює з notation source, який передав parent.

Rules:

- `cachedNotation` є display cache, а не editable value;
- renderer не виводить новий `cachedNotation` із `movePath`;
- renderer не виправляє invalid notation;
- renderer не приховує invalid/stale marker, якщо parent передав такий state;
- display mode змінює тільки presentation tokens.

### Density And Wrapping

Parent surface вирішує density.

Expected behavior:

- `compact` або `list` density оптимізує notation для card/list scan;
- `detail` density дозволяє більше простору для readable grouping;
- `whiteboard` density може синхронізувати token ranges із focused step;
- long notation переноситься без overlap;
- token size, focus marker і invalid marker не мають змінювати layout непередбачувано.

## Integration Rules

### Catalog And Combo Card

[`UI-CMP-011 Combo Card`](./UI-CMP-011.md) використовує renderer для short preview.

Rules:

- card передає active `notationDisplayMode` і `activeLanguage`;
- renderer не відкриває detail і не емітить card actions;
- compact wrapping не має приховувати critical input sequence.

### Combo Detail

Combo Detail використовує renderer для canonical і mapped notation display.

Rules:

- detail може показувати renderer поруч із `UI-CMP-035 Combo Whiteboard`;
- read-only inspection не змінює combo data;
- invalid custom combo може показувати invalid token/range marker, якщо parent передав state.

### Custom Combo Builder

Builder і [`UI-CMP-035 Combo Whiteboard`](./UI-CMP-035.md) використовують renderer для current path display.

Rules:

- builder state machine володіє `movePath` і `cachedNotation`;
- renderer показує accepted, pending або locked notation state;
- pending truncate або invalid boundary передаються як parent state;
- renderer не приймає builder edit proposals.

## Controller Behavior

`UI-CMP-015` не читає Browser Gamepad API і не створює controller commands.

Якщо parent увімкнув token-level inspection:

- `navLeft` / `navRight` можуть рухати parent focus між token ranges;
- `confirm` може попросити parent показати read-only token details;
- `back` повертає focus до parent component.

Без parent token inspection renderer лишається static display і не є окремою focus zone.

## Accessibility

- Notation має readable text equivalent для assistive technologies.
- Input tokens не мають відрізнятися тільки кольором.
- Platform-specific button labels мають мати readable accessible names.
- UI-owned SVG icons мають accessible names або valid adjacent-label relationships.
- Unknown або unmapped token показує readable fallback.
- Invalid/stale token marker не має покладатися тільки на color.
- Long notation має wrap-итися без overlap і без horizontal-only доступу на mobile.
- Compact card mode має лишатися readable при increased contrast.
- Якщо token-level focus існує, focus-visible має бути помітним і не змінювати source data.

## Acceptance Criteria

- `UI-CMP-015` має окремий повний spec.
- `UI.md`, `UI-PAGE-003`, `UI-PAGE-006`, `UI-CMP-011` і `UI-CMP-035` посилаються на цей spec або згадують його як shared renderer.
- Renderer приймає canonical FGC notation або `cachedNotation`.
- Renderer підтримує display modes `FGC`, `PlayStation` і `Xbox`.
- Renderer використовує той самий UI-owned SVG icon registry, що й [`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md).
- Display mode змінює тільки rendering і не змінює `movePath`, `cachedNotation`, seeded data або custom data.
- Renderer не вирішує active display mode самостійно.
- Renderer не має mutation outputs.
- Unknown або unmapped token не зникає silently.
- Token differences і invalid markers не покладаються тільки на колір.

## Test Scenarios

- `FGC` mode показує canonical FGC notation.
- `PlayStation` mode показує mapped platform labels без зміни source notation.
- `Xbox` mode показує mapped platform labels без зміни source notation.
- Renderer використовує той самий UI-owned SVG icon registry, що й [`UI-CMP-037`](./UI-CMP-037.md).
- Зміна display mode у Settings оновлює renderer presentation без зміни `movePath` або `cachedNotation`.
- Combo Card compact renderer не overlap-иться з metadata badges.
- Combo Detail renderer показує read-only notation для seeded combo.
- Builder renderer показує current `cachedNotation` після accepted move.
- Pending truncate або stale custom combo показує invalid/stale marker, якщо parent передав state.
- Unknown token показує readable fallback.
- Screen reader має readable notation equivalent у кожному display mode.

## Припущення

- Точний visual style input tokens буде визначено в `@mk-combos/ui`.
- Mapping dictionary `FGC -> PlayStation/Xbox` і UI-owned SVG icon registry належать shared UI/data layer, але renderer не змінює stored notation.
- Token-level inspection є optional parent capability, а не required renderer behavior у v1.
