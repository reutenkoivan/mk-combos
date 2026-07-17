# UI-PAGE-008: Settings

## Метадані

- Код: `UI-PAGE-008`
- Назва: `Settings`
- Тип: `screen-level modal / app settings and backup`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані компоненти: [`UI-CMP-003`](./UI-CMP-003.md), [`UI-CMP-004`](./UI-CMP-004.md), [`UI-CMP-037`](./UI-CMP-037.md), [`UI-CMP-027`](./UI-CMP-027.md), [`UI-CMP-028`](./UI-CMP-028.md), `UI-CMP-030`, [`UI-CMP-034`](./UI-CMP-034.md)
- Пов'язані UX сценарії: `US-002`, `US-008`, `US-009`, `US-017`, `US-018`, `US-024`

## Призначення

`UI-PAGE-008 Settings` є App Shell modal для зміни applied settings і per-game
export/import після входу в застосунок. Він відкривається над current working route;
route page лишається змонтованою та зберігає свій business/UI state.

Settings відповідає за:

- негайне застосування й autosave active `language`: `EN` або `UA`;
- негайне застосування й autosave `notation display mode`: `FGC`, `PlayStation` або `Xbox`;
- session-only warning без rollback, якщо persistent storage недоступний;
- accordion backup controls для всіх installed games;
- export/import рівно однієї game slice за одну операцію;
- standard modal dismissal і повернення focus до opener без route-state reconstruction;
- blocking dismissal, коли nested backup dialog або busy backup lifecycle має precedence.

Settings не є first-launch gate. Fresh browser locale нормалізується app-level
логікою: `uk` і `uk-*` дають `UA`, усі інші locale — `EN`; initial notation mode —
`FGC`. Valid route-prefixed deep link використовує URL-derived `gameId`, той самий
language fallback і `FGC` без ручного setup.

Після first launch гру змінюють через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md)
у global breadcrumbs. Settings не рендерить власний Game Switcher; underlying
breadcrumbs лишаються visible за desktop backdrop, але inert, доки modal open.

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

TanStack Router і Zod boundary є єдиним owner URL-state. Settings використовує query
на current working route:

```text
?settings=interface
?settings=backup
```

Відсутність `settings` означає closed. Shell action додає `settings=interface`,
зберігаючи current path, params та інші validated search values. Перемикання tab
replace-оновлює значення; dismissal прибирає його. `settings=backup` показує tab
`Game backups` і розгортає item для resolved active/last/default/first installed game.
Окремий query-state provider не використовується. Routes `/settings` і `/backup` та
compatibility redirects відсутні.

## Володіння

`UI-PAGE-001 App Shell` володіє current working route, validated Settings query,
modal mounting, responsive placement, inert underlay, top-level dismissal і focus
restore. `UI-PAGE-008` або його problem-specific hooks володіють:

- app settings source і observable state;
- synchronous persistence attempt та session-only message;
- single-open accordion state keyed by installed `GameId`;
- current backup operation, target `gameId`, validation result і candidate ID;
- page-owned hidden file input та normalized file result;
- singleton `UI-CMP-027` і `UI-CMP-028` overlay state;
- prepared nested/busy dismissal barrier для App Shell;
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
- source focus target, Settings opener target і dismissal state: `ready`, `nested` або `busy`;
- active section, підготовлений із validated `settings` query current working route;

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
- `requestDismissSettings(payload)`.

Language і notation methods одразу змінюють app memory state, після чого синхронно
намагаються записати persisted state. Помилка запису не повертає попереднє value.

## Анатомія

```jsx
<SettingsModal ui="UI-PAGE-008" slot="UI-PAGE-001 overlay layer">
  <DialogBackdrop />

  <SettingsDialogSurface responsiveMode={responsiveMode}>
    <Stack name="SettingsLayout">
      <Header>
        <PageTitle />
        <CloseAction />
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
  </SettingsDialogSurface>
</SettingsModal>
```

Правила розміщення:

- current working route лишається mounted, але modal робить shell underlay inert;
- `mobile` і `tablet` використовують full-screen Settings surface; `desktop`
  використовує tall, wide centered dialog над backdrop;
- header завжди має visible Close action; nested dialog перехоплює dismissal, а busy
  backup state робить Settings dismissal недоступним із readable reason;
