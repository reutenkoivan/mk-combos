# UI-PAGE-006: Custom Combo Builder

## Метадані

- Код: `UI-PAGE-006`
- Назва: `Custom Combo Builder`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані компоненти: `UI-CMP-023`, `UI-CMP-035`, `UI-CMP-036`, `UI-CMP-026`, [`UI-CMP-011`](./UI-CMP-011.md), [`UI-CMP-015`](./UI-CMP-015.md), `UI-CMP-021`, `UI-CMP-030`, `UI-CMP-031`
- Пов'язані UX сценарії: `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-024`, `US-025`

## Призначення

`UI-PAGE-006 Custom Combo Builder` є маршрутною сторінкою для створення і редагування локальних custom combos через керований процес.

Поточна route implementation лишається placeholder. Builder flow нижче є target
product contract; до його реалізації route не реєструє page controller scope і
показує в connected App Shell ribbon лише global `Menu`.

Сторінка підтримує:

- створення custom combo з нуля;
- дублювання seeded combo у custom combo;
- редагування наявного custom combo;
- відновлення або виправлення stale/invalid custom combo через актуальний move graph;
- збереження custom combo у local state;
- optional додавання створеного або оновленого combo у named list.

Процес конструктора є строгим: користувач може обирати тільки `valid next moves`, які повертає active game builder entry point. `free text fallback` не входить у MVP.

`UI-PAGE-006` описує координацію на рівні сторінки. `@mk-combos/ui` рендерить Whiteboard з internal centered Move Picker composer layer, Frame Meter і Action Bar, а active game business builder adapter володіє frame-aware логікою валідних переходів, replay, `movePath`, `cachedNotation`, runtime state і перевіркою stale state.

Канонічна builder composition є однаковою для всіх responsive modes: повноширинний dense Whiteboard, повноширинний Frame Meter і Action Bar у page-owned sticky/safe-area wrapper. Internal Move Picker належить Whiteboard та portal-иться у viewport-safe centered composer layer із prepared insertion context; page як і раніше володіє sticky/safe-area positioning Action Bar.

Архітектурний ownership описано в [ARCHITECTURE.md](../ARCHITECTURE.md): shared builder presentation не вирішує game-specific rules.

## Володіння

`UI-PAGE-006` володіє маршрутним процесом і зв'язком між станом застосунку, active game builder adapter, `@mk-combos/ui` та локальним збереженням.

Сторінка відповідає за:

- вибір або прийом режиму конструктора: `create`, `duplicate`, `edit` або `repair`;
- резолв active `gameId` із route prefix і вибір відповідного business entry point;
- передачу character, variation або kameo в процес конструктора;
- передачу optional `MKXL` stage context: stage, zone і segment;
- запит prepared builder state у active game builder adapter;
- рендер `UI-CMP-035`, `UI-CMP-036` і `UI-CMP-026` із `@mk-combos/ui` у канонічній повноширинній composition;
- page-owned sticky/safe-area wrapper навколо `UI-CMP-026`;
- отримання `movePath`, `cachedNotation`, `stageContext` і runtime summary після завершення процесу конструктора;
- запис custom combo у local state через app-level persistence;
- показ saved combo summary/card після збереження і відкриття page-level singleton `UI-CMP-021 Add-To-List Dialog`, якщо користувач хоче додати combo у named list;
- передачу команд контролера у дії конструктора після реалізації target surface.

Сторінка не відповідає за:

- зміну seeded combo data;
- import/export backup;
- керування named list persistence напряму;
- читання Browser Gamepad API;
- мапінг фізичних кнопок controller;
- ручну зміну `game`, `language` або `notation display mode`;
- визначення game-specific graph rules всередині сторінки.

## Контракт Стану Сторінки

Стан у власності сторінки:

- builder mode: `create`, `duplicate`, `edit` або `repair`;
- selected game context, optional MKXL stage context і runtime start state;
- builder adapter state: `movePath`, `cachedNotation`, replay result, valid next moves, invalid boundary і pending truncate state;
- whiteboard focus state, frame meter inspection state, action bar state і cancel/save dialog state;
- saved custom combo context і optional add-to-list dialog state.

Підготовлені UI models для дочірніх компонентів:

- `UI-CMP-023` context setup model;
- `UI-CMP-035` model із `useComboWhiteboardModel`;
- `UI-CMP-036` model із `useComboFrameMeterModel`;
- `UI-CMP-026` action bar model і `UI-CMP-031` stale marker model;
- singleton `UI-CMP-021` add-to-list dialog model after save.

Сторінкові handlers / intents:

- `requestUpdateBuilderContext(payload)`, `requestInitializeBuilder(payload)`;
- `requestApplyMoveProposal(payload)`, `requestUndoMove(payload)`, `requestConfirmTruncate(payload)`;
- `requestFocusWhiteboard(payload)`, `requestFocusFrameSegment(payload)`, `requestPreviewCandidate(payload)`;
- `requestFinishBuilder(payload)`, `requestSaveCustomCombo(payload)`, `requestCancelBuilder(payload)`;
- `requestOpenSavedComboAddToList(payload)`.

Бізнес-залежності:

- active game business entry point і builder adapter;
- `@mk-combos/ui` hooks invoked at page level;
- app-level custom combo persistence і named-list availability.

Не відповідає за:

- graph validation усередині pure UI components;
- direct `localStorage` writes із builder presentation components;
- browser/controller event payloads у whiteboard, frame meter або action bar callbacks.

## Анатомія

Розміщення веде користувача від context setup до builder workspace: спершу summary і setup, далі повноширинні builder surfaces у стабільному порядку, потім saved summary. Builder module hooks викликаються на сторінці, sticky/safe-area wrapper належить сторінці, а overlays лишаються page-owned singleton surfaces.

