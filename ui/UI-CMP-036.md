# UI-CMP-036: Combo Frame Meter

## Метадані

- Код: `UI-CMP-036`
- Назва: `Combo Frame Meter`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські поверхні: `UI-PAGE-004 Combo Detail`, `UI-PAGE-006 Custom Combo Builder`
- Пов'язані компоненти: `UI-CMP-035 Combo Whiteboard`, `UI-CMP-026 Builder Action Bar`, `UI-CMP-005 Controller Hint Strip`
- Пов'язані UX сценарії: `US-007`, `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-025`

## Призначення

`Combo Frame Meter` є game-agnostic inspection component для prepared frame data вибраного move або всієї combo. Інформаційна модель наслідує сильні сторони training meter у Street Fighter 6: одна видима клітинка на кадр, вирівняні треки, компактні headline metrics і чітко відділені startup, active, recovery та transition phases. Компонент використовує власні theme-aware кольори й не копіює брендинг Capcom.

Компонент:

- показує prepared `Startup`, `Total`, `Advantage` та інші headline values;
- рендерить точну клітинкову шкалу, тільки якщо adapter має перевірені phase counts;
- показує continuous whole-combo grid із межами moves та transition spans;
- підтримує optional comparison track на тій самій часовій осі;
- пояснює invalid і unavailable стани текстом, іконкою та pattern feedback;
- не обчислює frame values із raw metadata, formulas або synthetic windows.

## Володіння і public contract

Owner — `packages/ui`. Публічний subpath лишається один:

```ts
@mk-combos/ui/components/combo-frame-meter
```

Він експортує `ComboFrameMeter`, `useComboFrameMeterModel`, runtime dictionaries і prepared types. Окремого hook subpath немає.

Page-level owner:

- адаптує game/business output у prepared snapshot;
- вибирає snapshot для active scope;
- передає Whiteboard inspection target у hook;
- обробляє `focusMatchingWhiteboardStep` через `whiteboard.methods.focusStep`.

Component/hook не імпортують `builder-core`, game packages, routing або persistence і не мутують Whiteboard напряму.

## Незалежні осі стану

Lifecycle, scope і details — незалежні осі:

- lifecycle: `ready`, `pendingTruncate`, `repairReview`, `savingFrozen`;
- scope: `selectedMove`, `wholeCombo`;
- details: `closed` або `open` зі stable segment id.

Наприклад, `savingFrozen + wholeCombo + open` і `pendingTruncate + selectedMove + closed` є валідними комбінаціями, а не окремими modes.

`useComboFrameMeterModel` володіє тільки scope, focus одного segment і details lifecycle. Новий Whiteboard step/candidate автоматично активує `selectedMove`. Ручний `wholeCombo` зберігається до наступної зміни inspection target. За відсутності target використовується `wholeCombo`.

## Prepared snapshot

Snapshot містить localized `label`, `timelineLabel`, `summaryLabel`, prepared headline values і discriminated grid.

### Available grid

`available` grid містить:

- спільний positive `cellCount`;
- primary track, optional aligned `meta` track і optional aligned comparison track;
- tracks із stable ids, localized labels і kind `primary | meta | comparison`;
- segments зі stable id, zero-based `startCell`, positive `cellCount`, kind, validity, range label, summary, details, optional numeric frames і optional prepared `frameCountLabel`; без label UI показує `${cellCount}f`;
- move sections/boundaries зі stable step mapping;
- prepared legend із localized labels та optional category descriptor `{ id, label }`;
- optional `matchingWhiteboardStepId` для focus sync.

Вхід не містить CSS-oriented `offsetPercent`, `spanPercent` або `laneOffsetRem`.

Segment kinds:

- `startup`, `active`, `recovery`;
- `cancel`, `link`, `juggle`, `transition`;
- `other`.

Validity:

- `valid`;
- `invalid` із readable reason;
- `unavailable` із readable reason.

### Unavailable grid

`unavailable` grid містить localized label і reason. Компонент не створює placeholder cells або approximate ranges. Headline summary може лишатися видимим, якщо ці prepared values перевірені незалежно від phase grid.

## Анатомія і layout

Порядок regions:

1. scope switch;
2. lifecycle status;
3. compact headline metrics;
4. available grid або unavailable explanation;
5. один roving segment navigation toolbar;
6. prepared grouped legend у нижній частині available state;
7. invalid/unavailable annotations;
8. inline details.

Grid має фіксовану читабельну ширину клітинки. Довга timeline прокручується тільки горизонтально; details, legend, summary та annotations стоять поза scroller. Легенда йде після segment navigation, щоб не відволікати від шкали та її controls. Компонент не використовує fixed height або `overflow-y-hidden`, тому контент не обрізається у вузькому чи низькому контейнері.

`selectedMove` показує headline Startup/Total/Advantage і точну шкалу move. Section header над шкалою показує назву move, а окремий frame-aligned row одразу під кольоровим primary track показує counts кожного phase span, наприклад `4f`, `2f`, `5f` під Startup, Active і Recovery; Meta track іде після цього row. `wholeCombo` показує одну continuous шкалу з step boundaries і окремою тонкою `Meta`-доріжкою для transition spans, а не набір непов'язаних карток.

