import { comboSources } from "@mk-combos/contracts/identity/value";
import { describe, expect, it } from "vitest";

import { installedGameCatalogAdapters, installedGames } from "../value";
import { installedCatalogSelectionStatuses } from "./type";

const now = "2026-07-16T00:00:00.000Z";

function firstReadyPath(adapter: (typeof installedGameCatalogAdapters)[number]) {
  const character = adapter.characterOptions().find((option) => option.available);

  if (!character) {
    throw new Error(`Expected ${adapter.gameId} to expose a selectable character.`);
  }

  const specification = adapter
    .specificationOptions(character.id)
    .find((option) => option.available);

  if (!specification) {
    throw new Error(`Expected ${adapter.gameId} to expose a selectable specification.`);
  }

  return { character, specification };
}

describe("installed game catalog pathname adapters", () => {
  it("resolves root, character and contextual result routes for every game", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { character, specification } = firstReadyPath(adapter);
      const root = adapter.resolvePath({});
      const characterStep = adapter.resolvePath({ characterSlug: character.routeSlug });
      const result = adapter.resolvePath({
        characterSlug: character.routeSlug,
        specificationSlug: specification.routeSlug,
      });

      expect(root.status).toBe(installedCatalogSelectionStatuses.empty);
      expect(characterStep).toMatchObject({
        characterId: character.id,
        characterSlug: character.routeSlug,
        status: installedCatalogSelectionStatuses.character,
      });
      expect(result).toMatchObject({
        characterId: character.id,
        specificationId: specification.id,
        specificationSlug: specification.routeSlug,
        status: installedCatalogSelectionStatuses.ready,
      });
      expect(result.canonicalSearch).not.toHaveProperty("character");
      expect(result.canonicalSearch).not.toHaveProperty(adapter.contextKind);
      const summaries = adapter.selectSummaries(result);
      expect(summaries.length).toBeGreaterThan(0);
      expect(summaries[0]).toMatchObject({ provenance: "curated" });
      expect(summaries[0]?.routeSteps[0]).toEqual(
        expect.objectContaining({
          emphasis: expect.any(String),
          kind: expect.any(String),
          notation: expect.any(Array),
          repetitionCount: expect.any(Number),
        }),
      );
    }
  });

  it("keeps MKXL internal variation ids out of canonical pathnames", () => {
    const adapter = installedGameCatalogAdapters[0];
    const character = adapter.characterOptions().find((option) => option.id === "scorpion");
    const variation = character
      ? adapter.specificationOptions(character.id).find((option) => option.routeSlug === "ninjutsu")
      : undefined;

    expect(character).toBeDefined();
    expect(variation?.id).toBe("scorpion:ninjutsu");
    expect(adapter.buildResultPath("scorpion", "ninjutsu")).toBe("/mkxl/catalog/scorpion/ninjutsu");
    expect(
      adapter.resolvePath({ characterSlug: "scorpion", specificationSlug: "ninjutsu" }),
    ).toMatchObject({
      specificationId: "scorpion:ninjutsu",
      specificationSlug: "ninjutsu",
      status: installedCatalogSelectionStatuses.ready,
    });
  });

  it("resolves source-neutral catalog detail paths to one combo reference", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const business = installedGames.find((candidate) => candidate.id === adapter.gameId);
      const { character, specification } = firstReadyPath(adapter);
      const selection = adapter.resolvePath({
        characterSlug: character.routeSlug,
        specificationSlug: specification.routeSlug,
      });
      const summary = adapter.selectSummaries(selection)[0];

      expect(business).toBeDefined();
      expect(summary).toBeDefined();
      if (!business || !summary) {
        continue;
      }

      expect(
        adapter.resolveComboRef({
          characterSlug: character.routeSlug,
          comboId: summary.ref.comboId,
          slice: business.backup.createEmptySlice(),
          specificationSlug: specification.routeSlug,
        }),
      ).toEqual(summary.ref);
      expect(
        adapter.resolveComboRef({
          characterSlug: character.routeSlug,
          comboId: `missing-${adapter.gameId}-combo`,
          slice: business.backup.createEmptySlice(),
          specificationSlug: specification.routeSlug,
        }),
      ).toBeUndefined();
    }
  });

  it("resolves custom detail paths and rejects cross-source ambiguity", () => {
    const mkxlAdapter = installedGameCatalogAdapters[0];
    const mkxlBusiness = installedGames[0];
    const mkxlPath = firstReadyPath(mkxlAdapter);
    const mkxlSummary = mkxlAdapter.selectSummaries(
      mkxlAdapter.resolvePath({
        characterSlug: mkxlPath.character.routeSlug,
        specificationSlug: mkxlPath.specification.routeSlug,
      }),
    )[0];

    expect(mkxlSummary).toBeDefined();
    if (!mkxlSummary) {
      return;
    }

    const mkxlLookup = mkxlBusiness.detail.lookup({ ref: mkxlSummary.ref });
    expect(mkxlLookup.ok).toBe(true);
    if (!mkxlLookup.ok || mkxlLookup.value.status !== "found") {
      return;
    }

    const mkxlSeeded = mkxlLookup.value.detail.summary;
    const mkxlCustom = {
      cachedNotation: mkxlSeeded.cachedNotation,
      characterId: mkxlSeeded.character.id,
      createdAt: now,
      gameId: "mkxl",
      gameVersion: mkxlSeeded.gameVersion,
      id: "web-custom-route-mkxl",
      metadata: mkxlSeeded.metadata,
      movePath: mkxlSeeded.movePath,
      source: comboSources.custom,
      stageContext: mkxlSeeded.stageContext,
      updatedAt: now,
      variationId: mkxlSeeded.variation.id,
    } as const;
    const mkxlSlice = {
      ...mkxlBusiness.backup.createEmptySlice(),
      customCombos: [mkxlCustom],
    };

    expect(
      mkxlAdapter.resolveComboRef({
        characterSlug: mkxlPath.character.routeSlug,
        comboId: mkxlCustom.id,
        slice: mkxlSlice,
        specificationSlug: mkxlPath.specification.routeSlug,
      }),
    ).toEqual({ comboId: mkxlCustom.id, gameId: "mkxl", source: comboSources.custom });
    expect(
      mkxlAdapter.resolveComboRef({
        characterSlug: mkxlPath.character.routeSlug,
        comboId: mkxlSummary.ref.comboId,
        slice: {
          ...mkxlSlice,
          customCombos: [{ ...mkxlCustom, id: mkxlSummary.ref.comboId }],
        },
        specificationSlug: mkxlPath.specification.routeSlug,
      }),
    ).toBeUndefined();

    const mk1Adapter = installedGameCatalogAdapters[1];
    const mk1Business = installedGames[1];
    const mk1Path = firstReadyPath(mk1Adapter);
    const mk1Summary = mk1Adapter.selectSummaries(
      mk1Adapter.resolvePath({
        characterSlug: mk1Path.character.routeSlug,
        specificationSlug: mk1Path.specification.routeSlug,
      }),
    )[0];

    expect(mk1Summary).toBeDefined();
    if (!mk1Summary) {
      return;
    }

    const mk1Lookup = mk1Business.detail.lookup({ ref: mk1Summary.ref });
    expect(mk1Lookup.ok).toBe(true);
    if (!mk1Lookup.ok || mk1Lookup.value.status !== "found") {
      return;
    }

    const mk1Seeded = mk1Lookup.value.detail.summary;
    const mk1Custom = {
      cachedNotation: mk1Seeded.cachedNotation,
      characterId: mk1Seeded.character.id,
      createdAt: now,
      gameId: "mk1",
      gameVersion: mk1Seeded.gameVersion,
      id: "web-custom-route-mk1",
      kameoId: mk1Seeded.kameo.id,
      metadata: mk1Seeded.metadata,
      movePath: mk1Seeded.movePath,
      source: comboSources.custom,
      updatedAt: now,
    } as const;
    const mk1Slice = {
      ...mk1Business.backup.createEmptySlice(),
      customCombos: [mk1Custom],
    };

    expect(
      mk1Adapter.resolveComboRef({
        characterSlug: mk1Path.character.routeSlug,
        comboId: mk1Custom.id,
        slice: mk1Slice,
        specificationSlug: mk1Path.specification.routeSlug,
      }),
    ).toEqual({ comboId: mk1Custom.id, gameId: "mk1", source: comboSources.custom });
  });

  it("returns recoverable invalid character and specification states", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { character } = firstReadyPath(adapter);

      expect(adapter.resolvePath({ characterSlug: "missing-fighter" }).status).toBe(
        installedCatalogSelectionStatuses.invalidCharacter,
      );
      expect(
        adapter.resolvePath({
          characterSlug: character.routeSlug,
          specificationSlug: "missing-specification",
        }),
      ).toMatchObject({
        characterId: character.id,
        status: installedCatalogSelectionStatuses.invalidSpecification,
      });
    }
  });

  it("does not support context query keys and resolves context only from pathname", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { character, specification } = firstReadyPath(adapter);
      const result = adapter.resolvePath({
        characterSlug: character.routeSlug,
        search: {
          character: "query-character-must-not-win",
          kameo: "query-kameo-must-not-win",
          variation: "query-variation-must-not-win",
        },
        specificationSlug: specification.routeSlug,
      });

      expect(result).toMatchObject({
        characterId: character.id,
        specificationId: specification.id,
        status: installedCatalogSelectionStatuses.ready,
      });
      expect(result.canonicalSearch).not.toHaveProperty("character");
      expect(result.canonicalSearch).not.toHaveProperty("variation");
      expect(result.canonicalSearch).not.toHaveProperty("kameo");
    }
  });
});
