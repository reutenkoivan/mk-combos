import * as contextRuntime from "@mk-combos/mkxl-catalog/context/runtime";
import {
  MkxlCatalogContextSchema,
  MkxlCatalogContextStatusSchema,
  MkxlCatalogOptionAvailabilitySchema,
  MkxlCatalogRecoveryCodeSchema,
} from "@mk-combos/mkxl-catalog/context/schema";
import type {
  MkxlCatalogContext,
  MkxlCatalogContextStatus,
  MkxlCatalogOptionAvailability,
  MkxlCatalogRecoveryCode,
} from "@mk-combos/mkxl-catalog/context/type";
import {
  mkxlCatalogContextStatuses,
  mkxlCatalogOptionAvailabilities,
  mkxlCatalogRecoveryCodes,
} from "@mk-combos/mkxl-catalog/context/value";
import * as contractEntry from "@mk-combos/mkxl-catalog/contract";
import { mkCombosMkxlCatalog, mkxlCatalogContractGroups } from "@mk-combos/mkxl-catalog/contract";
import * as filterRuntime from "@mk-combos/mkxl-catalog/filters/runtime";
import {
  MkxlCatalogFilterIdSchema,
  MkxlCatalogFilterQueryKeySchema,
  MkxlCatalogFilterQuerySchema,
  MkxlCatalogFiltersSchema,
  MkxlCatalogMultiSelectFilterIdSchema,
  MkxlCatalogSingleSelectFilterIdSchema,
  MkxlCatalogSourceSchema,
} from "@mk-combos/mkxl-catalog/filters/schema";
import type {
  MkxlCatalogFilterFacet,
  MkxlCatalogFilterId,
  MkxlCatalogFilterQuery,
  MkxlCatalogFilterQueryKey,
  MkxlCatalogFilters,
  MkxlCatalogMultiSelectFilterId,
  MkxlCatalogSingleSelectFilterId,
  MkxlCatalogSource,
} from "@mk-combos/mkxl-catalog/filters/type";
import {
  mkxlCatalogFilterIds,
  mkxlCatalogFilterQueryKeys,
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogSingleSelectFilterIds,
  mkxlCatalogSources,
} from "@mk-combos/mkxl-catalog/filters/value";
import * as selectors from "@mk-combos/mkxl-catalog/selectors/runtime";
import {
  MkxlCatalogComboSummarySchema,
  MkxlCatalogRouteStepEmphasisSchema,
  MkxlCatalogRouteStepKindSchema,
} from "@mk-combos/mkxl-catalog/summary/schema";
import type {
  MkxlCatalogComboSummary,
  MkxlCatalogRouteStep,
  MkxlCatalogRouteStepEmphasis,
  MkxlCatalogRouteStepKind,
} from "@mk-combos/mkxl-catalog/summary/type";
import {
  mkxlCatalogRouteStepEmphases,
  mkxlCatalogRouteStepKinds,
} from "@mk-combos/mkxl-catalog/summary/value";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_value: {
  context: MkxlCatalogContext;
  contextStatus: MkxlCatalogContextStatus;
  recoveryCode: MkxlCatalogRecoveryCode;
  optionAvailability: MkxlCatalogOptionAvailability;
  filters: MkxlCatalogFilters;
  query: MkxlCatalogFilterQuery;
  filterId: MkxlCatalogFilterId;
  multiSelectFilterId: MkxlCatalogMultiSelectFilterId;
  singleSelectFilterId: MkxlCatalogSingleSelectFilterId;
  filterQueryKey: MkxlCatalogFilterQueryKey;
  facet: MkxlCatalogFilterFacet;
  source: MkxlCatalogSource;
  summary: MkxlCatalogComboSummary;
  routeStep: MkxlCatalogRouteStep;
  routeStepKind: MkxlCatalogRouteStepKind;
  routeStepEmphasis: MkxlCatalogRouteStepEmphasis;
}) => true;

