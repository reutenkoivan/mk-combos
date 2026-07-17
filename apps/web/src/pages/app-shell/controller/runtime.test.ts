import { componentOptionStatuses } from "@mk-combos/ui/components/value";
import { describe, expect, it } from "vitest";

import { getControllerGameMenuOptions, moveCircular } from "./runtime";

describe("App Shell controller runtime", () => {
  it("keeps only non-current available games in authored order", () => {
    const games = [
      {
        gameId: "current",
        label: "Current",
        status: componentOptionStatuses.available,
      },
      {
        gameId: "disabled",
        label: "Disabled",
        status: componentOptionStatuses.disabledUnavailable,
      },
      {
        gameId: "next",
        label: "Next",
        status: componentOptionStatuses.available,
      },
      {
        gameId: "last",
        label: "Last",
        status: componentOptionStatuses.available,
      },
    ] as const;

    expect(getControllerGameMenuOptions(games, "current").map((game) => game.gameId)).toEqual([
      "next",
      "last",
    ]);
  });

  it("moves circularly through rendered order and handles an empty graph", () => {
    const order = ["game", "catalog", "builder", "settings"] as const;

    expect(moveCircular(order, 0, 1)).toBe("catalog");
    expect(moveCircular(order, 3, 1)).toBe("game");
    expect(moveCircular(order, 0, -1)).toBe("settings");
    expect(moveCircular([], 0, 1)).toBeUndefined();
  });
});
