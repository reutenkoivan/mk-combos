import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import {
  applyMkxlCatalogFilterChange,
  parseMkxlCatalogFilterQuery,
  serializeMkxlCatalogFilterQuery,
} from "@mk-combos/mkxl-catalog/filters/runtime";
import {
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogSingleSelectFilterIds,
  mkxlCatalogSources,
} from "@mk-combos/mkxl-catalog/filters/value";
import { describe, expect, it } from "vitest";

describe("MKXL catalog filter runtime", () => {
  it("parses and serializes the new taxonomy plus stage cascade", () => {
    const parsed = parseMkxlCatalogFilterQuery({
      position: "corner",
      meter: "1",
      difficulty: "hard",
      routeClass: "stage",
      source: "curated",
      stage: "crossroads",
      interactable: "crossroads:position-escape",
    });
    expect(parsed.filters).toEqual({
      positions: ["corner"],
      meter: [1],
      difficulties: ["hard"],
      routeClasses: ["stage"],
      sources: ["curated"],
      stageId: "crossroads",
      interactableIds: ["crossroads:position-escape"],
    });
    expect(serializeMkxlCatalogFilterQuery(parsed.filters)).toEqual({
      position: ["corner"],
      meter: ["1"],
      difficulty: ["hard"],
      routeClass: ["stage"],
      source: ["curated"],
      stage: "crossroads",
      interactable: ["crossroads:position-escape"],
    });
    expect(parseMkxlCatalogFilterQuery({ starter: "F2" }).filters).toEqual({});
    expect(parseMkxlCatalogFilterQuery({ tag: "community" }).filters).toEqual({});
  });

  it("requires a selected stage before interactables and clears the cascade on stage change", () => {
    const withoutStage = applyMkxlCatalogFilterChange(
      {},
      {
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: mkxlCatalogMultiSelectFilterIds.interactable,
        value: "crossroads:position-escape",
        selected: true,
      },
    );
    const changedStage = applyMkxlCatalogFilterChange(
      { stageId: "crossroads", interactableIds: ["crossroads:position-escape"] },
      {
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: mkxlCatalogSingleSelectFilterIds.stage,
        value: "dead-woods",
        selected: true,
      },
    );
    expect(withoutStage.filters).toEqual({});
    expect(withoutStage.messages[0]?.code).toBe("mkxl.catalog.invalid_filter_change");
    expect(changedStage.filters).toEqual({ stageId: "dead-woods" });
  });

  it("clears an optional stage when its selected option is toggled off", () => {
    expect(
      applyMkxlCatalogFilterChange(
        { stageId: "crossroads", interactableIds: ["crossroads:position-escape"] },
        {
          kind: catalogFilterChangeKinds.toggleOption,
          filterId: mkxlCatalogSingleSelectFilterIds.stage,
          value: "crossroads",
          selected: false,
        },
      ).filters,
    ).toEqual({});
  });

  it("keeps Personal disabled and absent from canonical filters", () => {
    const result = applyMkxlCatalogFilterChange(
      {},
      {
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: mkxlCatalogMultiSelectFilterIds.source,
        value: mkxlCatalogSources.personal,
        selected: true,
      },
    );
    expect(result.filters).toEqual({});
    expect(result.messages[0]?.message).toContain("Personal");
  });
});
