# UI-PAGE-008: Settings

## Метадані

- Код: `UI-PAGE-008`
- Назва: `Settings`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані компоненти: [`UI-CMP-003`](./UI-CMP-003.md), [`UI-CMP-004`](./UI-CMP-004.md), [`UI-CMP-037`](./UI-CMP-037.md), [`UI-CMP-027`](./UI-CMP-027.md), [`UI-CMP-028`](./UI-CMP-028.md), `UI-CMP-030`, [`UI-CMP-034`](./UI-CMP-034.md)
- Пов'язані UX сценарії: `US-002`, `US-008`, `US-009`, `US-017`, `US-018`, `US-024`

## Призначення

`UI-PAGE-008 Settings` є route-level сторінкою для зміни applied settings і
per-game export/import після входу в застосунок.

Settings відповідає за:

- негайне застосування й autosave active `language`: `EN` або `UA`;
- негайне застосування й autosave `notation display mode`: `FGC`, `PlayStation` або `Xbox`;
- session-only warning без rollback, якщо persistent storage недоступний;
- accordion backup controls для всіх installed games;
- export/import рівно однієї game slice за одну операцію;
- повернення до captured working surface або до resolved game Catalog fallback.

Settings не є first-launch gate. Fresh browser locale нормалізується app-level
логікою: `uk` і `uk-*` дають `UA`, усі інші locale — `EN`; initial notation mode —
`FGC`. Valid route-prefixed deep link використовує URL-derived `gameId`, той самий
language fallback і `FGC` без ручного setup.

Після first launch гру змінюють через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md)
у global breadcrumbs. Settings не рендерить page-owned Game Switcher.

## Архітектурний контекст

Game Switcher будується з `installedGames` у
`apps/web/src/game-business/installed-games/value.ts` і рендериться через
`UI-CMP-001 -> UI-CMP-032`, не у Settings form.

Per-game backup використовує shared contract:

```ts
type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

type GameBackupEnvelope = {
  version: number
  exportedAt: string
  gameId: GameId
  slice: JsonValue
}
```

Один файл містить тільки user slice однієї гри: custom combos, named lists і last
catalog context цієї гри. Global settings, slices інших ігор і seeded game data у
файл не входять. Opaque game-owned `slice` обов'язково є JSON-safe.

`apps/web` володіє file IO, envelope/version/installed-target validation,
persistence та replace orchestration. Matching game business entry point серіалізує
і валідить `slice`. Settings не відтворює game-specific rules.

TanStack Router і Zod route boundary є єдиним owner URL-state. Plain `/settings`
показує tab `Interface`; `/settings?section=backup` показує tab `Game backups` і
розгортає item для resolved `lastActiveGameId`, потім `defaultGameId`, потім першої
installed game. Deprecated logical route `/backup` replace-навігує до цього URL.
Окремий query-state provider не використовується.

## Володіння

`UI-PAGE-008` або його problem-specific page hooks володіють:

- app settings source і observable state;
- synchronous persistence attempt та session-only message;
- structured ephemeral return target;
- single-open accordion state keyed by installed `GameId`;
- current backup operation, target `gameId`, validation result і candidate ID;
- page-owned hidden file input та normalized file result;
- singleton `UI-CMP-027` і `UI-CMP-028` overlay state;
- explicit one-slice replace після confirmation.

Pure components отримують prepared models і semantic handlers. Native/form/browser
events не входять у public component callbacks.

## Контракт стану сторінки

Стан у власності сторінки:

- applied language і notation display mode;
- persistence mode: `persistent` або `sessionOnly`;
- optional persistence warning;
- `expandedBackupGameId: GameId | null`;
- backup operation state і target `gameId`;
- validation result, optional valid candidate ID і preview state;
- source focus target та Settings return target.
- active section, підготовлений із validated route search;

Semantic methods:

- `selectLanguage(payload)`;
- `selectNotationDisplayMode(payload)`;
- `selectSettingsSection(payload)`;
- `toggleBackupGame(payload)`;
- `openGameExport(payload)`;
- `confirmGameExport(payload)`;
- `openGameBackupFilePicker(payload)`;
- `validateGameBackupCandidate(payload)`;
- `openGameImportPreview(payload)`;
- `confirmGameSliceReplace(payload)`;
- `cancelBackupOperation(payload)`;
- `returnFromSettings(payload)`.

Language і notation methods одразу змінюють app memory state, після чого синхронно
намагаються записати persisted state. Помилка запису не повертає попереднє value.

## Анатомія

