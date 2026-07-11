import type { MkxlCatalogFilterFacet } from "@mk-combos/mkxl-catalog/filters/type";
import {
  getMkxlCatalogComboSummary,
  getMkxlCatalogFilterFacets,
  selectMkxlCatalogComboSummaries,
  selectMkxlCatalogSeededCombos,
  summarizeMkxlCatalogCombo,
} from "@mk-combos/mkxl-catalog/selectors/runtime";
import { MkxlCatalogComboSummarySchema } from "@mk-combos/mkxl-catalog/summary/schema";
import { mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import { describe, expect, it } from "vitest";

const scorpionNinjutsuContext = {
  characterId: "scorpion",
  variationId: "scorpion:ninjutsu",
} as const;

const jaxWrestlerContext = {
  characterId: "jax",
  variationId: "jax:wrestler",
} as const;

const expectPresent = <T>(value: T | undefined, label: string): T => {
  expect(value, label).toBeDefined();
  if (!value) {
    throw new Error(`${label} should be present.`);
  }

  return value;
};

const seededComboIds = (
  combos: readonly (typeof mkxlSeededCombos)[number][],
): readonly string[] => {
  const ids: string[] = [];

  for (const combo of combos) {
    ids.push(combo.id);
  }

  return ids;
};

const bruteForceContextCombos = (
  context: typeof scorpionNinjutsuContext | typeof jaxWrestlerContext,
) => {
  const combos: (typeof mkxlSeededCombos)[number][] = [];

  for (const combo of mkxlSeededCombos) {
    if (combo.characterId === context.characterId && combo.variationId === context.variationId) {
      combos.push(combo);
    }
  }

  return combos;
};

const expectFacet = (facets: readonly MkxlCatalogFilterFacet[], id: string) => {
  for (const facet of facets) {
    if (facet.id === id) {
      return facet;
    }
  }

  throw new Error(`${id} facet should be present.`);
};

const expectOption = (
  facet: Extract<MkxlCatalogFilterFacet, { kind: "multiSelect" }>,
  id: string,
) => {
  for (const option of facet.options) {
    if (option.id === id) {
      return option;
    }
  }

  throw new Error(`${id} option should be present.`);
};

type BruteForceFacetCounts = {
  starters: ReadonlyMap<string, number>;
  meter: ReadonlyMap<string, number>;
  tags: ReadonlyMap<string, number>;
  stages: ReadonlyMap<string, number>;
  interactables: ReadonlyMap<string, number>;
};

const incrementCount = (counts: Map<string, number>, id: string) => {
  counts.set(id, (counts.get(id) ?? 0) + 1);
};

const createBruteForceFacetCounts = (
  combos: readonly (typeof mkxlSeededCombos)[number][],
): BruteForceFacetCounts => {
  const starters = new Map<string, number>();
  const meter = new Map<string, number>();
  const tags = new Map<string, number>();
  const stages = new Map<string, number>();
  const interactables = new Map<string, number>();

  for (const combo of combos) {
    incrementCount(starters, combo.metadata.starter);
    incrementCount(meter, String(combo.metadata.meter));

    for (const tag of combo.metadata.tags) {
      incrementCount(tags, tag);
    }

    if (combo.stageContext.kind !== "stageSpecific") {
      continue;
    }

    incrementCount(stages, combo.stageContext.stageId);

    const countedInteractables = new Set<string>();

    for (const interactableId of combo.stageContext.interactableIds) {
      if (countedInteractables.has(interactableId)) {
        continue;
      }

      countedInteractables.add(interactableId);
      incrementCount(interactables, interactableId);
    }
  }

  return {
    starters,
    meter,
    tags,
    stages,
    interactables,
  };
};

describe("@mk-combos/mkxl-catalog selectors", () => {
  it("selects only combos for required character + variation context", () => {
    const combos = selectMkxlCatalogSeededCombos({
      context: scorpionNinjutsuContext,
    });

    expect(combos.length).toBeGreaterThan(1);
    expect(seededComboIds(combos)).toEqual(
      seededComboIds(bruteForceContextCombos(scorpionNinjutsuContext)),
    );
    expect(
      combos.every(
        (combo) =>
          combo.characterId === scorpionNinjutsuContext.characterId &&
          combo.variationId === scorpionNinjutsuContext.variationId,
      ),
    ).toBe(true);
    expect(
      selectMkxlCatalogSeededCombos({
        context: { characterId: "scorpion" },
      }),
    ).toEqual([]);
  });

  it("applies starter, position, meter, difficulty, route type, and tag filters", () => {
    const filtered = selectMkxlCatalogSeededCombos({
      context: scorpionNinjutsuContext,
      filters: {
        starters: ["F2", "B2"],
        positions: ["midscreen"],
        meter: [0],
        difficulties: ["easy"],
        routeTypes: ["bnb"],
        tags: ["community", "beginner"],
      },
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (combo) =>
          ["F2", "B2"].includes(combo.metadata.starter) &&
          combo.metadata.position === "midscreen" &&
          combo.metadata.meter === 0 &&
          combo.metadata.difficulty === "easy" &&
          combo.metadata.routeType === "bnb" &&
          ["community", "beginner"].every((tag) => combo.metadata.tags.includes(tag)),
      ),
    ).toBe(true);
  });

  it("applies inclusive damage range filters", () => {
    const filtered = selectMkxlCatalogSeededCombos({
      context: scorpionNinjutsuContext,
      filters: {
        damage: {
          min: 30,
          max: 30,
        },
      },
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((combo) => combo.metadata.damage === 30)).toBe(true);
  });

  it("applies stage and interactable filters only to stage-specific combos", () => {
    const stageSpecific = selectMkxlCatalogSeededCombos({
      context: jaxWrestlerContext,
      filters: {
        stageId: "destroyed-city",
        interactableIds: ["destroyed-city:position-escape"],
      },
    });
    const stageAgnostic = selectMkxlCatalogSeededCombos({
      context: scorpionNinjutsuContext,
      filters: {
        stageId: "destroyed-city",
      },
    });

    expect(stageSpecific).toHaveLength(1);
    expect(stageSpecific[0]?.stageContext).toMatchObject({
      kind: "stageSpecific",
      stageId: "destroyed-city",
      interactableIds: ["destroyed-city:position-escape"],
    });
    expect(stageAgnostic).toEqual([]);
  });

  it("summarizes seeded combos into UI-ready catalog summaries", () => {
    const combo = expectPresent(
      mkxlSeededCombos.find((entry) => entry.id === "jax-wrestler-starter-001"),
      "Jax Wrestler stage combo",
    );
    const summary = summarizeMkxlCatalogCombo(combo);

    expect(MkxlCatalogComboSummarySchema.parse(summary)).toEqual(summary);
    expect(summary.ref).toEqual({
      gameId: "mkxl",
      source: "seeded",
      comboId: combo.id,
    });
    expect(summary.cachedNotation).toBe(combo.notation);
    expect(summary.movePath).toBe(combo.movePath);
    expect(summary.metadata).toBe(combo.metadata);
    expect(summary.tags).toBe(combo.metadata.tags);
    expect(summary.stage).toMatchObject({ id: "destroyed-city" });
    expect(summary.interactables).toEqual([
      expect.objectContaining({ id: "destroyed-city:position-escape" }),
    ]);
    expect(getMkxlCatalogComboSummary(combo.id)).toEqual(summary);
  });

  it("creates facet descriptors for current context and filters", () => {
    const facets = getMkxlCatalogFilterFacets(scorpionNinjutsuContext, {
      meter: [0],
      tags: ["community"],
    });
    const summaries = selectMkxlCatalogComboSummaries({
      context: scorpionNinjutsuContext,
    });
    const facetIds: string[] = [];

    for (const facet of facets) {
      facetIds.push(facet.id);
    }

    expect(facetIds).toEqual([
      "starter",
      "position",
      "meter",
      "damage",
      "difficulty",
      "routeType",
      "tags",
      "stage",
      "interactable",
    ]);
    expect(facets.find((facet) => facet.id === "meter")).toMatchObject({
      kind: "multiSelect",
      options: expect.arrayContaining([expect.objectContaining({ id: "0", selected: true })]),
    });
    expect(summaries.length).toBeGreaterThan(0);
    expect(summaries.every((summary) => summary.character.id === "scorpion")).toBe(true);
  });

  it("keeps single-pass facet counts equivalent to brute-force counts", () => {
    const contextCombos = bruteForceContextCombos(jaxWrestlerContext);
    const expectedCounts = createBruteForceFacetCounts(contextCombos);
    const firstCombo = expectPresent(contextCombos[0], "Jax Wrestler combo");
    const selectedTag = expectPresent(firstCombo.metadata.tags[0], "Jax Wrestler combo tag");
    const facets = getMkxlCatalogFilterFacets(jaxWrestlerContext, {
      meter: [0],
      tags: [selectedTag],
      stageId: "destroyed-city",
      interactableIds: ["destroyed-city:position-escape"],
    });
    const starterFacet = expectFacet(facets, "starter");
    const meterFacet = expectFacet(facets, "meter");
    const tagsFacet = expectFacet(facets, "tags");
    const stageFacet = expectFacet(facets, "stage");
    const interactableFacet = expectFacet(facets, "interactable");

    expect(starterFacet.kind).toBe("multiSelect");
    expect(meterFacet.kind).toBe("multiSelect");
    expect(tagsFacet.kind).toBe("multiSelect");
    expect(stageFacet.kind).toBe("multiSelect");
    expect(interactableFacet.kind).toBe("multiSelect");

    if (
      starterFacet.kind !== "multiSelect" ||
      meterFacet.kind !== "multiSelect" ||
      tagsFacet.kind !== "multiSelect" ||
      stageFacet.kind !== "multiSelect" ||
      interactableFacet.kind !== "multiSelect"
    ) {
      throw new Error("Expected only multi-select facets in this equivalence check.");
    }

    expect(expectOption(starterFacet, firstCombo.metadata.starter).count).toBe(
      expectedCounts.starters.get(firstCombo.metadata.starter),
    );
    expect(expectOption(meterFacet, "0")).toMatchObject({
      count: expectedCounts.meter.get("0"),
      selected: true,
    });
    expect(expectOption(tagsFacet, selectedTag)).toMatchObject({
      count: expectedCounts.tags.get(selectedTag),
      selected: true,
    });
    expect(expectOption(stageFacet, "destroyed-city")).toMatchObject({
      count: expectedCounts.stages.get("destroyed-city"),
      selected: true,
    });
    expect(expectOption(interactableFacet, "destroyed-city:position-escape")).toMatchObject({
      count: expectedCounts.interactables.get("destroyed-city:position-escape"),
      selected: true,
    });

    const destroyedCity = expectPresent(
      mkxlStages.find((stage) => stage.id === "destroyed-city"),
      "Destroyed City stage",
    );

    for (const option of interactableFacet.options) {
      expect(
        destroyedCity.interactables.some((interactable) => interactable.id === option.id),
      ).toBe(true);
    }
  });
});
