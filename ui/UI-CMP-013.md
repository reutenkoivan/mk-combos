# UI-CMP-013: Filter Control Group

## Метадані

- Код: `UI-CMP-013`
- Назва: `Filter Control Group`
- Тип: `controlled result filters`
- Статус деталізації: `Описано`
- Батьківська сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Sibling result components: [`UI-CMP-010`](./UI-CMP-010.md), [`UI-CMP-011`](./UI-CMP-011.md)

## Призначення

`UI-CMP-013` є одним controlled composite: постійно mounted compact applied-filter
summary містить trigger, а modal drawer містить controlled draft editor і live
preview telemetry. Summary та editor більше не є окремими presentation modes.

Component не володіє applied/draft state, не серіалізує search і не виконує
filtering. Catalog page передає окремі prepared applied/draft models, open/busy
state, focus та semantic handlers.

## Taxonomy

Prepared facets можуть містити:

- Position;
- Meter;
- Difficulty;
- Route class;
- Source;
- MKXL only: Arena;
- MKXL only: Interactables.

Character, variation і kameo є pathname context та ніколи не дублюються як facets.
Source `personal` може бути видимим disabled із readable reason.

## Summary presentation

Summary показує:

- назву filters;
- applied result count;
- active chips;
- remove action для кожного chip;
- Clear action;
- Open Filters action.

Summary показує лише фактично застосовані chips: inactive facets і placeholder tiles
на кшталт `—` у цій області відсутні. Summary не показує draft controls і не
змінює search напряму; page owner одразу commit-ить remove/Clear intent у canonical
result URL.

Active chips використовують однакову `Refined Capsule` presentation у summary та
drawer: `rounded-full`, мінімальна висота `32px` і один видимий `16px` remove icon.
Уся capsule є remove target та focus surface, тому button, focus ring і видимий chip
мають однакову геометрію без nested або overflow ring. Label показується повністю,
переноситься за словами й не має truncation. Chip container використовує `flex-wrap`
і `4px` gap по обох осях; inter-chip spacing не створюється padding/margin самих
items. Горизонтальний chip scroller і приховані за ним значення заборонені.

Видимий chip показує лише prepared природну назву значення без category prefix та
двокрапки. Category лишається у remove action accessible name, щоб однакові значення
різних facets були однозначними для assistive technology.

Prepared `tone` доповнює текст значення: `difficulty` та `routeClass` використовують
той самий raw-value tone, що й відповідні `difficulty` та `routeType` metadata у
combo row. Unknown values і Source лишаються neutral; color ніколи не замінює label.
Enabled `hover` і `active`, внутрішній `focus-visible` ring та `disabled` feedback
застосовуються до всієї capsule, не виходять за її візуальну геометрію і не
приховують tone.

Open Filters і Clear обрамляють compact center cell, у якому result count та chips
утворюють одну wrapping group. Наступні рядки chips залишаються всередині цієї group
без clipping або horizontal scroll. Result count є пасивною `aria-live` telemetry
поза Open control. Summary не має component outer border, nested framed cards або
`divide-x`; page-level filter/result separator лишається єдиною структурною межею.

## Drawer presentation

Filter drawer є modal overlay поверх result list та містить:

```text
FilterDrawer
├── header
│   ├── title + live result telemetry
│   └── icon Discard + icon Reset + labeled Apply
├── wrapped draft chips, лише коли draft не порожній
└── scrollable prepared facet rows
    ├── compact choice rows
    └── full-width visual choice grids
```

Drawer вирівняний до лівого краю, має full viewport height, повну ширину на mobile
та maximum width `42rem` на tablet/desktop. Header і chip band лежать поза єдиним
facet scroller. Backdrop, focus trap та inert background належать modal primitive;
result list лишається змонтованим під overlay як live preview, але не інтерактивним.

Drawer має лише одну end-edge межу на tablet/desktop і жодного outer frame на
mobile. Header/chip tone, gaps і selected fills групують контент без repeated
`border-top`, `border-bottom`, `divide-*` або framed facet rows. Compact choices є
пласкими rows, visual choices — subtle filled tiles; focus ring і selected Check
зберігаються.

Draft active-filter chips повторно використовують ту саму `Refined Capsule`
presentation, geometry та interaction feedback, що й applied chips у summary.

## Public behavior

- `applied` і `draft` models завжди controlled.
- Single- і multi-choice selection емітять спільний semantic `toggleOption` intent.
- Reset filters очищує лише draft і не змінює required pathname context або URL.
- Discard, Escape, backdrop dismiss і swipe close емітять discard; page owner
  відкидає draft.
- Apply filters емітить `applyFilters`; page owner canonicalize-ить result search.
- Applied chip remove/Clear одразу змінюють canonical result search.
- Disabled/busy state блокує зміни й Apply, але discard лишається доступним.

