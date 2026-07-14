import { resolveInstalledGame } from "../../../game-business/installed-games/runtime";
import { InstalledGamePathParamsSchema } from "./schema";
import type { InstalledGamePathParams } from "./type";

export function parseInstalledGamePathParams(input: unknown): InstalledGamePathParams | false {
  const parsed = InstalledGamePathParamsSchema.safeParse(input);

  if (!parsed.success || resolveInstalledGame(parsed.data.gameId) === undefined) {
    return false;
  }

  return parsed.data;
}
