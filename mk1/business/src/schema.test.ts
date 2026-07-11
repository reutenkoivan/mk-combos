import { Mk1BusinessCustomComboSchema } from "@mk-combos/mk1-business/schema";
import { describe, expect, it } from "vitest";

describe("@mk-combos/mk1-business schemas", () => {
  it("rejects MKXL-only custom combo fields", () => {
    const result = Mk1BusinessCustomComboSchema.safeParse({
      id: "local-1",
      gameId: "mk1",
      source: "custom",
      characterId: "scorpion",
      kameoId: "cyrax",
      variationId: "scorpion:ninjutsu",
      stageContext: {
        kind: "stageAgnostic",
      },
      movePath: ["scorpion:quick-strike"],
      cachedNotation: [["1"]],
      gameVersion: "definitive",
      createdAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});
