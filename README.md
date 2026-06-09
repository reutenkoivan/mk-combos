# mk-combos

`mk-combos` — статичний вебзастосунок для досвідчених гравців Mortal Kombat, який допомагає шукати, фільтрувати, переглядати, зберігати та організовувати комбо для `MKXL` і `MK1`.

Застосунок має бути побудований як `Turborepo` monorepo на `Bun`, з окремим пакетом для бази комбо, окремим UI-kit пакетом і web app на `TanStack Start`. Деплой виконується на `GitHub Pages`, без backend, auth, remote database або server-side персоналізації.

## Цілі проєкту

- Створити швидкий статичний каталог комбо для `MKXL` і `MK1`.
- Зберігати seeded базу комбо у JSON-файлах в окремому package.
- Зберігати повний movelist і move graph для побудови валідних custom combos.
- Дати користувачу можливість перемикати відображення інпутів між `FGC`, `PlayStation` і `Xbox`.
- Дати користувачу можливість керувати застосунком через DualSense або Xbox controller.
- Дати користувачу локальні персональні можливості: власні комбо, дублювання seeded комбо, named lists, імпорт та експорт backup.
- Дати користувачу guided combo builder, де наступний прийом обирається тільки з валідних переходів.
- Забезпечити двомовний інтерфейс і контент: `English` та `Українська`.
- Налаштувати CI/CD так, щоб data validation, tests і static build проходили перед деплоєм на GitHub Pages.

## Архітектура monorepo

```text
mk-combos/
  apps/
    web/
      # TanStack Start застосунок
  packages/
    combo-data/
      # JSON-бази MKXL/MK1, movelist, move graph, схеми, валідація
    combo-builder/
      # Headless builder logic, custom hook, builder UI
    controller-bridge/
      # Gamepad API bridge, controller profiles, semantic app commands
    ui/
      # Shared React UI-kit, tokens, generic компоненти, notation renderer
  turbo.json
  package.json
```

### `apps/web`

Web app відповідає за користувацький сценарій:

- основний flow: `Game -> Character -> Combo list -> Combo detail`;
- перемикач гри: `MKXL / MK1`;
- перемикач мови: `EN / UA`;
- перемикач відображення інпутів: `FGC / PlayStation / Xbox`;
- керування через DualSense або Xbox controller;
- advanced filters;
- локальне збереження користувацьких даних;
- import/export full backup JSON;
- static SPA/prerender output для GitHub Pages.

Застосунок імпортує:

- `@mk-combos/combo-data` для seeded бази, типів і validation helpers;
- `@mk-combos/combo-builder` для custom combo builder logic, hook і builder UI;
- `@mk-combos/controller-bridge` для controller input, semantic commands і controller hints;
- `@mk-combos/ui` для компонентів, tokens і notation renderer.

### `packages/combo-data`

Пакет містить усі seeded дані та правила їх перевірки.

Public API:

- `mkxlData`;
- `mk1Data`;
- `validateComboData`;
- `getCoverageReport`;
- graph data і graph schemas;
- типи для `MKXL`, `MK1`, notation, move graph, tags, source, localized notes.

`packages/combo-data` не містить builder state machine, React hooks або builder UI. Пакет відповідає за дані, типи, Zod-схеми, coverage targets і validation.

Очікувана структура даних:

- `MKXL` має окрему JSON-схему з полями:
  `id`, `game`, `character`, `variation`, `movePath`, `cachedNotation`, `damage`, `meter`, `position`, `starter`, `routeType`, `difficulty`, `tags`, `notes.en`, `notes.uk`, `gameVersion`, `source`.
- `MK1` має окрему JSON-схему з полями:
  `id`, `game`, `character`, `kameo`, `movePath`, `cachedNotation`, `damage`, `meter`, `position`, `starter`, `routeType`, `difficulty`, `tags`, `notes.en`, `notes.uk`, `gameVersion`, `source`.
- Усі seeded combo мають стабільний `id`, бо локальні списки користувача посилаються саме на ці id.
- Seeded і custom combo зберігають шлях по графу як source of truth, а FGC notation зберігається як кеш для відображення, пошуку і validation.

Move graph має бути окремим шаром даних:

- повний movelist для кожного персонажа;
- base graph для персонажа;
- overlays для `MKXL` variations;
- overlays для `MK1` kameos;
- transition edges між прийомами.

Move описує:

- стабільний `id`;
- офіційну англійську назву;
- український alias або короткий опис;
- canonical FGC notation;
- тип прийому, tags і metadata, потрібні для пошуку та builder UX.

Edge описує:

- стабільний `id`;
- `fromMoveId` і `toMoveId`;
- transition type: `cancel`, `link`, `string`, `launcher`, `ender`, `kameo` або інший доменний тип;
- `requires`: meter, position, stance, player state, opponent state;
- `effects`: новий player state і opponent state після переходу;
- notes, source і gameVersion для складних або патч-залежних переходів.

Opponent state є обов'язковою частиною constraints. Мінімальні стани:

- `grounded`;
- `airborne`;
- `juggled`;
- `knockdown`;
- `stunned`.

Builder package компонує актуальний граф так:

- для `MKXL`: base character graph + variation overlay;
- для `MK1`: base character graph + kameo overlay;
- overlay може додавати moves, додавати edges або блокувати недоступні moves/edges.

Coverage перед релізом:

- `MKXL`: кожна character variation має curated набір практичних комбо.
- `MK1`: кожна пара `main character x kameo` має curated набір практичних комбо.

Data validation має перевіряти:

- валідність JSON за Zod-схемами;
- унікальність `id`;
- унікальність move ids і edge ids;
- наявність `notes.en` і `notes.uk`;
- наявність `gameVersion` і `source`;
- відповідність coverage matrix;
- валідність move graph overlays;
- існування кожного `movePath` у composed graph;
- відповідність `cachedNotation` до `movePath`;
- наявність official EN name, UA alias/description і FGC notation для кожного move;
- відсутність порожніх tags, move paths і критичних metadata.

### `packages/combo-builder`

Пакет містить бізнес-логіку та доменний UI для custom combo builder. Він залежить від:

- `@mk-combos/combo-data` для graph data, типів і схем;
- `@mk-combos/ui` для generic UI primitives і `NotationRenderer`.

Public API:

- `useComboBuilder`;
- `ComboBuilder`;
- `MovePicker`;
- `ComboPathPreview`;
- `createInitialBuilderState`;
- `composeMoveGraph`;
- `getValidNextMoves`;
- `applyMoveTransition`;
- `validateComboPath`;
- `detectStaleCombo`;
- типи `ComboBuilderState`, `ComboBuilderAction`, `ComboBuilderContext`, `ValidNextMove`, `InvalidComboReason`.

`useComboBuilder` приймає composed або raw graph input, стартовий контекст і optional initial combo path. Hook керує builder state, valid next moves, обраним `movePath`, `cachedNotation`, invalid reasons і player/opponent state.

`ComboBuilder` може:

- приймати hook state/actions через props;
- або створювати state всередині через `useComboBuilder`;
- не зберігати дані в `localStorage`;
- не керувати named lists, import/export або app-level persistence.

`MovePicker` показує тільки valid next moves або явно disabled недоступні moves, якщо це потрібно для UX. `ComboPathPreview` показує поточний шлях і notation у режимах `FGC`, `PlayStation`, `Xbox`.

### `packages/controller-bridge`

Пакет містить bridge між фізичним контролером і semantic app commands. Він читає Browser Gamepad API, нормалізує DualSense/Xbox-compatible input і віддає команди, які `apps/web` прив'язує до поточного екрана.

Пакет підтримує в MVP:

- DualSense;
- Xbox controller;
- fallback на Standard Gamepad API compatible mapping.

Public API:

- `useControllerBridge`;
- `useControllerCommands`;
- `createControllerProfile`;
- `getControllerHints`;
- `normalizeGamepadInput`;
- `defaultControllerBindings`;
- типи `ControllerProfile`, `ControllerKind`, `ControllerCommand`, `ControllerBinding`, `ControllerState`, `ControllerHint`.

Semantic commands:

- navigation: `navUp`, `navDown`, `navLeft`, `navRight`, `confirm`, `back`;
- workspace: `openFilters`, `closePanel`, `nextTab`, `previousTab`, `openActions`;
- list/detail: `addToList`, `removeFromList`, `openDetail`, `closeDetail`;
- builder: `builderSelectMove`, `builderUndoMove`, `builderFinish`, `builderCancel`, `builderNextGroup`, `builderPreviousGroup`.

Default mapping:

- D-pad / left stick: navigation;
- Cross / A: confirm;
- Circle / B: back;
- Square / X: contextual action або add-to-list;
- Triangle / Y: open filters/actions;
- L1/R1 або LB/RB: previous/next tab або builder group;
- Options/Menu: open actions menu;
- Touchpad/View: secondary panel, якщо доступно.

`packages/controller-bridge` не містить app-specific state, routing, localStorage, combo data або direct builder mutation. Пакет емiтить semantic commands, а `apps/web` вирішує, що команда означає для поточного surface.

### `packages/ui`

UI-kit має бути незалежним від app state і придатним для повторного використання.

Базові компоненти:

- `Button`;
- `IconButton`;
- `SegmentedControl`;
- `SelectField`;
- `SearchField`;
- `Dialog`;
- `FilterControl`;
- `ListControl`;
- `ComboCard`;
- `NotationRenderer`.

Design direction:

- стриманий desktop-first інтерфейс;
- щільна, але читабельна інформаційна ієрархія;
- stable dimensions для фільтрів, панелей, списків і toolbar;
- семантичні CSS tokens для surfaces, text, accent, separators, controls;
- keyboard-accessible controls;
- видимий `focus-visible`;
- controller hints можуть відображатися через generic UI primitives;
- WCAG 2.2 AA як базовий рівень доступності.

`NotationRenderer` приймає canonical FGC notation, згенеровану або перевірену через `movePath`, і режим відображення:

```ts
type NotationDisplayMode = "fgc" | "playstation" | "xbox"
```

FGC залишається єдиним форматом зберігання, а PlayStation/Xbox є лише display mapping.

`packages/ui` не містить Mortal Kombat-specific builder state, `MovePicker` або `ComboBuilder`. Ці доменні компоненти живуть у `@mk-combos/combo-builder`.

`packages/ui` не читає controller input напряму. Controller connection state, button labels і hints приходять із `@mk-combos/controller-bridge` через `apps/web`.

## Користувацькі сценарії

Окремий UX-індекс сценаріїв ведеться в [ux.md](./ux.md).

### Перегляд каталогу

1. Користувач відкриває застосунок.
2. Обирає гру: `MKXL` або `MK1`.
3. Обирає персонажа.
4. Для `MKXL` бачить variation-specific комбо.
5. Для `MK1` бачить комбо з урахуванням kameo.
6. Фільтрує список за metadata.
7. Відкриває detail view конкретного комбо.

### Керування контролером

Користувач може керувати застосунком через DualSense або Xbox controller:

1. Користувач підключає контролер до браузера.
2. `@mk-combos/controller-bridge` визначає controller profile або використовує Standard Gamepad fallback.
3. Bridge нормалізує buttons/axes і застосовує dead zones та repeat delays.
4. Bridge емiтить semantic commands.
5. `apps/web` мапить commands на дії поточного surface: catalog, filters, detail view, named lists або custom combo builder.
6. UI показує contextual controller hints для активного профілю.

Controller не замінює keyboard/mouse: disconnect/reconnect не має ламати інші способи керування.

### Advanced filters

Фільтри першого релізу:

- game;
- character;
- variation для `MKXL`;
- kameo для `MK1`;
- starter;
- position;
- meter;
- damage;
- difficulty;
- route type;
- tags;
- text search по notation, notes і metadata.

### Деталі комбо

Detail view має показувати:

- canonical FGC notation;
- mapped notation для обраної платформи;
- move path, з якого побудоване combo;
- damage;
- meter;
- position;
- starter;
- route type;
- difficulty;
- tags;
- notes поточною мовою;
- game version;
- source.

### Локальні named lists

Замість одного `favorites` користувач може створювати багато списків.

Список має підтримувати:

- створення;
- перейменування;
- видалення;
- додавання seeded combo;
- додавання custom combo;
- видалення combo зі списку;
- зміну порядку combo всередині списку.

Приклади списків:

- `Scorpion ranked`;
- `Corner routes`;
- `Need practice`;
- `Tournament set`.

### Custom combos

Користувач може:

- створити custom combo з нуля через guided builder;
- дублювати seeded combo у custom collection;
- редагувати custom combo через актуальний move graph;
- додати custom combo в один або кілька named lists.

Seeded база залишається read-only. Локальні зміни не змінюють JSON-базу, що деплоїться разом із сайтом.

Custom combo editor:

1. Користувач обирає game, character і variation/kameo.
2. Користувач задає стартовий контекст: meter, position, stance, player state, opponent state.
3. `apps/web` передає graph input і стартовий контекст у `useComboBuilder` або `ComboBuilder` з `@mk-combos/combo-builder`.
4. Builder package компонує base move graph і потрібний overlay.
5. Builder UI показує тільки валідні стартові moves.
6. Після вибору move hook оновлює стан combo через `effects`.
7. Builder показує тільки наступні moves, які проходять `requires`.
8. Після завершення `apps/web` отримує `movePath` і `cachedNotation` з builder state.
9. `apps/web` зберігає custom combo у local state і додає його в named lists за потреби.

У builder flow controller commands мапляться на builder actions:

- `navUp/navDown/navLeft/navRight`: переміщення між доступними moves/groups;
- `confirm` або `builderSelectMove`: вибір move;
- `back` або `builderUndoMove`: відкат останнього move;
- `builderFinish`: завершити combo;
- `builderCancel`: закрити builder без збереження;
- `builderNextGroup` і `builderPreviousGroup`: перемикати групи прийомів.

Free text fallback не входить у MVP: користувач не може додати прийом, якого немає серед валідних наступних варіантів.

Якщо після оновлення seeded move graph локальне custom combo стало невалідним:

- combo не видаляється;
- UI позначає його як invalid;
- користувач бачить причину невалідності;
- користувач може відредагувати combo через актуальний graph.

### Import/export

Перший реліз підтримує тільки full backup.

Backup містить:

- version;
- exportedAt;
- settings;
- customCombos;
- lists;
- invalid combo markers, якщо локальні combo не проходять актуальну graph validation.

Export:

1. Користувач натискає export.
2. Застосунок формує JSON backup.
3. Браузер завантажує файл.

Import:

1. Користувач обирає JSON-файл.
2. Застосунок валідить backup.
3. Користувач бачить preview: кількість custom combos, lists, settings.
4. Після підтвердження поточний local state повністю замінюється backup-даними.

Merge import, remote sync і share links не входять у перший реліз.

## Покроковий план імплементації

### 1. Bootstrap monorepo

- Ініціалізувати `Bun` workspaces.
- Додати `Turborepo`.
- Створити `apps/web`, `packages/combo-data`, `packages/combo-builder`, `packages/controller-bridge`, `packages/ui`.
- Налаштувати root scripts:
  `dev`, `build`, `test`, `lint`, `validate:data`.
- Налаштувати TypeScript base config і project-level configs.
- Додати базові gitignore правила для build output, cache, generated files.

Acceptance criteria:

- `bun install` встановлює всі workspace dependencies.
- `bun run build` запускається через Turbo.
- `bun run test` запускається через Turbo.
- `bun run validate:data` делегує перевірку в `packages/combo-data`.

### 2. Combo data package

- Створити Zod-схеми для `MKXL` і `MK1`.
- Створити Zod-схеми для movelist, base graph, overlays, edges, `requires`, `effects` і `movePath`.
- Створити JSON-файли для seeded комбо.
- Створити JSON-файли для повного movelist персонажів.
- Створити base move graph для кожного персонажа.
- Створити overlays для `MKXL` variations.
- Створити overlays для `MK1` kameos.
- Створити JSON або TS registry для roster/coverage targets.
- Реалізувати `validateComboData`.
- Реалізувати `getCoverageReport`.
- Експортувати graph data і graph types для `@mk-combos/combo-builder`.
- Реалізувати validation, що combo path існує в composed graph.
- Додати CLI-команду `validate:data`.
- Додати unit tests для schema validation, coverage checks і graph data integrity.

Acceptance criteria:

- Некоректний JSON блокує validation.
- Дубльований `id` блокує validation.
- Дубльований move id або edge id блокує validation.
- Відсутній `notes.uk` або `notes.en` блокує validation.
- Move без official EN name, UA alias/description або FGC notation блокує validation.
- Overlay, який посилається на неіснуючий move або edge, блокує validation.
- Seeded combo з неіснуючим `movePath` блокує validation.
- `cachedNotation`, що не відповідає `movePath`, блокує validation.
- Відсутня coverage target пара блокує release validation.
- Пакет експортує typed data для web app і combo builder package.

### 3. Combo builder package

