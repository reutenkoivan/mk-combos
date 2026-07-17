import * as contextRuntime from "@mk-combos/mk1-catalog/context/runtime";
import {
  Mk1CatalogContextSchema,
  Mk1CatalogContextStatusSchema,
  Mk1CatalogOptionAvailabilitySchema,
  Mk1CatalogRecoveryCodeSchema,
} from "@mk-combos/mk1-catalog/context/schema";
import type {
  Mk1CatalogContext,
  Mk1CatalogContextStatus,
  Mk1CatalogOptionAvailability,
  Mk1CatalogRecoveryCode,
} from "@mk-combos/mk1-catalog/context/type";
import {
  mk1CatalogContextStatuses,
  mk1CatalogOptionAvailabilities,
  mk1CatalogRecoveryCodes,
} from "@mk-combos/mk1-catalog/context/value";
import * as contractEntry from "@mk-combos/mk1-catalog/contract";
import { mk1CatalogContractGroups, mkCombosMk1Catalog } from "@mk-combos/mk1-catalog/contract";
import * as filterRuntime from "@mk-combos/mk1-catalog/filters/runtime";
import {
  Mk1CatalogFilterIdSchema,
  Mk1CatalogFilterQueryKeySchema,
  Mk1CatalogFilterQuerySchema,
  Mk1CatalogFiltersSchema,
  Mk1CatalogMultiSelectFilterIdSchema,
  Mk1CatalogSourceSchema,
} from "@mk-combos/mk1-catalog/filters/schema";
import type {
  Mk1CatalogFilterFacet,
  Mk1CatalogFilterId,
  Mk1CatalogFilterQuery,
  Mk1CatalogFilterQueryKey,
  Mk1CatalogFilters,
  Mk1CatalogMultiSelectFilterId,
  Mk1CatalogSource,
} from "@mk-combos/mk1-catalog/filters/type";
import {
  mk1CatalogFilterIds,
  mk1CatalogFilterQueryKeys,
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogSources,
} from "@mk-combos/mk1-catalog/filters/value";
import * as selectors from "@mk-combos/mk1-catalog/selectors/runtime";
import {
  Mk1CatalogComboSummarySchema,
  Mk1CatalogRouteStepEmphasisSchema,
  Mk1CatalogRouteStepKindSchema,
} from "@mk-combos/mk1-catalog/summary/schema";
import type {
  Mk1CatalogComboSummary,
  Mk1CatalogRouteStep,
  Mk1CatalogRouteStepEmphasis,
  Mk1CatalogRouteStepKind,
} from "@mk-combos/mk1-catalog/summary/type";
import {
  mk1CatalogRouteStepEmphases,
  mk1CatalogRouteStepKinds,
} from "@mk-combos/mk1-catalog/summary/value";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_value: {
  context: Mk1CatalogContext;
  contextStatus: Mk1CatalogContextStatus;
  recoveryCode: Mk1CatalogRecoveryCode;
  optionAvailability: Mk1CatalogOptionAvailability;
  filters: Mk1CatalogFilters;
  query: Mk1CatalogFilterQuery;
  filterId: Mk1CatalogFilterId;
  multiSelectFilterId: Mk1CatalogMultiSelectFilterId;
  filterQueryKey: Mk1CatalogFilterQueryKey;
  facet: Mk1CatalogFilterFacet;
  source: Mk1CatalogSource;
  summary: Mk1CatalogComboSummary;
  routeStep: Mk1CatalogRouteStep;
  routeStepKind: Mk1CatalogRouteStepKind;
  routeStepEmphasis: Mk1CatalogRouteStepEmphasis;
}) => true;

