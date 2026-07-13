# Architecture

`mk-combos` is a static web application with one shared shell and separate business scopes for each supported Mortal Kombat game.

This document is the canonical source for package ownership, import direction, route shape, local state shape, backup ownership, and the process for adding another game.

## Правила Роботи В Репозиторії

Перед будь-якою зміною в репозиторії спочатку прочитай цей документ як робочий
контекст. Далі визнач власника зміни, перевір дозволений напрям імпортів і вибери
найвужче місце, де зміна природно належить системі.

Зміни додаються або розширюються за такими правилами:

- shared `packages/*` отримують тільки багаторазові platform concepts, які не знають
  конкретних ігор;
- game-specific behavior залишається всередині відповідного game scope;
- route-level pages оркеструють business state, готують view models і передають їх у
  pure UI components;
- public contracts мають бути стабільними, game-agnostic і forward-compatible.

React-код максимально використовує stable API React 19.2 або новішої stable
версії, якщо семантика API відповідає задачі та не порушує ownership. Це є
архітектурною вимогою, а не вимогою формально використати кожен новий API:

- `useTransition` позначає non-urgent оновлення prepared view або navigation state;
  controlled input value, focus і негайний open/close state залишаються urgent;
- `useDeferredValue` зберігає попередній важкий prepared view, коли producer
  значення не можна перевести в transition; він не замінює debounce, source state
  або controlled input value;
- `useActionState` володіє pending/result/error state конкретного action workflow,
  але не переносить persistence, validation або game-specific rules із domain owner;
- `<Activity>` зберігає state тимчасово прихованої stateful surface. Якщо UI-контракт
  вимагає прибрати hidden focus targets, controller scope або дубльовану interactive
  surface, відповідна гілка повністю unmount-иться;
- `useEffectEvent` використовується тільки для non-reactive callback, який
  викликається з Effect або іншого Effect Event. Він не є універсальною заміною
  event handler-а чи способом приховати Effect dependencies;
- mutually exclusive UI states рендеряться одним state-driven exhaustive branch;
  state token є авторитетним і не допускає одночасного показу суперечливих surfaces.

React API викликаються безпосередньо в природному owner-і або всередині
problem-specific hook із власним контрактом та lifecycle. Generic wrappers, які
лише перейменовують React API або делегують йому аргументи, не створюються. React
Compiler не скасовує вимоги до правильного owner-а, state modeling, transition
priority, stable public contracts і accessibility lifecycle.

Canary React `<ViewTransition>` не використовується, доки він не стане stable у
підтримуваній версії React. Route-level view transitions належать `apps/web` і
реалізуються через TanStack Router та browser View Transition API як progressive
enhancement; відсутність browser support не ламає navigation, а
`prefers-reduced-motion` вимикає несуттєву анімацію.

У UI-коді layout не будується через margin. Utility-класи й CSS-властивості
`m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*`, `ml-*`, `mr-*`, `space-x-*`,
`space-y-*` і `margin*` не використовуються для позиціонування або відступів.
Контейнер володіє розміщенням свого контенту через `flex` або `grid`, `gap-*`,
`p-*`, `justify-*`, `items-*`, `content-*` і `self-*`.

Інтерактивний UI зобовʼязаний візуально й семантично відображати кожен стан,
який підтримує його контракт. Для відповідних controls та items це охоплює
`hover`, `focus-visible`, `active`/`pressed`, `open`, `selected`/`current`,
`disabled` і `loading`/`busy`; fields додатково відображають `read-only` та
validation tones на кштал `invalid`, `success` і `warning`. Accessibility
semantics не замінюють visible feedback, а visible feedback не замінює
ARIA/native semantics.

Оголошення semantic variant, `data-*` або ARIA attribute без реального style
wiring не вважається реалізацією стану. `packages/ui` централізує це wiring у
shared recipes через справжні CSS pseudo-states і Base UI state attributes;
component-specific recipe може розширити mapping, але app і game scopes не
відтворюють його локальними consumer classes. Interaction affordance має такі
інваріанти:

- доступна action surface на пристроях із hover показує hover feedback і
  використовує `cursor: pointer`;
- `disabled` і `loading`/`busy` не показують enabled hover, не активуються та
  використовують відповідно `cursor: not-allowed` і `cursor: wait`;
