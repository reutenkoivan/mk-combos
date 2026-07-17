import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import { mkxlBusiness } from "@mk-combos/mkxl-business";
import type { MkxlBusinessCustomCombo, MkxlBusinessSlice } from "@mk-combos/mkxl-business/type";
import { mkxlCatalogMultiSelectFilterIds } from "@mk-combos/mkxl-catalog/filters/value";
import { describe, expect, it } from "vitest";

const now = "2026-07-11T00:00:00.000Z";

const scorpionNinjutsuContext = {
  characterId: "scorpion",
  variationId: "scorpion:ninjutsu",
} as const;

const seededRef = {
  gameId: "mkxl",
  source: "seeded",
  comboId: "scorpion-ninjutsu-starter-001",
} as const;

const expectPresent = <T>(value: T | undefined, label: string): T => {
  expect(value, label).toBeDefined();
  if (!value) {
    throw new Error(`${label} should be present.`);
  }

  return value;
};

const seededSummary = () =>
  expectPresent(
    mkxlBusiness.catalog.getSeededSummary(seededRef.comboId),
    "Scorpion Ninjutsu seeded summary",
  );

const customComboFromSeeded = (): MkxlBusinessCustomCombo => {
  const summary = seededSummary();

  return {
    id: "local-scorpion-1",
    gameId: "mkxl",
    source: "custom",
    title: { fallback: "Local Scorpion route" },
    characterId: summary.character.id,
    variationId: summary.variation.id,
    stageContext: summary.stageContext,
    movePath: summary.movePath,
    cachedNotation: summary.cachedNotation,
    metadata: summary.metadata,
    notes: summary.notes,
    gameVersion: summary.gameVersion,
    createdAt: now,
    updatedAt: now,
  };
};