- inactive tab panel unmount-иться й не лишає hidden focus targets;
- interface controls і notation reference стоять у двох колонках на desktop та
  послідовно на mobile/tablet;
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

`settings=interface` не монтує backup controls. `settings=backup` auto-expands
resolved active/last/default item. Toggle іншого item закриває попередній. Під час
active create/restore operation accordion, tabs, Settings Close, backdrop, `Escape`,
browser/controller Back та інші game operations недоступні.

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

## Відкриття і dismissal

App Shell відкриває Settings на current working route, додаючи
`settings=interface` як новий history entry. Current path, params, unrelated validated
search values і mounted working-page state не змінюються. Перемикання tab
replace-оновлює query до `settings=interface` або `settings=backup`, не створюючи
окремої history entry для кожного tab.

Visible Close, `Escape`, Settings backdrop і semantic controller `Back` прибирають
`settings` та повертають focus до opener або prepared safe shell target. Browser Back
закриває modal через створену під час open history entry. Якщо відкритий Export або
Import Preview dialog, перший Close/`Escape`/backdrop/Back належить nested dialog і не
закриває Settings. Під час picker, validation, export або replace busy lifecycle
Settings dismissal заблокований до safe terminal/cancel state.

Reload valid working URL із `settings=interface|backup` відновлює route і відкриває
modal над нею. `/settings` і `/backup` не резолвляться як Settings entry points.

## Поведінка controller

Modal focus graph проходить Close, tabs і controls активного tab.
`navLeft`/`navRight` рухаються між segmented options, `navUp`/`navDown` —
між rows, а `confirm` застосовує focused option/action. `previousTab` і `nextTab`
циклічно перемикають Interface/Game backups і показуються в ribbon як
`leftShoulder`/`rightShoulder`. `back` закриває Settings, коли nested overlay і busy
backup barrier відсутні.

Backup graph містить game headers і лише mounted Export/Import actions, пропускає
disabled controls і відновлює logical focus після native picker. Export dialog має
Cancel/Confirm; Import dialog — Cancel/Retry/Replace з prepared responsive graph. Dialog scope є
`exclusive`, `confirm` активує лише focused enabled action, а `back` спочатку cancel-ить
nested dialog, не Settings.
Під час picker/validation/busy operation exclusive barrier блокує actions і suppress-ить
shell `Menu`; порожня ribbon не монтується.

Поза blocking operations shell `Menu` додається останнім. Зміна notation
display mode застосовується одразу, тому App Shell ribbon оновлює
FGC/PlayStation/Xbox glyphs у тому самому render flow.

## Доступність і поведінка вводу

- Settings controls мають visible label/accessibility name і current state.
- Settings surface має modal semantics, accessible title/description і trap focus;
  working route є inert та відсутня з active focus/controller graph.
- Visible Close має stable accessible name; focus після dismissal повертається opener-у
  або declared safe shell target.
- Autosave warning не покладається лише на color і оголошується assistive technology.
- Tab list має localized accessible name; keyboard navigation і selected/disabled
  states належать shared Tabs primitive.
- Accordion headers expose expanded state; collapsed panels не focusable.
- Focus order проходить installed game items у registry order.
- `settings=backup` initial focus переходить до auto-expanded target heading або first safe action.
- Export/import dialogs trap focus while modal і restore focus to target item action.
- Native picker cancel/selection повертає focus до target import flow.
- Destructive replace чітко називає target game і one-slice effect.
- Mismatch/uninstalled/version/validation errors мають readable target relationship.
- `Escape` ніколи не підтверджує replace.
- `Escape`, backdrop і Back не обходять nested dialog або busy backup barrier.
- Controller-only flow дотримується prepared focus graph; native picker є єдиним external-input винятком.

## Критерії приймання

- Settings є App Shell modal над current working route, не route page і не dropdown.
- Query `settings=interface|backup` на current route є єдиним open/section contract;
  absence означає closed.
