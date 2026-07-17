import type { ComboRef } from "@mk-combos/contracts/identity/type";
import { comboSources } from "@mk-combos/contracts/identity/value";
import type { LanguageCode, LocalizedText } from "@mk-combos/contracts/settings/type";
import {
  type ComboDetailHeaderProps,
  comboDetailHeaderActionKinds,
} from "@mk-combos/ui/components/combo-detail-header";
import {
  type ComboFrameMeterLabels,
  type ComboFrameMeterSnapshot,
  comboFrameMeterGridStates,
  comboFrameMeterLifecycles,
} from "@mk-combos/ui/components/combo-frame-meter";
import {
  type ComboMetadataGridProps,
  type ComboMetadataRow,
  comboMetadataImportances,
} from "@mk-combos/ui/components/combo-metadata-grid";
import {
  type ComboWhiteboardSource,
  type ComboWhiteboardStep,
  type ComboWhiteboardTransition,
  comboWhiteboardMetaStatuses,
  comboWhiteboardModes,
} from "@mk-combos/ui/components/combo-whiteboard";
import {
  type ErrorStateProps,
  errorStateActionKinds,
  errorStateSeverities,
} from "@mk-combos/ui/components/error-state";
import {
  type StaleInvalidComboMarkerModel,
  staleInvalidComboMarkerStates,
} from "@mk-combos/ui/components/stale-invalid-combo-marker";
import type { ComponentLabelValue, UiResponsiveMode } from "@mk-combos/ui/components/type";
import { uiToneModes } from "@mk-combos/ui/tokens/value";

import { resolveLocalizedText } from "../../../app/localization/runtime";
import type { AppCopy } from "../../../app/localization/type";
import type { InstalledGameBusiness } from "../../../game-business/installed-games/type";
import type { ComboDetailPreparedState, ComboDetailReady } from "./type";
import { comboDetailPageStates } from "./value";

type MkxlBusiness = Extract<InstalledGameBusiness, { id: "mkxl" }>;
type Mk1Business = Extract<InstalledGameBusiness, { id: "mk1" }>;
type MkxlLookupValue = Extract<ReturnType<MkxlBusiness["detail"]["lookup"]>, { ok: true }>["value"];
type Mk1LookupValue = Extract<ReturnType<Mk1Business["detail"]["lookup"]>, { ok: true }>["value"];
type MkxlFound = Extract<MkxlLookupValue, { detail: unknown }>;
type Mk1Found = Extract<Mk1LookupValue, { detail: unknown }>;

type CommonMetadata = Readonly<{
  damage?: number;
  difficulty?: string;
  meter?: number;
  position?: string;
  routeType?: string;
  starter?: string;
  tags?: readonly string[];
}>;

type CommonPathStep = Readonly<{
  id: string;
  label?: string;
  moveId: string;
}>;

type CommonComboState =
  | Readonly<{
      currentPath: readonly CommonPathStep[];
      ok: true;
      status: string;
    }>
  | Readonly<{
      invalidBoundary: Readonly<{ index: number }>;
      ok: false;
      originalPath: readonly CommonPathStep[];
      reason: Readonly<{ code?: string; message: string }>;
      status:
        | typeof staleInvalidComboMarkerStates.invalid
        | typeof staleInvalidComboMarkerStates.stale;
      validPrefix: readonly CommonPathStep[];
    }>;

type CommonSummary = Readonly<{
  cachedNotation: readonly (readonly string[])[];
  character: Readonly<{ id: string; label: LocalizedText }>;
  gameVersion: string;
  metadata?: CommonMetadata;
  notes?: LocalizedText;
  ref: ComboRef;
  tags: readonly string[];
  title: LocalizedText;
}>;

type CommonFoundInput = Readonly<{
  comboState: CommonComboState;
  contextItems: readonly ComponentLabelValue[];
  copy: AppCopy["comboDetail"];
  language: LanguageCode;
  responsiveMode: UiResponsiveMode;
  summary: CommonSummary;
}>;

