# UI-CMP-011: Combo Card

## Метадані

- Код: `UI-CMP-011`
- Назва: `Combo Card`
- Тип: `component / combo summary item`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Батьківський компонент: [`UI-CMP-010 Combo List`](./UI-CMP-010.md)
- Пов'язані поверхні: `UI-PAGE-004 Combo Detail`, `UI-PAGE-005 Named Lists`, [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md)
- Child components: [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md)
- Пов'язані компоненти: `UI-CMP-021 Add-To-List Dialog`, `UI-CMP-031 Stale/Invalid Combo Marker`
- Variant docs: [MKXL](./UI-PAGE-003-MKXL.md), [MK1](./UI-PAGE-003-MK1.md)
- Пов'язані UX сценарії: `US-007`, `US-012`, `US-014`, `US-015`, `US-016`, `US-019`, `US-024`

## Призначення

`UI-CMP-011 Combo Card` показує короткий, actionable summary одного combo у list або saved-combo context.

У `UI-PAGE-003 Catalog` card є repeated child item усередині [`UI-CMP-010 Combo List`](./UI-CMP-010.md). Вона отримує вже підготовлений combo summary від parent surface, рендерить notation, context і metadata, а user actions передає нагору як intent events.

Card не є route, dialog, persistence surface, filter engine або source of truth для combo data.

Card не імпортує game data напряму і не має game-specific business branches. MKXL/MK1 відмінності приходять як prepared summary fields, badges і available actions.

## Роль і межі

`UI-PAGE-003 Catalog` і `UI-CMP-010 Combo List` володіють visible combo order, active context, filters, page-level dialogs, routing і focus return targets. Combo summary shape готує active game catalog/detail business.

`UI-CMP-011` відповідає за:

- рендер combo summary у компактній card presentation;
- показ notation через [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md);
- показ character і active game-specific context summary;
- показ metadata: damage, meter, position, starter, route type, difficulty і tags; prepared
  semantic tone виділяє value кольором тексту, а не фоном контейнера;
- показ localized notes snippet, якщо parent surface передав його для list UX;
- показ current named-list membership або availability hint, якщо доступний;
- рендер controlled focus state для card і card actions;
- емісію semantic intent events для open detail, contextual actions, add-to-list і duplicate.

`UI-CMP-011` не відповідає за:

- фільтрацію, sorting або pagination combo list;
- перерахунок `movePath`;
- зміну або валідацію `cachedNotation`;
- зміну seeded combo data;
- збереження custom combo;
- зміну named list membership напряму;
- відкриття власного `UI-CMP-021 Add-To-List Dialog` instance;
- зміну route напряму;
- читання Browser Gamepad API напряму.

## Анатомія

Розміщення card читається згори вниз: primary notation/context стоїть першим, metadata і optional notes нижче, action targets замикають card або переходять у contextual menu.

```jsx
<ComboCard ui="UI-CMP-011">
  <ComboCardSurface slot="list/detail/saved-summary parent">
    <Stack name="CardLayout">
      <PrimarySummary>
        <Stack name="PrimarySummaryContent">
          <NotationRenderer ui="UI-CMP-015" />
          <ContextSummary />
        </Stack>
      </PrimarySummary>

      <MetadataItems>
        <Group name="MetadataList">
          <MetadataItem>
            <MetadataLabel />
            <MetadataValue />
          </MetadataItem>
        </Group>
      </MetadataItems>

      <Show when={hasOptionalNotesSnippet}>
        <OptionalNotesSnippet />
      </Show>

      <Show when={hasOptionalMembershipHint}>
        <OptionalMembershipHint />
      </Show>

      <ActionTargets>
        <Group name="CardActions">
          <OpenDetailAction />
          <AddToListAction />
          <DuplicateToCustomComboAction />
          <ContextualActions />
        </Group>
      </ActionTargets>
    </Stack>
  </ComboCardSurface>
</ComboCard>
```

Правила розміщення:

- Primary summary лишається першою content region, щоб notation не губилася після metadata.
- На `desktop` actions можуть стояти праворуч від summary; на `mobile` і `tablet` вони переходять нижче або в contextual menu.
- Membership hint стоїть біля actions/metadata, але не стає list persistence owner.

### `CardSurface`

`CardSurface` є focusable item у [`UI-CMP-010 Combo List`](./UI-CMP-010.md) або saved-combo summary region.

CardSurface має:

- readable label або accessible name для combo;
- visible focused/selected state;
- stable layout, який не змінює розміри card під час hover або focus;
- disabled presentation, якщо parent surface блокує actions;
- source focus identity для повернення focus після page-level dialog.

### `primarySummary`

`primarySummary` містить notation і context summary.

Notation рендериться тільки через [`UI-CMP-015 Notation Renderer`](./UI-CMP-015.md). Card передає canonical FGC notation або `cachedNotation`, active notation display mode, active language і density/context. Card не виконує platform mapping самостійно.

Context summary показує:

- active game;
- character;
- `MKXL` variation, якщо card належить MKXL context;
- `MK1` kameo, якщо card належить MK1 context;
- optional stage/interactable summary для MKXL stage-specific combos.

### `metadataItems`

Metadata items дають швидко порівняти combos у list.

Card може показувати:

- damage;
- meter;
- position;
- starter;
- route type;
- difficulty;
- tags.

Metadata лишається display-only. Untoned item може використовувати neutral badge presentation.
Якщо item має prepared `tone`, label лишається neutral/muted, а value отримує semantic
text color без background, border, badge padding або прямокутного tone-container. Toned
metadata не є filter control і не змінює selected optional filters напряму.

### `actionTargets`

Card actions є contextual intent controls.

Supported actions:

- open detail;
- request add to list;
- duplicate seeded combo to custom combo;
- open contextual actions, якщо actions не показані inline.

Actions можуть бути hidden, disabled або moved into contextual menu залежно від viewport, input mode або parent availability. Availability визначає parent/page, а не card.

## Interface Contract

### Inputs

- `comboSummary`: prepared combo summary із id, game, character, game-specific context, notation, metadata і optional notes snippet.
- `activeLanguage`: `EN` або `UA`.
- `notationDisplayMode`: `FGC`, `PlayStation` або `Xbox`.
- `presentationContext`: `catalogList`, `namedList`, `detailRelated`, `builderComplete` або equivalent parent context.
- `density`: mobile і tablet/list/detail density, якщо parent surface це підтримує.
- `focused` або `selected` state.
- `availableActions`: open detail, add to list, duplicate або contextual actions.
- `namedListAvailability`: optional add-to-list availability hint.
- `namedListMembershipHint`: optional current membership hint.
- `sourceFocusTarget`: focus identity для page-level dialog return.
- `disabledState`: optional reason why card actions are temporarily disabled.
- `controllerFocusState`: focused card або focused action target.

### Outputs

- `requestOpenDetail`: відкрити combo detail для current combo.
- `requestOpenContextualActions`: відкрити contextual action menu або panel для current combo.
- `requestAddToList`: попросити parent/page відкрити page-level singleton `UI-CMP-021` із combo context і source focus target.
- `requestDuplicateToCustomCombo`: попросити App Shell або page відкрити duplicate flow у [`UI-PAGE-006 Custom Combo Builder`](./UI-PAGE-006.md).
- `requestFocusCard`: зробити card active focus target у parent list.
- `requestFocusAction`: перейти до конкретного action target у card.
- `requestReturnFocusToList`: повернути focus до safe parent list target.

Outputs є intent events. Route changes, dialog lifecycle, builder initialization і persistence виконуються на page/app рівні.

Усі outputs приймають abstract payloads із combo id, source surface і source focus target. Component не передає browser event objects у parent/page handlers.

## State Tokens

- `cardReady`: card має valid combo summary і може показати summary.
- `cardFocused`: CardSurface є active focus target.
- `cardActionFocused`: один із action targets має focus.
- `actionsOpen`: contextual actions відкриті parent-owned або local presentation menu.
- `actionDisabled`: конкретна action недоступна через parent availability, loading або persistence state.
- `addToListUnavailable`: add-to-list action недоступна або user data persistence unavailable.
- `alreadyInNamedList`: membership hint показує, що combo вже є у поточному named list.
- `duplicateUnavailable`: duplicate action недоступна для current combo або surface.
- `cardDisabled`: card показана, але не приймає activation через parent disabled state.

`loading`, `empty`, recoverable errors і page-level modal focus не є owned states card. Їх координують parent list/page surfaces.

## UI Behavior

### Summary Rendering

Card рендерить тільки data, яку отримала у `comboSummary`.

Rules:

- не перечитувати global seeded combo data;
- не перераховувати metadata з `movePath`;
- не змінювати або нормалізувати `cachedNotation`;
- не приховувати required context, якщо parent передав його як visible summary;
- не показувати порожні placeholders для absent optional metadata;
- localized notes snippet використовує active language і fallback, який передав parent/page.

### Add-To-List Request

Card не створює власний dialog.

Flow:

1. Користувач активує add-to-list action.
2. `UI-CMP-011` емітить `requestAddToList` із combo context і source focus target.
3. `UI-CMP-010` або page додає list/page context, якщо потрібно.
4. Catalog, Detail, Named Lists або Builder surface відкриває page-level singleton `UI-CMP-021 Add-To-List Dialog`.
5. Після close або submit focus повертається до source card/action або safe parent target.

Card не пише named list membership напряму.

### Duplicate To Custom Combo

Duplicate action створює intent для page/app-level flow.

Rules:

- seeded combo лишається read-only;
- source `movePath`, `cachedNotation`, game context, stage context і runtime summary передаються в builder flow через parent/app layer;
- card не запускає active game builder adapter і не replay-ить path;
- unavailable duplicate action має readable disabled reason або не показується.

### Contextual Actions

Contextual actions можуть бути:

- inline action buttons;
- mobile і tablet action menu;
- parent-owned actions panel.

Card має підтримувати keyboard/controller activation для actions. Hover-only actions не допускаються.

## Variant Rules

### `MKXL`

MKXL card summary належить active `character + variation` context.

Rules:

- показувати character і variation;
- не показувати kameo;
- stage-specific combo показує stage/interactable badges;
- stage-agnostic combo не показує порожній stage placeholder;
- `stageContext` передається разом із combo context у detail, add-to-list і duplicate intents;
- stage/interactable badges є display-only і не змінюють optional filters напряму.

### `MK1`

MK1 card summary належить active `character + kameo` context.

Rules:

- показувати main character і kameo;
- не показувати variation;
- не показувати stage або interactable controls у v1;
- `stageContext` лишається shared data field, але MK1 MVP використовує stage-agnostic behavior;
- kameo context передається в detail, add-to-list і duplicate intents.

## Controller Behavior

`UI-CMP-011` отримує semantic commands через parent list/page. Card не читає Browser Gamepad API напряму.

Commands:

- `confirm`: активує CardSurface або focused action.
- `openDetail`: емітить `requestOpenDetail`, якщо combo valid і action available.
- `addToList`: емітить `requestAddToList`, якщо add-to-list available.
- `openActions`: відкриває contextual actions або фокусує action target.
- `navLeft` / `navRight`: рух між action targets, якщо card actions visible.
- `navUp` / `navDown`: parent list рухає focus між cards або safe targets.
- `back`: закриває contextual actions або повертає focus до `CardSurface`/list.
- `closePanel`: закриває contextual actions через parent/page flow.

Guard rails:

- Якщо card disabled, `confirm`, `openDetail`, `addToList` і duplicate не виконуються.
- Якщо page-level dialog має focus, card не виконує background action.
- Якщо action unavailable, controller command не має silently mutate state.
- Focus після dialog close повертається до source card/action або safe parent target.

## Accessibility

- Card має semantic item structure усередині list або group.
- CardSurface і action targets мають visible focus у light, dark, standard contrast і increased contrast.
- Accessible name card має включати character/context і readable notation або combo label.
- Metadata label/value мають readable text, а не тільки icon або color; semantic tone доповнює
  visible label і не створює єдиного сигналу значення.
- Difficulty, tags, stage/interactable state і membership hint не мають покладатися тільки на колір.
- Action targets мають visible label або accessible name.
- Disabled actions мають readable reason, якщо вони показані.
- Notation tokens рендеряться через [`UI-CMP-015`](./UI-CMP-015.md) і мають бути readable для assistive technologies.
- Mobile/narrow layout не має overlap між notation, badges, notes і actions.

## Acceptance Criteria

- `UI-CMP-011` має окремий повний spec.
- `UI.md`, `UI-PAGE-003` і `UI-CMP-010` посилаються на цей spec.
- Combo Card є repeated item у `UI-CMP-010 Combo List`.
- Card показує notation через `UI-CMP-015 Notation Renderer`.
- Card показує character, game-specific context і combo metadata.
- Toned metadata у `standard` і `commandDeck` виділяє value semantic
  text color-ом без colored badge/container; untoned metadata і context badges не змінюються.
