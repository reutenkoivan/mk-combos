import { ComboDetailPathParamsSchema } from "./schema";
import type { ComboDetailPathParams } from "./type";

export function parseComboDetailPathParams(input: unknown): ComboDetailPathParams | false {
  const parsed = ComboDetailPathParamsSchema.safeParse(input);

  return parsed.success ? parsed.data : false;
}
