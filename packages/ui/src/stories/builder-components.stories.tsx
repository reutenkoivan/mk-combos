import { notationDisplayModes } from "@mk-combos/contracts/settings/value";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import {
  BuilderActionBar,
  type BuilderActionBarActionDescriptor,
  builderActionBarActions,
  builderActionBarStates,
} from "../components/builder-action-bar";
import {
  ComboFrameMeter,
  type ComboFrameMeterInspectionTarget,
  type ComboFrameMeterSegment,
  type ComboFrameMeterSnapshot,
  comboFrameMeterActions,
  comboFrameMeterGridStates,
  comboFrameMeterInspectionTargetKinds,
  comboFrameMeterLifecycles,
  comboFrameMeterScopes,
  comboFrameMeterSegmentKinds,
  comboFrameMeterSegmentValidities,
  comboFrameMeterTrackKinds,
  useComboFrameMeterModel,
} from "../components/combo-frame-meter";
import {
  ComboWhiteboard,
  type ComboWhiteboardMetaItem,
  type ComboWhiteboardSource,
  type ComboWhiteboardStep,
  type ComboWhiteboardTransition,
  comboWhiteboardFocusTargetKinds,
  comboWhiteboardMetaStatuses,
  comboWhiteboardModes,
  useComboWhiteboardModel,
} from "../components/combo-whiteboard";
import type { UiResponsiveMode } from "../components/type";
import { uiResponsiveModes } from "../components/value";
import { Panel } from "../primitives/layout";
import type { UiContrastMode, UiThemeMode, UiToneMode } from "../tokens/type";
import { uiContrastModes, uiThemeModes, uiToneModes } from "../tokens/value";
import { StoryFrame } from "./story-frame";
import { storyViewportGlobals } from "./story-viewports";

const builderStoryScenarios = {
  detail: "detail",
  editable: "editable",
  empty: "empty",
  error: "error",
  narrow: "narrow",
  pending: "pending",
  saved: "saved",
  saving: "saving",
  selected: "selected",
  unavailable: "unavailable",
  whole: "whole",
} as const;

type BuilderStoryScenario = (typeof builderStoryScenarios)[keyof typeof builderStoryScenarios];

type BuilderComponentsStoryArgs = {
  contrast: UiContrastMode;
  responsiveMode: UiResponsiveMode;
  scenario: BuilderStoryScenario;
  theme: UiThemeMode;
};

const whiteboardLabels = {
  afterTarget: "After target",
  appendTarget: "Append next move",
  beforeTarget: "Before target",
  board: "Combo path",
  cancelPickUp: "Cancel pick up",
  candidates: "Move candidates",
  closeMenu: "Close",
  closePicker: "Close move picker",
  comboEnd: "End of combo",
  comboStart: "Start of combo",
  contextSummary: "Context summary",
  continuationFromPreviousRow: "Continued from the previous row",
  continuationToNextRow: "Continues on the next row",
  emptyPath: "Choose a move to start the combo.",
  groups: "Move groups",
  hints: ["Confirm selects a candidate", "Back returns to the combo path"],
  insertTarget: "Insert into combo",
  invalidBoundary: "Invalid boundary",
  loadingCandidates: "Loading move candidates",
  menu: "Step actions",
  nextGroup: "Next group",
  noCandidates: "No valid moves remain.",
  picker: "Move picker",
  previousGroup: "Previous group",
  reorderTarget: "Choose a drop position",
  replaceTarget: "Replace focused move",
  runtimeSummary: "Runtime summary",
  saving: "Saving. The prepared path remains visible.",
  useAppendTarget: "Append",
} as const;

const preparedAction = (id: string, label: string) => ({ available: true, id, label });

const availableMeta = (
  id: string,
  label: string,
  value: string,
  tone: UiToneMode = uiToneModes.neutral,
): ComboWhiteboardMetaItem => ({
  id,
  label,
  status: comboWhiteboardMetaStatuses.available,
  tone,
  value,
});

const unavailableMeta = (id: string, label: string, reason: string): ComboWhiteboardMetaItem => ({
  id,
  label,
  reason,
  status: comboWhiteboardMetaStatuses.unavailable,
  tone: uiToneModes.warning,
});

