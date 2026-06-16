# UI мапа екранів, компонентів і станів

Цей документ є мапою основних екранів, панелей, overlay, компонентів і станів інтерфейсу `mk-combos`.
На відміну від [UX.md](./UX.md), який описує користувацькі сценарії, `UI.md` фіксує структуру застосунку як набір UI surfaces зі стабільними кодами для посилань.

Документ не є pixel-level дизайн-специфікацією. Його мета - допомогти реалізовувати `apps/web`, `@mk-combos/ui`, `@mk-combos/combo-builder` і controller navigation узгоджено.

## Коди посилань

Коди є стабільними documentation/API identifiers. Назва або деталізація UI entity може змінюватися, але код не можна повторно використати для іншої сутності.

- `UI-PAGE-###`: route-level або screen-level UI surface.
- `UI-CMP-###`: component, panel, dialog, toolbar, list, renderer, marker або shared system state block.
- Формат посилання в документах: `UI-PAGE-003 Catalog` або `UI-CMP-012 Combo List Config Module`.
- Deprecated UI entity зберігає код із приміткою `Deprecated`; код не reassigned.
- State tokens лишаються lowercase, наприклад `ready`, `loadingSurface`, `staleCustomCombo`.

## Реєстр кодів

### Pages

- [`UI-PAGE-001`](./ui/UI-PAGE-001.md) App Shell.
- [`UI-PAGE-002`](./ui/UI-PAGE-002.md) First-Launch Setup.
- [`UI-PAGE-003`](./ui/UI-PAGE-003.md) Catalog.
  Варіанти: [`MKXL`](./ui/UI-PAGE-003-MKXL.md), [`MK1`](./ui/UI-PAGE-003-MK1.md).
- `UI-PAGE-004` Combo Detail.
- `UI-PAGE-005` Named Lists.
- [`UI-PAGE-006`](./ui/UI-PAGE-006.md) Custom Combo Builder.
- `UI-PAGE-007` Backup Management. `Deprecated`; перенаправлення до `UI-PAGE-008 Settings -> UI-CMP-034 Backup Collapsible Block`.
- [`UI-PAGE-008`](./ui/UI-PAGE-008.md) Settings.

### Components