const sliceWithCustom = (customCombo = customComboFromSeeded()): MkxlBusinessSlice => ({
  version: 1,
  customCombos: [customCombo],
  namedLists: [
    {
      id: "practice",
      gameId: "mkxl",
      name: "Practice",
      items: [
        {
          ref: {
            gameId: "mkxl",
            source: "custom",
            comboId: customCombo.id,
          },
          addedAt: now,
        },
        {
          ref: {
            gameId: "mkxl",
            source: "seeded",
            comboId: "missing-seeded-combo",
          },
          addedAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ],
});

describe("@mk-combos/mkxl-business runtime", () => {
  it("delegates filter-only search, explicit context options, facets, and summaries", () => {
    const parsed = mkxlBusiness.catalog.parseFilterQuery({ meter: "1", source: "curated" });
    const filterQuery = mkxlBusiness.catalog.serializeFilterQuery(parsed.filters);
    const options = mkxlBusiness.catalog.getContextOptions(scorpionNinjutsuContext);
    const summaries = mkxlBusiness.catalog.selectSeededSummaries({
      context: scorpionNinjutsuContext,
      filters: parsed.filters,
    });
    const facets = mkxlBusiness.catalog.getFilterFacets(scorpionNinjutsuContext, parsed.filters);

    expect(filterQuery).toEqual({
      meter: ["1"],
      source: ["curated"],
    });
    expect(options.variations.some((option) => option.id === "scorpion:ninjutsu")).toBe(true);
    expect(summaries.some((summary) => summary.ref.comboId === seededRef.comboId)).toBe(true);
    expect(facets.length).toBeGreaterThan(0);
  });

  it("applies semantic filter changes and returns the full recovered catalog state", () => {
    const changed = mkxlBusiness.catalog.applyFilterChange({
      context: scorpionNinjutsuContext,
      filters: {},
      change: {
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: mkxlCatalogMultiSelectFilterIds.source,
        value: "curated",
        selected: true,
      },
    });

    expect(changed).toEqual({
      status: "ready",
      context: scorpionNinjutsuContext,
      filters: { sources: ["curated"] },
      messages: [],
    });
  });

  it("saves and restores a canonical last catalog without changing other slice data", () => {
    const slice = sliceWithCustom();
    const saved = mkxlBusiness.catalog.saveLastCatalog({
      slice,
      context: scorpionNinjutsuContext,
      filters: { sources: ["curated"] },
    });

    expect(saved.ok).toBe(true);
    if (!saved.ok) {
      throw new Error("MKXL last catalog should be saved.");
    }
    expect(saved.value.customCombos).toEqual(slice.customCombos);
    expect(saved.value.namedLists).toEqual(slice.namedLists);
    expect(saved.value.lastCatalog).toEqual({
      context: scorpionNinjutsuContext,
      filters: { sources: ["curated"] },
    });

    const restored = mkxlBusiness.catalog.restoreLastCatalog(saved.value);

    expect(restored).toEqual({
      ok: true,
      value: {
        status: "ready",
        context: scorpionNinjutsuContext,
        filters: { sources: ["curated"] },
        messages: [],
      },
    });
  });

  it("validates the whole slice before saving or restoring catalog state", () => {
    const malformedSlice = {
      version: 1,
      customCombos: "invalid",
      namedLists: [],
    };
    const save = mkxlBusiness.catalog.saveLastCatalog({
      slice: malformedSlice,
      context: scorpionNinjutsuContext,
      filters: {},
    });
    const restore = mkxlBusiness.catalog.restoreLastCatalog(malformedSlice);
    const missing = mkxlBusiness.catalog.restoreLastCatalog(mkxlBusiness.backup.createEmptySlice());
    const malformedCatalog = mkxlBusiness.catalog.saveLastCatalog({
      slice: mkxlBusiness.backup.createEmptySlice(),
      context: { unexpected: true },
      filters: {},
    });

    expect(save.ok).toBe(false);
    expect(restore.ok).toBe(false);
    expect(malformedCatalog.ok).toBe(false);
    if (malformedCatalog.ok) {
      throw new Error("Malformed MKXL catalog state should be rejected.");
    }
    expect(malformedCatalog.error.code).toBe("mkxl.business.invalid_last_catalog");
    expect(missing).toEqual({
      ok: true,
      value: { status: "empty", context: {}, filters: {}, messages: [] },
    });
  });

  it("canonicalizes stale game ids before persisting last catalog", () => {
    const saved = mkxlBusiness.catalog.saveLastCatalog({
      slice: mkxlBusiness.backup.createEmptySlice(),
      context: { characterId: "missing", variationId: "missing:variation" },
      filters: { stageId: "missing-stage" },
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

  it("resolves seeded detail and returns notFound for missing combo refs", () => {
    const found = mkxlBusiness.detail.lookup({ ref: seededRef });
    const missing = mkxlBusiness.detail.lookup({
      ref: {
        gameId: "mkxl",
        source: "seeded",
        comboId: "missing-seeded-combo",
      },
    });

    expect(found.ok).toBe(true);
    if (!found.ok) {
      throw new Error("Seeded detail lookup should be ok.");
    }
    expect(found.value.status).toBe("found");
    if (found.value.status !== "found") {
      throw new Error("Seeded detail should be found.");
    }
    expect(found.value.detail.source).toBe("seeded");
    if (found.value.detail.source !== "seeded") {
      throw new Error("Seeded detail should keep seeded source.");
    }
    expect(found.value.detail.comboState.status).toBe("fresh");
    expect(missing.ok).toBe(true);
    if (!missing.ok) {
      throw new Error("Missing lookup should be a recoverable notFound result.");
    }
    expect(missing.value.status).toBe("notFound");
  });

  it("resolves stale custom combos without deleting or truncating the original path", () => {
    const summary = seededSummary();
    const firstMoveId = expectPresent(summary.movePath[0], "first seeded move");
    const staleMovePath = [firstMoveId, "general:run"] as const;
    const notation = mkxlBusiness.builder.deriveCachedNotation(staleMovePath);

    expect(notation.ok).toBe(true);
    if (!notation.ok) {
      throw new Error("Stale combo notation should derive for known move ids.");
    }

    const staleCombo: MkxlBusinessCustomCombo = {
      ...customComboFromSeeded(),
      movePath: staleMovePath,
      cachedNotation: notation.value,
    };
    const lookup = mkxlBusiness.detail.lookup({
      ref: {
        gameId: "mkxl",
        source: "custom",
        comboId: staleCombo.id,
      },
      slice: sliceWithCustom(staleCombo),
    });

    expect(lookup.ok).toBe(true);
    if (!lookup.ok) {
      throw new Error("Custom detail lookup should be ok.");
    }
    expect(lookup.value.status).toBe("found");
    if (lookup.value.status !== "found" || lookup.value.detail.source !== "custom") {
      throw new Error("Custom detail should be found.");
    }
    expect(lookup.value.detail.summary.comboState.status).toBe("stale");
    expect(lookup.value.detail.summary.movePath).toEqual(staleMovePath);
    expect(lookup.value.messages.map((message) => message.code)).toContain(
      "mkxl.business.custom_combo_stale",
    );
  });

  it("validates backup slices and preserves unresolved list references as warnings", () => {
    const slice = sliceWithCustom();
    const report = mkxlBusiness.backup.validateSlice(slice);
    const resolvedLists = mkxlBusiness.lists.resolveLists(slice);

    expect(report.ok).toBe(true);
    if (!report.ok) {
      throw new Error("Recoverable unresolved refs should not reject the slice.");
    }
    expect(report.value.messages.map((message) => message.code)).toContain(
      "mkxl.business.combo_not_found",
    );
    expect(resolvedLists.ok).toBe(true);
    if (!resolvedLists.ok) {
      throw new Error("List resolution should be ok.");
    }
    expect(resolvedLists.value[0]?.items.map((item) => item.status)).toEqual([
      "found",
      "unresolved",
    ]);
  });

  it("rejects duplicate list references during backup validation", () => {
    const customCombo = customComboFromSeeded();
    const duplicateSlice = {
      version: 1,
      customCombos: [customCombo],
      namedLists: [
        {
          id: "practice",
          gameId: "mkxl",
          name: "Practice",
          items: [
            {
              ref: {
                gameId: "mkxl",
                source: "custom",
                comboId: customCombo.id,
              },
            },
            {
              ref: {
                gameId: "mkxl",
                source: "custom",
                comboId: customCombo.id,
              },
            },
          ],
          createdAt: now,
          updatedAt: now,
        },
      ],
    };

    const validation = mkxlBusiness.backup.validateSlice(duplicateSlice);

    expect(validation.ok).toBe(false);
    if (validation.ok) {
      throw new Error("Duplicate list refs should reject the slice.");
    }
    expect(validation.error.validationMessages?.map((message) => message.code)).toContain(
      "mkxl.business.invalid_slice",
    );
  });

  it("creates builder state, derives cached notation, and hides stage interactables without stage", () => {
    const summary = seededSummary();
    const state = mkxlBusiness.builder.createState({
      context: scorpionNinjutsuContext,
      movePath: summary.movePath,
    });
    const emptyState = mkxlBusiness.builder.createState({
      context: scorpionNinjutsuContext,
    });

    expect(state.ok).toBe(true);
    if (!state.ok) {
      throw new Error("Builder state should be created from seeded move ids.");
    }
    expect(state.value.comboState.status).toBe("fresh");
    expect(state.value.cachedNotation).toEqual(summary.cachedNotation);
    expect(emptyState.ok).toBe(true);
    if (!emptyState.ok) {
      throw new Error("Empty builder state should be created for a valid context.");
    }
    expect(emptyState.value.validNextMoves.map((choice) => choice.moveId)).not.toContain(
      "crossroads:position-escape",
    );
  });
});
