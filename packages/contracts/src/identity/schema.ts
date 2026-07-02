import { z } from "zod/v4";

import { comboSources } from "./value";

export { comboSources } from "./value";

export const GameIdSchema = z.string().min(1);

export const ComboIdSchema = z.string().min(1);

export const ComboSourceSchema = z.enum(comboSources);

export const RouteComboSourceSchema = z.enum(comboSources);

export const ComboRefSchema = z
  .object({
    gameId: GameIdSchema,
    source: ComboSourceSchema,
    comboId: ComboIdSchema,
  })
  .strict();
