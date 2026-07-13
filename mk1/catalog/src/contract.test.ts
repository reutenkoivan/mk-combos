import * as contextRuntime from "@mk-combos/mk1-catalog/context/runtime";
import {
  mk1CatalogRecoveryCodes as contextSchemaRecoveryCodes,
  mk1CatalogRouteQueryKeys as contextSchemaRouteQueryKeys,
  mk1CatalogContextStatuses as contextSchemaStatuses,
  Mk1CatalogContextSchema,
} from "@mk-combos/mk1-catalog/context/schema";
import type {
  Mk1CatalogContext,
  Mk1CatalogOptionAvailability,
  Mk1CatalogPlainRouteQuery,
  Mk1CatalogRecoveryCode,
  Mk1CatalogRequiredContext,
  Mk1CatalogRouteQueryKey,
} from "@mk-combos/mk1-catalog/context/type";
import {
  mk1CatalogRecoveryCodes as contextTypeRecoveryCodes,
  mk1CatalogRouteQueryKeys as contextTypeRouteQueryKeys,
  mk1CatalogContextStatuses as contextTypeStatuses,
} from "@mk-combos/mk1-catalog/context/type";
import {
  mk1CatalogContextStatuses,
  mk1CatalogOptionAvailabilities,
  mk1CatalogRecoveryCodes,
  mk1CatalogRouteQueryKeys,
} from "@mk-combos/mk1-catalog/context/value";
import * as contractEntry from "@mk-combos/mk1-catalog/contract";
import { mk1CatalogContractGroups, mkCombosMk1Catalog } from "@mk-combos/mk1-catalog/contract";
import * as filterRuntime from "@mk-combos/mk1-catalog/filters/runtime";
import {
  mk1CatalogFilterIds as filterSchemaIds,
  mk1CatalogMultiSelectFilterIds as filterSchemaMultiSelectIds,
  mk1CatalogRangeFilterIds as filterSchemaRangeIds,
  Mk1CatalogFiltersSchema,
} from "@mk-combos/mk1-catalog/filters/schema";
import type {
  Mk1CatalogDamageRange,
  Mk1CatalogFilterFacet,
  Mk1CatalogFilterId,
  Mk1CatalogFilters,
  Mk1CatalogMultiSelectFacet,
  Mk1CatalogMultiSelectFilterId,
  Mk1CatalogRangeFacet,
  Mk1CatalogRangeFilterId,
} from "@mk-combos/mk1-catalog/filters/type";
import {
  mk1CatalogFilterIds as filterTypeIds,
  mk1CatalogMultiSelectFilterIds as filterTypeMultiSelectIds,
  mk1CatalogRangeFilterIds as filterTypeRangeIds,
} from "@mk-combos/mk1-catalog/filters/type";
import {
  mk1CatalogFilterIds,
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogRangeFilterIds,
} from "@mk-combos/mk1-catalog/filters/value";
import * as selectorRuntime from "@mk-combos/mk1-catalog/selectors/runtime";
import { Mk1CatalogComboSummarySchema } from "@mk-combos/mk1-catalog/summary/schema";
import type { Mk1CatalogComboSummary } from "@mk-combos/mk1-catalog/summary/type";
import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_contract: {
  context: Mk1CatalogContext;
  damageRange: Mk1CatalogDamageRange;
  filters: Mk1CatalogFilters;
  facet: Mk1CatalogFilterFacet;
  filterId: Mk1CatalogFilterId;
  multiSelectFacet: Mk1CatalogMultiSelectFacet;
  multiSelectFilterId: Mk1CatalogMultiSelectFilterId;
  optionAvailability: Mk1CatalogOptionAvailability;
  plainRouteQuery: Mk1CatalogPlainRouteQuery;
  rangeFacet: Mk1CatalogRangeFacet;
  rangeFilterId: Mk1CatalogRangeFilterId;
  recoveryCode: Mk1CatalogRecoveryCode;
  requiredContext: Mk1CatalogRequiredContext;
  routeQueryKey: Mk1CatalogRouteQueryKey;
  summary: Mk1CatalogComboSummary;
}) => true;

