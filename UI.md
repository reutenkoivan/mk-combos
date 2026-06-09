# UI мапа екранів, компонентів і станів

Цей документ є мапою основних екранів, панелей, overlay, компонентів і станів інтерфейсу `mk-combos`.
На відміну від [UX.md](./UX.md), який описує користувацькі сценарії, `UI.md` фіксує структуру застосунку як набір UI surfaces зі стабільними кодами для посилань.

Документ не є pixel-level дизайн-специфікацією. Його мета - допомогти реалізовувати `apps/web`, `@mk-combos/ui`, `@mk-combos/combo-builder` і controller navigation узгоджено.

## Коди посилань

Коди є стабільними documentation/API identifiers. Назва або деталізація UI entity може змінюватися, але код не можна повторно використати для іншої сутності.

- `UI-PAGE-###`: route-level або screen-level UI surface.
- `UI-CMP-###`: component, panel, dialog, toolbar, list, renderer, marker або shared system state block.
- Формат посилання в документах: `UI-PAGE-003 Catalog` або `UI-CMP-012 Filters Panel`.
- Deprecated UI entity зберігає код із приміткою `Deprecated`; код не reassigned.
- State tokens лишаються lowercase, наприклад `ready`, `loadingSurface`, `staleCustomCombo`.

## Реєстр кодів

### Pages

- [`UI-PAGE-001`](./ui/UI-PAGE-001.md) App Shell.
- [`UI-PAGE-002`](./ui/UI-PAGE-002.md) First-Launch Setup.
- `UI-PAGE-003` Catalog.
- `UI-PAGE-004` Combo Detail.
- `UI-PAGE-005` Named Lists.
- `UI-PAGE-006` Custom Combo Builder.
- `UI-PAGE-007` Backup Management.
- `UI-PAGE-008` Settings.

### Components

- [`UI-CMP-001`](./ui/UI-CMP-001.md) Global Top Bar.
- `UI-CMP-002` Game Switcher.
- `UI-CMP-003` Language Switcher.
- `UI-CMP-004` Display Mode Switcher.
- [`UI-CMP-005`](./ui/UI-CMP-005.md) Controller Hint Strip.
- `UI-CMP-006` First-Launch Setup Form.
- `UI-CMP-007` Character Picker.
- `UI-CMP-008` Variation Picker.
- `UI-CMP-009` Kameo Picker.
- `UI-CMP-010` Combo List.
- `UI-CMP-011` Combo Card.
- `UI-CMP-012` Filters Panel.
- `UI-CMP-013` Filter Control Group.
- `UI-CMP-014` Combo Detail Header.
- `UI-CMP-015` Notation Renderer.
- `UI-CMP-016` Move Path Viewer.
- `UI-CMP-017` Combo Metadata Grid.
- `UI-CMP-018` Combo Actions Menu.
- `UI-CMP-019` Named List Index.
- `UI-CMP-020` Named List Detail.
- `UI-CMP-021` Add-To-List Dialog.
- `UI-CMP-022` List Edit Dialog.
- `UI-CMP-023` Builder Context Setup.
- `UI-CMP-024` Move Picker.
- `UI-CMP-025` Combo Path Preview.
- `UI-CMP-026` Builder Action Bar.
- `UI-CMP-027` Export Dialog.
- `UI-CMP-028` Import Preview Dialog.
- `UI-CMP-029` Empty State.
- `UI-CMP-030` Error State.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-032` Breadcrumbs.
- `UI-CMP-033` Top Bar Dropdown Menu.

## Глобальна структура

Застосунок складається з таких UI surfaces:

- `UI-PAGE-001` App Shell і навігаційна рамка.
- `UI-PAGE-002` First-Launch Setup.
- `UI-PAGE-008` Settings.
- `UI-PAGE-003` Catalog.
- `UI-CMP-012` Filters Panel.
- `UI-PAGE-004` Combo Detail.
- `UI-PAGE-005` Named Lists.
- `UI-PAGE-006` Custom Combo Builder.
- `UI-PAGE-007` Backup Management.
- `UI-CMP-029`, `UI-CMP-030`, `UI-CMP-031` System states: loading, empty, error, stale/invalid.

Глобальний flow після першого налаштування:

```text
UI-PAGE-001 App Shell
  -> UI-CMP-001 Global Top Bar
     -> UI-CMP-005 Controller Hint Strip
     -> UI-CMP-032 Breadcrumbs
     -> UI-CMP-033 Top Bar Dropdown Menu
  -> UI-PAGE-008 Settings
     -> UI-CMP-002 Game Switcher
     -> UI-CMP-003 Language Switcher
     -> UI-CMP-004 Display Mode Switcher
  -> UI-PAGE-003 Catalog
     -> UI-CMP-007 Character Picker
     -> UI-CMP-008 Variation Picker або UI-CMP-009 Kameo Picker
     -> UI-CMP-010 Combo List
     -> UI-PAGE-004 Combo Detail
  -> UI-CMP-012 Filters Panel
  -> UI-PAGE-005 Named Lists
  -> UI-PAGE-006 Custom Combo Builder
  -> UI-PAGE-007 Backup Management