- editable і selectable text surfaces використовують `cursor: text`;
- static або current-only presentation elements не отримують action hover чи
  pointer cursor;
- specialized cursors на кштал `grab`, `grabbing` або resize додаються тільки
  разом із реальною mouse/pointer gesture або handle, а не для декоративних чи
  backdrop surfaces.

Перехід між states не змінює геометрію компонента, не приховує наявний semantic
tone і зберігає контраст у light, dark, standard та increased-contrast themes.
Color не є єдиним сигналом критичних selected, focused, disabled, loading або
validation states. Новий або змінений інтерактивний component має recipe tests
на підтримані states і їхні суттєві combinations, component tests на wiring та
inert disabled behavior, а public states фіксуються у Storybook.

Зовнішній ввід системи завжди нормалізується на boundary через Zod `parse` або
`transform` перед використанням як typed value. Це стосується зокрема
`process.env`, browser/native APIs, persisted payloads, route/query input і
network/file input. Boundary validation не замінюється апкастом: новий код має
надавати перевагу schema-derived types, type guards, typed builders і named
algorithm stages. Алгоритми проєктуються з фокусом на O(n) по часу й памʼяті,
а структура коду має зменшувати когнітивне навантаження під час читання.
`as const` для статичних literal facts і value sets лишається дозволеним.
Неминучий assertion допускається тільки у вузькому named boundary helper з
поясненням, якщо альтернатива погіршує O(n) або суттєво ускладнює код.

Публічний закритий semantic set постачається як runtime dictionary, schema і похідний тип:

- dictionary оголошується в `value.ts` як exported object з `as const`;
- schema у `schema.ts` використовує `z.enum(dictionary)`;
- TypeScript type у `type.ts` виводиться через `z.output<typeof Schema>`;
- runtime consumers імпортують dictionary з `value.ts`, а не schema з `schema.ts`;
- ключ dictionary збігається з wire value; значення, які не є JavaScript identifiers,
  мають quoted keys. Наявні канонічні semantic keys не перейменовуються лише заради
  механічної міграції;
- composed sets будуються через object spread, а iteration виконується через
  `Object.values(dictionary)`;
- якщо порядок є окремим контрактом, власник оголошує явно названий
  `...Order` або `...Sequence` array, побудований зі значень dictionary;
- у cycle-sensitive game-data scopes internal `constants.ts` може володіти dictionary,
  але public `value.ts` re-export-ить той самий object by identity. Authored packs не
  імпортують compiled dataset modules;
- raw semantic literals дозволені тільки всередині dictionary, exact-value contract
  assertions і typed або schema-validated authored data packs. Runtime branching,
  comparisons, dispatch, defaults і consumer props використовують dictionary values;
- відкриті string/number spaces, DOM/ARIA/native prop unions, суто internal rendering
  types і справжні ordered authored collections не закриваються штучним dictionary.

Було:

```ts
export const operationStates = ["idle", "running"] as const;
export const OperationStateSchema = z.enum(operationStates);
export type OperationState = (typeof operationStates)[number];

if (state === "idle") {
  // ...
}
```

Стало:

```ts
export const operationStates = {
  idle: "idle",
  running: "running",
} as const;

export const OperationStateSchema = z.enum(operationStates);
export type OperationState = z.output<typeof OperationStateSchema>;

if (state === operationStates.idle) {
  // ...
}
```

Runtime helpers живуть у `runtime.ts`. Public subpaths додаються свідомо через package
exports, publish exports, build entries, contract metadata і тести, які фіксують exact
wire values, schema acceptance/rejection, derived type usage та dictionary identity у
`mkCombos*.valueSets`.

Код видаляється тільки після того, як його ownership перенесено, поведінку замінено
або Knip/Biome підтверджують, що він не використовується. Разом із видаленням треба
прибрати відповідні exports, tests, dependencies, docs і architecture visibility.
Persistence, routes, backup, seeded data і business-rule code не видаляються без
migration, recovery або validation path.

Фінальний стан зміни не має містити dead code або unused exports. Зміни, що чіпають
contracts, повинні мати тести на public exports, importable subpaths, schema strictness,
open `GameId` behavior і runtime helpers. Зміни, що чіпають межі модулів або напрям
імпортів, повинні проходити architecture/import checks.