function humanizeToken(value: string): string {
  const normalized = value
    .replace(/([a-z0-9])([A-Z])/gu, "$1 $2")
    .replaceAll(/[-_:]+/gu, " ")
    .trim();

  return normalized ? `${normalized[0]?.toUpperCase() ?? ""}${normalized.slice(1)}` : value;
}

function sourceLabel(ref: ComboRef, copy: AppCopy["comboDetail"]): string {
  return ref.source === comboSources.custom ? copy.customSource : copy.seededSource;
}

function unavailableState(
  ref: ComboRef,
  copy: AppCopy["comboDetail"],
  technicalReference?: string,
): ErrorStateProps {
  return {
    actions: [
      {
        available: true,
        id: "return-to-catalog",
        kind: errorStateActionKinds.fallback,
        label: copy.backToCatalog,
      },
    ],
    errorToken: `combo-${ref.comboId}-unavailable`,
    message: copy.comboUnavailableDescription,
    severity: errorStateSeverities.warning,
    sourceSurface: "combo-detail",
    technicalReference,
    title: copy.comboUnavailableTitle,
  };
}

function loadErrorState(
  ref: ComboRef,
  copy: AppCopy["comboDetail"],
  technicalReference?: string,
): ErrorStateProps {
  return {
    actions: [
      {
        available: true,
        id: "return-to-catalog",
        kind: errorStateActionKinds.fallback,
        label: copy.backToCatalog,
      },
    ],
    errorToken: `combo-${ref.comboId}-load-error`,
    message: copy.loadErrorDescription,
    severity: errorStateSeverities.recoverable,
    sourceSurface: "combo-detail",
    technicalReference,
    title: copy.loadErrorTitle,
  };
}

function markerForState(
  ref: ComboRef,
  state: Exclude<CommonComboState, { ok: true }>,
  copy: AppCopy["comboDetail"],
): StaleInvalidComboMarkerModel {
  const markerMessageByState = {
    [staleInvalidComboMarkerStates.invalid]: copy.stateInvalid,
    [staleInvalidComboMarkerStates.stale]: copy.stateStale,
  } as const;
  const markerLabelByState = {
    [staleInvalidComboMarkerStates.invalid]: copy.stateInvalidLabel,
    [staleInvalidComboMarkerStates.stale]: copy.stateStaleLabel,
  } as const;

  return {
    actions: [],
    affectedReference: state.reason.code,
    comboRef: ref,
    reason: markerMessageByState[state.status],
    state: state.status,
    stateLabel: markerLabelByState[state.status],
    validPrefixSummary: copy.validPrefix.replaceAll("{count}", String(state.validPrefix.length)),
  };
}