const denseStepDefinitions = [
  {
    id: "step-1",
    label: "Quick jab",
    metaItems: [
      availableMeta("step-1-level", "Attack", "High", uiToneModes.warning),
      availableMeta("step-1-duckable", "Defense", "Duckable", uiToneModes.warning),
      availableMeta("step-1-role", "Role", "Hit confirm", uiToneModes.success),
    ],
    notation: [["1"]],
    notationLabel: "One",
  },
  {
    id: "step-2",
    label: "Rising knee",
    metaItems: [
      availableMeta("step-2-level", "Attack", "Mid", uiToneModes.accent),
      availableMeta("step-2-role", "Role", "Launcher", uiToneModes.success),
      availableMeta("step-2-cost", "Meter", "0 bars"),
    ],
    notation: [["F", "3"]],
    notationLabel: "Forward three",
  },
  {
    id: "step-3",
    label: "Air string",
    metaItems: [
      availableMeta("step-3-level", "Attack", "Overhead", uiToneModes.warning),
      availableMeta("step-3-state", "State", "Airborne", uiToneModes.accent),
      availableMeta("step-3-role", "Role", "Carry", uiToneModes.success),
    ],
    notation: [["J", "1"], ["2"]],
    notationLabel: "Jump one, then two",
  },
  {
    id: "step-4",
    label: "Air extension",
    metaItems: [
      availableMeta("step-4-level", "Attack", "Mid", uiToneModes.accent),
      availableMeta("step-4-role", "Role", "Juggle", uiToneModes.success),
      availableMeta("step-4-height", "Height", "Keeps airborne"),
    ],
    notation: [["J", "2"], ["4"]],
    notationLabel: "Jump two, then four",
  },
  {
    id: "step-5",
    label: "Re-launch kick",
    metaItems: [
      availableMeta("step-5-level", "Attack", "High", uiToneModes.warning),
      availableMeta("step-5-role", "Role", "Re-launch", uiToneModes.success),
      availableMeta("step-5-side", "Side switch", "No"),
    ],
    notation: [["B", "4"]],
    notationLabel: "Back four",
  },
  {
    id: "step-6",
    label: "Dash link",
    metaItems: [
      availableMeta("step-6-level", "Attack", "Mid", uiToneModes.accent),
      availableMeta("step-6-role", "Role", "Link", uiToneModes.success),
      availableMeta("step-6-window", "Timing", "Tight", uiToneModes.warning),
    ],
    notation: [["F", "F"], ["2"]],
    notationLabel: "Dash, then two",
  },
  {
    id: "step-7",
    label: "Corner carry string",
    metaItems: [
      availableMeta("step-7-level", "Attack", "Mid", uiToneModes.accent),
      availableMeta("step-7-role", "Role", "Corner carry", uiToneModes.success),
      availableMeta("step-7-gap", "Internal gap", "1f", uiToneModes.warning),
    ],
    notation: [["2", "1"], ["3"]],
    notationLabel: "Two one, then three",
  },
  {
    id: "step-8",
    label: "Meter extension",
    metaItems: [
      availableMeta("step-8-level", "Attack", "Mid", uiToneModes.accent),
      availableMeta("step-8-role", "Role", "Extension", uiToneModes.success),
      availableMeta("step-8-cost", "Meter", "1 bar", uiToneModes.warning),
    ],
    notation: [["D", "F", "2"], ["EX"]],
    notationLabel: "Down forward two, enhanced",
  },
  {
    id: "step-9",
    label: "Reset check",
    metaItems: [
      availableMeta("step-9-level", "Attack", "Low", uiToneModes.warning),
      availableMeta("step-9-role", "Role", "Reset", uiToneModes.accent),
      availableMeta("step-9-state", "Opponent", "Grounded"),
    ],
    notation: [["D", "3"]],
    notationLabel: "Down three",
  },
  {
    id: "step-10",
    label: "Safe ender",
    metaItems: [
      availableMeta("step-10-level", "Attack", "Mid", uiToneModes.accent),
      availableMeta("step-10-role", "Role", "Ender", uiToneModes.success),
      availableMeta("step-10-safety", "Block", "Safe", uiToneModes.success),
    ],
    notation: [["B", "3"]],
    notationLabel: "Back three",
  },
] as const satisfies readonly Omit<ComboWhiteboardStep, "actions">[];

const denseTransitions = [
  {
    fromStepId: "step-1",
    metaItems: [
      availableMeta("transition-1-gap", "Gap", "2f", uiToneModes.warning),
      availableMeta("transition-1-kind", "Timing", "Link", uiToneModes.accent),
    ],
    toStepId: "step-2",
  },
  {
    fromStepId: "step-2",
    metaItems: [availableMeta("transition-2-kind", "Timing", "Cancel", uiToneModes.accent)],
    toStepId: "step-3",
  },
  {
    fromStepId: "step-3",
    metaItems: [availableMeta("transition-3-kind", "Timing", "Juggle", uiToneModes.success)],
    toStepId: "step-4",
  },
  {
    fromStepId: "step-4",
    metaItems: [availableMeta("transition-4-kind", "Timing", "Juggle", uiToneModes.success)],
    toStepId: "step-5",
  },
  {
    fromStepId: "step-5",
    metaItems: [availableMeta("transition-5-kind", "Timing", "Link", uiToneModes.accent)],
    toStepId: "step-6",
  },
  {
    fromStepId: "step-6",
    metaItems: [
      availableMeta("transition-6-gap", "Gap", "1f", uiToneModes.warning),
      availableMeta("transition-6-kind", "Timing", "Link", uiToneModes.accent),
    ],
    toStepId: "step-7",
  },
  {
    fromStepId: "step-7",
    metaItems: [availableMeta("transition-7-kind", "Timing", "Cancel", uiToneModes.accent)],
    toStepId: "step-8",
  },
  {
    fromStepId: "step-8",
    metaItems: [availableMeta("transition-8-kind", "Timing", "Juggle", uiToneModes.success)],
    toStepId: "step-9",
  },
  {
    fromStepId: "step-9",
    metaItems: [availableMeta("transition-9-kind", "Timing", "Link", uiToneModes.accent)],
    toStepId: "step-10",
  },
] as const satisfies readonly ComboWhiteboardTransition[];