```jsx
<SettingsPage ui="UI-PAGE-008">
  <SettingsSurface slot="UI-PAGE-001 active route">
    <Stack name="SettingsLayout">
      <Header>
        <PageTitle />
        <ContextualNavigationReturnAction />
      </Header>

      <TabsRoot primitive="@mk-combos/ui/primitives/tabs" value={activeSection}>
        <TabsList labels="Interface|Game backups" />
        <TabsPanel value="interface" keepMounted={false}>
          <SettingsForm>
            <LanguageSwitcher ui="UI-CMP-003" />
            <DisplayModeSwitcher ui="UI-CMP-004" />
          </SettingsForm>
          <NotationLegendTable ui="UI-CMP-037" />
        </TabsPanel>

        <TabsPanel value="backup" keepMounted={false}>
          <BackupAccordionRegion>
            <BackupCollapsibleBlock ui="UI-CMP-034" registry="installedGames" />
          </BackupAccordionRegion>
        </TabsPanel>
      </TabsRoot>

      <Show when={hasPersistenceSystemMessage}>
        <PersistenceSystemMessageArea />
      </Show>

      <Show when={isExportDialogOpen}>
        <ExportDialog ui="UI-CMP-027" />
      </Show>

      <Show when={isImportPreviewDialogOpen}>
        <ImportPreviewDialog ui="UI-CMP-028" />
      </Show>
    </Stack>
  </SettingsSurface>
</SettingsPage>
```

Правила розміщення:

- inactive tab panel unmount-иться й не лишає hidden focus targets;
- interface controls і notation reference стоять у двох колонках на desktop та
  послідовно на mobile;
- Settings повторює `UI-CMP-034` для кожної installed game;
- одночасно expanded не більше одного backup item;
- dialogs є singleton page-owned overlays, а не repeated children accordion items;
- native file input page-owned і не входить у видиму component anatomy.

## Settings autosave

`UI-CMP-003` і `UI-CMP-004` показують applied values. Окремого draft, Apply або Save
action немає.

Після selection:

1. Settings негайно оновлює app-level state.
2. Language change одразу оновлює localized app copy і `<html lang>` (`EN -> en`, `UA -> uk`).
3. Settings синхронно намагається persist-нути state.
4. Success лишає page у `ready`.
5. Failure лишає selected value applied, переходить у `sessionOnly` і показує warning.

Notation mode змінює тільки rendering. Він не змінює `movePath`, canonical FGC
notation, seeded data, custom data або `cachedNotation`.

## Backup accordion

Settings формує ordered items з `installedGames`. Для кожного item передається:

- target `gameId` і localized game label;
- expanded/collapsed state;
- summary тільки target game slice;
- export/import availability;
- target-specific operation/validation state;
- semantic intents із target `gameId`.

Plain `/settings` не монтує backup controls. `/settings?section=backup`, включно з
deprecated `/backup` redirect, auto-expands resolved last/default item. Toggle іншого
item закриває попередній. Під час active create/restore operation accordion, tabs і
інші game operations недоступні.

## Export flow

1. User opens target game item і export dialog.
2. Settings resolves matching installed business entry point.
3. Business `backup.serializeSlice` серіалізує тільки target game user state.
4. Settings формує supported version `GameBackupEnvelope` і завантажує
   `mk-combos-{gameId}-{timestamp}.json`.
5. Global settings, other game slices і seeded data не читаються як export payload.
6. Local state не мутує.

Structurally invalid known slice блокує export і показує readable repair/import path.

## Import flow

1. User activates import у target item; Settings відкриває page-owned file picker.
2. Settings parse-ить JSON і валідить strict envelope та current version `1`.
3. Envelope `gameId` має бути installed і точно збігатися з target item.
4. Matching business `backup.validateSlice` валідить `slice`.
5. Malformed JSON, unsupported version, uninstalled/mismatched `gameId` або invalid
   slice не відкривають preview і не мутують state.
6. Business warnings дозволяють preview, але raw business/Zod diagnostics не
   показуються; UI використовує локалізоване review warning.
7. Valid candidate отримує ephemeral ID; `UI-CMP-028` відкривається тільки для нього.
8. Replace приймається лише для matching candidate ID після explicit destructive confirmation.
9. Replace змінює тільки `state.games[targetGameId]`.

Global settings, other game slices і seeded data лишаються незмінними. Після invalid
import operation повертається в `idle`, а message лишається видимим, щоб retry був
доступним.

## Мапа станів

### `ready`

Applied controls доступні; persistence warning відсутній; backup items відображають
target-specific summaries.

### `persistingSelection`

Selected value вже applied, виконується synchronous persistence attempt. Control не
повинен показувати stale previous value.

### `sessionOnly`

Selected value applied у memory, persistence failed, non-blocking warning visible.

### `backupCollapsed`

Всі items або конкретний item згорнуті; hidden panels не є focus targets.

### `backupExpanded`

Рівно один target game item відкритий і показує per-game actions/summary.

