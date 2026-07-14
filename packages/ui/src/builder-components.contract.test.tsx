import type {
  BuilderActionBarAction,
  BuilderActionBarIntent,
  BuilderActionBarState,
} from "@mk-combos/ui/components/builder-action-bar";
import {
  BuilderActionBar,
  builderActionBarActions,
  builderActionBarStates,
} from "@mk-combos/ui/components/builder-action-bar";
import type {
  ComboFrameMeterAction,
  ComboFrameMeterAvailableGrid,
  ComboFrameMeterClosedDetails,
  ComboFrameMeterDetails,
  ComboFrameMeterDetailsState,
  ComboFrameMeterGrid,
  ComboFrameMeterGridState,
  ComboFrameMeterInspectionTargetKind,
  ComboFrameMeterIntent,
  ComboFrameMeterLabels,
  ComboFrameMeterLegendCategory,
  ComboFrameMeterLegendItem,
  ComboFrameMeterLifecycle,
  ComboFrameMeterModelMethods,
  ComboFrameMeterModelState,
  ComboFrameMeterOpenDetails,
  ComboFrameMeterScope,
  ComboFrameMeterSection,
  ComboFrameMeterSegment,
  ComboFrameMeterSegmentKind,
  ComboFrameMeterSegmentValidity,
  ComboFrameMeterSnapshot,
  ComboFrameMeterTrack,
  ComboFrameMeterTrackKind,
  ComboFrameMeterUnavailableGrid,
  ComboFrameMeterValue,
} from "@mk-combos/ui/components/combo-frame-meter";
import {
  ComboFrameMeter,
  comboFrameMeterActions,
  comboFrameMeterDetailsStates,
  comboFrameMeterGridStates,
  comboFrameMeterInspectionTargetKinds,
  comboFrameMeterLifecycles,
  comboFrameMeterScopes,
  comboFrameMeterSegmentKinds,
  comboFrameMeterSegmentValidities,
  comboFrameMeterTrackKinds,
  useComboFrameMeterModel,
} from "@mk-combos/ui/components/combo-frame-meter";
import type {
  ComboWhiteboardAction,
  ComboWhiteboardCandidate,
  ComboWhiteboardDetailActions,
  ComboWhiteboardEditOperation,
  ComboWhiteboardFocusTargetKind,
  ComboWhiteboardGapActions,
  ComboWhiteboardLocalMenu,
  ComboWhiteboardLocalMenuState,
  ComboWhiteboardMenuTarget,
  ComboWhiteboardMetaItem,
  ComboWhiteboardMetaStatus,
  ComboWhiteboardMode,
  ComboWhiteboardModelMethods,
  ComboWhiteboardModelState,
  ComboWhiteboardPickUp,
  ComboWhiteboardPickUpState,
  ComboWhiteboardPreparedAction,
  ComboWhiteboardResponsiveFocusData,
  ComboWhiteboardStep,
  ComboWhiteboardStepActions,
  ComboWhiteboardStepMetaItems,
  ComboWhiteboardSummary,
  ComboWhiteboardTransition,
  ComboWhiteboardTransitionMetaItems,
  ComboWhiteboardTruncateConfirmation,
} from "@mk-combos/ui/components/combo-whiteboard";
import {
  ComboWhiteboard,
  comboWhiteboardActions,
  comboWhiteboardEditOperations,
  comboWhiteboardFocusTargetKinds,
  comboWhiteboardLocalMenuStates,
  comboWhiteboardMetaStatuses,
  comboWhiteboardModes,
  comboWhiteboardPickUpStates,
  useComboWhiteboardModel,
} from "@mk-combos/ui/components/combo-whiteboard";
import { uiContractGroups } from "@mk-combos/ui/contract";
import uiStyles from "@mk-combos/ui/styles.css";
import { describe, expect, it } from "vitest";

import uiPackage from "../package.json";
import uiTsdownConfig from "../tsdown.config";

type DictionaryValue<Dictionary> = Dictionary[keyof Dictionary];

type IsExact<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? (<Value>() => Value extends Right ? 1 : 2) extends <Value>() => Value extends Left ? 1 : 2
      ? true
      : false
    : false;

