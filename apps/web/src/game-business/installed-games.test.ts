import type { GameId } from "@mk-combos/contracts/identity/type";
import { describe, expect, it } from "vitest";
import {
  type InstalledGameBusiness,
  installedGames,
  resolveInstalledGame,
} from "./installed-games";

describe("installed game registry", () => {
  it("keeps the installed game order, ids, and labels stable", () => {
    expect(installedGames.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: "mkxl", label: "MKXL" },
      { id: "mk1", label: "MK1" },
    ]);
  });

  it("contains unique game ids", () => {
    const ids = installedGames.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves each installed business object by identity", () => {
    for (const game of installedGames) {
      const installedGame: InstalledGameBusiness = game;

      expect(resolveInstalledGame(installedGame.id)).toBe(installedGame);
    }
  });

  it("keeps GameId open for games that are not installed", () => {
    const futureGameId: GameId = "future-game";

    expect(resolveInstalledGame(futureGameId)).toBeUndefined();
  });
});
