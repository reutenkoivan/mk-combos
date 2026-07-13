# UI-CMP-035: Combo Whiteboard

## Метадані

- Код: `UI-CMP-035`
- Назва: `Combo Whiteboard`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські поверхні: `UI-PAGE-004 Combo Detail`, `UI-PAGE-006 Custom Combo Builder`
- Замінює active usage: `UI-CMP-016 Move Path Viewer`, `UI-CMP-025 Combo Path Preview`
- Об'єднує active usage: `UI-CMP-024 Move Picker` як deprecated/merged reference; active picker behavior є внутрішнім `movePicker` region цього компонента
- Пов'язані компоненти: [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md), `UI-CMP-036 Combo Frame Meter`
- Пов'язані UX сценарії: `US-007`, `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-025`

## Призначення

`UI-CMP-035 Combo Whiteboard` показує selected combo path як щільну багаторядкову послідовність moves, prepared gameplay transitions, runtime summary, invalid markers і внутрішній `movePicker` region для вибору valid next moves. Технічні `ComboWhiteboardGap` є тільки `insert`/`drop` targets і не представляють frame gap, link, cancel або juggle facts.

`MovePicker` більше не існує як окремий active компонент, public API або page-level focus zone. `UI-CMP-024` лишається тільки deprecated/merged reference, а вся активна поведінка вибору move живе всередині `UI-CMP-035`.

Компонент має два основні режими:

- `builderEditable`: editable workspace у `UI-PAGE-006 Custom Combo Builder`;
- `detailReadOnly`: read-only inspection у `UI-PAGE-004 Combo Detail`.

У builder mode whiteboard не є source of truth. Він рендерить path board і внутрішній `movePicker`, емітить edit proposals, а active game builder adapter replay-ить proposed path, оновлює `movePath`, `cachedNotation`, runtime state, valid next moves, invalid reasons і pending truncate state.

У detail mode whiteboard не емітить mutation events. Він дозволяє step focus і inspection, але edit або duplicate запускаються тільки через page-level actions.

Whiteboard синхронізує focused step або focused move candidate із `UI-CMP-036 Combo Frame Meter`, щоб Frame Meter міг показати `selectedMove`. Якщо Frame Meter просить сфокусувати matching whiteboard step, Whiteboard оновлює тільки presentation focus і не змінює `movePath`.

## Володіння

`UI-CMP-035` є доменним компонентом `@mk-combos/ui`, який може рендеритися builder і detail поверхнями.

Власники стану:

- active game builder adapter володіє active builder path, replay, validation, invalid reasons і accepted/truncated state;
- `UI-PAGE-006` володіє routing, persistence, cancel/save confirmation і page-level dialogs;
- `UI-PAGE-004` володіє detail context, actions menu і read-only combo data;
- `useComboWhiteboardModel` викликається на рівні page flow і готує presentation focus, focused move candidate, selected move group, local menu open state і temporary pick up/drop gesture state;
- `UI-CMP-035` рендерить prepared whiteboard model і емітить semantic edit/focus intents.

Пара module exports:

- hook: `useComboWhiteboardModel`;
- pure UI component: `ComboWhiteboard` / `UI-CMP-035`.

Обидва exports належать одному public subpath `@mk-combos/ui/components/combo-whiteboard`; окремого hook subpath або public `MovePicker` немає.

Виклик hook-а належить `UI-PAGE-006` або `UI-PAGE-004`; pure UI component не імпортує builder adapter, route state, persistence або game packages напряму.

Компонент не має:

- самостійно мутувати `movePath`;
- самостійно писати `cachedNotation`;
- зберігати custom combo;
- змінювати seeded combo data;
- виконувати graph validation без active game builder adapter.

## Анатомія

Розміщення whiteboard є повноширинною робочою ділянкою builder workspace: path board завжди є першою ділянкою, internal `movePicker` за замовчуванням закритий і відкривається як centered composer layer після вибору append/insert/replace target, а markers/confirmations прив'язані до відповідної ділянки path або candidate.