```jsx
<CustomComboBuilderPage ui="UI-PAGE-006">
  <BuilderSurface slot="UI-PAGE-001 active route">
    <Stack name="BuilderLayout">
      <ModeContextSummary>
        <Show when={hasStaleInvalidMarker}>
          <StaleInvalidComboMarker ui="UI-CMP-031" />
        </Show>
      </ModeContextSummary>

      <Show when={needsBuilderContextSetup}>
        <BuilderContextSetup ui="UI-CMP-023" />
      </Show>

      <Stack name="BuilderWorkspace">
        <ComboWhiteboard ui="UI-CMP-035" width="full">
          <DensePathBoardRegion />
          <NotationRenderer ui="UI-CMP-015" />
          <Show when={hasMovePickerComposer}>
            <BodyPortal>
              <CenteredMovePickerComposer context="before-target-after" />
            </BodyPortal>
          </Show>
        </ComboWhiteboard>

        <ComboFrameMeter ui="UI-CMP-036" width="full" />

        <PageOwnedStickySafeAreaDock>
          <BuilderActionBar ui="UI-CMP-026" />
        </PageOwnedStickySafeAreaDock>
      </Stack>

      <Show when={hasSavedComboSummary}>
        <SavedComboSummary>
          <ComboCard ui="UI-CMP-011" />
        </SavedComboSummary>
      </Show>

      <Show when={hasSystemMessageOrErrorState}>
        <SystemMessagesRegion>
          <ErrorState ui="UI-CMP-030" />
        </SystemMessagesRegion>
      </Show>

      <Show when={isAddToListDialogOpen}>
        <AddToListDialog ui="UI-CMP-021" />
      </Show>
    </Stack>
  </BuilderSurface>
</CustomComboBuilderPage>
```

Правила розміщення:

- `UI-CMP-023` стоїть перед editable workspace і зникає або стискається до summary після підтвердження context.
- Whiteboard і Frame Meter утворюють повноширинну вертикальну послідовність на `mobile`, `tablet` і `desktop`; side-by-side split не є канонічною composition.
- Internal Move Picker є частиною `UI-CMP-035` і не займає layout slot: після вибору append/insert/replace target він рендериться у body portal як великий centered composer layer, з horizontal candidates на `desktop`/`tablet` і vertical list на `mobile`.
- Сторінка обгортає `UI-CMP-026` у sticky bottom dock із safe-area inset. Сам `UI-CMP-026` рендерить dock surface і stable action geometry, але не задає `position: sticky`, viewport offsets або safe-area spacing.
- `UI-CMP-021` відкривається тільки після saved combo context як singleton overlay, не всередині `UI-CMP-035` або `UI-CMP-036` builder presentation flow.

### BuilderSurface

BuilderSurface є page-level container, який рендериться в slot активної сторінки `UI-PAGE-001 App Shell`.

BuilderSurface має:

- показувати режим конструктора: `create`, `duplicate`, `edit` або `repair`;
- тримати стабільну повноширинну вертикальну розмітку для context setup, dense combo whiteboard, frame meter і page-owned sticky/safe-area wrapper навколо action bar; internal Move Picker portal не змінює висоту цієї розмітки;
- не рендерити catalog, filters, Settings або backup controls;
- не дозволяти довільне текстове введення move;
- зберігати поточний стан конструктора під час безпечних route interactions, якщо navigation не підтверджена як cancel.

### Підсумок режиму і контексту

Підсумок режиму і контексту показує, з чим працює конструктор.

Підсумок має показувати:

- active game context label із active business entry point;
- character;
- variation для `MKXL`, якщо потрібна;
- kameo для `MK1`, якщо потрібний;
- stage, zone і segment для `MKXL`, якщо builder працює з environment interactions;
- режим конструктора;
- source combo, якщо процес почався через duplicate або edit;
- stale/invalid marker, якщо initial combo path не проходить актуальну validation.

### UI-CMP-023 Builder Context Setup

`UI-CMP-023 Builder Context Setup` збирає стартовий контекст combo.

Контекст включає:

- game;
- character;
- variation або kameo, якщо потрібні для активної гри;
- optional `MKXL` stage context: stage, zone і segment;
- meter;
- damage estimate;
- position: zone, segment, distance band, corner side і facing;
- stance;
- player state;
- opponent state;
- frame context: current advantage, optional cancel window і optional juggle window;
- used interactables, якщо flow почався з source combo.

Після підтвердження context setup сторінка передає context у active game builder adapter.

Stage context у `MKXL` є optional. Якщо stage не вибрана, `mkxl/builder` не додає interactable moves або stage-specific edges. Якщо stage вибрана, `mkxl/builder` додає тільки interaction schema цієї карти і фільтрує її interactables через zone, segment, distance band, corner side і facing.

### Builder graph input

Сторінка формує page-level builder request перед викликом active game builder adapter.

Builder request включає:

- active `gameId`;
- character id;
- game context: `mkxlVariation` або `mk1Kameo`;
- stage context: `none` або `mkxlStage` зі stage, zone і segment;
- start runtime state;
- optional initial `movePath`;
- gameVersion.

Вхідні значення мають такий вплив:

| Input | Вплив |
| --- | --- |
| `game` | Вибирає ruleset, state enums, notation rules і дозволений overlay type. |
| `character` | Вибирає base movelist і base graph. |
| `variation` | У `MKXL` додає, змінює або блокує character moves/edges. |
| `kameo` | У `MK1` додає kameo moves/edges і kameo transition rules. |
| `stage` | У `MKXL` додає stage interaction schema; без stage interactables недоступні. |
| `zone/segment` | Фільтрують stage interactables і spatial edges. |
| `distance/corner/facing` | Фільтрують spacing-sensitive transitions, corner routes і side switches. |
| `meter` | Фільтрує meter-cost edges і оновлюється через `effects`. |
| `stance` | Фільтрує stance-specific moves і stance-changing transitions. |
| `playerState/opponentState` | Фільтрують grounded, airborne, juggle, knockdown і stun transitions. |
| `frameContext` | Фільтрує links, cancels і juggles через explicit edge `frameWindow`; цей legality contract не є UI frame metadata. |
| `usedInteractables` | Застосовує usage policy `oncePerCombo`, `reusable` або `disabled`. |
| `initialPath` | Replay-иться через composed graph і повертає invalid reason + valid prefix, якщо став stale. |

