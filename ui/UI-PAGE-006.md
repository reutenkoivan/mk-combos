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

Сторінка підтримує:

- створення custom combo з нуля;
- дублювання seeded combo у custom combo;
- редагування наявного custom combo;
- відновлення або виправлення stale/invalid custom combo через актуальний move graph;
- збереження custom combo у local state;
- optional додавання створеного або оновленого combo у named list.

Процес конструктора є строгим: користувач може обирати тільки `valid next moves`, які повертає active game builder entry point. `free text fallback` не входить у MVP.

`UI-PAGE-006` описує координацію на рівні сторінки. `@mk-combos/builder-ui` рендерить Whiteboard і Frame Meter, а active game business builder adapter володіє frame-aware логікою валідних переходів, replay, `movePath`, `cachedNotation`, runtime state і перевіркою stale state.

Архітектурний ownership описано в [ARCHITECTURE.md](../ARCHITECTURE.md): shared builder UI не вирішує game-specific rules.

## Володіння

`UI-PAGE-006` володіє маршрутним процесом і зв'язком між станом застосунку, active game builder adapter, `@mk-combos/builder-ui` та локальним збереженням.

Сторінка відповідає за:

- вибір або прийом режиму конструктора: `create`, `duplicate`, `edit` або `repair`;
- резолв active `gameId` із route prefix і вибір відповідного business entry point;
- передачу character, variation або kameo в процес конструктора;
- передачу optional `MKXL` stage context: stage, zone і segment;
- запит prepared builder state у active game builder adapter;
- рендер `UI-CMP-035` і `UI-CMP-036` із `@mk-combos/builder-ui`;
- отримання `movePath`, `cachedNotation`, `stageContext` і runtime summary після завершення процесу конструктора;
- запис custom combo у local state через app-level persistence;
- показ saved combo summary/card після збереження і відкриття page-level singleton `UI-CMP-021 Add-To-List Dialog`, якщо користувач хоче додати combo у named list;
- передачу команд контролера у дії конструктора.

Сторінка не відповідає за:

- зміну seeded combo data;
- import/export backup;
- керування named list persistence напряму;
- читання Browser Gamepad API;
- мапінг фізичних кнопок controller;
- ручну зміну `game`, `language` або `notation display mode`;
- визначення game-specific graph rules всередині сторінки.

## Зони розмітки

```text
UI-PAGE-006 Custom Combo Builder
  ├─ Коренева зона конструктора
  ├─ Підсумок режиму і контексту
  ├─ UI-CMP-023 Builder Context Setup
  ├─ UI-CMP-035 Combo Whiteboard
  │  ├─ internal movePicker region
  │  ├─ pathBoard region
  │  └─ UI-CMP-015 Notation Renderer
  ├─ UI-CMP-036 Combo Frame Meter
  ├─ UI-CMP-026 Builder Action Bar
  ├─ UI-CMP-031 Stale/Invalid Combo Marker
  ├─ Saved combo summary / UI-CMP-011 Combo Card
  ├─ UI-CMP-021 Add-To-List Dialog
  └─ Системні повідомлення / UI-CMP-030 Error State
```

### Коренева зона конструктора

Коренева зона конструктора є page-level container, який рендериться в slot активної сторінки `UI-PAGE-001 App Shell`.

Коренева зона має:

- показувати режим конструктора: `create`, `duplicate`, `edit` або `repair`;
- тримати стабільну розмітку для context setup, combo whiteboard із internal `movePicker`, combo frame meter і action bar;
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
| `frameContext` | Фільтрує links, cancels і juggles через explicit edge `frameWindow`. |
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
- підтримувати mouse, touch, keyboard і controller navigation всередині Whiteboard focus;
- не дозволяти вибрати move, який не проходить `requires`, spacing constraints або `frameWindow`;
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
- показувати steps і gaps як окремі focus targets;
- позначати останній доданий move;
- показувати runtime summary: meter, damage estimate, position і used interactables, якщо builder state це надає;
- показувати active empty board, якщо create flow ще не має moves;
- показувати locked source preview у duplicate/edit/repair flow до підтвердження context;
- показувати original path, valid prefix і invalid boundary для stale або invalid path;
- відкривати local context menu для step або gap;
- підтримувати insert, replace, remove, undo-to-step і pick up/drop reorder як edit proposals;
- не змінювати builder state напряму.