## Візуальна семантика

- startup, active, recovery і transition мають власні theme-aware кольори;
- `Link`, `Cancel`, `Juggle`, `Transition` і `Other` використовують transition tone на тонкій frame-aligned `Meta`-доріжці;
- легенда стоїть поза scroller після segment navigation та називає категорії й значення текстом;
- кожна frame cell має видиму межу;
- invalid segment має destructive outline, pattern та readable annotation;
- unavailable segment має dashed/pattern treatment, `?` marker і reason;
- selected/focused states лишаються помітними у light/dark та standard/increased contrast;
- comparison track вирівняний із primary, але не конкурує з ним за emphasis.

Колір ніколи не є єдиним носієм validity або phase meaning.

## Інтеракції та intents

Semantic intents:

- `focusTimelineSegment`;
- `openSegmentDetails`;
- `closeSegmentDetails`;
- `switchFrameScope`;
- `focusMatchingWhiteboardStep`.

Payload містить stable ids, lifecycle, scope, reason і source focus data; DOM events не виходять із component boundary. Frame Meter не емітить edit, graph-validation або persistence events.

Visual frame cells не є tab stops. Один roving focus model належить segment navigation controls:

- `ArrowLeft`/`ArrowRight` переходять між segments;
- `Enter`/`confirm` відкриває inline details;
- `Escape`/`back` закриває details і повертає focus на source segment;
- `focusMatchingWhiteboardStep` передається parent-у;
- у `savingFrozen` timeline та відкриті details видимі, а всі component actions inert.

Touch/controller targets не менші за `44×44px` у mobile/tablet.

## Lifecycle semantics

- `ready`: prepared inspection інтерактивний.
- `pendingTruncate`: зберігає весь prepared grid, invalid boundary і readable reason до підтвердження parent-ом.
- `repairReview`: показує original path, valid prefix та invalid tail без автоматичного repair.
- `savingFrozen`: зберігає видиму timeline/details, оголошує busy state й не емітить intents.

## Доступність

- Root accessible name включає active scope.
- Headline metrics і legend мають explicit accessible labels.
- Segment control label містить segment name, range, validity та reason.
- Invalid/unavailable feedback має текст і символ, не тільки колір.
- Details оголошуються через live region і не є hover-only tooltip.
- Horizontal timeline scroll не приховує vertical content.
- Focus recovery після close детерміновано повертається на той самий segment.

## Критерії приймання

- Runtime dictionaries і types точно відповідають lifecycle, scope, details, track, grid, kind та validity contracts.
- Public input використовує `startCell/cellCount`, а не CSS geometry.
- Available grid рендерить одну видиму клітинку на кадр через CSS-grid spans і repeated separators.
- Frame count row під primary track показує prepared `frameCountLabel` або `${cellCount}f` fallback для кожного phase segment, вирівняний із відповідним кольоровим span без зміни grid geometry.
- Meta track вирівняний із primary, має компактну висоту й не перекриває phase cells.
- Optional comparison track вирівняний із primary.
- Whole-combo grid має prepared step boundaries, total frames над кожним кроком і transition spans у Meta track.
- Категоризована легенда показує `Phases` і `Meta` після segment navigation; uncategorized legacy items лишаються підтриманими.
- Довгі grids мають тільки horizontal overflow; summary/details/annotations не обрізаються.
- Unavailable grid не вигадує frame cells.
- Invalid/unavailable states мають non-color feedback.
- Scope override, details lifecycle і двосторонній parent-mediated focus sync працюють детерміновано.
- Frozen state лишає inspection видимим і робить actions inert.

## Тестові сценарії

- Exact `startCell/cellCount` перетворюються на правильні CSS grid columns.
- Prepared phase frame label і `${cellCount}f` fallback відображаються під кожним primary segment та над Meta track у відповідному span.
- Selected move показує Startup/Total/Advantage та phase grid.
- Whole combo показує continuous grid із двома або більше step boundaries та frame-aligned Meta track.
- Легенда йде після segment navigation і містить доступно названі `Phases` та `Meta` groups.
- Optional comparison track має ту саму cell axis.
- Довга timeline горизонтально прокручується без vertical clipping.
- Unavailable grid показує reason і не рендерить cells.
- Invalid segment має pattern, icon/text і readable reason.
- Segment roving focus, details open/close і focus recovery працюють з keyboard/controller.
- Новий Whiteboard target скидає scope до `selectedMove`; manual `wholeCombo` живе до наступної зміни target.
- `savingFrozen` зберігає open details і не емітить action intents.

## Канонічний Responsive і Controller-only Contract

Surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md).

- `mobile` використовує vertical-first composition і targets не менші за `44×44px`;
- `tablet` використовує hybrid composition;
- `desktop` використовує повноширинний meter із compact aligned rows;
- controller support використовує наявні semantic commands без synthetic DOM events.