describe("@mk-combos/mkxl-catalog contract", () => {
  it("documents all public subpaths and the summary value module", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mkCombosMkxlCatalog",
      "mkxlCatalogContractGroups",
    ]);
    expect(mkxlCatalogContractGroups.summary).toEqual({
      schema: "@mk-combos/mkxl-catalog/summary/schema",
      type: "@mk-combos/mkxl-catalog/summary/type",
      value: "@mk-combos/mkxl-catalog/summary/value",
    });
    expect(mkCombosMkxlCatalog.packageName).toBe("@mk-combos/mkxl-catalog");
  });

  it("uses filter-only search contracts with no character or variation compatibility API", () => {
    const query = filterRuntime.serializeMkxlCatalogFilterQuery({
      positions: ["midscreen"],
      routeClasses: ["bnb"],
      sources: [mkxlCatalogSources.community],
    });
    expect(MkxlCatalogFilterQuerySchema.parse(query)).toEqual(query);
    expect(filterRuntime.parseMkxlCatalogFilterQuery(query).filters).toEqual({
      positions: ["midscreen"],
      routeClasses: ["bnb"],
      sources: ["community"],
    });
    expect(
      filterRuntime.parseMkxlCatalogFilterQuery({ variation: "scorpion:ninjutsu" }).filters,
    ).toEqual({});
    expect(Object.values(mkxlCatalogFilterQueryKeys)).not.toContain("character");
    expect(Object.values(mkxlCatalogFilterQueryKeys)).not.toContain("variation");
    expect(contextRuntime).not.toHaveProperty("parseMkxlCatalogRouteQuery");
  });

  it("publishes exact filter, source, and route-step value sets", () => {
    expect(mkxlCatalogMultiSelectFilterIds).toEqual({
      difficulty: "difficulty",
      interactable: "interactable",
      meter: "meter",
      position: "position",
      routeClass: "routeClass",
      source: "source",
    });
    expect(mkxlCatalogSingleSelectFilterIds).toEqual({ stage: "stage" });
    expect(mkxlCatalogFilterIds).toEqual({
      difficulty: "difficulty",
      interactable: "interactable",
      meter: "meter",
      position: "position",
      routeClass: "routeClass",
      source: "source",
      stage: "stage",
    });
    expect(mkxlCatalogFilterQueryKeys).toEqual({
      difficulty: "difficulty",
      interactable: "interactable",
      meter: "meter",
      position: "position",
      routeClass: "routeClass",
      source: "source",
      stage: "stage",
    });
    expect(MkxlCatalogSourceSchema.safeParse("personal").success).toBe(true);
    expect(MkxlCatalogSourceSchema.safeParse("seeded").success).toBe(false);
    expect(MkxlCatalogContextStatusSchema.parse(mkxlCatalogContextStatuses.ready)).toBe("ready");
    expect(MkxlCatalogRecoveryCodeSchema.parse(mkxlCatalogRecoveryCodes.invalidVariation)).toBe(
      "invalidVariation",
    );
    expect(
      MkxlCatalogOptionAvailabilitySchema.parse(
        mkxlCatalogOptionAvailabilities.disabledNoComboData,
      ),
    ).toBe("disabledNoComboData");
    expect(MkxlCatalogFilterIdSchema.parse(mkxlCatalogFilterIds.source)).toBe("source");
    expect(MkxlCatalogMultiSelectFilterIdSchema.parse(mkxlCatalogMultiSelectFilterIds.source)).toBe(
      "source",
    );
    expect(
      MkxlCatalogSingleSelectFilterIdSchema.parse(mkxlCatalogSingleSelectFilterIds.stage),
    ).toBe("stage");
    expect(MkxlCatalogFilterQueryKeySchema.parse(mkxlCatalogFilterQueryKeys.source)).toBe("source");
    expect(MkxlCatalogRouteStepKindSchema.parse(mkxlCatalogRouteStepKinds.starter)).toBe("starter");
    expect(MkxlCatalogRouteStepEmphasisSchema.parse(mkxlCatalogRouteStepEmphases.standard)).toBe(
      "standard",
    );
    expect(mkCombosMkxlCatalog.valueSets.mkxlCatalogSources).toBe(mkxlCatalogSources);
    expect(mkCombosMkxlCatalog.valueSets.mkxlCatalogSingleSelectFilterIds).toBe(
      mkxlCatalogSingleSelectFilterIds,
    );
    expect(mkCombosMkxlCatalog.valueSets.mkxlCatalogRouteStepKinds).toBe(mkxlCatalogRouteStepKinds);
    expect(mkCombosMkxlCatalog.valueSets.mkxlCatalogRouteStepEmphases).toBe(
      mkxlCatalogRouteStepEmphases,
    );
    expect(mkxlCatalogContextStatuses.ready).toBe("ready");
    expect(mkxlCatalogRecoveryCodes.invalidVariation).toBe("invalidVariation");
    expect(mkxlCatalogOptionAvailabilities.disabledNoComboData).toBe("disabledNoComboData");
  });

  it("keeps prepared summary and facet contracts importable", () => {
    const context = MkxlCatalogContextSchema.parse({
      characterId: "scorpion",
      variationId: "scorpion:ninjutsu",
    });
    const filters = MkxlCatalogFiltersSchema.parse({ sources: [mkxlCatalogSources.community] });
    const summary = selectors.selectMkxlCatalogComboSummaries({ context, filters })[0];
    const facets = selectors.getMkxlCatalogFilterFacets(context, filters);
    expect(summary).toBeDefined();
    if (!summary) throw new Error("Expected MKXL summary.");
    expect(MkxlCatalogComboSummarySchema.parse(summary)).toEqual(summary);
    expect(
      acceptsPublicTypes({
        context,
        contextStatus: mkxlCatalogContextStatuses.ready,
        recoveryCode: mkxlCatalogRecoveryCodes.invalidVariation,
        optionAvailability: mkxlCatalogOptionAvailabilities.available,
        filters,
        query: {},
        filterId: mkxlCatalogFilterIds.source,
        multiSelectFilterId: mkxlCatalogMultiSelectFilterIds.source,
        singleSelectFilterId: mkxlCatalogSingleSelectFilterIds.stage,
        filterQueryKey: mkxlCatalogFilterQueryKeys.source,
        facet: facets[0] ?? { kind: "multiSelect", id: "source", options: [] },
        source: summary.provenance,
        summary,
        routeStep: summary.routeSteps[0] ?? {
          kind: "starter",
          notation: ["1"],
          repetitionCount: 1,
          emphasis: "standard",
        },
        routeStepKind: mkxlCatalogRouteStepKinds.starter,
        routeStepEmphasis: mkxlCatalogRouteStepEmphases.standard,
      }),
    ).toBe(true);
  });
});
