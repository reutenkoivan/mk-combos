# UI-PAGE-003: Catalog

## Метадані

- Код: `UI-PAGE-003`
- Назва: `Catalog`
- Тип: `route-level page family`
- Статус деталізації: `Описано`
- Батьківська мапа: [UI.md](../UI.md)
- Батьківська сторінка: `UI-PAGE-001 App Shell`
- Варіанти: [MKXL](./UI-PAGE-003-MKXL.md), [MK1](./UI-PAGE-003-MK1.md)
- Основні компоненти: [`UI-CMP-007`](./UI-CMP-007.md), [`UI-CMP-008`](./UI-CMP-008.md), [`UI-CMP-009`](./UI-CMP-009.md), [`UI-CMP-010`](./UI-CMP-010.md), [`UI-CMP-011`](./UI-CMP-011.md), [`UI-CMP-012`](./UI-CMP-012.md), [`UI-CMP-013`](./UI-CMP-013.md), [`UI-CMP-015`](./UI-CMP-015.md)

## Призначення

Catalog є тристанним pathname-driven flow для вибору required context і перегляду
підготовлених combo routes. Character та variation/kameo завжди є частиною pathname;
query належить тільки optional filters готового result route.

## Канонічні маршрути

| Pathname | Стан | Surface |
| --- | --- | --- |
| `/:gameId/catalog/` | character selector | `01 / Fighter roster` |
| `/:gameId/catalog/:character` | specification selector | `02 / Variation` або `02 / Kameo` |
| `/:gameId/catalog/:character/:specification` | result catalog | breadcrumbs, filters, combo rows |

Приклади:

```text
/mkxl/catalog/
/mkxl/catalog/scorpion
/mkxl/catalog/scorpion/ninjutsu

/mk1/catalog/
/mk1/catalog/scorpion
/mk1/catalog/scorpion/sektor
```

`character`, `variation`, `kameo` і `specification` не читаються з query. Попередні
query-based context URL не мігруються, не редіректяться й не впливають на selection.
Невідомий search key не створює context і не перезаписує останній валідний каталог.

App Shell резолвить routes від найглибшого до найкоротшого: result, specification
selector, character selector. Усі три мають public route kind `catalog`.

## Володіння та межі

`apps/web` route/page owner:

- читає pathname params і optional search;
- резолвить installed game catalog adapter;
- готує pure UI models та semantic intents;
- координує navigation, draft/applied filters, persistence і detail return;
- показує recoverable invalid-context states.

Installed game adapter:

- надає короткі route slugs і canonical pathname builders;
- резолвить slug у internal ID;
- повертає game-owned picker layout/options;
- парсить лише filter search;
- виконує business recovery, filtering, persistence і summary preparation.

`packages/ui` не читає route, query, game data, local storage або Browser Gamepad API.
UI отримує prepared models, controlled focus і semantic callbacks.

Game-specific branching не виконується в page runtime. MKXL variation rules живуть у
`mkxl/*`; MK1 kameo/pair rules — у `mk1/*`.

## Character selector

`/:gameId/catalog/` займає весь workspace на кожному viewport.

- Command Deck header показує `01 / Fighter roster`, active game, roster telemetry та navigation hint.
- Selector canvas використовує той самий inset, що result list: `8px` до `40rem`
  та `12px` від `40rem`; окремого збільшеного desktop page padding немає.
- Character title block має compact density, щоб roster отримував доступну висоту
  без зменшення portrait або interactive target.
- Graph-paper background, dark chrome і пласкі bordered surfaces продовжують discovery references.
- Mobile, tablet і desktop використовують fluid portrait grid і game-owned
  `responsiveOrder ?? sourceIndex + 1`; authored character `row/column` не керують
  visual placement.
- Character label переноситься під `64×64px` portrait/fallback. Numeric combo count
  лежить badge-ом у правому верхньому куті portrait; selected/controller marker — у
  протилежному куті.
- Disabled slots залишаються видимими, мають readable reason і не selectable.
- Missing portrait має передбачений placeholder, а не broken image.
- Last catalog character може бути лише preselected/focused; auto-navigation заборонена.
- Pointer click або semantic controller `confirm` виконує push у `/:gameId/catalog/:character`.

Selected та controller-focused — різні стани й можуть збігатися на одному slot.

## Specification selector

`/:gameId/catalog/:character` також займає весь workspace.

- Path character є єдиним selected fighter source.
- Header показує `02 / Variation` або `02 / Kameo`.
- Locked strip містить `Selected fighter`, portrait, ім'я, active game і `02 / 02`;
  Catalog не додає до нього inline action.
- Повернення на `/:gameId/catalog/` виконується через `Catalog` breadcrumb (або
  відповідний пункт mobile drawer), browser Back чи semantic controller `back`.
- Grid містить лише options, підготовлені для path character.
- Command Deck Variation/Kameo використовує compact centered portrait grid на
  mobile, tablet і desktop; visual і controller order визначає
  `responsiveOrder ?? sourceIndex + 1`.