- [`UI-CMP-001`](./ui/UI-CMP-001.md) Global Top Bar.
- `UI-CMP-002` Game Switcher.
- `UI-CMP-003` Language Switcher.
- `UI-CMP-004` Display Mode Switcher.
- [`UI-CMP-005`](./ui/UI-CMP-005.md) Controller Hint Strip.
- `UI-CMP-006` First-Launch Setup Form.
- [`UI-CMP-007`](./ui/UI-CMP-007.md) Character Picker.
- [`UI-CMP-008`](./ui/UI-CMP-008.md) Variation Picker.
- [`UI-CMP-009`](./ui/UI-CMP-009.md) Kameo Picker.
- [`UI-CMP-010`](./ui/UI-CMP-010.md) Combo List.
- `UI-CMP-011` Combo Card.
- [`UI-CMP-012`](./ui/UI-CMP-012.md) Combo List Config Module.
- [`UI-CMP-013`](./ui/UI-CMP-013.md) Filter Control Group.
- `UI-CMP-014` Combo Detail Header.
- `UI-CMP-015` Notation Renderer.
- `UI-CMP-016` Move Path Viewer. `Deprecated`; use `UI-CMP-035 Combo Whiteboard`.
- `UI-CMP-017` Combo Metadata Grid.
- `UI-CMP-018` Combo Actions Menu.
- `UI-CMP-019` Named List Index.
- `UI-CMP-020` Named List Detail.
- `UI-CMP-021` Add-To-List Dialog. Page-level singleton action dialog, який відкривається з combo cards або combo summary actions.
- `UI-CMP-022` List Edit Dialog.
- `UI-CMP-023` Builder Context Setup.
- `UI-CMP-024` Move Picker.
- `UI-CMP-025` Combo Path Preview. `Deprecated`; use `UI-CMP-035 Combo Whiteboard`.
- `UI-CMP-026` Builder Action Bar.
- `UI-CMP-027` Export Dialog.
- `UI-CMP-028` Import Preview Dialog.
- `UI-CMP-029` Empty State.
- `UI-CMP-030` Error State.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-032` Breadcrumbs.
- `UI-CMP-033` Top Bar Dropdown Menu.
- `UI-CMP-034` Backup Collapsible Block.
- [`UI-CMP-035`](./ui/UI-CMP-035.md) Combo Whiteboard.
- [`UI-CMP-036`](./ui/UI-CMP-036.md) Combo Frame Meter.

## Глобальна структура

Застосунок складається з таких UI surfaces:

- `UI-PAGE-001` App Shell і навігаційна рамка.
- `UI-PAGE-002` First-Launch Setup.
- `UI-PAGE-008` Settings, включно з `UI-CMP-034` Backup Collapsible Block.
- `UI-PAGE-003` Catalog.
- `UI-CMP-012` Combo List Config Module.
- `UI-PAGE-004` Combo Detail.
- `UI-PAGE-005` Named Lists.
- `UI-PAGE-006` Custom Combo Builder.
- `UI-CMP-029`, `UI-CMP-030`, `UI-CMP-031` System states: loading, empty, error, stale/invalid.

Окремо зберігаються deprecated route-коди:

- `UI-PAGE-007` Backup Management. Код зі статусом `Deprecated`; перенаправлення до `UI-PAGE-008 Settings -> UI-CMP-034`.

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
     -> UI-CMP-034 Backup Collapsible Block
        -> UI-CMP-027 Export Dialog
        -> UI-CMP-028 Import Preview Dialog
  -> UI-PAGE-003 Catalog
     -> UI-CMP-012 Combo List Config Module
        -> UI-CMP-007 Character Picker
        -> MKXL variant
           -> UI-CMP-008 Variation Picker
        -> MK1 variant
           -> UI-CMP-009 Kameo Picker
        -> UI-CMP-013 Filter Control Group
     -> UI-CMP-010 Combo List
        -> UI-CMP-011 Combo Card
     -> UI-CMP-021 Add-To-List Dialog
     -> UI-PAGE-004 Combo Detail
  -> UI-PAGE-005 Named Lists
  -> UI-PAGE-006 Custom Combo Builder
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

- Відкрити `UI-PAGE-003 Catalog`, `UI-PAGE-005 Named Lists`, `UI-PAGE-006 Custom Combo Builder` або `UI-PAGE-008 Settings`.
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

Детальна специфікація: [ui/UI-PAGE-003.md](./ui/UI-PAGE-003.md).
Game-specific варіанти: [MKXL](./ui/UI-PAGE-003-MKXL.md), [MK1](./ui/UI-PAGE-003-MK1.md).

### Призначення

Catalog дає користувачу працювати в межах active game, пройти шлях до combo list і звузити список через filters.

`UI-PAGE-003` є stable page code для Catalog. Game-specific поведінка описана як variant docs, а не як нові `UI-PAGE-###` codes:

- `MKXL`: [ui/UI-PAGE-003-MKXL.md](./ui/UI-PAGE-003-MKXL.md), flow `Character -> Variation -> Combo list`.
- `MK1`: [ui/UI-PAGE-003-MK1.md](./ui/UI-PAGE-003-MK1.md), flow `Main character -> Kameo -> Combo list`.

### Умови входу

- `UI-PAGE-002 First-Launch Setup` завершено або deep link успішно відновив контекст.
- Seeded combo data завантажені та валідні для показу.
- Active game, language і notation display mode уже застосовані через `UI-PAGE-002 First-Launch Setup` або `UI-PAGE-008 Settings`.

### Основні стани

- `gameContextReady`: catalog має активну game з app-level settings.
- `comboList`: показаний список combo для активного контексту.
- `filteredList`: список звужено через filters.
- `noCharacterSelected`: game обрана, але персонаж ще ні.
- `noCombos`: контекст валідний, але combo не знайдені.
- `noFilterResults`: live list configuration не повернула combo.
- `configFocused`: focus перебуває у `UI-CMP-012 Combo List Config Module`.
- `filterGroupExpanded`: `UI-CMP-013` показує filter body.
- `addToListOpen`: page-level singleton `UI-CMP-021 Add-To-List Dialog` відкритий для active combo context.
- `notFound`: route або deep link містить невалідний catalog context.
- `recoverableError`: catalog може показати retry або fallback.
- `loadingData`: seeded data ще готуються до показу.