```jsx
<ComboWhiteboard ui="UI-CMP-035">
  <WhiteboardSurface slot="builder workspace">
    <Stack name="WhiteboardLayout">
      <RuntimeSummaryStrip />

      <PathBoardRegion measuredWidth="container-owned">
        <DenseReactFlowRows readingOrder="left-to-right">
          <MoveStep width="~11rem">
            <Ordinal />
            <MoveName />
            <Notation />
            <PreparedMetaBadges count="1..3" />
          </MoveStep>

          <PreparedTransition fromStepId toStepId>
            <PreparedMetaBadges count="1..2" />
          </PreparedTransition>

          <TechnicalInsertDropTarget size="44px" />
          <RowContinuationMarker />
        </DenseReactFlowRows>

        <Show when={hasInvalidBoundaryMarker}>
          <InvalidBoundaryMarker />
        </Show>

        <Show when={hasLocalStepGapActionMenu}>
          <AnchoredLocalPopover />
        </Show>
      </PathBoardRegion>

      <Show when={hasMovePickerComposer}>
        <BodyPortal>
          <CenteredMovePickerComposer>
            <InsertionContext before="move|combo-start" after="move|combo-end" />
            <MoveGroupSelector />
            <CandidateList desktopTablet="horizontal" mobile="vertical" />
            <MovePickerFooterHints />
          </CenteredMovePickerComposer>
        </BodyPortal>
      </Show>

      <Show when={hasPendingTruncateConfirmation}>
        <PendingTruncateConfirmationRegion />
      </Show>

      <Show when={hasRepairStaleMarker}>
        <RepairStaleMarkerRegion />
      </Show>
    </Stack>
  </WhiteboardSurface>
</ComboWhiteboard>
```

Правила розміщення:

- Path board є повноширинною основною ділянкою та лишається source context для internal `movePicker`; picker portal логічно належить Whiteboard і не займає місце у document flow.
- Кількість карток у рядку визначається виміряною internal width, а не viewport breakpoint; кожен рядок читається зліва направо та має incoming/outgoing continuation marker на переносі.
- Картка move має ширину приблизно `11rem`; connector та технічний insert/drop target займають `44px` і мають стабільний `8px` gutter з обох боків. Canvas height виводиться з кількості рядків і prepared content без fixed `h-72`, fit scaling або vertical clipping.
- Prepared transition прив'язаний до stable `fromStepId`/`toStepId` і рендериться окремо від `ComboWhiteboardGap`. Connector edges прямі, React Flow handles приховані та не є interaction affordance.
- Internal `movePicker` рендериться як великий theme-aware centered composer layer у body portal. Layer показує context strip `move before → active target → move after`, має viewport-safe max height і власний vertical scroll, тому відкриття або зміна target не змінює висоту сторінки.
- React Flow не масштабує UI-owned controls; усі interactive targets зберігають physical `44×44px` minimum.
- Presentation focus, local menu state, selected move group і temporary pick up/drop gesture state готує `useComboWhiteboardModel`, який page component викликає на page рівні.

## Вхідні дані

- `mode`: `emptyActive`, `builderEditable`, `detailReadOnly`, `lockedPreview`, `repairReview`, `pendingTruncate` або `savingFrozen`;
- prepared Whiteboard source зі stable step, gap, candidate і group ids;
- notation безпосередньо на кожному prepared step і candidate та active notation display mode;
- runtime dictionary `comboWhiteboardMetaStatuses = available | unavailable`;
- discriminated `ComboWhiteboardMetaItem`: open `id`, localized `label`, optional `value`, prepared theme-aware `tone`; `unavailable` item обов'язково має readable `reason`;
- кожен step і candidate має обов'язковий tuple із `1..3` `metaItems`; колишнього step/candidate `summary` немає;
- ordered prepared transitions зі stable `fromStepId`/`toStepId` і tuple із `1..2` `metaItems` для facts на кштал `Gap 2f`, `Cancel`, `Link` або `Juggle`;
- localized labels, availability і readable disabled/readonly reasons; composer context обов'язково готує `beforeTarget`, `afterTarget`, `comboStart`, `comboEnd` і `closePicker`;
- prepared runtime/context summaries без обчислення їх із raw game metadata у component;
- один ordered step list, valid boundary index та prepared pending-truncate confirmation, якщо path stale або proposal truncated;
- responsive focus data;
- presentation model із одним discriminated focus target, selected group, local menu, edit target і pick-up/drop state, який повертає `useComboWhiteboardModel`.

## Вихідні події

У всіх non-frozen modes, де prepared target доступний:

- discriminated focus intent для step або gap;
- `openStepDetails`;
- `openLocalMenu` / `closeLocalMenu` із поверненням focus до source target.

У `emptyActive` та `builderEditable`:

- discriminated candidate focus intent;
- `selectMoveCandidate` — єдиний candidate proposal; payload містить candidate id і discriminated `editTarget` (`append`, `insert` або `replace`);
- `setEditTarget`, який вибирає append/insert/replace presentation target без mutation path;
- `selectMoveGroup`, `moveToNextGroup` або `moveToPreviousGroup`;
- `openCandidateDetails`, якщо page-level details підтримані;
- `removeStep`, `undoToStep`, `pickUpStep` або `dropPickedStep`;

Тільки у `pendingTruncate`: `confirmTruncate` або `cancelTruncate`; path та invalid tail лишаються видимими до рішення.

Тільки у `repairReview`: `repairFromValidPrefix`.

Тільки у `detailReadOnly`:

- `editCustomCombo`;
- `duplicateSeededCombo`, якщо detail action це дозволяє.

У `savingFrozen` усі actions inert, але path, picker і prepared status лишаються видимими. `lockedPreview` не емітить builder proposals.

Окремих append/insert/replace candidate event channels немає. Focused candidate сам є inspection target для Frame Meter, тому дубльований preview/sync event не потрібний. Output payloads містять discriminated intent, відповідні stable ids, mode, reason і source focus target. Component не передає browser або React Flow event objects у page-level handlers.

## C4 структура internal `movePicker`

### C4-L1: System Context

```mermaid
flowchart LR
  User["Користувач / Controller"] --> Page["UI-PAGE-006 Custom Combo Builder"]
  Page --> GameBuilder["active game builder adapter"]
  Page --> Whiteboard["UI-CMP-035 Combo Whiteboard"]
  GameBuilder --> Whiteboard
  Whiteboard --> FrameMeter["UI-CMP-036 Combo Frame Meter"]
```

- Користувач вибирає move не в окремому picker surface, а всередині Whiteboard.
- `UI-PAGE-006` координує route, persistence і dialogs, але не рендерить `MovePicker` як sibling.
- Active game builder adapter лишається source of truth для graph, valid next moves, replay і validation.
- `Combo Frame Meter` отримує preview від focused Whiteboard candidate.

### C4-L2: Containers / Ownership

```mermaid
flowchart TB
  Page["UI-PAGE-006\nroute + persistence"] --> Builder["active game builder\nstate + replay + validation"]
  Page --> Whiteboard["ComboWhiteboard\npath board + internal movePicker"]
  Builder --> Whiteboard
  Whiteboard --> Builder
  Whiteboard --> Meter["ComboFrameMeter\nframe preview / timeline"]
  Whiteboard --> ActionBar["UI-CMP-026\nfinish / cancel / undo"]
```

- `UI-PAGE-006` передає у Whiteboard builder state, valid next moves, current target, saving/loading/error states.
- `useComboWhiteboardModel` готує presentation focus: candidate focus, step focus, gap focus, local menu, pick up/drop.
- Active game builder adapter приймає edit proposals і повертає accepted path або pending truncate.
- `ComboFrameMeter` читає focused Whiteboard step або focused Whiteboard candidate.

### C4-L3: Component Structure

```mermaid
flowchart TB
  Whiteboard["ComboWhiteboard"]

  Whiteboard --> Path["pathBoard region"]
  Whiteboard --> Picker["centered movePicker composer layer"]
  Whiteboard --> Menu["local step/gap menu"]

  Path --> Rows["measured dense rows"]
  Rows --> Step["move card + 1..3 badges"]
  Rows --> Transition["prepared transition + 1..2 badges"]
  Rows --> Gap["44px technical insert/drop target"]
  Rows --> Continuation["row continuation marker"]

  Picker --> Header["MovePickerHeader"]
  Picker --> Groups["MoveGroupSelector"]
  Picker --> List["MoveCandidateList"]
  Picker --> Empty["MovePickerEmptyState"]
  Picker --> Hints["MovePickerFooterHints"]

  List --> Item["MoveCandidateItem"]
```

#### `movePicker region`

Внутрішній регіон Whiteboard, який показується тільки в builder-capable modes:

- `emptyActive`;
- `builderEditable`;
- `pendingTruncate`;
- `repairReview`;
- `savingFrozen` як disabled/frozen view.

У `detailReadOnly` цей регіон не рендериться.

#### `MovePickerHeader`

Показує:

- active target: `append`, `insert`, `replace`;
- readable target label, наприклад `Append next move`, `Insert into gap`, `Replace focused step`;
- loading або no-valid-moves status;
- current group name, якщо групи активні.

#### `MoveGroupSelector`

Показує move groups як tabs або segmented control, якщо graph повертає групування.

Поведінка:

