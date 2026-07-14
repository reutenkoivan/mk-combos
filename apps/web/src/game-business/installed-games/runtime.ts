import type { GameId } from "@mk-combos/contracts/identity/type";

import type { InstalledGameBusiness } from "./type";
import { installedGames } from "./value";

const installedGamesById = new Map<GameId, InstalledGameBusiness>(
  installedGames.map((game) => [game.id, game] as const),
);

export function resolveInstalledGame(gameId: GameId): InstalledGameBusiness | undefined {
  return installedGamesById.get(gameId);
}