Game-specific state tokens описані у variant docs:

- `MKXL`: `variationSelection`, `mkxlComboList`, `mkxlNoVariationCombos`.
- `MK1`: `kameoSelection`, `mk1ComboList`, `mk1NoKameoCombos`.

### Компоненти

- [`UI-CMP-007`](./ui/UI-CMP-007.md) Character Picker.
- [`UI-CMP-008`](./ui/UI-CMP-008.md) Variation Picker для `MKXL` variant.
- [`UI-CMP-009`](./ui/UI-CMP-009.md) Kameo Picker для `MK1` variant.
- [`UI-CMP-010`](./ui/UI-CMP-010.md) Combo List.
- `UI-CMP-011` Combo Card.
- `UI-CMP-012` Combo List Config Module.
- [`UI-CMP-013`](./ui/UI-CMP-013.md) Filter Control Group.
- `UI-CMP-015` Notation Renderer.
- `UI-CMP-021` Add-To-List Dialog як page-level singleton action dialog.
- `UI-CMP-029` Empty State.
- `UI-CMP-030` Error State.

### Важливі дії

- Вибрати character.
- Вибрати game-specific context у відповідному variant doc.
- Редагувати `UI-CMP-012 Combo List Config Module`.
- Відкрити `UI-PAGE-004 Combo Detail`.
- Додати seeded combo у named list через page-level singleton `UI-CMP-021 Add-To-List Dialog`, який відкривається з focused `UI-CMP-011 Combo Card`.
- Дублювати seeded combo у custom combo.

### Пов'язані UX сценарії

- `US-002`, `US-003`, `US-004`, `US-005`, `US-006`, `US-007`, `US-012`, `US-014`, `US-019`, `US-023`, `US-024`

## UI-CMP-012: Combo List Config Module

Детальна специфікація: [ui/UI-CMP-012.md](./ui/UI-CMP-012.md).

### Призначення

Combo List Config Module є єдиним UX-модулем вхідної конфігурації combo list у `UI-PAGE-003 Catalog`.

Модуль розділяє:

- required context selectors: `character` і active game-specific context;
- `UI-CMP-013 Filter Control Group` для optional filters;
- responsive expanded/collapsed presentation для filter group.

Optional filters застосовуються live. `Clear filters` очищає optional filters, але не скидає selected `character + variation/kameo`.

### Умови входу

- Активний catalog context існує.
- `UI-PAGE-003 Catalog` рендерить config module перед combo list.
- Користувач може сфокусувати filter controls через command `openFilters`.

### Основні стани

- `contextIncomplete`: required character або game-specific context відсутній.
- `contextReady`: required `character + variation/kameo` валідні.
- `filterGroupExpanded`: `UI-CMP-013` filter body показаний за замовчуванням.
- `filterGroupCollapsed`: `UI-CMP-013` показує тільки filter header.
- `filterActive`: optional filters застосовані.
- `loadingFacets`: filter або context options ще готуються.
- `noFilterResults`: live configuration не повернула combo.
- `invalidDependentContext`: selected dependent value більше не сумісний з upstream context.

### Компоненти

- [`UI-CMP-007`](./ui/UI-CMP-007.md) Character Picker.
- [`UI-CMP-008`](./ui/UI-CMP-008.md) Variation Picker.
- [`UI-CMP-009`](./ui/UI-CMP-009.md) Kameo Picker.
- [`UI-CMP-013`](./ui/UI-CMP-013.md) Filter Control Group.
- `UI-CMP-029` Empty State.

### Важливі дії

- Змінити character.
- Змінити variation або kameo у межах active game.
- Змінити starter, position, meter, damage, difficulty або route type.
- Вибрати tags.
- Прибрати active filter chip.
- Clear filters без втрати selected character і game-specific context.
- Згорнути або розгорнути `UI-CMP-013`.
- Керувати focus zone через semantic controller commands.

### Пов'язані UX сценарії

- `US-002`, `US-003`, `US-004`, `US-005`, `US-006`, `US-019`

## UI-CMP-013: Filter Control Group

Детальна специфікація: [ui/UI-CMP-013.md](./ui/UI-CMP-013.md).

### Призначення

