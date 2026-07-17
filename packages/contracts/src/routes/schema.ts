import { z } from "zod/v4";

import { ComboIdSchema, GameIdSchema } from "../identity/schema";
import { gameRouteKinds } from "./value";

export { gameRouteKinds } from "./value";

export const GameRouteKindSchema = z.enum(gameRouteKinds);

export const CatalogRouteParamsSchema = z
  .object({
    gameId: GameIdSchema,
  })
  .strict();

const CatalogContextSlugSchema = z.string().min(1);

export const ComboDetailRouteParamsSchema = z
  .object({
    characterSlug: CatalogContextSlugSchema,
    comboId: ComboIdSchema,
    gameId: GameIdSchema,
    specificationSlug: CatalogContextSlugSchema,
  })
  .strict();

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

export const CatalogRouteSchema = z
  .object({
    kind: z.literal(gameRouteKinds.catalog),
    gameId: GameIdSchema,
  })
  .strict();

export const ComboDetailRouteSchema = ComboDetailRouteParamsSchema.extend({
  kind: z.literal(gameRouteKinds.comboDetail),
});

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

export const GameRouteSchema = z.discriminatedUnion("kind", [
  CatalogRouteSchema,
  ComboDetailRouteSchema,
  ListsRouteSchema,
  BuilderRouteSchema,
]);
