# UI-CMP-034: Backup Collapsible Block

## Метадані

- Код: `UI-CMP-034`
- Назва: `Backup Collapsible Block`
- Тип: `component / settings disclosure / backup flow surface`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: [`UI-PAGE-008 Settings`](./UI-PAGE-008.md)
- Пов'язані компоненти: `UI-CMP-027 Export Dialog`, `UI-CMP-028 Import Preview Dialog`, `UI-CMP-030 Error State`
- Пов'язані UX сценарії: `US-017`, `US-018`, `US-024`
- Архітектурний контекст: [ARCHITECTURE.md](../ARCHITECTURE.md)

## Призначення

`UI-CMP-034 Backup Collapsible Block` є Settings-owned disclosure block для export/import full backup.

Компонент дає користувачу:

- розгорнути backup controls тільки тоді, коли вони потрібні;
- експортувати full backup JSON для local settings і game slices;
- вибрати backup JSON для import;
- побачити validation/preview перед replace;
- підтвердити destructive replace local state тільки явно.

`UI-CMP-034` не є route-level page, standalone Backup Management screen, modal або пунктом Top Bar menu. Старий `UI-PAGE-007 Backup Management` має перенаправляти до [`UI-PAGE-008 Settings`](./UI-PAGE-008.md) з auto-expanded backup block.

Backup включає local settings, custom combos, named lists і game-owned user slices, scoped by `GameId`. Backup не містить seeded combo data і ніколи не замінює seeded game data.

## Архітектурний контекст

Canonical backup envelope визначено в [ARCHITECTURE.md](../ARCHITECTURE.md):

```ts
type BackupEnvelope = {
  version: number;
  exportedAt: string;
  settings: AppSettings;
  games: Record<GameId, unknown>;
};
```

`apps/web` володіє app-level envelope, browser persistence, file picker, JSON parsing, envelope validation, settings validation, orchestration per-game slice validation, export download і final import replace.

Кожен registered game business entry point володіє validation і serialization для власної game slice.

`UI-CMP-034` отримує controlled backup block model і відповідає тільки за UI contract backup block:

- disclosure trigger і expanded/collapsed presentation;
- local state summary presentation;
- export/import action presentation;
- status, warning, validation і completion messages;
- intent events до Settings/App Shell flow;
- dialog coordination для `UI-CMP-027` і `UI-CMP-028`;
- focus return після close/cancel/complete.

Компонент не читає game-specific packages напряму і не hardcode-ить properties конкретних installed games.
Expanded/collapsed state, operation state, validation result, parsed backup summary і dialog state належать `UI-PAGE-008 Settings` або page-level backup hook.

## Володіння

[`UI-PAGE-008 Settings`](./UI-PAGE-008.md) є owner для mounted instance `UI-CMP-034`.

`apps/web` відповідає за:

- local persistence availability і session-only fallback;
- building current local state summary;
- generating full backup JSON;
- triggering browser download;
- opening native file picker або equivalent file selection control;
- parsing selected JSON;
- validating backup envelope і settings;
- routing known game slices to registered business entry points;
- deciding forward-compatibility policy для unknown future game slices;
- replacing local state after explicit confirmation;
- choosing safe route/surface after successful import.

Game business entry points відповідають за:

- validating known game slice payloads;
- returning readable validation errors for their slice;
- serializing game-owned user state for export;
- rejecting incompatible or stale slice shapes without mutating seeded data.

`UI-CMP-034` відповідає за:

- disclosure UI;
- action affordances;
- operation state presentation;
- invalid/import-complete feedback;
- destructive replace affordance;
- keyboard/pointer behavior inside the block;
- focus target management for block trigger and nested dialogs.

`packages/ui` може надавати reusable disclosure, button, status, dialog, panel і recipe primitives. Backup-specific persistence, file IO і validation logic не належать `packages/ui`.

## Анатомія

Розміщення є пласким disclosure-section усередині Settings content: header завжди зверху, expanded content відкривається під одним separator без card wrapper; export/import dialogs є page-owned sibling overlays у `UI-PAGE-008`, а не вкладені children block-а.