### Graph composition

Active game builder adapter компонує graph у стабільному порядку.

Для `MKXL`:

1. Base character graph.
2. Variation overlay.
3. Optional `MKXL` stage interaction schema.

Для `MK1`:

1. Base character graph.
2. Kameo overlay.

Explicit disable в overlay має пріоритет над add/modify. Add/modify conflict має бути data validation error, якщо data не містить intentional override.

### Internal `movePicker` region у UI-CMP-035

Колишній `UI-CMP-024 Move Picker` merged у `UI-CMP-035 Combo Whiteboard` і більше не є active sibling component.

Internal `movePicker` region має:

- показувати тільки valid next moves або явно disabled candidates зі зрозумілою причиною, якщо такий UX потрібний;
- групувати candidates, якщо builder graph має move groups;
- бути viewport-safe centered composer layer із context strip для move до/після active Whiteboard target: horizontal candidate row на `desktop`/`tablet` і vertical candidate list на `mobile`;
- бути закритим за замовчуванням, закриватися через explicit close, `Escape`, backdrop або successful candidate proposal та повертати focus до source target;
- не змінювати document height та не прокручувати сторінку під час відкриття, target switching або focus recovery;
- не звужувати Whiteboard і не створювати side panel поруч із combo path;
- підтримувати mouse, touch, keyboard і controller navigation всередині Whiteboard focus;
- не дозволяти вибрати move, який не проходить `requires`, spacing constraints або `frameWindow`; synthetic `frameWindow` не виводиться як tactical/frame metadata;
- не показувати `MKXL` interactable moves без selected stage;
- показувати тільки interactables поточної stage, zone, segment і distance band;
- застосовувати active Whiteboard target: append, insert у focused gap або replace focused step;
- емітити candidate selection у Whiteboard, який створює edit proposal для active game builder adapter.

### UI-CMP-035 Combo Whiteboard

`UI-CMP-035 Combo Whiteboard` показує і редагує selected path combo у builder flow.

Whiteboard має:

- показувати `movePath`;
- показувати `cachedNotation`;
- використовувати [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md) для поточного `notation display mode`;
- використовувати повну доступну ширину й dense multi-row path layout, у якому кожен move стоїть близько до попереднього та наступного, а кожен рядок читається зліва направо;
- показувати на кожній move card ordinal, localized move name, notation і від одного до трьох завжди видимих prepared tactical/meta badges;
- показувати між сусідніми moves prepared transition metadata з одним або двома badges, наприклад `Gap 2f`, `Cancel`, `Link` або `Juggle`;
- відрізняти gameplay transition metadata від технічного Whiteboard gap, який є лише insert/drop target;
- показувати steps і gaps як окремі focus targets;
- позначати останній доданий move;
- показувати generic prepared runtime/context summary, якщо builder state це надає; damage не є частиною default move-card composition;
- показувати active empty board, якщо create flow ще не має moves;
- показувати locked source preview у duplicate/edit/repair flow до підтвердження context;
- показувати original path, valid prefix і invalid boundary для stale або invalid path;
- відкривати local context menu для step або gap;
- підтримувати insert, replace, remove, undo-to-step і pick up/drop reorder як edit proposals;
- не змінювати builder state напряму.

Active game builder adapter лишається source of truth для accepted path. Whiteboard емітить edit proposal, а game builder replay-ить path і повертає accepted path або pending truncate state з valid prefix, invalid tail і readable invalid reason.

Finish action має бути disabled, якщо whiteboard має pending truncate або unresolved invalid tail.

### UI-CMP-036 Combo Frame Meter

`UI-CMP-036 Combo Frame Meter` показує повноширинний interactive frame inspection після Whiteboard; internal Move Picker portal не додає окремого блоку між ними.

Frame Meter має:

- показувати `selectedMove`, якщо сфокусований whiteboard step або internal Whiteboard candidate;
- показувати `wholeCombo`, якщо move focus відсутній;
- використовувати інформаційну модель SF6 Frame Meter без копіювання branding: одна видима клітинка на кадр, aligned tracks, compact headline metrics, phase legend і чіткі step boundaries;
- показувати headline Startup, Total і Advantage та primary grid track для `selectedMove`, а також optional aligned comparison track, якщо prepared snapshot його надає;
- показувати один continuous cell grid із move sections/boundaries і transition spans для `wholeCombo`;
- показувати startup, active, recovery, hit/block advantage, cancel window, link/juggle window і meter cost/gain тільки тоді, коли ці дані підтверджені та підготовлені owner-ом;
- використовувати prepared zero-based `startCell` і positive `cellCount`; component не виводить geometry із raw frame formulas або metadata;
- рендерити unavailable grid як localized label і readable reason без вигаданих frame cells або synthetic fallback values;
- відкривати readable segment details через keyboard/controller `confirm` або `openActions`;
- закривати segment details через `back` і повертати focus на source segment;
- preview-ити focused Whiteboard candidate без додавання move у path;
- не емітити edit proposals, graph validation або persistence events.

Frame meter snapshot є derived state з підтверджених move frame data, verified edge timing, transition `effects`, runtime `frameContext` і replay result. Active game builder adapter лишається source of truth для frame-aware validity. Якщо source coverage, provenance або identity match недостатні, page adapter готує unavailable state; він не підміняє відсутні дані synthetic чи estimated values.