Active game builder adapter лишається source of truth для accepted path. Whiteboard емітить edit proposal, а game builder replay-ить path і повертає accepted path або pending truncate state з valid prefix, invalid tail і readable invalid reason.

Finish action має бути disabled, якщо whiteboard має pending truncate або unresolved invalid tail.

### UI-CMP-036 Combo Frame Meter

`UI-CMP-036 Combo Frame Meter` показує interactive frame inspection поруч із whiteboard.

Frame Meter має:

- показувати `selectedMove`, якщо сфокусований whiteboard step або internal Whiteboard candidate;
- показувати `wholeCombo`, якщо move focus відсутній;
- показувати startup, active, recovery, hit/block advantage, cancel window, link/juggle window і meter cost/gain, якщо ці дані доступні;
- показувати per-step timeline, transition gaps, cumulative frame context і invalid boundaries для whole combo;
- відкривати readable segment details через keyboard/controller `confirm` або `openActions`;
- закривати segment details через `back` і повертати focus на source segment;
- preview-ити focused Whiteboard candidate без додавання move у path;
- не емітити edit proposals, graph validation або persistence events.

Frame meter snapshot є derived state з move frame data, edge `frameWindow`, transition `effects`, runtime `frameContext` і replay result. Active game builder adapter лишається source of truth для frame-aware validity.

### UI-CMP-026 Builder Action Bar

`UI-CMP-026 Builder Action Bar` містить основні дії builder flow.

Action Bar має:

- undo останній move;
- finish combo, якщо path можна завершити;
- cancel flow;
- відкрити add-to-list flow через saved combo summary/card після збереження, якщо combo вже створене або оновлене;
- показувати disabled або busy states під час `saving`.

### UI-CMP-031 Stale/Invalid Combo Marker

`UI-CMP-031 Stale/Invalid Combo Marker` показує, що custom combo стало невалідним після оновлення move graph або несумісне з актуальним context.

Marker має:

- не видаляти custom combo;
- показувати readable invalid reason;
- дозволяти перейти в repair/edit flow;
- пояснювати, що виправлення буде виконане через актуальний guided builder.

### UI-CMP-021 Add-To-List Dialog

`UI-CMP-021 Add-To-List Dialog` відкривається як page-level singleton action dialog після збереження custom combo.

Dialog не належить `@mk-combos/builder-ui`. Він працює з named lists на рівні застосунку і локальним збереженням, отримує context від saved combo summary/card і повертає add-to-list intent у page/app-level flow.

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

- mode: `emptyActive`, `builderEditable`, `lockedPreview`, `repairReview`, `pendingTruncate` або `savingFrozen`;
- `movePath`;
- `cachedNotation`;
- notation display mode;
- selected/focused step або gap;
- valid next moves для internal `movePicker`;
- selected або focused move candidate;
- move groups і selected group;
- invalid або disabled candidate reasons;
- frame, spacing, stage або interactable usage reasons для unavailable candidates, якщо вони показані disabled;
- active target mode: append, insert, replace або reorder;
- current damage/meter/position/frame summary, якщо builder state це надає;
- stage context і used interactables, якщо path stage-specific;
- valid prefix, invalid tail, invalid boundary і pending truncate state, якщо builder replay це повертає;
- invalid marker для path або окремого move.

Вихідні події:

- request focus step;
- request focus gap;
- request focus move candidate;
- request select valid move candidate;
- request next або previous move group;
- request candidate details для move, якщо page-level UI це підтримує;
- request open move details, якщо це підтримано page-level flow;
- request open local step/gap menu;
- request append, insert, replace, remove, undo-to-step або pick up/drop reorder як edit proposal;
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

- mode: `selectedMove`, `wholeCombo`, `segmentDetailsOpen`, `pendingTruncate`, `repairReview` або `savingFrozen`;
- frame meter snapshot для selected move або whole combo;
- focused whiteboard step або focused Whiteboard candidate, якщо є;
- selected timeline segment;
- startup/active/recovery, advantage, cancel/link/juggle windows і meter deltas, якщо доступні;
- transition gaps, cumulative frame context і runtime meter after segment;
- valid prefix, invalid transition, invalid tail і readable invalid reason, якщо replay повернув stale або pending truncate state;
- controller navigation focus state.

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
- не зберігає custom combo;
- не змінює seeded data.

