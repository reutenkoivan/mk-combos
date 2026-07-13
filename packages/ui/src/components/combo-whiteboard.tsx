import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";
import {
  type Edge,
  Handle,
  type Node,
  type NodeProps,
  type NodeTypes,
  Position,
  ReactFlow,
} from "@xyflow/react";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { moveFocus as moveFocusInScope } from "../focus-navigation/runtime";
import type { UiFocusDirection, UiFocusNavigationScope } from "../focus-navigation/type";
import { useUiRootContext } from "../internal/ui-root-context";
import { Button } from "../primitives/button";
import { Group } from "../primitives/layout";
import { Badge, StatusMessage } from "../primitives/state";
import { cx } from "../recipes/class-name";
import {
  type ComboWhiteboardTargetState,
  comboWhiteboardTargetKinds,
  comboWhiteboardTargetRecipe,
  comboWhiteboardTargetStates,
} from "../recipes/combo-whiteboard-target";
import type { UiToneMode } from "../tokens/type";
import { uiToneModes } from "../tokens/value";
import { MovePicker } from "./internal/move-picker";
import { SelectableItem } from "./internal/selectable-item";
import { NotationRenderer, notationRendererDensities } from "./notation-renderer";
import type { ComponentInteractionReason, UiResponsiveMode } from "./type";
import { componentInteractionReasons, uiResponsiveModes } from "./value";

export const comboWhiteboardModes = {
  builderEditable: "builderEditable",
  detailReadOnly: "detailReadOnly",
  emptyActive: "emptyActive",
  lockedPreview: "lockedPreview",
  pendingTruncate: "pendingTruncate",
  repairReview: "repairReview",
  savingFrozen: "savingFrozen",
} as const;

export type ComboWhiteboardMode = (typeof comboWhiteboardModes)[keyof typeof comboWhiteboardModes];

export const comboWhiteboardEditOperations = {
  append: "append",
  insert: "insert",
  reorder: "reorder",
  replace: "replace",
} as const;

export type ComboWhiteboardEditOperation =
  (typeof comboWhiteboardEditOperations)[keyof typeof comboWhiteboardEditOperations];

export const comboWhiteboardActions = {
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
} as const;

export type ComboWhiteboardAction =
  (typeof comboWhiteboardActions)[keyof typeof comboWhiteboardActions];

export const comboWhiteboardFocusTargetKinds = {
  candidate: "candidate",
  gap: "gap",
  none: "none",
  step: "step",
} as const;

export type ComboWhiteboardFocusTargetKind =
  (typeof comboWhiteboardFocusTargetKinds)[keyof typeof comboWhiteboardFocusTargetKinds];

export const comboWhiteboardLocalMenuStates = {
  closed: "closed",
  open: "open",
} as const;

export type ComboWhiteboardLocalMenuState =
  (typeof comboWhiteboardLocalMenuStates)[keyof typeof comboWhiteboardLocalMenuStates];

export const comboWhiteboardPickUpStates = {
  idle: "idle",
  pickedUp: "pickedUp",
} as const;

export type ComboWhiteboardPickUpState =
  (typeof comboWhiteboardPickUpStates)[keyof typeof comboWhiteboardPickUpStates];

export const comboWhiteboardMetaStatuses = {
  available: "available",
  unavailable: "unavailable",
} as const;

export type ComboWhiteboardMetaStatus =
  (typeof comboWhiteboardMetaStatuses)[keyof typeof comboWhiteboardMetaStatuses];

export type ComboWhiteboardPreparedAction = {
  available: boolean;
  disabledReason?: string;
  id: string;
  label: string;
};

export type ComboWhiteboardSummary = {
  id: string;
  label: string;
  value: string;
};

type ComboWhiteboardMetaItemBase = {
  id: string;
  label: string;
  tone: UiToneMode;
  value?: string;
};

export type ComboWhiteboardMetaItem =
  | (ComboWhiteboardMetaItemBase & {
      status: typeof comboWhiteboardMetaStatuses.available;
    })
  | (ComboWhiteboardMetaItemBase & {
      reason: string;
      status: typeof comboWhiteboardMetaStatuses.unavailable;
    });

export type ComboWhiteboardStepMetaItems =
  | readonly [ComboWhiteboardMetaItem]
  | readonly [ComboWhiteboardMetaItem, ComboWhiteboardMetaItem]
  | readonly [ComboWhiteboardMetaItem, ComboWhiteboardMetaItem, ComboWhiteboardMetaItem];

export type ComboWhiteboardTransitionMetaItems =
  | readonly [ComboWhiteboardMetaItem]
  | readonly [ComboWhiteboardMetaItem, ComboWhiteboardMetaItem];

type ComboWhiteboardPreparedTarget = {
  accessibleLabel?: string;
  available?: boolean;
  disabledReason?: string;
  focusTargetId?: string;
  id: string;
  label: string;
};

export type ComboWhiteboardStepActions = {
  details?: ComboWhiteboardPreparedAction;
  pickUp?: ComboWhiteboardPreparedAction;
  remove?: ComboWhiteboardPreparedAction;
  replace?: ComboWhiteboardPreparedAction;
  undo?: ComboWhiteboardPreparedAction;
};

export type ComboWhiteboardStep = ComboWhiteboardPreparedTarget & {
  actions?: ComboWhiteboardStepActions;
  metaItems: ComboWhiteboardStepMetaItems;
  notation: readonly (readonly string[])[];
  notationLabel?: string;
};

export type ComboWhiteboardGapActions = {
  drop?: ComboWhiteboardPreparedAction;
  insert?: ComboWhiteboardPreparedAction;
};

export type ComboWhiteboardGap = ComboWhiteboardPreparedTarget & {
  actions?: ComboWhiteboardGapActions;
  index: number;
};

export type ComboWhiteboardCandidate = ComboWhiteboardPreparedTarget & {
  available: boolean;
  detailsAction?: ComboWhiteboardPreparedAction;
  metaItems: ComboWhiteboardStepMetaItems;
  notation: readonly (readonly string[])[];
  notationLabel?: string;
};

export type ComboWhiteboardTransition = {
  fromStepId: string;
  metaItems: ComboWhiteboardTransitionMetaItems;
  toStepId: string;
};

export type ComboWhiteboardGroup = ComboWhiteboardPreparedTarget & {
  candidateIds: readonly string[];
};

export type ComboWhiteboardTruncateConfirmation = {
  cancelAction: ComboWhiteboardPreparedAction;
  confirmAction: ComboWhiteboardPreparedAction;
  id: string;
  message: string;
  reason?: string;
};

export type ComboWhiteboardDetailActions = {
  duplicateSeededCombo?: ComboWhiteboardPreparedAction;
  editCustomCombo?: ComboWhiteboardPreparedAction;
};

export type ComboWhiteboardResponsiveFocusData = {
  navigationScope?: UiFocusNavigationScope;
  responsiveMode: UiResponsiveMode;
};

export type ComboWhiteboardLabels = {
  afterTarget: string;
  appendTarget: string;
  beforeTarget: string;
  board: string;
  cancelPickUp: string;
  candidates: string;
  closeMenu: string;
  closePicker: string;
  comboEnd: string;
  comboStart: string;
  continuationFromPreviousRow: string;
  continuationToNextRow: string;
  contextSummary: string;
  emptyPath: string;
  groups: string;
  hints: readonly string[];
  insertTarget: string;
  invalidBoundary: string;
  loadingCandidates: string;
  menu: string;
  nextGroup: string;
  noCandidates: string;
  picker: string;
  previousGroup: string;
  reorderTarget: string;
  replaceTarget: string;
  runtimeSummary: string;
  saving: string;
  useAppendTarget: string;
};

export type ComboWhiteboardSource = {
  boundaryIndex?: number;
  candidates: readonly ComboWhiteboardCandidate[];
  contextSummary?: readonly ComboWhiteboardSummary[];
  detailActions?: ComboWhiteboardDetailActions;
  disabledReason?: string;
  gaps: readonly ComboWhiteboardGap[];
  groups: readonly ComboWhiteboardGroup[];
  label: string;
  labels: ComboWhiteboardLabels;
  loading?: boolean;
  mode: ComboWhiteboardMode;
  pickerMessage?: string;
  repairAction?: ComboWhiteboardPreparedAction;
  responsiveFocus: ComboWhiteboardResponsiveFocusData;
  runtimeSummary?: readonly ComboWhiteboardSummary[];
  steps: readonly ComboWhiteboardStep[];
  transitions: readonly ComboWhiteboardTransition[];
  truncateConfirmation?: ComboWhiteboardTruncateConfirmation;
};

export type ComboWhiteboardFocusTarget =
  | { kind: typeof comboWhiteboardFocusTargetKinds.none }
  | { candidateId: string; kind: typeof comboWhiteboardFocusTargetKinds.candidate }
  | { gapId: string; kind: typeof comboWhiteboardFocusTargetKinds.gap }
  | { kind: typeof comboWhiteboardFocusTargetKinds.step; stepId: string };

export type ComboWhiteboardMenuTarget =
  | { gapId: string; kind: typeof comboWhiteboardFocusTargetKinds.gap }
  | { kind: typeof comboWhiteboardFocusTargetKinds.step; stepId: string };

export type ComboWhiteboardLocalMenu =
  | { state: typeof comboWhiteboardLocalMenuStates.closed }
  | {
      state: typeof comboWhiteboardLocalMenuStates.open;
      target: ComboWhiteboardMenuTarget;
    };

export type ComboWhiteboardEditTarget =
  | { operation: typeof comboWhiteboardEditOperations.append }
  | { gapId: string; operation: typeof comboWhiteboardEditOperations.insert }
  | { operation: typeof comboWhiteboardEditOperations.replace; stepId: string };

export type ComboWhiteboardPickUp =
  | { state: typeof comboWhiteboardPickUpStates.idle }
  | {
      dropGapId?: string;
      state: typeof comboWhiteboardPickUpStates.pickedUp;
      stepId: string;
    };

type ComboWhiteboardIntentBase = {
  mode: ComboWhiteboardMode;
  reason: ComponentInteractionReason;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export type ComboWhiteboardIntent =
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.cancelPickUp;
      stepId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action:
        | typeof comboWhiteboardActions.cancelTruncate
        | typeof comboWhiteboardActions.confirmTruncate;
      confirmationId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.closeLocalMenu;
      menuTarget?: ComboWhiteboardMenuTarget;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.dropPickedStep;
      gapId: string;
      operation: typeof comboWhiteboardEditOperations.reorder;
      stepId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action:
        | typeof comboWhiteboardActions.duplicateSeededCombo
        | typeof comboWhiteboardActions.editCustomCombo;
      actionId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.focusGap;
      gapId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.focusMoveCandidate;
      candidateId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.focusStep;
      stepId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action:
        | typeof comboWhiteboardActions.moveToNextGroup
        | typeof comboWhiteboardActions.moveToPreviousGroup
        | typeof comboWhiteboardActions.selectMoveGroup;
      groupId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.openCandidateDetails;
      candidateId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.openLocalMenu;
      menuTarget: ComboWhiteboardMenuTarget;
    })
  | (ComboWhiteboardIntentBase & {
      action:
        | typeof comboWhiteboardActions.openStepDetails
        | typeof comboWhiteboardActions.pickUpStep
        | typeof comboWhiteboardActions.removeStep
        | typeof comboWhiteboardActions.undoToStep;
      stepId: string;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.repairFromValidPrefix;
      boundaryIndex: number;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.selectMoveCandidate;
      candidateId: string;
      editTarget: ComboWhiteboardEditTarget;
    })
  | (ComboWhiteboardIntentBase & {
      action: typeof comboWhiteboardActions.setEditTarget;
      editTarget: ComboWhiteboardEditTarget;
    });

export type ComboWhiteboardPresentationOptions = {
  editTarget?: ComboWhiteboardEditTarget;
  focusTarget?: ComboWhiteboardFocusTarget;
  localMenu?: ComboWhiteboardLocalMenu;
  pickUp?: ComboWhiteboardPickUp;
  selectedGroupId?: string;
};

export type UseComboWhiteboardModelOptions = {
  initialPresentation?: ComboWhiteboardPresentationOptions;
  /** Prepared source read on mount; replace it explicitly with `rebasePresentation`. */
  source: ComboWhiteboardSource;
};

type ComboWhiteboardPresentationSnapshot = {
  editTarget: ComboWhiteboardEditTarget;
  focusTarget: ComboWhiteboardFocusTarget;
  localMenu: ComboWhiteboardLocalMenu;
  pickUp: ComboWhiteboardPickUp;
  selectedGroupId?: string;
};

export type ComboWhiteboardModelState = ComboWhiteboardPresentationSnapshot & {
  responsiveMode: UiResponsiveMode;
  visibleCandidateIds: readonly string[];
};