- Створити workspace package `packages/combo-builder` з package name `@mk-combos/combo-builder`.
- Налаштувати залежності від `@mk-combos/combo-data` і `@mk-combos/ui`.
- Реалізувати `composeMoveGraph`, `getValidNextMoves`, `applyMoveTransition`, `validateComboPath`, `detectStaleCombo`.
- Реалізувати `createInitialBuilderState`.
- Реалізувати custom hook `useComboBuilder`.
- Реалізувати доменні React-компоненти `ComboBuilder`, `MovePicker`, `ComboPathPreview`.
- Підтримати strict builder flow без free text fallback.
- Підтримати stale local combo state через invalid reasons без видалення combo.

Acceptance criteria:

- `useComboBuilder` приймає graph input, стартовий контекст і optional initial combo path.
- Builder state містить current context, selected path, valid next moves, cached notation і invalid reasons.
- `getValidNextMoves` повертає тільки moves, які проходять `requires`.
- `applyMoveTransition` оновлює player/opponent state через `effects`.
- `ComboBuilder` може працювати controlled через props або self-contained через hook.
- Package не читає і не пише `localStorage`.
- Package не керує named lists, import/export або app-level persistence.

### 4. UI-kit package

- Визначити semantic tokens.
- Створити базові control components.
- Створити form/filter components.
- Створити `ComboCard`.
- Створити `NotationRenderer`.
- Створити generic controller hint components, які приймають label/state через props.
- Додати mapping `FGC -> PlayStation/Xbox`.
- Додати unit tests для notation mapping.

Acceptance criteria:

- UI components не залежать від state management web app.
- Кожен interactive component має accessible name або visible label.
- Keyboard focus видимий.
- Notation renderer коректно відображає `FGC`, `PlayStation`, `Xbox`.
- Controller hint components не читають Gamepad API напряму.
- UI-kit не містить Mortal Kombat-specific builder state або builder components.

### 5. Controller bridge package

- Створити workspace package `packages/controller-bridge` з package name `@mk-combos/controller-bridge`.
- Реалізувати Browser Gamepad API polling.
- Реалізувати DualSense/Xbox-like controller detection через `gamepad.id` з fallback на Standard mapping.
- Реалізувати `normalizeGamepadInput` для buttons/axes.
- Додати dead zone handling для стіків.
- Додати repeat delay handling для навігаційних команд.
- Реалізувати `defaultControllerBindings`.
- Реалізувати `createControllerProfile` і `getControllerHints`.
- Реалізувати hooks `useControllerBridge` і `useControllerCommands`.
- Емітити тільки semantic commands, без app routing або direct builder mutations.

Acceptance criteria:

- DualSense і Xbox controller отримують правильні profile labels.
- Unknown compatible controller працює через Standard Gamepad fallback.
- D-pad і left stick емiтять navigation commands.
- Face buttons емiтять `confirm`, `back`, contextual action і filters/actions commands.
- L1/R1 або LB/RB емiтять tab/group commands.
- Hook повертає connection state, active controller, command stream і hints.
- Package не читає/пише `localStorage` і не залежить від `apps/web` або `@mk-combos/combo-builder`.

### 6. Web app shell

- Налаштувати TanStack Start у `apps/web`.
- Увімкнути static SPA/prerender strategy.
- Налаштувати base path для `/mk-combos/`.
- Створити app shell з game switcher, language switcher, display mode switcher.
- Імпортувати стилі з UI-kit.
- Підключити seeded data package.
- Підключити `@mk-combos/combo-builder` для custom builder flow.
- Підключити `@mk-combos/controller-bridge` для controller command handling і hints.

Acceptance criteria:

- App відкривається локально.
- App збирається як static output.
- UI працює без backend.
- Controller disconnect/reconnect не ламає keyboard/mouse flow.
- Reload на GitHub Pages subpath не ламає застосунок.

### 7. Catalog UX

- Реалізувати navigation `Game -> Character`.
- Реалізувати список комбо.
- Реалізувати detail view.
- Реалізувати advanced filters.
- Відображати move path у detail view поряд із notation і metadata.
- Реалізувати controller command handlers для catalog, filters і detail view.
- Реалізувати mobile layout для використання біля консолі.
- Реалізувати desktop layout для щільного перегляду і фільтрації.

Acceptance criteria:

- Користувач може знайти combo через character navigation.
- Користувач може звузити список через filters.
- Detail view показує metadata, notes, source і gameVersion.
- Language switch впливає на UI і notes.
- Display mode switch впливає на notation.
- Controller дозволяє navigати catalog, відкривати filters і detail view.

