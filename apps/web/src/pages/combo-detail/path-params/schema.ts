import { ComboIdSchema, RouteComboSourceSchema } from "@mk-combos/contracts/identity/schema";
import { z } from "zod/v4";

export const ComboDetailPathParamsSchema = z.object({
  comboId: ComboIdSchema,
  source: RouteComboSourceSchema,
});
