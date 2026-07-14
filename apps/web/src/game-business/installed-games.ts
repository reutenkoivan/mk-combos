import type { GameId } from "@mk-combos/contracts/identity/type";
import { mk1Business } from "@mk-combos/mk1-business";
import { mkxlBusiness } from "@mk-combos/mkxl-business";

export const installedGames = [mkxlBusiness, mk1Business] as const;

export type InstalledGameBusiness = (typeof installedGames)[number];

const installedGamesById = new Map<GameId, InstalledGameBusiness>(
  installedGames.map((game) => [game.id, game] as const),
);

export function resolveInstalledGame(gameId: GameId): InstalledGameBusiness | undefined {
  return installedGamesById.get(gameId);
}