Filter Control Group є єдиним collapsible компонентом optional filters у `UI-CMP-012 Combo List Config Module`.

Компонент містить:

- `filterHeader`: expand/collapse trigger, result count, active optional-filter chips і `Clear filters`;
- `filterBody`: starter, position, meter, damage, difficulty, route type, tags і game-specific optional facets.

За замовчуванням `UI-CMP-013` рендериться expanded у valid Catalog context. Collapse приховує тільки `filterBody` і не очищає selected filters.

### Важливі дії

- Змінити optional filter facet.
- Прибрати active filter chip.
- Clear filters без втрати selected character і game-specific context.
- Згорнути або розгорнути filter group.
- Керувати focus через `openFilters`, `back` і `closePanel`.

### Пов'язані UX сценарії

- `US-006`, `US-019`

## UI-CMP-007: Character Picker

Детальна специфікація: [ui/UI-CMP-007.md](./ui/UI-CMP-007.md).

### Призначення

Character Picker є required context selector у `UI-CMP-012 Combo List Config Module`.

Компонент має окремі data-driven layouts:

- `MKXL.character`;
- `MK1.character`.

На viewport/device class від `13.6-inch` picker використовує fixed in-game `row`/`column` positions. На менших екранах grid може реорганізовуватись через `compactOrder`, не змінюючи logical option order.

Slot без combo data лишається видимим як `disabledNoComboData`, має readable disabled reason і не емітить selection.

### Пов'язані UX сценарії

- `US-003`, `US-004`, `US-005`, `US-006`, `US-019`

## UI-CMP-008: Variation Picker

Детальна специфікація: [ui/UI-CMP-008.md](./ui/UI-CMP-008.md).

### Призначення

Variation Picker є required `MKXL` context selector після selected character.

Компонент використовує layout key `MKXL.variation` і повторює in-game MKXL variation selection UI на viewport/device class від `13.6-inch`. На менших екранах layout може адаптивно реорганізовуватись через `compactOrder`.

Slot без combo data лишається видимим як `disabledNoComboData`, має readable disabled reason і не емітить selection.

### Пов'язані UX сценарії

- `US-003`, `US-004`, `US-006`, `US-019`

## UI-CMP-009: Kameo Picker

Детальна специфікація: [ui/UI-CMP-009.md](./ui/UI-CMP-009.md).

### Призначення

Kameo Picker є required `MK1` context selector після selected main character.

Компонент використовує layout key `MK1.kameo` і повторює in-game MK1 kameo select UI на viewport/device class від `13.6-inch`. На менших екранах layout може адаптивно реорганізовуватись через `compactOrder`.

Slot без combo data лишається видимим як `disabledNoComboData`, має readable disabled reason і не емітить selection.

### Пов'язані UX сценарії

