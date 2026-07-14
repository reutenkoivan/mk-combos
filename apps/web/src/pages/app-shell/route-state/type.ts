import type { AppRoute } from "@mk-combos/contracts/routes/type";

import type { appShellOnlyRouteKinds } from "./value";

export type AppShellRoute =
  | AppRoute
  | Readonly<{ kind: typeof appShellOnlyRouteKinds.recovery }>
  | Readonly<{ kind: typeof appShellOnlyRouteKinds.root }>;
