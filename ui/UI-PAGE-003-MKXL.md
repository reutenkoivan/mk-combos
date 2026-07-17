# UI-PAGE-003: MKXL Catalog Variant

## Метадані

- Базова сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Active game: `mkxl`
- Required context: `character + variation`
- Game-specific picker: [`UI-CMP-008 Variation Picker`](./UI-CMP-008.md)

## Маршрути

```text
/mkxl/catalog/
/mkxl/catalog/:character
/mkxl/catalog/:character/:variation
```

Приклад canonical flow:

```text
/mkxl/catalog/
/mkxl/catalog/scorpion
/mkxl/catalog/scorpion/ninjutsu
```

Internal variation ID може бути `scorpion:ninjutsu`, але URL містить тільки короткий
slug `ninjutsu`. Internal IDs не серіалізуються в pathname або query.

## Character selector

- Roster layout належить `mkxl/data` і передається через catalog/business contract.
- Усі 33 roster entries використовують game-owned
  `responsiveOrder ?? sourceIndex + 1` у fluid grid на mobile, tablet і desktop;
  web не синтезує positions і не сортує roster.
- Наявні authored `row/column` лишаються стабільними data facts, але character
  presentation не застосовує їх як inline grid placement.
- На measured app content viewport `1536×872` усі 33 entries вміщуються в App Shell
  outlet без вертикального scroll; portrait і minimum interactive target не стискаються.
- Character без combo availability видимий disabled із reason.
- Last MKXL character лише отримує initial focus.

## Variation selector

- Path character резолвиться до internal character ID до запиту options.
- Показуються variation options тільки цього character.
- Кожна variation має authored slot, availability і combo count.
- Mobile, tablet і desktop показують variation як compact centered portrait cards;
  visual і linear controller order визначає game-owned
  `responsiveOrder ?? sourceIndex + 1`.
- Authored variation `row/column` лишаються стабільними data/public compatibility
  facts, але Command Deck не використовує їх для visual placement або focus graph.
- Catalog не передає picker inline return action чи нижній status hint: guidance
  лишається у header, а locked strip продовжує показувати selected fighter.
- Incompatible short slug є invalid specification, а не fallback до іншої variation.
- Confirm замінює route на `/mkxl/catalog/:character/:variation` без search.

## Result і filters

MKXL підтримує спільні facets Position, Meter, Difficulty, Route class і
Source, а також:

- Arena — optional visual single-choice;
- Interactables — visual multi-choice, залежний від Arena.

До вибору Arena Interactables не рендеряться. Після вибору показуються лише options
цієї Arena з ненульовим count або current selection; empty state локалізований.
Зміна/очищення Arena прибирає incompatible Interactables у draft recovery. Обидва
facets optional: вони не є частиною required pathname context.

Semantic summary використовує prepared MKXL route steps. Web не розбирає variation
ID, notation або seeded tags для побудови presentation.

## Recovery

- Unknown character → root selector action.
- Unknown/incompatible variation при valid character → character-specific variation selector.
- Invalid input не записується як last catalog.
- Query `character`/`variation` не читається і не переписується у pathname.

## Acceptance

- `scorpion/ninjutsu` стабільно резолвиться у `scorpion` + `scorpion:ninjutsu`.
- Result trail показує `Catalog / Scorpion / Ninjutsu`; internal namespaced variation ID не видимий.
- Character і variation crumbs використовують authored MKXL portrait/variation assets.
- Variation іншого character не приймається.
- Character і variation `responsiveOrder`, authored variation coordinates та stable
  slot IDs унікальні; coordinates зберігаються для compatibility, не presentation.
- Arena/Interactables cascade працює у draft preview та applied search.
- Catalog breadcrumb/mobile drawer, browser Back і Controller Back повертають із
  variation selector до `/mkxl/catalog/` без inline `Back to fighters` control.
