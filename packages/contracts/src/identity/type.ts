import type { z } from "zod/v4";

import type {
  ComboIdSchema,
  ComboRefSchema,
  ComboSourceSchema,
  GameIdSchema,
  RouteComboSourceSchema,
} from "./schema";

export { comboSources } from "./value";

export type GameId = z.output<typeof GameIdSchema>;

export type ComboId = z.output<typeof ComboIdSchema>;

export type ComboSource = z.output<typeof ComboSourceSchema>;

export type RouteComboSource = z.output<typeof RouteComboSourceSchema>;

export type ComboRef = z.output<typeof ComboRefSchema>;