export type ComboWhiteboardModelMethods = {
  cancelPickUp: () => void;
  closeLocalMenu: () => void;
  dropPickedStep: (gapId: string) => void;
  focusGap: (gapId: string) => void;
  focusMoveCandidate: (candidateId: string) => void;
  focusStep: (stepId: string) => void;
  getNextGroupId: () => string | undefined;
  getPreviousGroupId: () => string | undefined;
  moveFocus: (direction: UiFocusDirection) => void;
  moveToNextGroup: () => void;
  moveToPreviousGroup: () => void;
  normalizeIntent: (intent: ComboWhiteboardIntent) => ComboWhiteboardIntent | undefined;
  openLocalMenu: (target: ComboWhiteboardMenuTarget) => void;
  pickUpStep: (stepId: string) => void;
  rebasePresentation: (
    source: ComboWhiteboardSource,
    presentation?: ComboWhiteboardPresentationOptions,
  ) => void;
  resetPresentation: () => void;
  selectGroup: (groupId: string) => void;
  setDropTarget: (gapId?: string) => void;
  setEditTarget: (target: ComboWhiteboardEditTarget) => void;
};

export type ComboWhiteboardModel = {
  methods: ComboWhiteboardModelMethods;
  state: ComboWhiteboardModelState;
};

const noFocusTarget: ComboWhiteboardFocusTarget = {
  kind: comboWhiteboardFocusTargetKinds.none,
};
const closedLocalMenu: ComboWhiteboardLocalMenu = {
  state: comboWhiteboardLocalMenuStates.closed,
};
const appendEditTarget: ComboWhiteboardEditTarget = {
  operation: comboWhiteboardEditOperations.append,
};
const idlePickUp: ComboWhiteboardPickUp = { state: comboWhiteboardPickUpStates.idle };

const focusTargetsEqual = (
  first: ComboWhiteboardFocusTarget,
  second: ComboWhiteboardFocusTarget,
) => {
  if (first.kind !== second.kind) return false;
  switch (first.kind) {
    case comboWhiteboardFocusTargetKinds.candidate:
      return (
        second.kind === comboWhiteboardFocusTargetKinds.candidate &&
        first.candidateId === second.candidateId
      );
    case comboWhiteboardFocusTargetKinds.gap:
      return second.kind === comboWhiteboardFocusTargetKinds.gap && first.gapId === second.gapId;
    case comboWhiteboardFocusTargetKinds.step:
      return second.kind === comboWhiteboardFocusTargetKinds.step && first.stepId === second.stepId;
    case comboWhiteboardFocusTargetKinds.none:
      return second.kind === comboWhiteboardFocusTargetKinds.none;
  }
};

const menuTargetsEqual = (first: ComboWhiteboardMenuTarget, second: ComboWhiteboardMenuTarget) =>
  first.kind === comboWhiteboardFocusTargetKinds.step
    ? second.kind === comboWhiteboardFocusTargetKinds.step && first.stepId === second.stepId
    : second.kind === comboWhiteboardFocusTargetKinds.gap && first.gapId === second.gapId;

const localMenusEqual = (first: ComboWhiteboardLocalMenu, second: ComboWhiteboardLocalMenu) =>
  first.state === comboWhiteboardLocalMenuStates.closed
    ? second.state === comboWhiteboardLocalMenuStates.closed
    : second.state === comboWhiteboardLocalMenuStates.open &&
      menuTargetsEqual(first.target, second.target);

const editTargetsEqual = (first: ComboWhiteboardEditTarget, second: ComboWhiteboardEditTarget) => {
  if (first.operation !== second.operation) return false;
  switch (first.operation) {
    case comboWhiteboardEditOperations.append:
      return second.operation === comboWhiteboardEditOperations.append;
    case comboWhiteboardEditOperations.insert:
      return (
        second.operation === comboWhiteboardEditOperations.insert && first.gapId === second.gapId
      );
    case comboWhiteboardEditOperations.replace:
      return (
        second.operation === comboWhiteboardEditOperations.replace && first.stepId === second.stepId
      );
  }
};

const pickUpsEqual = (first: ComboWhiteboardPickUp, second: ComboWhiteboardPickUp) =>
  first.state === comboWhiteboardPickUpStates.idle
    ? second.state === comboWhiteboardPickUpStates.idle
    : second.state === comboWhiteboardPickUpStates.pickedUp &&
      first.stepId === second.stepId &&
      first.dropGapId === second.dropGapId;

const presentationsEqual = (
  first: ComboWhiteboardPresentationSnapshot,
  second: ComboWhiteboardPresentationSnapshot,
) =>
  first.selectedGroupId === second.selectedGroupId &&
  focusTargetsEqual(first.focusTarget, second.focusTarget) &&
  editTargetsEqual(first.editTarget, second.editTarget) &&
  localMenusEqual(first.localMenu, second.localMenu) &&
  pickUpsEqual(first.pickUp, second.pickUp);

const hasStep = (source: ComboWhiteboardSource, stepId: string) =>
  source.steps.some((step) => step.id === stepId);
const findStep = (source: ComboWhiteboardSource, stepId: string) =>
  source.steps.find((step) => step.id === stepId);
const hasGap = (source: ComboWhiteboardSource, gapId: string) =>
  source.gaps.some((gap) => gap.id === gapId);
const findGap = (source: ComboWhiteboardSource, gapId: string) =>
  source.gaps.find((gap) => gap.id === gapId);
const findCandidate = (source: ComboWhiteboardSource, candidateId: string) =>
  source.candidates.find((candidate) => candidate.id === candidateId);
const hasGroup = (source: ComboWhiteboardSource, groupId: string) =>
  source.groups.some((group) => group.id === groupId && group.available !== false);
const supportsMovePicker = (mode: ComboWhiteboardMode) =>
  mode !== comboWhiteboardModes.detailReadOnly && mode !== comboWhiteboardModes.lockedPreview;
const supportsBuilderEditing = (mode: ComboWhiteboardMode) =>
  mode === comboWhiteboardModes.builderEditable || mode === comboWhiteboardModes.emptyActive;
const canRequestBuilderEdit = (source: ComboWhiteboardSource) =>
  supportsBuilderEditing(source.mode) && !source.disabledReason && !source.loading;

const isIntentAllowedForMode = (source: ComboWhiteboardSource, intent: ComboWhiteboardIntent) => {
  if (source.mode === comboWhiteboardModes.savingFrozen) return false;

  switch (intent.action) {
    case comboWhiteboardActions.focusGap:
    case comboWhiteboardActions.focusStep:
    case comboWhiteboardActions.openLocalMenu:
    case comboWhiteboardActions.closeLocalMenu:
    case comboWhiteboardActions.openStepDetails:
      return true;
    case comboWhiteboardActions.focusMoveCandidate:
    case comboWhiteboardActions.openCandidateDetails:
    case comboWhiteboardActions.selectMoveCandidate:
    case comboWhiteboardActions.moveToNextGroup:
    case comboWhiteboardActions.moveToPreviousGroup:
    case comboWhiteboardActions.selectMoveGroup:
    case comboWhiteboardActions.setEditTarget:
    case comboWhiteboardActions.pickUpStep:
    case comboWhiteboardActions.cancelPickUp:
    case comboWhiteboardActions.dropPickedStep:
    case comboWhiteboardActions.removeStep:
    case comboWhiteboardActions.undoToStep:
      return canRequestBuilderEdit(source);
    case comboWhiteboardActions.confirmTruncate:
    case comboWhiteboardActions.cancelTruncate:
      return source.mode === comboWhiteboardModes.pendingTruncate;
    case comboWhiteboardActions.repairFromValidPrefix:
      return source.mode === comboWhiteboardModes.repairReview;
    case comboWhiteboardActions.duplicateSeededCombo:
    case comboWhiteboardActions.editCustomCombo:
      return source.mode === comboWhiteboardModes.detailReadOnly;
  }
};

const normalizeFocusTarget = (
  source: ComboWhiteboardSource,
  target: ComboWhiteboardFocusTarget | undefined,
): ComboWhiteboardFocusTarget => {
  if (!target) {
    return noFocusTarget;
  }

  switch (target.kind) {
    case comboWhiteboardFocusTargetKinds.candidate:
      return findCandidate(source, target.candidateId)?.available ? target : noFocusTarget;
    case comboWhiteboardFocusTargetKinds.gap:
      return hasGap(source, target.gapId) ? target : noFocusTarget;
    case comboWhiteboardFocusTargetKinds.step:
      return hasStep(source, target.stepId) ? target : noFocusTarget;
    case comboWhiteboardFocusTargetKinds.none:
      return target;
  }
};

const normalizeEditTarget = (
  source: ComboWhiteboardSource,
  target: ComboWhiteboardEditTarget | undefined,
): ComboWhiteboardEditTarget => {
  if (!target) {
    return appendEditTarget;
  }

  switch (target.operation) {
    case comboWhiteboardEditOperations.append:
      return target;
    case comboWhiteboardEditOperations.insert:
      return findGap(source, target.gapId)?.actions?.insert?.available === true
        ? target
        : appendEditTarget;
    case comboWhiteboardEditOperations.replace:
      return findStep(source, target.stepId)?.actions?.replace?.available === true
        ? target
        : appendEditTarget;
  }
};

const isEditTargetAvailable = (
  source: ComboWhiteboardSource,
  target: ComboWhiteboardEditTarget,
) => {
  switch (target.operation) {
    case comboWhiteboardEditOperations.append:
      return true;
    case comboWhiteboardEditOperations.insert:
      return findGap(source, target.gapId)?.actions?.insert?.available === true;
    case comboWhiteboardEditOperations.replace:
      return findStep(source, target.stepId)?.actions?.replace?.available === true;
  }
};

const isMenuTargetAvailable = (
  source: ComboWhiteboardSource,
  target: ComboWhiteboardMenuTarget,
) => {
  const targetModel =
    target.kind === comboWhiteboardFocusTargetKinds.step
      ? findStep(source, target.stepId)
      : findGap(source, target.gapId);
  return Boolean(targetModel && targetModel.available !== false);
};

const normalizeMenu = (
  source: ComboWhiteboardSource,
  menu: ComboWhiteboardLocalMenu | undefined,
): ComboWhiteboardLocalMenu => {
  if (!menu || menu.state === comboWhiteboardLocalMenuStates.closed) {
    return closedLocalMenu;
  }

  return isMenuTargetAvailable(source, menu.target) ? menu : closedLocalMenu;
};

const normalizePickUp = (
  source: ComboWhiteboardSource,
  pickUp: ComboWhiteboardPickUp | undefined,
): ComboWhiteboardPickUp => {
  if (!pickUp || pickUp.state === comboWhiteboardPickUpStates.idle) {
    return idlePickUp;
  }
  if (findStep(source, pickUp.stepId)?.actions?.pickUp?.available !== true) {
    return idlePickUp;
  }

  return pickUp.dropGapId && findGap(source, pickUp.dropGapId)?.actions?.drop?.available !== true
    ? { state: comboWhiteboardPickUpStates.pickedUp, stepId: pickUp.stepId }
    : pickUp;
};

const firstAvailableGroupId = (source: ComboWhiteboardSource) =>
  source.groups.find((group) => group.available !== false)?.id;

const normalizePresentation = (
  source: ComboWhiteboardSource,
  presentation: ComboWhiteboardPresentationOptions | ComboWhiteboardPresentationSnapshot,
): ComboWhiteboardPresentationSnapshot => {
  const selectedGroupId =
    presentation.selectedGroupId && hasGroup(source, presentation.selectedGroupId)
      ? presentation.selectedGroupId
      : firstAvailableGroupId(source);
  const candidateGroup = selectedGroupId
    ? source.groups.find((group) => group.id === selectedGroupId)
    : undefined;
  const requestedFocusTarget = normalizeFocusTarget(source, presentation.focusTarget);
  const focusTarget =
    requestedFocusTarget.kind === comboWhiteboardFocusTargetKinds.candidate &&
    candidateGroup &&
    !candidateGroup.candidateIds.includes(requestedFocusTarget.candidateId)
      ? noFocusTarget
      : requestedFocusTarget;

  return {
    editTarget: normalizeEditTarget(source, presentation.editTarget),
    focusTarget,
    localMenu: normalizeMenu(source, presentation.localMenu),
    pickUp: normalizePickUp(source, presentation.pickUp),
    selectedGroupId,
  };
};

const createSafePresentation = (
  source: ComboWhiteboardSource,
  presentation: ComboWhiteboardPresentationOptions = {},
): ComboWhiteboardPresentationSnapshot =>
  normalizePresentation(source, {
    editTarget: presentation.editTarget ?? appendEditTarget,
    focusTarget: presentation.focusTarget ?? noFocusTarget,
    localMenu: presentation.localMenu ?? closedLocalMenu,
    pickUp: presentation.pickUp ?? idlePickUp,
    selectedGroupId: presentation.selectedGroupId,
  });

const getVisibleCandidateIds = (
  source: ComboWhiteboardSource,
  selectedGroupId: string | undefined,
) => {
  const candidateIds = new Set(source.candidates.map((candidate) => candidate.id));
  if (!selectedGroupId) {
    return source.candidates.map((candidate) => candidate.id);
  }

  const group = source.groups.find((candidateGroup) => candidateGroup.id === selectedGroupId);
  return group?.candidateIds.filter((candidateId) => candidateIds.has(candidateId)) ?? [];
};

const isCandidateVisible = (
  source: ComboWhiteboardSource,
  selectedGroupId: string | undefined,
  candidateId: string,
) => {
  if (!findCandidate(source, candidateId)) return false;
  if (!selectedGroupId) return true;
  return Boolean(
    source.groups.find((group) => group.id === selectedGroupId)?.candidateIds.includes(candidateId),
  );
};

