import { getMkxlCatalogContextOptions } from "@mk-combos/mkxl-catalog/context/runtime";
import { mkxlCatalogSources } from "@mk-combos/mkxl-catalog/filters/value";
import {
  getMkxlCatalogComboSummary,
  getMkxlCatalogFilterFacets,
  selectMkxlCatalogSeededCombos,
} from "@mk-combos/mkxl-catalog/selectors/runtime";
import { describe, expect, it } from "vitest";

const scorpionContext = {
  characterId: "scorpion",
  variationId: "scorpion:ninjutsu",
} as const;

describe("MKXL catalog selectors", () => {
  it("prepares authored context options and filters with the new public taxonomy", () => {
    const options = getMkxlCatalogContextOptions({ characterId: "scorpion" });
    const combos = selectMkxlCatalogSeededCombos({
      context: scorpionContext,
      filters: {
        positions: ["midscreen"],
        meter: [0],
        difficulties: ["easy"],
        routeClasses: ["bnb"],
        sources: [mkxlCatalogSources.community],
      },
    });
    expect(options.variations.some((option) => option.id === "scorpion:ninjutsu")).toBe(true);
    expect(options.characters.find((option) => option.id === "alien")?.pickerSlot).toEqual({
      slotId: "character-slot-1",
      optionId: "alien",
      row: 1,
      column: 1,
      compactOrder: 1,
      status: "selectable",
    });
    expect(options.characters.find((option) => option.id === "triborg")?.pickerSlot).toEqual({
      slotId: "character-slot-33",
      optionId: "triborg",
      row: 3,
      column: 11,
      compactOrder: 33,
      status: "selectable",
    });
    expect(combos.length).toBeGreaterThan(0);
    expect(combos.every((combo) => combo.sourceIds.includes("community-combo-source"))).toBe(true);
  });

  it("prepares provenance, semantic route steps, and collapsed repetition counts", () => {
    const summary = getMkxlCatalogComboSummary("scorpion-ninjutsu-community-beginner-002");
    expect(summary).toBeDefined();
    if (!summary) throw new Error("Expected MKXL summary.");
    expect(summary.provenance).toBe(mkxlCatalogSources.community);
    expect(summary.sourceIds).toEqual(["community-combo-source"]);
    expect(summary.routeSteps).toHaveLength(3);
    expect(summary.routeSteps[1]).toMatchObject({ repetitionCount: 3, kind: "link" });
    expect(summary.routeSteps.at(-1)).toMatchObject({ kind: "finish", emphasis: "strong" });
  });

  it("keeps stage and interactable cascade game-owned", () => {
    const stageCombos = selectMkxlCatalogSeededCombos({
      context: { characterId: "alien", variationId: "alien:tarkatan" },
      filters: {
        stageId: "crossroads",
        interactableIds: ["crossroads:position-escape"],
      },
    });
    expect(stageCombos).toHaveLength(1);
    expect(stageCombos[0]?.stageContext).toMatchObject({
      kind: "stageSpecific",
      stageId: "crossroads",
    });
  });

  it("returns the ordered command-deck taxonomy with disabled Personal", () => {
    const facets = getMkxlCatalogFilterFacets(scorpionContext);
    expect(facets.map((facet) => facet.id)).toEqual([
      "position",
      "meter",
      "difficulty",
      "routeClass",
      "source",
      "stage",
    ]);
    expect(facets.find((facet) => facet.id === "stage")?.kind).toBe("singleSelect");
    expect(facets.some((facet) => facet.id === "interactable")).toBe(false);
    const sourceFacet = facets.find((facet) => facet.id === "source");
    expect(sourceFacet?.kind).toBe("multiSelect");
    if (sourceFacet?.kind !== "multiSelect") throw new Error("Expected source facet.");
    expect(sourceFacet.options.find((option) => option.id === "personal")).toMatchObject({
      count: 0,
      selected: false,
      disabled: true,
    });
  });

  it("reveals only the selected stage interactables with current or non-zero counts", () => {
    const facets = getMkxlCatalogFilterFacets(
      { characterId: "alien", variationId: "alien:tarkatan" },
      { stageId: "crossroads", interactableIds: ["crossroads:position-escape"] },
    );
    const stage = facets.find((facet) => facet.id === "stage");
    const interactables = facets.find((facet) => facet.id === "interactable");

    expect(stage).toMatchObject({ kind: "singleSelect" });
    expect(stage?.options.every((option) => option.count > 0 || option.selected)).toBe(true);
    expect(interactables).toMatchObject({
      kind: "multiSelect",
      options: [
        expect.objectContaining({
          count: 1,
          id: "crossroads:position-escape",
          selected: true,
        }),
      ],
    });
  });
});