```

## UI-PAGE-001: App Shell

Детальна специфікація: [ui/UI-PAGE-001.md](./ui/UI-PAGE-001.md).

### Призначення

App Shell є постійною рамкою застосунку, яка тримає глобальну навігацію, поточний контекст, слот активної сторінки й системні шари.

### Умови входу

- Користувач уже завершив `UI-PAGE-002 First-Launch Setup`.
- Користувач відкрив root URL або deep link з валідним локальним контекстом.
- First-launch gate не блокує поточний маршрут.

### Основні стани

- `ready`: shell показує активний surface і навігаційні controls.
- `firstLaunchBlocked`: shell не дає перейти до робочих surfaces, поки setup не підтверджено.
- `deepLinkResolved`: shell відкриває surface, який відповідає URL.
- `deepLinkAutoConfigured`: shell відкриває valid deep link без setup, застосувавши URL-derived `game`, URL-derived `language` і `FGC`.
- `settingsUnavailable`: local browser settings недоступні або працюють session-only.
- `controllerConnected`: `UI-CMP-001 Global Top Bar` показує green controller indicator.
- `controllerDisconnected`: nested indicator показує yellow disconnect state протягом 1 хв або прихований після завершення grace window.

### Компоненти

- `UI-CMP-001` Global Top Bar.

### Важливі дії

- Відкрити `UI-PAGE-003 Catalog`, `UI-PAGE-005 Named Lists`, `UI-PAGE-006 Custom Combo Builder`, `UI-PAGE-007 Backup Management` або `UI-PAGE-008 Settings`.
- Приймати semantic controller commands і передавати їх активному surface.

### Пов'язані UX сценарії

- `US-001`, `US-008`, `US-009`, `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## UI-PAGE-002: First-Launch Setup

Детальна специфікація: [ui/UI-PAGE-002.md](./ui/UI-PAGE-002.md).

### Призначення

First-Launch Setup є обов'язковим стартовим станом для root first launch у новому браузері. Він коротко пояснює можливості застосунку й збирає initial settings перед доступом до catalog.

`UI-PAGE-002` встановлює початкові `game`, `language` і `notation display mode`. Після завершення first launch подальше ручне редагування цих settings відбувається через `UI-PAGE-008 Settings`.

Valid deep link bypasses `UI-PAGE-002`: app вираховує `game` і `language` з URL, ставить `notation display mode = FGC`, створює first-launch completion marker і одразу відкриває target route без confirmation.

### Умови входу

- Немає local settings або first-launch completion marker.
- Користувач відкрив root URL без попереднього контексту.
- Застосунок має доступ до seeded combo data.

### Основні стани

- `initial`: показані preselected defaults.
- `editing`: користувач змінює language, game або display mode.
- `confirmable`: усі обов'язкові choices мають значення.
- `saving`: app зберігає вибір у local browser settings.
- `sessionOnly`: localStorage недоступний, settings діють тільки в поточній сесії.
- `saveError`: settings або completion marker не вдалося зберегти.
- `complete`: setup підтверджено, користувача переведено до `UI-PAGE-003 Catalog`.
- `deepLinkBypassed`: valid deep link пропускає setup і відкриває target route з URL-derived settings.