- Authored specification `row/column` лишаються у data/public contract для
  compatibility, але не керують Command Deck placement.
- Guidance показується один раз у header description; нижнього status hint під
  picker і локальної return button/ribbon немає.
- Last specification preselected тільки коли вона належить тому самому character.
- Confirm/click виконує replace у result pathname з порожнім search.

Зміна required context завжди скидає optional filters.

## Invalid pathname

- Невідомий `:character` показує recoverable state з переходом на root selector.
- Невідомий або incompatible `:specification` не записується у persistence.
- Якщо character валідний, recovery веде на його specification selector.
- Якщо character невалідний, recovery веде на root selector.
- Invalid route не підміняється останнім валідним context і не запускає redirect.

## Result catalog

`/:gameId/catalog/:character/:specification` рендерить:

1. `Catalog / [character icon] Character / [context icon] Variation|Kameo` у global breadcrumbs;
2. зафіксований full-width filter summary і optional persistence warning;
3. ordered Command Deck combo rows у єдиному вертикальному result scroller.

Catalog не рендерить власний footer і не додає bottom/scroll clearance.
Page scope постачає contextual command model для єдиної in-flow ribbon в App Shell.

`Catalog` breadcrumb відкриває root selector. `Character` breadcrumb відкриває
`/:gameId/catalog/:character`. Variation/Kameo є current crumb. Parent navigation
прибирає filter search; result page не дублює required context окремим rail.

Global Top Bar і filter chrome не рухаються разом зі списком. Локальний видимий
`Комбо · Навігація / Комбо` header не рендериться; result route має один `sr-only`
`h1` для доступної назви сторінки. Controller-focused row прокручується тільки в
межах result scroller через nearest positioning.

Command Deck використовує flat canvas без page/list/card outer frames. Між сусідніми
rows залишається один separator; control borders, index separator, selected marker і
focus-visible/controller-focused presentation зберігаються.

Prepared summary містить character/specification labels, semantic route steps,
notation, repetition count, emphasis, metadata, provenance та source IDs. Page не
має MKXL/MK1 conditionals для побудови summary.

Видимі command metadata мають стабільний порядок `Damage`, `Meter`, `Route`,
`Position`, `Difficulty`. Відсутнє значення пропускається; `Source` не входить у
цей result-row projection.

Catalog state готує theme-independent semantic tone з raw values до локалізації.
`routeClass` filter і `routeType` metadata є однією tone family; `difficulty`
використовує `easy / medium / hard` status progression. Source та future unknown
values не отримують semantic tone. `packages/ui` лише відображає prepared tone і
не знає game taxonomy.

## Optional filters

Спільна taxonomy:

- Position;
- Meter;
- Difficulty;
- Route class;
- Source: `curated | community | personal`.

`personal` показується disabled до появи відповідного data source. MKXL додатково
має optional visual Arena single-choice → visual Interactables multi-choice cascade.
Interactables не рендеряться до вибору Arena; зміна/очищення Arena прибирає
incompatible values. Required character/specification ніколи не дублюються як facets.

Filter drawer використовує applied/draft semantics:

1. Open копіює applied filters у draft.
2. Зміни й Reset filters оновлюють live preview.
3. Discard changes, modal dismiss або controller `back` відкидає draft.
4. Apply filters замінює search на поточному result pathname та зберігає last catalog.
5. Background preview лишається inert; detail доступний після Apply або Discard.

Controller `confirm` емітиться тільки для доступної option або enabled Discard,
Reset чи Apply action. `openActions` скидає draft як west action лише коли він не порожній.

Applied summary та його trigger постійно mounted під modal overlay, але стають inert
разом із result list. Drawer header володіє title/count і Discard/Reset/Apply; усі
wrapped draft chips лежать під header поза єдиним facet scroller. Drawer займає
повну ширину на mobile та не більше `42rem` на tablet/desktop. Discard/back повертає
focus до summary trigger.

Visible chip copy містить лише природне локалізоване значення без category prefix.
Remove action accessible name зберігає category та value. Applied і draft chip rows
wrap-ляться, показують кожен chip повністю й не створюють horizontal scroll.

Search serializer записує тільки підтримані non-default filters. Новий required
context завжди починається без optional search.

## Persistence і detail return

- Валідний result context зберігається як last catalog у game business slice.
- Invalid, incomplete або unknown-only input не перезаписує last valid catalog.
- Root selector відновлює лише character focus, без переходу.
- Specification selector відновлює specification тільки для того самого character.
- Return із Combo Detail відновлює готовий pathname і applied filter search; якщо
  saved context недоступний, fallback веде на `/:gameId/catalog/`.

## Controller

Окремі pure focus graphs існують для character selector, specification selector,
result list і filter drawer. Ribbon показує лише commands, які мають реальну
дію в active state.

