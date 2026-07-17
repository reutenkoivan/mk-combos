import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import {
  applyMk1CatalogFilterChange,
  parseMk1CatalogFilterQuery,
  serializeMk1CatalogFilterQuery,
} from "@mk-combos/mk1-catalog/filters/runtime";
import {
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogSources,
} from "@mk-combos/mk1-catalog/filters/value";
import { describe, expect, it } from "vitest";

describe("MK1 catalog filter runtime", () => {
  it("parses and serializes only the new filter taxonomy", () => {
    const parsed = parseMk1CatalogFilterQuery({
      position: "midscreen",
      meter: ["0", "1"],
      difficulty: "easy",
      routeClass: "kameo",
      source: "curated",
    });
    expect(parsed.filters).toEqual({
      positions: ["midscreen"],
      meter: [0, 1],
      difficulties: ["easy"],
      routeClasses: ["kameo"],
      sources: ["curated"],
    });
    expect(serializeMk1CatalogFilterQuery(parsed.filters)).toEqual({
      position: ["midscreen"],
      meter: ["0", "1"],
      difficulty: ["easy"],
      routeClass: ["kameo"],
      source: ["curated"],
    });
    expect(parseMk1CatalogFilterQuery({ starter: "F2" }).filters).toEqual({});
    expect(parseMk1CatalogFilterQuery({ tag: "community" }).filters).toEqual({});
  });

  it("applies semantic changes and rejects the disabled personal source", () => {
    const routeClass = applyMk1CatalogFilterChange(
      {},
      {
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: mk1CatalogMultiSelectFilterIds.routeClass,
        value: "kameo",
        selected: true,
      },
    );
    const personal = applyMk1CatalogFilterChange(routeClass.filters, {
      kind: catalogFilterChangeKinds.toggleOption,
      filterId: mk1CatalogMultiSelectFilterIds.source,
      value: mk1CatalogSources.personal,
      selected: true,
    });
    expect(routeClass.filters).toEqual({ routeClasses: ["kameo"] });
    expect(personal.filters).toEqual(routeClass.filters);
    expect(personal.messages[0]?.code).toBe("mk1.catalog.invalid_filter_change");
  });
});
