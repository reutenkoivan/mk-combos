import * as contextRuntime from "@mk-combos/mkxl-catalog/context/runtime";
import {
  mkxlCatalogRecoveryCodes as contextSchemaRecoveryCodes,
  mkxlCatalogRouteQueryKeys as contextSchemaRouteQueryKeys,
  mkxlCatalogContextStatuses as contextSchemaStatuses,
  MkxlCatalogContextSchema,
  MkxlCatalogOptionAvailabilitySchema,
} from "@mk-combos/mkxl-catalog/context/schema";
import type {
  MkxlCatalogContext,
  MkxlCatalogOptionAvailability,
  MkxlCatalogRecoveryCode,
  MkxlCatalogRequiredContext,
  MkxlCatalogRouteQueryKey,
} from "@mk-combos/mkxl-catalog/context/type";
import {
  mkxlCatalogRecoveryCodes as contextTypeRecoveryCodes,
  mkxlCatalogRouteQueryKeys as contextTypeRouteQueryKeys,
  mkxlCatalogContextStatuses as contextTypeStatuses,
} from "@mk-combos/mkxl-catalog/context/type";
import {
  mkxlCatalogContextStatuses,
  mkxlCatalogOptionAvailabilities,
  mkxlCatalogRecoveryCodes,
  mkxlCatalogRouteQueryKeys,
} from "@mk-combos/mkxl-catalog/context/value";
import * as contractEntry from "@mk-combos/mkxl-catalog/contract";
import { mkCombosMkxlCatalog, mkxlCatalogContractGroups } from "@mk-combos/mkxl-catalog/contract";
import * as filterRuntime from "@mk-combos/mkxl-catalog/filters/runtime";
import {
  mkxlCatalogFilterIds as filterSchemaIds,
  mkxlCatalogMultiSelectFilterIds as filterSchemaMultiSelectIds,
  mkxlCatalogRangeFilterIds as filterSchemaRangeIds,
  MkxlCatalogFiltersSchema,
} from "@mk-combos/mkxl-catalog/filters/schema";
import type {
  MkxlCatalogDamageRange,
  MkxlCatalogFilterId,
  MkxlCatalogFilters,
  MkxlCatalogMultiSelectFacet,
  MkxlCatalogMultiSelectFilterId,
  MkxlCatalogRangeFacet,
  MkxlCatalogRangeFilterId,
} from "@mk-combos/mkxl-catalog/filters/type";
import {
  mkxlCatalogFilterIds as filterTypeIds,
  mkxlCatalogMultiSelectFilterIds as filterTypeMultiSelectIds,
  mkxlCatalogRangeFilterIds as filterTypeRangeIds,
} from "@mk-combos/mkxl-catalog/filters/type";
import {
  mkxlCatalogFilterIds,
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogRangeFilterIds,
} from "@mk-combos/mkxl-catalog/filters/value";
import * as selectorRuntime from "@mk-combos/mkxl-catalog/selectors/runtime";
import { MkxlCatalogComboSummarySchema } from "@mk-combos/mkxl-catalog/summary/schema";
import type { MkxlCatalogComboSummary } from "@mk-combos/mkxl-catalog/summary/type";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_contract: {
  damageRange: MkxlCatalogDamageRange;
  context: MkxlCatalogContext;
  filterId: MkxlCatalogFilterId;
  filters: MkxlCatalogFilters;
  multiSelectFacet: MkxlCatalogMultiSelectFacet;
  multiSelectFilterId: MkxlCatalogMultiSelectFilterId;
  optionAvailability: MkxlCatalogOptionAvailability;
  rangeFacet: MkxlCatalogRangeFacet;
  rangeFilterId: MkxlCatalogRangeFilterId;
  recoveryCode: MkxlCatalogRecoveryCode;
  requiredContext: MkxlCatalogRequiredContext;
  routeQueryKey: MkxlCatalogRouteQueryKey;
  summary: MkxlCatalogComboSummary;
}) => true;

