import {
  parseMk1CatalogRouteQuery,
  recoverMk1CatalogContext,
  selectMk1CatalogCharacter,
  selectMk1CatalogKameo,
  serializeMk1CatalogRouteQuery,
} from "@mk-combos/mk1-catalog/context/runtime";
import { Mk1CatalogPlainRouteQuerySchema } from "@mk-combos/mk1-catalog/context/schema";
import { comboMatchesMk1CatalogFilters } from "@mk-combos/mk1-catalog/filters/runtime";
import {
  getMk1CatalogComboSummary,
  selectMk1CatalogComboSummaries,
  selectMk1CatalogSeededCombos,
} from "@mk-combos/mk1-catalog/selectors/runtime";
import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { describe, expect, it } from "vitest";

describe("@mk-combos/mk1-catalog selectors", () => {
  it("recovers invalid route context without leaking variation semantics", () => {
    const parsed = Mk1CatalogPlainRouteQuerySchema.safeParse({
      character: "scorpion",
      kameo: "cyrax",
      variation: "scorpion:ninjutsu",
    });
    const invalidCharacter = recoverMk1CatalogContext({
      characterId: "missing",
      kameoId: "cyrax",
    });
    const invalidKameo = recoverMk1CatalogContext({
      characterId: "scorpion",
      kameoId: "missing",
    });

    expect(parsed.success).toBe(false);
    expect(invalidCharacter.status).toBe("empty");
    expect(invalidKameo.status).toBe("characterSelected");
    expect(invalidKameo.context).toEqual({ characterId: "scorpion" });
  });

  it("parses and serializes route query with character, kameo, and shared filters", () => {
    const parsed = parseMk1CatalogRouteQuery({
      character: ["scorpion", "ignored"],
      kameo: "cyrax",
      meter: ["1"],
      tag: ["pair-coverage", "pair-coverage"],
    });
    const serialized = serializeMk1CatalogRouteQuery(parsed.context, parsed.filters);

    expect(parsed.status).toBe("ready");
    expect(parsed.context).toEqual({
      characterId: "scorpion",
      kameoId: "cyrax",
    });
    expect(serialized).toEqual({
      character: "scorpion",
      kameo: "cyrax",
      meter: ["1"],
      tag: ["pair-coverage"],
    });
  });

  it("selects character and kameo as required MK1 context", () => {
    const selectedCharacter = selectMk1CatalogCharacter("scorpion");
    const selectedKameo = selectMk1CatalogKameo(selectedCharacter.context, "cyrax");

    expect(selectedCharacter.status).toBe("characterSelected");
    expect(selectedKameo.status).toBe("ready");
    expect(selectedKameo.context).toEqual({
      characterId: "scorpion",
      kameoId: "cyrax",
    });
  });

  it("returns summaries and filters for selected character + kameo only", () => {
    const context = {
      characterId: "scorpion",
      kameoId: "cyrax",
    };
    const seeded = selectMk1CatalogSeededCombos({
      context,
      filters: {
        meter: [1],
        tags: ["pair-coverage"],
      },
    });
    const summaries = selectMk1CatalogComboSummaries({ context });
    const firstSummary = summaries[0];

    expect(seeded).toHaveLength(1);
    expect(summaries).toHaveLength(1);
    expect(firstSummary?.character.id).toBe("scorpion");
    expect(firstSummary?.kameo.id).toBe("cyrax");
    expect(getMk1CatalogComboSummary("scorpion-cyrax-seed-001")?.kameo.id).toBe("cyrax");
  });

  it("applies optional filters without treating kameo as optional facet", () => {
    const combo = mk1SeededCombos[0];

    expect(combo).toBeDefined();
    if (!combo) {
      throw new Error("MK1 combo should be present.");
    }
    expect(comboMatchesMk1CatalogFilters(combo, { tags: ["pair-coverage"] })).toBe(true);
    expect(comboMatchesMk1CatalogFilters(combo, { tags: ["missing"] })).toBe(false);
  });
});
