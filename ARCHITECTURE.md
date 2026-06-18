# Architecture

`mk-combos` is a static web application with one shared shell and separate business scopes for each supported Mortal Kombat game.

This document is the canonical source for package ownership, import direction, route shape, local state shape, backup ownership, and the process for adding another game.

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

Tooling ownership:

- Biome owns formatting, linting, and restricted import enforcement.
- Knip detects unused files, dependencies, and exports.
- Lefthook runs local Git hooks.
- Sherif checks monorepo package and dependency consistency.
- Sheriff (`@softarc/sheriff-core`) checks architecture import-boundary rules.
- Gitleaks scans for committed or staged secrets.

UI and app import boundaries:

- `packages/ui` wraps Base UI primitives and exposes project-owned React components.
- `packages/ui` implements shared component styling through `tailwind-variants` recipes.
- `packages/ui` owns the icon facade. App pages, game scopes, and builder UI consumers import icons only from `@mk-combos/ui/icons/{icon-name}`.
- Direct `lucide-react` imports are allowed inside `packages/ui` icon modules only.
- App-level forms use `@tanstack/react-form` for form state. Zod remains the schema and validation layer.
- `packages/builder-ui` may use React Flow for the visual combo builder canvas.
- `packages/builder-core` and game business scopes own combo graph rules, validation, replay, and persistence shape.

## Root Scopes

The repository is split by ownership:

```text
mk-combos/
  packages/
    contracts/
    builder-core/
    builder-ui/
    controller-bridge/
    ui/

  mkxl/
    data/
    rules/
    catalog/
    builder/
    business/

  mk1/
    data/
    rules/
    catalog/
    builder/
    business/

  apps/
    web/
```

`packages/*` is the shared platform layer. It contains reusable contracts, UI primitives, builder primitives, builder presentation components, and controller input normalization.

`mkxl/*` is the MKXL business scope. It owns MKXL data, rules, schemas, catalog behavior, builder behavior, validation, coverage, and the MKXL app-facing business entry point.

`mk1/*` is the MK1 business scope. It owns MK1 data, rules, schemas, catalog behavior, builder behavior, validation, coverage, and the MK1 app-facing business entry point.

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

### `packages/builder-ui`

Package name: `@mk-combos/builder-ui`.

Owns shared builder presentation:

- `ComboWhiteboard`;
- internal `movePicker` region;
- `ComboFrameMeter`;
- builder layout components and read-only detail rendering support.

It receives prepared state, valid candidates, frame snapshots, invalid markers, and event handlers from the active game builder adapter. It does not decide whether a move is valid.

### `packages/controller-bridge`

Package name: `@mk-combos/controller-bridge`.

Owns Browser Gamepad API access, controller profiles, normalized input, semantic commands, repeat/dead-zone behavior, and controller hint metadata.

It does not know routes, combo data, game-specific builder rules, local storage, or installed games.

### `packages/ui`

Package name: `@mk-combos/ui`.

Owns generic React primitives and display components:

- buttons, dialogs, controls, segmented controls, list primitives, picker primitives, filter primitives;
- `NotationRenderer`;
- generic cards and layout primitives when they do not encode game rules.

It does not own MKXL/MK1 business logic, data validation, graph composition, route parsing, or local persistence.

## Game Business Scopes

Each game has one app-facing business entry point. The entry point reduces abstraction pressure: the web app does not need a deep central framework, but it also does not spread game-specific rules across pages.

### MKXL

```text
mkxl/
  data/       # @mk-combos/mkxl-data
  rules/      # @mk-combos/mkxl-rules
  catalog/    # @mk-combos/mkxl-catalog
  builder/    # @mk-combos/mkxl-builder
  business/   # @mk-combos/mkxl-business
```

`mkxl/business` exports `mkxlBusiness`.

The MKXL scope owns:

- MKXL roster, variation data, movelists, seeded combos, move graph data, coverage targets, and localized content;
- MKXL schemas and validation;
- MKXL stage, zone, segment, interactable, stage-specific edge, and interactable usage rules;
- MKXL catalog selectors, optional stage/interactable filter behavior, and combo summary shaping;
- MKXL builder graph composition, replay, valid next move calculation, stale detection, and custom combo output.

### MK1

```text
mk1/
  data/       # @mk-combos/mk1-data
  rules/      # @mk-combos/mk1-rules
  catalog/    # @mk-combos/mk1-catalog
  builder/    # @mk-combos/mk1-builder
  business/   # @mk-combos/mk1-business
```

`mk1/business` exports `mk1Business`.

The MK1 scope owns:

- MK1 main fighter roster, kameo roster, movelists, seeded combos, move graph data, coverage targets, and localized content;
- MK1 schemas and validation;
- MK1 kameo pairing rules and kameo transition rules;
- MK1 catalog selectors and combo summary shaping;
- MK1 builder graph composition, replay, valid next move calculation, stale detection, and custom combo output.

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
- render catalog/detail/list/builder surfaces through prepared page models and handlers;
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
  -> mkxl/rules
  -> mkxl/data
  -> packages/*

mk1/business
  -> mk1/catalog
  -> mk1/builder
  -> mk1/rules
  -> mk1/data
  -> packages/*

packages/*
  -> packages/*
```

Forbidden:

- `packages/*` importing from `mkxl/*` or `mk1/*`;
- `mkxl/*` importing from `mk1/*`;
- `mk1/*` importing from `mkxl/*`;
- page-level web code importing from `mkxl/data`, `mkxl/rules`, `mk1/data`, or `mk1/rules` directly;
- hardcoded game-specific business rules in shared UI components.

## Adding A New Game

Adding a new game should be localized:

```text
mk-new/
  data/
  rules/
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

- MK1 patch metadata belongs in `mk1/data` and `mk1/rules`.
- MKXL stage interaction corrections belong in `mkxl/data`, `mkxl/rules`, and `mkxl/builder`.

## Documentation Rule

UI and UX documents may describe user-visible behavior, stable reference codes, and page/component contracts. Architectural ownership should point back to this document instead of duplicating package rules in every file.
