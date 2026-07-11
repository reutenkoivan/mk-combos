import { mk1Business } from "@mk-combos/mk1-business";
import { describe, expect, it } from "vitest";

describe("@mk-combos/mk1-business runtime", () => {
  it("serves catalog, route, and builder adapters", () => {
    const parsed = mk1Business.catalog.parseRouteQuery({
      character: "scorpion",
      kameo: "cyrax",
    });
    const summaries = mk1Business.catalog.selectSeededSummaries({
      context: parsed.context,
    });
    const route = mk1Business.routes.comboDetail({
      gameId: "mk1",
      source: "seeded",
      comboId: "scorpion-cyrax-seed-001",
    });
    const builder = mk1Business.builder.createState({
      context: {
        characterId: "scorpion",
        kameoId: "cyrax",
      },
      movePath: summaries[0]?.movePath,
    });

    expect(parsed.status).toBe("ready");
    expect(summaries).toHaveLength(1);
    expect(route).toEqual({
      ok: true,
      value: "/mk1/combos/seeded/scorpion-cyrax-seed-001",
    });
    expect(builder.ok).toBe(true);
    if (!builder.ok) {
      throw new Error("MK1 builder state should succeed.");
    }
    expect(builder.value.comboState.status).toBe("fresh");
  });

  it("validates empty and malformed slices", () => {
    const empty = mk1Business.backup.createEmptySlice();
    const parsed = mk1Business.backup.parseSlice(empty);
    const invalid = mk1Business.backup.parseSlice({
      version: 1,
      customCombos: [],
      namedLists: [],
      variationId: "mkxl-only",
    });

    expect(parsed.ok).toBe(true);
    expect(invalid.ok).toBe(false);
  });

  it("derives cached notation from move path", () => {
    const notation = mk1Business.builder.deriveCachedNotation([
      "scorpion:quick-strike",
      "scorpion:rising-launcher",
      "kameo:cyrax:assist",
    ]);

    expect(notation.ok).toBe(true);
    if (!notation.ok) {
      throw new Error("Notation derivation should succeed.");
    }
    expect(notation.value).toEqual([["1", "1"], ["D", "2"], ["K"]]);
  });
});