describe("@mk-combos/mk1-catalog contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mk1CatalogContractGroups",
      "mkCombosMk1Catalog",
    ]);
    expect(mkCombosMk1Catalog.packageName).toBe("@mk-combos/mk1-catalog");
    expect(mkCombosMk1Catalog.groups).toBe(mk1CatalogContractGroups);
  });

  it("documents every public subpath group", () => {
    expect(mk1CatalogContractGroups.context).toEqual({
      runtime: "@mk-combos/mk1-catalog/context/runtime",
      schema: "@mk-combos/mk1-catalog/context/schema",
      type: "@mk-combos/mk1-catalog/context/type",
      value: "@mk-combos/mk1-catalog/context/value",
    });
    expect(mk1CatalogContractGroups.filters.runtime).toBe("@mk-combos/mk1-catalog/filters/runtime");
    expect(mk1CatalogContractGroups.selectors.runtime).toBe(
      "@mk-combos/mk1-catalog/selectors/runtime",
    );
  });

  it("keeps public subpaths importable", () => {
    const context = Mk1CatalogContextSchema.parse({
      characterId: "scorpion",
      kameoId: "cyrax",
    });
    const filters = Mk1CatalogFiltersSchema.parse({
      meter: [1],
      tags: ["pair-coverage"],
    });
    const plainRouteQuery = {
      character: "scorpion",
      kameo: "cyrax",
    } satisfies Mk1CatalogPlainRouteQuery;
    const summaries = selectorRuntime.selectMk1CatalogComboSummaries({ context, filters });
    const options = contextRuntime.getMk1CatalogContextOptions({ characterId: "scorpion" });
    const facets = selectorRuntime.getMk1CatalogFilterFacets(context, filters);
    const firstSeededCombo = mk1SeededCombos[0];
    expect(firstSeededCombo).toBeDefined();
    if (!firstSeededCombo) {
      throw new Error("MK1 first seeded combo should be present.");
    }
    const directSummary = selectorRuntime.summarizeMk1CatalogCombo(firstSeededCombo);
    const multiSelectFacet =
      facets.find((facet): facet is Mk1CatalogMultiSelectFacet => facet.kind === "multiSelect") ??
      ({
        kind: "multiSelect",
        id: "starter",
        options: [],
      } satisfies Mk1CatalogMultiSelectFacet);
    const rangeFacet =
      facets.find((facet): facet is Mk1CatalogRangeFacet => facet.kind === "range") ??
      ({
        kind: "range",
        id: "damage",
        min: 0,
        max: 0,
      } satisfies Mk1CatalogRangeFacet);
    const summary = summaries[0];

    expect(contextRuntime.getMk1CatalogContextStatus(context)).toBe("ready");
    expect(options.kameos).toHaveLength(21);
    expect(options.kameos.every((option) => option.availability === "available")).toBe(true);
    expect(filterRuntime.emptyMk1CatalogFilters).toEqual({});
    expect(directSummary.ref.comboId).toBe(firstSeededCombo.id);
    expect(summary).toBeDefined();
    if (!summary) {
      throw new Error("MK1 summary should be present.");
    }
    expect(Mk1CatalogComboSummarySchema.parse(summary)).toEqual(summary);
    expect(
      acceptsPublicTypes({
        context,
        damageRange: {
          min: 1,
          max: 50,
        },
        filters,
        facet: facets[0] ?? multiSelectFacet,
        filterId: "meter",
        multiSelectFacet,
        multiSelectFilterId: "starter",
        optionAvailability: options.kameos[0]?.availability ?? "disabledNoComboData",
        plainRouteQuery,
        rangeFacet,
        rangeFilterId: "damage",
        recoveryCode: "invalidKameo",
        requiredContext: {
          characterId: "scorpion",
          kameoId: "cyrax",
        },
        routeQueryKey: "kameo",
        summary,
      }),
    ).toBe(true);
  });

  it("keeps value-set re-exports intentional", () => {
    expect(mk1CatalogContextStatuses).toEqual({
      characterSelected: "characterSelected",
      empty: "empty",
      ready: "ready",
    });
    expect(mk1CatalogRecoveryCodes).toEqual({
      invalidCharacter: "invalidCharacter",
      invalidKameo: "invalidKameo",
    });
    expect(mk1CatalogRouteQueryKeys).toEqual({
      character: "character",
      damageMax: "damageMax",
      damageMin: "damageMin",
      difficulty: "difficulty",
      kameo: "kameo",
      meter: "meter",
      position: "position",
      routeType: "routeType",
      starter: "starter",
      tag: "tag",
    });
    expect(mk1CatalogOptionAvailabilities).toEqual({
      available: "available",
      disabledNoComboData: "disabledNoComboData",
    });
    expect(contextSchemaStatuses).toBe(mk1CatalogContextStatuses);
    expect(contextSchemaRecoveryCodes).toBe(mk1CatalogRecoveryCodes);
    expect(contextSchemaRouteQueryKeys).toBe(mk1CatalogRouteQueryKeys);
    expect(contextTypeStatuses).toBe(contextSchemaStatuses);
    expect(contextTypeRecoveryCodes).toBe(contextSchemaRecoveryCodes);
    expect(contextTypeRouteQueryKeys).toBe(contextSchemaRouteQueryKeys);
    expect(mk1CatalogMultiSelectFilterIds).toEqual({
      difficulty: "difficulty",
      meter: "meter",
      position: "position",
      routeType: "routeType",
      starter: "starter",
      tag: "tag",
    });
    expect(mk1CatalogRangeFilterIds).toEqual({ damage: "damage" });
    expect(mk1CatalogFilterIds).toEqual({
      damage: "damage",
      difficulty: "difficulty",
      meter: "meter",
      position: "position",
      routeType: "routeType",
      starter: "starter",
      tag: "tag",
    });
    expect(filterSchemaIds).toBe(mk1CatalogFilterIds);
    expect(filterSchemaMultiSelectIds).toBe(mk1CatalogMultiSelectFilterIds);
    expect(filterSchemaRangeIds).toBe(mk1CatalogRangeFilterIds);
    expect(filterTypeIds).toBe(filterSchemaIds);
    expect(filterTypeMultiSelectIds).toBe(filterSchemaMultiSelectIds);
    expect(filterTypeRangeIds).toBe(filterSchemaRangeIds);
    expect(mkCombosMk1Catalog.valueSets.mk1CatalogOptionAvailabilities).toBe(
      mk1CatalogOptionAvailabilities,
    );
    expect(Object.values(mk1CatalogRouteQueryKeys)).not.toContain("variation");
    expect(Object.values(mk1CatalogRouteQueryKeys)).not.toContain("stage");
    expect(Object.values(mk1CatalogRouteQueryKeys)).not.toContain("interactable");
  });
});
