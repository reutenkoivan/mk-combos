import { GameIdSchema } from "@mk-combos/contracts/identity/schema";
import { z } from "zod/v4";

export const InstalledGamePathParamsSchema = z.object({
  gameId: GameIdSchema,
});
