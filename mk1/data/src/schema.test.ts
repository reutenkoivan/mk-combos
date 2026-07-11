import { Mk1SeededComboSchema } from "@mk-combos/mk1-data/combos/schema";
import { describe, expect, it } from "vitest";

describe("@mk-combos/mk1-data schemas", () => {
  it("rejects MKXL-only variation and stage fields", () => {
    const result = Mk1SeededComboSchema.safeParse({
      id: "scorpion-cyrax-invalid-001",
      source: "seeded",
      gameId: "mk1",
      title: {
        EN: "Invalid",
      },
      characterId: "scorpion",
      kameoId: "cyrax",
      variationId: "scorpion:ninjutsu",
      stageContext: {
        kind: "stageAgnostic",
      },
      route: [
        {
          kind: "move",
          moveId: "scorpion:quick-strike",
        },
      ],
      movePath: ["scorpion:quick-strike"],
      notation: [["1"]],
      metadata: {
        damage: 1,
        meter: 0,
        position: "midscreen",
        starter: "Quick Strike",
        routeType: "kameo",
        difficulty: "easy",
        tags: [],
      },
      notes: {
        EN: "Invalid",
      },
      gameVersion: "definitive",
      sourceIds: ["curated-route-seed"],
    });

    expect(result.success).toBe(false);
  });
});