describe("@mk-combos/mkxl-catalog contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mkCombosMkxlCatalog",
      "mkxlCatalogContractGroups",
    ]);
    expect(mkCombosMkxlCatalog.packageName).toBe("@mk-combos/mkxl-catalog");
    expect(mkCombosMkxlCatalog.groups).toBe(mkxlCatalogContractGroups);
    expect(mkCombosMkxlCatalog.valueSets.mkxlCatalogContextStatuses).toBe(
      mkxlCatalogContextStatuses,
    );
    expect(mkCombosMkxlCatalog.valueSets.mkxlCatalogFilterIds).toBe(mkxlCatalogFilterIds);
  });

  it("documents every public subpath group", () => {
    expect(mkxlCatalogContractGroups.context).toEqual({
      runtime: "@mk-combos/mkxl-catalog/context/runtime",
      schema: "@mk-combos/mkxl-catalog/context/schema",
      type: "@mk-combos/mkxl-catalog/context/type",
      value: "@mk-combos/mkxl-catalog/context/value",
    });
    expect(mkxlCatalogContractGroups.filters).toEqual({
      runtime: "@mk-combos/mkxl-catalog/filters/runtime",
      schema: "@mk-combos/mkxl-catalog/filters/schema",
      type: "@mk-combos/mkxl-catalog/filters/type",
      value: "@mk-combos/mkxl-catalog/filters/value",
    });
    expect(mkxlCatalogContractGroups.selectors).toEqual({
      runtime: "@mk-combos/mkxl-catalog/selectors/runtime",
    });
    expect(mkxlCatalogContractGroups.summary).toEqual({
      schema: "@mk-combos/mkxl-catalog/summary/schema",
      type: "@mk-combos/mkxl-catalog/summary/type",
    });
  });

  it("keeps public subpaths importable", () => {
    const context = MkxlCatalogContextSchema.parse({
      characterId: "scorpion",
      variationId: "scorpion:ninjutsu",
    });
    const filters = MkxlCatalogFiltersSchema.parse({
      meter: [0],
      tags: ["community", "beginner"],
    });
    const [summary] = selectorRuntime.selectMkxlCatalogComboSummaries({
      context,
      filters,
    });
    const options = contextRuntime.getMkxlCatalogContextOptions({
      characterId: "scorpion",
    });
    const selectedVariation = contextRuntime.selectMkxlCatalogVariation(
      {
        characterId: "scorpion",
      },
      "scorpion:ninjutsu",
    );
    const facets = selectorRuntime.getMkxlCatalogFilterFacets(context, filters);

    expect(contextRuntime.getMkxlCatalogContextStatus(context)).toBe("ready");
    expect(options.variations.some((option) => option.id === "scorpion:ninjutsu")).toBe(true);
    expect(selectedVariation.status).toBe("ready");
    expect(filterRuntime.emptyMkxlCatalogFilters).toEqual({});
    expect(filterRuntime.comboMatchesMkxlCatalogFilters).toBeTypeOf("function");
    expect(summary).toBeDefined();
    const parsedSummary = MkxlCatalogComboSummarySchema.parse(summary);
    expect(parsedSummary).toEqual(summary);
    expect(
      acceptsPublicTypes({
        damageRange: { min: 1, max: 2 },
        context,
        filterId: "starter",
        filters,
        multiSelectFacet: facets.find(
          (facet): facet is MkxlCatalogMultiSelectFacet => facet.kind === "multiSelect",
        ) ?? {
          kind: "multiSelect",
          id: "starter",
          options: [],
        },
        multiSelectFilterId: "starter",
        optionAvailability: mkxlCatalogOptionAvailabilities.available,
        rangeFacet: facets.find(
          (facet): facet is MkxlCatalogRangeFacet => facet.kind === "range",
        ) ?? {
          kind: "range",
          id: "damage",
          min: 0,
          max: 0,
        },
        rangeFilterId: "damage",
        recoveryCode: "invalidCharacter",
        requiredContext: {
          characterId: "scorpion",
          variationId: "scorpion:ninjutsu",
        },
        routeQueryKey: "character",
        summary: parsedSummary,
      }),
    ).toBe(true);
  });

  it("keeps value-set re-exports intentional", () => {
    expect(mkxlCatalogContextStatuses).toEqual({
      characterSelected: "characterSelected",
      empty: "empty",
      ready: "ready",
    });
    expect(mkxlCatalogRecoveryCodes).toEqual({
      incompatibleInteractable: "incompatibleInteractable",
      invalidCharacter: "invalidCharacter",
      invalidDamageRange: "invalidDamageRange",
      invalidInteractable: "invalidInteractable",
      invalidStage: "invalidStage",
      invalidVariation: "invalidVariation",
    });
    expect(mkxlCatalogRouteQueryKeys).toEqual({
      character: "character",
      damageMax: "damageMax",
      damageMin: "damageMin",
      difficulty: "difficulty",
      interactable: "interactable",
      meter: "meter",
      position: "position",
      routeType: "routeType",
      stage: "stage",
      starter: "starter",
      tag: "tag",
      variation: "variation",
    });
    expect(mkxlCatalogOptionAvailabilities).toEqual({
      available: "available",
      disabledNoComboData: "disabledNoComboData",
    });
    expect(
      MkxlCatalogOptionAvailabilitySchema.safeParse(mkxlCatalogOptionAvailabilities.available)
        .success,
    ).toBe(true);
    expect(MkxlCatalogOptionAvailabilitySchema.safeParse("hidden").success).toBe(false);
    expect(contextSchemaStatuses).toBe(mkxlCatalogContextStatuses);
    expect(contextTypeStatuses).toBe(mkxlCatalogContextStatuses);
    expect(contextSchemaRecoveryCodes).toBe(mkCombosMkxlCatalog.valueSets.mkxlCatalogRecoveryCodes);
    expect(contextTypeRecoveryCodes).toBe(mkCombosMkxlCatalog.valueSets.mkxlCatalogRecoveryCodes);
    expect(contextSchemaRouteQueryKeys).toBe(mkxlCatalogRouteQueryKeys);
    expect(contextTypeRouteQueryKeys).toBe(contextSchemaRouteQueryKeys);
    expect(mkxlCatalogMultiSelectFilterIds).toEqual({
      difficulty: "difficulty",
      interactable: "interactable",
      meter: "meter",
      position: "position",
      routeType: "routeType",
      stage: "stage",
      starter: "starter",
      tags: "tags",
    });
    expect(mkxlCatalogRangeFilterIds).toEqual({ damage: "damage" });
    expect(mkxlCatalogFilterIds).toEqual({
      damage: "damage",
      difficulty: "difficulty",
      interactable: "interactable",
      meter: "meter",
      position: "position",
      routeType: "routeType",
      stage: "stage",
      starter: "starter",
      tags: "tags",
    });
    expect(filterSchemaIds).toBe(mkxlCatalogFilterIds);
    expect(filterTypeIds).toBe(mkxlCatalogFilterIds);
    expect(filterSchemaMultiSelectIds).toBe(
      mkCombosMkxlCatalog.valueSets.mkxlCatalogMultiSelectFilterIds,
    );
    expect(filterTypeMultiSelectIds).toBe(
      mkCombosMkxlCatalog.valueSets.mkxlCatalogMultiSelectFilterIds,
    );
    expect(filterSchemaRangeIds).toBe(mkCombosMkxlCatalog.valueSets.mkxlCatalogRangeFilterIds);
    expect(filterTypeRangeIds).toBe(mkCombosMkxlCatalog.valueSets.mkxlCatalogRangeFilterIds);
    expect(mkCombosMkxlCatalog.valueSets.mkxlCatalogOptionAvailabilities).toBe(
      mkxlCatalogOptionAvailabilities,
    );
  });
});