- `next group` і `previous group` працюють всередині Whiteboard;
- прямий вибір group емітить `selectMoveGroup` intent;
- group switching не змінює `movePath`;
- selected group впливає тільки на visible candidates.

#### `MoveCandidateList`

Показує candidates як horizontal scrollable row усередині floating composer на desktop/tablet або vertical list на mobile.

Правила:

- valid moves selectable;
- disabled moves optional, але якщо показані, мають readable reason;
- list не дозволяє `free text fallback`;
- interactable moves для `MKXL` показуються тільки за valid stage, zone і segment context.

#### `MoveCandidateItem`

Кожен item показує:

- move name;
- notation;
- `1..3` завжди видимі prepared badges для category, корисного role tag і resource cost/gain або truthful unavailable fact;
- `route-source` є provenance/scaffold tag і ніколи не мапиться у tactical або role badge;
- disabled reason: meter, spacing, stage zone, state або frame window;
- selected/focused state, доступний keyboard/controller navigation.

#### `MovePickerEmptyState`

Показується, коли:

- graph ще loading;
- valid next moves відсутні;
- current path завершений або заблокований pending truncate;
- selected context не дозволяє interactables.

#### `MovePickerFooterHints`

Показує контекстні controller/keyboard hints:

- select focused candidate;
- next/previous group;
- move focus між candidates, steps/gaps і Frame Meter;
- `back`/`escape` для повернення до safe Whiteboard focus.

### C4-L4: Interaction Flow

```mermaid
sequenceDiagram
  participant U as User
  participant W as ComboWhiteboard
  participant B as ActiveGameBuilder
  participant F as ComboFrameMeter

  U->>W: focus candidate
  W->>F: preview focused Whiteboard candidate
  U->>W: select candidate
  W->>B: edit proposal append/insert/replace
  B->>W: accepted path або pending truncate
  W->>F: update selected move / whole combo timeline
```

- Candidate focus preview-ить frame values без path mutation.
- Candidate select створює proposal за active target:
  - no focused step/gap -> append;
  - focused gap -> insert;
  - focused step у replace mode -> replace.
- Disabled candidate не створює proposal.
- Pending truncate не видаляє invalid tail без explicit confirmation.

## Режими

### `emptyActive`

Create flow ще не має moves, але graph context уже достатній для builder workspace.

Правила:

- показувати empty board, context/runtime summary і append target;
- внутрішній `movePicker` додає first move через append proposal;
- finish disabled, доки builder state не дозволяє зберегти path.

### `builderEditable`

Builder graph готовий, whiteboard є окремою focus zone між `UI-CMP-023 Builder Context Setup`, `UI-CMP-036 Combo Frame Meter` і `UI-CMP-026 Builder Action Bar`.

Правила:

- empty create flow показує active board із context/runtime summary і append target;
- внутрішній `movePicker` показує valid candidates, optional disabled candidates із readable reasons і move groups;
- step focus дозволяє details, replace, remove, undo-to-step і pick up;
- gap focus дозволяє insert;
- no focus або append target означає append;
- candidate selection застосовує selected step/gap target, а не завжди додає move в кінець;
- кожна edit дія емітить proposal у builder state machine.

### `detailReadOnly`

Combo Detail показує path через той самий whiteboard, але без mutation events.

Правила:

- seeded і custom combo read-only у detail surface;
- step focus показує move/runtime details;
- edit custom combo і duplicate seeded combo запускаються через page-level actions, а не через direct whiteboard mutation;
- invalid custom combo може показувати invalid boundary і repair entry, але repair відкриває builder.

### `lockedPreview`

Duplicate, edit або repair flow має source path, але context ще не підтверджено або graph ще не replay-нутий.

Правила:

- показувати source path read-only;
- показувати source combo label/context, якщо page передав його;
- edit controls disabled;
- після context confirmation builder переходить у `loadingGraph`, а потім у `builderEditable` або `repairReview`.

### `repairReview`

Initial path або current path не проходить validation.

Правила:

- показувати original path;
- показувати valid prefix;
- показувати invalid boundary між valid prefix і invalid tail;
- не видаляти invalid tail автоматично;
- repair starts from valid prefix тільки після user action або confirmation.

### `pendingTruncate`

Replay edit proposal або context change повернув valid prefix і invalid tail.

Правила:

- показувати proposed valid prefix, invalid tail і invalid boundary;
- finish disabled;
- confirm truncate застосовує valid prefix;
- cancel truncate повертає path до стану перед proposal;
- invalid tail не видаляється без explicit confirmation.