const buildWhiteboardSource = (
  scenario: BuilderStoryScenario,
  responsiveMode: UiResponsiveMode,
): ComboWhiteboardSource => {
  const empty = scenario === builderStoryScenarios.empty;
  const detail = scenario === builderStoryScenarios.detail;
  const pending = scenario === builderStoryScenarios.pending;
  const saving = scenario === builderStoryScenarios.saving;
  const mode = detail
    ? comboWhiteboardModes.detailReadOnly
    : pending
      ? comboWhiteboardModes.pendingTruncate
      : saving
        ? comboWhiteboardModes.savingFrozen
        : empty
          ? comboWhiteboardModes.emptyActive
          : comboWhiteboardModes.builderEditable;
  const steps = empty
    ? []
    : denseStepDefinitions.map((step) => ({
        ...step,
        actions: {
          details: preparedAction(`${step.id}-details`, "Move details"),
          pickUp: preparedAction(`${step.id}-pick-up`, "Pick up"),
          remove: preparedAction(`${step.id}-remove`, "Remove"),
          replace: preparedAction(`${step.id}-replace`, "Replace"),
          undo: preparedAction(`${step.id}-undo`, "Undo to here"),
        },
      }));

  return {
    boundaryIndex: pending ? 6 : undefined,
    candidates: [
      {
        available: true,
        detailsAction: preparedAction("candidate-safe-ender-details", "Candidate details"),
        id: "candidate-safe-ender",
        label: "Safe ender",
        metaItems: [
          availableMeta("candidate-safe-level", "Attack", "Mid", uiToneModes.accent),
          availableMeta("candidate-safe-role", "Role", "Safe ender", uiToneModes.success),
          availableMeta("candidate-safe-cost", "Meter", "0 bars"),
        ],
        notation: [["B", "3"]],
        notationLabel: "Back three",
      },
      {
        available: true,
        detailsAction: preparedAction("candidate-extension-details", "Candidate details"),
        id: "candidate-extension",
        label: "Meter extension",
        metaItems: [
          availableMeta("candidate-extension-role", "Role", "Extension", uiToneModes.success),
          availableMeta("candidate-extension-cost", "Meter", "1 bar", uiToneModes.warning),
        ],
        notation: [["D", "F", "2"], ["EX"]],
        notationLabel: "Down forward two, enhanced",
      },
      {
        available: false,
        disabledReason: "The prepared link window is too short for this move.",
        id: "candidate-slow-launcher",
        label: "Slow launcher",
        metaItems: [
          availableMeta("candidate-slow-role", "Role", "Launcher", uiToneModes.success),
          unavailableMeta(
            "candidate-slow-link",
            "Link",
            "The prepared link window is too short for this move.",
          ),
        ],
        notation: [["D", "B", "4"]],
        notationLabel: "Down back four",
      },
    ],
    contextSummary: [
      { id: "fighter", label: "Fighter", value: "Prepared fighter" },
      { id: "position", label: "Position", value: "Midscreen" },
    ],
    detailActions: detail
      ? {
          duplicateSeededCombo: preparedAction("duplicate", "Duplicate combo"),
          editCustomCombo: preparedAction("edit", "Edit custom combo"),
        }
      : undefined,
    gaps: Array.from({ length: steps.length + 1 }, (_, index) => ({
      actions: {
        drop: preparedAction(`drop-${index}`, "Drop here"),
        insert: preparedAction(`insert-${index}`, "Insert move"),
      },
      id: `gap-${index}`,
      index,
      label:
        index === 0
          ? "Insert before the first move"
          : index === steps.length
            ? "Insert after the last move"
            : `Insert between moves ${index} and ${index + 1}`,
    })),
    groups: [
      { candidateIds: ["candidate-safe-ender"], id: "group-safe", label: "Safe" },
      { candidateIds: ["candidate-extension"], id: "group-extension", label: "Extensions" },
      { candidateIds: ["candidate-slow-launcher"], id: "group-launcher", label: "Launchers" },
    ],
    label: "Combo whiteboard",
    labels: whiteboardLabels,
    mode,
    responsiveFocus: { responsiveMode },
    runtimeSummary: [
      { id: "route-length", label: "Route", value: empty ? "Empty" : "10 moves" },
      { id: "meter", label: "Meter cost", value: empty ? "0 bars" : "1 bar" },
    ],
    steps,
    transitions: empty ? [] : denseTransitions,
    truncateConfirmation: pending
      ? {
          cancelAction: preparedAction("cancel-truncate", "Keep original path"),
          confirmAction: preparedAction("confirm-truncate", "Use valid prefix"),
          id: "truncate-1",
          message: "The edited suffix is outside the prepared timing window.",
          reason: "The transition after Dash link has a six-frame gap and cannot continue.",
        }
      : undefined,
  };
};