const getFocusTargetId = (source: ComboWhiteboardSource, target: ComboWhiteboardFocusTarget) => {
  switch (target.kind) {
    case comboWhiteboardFocusTargetKinds.candidate:
      return (
        findCandidate(source, target.candidateId)?.focusTargetId ??
        `combo-candidate-${target.candidateId}`
      );
    case comboWhiteboardFocusTargetKinds.gap:
      return (
        source.gaps.find((gap) => gap.id === target.gapId)?.focusTargetId ??
        `combo-gap-${target.gapId}`
      );
    case comboWhiteboardFocusTargetKinds.step:
      return (
        source.steps.find((step) => step.id === target.stepId)?.focusTargetId ??
        `combo-step-${target.stepId}`
      );
    case comboWhiteboardFocusTargetKinds.none:
      return undefined;
  }
};

const buildFocusTargetIndex = (source: ComboWhiteboardSource) => {
  const targets = new Map<string, ComboWhiteboardFocusTarget>();
  for (const step of source.steps) {
    targets.set(step.focusTargetId ?? `combo-step-${step.id}`, {
      kind: comboWhiteboardFocusTargetKinds.step,
      stepId: step.id,
    });
  }
  for (const gap of source.gaps) {
    targets.set(gap.focusTargetId ?? `combo-gap-${gap.id}`, {
      gapId: gap.id,
      kind: comboWhiteboardFocusTargetKinds.gap,
    });
  }
  for (const candidate of source.candidates) {
    targets.set(candidate.focusTargetId ?? `combo-candidate-${candidate.id}`, {
      candidateId: candidate.id,
      kind: comboWhiteboardFocusTargetKinds.candidate,
    });
  }
  return targets;
};

const getAdjacentGroupId = (
  source: ComboWhiteboardSource,
  selectedGroupId: string | undefined,
  offset: number,
) => {
  const groups = source.groups.filter((group) => group.available !== false);
  if (groups.length < 2) {
    return undefined;
  }
  const selectedIndex = groups.findIndex((group) => group.id === selectedGroupId);
  const currentIndex = selectedIndex < 0 ? 0 : selectedIndex;
  return groups[(currentIndex + offset + groups.length) % groups.length]?.id;
};

/** Owns only Whiteboard presentation state; domain-path changes remain page-owned. */
export function useComboWhiteboardModel(
  options: UseComboWhiteboardModelOptions,
): ComboWhiteboardModel {
  const [source, setPresentationSource] = useState(options.source);
  const [snapshot, setSnapshot] = useState<ComboWhiteboardPresentationSnapshot>(() =>
    createSafePresentation(source, options.initialPresentation),
  );
  const normalizedSnapshot = useMemo(
    () => normalizePresentation(source, snapshot),
    [snapshot, source],
  );
  const focusTargetsById = useMemo(() => buildFocusTargetIndex(source), [source]);
  const visibleCandidateIds = useMemo(
    () => getVisibleCandidateIds(source, normalizedSnapshot.selectedGroupId),
    [normalizedSnapshot.selectedGroupId, source],
  );

  const updatePresentation = useCallback(
    (
      update: (current: ComboWhiteboardPresentationSnapshot) => ComboWhiteboardPresentationSnapshot,
    ) => {
      setSnapshot((current) => {
        const normalizedCurrent = normalizePresentation(source, current);
        const next = normalizePresentation(source, update(normalizedCurrent));
        return presentationsEqual(current, next) ? current : next;
      });
    },
    [source],
  );
  const focusStep = useCallback(
    (stepId: string) => {
      if (source.mode === comboWhiteboardModes.savingFrozen || !hasStep(source, stepId)) {
        return;
      }
      updatePresentation((current) => ({
        ...current,
        focusTarget: { kind: comboWhiteboardFocusTargetKinds.step, stepId },
      }));
    },
    [source, updatePresentation],
  );
  const focusGap = useCallback(
    (gapId: string) => {
      if (source.mode === comboWhiteboardModes.savingFrozen || !hasGap(source, gapId)) {
        return;
      }
      updatePresentation((current) => ({
        ...current,
        focusTarget: { gapId, kind: comboWhiteboardFocusTargetKinds.gap },
      }));
    },
    [source, updatePresentation],
  );
  const focusMoveCandidate = useCallback(
    (candidateId: string) => {
      const candidate = findCandidate(source, candidateId);
      if (
        !canRequestBuilderEdit(source) ||
        !candidate?.available ||
        !isCandidateVisible(source, normalizedSnapshot.selectedGroupId, candidateId)
      ) {
        return;
      }
      updatePresentation((current) => ({
        ...current,
        focusTarget: { candidateId, kind: comboWhiteboardFocusTargetKinds.candidate },
      }));
    },
    [normalizedSnapshot.selectedGroupId, source, updatePresentation],
  );
  const setEditTarget = useCallback(
    (target: ComboWhiteboardEditTarget) => {
      if (!canRequestBuilderEdit(source)) return;
      const normalizedTarget = normalizeEditTarget(source, target);
      if (!isEditTargetAvailable(source, normalizedTarget)) return;
      updatePresentation((current) => ({
        ...current,
        editTarget: normalizedTarget,
        localMenu: closedLocalMenu,
      }));
    },
    [source, updatePresentation],
  );
  const openLocalMenu = useCallback(
    (target: ComboWhiteboardMenuTarget) => {
      if (
        source.mode === comboWhiteboardModes.savingFrozen ||
        !isMenuTargetAvailable(source, target)
      ) {
        return;
      }
      const menu = normalizeMenu(source, {
        state: comboWhiteboardLocalMenuStates.open,
        target,
      });
      if (menu.state === comboWhiteboardLocalMenuStates.closed) {
        return;
      }
      updatePresentation((current) => ({
        ...current,
        focusTarget:
          target.kind === comboWhiteboardFocusTargetKinds.step
            ? { kind: comboWhiteboardFocusTargetKinds.step, stepId: target.stepId }
            : { gapId: target.gapId, kind: comboWhiteboardFocusTargetKinds.gap },
        localMenu: menu,
      }));
    },
    [source, updatePresentation],
  );
  const closeLocalMenu = useCallback(() => {
    if (source.mode === comboWhiteboardModes.savingFrozen) return;
    updatePresentation((current) => ({ ...current, localMenu: closedLocalMenu }));
  }, [source.mode, updatePresentation]);
  const pickUpStep = useCallback(
    (stepId: string) => {
      if (
        !canRequestBuilderEdit(source) ||
        findStep(source, stepId)?.actions?.pickUp?.available !== true
      ) {
        return;
      }
      updatePresentation((current) =>
        current.pickUp.state === comboWhiteboardPickUpStates.pickedUp &&
        current.pickUp.stepId === stepId
          ? current
          : {
              ...current,
              localMenu: closedLocalMenu,
              pickUp: { state: comboWhiteboardPickUpStates.pickedUp, stepId },
            },
      );
    },
    [source, updatePresentation],
  );
  const setDropTarget = useCallback(
    (gapId?: string) => {
      if (!canRequestBuilderEdit(source)) return;
      updatePresentation((current) =>
        current.pickUp.state === comboWhiteboardPickUpStates.pickedUp
          ? {
              ...current,
              pickUp: {
                dropGapId:
                  gapId && findGap(source, gapId)?.actions?.drop?.available === true
                    ? gapId
                    : undefined,
                state: comboWhiteboardPickUpStates.pickedUp,
                stepId: current.pickUp.stepId,
              },
            }
          : current,
      );
    },
    [source, updatePresentation],
  );
  const cancelPickUp = useCallback(() => {
    if (!canRequestBuilderEdit(source)) return;
    updatePresentation((current) => ({ ...current, pickUp: idlePickUp }));
  }, [source, updatePresentation]);
  const dropPickedStep = useCallback(
    (gapId: string) => {
      if (
        !canRequestBuilderEdit(source) ||
        findGap(source, gapId)?.actions?.drop?.available !== true
      ) {
        return;
      }
      updatePresentation((current) =>
        current.pickUp.state === comboWhiteboardPickUpStates.pickedUp
          ? {
              ...current,
              focusTarget: { gapId, kind: comboWhiteboardFocusTargetKinds.gap },
              pickUp: idlePickUp,
            }
          : current,
      );
    },
    [source, updatePresentation],
  );
  const selectGroup = useCallback(
    (groupId: string) => {
      if (!canRequestBuilderEdit(source) || !hasGroup(source, groupId)) {
        return;
      }
      updatePresentation((current) =>
        current.selectedGroupId === groupId
          ? current
          : {
              ...current,
              focusTarget:
                current.focusTarget.kind === comboWhiteboardFocusTargetKinds.candidate
                  ? noFocusTarget
                  : current.focusTarget,
              selectedGroupId: groupId,
            },
      );
    },
    [source, updatePresentation],
  );
  const getNextGroupId = useCallback(
    () => getAdjacentGroupId(source, normalizedSnapshot.selectedGroupId, 1),
    [normalizedSnapshot.selectedGroupId, source],
  );
  const getPreviousGroupId = useCallback(
    () => getAdjacentGroupId(source, normalizedSnapshot.selectedGroupId, -1),
    [normalizedSnapshot.selectedGroupId, source],
  );
  const moveToNextGroup = useCallback(() => {
    const groupId = getNextGroupId();
    if (groupId) {
      selectGroup(groupId);
    }
  }, [getNextGroupId, selectGroup]);
  const moveToPreviousGroup = useCallback(() => {
    const groupId = getPreviousGroupId();
    if (groupId) {
      selectGroup(groupId);
    }
  }, [getPreviousGroupId, selectGroup]);
  const moveFocus = useCallback(
    (direction: UiFocusDirection) => {
      if (source.mode === comboWhiteboardModes.savingFrozen) return;
      const scope = source.responsiveFocus.navigationScope;
      if (!scope) {
        return;
      }
      const currentTargetId = getFocusTargetId(source, normalizedSnapshot.focusTarget);
      const nextTargetId = moveFocusInScope(scope, currentTargetId, direction);
      const nextTarget = nextTargetId ? focusTargetsById.get(nextTargetId) : undefined;
      if (nextTarget) {
        updatePresentation((current) => ({ ...current, focusTarget: nextTarget }));
      }
    },
    [focusTargetsById, normalizedSnapshot.focusTarget, source, updatePresentation],
  );
  const resetPresentation = useCallback(() => {
    setSnapshot((current) => {
      const next = createSafePresentation(source);
      return presentationsEqual(current, next) ? current : next;
    });
  }, [source]);
  const rebasePresentation = useCallback(
    (nextSource: ComboWhiteboardSource, presentation: ComboWhiteboardPresentationOptions = {}) => {
      setPresentationSource((current) => (current === nextSource ? current : nextSource));
      setSnapshot((current) => {
        const next = createSafePresentation(nextSource, presentation);
        return presentationsEqual(current, next) ? current : next;
      });
    },
    [],
  );

  const normalizeIntent = useCallback(
    (intent: ComboWhiteboardIntent): ComboWhiteboardIntent | undefined => {
      if (!isIntentAllowedForMode(source, intent)) {
        return undefined;
      }
      switch (intent.action) {
        case comboWhiteboardActions.focusStep:
          if (!hasStep(source, intent.stepId)) return undefined;
          focusStep(intent.stepId);
          return intent;
        case comboWhiteboardActions.focusGap:
          if (!hasGap(source, intent.gapId)) return undefined;
          focusGap(intent.gapId);
          return intent;
        case comboWhiteboardActions.focusMoveCandidate:
          if (
            !supportsMovePicker(source.mode) ||
            !findCandidate(source, intent.candidateId)?.available ||
            !isCandidateVisible(source, normalizedSnapshot.selectedGroupId, intent.candidateId)
          ) {
            return undefined;
          }
          focusMoveCandidate(intent.candidateId);
          return intent;
        case comboWhiteboardActions.openLocalMenu:
          if (!isMenuTargetAvailable(source, intent.menuTarget)) {
            return undefined;
          }
          openLocalMenu(intent.menuTarget);
          return intent;
        case comboWhiteboardActions.closeLocalMenu:
          closeLocalMenu();
          return intent;
        case comboWhiteboardActions.setEditTarget: {
          if (!canRequestBuilderEdit(source)) return undefined;
          const editTarget = normalizeEditTarget(source, intent.editTarget);
          if (
            editTarget.operation !== intent.editTarget.operation ||
            !isEditTargetAvailable(source, editTarget)
          ) {
            return undefined;
          }
          setEditTarget(editTarget);
          return intent;
        }
        case comboWhiteboardActions.selectMoveCandidate: {
          if (!canRequestBuilderEdit(source)) return undefined;
          const candidate = findCandidate(source, intent.candidateId);
          const editTarget = normalizeEditTarget(source, intent.editTarget);
          if (
            !candidate?.available ||
            !isCandidateVisible(source, normalizedSnapshot.selectedGroupId, intent.candidateId) ||
            editTarget.operation !== intent.editTarget.operation ||
            !isEditTargetAvailable(source, editTarget)
          ) {
            return undefined;
          }
          return intent;
        }
        case comboWhiteboardActions.moveToNextGroup:
          if (
            !canRequestBuilderEdit(source) ||
            getAdjacentGroupId(source, normalizedSnapshot.selectedGroupId, 1) !== intent.groupId
          ) {
            return undefined;
          }
          selectGroup(intent.groupId);
          return intent;
        case comboWhiteboardActions.moveToPreviousGroup:
          if (
            !canRequestBuilderEdit(source) ||
            getAdjacentGroupId(source, normalizedSnapshot.selectedGroupId, -1) !== intent.groupId
          ) {
            return undefined;
          }
          selectGroup(intent.groupId);
          return intent;
        case comboWhiteboardActions.selectMoveGroup:
          if (!canRequestBuilderEdit(source) || !hasGroup(source, intent.groupId)) return undefined;
          selectGroup(intent.groupId);
          return intent;
        case comboWhiteboardActions.pickUpStep:
          if (
            !canRequestBuilderEdit(source) ||
            findStep(source, intent.stepId)?.actions?.pickUp?.available !== true
          ) {
            return undefined;
          }
          pickUpStep(intent.stepId);
          return intent;
        case comboWhiteboardActions.cancelPickUp:
          if (
            normalizedSnapshot.pickUp.state !== comboWhiteboardPickUpStates.pickedUp ||
            normalizedSnapshot.pickUp.stepId !== intent.stepId
          ) {
            return undefined;
          }
          cancelPickUp();
          return intent;
        case comboWhiteboardActions.dropPickedStep:
          if (
            !canRequestBuilderEdit(source) ||
            normalizedSnapshot.pickUp.state !== comboWhiteboardPickUpStates.pickedUp ||
            normalizedSnapshot.pickUp.stepId !== intent.stepId ||
            findGap(source, intent.gapId)?.actions?.drop?.available !== true
          ) {
            return undefined;
          }
          dropPickedStep(intent.gapId);
          return intent;
        case comboWhiteboardActions.openCandidateDetails:
          return supportsMovePicker(source.mode) &&
            findCandidate(source, intent.candidateId)?.detailsAction?.available === true
            ? intent
            : undefined;
        case comboWhiteboardActions.openStepDetails:
          return findStep(source, intent.stepId)?.actions?.details?.available === true
            ? intent
            : undefined;
        case comboWhiteboardActions.removeStep:
          return canRequestBuilderEdit(source) &&
            findStep(source, intent.stepId)?.actions?.remove?.available === true
            ? intent
            : undefined;
        case comboWhiteboardActions.undoToStep:
          return canRequestBuilderEdit(source) &&
            findStep(source, intent.stepId)?.actions?.undo?.available === true
            ? intent
            : undefined;
        case comboWhiteboardActions.confirmTruncate:
          return source.truncateConfirmation?.id === intent.confirmationId &&
            source.truncateConfirmation.confirmAction.available
            ? intent
            : undefined;
        case comboWhiteboardActions.cancelTruncate:
          return source.truncateConfirmation?.id === intent.confirmationId &&
            source.truncateConfirmation.cancelAction.available
            ? intent
            : undefined;
        case comboWhiteboardActions.repairFromValidPrefix:
          return source.boundaryIndex === intent.boundaryIndex && source.repairAction?.available
            ? intent
            : undefined;
        case comboWhiteboardActions.duplicateSeededCombo:
          return source.mode === comboWhiteboardModes.detailReadOnly &&
            source.detailActions?.duplicateSeededCombo?.id === intent.actionId &&
            source.detailActions.duplicateSeededCombo.available
            ? intent
            : undefined;
        case comboWhiteboardActions.editCustomCombo:
          return source.mode === comboWhiteboardModes.detailReadOnly &&
            source.detailActions?.editCustomCombo?.id === intent.actionId &&
            source.detailActions.editCustomCombo.available
            ? intent
            : undefined;
      }
    },
    [
      cancelPickUp,
      closeLocalMenu,
      dropPickedStep,
      focusGap,
      focusMoveCandidate,
      focusStep,
      normalizedSnapshot.pickUp,
      normalizedSnapshot.selectedGroupId,
      openLocalMenu,
      pickUpStep,
      selectGroup,
      setEditTarget,
      source,
    ],
  );

  const state = useMemo<ComboWhiteboardModelState>(
    () => ({
      ...normalizedSnapshot,
      responsiveMode: source.responsiveFocus.responsiveMode,
      visibleCandidateIds,
    }),
    [normalizedSnapshot, source.responsiveFocus.responsiveMode, visibleCandidateIds],
  );
  const methods = useMemo<ComboWhiteboardModelMethods>(
    () => ({
      cancelPickUp,
      closeLocalMenu,
      dropPickedStep,
      focusGap,
      focusMoveCandidate,
      focusStep,
      getNextGroupId,
      getPreviousGroupId,
      moveFocus,
      moveToNextGroup,
      moveToPreviousGroup,
      normalizeIntent,
      openLocalMenu,
      pickUpStep,
      rebasePresentation,
      resetPresentation,
      selectGroup,
      setDropTarget,
      setEditTarget,
    }),
    [
      cancelPickUp,
      closeLocalMenu,
      dropPickedStep,
      focusGap,
      focusMoveCandidate,
      focusStep,
      getNextGroupId,
      getPreviousGroupId,
      moveFocus,
      moveToNextGroup,
      moveToPreviousGroup,
      normalizeIntent,
      openLocalMenu,
      pickUpStep,
      rebasePresentation,
      resetPresentation,
      selectGroup,
      setDropTarget,
      setEditTarget,
    ],
  );

  return useMemo(() => ({ methods, state }), [methods, state]);
}