### `savingFrozen`

Save in progress.

Правила:

- path, notation і runtime summary лишаються видимими;
- edit controls disabled;
- repeated finish disabled;
- save error повертає попередній editable state без втрати path.

## Edit proposals і replay

Whiteboard edit не застосовується локально як mutation. Candidate selection створює один `selectMoveCandidate` proposal з discriminated target:

- append selected move;
- insert selected move у focused gap;
- replace focused step selected move;
Remove, undo-to-step і reorder через pick up/drop лишаються окремими semantic path proposals, бо вони не є candidate selection.

Active game builder adapter replay-ить full proposed path:

1. Replay починається з active graph input і start runtime state.
2. Кожен step застосовується через frame-aware transition rules.
3. Якщо весь proposed path валідний, builder приймає його як active `movePath`.
4. Якщо path валідний тільки до певного місця, builder повертає valid prefix, invalid tail і readable invalid reason.
5. Whiteboard переходить у `pendingTruncate`, а finish залишається disabled.
6. Truncation застосовується тільки після explicit confirmation.

Middle edit policy:

- insert, replace і reorder у середині path replay-ять suffix;
- valid suffix зберігається;
- invalid tail не зникає без confirmation;
- cancel truncate повертає path до стану перед proposal.

## Інтеграція зі станами builder

| Builder state | Whiteboard behavior |
| --- | --- |
| `contextSetup` | Create flow показує `emptyActive`; duplicate/edit/repair показує `lockedPreview` source path. |
| `loadingGraph` | Whiteboard frozen; source або current path visible while replay/loading. |
| `ready` | Whiteboard `builderEditable`; empty path або replayed valid path і internal candidate list visible. |
| `selectingMove` | Internal `movePicker` застосовує selected step/gap target: append, insert або replace. |
| `whiteboardFocused` | Whiteboard має focus zone, candidate navigation, step/gap navigation і local context menu. |
| `noValidNextMoves` | Current path visible; finish available тільки без pending truncate або invalid tail. |
| `invalidInitialPath` | `repairReview` показує original path, valid prefix і invalid boundary. |
| `staleCustomCombo` | `repairReview`; custom combo не видаляється, repair starts from valid prefix. |
| `saving` | `savingFrozen`; repeated save і edit disabled. |
| `saveError` | Повернення до `builderEditable` із тим самим path і readable error. |
| `cancelConfirm` | Whiteboard frozen behind confirmation. |
| `complete` | Saved combo summary може використовувати read-only whiteboard або [`UI-CMP-011`](./UI-CMP-011.md) context. |

## Keyboard і controller navigation

Whiteboard є окремою focus zone.

Правила:

- `navLeft`/`navRight` рухають focus між candidates, steps або gaps залежно від active whiteboard subregion;
- `navUp`/`navDown` рухають focus між Whiteboard, `UI-CMP-036 Combo Frame Meter` і Action Bar відповідно до layout;
- `builderNextGroup` і `builderPreviousGroup` перемикають move groups тільки всередині Whiteboard;
- `confirm` на focused valid candidate створює append, insert або replace proposal відповідно до active target;
- `confirm` на step або gap відкриває local context menu;
- `openActions`, якщо доступний, також відкриває local context menu;
- `ArrowUp`/`ArrowDown`, `Home` і `End` рухають DOM focus між доступними menu actions;
- `back` закриває menu, cancel pick up/drop або повертає focus до safe builder control;
- pick up/drop reorder має keyboard/controller equivalent, не тільки pointer drag;
- controller hints не додають нові semantic commands, а пояснюють contextual actions для active whiteboard focus.

## Доступність

- Whiteboard отримує prepared accessible name, який називає режим: editable builder або read-only detail.
- Internal `movePicker` region має accessible label усередині Whiteboard і не оголошується як окремий page-level компонент.
- Candidate focus має бути видимим і доступним keyboard/controller navigation.
- Step і gap focus має бути видимим і доступним keyboard/controller navigation.
- Step card завжди показує ordinal, move name, notation і `1..3` prepared badges; damage не є частиною default card composition.
- Transition metadata завжди має text label і не покладається лише на connector geometry або color.
- `unavailable` badge показує `?`, dashed treatment і readable reason додатково до prepared tone.
- Disabled candidates мають readable reason, якщо вони відображаються.
- Invalid boundary не покладається тільки на колір.
- Pending truncate має readable confirmation text і не змінює path без user action.
- Local context menu є anchored floating popover, закривається через `Escape`/`back` і повертає focus на source step або gap через `focus({ preventScroll: true })`.
- Internal picker є повним composer surface: він зберігає insertion context, target label, group selector, candidates, tactical metadata, details та candidate add action; portal не перетворює його на окремий page-level компонент.
- Picker за замовчуванням закритий. Після вибору append/insert/replace у local target menu він відкривається centered layer; `close`, `Escape`, backdrop press або успішний candidate proposal закривають layer і повертають focus до source target через `preventScroll`.
- Context strip показує actual prepared move name та notation до і після target; на межах використовує localized `comboStart`/`comboEnd`, а replace додатково показує move, який буде замінено.
- Saving і replay states мають бути оголошені assistive technologies.

