import { ComboIdSchema } from "@mk-combos/contracts/identity/schema";
import { z } from "zod/v4";

export const ComboDetailPathParamsSchema = z.object({
  character: z.string().min(1),
  comboId: ComboIdSchema,
  specification: z.string().min(1),
});
