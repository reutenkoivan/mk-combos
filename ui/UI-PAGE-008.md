# UI-PAGE-008: Settings

## Метадані

- Код: `UI-PAGE-008`
- Назва: `Settings`
- Тип: `сторінка`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Пов'язані компоненти: [`UI-CMP-003`](./UI-CMP-003.md), [`UI-CMP-004`](./UI-CMP-004.md), [`UI-CMP-037`](./UI-CMP-037.md), `UI-CMP-027`, `UI-CMP-028`, `UI-CMP-030`, `UI-CMP-034`
- Пов'язані UX сценарії: `US-002`, `US-008`, `US-009`, `US-017`, `US-018`, `US-024`

## Призначення

`UI-PAGE-008 Settings` є route-level сторінкою для ручної зміни applied settings після входу в застосунок.

Settings відповідає за:

- зміну active `language`: `EN` або `UA`;
- зміну `notation display mode`: `FGC`, `PlayStation` або `Xbox`;
- застосування settings до app-level state;
- persistence у local browser settings або session-only equivalent;
- export full backup JSON;
- import backup JSON через preview і replace confirmation;
- повернення користувача до попередньої робочої surface або до `UI-PAGE-003 Catalog`.

Settings не є first-launch gate. Початкові settings можуть бути встановлені через `UI-PAGE-002 First-Launch Setup` або через valid route-prefixed deep link auto-config: URL-derived `gameId` і default `notation display mode = FGC`.

Після first launch ручна зміна game відбувається через [`UI-CMP-002 Game Switcher`](./UI-CMP-002.md) як перший item у global breadcrumbs, а не через Settings form.

## Архітектурний контекст

Game Switcher будується з `installedGames`, які зареєстровані в `apps/web/src/game-business/installed-games.ts`, але рендериться у global breadcrumbs через `UI-CMP-001 -> UI-CMP-032`, не у Settings form. Backup envelope має форму `games: Record<GameId, unknown>`, а кожну game slice валідить відповідний business entry point.

Backup flow є частиною Settings і рендериться в `UI-CMP-034 Backup Collapsible Block`. Старий `UI-PAGE-007 Backup Management` має статус `Deprecated`; route або deep link до нього перенаправляє в Settings із розгорнутим backup block.

## Володіння

`UI-PAGE-008` є owner для settings switchers:

- [`UI-CMP-003 Language Switcher`](./UI-CMP-003.md);
- [`UI-CMP-004 Display Mode Switcher`](./UI-CMP-004.md).

`UI-PAGE-008` може рендерити read-only notation reference поруч із display mode selector:

- [`UI-CMP-037 Notation Legend Table`](./UI-CMP-037.md).

`UI-PAGE-008` також є owner для backup block:

- `UI-CMP-034 Backup Collapsible Block`;
- `UI-CMP-027 Export Dialog`;
- `UI-CMP-028 Import Preview Dialog`.

`UI-CMP-001 Global Top Bar` може відкрити `UI-PAGE-008 Settings` через `UI-CMP-033 Top Bar Dropdown Menu`. Той самий Top Bar рендерить `UI-CMP-002 Game Switcher` у breadcrumbs і передає game-switch intent в App Shell.

## Контракт Стану Сторінки

Стан у власності сторінки:

- settings draft values, validation state, dirty state і save/apply state;
- previous surface або return target;
- backup block expanded/collapsed state, export/import operation state і validation result;
- export dialog state, import preview dialog state і source focus target;
- session-only persistence і system message state.

Підготовлені UI models для дочірніх компонентів:

- `UI-CMP-003` language switcher model;
- `UI-CMP-004` display mode switcher model;
- `UI-CMP-037` read-only notation legend model;
- `UI-CMP-034` backup block model і nested `UI-CMP-027`/`UI-CMP-028` dialog models.

Сторінкові handlers / intents:

- `requestSelectLanguage(payload)`, `requestSelectDisplayMode(payload)`, `requestApplySettings(payload)`;
- `requestToggleBackupBlock(payload)`, `requestExportFullBackup(payload)`, `requestOpenBackupFilePicker(payload)`;
- `requestValidateBackupSelection(payload)`, `requestConfirmBackupReplace(payload)`, `requestCancelImport(payload)`;
- `requestReturnFromSettings(payload)`.

