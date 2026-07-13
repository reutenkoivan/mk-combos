import { GameIdSchema } from "@mk-combos/contracts/identity/schema";
import { z } from "zod/v4";

import { gameIconKinds } from "./value";

export const GameIconKindSchema = z.enum(gameIconKinds);

const gameIconAssetBaseShape = {
  accessibleLabel: z.string().min(1),
  assetPath: z.string().regex(/^icons\/game\/[a-z0-9-]+\/.+\.svg$/u),
  gameId: GameIdSchema,
  id: z.string().min(1),
  src: z.string().min(1),
};

export const GameIconAssetSchema = z.discriminatedUnion("kind", [
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds.character),
    })
    .strict(),
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds.faction),
    })
    .strict(),
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds.interactable),
      parentId: z.string().min(1),
    })
    .strict(),
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds["interactable-type"]),
    })
    .strict(),
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds.realm),
    })
    .strict(),
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds.stage),
    })
    .strict(),
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds.state),
    })
    .strict(),
  z
    .object({
      ...gameIconAssetBaseShape,
      kind: z.literal(gameIconKinds.variation),
      parentId: z.string().min(1),
    })
    .strict(),
]);
