# mk-combos

`mk-combos` is a static web application for experienced Mortal Kombat players who want to browse, inspect, build, save, and organize combos for multiple games from one app.

The first supported games are `MKXL` and `MK1`. The application must stay local-first and static: no backend, no auth, no remote database, and no server-side personalization.

The canonical architecture document is [ARCHITECTURE.md](./ARCHITECTURE.md). This README is the project overview; the status-tracked implementation roadmap lives in [roadmap.md](./roadmap.md).

## Goals

- Provide one fast web app for all installed games.
- Keep game-specific business logic inside game-owned root scopes.
- Keep shared packages generic and reusable.
- Support GitHub Pages hash links such as `/mk-combos/#/mkxl/catalog` and
  `/mk-combos/#/mk1/catalog`.
- Support local settings, custom combos, named lists, full backup export/import, and stale combo recovery.
- Support controller navigation through DualSense, Xbox-compatible, and Standard Gamepad API devices.
- Render notation as `FGC`, `PlayStation`, or `Xbox` without changing the stored combo data.
- Validate seeded data, graph data, local user data, and backup slices before release.
- Deploy as a static TanStack Start app on GitHub Pages.

## Repository Shape

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

  ARCHITECTURE.md
  roadmap.md
  UI.md
  UX.md
```

Root scopes have meaning:

- `packages/*` is the shared platform layer.
- `mkxl/*` is the MKXL business scope.
- `mk1/*` is the MK1 business scope.
- `apps/web` is the single product shell that installs and renders game business entry points.

## Shared Packages

### `packages/contracts`

Package name: `@mk-combos/contracts`.

Contains stable cross-game contracts only: `GameId`, `ComboRef`, localized text, notation display mode, backup envelope shape, generic route/source identifiers, and shared result shapes.

It must not contain MKXL variation rules, MKXL stage rules, MK1 kameo rules, installed game lists, or concrete game schemas.

### `packages/builder-core`

Package name: `@mk-combos/builder-core`.

Contains game-agnostic builder primitives: graph primitives, replay result shapes, runtime helper contracts, transition result contracts, and stale/invalid result shapes.

It does not compose MKXL or MK1 graphs. Game graph composition belongs to the game scope.

### `packages/controller-bridge`

Package name: `@mk-combos/controller-bridge`.

Contains Browser Gamepad API bridge logic, controller profiles, normalized input, semantic commands, repeat/dead-zone behavior, and controller hint metadata.

It does not know routes, game data, local storage, or builder rules.

### `packages/ui`

Package name: `@mk-combos/ui`.

Contains all active numbered `UI-CMP-*` components and generic React primitives: controls, dialogs, picker/list/filter primitives, cards where generic, semantic tokens, `NotationRenderer`, notation icon registry, page-owned presentation state and intent hooks, responsive/focus-navigation hooks, `ComboWhiteboard`, internal `movePicker`, `ComboFrameMeter`, and builder presentation hooks.

It renders prepared state and emits semantic UI events. It does not contain game-specific business logic or decide whether a move is valid.

## Game Business Scopes

Each supported game has one app-facing business entry point.

### MKXL

```text
mkxl/
  data/       # seeded combos, movelists, graph data, coverage targets
  catalog/    # catalog selectors, filters, summaries, route context helpers
  builder/    # MKXL graph composition, replay, valid next moves, stale checks
  business/   # @mk-combos/mkxl-business
```

`@mk-combos/mkxl-business` exports `mkxlBusiness`.

MKXL owns variation context and optional stage/interactable behavior. `mkxl/data` owns seeded facts, schemas, coverage targets, and data validation; `mkxl/catalog` owns context parsing, recovery, filters, and summaries; `mkxl/builder` owns graph composition, valid next moves, replay, stale checks, and stage/interactable usage rules. Stage-specific routes, stage interactions, and interactable usage policy never live in shared packages.

### MK1

```text
mk1/
  data/       # seeded combos, main roster, kameos, movelists, graph data
  catalog/    # catalog selectors, filters, summaries, route context helpers
  builder/    # MK1 graph composition, replay, valid next moves, stale checks
  business/   # @mk-combos/mk1-business
```

`@mk-combos/mk1-business` exports `mk1Business`.

MK1 owns main character + kameo context. `mk1/data` owns seeded facts, schemas, coverage targets, and data validation; `mk1/catalog` owns context parsing, recovery, filters, and summaries; `mk1/builder` owns graph composition, valid next moves, replay, stale checks, and kameo pairing/transition rules. MKXL variation/stage concepts must not appear in MK1 business contracts.

## Web App Integration

`apps/web` installs supported games through one local module. Its direct business
imports live only in the registry value file:

```text
apps/web/src/game-business/installed-games/value.ts
```

```ts
import { mkxlBusiness } from "@mk-combos/mkxl-business"
import { mk1Business } from "@mk-combos/mk1-business"

export const installedGames = [
  mkxlBusiness,
  mk1Business,
] as const
```

The web app may select a business entry point by `gameId`. It must not import `mkxl/data` or `mk1/data` directly from page code.

## Routes

GitHub Pages deployment uses hash history. The document lives at `/mk-combos/`, production assets
use `/mk-combos/assets/`, and route patterns are logical paths inside the fragment; for example,
logical `/mk1/catalog` is published as `/mk-combos/#/mk1/catalog`.

Logical routes are generic and game-prefixed:

```text
/:gameId/catalog
/:gameId/combos/:source/:comboId
/:gameId/lists
/:gameId/builder
/settings
```

The route prefix is the source of truth for active game on deep links. Settings store the default or last active game, but a valid route such as `/mk1/catalog` opens MK1 even in a fresh browser session.

## Local State And Backup

Local state is keyed by `GameId`:

```ts
type LocalAppState = {
  settings: AppSettings
  games: Record<GameId, GameUserState>
}
```

The web app owns the envelope and browser persistence. Each game business entry point owns validation and serialization for its game-specific slice.

Full backup is also keyed by `GameId`:

```ts
type BackupEnvelope = {
  version: number
  exportedAt: string
  settings: AppSettings
  games: Record<GameId, unknown>
}
```

Seeded game data is never imported from backup.

## User Workflows

### First Launch

Root first launch shows required setup for default language, default game, and notation display mode. A valid route-prefixed deep link bypasses setup, derives active game from the URL, uses `FGC` display mode by default, and creates the first-launch marker or session-only equivalent.

### Catalog

`UI-PAGE-003 Catalog` is a shared page. It resolves active `gameId`, gets the corresponding business entry point, and delegates game-specific context selection and filtering to that entry point.

- MKXL flow: `Character -> Variation -> Combo list`.
- MK1 flow: `Main character -> Kameo -> Combo list`.

### Combo Detail

`UI-PAGE-004 Combo Detail` is shared. Seeded/custom lookup, stale detection, detail model creation, and repair availability are delegated to the active game business entry point.

### Named Lists

`UI-PAGE-005 Named Lists` is shared. Lists are scoped by `gameId`. The add-to-list dialog shows only lists compatible with the active combo's game.

### Custom Combo Builder

`UI-PAGE-006 Custom Combo Builder` combines shared builder presentation from `@mk-combos/ui` with the active game's builder adapter.

- `@mk-combos/ui` renders the whiteboard, internal move picker, and frame meter.
- `mkxl/builder` decides MKXL graph composition, valid next moves, stage/interactable availability, replay, and stale state.
- `mk1/builder` decides MK1 graph composition, valid next moves, kameo transition behavior, replay, and stale state.

Free text fallback is out of scope for MVP.

### Controller Navigation

`@mk-combos/controller-bridge` emits semantic commands. `apps/web` maps those commands to the active page, and active game behavior is delegated through the selected business entry point where needed.

## Implementation Roadmap

This section is a high-level overview. The flat step-by-step progress tracker lives in [roadmap.md](./roadmap.md).

### 1. Bootstrap Workspaces

- Configure Bun workspaces with root patterns for `packages/*`, `mk*/*`, and `apps/*`.
- Add Turborepo.
- Create TypeScript base config and project configs.
- Add root scripts:
  - `dev`
  - `build`
  - `test`
  - `lint`
  - `validate:data`
  - `validate:docs`

Acceptance:

- Workspace install succeeds.
- `bun run build` runs through Turbo.
- `bun run test` runs through Turbo.
- Root workspace patterns do not need editing when a future `mk*` game scope is added.

### 2. Shared Platform Packages

- Implement `@mk-combos/contracts`.
- Implement `@mk-combos/builder-core`.
- Implement `@mk-combos/ui`.
- Implement `@mk-combos/controller-bridge`.

Acceptance:

- Shared packages do not import from `mkxl/*` or `mk1/*`.
- Shared UI components can render prepared builder state without knowing game-specific rules.
- Controller bridge emits semantic commands only.
- UI package remains game-agnostic.

### 3. MKXL Business Scope

- Create `mkxl/data`, `mkxl/catalog`, `mkxl/builder`, and `mkxl/business`.
- Define MKXL data schemas for combos, movelists, graph data, variation data, stage interaction data, and coverage targets.
- Implement MKXL catalog selectors and optional stage/interactable filters.
- Implement MKXL builder composition: base character graph + variation overlay + optional stage interaction data.
- Export `mkxlBusiness`.

Acceptance:

- MKXL seeded data validates.
- MKXL stage-specific data cannot reference interactables from another stage.
- MKXL builder without selected stage does not expose interactable moves.
- MKXL business entry point can serve catalog, detail, builder, backup, and validation flows.

### 4. MK1 Business Scope

- Create `mk1/data`, `mk1/catalog`, `mk1/builder`, and `mk1/business`.
- Define MK1 data schemas for combos, main roster, kameos, movelists, graph data, kameo data, and coverage targets.
- Implement MK1 catalog selectors and kameo context behavior.
- Implement MK1 builder composition: base character graph + kameo overlay.
- Export `mk1Business`.

Acceptance:

- MK1 seeded data validates.
- MK1 data rejects MKXL-only stage/interactable fields.
- MK1 builder exposes kameo moves according to MK1 rules.
- MK1 business entry point can serve catalog, detail, builder, backup, and validation flows.

### 5. Web Shell

- Configure TanStack Start in `apps/web`.
- Add static output for GitHub Pages.
- Add `apps/web/src/game-business/installed-games/value.ts`.
- Implement route resolution for `/:gameId/...`.
- Implement app shell, first-launch setup, settings, local persistence, backup import/export, and controller command routing.
- Render shared pages through active business entry point.

Acceptance:

- `/mkxl/catalog` and `/mk1/catalog` open from fresh browser state.
- Game switcher is built from `installedGames`.
- Direct links do not depend on previous local settings.
- Local data is isolated by `gameId`.

### 6. UI And UX Surfaces

- Implement `UI-PAGE-001` through `UI-PAGE-008` according to [UI.md](./UI.md).
- Keep stable UI codes.
- Keep MKXL and MK1 catalog variants as documentation variants of `UI-PAGE-003`.
- Use `@mk-combos/ui` for whiteboard and frame meter.

Acceptance:

- Catalog, detail, lists, builder, settings, first launch, controller hints, and system states are usable with keyboard, pointer, and controller.
- Notation display mode changes rendering only.
- Long notation and dense metadata do not overlap.

### 7. Local Personalization

- Implement local state envelope keyed by `GameId`.
- Implement custom combos and named lists through active game business validation.
- Implement stale custom combo detection without deleting user data.
- Implement full backup export/import with per-game slice validation.

Acceptance:

- Local data survives refresh.
- MKXL and MK1 lists/custom combos do not mix.
- Backup import validates known game slices before replace.
- Stale custom combos remain visible and repairable.

### 8. CI/CD

- Add GitHub Actions workflow.
- Run:
  - `bun install`
  - `bun run validate:data`
  - `bun run validate:docs`
  - `bun run test`
  - `bun run build`
- Deploy the static entry point and assets below `/mk-combos/` with hash history.

Acceptance:

- CI blocks deploy on data validation, docs validation, tests, or build failure.
- GitHub Pages serves `/mk-combos/` and fragment-prefixed deep links such as
  `/mk-combos/#/mk1/catalog` without server rewrites.

## Test Plan

### Unit

- Shared contracts compile without importing game scopes.
- Builder-core primitives work without game-specific imports.
- MKXL schemas validate variation/stage/interactable data.
- MK1 schemas validate main character + kameo data.
- Backup envelope validates known game slices through business entry points.
- Notation rendering maps FGC to PlayStation/Xbox display without mutating source notation.

### Integration

- `apps/web` resolves installed games through the `installed-games` module.
- `/mkxl/catalog` uses `mkxlBusiness`.
- `/mk1/catalog` uses `mk1Business`.
- Combo detail delegates lookup and stale detection to active game business.
- Builder delegates valid next moves to active game builder.
- Lists are scoped by `gameId`.

### E2E

- First launch root setup opens default game catalog after confirmation.
- Fresh browser direct link `/mkxl/catalog` bypasses setup and opens MKXL.
- Fresh browser direct link `/mk1/catalog` bypasses setup and opens MK1.
- User switches games and each game restores its own last catalog context.
- User creates a custom combo through valid transitions only.
- User exports and imports full backup.
- Controller navigation works across catalog, detail, lists, builder, and settings.

## Adding Another Game

Add a new root scope:

```text
mk-new/
  data/
  catalog/
  builder/
  business/
```

Export one new business entry point, then register it in:

```text
apps/web/src/game-business/installed-games/value.ts
```

Shared packages and existing docs should not require broad rewrites for a normal new game. Only add shared primitives when the new game introduces a reusable platform concept.

## Out Of Scope For MVP

- Remote sync.
- Auth and user accounts.
- Public sharing.
- Merge import.
- Server-side moderation.
- Seeded database editor.
- Video embeds.
- Custom controller remapping.
- Free text custom combo input.

## Technical Assumptions

- Package manager: Bun.
- Monorepo orchestration: Turborepo.
- Web framework: TanStack Start.
- Hosting: GitHub Pages.
- Validation: Zod.
- Tests: Vitest and Playwright.
- Personal data: browser-local only.
- Seeded and custom combos store `movePath` as source of truth and `cachedNotation` as display cache.