### UI-CMP-026 Builder Action Bar

`UI-CMP-026 Builder Action Bar` містить основні дії builder flow.

Action Bar має:

- undo останній move;
- finish combo, якщо path можна завершити;
- cancel flow;
- відкрити add-to-list flow через saved combo summary/card після збереження, якщо combo вже створене або оновлене;
- на `desktop` тримати Undo зліва, status у центрі, Cancel і primary Finish справа;
- на `mobile` віддавати Finish повну ширину, а Undo/Cancel переносити в secondary row;
- після успішного save використовувати saved CTA у primary slot замість Finish;
- показувати disabled або busy states під час `saving` і робити весь dock inert;
- не задавати sticky/safe-area positioning самостійно.

### UI-CMP-031 Stale/Invalid Combo Marker

`UI-CMP-031 Stale/Invalid Combo Marker` показує, що custom combo стало невалідним після оновлення move graph або несумісне з актуальним context.

Marker має:

- не видаляти custom combo;
- показувати readable invalid reason;
- дозволяти перейти в repair/edit flow;
- пояснювати, що виправлення буде виконане через актуальний guided builder.

### UI-CMP-021 Add-To-List Dialog

`UI-CMP-021 Add-To-List Dialog` відкривається як page-level singleton action dialog після збереження custom combo.

Dialog не належить builder presentation components із `@mk-combos/ui`. Він працює з named lists на рівні застосунку і локальним збереженням, отримує context від saved combo summary/card і повертає add-to-list intent у page/app-level flow.

## Контракти компонентів

### UI-CMP-023 Builder Context Setup

Вхідні дані:

- active game;
- available characters;
- available variation або kameo options;
- available `MKXL` stages, zones і segments, якщо active game дорівнює `MKXL`;
- optional prefilled context із deep link, duplicate або edit flow;
- prefilled runtime state із source combo, якщо доступний;
- validation state для context;
- disabled state під час `loadingGraph` або `saving`.

Вихідні події:

- змінити selected game-specific context;
- змінити optional `MKXL` stage context;
- змінити runtime start state;
- підтвердити стартовий context;
- скинути context до safe default;
- повідомити page-level flow про validation error.

Межі відповідальності:

- не створює composed graph самостійно;
- не зберігає custom combo;
- не показує internal `movePicker` region;
- не змінює global settings.

### UI-CMP-035 Combo Whiteboard

Вхідні дані:

- mode: `emptyActive`, `builderEditable`, `detailReadOnly`, `lockedPreview`, `repairReview`, `pendingTruncate` або `savingFrozen`;
- prepared Whiteboard source зі stable step/gap/candidate/group ids, notation на кожному step/candidate, localized labels, availability/reasons і runtime/context summaries;
- обов'язкові `step.metaItems` і `candidate.metaItems` з одного-трьох prepared badges; unavailable badge має localized readable reason;
- prepared transitions між stable `fromStepId`/`toStepId` з одним-двома meta items; технічні Whiteboard gaps лишаються окремими insert/drop targets;
- boundary index та prepared truncate confirmation, якщо builder replay це повертає;
- notation display mode і responsive focus data;
- presentation model із одним discriminated focus target, selected group, local menu, edit target і pick-up/drop state.

Вихідні події:

- request focus step;
- request focus gap;
- request focus move candidate;
- request select valid move candidate як єдиний candidate proposal із discriminated append/insert/replace target;
- request next або previous move group;
- request candidate details для move, якщо page-level UI це підтримує;
- request open move details, якщо це підтримано page-level flow;
- request open local step/gap menu;
- request remove, undo-to-step або pick up/drop reorder як окремий path proposal;
- request confirm або cancel truncate;
- request repair from valid prefix.

Межі відповідальності:

- не перераховує notation самостійно;
- не пише `cachedNotation`;
- не мутує builder state напряму;
- не застосовує move transition напряму;
- не дозволяє `free text fallback`;
- не застосовує invalid truncate без explicit confirmation;
- не зберігає custom combo;
- не змінює named lists або seeded data.

### UI-CMP-036 Combo Frame Meter

Вхідні дані:

- lifecycle: `ready`, `pendingTruncate`, `repairReview` або `savingFrozen`;
- scope: `selectedMove` або `wholeCombo`;
- details: discriminated `closed` або `open` state;
- prepared snapshot із discriminated grid state `available` або `unavailable`, labels, summaries, optional numeric frame values, validity/reasons і matching Whiteboard step ids;
- available grid зі спільним total `cellCount`, primary track, optional aligned comparison track, zero-based segment `startCell`, positive segment `cellCount`, move sections/boundaries і prepared legend;
- unavailable grid із localized label і readable reason без cell geometry;
- discriminated Whiteboard inspection target, selected timeline segment і responsive/controller focus data.

Вихідні події:

- request focus timeline segment;
- request open segment details;
- request close segment details;
- request switch scope між selected move і whole combo;
- request focus matching whiteboard step, якщо segment відповідає step у `movePath`.

Межі відповідальності:

- не застосовує move transition;
- не мутує `movePath`;
- не емітить whiteboard edit proposals;
- не валідує graph самостійно;
- не обчислює cell positions із raw metadata/formulas і не створює frame values за відсутності підтверджених data;
- не зберігає custom combo;
- не змінює seeded data.

### UI-CMP-026 Builder Action Bar

Вхідні дані:

- prepared action descriptors з availability і readable reason;
- save state: `idle`, `saving`, `saveError` або `saved`;
- dirty state;
- responsive mode;
- optional status;
- optional saved custom combo id для add-to-list action.

Вихідні події:

- undo останній move;
- finish combo;
- cancel flow;
- confirm cancel після unsaved changes;
- request add saved combo to named list.

