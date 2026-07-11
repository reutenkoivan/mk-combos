import { mkxlBusiness as rootBusiness } from "@mk-combos/mkxl-business";
import * as contractEntry from "@mk-combos/mkxl-business/contract";
import {
  mkCombosMkxlBusiness,
  mkxlBusinessContractGroups,
} from "@mk-combos/mkxl-business/contract";
import * as runtimeEntry from "@mk-combos/mkxl-business/runtime";
import { MkxlBusinessSliceSchema } from "@mk-combos/mkxl-business/schema";
import type {
  MkxlBusinessBuilderContext,
  MkxlBusinessBuilderState,
  MkxlBusinessComboDetail,
  MkxlBusinessComboLookup,
  MkxlBusinessComboRef,
  MkxlBusinessComboSource,
  MkxlBusinessCustomCombo,
  MkxlBusinessCustomComboDetail,
  MkxlBusinessCustomComboSummary,
  MkxlBusinessLastCatalog,
  MkxlBusinessSeededComboDetail,
  MkxlBusinessSlice,
  MkxlBusinessValidationReport,
  MkxlNamedList,
  MkxlNamedListItem,
  MkxlResolvedNamedList,
  MkxlResolvedNamedListItem,
} from "@mk-combos/mkxl-business/type";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_contract: {
  builderContext: MkxlBusinessBuilderContext;
  builderState: MkxlBusinessBuilderState;
  comboDetailUnion: MkxlBusinessComboDetail;
  comboDetail: MkxlBusinessSeededComboDetail | MkxlBusinessCustomComboDetail;
  ref: MkxlBusinessComboRef;
  source: MkxlBusinessComboSource;
  customCombo: MkxlBusinessCustomCombo;
  customComboDetail: MkxlBusinessCustomComboDetail;
  customComboSummary: MkxlBusinessCustomComboSummary;
  lastCatalog: MkxlBusinessLastCatalog;
  list: MkxlNamedList;
  listItem: MkxlNamedListItem;
  slice: MkxlBusinessSlice;
  lookup: MkxlBusinessComboLookup;
  resolvedList: MkxlResolvedNamedList;
  resolvedListItem: MkxlResolvedNamedListItem;
  validationReport: MkxlBusinessValidationReport;
}) => true;

describe("@mk-combos/mkxl-business contract", () => {
  it("keeps the root entrypoint focused on mkxlBusiness", () => {
    expect(rootBusiness).toBe(runtimeEntry.mkxlBusiness);
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
    expect(rootBusiness.id).toBe("mkxl");
    expect(rootBusiness.label).toBe("MKXL");
  });

  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mkCombosMkxlBusiness",
      "mkxlBusinessContractGroups",
    ]);
    expect(mkCombosMkxlBusiness.packageName).toBe("@mk-combos/mkxl-business");
    expect(mkCombosMkxlBusiness.groups).toBe(mkxlBusinessContractGroups);
  });

  it("documents every public subpath group", () => {
    expect(mkxlBusinessContractGroups).toEqual({
      entry: {
        runtime: "@mk-combos/mkxl-business",
      },
      runtime: {
        runtime: "@mk-combos/mkxl-business/runtime",
      },
      schema: {
        schema: "@mk-combos/mkxl-business/schema",
      },
      type: {
        type: "@mk-combos/mkxl-business/type",
      },
    });
  });

  it("keeps public subpaths importable", () => {
    const slice = MkxlBusinessSliceSchema.parse(
      runtimeEntry.mkxlBusiness.backup.createEmptySlice(),
    );
    const lastCatalog = {
      context: {
        characterId: "scorpion",
        variationId: "scorpion:ninjutsu",
      },
      filters: {},
    } satisfies MkxlBusinessLastCatalog;
    const ref = {
      gameId: "mkxl",
      source: "seeded",
      comboId: "scorpion-ninjutsu-starter-001",
    } as const;
    const lookup = runtimeEntry.mkxlBusiness.detail.lookup({ ref });
    const builderState = runtimeEntry.mkxlBusiness.builder.createState({
      context: lastCatalog.context,
    });

    expect(lookup.ok).toBe(true);
    if (!lookup.ok) {
      throw new Error("MKXL business seeded lookup should succeed.");
    }
    expect(builderState.ok).toBe(true);
    if (!builderState.ok) {
      throw new Error("MKXL business builder state should be created.");
    }
    expect(lookup.value.status).toBe("found");
    if (lookup.value.status !== "found" || lookup.value.detail.source !== "seeded") {
      throw new Error("MKXL business seeded detail should be found.");
    }

    const customCombo = {
      id: "local-contract-1",
      gameId: "mkxl",
      source: "custom",
      characterId: lookup.value.detail.summary.character.id,
      variationId: lookup.value.detail.summary.variation.id,
      stageContext: lookup.value.detail.summary.stageContext,
      movePath: lookup.value.detail.summary.movePath,
      cachedNotation: lookup.value.detail.summary.cachedNotation,
      metadata: lookup.value.detail.summary.metadata,
      notes: lookup.value.detail.summary.notes,
      gameVersion: lookup.value.detail.summary.gameVersion,
      createdAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
    } satisfies MkxlBusinessCustomCombo;
    const listItem = {
      ref: {
        gameId: "mkxl",
        source: "custom",
        comboId: customCombo.id,
      },
    } satisfies MkxlNamedListItem;
    const list = {
      id: "contract-list",
      gameId: "mkxl",
      name: "Contract list",
      items: [listItem],
      createdAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
    } satisfies MkxlNamedList;
    const customSlice = {
      version: 1,
      customCombos: [customCombo],
      namedLists: [list],
      lastCatalog,
    } satisfies MkxlBusinessSlice;
    const customLookup = runtimeEntry.mkxlBusiness.detail.lookup({
      ref: listItem.ref,
      slice: customSlice,
    });
    const resolvedList = runtimeEntry.mkxlBusiness.lists.resolveList({
      list,
      slice: customSlice,
    });
    const validationReport = runtimeEntry.mkxlBusiness.validation.validateSlice(customSlice);

    expect(customLookup.ok).toBe(true);
    expect(resolvedList.ok).toBe(true);
    expect(validationReport.ok).toBe(true);
    if (!customLookup.ok || !resolvedList.ok || !validationReport.ok) {
      throw new Error("MKXL business custom fixtures should be valid.");
    }
    expect(customLookup.value.status).toBe("found");
    if (customLookup.value.status !== "found" || customLookup.value.detail.source !== "custom") {
      throw new Error("MKXL business custom detail should be found.");
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