const frameLabels = {
  closeDetails: "Close details",
  details: "Frame details",
  focusMatchingWhiteboardStep: "Focus matching Whiteboard move",
  lifecycle: {
    [comboFrameMeterLifecycles.pendingTruncate]: "Review the invalid transition before truncating.",
    [comboFrameMeterLifecycles.ready]: "Frame snapshot ready.",
    [comboFrameMeterLifecycles.repairReview]: "Review the prepared repair boundary.",
    [comboFrameMeterLifecycles.savingFrozen]:
      "Saving; the frame grid is frozen and remains visible.",
  },
  scope: "Frame scope",
  selectedMove: "Selected move",
  wholeCombo: "Whole combo",
} as const;

type FrameSegmentInput = {
  cellCount: number;
  details?: ComboFrameMeterSegment["details"];
  id: string;
  kind: ComboFrameMeterSegment["kind"];
  label: string;
  matchingWhiteboardStepId?: string;
  rangeLabel: string;
  reason?: string;
  startCell: number;
  summary: string;
  validity?: ComboFrameMeterSegment["validity"];
  validityLabel?: string;
};

const frameSegment = (input: FrameSegmentInput): ComboFrameMeterSegment => ({
  cellCount: input.cellCount,
  details: input.details ?? [],
  id: input.id,
  kind: input.kind,
  label: input.label,
  rangeLabel: input.rangeLabel,
  startCell: input.startCell,
  summary: input.summary,
  validity: input.validity ?? comboFrameMeterSegmentValidities.valid,
  validityLabel: input.validityLabel ?? "Valid",
  ...(input.matchingWhiteboardStepId
    ? { matchingWhiteboardStepId: input.matchingWhiteboardStepId }
    : {}),
  ...(input.reason ? { reason: input.reason } : {}),
});

const phaseLegendCategory = { id: "phases", label: "Phases" } as const;
const metaLegendCategory = { id: "meta", label: "Meta" } as const;

const phaseLegend = [
  {
    category: phaseLegendCategory,
    description: "Frames before the move can hit",
    id: "legend-startup",
    kind: comboFrameMeterSegmentKinds.startup,
    label: "Startup",
  },
  {
    category: phaseLegendCategory,
    description: "Frames with an active hitbox",
    id: "legend-active",
    kind: comboFrameMeterSegmentKinds.active,
    label: "Active",
  },
  {
    category: phaseLegendCategory,
    description: "Frames before the fighter can act again",
    id: "legend-recovery",
    kind: comboFrameMeterSegmentKinds.recovery,
    label: "Recovery",
  },
] as const;

const unavailableFrameSnapshot = (id: string, label: string, reason: string) =>
  ({
    grid: {
      label,
      reason,
      state: comboFrameMeterGridStates.unavailable,
    },
    id,
    label: "Combo frame meter",
    summary: [],
    summaryLabel: "Frame summary",
    timelineLabel: "Frame-by-frame timeline",
  }) satisfies ComboFrameMeterSnapshot;