type WhiteboardStepNodeData = Record<string, unknown> & {
  busy: boolean;
  continuesToNextRow: boolean;
  continuationLabel: string;
  controlRef: (element: HTMLButtonElement | null) => void;
  disabled: boolean;
  focused: boolean;
  focusTargetId: string;
  invalid: boolean;
  onFocus: () => void;
  onOpenMenu: () => void;
  pickedUp: boolean;
  positionLabel: string;
  state: ComboWhiteboardTargetState;
  step: ComboWhiteboardStep;
  notationDisplayMode: NotationDisplayMode;
};

type WhiteboardConnectorNodeData = Record<string, unknown> & {
  boundary: boolean;
  boundaryLabel: string;
  busy: boolean;
  controlRef: (element: HTMLButtonElement | null) => void;
  disabled: boolean;
  focused: boolean;
  focusTargetId?: string;
  gap?: ComboWhiteboardGap;
  onFocus: () => void;
  onOpenMenu: () => void;
  pickupActive: boolean;
  state: ComboWhiteboardTargetState;
};

type WhiteboardTransitionNodeData = Record<string, unknown> & {
  continuesFromPreviousRow: boolean;
  continuationLabel: string;
  transition?: ComboWhiteboardTransition;
};

const comboWhiteboardFlowNodeTypes = {
  connector: "comboConnector",
  step: "comboStep",
  transition: "comboTransition",
} as const;

type WhiteboardStepNode = Node<WhiteboardStepNodeData, typeof comboWhiteboardFlowNodeTypes.step>;
type WhiteboardConnectorNode = Node<
  WhiteboardConnectorNodeData,
  typeof comboWhiteboardFlowNodeTypes.connector
>;
type WhiteboardTransitionNode = Node<
  WhiteboardTransitionNodeData,
  typeof comboWhiteboardFlowNodeTypes.transition
>;
type WhiteboardNode = WhiteboardStepNode | WhiteboardConnectorNode | WhiteboardTransitionNode;

const hiddenHandleClassName = "pointer-events-none opacity-0";

function WhiteboardMetaBadge(props: { item: ComboWhiteboardMetaItem }) {
  const reason = "reason" in props.item ? props.item.reason : undefined;

  return (
    <Badge
      className={cx(
        "h-auto min-h-5.5 max-w-full items-start gap-1 break-words py-1 text-start leading-tight",
        reason && "border-dashed",
      )}
      data-meta-status={props.item.status}
      tone={props.item.tone}
    >
      {reason && (
        <span aria-hidden="true" className="font-black">
          ?
        </span>
      )}
      <span className="font-semibold">{props.item.label}</span>
      {props.item.value && <span>{props.item.value}</span>}
      {reason && <span>{reason}</span>}
    </Badge>
  );
}

WhiteboardMetaBadge.displayName = "WhiteboardMetaBadge";

function WhiteboardMetaList(props: {
  className?: string;
  items: readonly ComboWhiteboardMetaItem[];
}) {
  return (
    <span className={cx("flex min-w-0 flex-wrap gap-1", props.className)}>
      {props.items.map((item) => (
        <WhiteboardMetaBadge item={item} key={item.id} />
      ))}
    </span>
  );
}

WhiteboardMetaList.displayName = "WhiteboardMetaList";

function WhiteboardStepNodeView(props: NodeProps<WhiteboardStepNode>) {
  const { data } = props;
  const accessibleLabelParts = [
    data.step.accessibleLabel ?? `${data.positionLabel}. ${data.step.label}`,
  ];
  if (data.step.disabledReason) accessibleLabelParts.push(data.step.disabledReason);
  for (const item of data.step.metaItems) {
    if ("reason" in item) accessibleLabelParts.push(`${item.label}: ${item.reason}`);
  }

  return (
    <div
      className={comboWhiteboardTargetRecipe({
        focused: data.focused,
        invalid: data.invalid,
        kind: comboWhiteboardTargetKinds.step,
        pickedUp: data.pickedUp,
        state: data.state,
      })}
      data-controller-focused={data.focused ? "true" : undefined}
      data-focused={data.focused ? "true" : undefined}
      data-invalid={data.invalid ? "true" : undefined}
      data-picked-up={data.pickedUp ? "true" : undefined}
      data-ui-combo-whiteboard-step={data.step.id}
      data-ui-focus-target={data.focusTargetId}
    >
      <Handle
        aria-hidden="true"
        className={hiddenHandleClassName}
        isConnectable={false}
        position={Position.Left}
        type="target"
      />
      <SelectableItem
        accessibleLabel={accessibleLabelParts.join(". ")}
        busy={data.busy}
        className="nodrag nopan h-full min-h-11 grid-cols-[minmax(0,1fr)] p-2 text-start"
        current={data.focused}
        disabled={data.disabled}
        onRequestFocus={data.onFocus}
        onRequestPress={data.onOpenMenu}
        ref={data.controlRef}
        value={`combo-step-${data.step.id}`}
      >
        <span className="grid min-w-0 content-start gap-1.5">
          <span className="flex min-w-0 items-start justify-between gap-2">
            <span className="text-xs font-black tabular-nums text-[var(--ui-muted-text)]">
              {data.positionLabel}
            </span>
            {data.continuesToNextRow && (
              <span
                aria-label={data.continuationLabel}
                className="inline-flex items-center gap-1 text-xs font-black text-[var(--ui-accent-strong)]"
                data-row-continuation="outgoing"
                role="img"
              >
                <span aria-hidden="true">&#8594;</span>
              </span>
            )}
          </span>
          <span className="break-words font-semibold leading-snug">{data.step.label}</span>
          <span className="min-w-0 max-w-full [&_[data-ui-notation-step]]:min-w-0 [&_[data-ui-notation-step]]:flex-wrap">
            <NotationRenderer
              accessibleLabel={data.step.notationLabel}
              density={notationRendererDensities.whiteboard}
              notation={data.step.notation}
              notationDisplayMode={data.notationDisplayMode}
            />
          </span>
          <WhiteboardMetaList items={data.step.metaItems} />
          {data.step.disabledReason && (
            <span className="text-xs text-[var(--ui-destructive)]">{data.step.disabledReason}</span>
          )}
        </span>
      </SelectableItem>
      {data.pickedUp && (
        <Badge
          className="pointer-events-none absolute bottom-1 right-1 z-20"
          tone={uiToneModes.accent}
        >
          {data.positionLabel}
        </Badge>
      )}
      <Handle
        aria-hidden="true"
        className={hiddenHandleClassName}
        isConnectable={false}
        position={Position.Right}
        type="source"
      />
    </div>
  );
}

WhiteboardStepNodeView.displayName = "WhiteboardStepNodeView";

function WhiteboardConnectorNodeView(props: NodeProps<WhiteboardConnectorNode>) {
  const { data } = props;

  return (
    <div
      className={comboWhiteboardTargetRecipe({
        focused: data.focused,
        invalid: data.boundary,
        kind: comboWhiteboardTargetKinds.gap,
        pickedUp: data.pickupActive,
        state: data.state,
      })}
      data-controller-focused={data.focused ? "true" : undefined}
      data-focused={data.focused ? "true" : undefined}
      data-invalid-boundary={data.boundary ? "true" : undefined}
      data-ui-combo-whiteboard-connector
      data-ui-focus-target={data.focusTargetId}
    >
      <Handle
        aria-hidden="true"
        className={hiddenHandleClassName}
        isConnectable={false}
        position={Position.Left}
        type="target"
      />
      {data.boundary && (
        <span className="sr-only" role="note">
          {data.boundaryLabel}
        </span>
      )}
      {data.gap && (
        <SelectableItem
          accessibleLabel={
            data.gap.disabledReason
              ? `${data.gap.accessibleLabel ?? data.gap.label}: ${data.gap.disabledReason}`
              : (data.gap.accessibleLabel ?? data.gap.label)
          }
          busy={data.busy}
          className="nodrag nopan h-11 min-h-11 w-11 min-w-11 grid-cols-[1fr] border border-dashed border-[var(--ui-control-border)] p-0 text-center text-xl font-semibold"
          current={data.focused}
          disabled={data.disabled}
          onRequestFocus={data.onFocus}
          onRequestPress={data.onOpenMenu}
          ref={data.controlRef}
          selected={data.pickupActive}
          data-ui-combo-whiteboard-gap={data.gap.id}
          value={`combo-gap-${data.gap.id}`}
        >
          <span className="grid place-items-center gap-1">
            <span aria-hidden="true">+</span>
            <span className="sr-only">{data.gap.label}</span>
            {data.gap.disabledReason && (
              <span className="sr-only text-xs text-[var(--ui-destructive)]">
                {data.gap.disabledReason}
              </span>
            )}
          </span>
        </SelectableItem>
      )}
      <Handle
        aria-hidden="true"
        className={hiddenHandleClassName}
        isConnectable={false}
        position={Position.Right}
        type="source"
      />
    </div>
  );
}