- MKXL card показує variation і optional stage/interactable badges для stage-specific combos.
- MK1 card показує kameo і не показує variation/stage/interactable controls.
- Add-to-list action відкриває page-level singleton `UI-CMP-021` через parent/page request.
- Duplicate action відкриває builder flow через parent/app request і не змінює seeded combo.
- Card не мутує `movePath`, `cachedNotation`, seeded combo data або named lists.
- Card actions доступні keyboard/controller input і не є hover-only.

## Test Scenarios

- Catalog із valid MKXL context рендерить cards із notation, character і variation.
- MKXL stage-specific combo показує stage/interactable badges.
- MKXL stage-agnostic combo не показує порожній stage placeholder.
- Catalog із valid MK1 context рендерить cards із notation, main character і kameo.
- MK1 card не показує variation або stage/interactable controls.
- Display mode `FGC`, `PlayStation` або `Xbox` змінює notation rendering через `UI-CMP-015`.
- `confirm` на focused card відкриває detail через parent/page flow.
- `addToList` на focused card відкриває page-level singleton `UI-CMP-021`.
- Close add-to-list dialog повертає focus до source card/action.
- Duplicate seeded combo відкриває builder duplicate flow і не змінює seeded combo.
- Disabled card action не виконує route або persistence mutation.
- Кожен metadata tone (`neutral`, `accent`, `success`, `warning`, `destructive`) у всіх
  presentations має muted label, text-only value та `data-combo-metadata-tone` на value node.
- Якщо hover недоступний, touch/controller input все одно дає доступ до actions.

## Припущення

- Pixel-level card layout буде визначено під час UI реалізації.
- Card може використовувати різні density presets, але behavioral contract лишається однаковим.
- Named-list membership hints є presentation hints; source of truth лишається у page/app-level user data.

## Step 26 Readability And Actions

- У `standard` presentation title, context badges і metadata не truncate-яться. Untoned badges
  використовують content-driven height, можуть shrink-итись і wrap-лять long UA text; toned
  metadata лишається text-only label/value pair без badge container.
- Недоступна action лишається inert, а її `disabledReason` показується видимим текстом після action group, не лише в accessible-only copy.
- У `standard` presentation known actions використовують shared icon facade (`view-detail`, `add-to-list`, `duplicate`, `return`) і visible localized text label. У flat list presentations `open detail` label стає accessible name цілого row target, тому окрема icon/text detail-кнопка не дублюється.

## Command Deck Presentations

- `presentation = standard | commandDeck`; value може бути задане list owner-ом або prepared card model-ом.
- `commandDeck` є flat row без повної outer card frame, nested-card shadow або radius; single row separator належить parent `<ol>`, selected state має structural start marker, controlled focus — окремий cool-blue inset outline.
- `commandDeck` не рендерить окрему detail-action cell: native row target охоплює index, route і metadata, а внутрішній separator лишається тільки між route та metadata. Інші prepared actions зберігаються як окремі controls поверх row target.
- Flat mode автоматично використовує `NotationRenderer density = command`, flat
  metadata values і wrapping action labels.
- `metadataItems` лишається generic prepared contract: card рендерить отримані items у переданому порядку та не створює placeholders для відсутніх значень. Catalog command projection готує `damage`, `meter`, `routeType`, `position`, `difficulty`; `source` не входить до цієї presentation.
- В усіх трьох presentations optional prepared `tone` застосовується тільки до value-тексту:
  `neutral` використовує `--ui-text`, а `accent`, `success`, `warning` і `destructive` —
  `color-mix` із 90% відповідного semantic token та 10% `--ui-text`. Label лишається muted;
  toned value має `data-combo-metadata-tone` і не отримує background, border, badge padding або
  rectangular container. Untoned metadata, context badges і global Badge recipes не змінюються.
  Catalog готує однаковий raw-value tone для `routeType` і matching `routeClass` chip, а також
  для `difficulty`; readable label/value завжди лишаються поруч із color.
- Flat mode не дублює visible combo title; prepared `accessibleLabel` продовжує називати card і notation для assistive technology.
- `data-combo-presentation`, `data-controller-focused`, `aria-current`, `aria-disabled`, `data-combo-row-action` та native disabled actions відображають кожен підтриманий state без synthetic events. Flat `CardSurface` є display region усередині list-owned semantic row target; controller `A` використовує той самий prepared combo identity.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