const buildSelectedFrameSnapshot = (scenario: BuilderStoryScenario): ComboFrameMeterSnapshot => {
  if (scenario === builderStoryScenarios.empty) {
    return unavailableFrameSnapshot(
      "selected-empty",
      "No selected move",
      "Select or append a move before inspecting its frame timeline.",
    );
  }
  if (scenario === builderStoryScenarios.unavailable) {
    return unavailableFrameSnapshot(
      "selected-unavailable",
      "Verified frame grid unavailable",
      "The prepared source has no verified frame ranges, so no frame cells are inferred.",
    );
  }

  return {
    grid: {
      cellCount: 31,
      legend: phaseLegend,
      legendLabel: "Frame phase legend",
      sections: [
        {
          cellCount: 31,
          id: "selected-step-1",
          label: "Quick jab",
          matchingWhiteboardStepId: "step-1",
          startCell: 0,
        },
      ],
      state: comboFrameMeterGridStates.available,
      tracks: [
        {
          id: "selected-primary",
          kind: comboFrameMeterTrackKinds.primary,
          label: "Player",
          segments: [
            frameSegment({
              cellCount: 8,
              details: [
                { frameValue: 8, id: "selected-startup-count", label: "Frames", value: "8" },
              ],
              id: "step-1-startup",
              kind: comboFrameMeterSegmentKinds.startup,
              label: "Startup",
              matchingWhiteboardStepId: "step-1",
              rangeLabel: "Frames 1–8",
              startCell: 0,
              summary: "Prepared startup range for Quick jab.",
            }),
            frameSegment({
              cellCount: 4,
              details: [
                { frameValue: 4, id: "selected-active-count", label: "Frames", value: "4" },
              ],
              id: "step-1-active",
              kind: comboFrameMeterSegmentKinds.active,
              label: "Active",
              matchingWhiteboardStepId: "step-1",
              rangeLabel: "Frames 9–12",
              startCell: 8,
              summary: "Prepared active range for Quick jab.",
            }),
            frameSegment({
              cellCount: 19,
              details: [
                { frameValue: 19, id: "selected-recovery-count", label: "Frames", value: "19" },
              ],
              id: "step-1-recovery",
              kind: comboFrameMeterSegmentKinds.recovery,
              label: "Recovery",
              matchingWhiteboardStepId: "step-1",
              rangeLabel: "Frames 13–31",
              startCell: 12,
              summary: "Prepared recovery range for Quick jab.",
            }),
          ],
        },
      ],
    },
    id: "selected-move-frame-snapshot",
    label: "Combo frame meter",
    summary: [
      { frameValue: 8, id: "startup", label: "Startup", value: "8f" },
      { frameValue: 31, id: "total", label: "Total", value: "31f" },
      { frameValue: -2, id: "advantage", label: "Advantage", value: "−2" },
    ],
    summaryLabel: "Selected move frame summary",
    timelineLabel: "Quick jab frame-by-frame timeline",
  };
};

const wholeSectionDefinitions = [
  { active: 2, cellCount: 11, label: "Quick jab", startup: 4, stepId: "step-1" },
  { active: 2, cellCount: 12, label: "Rising knee", startup: 5, stepId: "step-2" },
  { active: 3, cellCount: 10, label: "Air string", startup: 3, stepId: "step-3" },
  { active: 2, cellCount: 9, label: "Air extension", startup: 3, stepId: "step-4" },
  { active: 2, cellCount: 12, label: "Re-launch kick", startup: 5, stepId: "step-5" },
  { active: 2, cellCount: 10, label: "Dash link", startup: 4, stepId: "step-6" },
  { active: 3, cellCount: 11, label: "Corner carry", startup: 4, stepId: "step-7" },
  { active: 2, cellCount: 13, label: "Meter extension", startup: 6, stepId: "step-8" },
  { active: 2, cellCount: 9, label: "Reset check", startup: 3, stepId: "step-9" },
  { active: 3, cellCount: 13, label: "Safe ender", startup: 5, stepId: "step-10" },
] as const;

const transitionKinds = [
  comboFrameMeterSegmentKinds.link,
  comboFrameMeterSegmentKinds.cancel,
  comboFrameMeterSegmentKinds.juggle,
  comboFrameMeterSegmentKinds.juggle,
  comboFrameMeterSegmentKinds.link,
  comboFrameMeterSegmentKinds.link,
  comboFrameMeterSegmentKinds.cancel,
  comboFrameMeterSegmentKinds.juggle,
  comboFrameMeterSegmentKinds.link,
] as const;