### UI-CMP-026 Builder Action Bar

Вхідні дані:

- can undo;
- can finish;
- can cancel;
- save state;
- dirty state;
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
- не належить `@mk-combos/builder-ui`.

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
- `UI-CMP-036 Combo Frame Meter` показує empty runtime frame summary або locked source timeline, якщо source path передано;
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
- frame meter показує whole combo timeline або empty runtime frame summary;
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
- timeline segments доступні як focus targets;
- `navLeft` і `navRight` рухають focus між segments;
- `navUp` і `navDown` переводять focus між Whiteboard, Frame Meter і Action Bar відповідно до layout;
- `confirm` або `openActions` на segment відкриває readable segment details;
- Frame Meter не виконує append, insert, replace, remove, reorder або save.

### `segmentDetailsOpen`

Frame Meter показує readable details для active timeline segment.

Очікуваний UI:

- details panel є локальним disclosure у Frame Meter, не route і не modal;
- panel показує segment name, frame range, startup/active/recovery або transition gap, advantage/cancel/link window і invalid/unavailable reason, якщо він є;
- `back` закриває details і повертає focus на source segment;
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
- frame meter переходить у `savingFrozen`, лишає timeline/details видимими і не мутує path.

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
6. Focus/selection candidate відбувається всередині Whiteboard.
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

Active game builder adapter і `@mk-combos/builder-ui` не пишуть в `localStorage`. Збереження виконує app-level flow після finish.

## Поведінка controller

App Shell передає semantic builder commands активній сторінці.

`UI-PAGE-006` підтримує:

- `builderSelectMove`: вибрати focused valid Whiteboard candidate;
- `builderUndoMove`: відкотити останній move;
- `builderFinish`: завершити combo, якщо path можна зберегти;
- `builderCancel`: відкрити cancel flow або вийти без змін, якщо path clean;
- `builderNextGroup`: перейти до наступної internal Whiteboard move group;
- `builderPreviousGroup`: перейти до попередньої internal Whiteboard move group.

Коли focus у `UI-CMP-035 Combo Whiteboard`:

- `navLeft` і `navRight` рухають focus між candidates, steps або gaps залежно від active Whiteboard subregion;
- `navUp` і `navDown` переводять focus між Whiteboard, Frame Meter і Action Bar відповідно до layout;
- `builderNextGroup` і `builderPreviousGroup` перемикають internal move groups без зміни `movePath`;
- `confirm` на focused valid candidate створює append, insert або replace proposal;
- `confirm` або `openActions` відкриває local step/gap menu;
- `back` закриває menu, cancel pick up/drop або повертає focus до safe builder control;
- pick up/drop reorder має controller equivalent і не залежить тільки від pointer drag.

Коли focus у `UI-CMP-036 Combo Frame Meter`:

- `navLeft` і `navRight` рухають focus між timeline segments;
- `navUp` і `navDown` переводять focus між Whiteboard, Frame Meter і Action Bar відповідно до layout;
- `confirm` на segment відкриває readable segment details;
- `openActions` відкриває ті самі segment details або розширений details panel, якщо доступний;
- `back` закриває details і повертає focus на source segment;
- якщо details закриті, `back` повертає focus до safe builder control;
- controller hints пояснюють ці дії без додавання нових semantic commands.

Controller commands не мають:

- вибирати invalid move;
- виконувати save без valid finish state;
- змінювати route без page-level handling;
- читати Browser Gamepad API напряму.

## Доступність і поведінка вводу

- Усі controls мають visible label або accessible name.
- Keyboard order іде від page heading до context setup, combo whiteboard, combo frame meter, action bar і dialogs.
- Internal `movePicker` region не є окремою page-level focus zone.
- Focus у combo whiteboard має бути помітним для candidates, steps і gaps.
- Focus у combo frame meter має бути помітним для timeline segments.
- Local whiteboard menu має закриватися через `Escape`/`back` і повертати focus на source step або gap.
- Frame meter segment details мають відкриватися через `confirm`/`openActions`, закриватися через `Escape`/`back` і повертати focus на source segment.
- Segment details не мають бути hover-only tooltip.
- Disabled candidates мають readable reason, якщо вони відображаються.
- `UI-CMP-031 Stale/Invalid Combo Marker` не має покладатися тільки на колір.
- Invalid boundary і pending truncate у whiteboard не мають покладатися тільки на колір.
- Invalid boundary і unavailable segment у frame meter не мають покладатися тільки на колір.
- Busy state під час `loadingGraph` і `saving` має бути оголошений assistive technologies.
- Cancel confirmation має повертати focus до safe builder control після закриття.
- Page-level add-to-list dialog має керувати focus і повертати його до source saved combo summary/card після закриття.
- Controller hints не є єдиним способом зрозуміти доступні дії.