### 8. Local personalization

- Створити local state schema.
- Реалізувати localStorage persistence.
- Реалізувати named lists.
- Реалізувати custom combo editor через `ComboBuilder` або `useComboBuilder` з `@mk-combos/combo-builder`.
- Реалізувати controller command handlers для named lists і custom combo builder.
- Реалізувати duplicate seeded combo -> custom combo.
- Реалізувати stale local combo validation після оновлення seeded graph.
- Реалізувати full backup export.
- Реалізувати full backup import з preview і replace.

Acceptance criteria:

- Локальні дані переживають refresh сторінки.
- Seeded combo можна додати в кілька списків.
- Custom combo можна створити й редагувати тільки через valid transitions.
- Після завершення builder flow `apps/web` зберігає custom combo як `movePath` і `cachedNotation`.
- Controller commands можуть створити combo у builder і додати combo в named list.
- Застаріле custom combo позначається як invalid, але не видаляється.
- Export створює валідний backup JSON.
- Import валідить JSON перед replace.

### 9. Content completion

- Заповнити повний movelist для персонажів `MKXL`.
- Заповнити повний movelist для персонажів `MK1`.
- Побудувати base move graphs для персонажів.
- Побудувати overlays для `MKXL` variations.
- Побудувати overlays для `MK1` kameos.
- Заповнити curated практичну базу `MKXL`.
- Заповнити curated практичну базу `MK1`.
- Для кожного запису перевірити:
  movePath, cachedNotation, damage, meter, position, difficulty, tags, notes, source, gameVersion.
- Для кожного edge перевірити:
  transition type, requires, effects, opponent state, notes, source, gameVersion.
- Для `MKXL` закрити coverage по всіх character variations.
- Для `MK1` закрити coverage по всіх `main character x kameo` парах.

Acceptance criteria:

- `validate:data` проходить без помилок.
- Coverage report показує повне покриття.
- Move graph validation проходить для base graphs і overlays.
- Усі seeded notes доступні англійською та українською.

### 10. CI/CD і GitHub Pages

- Додати GitHub Actions workflow.
- Workflow має виконувати:
  `bun install`, `bun run validate:data`, `bun run test`, `bun run build`.
- Після успішного build завантажити static artifact.
- Задеплоїти artifact на GitHub Pages.
- Додати `.nojekyll`.
- Додати fallback для SPA reload, якщо потрібен `404.html`.

Acceptance criteria:

- Push у `main` запускає CI.
- CI блокує деплой при data validation або test failure.
- GitHub Pages публікує static app.
- URL з base path `/mk-combos/` працює після refresh.

### 11. QA перед релізом

- Перевірити desktop layout.
- Перевірити mobile layout.
- Перевірити keyboard navigation.
- Перевірити contrast і focus states.
- Перевірити import/export.
- Перевірити локальні дані після refresh.
- Перевірити strict custom combo builder.
- Перевірити controller navigation через DualSense або Xbox controller.
- Перевірити controller hints для active profile.
- Перевірити disconnect/reconnect controller.
- Перевірити invalid markers для застарілих local combos.
- Перевірити build artifact без backend-залежностей.

Acceptance criteria:

- Застосунок usable на desktop і mobile.
- Усі основні сценарії проходять e2e.
- Немає критичних accessibility проблем.
- Static build працює як самодостатній GitHub Pages сайт.

## Тестовий план

### Unit tests

- Zod schemas для `MKXL` і `MK1`.
- Zod schemas для movelist, move graph, overlays, edges, `requires`, `effects`.
- Coverage checks.
- Duplicate id detection.
- Duplicate move id і edge id detection.
- `useComboBuilder` initial state.
- `createInitialBuilderState`.
- Graph composition: base graph + `MKXL` variation overlay.
- Graph composition: base graph + `MK1` kameo overlay.
- Transition filtering через `requires` і `effects`.
- `applyMoveTransition` оновлює player/opponent state через `effects`.
- Combo path validation.
- Cached notation validation.
- Stale local combo detection.
- `detectStaleCombo` повертає invalid reason.
- DualSense/Xbox detection fallback.
- Button/axis normalization.
- Dead zone і repeat-delay behavior.
- Default controller command bindings.
- FGC -> PlayStation/Xbox mapping.
- Local state reducers.
- Backup schema validation.

### Hook tests