describe("@mk-combos/mk1-catalog contract", () => {
  it("documents every public subpath and keeps the entrypoint metadata-only", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mk1CatalogContractGroups",
      "mkCombosMk1Catalog",
    ]);
    expect(mk1CatalogContractGroups.summary).toEqual({
      schema: "@mk-combos/mk1-catalog/summary/schema",
      type: "@mk-combos/mk1-catalog/summary/type",
      value: "@mk-combos/mk1-catalog/summary/value",
    });
    expect(mkCombosMk1Catalog.packageName).toBe("@mk-combos/mk1-catalog");
  });

  it("exposes filter-only query contracts and no query-owned character context", () => {
    const query = filterRuntime.serializeMk1CatalogFilterQuery({
      positions: ["midscreen"],
      meter: [1],
      routeClasses: ["kameo"],
      sources: [mk1CatalogSources.curated],
    });

    expect(Mk1CatalogFilterQuerySchema.parse(query)).toEqual(query);
    expect(filterRuntime.parseMk1CatalogFilterQuery(query).filters).toEqual({
      positions: ["midscreen"],
      meter: [1],
      routeClasses: ["kameo"],
      sources: ["curated"],
    });
    expect(filterRuntime.parseMk1CatalogFilterQuery({ character: "scorpion" }).filters).toEqual({});
    expect(Object.values(mk1CatalogFilterQueryKeys)).not.toContain("character");
    expect(Object.values(mk1CatalogFilterQueryKeys)).not.toContain("kameo");
    expect(contextRuntime).not.toHaveProperty("parseMk1CatalogRouteQuery");
  });

  it("keeps the new value sets schema-backed and available by identity", () => {
    expect(mk1CatalogMultiSelectFilterIds).toEqual({
      difficulty: "difficulty",
      meter: "meter",
      position: "position",
      routeClass: "routeClass",
      source: "source",
    });
    expect(mk1CatalogFilterIds).toEqual({
      difficulty: "difficulty",
      meter: "meter",
      position: "position",
      routeClass: "routeClass",
      source: "source",
    });
    expect(mk1CatalogFilterQueryKeys).toEqual({
      difficulty: "difficulty",
      meter: "meter",
      position: "position",
      routeClass: "routeClass",
      source: "source",
    });
    expect(mk1CatalogSources).toEqual({
      curated: "curated",
      community: "community",
      personal: "personal",
    });
    expect(Mk1CatalogSourceSchema.safeParse("personal").success).toBe(true);
    expect(Mk1CatalogSourceSchema.safeParse("seeded").success).toBe(false);
    expect(Mk1CatalogContextStatusSchema.parse(mk1CatalogContextStatuses.ready)).toBe("ready");
    expect(Mk1CatalogRecoveryCodeSchema.parse(mk1CatalogRecoveryCodes.invalidKameo)).toBe(
      "invalidKameo",
    );
    expect(
      Mk1CatalogOptionAvailabilitySchema.parse(mk1CatalogOptionAvailabilities.disabledNoComboData),
    ).toBe("disabledNoComboData");
    expect(Mk1CatalogFilterIdSchema.parse(mk1CatalogFilterIds.source)).toBe("source");
    expect(Mk1CatalogMultiSelectFilterIdSchema.parse(mk1CatalogMultiSelectFilterIds.source)).toBe(
      "source",
    );
    expect(Mk1CatalogFilterQueryKeySchema.parse(mk1CatalogFilterQueryKeys.source)).toBe("source");
    expect(Mk1CatalogRouteStepKindSchema.parse(mk1CatalogRouteStepKinds.starter)).toBe("starter");
    expect(Mk1CatalogRouteStepEmphasisSchema.parse(mk1CatalogRouteStepEmphases.standard)).toBe(
      "standard",
    );
    expect(mkCombosMk1Catalog.valueSets.mk1CatalogSources).toBe(mk1CatalogSources);
    expect(mkCombosMk1Catalog.valueSets.mk1CatalogFilterIds).toBe(mk1CatalogFilterIds);
    expect(mkCombosMk1Catalog.valueSets.mk1CatalogRouteStepKinds).toBe(mk1CatalogRouteStepKinds);
    expect(mkCombosMk1Catalog.valueSets.mk1CatalogRouteStepEmphases).toBe(
      mk1CatalogRouteStepEmphases,
    );
    expect(mk1CatalogContextStatuses.ready).toBe("ready");
    expect(mk1CatalogRecoveryCodes.invalidKameo).toBe("invalidKameo");
    expect(mk1CatalogOptionAvailabilities.disabledNoComboData).toBe("disabledNoComboData");
  });

  it("keeps prepared summaries and facets importable through public subpaths", () => {
    const context = Mk1CatalogContextSchema.parse({ characterId: "scorpion", kameoId: "cyrax" });
    const filters = Mk1CatalogFiltersSchema.parse({ sources: [mk1CatalogSources.curated] });
    const summary = selectors.selectMk1CatalogComboSummaries({ context, filters })[0];
    const facets = selectors.getMk1CatalogFilterFacets(context, filters);
    expect(summary).toBeDefined();
    if (!summary) throw new Error("Expected MK1 summary.");
    expect(Mk1CatalogComboSummarySchema.parse(summary)).toEqual(summary);
    expect(
      acceptsPublicTypes({
        context,
        contextStatus: mk1CatalogContextStatuses.ready,
        recoveryCode: mk1CatalogRecoveryCodes.invalidKameo,
        optionAvailability: mk1CatalogOptionAvailabilities.available,
        filters,
        query: {},
        filterId: mk1CatalogFilterIds.source,
        multiSelectFilterId: mk1CatalogMultiSelectFilterIds.source,
        filterQueryKey: mk1CatalogFilterQueryKeys.source,
        facet: facets[0] ?? { kind: "multiSelect", id: "source", options: [] },
        source: summary.provenance,
        summary,
        routeStep: summary.routeSteps[0] ?? {
          kind: "starter",
          notation: ["1"],
          repetitionCount: 1,
          emphasis: "standard",
        },
        routeStepKind: mk1CatalogRouteStepKinds.starter,
        routeStepEmphasis: mk1CatalogRouteStepEmphases.standard,
      }),
    ).toBe(true);
  });
});