Межі відповідальності:

- не зберігає custom combo самостійно;
- не виконує localStorage write;
- не вирішує, чи path валідний;
- не володіє sticky viewport positioning або safe-area inset; їх задає wrapper `UI-PAGE-006`;
- не читає controller input напряму.

### UI-CMP-015 Notation Renderer

Детальна специфікація: [UI-CMP-015 Notation Renderer](./UI-CMP-015.md).

Вхідні дані:

- canonical FGC notation;
- mapped notation для active display mode;
- language;
- controller/platform display mode.

Вихідні події:

- display-only component, основних mutation events немає.

Межі відповідальності:

- не змінює `movePath`;
- не змінює `cachedNotation`;
- не валідує combo path.

### UI-CMP-021 Add-To-List Dialog

Вхідні дані:

- saved custom combo id;
- available named lists;
- current membership state;
- persistence availability;

Вихідні події:

- submit add-to-list intent to page/app-level persistence flow;
- close dialog;
- create list request, якщо page-level flow це дозволяє.

Межі відповідальності:

- не створює custom combo;
- не змінює builder path;
- не зберігає named list membership напряму;
- не належить builder presentation components із `@mk-combos/ui`.

### UI-CMP-031 Stale/Invalid Combo Marker

Вхідні дані:

- invalid reason;
- stale detection result;
- affected move або edge id, якщо доступно;
- repair availability.

Вихідні події:

- request repair/edit flow;
- dismiss informational marker, якщо це не приховує critical invalid state.

Межі відповідальності:

- не видаляє custom combo;
- не виправляє path самостійно;
- не приховує critical invalid state без альтернативного сигналу.

### Page-level builder flow

Вхідні дані:

- active app settings;
- route context;
- optional source seeded combo;
- optional source custom combo;
- active game business entry point;
- builder request із gameId, character, game context, optional stage context, start runtime state, optional initial path і gameVersion;
- local persistence availability;
- controller command stream від App Shell.

Вихідні події:

- initialize builder state;
- apply selected move through active game builder adapter;
- undo move;
- finish builder;
- save custom combo to local state;
- open page-level singleton `UI-CMP-021 Add-To-List Dialog` для saved combo context;
- cancel flow;
- return to previous surface або safe fallback.

Межі відповідальності:

- не реалізує graph algorithms самостійно;
- не змінює seeded data;
- не виконує import/export;
- не читає Browser Gamepad API;
- не керує global settings.

## Мапа станів

### `contextSetup`

Користувач задає game-specific context і стартовий стан combo.

Очікуваний UI:

- `UI-CMP-023 Builder Context Setup` активний;
- `MKXL` context може показати optional stage, zone і segment controls;
- `UI-CMP-035 Combo Whiteboard` показує empty active board для create flow;
- `UI-CMP-036 Combo Frame Meter` показує empty/unavailable prepared frame state або locked source grid, якщо source path передано і exact data підтверджені;
- якщо flow почався через duplicate, edit або repair, whiteboard показує locked source preview до підтвердження context;
- internal `movePicker` у Whiteboard ще не показує next moves або показує disabled/loading state;
- finish action недоступний.

### `loadingGraph`

Сторінка готує composed move graph для обраного context.

Очікуваний UI:

- показано loading state без втрати context;
- whiteboard frozen і не губить source або current path під час replay;
- frame meter frozen і не губить active segment або source timeline під час replay;
- internal `movePicker` і finish action disabled;
- error state доступний, якщо graph input не вдалося підготувати;
- якщо stage context змінився, попередній path не видаляється до replay validation.

### `ready`

Builder має graph input, а Whiteboard може показати стартові valid candidates.

Очікуваний UI:

- internal `movePicker` у Whiteboard показує valid стартові candidates;
- `MKXL` interactables показуються тільки якщо selected stage і spatial context дають до них доступ;
- whiteboard показує empty path або replayed initial path;
- whiteboard має append target, якщо focused step або gap не вибрані;
- frame meter показує continuous whole-combo grid або truthful unavailable state без synthetic cells;
- action bar показує доступні actions.

### `selectingMove`

Користувач обирає наступний valid move.

Очікуваний UI:

- focused Whiteboard candidate помітний;
- frame meter preview-ить focused Whiteboard candidate як `selectedMove` без додавання move у path;
- якщо whiteboard має focused gap, вибір candidate виконує insert proposal;
- якщо whiteboard має focused step у replace mode, вибір candidate виконує replace proposal;
- якщо whiteboard не має explicit target, вибір candidate виконує append proposal;
- disabled candidates не виконують selection;
- controller і keyboard navigation не виходять за межі Whiteboard без явної дії.

### `whiteboardFocused`

`UI-CMP-035 Combo Whiteboard` має focus як окрема builder zone.

Очікуваний UI:

- поточний `movePath` і `cachedNotation` видимі;
- internal `movePicker` candidates доступні як focus targets, якщо mode підтримує builder interaction;
- steps і gaps доступні як окремі focus targets;
- move cards показують один-три tactical/meta badges, а gameplay transitions між ними — один-два transition badges;
- останній move позначений;
- notation renderer відповідає active notation display mode;
- `confirm` або `openActions` на step/gap відкриває local context menu;
- step menu дозволяє details, replace, remove, undo-to-step і pick up;
- gap menu дозволяє insert або drop picked step;
- reorder через pick up/drop replay-ить proposed path;
- undo доступний, якщо path не порожній.
- focused whiteboard step синхронізує Frame Meter у `selectedMove`.

### `frameMeterFocused`

`UI-CMP-036 Combo Frame Meter` має focus як окрема builder zone після whiteboard.

Очікуваний UI:

- active scope є `selectedMove` або `wholeCombo`;
- один roving segment model надає focus targets для prepared segments: на desktop triggers живуть у timeline spans, а на mobile/tablet — у compact `44×44px` controls;
- `navLeft` і `navRight` рухають focus між segments;
- `navUp` і `navDown` переводять focus між Whiteboard, Frame Meter і Action Bar відповідно до layout;
- `confirm` або `openActions` на segment відкриває readable segment details;
- keyboard `Escape` із закритими details очищає timeline focus; перший segment лишається точкою наступного Tab-входу без передчасного focus ring;
- Frame Meter не виконує append, insert, replace, remove, reorder або save.

### Frame Meter details `open`

Frame Meter показує readable details для active timeline segment.

Очікуваний UI:

- details є локальним click-persistent non-modal popover у Frame Meter, не route і не modal dialog flow;
- popover показує segment name, frame range, startup/active/recovery або transition gap, advantage/cancel/link window і invalid/unavailable reason, якщо він є;
- popover рендериться через portal, має collision-aware arrow до selected span і не обрізається horizontal grid scroller-ом;
- `back`, перший `Escape`, outside press або Close закривають details і повертають focus на source trigger; наступний keyboard `Escape` із закритими details очищає focus із timeline segment;
- довгий текст details доступний для keyboard/controller читання без pointer-only scroll.

### `pendingTruncate`

Edit proposal, context change або reorder replay-нувся тільки до valid prefix.

Очікуваний UI:

- whiteboard показує proposed valid prefix, invalid tail і boundary;
- frame meter показує invalid transition segment, valid prefix timeline і invalid tail;
- `UI-CMP-031 Stale/Invalid Combo Marker` або local whiteboard message показує readable reason;
- finish action disabled;
- користувач може confirm truncate, cancel proposal або перейти в repair через valid prefix;
- invalid tail не видаляється без explicit confirmation.

### `noValidNextMoves`

Поточний path валідний, але продовження немає.

Очікуваний UI:

- internal `movePicker` у Whiteboard показує empty state або message;
- whiteboard лишається active і показує current path;
- finish action доступний тільки якщо path можна зберегти і немає pending truncate або unresolved invalid tail;
- undo action доступний, якщо path не порожній.

### `invalidInitialPath`

Initial path із duplicate/edit flow не проходить актуальну validation.

Очікуваний UI:

- `UI-CMP-031 Stale/Invalid Combo Marker` показує причину;
- `UI-CMP-035 Combo Whiteboard` показує original path, valid prefix і invalid boundary;
- `UI-CMP-036 Combo Frame Meter` показує original timeline, valid prefix і invalid transition details;
- invalid tail не видаляється автоматично;
- custom combo не видаляється;
- користувач може перейти до repair flow або скасувати.

### `staleCustomCombo`

Custom combo стало stale після оновлення move graph.

Очікуваний UI:

- показано stale marker і readable reason;
- whiteboard показує original path, valid prefix, invalid tail і invalid boundary;
- frame meter показує invalid transition segment і readable frame-aware reason;
- repair starts from valid prefix тільки після user action або confirmation;
- користувач може відредагувати combo через актуальний graph.

### `saving`

Сторінка отримує `movePath` і `cachedNotation` та пише custom combo у local state.

Очікуваний UI:

- finish і cancel можуть бути disabled або busy;
- повторне save недоступне до завершення operation;
- whiteboard переходить у `savingFrozen` і не губить path.
- frame meter lifecycle переходить у `savingFrozen`; active scope і details state зберігаються, timeline/details лишаються видимими й не мутують path.

### `saveError`

Custom combo не вдалося зберегти.

Очікуваний UI:

- `UI-CMP-030 Error State` пояснює recoverable проблему;
- `movePath` і `cachedNotation` не губляться;
- користувач може повторити save або cancel, якщо це безпечно.

### `cancelConfirm`

Користувач виходить із builder після unsaved changes.

Очікуваний UI:

- показано confirmation state або dialog;
- користувач може повернутися до builder без втрати state;
- підтверджений cancel не змінює local state.

### `complete`

Combo створене або оновлене.

Очікуваний UI:

- показано success/system message;
- доступний optional add-to-list action;
- користувач може перейти до detail, named list або попередньої surface, якщо route це підтримує.

## Навігація і потік даних

### Вхід у builder

1. Користувач відкриває `UI-CMP-033 Top Bar Dropdown Menu`.
2. Користувач обирає Builder action.
3. `UI-CMP-001 Global Top Bar` емітить `requestNavigateBuilder`.
4. `UI-PAGE-001 App Shell` відкриває `UI-PAGE-006 Custom Combo Builder`.
5. Сторінка читає active settings і route context.

### Створення з нуля

1. Користувач задає context у `UI-CMP-023 Builder Context Setup`.
2. Для `MKXL` користувач може optional вибрати stage, zone і segment.
3. Сторінка формує builder request для active game/character/context.
4. Active game builder adapter формує builder state.
5. `UI-CMP-035 Combo Whiteboard` показує empty active board, append target і internal valid стартові candidates.
6. Focus/selection candidate відбувається в internal centered Move Picker composer із видимим контекстом до/після active edit target і без viewport jump.
7. Користувач складає path через valid frame-aware transitions.
8. Якщо whiteboard edit proposal повертає valid prefix і invalid tail, finish блокується до confirmation або repair.
9. Finish action зберігає custom combo у local state.

### Дублювання seeded combo

1. Користувач запускає duplicate seeded combo action із catalog або combo detail.
2. App Shell відкриває `UI-PAGE-006` із source seeded combo.
3. Сторінка prefill-ить character, variation або kameo, `stageContext`, start runtime state і initial `movePath`.
4. Whiteboard показує locked source preview до підтвердження context.
5. Active game builder adapter replay-ить path проти актуального composed graph.
6. Якщо source combo stage-specific, MKXL builder має отримати selected stage, zone, segment і used interactables.
7. Якщо replay повертає invalid boundary, whiteboard показує original path, valid prefix і invalid tail.
8. Після finish створюється новий custom combo; seeded combo лишається read-only.