```jsx
<BackupCollapsibleBlock ui="UI-CMP-034">
  <BackupDisclosureRegion slot="UI-PAGE-008 after UI-CMP-037">
    <Stack name="BackupDisclosureLayout">
      <DisclosureHeaderTrigger>
        <Stack name="DisclosureHeaderLayout">
          <Group name="DisclosureHeaderMainRow">
            <BackupTitle />
            <ExpandedCollapsedIndicator />
          </Group>

          <CompactLocalStateSummary />
        </Stack>
      </DisclosureHeaderTrigger>

      <Show when={isExpanded}>
        <ExpandedPanel>
          <Stack name="BackupExpandedPanelLayout">
            <LocalStateSummaryRows />
            <ExportActionGroup />

            <ImportActionGroup>
              <FilePickerAffordance nonVisual />
            </ImportActionGroup>

            <Show when={hasValidationStatusMessage}>
              <ValidationStatusMessageArea />
            </Show>
          </Stack>
        </ExpandedPanel>
      </Show>
    </Stack>
  </BackupDisclosureRegion>
</BackupCollapsibleBlock>

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

- Collapsed state показує тільки header; expanded panel не лишає focusable children у collapsed layout.
- Export і import action groups є sibling rows усередині expanded panel; validation/status message стоїть біля відповідної action.
- File picker flow описується як page/app-level intent/result, не як `<input>` change event у public handler.
- `UI-CMP-027` і `UI-CMP-028` монтуються як Settings-owned overlays, а не як repeated або nested disclosure children.

### DisclosureRegion

DisclosureRegion рендериться всередині Settings page content, після settings controls і notation reference.

Вимоги:

- не бути standalone page або modal;
- не дублювати `UI-PAGE-007 Backup Management`;
- не дублювати Top Bar або Top Bar Dropdown actions;
- мати stable block geometry між collapsed, expanded, busy, invalid і complete states;
- використовувати compact desktop density і restrained surface treatment;
- не ховати critical validation status поза visible expanded panel.

### Disclosure header / trigger

Header є єдиним primary trigger для expanded/collapsed state.

Вимоги:

- default state: `collapsed`;
- explicit user interaction toggles expanded/collapsed;
- deprecated redirect context sets `redirectAutoExpand = true` and opens block;
- trigger має readable label, visible focus і `aria-expanded`;
- collapsed content не лишається focusable;
- header summary може показувати compact counts або storage status, але не має запускати export/import напряму.

### Expanded panel

Expanded panel містить user-facing backup actions.

Вимоги:

- показувати короткий summary local data, який буде included у backup;
- показувати export action для full backup JSON;
- показувати import action для вибору backup JSON;
- показувати validation, persistence і operation messages поруч із відповідним action group;
- не виконувати replace local state до validation і explicit confirmation;
- не приховувати import errors після cancel/retry, доки parent не очистить validation state.

### Export action group

Export action group запускає full backup generation.

Вимоги:

- disabled або busy state блокує повторний export;
- export не змінює local state;
- export availability має readable unavailable reason, якщо action disabled;
- export failure показується через inline message або `UI-CMP-030 Error State`.

### Import action group

Import action group відкриває file picker або equivalent file selection control.

Вимоги:

- приймати backup JSON file через parent-owned file selection flow;
- cancel file picker returns to expanded block без mutation;
- selected file переходить у validation flow;
- invalid file показує readable validation result і retry action;
- valid file відкриває `UI-CMP-028 Import Preview Dialog` before replace.

## Public Contract

```ts
type BackupDisclosureState = "collapsed" | "expanded";

type BackupAvailability = {
  available: boolean;
  disabledReason?: string;
};

type BackupPersistenceAvailability =
  | "persistent"
  | "sessionOnly"
  | "unavailable";

type BackupOperationState =
  | "idle"
  | "exporting"
  | "importFilePicker"
  | "importValidating"
  | "importPreview"
  | "replaceConfirm"
  | "replaceBusy"
  | "importInvalid"
  | "importComplete";

type BackupGameSliceSummary = {
  gameId: string;
  label: string;
  customComboCount?: number;
  namedListCount?: number;
  staleOrInvalidCount?: number;
  status: "ready" | "missing" | "invalid" | "unsupported";
};

type BackupLocalStateSummary = {
  settingsSummary: string;
  persistenceMode: BackupPersistenceAvailability;
  gameSlices: BackupGameSliceSummary[];
  totalCustomCombos?: number;
  totalNamedLists?: number;
  lastExportedAt?: string;
};

