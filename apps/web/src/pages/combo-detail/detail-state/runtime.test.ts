import { comboSources } from "@mk-combos/contracts/identity/value";
import { languageCodes } from "@mk-combos/contracts/settings/value";
import { comboFrameMeterGridStates } from "@mk-combos/ui/components/combo-frame-meter";
import { comboMetadataImportances } from "@mk-combos/ui/components/combo-metadata-grid";
import { errorStateSeverities } from "@mk-combos/ui/components/error-state";
import { staleInvalidComboMarkerStates } from "@mk-combos/ui/components/stale-invalid-combo-marker";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { describe, expect, it } from "vitest";

import { getAppCopy } from "../../../app/localization/runtime";
import { installedGames } from "../../../game-business/installed-games/value";
import { prepareComboDetail } from "./runtime";
import { comboDetailPageStates } from "./value";

const now = "2026-07-14T10:00:00.000Z";

function firstMkxlSummary() {
  const business = installedGames[0];
  const character = business.catalog
    .getContextOptions()
    .characters.find((option) => option.comboCount > 0);
  if (!character) throw new Error("Expected MKXL catalog data.");
  const selectedCharacter = business.catalog.selectCharacter(character.id);
  const variation = business.catalog
    .getContextOptions(selectedCharacter.context)
    .variations.find((option) => option.comboCount > 0);
  if (!variation) throw new Error("Expected MKXL variation data.");
  const ready = business.catalog.selectVariation(
    selectedCharacter.context,
    variation.id,
    selectedCharacter.filters,
  );
  const summary = business.catalog.selectSeededSummaries({
    context: ready.context,
    filters: ready.filters,
  })[0];
  if (!summary) throw new Error("Expected an MKXL seeded combo.");
  return { business, summary };
}

function firstMk1Summary() {
  const business = installedGames[1];
  const character = business.catalog
    .getContextOptions()
    .characters.find((option) => option.comboCount > 0);
  if (!character) throw new Error("Expected MK1 catalog data.");
  const selectedCharacter = business.catalog.selectCharacter(character.id);
  const kameo = business.catalog
    .getContextOptions(selectedCharacter.context)
    .kameos.find((option) => option.comboCount > 0);
  if (!kameo) throw new Error("Expected MK1 kameo data.");
  const ready = business.catalog.selectKameo(
    selectedCharacter.context,
    kameo.id,
    selectedCharacter.filters,
  );
  const summary = business.catalog.selectSeededSummaries({
    context: ready.context,
    filters: ready.filters,
  })[0];
  if (!summary) throw new Error("Expected an MK1 seeded combo.");
  return { business, summary };
}