## Критерії приймання

- Builder create flow показує empty active whiteboard до першого move.
- Duplicate/edit/repair flow показує locked source preview до context confirmation.
- Builder whiteboard є окремою focus zone між context setup, Combo Frame Meter і Action Bar.
- Internal `movePicker` region показує candidate structure: header, group selector, candidate list, empty state і footer hints.
- Path із `8..12` moves переноситься у щільні рядки за measured container width без overlap, clipping або zoom scaling; canvas height росте разом із row count.
- Кожен перенос має continuation markers, а всі рядки читаються зліва направо.
- Step/candidate завжди мають `1..3` badges; prepared transition між stable step ids має `1..2` badges.
- Technical insert/drop gap не використовується для gameplay `Gap`, `Cancel`, `Link` або `Juggle` metadata.
- Internal picker не займає місце під path: він portal-иться у centered dialog-like layer із видимим insertion context; desktop/tablet використовують horizontal candidate row, mobile — vertical list.
- Step focus і gap focus мають різну семантику.
- Candidate focus preview-ить `UI-CMP-036 Combo Frame Meter` без path mutation.
- Step focus синхронізує `UI-CMP-036 Combo Frame Meter` у selected move inspection.
- Frame Meter може попросити сфокусувати matching whiteboard step без path mutation.
- Internal candidate selection застосовує selected whiteboard target для append, insert або replace.
- Group switching не змінює `movePath`.
- Disabled candidate не створює edit proposal.
- Reorder працює через pick up/drop і replay proposal.
- Middle edit replay-ить suffix і не губить invalid tail без confirmation.
- Finish disabled, якщо є pending truncate або unresolved invalid tail.
- Invalid initial path показує original path, valid prefix і invalid boundary.
- Save error не губить current path.
- Combo Detail використовує read-only whiteboard із step inspection.
- Combo Detail whiteboard не змінює `movePath`, `cachedNotation`, seeded data або custom data.
- `detailReadOnly` не рендерить internal `movePicker` region.

## Тестові сценарії

- Create builder відкривається з empty active board і append target.
- Internal `movePicker` показує valid стартові candidates після graph ready.
- Dense path із 8, 10 або 12 moves перевіряється на mobile/tablet/desktop і в narrow measured container.
- Long move labels, три badges, unavailable badge reason і `Gap 2f`/`Cancel`/`Link`/`Juggle` transition labels не обрізаються.
- Row continuation count, dynamic canvas height, straight connectors, hidden handles і відсутність fit scaling фіксуються component tests.
- Picker order та horizontal desktop/tablet / vertical mobile composition фіксуються component tests.
- Focus на candidate preview-ить frame values без додавання move.
- Вибір first candidate додає step у whiteboard.
- Step focus + replace через candidate selection replay-ить full path.
- Gap focus + insert через candidate selection replay-ить suffix.
- Disabled candidate із meter/spacing/stage/state/frame reason не додається в path.
- `builderNextGroup` і `builderPreviousGroup` перемикають internal move groups без зміни `movePath`.
- Pick up/drop reorder replay-ить proposed path.
- Invalid suffix після middle edit показує pending truncate і блокує finish.
- Confirm truncate застосовує valid prefix.
- Cancel truncate повертає path до стану перед proposal.
- Duplicate seeded combo показує locked source preview, потім replayed editable path.
- Stale custom combo показує original path, valid prefix і invalid boundary.
- Saving freeze не дозволяє edit і не приховує path.
- Save error повертає editable whiteboard із тим самим path.
- Detail seeded combo показує read-only step inspection.
- Detail seeded combo синхронізує focused step із Frame Meter.
- Detail custom combo показує read-only step inspection і не мутує path.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
