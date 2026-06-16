# UI-CMP-035: Combo Whiteboard

## Метадані

- Код: `UI-CMP-035`
- Назва: `Combo Whiteboard`
- Тип: `компонент`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківські поверхні: `UI-PAGE-004 Combo Detail`, `UI-PAGE-006 Custom Combo Builder`
- Замінює active usage: `UI-CMP-016 Move Path Viewer`, `UI-CMP-025 Combo Path Preview`
- Пов'язані компоненти: `UI-CMP-036 Combo Frame Meter`
- Пов'язані UX сценарії: `US-007`, `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-025`

## Призначення

`UI-CMP-035 Combo Whiteboard` показує selected combo path як робочу послідовність moves, gaps, runtime summary і invalid markers.

Компонент має два основні режими:

- `builderEditable`: editable workspace у `UI-PAGE-006 Custom Combo Builder`;
- `detailReadOnly`: read-only inspection у `UI-PAGE-004 Combo Detail`.

У builder mode whiteboard не є source of truth. Він емітить edit proposals, а `useComboBuilder` replay-ить proposed path, оновлює `movePath`, `cachedNotation`, runtime state, valid next moves, invalid reasons і pending truncate state.

У detail mode whiteboard не емітить mutation events. Він дозволяє step focus і inspection, але edit або duplicate запускаються тільки через page-level actions.

Whiteboard синхронізує focused step із `UI-CMP-036 Combo Frame Meter`, щоб Frame Meter міг показати `selectedMove`. Якщо Frame Meter просить сфокусувати matching whiteboard step, Whiteboard оновлює тільки presentation focus і не змінює `movePath`.

## Володіння

`UI-CMP-035` є доменним компонентом `@mk-combos/combo-builder`, який може рендеритися builder і detail поверхнями.

Власники стану:

- `useComboBuilder` володіє active builder path, replay, validation, invalid reasons і accepted/truncated state;
- `UI-PAGE-006` володіє routing, persistence, cancel/save confirmation і page-level dialogs;
- `UI-PAGE-004` володіє detail context, actions menu і read-only combo data;
- `UI-CMP-036` володіє frame timeline inspection focus і segment details;
- `UI-CMP-035` володіє тільки presentation focus, local menu open state і temporary pick up/drop gesture state.

Компонент не має:

- самостійно мутувати `movePath`;
- самостійно писати `cachedNotation`;
- зберігати custom combo;
- змінювати seeded combo data;
- виконувати graph validation без `@mk-combos/combo-builder`.

## Вхідні дані

- `mode`: `emptyActive`, `builderEditable`, `detailReadOnly`, `lockedPreview`, `repairReview`, `pendingTruncate` або `savingFrozen`;
- `movePath`;
- `cachedNotation`;
- notation display mode;
- selected або focused step id/index;
- selected gap id/index для insert target;
- current builder target mode: append, insert, replace або reorder, якщо mode це підтримує;
- runtime summary: meter, damage estimate, position, stance, player state, opponent state і frame context;
- stage context і used interactables, якщо combo stage-specific;
- valid prefix, invalid tail і invalid boundary, якщо path stale або edit proposal truncated;
- pending truncate confirmation state;
- disabled або readonly reasons;
- controller navigation focus state.

## Вихідні події

У всіх modes:

- focus step;
- focus gap;
- request sync focused step to frame meter;
- request open step details;
- request close local menu.

Тільки у `builderEditable`:

- request append move;
- request insert move at focused gap;
- request replace focused step;
- request remove focused step;
- request undo to focused step;
- request pick up focused step;
- request drop picked step at focused gap або step position;
- request confirm truncate;
- request cancel truncate;
- request repair from valid prefix.

Тільки у `detailReadOnly`:

- request page-level edit custom combo;
- request page-level duplicate seeded combo, якщо detail action це дозволяє.

## Режими

### `emptyActive`

Create flow ще не має moves, але graph context уже достатній для builder workspace.

Правила:

- показувати empty board, context/runtime summary і append target;
- Move Picker selection додає first move через append proposal;
- finish disabled, доки builder state не дозволяє зберегти path.

### `builderEditable`

Builder graph готовий, whiteboard є окремою focus zone між `UI-CMP-024 Move Picker` і `UI-CMP-026 Builder Action Bar`.