function createWhiteboardSource(input: CommonFoundInput): ComboWhiteboardSource {
  const path = input.comboState.ok ? input.comboState.currentPath : input.comboState.originalPath;
  const boundaryIndex = input.comboState.ok ? undefined : input.comboState.invalidBoundary.index;
  const steps: ComboWhiteboardStep[] = path.map((step, index) => {
    const preparedStepLabel = input.copy.whiteboard.stepLabel.replaceAll(
      "{index}",
      String(index + 1),
    );
    const authoredLabel = step.label?.trim();
    const label =
      !authoredLabel || authoredLabel === step.moveId ? preparedStepLabel : authoredLabel;
    const notation = input.summary.cachedNotation[index];

    return {
      accessibleLabel:
        authoredLabel && authoredLabel !== step.moveId
          ? `${preparedStepLabel}: ${label}`
          : preparedStepLabel,
      id: step.id,
      label,
      metaItems: [
        {
          id: `step-${index + 1}`,
          label: preparedStepLabel,
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.neutral,
        },
      ],
      notation: notation ? [notation] : [],
      notationLabel: label,
    };
  });
  const transitions: ComboWhiteboardTransition[] = steps.slice(1).map((step, offset) => {
    const stepIndex = offset + 1;
    const invalid = boundaryIndex !== undefined && stepIndex >= boundaryIndex;
    const metaItem = invalid
      ? {
          id: `link-${stepIndex}`,
          label: input.copy.whiteboard.linkLabel,
          reason: input.comboState.ok
            ? input.copy.stateInvalid
            : markerForState(input.summary.ref, input.comboState, input.copy).reason,
          status: comboWhiteboardMetaStatuses.unavailable,
          tone: uiToneModes.warning,
        }
      : {
          id: `link-${stepIndex}`,
          label: input.copy.whiteboard.linkLabel,
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.accent,
        };

    return {
      fromStepId: steps[stepIndex - 1]?.id ?? path[stepIndex - 1]?.id ?? `step-${stepIndex}`,
      metaItems: [metaItem],
      toStepId: step.id,
    };
  });

  return {
    boundaryIndex,
    candidates: [],
    contextSummary: input.contextItems.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.value,
    })),
    gaps: [],
    groups: [],
    label: input.copy.howToTitle,
    labels: {
      afterTarget: input.copy.whiteboard.afterTarget,
      appendTarget: input.copy.whiteboard.appendTarget,
      beforeTarget: input.copy.whiteboard.beforeTarget,
      board: input.copy.whiteboard.board,
      cancelPickUp: input.copy.whiteboard.cancelPickUp,
      candidates: input.copy.whiteboard.candidates,
      closeMenu: input.copy.whiteboard.closeMenu,
      closePicker: input.copy.whiteboard.closePicker,
      comboEnd: input.copy.whiteboard.comboEnd,
      comboStart: input.copy.whiteboard.comboStart,
      continuationFromPreviousRow: input.copy.whiteboard.continuationFromPreviousRow,
      continuationToNextRow: input.copy.whiteboard.continuationToNextRow,
      contextSummary: input.copy.whiteboard.contextSummary,
      emptyPath: input.copy.whiteboard.emptyPath,
      groups: input.copy.whiteboard.groups,
      hints: input.copy.whiteboard.hints,
      insertTarget: input.copy.whiteboard.insertTarget,
      invalidBoundary: input.copy.whiteboard.invalidBoundary,
      loadingCandidates: input.copy.whiteboard.loadingCandidates,
      menu: input.copy.whiteboard.menu,
      nextGroup: input.copy.whiteboard.nextGroup,
      noCandidates: input.copy.whiteboard.noCandidates,
      picker: input.copy.whiteboard.picker,
      previousGroup: input.copy.whiteboard.previousGroup,
      reorderTarget: input.copy.whiteboard.reorderTarget,
      replaceTarget: input.copy.whiteboard.replaceTarget,
      runtimeSummary: input.copy.whiteboard.runtimeSummary,
      saving: input.copy.whiteboard.saving,
      useAppendTarget: input.copy.whiteboard.useAppendTarget,
    },
    mode: comboWhiteboardModes.detailReadOnly,
    responsiveFocus: { responsiveMode: input.responsiveMode },
    runtimeSummary: input.summary.metadata
      ? [
          {
            id: "damage",
            label: input.copy.damageLabel,
            value: String(input.summary.metadata.damage ?? "—"),
          },
          {
            id: "meter",
            label: input.copy.meterLabel,
            value: String(input.summary.metadata.meter ?? "—"),
          },
        ]
      : undefined,
    steps,
    transitions,
  };
}

