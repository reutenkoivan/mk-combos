import type { z } from "zod/v4";

import type {
  AppRouteKindSchema,
  AppRouteSchema,
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
  SettingsRouteParamsSchema,
  SettingsRouteSchema,
} from "./schema";

export { appRouteKinds, gameRouteKinds } from "./value";

export type GameRouteKind = z.output<typeof GameRouteKindSchema>;

export type AppRouteKind = z.output<typeof AppRouteKindSchema>;

export type CatalogRouteParams = z.output<typeof CatalogRouteParamsSchema>;

export type ComboDetailRouteParams = z.output<typeof ComboDetailRouteParamsSchema>;

export type ListsRouteParams = z.output<typeof ListsRouteParamsSchema>;

export type BuilderRouteParams = z.output<typeof BuilderRouteParamsSchema>;

export type SettingsRouteParams = z.output<typeof SettingsRouteParamsSchema>;

export type CatalogRoute = z.output<typeof CatalogRouteSchema>;

export type ComboDetailRoute = z.output<typeof ComboDetailRouteSchema>;

export type ListsRoute = z.output<typeof ListsRouteSchema>;

export type BuilderRoute = z.output<typeof BuilderRouteSchema>;

export type SettingsRoute = z.output<typeof SettingsRouteSchema>;

export type GameRoute = z.output<typeof GameRouteSchema>;

export type AppRoute = z.output<typeof AppRouteSchema>;

export type RouteParamsByKind = {
  catalog: CatalogRouteParams;
  comboDetail: ComboDetailRouteParams;
  lists: ListsRouteParams;
  builder: BuilderRouteParams;
  settings: SettingsRouteParams;
};
