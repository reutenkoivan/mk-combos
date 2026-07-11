# MK1 Data Sources

`mk1/data` keeps source provenance on every seeded record. The validation script fails when
records do not reference known source ids.

## Source IDs

- `wikipedia-mk1`: English Wikipedia Mortal Kombat 1 page. Used for Definitive Edition roster,
  kameo roster, release grouping, and content-cut cross-checks.
- `netherrealm-definitive-edition`: NetherRealm/WB Definitive Edition content-cut reference.
- `in-game-practice-mode`: Manual in-game or practice-mode verification. Required before exact
  move names, frame data, resource values, or combo legality are treated as verified.
- `curated-route-seed`: Project-curated route coverage used to make every selectable
  main-character + kameo pair available to no-UI catalog and builder flows.

## Policy

- The active base pack is `definitive`.
- Selector layout facts live on roster and kameo records through explicit `pickerSlot` values.
- MK1 combo context is always main character + kameo. MKXL-only `variation`, `stage`, and
  `interactable` fields are not valid in MK1 seeded or custom combo data.
- Frame and kameo resource fields stay absent unless they are checked against in-game/practice
  data. Builder runtime still tracks frame and kameo usage in a data-driven way.