### Редагування custom combo

1. Користувач відкриває edit action для custom combo.
2. Сторінка завантажує source custom combo, `stageContext`, runtime summary і initial path.
3. Whiteboard показує locked source preview до підтвердження context.
4. Active game builder adapter replay-ить initial path.
5. Якщо character, variation, kameo, stage або start runtime state змінено, active game builder adapter replay-ить current path і позначає stale/invalid state без видалення path.
6. Whiteboard edit proposals для insert, replace і reorder replay-ять suffix і можуть створити `pendingTruncate`.
7. Після finish existing custom combo оновлюється у local state.
8. Named list membership не змінюється, якщо користувач не виконує окрему list action.

### Repair stale або invalid combo

1. Сторінка отримує custom combo, яке не проходить актуальну validation.
2. `UI-CMP-031 Stale/Invalid Combo Marker` показує invalid reason.
3. `UI-CMP-035 Combo Whiteboard` показує original path, valid prefix і invalid boundary.
4. Active game builder adapter відкриває repair flow через актуальний graph.
5. Користувач стартує repair із valid prefix, підтверджує truncation або скасовує без mutation.

### Data flow

```text
UI-PAGE-006 Custom Combo Builder
  -> active settings і route context
  -> active game business entry point
  -> builder request
  -> active game builder adapter
  -> UI-CMP-035 edit proposals
  -> replay result: accepted path або pending truncate
  -> UI-CMP-036 frame meter snapshot
  -> movePath + cachedNotation + stageContext + runtime summary
  -> app-level local custom combos
  -> optional saved combo summary / UI-CMP-011 context
  -> page-level singleton UI-CMP-021
```

Active game builder adapter і builder presentation components із `@mk-combos/ui` не пишуть в `localStorage`. Збереження виконує app-level flow після finish.

## Поведінка controller

Поточний placeholder не має page focus graph або contextual builder command scope.
App Shell обробляє лише `openGlobalMenu`, а connected ribbon містить одну
команду `Menu`. Whiteboard, Frame Meter, save/cancel і builder mutation controller flows
лишаються поза поточним implementation scope.

## Доступність і поведінка вводу

- Усі controls мають visible label або accessible name.
- Keyboard order іде від page heading до context setup, combo whiteboard, combo frame meter, action bar і dialogs.
- Internal `movePicker` region не є окремою page-level focus zone.
- Focus у combo whiteboard має бути помітним для candidates, steps і gaps.
- Focus у combo frame meter має бути помітним для timeline segments.
- Desktop timeline segment spans є roving focus targets; на mobile/tablet exact spans лишаються anchors, а compact controls використовують той самий focus model.
- Frame grid прокручується тільки горизонтально; summary, annotations та invalid/unavailable reasons лишаються поза scroller, а portal details не обрізаються ним.
- Local whiteboard menu має закриватися через `Escape`/`back` і повертати focus на source step або gap.
- Frame meter segment details мають відкриватися через `confirm`/`openActions`, закриватися через перший `Escape`/`back` і повертати focus на source segment; наступний keyboard `Escape` із закритими details прибирає timeline focus.
- Segment details мають non-modal popover semantics і не є hover-only tooltip.
- Disabled candidates мають readable reason, якщо вони відображаються.
- `UI-CMP-031 Stale/Invalid Combo Marker` не має покладатися тільки на колір.
- Invalid boundary і pending truncate у whiteboard не мають покладатися тільки на колір.
- Invalid boundary і unavailable segment у frame meter не мають покладатися тільки на колір.
- Unavailable exact frame data має visible localized reason; UI не показує порожню клітинкову geometry як нібито відомі frames.
- Busy state під час `loadingGraph` і `saving` має бути оголошений assistive technologies.
- Cancel confirmation має повертати focus до safe builder control після закриття.
- Page-level add-to-list dialog має керувати focus і повертати його до source saved combo summary/card після закриття.
- Controller hints не є єдиним способом зрозуміти доступні дії.
- Interactive controller/touch targets на `mobile` і `tablet` мають бути не менші за `44×44px`.

## Критерії приймання

