import type { GameId } from "@mk-combos/contracts/identity/type";

import type { InstalledGameCatalogAdapter } from "./catalog-adapter/type";
import type { InstalledGameBusiness } from "./type";
import { installedGameCatalogAdapters, installedGames } from "./value";

const installedGamesById = new Map<GameId, InstalledGameBusiness>(
  installedGames.map((game) => [game.id, game] as const),
);

const installedGameCatalogAdaptersById = new Map<GameId, InstalledGameCatalogAdapter>(
  installedGameCatalogAdapters.map((adapter) => [adapter.gameId, adapter] as const),
);

export function resolveInstalledGame(gameId: GameId): InstalledGameBusiness | undefined {
  return installedGamesById.get(gameId);
}

export function resolveInstalledGameCatalogAdapter(
  gameId: GameId,
): InstalledGameCatalogAdapter | undefined {
  return installedGameCatalogAdaptersById.get(gameId);
}
