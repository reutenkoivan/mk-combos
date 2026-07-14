# UI-CMP-034: Backup Collapsible Block

## Метадані

- Код: `UI-CMP-034`
- Назва: `Backup Collapsible Block`
- Тип: `component / settings accordion item / per-game backup surface`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Пов'язані компоненти: [`UI-CMP-027 Export Dialog`](./UI-CMP-027.md), [`UI-CMP-028 Import Preview Dialog`](./UI-CMP-028.md), `UI-CMP-030 Error State`
- Пов'язані UX сценарії: `US-017`, `US-018`, `US-024`
- Архітектурний контекст: [ARCHITECTURE.md](../ARCHITECTURE.md)

## Призначення

`UI-CMP-034 Backup Collapsible Block` є controlled accordion item для export/import
user data рівно однієї installed game.

[`UI-PAGE-008 Settings`](./UI-PAGE-008.md) створює по одному item на кожен entry з
`installedGames` і володіє single-open accordion state. Компонент:

- показує game identity і compact slice summary;
- розгортає per-game export/import controls;
- показує target-specific busy, warning, invalid і complete states;
- емітить semantic disclosure/export/file-picker intents, які parent closure мапить
  на target `gameId` конкретного instance;
- ніколи не об'єднує slices кількох ігор.

Plain Settings має всі items collapsed. Deprecated `/backup` redirect просить page
auto-expand item resolved last/default installed game.

## Архітектурний контекст

Shared backup contract:

```ts
type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

type GameBackupEnvelope = {
  version: number
  exportedAt: string
  gameId: GameId
  slice: JsonValue
}
```

File містить тільки custom combos, named lists і last catalog context target game.
Global settings, slices інших ігор та seeded data не входять у payload. Opaque
game-owned `slice` обов'язково є JSON-safe.

`apps/web` володіє file IO, envelope/version/installed-target validation, candidate
identity, persistence і final replace. Matching game business entry point володіє
`slice` serialization/validation. `UI-CMP-034` є pure presentation surface й не
імпортує game scopes.

## Володіння

Settings/page-level backup hook відповідає за:

- ordered list installed games;
- `expandedBackupGameId: GameId | null`;
- blocking accordion/game operations під час active operation;
- per-target summary та availability;
- page-owned native file picker і JSON parsing;
- `GameBackupEnvelope` construction/validation;
- resolution matching game business;
- singleton export/import dialogs;
- replace тільки `state.games[targetGameId]` після confirmation.

`UI-CMP-034` відповідає за:

- one-game disclosure header/panel;
- prepared action/status presentation;
- semantic disclosure/export/file-picker intents без browser event або raw DOM payload;
- accessible expanded/disabled/busy feedback;
- focus targets у межах item.

## Анатомія

```jsx
<BackupCollapsibleBlock ui="UI-CMP-034">
  <GameBackupAccordionItem slot="UI-PAGE-008 BackupAccordionRegion">
    <Stack name="GameBackupItemLayout">
      <DisclosureHeaderTrigger>
        <Group name="GameBackupHeaderRow">
          <GameIdentityRegion />
          <CompactGameSliceSummary />
          <ExpandedCollapsedIndicator />
        </Group>
      </DisclosureHeaderTrigger>

      <Show when={isExpanded}>
        <GameBackupPanel>
          <Stack name="GameBackupPanelLayout">
            <ExportActionGroup />
            <ImportActionGroup />

            <Show when={hasValidationStatusMessage}>
              <ValidationStatusMessageArea />
            </Show>
          </Stack>
        </GameBackupPanel>
      </Show>
    </Stack>
  </GameBackupAccordionItem>
</BackupCollapsibleBlock>
```

Page-owned sibling overlays:

```jsx
<SettingsPage ui="UI-PAGE-008">
  <Show when={isExportDialogOpen}>
    <ExportDialog ui="UI-CMP-027" />
  </Show>

  <Show when={isImportPreviewDialogOpen}>
    <ImportPreviewDialog ui="UI-CMP-028" />
  </Show>
</SettingsPage>
```

Правила розміщення:

- item завжди називає target game;
- collapsed panel не лишає focusable children;
- export/import є sibling action groups expanded panel;
- validation/status стоїть поруч із target actions;
- dialogs singleton і не дублюються всередині кожного item;
- file picker не входить у public component event contract.

## Public Contract

```ts
type BackupDisclosureState = "collapsed" | "expanded"

type BackupPersistenceMode = "persistent" | "sessionOnly" | "unavailable"

type BackupAvailability = {
  available: boolean
  disabledReason?: string
}

type BackupOperationState =
  | "exporting"
  | "idle"
  | "importComplete"
  | "importFilePicker"
  | "importInvalid"
  | "importPreview"
  | "importValidating"
  | "replaceBusy"
  | "replaceConfirm"

type BackupSliceStatus = "invalid" | "missing" | "ready" | "unsupported"

type BackupGameSliceSummary = {
  gameId: string
  label: string
  customComboCount?: number
  namedListCount?: number
  staleOrInvalidCount?: number
  status: BackupSliceStatus
}

type BackupLocalStateSummary = {
  gameSlices: readonly BackupGameSliceSummary[]
  lastExportedAt?: string
  persistenceMode: BackupPersistenceMode
  settingsSummary: string
  totalCustomCombos?: number
  totalNamedLists?: number
}

type BackupValidationMessage = {
  gameId: string
  message: string
  tone: "destructive" | "neutral" | "warning"
}

type BackupValidationResult = {
  gameSliceMessages?: readonly BackupValidationMessage[]
  message?: string
  status: "invalid" | "none" | "valid" | "warning"
}

const backupCollapsibleBlockActions = {
  collapse: "collapse",
  expand: "expand",
  export: "export",
  openFilePicker: "openFilePicker",
} as const

type BackupCollapsibleBlockAction =
  (typeof backupCollapsibleBlockActions)[keyof typeof backupCollapsibleBlockActions]

type BackupCollapsibleBlockProps = {
  disclosureState: BackupDisclosureState
  exportAvailability: BackupAvailability
  exportDialog?: ExportDialogProps
  exportLabel: string
  importAvailability: BackupAvailability
  importLabel: string
  importPreviewDialog?: ImportPreviewDialogProps
  importCompleteMessage?: string
  localStateSummary: BackupLocalStateSummary
  onRequestAction?: (
    intent: ComponentActionIntent<BackupCollapsibleBlockAction>,
  ) => void
  operationState: BackupOperationState
  redirectAutoExpand?: boolean
  sourceFocusTarget?: string
  sourceSurface: string
  title: string
  validationResult: BackupValidationResult
}
```

`ExportDialogProps`, `ImportPreviewDialogProps` і `ComponentActionIntent` належать
своїм existing `packages/ui` public subpaths. Exact storage slice, localized copy,
version policy та game-specific diagnostics належать app/business owners.

## Вхідні дані

- `disclosureState`: `collapsed` або `expanded`.
- `exportAvailability`, `exportDialog`, `exportLabel`.
- `importAvailability`, `importLabel`, `importPreviewDialog`, `importCompleteMessage`.
- `localStateSummary`: prepared presentation summary; Settings передає рівно одну
  target game slice для per-game flow.
- `operationState`: public operation value; `exporting`, `importFilePicker`,
  `importValidating`, `importPreview`, `replaceConfirm` і `replaceBusy` lock disclosure.
- `redirectAutoExpand`: optional redirect presentation marker.
- `sourceFocusTarget`, `sourceSurface`: semantic intent/focus context.
- `title`: localized target-game heading.
- `validationResult`: prepared validation/warning/error presentation.
- `onRequestAction`: optional handler для component-local action dictionary.

## Вихідні події

- `collapse`;
- `expand`;
- `export`;
- `openFilePicker`.

`ComponentActionIntent` містить action, reason, source surface і optional source focus
target; `gameId` не є частиною block intent. Settings мапить intent на target game
через closure конкретного registry-backed instance. Export/import dialog actions і
candidate ID належать public contracts `UI-CMP-027` та `UI-CMP-028`. Native events,
raw file input і DOM nodes не передаються.