type ExactPublicDictionaryTypes = {
  actionBarAction: IsExact<BuilderActionBarAction, DictionaryValue<typeof builderActionBarActions>>;
  actionBarState: IsExact<BuilderActionBarState, DictionaryValue<typeof builderActionBarStates>>;
  frameAction: IsExact<ComboFrameMeterAction, DictionaryValue<typeof comboFrameMeterActions>>;
  frameDetailsState: IsExact<
    ComboFrameMeterDetailsState,
    DictionaryValue<typeof comboFrameMeterDetailsStates>
  >;
  frameGridState: IsExact<
    ComboFrameMeterGridState,
    DictionaryValue<typeof comboFrameMeterGridStates>
  >;
  frameInspectionTargetKind: IsExact<
    ComboFrameMeterInspectionTargetKind,
    DictionaryValue<typeof comboFrameMeterInspectionTargetKinds>
  >;
  frameLifecycle: IsExact<
    ComboFrameMeterLifecycle,
    DictionaryValue<typeof comboFrameMeterLifecycles>
  >;
  frameScope: IsExact<ComboFrameMeterScope, DictionaryValue<typeof comboFrameMeterScopes>>;
  frameSegmentKind: IsExact<
    ComboFrameMeterSegmentKind,
    DictionaryValue<typeof comboFrameMeterSegmentKinds>
  >;
  frameSegmentValidity: IsExact<
    ComboFrameMeterSegmentValidity,
    DictionaryValue<typeof comboFrameMeterSegmentValidities>
  >;
  frameTrackKind: IsExact<
    ComboFrameMeterTrackKind,
    DictionaryValue<typeof comboFrameMeterTrackKinds>
  >;
  whiteboardAction: IsExact<ComboWhiteboardAction, DictionaryValue<typeof comboWhiteboardActions>>;
  whiteboardEditOperation: IsExact<
    ComboWhiteboardEditOperation,
    DictionaryValue<typeof comboWhiteboardEditOperations>
  >;
  whiteboardFocusTargetKind: IsExact<
    ComboWhiteboardFocusTargetKind,
    DictionaryValue<typeof comboWhiteboardFocusTargetKinds>
  >;
  whiteboardLocalMenuState: IsExact<
    ComboWhiteboardLocalMenuState,
    DictionaryValue<typeof comboWhiteboardLocalMenuStates>
  >;
  whiteboardMetaStatus: IsExact<
    ComboWhiteboardMetaStatus,
    DictionaryValue<typeof comboWhiteboardMetaStatuses>
  >;
  whiteboardMode: IsExact<ComboWhiteboardMode, DictionaryValue<typeof comboWhiteboardModes>>;
  whiteboardPickUpState: IsExact<
    ComboWhiteboardPickUpState,
    DictionaryValue<typeof comboWhiteboardPickUpStates>
  >;
};

const exactPublicDictionaryTypes = {
  actionBarAction: true,
  actionBarState: true,
  frameAction: true,
  frameDetailsState: true,
  frameGridState: true,
  frameInspectionTargetKind: true,
  frameLifecycle: true,
  frameScope: true,
  frameSegmentKind: true,
  frameSegmentValidity: true,
  frameTrackKind: true,
  whiteboardAction: true,
  whiteboardEditOperation: true,
  whiteboardFocusTargetKind: true,
  whiteboardLocalMenuState: true,
  whiteboardMetaStatus: true,
  whiteboardMode: true,
  whiteboardPickUpState: true,
} as const satisfies ExactPublicDictionaryTypes;

const builderComponentSubpaths = {
  builderActionBar: "@mk-combos/ui/components/builder-action-bar",
  comboFrameMeter: "@mk-combos/ui/components/combo-frame-meter",
  comboWhiteboard: "@mk-combos/ui/components/combo-whiteboard",
} as const;