type BackupValidationResult = {
  status: "none" | "valid" | "invalid" | "warning";
  message?: string;
  gameSliceMessages?: Array<{
    gameId: string;
    tone: "neutral" | "warning" | "destructive";
    message: string;
  }>;
};
```

Ці типи описують UI-facing contract. Exact internal storage shape, backup version policy, localized copy і game-specific validation payloads лишаються app/business-level decisions.

## Вхідні дані

- `disclosureState`: `collapsed` або `expanded`.
- `localStateSummary`: presentation summary current local settings і game slices.
- `exportAvailability`: availability і disabled reason для export action.
- `importAvailability`: availability і disabled reason для import action.
- `persistenceAvailability`: `persistent`, `sessionOnly` або `unavailable`.
- `backupOperationState`: current export/import operation state.
- `validationResult`: current backup validation status, warnings або errors.
- `redirectAutoExpand`: boolean flag від deprecated `UI-PAGE-007` redirect.
- `exportDialogState`: optional state для `UI-CMP-027 Export Dialog`.
- `importPreviewDialogState`: optional state для `UI-CMP-028 Import Preview Dialog`.
- `focusedAction`: optional focus target після redirect, close, cancel або complete.
- `activeLanguage`: active UI language для localized labels.

## Вихідні події

- `requestToggleBackupBlock(payload)`: toggle disclosure state.
- `requestExpandBackupBlock(payload)`: explicit expand, зокрема після redirect.
- `requestCollapseBackupBlock(payload)`: explicit collapse, якщо no blocking dialog active.
- `requestExportFullBackup(payload)`: generate і download full backup JSON.
- `requestOpenExportDialog(payload)`: open `UI-CMP-027 Export Dialog`, якщо implementation використовує confirmation/details dialog.
- `requestCloseExportDialog(payload)`: close export dialog and restore focus.
- `requestOpenBackupFilePicker(payload)`: open parent-owned file picker.
- `requestValidateSelectedBackup(payload)`: validate selected backup candidate, який уже нормалізовано page/app flow.
- `requestOpenImportPreview(payload)`: open `UI-CMP-028 Import Preview Dialog` для valid backup.
- `requestConfirmReplaceFromBackup(payload)`: explicit destructive replace confirmation.
- `requestCancelImport(payload)`: cancel import без mutation.
- `requestCloseBackupDialogs(payload)`: close export/import dialogs and restore focus.
- `requestRetryBackupFileSelection(payload)`: clear invalid file state enough to choose another file.

Payload не містить native file input event. File picker result нормалізується у Settings/App Shell flow до backup candidate або validation result.

Parent flow decides whether a requested action is accepted based on availability, operation state and validation state.

## Межі відповідальності

Компонент відповідає за:

- Settings-owned backup disclosure UI;
- clear expanded/collapsed behavior;
- readable local state summary;
- export/import action placement;
- loading, disabled, warning, invalid, destructive і complete states;
- nested dialog open/close presentation;
- focus return to disclosure trigger або source action;
- accessible names, expanded state і status announcements;
- Storybook/visual/a11y coverage для public states.

Компонент не відповідає за:

- route rendering або deprecated route redirect itself;
- backup schema definition;
- browser localStorage/session storage writes;
- reading files without parent flow;
- parsing JSON directly, якщо implementation keeps file IO app-level;
- validating game-specific slices;
- deciding unknown future game policy;
- importing або replacing seeded combo data;
- mutating local state before explicit replace confirmation;
- changing active `game`, `language` або `notation display mode` through backup controls directly;
- rendering `UI-CMP-002`, `UI-CMP-003`, `UI-CMP-004` або `UI-CMP-037`.

## Мапа станів

### `collapsed`

Backup block згорнутий.

Очікуваний UI:

- видно disclosure trigger і compact summary;
- `aria-expanded = false`;
- expanded panel content не є focusable;
- export/import actions недоступні в tab order;
- block займає stable compact height.

### `expanded`

Backup block відкритий користувачем або redirect context-ом.

Очікуваний UI:

- `aria-expanded = true`;
- local state summary, export action і import action visible;
- focus після deprecated redirect переходить на block heading або first safe control;
- actions reflect availability і persistence state.

### `exporting`

App формує backup envelope і запускає browser download.

Очікуваний UI:

- export action має busy state;
- repeated export disabled;
- import/replace actions можуть бути disabled, якщо parent не підтримує parallel operations;
- local state не змінюється;
- busy state announced.

### `importFilePicker`

Користувач відкрив file picker.

Очікуваний UI:

- source action лишається known focus return target;
- cancel file picker returns to expanded panel;
- no mutation performed;
- previous validation message may remain until parent clears it.

### `importValidating`

App читає і валідить selected backup file.

Очікуваний UI:

- import action або status area показує pending state;
- replace confirmation unavailable;
- validation progress announced, якщо operation помітно блокує task;
- layout does not shift around the action row.

### `importPreview`

Backup valid і preview готовий.

Очікуваний UI:

- `UI-CMP-028 Import Preview Dialog` відкритий;
- preview показує settings і game slice impact summary;
- replace action visually and textually destructive;
- cancel closes dialog без mutation and restores focus.

### `replaceConfirm`

Користувач знаходиться на explicit replace confirmation step.

Очікуваний UI:

- destructive action clearly names replace effect;
- non-color-only warning visible;
- seeded data exclusion clear in summary або confirmation copy;
- `Escape`/cancel returns without mutation.

### `replaceBusy`

Користувач підтвердив replace, і app застосовує backup data.

Очікуваний UI:

- destructive confirm disabled або busy;
- repeated confirmation unavailable;
- dialog prevents accidental close only if parent cannot safely interrupt;
- completion або failure announced.

### `importInvalid`

Selected file invalid або incompatible.

Очікуваний UI:

- `UI-CMP-030 Error State` або inline validation message explains issue;
- retry file selection available, якщо import availability remains true;
- local state unchanged;
- errors are not color-only.

### `importComplete`

Replace успішно завершено.

Очікуваний UI:

- success/status message visible near backup block або in dialog completion state;
- app-level settings, custom combos і named lists reflect imported backup;
- focus returns to safe Settings target or post-import route target;
- seeded data remains unchanged.

### `persistenceUnavailable`

Browser persistence unavailable або session-only.

Очікуваний UI:

- block explains backup limitations through readable status;
- export/import actions reflect parent availability;
- disabled actions include reason;
- user is not trapped in backup block.

### `actionDisabled`

Export або import тимчасово unavailable.

Очікуваний UI:

- disabled action has visible or accessible reason;
- disabled control does not emit action intent;
- color is not the only unavailable signal;
- focus behavior follows native disabled or intentional `aria-disabled` semantics.

## UI Behavior

### Default Settings Entry

1. Користувач відкриває [`UI-PAGE-008 Settings`](./UI-PAGE-008.md).
2. Settings passes `disclosureState = "collapsed"`.
3. `UI-CMP-034` shows trigger and compact local state summary.
4. Export/import controls are not focus targets until expansion.

### Deprecated Backup Route Redirect

1. App Shell receives deprecated `UI-PAGE-007 Backup Management` route або deep link.
2. App Shell opens [`UI-PAGE-008 Settings`](./UI-PAGE-008.md).
3. Settings passes `redirectAutoExpand = true`.
4. `UI-CMP-034` opens expanded.
5. Focus moves to backup heading or first safe action.

### Export Backup

1. Користувач розгортає block.
2. Користувач activates export action.
3. `UI-CMP-034` emits `requestExportFullBackup`.
4. Parent builds `BackupEnvelope`, validates/export-serializes known slices and starts download.
5. Block shows exporting and then success/error state.
6. Local state is unchanged.

### Import Valid Backup

1. Користувач activates import action.
2. `UI-CMP-034` emits `requestOpenBackupFilePicker`.
3. Parent receives selected file and validates envelope/settings/game slices.
4. Valid result opens `UI-CMP-028 Import Preview Dialog`.
5. Користувач confirms destructive replace.
6. Parent replaces local settings and known game slices.
7. Block or Settings shows import complete state and returns focus safely.

### Import Invalid Backup

1. Користувач selects invalid або incompatible backup file.
2. Parent returns validation errors.
3. `UI-CMP-034` shows `importInvalid`.
4. User can retry file selection.
5. Local state remains unchanged.

### Cancel Import

1. Користувач closes file picker, preview dialog або confirmation step.
2. `UI-CMP-034` emits `requestCancelImport` або `requestCloseBackupDialogs`.
3. Parent clears transient operation state as appropriate.
4. Focus returns to import action or disclosure trigger.
5. No local state mutation occurs.

## Visual Design Contract

`UI-CMP-034` має виглядати як compact Settings section, а не окремий card-heavy backup page.

Rules:

- використовувати disclosure/accordion pattern з одним section separator без повної rectangular border;
- не використовувати decorative glass або large card chrome;
- expanded panel має читатися як Settings-owned content region;
- action rows мають бути compact, aligned і stable across busy/disabled/error states;
- destructive replace tone appears only in preview/confirmation context;
- status messages use semantic success/warning/destructive tokens;
- long UA labels and validation messages wrap without overlap;
- control dimensions do not shift on hover, focus, busy, expanded/collapsed indicator change or validation changes;
- icons, if used, come from UI icon facade and remain secondary to readable labels.

Suggested anatomy:

```text
[>] Backup
    Local settings, custom combos and named lists