Правила:

- empty create flow показує active board із context/runtime summary і append target;
- step focus дозволяє details, replace, remove, undo-to-step і pick up;
- gap focus дозволяє insert;
- no focus або append target означає append;
- Move Picker застосовує selected step/gap target, а не завжди додає move в кінець;
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

Whiteboard edit не застосовується локально як mutation. Кожна дія створює proposal:

- append selected move;
- insert selected move у focused gap;
- replace focused step selected move;
- remove focused step;
- undo to focused step;
- reorder через pick up/drop.

`useComboBuilder` replay-ить full proposed path:

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
| `ready` | Whiteboard `builderEditable`; empty path або replayed valid path visible. |
| `selectingMove` | Move Picker застосовує selected step/gap target: append, insert або replace. |
| `whiteboardFocused` | Whiteboard має focus zone, step/gap navigation і local context menu. |
| `noValidNextMoves` | Current path visible; finish available тільки без pending truncate або invalid tail. |
| `invalidInitialPath` | `repairReview` показує original path, valid prefix і invalid boundary. |
| `staleCustomCombo` | `repairReview`; custom combo не видаляється, repair starts from valid prefix. |
| `saving` | `savingFrozen`; repeated save і edit disabled. |
| `saveError` | Повернення до `builderEditable` із тим самим path і readable error. |
| `cancelConfirm` | Whiteboard frozen behind confirmation. |
| `complete` | Saved combo summary може використовувати read-only whiteboard або `UI-CMP-011` context. |

## Keyboard і controller navigation

Whiteboard є окремою focus zone.

Правила:

- `navLeft`/`navRight` рухають focus між steps і gaps у path;
- `navUp`/`navDown` рухають focus між whiteboard, Move Picker, `UI-CMP-036 Combo Frame Meter` і Action Bar відповідно до layout;
- `confirm` на step або gap відкриває local context menu;
- `openActions`, якщо доступний, також відкриває local context menu;
- `back` закриває menu, cancel pick up/drop або повертає focus до safe builder control;
- pick up/drop reorder має keyboard/controller equivalent, не тільки pointer drag;
- controller hints не додають нові semantic commands, а пояснюють contextual actions для active whiteboard focus.

## Доступність

- Whiteboard має accessible name, який називає режим: editable builder або read-only detail.
- Step і gap focus має бути видимим і доступним keyboard/controller navigation.
- Step labels мають містити move name/notation і позицію у path.
- Invalid boundary не покладається тільки на колір.
- Pending truncate має readable confirmation text і не змінює path без user action.
- Local context menu закривається через `Escape`/`back` і повертає focus на source step або gap.
- Saving і replay states мають бути оголошені assistive technologies.

## Критерії приймання

- Builder create flow показує empty active whiteboard до першого move.
- Duplicate/edit/repair flow показує locked source preview до context confirmation.
- Builder whiteboard є окремою focus zone між Move Picker і Combo Frame Meter.
- Step focus і gap focus мають різну семантику.
- Step focus синхронізує `UI-CMP-036 Combo Frame Meter` у selected move inspection.
- Frame Meter може попросити сфокусувати matching whiteboard step без path mutation.
- Move Picker застосовує selected whiteboard target для append, insert або replace.
- Reorder працює через pick up/drop і replay proposal.
- Middle edit replay-ить suffix і не губить invalid tail без confirmation.
- Finish disabled, якщо є pending truncate або unresolved invalid tail.
- Invalid initial path показує original path, valid prefix і invalid boundary.
- Save error не губить current path.
- Combo Detail використовує read-only whiteboard із step inspection.
- Combo Detail whiteboard не змінює `movePath`, `cachedNotation`, seeded data або custom data.

## Тестові сценарії

- Create builder відкривається з empty active board і append target.
- Вибір first move через Move Picker додає step у whiteboard.
- Step focus + replace через Move Picker replay-ить full path.
- Gap focus + insert через Move Picker replay-ить suffix.
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

## Відкриті уточнення

- Точний visual design steps, gaps, invalid boundary і pending truncate confirmation буде визначено під час UI реалізації.
- Точний placement step details у detail mode буде визначено під час UI реалізації.