- `US-003`, `US-005`, `US-006`, `US-019`

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
- `UI-CMP-035` Combo Whiteboard.
- `UI-CMP-036` Combo Frame Meter.
- `UI-CMP-017` Combo Metadata Grid.
- `UI-CMP-018` Combo Actions Menu.
- `UI-CMP-021` Add-To-List Dialog як page-level singleton action dialog для active combo context.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-030` Error State.

`UI-CMP-035 Combo Whiteboard` у Combo Detail завжди працює в `detailReadOnly` mode. Він дозволяє step focus і inspection, але не змінює `movePath`, `cachedNotation`, seeded data або custom data. Для `invalidCustomDetail` whiteboard показує original path, valid prefix і invalid boundary, а repair/edit запускається через page-level action у builder.

`UI-CMP-036 Combo Frame Meter` у Combo Detail рендериться поруч із whiteboard як read-only interactive inspector. Він показує frame timeline і числові values для focused whiteboard step або всієї combo, дозволяє controller/keyboard focus timeline segment і відкриває readable segment details без mutation events.

### Важливі дії

- Переглянути canonical FGC notation.
- Переглянути mapped notation для `FGC`, `PlayStation` або `Xbox`.
- Переглянути selected combo path у read-only `UI-CMP-035 Combo Whiteboard`.
- Сфокусувати окремий step у whiteboard і переглянути move/runtime details без зміни `movePath`.
- Переглянути frame timeline у `UI-CMP-036 Combo Frame Meter` для selected move або всієї combo.
- Сфокусувати frame segment і прочитати segment details через controller або keyboard.
- Переглянути damage, meter, position, starter, route type, difficulty і tags.
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
- Користувач відкрив lists surface або page-level add-to-list dialog з combo context.

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
- `UI-CMP-022` List Edit Dialog.
- `UI-CMP-011` Combo Card.
- `UI-CMP-021` Add-To-List Dialog як page-level singleton action dialog.
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

Детальна специфікація: [ui/UI-PAGE-006.md](./ui/UI-PAGE-006.md).

### Призначення

Custom Combo Builder дає користувачу створити або відредагувати локальне custom combo через керований процес, у якому наступний move обирається тільки з валідних переходів.

### Умови входу

- Користувач відкрив builder з нуля, через duplicate seeded combo або через edit custom combo action.
- Активний контекст містить game, character і variation або kameo, якщо вони потрібні.
- `@mk-combos/combo-builder` може отримати composed move graph.

### Основні стани

- `contextSetup`: користувач задає game, character, variation/kameo і стартовий контекст.
- `loadingGraph`: app готує composed move graph для builder flow.
- `ready`: builder має graph input і показує валідні стартові moves.
- `selectingMove`: користувач обирає наступний valid move.
- `whiteboardFocused`: `UI-CMP-035 Combo Whiteboard` має focus і показує поточний `movePath`, `cachedNotation`, selected step або selected gap.
- `frameMeterFocused`: `UI-CMP-036 Combo Frame Meter` має focus і показує selected timeline segment для focused move або whole combo.
- `segmentDetailsOpen`: Frame Meter показує readable details active segment і повертає focus на source segment після закриття.
- `pendingTruncate`: whiteboard edit або context replay повернув valid prefix і invalid tail; finish заблокований до confirmation або repair.
- `noValidNextMoves`: поточний path валідний, але продовження немає.
- `invalidInitialPath`: combo, яке редагують, не проходить актуальну graph validation.
- `staleCustomCombo`: custom combo стало невалідним після оновлення move graph.
- `saving`: app отримує `movePath` і `cachedNotation` та пише custom combo у local state.
- `saveError`: custom combo не вдалося зберегти без втрати поточного path.
- `cancelConfirm`: користувач виходить без збереження після змін.
- `complete`: combo створене або оновлене.

### Компоненти

- `UI-CMP-023` Builder Context Setup.
- `UI-CMP-024` Move Picker.
- `UI-CMP-035` Combo Whiteboard.
- `UI-CMP-036` Combo Frame Meter.
- `UI-CMP-026` Builder Action Bar.
- `UI-CMP-015` Notation Renderer.
- `UI-CMP-021` Add-To-List Dialog як page-level singleton action dialog для saved combo summary або `UI-CMP-011` context.
- `UI-CMP-031` Stale/Invalid Combo Marker.
- `UI-CMP-030` Error State.

### Важливі дії

- Вибрати стартовий context: meter, position, stance, player state, opponent state.
- Вибрати valid move.
- Undo останній move.
- Перемикати move groups.
- Переглянути і редагувати selected combo path через `UI-CMP-035 Combo Whiteboard`.
- Переглянути frame timeline і segment details через `UI-CMP-036 Combo Frame Meter`.
- Завершити combo.
- Скасувати builder flow.
- Додати створене combo у named list.

### Пов'язані UX сценарії

- `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-024`

## UI-PAGE-007: Backup Management

### Призначення

`UI-PAGE-007 Backup Management` є стабільним кодом зі статусом `Deprecated`. Код не reassigned, але Backup Management більше не є активною route-level surface.

Full backup локальних settings, custom combos і named lists тепер належить `UI-PAGE-008 Settings` через `UI-CMP-034 Backup Collapsible Block`.

### Умови входу

- Старий route або deep link вказує на `UI-PAGE-007 Backup Management`.
- App Shell може відновити app-level settings або session-only state.

### Основні стани

- `deprecatedRedirect`: App Shell відкриває `UI-PAGE-008 Settings` і розгортає `UI-CMP-034 Backup Collapsible Block`.

### Компоненти

- `UI-CMP-034` Backup Collapsible Block.
- `UI-CMP-027` Export Dialog.
- `UI-CMP-028` Import Preview Dialog.
- `UI-CMP-030` Error State.

### Важливі дії

- Перенаправити до `UI-PAGE-008 Settings -> UI-CMP-034 Backup Collapsible Block`.
- Не рендерити окрему backup page.
- Не виконувати import/export до явної взаємодії користувача з backup block у Settings.

### Пов'язані UX сценарії

- `US-017`, `US-018`, `US-024`

## UI-PAGE-008: Settings

Детальна специфікація: [ui/UI-PAGE-008.md](./ui/UI-PAGE-008.md).

### Призначення

Settings є єдиною сторінкою ручної зміни `game`, `language` і `notation display mode` після завершення first-launch setup або valid deep link auto-config.

Settings редагує values, які були встановлені через `UI-PAGE-002 First-Launch Setup`, або values, які App Shell auto-configured із valid deep link: URL-derived `game`, URL-derived `language` і default `FGC`.

Settings також містить backup controls у `UI-CMP-034 Backup Collapsible Block`: export full backup JSON і import backup з preview та replace confirmation.

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
- `backupCollapsed`: backup block згорнутий за замовчуванням.
- `backupExpanded`: backup block відкритий користувачем або через deprecated redirect із `UI-PAGE-007`.
- `importPreview`: показано backup preview перед replace.

### Компоненти

- `UI-CMP-002` Game Switcher.
- `UI-CMP-003` Language Switcher.
- `UI-CMP-004` Display Mode Switcher.
- `UI-CMP-034` Backup Collapsible Block.
- `UI-CMP-027` Export Dialog.
- `UI-CMP-028` Import Preview Dialog.
- `UI-CMP-030` Error State.

### Важливі дії

- Змінити default game для catalog і builder entry.
- Змінити language для UI і localized content.
- Змінити notation display mode для rendering notation.
- Застосувати settings до active app state.
- Розгорнути backup block.
- Export full backup JSON.
- Import backup JSON через preview і replace confirmation.
- Повернутися до попередньої робочої сторінки або catalog.

### Пов'язані UX сценарії

- `US-002`, `US-008`, `US-009`, `US-017`, `US-018`, `US-024`

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
- Відкрити right-pinned dropdown menu з actions до `UI-PAGE-005 Named Lists`, `UI-PAGE-006 Custom Combo Builder` і `UI-PAGE-008 Settings`.
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

- Відкрити `UI-PAGE-005 Named Lists`, `UI-PAGE-006 Custom Combo Builder` або `UI-PAGE-008 Settings`.
- Не показувати окремий Backup action; backup доступний у Settings через `UI-CMP-034 Backup Collapsible Block`.
- Закрити menu через `Escape`, outside click або після вибору action.
- Повернути focus до menu trigger після закриття.

### Пов'язані UX сценарії

- `US-019`, `US-023`, `US-024`

## UI-CMP-034: Backup Collapsible Block

### Призначення

Backup Collapsible Block є page-owned component у `UI-PAGE-008 Settings` для export/import full backup JSON.

Блок згорнутий за замовчуванням і розгортається за взаємодією користувача або після deprecated redirect із `UI-PAGE-007 Backup Management`.

### Умови входу

- `UI-PAGE-008 Settings` рендериться як активна сторінка.
- Local settings, custom combos і named lists доступні для backup summary.
- App Shell може передати контекст перенаправлення від deprecated `UI-PAGE-007`.

### Основні стани

- `backupCollapsed`: backup block згорнутий за замовчуванням.
- `backupExpanded`: backup block відкритий користувачем або через deprecated redirect.
- `exporting`: app формує full backup JSON.
- `importFilePicker`: користувач обирає backup JSON.
- `importValidating`: app перевіряє backup schema.
- `importPreview`: показано preview перед replace.
- `replaceConfirm`: користувач підтверджує повну заміну local state.
- `importInvalid`: backup файл невалідний або несумісний.
- `importComplete`: local settings, custom combos і named lists замінено backup-даними.

### Компоненти

- `UI-CMP-027` Export Dialog.
- `UI-CMP-028` Import Preview Dialog.
- `UI-CMP-030` Error State.

### Важливі дії

- Розгорнути або згорнути backup block.
- Export full backup JSON.
- Обрати backup JSON для import.
- Переглянути import preview.
- Підтвердити replace.
- Скасувати import без змін local state.
- Побачити validation errors для невалідного backup.

### Пов'язані UX сценарії

- `US-017`, `US-018`, `US-024`

## UI-CMP-035: Combo Whiteboard

Детальна специфікація: [ui/UI-CMP-035.md](./ui/UI-CMP-035.md).

### Призначення

Combo Whiteboard є shared domain component для відображення selected combo path у builder і combo detail.

У `UI-PAGE-006 Custom Combo Builder` whiteboard є editable workspace для `movePath`: він показує steps і gaps, дозволяє focus, step inspection, insert, replace, remove, undo-to-step і pick up/drop reorder через edit proposals.

У `UI-PAGE-004 Combo Detail` whiteboard працює у read-only inspection mode: він показує той самий `movePath`, `cachedNotation`, runtime summary і invalid markers, але не змінює combo data.

Whiteboard синхронізує selected step із `UI-CMP-036 Combo Frame Meter`, але не делегує йому path mutation. Frame Meter може попросити сфокусувати matching whiteboard step, якщо timeline segment відповідає step у `movePath`.

### Основні стани

- `emptyActive`: create flow ще не має moves, але board уже показує context/runtime summary і append target.
- `lockedPreview`: source path показаний read-only до підтвердження context у duplicate/edit/repair flow.
- `editable`: builder graph готовий, whiteboard може емітити edit proposals.
- `editMenuOpen`: step або gap має local context menu з доступними діями.
- `reorderDragging`: step піднятий для pick up/drop reorder.
- `pendingTruncate`: replay повернув valid prefix і invalid tail; finish заблокований до confirmation або repair.
- `repairReview`: stale/invalid path показаний як original path, valid prefix і invalid boundary.
- `savingFrozen`: save in progress, path visible і не редагується.
- `detailReadOnly`: combo detail inspection без mutation events.

### Важливі дії

- Показати selected `movePath` і mapped notation через `UI-CMP-015 Notation Renderer`.
- Сфокусувати step або gap через keyboard/controller/pointer navigation.
- У builder mode емітити edit proposals; `useComboBuilder` лишається source of truth і replay-ить результат.
- Показати invalid boundary, valid prefix і invalid tail без автоматичного видалення path.
- Заблокувати finish, якщо є pending truncate або unresolved invalid tail.

### Пов'язані UX сценарії

- `US-007`, `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-025`

## UI-CMP-036: Combo Frame Meter

Детальна специфікація: [ui/UI-CMP-036.md](./ui/UI-CMP-036.md).

### Призначення

Combo Frame Meter є shared domain component для interactive frame inspection у builder і combo detail.

У `UI-PAGE-006 Custom Combo Builder` Frame Meter показує live frame timeline для current path, focused whiteboard step або focused Move Picker candidate. Він preview-ить frame values без додавання move у path.

У `UI-PAGE-004 Combo Detail` Frame Meter працює як read-only inspector для selected move або всієї combo.

### Основні стани

- `selectedMove`: показано startup, active, recovery, advantage, cancel/link/juggle windows і meter cost/gain для focused move.
- `wholeCombo`: показано per-step timeline, transition gaps, cumulative frame context і invalid boundaries.
- `segmentDetailsOpen`: active segment має readable details panel або disclosure.
- `pendingTruncate`: invalid transition segment пояснює, чому replay повернув valid prefix і invalid tail.
- `repairReview`: stale/invalid path показаний як original timeline, valid prefix і invalid boundary.
- `savingFrozen`: save in progress, timeline visible і не мутує path.

### Важливі дії

- Перемикати scope між selected move і whole combo.
- Сфокусувати timeline segment через keyboard/controller/pointer navigation.
- Відкрити readable segment details через `confirm` або `openActions`.
- Закрити segment details через `back` і повернути focus на source segment.
- Попросити сфокусувати matching whiteboard step, якщо segment відповідає step у `movePath`.
- Показати invalid transition reason без автоматичного truncate або repair.

### Пов'язані UX сценарії

- `US-007`, `US-013`, `US-014`, `US-015`, `US-016`, `US-020`, `US-025`

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
- `emptyFilters`: live list configuration не повернула результатів.
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