const buildWholeFrameSnapshot = (scenario: BuilderStoryScenario): ComboFrameMeterSnapshot => {
  if (scenario === builderStoryScenarios.empty) {
    return unavailableFrameSnapshot(
      "whole-empty",
      "No combo timeline",
      "The empty combo has no prepared move or transition ranges.",
    );
  }
  if (scenario === builderStoryScenarios.unavailable) {
    return unavailableFrameSnapshot(
      "whole-unavailable",
      "Verified frame grid unavailable",
      "The prepared route lacks verified frame sources; the UI does not invent a timeline.",
    );
  }

  let nextStartCell = 0;
  const preparedSections = wholeSectionDefinitions.map((definition) => {
    const section = { ...definition, startCell: nextStartCell };
    nextStartCell += definition.cellCount;
    return section;
  });
  const primarySegments = preparedSections.flatMap((section) => {
    const activeStart = section.startCell + section.startup;
    const recoveryStart = activeStart + section.active;
    const recoveryCount = section.cellCount - section.startup - section.active;
    const phase = (
      id: string,
      label: string,
      kind: ComboFrameMeterSegment["kind"],
      startCell: number,
      cellCount: number,
    ) =>
      frameSegment({
        cellCount,
        details: [
          {
            frameValue: cellCount,
            id: `${section.stepId}-${id}-count`,
            label: "Frames",
            value: `${cellCount}`,
          },
        ],
        id: `${section.stepId}-${id}`,
        kind,
        label: `${section.label} ${label}`,
        matchingWhiteboardStepId: section.stepId,
        rangeLabel: `Frames ${startCell + 1}–${startCell + cellCount}`,
        startCell,
        summary: `${label} range for ${section.label}.`,
      });

    return [
      phase(
        "startup",
        "startup",
        comboFrameMeterSegmentKinds.startup,
        section.startCell,
        section.startup,
      ),
      phase("active", "active", comboFrameMeterSegmentKinds.active, activeStart, section.active),
      phase(
        "recovery",
        "recovery",
        comboFrameMeterSegmentKinds.recovery,
        recoveryStart,
        recoveryCount,
      ),
    ];
  });
  const pendingTransitionIndex = 5;
  const transitionSegments = preparedSections.slice(0, -1).map((section, index) => {
    const invalid = scenario === builderStoryScenarios.pending && index === pendingTransitionIndex;
    const nextSection = preparedSections[index + 1];
    const kind = transitionKinds[index] ?? comboFrameMeterSegmentKinds.transition;
    const label = kind.charAt(0).toUpperCase() + kind.slice(1);
    return frameSegment({
      cellCount: 3,
      id: `transition-${index + 1}`,
      kind,
      label: `${label}: ${section.label} → ${nextSection?.label ?? "next move"}`,
      matchingWhiteboardStepId: nextSection?.stepId,
      rangeLabel: `Cells ${section.startCell + section.cellCount - 1}–${section.startCell + section.cellCount + 1}`,
      reason: invalid
        ? "The next move begins after the prepared link window closes; review before truncating."
        : undefined,
      startCell: section.startCell + section.cellCount - 2,
      summary: `Prepared ${kind} window between adjacent Whiteboard moves.`,
      validity: invalid
        ? comboFrameMeterSegmentValidities.invalid
        : comboFrameMeterSegmentValidities.valid,
      validityLabel: invalid ? "Invalid transition" : "Valid",
    });
  });
  return {
    grid: {
      cellCount: nextStartCell,
      legend: [
        ...phaseLegend,
        {
          category: metaLegendCategory,
          description: "Prepared timing window between recovered moves",
          id: "legend-link",
          kind: comboFrameMeterSegmentKinds.link,
          label: "Link",
        },
        {
          category: metaLegendCategory,
          description: "Prepared window that interrupts recovery",
          id: "legend-cancel",
          kind: comboFrameMeterSegmentKinds.cancel,
          label: "Cancel",
        },
        {
          category: metaLegendCategory,
          description: "Prepared airborne continuation window",
          id: "legend-juggle",
          kind: comboFrameMeterSegmentKinds.juggle,
          label: "Juggle",
        },
      ],
      legendLabel: "Frame phase and meta legend",
      sections: preparedSections.map((section) => ({
        cellCount: section.cellCount,
        id: `${section.stepId}-section`,
        label: section.label,
        matchingWhiteboardStepId: section.stepId,
        startCell: section.startCell,
      })),
      state: comboFrameMeterGridStates.available,
      tracks: [
        {
          id: "whole-primary",
          kind: comboFrameMeterTrackKinds.primary,
          label: "Player",
          segments: primarySegments,
        },
        {
          id: "whole-meta",
          kind: comboFrameMeterTrackKinds.meta,
          label: "Meta",
          segments: transitionSegments,
        },
      ],
    },
    id: `whole-combo-frame-snapshot-${scenario}`,
    label: "Combo frame meter",
    summary: [
      { id: "move-count", label: "Moves", value: "10" },
      { frameValue: nextStartCell, id: "total", label: "Timeline", value: `${nextStartCell}f` },
      { id: "transition-count", label: "Transitions", value: "9" },
    ],
    summaryLabel: "Whole combo frame summary",
    timelineLabel: "Continuous whole-combo frame-by-frame timeline",
  };
};

const getFrameSegmentIds = (snapshot: ComboFrameMeterSnapshot) =>
  snapshot.grid.state === comboFrameMeterGridStates.available
    ? snapshot.grid.tracks.flatMap((track) => track.segments.map((segment) => segment.id))
    : [];