### Компоненти

- `UI-CMP-006` First-Launch Setup Form.
- `UI-CMP-002` Game Switcher.
- `UI-CMP-003` Language Switcher.
- `UI-CMP-004` Display Mode Switcher.
- `UI-CMP-030` Error State.

### Важливі дії

- Прочитати короткий опис можливостей: `catalog`, filters, `combo detail`, `named lists`, `custom combo builder`, `controller hints`, `import/export`.
- Вибрати language `EN/UA`.
- Вибрати game `MKXL/MK1`.
- Вибрати display mode `FGC/PlayStation/Xbox`.
- Підтвердити setup.
- Побачити non-blocking повідомлення про session-only settings, якщо localStorage недоступний.
- Не показувати setup для valid deep link із URL-derived `game` і `language`; у цьому flow використовується `FGC` без confirmation.

### Пов'язані UX сценарії

- `US-001`, `US-002`, `US-008`, `US-009`, `US-021`, `US-023`

## UI-PAGE-003: Catalog

### Призначення

Catalog дає користувачу працювати в межах active game, пройти шлях `Character -> Combo list` і звузити контекст до variation або kameo, якщо це потрібно для гри.

### Умови входу

- `UI-PAGE-002 First-Launch Setup` завершено або deep link успішно відновив контекст.
- Seeded combo data завантажені та валідні для показу.
- Active game, language і notation display mode уже застосовані через `UI-PAGE-002 First-Launch Setup` або `UI-PAGE-008 Settings`.

### Основні стани

- `gameContextReady`: catalog має активну game з app-level settings.
- `characterSelection`: користувач обирає персонажа активної гри.
- `variationSelection`: для `MKXL` користувач обирає variation.
- `kameoSelection`: для `MK1` користувач обирає kameo.
- `comboList`: показаний список combo для активного контексту.
- `filteredList`: список звужено через filters або search.
- `noCharacterSelected`: game обрана, але персонаж ще ні.
- `noCombos`: контекст валідний, але combo не знайдені.
- `loadingData`: seeded data ще готуються до показу.

### Компоненти

- `UI-CMP-007` Character Picker.
- `UI-CMP-008` Variation Picker.
- `UI-CMP-009` Kameo Picker.
- `UI-CMP-010` Combo List.
- `UI-CMP-011` Combo Card.
- `UI-CMP-012` Filters Panel.
- `UI-CMP-013` Filter Control Group.
- `UI-CMP-021` Add-To-List Dialog.
- `UI-CMP-029` Empty State.
- `UI-CMP-030` Error State.

### Важливі дії

- Вибрати character.
- Вибрати variation для `MKXL`.
- Вибрати kameo для `MK1`.
- Відкрити `UI-CMP-012 Filters Panel`.
- Відкрити `UI-PAGE-004 Combo Detail`.
- Додати seeded combo у named list через `UI-CMP-021 Add-To-List Dialog`.
- Дублювати seeded combo у custom combo.

### Пов'язані UX сценарії

- `US-002`, `US-003`, `US-004`, `US-005`, `US-006`, `US-007`, `US-012`, `US-014`, `US-019`, `US-023`, `US-024`

## UI-CMP-012: Filters Panel

### Призначення

Filters Panel допомагає швидко звузити combo list за metadata, notation, notes і доменними параметрами.

### Умови входу

- Активний catalog context існує.
- Користувач відкрив filters через control у shell, catalog toolbar або controller command `openFilters`.

### Основні стани

- `closed`: panel прихована, active filters можуть бути показані як summary.
- `open`: panel доступна для редагування.
- `dirty`: користувач змінив filters, але результат ще не застосовано, якщо surface використовує explicit apply.
- `applied`: combo list оновлено відповідно до filters.
- `noResults`: жодне combo не відповідає filters.
- `resetAvailable`: є active filters, які можна очистити.

### Компоненти