WhiteboardConnectorNodeView.displayName = "WhiteboardConnectorNodeView";

function WhiteboardTransitionNodeView(props: NodeProps<WhiteboardTransitionNode>) {
  const { data } = props;
  const transitionLabel = data.transition?.metaItems
    .map((item) =>
      "reason" in item
        ? `${item.label}: ${item.reason}`
        : `${item.label}${item.value ? ` ${item.value}` : ""}`,
    )
    .join(", ");

  return (
    <div
      className="pointer-events-none flex h-full w-full content-start items-start gap-1 overflow-visible"
      data-ui-combo-whiteboard-transition-lane
    >
      {data.continuesFromPreviousRow && (
        <span
          aria-label={data.continuationLabel}
          className="inline-flex min-h-5.5 shrink-0 items-center text-xs font-black text-[var(--ui-accent-strong)]"
          data-row-continuation="incoming"
          role="img"
        >
          <span aria-hidden="true">&#8627;</span>
        </span>
      )}
      {data.transition && (
        <ul
          aria-label={transitionLabel}
          className="flex min-w-0 flex-1 list-none flex-wrap items-start gap-1 p-0"
          data-ui-combo-whiteboard-transition={`${data.transition.fromStepId}:${data.transition.toStepId}`}
        >
          {data.transition.metaItems.map((item) => (
            <li className="min-w-0 max-w-full" key={item.id}>
              <WhiteboardMetaBadge item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

WhiteboardTransitionNodeView.displayName = "WhiteboardTransitionNodeView";

const comboWhiteboardNodeTypes = {
  [comboWhiteboardFlowNodeTypes.connector]: WhiteboardConnectorNodeView,
  [comboWhiteboardFlowNodeTypes.step]: WhiteboardStepNodeView,
  [comboWhiteboardFlowNodeTypes.transition]: WhiteboardTransitionNodeView,
} as const satisfies NodeTypes;

export type ComboWhiteboardProps = {
  model: ComboWhiteboardModel;
  notationDisplayMode: NotationDisplayMode;
  onRequestAction?: (intent: ComboWhiteboardIntent) => void;
  source: ComboWhiteboardSource;
  sourceSurface: string;
};

const isFocusedStep = (target: ComboWhiteboardFocusTarget, stepId: string) =>
  target.kind === comboWhiteboardFocusTargetKinds.step && target.stepId === stepId;
const isFocusedGap = (target: ComboWhiteboardFocusTarget, gapId: string) =>
  target.kind === comboWhiteboardFocusTargetKinds.gap && target.gapId === gapId;

const getEditTargetLabel = (target: ComboWhiteboardEditTarget, labels: ComboWhiteboardLabels) => {
  switch (target.operation) {
    case comboWhiteboardEditOperations.append:
      return labels.appendTarget;
    case comboWhiteboardEditOperations.insert:
      return labels.insertTarget;
    case comboWhiteboardEditOperations.replace:
      return labels.replaceTarget;
  }
};

const getStepFocusTargetId = (step: ComboWhiteboardStep) =>
  step.focusTargetId ?? `combo-step-${step.id}`;
const getGapFocusTargetId = (gap: ComboWhiteboardGap) => gap.focusTargetId ?? `combo-gap-${gap.id}`;

const getEditTargetFocusTargetId = (
  source: ComboWhiteboardSource,
  target: ComboWhiteboardEditTarget,
) => {
  switch (target.operation) {
    case comboWhiteboardEditOperations.append: {
      let finalGap: ComboWhiteboardGap | undefined;
      for (const gap of source.gaps) {
        if (!finalGap || gap.index > finalGap.index) finalGap = gap;
      }
      return finalGap ? getGapFocusTargetId(finalGap) : undefined;
    }
    case comboWhiteboardEditOperations.insert: {
      const gap = source.gaps.find((candidate) => candidate.id === target.gapId);
      return gap ? getGapFocusTargetId(gap) : undefined;
    }
    case comboWhiteboardEditOperations.replace: {
      const step = source.steps.find((candidate) => candidate.id === target.stepId);
      return step ? getStepFocusTargetId(step) : undefined;
    }
  }
};

const getGapEditTarget = (
  source: ComboWhiteboardSource,
  gap: ComboWhiteboardGap,
): ComboWhiteboardEditTarget => {
  let finalGapIndex = gap.index;
  for (const candidate of source.gaps) {
    if (candidate.index > finalGapIndex) finalGapIndex = candidate.index;
  }
  return source.steps.length === 0 || gap.index === finalGapIndex
    ? appendEditTarget
    : { gapId: gap.id, operation: comboWhiteboardEditOperations.insert };
};

const whiteboardDefaultViewport = { x: 0, y: 0, zoom: 1 } as const;
const whiteboardProOptions = { hideAttribution: true } as const;

const whiteboardStepWidth = 176;
const whiteboardConnectorWidth = 44;
const whiteboardConnectorGutter = 8;
const whiteboardUnitWidth =
  whiteboardStepWidth + whiteboardConnectorWidth + whiteboardConnectorGutter * 2;
const whiteboardCanvasPadding = 8;
const whiteboardRowGap = 12;
const whiteboardTransitionGap = 6;
const whiteboardTransitionWidth = whiteboardStepWidth;
const whiteboardMinimumStepHeight = 148;
const whiteboardStepContentWidth = 152;
const whiteboardItemGap = 4;

const whiteboardFallbackWidths = {
  [uiResponsiveModes.desktop]: 1120,
  [uiResponsiveModes.mobile]: 320,
  [uiResponsiveModes.tablet]: 720,
} as const satisfies Record<UiResponsiveMode, number>;

const estimateMetaItemMetrics = (item: ComboWhiteboardMetaItem, maxWidth: number) => {
  const textLength =
    item.label.length +
    (item.value ? item.value.length + 1 : 0) +
    ("reason" in item ? item.reason.length + 3 : 0);
  const rawWidth = 14 + textLength * 6.4;
  const lineCount = Math.max(1, Math.ceil(rawWidth / maxWidth));

  return {
    height: Math.max(24, lineCount * 15 + 10),
    width: Math.min(maxWidth, Math.ceil(rawWidth)),
  };
};

const estimateMetaItemsHeight = (
  items: readonly ComboWhiteboardMetaItem[],
  maxWidth: number,
  leadingWidth = 0,
) => {
  let rowHeight = leadingWidth > 0 ? 22 : 0;
  let rowWidth = leadingWidth;
  let totalHeight = 0;

  for (const item of items) {
    const metrics = estimateMetaItemMetrics(item, maxWidth);
    const gap = rowWidth > 0 ? whiteboardItemGap : 0;
    if (rowWidth > 0 && rowWidth + gap + metrics.width > maxWidth) {
      totalHeight += (totalHeight > 0 ? whiteboardItemGap : 0) + rowHeight;
      rowHeight = metrics.height;
      rowWidth = metrics.width;
      continue;
    }
    rowHeight = Math.max(rowHeight, metrics.height);
    rowWidth += gap + metrics.width;
  }

  return totalHeight + (rowHeight > 0 ? (totalHeight > 0 ? whiteboardItemGap : 0) + rowHeight : 0);
};

const estimateNotationLineCount = (notation: readonly (readonly string[])[]) => {
  let lineCount = 1;
  let rowWidth = 0;

  for (const [index, sequence] of notation.entries()) {
    const sequenceWidth =
      Math.max(24, sequence.length * 28 - 4) + (index < notation.length - 1 ? 12 : 0);
    const gap = rowWidth > 0 ? 8 : 0;
    if (rowWidth > 0 && rowWidth + gap + sequenceWidth > whiteboardStepContentWidth) {
      lineCount += 1;
      rowWidth = sequenceWidth;
    } else {
      rowWidth += gap + sequenceWidth;
    }
  }

  return lineCount;
};

const estimateWhiteboardStepHeight = (step: ComboWhiteboardStep) => {
  const labelLines = Math.max(1, Math.ceil(step.label.length / 21));
  const metaHeight = estimateMetaItemsHeight(step.metaItems, whiteboardStepContentWidth);
  const notationLines = estimateNotationLineCount(step.notation);
  const disabledReasonHeight = step.disabledReason
    ? 6 + Math.max(1, Math.ceil(step.disabledReason.length / 24)) * 16
    : 0;

  return Math.max(
    whiteboardMinimumStepHeight,
    62 + labelLines * 20 + notationLines * 24 + metaHeight + disabledReasonHeight,
  );
};

const estimateWhiteboardTransitionHeight = (
  transition: ComboWhiteboardTransition | undefined,
  continuesFromPreviousRow: boolean,
) =>
  estimateMetaItemsHeight(
    transition?.metaItems ?? [],
    whiteboardTransitionWidth,
    continuesFromPreviousRow ? 20 : 0,
  );

const getWhiteboardCardsPerRow = (width: number) => {
  const availableWidth = Math.max(
    whiteboardUnitWidth + whiteboardConnectorWidth,
    width - whiteboardCanvasPadding * 2,
  );
  return Math.max(1, Math.floor((availableWidth - whiteboardConnectorWidth) / whiteboardUnitWidth));
};

type BuildWhiteboardFlowOptions = {
  busy: boolean;
  disabled: boolean;
  focusTarget: ComboWhiteboardFocusTarget;
  labels: ComboWhiteboardLabels;
  notationDisplayMode: NotationDisplayMode;
  onFocusGap: (gap: ComboWhiteboardGap) => void;
  onFocusStep: (step: ComboWhiteboardStep) => void;
  onOpenGapMenu: (gap: ComboWhiteboardGap) => void;
  onOpenStepMenu: (step: ComboWhiteboardStep) => void;
  pickUp: ComboWhiteboardPickUp;
  registerFocusTarget: (targetId: string, element: HTMLButtonElement | null) => void;
  source: ComboWhiteboardSource;
  targetState: ComboWhiteboardTargetState;
  width: number;
};

const createWhiteboardEdge = (source: string, target: string): Edge => ({
  id: `${source}->${target}`,
  selectable: false,
  source,
  style: { stroke: "var(--ui-separator)", strokeWidth: 2 },
  target,
  type: "straight",
});

const buildWhiteboardFlow = (options: BuildWhiteboardFlowOptions) => {
  const nodes: WhiteboardNode[] = [];
  const edges: Edge[] = [];
  const gapsByIndex = new Map<number, ComboWhiteboardGap>();
  for (const gap of options.source.gaps) {
    gapsByIndex.set(gap.index, gap);
  }
  const transitionsByToStepId = new Map<string, ComboWhiteboardTransition>();
  for (const transition of options.source.transitions) {
    transitionsByToStepId.set(transition.toStepId, transition);
  }

  const cardsPerRow = getWhiteboardCardsPerRow(options.width);
  const stepCount = options.source.steps.length;
  const rowCount = Math.max(1, Math.ceil(stepCount / cardsPerRow));
  let rowTop = whiteboardCanvasPadding;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const startIndex = rowIndex * cardsPerRow;
    const endIndex = Math.min(stepCount, startIndex + cardsPerRow);
    const rowSteps = options.source.steps.slice(startIndex, endIndex);
    const stepHeight =
      rowSteps.length === 0
        ? whiteboardConnectorWidth
        : Math.max(whiteboardMinimumStepHeight, ...rowSteps.map(estimateWhiteboardStepHeight));
    let transitionLaneHeight = 0;
    for (let index = startIndex; index < endIndex; index += 1) {
      const step = options.source.steps[index];
      if (!step) continue;
      const continuesFromPreviousRow = rowIndex > 0 && index === startIndex;
      transitionLaneHeight = Math.max(
        transitionLaneHeight,
        estimateWhiteboardTransitionHeight(
          transitionsByToStepId.get(step.id),
          continuesFromPreviousRow,
        ),
      );
    }
    const connectorY = rowTop + (stepHeight - whiteboardConnectorWidth) / 2;
    const transitionY = rowTop + stepHeight + whiteboardTransitionGap;

    for (let index = startIndex; index < endIndex; index += 1) {
      const rowStepIndex = index - startIndex;
      const connectorX = whiteboardCanvasPadding + rowStepIndex * whiteboardUnitWidth;
      const connectorId = `connector:${index}`;
      const gap = gapsByIndex.get(index);
      const step = options.source.steps[index];
      if (!step) continue;
      const stepId = `step:${step.id}`;
      const boundary = options.source.boundaryIndex === index;
      const continuesFromPreviousRow = rowIndex > 0 && index === startIndex;
      const continuesToNextRow = rowIndex < rowCount - 1 && index === endIndex - 1;

      nodes.push({
        ariaLabel: gap?.accessibleLabel ?? gap?.label ?? options.labels.board,
        connectable: false,
        data: {
          boundary,
          boundaryLabel: options.labels.invalidBoundary,
          busy: options.busy,
          controlRef: (element) =>
            options.registerFocusTarget(gap ? getGapFocusTargetId(gap) : connectorId, element),
          disabled: options.disabled || gap?.available === false,
          focused: gap ? isFocusedGap(options.focusTarget, gap.id) : false,
          focusTargetId: gap ? getGapFocusTargetId(gap) : undefined,
          gap,
          onFocus: gap ? () => options.onFocusGap(gap) : () => undefined,
          onOpenMenu: gap ? () => options.onOpenGapMenu(gap) : () => undefined,
          pickupActive:
            Boolean(gap) &&
            options.pickUp.state === comboWhiteboardPickUpStates.pickedUp &&
            options.pickUp.dropGapId === gap?.id,
          state: options.targetState,
        },
        draggable: false,
        focusable: false,
        id: connectorId,
        position: { x: connectorX, y: connectorY },
        selectable: false,
        style: {
          height: whiteboardConnectorWidth,
          pointerEvents: "all",
          width: whiteboardConnectorWidth,
        },
        type: comboWhiteboardFlowNodeTypes.connector,
      });
      nodes.push({
        ariaLabel: step.accessibleLabel ?? `${index + 1}. ${step.label}`,
        connectable: false,
        data: {
          busy: options.busy,
          continuationLabel: options.labels.continuationToNextRow,
          continuesToNextRow,
          controlRef: (element) => options.registerFocusTarget(getStepFocusTargetId(step), element),
          disabled: options.disabled || step.available === false,
          focused: isFocusedStep(options.focusTarget, step.id),
          focusTargetId: getStepFocusTargetId(step),
          invalid:
            options.source.boundaryIndex !== undefined && index >= options.source.boundaryIndex,
          notationDisplayMode: options.notationDisplayMode,
          onFocus: () => options.onFocusStep(step),
          onOpenMenu: () => options.onOpenStepMenu(step),
          pickedUp:
            options.pickUp.state === comboWhiteboardPickUpStates.pickedUp &&
            options.pickUp.stepId === step.id,
          positionLabel: String(index + 1).padStart(2, "0"),
          state: options.targetState,
          step,
        },
        draggable: false,
        focusable: false,
        id: stepId,
        position: {
          x: connectorX + whiteboardConnectorWidth + whiteboardConnectorGutter,
          y: rowTop,
        },
        selectable: false,
        style: { height: stepHeight, pointerEvents: "all", width: whiteboardStepWidth },
        type: comboWhiteboardFlowNodeTypes.step,
      });
      const transition = transitionsByToStepId.get(step.id);
      if (transition || continuesFromPreviousRow) {
        const transitionHeight = estimateWhiteboardTransitionHeight(
          transition,
          continuesFromPreviousRow,
        );
        // Keep prepared transition facts in the same visual column as their target move.
        // The technical insert/drop gap remains a separate control and wrapped rows keep
        // the same connector -> card -> transition reading rhythm.
        const preferredX = connectorX + whiteboardConnectorWidth + whiteboardConnectorGutter;
        const transitionX = Math.max(
          whiteboardCanvasPadding,
          Math.min(preferredX, options.width - whiteboardCanvasPadding - whiteboardTransitionWidth),
        );
        nodes.push({
          ariaLabel:
            transition?.metaItems
              .map((item) =>
                "reason" in item
                  ? `${item.label}: ${item.reason}`
                  : `${item.label}${item.value ? ` ${item.value}` : ""}`,
              )
              .join(", ") ?? options.labels.continuationFromPreviousRow,
          connectable: false,
          data: {
            continuationLabel: options.labels.continuationFromPreviousRow,
            continuesFromPreviousRow,
            transition,
          },
          draggable: false,
          focusable: false,
          id: transition
            ? `transition:${transition.fromStepId}:${transition.toStepId}`
            : `continuation:${step.id}`,
          position: { x: transitionX, y: transitionY },
          selectable: false,
          style: {
            height: transitionHeight,
            pointerEvents: "none",
            width: whiteboardTransitionWidth,
          },
          type: comboWhiteboardFlowNodeTypes.transition,
        });
      }
      edges.push(createWhiteboardEdge(connectorId, stepId));
      if (index < endIndex - 1) {
        edges.push(createWhiteboardEdge(stepId, `connector:${index + 1}`));
      }
    }

    if (stepCount === 0 || (rowIndex === rowCount - 1 && endIndex === stepCount)) {
      const connectorIndex = stepCount;
      const gap = gapsByIndex.get(connectorIndex);
      const connectorId = `connector:${connectorIndex}`;
      const connectorX =
        whiteboardCanvasPadding + Math.max(0, endIndex - startIndex) * whiteboardUnitWidth;
      nodes.push({
        ariaLabel: gap?.accessibleLabel ?? gap?.label ?? options.labels.board,
        connectable: false,
        data: {
          boundary: options.source.boundaryIndex === connectorIndex,
          boundaryLabel: options.labels.invalidBoundary,
          busy: options.busy,
          controlRef: (element) =>
            options.registerFocusTarget(gap ? getGapFocusTargetId(gap) : connectorId, element),
          disabled: options.disabled || gap?.available === false,
          focused: gap ? isFocusedGap(options.focusTarget, gap.id) : false,
          focusTargetId: gap ? getGapFocusTargetId(gap) : undefined,
          gap,
          onFocus: gap ? () => options.onFocusGap(gap) : () => undefined,
          onOpenMenu: gap ? () => options.onOpenGapMenu(gap) : () => undefined,
          pickupActive:
            Boolean(gap) &&
            options.pickUp.state === comboWhiteboardPickUpStates.pickedUp &&
            options.pickUp.dropGapId === gap?.id,
          state: options.targetState,
        },
        draggable: false,
        focusable: false,
        id: connectorId,
        position: { x: connectorX, y: connectorY },
        selectable: false,
        style: {
          height: whiteboardConnectorWidth,
          pointerEvents: "all",
          width: whiteboardConnectorWidth,
        },
        type: comboWhiteboardFlowNodeTypes.connector,
      });
      const lastStep = options.source.steps.at(-1);
      if (lastStep) {
        edges.push(createWhiteboardEdge(`step:${lastStep.id}`, connectorId));
      }
    }

    rowTop +=
      stepHeight +
      (transitionLaneHeight > 0 ? whiteboardTransitionGap + transitionLaneHeight : 0) +
      whiteboardRowGap;
  }

  return {
    cardsPerRow,
    edges,
    height: Math.max(96, rowTop - whiteboardRowGap + whiteboardCanvasPadding),
    nodes,
    rowCount,
  };
};

function SummaryStrip(props: { items: readonly ComboWhiteboardSummary[]; label: string }) {
  return (
    <ul aria-label={props.label} className="flex min-w-0 list-none flex-wrap gap-2 p-0">
      {props.items.map((item) => (
        <li key={item.id}>
          <Badge>
            <span className="text-[var(--ui-muted-text)]">{item.label}</span>
            <span>{item.value}</span>
          </Badge>
        </li>
      ))}
    </ul>
  );
}

SummaryStrip.displayName = "SummaryStrip";

type PickerInsertionContext = {
  activeStep?: ComboWhiteboardStep;
  afterStep?: ComboWhiteboardStep;
  beforeStep?: ComboWhiteboardStep;
};

const getPickerInsertionContext = (
  source: ComboWhiteboardSource,
  target: ComboWhiteboardEditTarget,
): PickerInsertionContext => {
  switch (target.operation) {
    case comboWhiteboardEditOperations.append:
      return { beforeStep: source.steps.at(-1) };
    case comboWhiteboardEditOperations.insert: {
      const gap = source.gaps.find((candidate) => candidate.id === target.gapId);
      const index = gap?.index ?? source.steps.length;
      return {
        afterStep: source.steps[index],
        beforeStep: source.steps[index - 1],
      };
    }
    case comboWhiteboardEditOperations.replace: {
      const index = source.steps.findIndex((step) => step.id === target.stepId);
      if (index < 0) return {};
      return {
        activeStep: source.steps[index],
        afterStep: source.steps[index + 1],
        beforeStep: source.steps[index - 1],
      };
    }
  }
};

function PickerContextMove(props: {
  boundaryLabel: string;
  label: string;
  notationDisplayMode: NotationDisplayMode;
  step?: ComboWhiteboardStep;
}) {
  return (
    <span className="grid min-w-0 content-start gap-1" data-ui-combo-whiteboard-picker-context-move>
      <span className="text-xs font-semibold text-[var(--ui-muted-text)]">{props.label}</span>
      <span className="break-words font-semibold">{props.step?.label ?? props.boundaryLabel}</span>
      {props.step && (
        <NotationRenderer
          accessibleLabel={props.step.notationLabel}
          density={notationRendererDensities.compact}
          notation={props.step.notation}
          notationDisplayMode={props.notationDisplayMode}
        />
      )}
    </span>
  );
}

PickerContextMove.displayName = "PickerContextMove";

function PickerInsertionContextStrip(props: {
  editTarget: ComboWhiteboardEditTarget;
  editTargetLabel: string;
  labels: ComboWhiteboardLabels;
  notationDisplayMode: NotationDisplayMode;
  responsiveMode: UiResponsiveMode;
  source: ComboWhiteboardSource;
}) {
  const context = getPickerInsertionContext(props.source, props.editTarget);
  const vertical = props.responsiveMode === uiResponsiveModes.mobile;

  return (
    <section
      aria-label={props.editTargetLabel}
      className={cx(
        "grid min-w-0 items-stretch gap-2 rounded-[var(--ui-radius-control)] border border-[var(--ui-separator)] bg-[var(--ui-content)] p-3",
        vertical
          ? "grid-cols-1"
          : "grid-cols-[minmax(0,1fr)_auto_minmax(10rem,1fr)_auto_minmax(0,1fr)]",
      )}
      data-ui-combo-whiteboard-picker-context
    >
      <PickerContextMove
        boundaryLabel={props.labels.comboStart}
        label={props.labels.beforeTarget}
        notationDisplayMode={props.notationDisplayMode}
        step={context.beforeStep}
      />
      <span aria-hidden="true" className="self-center text-xl text-[var(--ui-muted-text)]">
        {vertical ? "↓" : "→"}
      </span>
      <span
        className="grid min-w-0 content-center gap-1 rounded-[var(--ui-radius-control)] border border-[var(--ui-accent)] bg-[var(--ui-selection-muted)] p-3 text-center"
        data-ui-combo-whiteboard-picker-context-target
      >
        <span className="font-semibold text-[var(--ui-accent-strong)]">
          {props.editTargetLabel}
        </span>
        {context.activeStep && (
          <>
            <span className="break-words font-semibold">{context.activeStep.label}</span>
            <NotationRenderer
              accessibleLabel={context.activeStep.notationLabel}
              density={notationRendererDensities.compact}
              notation={context.activeStep.notation}
              notationDisplayMode={props.notationDisplayMode}
            />
          </>
        )}
      </span>
      <span aria-hidden="true" className="self-center text-xl text-[var(--ui-muted-text)]">
        {vertical ? "↓" : "→"}
      </span>
      <PickerContextMove
        boundaryLabel={props.labels.comboEnd}
        label={props.labels.afterTarget}
        notationDisplayMode={props.notationDisplayMode}
        step={context.afterStep}
      />
    </section>
  );
}

PickerInsertionContextStrip.displayName = "PickerInsertionContextStrip";

type MovePickerComposerLayerProps = {
  children: ReactNode;
  closeLabel: string;
  label: string;
  onRequestClose: () => void;
};

function MovePickerComposerLayer(props: MovePickerComposerLayerProps) {
  const { contrast, density, responsiveMode: rootResponsiveMode, theme } = useUiRootContext();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalHost(typeof document === "undefined" ? null : document.body);
  }, []);

  useEffect(() => {
    if (!portalHost) return;
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [portalHost]);

  useEffect(() => {
    if (!portalHost) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      props.onRequestClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [portalHost, props.onRequestClose]);

  if (!portalHost) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  return createPortal(
    <div
      className="mk-combos-ui-root mk-combos-ui-portal-root contents"
      data-ui-contrast={contrast}
      data-ui-density={density}
      data-ui-portal="combo-whiteboard-picker"
      data-ui-responsive={rootResponsiveMode}
      data-ui-theme={theme}
    >
      <div
        className="fixed inset-0 z-50 grid place-items-center overflow-hidden overscroll-contain bg-black/55 p-4 backdrop-blur-[2px]"
        data-ui-combo-whiteboard-picker-backdrop
      >
        <div
          aria-label={props.label}
          aria-modal="true"
          className="grid max-h-[calc(100dvh-2rem)] w-[min(72rem,calc(100vw-2rem))] min-w-0 gap-3 overflow-y-auto overscroll-contain rounded-[var(--ui-radius-surface)] border border-[var(--ui-separator)] bg-[var(--ui-popover)] p-4 shadow-[var(--ui-shadow)]"
          data-ui-combo-whiteboard-picker-window
          onKeyDown={handleKeyDown}
          ref={panelRef}
          role="dialog"
        >
          <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[var(--ui-separator)] bg-[var(--ui-popover)] pb-3">
            <span className="text-lg font-semibold">{props.label}</span>
            <Button
              aria-label={props.closeLabel}
              className="min-h-11 min-w-11"
              onRequestPress={props.onRequestClose}
              ref={closeButtonRef}
            >
              {props.closeLabel}
            </Button>
          </header>
          {props.children}
        </div>
      </div>
    </div>,
    portalHost,
  );
}

MovePickerComposerLayer.displayName = "MovePickerComposerLayer";

function PreparedActionButton(props: {
  action: ComboWhiteboardPreparedAction;
  disabled?: boolean;
  menuItem?: boolean;
  onPress: () => void;
  tone?:
    | typeof uiToneModes.accent
    | typeof uiToneModes.destructive
    | typeof uiToneModes.neutral
    | typeof uiToneModes.warning;
}) {
  return (
    <span className="grid gap-1">
      <Button
        aria-label={
          props.action.disabledReason
            ? `${props.action.label}: ${props.action.disabledReason}`
            : props.action.label
        }
        disabled={props.disabled || !props.action.available}
        onRequestPress={props.onPress}
        role={props.menuItem === false ? undefined : "menuitem"}
        tone={props.tone}
      >
        {props.action.label}
      </Button>
      {props.action.disabledReason && (
        <span className="text-xs text-[var(--ui-destructive)]">{props.action.disabledReason}</span>
      )}
    </span>
  );
}

PreparedActionButton.displayName = "PreparedActionButton";

export function ComboWhiteboard(props: ComboWhiteboardProps) {
  const { model, source } = props;
  const compact = model.state.responsiveMode !== uiResponsiveModes.desktop;
  const editingEnabled = supportsBuilderEditing(source.mode) && !source.disabledReason;
  const busy = Boolean(source.loading || source.mode === comboWhiteboardModes.savingFrozen);
  const pickerDisabled = !editingEnabled || busy;
  const pickerSupported = supportsMovePicker(source.mode);
  const boardRegionRef = useRef<HTMLElement | null>(null);
  const focusTargetControlRefs = useRef(new Map<string, HTMLButtonElement>());
  const localMenuRef = useRef<HTMLDivElement | null>(null);
  const restoringMenuFocus = useRef(false);
  const [layoutWidth, setLayoutWidth] = useState<number>(
    () => whiteboardFallbackWidths[model.state.responsiveMode],
  );
  const [menuAnchorPosition, setMenuAnchorPosition] = useState<{
    left: number;
    top: number;
  }>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSourceFocusTargetId, setPickerSourceFocusTargetId] = useState<string>();
  const targetState =
    source.mode === comboWhiteboardModes.savingFrozen
      ? comboWhiteboardTargetStates.frozen
      : source.loading
        ? comboWhiteboardTargetStates.busy
        : source.disabledReason
          ? comboWhiteboardTargetStates.disabled
          : comboWhiteboardTargetStates.idle;

  const emitIntent = useCallback(
    (intent: ComboWhiteboardIntent) => {
      if (!isIntentAllowedForMode(source, intent)) {
        return false;
      }
      const normalizedIntent = model.methods.normalizeIntent(intent);
      if (normalizedIntent) {
        props.onRequestAction?.(normalizedIntent);
        return true;
      }
      return false;
    },
    [model.methods, props.onRequestAction, source],
  );
  const intentBase = useCallback(
    (sourceFocusTarget: string | undefined, reason: ComponentInteractionReason) => ({
      mode: source.mode,
      reason,
      sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    }),
    [props.sourceSurface, source.mode],
  );
  const focusStep = useCallback(
    (step: ComboWhiteboardStep) => {
      if (restoringMenuFocus.current) return;
      emitIntent({
        ...intentBase(getStepFocusTargetId(step), componentInteractionReasons.triggerFocus),
        action: comboWhiteboardActions.focusStep,
        stepId: step.id,
      });
    },
    [emitIntent, intentBase],
  );
  const focusGap = useCallback(
    (gap: ComboWhiteboardGap) => {
      if (restoringMenuFocus.current) return;
      if (model.state.pickUp.state === comboWhiteboardPickUpStates.pickedUp) {
        model.methods.setDropTarget(gap.id);
      }
      emitIntent({
        ...intentBase(getGapFocusTargetId(gap), componentInteractionReasons.triggerFocus),
        action: comboWhiteboardActions.focusGap,
        gapId: gap.id,
      });
    },
    [emitIntent, intentBase, model.methods, model.state.pickUp.state],
  );
  const openStepMenu = useCallback(
    (step: ComboWhiteboardStep) => {
      emitIntent({
        ...intentBase(getStepFocusTargetId(step), componentInteractionReasons.press),
        action: comboWhiteboardActions.openLocalMenu,
        menuTarget: { kind: comboWhiteboardFocusTargetKinds.step, stepId: step.id },
      });
    },
    [emitIntent, intentBase],
  );
  const openGapMenu = useCallback(
    (gap: ComboWhiteboardGap) => {
      emitIntent({
        ...intentBase(getGapFocusTargetId(gap), componentInteractionReasons.press),
        action: comboWhiteboardActions.openLocalMenu,
        menuTarget: { gapId: gap.id, kind: comboWhiteboardFocusTargetKinds.gap },
      });
    },
    [emitIntent, intentBase],
  );
  const registerFocusTarget = useCallback((targetId: string, element: HTMLButtonElement | null) => {
    if (element) {
      focusTargetControlRefs.current.set(targetId, element);
    } else {
      focusTargetControlRefs.current.delete(targetId);
    }
  }, []);

  useEffect(() => {
    const region = boardRegionRef.current;
    if (!region) return;

    const updateWidth = (measuredWidth?: number) => {
      const nextWidth =
        measuredWidth ?? (region.getBoundingClientRect().width || region.clientWidth);
      setLayoutWidth((current) => {
        const resolvedWidth =
          nextWidth > 0
            ? Math.floor(nextWidth)
            : whiteboardFallbackWidths[model.state.responsiveMode];
        return current === resolvedWidth ? current : resolvedWidth;
      });
    };
    updateWidth();
    const observer = new ResizeObserver((entries) => {
      updateWidth(entries[0]?.contentRect.width);
    });
    observer.observe(region);
    return () => observer.disconnect();
  }, [model.state.responsiveMode]);

  useEffect(() => {
    if (pickerSupported || !pickerOpen) return;
    setPickerOpen(false);
    setPickerSourceFocusTargetId(undefined);
  }, [pickerOpen, pickerSupported]);

  const flow = useMemo(
    () =>
      buildWhiteboardFlow({
        busy,
        disabled: Boolean(source.disabledReason),
        focusTarget: model.state.focusTarget,
        labels: source.labels,
        notationDisplayMode: props.notationDisplayMode,
        onFocusGap: focusGap,
        onFocusStep: focusStep,
        onOpenGapMenu: openGapMenu,
        onOpenStepMenu: openStepMenu,
        pickUp: model.state.pickUp,
        registerFocusTarget,
        source,
        targetState,
        width: layoutWidth,
      }),
    [
      busy,
      focusGap,
      focusStep,
      model.state.focusTarget,
      model.state.pickUp,
      openGapMenu,
      openStepMenu,
      props.notationDisplayMode,
      registerFocusTarget,
      source,
      targetState,
      layoutWidth,
    ],
  );

  const visibleCandidateIdSet = useMemo(
    () => new Set(model.state.visibleCandidateIds),
    [model.state.visibleCandidateIds],
  );
  const visibleCandidates = useMemo(
    () => source.candidates.filter((candidate) => visibleCandidateIdSet.has(candidate.id)),
    [source.candidates, visibleCandidateIdSet],
  );
  const focusedCandidateId =
    model.state.focusTarget.kind === comboWhiteboardFocusTargetKinds.candidate
      ? model.state.focusTarget.candidateId
      : undefined;
  const nextGroupId = model.methods.getNextGroupId();
  const previousGroupId = model.methods.getPreviousGroupId();
  const menuTarget =
    model.state.localMenu.state === comboWhiteboardLocalMenuStates.open
      ? model.state.localMenu.target
      : undefined;
  const menuStep =
    menuTarget?.kind === comboWhiteboardFocusTargetKinds.step
      ? source.steps.find((step) => step.id === menuTarget.stepId)
      : undefined;
  const menuGap =
    menuTarget?.kind === comboWhiteboardFocusTargetKinds.gap
      ? source.gaps.find((gap) => gap.id === menuTarget.gapId)
      : undefined;
  const menuFocusTargetId = menuStep
    ? getStepFocusTargetId(menuStep)
    : menuGap
      ? getGapFocusTargetId(menuGap)
      : undefined;
  const pickedUpStepId =
    model.state.pickUp.state === comboWhiteboardPickUpStates.pickedUp
      ? model.state.pickUp.stepId
      : undefined;

  const restoreFocusTarget = useCallback((focusTargetId?: string) => {
    const sourceControl = focusTargetId
      ? focusTargetControlRefs.current.get(focusTargetId)
      : undefined;
    if (sourceControl) {
      restoringMenuFocus.current = true;
      sourceControl.focus({ preventScroll: true });
      restoringMenuFocus.current = false;
    }
  }, []);
  const restoreMenuSourceFocus = useCallback(
    () => restoreFocusTarget(menuFocusTargetId),
    [menuFocusTargetId, restoreFocusTarget],
  );
  const closeMenu = useCallback(() => {
    const closed = emitIntent({
      ...intentBase(menuFocusTargetId, componentInteractionReasons.closePress),
      action: comboWhiteboardActions.closeLocalMenu,
      menuTarget,
    });
    if (closed) restoreMenuSourceFocus();
  }, [emitIntent, intentBase, menuFocusTargetId, menuTarget, restoreMenuSourceFocus]);
  const completeMenuAction = useCallback(
    (emitted: boolean) => {
      if (!emitted) return;
      model.methods.closeLocalMenu();
      restoreMenuSourceFocus();
    },
    [model.methods, restoreMenuSourceFocus],
  );
  const setEditTarget = useCallback(
    (editTarget: ComboWhiteboardEditTarget, sourceFocusTarget?: string) => {
      return emitIntent({
        ...intentBase(sourceFocusTarget, componentInteractionReasons.press),
        action: comboWhiteboardActions.setEditTarget,
        editTarget,
      });
    },
    [emitIntent, intentBase],
  );
  const openPickerForEditTarget = useCallback(
    (editTarget: ComboWhiteboardEditTarget, sourceFocusTarget?: string) => {
      if (!setEditTarget(editTarget, sourceFocusTarget)) return;
      model.methods.closeLocalMenu();
      setPickerSourceFocusTargetId(sourceFocusTarget);
      setPickerOpen(true);
    },
    [model.methods, setEditTarget],
  );
  const closePicker = useCallback(() => {
    setPickerOpen(false);
    const activeTargetId = getEditTargetFocusTargetId(source, model.state.editTarget);
    restoreFocusTarget(activeTargetId ?? pickerSourceFocusTargetId);
    setPickerSourceFocusTargetId(undefined);
  }, [model.state.editTarget, pickerSourceFocusTargetId, restoreFocusTarget, source]);
  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const menuItems = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'),
      );
      if (menuItems.length === 0) return;
      event.preventDefault();
      const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement);
      const nextIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? menuItems.length - 1
            : event.key === "ArrowUp"
              ? (Math.max(currentIndex, 0) - 1 + menuItems.length) % menuItems.length
              : (currentIndex + 1) % menuItems.length;
      menuItems[nextIndex]?.focus({ preventScroll: true });
    },
    [closeMenu],
  );

  useEffect(() => {
    if (!menuTarget) return;
    localMenuRef.current
      ?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
      ?.focus({ preventScroll: true });
  }, [menuTarget]);

  useEffect(() => {
    if (!menuTarget || !menuFocusTargetId) {
      setMenuAnchorPosition(undefined);
      return;
    }

    const updatePosition = () => {
      const anchor = focusTargetControlRefs.current.get(menuFocusTargetId);
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      const menuRect = localMenuRef.current?.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 320;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 480;
      const menuWidth = menuRect?.width || 240;
      const menuHeight = menuRect?.height || 0;
      const belowTop = anchorRect.bottom + 8;
      const aboveTop = anchorRect.top - menuHeight - 8;
      setMenuAnchorPosition({
        left: Math.max(8, Math.min(anchorRect.left, viewportWidth - menuWidth - 8)),
        top:
          menuHeight > 0 && belowTop + menuHeight > viewportHeight - 8
            ? Math.max(8, aboveTop)
            : belowTop,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [menuFocusTargetId, menuTarget]);

  return (
    <section
      aria-busy={busy || undefined}
      aria-label={source.label}
      className={cx(
        "grid min-w-0 gap-4",
        compact && "[&_[data-ui-button]]:min-h-11 [&_[data-ui-button]]:min-w-11",
      )}
      data-ui-combo-whiteboard-compact-targets={compact ? "true" : undefined}
      data-ui-combo-whiteboard-mode={source.mode}
      data-ui-component="UI-CMP-035"
    >
      {source.runtimeSummary && source.runtimeSummary.length > 0 && (
        <SummaryStrip items={source.runtimeSummary} label={source.labels.runtimeSummary} />
      )}
      {source.contextSummary && source.contextSummary.length > 0 && (
        <SummaryStrip items={source.contextSummary} label={source.labels.contextSummary} />
      )}
      <section
        aria-label={source.labels.board}
        className="grid min-w-0 gap-2"
        data-ui-combo-whiteboard-cards-per-row={flow.cardsPerRow}
        data-ui-combo-whiteboard-row-count={flow.rowCount}
        ref={boardRegionRef}
      >
        {source.steps.length === 0 && <StatusMessage>{source.labels.emptyPath}</StatusMessage>}
        <div
          className="min-w-0 bg-[var(--ui-content)]"
          data-ui-combo-whiteboard-canvas-height={flow.height}
          style={{ height: flow.height }}
        >
          <ReactFlow<WhiteboardNode, Edge>
            aria-label={source.labels.board}
            autoPanOnNodeFocus={false}
            className="overflow-visible"
            data-ui-combo-whiteboard-canvas-zoom="fixed"
            defaultViewport={whiteboardDefaultViewport}
            deleteKeyCode={null}
            edges={flow.edges}
            edgesFocusable={false}
            edgesReconnectable={false}
            elementsSelectable={false}
            maxZoom={1}
            minZoom={1}
            multiSelectionKeyCode={null}
            nodes={flow.nodes}
            nodesConnectable={false}
            nodesDraggable={false}
            nodesFocusable={false}
            nodeTypes={comboWhiteboardNodeTypes}
            panActivationKeyCode={null}
            panOnDrag={false}
            panOnScroll={false}
            preventScrolling={false}
            proOptions={whiteboardProOptions}
            selectionKeyCode={null}
            selectionOnDrag={false}
            selectNodesOnDrag={false}
            zoomActivationKeyCode={null}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
          />
        </div>
      </section>

      {pickerSupported && pickerOpen && !menuTarget && (
        <MovePickerComposerLayer
          closeLabel={source.labels.closePicker}
          label={source.labels.picker}
          onRequestClose={closePicker}
        >
          <PickerInsertionContextStrip
            editTarget={model.state.editTarget}
            editTargetLabel={getEditTargetLabel(model.state.editTarget, source.labels)}
            labels={source.labels}
            notationDisplayMode={props.notationDisplayMode}
            responsiveMode={model.state.responsiveMode}
            source={source}
          />
          <MovePicker
            busy={Boolean(source.loading)}
            canMoveToNextGroup={Boolean(nextGroupId)}
            canMoveToPreviousGroup={Boolean(previousGroupId)}
            candidates={visibleCandidates}
            disabled={pickerDisabled}
            editTarget={model.state.editTarget}
            editTargetLabel={getEditTargetLabel(model.state.editTarget, source.labels)}
            focusedCandidateId={focusedCandidateId}
            groups={source.groups}
            labels={source.labels}
            notationDisplayMode={props.notationDisplayMode}
            onFocusCandidate={(candidateId, focusTargetId) =>
              emitIntent({
                ...intentBase(
                  focusTargetId ?? `combo-candidate-${candidateId}`,
                  componentInteractionReasons.triggerFocus,
                ),
                action: comboWhiteboardActions.focusMoveCandidate,
                candidateId,
              })
            }
            onMoveToNextGroup={() => {
              if (nextGroupId) {
                emitIntent({
                  ...intentBase(undefined, componentInteractionReasons.listNavigation),
                  action: comboWhiteboardActions.moveToNextGroup,
                  groupId: nextGroupId,
                });
              }
            }}
            onMoveToPreviousGroup={() => {
              if (previousGroupId) {
                emitIntent({
                  ...intentBase(undefined, componentInteractionReasons.listNavigation),
                  action: comboWhiteboardActions.moveToPreviousGroup,
                  groupId: previousGroupId,
                });
              }
            }}
            onOpenCandidateDetails={(candidateId, focusTargetId) =>
              emitIntent({
                ...intentBase(
                  focusTargetId ?? `combo-candidate-${candidateId}`,
                  componentInteractionReasons.press,
                ),
                action: comboWhiteboardActions.openCandidateDetails,
                candidateId,
              })
            }
            onSelectCandidate={(candidateId, focusTargetId) => {
              const emitted = emitIntent({
                ...intentBase(
                  focusTargetId ?? `combo-candidate-${candidateId}`,
                  componentInteractionReasons.itemPress,
                ),
                action: comboWhiteboardActions.selectMoveCandidate,
                candidateId,
                editTarget: model.state.editTarget,
              });
              if (emitted) closePicker();
            }}
            onSelectGroup={(groupId) =>
              emitIntent({
                ...intentBase(`move-group-${groupId}`, componentInteractionReasons.itemPress),
                action: comboWhiteboardActions.selectMoveGroup,
                groupId,
              })
            }
            onUseAppendTarget={() =>
              setEditTarget(appendEditTarget, getFocusTargetId(source, model.state.focusTarget))
            }
            responsiveMode={model.state.responsiveMode}
            selectedGroupId={model.state.selectedGroupId}
            statusMessage={source.pickerMessage}
          />
        </MovePickerComposerLayer>
      )}

      {menuTarget && source.mode !== comboWhiteboardModes.savingFrozen && (
        <div
          aria-label={source.labels.menu}
          className="z-50 grid w-60 max-w-[calc(100vw-1rem)] justify-items-stretch gap-2 border border-[var(--ui-separator)] bg-[var(--ui-popover)] p-3 shadow-[var(--ui-shadow)]"
          data-ui-combo-whiteboard-local-menu-anchor={menuFocusTargetId}
          data-ui-combo-whiteboard-local-menu
          onKeyDown={handleMenuKeyDown}
          ref={localMenuRef}
          role="menu"
          style={{
            left: menuAnchorPosition?.left ?? 8,
            opacity: menuAnchorPosition ? undefined : 0,
            pointerEvents: menuAnchorPosition ? undefined : "none",
            position: "fixed",
            top: menuAnchorPosition?.top ?? 8,
          }}
          tabIndex={-1}
        >
          {menuStep?.actions?.details && (
            <PreparedActionButton
              action={menuStep.actions.details}
              onPress={() =>
                completeMenuAction(
                  emitIntent({
                    ...intentBase(menuFocusTargetId, componentInteractionReasons.itemPress),
                    action: comboWhiteboardActions.openStepDetails,
                    stepId: menuStep.id,
                  }),
                )
              }
            />
          )}
          {menuStep?.actions?.replace && (
            <PreparedActionButton
              action={menuStep.actions.replace}
              disabled={!editingEnabled || busy}
              onPress={() =>
                openPickerForEditTarget(
                  { operation: comboWhiteboardEditOperations.replace, stepId: menuStep.id },
                  menuFocusTargetId,
                )
              }
            />
          )}
          {menuStep?.actions?.remove && (
            <PreparedActionButton
              action={menuStep.actions.remove}
              disabled={!editingEnabled || busy}
              onPress={() =>
                completeMenuAction(
                  emitIntent({
                    ...intentBase(menuFocusTargetId, componentInteractionReasons.itemPress),
                    action: comboWhiteboardActions.removeStep,
                    stepId: menuStep.id,
                  }),
                )
              }
              tone={uiToneModes.destructive}
            />
          )}
          {menuStep?.actions?.undo && (
            <PreparedActionButton
              action={menuStep.actions.undo}
              disabled={!editingEnabled || busy}
              onPress={() =>
                completeMenuAction(
                  emitIntent({
                    ...intentBase(menuFocusTargetId, componentInteractionReasons.itemPress),
                    action: comboWhiteboardActions.undoToStep,
                    stepId: menuStep.id,
                  }),
                )
              }
            />
          )}
          {menuStep?.actions?.pickUp && (
            <PreparedActionButton
              action={menuStep.actions.pickUp}
              disabled={!editingEnabled || busy}
              onPress={() =>
                completeMenuAction(
                  emitIntent({
                    ...intentBase(menuFocusTargetId, componentInteractionReasons.itemPress),
                    action: comboWhiteboardActions.pickUpStep,
                    stepId: menuStep.id,
                  }),
                )
              }
            />
          )}
          {menuGap?.actions?.insert && (
            <PreparedActionButton
              action={menuGap.actions.insert}
              disabled={!editingEnabled || busy}
              onPress={() =>
                openPickerForEditTarget(getGapEditTarget(source, menuGap), menuFocusTargetId)
              }
            />
          )}
          {menuGap?.actions?.drop && pickedUpStepId && (
            <PreparedActionButton
              action={menuGap.actions.drop}
              disabled={!editingEnabled || busy}
              onPress={() =>
                completeMenuAction(
                  emitIntent({
                    ...intentBase(menuFocusTargetId, componentInteractionReasons.itemPress),
                    action: comboWhiteboardActions.dropPickedStep,
                    gapId: menuGap.id,
                    operation: comboWhiteboardEditOperations.reorder,
                    stepId: pickedUpStepId,
                  }),
                )
              }
            />
          )}
          <Button onRequestPress={closeMenu} role="menuitem">
            {source.labels.closeMenu}
          </Button>
        </div>
      )}

      {pickedUpStepId && (
        <Group>
          <StatusMessage>{source.labels.reorderTarget}</StatusMessage>
          <Button
            disabled={!editingEnabled || busy}
            onRequestPress={() =>
              emitIntent({
                ...intentBase(
                  getFocusTargetId(source, model.state.focusTarget),
                  componentInteractionReasons.press,
                ),
                action: comboWhiteboardActions.cancelPickUp,
                stepId: pickedUpStepId,
              })
            }
          >
            {source.labels.cancelPickUp}
          </Button>
        </Group>
      )}

      {source.mode === comboWhiteboardModes.pendingTruncate && source.truncateConfirmation && (
        <section
          aria-label={source.truncateConfirmation.message}
          className="grid gap-2 border-l-4 border-[var(--ui-warning)] bg-[var(--ui-warning-soft)] p-3"
          data-ui-combo-whiteboard-truncate
          role="alert"
        >
          <span className="font-semibold">{source.truncateConfirmation.message}</span>
          {source.truncateConfirmation.reason && (
            <span className="text-sm">{source.truncateConfirmation.reason}</span>
          )}
          <Group>
            <PreparedActionButton
              action={source.truncateConfirmation.confirmAction}
              disabled={busy}
              menuItem={false}
              onPress={() =>
                emitIntent({
                  ...intentBase(undefined, componentInteractionReasons.press),
                  action: comboWhiteboardActions.confirmTruncate,
                  confirmationId: source.truncateConfirmation?.id ?? "",
                })
              }
              tone={uiToneModes.warning}
            />
            <PreparedActionButton
              action={source.truncateConfirmation.cancelAction}
              disabled={busy}
              menuItem={false}
              onPress={() =>
                emitIntent({
                  ...intentBase(undefined, componentInteractionReasons.press),
                  action: comboWhiteboardActions.cancelTruncate,
                  confirmationId: source.truncateConfirmation?.id ?? "",
                })
              }
            />
          </Group>
        </section>
      )}

      {source.mode === comboWhiteboardModes.repairReview &&
        source.repairAction &&
        source.boundaryIndex !== undefined && (
          <PreparedActionButton
            action={source.repairAction}
            disabled={busy}
            menuItem={false}
            onPress={() =>
              emitIntent({
                ...intentBase(undefined, componentInteractionReasons.press),
                action: comboWhiteboardActions.repairFromValidPrefix,
                boundaryIndex: source.boundaryIndex ?? 0,
              })
            }
            tone={uiToneModes.warning}
          />
        )}

      {source.mode === comboWhiteboardModes.detailReadOnly && source.detailActions && (
        <Group>
          {source.detailActions.editCustomCombo && (
            <PreparedActionButton
              action={source.detailActions.editCustomCombo}
              disabled={busy}
              menuItem={false}
              onPress={() =>
                emitIntent({
                  ...intentBase(undefined, componentInteractionReasons.press),
                  action: comboWhiteboardActions.editCustomCombo,
                  actionId: source.detailActions?.editCustomCombo?.id ?? "",
                })
              }
            />
          )}
          {source.detailActions.duplicateSeededCombo && (
            <PreparedActionButton
              action={source.detailActions.duplicateSeededCombo}
              disabled={busy}
              menuItem={false}
              onPress={() =>
                emitIntent({
                  ...intentBase(undefined, componentInteractionReasons.press),
                  action: comboWhiteboardActions.duplicateSeededCombo,
                  actionId: source.detailActions?.duplicateSeededCombo?.id ?? "",
                })
              }
            />
          )}
        </Group>
      )}

      {source.disabledReason && (
        <StatusMessage tone={uiToneModes.warning}>{source.disabledReason}</StatusMessage>
      )}
      {source.mode === comboWhiteboardModes.savingFrozen && (
        <StatusMessage>{source.labels.saving}</StatusMessage>
      )}
    </section>
  );
}

ComboWhiteboard.displayName = "ComboWhiteboard";
