import {
  ComboIdSchema,
  GameIdSchema,
  RouteComboSourceSchema,
} from "@mk-combos/contracts/identity/schema";
import type { ComboId, GameId, RouteComboSource } from "@mk-combos/contracts/identity/type";
import { z } from "zod/v4";
import { resolveInstalledGame } from "../game-business/installed-games";

const InstalledGamePathParamsSchema = z.object({
  gameId: GameIdSchema,
});

const ComboDetailPathParamsSchema = z.object({
  comboId: ComboIdSchema,
  source: RouteComboSourceSchema,
});

export type InstalledGamePathParams = Readonly<{
  gameId: GameId;
}>;

export type ComboDetailPathParams = Readonly<{
  comboId: ComboId;
  source: RouteComboSource;
}>;

export function parseInstalledGamePathParams(input: unknown): InstalledGamePathParams | false {
  const parsed = InstalledGamePathParamsSchema.safeParse(input);

  if (!parsed.success || resolveInstalledGame(parsed.data.gameId) === undefined) {
    return false;
  }

  return parsed.data;
}

export function parseComboDetailPathParams(input: unknown): ComboDetailPathParams | false {
  const parsed = ComboDetailPathParamsSchema.safeParse(input);

  return parsed.success ? parsed.data : false;
}
