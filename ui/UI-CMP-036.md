# UI-CMP-036: Combo Frame Meter

## Метадані

- Код: `UI-CMP-036`
- Назва: `Combo Frame Meter`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські поверхні: `UI-PAGE-004 Combo Detail`, `UI-PAGE-006 Custom Combo Builder`
- Пов'язані компоненти: `UI-CMP-035 Combo Whiteboard`, `UI-CMP-005 Controller Hint Strip`
- Пов'язані UX сценарії: `US-007`, `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-025`

## Призначення

`UI-CMP-036 Combo Frame Meter` є interactive inspection component для frame data вибраного move або всієї combo.

Компонент рендериться поруч із `UI-CMP-035 Combo Whiteboard` у тих самих поверхнях:

- `UI-PAGE-004 Combo Detail`: read-only frame inspection для seeded або custom combo;
- `UI-PAGE-006 Custom Combo Builder`: live frame inspection для current path, focused whiteboard step або focused internal Whiteboard candidate.

Frame Meter показує SF6-style frame timeline і числові значення: startup, active, recovery, hit/block advantage, cancel window, juggle/link window, transition gaps, meter cost/gain і invalid або unavailable reasons.

## Володіння

`UI-CMP-036` є доменним компонентом `@mk-combos/builder-ui`, який може рендеритися builder і detail поверхнями.

Власники стану:

- active game builder adapter володіє replay state, runtime state, valid next moves, invalid reasons і frame-aware transition results;
- `useComboWhiteboardModel` готує path focus, candidate focus, selected group, selected gap і edit target;
- `useComboFrameMeterModel` викликається на рівні page flow і готує inspection focus: selected timeline segment, open segment details і local scope selection;
- `UI-PAGE-004` і `UI-PAGE-006` координують, який frame snapshot передано компоненту.

Пара module exports:

- hook: `useComboFrameMeterModel`;
- pure UI component: `ComboFrameMeter` / `UI-CMP-036`.

Виклик hook-а належить `UI-PAGE-006` або `UI-PAGE-004`; pure UI component не імпортує builder adapter, route state, persistence або game packages напряму.

Компонент не має:

- мутувати `movePath`;
- емітити whiteboard edit proposals;
- застосовувати move transition;
- виконувати graph validation;
- писати `cachedNotation`;
- зберігати custom combo;
- змінювати seeded combo data.

## Анатомія

Розміщення frame meter є inspection panel: scope switch стоїть зверху, timeline під ним, selected segment details і frame summary розміщені нижче або поруч залежно від viewport, invalid/repair annotations лишаються біля відповідної timeline/detail area.

```text
UI-CMP-036 Combo Frame Meter
  └─ (right/below inside builder/detail workspace) Корінь Frame Meter
     ├─ (top) Scope switch region
     │  ├─ (left/top) Selected move scope
     │  └─ (right/below) Whole combo scope
     ├─ (below scope switch) Timeline region
     │  └─ (inside timeline order) Timeline segment
     ├─ (below/right of timeline, conditional) Selected segment details
     ├─ (below details/timeline) Frame value summary region
     ├─ (inside timeline/detail, conditional) Transition gap / frame window annotation region
     ├─ (below affected segment/details, conditional) Invalid/repair annotation region
     └─ (bottom/inside panel, optional) Focus sync action slot
```

Правила розміщення:

- Scope switch завжди передує timeline і визначає, який prepared inspection model показується.
- На `wide13_6Plus` selected segment details можуть стояти праворуч від timeline; на `compact` вони йдуть нижче timeline.
- Frame summary стоїть після selected details/timeline і не замінює invalid/repair annotations.
- Selected segment, details open state і active scope готує `useComboFrameMeterModel`, який page component викликає на page рівні.

## Вхідні дані

- `mode`: `selectedMove`, `wholeCombo`, `segmentDetailsOpen`, `pendingTruncate`, `repairReview` або `savingFrozen`;
- `scope`: `selectedMove` або `wholeCombo`;
- focused whiteboard step id/index, якщо є;
- focused Whiteboard candidate id, якщо є;
- selected timeline segment id/index, якщо є;
- frame meter snapshot для selected move або whole combo;
- startup, active, recovery, hit advantage, block advantage і recovery totals, якщо вони доступні для move;
- cancel window, link window, juggle window і transition gap metadata;
- meter cost/gain і runtime meter after segment;
- cumulative frame context для whole combo;
- valid prefix, invalid transition, invalid tail і invalid reason для stale, repair або pending truncate станів;
- disabled або readonly reasons;
- controller navigation focus state.

Frame meter snapshot є derived state з explicit move frame data, edge `frameWindow`, transition `effects`, runtime `frameContext` і replay result. Компонент не виводить frame validity евристично з raw formulas.

## Вихідні події

У всіх modes:

- `requestFocusTimelineSegment(payload)`;
- `requestOpenSegmentDetails(payload)`;
- `requestCloseSegmentDetails(payload)`;
- `requestSwitchFrameScope(payload)` між `selectedMove` і `wholeCombo`;
- `requestFocusMatchingWhiteboardStep(payload)`, якщо segment відповідає step у `movePath`.