- `UI-CMP-013` Filter Control Group.
- `UI-CMP-007` Character Picker.
- `UI-CMP-008` Variation Picker.
- `UI-CMP-009` Kameo Picker.
- `UI-CMP-029` Empty State.

### Важливі дії

- Змінити character, variation або kameo filter у межах active game.
- Змінити starter, position, meter, damage, difficulty або route type.
- Вибрати tags.
- Виконати text search по notation, notes і metadata.
- Apply або clear filters.
- Закрити panel без втрати вже applied filters.

### Пов'язані UX сценарії

- `US-002`, `US-003`, `US-004`, `US-005`, `US-006`, `US-019`

## UI-PAGE-004: Combo Detail

### Призначення

Combo Detail показує повну інформацію про seeded або custom combo і дає виконати contextual actions.

### Умови входу

- Користувач відкрив combo із `UI-PAGE-003 Catalog`, filtered list, `UI-PAGE-005 Named Lists` або deep link.
- Combo id існує у seeded data або local custom combos.

### Основні стани

- `seededDetail`: показане read-only seeded combo.
- `customDetail`: показане local custom combo.
- `invalidCustomDetail`: custom combo позначене як stale або invalid після graph update.
- `notFound`: combo id не знайдено.
- `sourceExpanded`: source, gameVersion або notes показані розгорнуто.
- `actionsOpen`: відкрито contextual actions menu.

### Компоненти

- `UI-CMP-014` Combo Detail Header.
- `UI-CMP-015` Notation Renderer.
- `UI-CMP-016` Move Path Viewer.
- `UI-CMP-017` Combo Metadata Grid.
- `UI-CMP-018` Combo Actions Menu.
- `UI-CMP-021` Add-To-List Dialog.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-030` Error State.

### Важливі дії

- Переглянути canonical FGC notation.
- Переглянути mapped notation для `FGC`, `PlayStation` або `Xbox`.
- Переглянути move path, damage, meter, position, starter, route type, difficulty і tags.
- Переглянути localized notes, source і gameVersion.
- Додати combo у named list.
- Дублювати seeded combo у custom combo.
- Редагувати custom combo через builder.
- Закрити detail view і повернутися до попереднього list context.

### Пов'язані UX сценарії

- `US-007`, `US-009`, `US-012`, `US-014`, `US-015`, `US-016`, `US-019`, `US-023`, `US-024`

## UI-PAGE-005: Named Lists

### Призначення

Named Lists дають користувачу локально організовувати seeded і custom combos у власні тренувальні або тематичні списки.

### Умови входу

- `UI-PAGE-002 First-Launch Setup` завершено.
- Local state доступний хоча б у session-only режимі.
- Користувач відкрив lists surface або add-to-list dialog з combo context.

### Основні стани

- `emptyLists`: користувач ще не створив жодного списку.
- `listIndex`: показаний перелік named lists.
- `listDetail`: відкритий конкретний список із combo items.
- `createDialog`: користувач створює новий list.
- `renameDialog`: користувач перейменовує list.
- `deleteConfirm`: користувач підтверджує видалення list.
- `reordering`: користувач змінює порядок combo всередині list.
- `containsInvalidCombo`: list містить stale або invalid custom combo.

### Компоненти

- `UI-CMP-019` Named List Index.
- `UI-CMP-020` Named List Detail.
- `UI-CMP-021` Add-To-List Dialog.
- `UI-CMP-022` List Edit Dialog.
- `UI-CMP-011` Combo Card.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-029` Empty State.
- `UI-CMP-030` Error State.

### Важливі дії

- Створити named list.
- Перейменувати named list.
- Видалити named list.
- Додати seeded або custom combo у list.
- Видалити combo зі list.
- Змінити порядок combo всередині list.
- Відкрити `UI-PAGE-004 Combo Detail` зі list.

### Пов'язані UX сценарії

- `US-010`, `US-011`, `US-012`, `US-013`, `US-014`, `US-015`, `US-016`, `US-019`, `US-024`

## UI-PAGE-006: Custom Combo Builder

### Призначення

Custom Combo Builder дає користувачу створити або відредагувати local custom combo через guided flow, у якому наступний move обирається тільки з valid transitions.