const actionDescriptors = [
  { action: builderActionBarActions.undoMove, available: true, id: "undo", label: "Undo move" },
  {
    action: builderActionBarActions.finishBuilder,
    available: true,
    id: "finish",
    label: "Finish combo",
  },
  {
    action: builderActionBarActions.cancelBuilder,
    available: true,
    id: "cancel",
    label: "Cancel builder",
  },
  {
    action: builderActionBarActions.openSavedComboAddToList,
    available: true,
    id: "open-saved-combo-add-to-list",
    label: "Add saved combo to list",
  },
] as const satisfies readonly BuilderActionBarActionDescriptor[];

function BuilderComponentsStoryContent(props: BuilderComponentsStoryArgs) {
  const source = useMemo(
    () => buildWhiteboardSource(props.scenario, props.responsiveMode),
    [props.responsiveMode, props.scenario],
  );
  const shouldInspectFirstMove =
    props.scenario === builderStoryScenarios.selected ||
    props.scenario === builderStoryScenarios.detail ||
    props.scenario === builderStoryScenarios.unavailable;
  const initialFocus = shouldInspectFirstMove
    ? ({ kind: comboWhiteboardFocusTargetKinds.step, stepId: "step-1" } as const)
    : undefined;
  const whiteboard = useComboWhiteboardModel({
    initialPresentation: initialFocus ? { focusTarget: initialFocus } : undefined,
    source,
  });
  const inspectionTarget = useMemo<ComboFrameMeterInspectionTarget | undefined>(() => {
    switch (whiteboard.state.focusTarget.kind) {
      case comboWhiteboardFocusTargetKinds.candidate:
        return {
          id: whiteboard.state.focusTarget.candidateId,
          kind: comboFrameMeterInspectionTargetKinds.candidate,
        };
      case comboWhiteboardFocusTargetKinds.step:
        return {
          id: whiteboard.state.focusTarget.stepId,
          kind: comboFrameMeterInspectionTargetKinds.step,
        };
      case comboWhiteboardFocusTargetKinds.gap:
      case comboWhiteboardFocusTargetKinds.none:
        return undefined;
    }
  }, [whiteboard.state.focusTarget]);
  const selectedSnapshot = useMemo(
    () => buildSelectedFrameSnapshot(props.scenario),
    [props.scenario],
  );
  const wholeSnapshot = useMemo(() => buildWholeFrameSnapshot(props.scenario), [props.scenario]);
  const segmentIds = useMemo(
    () =>
      Array.from(
        new Set([...getFrameSegmentIds(selectedSnapshot), ...getFrameSegmentIds(wholeSnapshot)]),
      ),
    [selectedSnapshot, wholeSnapshot],
  );
  const frameMeter = useComboFrameMeterModel({
    initialDetailsSegmentId:
      props.scenario === builderStoryScenarios.selected ||
      props.scenario === builderStoryScenarios.saving
        ? "step-1-startup"
        : undefined,
    initialScope:
      props.scenario === builderStoryScenarios.whole ||
      props.scenario === builderStoryScenarios.pending
        ? comboFrameMeterScopes.wholeCombo
        : undefined,
    inspectionTarget,
    segmentIds,
  });
  const frameSnapshot =
    frameMeter.state.scope === comboFrameMeterScopes.selectedMove
      ? selectedSnapshot
      : wholeSnapshot;
  const [activity, setActivity] = useState("Builder presentation ready");
  const lifecycle =
    props.scenario === builderStoryScenarios.pending
      ? comboFrameMeterLifecycles.pendingTruncate
      : props.scenario === builderStoryScenarios.saving
        ? comboFrameMeterLifecycles.savingFrozen
        : comboFrameMeterLifecycles.ready;
  const actionState =
    props.scenario === builderStoryScenarios.saving
      ? builderActionBarStates.saving
      : props.scenario === builderStoryScenarios.error
        ? builderActionBarStates.saveError
        : props.scenario === builderStoryScenarios.saved
          ? builderActionBarStates.saved
          : builderActionBarStates.idle;
  const savedComboId =
    actionState === builderActionBarStates.saved ? "combo-story-saved-42" : undefined;
  const actionStatus =
    actionState === builderActionBarStates.saveError
      ? "The combo could not be saved. Prepared work is preserved."
      : actionState === builderActionBarStates.saving
        ? "Saving combo…"
        : actionState === builderActionBarStates.saved
          ? "Combo saved. It is ready to add to a list."
          : activity;

  return (
    <StoryFrame contrast={props.contrast} responsiveMode={props.responsiveMode} theme={props.theme}>
      <Panel
        className={
          props.scenario === builderStoryScenarios.narrow
            ? "w-full max-w-[28rem] justify-self-center gap-4 p-4"
            : "w-full gap-4 p-4"
        }
      >
        <ComboWhiteboard
          model={whiteboard}
          notationDisplayMode={notationDisplayModes.FGC}
          onRequestAction={(intent) => setActivity(`Whiteboard: ${intent.action}`)}
          source={source}
          sourceSurface="builder-story"
        />
        <ComboFrameMeter
          labels={frameLabels}
          lifecycle={lifecycle}
          model={frameMeter}
          onRequestAction={(intent) => {
            if (intent.action === comboFrameMeterActions.focusMatchingWhiteboardStep) {
              whiteboard.methods.focusStep(intent.whiteboardStepId);
            }
            setActivity(`Frame Meter: ${intent.action}`);
          }}
          responsiveMode={props.responsiveMode}
          snapshot={frameSnapshot}
          sourceSurface="builder-story"
        />
        <div
          className="sticky bottom-0 z-20 min-w-0 bg-(--ui-window) pt-2 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]"
          data-page-owned-builder-dock
        >
          <BuilderActionBar
            actions={actionDescriptors}
            dirty={source.steps.length > 0 && actionState !== builderActionBarStates.saved}
            label="Builder actions"
            onRequestAction={(intent) => setActivity(`Action Bar: ${intent.action}`)}
            responsiveMode={props.responsiveMode}
            savedComboId={savedComboId}
            sourceSurface="builder-story"
            state={actionState}
            status={actionStatus}
          />
        </div>
      </Panel>
    </StoryFrame>
  );
}

