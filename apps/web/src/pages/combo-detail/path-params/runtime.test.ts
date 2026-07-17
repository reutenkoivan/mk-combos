import { describe, expect, it } from "vitest";
import { parseComboDetailPathParams } from "./runtime";

describe("combo detail path boundary", () => {
  it("normalizes supported params and strips parent params", () => {
    expect(
      parseComboDetailPathParams({
        character: "scorpion",
        comboId: "scorpion-bnb-001",
        gameId: "mkxl",
        specification: "ninjutsu",
      }),
    ).toEqual({
      character: "scorpion",
      comboId: "scorpion-bnb-001",
      specification: "ninjutsu",
    });
    expect(
      parseComboDetailPathParams({
        character: "scorpion",
        comboId: "local-1729",
        gameId: "mk1",
        specification: "cyrax",
      }),
    ).toEqual({ character: "scorpion", comboId: "local-1729", specification: "cyrax" });
  });

  it("rejects empty catalog context and combo ids", () => {
    expect(
      parseComboDetailPathParams({ character: "", comboId: "combo", specification: "cyrax" }),
    ).toBe(false);
    expect(
      parseComboDetailPathParams({ character: "scorpion", comboId: "", specification: "cyrax" }),
    ).toBe(false);
  });
});
