import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import { mk1Business } from "@mk-combos/mk1-business";
import { mk1CatalogMultiSelectFilterIds } from "@mk-combos/mk1-catalog/filters/value";
import { describe, expect, it } from "vitest";

const mk1Context = {
  characterId: "scorpion",
  kameoId: "cyrax",
} as const;

describe("@mk-combos/mk1-business runtime", () => {
  it("serves catalog, route, and builder adapters", () => {
    const parsed = mk1Business.catalog.parseFilterQuery({ meter: "1", source: "curated" });
    const serialized = mk1Business.catalog.serializeFilterQuery(parsed.filters);
    const summaries = mk1Business.catalog.selectSeededSummaries({
      context: mk1Context,
      filters: parsed.filters,
    });
    const route = mk1Business.routes.comboDetail({
      characterSlug: "scorpion",
      comboId: "scorpion-cyrax-seed-001",
      gameId: "mk1",
      specificationSlug: "cyrax",
    });
    const builder = mk1Business.builder.createState({
      context: {
        characterId: "scorpion",
        kameoId: "cyrax",
      },
      movePath: summaries[0]?.movePath,
    });

    expect(serialized).toEqual({ meter: ["1"], source: ["curated"] });
    expect(summaries).toHaveLength(1);
    expect(route).toEqual({
      ok: true,
      value: "/mk1/catalog/scorpion/cyrax/scorpion-cyrax-seed-001",
    });
    expect(builder.ok).toBe(true);
    if (!builder.ok) {
      throw new Error("MK1 builder state should succeed.");
    }
    expect(builder.value.comboState.status).toBe("fresh");
  });

  it("applies semantic filter changes and returns the full recovered catalog state", () => {
    const changed = mk1Business.catalog.applyFilterChange({
      context: mk1Context,
      filters: {},
      change: {
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: mk1CatalogMultiSelectFilterIds.source,
        value: "curated",
        selected: true,
      },
    });

    expect(changed).toEqual({
      status: "ready",
      context: mk1Context,
      filters: { sources: ["curated"] },
      messages: [],
    });
  });

  it("saves and restores a canonical last catalog without changing other slice data", () => {
    const summary = mk1Business.catalog.getSeededSummary("scorpion-cyrax-seed-001");

    expect(summary).toBeDefined();
    if (!summary) {
      throw new Error("MK1 seeded summary should be present.");
    }

    const slice = {
      version: 1,
      customCombos: [
        {
          id: "local-scorpion-1",
          gameId: "mk1",
          source: "custom",
          characterId: summary.character.id,
          kameoId: summary.kameo.id,
          movePath: summary.movePath,
          cachedNotation: summary.cachedNotation,
          metadata: summary.metadata,
          notes: summary.notes,
          gameVersion: summary.gameVersion,
          createdAt: "2026-07-14T00:00:00.000Z",
          updatedAt: "2026-07-14T00:00:00.000Z",
        },
      ],
      namedLists: [
        {
          id: "practice",
          gameId: "mk1",
          name: "Practice",
          items: [],
          createdAt: "2026-07-14T00:00:00.000Z",
          updatedAt: "2026-07-14T00:00:00.000Z",
        },
      ],
    } as const;
    const saved = mk1Business.catalog.saveLastCatalog({
      slice,
      context: mk1Context,
      filters: { sources: ["curated"] },
    });

    expect(saved.ok).toBe(true);
    if (!saved.ok) {
      throw new Error("MK1 last catalog should be saved.");
    }
    expect(saved.value.customCombos).toEqual(slice.customCombos);
    expect(saved.value.namedLists).toEqual(slice.namedLists);
    expect(saved.value.lastCatalog).toEqual({
      context: mk1Context,
      filters: { sources: ["curated"] },
    });

    const restored = mk1Business.catalog.restoreLastCatalog(saved.value);

    expect(restored).toEqual({
      ok: true,
      value: {
        status: "ready",
        context: mk1Context,
        filters: { sources: ["curated"] },
        messages: [],
      },
    });
  });

  it("validates empty and malformed slices", () => {
    const empty = mk1Business.backup.createEmptySlice();
    const malformedSlice = { version: 1, customCombos: "invalid", namedLists: [] };
    const parsed = mk1Business.backup.parseSlice(empty);
    const invalid = mk1Business.backup.parseSlice({
      version: 1,
      customCombos: [],
      namedLists: [],
      variationId: "mkxl-only",
    });

    expect(parsed.ok).toBe(true);
    expect(invalid.ok).toBe(false);

    const save = mk1Business.catalog.saveLastCatalog({
      slice: malformedSlice,
      context: mk1Context,
      filters: {},
    });
    const restore = mk1Business.catalog.restoreLastCatalog(malformedSlice);
    const malformedCatalog = mk1Business.catalog.saveLastCatalog({
      slice: empty,
      context: { unexpected: true },
      filters: {},
    });
    const missing = mk1Business.catalog.restoreLastCatalog(empty);

    expect(save.ok).toBe(false);
    expect(restore.ok).toBe(false);
    expect(malformedCatalog.ok).toBe(false);
    if (malformedCatalog.ok) {
      throw new Error("Malformed MK1 catalog state should be rejected.");
    }
    expect(malformedCatalog.error.code).toBe("mk1.business.invalid_last_catalog");
    expect(missing).toEqual({
      ok: true,
      value: { status: "empty", context: {}, filters: {}, messages: [] },
    });
  });

  it("canonicalizes stale game ids before persisting last catalog", () => {
    const saved = mk1Business.catalog.saveLastCatalog({
      slice: mk1Business.backup.createEmptySlice(),
      context: { characterId: "missing", kameoId: "missing" },
      filters: {},
    });

    expect(saved).toEqual({
      ok: true,
      value: {
        version: 1,
        customCombos: [],
        namedLists: [],
        lastCatalog: { context: {}, filters: {} },
      },
    });
  });

  it("derives cached notation from move path", () => {
    const notation = mk1Business.builder.deriveCachedNotation([
      "scorpion:quick-strike",
      "scorpion:rising-launcher",
      "kameo:cyrax:assist",
    ]);

    expect(notation.ok).toBe(true);
    if (!notation.ok) {
      throw new Error("Notation derivation should succeed.");
    }
    expect(notation.value).toEqual([["1", "1"], ["D", "2"], ["K"]]);
  });
});
