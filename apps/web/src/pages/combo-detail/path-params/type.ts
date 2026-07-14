import type { z } from "zod/v4";
import type { ComboDetailPathParamsSchema } from "./schema";

export type ComboDetailPathParams = z.output<typeof ComboDetailPathParamsSchema>;