export function createEmptyDetailWhiteboardSource(
  copy: AppCopy["comboDetail"],
  responsiveMode: UiResponsiveMode,
): ComboWhiteboardSource {
  return {
    candidates: [],
    gaps: [],
    groups: [],
    label: copy.howToTitle,
    labels: {
      afterTarget: copy.whiteboard.afterTarget,
      appendTarget: copy.whiteboard.appendTarget,
      beforeTarget: copy.whiteboard.beforeTarget,
      board: copy.whiteboard.board,
      cancelPickUp: copy.whiteboard.cancelPickUp,
      candidates: copy.whiteboard.candidates,
      closeMenu: copy.whiteboard.closeMenu,
      closePicker: copy.whiteboard.closePicker,
      comboEnd: copy.whiteboard.comboEnd,
      comboStart: copy.whiteboard.comboStart,
      continuationFromPreviousRow: copy.whiteboard.continuationFromPreviousRow,
      continuationToNextRow: copy.whiteboard.continuationToNextRow,
      contextSummary: copy.whiteboard.contextSummary,
      emptyPath: copy.whiteboard.emptyPath,
      groups: copy.whiteboard.groups,
      hints: copy.whiteboard.hints,
      insertTarget: copy.whiteboard.insertTarget,
      invalidBoundary: copy.whiteboard.invalidBoundary,
      loadingCandidates: copy.whiteboard.loadingCandidates,
      menu: copy.whiteboard.menu,
      nextGroup: copy.whiteboard.nextGroup,
      noCandidates: copy.whiteboard.noCandidates,
      picker: copy.whiteboard.picker,
      previousGroup: copy.whiteboard.previousGroup,
      reorderTarget: copy.whiteboard.reorderTarget,
      replaceTarget: copy.whiteboard.replaceTarget,
      runtimeSummary: copy.whiteboard.runtimeSummary,
      saving: copy.whiteboard.saving,
      useAppendTarget: copy.whiteboard.useAppendTarget,
    },
    mode: comboWhiteboardModes.detailReadOnly,
    responsiveFocus: { responsiveMode },
    steps: [],
    transitions: [],
  };
}

function createFramePresentation(
  ref: ComboRef,
  moveCount: number,
  copy: AppCopy["comboDetail"],
): Readonly<{
  labels: ComboFrameMeterLabels;
  snapshot: ComboFrameMeterSnapshot;
}> {
  return {
    labels: {
      closeDetails: copy.frame.closeDetails,
      details: copy.frame.details,
      focusMatchingWhiteboardStep: copy.frame.focusMatchingWhiteboardStep,
      lifecycle: {
        [comboFrameMeterLifecycles.pendingTruncate]: copy.frame.lifecyclePending,
        [comboFrameMeterLifecycles.ready]: copy.frame.lifecycleReady,
        [comboFrameMeterLifecycles.repairReview]: copy.frame.lifecycleRepair,
        [comboFrameMeterLifecycles.savingFrozen]: copy.frame.lifecycleSaving,
      },
      scope: copy.frame.scope,
      selectedMove: copy.frame.selectedMove,
      wholeCombo: copy.frame.wholeCombo,
    },
    snapshot: {
      grid: {
        label: copy.frame.unavailableLabel,
        reason: copy.frameDataDescription,
        state: comboFrameMeterGridStates.unavailable,
      },
      id: `${ref.gameId}-${ref.comboId}-frame-data`,
      label: copy.frameDataTitle,
      summary: [
        {
          id: "move-count",
          label: copy.moveCountLabel,
          value: String(moveCount),
        },
      ],
      summaryLabel: copy.frame.summaryLabel,
      timelineLabel: copy.frame.timelineLabel,
    },
  };
}

export const createUnavailableFramePresentation = createFramePresentation;

function localizedMetadataValue(value: string): string {
  return humanizeToken(value);
}

function localizedEntityLabel(label: LocalizedText, id: string, language: LanguageCode): string {
  const resolved = resolveLocalizedText(label, language, "");

  return !resolved || resolved === id ? humanizeToken(id) : resolved;
}