- `useControllerBridge` повертає connection/disconnection state.
- `useControllerBridge` повертає active controller profile і hints.
- `useControllerCommands` емiтить semantic commands.
- Controller command stream не дублює held buttons поза repeat-delay rules.

### Component tests

- `MovePicker` не показує або disabled недоступні transitions.
- `ComboBuilder` створює combo тільки через valid transitions.
- `ComboPathPreview` показує `FGC/PlayStation/Xbox` display.
- `ComboBuilder` працює в controlled mode через hook state/actions.
- `ComboBuilder` працює в self-contained mode через `useComboBuilder`.
- Controller hint UI показує labels для DualSense і Xbox profiles.

### Integration tests

- `apps/web` імпортує `@mk-combos/combo-data`.
- `apps/web` імпортує `@mk-combos/ui`.
- `apps/web` імпортує `@mk-combos/combo-builder`.
- `apps/web` імпортує `@mk-combos/controller-bridge`.
- `@mk-combos/combo-builder` імпортує graph data/types із `@mk-combos/combo-data`.
- `@mk-combos/combo-builder` використовує primitives із `@mk-combos/ui`.
- `@mk-combos/controller-bridge` не залежить від `apps/web` або `@mk-combos/combo-builder`.
- Controller commands керують catalog, detail, filters, lists і builder через app-level handlers.
- Filters повертають очікувані combo.
- Duplicate seeded combo створює custom combo.
- Custom combo builder отримує valid next moves із composed graph.
- Custom combo builder оновлює player/opponent state після кожного edge.
- Builder controller commands створюють combo тільки через valid transitions.
- Builder-created combo зберігається у local custom combos.
- Controller hints match active DualSense/Xbox profile.
- Invalid local combo лишається в state і отримує invalid marker.
- Add-to-list працює для seeded і custom combo.
- Import backup replace flow працює коректно.

### E2E tests

- Відкрити `MKXL`, обрати персонажа, відкрити combo detail.
- Відкрити `MK1`, обрати персонажа/kameo, відфільтрувати combo.
- Перемкнути `EN/UA`.
- Перемкнути `FGC/PlayStation/Xbox`.
- Створити custom combo тільки через valid transitions.
- Переконатися, що недоступний наступний move не можна вибрати.
- Navigate catalog with DualSense або Xbox controller.
- Open filters і detail view через controller.
- Create custom combo in builder через controller.
- Add combo to named list через controller.
- Disconnect/reconnect controller without breaking keyboard/mouse usage.
- Перевірити invalid marker для застарілого local combo.
- Створити named list.
- Додати combo у named list.
- Export backup.
- Import backup.
- Перевірити роботу з base path `/mk-combos/`.

## Поза першим релізом

- Remote sync.
- Auth.
- User accounts.
- Public combo sharing.
- Merge import.
- Share links.
- In-app seeded database editor.
- Server-side moderation.
- Video embeds.
- Archived/deprecated combo history по старих patch versions.

## Технічні припущення

- Package manager: `Bun`.
- Monorepo: `Turborepo`.
- Web framework: `TanStack Start`.
- Static hosting: `GitHub Pages`.
- Data validation: `Zod`.
- Tests: `Vitest` і `Playwright`.
- UI: React package `@mk-combos/ui`.
- Data package: `@mk-combos/combo-data`.
- Builder package: `@mk-combos/combo-builder`.
- Controller bridge package: `@mk-combos/controller-bridge`.
- Full movelist входить у релізний scope.
- Move graph є глобальним для персонажа, а не деревом всередині кожного combo.
- Builder у MVP суворий: користувач не може додати прийом, якого немає серед valid next moves.
- `@mk-combos/combo-builder` не відповідає за localStorage, import/export або named lists.
- `@mk-combos/controller-bridge` не відповідає за routing, localStorage, combo data або direct builder mutation.
- Controller bridge емiтить semantic commands; `apps/web` вирішує, що команда робить у поточному surface.
- MVP використовує Browser Gamepad API.
- DualSense і Xbox controllers підтримуються через Standard Gamepad API mapping plus profile labels.
- Custom button remapping не входить у MVP.
- `@mk-combos/ui` лишається generic UI-kit без Mortal Kombat-specific builder state.
- Seeded і custom combo зберігають `movePath` як source of truth і `cachedNotation` для display/search.
- Backend не використовується.
- Персональні дані зберігаються тільки в браузері.