Бізнес-залежності:

- app-level settings state і persistence;
- local state envelope serialization і backup validation;
- registered game business entry points для per-game backup slice validation.

Не відповідає за:

- page-owned game switcher rendering;
- direct file input event payloads у backup UI callbacks;
- local state replacement до explicit page-level confirmation.

## Анатомія

Розміщення Settings читається згори вниз: applied settings form і notation reference стоять перед backup block, а import/export dialogs відкриваються як page-owned overlays від Settings flow.

```jsx
<SettingsPage ui="UI-PAGE-008">
  <SettingsSurface slot="UI-PAGE-001 active route">
    <Stack name="SettingsLayout">
      <SettingsForm>
        <Stack name="SettingsFormControls">
          <LanguageSwitcher ui="UI-CMP-003" />
          <DisplayModeSwitcher ui="UI-CMP-004" />
        </Stack>
      </SettingsForm>

      <NotationLegendTable ui="UI-CMP-037" />

      <BackupCollapsibleBlock ui="UI-CMP-034">
        <DisclosureHeader />

        <Show when={backupBlockExpanded}>
          <BackupActionGroups />
        </Show>
      </BackupCollapsibleBlock>

      <Show when={hasPersistenceSystemMessage}>
        <PersistenceSystemMessageArea />
      </Show>

      <NavigationReturnAction />

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

- `UI-CMP-003` стоїть над `UI-CMP-004`, щоб form reading order збігався з first-launch setup.
- `UI-CMP-037` є read-only companion нижче settings controls, а не control усередині segmented switcher.
- `UI-CMP-034` стоїть після regular settings і містить тільки disclosure/panel structure; dialogs монтуються як singleton overlays на рівні Settings.
- File picker result входить у Settings flow як prepared intent/result; anatomy не описує native `<input>` event.

### SettingsSurface

SettingsSurface є page-level container, який рендериться в slot активної сторінки `UI-PAGE-001 App Shell`.

SettingsSurface має:

- показувати поточні applied settings;
- не бути modal або dropdown panel;
- не дублювати Top Bar navigation;
- не дублювати `UI-CMP-002 Game Switcher`;
- не показувати catalog, list або builder controls;
- показувати backup controls тільки через `UI-CMP-034 Backup Collapsible Block`;
- дозволяти повернення до попередньої робочої surface або `UI-PAGE-003 Catalog`.

### Settings form

Settings form групує controls для ручної зміни language і notation display mode.

Форма має:

- показувати current language і notation display mode;
- зберігати unsaved values під час `editing`;
- мати явний apply/save action або equivalent page-level save event;
- показувати pending/busy state під час `saving`;
- не змінювати source of truth combo data.

### UI-CMP-003 Language Switcher

Детальна специфікація: [UI-CMP-003 Language Switcher](./UI-CMP-003.md).

`UI-CMP-003 Language Switcher` дає змінити мову UI і localized content.

Дозволені значення:

- `EN`;
- `UA`.

Зміна language не має змінювати selected game, notation display mode, combo path або custom data.

### UI-CMP-004 Display Mode Switcher

Детальна специфікація: [UI-CMP-004 Display Mode Switcher](./UI-CMP-004.md).

`UI-CMP-004 Display Mode Switcher` дає змінити спосіб відображення notation.

Дозволені значення:

- `FGC`;
- `PlayStation`;
- `Xbox`.

Notation display mode впливає тільки на rendering. Він не змінює `movePath`, canonical FGC notation, seeded combo data або `cachedNotation`.

### UI-CMP-037 Notation Legend Table

Детальна специфікація: [UI-CMP-037 Notation Legend Table](./UI-CMP-037.md).

`UI-CMP-037 Notation Legend Table` показує read-only SVG marker examples для `FGC`, `PlayStation`, `Xbox` і notation modifiers.

Table не змінює selected display mode, не бере участі у save/apply lifecycle і не перераховує notation.

### UI-CMP-034 Backup Collapsible Block

`UI-CMP-034 Backup Collapsible Block` містить import/export backup у Settings.

Block має:

- бути згорнутим за замовчуванням;
- відкриватися за явною взаємодією користувача;
- відкриватися автоматично після deprecated redirect із `UI-PAGE-007 Backup Management`;
- показувати export action для full backup JSON;
- показувати import action для вибору backup JSON;
- відкривати `UI-CMP-028 Import Preview Dialog` перед replace;
- не змінювати local state до явного підтвердження replace.

Backup включає local settings, custom combos і named lists. Backup не змінює seeded combo data.

### Persistence / system message area

Persistence / system message area показує стан збереження settings.

Приклади:

- settings збережені;
- settings застосовані тільки в session-only режимі;
- localStorage недоступний;
- persistence save завершився recoverable помилкою.

`UI-CMP-030 Error State` використовується для recoverable persistence errors або пояснення session-only limitation.

### Navigation / return action

Navigation / return action дозволяє вийти зі Settings після застосування або перегляду settings.

Повернення відбувається до:

- попередньої робочої surface, якщо вона відома і валідна;
- `UI-PAGE-003 Catalog`, якщо previous surface відсутня або stale.

## Контракти компонентів

### UI-CMP-003 Language Switcher

Детальна специфікація: [UI-CMP-003 Language Switcher](./UI-CMP-003.md).

Вхідні дані:

- active language: `EN` або `UA`;
- available languages;
- disabled state під час `saving`;
- optional validation message.

Вихідні події:

- змінити selected language value.

Межі відповідальності:

- не вирішує browser locale fallback;
- не зберігає language напряму;
- не змінює active/default game або display mode.

### UI-CMP-004 Display Mode Switcher

Детальна специфікація: [UI-CMP-004 Display Mode Switcher](./UI-CMP-004.md).

Вхідні дані:

- active notation display mode: `FGC`, `PlayStation` або `Xbox`;
- available display modes;
- disabled state під час `saving`;
- optional validation message.

Вихідні події:

- змінити selected notation display mode value.

Межі відповідальності:

- не перераховує notation самостійно;
- не змінює source of truth combo data;
- не пише `cachedNotation`.

### UI-CMP-037 Notation Legend Table

Детальна специфікація: [UI-CMP-037 Notation Legend Table](./UI-CMP-037.md).

Вхідні дані:

- legend rows для `FGC`, `PlayStation` і `Xbox`;
- UI-owned SVG icon descriptors для display mode, attack marker і modifier examples;
- caption або accessible name;
- compact layout state, якщо Settings form width або zoom потребує stacked rows.

Вихідні події:

- немає.

Межі відповідальності:

- не вибирає notation display mode;
- не бере участі у Settings save/apply lifecycle;
- не перераховує notation самостійно;
- не змінює source of truth combo data;
- не пише `cachedNotation`.

### UI-CMP-034 Backup Collapsible Block

Вхідні дані:

- collapsed або expanded state;
- local state summary для backup;
- import/export availability;
- persistence availability;
- validation або import state;
- optional прапорець deprecated redirect для auto-expand.

Вихідні події:

- toggle backup block;
- export full backup JSON;
- open backup file picker;
- validate selected backup JSON;
- open import preview;
- підтвердити replace local state backup-даними;
- cancel import без mutation;
- close backup dialogs.

Межі відповідальності:

- не є окремою route-level page;
- не змінює seeded combo data;
- не замінює local state без explicit replace confirmation;
- не змінює `game`, `language` або `notation display mode` через backup controls напряму;
- не відкриває `UI-PAGE-007 Backup Management`.

### UI-CMP-027 Export Dialog

Вхідні дані:

- backup generation state;
- local state summary;
- export availability;
- optional error message.

Вихідні події:

- confirm export;
- cancel export;
- close dialog.

Межі відповідальності:

- не читає seeded data напряму;
- не виконує import;
- не змінює local state.

### UI-CMP-028 Import Preview Dialog

Вхідні дані:

- parsed backup summary;
- validation result;
- replace impact summary;
- import busy state.

Вихідні події:

- confirm replace;
- cancel import;
- close dialog;
- retry file selection після invalid backup.

Межі відповідальності:

- не виконує replace без explicit confirmation;
- не приховує validation errors;
- не змінює seeded combo data.

### Page-level settings form

Вхідні дані:

- current app-level settings;
- persistence availability;
- previous surface або return target;
- save state;
- validation state для selected values.

Вихідні події:

- apply selected settings to app-level state;
- persist settings to local browser settings;
- apply session-only settings, якщо persistence недоступна;
- return to previous surface;
- return to `UI-PAGE-003 Catalog`.

Межі відповідальності:

- не виконує backup flow напряму; backup flow належить `UI-CMP-034`;
- не рендерить або не обробляє `UI-CMP-002 Game Switcher`;
- не змінює seeded або custom combo content;
- не керує controller command mapping;
- не рендерить робочі controls catalog, lists або builder.

## Мапа станів

### `ready`

Settings завантажені з app-level state, форма показує current values.

Очікуваний UI:

- language і display mode controls видимі;
- save/apply action відображає clean або no-op state;
- persistence warnings приховані, якщо немає активної проблеми.

### `editing`

Користувач змінив один або кілька settings values.

Очікуваний UI:

- changed values показані у формі;
- apply/save action доступний;
- return action не має губити зміни без зрозумілої поведінки.

### `saving`

App застосовує settings і намагається зберегти їх у local browser settings.

Очікуваний UI:

- language/display mode controls можуть бути disabled;
- save/apply action показує busy state;
- повторне збереження недоступне до завершення operation.

### `sessionOnly`

Persistence недоступна, але settings застосовані в поточній сесії.

Очікуваний UI:

- показано non-blocking session-only message;
- користувач може продовжити роботу;
- settings можуть бути втрачені після reload.

### `saveError`

Settings не вдалося зберегти permanent storage.

Очікуваний UI:

- `UI-CMP-030 Error State` або system message пояснює recoverable проблему;
- selected values не губляться;
- користувач може повторити save або продовжити session-only, якщо app це дозволяє.

### `saved`

Settings застосовані й збережені або прийняті як session-only.

Очікуваний UI:

- форма показує актуальні applied values;
- save/apply action повертається в clean state;
- active surfaces отримують оновлені settings через App Shell.

### `returningToPreviousSurface`

Користувач завершує роботу зі Settings і повертається до робочої surface.

Очікуваний UI:

- якщо previous surface валідна, app повертає користувача туди;
- якщо previous surface stale або відсутня, app відкриває `UI-PAGE-003 Catalog`;
- unsaved changes мають бути застосовані, відхилені або пояснені перед return.

### `backupCollapsed`

Backup block згорнутий.

Очікуваний UI:

- видимий compact header або trigger для `UI-CMP-034`;
- export/import controls не є active focus targets;
- користувач може розгорнути block mouse, touch або keyboard input.

### `backupExpanded`

Backup block відкритий користувачем або автоматично після deprecated redirect із `UI-PAGE-007 Backup Management`.

Очікуваний UI:

- показані export і import actions;
- коротко пояснено, що backup містить local settings, custom combos і named lists;
- focus після deprecated redirect потрапляє на backup block heading або перший safe control.

### `exporting`

App формує full backup JSON і запускає browser download.

Очікуваний UI:

- export action показує busy або pending state;
- повторний export недоступний до завершення operation;
- local state не змінюється.

### `importFilePicker`

Користувач обирає backup JSON для import.

Очікуваний UI:

- file picker відкривається з backup block;
- cancel повертає користувача до `backupExpanded`;
- жодна mutation не виконується до validation і confirmation.

### `importValidating`

App перевіряє backup schema і compatibility.

Очікуваний UI:

- import action або preview dialog показує busy state;
- користувач не може підтвердити replace до завершення validation;
- validation errors готуються для readable display.

### `importPreview`

Backup валідний і показаний preview майбутньої заміни.

Очікуваний UI:

- `UI-CMP-028 Import Preview Dialog` показує кількість settings, custom combos і named lists;
- replace action чітко позначений як destructive для local state;
- cancel закриває dialog без змін local state.

### `replaceConfirm`

Користувач підтверджує повну заміну local state backup-даними.

Очікуваний UI:

- confirmation action недвозначний;
- import busy state блокує повторне підтвердження;
- seeded combo data не змінюється.

### `importInvalid`

Обраний backup файл невалідний або несумісний.

Очікуваний UI:

- `UI-CMP-030 Error State` або inline message показує validation errors;
- користувач може обрати інший файл;
- local state не змінюється.

### `importComplete`

Local state замінено backup-даними після explicit confirmation.

Очікуваний UI:

- показано success/system message;
- app-level settings, custom combos і named lists оновлені з backup;
- active surface після import має перейти до safe state або лишитися Settings, якщо це підтримано router behavior.

## Навігація і потік даних

### Вхід у Settings

1. Користувач відкриває `UI-CMP-033 Top Bar Dropdown Menu`.
2. Користувач обирає Settings action.
3. `UI-CMP-001 Global Top Bar` емітить `requestNavigateSettings`.
4. `UI-PAGE-001 App Shell` відкриває `UI-PAGE-008 Settings`.
5. Settings читає current app-level settings.

### Deprecated перенаправлення із UI-PAGE-007

1. Користувач відкриває старий route або deep link для `UI-PAGE-007 Backup Management`.
2. `UI-PAGE-001 App Shell` не рендерить окрему backup page.
3. App Shell відкриває `UI-PAGE-008 Settings`.
4. Settings отримує прапорець auto-expand для `UI-CMP-034 Backup Collapsible Block`.
5. Backup block переходить у `backupExpanded`.

### Застосування settings

1. Користувач змінює language або notation display mode.
2. Settings переходить у `editing`.
3. Користувач застосовує зміни.
4. Settings передає selected values в app-level settings state.
5. App-level state застосовує values до active app state.
6. App намагається зберегти values у local browser settings.
7. Якщо persistence недоступна, app застосовує session-only equivalent.

```text
UI-PAGE-008 Settings
  -> selected language / notation display mode
  -> App-level settings state
  -> local browser settings або session-only state
  -> UI-PAGE-001 App Shell
  -> Active surface
