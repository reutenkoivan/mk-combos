import type { z } from "zod/v4";

import type {
  BuilderRouteParamsSchema,
  BuilderRouteSchema,
  CatalogRouteParamsSchema,
  CatalogRouteSchema,
  ComboDetailRouteParamsSchema,
  ComboDetailRouteSchema,
  GameRouteKindSchema,
  GameRouteSchema,
  ListsRouteParamsSchema,
  ListsRouteSchema,
} from "./schema";

export { gameRouteKinds } from "./value";

export type GameRouteKind = z.output<typeof GameRouteKindSchema>;

export type CatalogRouteParams = z.output<typeof CatalogRouteParamsSchema>;

export type ComboDetailRouteParams = z.output<typeof ComboDetailRouteParamsSchema>;

export type ListsRouteParams = z.output<typeof ListsRouteParamsSchema>;

export type BuilderRouteParams = z.output<typeof BuilderRouteParamsSchema>;

export type CatalogRoute = z.output<typeof CatalogRouteSchema>;

export type ComboDetailRoute = z.output<typeof ComboDetailRouteSchema>;

export type ListsRoute = z.output<typeof ListsRouteSchema>;

export type BuilderRoute = z.output<typeof BuilderRouteSchema>;

export type GameRoute = z.output<typeof GameRouteSchema>;
