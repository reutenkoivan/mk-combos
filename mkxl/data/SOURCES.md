# MKXL Data Sources

`mkxl/data` keeps source provenance on every seeded record. The validation script fails when
records do not reference known source ids.

## Source IDs

- `mkwarehouse-mkx`: Mortal Kombat Warehouse MKX pages. Used for roster, character pages,
  arenas, finishers, media metadata, and cross-checkable MKX content.
- `wikipedia-mkx`: English Wikipedia Mortal Kombat X page. Used for XL roster, DLC, gameplay,
  stage interactions, and release cross-checks.
- `wikipedia-it-mkx-variations`: Italian Wikipedia Mortal Kombat X variation table. Used only
  as a variation-name cross-check.
- `in-game-practice-mode`: Manual in-game or practice-mode verification. Required for move
  availability, notation, frame data, and combo legality before exact gameplay facts are treated
  as verified.
- `community-combo-source`: Aggregated community combo source. Used for community-authored
  notation routes and combo metadata only; it is not proof of in-game legality, frame data, or
  move availability.
- `netherrealm-patch-notes`: [NetherRealm Studios Mortal Kombat patch
  notes](https://www.mortalkombat.com/index.php/en-gb/patch-notes). An official candidate for
  version-matched gameplay evidence.
- `testyourmight-mkx-frame-data`: [Test Your Might MKX Frame Data
  Project](https://testyourmight.com/threads/mkx-frame-data-project.55865/post-1889472). A
  community reference candidate that requires an independent agreeing web source.

## Exact gameplay evidence

- The exact-evidence allowlist is exported as `mkxlExactGameplayEvidenceSourceIds`. A tactical
  fact, frame-data record, or verified graph timing must carry its own source ids from that list.
- One official or manually verified source is sufficient. Web-only evidence requires two
  independent allowlisted sources that agree on the value.
- External facts must match `XL-final`, character and variation context, official move label, and
  notation. A conflict or incomplete identity match leaves the fact absent.
- Absence means unknown. It never means `false`, zero frames, safe, unsafe, or gapless.

## Policy

- Community combo source rows may seed route notation and high-level combo metadata, but they do
  not replace manual verification for gameplay facts.
- Frame fields stay absent unless they are checked against allowlisted exact evidence. Present
  frame data owns its provenance and uses positive startup/active/recovery counts; advantages
  remain signed.
- Tactical facts (`attackLevel`, `duckable`, `internalGap`) and verified graph timing
  (`link`, `cancel`, `juggle`, `gap`) remain absent for ambiguous route-source identities.
- Generated graph `frameWindow: 0..12` values are layout scaffolding only. They are not exact
  gameplay data and must not be displayed or promoted into the separate `timing` field.
- The seeded combo catalog is curated coverage data: at least one valid route per selectable
  character and variation, not every possible community route.
- Versioned authored data packs live under `src/packs/<pack-id>`. `xl-final` is the active base
  pack. Future balance patches or new MKXL versions should extend a base pack with explicit
  add/replace/retire data instead of rewriting resolved public values.
- Static source facts are declared explicitly in pack files with `as const`: roster records,
  variation records, stages, interactables, move records, FGC notation registry values, combo
  metadata, source ids, and combo route intent. Do not generate those static rows with
  `toReadableEn`, `toMkxlSlug`, `map`, or `flatMap` inside authored pack files.
- The active `xl-final` FGC controller notation catalog lives in
  `src/packs/xl-final/notation.ts`. It contains atomic controller inputs only. Authored moves
  must reference its registry values instead of retyping notation strings inline.
- Community route-source moves must use atomic MKXL move notation values from the active notation
  catalogs. Community shorthand that cannot be represented in that format is not kept in seeded
  combo data.
- Movelist authoring lives under `src/packs/<pack-id>/moves/characters/<character-id>.ts`.
  Each character file declares `universal` moves once and `variations.<variationKey>` moves only
  for variation-specific moves. The pack compiler derives the per-variation move tree and flat
  public `movelist`.
- Pack-level global move templates may be used only for verified mechanics that are authored once
  and compiled into character-owned public moves for characters whose combo routes reference them.
  Templates stay inside pack authoring and may use verified mechanic notation values.
- Seeded combo authoring lives under
  `src/packs/<pack-id>/combos/characters/<character-id>/<variation-slug>.ts`. Each combo declares
  a standalone object with a `route` of move object references. The exported variation combo
  wrapper aggregates those objects in its `combos` property. The pack compiler derives public
  `movePath` and `notation` from each route.
- Verified move `label.EN` stores the official English in-game move name. Community route-token
  notation that is not yet verified as an official move name is authored as explicit `route-source`
  move records with `community-combo-source` provenance. Move `id` is the schema-safe slug of the label:
  `<character-id>:<move-name-slug>` for universal moves and
  `<character-id>:<variation-slug>:<move-name-slug>` for variation-only moves.
- Combo authored files must not store `movePath`, `notation`, step objects, duplicate move id
  strings, role-shaped keys, or lookup maps. Import the `xl-final` move registry, then build
  `route` from those object references.
