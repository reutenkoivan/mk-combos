# MK1 Data Sources

`mk1/data` keeps source provenance on every seeded record. The validation script fails when
records do not reference known source ids.

## Source IDs

- `wikipedia-mk1`: [English Wikipedia Mortal Kombat 1 page](https://en.wikipedia.org/wiki/Mortal_Kombat_1).
  Used for Definitive Edition roster, kameo roster, release grouping, and content-cut
  cross-checks.
- `netherrealm-definitive-edition`: NetherRealm/WB Definitive Edition content-cut reference.
- `in-game-practice-mode`: Manual in-game or practice-mode verification. Required before exact
  move names, frame data, resource values, or combo legality are treated as verified.
- `curated-route-seed`: Project-curated route coverage used to make every selectable
  main-character + kameo pair available to no-UI catalog and builder flows.
- `netherrealm-patch-notes`: [NetherRealm Studios Mortal Kombat patch
  notes](https://www.mortalkombat.com/index.php/en-gb/patch-notes). An official candidate for
  exact version-matched gameplay evidence.

## Exact gameplay evidence

- The exact-evidence allowlist is exported as `mk1ExactGameplayEvidenceSourceIds`. A tactical
  fact, frame-data record, or verified graph timing must carry its own source ids from that list.
- One official or manually verified source is sufficient. Web-only evidence requires two
  independent allowlisted sources that agree on the value.
- External facts must match game version, fighter or kameo context, official move label, and
  notation. A conflict or incomplete identity match leaves the fact absent.
- Absence means unknown. It never means `false`, zero frames, safe, unsafe, or gapless.

## Policy

- The active base pack is `definitive`.
- Selector layout facts live on roster and kameo records through explicit `pickerSlot` values.
- MK1 combo context is always main character + kameo. MKXL-only `variation`, `stage`, and
  `interactable` fields are not valid in MK1 seeded or custom combo data.
- Frame and kameo resource fields stay absent unless they are checked against allowlisted exact
  evidence. Present frame data owns its provenance and uses positive startup/active/recovery
  counts; advantages remain signed.
- Tactical facts (`attackLevel`, `duckable`, `internalGap`) and graph timing
  (`link`, `cancel`, `juggle`, `gap`) remain absent on the synthetic definitive seed identities.
  They are added only after exact identity and value verification.
- Legacy graph `frameWindow` is route scaffolding, not verified gameplay timing. It must not be
  displayed as exact frame data or promoted into `timing` without new evidence.
