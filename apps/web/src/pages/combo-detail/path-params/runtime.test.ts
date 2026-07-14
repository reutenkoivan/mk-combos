import { comboSources } from "@mk-combos/contracts/identity/value";
import { describe, expect, it } from "vitest";
import { parseComboDetailPathParams } from "./runtime";

describe("combo detail path boundary", () => {
  it("normalizes supported params and strips parent params", () => {
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

  it("rejects unsupported sources and empty combo ids", () => {
    expect(parseComboDetailPathParams({ comboId: "combo", source: "future" })).toBe(false);
    expect(parseComboDetailPathParams({ comboId: "", source: comboSources.seeded })).toBe(false);
  });
});
