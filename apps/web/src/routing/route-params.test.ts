import { comboSources } from "@mk-combos/contracts/identity/value";
import { describe, expect, it } from "vitest";
import { parseComboDetailPathParams, parseInstalledGamePathParams } from "./route-params";

describe("web route param boundaries", () => {
  it("accepts only installed open GameId values", () => {
    expect(parseInstalledGamePathParams({ gameId: "mkxl" })).toEqual({ gameId: "mkxl" });
    expect(parseInstalledGamePathParams({ gameId: "mk1" })).toEqual({ gameId: "mk1" });
    expect(parseInstalledGamePathParams({ gameId: "future-game" })).toBe(false);
    expect(parseInstalledGamePathParams({ gameId: "" })).toBe(false);
  });

  it("normalizes supported combo detail params and strips parent params", () => {
    expect(
      parseComboDetailPathParams({
        comboId: "scorpion-bnb-001",
        gameId: "mkxl",
        source: comboSources.seeded,
      }),
    ).toEqual({ comboId: "scorpion-bnb-001", source: comboSources.seeded });
    expect(
      parseComboDetailPathParams({
        comboId: "local-1729",
        gameId: "mk1",
        source: comboSources.custom,
      }),
    ).toEqual({ comboId: "local-1729", source: comboSources.custom });
  });

  it("rejects unsupported combo sources and empty combo ids", () => {
    expect(parseComboDetailPathParams({ comboId: "combo", source: "future" })).toBe(false);
    expect(parseComboDetailPathParams({ comboId: "", source: comboSources.seeded })).toBe(false);
  });
});