## Критерії приймання

- `UI-PAGE-006` є маршрутною сторінкою, не modal і не dropdown panel.
- Документ описує create, duplicate, edit і repair flows.
- Builder дозволяє тільки valid next moves із active game builder adapter.
- `free text fallback` не входить у MVP.
- Сторінка передає builder request в active game builder adapter.
- Builder request включає `gameId`, character, variation або kameo, optional stage context, start runtime state, optional initial path і gameVersion.
- Builder без selected `MKXL` stage не показує interactable moves.
- Builder із selected `MKXL` stage показує тільки interactables поточної карти, zone, segment і distance band.
- Frame-aware transitions проходять тільки через explicit edge `frameWindow`.
- `UI-CMP-035 Combo Whiteboard` показує selected path у create, duplicate, edit і repair flows.
- `UI-CMP-036 Combo Frame Meter` показує selected move або whole combo timeline у create, duplicate, edit і repair flows.
- Create flow показує empty active whiteboard до першого move.
- Duplicate/edit/repair flow показує locked source preview до підтвердження context.
- Internal `movePicker` region у Whiteboard показує header, group selector, candidate list, empty state і footer hints.
- Whiteboard step focus і gap focus мають різну семантику.
- Focus на Whiteboard candidate preview-ить frame values без додавання move.
- Whiteboard candidate selection застосовує active whiteboard target для append, insert або replace.
- Disabled candidate не створює proposal.
- Group switching у Whiteboard не змінює `movePath`.
- Whiteboard reorder працює через pick up/drop і replay proposal.
- Middle edit replay-ить suffix і не видаляє invalid tail без confirmation.
- Finish disabled, якщо є pending truncate або unresolved invalid tail.
- Controller може сфокусувати Frame Meter segment і відкрити readable segment details.
- `back` із segment details повертає focus на source segment.
- Frame Meter не емітить edit proposals або persistence events.
- Після finish сторінка отримує `movePath`, `cachedNotation`, `stageContext` і runtime summary.
- Сторінка зберігає custom combo у local state через app-level persistence.
- Seeded combo лишається read-only під час duplicate flow.
- Stale або invalid custom combo не видаляється автоматично.
- `UI-CMP-031` показує invalid reason і дає шлях до repair/edit flow.
- Controller commands працюють тільки через semantic builder actions.
- Active game builder adapter не відповідає за localStorage, named lists або routing.
- Add-to-list flow використовує один page-level singleton `UI-CMP-021` після створення або оновлення combo.

## Тестові сценарії

- Top Bar dropdown action відкриває `UI-PAGE-006 Custom Combo Builder`.
- Builder із нуля показує `contextSetup`, а після підтвердження context переходить у `ready`.
- Internal `movePicker` у Whiteboard показує valid стартові candidates.
- Вибір Whiteboard candidate оновлює `movePath`, `cachedNotation`, runtime state і valid next moves.
- Focus на Whiteboard candidate preview-ить frame values у `UI-CMP-036 Combo Frame Meter` без додавання move.
- Create flow показує empty active whiteboard із append target.
- Create flow показує empty runtime frame summary у `UI-CMP-036 Combo Frame Meter`.
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
- Edge, який не проходить `frameWindow`, не доступний у valid next moves.
- `builderUndoMove` відкочує останній move.
- `builderNextGroup` і `builderPreviousGroup` перемикають internal Whiteboard move groups.
- Controller focus переходить у Frame Meter і між timeline segments.
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

## Відкриті уточнення

- Точний вигляд move groups буде визначено під час UI реалізації.
- Точний copy для invalid reasons має відповідати shared system message стилю.
- Builder deep links використовують generic route `/:gameId/builder`; game-specific query або state serialization належить active game business entry point.