type PreparedPublicShapeTypes = {
  actionBarIntent: BuilderActionBarIntent;
  frameAvailableGrid: ComboFrameMeterAvailableGrid;
  frameClosedDetails: ComboFrameMeterClosedDetails;
  frameDetails: ComboFrameMeterDetails;
  frameGrid: ComboFrameMeterGrid;
  frameIntent: ComboFrameMeterIntent;
  frameLabels: ComboFrameMeterLabels;
  frameLegendCategory: ComboFrameMeterLegendCategory;
  frameLegendItem: ComboFrameMeterLegendItem;
  frameModelMethods: ComboFrameMeterModelMethods;
  frameModelState: ComboFrameMeterModelState;
  frameOpenDetails: ComboFrameMeterOpenDetails;
  frameSection: ComboFrameMeterSection;
  frameSegment: ComboFrameMeterSegment;
  frameSnapshot: ComboFrameMeterSnapshot;
  frameTrack: ComboFrameMeterTrack;
  frameUnavailableGrid: ComboFrameMeterUnavailableGrid;
  frameValue: ComboFrameMeterValue;
  whiteboardCandidate: ComboWhiteboardCandidate;
  whiteboardDetailActions: ComboWhiteboardDetailActions;
  whiteboardGapActions: ComboWhiteboardGapActions;
  whiteboardLocalMenu: ComboWhiteboardLocalMenu;
  whiteboardMenuTarget: ComboWhiteboardMenuTarget;
  whiteboardMetaItem: ComboWhiteboardMetaItem;
  whiteboardModelMethods: ComboWhiteboardModelMethods;
  whiteboardModelState: ComboWhiteboardModelState;
  whiteboardPickUp: ComboWhiteboardPickUp;
  whiteboardPreparedAction: ComboWhiteboardPreparedAction;
  whiteboardResponsiveFocusData: ComboWhiteboardResponsiveFocusData;
  whiteboardStep: ComboWhiteboardStep;
  whiteboardStepActions: ComboWhiteboardStepActions;
  whiteboardStepMetaItems: ComboWhiteboardStepMetaItems;
  whiteboardSummary: ComboWhiteboardSummary;
  whiteboardTransition: ComboWhiteboardTransition;
  whiteboardTransitionMetaItems: ComboWhiteboardTransitionMetaItems;
  whiteboardTruncateConfirmation: ComboWhiteboardTruncateConfirmation;
};

const preparedPublicShapeKeys = [
  "actionBarIntent",
  "frameAvailableGrid",
  "frameClosedDetails",
  "frameDetails",
  "frameGrid",
  "frameIntent",
  "frameLabels",
  "frameLegendCategory",
  "frameLegendItem",
  "frameModelMethods",
  "frameModelState",
  "frameOpenDetails",
  "frameSection",
  "frameSegment",
  "frameSnapshot",
  "frameTrack",
  "frameUnavailableGrid",
  "frameValue",
  "whiteboardCandidate",
  "whiteboardDetailActions",
  "whiteboardGapActions",
  "whiteboardLocalMenu",
  "whiteboardMenuTarget",
  "whiteboardMetaItem",
  "whiteboardModelMethods",
  "whiteboardModelState",
  "whiteboardPickUp",
  "whiteboardPreparedAction",
  "whiteboardResponsiveFocusData",
  "whiteboardStep",
  "whiteboardStepActions",
  "whiteboardStepMetaItems",
  "whiteboardSummary",
  "whiteboardTransition",
  "whiteboardTransitionMetaItems",
  "whiteboardTruncateConfirmation",
] as const satisfies readonly (keyof PreparedPublicShapeTypes)[];

type FrameSegmentCssGeometryKeys = Extract<
  keyof ComboFrameMeterSegment,
  "laneOffsetRem" | "offsetPercent" | "range" | "spanPercent"
>;

const frameSegmentHasNoCssGeometry = true as const satisfies IsExact<
  FrameSegmentCssGeometryKeys,
  never
>;