| Surface | Navigation | `confirm` | `back` | `openFilters` | `openActions` |
| --- | --- | --- | --- | --- | --- |
| Character | linear prepared order: left/up previous, right/down next | select character | — | — | — |
| Specification | linear prepared order: left/up previous, right/down next | select specification | root selector | — | — |
| Result | ordered rows, якщо є cards | open focused detail | specification selector | open filter drawer | clear applied filters, якщо є |
| Invalid result | recovery target | recover Catalog | context back, якщо доступний | — | — |
| Filter drawer | header row `0`, facet rows від `1` | лише active action | discard | discard | reset non-empty draft |

Filter drawer є `exclusive` modal overlay, який блокує page actions й пропускає
`openGlobalMenu`. App Shell додає `Menu` останнім і рендерить glyphs за
applied notation display mode. Bridge емітить semantic commands; synthetic events і DOM
geometry не використовуються.

Для обох selector scopes prepared order дорівнює
`responsiveOrder ?? sourceIndex + 1`; disabled і placeholder slots пропускаються,
а navigation clamp-иться на краях без циклу.

## Responsive, motion і тема

- Selector лишається full-workspace на desktop, tablet і mobile.
- До `640px` header та telemetry stack-яться.
- До `390px` actions переходять у compact rows.
- Targets не менші за `44×44px`; зовнішній horizontal overflow заборонений.
- Character grid використовує
  `repeat(auto-fit, minmax(min(7.5rem, 100%), 1fr))`, має max width `96rem` і
  змінює column count без зміни prepared order або focused identity.
- Command Deck Variation/Kameo grid використовує
  `repeat(auto-fit, minmax(min(8rem, 100%), 10rem))`, `gap-4`, centered placement
  і minimum card height `11rem` на всіх responsive modes. Картка має `64×64px`
  icon/fallback, label під ним, numeric count badge і окремий selected/controller marker.
- На measured desktop content viewport `1536×872` повний MKXL roster із 33 options
  не створює scroll у App Shell outlet; на mobile вертикальний scroll дозволений,
  але horizontal overflow заборонений.
- Валідний result займає доступну висоту App Shell; body/outlet scroll лишається
  fallback для інших сторінок, а Catalog scroll належить result list.
- Короткий slide/crossfade працює лише без `prefers-reduced-motion`.
- Global preference `system | dark | light` однаково застосовується до selector,
  result і filter drawer.

## Accessibility

- Кожен slot має accessible name, selected state та readable disabled reason.
- Locked strip selector-а та global breadcrumbs мають semantic labels/actions.
- Route heading отримує focus після переходу без примусового scroll jump.
- Result route має рівно один доступний `h1`, прихований візуально; видимого
  дубльованого combo header немає.
- Telemetry/result count використовує polite announcement лише для значущих змін.
- Modal drawer має accessible name, focus trap, inert background і повертає focus
  до mounted summary trigger після закриття.
- Focus-visible контрастний у dark/light і не кодується тільки кольором.
- Missing assets і empty/error states залишаються читабельними без зображень.

## Acceptance

- Refresh працює на кожному з трьох pathname states.
- Root → character push → specification replace утворює очікувану browser history.
- Browser/controller Back повертає на правильний selector.
- Direct deep links, invalid slugs та incompatible pairs мають recoverable UI.
- Query context ігнорується без migration/redirect.
- Result route показує localized Character та Variation/Kameo в breadcrumbs із `/` separators.
- Character і Variation/Kameo breadcrumbs мають compact icons; за відсутності authored asset показується fallback glyph.
- Result page не дублює required context окремим rail; filter summary лишається видимим.
- Global Top Bar і filter chrome лишаються на місці; вертикально прокручується тільки
  result list. App Shell ribbon займає власний in-flow row, тому list не має
  штучного bottom/scroll clearance.
- Command rows показують `Damage`, `Meter`, `Route`, `Position`, `Difficulty` у цьому
  порядку, пропускають missing values і не показують `Source`.
- Pointer/touch activation на будь-якій не-contextual ділянці command row, включно з
  index cell, відкриває Combo Detail; окрема visible `View combo` кнопка не рендериться.
  Focused row так само відкривається semantic controller-командою `confirm`.
- Result canvas не має зовнішніх або дубльованих rectangular frames; row/control/focus
  separators і state markers збережені.
- Fluid character layout і compact portrait Variation/Kameo layout мають linear
  prepared-order focus на всіх viewport та перевірені контрактними тестами.
- Specification Catalog не показує inline return control або нижній status hint;
  header description, `Selected fighter`, breadcrumbs/drawer і browser/controller Back збережені.
- Selector і result використовують спільний Catalog canvas inset; desktop fit
  перевіряється за outlet geometry, а не за `body` scroll.
- Draft/Reset/Discard/Apply, inert live preview та focus restore покриті integration tests.
- Dark/light surfaces перевіряються на `1440`, `820`, `640` і `390px`.