## Selected Technology Stack

The application is implemented with TypeScript and React.

- Package manager: Bun.
- Monorepo orchestration: Turborepo.
- Web framework: TanStack Start.
- Form state: `@tanstack/react-form`.
- Data table engine: [TanStack Table](https://tanstack.com/table/latest) through `@tanstack/react-table`.
- CSS layer: Tailwind CSS v4 stable with `@tailwindcss/vite`.
- UI styling recipes: `tailwind-variants`, with `clsx` and `tailwind-merge` for class composition.
- UI foundation: Base UI through `@base-ui/react`.
- Icon foundation: `lucide-react`.
- Global state manager: Zustand.
- Combo builder canvas: React Flow through `@xyflow/react`.
- Package builds: `tsdown`.
- Component workshop and documentation: Storybook.
- Tests: Vitest, Playwright, Testing Library, and jsdom.
- Development and security tooling: Biome, Knip, Lefthook, Sherif, Sheriff, and Gitleaks.
- Hosting: GitHub Pages.
- Validation: Zod.
- Personal data: browser-local only.

Shared build and test configuration belongs in internal contract packages:

- `contracts/build` centralizes shared `tsdown`, Vite, Tailwind, React, and Storybook Vite configuration.
- `contracts/test` centralizes shared Vitest, React Testing Library, Playwright configuration, and test setup.
- React source compiled in this repository must use the shared React Compiler wiring from
  `contracts/build` or `contracts/test`. React library packages build with
  `createReactTsdownConfig`; local opt-outs or ad hoc compiler setup require an explicit
  architecture exception.

Tooling ownership:

- Biome owns formatting, linting, and restricted import enforcement.
- Knip detects unused files, dependencies, and exports.
- Lefthook runs local Git hooks.
- Sherif checks monorepo package and dependency consistency.
- Sheriff (`@softarc/sheriff-core`) checks architecture import-boundary rules.
- Gitleaks scans for committed or staged secrets.

UI and app import boundaries:

- `packages/ui` wraps Base UI primitives and exposes project-owned React components.
- `packages/ui` owns every active numbered `UI-CMP-*`, including shared builder presentation components and hooks.
- `packages/ui` implements shared component styling through `tailwind-variants` recipes.
- `packages/ui` owns the icon facade. App pages and game scopes import icons only from `@mk-combos/ui/icons/{icon-name}`.
- Static game-themed artwork may be published through `@mk-combos/ui/icons/game/{game-id}/*` when it contains only visual assets and opaque entity IDs. Game rules, catalog validation, and imports from game scopes remain forbidden in `packages/ui`.
- Direct `lucide-react` imports are allowed inside `packages/ui` icon modules only.
- `packages/ui` may use React Flow for the visual combo builder canvas.
- App-level forms use `@tanstack/react-form` for form state. Zod remains the schema and validation layer.
- `packages/builder-core` and game business scopes own combo graph rules, validation, replay, and persistence shape.

## Стан На Рівні Сторінки І Pure UI Контракти

Route-level сторінки в `apps/web` є source of truth для стану сторінки, handler-ів сторінки та business orchestration. Сторінка може тримати стан безпосередньо в page component або викликати page-level custom hook, але саме page component декларує цю бізнес-логіку і передає підготовлений результат у child UI components.

Shared UI components є controlled/pure поверхнями:

- component props містять prepared view models, selected/open/focused/expanded state, availability, validation messages і semantic handlers;
- component handlers приймають abstract intent payloads, наприклад `{ id, value, mode, reason, sourceSurface, sourceFocusTarget }`;
- public component handlers не приймають `MouseEvent`, `KeyboardEvent`, `PointerEvent`, `ChangeEvent`, `FormEvent`, raw DOM nodes, `event.target` або `event.currentTarget`;
- browser, DOM, form-library, controller і native file-picker events нормалізуються всередині page, page-level hook або primitive wrapper до того, як потраплять у feature UI contracts;
- component може використовувати internal DOM або Base UI mechanics для accessibility і focus implementation, але ця internal mechanics не може стати source of truth для route, business, persistence, selection, open/closed або validation state.
- responsive composition використовує prepared `UiResponsiveMode` (`mobile`, `tablet`, `desktop`); page/page-hook володіє active focus scope та focused target, а `@mk-combos/ui/focus-navigation/*` надає strict game-agnostic graph contracts і deterministic runtime helpers без DOM geometry;
- controller commands викликають semantic methods напряму; synthetic `KeyboardEvent`, synthetic click або передавання raw Gamepad/DOM events у public handlers не допускаються.
- ordinary page UI використовує один flat canvas; cards, full rectangular borders і shadows не застосовуються як default grouping mechanism, а elevation належить dialogs, menus, popovers і floating controller surfaces;
- standalone icon-only controls використовують typed `icon` presentation: transparent background/border у всіх states, зовнішній focus ring і stable accessible hit area; DOM-shape selectors не визначають presentation contract.

Component-local закритий semantic set без schema, зокрема набір semantic actions, є частиною
публічного контракту компонента. Файл-власник компонента оголошує цей набір на module scope і
постачає runtime dictionary та похідний `typeof`-тип через власний public subpath:

```ts
export const exampleComponentActions = {
  close: "close",
  open: "open",
} as const;

export type ExampleComponentAction =
  (typeof exampleComponentActions)[keyof typeof exampleComponentActions];
```

Props, intent aliases, `emit` helpers і component implementation використовують похідний тип,
а dispatch та comparison використовують значення dictionary. Action-літерали залишаються
тільки всередині dictionary та в contract assertions, які фіксують точні wire values. Якщо
компонент має кілька action-каналів або відкритий action-канал, назва dictionary уточнює
ціль через suffix на кштал `MenuActions`, `PanelActions` або `ChangeActions`. Consumer-provided
ids та інші відкриті action spaces не закриваються штучним dictionary.

Component-local dictionary є свідомим винятком із загального поділу contract modules:
shared або schema-backed value sets живуть у `value.ts`, runtime validation — у `schema.ts`,
а schema-derived types — у `type.ts`.

Якщо механіку винесено в module, module експортує pure UI component і custom hook. Hook готує state, derived models і semantic handlers. Pages викликають hook і передають результат hook-а в pure UI component. UI component ніколи не імпортує game data, browser persistence, route mutation або controller bridge APIs напряму.

Бізнес-логіка для React проєктується як розділення `domain source` і `observable domain state`.

`Domain source` є канонічним власником доменного значення, інваріантів, правил зміни і semantic methods. Усі зміни домену проходять тільки через ці methods. Source може мати lifecycle status, state machine або іншу доменну форму стану, але конкретна форма залежить від домену.

`Observable domain state` не змінює source. Він виводить із source стабільну read-facing форму для споживання: flags, availability, validation, labels, status projections, selection/open/focused стани та інші derived значення для page flow, UI components і accessibility.

У React layer `domain source` і `observable domain state` поставляються як окремі domain-specific custom hooks. React components читають view data тільки з `observable domain state`, але взаємодіють із `domain source` через його semantic methods. Компоненти не читають raw domain source як view data, не реконструюють доменні правила самостійно і не виконують mutations поза source methods.

### Стратегія Побудови І Розвитку Бізнес-Логіки

Бізнес-логіка проєктується навколо класу проблеми, її source of truth, інваріантів,
lifecycle і semantic operations, а не навколо конкретної сторінки, компонента або
поточного способу реалізації. Module, domain source, runtime helper, state machine або
custom hook є лише формою постачання цієї логіки й не визначає її ownership.

Для кожної нової задачі використовується такий порядок рішень:

1. Визначити клас проблеми, інваріанти та найвужчого owner-а відповідно до import
   direction.
2. Знайти наявну бізнес-логіку з відповідним контрактом і використати її без
   дублювання правил у consumer-і.
3. Якщо поточний use case є загальним продовженням того самого класу проблем і
   розширення допомагає вирішити поточну задачу, розширити наявну реалізацію для
   загального випадку. Розширення не повинно додавати caller-specific branching,
   послаблювати інваріанти або переносити game-specific знання у `packages/*`.
4. Якщо частина нової логіки має окрему відповідальність, source of truth, lifecycle,
   набір інваріантів або semantic operations, винести її в нову abstraction у
   найвужчому owner scope. Другий готовий consumer не є обовʼязковою умовою, але нова
   abstraction повинна представляти самостійну категорію проблеми, а не лише
   механічно приховувати кілька рядків коду.
5. Якщо новий use case точніше класифікує проблему й показує, що поточний контракт
   змушує consumers будувати adapters, дублювати derived rules або використовувати
   незручний API, змінити наявну реалізацію та одночасно мігрувати її consumers.
6. Залишити логіку локальною лише тоді, коли узагальнення не створює самостійного
   контракту або порушує ownership та import boundaries.

Якісна reusable business abstraction називає проблему та її інваріанти, володіє
правилами зміни й не знає конкретного consumer-а. Consumers не реконструюють
lifecycle, validation, availability або інші derived domain rules. Generic wrappers
без власного problem contract не створюються лише заради скорочення коду.

Зміни public contracts мають бути additive і backward-compatible за замовчуванням.
Якщо reclassification потребує breaking change, у тій самій зміні оновлюються всі
consumers, tests, exports і documentation; попередня та нова реалізації не залишаються
паралельно без явної migration або compatibility потреби.

План кожної зміни бізнес-логіки фіксує owner scope, клас проблеми, перевірені наявні
реалізації, обране рішення (`reuse`, `extend`, `extract`, `reclassify` або `local`),
контракт, інваріанти, affected consumers і verification. Конкретна форма реалізації
обирається після цього: pure runtime logic залишається в domain owner, React custom
hook використовується лише для React orchestration або observable integration, а
presentation logic не стає власником game-specific business rules.

## Root Scopes

The repository is split by ownership:

```text
mk-combos/
  packages/
    contracts/
    builder-core/
    controller-bridge/
    ui/

  mkxl/
    data/
    catalog/
    builder/
    business/

  mk1/
    data/
    catalog/
    builder/
    business/

  apps/
    web/
```

`packages/*` is the shared platform layer. It contains reusable contracts, UI primitives, active numbered UI components, builder primitives, builder presentation components, and controller input normalization.

`mkxl/*` is the MKXL business scope. It owns MKXL data, schemas, catalog behavior, builder behavior, validation, coverage, and the MKXL app-facing business entry point.

`mk1/*` is the MK1 business scope. It owns MK1 data, schemas, catalog behavior, builder behavior, validation, coverage, and the MK1 app-facing business entry point.

`apps/web` is the only product application. It installs the supported games, resolves the active game from the URL, renders shared routes, owns local browser persistence, and delegates game behavior to the active business entry point.

## Shared Packages

### `packages/contracts`

Package name: `@mk-combos/contracts`.

Owns stable cross-game contracts only:

- `GameId` as a string value, not a closed union of known games.
- `ComboRef`, source identifiers, route source identifiers, localized text, notation display mode, generic backup envelope types, and shared result/error shapes.
- Generic app-facing interfaces that are already common across games.

It does not know MKXL variations, MKXL stages, MK1 kameos, concrete combo schemas, concrete graph schemas, or installed game lists.

### `packages/builder-core`

Package name: `@mk-combos/builder-core`.

Owns reusable builder primitives:

- graph node/edge primitives;
- replay result shapes;
- transition result helpers;
- runtime-state utility interfaces;
- generic stale/invalid result structures.

It does not compose MKXL or MK1 graphs by itself. Game-specific graph composition lives in the game business scope.

### `packages/controller-bridge`

Package name: `@mk-combos/controller-bridge`.

Owns Browser Gamepad API capability/permission/visibility normalization, controller lifecycle, single-controller session ownership, profiles, normalized input, semantic commands, repeat/dead-zone behavior, neutral arming after first gesture/reconnect/resume, and controller hint metadata.

It does not know routes, combo data, game-specific builder rules, local storage, or installed games.

### `packages/ui`

Package name: `@mk-combos/ui`.

Owns all active numbered UI components and generic React primitives:

- buttons, dialogs, controls, segmented controls, list primitives, picker primitives, filter primitives;
- all active `UI-CMP-*` implementations;
- `NotationRenderer` and the UI-owned notation icon registry;
- game-agnostic responsive/focus-navigation contracts and deterministic helpers;
- game-agnostic React hooks for page-owned presentation open state, semantic intent adapters,
  field accessibility bindings, responsive mode and deterministic focus navigation;
- `UI-CMP-038 Controller Access Gate` as the pure shell-facing presentation for prepared controller capability state;
- `ComboWhiteboard`, `useComboWhiteboardModel`, internal `movePicker`, `ComboFrameMeter`, and `useComboFrameMeterModel`;
- builder layout components and read-only detail rendering support;
- generic cards and layout primitives when they do not encode game rules;
- project icon facade exports.

Hooks готують builder presentation view models і semantic handler payloads із page-provided builder adapter state. `UI-PAGE-006` і `UI-PAGE-004` викликають ці hooks на рівні сторінки, після чого рендерять pure UI components із prepared props. `@mk-combos/ui` не вирішує, чи move валідний, і не пише local state.

It does not own MKXL/MK1 business logic, data validation, graph composition, route parsing, or local persistence.

## Game Business Scopes

Each game has one app-facing business entry point. The entry point reduces abstraction pressure: the web app does not need a deep central framework, but it also does not spread game-specific rules across pages.

### MKXL

```text
mkxl/
  data/       # @mk-combos/mkxl-data
  catalog/    # @mk-combos/mkxl-catalog
  builder/    # @mk-combos/mkxl-builder
  business/   # @mk-combos/mkxl-business
```

`mkxl/business` exports `mkxlBusiness`.

The MKXL scope owns:

- `mkxl/data`: roster, variation data, movelists, seeded combos, move graph data, stages, interactables, localized content, data schemas, coverage targets, and seeded data validation;
- `mkxl/catalog`: catalog selectors, route context parsing and recovery, optional stage/interactable filter behavior, and combo summary shaping;
- `mkxl/builder`: graph composition, stage/interactable usage rules, replay, valid next move calculation, frame checks, stale detection, and custom combo output;
- `mkxl/business`: app-facing catalog/detail/lists/builder/backup/validation adapters.

`mkxl/data` is the concrete reference for the target `mk*/data` data-layer pattern. Game data
layers separate authored data from resolved public values. Versioned authored packs live under
`mk*/data/src/packs/<pack-id>` and declare static game facts explicitly with `as const`. Pack files
own source facts such as ids, labels, source ids, roster order, picker slots, stage/interactable
fields, move records, and combo route intent. Runtime compilation inside the game data package
derives indexes and projections such as id lists, variation maps, move trees, flat movelists, combo
`movePath`, combo `cachedNotation`, and generated graph inputs. Full data entities must not be
wrapped in broad authoring helpers; helpers may operate only on narrow derived subfields or on
complete data packs during compilation. Balance patches or new game versions extend a base authored
pack with explicit add/replace/retire data instead of rewriting the active dataset. Pack-owned
notation registries are authored source facts: move files reference registry values instead of
retyping FGC notation strings inline. Future `mk1/data` work follows this pattern unless a
game-specific exception is documented in this architecture.

### MK1

```text
mk1/
  data/       # @mk-combos/mk1-data
  catalog/    # @mk-combos/mk1-catalog
  builder/    # @mk-combos/mk1-builder
  business/   # @mk-combos/mk1-business
```

`mk1/business` exports `mk1Business`.

The MK1 scope owns:

- `mk1/data`: main fighter roster, kameo roster, movelists, seeded combos, move graph data, localized content, data schemas, coverage targets, and seeded data validation;
- `mk1/catalog`: catalog selectors, route context parsing and recovery, character/kameo filtering, and combo summary shaping;
- `mk1/builder`: graph composition, kameo pairing and transition rules, replay, valid next move calculation, stale detection, and custom combo output;
- `mk1/business`: app-facing catalog/detail/lists/builder/backup/validation adapters.

## Business Entry Point Shape

Each business entry point exports one object for the web app:

```ts
export const mkxlBusiness = {
  id: "mkxl",
  label: "MKXL",
  routes,
  catalog,
  detail,
  lists,
  builder,
  backup,
  validation,
}
```

```ts
export const mk1Business = {
  id: "mk1",
  label: "MK1",
  routes,
  catalog,
  detail,
  lists,
  builder,
  backup,
  validation,
}
```

This shape is intentionally practical rather than heavily generic. The shared expectation is that the web app can:

- list installed games;
- resolve route context;
- render catalog/detail/list/builder surfaces through prepared page models, page-level hooks і semantic handlers;
- validate game-owned local data;
- validate and serialize game-owned backup slices.

Concrete context types stay inside the game scope.

## Web Installation Point

The web app installs supported games in one file:

```text
apps/web/src/game-business/installed-games.ts
```

Expected shape:

```ts
import { mkxlBusiness } from "@mk-combos/mkxl-business"
import { mk1Business } from "@mk-combos/mk1-business"

export const installedGames = [
  mkxlBusiness,
  mk1Business,
] as const
```

This is the only place in `apps/web` that imports game business entry points directly.

Pages may branch by `gameId` only to choose an installed business entry point. They must not reimplement MKXL or MK1 rules inline.

## Routes

Routes are generic and game-prefixed:

```text
/:gameId/catalog
/:gameId/combos/:source/:comboId
/:gameId/lists
/:gameId/builder
/settings
```

Examples:

```text
/mkxl/catalog
/mkxl/combos/seeded/scorpion-bnb-001
/mkxl/lists
/mkxl/builder

/mk1/catalog
/mk1/combos/custom/local-1729
/mk1/lists
/mk1/builder
```

The route prefix is the source of truth for active game on deep links. Settings store the default or last active game, but route-prefixed links do not depend on previous local settings.

## Local State

Local state is keyed by `GameId`:

```ts
type LocalAppState = {
  settings: AppSettings
  games: Record<GameId, GameUserState>
}
```

`GameUserState` is an app-level envelope for local user data such as custom combos, named lists, stale markers, and last catalog context. Game-specific payloads inside that envelope are owned and validated by the active game business entry point.

The app must not hardcode fixed state properties for specific installed games. Game slices are addressed through the registered `GameId`.

The app should create or recover a game slice when a registered `gameId` is opened.

## Backup

Full backup is an app-level envelope with game slices:

```ts
type BackupEnvelope = {
  version: number
  exportedAt: string
  settings: AppSettings
  games: Record<GameId, unknown>
}
```

The web app validates the envelope. Each registered business entry point validates its own slice.

Import replace is allowed only after:

- the envelope is valid;
- settings are valid;
- every known installed game slice is valid or recoverably absent according to the backup version policy;
- unknown future game slices are handled by the explicit forward-compatibility policy.

Seeded game data is never imported or replaced by backup.

## Import Direction

Allowed dependency direction:

```text
apps/web
  -> packages/*
  -> mkxl/business
  -> mk1/business

mkxl/business
  -> mkxl/catalog
  -> mkxl/builder
  -> mkxl/data
  -> packages/*

mk1/business
  -> mk1/catalog
  -> mk1/builder
  -> mk1/data
  -> packages/*

packages/*
  -> packages/*
```

Forbidden:

- `packages/*` importing from `mkxl/*` or `mk1/*`;
- `mkxl/*` importing from `mk1/*`;
- `mk1/*` importing from `mkxl/*`;
- page-level web code importing from `mkxl/data` or `mk1/data` directly;
- hardcoded game-specific business rules in shared UI components.

## Adding A New Game

Adding a new game should be localized:

```text
mk-new/
  data/
  catalog/
  builder/
  business/
```

Then update only:

```text
apps/web/src/game-business/installed-games.ts
```

Example:

```ts
import { mkNewBusiness } from "@mk-combos/mk-new-business"

export const installedGames = [
  mkxlBusiness,
  mk1Business,
  mkNewBusiness,
] as const
```

No shared package should change unless the new game exposes a genuinely reusable platform concept.

The new game must provide:

- seeded data and validation;
- catalog behavior;
- builder behavior;
- backup slice validation;
- routes and display labels;
- tests and coverage validation.

## Balance Patches

A balance patch or content update for an existing game stays inside that game's scope. It is not a new root business scope.

Examples:

- MK1 patch metadata belongs in `mk1/data`; kameo transition effects belong in `mk1/builder`.
- MKXL stage interaction corrections belong in `mkxl/data` and `mkxl/builder`.

## Documentation Rule

UI and UX documents may describe user-visible behavior, stable reference codes, and page/component contracts. Architectural ownership should point back to this document instead of duplicating package rules in every file.