describe("builder component public contracts", () => {
  it("publishes the prepared model and semantic intent shape types", () => {
    expect(preparedPublicShapeKeys).toHaveLength(36);
    expect(frameSegmentHasNoCssGeometry).toBe(true);
  });

  it("publishes exact action-bar dictionaries and typeof-derived types", () => {
    expect(builderActionBarActions).toEqual({
      cancelBuilder: "cancelBuilder",
      confirmCancelBuilder: "confirmCancelBuilder",
      finishBuilder: "finishBuilder",
      openSavedComboAddToList: "openSavedComboAddToList",
      undoMove: "undoMove",
    });
    expect(builderActionBarStates).toEqual({
      idle: "idle",
      saved: "saved",
      saveError: "saveError",
      saving: "saving",
    });
    expect(exactPublicDictionaryTypes.actionBarAction).toBe(true);
    expect(exactPublicDictionaryTypes.actionBarState).toBe(true);
  });

  it("publishes exact frame-meter dictionaries and typeof-derived types", () => {
    expect(comboFrameMeterLifecycles).toEqual({
      pendingTruncate: "pendingTruncate",
      ready: "ready",
      repairReview: "repairReview",
      savingFrozen: "savingFrozen",
    });
    expect(comboFrameMeterScopes).toEqual({
      selectedMove: "selectedMove",
      wholeCombo: "wholeCombo",
    });
    expect(comboFrameMeterDetailsStates).toEqual({ closed: "closed", open: "open" });
    expect(comboFrameMeterGridStates).toEqual({
      available: "available",
      unavailable: "unavailable",
    });
    expect(comboFrameMeterTrackKinds).toEqual({
      comparison: "comparison",
      meta: "meta",
      primary: "primary",
    });
    expect(comboFrameMeterSegmentKinds).toEqual({
      active: "active",
      cancel: "cancel",
      juggle: "juggle",
      link: "link",
      other: "other",
      recovery: "recovery",
      startup: "startup",
      transition: "transition",
    });
    expect(comboFrameMeterSegmentValidities).toEqual({
      invalid: "invalid",
      unavailable: "unavailable",
      valid: "valid",
    });
    expect(comboFrameMeterInspectionTargetKinds).toEqual({
      candidate: "candidate",
      step: "step",
    });
    expect(comboFrameMeterActions).toEqual({
      clearTimelineFocus: "clearTimelineFocus",
      closeSegmentDetails: "closeSegmentDetails",
      focusMatchingWhiteboardStep: "focusMatchingWhiteboardStep",
      focusTimelineSegment: "focusTimelineSegment",
      openSegmentDetails: "openSegmentDetails",
      switchFrameScope: "switchFrameScope",
    });
    expect(exactPublicDictionaryTypes).toEqual(
      expect.objectContaining({
        frameAction: true,
        frameDetailsState: true,
        frameGridState: true,
        frameInspectionTargetKind: true,
        frameLifecycle: true,
        frameScope: true,
        frameSegmentKind: true,
        frameSegmentValidity: true,
        frameTrackKind: true,
      }),
    );
  });

  it("publishes exact whiteboard dictionaries and typeof-derived types", () => {
    expect(comboWhiteboardModes).toEqual({
      builderEditable: "builderEditable",
      detailReadOnly: "detailReadOnly",
      emptyActive: "emptyActive",
      lockedPreview: "lockedPreview",
      pendingTruncate: "pendingTruncate",
      repairReview: "repairReview",
      savingFrozen: "savingFrozen",
    });
    expect(comboWhiteboardEditOperations).toEqual({
      append: "append",
      insert: "insert",
      reorder: "reorder",
      replace: "replace",
    });
    expect(comboWhiteboardActions).toEqual({
      cancelPickUp: "cancelPickUp",
      cancelTruncate: "cancelTruncate",
      closeLocalMenu: "closeLocalMenu",
      confirmTruncate: "confirmTruncate",
      dropPickedStep: "dropPickedStep",
      duplicateSeededCombo: "duplicateSeededCombo",
      editCustomCombo: "editCustomCombo",
      focusGap: "focusGap",
      focusMoveCandidate: "focusMoveCandidate",
      focusStep: "focusStep",
      moveToNextGroup: "moveToNextGroup",
      moveToPreviousGroup: "moveToPreviousGroup",
      openCandidateDetails: "openCandidateDetails",
      openLocalMenu: "openLocalMenu",
      openStepDetails: "openStepDetails",
      pickUpStep: "pickUpStep",
      removeStep: "removeStep",
      repairFromValidPrefix: "repairFromValidPrefix",
      selectMoveGroup: "selectMoveGroup",
      selectMoveCandidate: "selectMoveCandidate",
      setEditTarget: "setEditTarget",
      undoToStep: "undoToStep",
    });
    expect(comboWhiteboardFocusTargetKinds).toEqual({
      candidate: "candidate",
      gap: "gap",
      none: "none",
      step: "step",
    });
    expect(comboWhiteboardLocalMenuStates).toEqual({ closed: "closed", open: "open" });
    expect(comboWhiteboardPickUpStates).toEqual({ idle: "idle", pickedUp: "pickedUp" });
    expect(comboWhiteboardMetaStatuses).toEqual({
      available: "available",
      unavailable: "unavailable",
    });
    expect(exactPublicDictionaryTypes).toEqual(
      expect.objectContaining({
        whiteboardAction: true,
        whiteboardEditOperation: true,
        whiteboardFocusTargetKind: true,
        whiteboardLocalMenuState: true,
        whiteboardMetaStatus: true,
        whiteboardMode: true,
        whiteboardPickUpState: true,
      }),
    );
  });

  it("imports all component subpaths with their co-exported model hooks", async () => {
    const [actionBarEntry, frameMeterEntry, whiteboardEntry] = await Promise.all([
      import("@mk-combos/ui/components/builder-action-bar"),
      import("@mk-combos/ui/components/combo-frame-meter"),
      import("@mk-combos/ui/components/combo-whiteboard"),
    ]);

    expect(BuilderActionBar).toBeTypeOf("function");
    expect(ComboFrameMeter).toBeTypeOf("function");
    expect(useComboFrameMeterModel).toBeTypeOf("function");
    expect(ComboWhiteboard).toBeTypeOf("function");
    expect(useComboWhiteboardModel).toBeTypeOf("function");
    expect(actionBarEntry.BuilderActionBar).toBe(BuilderActionBar);
    expect(frameMeterEntry.ComboFrameMeter).toBe(ComboFrameMeter);
    expect(frameMeterEntry.useComboFrameMeterModel).toBe(useComboFrameMeterModel);
    expect(whiteboardEntry.ComboWhiteboard).toBe(ComboWhiteboard);
    expect(whiteboardEntry.useComboWhiteboardModel).toBe(useComboWhiteboardModel);
    expect(Object.keys(whiteboardEntry).filter((name) => /move.?picker/iu.test(name))).toEqual([]);
  });

  it("keeps source, publish, tsdown, and contract metadata in parity", async () => {
    const resolvedTsdownExport = await uiTsdownConfig({}, { ci: true });
    const resolvedTsdownConfig = Array.isArray(resolvedTsdownExport)
      ? resolvedTsdownExport[0]
      : resolvedTsdownExport;
    const sourceExports = uiPackage.exports as Record<string, string>;
    const publishExports = uiPackage.publishConfig.exports as Record<string, string>;
    const tsdownEntries = resolvedTsdownConfig?.entry as Record<string, string>;

    expect(uiContractGroups.components).toEqual(expect.objectContaining(builderComponentSubpaths));
    for (const contractSubpath of Object.values(builderComponentSubpaths)) {
      const packageSubpath = `.${contractSubpath.slice("@mk-combos/ui".length)}`;
      const entrySubpath = packageSubpath.slice(2);

      expect(sourceExports[packageSubpath]).toBe(`./src/${entrySubpath}.tsx`);
      expect(publishExports[packageSubpath]).toBe(`./dist/${entrySubpath}.mjs`);
      expect(tsdownEntries[entrySubpath]).toBe(`src/${entrySubpath}.tsx`);
    }
  });

  it("imports the public stylesheet through persistent source and publish exports", async () => {
    const sourceExports = uiPackage.exports as Record<string, string>;
    const publishExports = uiPackage.publishConfig.exports as Record<string, string>;
    const resolvedTsdownExport = await uiTsdownConfig({}, { ci: true });
    const resolvedTsdownConfig = Array.isArray(resolvedTsdownExport)
      ? resolvedTsdownExport[0]
      : resolvedTsdownExport;

    expect(uiStyles).toBeTypeOf("string");
    expect(sourceExports["./styles.css"]).toBe("./src/styles.css");
    expect(publishExports["./styles.css"]).toBe("./src/styles.css");
    expect(resolvedTsdownConfig?.exports).toEqual({
      customExports: { "./styles.css": "./src/styles.css" },
      devExports: true,
    });
    expect(uiContractGroups.styles.css).toBe("@mk-combos/ui/styles.css");
  });

  it("does not publish MovePicker or hook-only builder subpaths", async () => {
    const resolvedTsdownExport = await uiTsdownConfig({}, { ci: true });
    const resolvedTsdownConfig = Array.isArray(resolvedTsdownExport)
      ? resolvedTsdownExport[0]
      : resolvedTsdownExport;
    const sourceSubpaths = Object.keys(uiPackage.exports);
    const publishSubpaths = Object.keys(uiPackage.publishConfig.exports);
    const tsdownSubpaths = Object.keys(resolvedTsdownConfig?.entry ?? {});
    const contractSubpaths = [
      ...Object.values(uiContractGroups.components),
      ...Object.values(uiContractGroups.hooks),
    ];
    const isForbiddenBuilderSubpath = (subpath: string) =>
      /move-picker/iu.test(subpath) ||
      (/\/(?:hooks|components\/hooks)\//u.test(subpath) &&
        /(?:combo-whiteboard|combo-frame-meter)/u.test(subpath));

    expect(sourceSubpaths.filter(isForbiddenBuilderSubpath)).toEqual([]);
    expect(publishSubpaths.filter(isForbiddenBuilderSubpath)).toEqual([]);
    expect(tsdownSubpaths.filter(isForbiddenBuilderSubpath)).toEqual([]);
    expect(contractSubpaths.filter(isForbiddenBuilderSubpath)).toEqual([]);
  });
});