- `/settings` і `/backup` не мають route або compatibility behavior.
- `mobile` і `tablet` показують full-screen Settings; `desktop` — tall, wide centered dialog.
- Settings не рендерить page-owned `UI-CMP-002 Game Switcher`.
- Language і notation selection застосовуються та persist-яться одразу без Apply.
- Persistence failure не відкатує selection і показує session-only warning.
- Fresh locale `uk`/`uk-*` дає `UA`, інші locale — `EN`; default mode — `FGC`.
- Settings рендерить один `UI-CMP-034` на кожну installed game.
- Accordion дозволяє expanded максимум один item.
- Shell open встановлює `settings=interface`; tab switch replace-оновлює query, а
  `settings=backup` відкриває Game backups та auto-expand resolved active/last/default game.
- Export формує `GameBackupEnvelope` тільки для target game slice і не мутує state.
- Backup file не містить global settings, other game slices або seeded data.
- Import відхиляє malformed JSON, version не `1`, uninstalled або mismatched `gameId`.
- Matching game business валідить slice; invalid slice не відкриває preview.
- Valid candidate відкриває preview перед explicit destructive replace.
- Replace змінює лише `state.games[targetGameId]`.
- Close, `Escape`, backdrop, browser Back і controller `Back` прибирають query та
  лишають working route/state незмінними.
- Nested dialog отримує перший dismissal; busy backup operation блокує Settings dismissal.
- Controller graph дає доступ до Close, tabs, interface controls і mounted backup actions без synthetic events.
- Dialog Back завжди cancel-ить; disabled/busy action не можна активувати через controller.
- Busy backup operation suppress-ить shell `Menu`; native picker лишається external-input винятком.

## Тестові сценарії

- Settings показує current language/display mode без Apply action.
- Selection `UA` одразу оновлює localized copy, `<html lang="uk">` і persistence.
- Selection `Xbox` одразу оновлює notation rendering без mutation combo source.
- Selection `Xbox` одразу змінює command ribbon з FGC/PlayStation glyphs на Xbox glyphs.
- localStorage failure зберігає selected value у session-only state.
- Shell action на `/mkxl/catalog` відкриває `/mkxl/catalog?settings=interface`, не
  unmount-ить Catalog і робить його inert.
- `settings=interface` не монтує backup items; backup tab replace-оновлює query,
  створює два registry-backed items
  і auto-expands resolved active game.
- Expanding MK1 closes expanded MKXL.
- `/settings` і `/backup` не відкривають Settings і не redirect-ять до working route.
- Export MK1 створює envelope `gameId = "mk1"` лише з MK1 slice.
- Invalid JSON, unsupported version і uninstalled `gameId` не відкривають preview.
- MKXL file у MK1 item повертає target mismatch без mutation.
- Business-invalid slice показує error; business warning відкриває preview із warning.
- Cancel preview не мутує state.
- Candidate-ID mismatch не може confirm-нути replace.
- Confirm MK1 replace не змінює settings, MKXL slice або seeded data.
- Close/`Escape`/backdrop/browser Back/controller `Back` прибирають `settings` і
  відновлюють той самий working route та opener focus.
- Back із Import Preview спочатку закриває preview; наступний Back закриває Settings.
- Export/import busy state і native picker не дозволяють закрити Settings.
- Controller shoulders циклічно перемикають tabs; D-Pad/Confirm змінюють interface options.
- Export/Import dialogs пропускають disabled actions, а Back cancel-ить dialog і відновлює focus.
- Picker/validation/replace busy states не пропускають page commands або global `Menu`.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared
focus graph із [UI.md](../UI.md).

- `mobile` використовує full-screen Settings, vertical-first accordion і edge-safe nested dialogs;
- `tablet` використовує full-screen Settings, hybrid composition та explicit directional neighbors;
- `desktop` використовує tall, wide centered Settings dialog і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic events;
- native backup file picker є єдиним external-input винятком.

## Layered Workspace Visual Contract

- Settings використовує один elevated modal canvas; desktop interface controls і notation
  reference згруповані у два subtle inset panels, а backup registry — в один inset region.
- Окремі game items не отримують власного card shadow; peer sections розділяються spacing,
  hierarchy, surface tone і separator-ами.
- Desktop Settings surface і owning nested dialogs мають виразні border/radius/shadow;
  mobile/tablet full-screen surface не імітує вкладений modal card.
- Text controls, status/validation messages і focus indicators зберігають semantic boundaries.
