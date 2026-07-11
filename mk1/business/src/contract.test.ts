import { mk1Business as rootBusiness } from "@mk-combos/mk1-business";
import * as contractEntry from "@mk-combos/mk1-business/contract";
import { mk1BusinessContractGroups, mkCombosMk1Business } from "@mk-combos/mk1-business/contract";
import * as runtimeEntry from "@mk-combos/mk1-business/runtime";
import { Mk1BusinessSliceSchema } from "@mk-combos/mk1-business/schema";
import type {
  Mk1BusinessBuilderContext,
  Mk1BusinessBuilderState,
  Mk1BusinessComboDetail,
  Mk1BusinessComboLookup,
  Mk1BusinessComboRef,
  Mk1BusinessComboSource,
  Mk1BusinessCustomCombo,
  Mk1BusinessCustomComboDetail,
  Mk1BusinessCustomComboSummary,
  Mk1BusinessLastCatalog,
  Mk1BusinessSeededComboDetail,
  Mk1BusinessSlice,
  Mk1BusinessValidationReport,
  Mk1NamedList,
  Mk1NamedListItem,
  Mk1ResolvedNamedList,
  Mk1ResolvedNamedListItem,
} from "@mk-combos/mk1-business/type";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_contract: {
  builderContext: Mk1BusinessBuilderContext;
  builderState: Mk1BusinessBuilderState;
  comboDetailUnion: Mk1BusinessComboDetail;
  comboDetail: Mk1BusinessSeededComboDetail | Mk1BusinessCustomComboDetail;
  ref: Mk1BusinessComboRef;
  source: Mk1BusinessComboSource;
  customCombo: Mk1BusinessCustomCombo;
  customComboDetail: Mk1BusinessCustomComboDetail;
  customComboSummary: Mk1BusinessCustomComboSummary;
  lastCatalog: Mk1BusinessLastCatalog;
  list: Mk1NamedList;
  listItem: Mk1NamedListItem;
  slice: Mk1BusinessSlice;
  lookup: Mk1BusinessComboLookup;
  resolvedList: Mk1ResolvedNamedList;
  resolvedListItem: Mk1ResolvedNamedListItem;
  validationReport: Mk1BusinessValidationReport;
}) => true;

describe("@mk-combos/mk1-business contract", () => {
  it("keeps the root entrypoint focused on mk1Business", () => {
    expect(rootBusiness).toBe(runtimeEntry.mk1Business);
    expect(Object.keys(rootBusiness).sort()).toEqual([
      "backup",
      "builder",
      "catalog",
      "detail",
      "game",
      "id",
      "label",
      "lists",
      "routes",
      "validation",
    ]);
    expect(rootBusiness.id).toBe("mk1");
    expect(rootBusiness.label).toBe("MK1");
  });

  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mk1BusinessContractGroups",
      "mkCombosMk1Business",
    ]);
    expect(mkCombosMk1Business.packageName).toBe("@mk-combos/mk1-business");
    expect(mkCombosMk1Business.groups).toBe(mk1BusinessContractGroups);
  });

  it("keeps public subpaths importable", () => {
    const slice = Mk1BusinessSliceSchema.parse(runtimeEntry.mk1Business.backup.createEmptySlice());
    const lastCatalog = {
      context: {
        characterId: "scorpion",
        kameoId: "cyrax",
      },
      filters: {},
    } satisfies Mk1BusinessLastCatalog;
    const ref = {
      gameId: "mk1",
      source: "seeded",
      comboId: "scorpion-cyrax-seed-001",
    } as const;
    const lookup = runtimeEntry.mk1Business.detail.lookup({ ref });
    const builderState = runtimeEntry.mk1Business.builder.createState({
      context: lastCatalog.context,
    });

    expect(lookup.ok).toBe(true);
    expect(builderState.ok).toBe(true);
    if (!lookup.ok || !builderState.ok) {
      throw new Error("MK1 business seeded fixtures should succeed.");
    }
    expect(lookup.value.status).toBe("found");
    if (lookup.value.status !== "found" || lookup.value.detail.source !== "seeded") {
      throw new Error("MK1 seeded detail should be found.");
    }

    const customCombo = {
      id: "local-contract-1",
      gameId: "mk1",
      source: "custom",
      characterId: lookup.value.detail.summary.character.id,
      kameoId: lookup.value.detail.summary.kameo.id,
      movePath: lookup.value.detail.summary.movePath,
      cachedNotation: lookup.value.detail.summary.cachedNotation,
      metadata: lookup.value.detail.summary.metadata,
      notes: lookup.value.detail.summary.notes,
      gameVersion: lookup.value.detail.summary.gameVersion,
      createdAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
    } satisfies Mk1BusinessCustomCombo;
    const listItem = {
      ref: {
        gameId: "mk1",
        source: "custom",
        comboId: customCombo.id,
      },
    } satisfies Mk1NamedListItem;
    const list = {
      id: "contract-list",
      gameId: "mk1",
      name: "Contract list",
      items: [listItem],
      createdAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
    } satisfies Mk1NamedList;
    const customSlice = {
      version: 1,
      customCombos: [customCombo],
      namedLists: [list],
      lastCatalog,
    } satisfies Mk1BusinessSlice;
    const customLookup = runtimeEntry.mk1Business.detail.lookup({
      ref: listItem.ref,
      slice: customSlice,
    });
    const resolvedList = runtimeEntry.mk1Business.lists.resolveList({
      list,
      slice: customSlice,
    });
    const validationReport = runtimeEntry.mk1Business.validation.validateSlice(customSlice);

    expect(customLookup.ok).toBe(true);
    expect(resolvedList.ok).toBe(true);
    expect(validationReport.ok).toBe(true);
    if (!customLookup.ok || !resolvedList.ok || !validationReport.ok) {
      throw new Error("MK1 custom fixtures should be valid.");
    }
    expect(customLookup.value.status).toBe("found");
    if (customLookup.value.status !== "found" || customLookup.value.detail.source !== "custom") {
      throw new Error("MK1 custom detail should be found.");
    }
    expect(
      acceptsPublicTypes({
        builderContext: lastCatalog.context,
        builderState: builderState.value,
        comboDetailUnion: lookup.value.detail,
        comboDetail: lookup.value.detail,
        ref,
        source: "seeded",
        customCombo,
        customComboDetail: customLookup.value.detail,
        customComboSummary: customLookup.value.detail.summary,
        lastCatalog,
        list,
        listItem,
        slice,
        lookup: lookup.value,
        resolvedList: resolvedList.value,
        resolvedListItem: resolvedList.value.items[0] ?? {
          status: "found",
          item: listItem,
          detail: customLookup.value.detail,
          messages: [],
        },
        validationReport: validationReport.value,
      }),
    ).toBe(true);
  });
});
