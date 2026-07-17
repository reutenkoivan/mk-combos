import type { CatalogRoute, GameRoute } from "@mk-combos/contracts/routes/type";

import type { appShellOnlyRouteKinds } from "./value";

export type AppShellCatalogRoute = CatalogRoute &
  Readonly<{
    characterSlug?: string;
    specificationSlug?: string;
  }>;

export type AppShellRoute =
  | Exclude<GameRoute, CatalogRoute>
  | AppShellCatalogRoute
  | Readonly<{ kind: typeof appShellOnlyRouteKinds.recovery }>
  | Readonly<{ kind: typeof appShellOnlyRouteKinds.root }>;