describe("combo detail state runtime", () => {
  it("prepares seeded lookup branches with readable route and prioritized metadata", () => {
    for (const scenario of [firstMkxlSummary(), firstMk1Summary()]) {
      const prepared = prepareComboDetail({
        business: scenario.business,
        copy: getAppCopy(languageCodes.EN).comboDetail,
        language: languageCodes.EN,
        params: {
          comboId: scenario.summary.ref.comboId,
          source: comboSources.seeded,
        },
        responsiveMode: uiResponsiveModes.desktop,
        slice: scenario.business.backup.createEmptySlice(),
      });

      expect(prepared.state).toBe(comboDetailPageStates.ready);
      if (prepared.state !== comboDetailPageStates.ready) continue;

      expect(prepared.whiteboardSource.steps).toHaveLength(scenario.summary.movePath.length);
      for (const [index, step] of prepared.whiteboardSource.steps.entries()) {
        expect(step.label).not.toBe(scenario.summary.movePath[index]);
        expect(step.notation.length).toBeGreaterThan(0);
      }
      expect(prepared.frameSnapshot.grid).toEqual({
        label: "Frame values unavailable",
        reason: "A frame-by-frame timeline is unavailable for this combo.",
        state: comboFrameMeterGridStates.unavailable,
      });
      expect(prepared.frameSnapshot.summary[0]).toEqual({
        id: "move-count",
        label: "Moves",
        value: String(scenario.summary.movePath.length),
      });
      expect(prepared.metadata.rows.find((row) => row.id === "damage")?.importance).toBe(
        comboMetadataImportances.critical,
      );
      expect(prepared.metadata.rows.find((row) => row.id === "meter")?.importance).toBeUndefined();
      expect(prepared.metadata.rows.find((row) => row.id === "character")?.importance).toBe(
        comboMetadataImportances.secondary,
      );
      expect(prepared.metadata.rows.find((row) => row.id === "source")?.importance).toBe(
        comboMetadataImportances.secondary,
      );
      const expectedMetadataOrder = [
        "damage",
        "meter",
        "position",
        "difficulty",
        "starter",
        "route-type",
        "tags",
        "character",
        "variation",
        "kameo",
        "stage",
        "interactables",
        "source",
        "game-version",
      ];
      const actualMetadataOrder = prepared.metadata.rows.map((row) => row.id);
      expect(actualMetadataOrder).toEqual(
        expectedMetadataOrder.filter((id) => actualMetadataOrder.includes(id)),
      );
      expect(prepared.metadata.rows.find((row) => row.id === "character")?.value).not.toBe(
        scenario.summary.character.id,
      );
      expect(prepared.metadata.rows.find((row) => row.id === "tags")?.value).not.toContain("-");
    }
  });

  it("uses the exact Ukrainian frame-unavailable explanation", () => {
    const scenario = firstMk1Summary();
    const prepared = prepareComboDetail({
      business: scenario.business,
      copy: getAppCopy(languageCodes.UA).comboDetail,
      language: languageCodes.UA,
      params: { comboId: scenario.summary.ref.comboId, source: comboSources.seeded },
      responsiveMode: uiResponsiveModes.mobile,
      slice: scenario.business.backup.createEmptySlice(),
    });

    expect(prepared.state).toBe(comboDetailPageStates.ready);
    if (prepared.state !== comboDetailPageStates.ready) return;
    expect(prepared.frameSnapshot.grid).toMatchObject({
      reason: "Для цього комбо покадрова шкала недоступна.",
      state: comboFrameMeterGridStates.unavailable,
    });
  });

  it("prepares custom detail for both game-owned slice shapes without exposing raw ids", () => {
    const mkxl = firstMkxlSummary();
    const mkxlSlice = {
      ...mkxl.business.backup.createEmptySlice(),
      customCombos: [
        {
          cachedNotation: mkxl.summary.cachedNotation,
          characterId: mkxl.summary.character.id,
          createdAt: now,
          gameId: mkxl.business.id,
          gameVersion: mkxl.summary.gameVersion,
          id: "web-custom-mkxl",
          metadata: mkxl.summary.metadata,
          movePath: mkxl.summary.movePath,
          source: comboSources.custom,
          stageContext: mkxl.summary.stageContext,
          updatedAt: now,
          variationId: mkxl.summary.variation.id,
        },
      ],
    } as const;
    const mk1 = firstMk1Summary();
    const mk1Slice = {
      ...mk1.business.backup.createEmptySlice(),
      customCombos: [
        {
          cachedNotation: mk1.summary.cachedNotation,
          characterId: mk1.summary.character.id,
          createdAt: now,
          gameId: mk1.business.id,
          gameVersion: mk1.summary.gameVersion,
          id: "web-custom-mk1",
          kameoId: mk1.summary.kameo.id,
          metadata: mk1.summary.metadata,
          movePath: mk1.summary.movePath,
          source: comboSources.custom,
          updatedAt: now,
        },
      ],
    } as const;

    for (const scenario of [
      { business: mkxl.business, comboId: "web-custom-mkxl", slice: mkxlSlice },
      { business: mk1.business, comboId: "web-custom-mk1", slice: mk1Slice },
    ]) {
      const prepared = prepareComboDetail({
        business: scenario.business,
        copy: getAppCopy(languageCodes.UA).comboDetail,
        language: languageCodes.UA,
        params: { comboId: scenario.comboId, source: comboSources.custom },
        responsiveMode: uiResponsiveModes.tablet,
        slice: scenario.slice,
      });

      expect(prepared.state).toBe(comboDetailPageStates.ready);
      if (prepared.state !== comboDetailPageStates.ready) continue;
      expect(prepared.header.title).toBe("Комбо");
      expect(prepared.header.sourceLabel).toBe("Власне комбо");
      expect(prepared.header.marker).toBeUndefined();
      expect(prepared.whiteboardSource.boundaryIndex).toBeUndefined();
    }
  });

  it("preserves stale path evidence and marks the exact invalid boundary", () => {
    const scenario = firstMkxlSummary();
    const firstMove = scenario.summary.movePath[0];
    expect(firstMove).toBeDefined();
    if (!firstMove) return;
    const staleMovePath = [firstMove, "general:run"] as const;
    const notation = scenario.business.builder.deriveCachedNotation(staleMovePath);
    expect(notation.ok).toBe(true);
    if (!notation.ok) return;
    const comboId = "web-custom-stale";
    const slice = {
      ...scenario.business.backup.createEmptySlice(),
      customCombos: [
        {
          cachedNotation: notation.value,
          characterId: scenario.summary.character.id,
          createdAt: now,
          gameId: scenario.business.id,
          gameVersion: scenario.summary.gameVersion,
          id: comboId,
          metadata: scenario.summary.metadata,
          movePath: staleMovePath,
          source: comboSources.custom,
          stageContext: scenario.summary.stageContext,
          updatedAt: now,
          variationId: scenario.summary.variation.id,
        },
      ],
    } as const;
    const ref = { comboId, gameId: scenario.business.id, source: comboSources.custom } as const;
    const lookup = scenario.business.detail.lookup({ ref, slice });

    expect(lookup.ok).toBe(true);
    if (!lookup.ok || lookup.value.status !== "found") return;
    const foundValue = lookup.value;
    const foundDetail = foundValue.detail;
    expect("combo" in foundDetail).toBe(true);
    if (!("combo" in foundDetail)) return;
    const staleState = foundDetail.summary.comboState;
    expect(staleState.ok).toBe(false);
    if (staleState.ok) return;
    expect(staleState.status).toBe(staleInvalidComboMarkerStates.stale);
    expect(staleState.originalPath.map((step) => step.moveId)).toEqual(staleMovePath);
    expect(staleState.validPrefix.map((step) => step.moveId)).toEqual([firstMove]);
    expect(staleState.invalidBoundary.index).toBe(1);

    const prepared = prepareComboDetail({
      business: scenario.business,
      copy: getAppCopy(languageCodes.EN).comboDetail,
      language: languageCodes.EN,
      params: { comboId, source: comboSources.custom },
      responsiveMode: uiResponsiveModes.desktop,
      slice,
    });

    expect(prepared.state).toBe(comboDetailPageStates.ready);
    if (prepared.state !== comboDetailPageStates.ready) return;
    expect(prepared.header.marker).toMatchObject({
      state: staleInvalidComboMarkerStates.stale,
      validPrefixSummary: "Valid moves before the break: 1",
    });
    expect(prepared.whiteboardSource.boundaryIndex).toBe(1);
    expect(prepared.whiteboardSource.steps.map((step) => step.label)).toEqual(["Step 1", "Step 2"]);

    const invalidBusiness = {
      ...scenario.business,
      detail: {
        ...scenario.business.detail,
        lookup: () => ({
          ok: true as const,
          value: {
            ...foundValue,
            detail: {
              ...foundDetail,
              summary: {
                ...foundDetail.summary,
                comboState: {
                  ...staleState,
                  status: staleInvalidComboMarkerStates.invalid,
                },
              },
            },
          },
        }),
      },
    };
    const invalidPrepared = prepareComboDetail({
      business: invalidBusiness,
      copy: getAppCopy(languageCodes.EN).comboDetail,
      language: languageCodes.EN,
      params: { comboId, source: comboSources.custom },
      responsiveMode: uiResponsiveModes.desktop,
      slice,
    });

    expect(invalidPrepared.state).toBe(comboDetailPageStates.ready);
    if (invalidPrepared.state !== comboDetailPageStates.ready) return;
    expect(invalidPrepared.header.marker).toMatchObject({
      state: staleInvalidComboMarkerStates.invalid,
      validPrefixSummary: "Valid moves before the break: 1",
    });
    expect(invalidPrepared.whiteboardSource.boundaryIndex).toBe(1);
    expect(invalidPrepared.whiteboardSource.steps.map((step) => step.label)).toEqual([
      "Step 1",
      "Step 2",
    ]);
  });

  it("maps malformed custom data to a localized recoverable load error", () => {
    const business = installedGames[1];
    const copy = getAppCopy(languageCodes.UA).comboDetail;
    const prepared = prepareComboDetail({
      business,
      copy,
      language: languageCodes.UA,
      params: { comboId: "broken-custom", source: comboSources.custom },
      responsiveMode: uiResponsiveModes.mobile,
      slice: { version: 1, customCombos: "invalid", namedLists: [] },
    });

    expect(prepared.state).toBe(comboDetailPageStates.error);
    if (prepared.state === comboDetailPageStates.ready) return;
    expect(prepared.error).toMatchObject({
      message: copy.loadErrorDescription,
      severity: errorStateSeverities.recoverable,
      title: copy.loadErrorTitle,
    });
    expect(prepared.error.technicalReference).toBeTruthy();
  });

  it("maps unresolved custom references to a recoverable not-found state", () => {
    const business = installedGames[0];
    const prepared = prepareComboDetail({
      business,
      copy: getAppCopy(languageCodes.EN).comboDetail,
      language: languageCodes.EN,
      params: { comboId: "missing-custom", source: comboSources.custom },
      responsiveMode: uiResponsiveModes.desktop,
      slice: business.backup.createEmptySlice(),
    });

    expect(prepared.state).toBe(comboDetailPageStates.notFound);
    if (prepared.state === comboDetailPageStates.ready) return;
    expect(prepared.error.title).toBe("Combo unavailable");
    expect(prepared.error.actions[0]?.label).toBe("Back to catalog");
  });
});