Компонент не емітить mutation events, persistence events або graph validation events.
Output payloads містять segment id, scope, reason і source focus target. Component не передає browser event objects у page-level handlers.

## Режими

### `selectedMove`

Frame Meter показує frame data для focused whiteboard step або focused Whiteboard candidate.

Правила:

- whiteboard step focus має пріоритет над whole combo scope;
- Whiteboard candidate focus може preview-ити frame data без додавання move у path;
- timeline segments включають startup, active, recovery і optional cancel/link/juggle windows;
- unavailable candidate має показати readable reason без можливості застосувати move.

### `wholeCombo`

Frame Meter показує всю combo як послідовність frame segments.

Правила:

- кожен step має readable segment label і може синхронізувати focus назад у Whiteboard;
- transition gaps, links і cancel windows показуються між steps;
- cumulative frame context показує, як replay оновлює advantage, cancel window або juggle window;
- якщо path порожній, компонент показує empty frame summary для start runtime state.

### `segmentDetailsOpen`

Користувач відкрив readable details для active timeline segment.

Правила:

- details є локальним disclosure або panel усередині Frame Meter, не route і не modal;
- details не мають бути hover-only tooltip;
- `back` або close action закриває details і повертає focus на source segment;
- panel показує назву segment, frame range, startup/active/recovery або transition gap, advantage/cancel/link window і invalid/unavailable reason, якщо він є;
- довгий текст має бути доступний keyboard/controller navigation без pointer-only scroll.

### `pendingTruncate`

Replay edit proposal або context change повернув valid prefix і invalid tail.

Правила:

- Frame Meter дзеркалить Whiteboard invalid boundary;
- invalid transition segment має readable reason;
- finish залишається заблокованим через builder state;
- segment details для invalid transition пояснюють, який frameWindow, state або spacing constraint не пройшов.

### `repairReview`

Initial або stale path не проходить актуальну validation.

Правила:

- показати original path frame timeline, valid prefix і invalid tail;
- invalid boundary не має покладатися тільки на колір;
- repair starts from valid prefix тільки через page/builder action, не через Frame Meter.

### `savingFrozen`

Save in progress.

Правила:

- timeline і active segment details лишаються видимими;
- navigation може лишатися read-only, якщо це не заважає saving state;
- open/close details не має запускати save, cancel або path mutation.

## Controller і keyboard navigation

Frame Meter є окремою focus zone після `UI-CMP-035 Combo Whiteboard`.

Правила:

- `navLeft`/`navRight` рухають focus між timeline segments;
- `navUp`/`navDown` рухають focus між Whiteboard, Frame Meter і Action Bar відповідно до layout;
- `confirm` на segment відкриває `segmentDetailsOpen`;
- `openActions`, якщо доступний, відкриває ті самі segment details або розширений details panel;
- `back` закриває details і повертає focus на source segment;
- якщо details закриті, `back` повертає focus до safe parent zone відповідно до active page flow;
- controller support використовує існуючі semantic commands і не потребує нового `ControllerCommand`;
- `UI-CMP-005 Controller Hint Strip` має показувати Frame Meter hints, коли focus перебуває у Frame Meter.

## Доступність

- Frame Meter має accessible name, який називає scope: selected move або whole combo.
- Timeline segments мають keyboard/controller focus і readable labels.
- Segment labels мають містити move або transition name, frame range і segment type.
- Segment details мають бути доступні через `confirm`, `Enter` або equivalent action, не тільки hover.
- Invalid boundary, unavailable segment і active segment не покладаються тільки на колір.
- Details panel має оголошувати відкриття assistive technologies і повертати focus на source segment після закриття.
- Довгий details text має бути читабельний без pointer-only interaction.

## Критерії приймання

- Frame Meter рендериться поруч із Whiteboard у Combo Detail і Custom Combo Builder.
- Focus на Whiteboard step оновлює Frame Meter до `selectedMove`.
- Focus на Whiteboard candidate preview-ить frame values без додавання move у path.
- Відсутність focused step або candidate показує `wholeCombo`.
- Controller може сфокусувати timeline segment.
- `confirm` або `openActions` відкриває readable segment details.
- `back` закриває details і повертає focus на той самий segment.
- Pending truncate показує invalid transition segment і readable reason.
- Frame Meter не емітить edit proposals, graph validation або persistence events.

## Тестові сценарії

- Detail seeded combo показує read-only Frame Meter і segment details через controller.
- Detail custom combo показує read-only Frame Meter і не мутує combo data.
- Builder create flow показує whole combo або empty runtime frame summary до першого move.
- Whiteboard step focus перемикає Frame Meter у `selectedMove`.
- Whiteboard candidate focus preview-ить startup/active/recovery і unavailable reason, якщо candidate disabled.
- `navLeft`/`navRight` переходять між timeline segments.
- `confirm` відкриває details для active segment.
- `back` закриває details і повертає focus на source segment.
- Pending truncate показує invalid transition details.
- Saving frozen не приховує timeline і не дозволяє path mutation.

## Відкриті уточнення

- Точний visual design SF6-style timeline, segment colors і compact/expanded layout буде визначено під час UI реалізації.
- Точний набір numeric frame fields залежить від доступної seeded frame data для конкретної гри та персонажа.