function BuilderComponentsStorySurface(props: BuilderComponentsStoryArgs) {
  return (
    <BuilderComponentsStoryContent key={`${props.scenario}:${props.responsiveMode}`} {...props} />
  );
}

const meta = {
  args: {
    contrast: uiContrastModes.standard,
    responsiveMode: uiResponsiveModes.desktop,
    scenario: builderStoryScenarios.editable,
    theme: uiThemeModes.dark,
  },
  argTypes: {
    contrast: {
      control: "select",
      options: [uiContrastModes.standard, uiContrastModes.increased],
    },
    responsiveMode: {
      control: "select",
      options: [uiResponsiveModes.mobile, uiResponsiveModes.tablet, uiResponsiveModes.desktop],
    },
    scenario: { control: "select", options: Object.values(builderStoryScenarios) },
    theme: { control: "select", options: [uiThemeModes.dark, uiThemeModes.light] },
  },
  component: BuilderComponentsStorySurface,
  globals: storyViewportGlobals.desktop,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Components/Builder Workspace",
} satisfies Meta<typeof BuilderComponentsStorySurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditableDesktop: Story = {};

export const MobileEmpty: Story = {
  args: { responsiveMode: uiResponsiveModes.mobile, scenario: builderStoryScenarios.empty },
  globals: storyViewportGlobals.mobile,
};

export const MobilePendingTruncate: Story = {
  args: { responsiveMode: uiResponsiveModes.mobile, scenario: builderStoryScenarios.pending },
  globals: storyViewportGlobals.mobile,
};

export const DetailReadOnly: Story = {
  args: { scenario: builderStoryScenarios.detail },
};

export const SelectedMoveScope: Story = {
  args: { scenario: builderStoryScenarios.selected },
};

export const MobileSelectedSegmentTooltip: Story = {
  args: { responsiveMode: uiResponsiveModes.mobile, scenario: builderStoryScenarios.selected },
  globals: storyViewportGlobals.mobile,
};

export const SelectedMoveLightIncreasedContrast: Story = {
  args: {
    contrast: uiContrastModes.increased,
    scenario: builderStoryScenarios.selected,
    theme: uiThemeModes.light,
  },
};

export const WholeComboWithMeta: Story = {
  args: { scenario: builderStoryScenarios.whole },
};

export const UnavailableFrameData: Story = {
  args: { scenario: builderStoryScenarios.unavailable },
};

export const SavingFrozen: Story = {
  args: { scenario: builderStoryScenarios.saving },
};

export const SaveError: Story = {
  args: { scenario: builderStoryScenarios.error },
};

export const SavedDock: Story = {
  args: { scenario: builderStoryScenarios.saved },
};

export const DarkStandard: Story = {
  args: { contrast: uiContrastModes.standard, theme: uiThemeModes.dark },
};

export const LightStandard: Story = {
  args: { contrast: uiContrastModes.standard, theme: uiThemeModes.light },
};

export const DarkIncreasedContrast: Story = {
  args: { contrast: uiContrastModes.increased, theme: uiThemeModes.dark },
};

export const LightIncreasedContrast: Story = {
  args: { contrast: uiContrastModes.increased, theme: uiThemeModes.light },
};

export const NarrowContainerNoClipping: Story = {
  args: { responsiveMode: uiResponsiveModes.tablet, scenario: builderStoryScenarios.narrow },
  globals: storyViewportGlobals.tablet,
};