[v] Backup
    Local settings, custom combos and named lists
    MKXL: 12 custom combos, 3 lists
    MK1: 4 custom combos, 1 list
    [Export backup] [Import backup]
    Status / validation message
```

Visible copy above is conceptual. Exact localized copy belongs to `apps/web`.

## Recipe і variant requirements

Implementation має використовувати semantic recipes.

Recommended shared recipes:

- `control` для disclosure trigger, export action, import action і retry action;
- `surface` або `panel` для expanded content region;
- `separator` для grouping між summary, export і import action groups;
- `indicator` для expanded/collapsed, busy, success, warning і destructive markers;
- `popup` або `surface` для nested dialogs through `UI-CMP-027` і `UI-CMP-028`;
- `item` для game slice summary rows, якщо вони render-яться як repeated rows.

Allowed semantic axes:

- `disclosure`: `collapsed` або `expanded`;
- `state`: `idle`, `busy`, `disabled`, `invalid`, `complete`;
- `tone`: `neutral`, `success`, `warning`, `destructive`;
- `density`: `small` або `medium`;
- `emphasis`: `subtle`, `normal` або `prominent`;
- `material`: `none`, `opaque` або `separated`;
- `layout`: `wide`, `compact` або `stacked`;
- `selection`: `none` або `current`, якщо summary row reflects active imported target.

Forbidden primary public axes:

- raw color;
- arbitrary radius;
- arbitrary shadow;
- arbitrary blur;
- raw spacing;
- border width;
- direct `className` як primary styling API;
- arbitrary JSON schema knobs in visual component props.

`className` може існувати як integration escape hatch, але visual contract має задаватися semantic variants.

## Доступність і поведінка вводу

- Disclosure trigger є button або native disclosure-equivalent control.
- Trigger має localized accessible name.
- Trigger exposes `aria-expanded`.
- Trigger uses `aria-controls` або primitive-equivalent relationship with expanded panel.
- Collapsed panel content is not focusable and not exposed as active controls.
- `Enter` і `Space` toggle disclosure trigger.
- Keyboard order у expanded state: trigger, summary/actions/messages, nested dialog trigger flow, then next Settings control.
- Focus after deprecated redirect moves to backup heading or first safe action.
- Export/import actions have accessible names and disabled/busy semantics.
- File picker source action restores focus after cancel.
- `UI-CMP-027` і `UI-CMP-028` use modal/dialog semantics only if they block interaction.
- Import preview/replace dialog traps focus while modal and restores focus to source action after close.
- `Escape` closes dialogs according to dialog policy and never confirms replace.
- Destructive replace is identified textually and visually, not by color alone.
- Validation errors have accessible relationship to import action or status region.
- Success, validation error, long-running busy and import complete messages are announced when they affect task completion.
- Focus-visible is obvious in light, dark, standard contrast and increased contrast.
- Reduced motion removes or shortens disclosure and busy indicator transitions.
- Розміщення має лишатися придатним при browser zoom і increased text size.

## Критерії приймання

- `UI-CMP-034` має окрему повну специфікацію.
- `UI.md` посилається на `ui/UI-CMP-034.md`.
- [`UI-PAGE-008 Settings`](./UI-PAGE-008.md) рендерить backup controls тільки через `UI-CMP-034`.
- Backup block collapsed by default.
- Deprecated `UI-PAGE-007 Backup Management` redirect opens Settings with backup block expanded.
- Deprecated redirect moves focus to backup heading or first safe control.
- Export creates full backup JSON without local state mutation.
- Export includes app settings and `games: Record<GameId, unknown>` envelope.
- Import invalid backup shows readable validation error and does not mutate local state.
- Import valid backup opens `UI-CMP-028 Import Preview Dialog` before replace.
- Cancel import closes file picker/preview/confirmation without local state mutation.
- Confirm replace updates local settings and known game slices only after envelope/settings/per-game validation.
- Seeded combo data is never imported or replaced.
- Unknown future game slices follow app-level forward-compatibility policy, not UI component logic.
- Collapsed panel content is not focusable.
- Import preview/replace dialog traps focus and restores focus after close.
- Destructive replace is explicit and non-color-only.
- Status/error/success updates are announced.
- Component does not render `UI-CMP-002`, `UI-CMP-003`, `UI-CMP-004` or `UI-CMP-037`.

## Storybook і visual coverage

Storybook або equivalent component docs мають містити сценарії:

- `CollapsedDefault`;
- `ExpandedReady`;
- `RedirectAutoExpanded`;
- `Exporting`;
- `ImportFilePicker`;
- `ImportValidating`;
- `ImportInvalid`;
- `ImportPreviewOpen`;
- `ReplaceConfirm`;
- `ReplaceBusy`;
- `ImportComplete`;
- `PersistenceUnavailable`;
- `ActionDisabled`;
- `LongUALabels`;
- `FocusVisible`;
- `KeyboardOnly`;
- `ReducedMotion`;
- `CompactStacked`.

Visual tests мають покривати:

- light/dark;
- standard/increased contrast;
- collapsed and expanded states;
- exporting busy state;
- validating state;
- invalid import message;
- preview dialog open on page-level capture;
- replace busy state;
- import complete message;
- compact width;
- long UA labels and validation messages;
- focus-visible on trigger and actions;
- keyboard-only flow;
- reduced-motion state;
- no overlap between trigger, summary, actions, status messages and surrounding Settings controls.

Automated accessibility checks мають перевірити:

- disclosure accessible name;
- `aria-expanded` relationship;
- no focusable expanded content while collapsed;
- export/import action accessible names;
- disabled reasons;
- status announcements;
- import validation error relationship;
- dialog focus trap and focus restore;
- destructive replace not color-only;
- keyboard toggle and cancel behavior.

## Тестові сценарії

- Settings default render shows `UI-CMP-034` collapsed.
- Expanding block reveals local state summary, export action and import action.
- Collapsing block removes export/import actions from tab order.
- Deprecated `UI-PAGE-007` route opens Settings with backup block expanded.
- Deprecated redirect focuses backup heading or first safe backup control.
- Export action emits `requestExportFullBackup`.
- Export flow produces full backup JSON and does not change local state.
- Export unavailable state has readable disabled reason.
- Import action opens backup file picker through parent flow.
- Cancel file picker returns focus to import action and does not mutate local state.
- Invalid JSON file shows validation error and leaves local state unchanged.
- Incompatible known game slice shows game-specific validation message and leaves local state unchanged.
- Valid backup opens `UI-CMP-028 Import Preview Dialog`.
- Preview cancel closes dialog and leaves local state unchanged.
- Replace confirmation cannot be triggered by `Escape`.
- Confirm replace updates local settings and known game slices only after validation.
- Confirm replace does not import or replace seeded combo data.
- Import complete announces success and returns focus to a safe target.
- `localStorage` unavailable shows persistence limitation without trapping focus.
- Long UA labels and validation messages wrap without overlapping actions.

## Відкриті уточнення

- Exact copy for backup summary, destructive confirmation and validation errors belongs to `apps/web` localization.
- Exact `UI-CMP-027 Export Dialog` contract може бути деталізований окремим component spec.
- Exact `UI-CMP-028 Import Preview Dialog` contract може бути деталізований окремим component spec.
- Exact Base UI disclosure/dialog primitive APIs will be chosen during implementation in shared UI primitives.
- Forward-compatibility policy for unknown future game slices is an app-level backup versioning decision.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.

## Flat Workspace Visual Contract

- Компонент входить в один page canvas і не створює card wrapper для звичайного content flow.
- Повна border, radius і shadow дозволені тільки owning overlay surface; peer content regions використовують spacing та один separator.
- Standalone icon-only actions використовують transparent `icon` presentation без background, visible border або inset shadow у всіх states; focus лишається зовнішнім ring.
- Text controls, `icon + text` actions, notation keycaps, validation і focus indicators зберігають необхідні interaction boundaries.
