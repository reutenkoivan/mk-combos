import {
  getMk1CatalogContextOptions,
  recoverMk1CatalogContext,
} from "@mk-combos/mk1-catalog/context/runtime";
import { mk1CatalogSources } from "@mk-combos/mk1-catalog/filters/value";
import {
  getMk1CatalogFilterFacets,
  selectMk1CatalogComboSummaries,
  selectMk1CatalogSeededCombos,
} from "@mk-combos/mk1-catalog/selectors/runtime";
import { describe, expect, it } from "vitest";

const context = { characterId: "scorpion", kameoId: "cyrax" } as const;

describe("MK1 catalog selectors", () => {
  it("prepares context options and filters seeded combos with the public taxonomy", () => {
    const options = getMk1CatalogContextOptions({ characterId: "scorpion" });
    const combos = selectMk1CatalogSeededCombos({
      context,
      filters: {
        positions: ["midscreen"],
        meter: [1],
        difficulties: ["easy"],
        routeClasses: ["kameo"],
        sources: [mk1CatalogSources.curated],
      },
    });
    expect(options.characters.length).toBeGreaterThan(0);
    expect(options.kameos.length).toBeGreaterThan(0);
    expect(options.characters.find((option) => option.id === "ashrah")?.pickerSlot).toEqual({
      slotId: "character-slot-1",
      optionId: "ashrah",
      row: 1,
      column: 1,
      compactOrder: 1,
      status: "selectable",
    });
    expect(options.kameos.find((option) => option.id === "cyrax")?.pickerSlot).toEqual({
      slotId: "kameo-slot-1",
      optionId: "cyrax",
      row: 1,
      column: 1,
      compactOrder: 1,
      status: "selectable",
    });
    expect(combos.length).toBeGreaterThan(0);
    expect(combos.every((combo) => combo.sourceIds.includes("curated-route-seed"))).toBe(true);
  });

  it("prepares provenance and semantic route steps without exposing game rules to web", () => {
    const summary = selectMk1CatalogComboSummaries({ context })[0];
    expect(summary).toBeDefined();
    if (!summary) throw new Error("Expected MK1 summary.");
    expect(summary.provenance).toBe(mk1CatalogSources.curated);
    expect(summary.sourceIds.length).toBeGreaterThan(0);
    expect(summary.routeSteps).toHaveLength(summary.movePath.length);
    expect(summary.routeSteps[0]).toMatchObject({
      kind: "starter",
      repetitionCount: 1,
      emphasis: "standard",
    });
    expect(summary.routeSteps.at(-1)).toMatchObject({ kind: "finish", emphasis: "strong" });
  });

  it("returns five ordered facets and keeps Personal visible but disabled", () => {
    const facets = getMk1CatalogFilterFacets(context);
    expect(facets.map((facet) => facet.id)).toEqual([
      "position",
      "meter",
      "difficulty",
      "routeClass",
      "source",
    ]);
    const sourceFacet = facets.find((facet) => facet.id === "source");
    expect(sourceFacet?.kind).toBe("multiSelect");
    if (sourceFacet?.kind !== "multiSelect") throw new Error("Expected source facet.");
    expect(sourceFacet.options.find((option) => option.id === "personal")).toMatchObject({
      count: 0,
      selected: false,
      disabled: true,
    });
  });

  it("recovers invalid pathname-owned context without any query fallback", () => {
    expect(recoverMk1CatalogContext({ characterId: "missing", kameoId: "cyrax" })).toMatchObject({
      status: "empty",
      context: {},
    });
  });
});