function commonMetadataRows(
  summary: CommonSummary,
  copy: AppCopy["comboDetail"],
): ComboMetadataRow[] {
  const rows: ComboMetadataRow[] = [];
  const metadata = summary.metadata;

  if (metadata?.damage !== undefined) {
    rows.push({
      id: "damage",
      importance: comboMetadataImportances.critical,
      label: copy.damageLabel,
      value: String(metadata.damage),
    });
  }
  if (metadata?.meter !== undefined) {
    rows.push({
      id: "meter",
      label: copy.meterLabel,
      value: String(metadata.meter),
    });
  }
  if (metadata?.position) {
    rows.push({
      id: "position",
      label: copy.positionLabel,
      value: localizedMetadataValue(metadata.position),
    });
  }
  if (metadata?.difficulty) {
    rows.push({
      id: "difficulty",
      label: copy.difficultyLabel,
      value: localizedMetadataValue(metadata.difficulty),
    });
  }
  if (metadata?.starter) {
    rows.push({
      id: "starter",
      importance: comboMetadataImportances.secondary,
      label: copy.starterLabel,
      value: metadata.starter,
    });
  }
  if (metadata?.routeType) {
    rows.push({
      id: "route-type",
      importance: comboMetadataImportances.secondary,
      label: copy.routeTypeLabel,
      value: localizedMetadataValue(metadata.routeType),
    });
  }
  const tags = summary.tags.length > 0 ? summary.tags : (metadata?.tags ?? []);
  if (tags.length > 0) {
    rows.push({
      id: "tags",
      importance: comboMetadataImportances.secondary,
      label: copy.tagsLabel,
      value: tags.map((tag) => copy.tagLabels[tag] ?? humanizeToken(tag)).join(", "),
    });
  }

  return rows;
}

function createReadyState(
  input: CommonFoundInput & Readonly<{ extraRows?: readonly ComboMetadataRow[] }>,
): ComboDetailReady {
  const title = resolveLocalizedText(input.summary.title, input.language, input.copy.title);
  const frame = createFramePresentation(
    input.summary.ref,
    input.summary.cachedNotation.length,
    input.copy,
  );
  const marker = input.comboState.ok
    ? undefined
    : markerForState(input.summary.ref, input.comboState, input.copy);
  const header: Omit<ComboDetailHeaderProps, "onRequestAction"> = {
    actions: [
      {
        available: true,
        id: "return-to-catalog",
        kind: comboDetailHeaderActionKinds.returnToSource,
        label: input.copy.backToCatalog,
      },
    ],
    comboRef: input.summary.ref,
    contextItems: input.contextItems,
    marker,
    sourceLabel: sourceLabel(input.summary.ref, input.copy),
    sourceSurface: "combo-detail",
    title,
  };
  const metadata: ComboMetadataGridProps = {
    label: input.copy.metadataTitle,
    responsiveMode: input.responsiveMode,
    rows: [
      ...commonMetadataRows(input.summary, input.copy),
      ...input.contextItems.map((item) => ({
        ...item,
        importance: comboMetadataImportances.secondary,
      })),
      ...(input.extraRows ?? []),
      {
        id: "source",
        importance: comboMetadataImportances.secondary,
        label: input.copy.sourceLabel,
        value: sourceLabel(input.summary.ref, input.copy),
      },
      {
        id: "game-version",
        importance: comboMetadataImportances.secondary,
        label: input.copy.gameVersionLabel,
        value: input.summary.gameVersion,
      },
    ],
  };

  return {
    description: input.copy.description,
    frameLabels: frame.labels,
    frameSnapshot: frame.snapshot,
    header,
    metadata,
    notes: input.summary.notes
      ? resolveLocalizedText(input.summary.notes, input.language, "") || undefined
      : undefined,
    state: comboDetailPageStates.ready,
    whiteboardSource: createWhiteboardSource(input),
  };
}