### `exporting`

Target export busy; accordion та інші game operations blocked; state immutable.

### `importFilePicker`

Page-owned native picker active; cancel повертає focus до target import action.

### `importValidating`

Envelope й matching game slice validating; preview/replace unavailable.

### `importInvalid`

Readable message visible; preview closed; operation idle; retry available; no mutation.

### `importPreview`

Matching candidate preview open; target game and one-slice impact visible.

### `replaceBusy`

Explicit confirmation accepted; only target game slice replacement is in progress.

### `importComplete`

Target slice replaced; Settings/other games unchanged; success announced.

## Навігація і return

Перед навігацією зі working surface до Settings App Shell зберігає structured
ephemeral return target. Return веде до нього, якщо target валідний. Direct або
reloaded Settings використовує resolved game Catalog fallback.

Return label називає реальний target, наприклад `Back to MK1 lists` або `Назад до
каталогу MKXL`. Return не чекає Apply/Save, бо settings autosave. Active backup dialog/operation
спочатку cancel-иться або завершується за власним lifecycle.

## Доступність і поведінка вводу

- Settings controls мають visible label/accessibility name і current state.
- Autosave warning не покладається лише на color і оголошується assistive technology.
- Tab list має localized accessible name; keyboard navigation і selected/disabled
  states належать shared Tabs primitive.
- Accordion headers expose expanded state; collapsed panels не focusable.
- Focus order проходить installed game items у registry order.
- Redirect focus переходить до auto-expanded target heading або first safe action.
- Export/import dialogs trap focus while modal і restore focus to target item action.
- Native picker cancel/selection повертає focus до target import flow.
- Destructive replace чітко називає target game і one-slice effect.
- Mismatch/uninstalled/version/validation errors мають readable target relationship.
- `Escape` ніколи не підтверджує replace.
- Controller-only flow дотримується prepared focus graph; native picker є єдиним external-input винятком.

## Критерії приймання

- Settings є route-level page, не modal і не dropdown.
- Settings не рендерить page-owned `UI-CMP-002 Game Switcher`.
- Language і notation selection застосовуються та persist-яться одразу без Apply.
- Persistence failure не відкатує selection і показує session-only warning.
- Fresh locale `uk`/`uk-*` дає `UA`, інші locale — `EN`; default mode — `FGC`.
- Settings рендерить один `UI-CMP-034` на кожну installed game.
- Accordion дозволяє expanded максимум один item.
- `/settings` відкриває Interface; `/settings?section=backup` і deprecated `/backup`
  відкривають Game backups та auto-expand resolved last/default game.
- Export формує `GameBackupEnvelope` тільки для target game slice і не мутує state.
- Backup file не містить global settings, other game slices або seeded data.
- Import відхиляє malformed JSON, version не `1`, uninstalled або mismatched `gameId`.
- Matching game business валідить slice; invalid slice не відкриває preview.
- Valid candidate відкриває preview перед explicit destructive replace.
- Replace змінює лише `state.games[targetGameId]`.
- Return веде до captured surface або resolved Catalog fallback.

## Тестові сценарії

- Settings показує current language/display mode без Apply action.
- Selection `UA` одразу оновлює localized copy, `<html lang="uk">` і persistence.
- Selection `Xbox` одразу оновлює notation rendering без mutation combo source.
- localStorage failure зберігає selected value у session-only state.
- Plain Settings не монтує backup items; backup tab створює два registry-backed items
  і auto-expands resolved active game.
- Expanding MK1 closes expanded MKXL.
- Deprecated `/backup` expands last/default installed game item.
- Export MK1 створює envelope `gameId = "mk1"` лише з MK1 slice.
- Invalid JSON, unsupported version і uninstalled `gameId` не відкривають preview.
- MKXL file у MK1 item повертає target mismatch без mutation.
- Business-invalid slice показує error; business warning відкриває preview із warning.
- Cancel preview не мутує state.
- Candidate-ID mismatch не може confirm-нути replace.
- Confirm MK1 replace не змінює settings, MKXL slice або seeded data.
- Direct Settings return веде до resolved game Catalog fallback.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared
focus graph із [UI.md](../UI.md).

- `mobile` використовує vertical-first accordion і edge-safe bottom-sheet dialogs;
- `tablet` використовує hybrid composition та explicit directional neighbors;
- `desktop` використовує workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic events;
- native backup file picker є єдиним external-input винятком.

## Flat Workspace Visual Contract

- Settings використовує один flat page canvas без card wrapper для кожного game item.
- Peer sections розділяються spacing, hierarchy та одним separator.
- Повна border/radius/shadow дозволені owning dialog overlays.
- Text controls, status/validation messages і focus indicators зберігають semantic boundaries.