## Межі відповідальності

Компонент не відповідає за:

- registry iteration або single-open accordion invariant;
- route redirect;
- schema/version policy;
- localStorage/session storage;
- native file reading або JSON parsing;
- installed/target `gameId` validation;
- game-specific slice validation/serialization;
- candidate identity або final replace;
- app settings чи slices інших ігор;
- seeded data;
- rendering `UI-CMP-002`, `UI-CMP-003`, `UI-CMP-004` або `UI-CMP-037`.

## Мапа станів

### `idle`

Disclosure й available actions інтерактивні; component не показує operation busy
state.

### `collapsed`

Header, game identity і compact summary visible; `aria-expanded = false`; panel
controls absent із focus/accessibility tree.

### `expanded`

Target summary/actions visible; `aria-expanded = true`; only this item is expanded
according to parent model.

### `exporting`

Export busy; repeat action/toggles/other game operations blocked; local state
unchanged; progress announced.

### `importFilePicker`

Import source є known focus return target. Cancel не мутує state.

### `importValidating`

Envelope, target match і game slice validating; preview/replace unavailable.

### `importInvalid`

Як public UI operation value цей state лишає disclosure trigger доступним, але робить
expanded actions inert через busy semantics. Settings flow зазвичай повертає
`operationState` у `idle` і передає invalid message через `validationResult`, щоб retry
був доступним без mutation.

### `importPreview`

Page-owned `UI-CMP-028` open для matching candidate. Preview names target game,
one-slice impact і any business warnings.

### `replaceConfirm`

Destructive confirmation surface active; disclosure й backup actions locked, доки
page-owned dialog не завершить або не скасує operation.

### `replaceBusy`

Explicit destructive confirmation accepted для matching candidate ID; repeated
confirmation blocked.

### `importComplete`

Only target slice updated; success announced; focus returns safely. Settings, other
game slices and seeded data remain unchanged.

### `actionDisabled`

Control inert, reason readable, enabled hover absent, state not color-only.

## UI Behavior

### Default Settings Entry

1. Settings creates one item per installed game.
2. Every item receives `collapsed`.
3. No export/import control is a focus target until its item expands.

### Accordion Toggle

1. User opens a game item.
2. Component emits `expand`; parent closure retains the instance target `gameId`.
3. Settings closes previous item and expands that target.
4. Active operation may reject toggle through prepared locked state.

### Deprecated Backup Redirect

1. `/backup` redirects to Settings backup section.
2. Settings resolves last/default/first installed game.
3. Matching item receives `expanded`; all others receive `collapsed`.
4. Focus moves to target heading or first safe action.

### Export One Game

1. User opens export from target item.
2. Matching business serializes target slice.
3. App builds `GameBackupEnvelope` with target `gameId` and starts download.
4. File contains no global settings or other game slices.
5. Local state remains unchanged.

### Import Valid Game Backup

1. Target import action opens parent-owned picker.
2. App validates JSON, current version `1`, installed/target `gameId`, then matching business slice.
3. Valid/warning candidate gets ephemeral ID and opens preview.
4. Explicit confirmation replaces only matching target slice.

### Import Invalid Game Backup

1. Parent rejects malformed/version/uninstalled/mismatch/business-invalid candidate.
2. Item shows `importInvalid`; preview remains closed.
3. Operation becomes retryable idle state; local state unchanged.

## Visual Design Contract

`UI-CMP-034` виглядає як compact Settings accordion item, не card-heavy backup page.

```text
[>] MKXL backup
    12 custom combos, 3 lists

[v] MK1 backup
    4 custom combos, 1 list
    [Export MK1] [Import MK1]
    Status / validation message
```

Rules:

- flat section з одним separator, без rectangular card chrome;
- game label і one-game scope завжди readable;
- panel плавно розгортається за виміряною висотою, а chevron синхронно відображає
  `collapsed` / `expanded` state;
- stable geometry across interaction/operation states;
- destructive tone лише preview/confirmation;
- long UA labels/messages wrap without overlap;
- icons come from UI facade and remain secondary to labels.

