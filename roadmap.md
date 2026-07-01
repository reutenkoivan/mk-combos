# mk-combos Roadmap

## Status Model

Each roadmap item has a `Status` field so progress is visible in this file.

Allowed values:

- `todo` - not started.
- `in-progress` - currently being implemented.
- `done` - implemented and verified.
- `blocked` - cannot continue without a decision or dependency.

Each item also has `Done when` so `done` has a clear meaning.

## Roadmap Rules

- Roadmap is flat: every numbered item is one implementation step.
- Each step targets one folder/scope whenever possible.
- Bun workspaces may use `packages/*`, `mkxl/*`, `mk1/*`, and `apps/*`.
- Broad wildcard `mk*/*` is not used.
- Future game scopes must be added explicitly, for example `mk2/*`.
- No UI work starts before no-UI contracts, data, rules, catalog, builder, and business packages are complete.

## Roadmap

| # | Status | Step | Scope | Done when |
|---|---|---|---|---|
| 1 | todo | Root Platform Bootstrap | repo root | Bun workspaces use `packages/*`, `mkxl/*`, `mk1/*`, `apps/*`; Turbo, TS base config, root scripts, package metadata exist. |
| 2 | todo | Root Tooling Setup | repo root | Biome, Knip, Sherif, Sheriff, Gitleaks, Lefthook, Vitest, Playwright, Storybook base tooling are configured. |
| 3 | todo | Architecture Boundary Update | docs | Docs say `packages/ui` owns all active numbered `UI-CMP-*`; `@mk-combos/builder-ui` is removed. |
| 4 | todo | `packages/contracts` | `packages/contracts` | Shared contracts, route/source ids, notation mode, backup envelope, result shapes are exported. |
| 5 | todo | `packages/contracts` Build/Test Exports | `packages/contracts` | Shared build/test config exports are available. |
| 6 | todo | `packages/builder-core` | `packages/builder-core` | Graph primitives, replay types, transition helpers, runtime state, stale/invalid structures are implemented. |
| 7 | todo | `packages/controller-bridge` | `packages/controller-bridge` | Gamepad bridge emits semantic commands with profiles, repeat/dead-zone logic, and hint metadata. |
| 8 | todo | `mkxl/data` | `mkxl/data` | Full MKXL roster, variations, movelists, combos, graph data, stages, interactables, localized content, coverage targets exist. |
| 9 | todo | `mkxl/rules` | `mkxl/rules` | MKXL schemas, validation, notation, variation, stage/interactable, patch rules pass tests. |
| 10 | todo | `mkxl/catalog` | `mkxl/catalog` | MKXL selectors, context parsing, filters, summaries, recovery behavior are implemented. |
| 11 | todo | `mkxl/builder` | `mkxl/builder` | MKXL graph composition, replay, valid moves, frame checks, interactables, stale detection work. |
| 12 | todo | `mkxl/business` | `mkxl/business` | `mkxlBusiness` exposes catalog/detail/lists/builder/backup/validation adapters. |
| 13 | todo | `mk1/data` | `mk1/data` | Full MK1 roster, kameos, movelists, combos, graph data, localized content, coverage targets exist. |
| 14 | todo | `mk1/rules` | `mk1/rules` | MK1 schemas, validation, notation, kameo pairing/transition, patch rules pass tests. |
| 15 | todo | `mk1/catalog` | `mk1/catalog` | MK1 selectors, context parsing, character/kameo filtering, summaries, recovery behavior are implemented. |
| 16 | todo | `mk1/builder` | `mk1/builder` | MK1 graph composition, replay, valid moves, kameo transitions, stale detection work. |
| 17 | todo | `mk1/business` | `mk1/business` | `mk1Business` exposes catalog/detail/lists/builder/backup/validation adapters. |
| 18 | todo | No-UI Integration Validation | validation configs | Builds, import boundaries, data validation, graph validation, business compatibility pass. |
| 19 | todo | `packages/ui` Design System Foundation | `packages/ui` | Tokens, Tailwind, recipes, Base UI wrappers, icons, notation registry, Storybook, visual/a11y setup exist. |
| 20 | todo | `packages/ui` Base Primitives | `packages/ui` | Core primitives, surfaces, states, layouts, focus helpers are implemented. |
| 21 | todo | `packages/ui` Shell/Settings Components | `packages/ui` | `UI-CMP-001`-`006`, `027`, `028`, `032`, `033`, `034`, `037` are implemented and covered. |
| 22 | todo | `packages/ui` Catalog/Detail/List Components | `packages/ui` | `UI-CMP-007`-`015`, `017`-`023`, `029`, `030`, `031` are implemented and covered. |
| 23 | todo | `packages/ui` Builder Components | `packages/ui` | `UI-CMP-026`, `035`, internal `movePicker`, `036`, and model hooks are implemented and covered. |
| 24 | todo | `apps/web` Bootstrap | `apps/web` | TanStack Start app, static output, app package, route shell, providers exist. |
| 25 | todo | `apps/web` Game Registry | `apps/web` | `installed-games.ts` imports only `mkxlBusiness` and `mk1Business`. |
| 26 | todo | `apps/web` Routing And App Shell | `apps/web` | `UI-PAGE-001`, route `gameId`, generic routes, breadcrumbs, switching, deprecated redirect work. |
| 27 | todo | `apps/web` First Launch And Settings | `apps/web` | `UI-PAGE-002`, `UI-PAGE-008`, settings, backup, export/import, persistence work. |
| 28 | todo | `apps/web` Catalog And Detail Pages | `apps/web` | `UI-PAGE-003` and `UI-PAGE-004` use business entry points and `@mk-combos/ui`. |
| 29 | todo | `apps/web` Lists Page | `apps/web` | `UI-PAGE-005`, named lists, add-to-list, `GameId` isolation work. |
| 30 | todo | `apps/web` Builder Page | `apps/web` | `UI-PAGE-006` supports create, duplicate, edit, repair, stale recovery, persistence. |
| 31 | todo | `apps/web` Controller Routing | `apps/web` | Semantic controller commands work across pages, dialogs, and focus recovery. |
| 32 | todo | UI Integration Validation | validation configs | Pages use `@mk-combos/ui` for active numbered components and avoid direct game data/rule imports. |
| 33 | todo | Playwright E2E Setup | E2E tests/config | Fixtures, config, stable assumptions, local app startup are ready. |
| 34 | todo | First Launch And Deep Link E2E | E2E tests | Root first launch, `/mkxl/catalog`, `/mk1/catalog`, invalid route recovery pass. |
| 35 | todo | Catalog And Detail E2E | E2E tests | MKXL/MK1 catalog, filters, cards, detail, notation mode, duplicate into builder pass. |
| 36 | todo | Lists And Backup E2E | E2E tests | Lists, add-to-list, export, import preview/replace, game-slice isolation pass. |
| 37 | todo | Builder E2E | E2E tests | Create, duplicate, edit, repair, valid-next-move enforcement, frame meter inspection pass. |
| 38 | todo | Controller E2E | E2E tests | Controller navigation, dialogs, disconnect, reconnect recovery pass. |
| 39 | todo | CI/CD And Release Gate | `.github` + root CI | GitHub Actions run install, validation, lint, tests, E2E, build, deploy with `/mk-combos/`. |

## Completion Criteria

- Every roadmap row has `Status: done`.
- Full MKXL and MK1 no-UI scopes are complete before UI begins.
- `packages/ui` owns every active numbered `UI-CMP-*`.
- `apps/web` owns every active `UI-PAGE-*`.
- Local state is isolated by `GameId`.
- E2E covers core workflows before release.