function prepareMkxlFound(
  found: MkxlFound,
  language: LanguageCode,
  responsiveMode: UiResponsiveMode,
  copy: AppCopy["comboDetail"],
): ComboDetailReady {
  const summary = found.detail.summary;
  const preparedSummary =
    "combo" in found.detail && found.detail.combo.title === undefined
      ? { ...summary, title: { default: copy.title } }
      : summary;
  const comboState =
    "comboState" in found.detail ? found.detail.comboState : found.detail.summary.comboState;
  const contextItems: ComponentLabelValue[] = [
    {
      id: "character",
      label: copy.characterLabel,
      value: localizedEntityLabel(summary.character.label, summary.character.id, language),
    },
    {
      id: "variation",
      label: copy.variationLabel,
      value: localizedEntityLabel(summary.variation.label, summary.variation.id, language),
    },
  ];
  const extraRows: ComboMetadataRow[] = [];

  if (summary.stage) {
    extraRows.push({
      id: "stage",
      importance: comboMetadataImportances.secondary,
      label: copy.stageLabel,
      value: localizedEntityLabel(summary.stage.label, summary.stage.id, language),
    });
  }
  if (summary.interactables.length > 0) {
    extraRows.push({
      id: "interactables",
      importance: comboMetadataImportances.secondary,
      label: copy.interactablesLabel,
      value: summary.interactables
        .map((item) => localizedEntityLabel(item.label, item.id, language))
        .join(", "),
    });
  }

  return createReadyState({
    comboState,
    contextItems,
    copy,
    extraRows,
    language,
    responsiveMode,
    summary: preparedSummary,
  });
}

function prepareMk1Found(
  found: Mk1Found,
  language: LanguageCode,
  responsiveMode: UiResponsiveMode,
  copy: AppCopy["comboDetail"],
): ComboDetailReady {
  const summary = found.detail.summary;
  const preparedSummary =
    "combo" in found.detail && found.detail.combo.title === undefined
      ? { ...summary, title: { default: copy.title } }
      : summary;
  const comboState =
    "comboState" in found.detail ? found.detail.comboState : found.detail.summary.comboState;

  return createReadyState({
    comboState,
    contextItems: [
      {
        id: "character",
        label: copy.characterLabel,
        value: localizedEntityLabel(summary.character.label, summary.character.id, language),
      },
      {
        id: "kameo",
        label: copy.kameoLabel,
        value: localizedEntityLabel(summary.kameo.label, summary.kameo.id, language),
      },
    ],
    copy,
    language,
    responsiveMode,
    summary: preparedSummary,
  });
}

export function prepareComboDetail(input: {
  business: InstalledGameBusiness;
  copy: AppCopy["comboDetail"];
  language: LanguageCode;
  params: Pick<ComboRef, "comboId" | "source">;
  responsiveMode: UiResponsiveMode;
  slice: unknown;
}): ComboDetailPreparedState {
  const ref = {
    comboId: input.params.comboId,
    gameId: input.business.id,
    source: input.params.source,
  } as const satisfies ComboRef;

  if (input.business.id === "mkxl") {
    const result = input.business.detail.lookup({ ref, slice: input.slice });

    if (!result.ok) {
      return {
        error: loadErrorState(ref, input.copy, result.error.code),
        state: comboDetailPageStates.error,
      };
    }
    switch (result.value.status) {
      case "notFound":
        return {
          error: unavailableState(ref, input.copy, result.value.reason.code ?? ref.comboId),
          state: comboDetailPageStates.notFound,
        };
      case "found":
        return prepareMkxlFound(result.value, input.language, input.responsiveMode, input.copy);
    }

    return result.value satisfies never;
  }

  const result = input.business.detail.lookup({ ref, slice: input.slice });

  if (!result.ok) {
    return {
      error: loadErrorState(ref, input.copy, result.error.code),
      state: comboDetailPageStates.error,
    };
  }
  switch (result.value.status) {
    case "notFound":
      return {
        error: unavailableState(ref, input.copy, result.value.reason.code ?? ref.comboId),
        state: comboDetailPageStates.notFound,
      };
    case "found":
      return prepareMk1Found(result.value, input.language, input.responsiveMode, input.copy);
  }

  return result.value satisfies never;
}

export function prepareUnavailableComboDetail(
  ref: ComboRef,
  copy: AppCopy["comboDetail"],
): ComboDetailPreparedState {
  return {
    error: unavailableState(ref, copy, ref.comboId),
    state: comboDetailPageStates.notFound,
  };
}
