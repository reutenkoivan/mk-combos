# UI-PAGE-003: MK1 Catalog Variant

## Метадані

- Базова сторінка: [UI-PAGE-003 Catalog](./UI-PAGE-003.md)
- Active game: `mk1`
- Required context: `main character + kameo`
- Game-specific picker: [`UI-CMP-009 Kameo Picker`](./UI-CMP-009.md)

## Маршрути

```text
/mk1/catalog/
/mk1/catalog/:character
/mk1/catalog/:character/:kameo
```

Приклад canonical flow:

```text
/mk1/catalog/
/mk1/catalog/scorpion
/mk1/catalog/scorpion/sektor
```

Character і kameo мають стабільні короткі slugs. Query не є джерелом context.

## Character selector

- MK1 roster options і authored slots приходять із `mk1/catalog`.
- Mobile, tablet і desktop використовують game-owned
  `responsiveOrder ?? sourceIndex + 1` у fluid character grid; web не сортує roster
  alphabetically і не синтезує layout.
- Authored character `row/column` лишаються в prepared slot contract, але не
  застосовуються як inline placement у character presentation.
- Last MK1 character лише preselected/focused.
- Disabled option видимий із pair-independent reason.

## Kameo selector

- Path character є locked main fighter.
- `mk1/catalog` готує kameo availability та combo counts для конкретної pair.
- Недоступна pair видима disabled і не selectable.
- Mobile, tablet і desktop показують kameo як compact centered portrait cards;
  visual і linear controller order визначає game-owned
  `responsiveOrder ?? sourceIndex + 1`.
- Authored kameo `row/column` лишаються стабільними data/public compatibility
  facts, але Command Deck не використовує їх для visual placement або focus graph.
- Catalog не передає picker inline return action чи нижній status hint: guidance
  лишається у header, а locked strip продовжує показувати selected fighter.
- Last kameo preselected тільки для того самого main character.
- Confirm замінює route на `/mk1/catalog/:character/:kameo` без search.

## Result і filters

MK1 використовує спільну taxonomy:

- Position;
- Meter;
- Difficulty;
- Route class;
- Source.

Arena, Interactables і Variation у MK1 не рендеряться. Kameo є required pathname
context, а не facet.

Prepared MK1 summary містить pair context, provenance, source IDs і semantic route
steps. Web page не має MK1-specific summary/filter branching.

## Recovery

- Unknown character → root selector action.
- Unknown або incompatible kameo при valid character → kameo selector цього character.
- Invalid pair не зберігається як last catalog.
- Query `character`/`kameo` ігнорується без migration або redirect.

## Acceptance

- `scorpion/sektor` резолвиться тільки коли pair підтримується data/business scope.
- Result trail показує `Catalog / Scorpion / Sektor` з Kameo як current crumb.
- Character і Kameo crumbs резервують icon slots та використовують fallback glyph до появи authored MK1 assets.
- Pair counts відповідають selected main character.
- Character і kameo `responsiveOrder`, authored kameo coordinates та stable slot IDs
  унікальні; coordinates зберігаються для compatibility, не presentation.
- Catalog breadcrumb/mobile drawer, browser Back і Controller Back повертають із
  kameo selector до `/mk1/catalog/` без inline `Back to fighters` control.
- Optional `Apply filters` змінює лише search result route.
