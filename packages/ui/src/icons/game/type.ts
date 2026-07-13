import type { z } from "zod/v4";

import type { GameIconAssetSchema, GameIconKindSchema } from "./schema";

export { gameIconKinds } from "./value";

export type GameIconKind = z.output<typeof GameIconKindSchema>;

export type GameIconAsset = z.output<typeof GameIconAssetSchema>;