### Умови входу

- Користувач відкрив builder з нуля, з duplicate seeded combo або з edit custom combo action.
- Активний контекст містить game, character і variation або kameo, якщо вони потрібні.
- `@mk-combos/combo-builder` може отримати composed move graph.

### Основні стани

- `contextSetup`: користувач задає game, character, variation/kameo і стартовий контекст.
- `ready`: builder має graph input і показує valid стартові moves.
- `selectingMove`: користувач обирає наступний valid move.
- `pathPreview`: показаний поточний movePath і cached notation.
- `noValidNextMoves`: поточний path валідний, але продовження немає.
- `invalidInitialPath`: combo, яке редагують, не проходить актуальну graph validation.
- `saving`: app отримує `movePath` і `cachedNotation` та пише custom combo у local state.
- `cancelConfirm`: користувач виходить без збереження після змін.
- `complete`: combo створене або оновлене.

### Компоненти

- `UI-CMP-023` Builder Context Setup.
- `UI-CMP-024` Move Picker.
- `UI-CMP-025` Combo Path Preview.
- `UI-CMP-026` Builder Action Bar.
- `UI-CMP-015` Notation Renderer.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-030` Error State.

### Важливі дії

- Вибрати стартовий context: meter, position, stance, player state, opponent state.
- Вибрати valid move.
- Undo останній move.
- Перемикати move groups.
- Переглянути combo path preview.
- Завершити combo.
- Скасувати builder flow.
- Додати створене combo у named list.

### Пов'язані UX сценарії

- `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-024`

## UI-PAGE-007: Backup Management

### Призначення

Backup Management керує full backup локальних settings, custom combos і named lists без backend або remote sync.

### Умови входу

- Користувач відкрив backup actions із app shell або settings/actions menu.
- Local state schema доступна для validation.

### Основні стани

- `exportReady`: app може сформувати backup JSON.
- `exporting`: app формує файл і запускає browser download.
- `importFilePicker`: користувач обирає JSON-файл.
- `importValidating`: app перевіряє backup schema.
- `importPreview`: показано кількість settings, custom combos і lists, які будуть імпортовані.
- `replaceConfirm`: користувач підтверджує повну заміну поточного local state.
- `importInvalid`: файл невалідний або несумісний.
- `importComplete`: local state замінено backup-даними.

### Компоненти

- `UI-CMP-027` Export Dialog.
- `UI-CMP-028` Import Preview Dialog.
- `UI-CMP-030` Error State.

### Важливі дії

- Export full backup JSON.
- Обрати backup JSON для import.
- Переглянути import preview.
- Підтвердити replace.
- Скасувати import без змін local state.
- Побачити validation errors для невалідного backup.

### Пов'язані UX сценарії

- `US-017`, `US-018`, `US-024`

## UI-PAGE-008: Settings

### Призначення

Settings є єдиною сторінкою ручної зміни `game`, `language` і `notation display mode` після завершення first-launch setup.

### Умови входу

- `UI-PAGE-002 First-Launch Setup` завершено.
- Користувач відкрив Settings через navigation action з `UI-PAGE-001 App Shell`.
- Local settings доступні для читання, а persistence може бути permanent або session-only.

### Основні стани

- `ready`: поточні settings завантажені й доступні для редагування.
- `editing`: користувач змінює `game`, `language` або `notation display mode`.
- `saving`: app застосовує settings і намагається зберегти їх у local browser settings.
- `sessionOnly`: settings застосовані тільки для поточної сесії.
- `saveError`: settings застосовані або відхилені з recoverable помилкою persistence.

### Компоненти

- `UI-CMP-002` Game Switcher.
- `UI-CMP-003` Language Switcher.
- `UI-CMP-004` Display Mode Switcher.
- `UI-CMP-030` Error State.

### Важливі дії

- Змінити default game для catalog і builder entry.
- Змінити language для UI і localized content.
- Змінити notation display mode для rendering notation.
- Застосувати settings до active app state.
- Повернутися до попередньої робочої сторінки або catalog.

### Пов'язані UX сценарії

- `US-002`, `US-008`, `US-009`

## UI-CMP-001: Global Top Bar

Детальна специфікація: [ui/UI-CMP-001.md](./ui/UI-CMP-001.md).

### Призначення

Global Top Bar є прямим компонентом `UI-PAGE-001 App Shell`: він показує active game label `MKXL` або `MK1`, controller indicator area, breadcrumbs і right-pinned dropdown menu.

`UI-CMP-001` має navigation entry до `UI-PAGE-008 Settings`, але не містить `UI-CMP-002 Game Switcher`, `UI-CMP-003 Language Switcher` або `UI-CMP-004 Display Mode Switcher`.

### Умови входу

- `UI-PAGE-001 App Shell` рендерить верхню панель.
- App Shell передав active surface code, active game label, breadcrumbs, navigation availability і controller state.
- First-launch gate або active route визначили доступність navigation actions.

### Основні стани

- `ready`: game label, breadcrumbs, dropdown trigger і utility actions доступні.
- `firstLaunchLimited`: navigation обмежена через first-launch gate.
- `surfaceNavigationActive`: користувач взаємодіє з navigation або route змінюється.
- `settingsEntryAvailable`: settings action доступний і веде до `UI-PAGE-008 Settings`.
- `gameVersionVisible`: показано `MKXL` або `MK1`.
- `breadcrumbsReady`: breadcrumbs відповідають active surface.
- `controllerIndicatorHidden`: `UI-CMP-005` не відображається.
- `controllerIndicatorConnected`: `UI-CMP-005` показує green connected indicator.
- `controllerIndicatorDisconnectGrace`: `UI-CMP-005` показує yellow disconnected indicator протягом 1 хв.
- `hintPanelOpen`: hint panel відкритий через interaction з indicator.
- `topBarMenuClosed`: right-pinned dropdown menu закритий.
- `topBarMenuOpen`: right-pinned dropdown menu відкритий.

### Компоненти

- `UI-CMP-005` Controller Hint Strip. Власник: `UI-CMP-001 Global Top Bar`.
- `UI-CMP-032` Breadcrumbs.
- `UI-CMP-033` Top Bar Dropdown Menu.

### Важливі дії

- Показати active game label `MKXL` або `MK1`.
- Показати breadcrumbs для active surface і перейти до `UI-PAGE-003 Catalog` через navigable breadcrumb item.
- Відкрити right-pinned dropdown menu з actions до `UI-PAGE-005 Named Lists`, `UI-PAGE-006 Custom Combo Builder`, `UI-PAGE-007 Backup Management` і `UI-PAGE-008 Settings`.
- Відкрити, закрити або toggle hint panel у `UI-CMP-005`.
- Закрити dropdown menu через `Escape` або після вибору action.

### Пов'язані UX сценарії

- `US-019`, `US-021`, `US-022`, `US-023`, `US-024`

## UI-CMP-032: Breadcrumbs

### Призначення

Breadcrumbs показують contextual navigation trail у `UI-CMP-001 Global Top Bar` після game label і controller indicator area.

Catalog breadcrumb є primary Top Bar access до `UI-PAGE-003 Catalog`.

### Умови входу

- `UI-CMP-001 Global Top Bar` отримав breadcrumbs для active surface.
- Active route має щонайменше один current item.

### Основні стани

- `breadcrumbsReady`: trail відповідає active surface.
- `breadcrumbItemNavigable`: item веде до попереднього route або selection level.
- `breadcrumbItemCurrent`: item позначає поточний route і не виконує navigation.

### Важливі дії

- Показати trail для Catalog, character, combo detail, named list, builder context або settings path.
- Перейти за navigable breadcrumb item, зокрема до `UI-PAGE-003 Catalog`.
- Позначити current item без переходу в той самий route.

### Пов'язані UX сценарії

- `US-023`, `US-024`

## UI-CMP-033: Top Bar Dropdown Menu

### Призначення

Top Bar Dropdown Menu є right-pinned menu у `UI-CMP-001 Global Top Bar` для global navigation і utility actions.

### Умови входу

- `UI-CMP-001 Global Top Bar` отримав navigation availability.
- Користувач відкрив menu trigger через click, tap, `Enter` або `Space`.

### Основні стани

- `topBarMenuClosed`: menu trigger видимий праворуч, menu surface закритий.
- `topBarMenuOpen`: menu surface відкритий і вирівняний відносно правого краю Top Bar.
- `topBarMenuActionDisabled`: action недоступний через first-launch gate або поточний context.

### Важливі дії

- Відкрити `UI-PAGE-005 Named Lists`, `UI-PAGE-006 Custom Combo Builder`, `UI-PAGE-007 Backup Management` або `UI-PAGE-008 Settings`.
- Закрити menu через `Escape`, outside click або після вибору action.
- Повернути focus до menu trigger після закриття.

### Пов'язані UX сценарії

- `US-019`, `US-023`, `US-024`

## UI-CMP-005: Controller Hint Strip

Власник: `UI-CMP-001 Global Top Bar`.

Детальна специфікація: [ui/UI-CMP-005.md](./ui/UI-CMP-005.md).

### Призначення

Controller Hint Strip показує compact controller indicator у `UI-CMP-001 Global Top Bar` і відкриває contextual hints тільки після взаємодії з indicator.

`UI-CMP-005` не позиціонується самостійно в shell layout. Він завжди рендериться всередині `UI-CMP-001 Global Top Bar`, який керує його місцем, visibility і hint panel state.

### Умови входу

- Browser Gamepad API доступний.
- Користувач підключив або відключив controller.
- `@mk-combos/controller-bridge` емітить connection state, active profile, command stream і hints.

### Основні стани

- `hiddenNoController`: controller не підключено і немає active disconnect grace window.
- `connectedIndicator`: green indicator із controller icon.
- `disconnectGraceIndicator`: yellow indicator із no-connection icon протягом 1 хв після disconnect.
- `hintPanelClosed`: indicator видимий, hint panel закритий.
- `hintPanelOpen`: contextual hints відкриті після взаємодії з indicator.

### Важливі дії

- Не відображатися, якщо controller не підключено і немає active disconnect grace window.
- Показати green indicator із controller icon, якщо controller підключено.
- Показати yellow indicator із no-connection icon протягом 1 хв після disconnect.
- Відкрити hint panel через click, tap, `Enter` або `Space` на indicator.
- Закрити hint panel через `Escape` або відповідний close action.

### Пов'язані UX сценарії

- `US-019`, `US-020`, `US-021`, `US-022`

## UI-CMP-029 / UI-CMP-030 / UI-CMP-031: System State Components

### Призначення

System state components визначають спільні UI-відповіді для loading, empty, error і stale/invalid ситуацій у різних surfaces.

### Умови входу

- Будь-який surface може перейти в system state під час завантаження, фільтрації, deep link resolution, local state validation або graph validation.

### Основні стани

- `loadingApp`: app bootstrapping або initial data preparation.
- `loadingSurface`: конкретний surface готує дані.
- `emptyCatalog`: немає combo для валідного catalog context.
- `emptyFilters`: active filters не повернули результатів.
- `emptyLists`: користувач ще не має named lists.
- `notFound`: route, combo id або local entity не знайдено.
- `recoverableError`: surface може показати retry або fallback.
- `fatalError`: app не може продовжити без reload або зміни context.
- `staleCustomCombo`: local custom combo більше не відповідає актуальному move graph.
- `invalidBackup`: import file не проходить validation.
- `sessionOnlyPersistence`: localStorage недоступний, дані не гарантуються після reload.

### Компоненти

- `UI-CMP-029` Empty State.
- `UI-CMP-030` Error State.
- `UI-CMP-031` Stale/Invalid Combo Marker.

### Важливі дії

- Retry data preparation або surface action.
- Clear filters.
- Повернутися до catalog.
- Відредагувати stale custom combo через builder.
- Скасувати import.
- Показати session-only warning без блокування основного flow.

### Пов'язані UX сценарії

- `US-001`, `US-006`, `US-016`, `US-018`, `US-022`, `US-023`, `US-024`
