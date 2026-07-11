import { Mk1BuilderContextSchema } from "@mk-combos/mk1-builder/context/schema";
import { Mk1BuilderMoveChoiceSchema } from "@mk-combos/mk1-builder/graph/schema";
import { describe, expect, it } from "vitest";

describe("@mk-combos/mk1-builder schemas", () => {
  it("requires character and kameo context", () => {
    expect(
      Mk1BuilderContextSchema.safeParse({
        characterId: "scorpion",
        kameoId: "cyrax",
      }).success,
    ).toBe(true);
    expect(
      Mk1BuilderContextSchema.safeParse({
        characterId: "scorpion",
        variationId: "scorpion:ninjutsu",
      }).success,
    ).toBe(false);
  });

  it("parses move choices", () => {
    const parsed = Mk1BuilderMoveChoiceSchema.safeParse({
      id: "scorpion:quick-strike",
      kind: "move",
      moveId: "scorpion:quick-strike",
      label: "Quick Strike",
      candidates: [
        {
          moveId: "scorpion:quick-strike",
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });
});
