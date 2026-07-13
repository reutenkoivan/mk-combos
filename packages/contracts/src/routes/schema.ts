import { z } from "zod/v4";

import {
  ComboIdSchema,
  ComboRefSchema,
  GameIdSchema,
  RouteComboSourceSchema,
} from "../identity/schema";
import { appRouteKinds, gameRouteKinds } from "./value";

export { appRouteKinds, gameRouteKinds } from "./value";

export const GameRouteKindSchema = z.enum(gameRouteKinds);

export const AppRouteKindSchema = z.enum(appRouteKinds);

export const CatalogRouteParamsSchema = z
  .object({
    gameId: GameIdSchema,
  })
  .strict();

export const ComboDetailRouteParamsSchema = ComboRefSchema;

export const ListsRouteParamsSchema = z
  .object({
    gameId: GameIdSchema,
  })
  .strict();

export const BuilderRouteParamsSchema = z
  .object({
    gameId: GameIdSchema,
  })
  .strict();

export const SettingsRouteParamsSchema = z.record(z.string(), z.never());

export const CatalogRouteSchema = z
  .object({
    kind: z.literal(gameRouteKinds.catalog),
    gameId: GameIdSchema,
  })
  .strict();

export const ComboDetailRouteSchema = z
  .object({
    kind: z.literal(gameRouteKinds.comboDetail),
    gameId: GameIdSchema,
    source: RouteComboSourceSchema,
    comboId: ComboIdSchema,
  })
  .strict();

export const ListsRouteSchema = z
  .object({
    kind: z.literal(gameRouteKinds.lists),
    gameId: GameIdSchema,
  })
  .strict();

export const BuilderRouteSchema = z
  .object({
    kind: z.literal(gameRouteKinds.builder),
    gameId: GameIdSchema,
  })
  .strict();

export const SettingsRouteSchema = z
  .object({
    kind: z.literal(appRouteKinds.settings),
  })
  .strict();

export const GameRouteSchema = z.discriminatedUnion("kind", [
  CatalogRouteSchema,
  ComboDetailRouteSchema,
  ListsRouteSchema,
  BuilderRouteSchema,
]);

export const AppRouteSchema = z.discriminatedUnion("kind", [
  CatalogRouteSchema,
  ComboDetailRouteSchema,
  ListsRouteSchema,
  BuilderRouteSchema,
  SettingsRouteSchema,
]);