```

### Backup export/import

Export flow:

1. Користувач розгортає `UI-CMP-034 Backup Collapsible Block`.
2. Користувач обирає export.
3. Settings формує full backup JSON для local settings і `games: Record<GameId, unknown>`.
4. Browser download запускається без зміни local state.

Import flow:

1. Користувач розгортає `UI-CMP-034 Backup Collapsible Block`.
2. Користувач обирає backup JSON.
3. App валідує schema і compatibility.
4. `UI-CMP-028 Import Preview Dialog` показує preview.
5. Користувач підтверджує replace.
6. Local settings і known game slices замінюються backup-даними після envelope validation і per-game slice validation.
7. Seeded combo data не змінюється.

### Deep link auto-config context

Settings може показувати values, які з'явилися через valid route-prefixed deep link auto-config:

- URL-derived `gameId`;
- default `notation display mode = FGC`.

Settings може редагувати `notation display mode` після auto-config. URL-derived game редагується через `UI-CMP-002 Game Switcher` у breadcrumbs. Settings не бере участі в самому auto-config flow. Він належить `UI-PAGE-001 App Shell`.

### Повернення зі Settings

1. Користувач обирає return action або navigation action.
2. Якщо settings мають unsaved changes, page-level flow має застосувати, відхилити або пояснити changes.
3. Якщо previous surface валідна, app повертається до неї.
4. Якщо previous surface відсутня або stale, app відкриває `UI-PAGE-003 Catalog`.

## Доступність і поведінка вводу

- [`UI-CMP-003`](./UI-CMP-003.md) і [`UI-CMP-004`](./UI-CMP-004.md) мають visible label або accessible name.
- [`UI-CMP-037`](./UI-CMP-037.md) має caption або accessible name, readable row/column relationships і non-interactive SVG icons.
- Keyboard order іде від page heading до controls, save/apply action і return action.
- `focus-visible` має бути помітним на settings controls, save/apply action, message actions і return action.
- Busy state під час `saving` має бути оголошений assistive technologies.
- Session-only і save error messages мають бути зрозумілими без кольору як єдиного сигналу.
- Settings action у Top Bar dropdown не має відкривати inline language/display mode controls або notation legend у Top Bar.
- Game switcher лишається global breadcrumbs control, доступним у Shell, але не є частиною Settings form focus order.
- Backup block trigger має keyboard focus, readable label і expanded/collapsed state.
- Export і import dialogs мають керований focus і повертають focus до backup block trigger після закриття.
- Import preview має пояснювати replace effect без покладання тільки на колір.
- Повернення зі Settings має повертати focus до safe surface control або page heading target.

## Критерії приймання

- `UI-PAGE-008` є route-level page, не modal і не dropdown panel.
- Settings рендерить [`UI-CMP-003`](./UI-CMP-003.md) і [`UI-CMP-004`](./UI-CMP-004.md) як page-owned controls.
- Settings рендерить [`UI-CMP-037`](./UI-CMP-037.md) поруч із display mode selector як read-only companion table.
- Settings не рендерить page-owned `UI-CMP-002 Game Switcher`.
- Settings рендерить `UI-CMP-034 Backup Collapsible Block` як page-owned backup controls.
- `UI-CMP-001 Global Top Bar` рендерить `UI-CMP-002` у breadcrumbs і не рендерить language/display mode switchers або [`UI-CMP-037`](./UI-CMP-037.md).
- Користувач може змінити `language` і `notation display mode` у Settings.
- Користувач може змінити installed `game` через `UI-CMP-002` у breadcrumbs.
- Settings застосовує changes до app-level state.
- Settings намагається зберегти changes у local browser settings.
- Якщо persistence недоступна, Settings показує session-only state і дозволяє продовжити роботу.
- `notation display mode` змінює тільки rendering і не змінює `movePath`, seeded data або `cachedNotation`.
- Settings може редагувати `notation display mode`, отриманий через deep link auto-config, але не виконує auto-config самостійно.
- Backup block згорнутий за замовчуванням.
- Deprecated route/deep link `UI-PAGE-007 Backup Management` відкриває Settings із розгорнутим backup block.
- Export створює full backup JSON без зміни local state.
- Import replace змінює local settings і known game slices тільки після explicit confirmation.
- Import не змінює seeded combo data.
- Return action веде до previous surface або `UI-PAGE-003 Catalog` fallback.

## Тестові сценарії

- Top Bar dropdown action відкриває `UI-PAGE-008 Settings`.
- Settings показує current language і notation display mode.
- Settings показує notation legend table із UI-owned SVG marker examples.
- `/settings` не має page-owned Game Switcher.
- Game Switcher у breadcrumbs на `/settings` із вибором `MK1` лишає route `/settings` і оновлює active/default game state.
- Зміна language на `UA` оновлює UI і localized content.
- Зміна display mode на `Xbox` змінює rendering notation без зміни `movePath`.
- Save success переводить page у `saved`.
- localStorage unavailable переводить page у `sessionOnly` і не блокує роботу.
- Save error показує recoverable message і не губить selected values.
- Settings після deep link auto-config показує `FGC`, а URL-derived game видно в breadcrumbs game switcher.
- Return action повертає до previous surface.
- Якщо previous surface stale, return action відкриває `UI-PAGE-003 Catalog`.
- Top Bar рендерить Game Switcher у breadcrumbs, але не рендерить Language Switcher, Display Mode Switcher або Notation Legend Table.
- Settings показує backup block згорнутим за замовчуванням.
- Deprecated `UI-PAGE-007` route відкриває Settings із розгорнутим backup block.
- Export action формує full backup JSON і не змінює local state.
- Import invalid backup показує validation error і не змінює local state.
- Import valid backup показує preview перед replace.
- Cancel import закриває preview без змін local state.
- Confirm replace замінює local settings і game slices backup-даними.

## Відкриті уточнення

- Точний вигляд apply/save interaction буде визначено під час UI реалізації.
- Точний fallback для unsaved changes під час return буде узгоджено з app navigation behavior.
- Точний persistence error copy буде узгоджено зі shared system message styles.
- Точний вигляд backup block trigger і destructive confirmation copy буде узгоджено зі shared system message styles.

## Канонічний Responsive і Controller-only Contract

Ця surface використовує `UiResponsiveMode = mobile | tablet | desktop` і prepared focus graph із [UI.md](../UI.md). Наведені вище responsive деталі трактуються через цей канонічний контракт.

- `mobile` використовує vertical-first navigation, edge-safe overlays і controller targets не менші за `44×44px`;
- `tablet` використовує hybrid composition і explicit directional neighbors для portrait/landscape;
- `desktop` використовує повну workstation composition і spatial row/column navigation;
- `confirm`, `back`, overlay focus recovery, global menu/help і responsive fallback працюють без synthetic click або keyboard events;
- native backup file picker є єдиним external-input винятком; усі внутрішні actions мають бути controller-only.