## Recipe і variant requirements

Semantic axes:

- `disclosure`: `collapsed` | `expanded`;
- `state`: `idle` | `busy` | `disabled` | `invalid` | `complete`;
- `tone`: `neutral` | `success` | `warning` | `destructive`;
- `density`: `small` | `medium`;
- `layout`: `wide` | `compact` | `stacked`.

Raw color/radius/shadow/spacing і arbitrary JSON-schema styling props не є public
visual axes. `className` може бути integration escape hatch, не primary API.

## Доступність і поведінка вводу

- Header є button/disclosure-equivalent з localized accessible name.
- `aria-expanded` і panel relationship correct.
- Collapsed content not focusable.
- `Enter`/`Space` toggle item; locked item does not emit intent.
- Focus order follows registry order and only active panel children.
- Redirect focus lands in resolved target item.
- Actions name target game, including destructive replace.
- File picker cancel restores target import focus.
- Dialog focus traps/restores correctly; `Escape` never confirms replace.
- Validation relates to target import action/status region and is not color-only.
- Busy/error/success changes announced.
- Reduced motion shortens/removes disclosure transitions.

## Критерії приймання

- Settings renders exactly one `UI-CMP-034` per installed game.
- Parent enforces at most one expanded item.
- Plain Settings starts all collapsed.
- Deprecated `/backup` expands resolved last/default game item.
- Export creates one target `GameBackupEnvelope` without mutation.
- File excludes global settings, other game slices and seeded data.
- Import mismatch/uninstalled/unsupported/invalid candidate cannot open preview.
- Matching business validates the target slice.
- Valid candidate opens `UI-CMP-028` before replace.
- Candidate ID and explicit destructive confirmation guard replace.
- Replace updates only target `games[gameId]`.
- Other settings/slices/seeded data remain unchanged.
- Component does not render settings/game-switcher/notation controls.

## Storybook і visual coverage

Required scenarios:

- `CollapsedDefault`;
- `ExpandedReady`;
- `AccordionLocked`;
- `RedirectAutoExpanded`;
- `Exporting`;
- `ImportValidating`;
- `ImportInvalidMismatch`;
- `ImportPreviewOpen`;
- `ReplaceBusy`;
- `ImportComplete`;
- `ActionDisabled`;
- `LongUALabels`;
- `FocusVisible`;
- `ReducedMotion`;
- `CompactStacked`.

Visual/a11y checks cover light/dark, standard/increased contrast, focus/disabled/busy,
collapsed focus exclusion, dialog focus restore, readable target game and non-color-only
validation/destructive states.

## Тестові сценарії

- Two installed games render two controlled items.
- Opening the MK1 instance emits `expand`; its parent closure maps the intent to MK1
  and closes MKXL through parent state.
- Locked accordion emits no toggle/action.
- Redirect expands resolved target item and restores focus correctly.
- Export intent is component-local; the registry-backed parent closure maps it to the
  target `gameId`.
- MK1 export does not include settings/MKXL slice and does not mutate state.
- Invalid JSON and unsupported version show retryable error.
- MKXL envelope selected from MK1 item shows mismatch and no preview.
- Uninstalled `gameId` shows error and no preview.
- Business-invalid slice leaves state unchanged.
- Business warning can open preview with warning.
- Candidate mismatch cannot confirm replace.
- Confirm replace changes only target slice.
- Cancel picker/preview returns focus and performs no mutation.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared
focus graph із [UI.md](../UI.md).

- `mobile` vertical-first, targets at least `44x44px`;
- `tablet` hybrid composition with explicit directional neighbors;
- `desktop` spatial row/column navigation;
- controller confirm/back/focus recovery use semantic intents without synthetic events;
- native backup file picker is the only external-input exception.

## Flat Workspace Visual Contract

- Item входить у flat Settings canvas і не створює card wrapper.
- Peer items використовують separators/spacing.
- Full border/radius/shadow належать only owning dialog overlay.
- Text actions, validation and focus indicators retain semantic boundaries.