- `UI-PAGE-006` є маршрутною сторінкою, не modal і не dropdown panel.
- Документ описує create, duplicate, edit і repair flows.
- Builder дозволяє тільки valid next moves із active game builder adapter.
- `free text fallback` не входить у MVP.
- Сторінка передає builder request в active game builder adapter.
- Builder request включає `gameId`, character, variation або kameo, optional stage context, start runtime state, optional initial path і gameVersion.
- Builder без selected `MKXL` stage не показує interactable moves.
- Builder із selected `MKXL` stage показує тільки interactables поточної карти, zone, segment і distance band.
- Frame-aware transitions проходять тільки через verified timing contract active game builder adapter-а; synthetic timing не використовується як presentation fact.
- Канонічна document-flow composition є повноширинною вертикальною послідовністю: dense Whiteboard, Frame Meter, page-owned sticky/safe-area wrapper із Action Bar.
- Internal Move Picker є centered composer layer: horizontal candidate row на `desktop`/`tablet` і vertical list на `mobile`; context strip показує місце майбутньої вставки.
- `UI-CMP-035 Combo Whiteboard` показує selected path у create, duplicate, edit і repair flows.
- Whiteboard move cards показують один-три prepared tactical/meta badges, а transitions — один-два prepared transition badges.
- `UI-CMP-036 Combo Frame Meter` показує selected move або whole combo timeline у create, duplicate, edit і repair flows.
- Available Frame Meter використовує спільний cell grid із zero-based `startCell`, positive `cellCount`, primary track, optional comparison track, move boundaries і prepared legend.
- Unavailable Frame Meter показує localized label/reason і не створює synthetic cells.
- Create flow показує empty active whiteboard до першого move.
- Duplicate/edit/repair flow показує locked source preview до підтвердження context.
- Internal `movePicker` region у Whiteboard показує header, group selector, candidate list, empty state і footer hints.
- Whiteboard step focus і gap focus мають різну семантику.
- Focus на Whiteboard candidate preview-ить prepared frame snapshot без додавання move; за відсутності підтверджених exact values snapshot є unavailable з readable reason.
- Whiteboard candidate selection застосовує active whiteboard target для append, insert або replace.
- Disabled candidate не створює proposal.
- Group switching у Whiteboard не змінює `movePath`.
- Whiteboard reorder працює через pick up/drop і replay proposal.
- Middle edit replay-ить suffix і не видаляє invalid tail без confirmation.
- Finish disabled, якщо є pending truncate або unresolved invalid tail.
- Controller може сфокусувати Frame Meter segment і відкрити readable segment details.
- `back` із segment details повертає focus на source segment.
- Frame Meter не емітить edit proposals або persistence events.
- Action Bar не володіє sticky positioning або safe-area inset.
- Після finish сторінка отримує `movePath`, `cachedNotation`, `stageContext` і runtime summary.
- Сторінка зберігає custom combo у local state через app-level persistence.
- Seeded combo лишається read-only під час duplicate flow.
- Stale або invalid custom combo не видаляється автоматично.
- `UI-CMP-031` показує invalid reason і дає шлях до repair/edit flow.
- Поточний placeholder не реєструє page controller scope; connected ribbon показує лише `Menu`.
- Active game builder adapter не відповідає за localStorage, named lists або routing.
- Add-to-list flow використовує один page-level singleton `UI-CMP-021` після створення або оновлення combo.

## Тестові сценарії

- Top Bar dropdown action відкриває `UI-PAGE-006 Custom Combo Builder`.
- Builder із нуля показує `contextSetup`, а після підтвердження context переходить у `ready`.
- Internal `movePicker` у Whiteboard показує valid стартові candidates.
- На `desktop`/`tablet` internal Move Picker portal містить horizontal candidate row; на `mobile` — vertical list. В обох випадках великий centered layer clamped до viewport, а target показаний у prepared before/target/after context strip.
- Вибір Whiteboard candidate оновлює `movePath`, `cachedNotation`, runtime state і valid next moves.
- Focus на Whiteboard candidate preview-ить prepared frame snapshot у `UI-CMP-036 Combo Frame Meter` без додавання move; unavailable data не підміняються synthetic values.
- Create flow показує empty active whiteboard із append target.
- Create flow без підтверджених exact frame data показує unavailable state із readable reason у `UI-CMP-036 Combo Frame Meter`.
- Dense Whiteboard із 8–12 moves переносить cards на наступні рядки без overlap/clipping і зберігає left-to-right reading order.
- Whiteboard показує один-три badges на кожній move/candidate card та один-два meta items на prepared transition.
- Duplicate або edit flow показує locked source preview до context confirmation.
- Invalid або disabled move не додається в path.
- Step focus + replace через Whiteboard candidate selection replay-ить full path.
- Gap focus + insert через Whiteboard candidate selection replay-ить suffix.
- Pick up/drop reorder replay-ить proposed path.
- Invalid suffix після middle edit показує pending truncate і блокує finish.
- Pending truncate показує invalid transition details у `UI-CMP-036 Combo Frame Meter`.
- Confirm truncate застосовує valid prefix.
- Cancel truncate повертає path до стану перед proposal.
- Builder без selected `MKXL` stage не показує interactable moves.
- Builder із selected `MKXL` stage показує тільки interactables поточної карти, zone, segment і distance band.
- Edge, який не проходить verified timing contract active game builder adapter-а, не доступний у valid next moves.
- Connected placeholder рендерить рівно одну shell-owned ribbon із `Menu`; disconnected state її приховує.
- Frame Meter створює один tab stop на prepared segment, а не на кожен frame.
- Selected-move grid вирівнює primary та optional comparison tracks за спільними cells.
- Whole-combo grid показує один continuous timeline зі step boundaries і transition spans.
- Довгий grid прокручується горизонтально без vertical clipping summary/annotations або portal clipping details.
- Unavailable grid не рендерить synthetic frame cells.
- `confirm` відкриває segment details.
- `back` закриває segment details і повертає focus на source segment.
- `noValidNextMoves` показує empty state і дозволяє finish, якщо path валідний.
- Finish створює custom combo з `movePath` і `cachedNotation`.
- Duplicate seeded combo створює новий custom combo і не змінює seeded data.
- Duplicate stage-specific seeded combo prefill-ить stage context і used interactables.
- Edit custom combo оновлює існуючий custom combo.
- Зміна character, variation, kameo, stage або start runtime state replay-ить path і показує invalid reason без видалення combo.
- Stale custom combo показує `UI-CMP-031` і не видаляється.
- Stale або invalid path показує original path, valid prefix і invalid boundary у whiteboard.
- Repair flow дозволяє зберегти виправлений path через актуальний graph.
- Save error не губить поточний path.
- Cancel із unsaved changes показує `cancelConfirm`.
- Після complete користувач може відкрити page-level singleton `UI-CMP-021 Add-To-List Dialog` через saved combo summary або [`UI-CMP-011`](./UI-CMP-011.md) context.
- `free text fallback` недоступний.

## Канонічний Responsive і Controller-only Contract

Поточна placeholder surface рендерить responsive content, але не має
page-owned controller targets. Її єдиний controller contract — shell `Menu`, що
відкриває global menu без synthetic events.