Optional changes одразу оновлюють preview model. Це live preview, а не автоматичний
commit: applied search змінюється тільки після Apply. Background preview не може
відкрити detail, доки modal drawer активний.

## Applied/draft lifecycle

```text
Open:    applied → draft
Edit:    draft → live preview
Reset:   empty draft → live preview
Discard: discard draft → applied result
Apply:   draft → canonical search + persistence
Summary remove/Clear: applied → canonical search + persistence
Detail:  доступний після Apply або Discard
```

Цей lifecycle належить Catalog page. `UI-CMP-013` залишається pure controlled view.

## Semantic intents

- `openFilterGroup` / `discardDraftFilters`;
- `toggleDraftOption`;
- `removeAppliedFilter` / `removeDraftFilter`;
- `clearAppliedFilters` / `resetDraftFilters`;
- `applyFilters`.

Intent payload містить filter/control IDs, value та interaction reason, але не
browser event object.

## Controlled focus

Filter drawer приймає stable focus IDs для:

- facet options;
- Discard;
- Reset;
- Apply filters.

`controllerFocusedControlId` керує окремим visual focus state. Component не читає
DOM geometry і не створює synthetic click/keyboard events.

Controller mapping:

- D-pad — рух по prepared semantic graph;
- `A` — toggle/select option або activate focused action;
- `B` або `Y` — discard;
- `X` — reset draft.

DOM focus на open переходить до named dialog, trap-иться всередині drawer і після
close повертається до постійно mounted summary trigger. Controller header actions
займають logical row `0`, а facet rows починаються з row `1`.

Поки filter drawer active, background combo rows не отримують semantic commands.

## Dependent facets

MKXL Arena → Interactables cascade готується game business owner-ом. Arena є visual
optional single-choice, а Interactables — visual multi-choice. Component лише:

- не рендерить Interactables до вибору Arena;
- рендерить available/current Arena та available/current Interactables;
- показує локалізований empty message, коли selected Arena не має Interactables;
- показує recovered draft;
- емітить вибір доступного value.

Зміна або очищення Arena прибирає incompatible Interactables у game-owned recovery.

MK1 не отримує Arena або Interactables facets.

## Responsive

- Prepared `responsiveMode` однаково керує UI grid і controller graph.
- Compact facets утворюють дві колонки на tablet/desktop і одну на mobile.
- Visual facets займають повний ряд: `2` option-колонки на mobile, `3` на tablet,
  `4` на desktop. Кожен square track має fluid width до `12rem`, тому неповний ряд
  вирівнюється зліва й не розриває Arena → Interactables надмірною висотою.
- На tablet/desktop title/telemetry та header actions лежать в одному row. На mobile
  actions переходять у другий header row без horizontal overflow.
- Facet labels і disabled reasons wrap-ляться без overlap. Видимий count badge містить
  лише число; повний localized count лишається в accessible name.
- Facet та header action targets не менші за `44×44px`; active chip remove target
  займає всю capsule з мінімальною висотою `32px`.
- Icon-only Discard/Reset мають `44×44px`; labeled Apply не стискає localized text.
- Зовнішній horizontal overflow заборонений.

## Accessibility

- Facets мають semantic group labels.
- Choice state передається через native/ARIA selected semantics.
- Visual tile має `48px` asset або readable fallback, label, count і distinct selected marker.
- Disabled reason доступний програмно й візуально.
- Drawer має named modal dialog semantics; background content є inert.
- Active chip remove має конкретне category-qualified accessible name.
- Візуальний chip і remove target мають однакову capsule geometry; повний label
  завжди залишається видимим і може переноситися на кілька рядків.
- Єдиний видимий remove icon належить capsule-wide remove control; decorative
  duplicate icon і окремий круглий focus ring не рендеряться.
- Hover, active, focus-visible і disabled feedback охоплюють всю capsule, тоді як
  native disabled semantics лишають remove action inert.
- Live result count використовує polite announcement без шуму на кожному focus move.
- Focus-visible відрізняється від selected state у dark/light themes.

## Acceptance

- Один controlled composite рендерить mounted applied summary та portal drawer.
- Summary і drawer показують однакову rounded active-filter capsule з одним видимим
  icon, capsule-wide remove target з мінімальною висотою `32px` і повним
  interaction-state feedback.
- Усі chip labels видимі, category-free, wrapped і не мають horizontal scroller.
- Summary містить лише applied chips без inactive facet placeholders; remove/Clear
  одразу оновлюють canonical result URL.
- Drawer не має internal applied/draft source of truth.
- Reset змінює preview, Discard відновлює applied, Apply записує canonical search.
- Background preview inert; detail відкривається лише після Apply або Discard.
- Personal source disabled; unsupported starter/tags facets відсутні.
- Arena/Interactables cascade зберігає валідний draft.
- Controller focus IDs стабільні, background commands ізольовані.
