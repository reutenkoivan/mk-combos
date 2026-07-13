import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { notationDisplayModes } from "@mk-combos/contracts/settings/value";
import { act, fireEvent, render, screen } from "@mk-combos/contracts/test/unit/react";
import {
  ComboFrameMeter,
  type ComboFrameMeterInspectionTarget,
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
} from "@mk-combos/ui/components/combo-frame-meter";
import {
  ComboWhiteboard,
  type ComboWhiteboardIntent,
  type ComboWhiteboardModel,
  type ComboWhiteboardPresentationOptions,
  type ComboWhiteboardSource,
  comboWhiteboardActions,
  comboWhiteboardEditOperations,
  comboWhiteboardFocusTargetKinds,
  comboWhiteboardLocalMenuStates,
  comboWhiteboardMetaStatuses,
  comboWhiteboardModes,
  comboWhiteboardPickUpStates,
  useComboWhiteboardModel,
} from "@mk-combos/ui/components/combo-whiteboard";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { uiFocusDirections } from "@mk-combos/ui/focus-navigation/value";
import { uiToneModes } from "@mk-combos/ui/tokens/value";
import type { ComponentProps } from "react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  comboWhiteboardTargetKinds,
  comboWhiteboardTargetRecipe,
  comboWhiteboardTargetStates,
} from "./recipes/combo-whiteboard-target";

const uiStylesSource = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

const labels = {
  afterTarget: "Move after target",
  appendTarget: "Append move",
  beforeTarget: "Move before target",
  board: "Combo path",
  cancelPickUp: "Cancel reorder",
  candidates: "Move candidates",
  closeMenu: "Close step menu",
  closePicker: "Close move picker",
  comboEnd: "End of combo",
  comboStart: "Start of combo",
  continuationFromPreviousRow: "Continued from previous row",
  continuationToNextRow: "Continues on next row",
  contextSummary: "Context summary",
  emptyPath: "No moves yet",
  groups: "Move groups",
  hints: ["Use directional focus to move through the builder"],
  insertTarget: "Insert move",
  invalidBoundary: "Invalid continuation",
  loadingCandidates: "Loading moves",
  menu: "Whiteboard target menu",
  nextGroup: "Next move group",
  noCandidates: "No matching moves",
  picker: "Move picker",
  previousGroup: "Previous move group",
  reorderTarget: "Choose a drop target",
  replaceTarget: "Replace move",
  runtimeSummary: "Runtime summary",
  saving: "Saving combo path",
  useAppendTarget: "Use append target",
} as const;

const truncateConfirmation = {
  cancelAction: {
    available: true,
    id: "cancel-truncate",
    label: "Keep full path",
  },
  confirmAction: {
    available: true,
    id: "confirm-truncate",
    label: "Truncate invalid tail",
  },
  id: "truncate-1",
  message: "Truncate after the valid prefix?",
  reason: "The second move no longer connects.",
} as const;

const detailActions = {
  duplicateSeededCombo: {
    available: true,
    id: "duplicate-seeded",
    label: "Duplicate seeded combo",
  },
  editCustomCombo: {
    available: true,
    id: "edit-custom",
    label: "Edit custom combo",
  },
} as const;

const repairAction = {
  available: true,
  id: "repair-prefix",
  label: "Repair from valid prefix",
} as const;

const focusScope = {
  availableCommandIds: [],
  entryTargetId: "wb-step-1",
  fallbackTargetId: "wb-step-1",
  id: "whiteboard-focus-scope",
  targets: [
    {
      id: "wb-step-1",
      neighbors: { right: "wb-gap-1" },
    },
    {
      id: "wb-gap-1",
      neighbors: { left: "wb-step-1", right: "wb-candidate-a" },
    },
    {
      id: "wb-candidate-a",
      neighbors: { left: "wb-gap-1" },
    },
  ],
} as const;

const baseSource = {
  candidates: [
    {
      available: true,
      detailsAction: {
        available: true,
        id: "candidate-a-details",
        label: "Inspect standing jab",
      },
      focusTargetId: "wb-candidate-a",
      id: "candidate-a",
      label: "Standing jab",
      metaItems: [
        {
          id: "category",
          label: "Normal",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.neutral,
        },
        {
          id: "role",
          label: "Pressure",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.accent,
        },
        {
          id: "cost",
          label: "Meter",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.success,
          value: "0",
        },
      ],
      notation: [["1"]],
      notationLabel: "One",
    },
    {
      available: false,
      detailsAction: {
        available: true,
        id: "candidate-disabled-details",
        label: "Explain blocked uppercut",
      },
      disabledReason: "Requires a launcher",
      focusTargetId: "wb-candidate-disabled",
      id: "candidate-disabled",
      label: "Blocked uppercut",
      metaItems: [
        {
          id: "category",
          label: "Normal",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.neutral,
        },
        {
          id: "attack-level",
          label: "Attack level",
          reason: "Verified level unavailable",
          status: comboWhiteboardMetaStatuses.unavailable,
          tone: uiToneModes.warning,
        },
      ],
      notation: [["D", "2"]],
      notationLabel: "Down two",
    },
    {
      available: true,
      focusTargetId: "wb-candidate-b",
      id: "candidate-b",
      label: "Forward kick",
      metaItems: [
        {
          id: "category",
          label: "Normal",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.neutral,
        },
        {
          id: "role",
          label: "Advancing",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.accent,
        },
      ],
      notation: [["F", "3"]],
      notationLabel: "Forward three",
    },
  ],
  contextSummary: [{ id: "character", label: "Character", value: "Test fighter" }],
  detailActions,
  gaps: [
    {
      actions: {
        drop: { available: true, id: "drop-gap-0", label: "Drop before first move" },
        insert: { available: true, id: "insert-gap-0", label: "Insert before first move" },
      },
      focusTargetId: "wb-gap-0",
      id: "gap-0",
      index: 0,
      label: "Before first move",
    },
    {
      actions: {
        drop: { available: true, id: "drop-gap-1", label: "Drop between moves" },
        insert: { available: true, id: "insert-gap-1", label: "Insert between moves" },
      },
      focusTargetId: "wb-gap-1",
      id: "gap-1",
      index: 1,
      label: "Between moves",
    },
    {
      actions: {
        drop: { available: true, id: "drop-gap-2", label: "Drop after last move" },
        insert: { available: true, id: "insert-gap-2", label: "Insert after last move" },
      },
      focusTargetId: "wb-gap-2",
      id: "gap-2",
      index: 2,
      label: "After last move",
    },
  ],
  groups: [
    {
      available: true,
      candidateIds: ["candidate-a", "candidate-disabled"],
      id: "group-a",
      label: "Normals",
    },
    {
      available: true,
      candidateIds: ["candidate-b"],
      id: "group-b",
      label: "Kicks",
    },
  ],
  label: "Combo whiteboard",
  labels,
  mode: comboWhiteboardModes.builderEditable,
  pickerMessage: "Prepared for the current path",
  repairAction,
  responsiveFocus: {
    navigationScope: focusScope,
    responsiveMode: uiResponsiveModes.desktop,
  },
  runtimeSummary: [{ id: "damage", label: "Damage", value: "18%" }],
  steps: [
    {
      accessibleLabel: "Step 1: Starter jab",
      actions: {
        details: { available: true, id: "step-1-details", label: "Open step details" },
        pickUp: { available: true, id: "step-1-pick-up", label: "Pick up starter jab" },
        remove: { available: true, id: "step-1-remove", label: "Remove starter jab" },
        replace: { available: true, id: "step-1-replace", label: "Replace starter jab" },
        undo: { available: true, id: "step-1-undo", label: "Undo to starter jab" },
      },
      focusTargetId: "wb-step-1",
      id: "step-1",
      label: "Starter jab",
      metaItems: [
        {
          id: "category",
          label: "Normal",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.neutral,
        },
        {
          id: "role",
          label: "Starter",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.accent,
        },
        {
          id: "cost",
          label: "Meter",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.success,
          value: "0",
        },
      ],
      notation: [["1"]],
      notationLabel: "One",
    },
    {
      accessibleLabel: "Step 2: Follow-up kick",
      actions: {
        details: { available: true, id: "step-2-details", label: "Open follow-up details" },
        pickUp: { available: true, id: "step-2-pick-up", label: "Pick up follow-up kick" },
        remove: { available: true, id: "step-2-remove", label: "Remove follow-up kick" },
        replace: { available: true, id: "step-2-replace", label: "Replace follow-up kick" },
        undo: { available: true, id: "step-2-undo", label: "Undo to follow-up kick" },
      },
      focusTargetId: "wb-step-2",
      id: "step-2",
      label: "Follow-up kick",
      metaItems: [
        {
          id: "category",
          label: "Normal",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.neutral,
        },
        {
          id: "role",
          label: "Follow-up",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.accent,
        },
      ],
      notation: [["F", "3"]],
      notationLabel: "Forward three",
    },
  ],
  transitions: [
    {
      fromStepId: "step-1",
      metaItems: [
        {
          id: "kind",
          label: "Link",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.accent,
        },
        {
          id: "gap",
          label: "Gap",
          status: comboWhiteboardMetaStatuses.available,
          tone: uiToneModes.neutral,
          value: "2f",
        },
      ],
      toStepId: "step-2",
    },
  ],
  truncateConfirmation,
} as const satisfies ComboWhiteboardSource;

const makeSource = (
  mode: ComboWhiteboardSource["mode"] = comboWhiteboardModes.builderEditable,
  overrides: Partial<ComboWhiteboardSource> = {},
): ComboWhiteboardSource => ({
  ...baseSource,
  mode,
  ...overrides,
});

const makeDenseSource = (
  stepCount: number,
  responsiveMode: (typeof uiResponsiveModes)[keyof typeof uiResponsiveModes],
): ComboWhiteboardSource => {
  const steps = Array.from({ length: stepCount }, (_, index) => ({
    accessibleLabel: `Step ${index + 1}: Dense move ${index + 1}`,
    focusTargetId: `dense-step-target-${index + 1}`,
    id: `dense-step-${index + 1}`,
    label:
      index === 3
        ? "A deliberately long prepared move label that wraps without clipping"
        : `Dense move ${index + 1}`,
    metaItems: index % 2 === 0 ? baseSource.steps[0].metaItems : baseSource.steps[1].metaItems,
    notation: index % 2 === 0 ? [["1"]] : [["F", "3"]],
  }));
  const gaps = Array.from({ length: stepCount + 1 }, (_, index) => ({
    actions: {
      drop: { available: true, id: `dense-drop-${index}`, label: `Drop at ${index}` },
      insert: { available: true, id: `dense-insert-${index}`, label: `Insert at ${index}` },
    },
    focusTargetId: `dense-gap-target-${index}`,
    id: `dense-gap-${index}`,
    index,
    label: `Insert target ${index}`,
  }));
  const transitions = steps.slice(1).map((step, index) => ({
    fromStepId: `dense-step-${index + 1}`,
    metaItems: baseSource.transitions[0].metaItems,
    toStepId: step.id,
  }));

  return makeSource(comboWhiteboardModes.builderEditable, {
    gaps,
    responsiveFocus: { responsiveMode },
    steps,
    transitions,
  });
};

const requireModel = (model: ComboWhiteboardModel | undefined): ComboWhiteboardModel => {
  if (!model) {
    throw new Error("Combo Whiteboard model harness did not render");
  }
  return model;
};

type WhiteboardHarnessProps = {
  initialPresentation?: ComboWhiteboardPresentationOptions;
  onRequestAction?: NonNullable<ComponentProps<typeof ComboWhiteboard>["onRequestAction"]>;
  source: ComboWhiteboardSource;
};

function WhiteboardHarness(props: WhiteboardHarnessProps) {
  const model = useComboWhiteboardModel({
    initialPresentation: props.initialPresentation,
    source: props.source,
  });

  return (
    <ComboWhiteboard
      model={model}
      notationDisplayMode={notationDisplayModes.FGC}
      onRequestAction={props.onRequestAction}
      source={props.source}
      sourceSurface="builder"
    />
  );
}

const openPickerFromGap = (gapId: string, actionLabel: string) => {
  const gap = document.querySelector<HTMLButtonElement>(
    `[data-ui-selectable-item="combo-gap-${gapId}"]`,
  );
  if (!gap) throw new Error(`Missing Whiteboard gap ${gapId}`);
  fireEvent.click(gap);
  fireEvent.click(screen.getByRole("menuitem", { name: actionLabel }));
  return screen.getByRole("dialog", { name: labels.picker });
};

const openAppendPicker = () => openPickerFromGap("gap-2", "Insert after last move");

const openReplacePicker = () => {
  const step = document.querySelector<HTMLButtonElement>(
    '[data-ui-selectable-item="combo-step-step-1"]',
  );
  if (!step) throw new Error("Missing Whiteboard step step-1");
  fireEvent.click(step);
  fireEvent.click(screen.getByRole("menuitem", { name: "Replace starter jab" }));
  return screen.getByRole("dialog", { name: labels.picker });
};

const intentBase = {
  mode: comboWhiteboardModes.builderEditable,
  reason: "press",
  sourceSurface: "hook-test",
} as const;

describe("useComboWhiteboardModel", () => {
  it("owns one exclusive focus target, moves through the prepared scope, and preserves no-op references", () => {
    const source = makeSource();
    let model: ComboWhiteboardModel | undefined;

    function Harness() {
      model = useComboWhiteboardModel({ source });
      return null;
    }

    const view = render(<Harness />);
    const initial = requireModel(model);
    view.rerender(<Harness />);
    expect(requireModel(model)).toBe(initial);

    act(() => initial.methods.focusStep("missing-step"));
    expect(requireModel(model)).toBe(initial);

    act(() => initial.methods.focusStep("step-1"));
    expect(requireModel(model).state.focusTarget).toEqual({
      kind: comboWhiteboardFocusTargetKinds.step,
      stepId: "step-1",
    });
    const focusedStep = requireModel(model);
    act(() => focusedStep.methods.focusStep("step-1"));
    expect(requireModel(model)).toBe(focusedStep);

    act(() => focusedStep.methods.moveFocus(uiFocusDirections.right));
    expect(requireModel(model).state.focusTarget).toEqual({
      gapId: "gap-1",
      kind: comboWhiteboardFocusTargetKinds.gap,
    });

    act(() => requireModel(model).methods.focusMoveCandidate("candidate-a"));
    expect(requireModel(model).state.focusTarget).toEqual({
      candidateId: "candidate-a",
      kind: comboWhiteboardFocusTargetKinds.candidate,
    });
    expect(Object.keys(requireModel(model).state).filter((key) => key.includes("focus"))).toEqual([
      "focusTarget",
    ]);
  });

  it("cycles groups and owns local menu, edit target, and pickup/drop presentation", () => {
    let model: ComboWhiteboardModel | undefined;

    function Harness() {
      model = useComboWhiteboardModel({ source: makeSource() });
      return null;
    }

    render(<Harness />);
    expect(requireModel(model).state.selectedGroupId).toBe("group-a");
    expect(requireModel(model).methods.getNextGroupId()).toBe("group-b");

    act(() => requireModel(model).methods.moveToNextGroup());
    expect(requireModel(model).state.selectedGroupId).toBe("group-b");
    act(() => requireModel(model).methods.moveToNextGroup());
    expect(requireModel(model).state.selectedGroupId).toBe("group-a");
    act(() => requireModel(model).methods.moveToPreviousGroup());
    expect(requireModel(model).state.selectedGroupId).toBe("group-b");

    act(() =>
      requireModel(model).methods.openLocalMenu({
        kind: comboWhiteboardFocusTargetKinds.step,
        stepId: "step-1",
      }),
    );
    expect(requireModel(model).state.localMenu).toEqual({
      state: comboWhiteboardLocalMenuStates.open,
      target: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "step-1" },
    });
    expect(requireModel(model).state.focusTarget).toEqual({
      kind: comboWhiteboardFocusTargetKinds.step,
      stepId: "step-1",
    });

    act(() =>
      requireModel(model).methods.setEditTarget({
        operation: comboWhiteboardEditOperations.replace,
        stepId: "step-1",
      }),
    );
    expect(requireModel(model).state.editTarget).toEqual({
      operation: comboWhiteboardEditOperations.replace,
      stepId: "step-1",
    });
    expect(requireModel(model).state.localMenu).toEqual({
      state: comboWhiteboardLocalMenuStates.closed,
    });

    act(() => requireModel(model).methods.pickUpStep("step-1"));
    act(() => requireModel(model).methods.setDropTarget("gap-2"));
    expect(requireModel(model).state.pickUp).toEqual({
      dropGapId: "gap-2",
      state: comboWhiteboardPickUpStates.pickedUp,
      stepId: "step-1",
    });
    act(() => requireModel(model).methods.dropPickedStep("gap-2"));
    expect(requireModel(model).state.pickUp).toEqual({
      state: comboWhiteboardPickUpStates.idle,
    });
    expect(requireModel(model).state.focusTarget).toEqual({
      gapId: "gap-2",
      kind: comboWhiteboardFocusTargetKinds.gap,
    });
  });

  it("resets deterministically and rebases stale presentation to safe source fallbacks", () => {
    const source = makeSource();
    let model: ComboWhiteboardModel | undefined;

    function Harness() {
      model = useComboWhiteboardModel({
        initialPresentation: {
          editTarget: { operation: comboWhiteboardEditOperations.replace, stepId: "step-2" },
          focusTarget: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "step-2" },
          localMenu: {
            state: comboWhiteboardLocalMenuStates.open,
            target: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "step-2" },
          },
          pickUp: {
            dropGapId: "gap-0",
            state: comboWhiteboardPickUpStates.pickedUp,
            stepId: "step-2",
          },
          selectedGroupId: "group-b",
        },
        source,
      });
      return null;
    }

    render(<Harness />);
    act(() => requireModel(model).methods.resetPresentation());
    expect(requireModel(model).state).toMatchObject({
      editTarget: { operation: comboWhiteboardEditOperations.append },
      focusTarget: { kind: comboWhiteboardFocusTargetKinds.none },
      localMenu: { state: comboWhiteboardLocalMenuStates.closed },
      pickUp: { state: comboWhiteboardPickUpStates.idle },
      selectedGroupId: "group-a",
    });
    const reset = requireModel(model);
    act(() => reset.methods.resetPresentation());
    expect(requireModel(model)).toBe(reset);

    const rebasedSource = makeSource(comboWhiteboardModes.builderEditable, {
      candidates: [
        {
          available: true,
          id: "candidate-new",
          label: "New candidate",
          metaItems: [
            {
              id: "category",
              label: "Normal",
              status: comboWhiteboardMetaStatuses.available,
              tone: uiToneModes.neutral,
            },
          ],
          notation: [["4"]],
        },
      ],
      gaps: [{ id: "gap-new", index: 0, label: "New gap" }],
      groups: [
        {
          available: true,
          candidateIds: ["candidate-new"],
          id: "group-new",
          label: "New group",
        },
      ],
      responsiveFocus: { responsiveMode: uiResponsiveModes.mobile },
      steps: [],
      transitions: [],
    });
    act(() =>
      requireModel(model).methods.rebasePresentation(rebasedSource, {
        editTarget: { gapId: "missing-gap", operation: comboWhiteboardEditOperations.insert },
        focusTarget: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "missing-step" },
        localMenu: {
          state: comboWhiteboardLocalMenuStates.open,
          target: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "missing-step" },
        },
        pickUp: {
          dropGapId: "missing-gap",
          state: comboWhiteboardPickUpStates.pickedUp,
          stepId: "missing-step",
        },
        selectedGroupId: "missing-group",
      }),
    );
    expect(requireModel(model).state).toEqual({
      editTarget: { operation: comboWhiteboardEditOperations.append },
      focusTarget: { kind: comboWhiteboardFocusTargetKinds.none },
      localMenu: { state: comboWhiteboardLocalMenuStates.closed },
      pickUp: { state: comboWhiteboardPickUpStates.idle },
      responsiveMode: uiResponsiveModes.mobile,
      selectedGroupId: "group-new",
      visibleCandidateIds: ["candidate-new"],
    });
  });

  it("normalizes semantic intents across unavailable candidates, detail/locked modes, and saving", () => {
    let model: ComboWhiteboardModel | undefined;

    function Harness() {
      model = useComboWhiteboardModel({ source: makeSource() });
      return null;
    }

    render(<Harness />);
    const blockedSelection = {
      ...intentBase,
      action: comboWhiteboardActions.selectMoveCandidate,
      candidateId: "candidate-disabled",
      editTarget: { operation: comboWhiteboardEditOperations.append },
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(blockedSelection)).toBeUndefined();

    const blockedFocus = {
      ...intentBase,
      action: comboWhiteboardActions.focusMoveCandidate,
      candidateId: "candidate-disabled",
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(blockedFocus)).toBeUndefined();

    const blockedDetails = {
      ...intentBase,
      action: comboWhiteboardActions.openCandidateDetails,
      candidateId: "candidate-disabled",
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(blockedDetails)).toBe(blockedDetails);

    const nonAdjacentGroup = {
      ...intentBase,
      action: comboWhiteboardActions.moveToNextGroup,
      groupId: "group-a",
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(nonAdjacentGroup)).toBeUndefined();
    const directGroup = {
      ...intentBase,
      action: comboWhiteboardActions.selectMoveGroup,
      groupId: "group-b",
    } as const satisfies ComboWhiteboardIntent;
    act(() => expect(requireModel(model).methods.normalizeIntent(directGroup)).toBe(directGroup));
    expect(requireModel(model).state.selectedGroupId).toBe("group-b");

    const pickUp = {
      ...intentBase,
      action: comboWhiteboardActions.pickUpStep,
      stepId: "step-1",
    } as const satisfies ComboWhiteboardIntent;
    act(() => expect(requireModel(model).methods.normalizeIntent(pickUp)).toBe(pickUp));
    const wrongCancel = {
      ...intentBase,
      action: comboWhiteboardActions.cancelPickUp,
      stepId: "step-2",
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(wrongCancel)).toBeUndefined();

    const unavailableSource = makeSource(comboWhiteboardModes.builderEditable, {
      candidates: baseSource.candidates.map((candidate) =>
        candidate.id === "candidate-a"
          ? {
              ...candidate,
              detailsAction: {
                available: false,
                disabledReason: "Candidate details are unavailable",
                id: "candidate-a-details",
                label: "Inspect standing jab",
              },
            }
          : candidate,
      ),
      gaps: baseSource.gaps.map((gap) =>
        gap.id === "gap-1"
          ? {
              ...gap,
              actions: {
                drop: {
                  available: false,
                  disabledReason: "Drop is unavailable",
                  id: "drop-gap-1",
                  label: "Drop between moves",
                },
                insert: {
                  available: false,
                  disabledReason: "Insert is unavailable",
                  id: "insert-gap-1",
                  label: "Insert between moves",
                },
              },
            }
          : gap,
      ),
      steps: baseSource.steps.map((step) =>
        step.id === "step-1"
          ? {
              ...step,
              actions: {
                details: {
                  available: false,
                  disabledReason: "Step details are unavailable",
                  id: "step-1-details",
                  label: "Open step details",
                },
                pickUp: {
                  available: false,
                  id: "step-1-pick-up",
                  label: "Pick up starter jab",
                },
                remove: {
                  available: false,
                  id: "step-1-remove",
                  label: "Remove starter jab",
                },
                replace: {
                  available: false,
                  id: "step-1-replace",
                  label: "Replace starter jab",
                },
                undo: {
                  available: false,
                  id: "step-1-undo",
                  label: "Undo to starter jab",
                },
              },
            }
          : step,
      ),
    });
    act(() => requireModel(model).methods.rebasePresentation(unavailableSource));
    for (const unavailableIntent of [
      { ...pickUp },
      {
        ...intentBase,
        action: comboWhiteboardActions.openStepDetails,
        stepId: "step-1",
      },
      {
        ...intentBase,
        action: comboWhiteboardActions.removeStep,
        stepId: "step-1",
      },
      {
        ...intentBase,
        action: comboWhiteboardActions.undoToStep,
        stepId: "step-1",
      },
      {
        ...intentBase,
        action: comboWhiteboardActions.openCandidateDetails,
        candidateId: "candidate-a",
      },
      {
        ...intentBase,
        action: comboWhiteboardActions.setEditTarget,
        editTarget: { operation: comboWhiteboardEditOperations.replace, stepId: "step-1" },
      },
    ] as const satisfies readonly ComboWhiteboardIntent[]) {
      expect(requireModel(model).methods.normalizeIntent(unavailableIntent)).toBeUndefined();
    }
    act(() =>
      requireModel(model).methods.setEditTarget({
        operation: comboWhiteboardEditOperations.replace,
        stepId: "step-1",
      }),
    );
    act(() => requireModel(model).methods.pickUpStep("step-1"));
    expect(requireModel(model).state).toMatchObject({
      editTarget: { operation: comboWhiteboardEditOperations.append },
      pickUp: { state: comboWhiteboardPickUpStates.idle },
    });

    const detailSource = makeSource(comboWhiteboardModes.detailReadOnly);
    act(() => requireModel(model).methods.rebasePresentation(detailSource));
    const detailSelection = {
      ...blockedSelection,
      candidateId: "candidate-a",
      mode: comboWhiteboardModes.detailReadOnly,
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(detailSelection)).toBeUndefined();
    const editDetail = {
      action: comboWhiteboardActions.editCustomCombo,
      actionId: "edit-custom",
      mode: comboWhiteboardModes.detailReadOnly,
      reason: "press",
      sourceSurface: "hook-test",
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(editDetail)).toBe(editDetail);

    const lockedSource = makeSource(comboWhiteboardModes.lockedPreview);
    act(() => requireModel(model).methods.rebasePresentation(lockedSource));
    const lockedCandidateDetails = {
      ...blockedDetails,
      mode: comboWhiteboardModes.lockedPreview,
    } as const satisfies ComboWhiteboardIntent;
    expect(requireModel(model).methods.normalizeIntent(lockedCandidateDetails)).toBeUndefined();

    const savingSource = makeSource(comboWhiteboardModes.savingFrozen);
    act(() => requireModel(model).methods.rebasePresentation(savingSource));
    const frozenModel = requireModel(model);
    const frozenFocus = {
      action: comboWhiteboardActions.focusStep,
      mode: comboWhiteboardModes.savingFrozen,
      reason: "triggerFocus",
      sourceSurface: "hook-test",
      stepId: "step-1",
    } as const satisfies ComboWhiteboardIntent;
    expect(frozenModel.methods.normalizeIntent(frozenFocus)).toBeUndefined();
    act(() => frozenModel.methods.focusStep("step-1"));
    expect(requireModel(model)).toBe(frozenModel);
  });
});

describe("ComboWhiteboard", () => {
  it("publishes exact meta statuses and renders three always-visible prepared badges", () => {
    expect(comboWhiteboardMetaStatuses).toEqual({
      available: "available",
      unavailable: "unavailable",
    });

    const view = render(<WhiteboardHarness source={makeSource()} />);
    const firstStep = view.container.querySelector('[data-ui-combo-whiteboard-step="step-1"]');
    openAppendPicker();
    const firstCandidate = screen.getByRole("button", { name: "Standing jab" });
    expect(firstStep?.querySelectorAll("[data-ui-badge]")).toHaveLength(3);
    expect(firstCandidate.querySelectorAll("[data-ui-badge]")).toHaveLength(3);
    expect(firstStep?.textContent).not.toContain("Damage");
    expect(screen.getByText("Verified level unavailable")).toBeTruthy();
    expect(document.querySelector('[data-meta-status="unavailable"]')?.className).toContain(
      "border-dashed",
    );
  });

  it("keeps a focused step on the same 176px flow geometry with an inset-only ring", () => {
    const view = render(<WhiteboardHarness source={makeSource()} />);
    const step = view.container.querySelector<HTMLElement>(
      '[data-ui-combo-whiteboard-step="step-1"]',
    );
    const flowNode = step?.closest<HTMLElement>(".react-flow__node");
    const stepControl = step?.querySelector<HTMLButtonElement>("button");
    const initialGeometry = flowNode?.getAttribute("style");

    expect(stepControl).toBeTruthy();
    if (stepControl) fireEvent.focus(stepControl);

    const focusedStep = view.container.querySelector<HTMLElement>(
      '[data-ui-combo-whiteboard-step="step-1"]',
    );
    expect(focusedStep?.dataset.focused).toBe("true");
    expect(focusedStep?.className).toContain("w-44");
    expect(focusedStep?.className).toContain("inset_0_0_0_4px_var(--ui-accent)");
    expect(focusedStep?.className).not.toContain("shadow-[var(--ui-focus-ring)]");
    expect(flowNode?.style.width).toBe("176px");
    expect(flowNode?.getAttribute("style")).toBe(initialGeometry);
  });

  it("renders all seven modes with the internal picker closed by default", () => {
    const modes = Object.values(comboWhiteboardModes);
    expect(modes).toHaveLength(7);
    const view = render(<WhiteboardHarness source={makeSource(modes[0])} />);

    for (const mode of modes) {
      const source = makeSource(mode, {
        ...(mode === comboWhiteboardModes.repairReview ? { boundaryIndex: 1 } : {}),
      });
      view.rerender(<WhiteboardHarness key={mode} source={source} />);
      const root = screen.getByLabelText(source.label);
      expect(root.getAttribute("data-ui-combo-whiteboard-mode")).toBe(mode);
      expect(screen.queryByRole("dialog", { name: labels.picker })).toBeNull();
      expect(root.getAttribute("aria-busy")).toBe(
        mode === comboWhiteboardModes.savingFrozen ? "true" : null,
      );
    }
  });

  it("wraps a dense path by prepared responsive width with dynamic height and row continuations", () => {
    const expectedLayout = [
      { cardsPerRow: 4, mode: uiResponsiveModes.desktop, rows: 2 },
      { cardsPerRow: 2, mode: uiResponsiveModes.tablet, rows: 4 },
      { cardsPerRow: 1, mode: uiResponsiveModes.mobile, rows: 8 },
    ] as const;
    const view = render(
      <WhiteboardHarness source={makeDenseSource(8, uiResponsiveModes.desktop)} />,
    );
    const heights: number[] = [];

    for (const expected of expectedLayout) {
      const denseSource = makeDenseSource(8, expected.mode);
      view.rerender(<WhiteboardHarness key={expected.mode} source={denseSource} />);
      const layout = view.container.querySelector<HTMLElement>(
        "[data-ui-combo-whiteboard-row-count]",
      );
      const canvas = view.container.querySelector<HTMLElement>(
        "[data-ui-combo-whiteboard-canvas-height]",
      );
      expect(layout?.dataset.uiComboWhiteboardCardsPerRow).toBe(String(expected.cardsPerRow));
      expect(layout?.dataset.uiComboWhiteboardRowCount).toBe(String(expected.rows));
      expect(view.container.querySelectorAll('[data-row-continuation="outgoing"]')).toHaveLength(
        expected.rows - 1,
      );
      expect(view.container.querySelectorAll('[data-row-continuation="incoming"]')).toHaveLength(
        expected.rows - 1,
      );
      expect(canvas?.className).not.toContain("overflow-hidden");
      expect(canvas?.className).not.toContain("h-72");
      for (const transition of denseSource.transitions) {
        const transitionNode = view.container.querySelector<HTMLElement>(
          `[data-id="transition:${transition.fromStepId}:${transition.toStepId}"]`,
        );
        const targetStepNode = view.container.querySelector<HTMLElement>(
          `[data-id="step:${transition.toStepId}"]`,
        );
        const transitionX = transitionNode?.style.transform.match(/translate\(([-\d.]+)px/)?.[1];
        const targetStepX = targetStepNode?.style.transform.match(/translate\(([-\d.]+)px/)?.[1];
        expect(transitionX).toBeDefined();
        expect(transitionX).toBe(targetStepX);
      }
      heights.push(Number(canvas?.dataset.uiComboWhiteboardCanvasHeight));
    }

    expect(heights[0]).toBeLessThan(heights[1] ?? 0);
    expect(heights[1]).toBeLessThan(heights[2] ?? 0);
    expect(
      screen.getByText("A deliberately long prepared move label that wraps without clipping"),
    ).toBeTruthy();
    expect(view.container.querySelectorAll("[data-ui-combo-whiteboard-transition]")).toHaveLength(
      7,
    );
    for (const transition of view.container.querySelectorAll(
      "[data-ui-combo-whiteboard-transition]",
    )) {
      expect(transition.closest("[data-ui-combo-whiteboard-gap]")).toBeNull();
    }
  });

  it("derives wrapping from the measured board width instead of the responsive label", () => {
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    const measurement = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return this.hasAttribute("data-ui-combo-whiteboard-row-count")
          ? new DOMRect(0, 0, 500, 0)
          : originalGetBoundingClientRect.call(this);
      });

    try {
      const view = render(
        <WhiteboardHarness source={makeDenseSource(8, uiResponsiveModes.desktop)} />,
      );
      const layout = view.container.querySelector<HTMLElement>(
        "[data-ui-combo-whiteboard-row-count]",
      );
      expect(layout?.dataset.uiComboWhiteboardCardsPerRow).toBe("1");
      expect(layout?.dataset.uiComboWhiteboardRowCount).toBe("8");
    } finally {
      measurement.mockRestore();
    }
  });

  it("opens the full picker from a target menu in a centered large composer layer", () => {
    const view = render(<WhiteboardHarness source={makeSource()} />);
    const board = view.container.querySelector("[data-ui-combo-whiteboard-row-count]");
    expect(screen.queryByRole("dialog", { name: labels.picker })).toBeNull();

    const dialog = openAppendPicker();
    const picker = document.querySelector<HTMLElement>("[data-ui-combo-whiteboard-picker]");
    const pickerWindow = document.querySelector<HTMLElement>(
      "[data-ui-combo-whiteboard-picker-window]",
    );
    const portal = document.querySelector<HTMLElement>(
      '[data-ui-portal="combo-whiteboard-picker"]',
    );
    const backdrop = document.querySelector<HTMLElement>(
      "[data-ui-combo-whiteboard-picker-backdrop]",
    );
    if (!board || !picker || !pickerWindow || !portal || !backdrop) {
      throw new Error("Whiteboard and centered internal picker must render");
    }
    expect(dialog).toBe(pickerWindow);
    expect(view.container.querySelector("[data-ui-combo-whiteboard-picker]")).toBeNull();
    expect(portal.contains(picker)).toBe(true);
    expect(backdrop.className).toContain("fixed");
    expect(backdrop.className).toContain("inset-0");
    expect(backdrop.className).toContain("place-items-center");
    expect(pickerWindow.className).toContain("w-[min(72rem,calc(100vw-2rem))]");
    expect(pickerWindow.className).toContain("max-h-[calc(100dvh-2rem)]");
    expect(pickerWindow.className).toContain("overflow-y-auto");
    expect(pickerWindow.className).toContain("var(--ui-popover)");
    expect(pickerWindow.className).toContain("var(--ui-shadow)");
    expect(picker.dataset.uiComboWhiteboardPickerLayout).toBe("horizontal");
    expect(screen.getAllByText(labels.appendTarget)).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Standing jab" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Inspect standing jab" })).toBeTruthy();
    const context = document.querySelector<HTMLElement>(
      "[data-ui-combo-whiteboard-picker-context]",
    );
    expect(context?.textContent).toContain("Follow-up kick");
    expect(context?.textContent).toContain(labels.appendTarget);
    expect(context?.textContent).toContain(labels.comboEnd);
  });

  it("dismisses by close or Escape, restores target focus without scrolling, and closes after proposal", () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    const onRequestAction = vi.fn();
    render(<WhiteboardHarness onRequestAction={onRequestAction} source={makeSource()} />);
    const appendTarget = document.querySelector<HTMLButtonElement>(
      '[data-ui-selectable-item="combo-gap-gap-2"]',
    );
    if (!appendTarget) throw new Error("Missing append target");

    openAppendPicker();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: labels.closePicker }));
    focusSpy.mockClear();
    fireEvent.click(screen.getByRole("button", { name: labels.closePicker }));
    expect(screen.queryByRole("dialog", { name: labels.picker })).toBeNull();
    expect(document.activeElement).toBe(appendTarget);
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });

    openAppendPicker();
    focusSpy.mockClear();
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: labels.picker })).toBeNull();
    expect(document.activeElement).toBe(appendTarget);
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });

    openAppendPicker();
    onRequestAction.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Standing jab" }));
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboWhiteboardActions.selectMoveCandidate,
        candidateId: "candidate-a",
        editTarget: { operation: comboWhiteboardEditOperations.append },
      }),
    );
    expect(screen.queryByRole("dialog", { name: labels.picker })).toBeNull();
    expect(document.activeElement).toBe(appendTarget);
    focusSpy.mockRestore();
  });

  it("shows truthful before/target/after context for insert, replace, and empty append", () => {
    const view = render(<WhiteboardHarness source={makeSource()} />);
    openPickerFromGap("gap-1", "Insert between moves");
    let context = document.querySelector<HTMLElement>("[data-ui-combo-whiteboard-picker-context]");
    expect(context?.textContent).toContain("Starter jab");
    expect(context?.textContent).toContain(labels.insertTarget);
    expect(context?.textContent).toContain("Follow-up kick");

    fireEvent.click(screen.getByRole("button", { name: labels.closePicker }));
    openReplacePicker();
    context = document.querySelector<HTMLElement>("[data-ui-combo-whiteboard-picker-context]");
    expect(context?.textContent).toContain(labels.comboStart);
    expect(context?.textContent).toContain(labels.replaceTarget);
    expect(context?.textContent).toContain("Starter jab");
    expect(context?.textContent).toContain("Follow-up kick");

    fireEvent.click(screen.getByRole("button", { name: labels.closePicker }));
    view.rerender(
      <WhiteboardHarness
        key="empty-composer-context"
        source={makeSource(comboWhiteboardModes.emptyActive, {
          gaps: [baseSource.gaps[0]],
          steps: [],
          transitions: [],
        })}
      />,
    );
    openPickerFromGap("gap-0", "Insert before first move");
    context = document.querySelector<HTMLElement>("[data-ui-combo-whiteboard-picker-context]");
    expect(context?.textContent).toContain(labels.comboStart);
    expect(context?.textContent).toContain(labels.appendTarget);
    expect(context?.textContent).toContain(labels.comboEnd);
  });

  it("keeps candidate content, metadata, and details in stable readable rows", () => {
    const view = render(<WhiteboardHarness source={makeSource()} />);
    openAppendPicker();
    const candidate = document.querySelector<HTMLElement>(
      '[data-ui-combo-whiteboard-candidate="candidate-a"]',
    );
    const metadata = candidate?.querySelector<HTMLElement>(
      "[data-ui-combo-whiteboard-candidate-meta]",
    );
    const details = candidate?.querySelector<HTMLElement>(
      "[data-ui-combo-whiteboard-candidate-details]",
    );
    const detailsButton = details?.querySelector<HTMLElement>("[data-ui-button]");
    const badges = metadata?.querySelectorAll<HTMLElement>("[data-ui-badge]");

    expect(candidate?.className).toContain("grid-cols-1");
    expect(candidate?.className).toContain("w-72");
    expect(metadata?.className).toContain("grid-cols-1");
    expect(badges).toHaveLength(3);
    for (const badge of badges ?? []) {
      expect(badge.className).toContain("h-auto");
      expect(badge.className).toContain("flex-wrap");
    }
    expect(detailsButton?.className).toContain("w-full");
    expect(detailsButton?.className).toContain("min-h-11");

    view.rerender(
      <WhiteboardHarness
        key="mobile-candidate-layout"
        source={makeSource(comboWhiteboardModes.builderEditable, {
          responsiveFocus: { responsiveMode: uiResponsiveModes.mobile },
        })}
      />,
    );
    openAppendPicker();
    const mobileCandidate = document.querySelector<HTMLElement>(
      '[data-ui-combo-whiteboard-candidate="candidate-a"]',
    );
    expect(mobileCandidate?.className).toContain("w-full");
    expect(mobileCandidate?.className).not.toContain("w-72");
  });

  it("emits one selectMoveCandidate intent carrying the active discriminated edit target", () => {
    const onRequestAction = vi.fn();
    render(
      <WhiteboardHarness
        initialPresentation={{
          editTarget: { gapId: "gap-1", operation: comboWhiteboardEditOperations.insert },
        }}
        onRequestAction={onRequestAction}
        source={makeSource()}
      />,
    );

    openPickerFromGap("gap-1", "Insert between moves");
    onRequestAction.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Standing jab" }));
    expect(onRequestAction).toHaveBeenCalledTimes(1);
    expect(onRequestAction).toHaveBeenCalledWith({
      action: comboWhiteboardActions.selectMoveCandidate,
      candidateId: "candidate-a",
      editTarget: { gapId: "gap-1", operation: comboWhiteboardEditOperations.insert },
      mode: comboWhiteboardModes.builderEditable,
      reason: "itemPress",
      sourceFocusTarget: "wb-candidate-a",
      sourceSurface: "builder",
    });
    const intent = onRequestAction.mock.calls[0]?.[0];
    expect(intent).not.toBeInstanceOf(Event);
    expect(intent).not.toHaveProperty("nativeEvent");
  });

  it("emits a discriminated intent for direct group selection", () => {
    const onRequestAction = vi.fn();
    render(<WhiteboardHarness onRequestAction={onRequestAction} source={makeSource()} />);

    openAppendPicker();
    onRequestAction.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Kicks" }));
    expect(onRequestAction).toHaveBeenCalledWith({
      action: comboWhiteboardActions.selectMoveGroup,
      groupId: "group-b",
      mode: comboWhiteboardModes.builderEditable,
      reason: "itemPress",
      sourceFocusTarget: "move-group-group-b",
      sourceSurface: "builder",
    });
    expect(screen.getByRole("button", { name: "Kicks" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps group-cycle controls inert when only one group is available", () => {
    const onRequestAction = vi.fn();
    const source = makeSource(comboWhiteboardModes.builderEditable, {
      groups: baseSource.groups.map((group) =>
        group.id === "group-b" ? { ...group, available: false } : group,
      ),
    });
    render(<WhiteboardHarness onRequestAction={onRequestAction} source={source} />);

    openAppendPicker();
    onRequestAction.mockClear();
    const previous = screen.getByRole("button", { name: labels.previousGroup });
    const next = screen.getByRole("button", { name: labels.nextGroup });
    expect((previous as HTMLButtonElement).disabled).toBe(true);
    expect((next as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(previous);
    fireEvent.click(next);
    expect(onRequestAction).not.toHaveBeenCalled();
  });

  it("moves focus inside the local menu and restores it to the source control", () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    render(
      <WhiteboardHarness
        initialPresentation={{
          localMenu: {
            state: comboWhiteboardLocalMenuStates.open,
            target: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "step-1" },
          },
        }}
        source={makeSource()}
      />,
    );

    const sourceControl = document.querySelector(
      '[data-ui-selectable-item="combo-step-step-1"]',
    ) as HTMLButtonElement;
    const menu = screen.getByRole("menu", { name: labels.menu });
    const details = screen.getByRole("menuitem", { name: "Open step details" });
    const replace = screen.getByRole("menuitem", { name: "Replace starter jab" });
    expect(document.activeElement).toBe(details);
    expect(document.querySelector("[data-ui-combo-whiteboard-picker]")).toBeNull();
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    expect(menu.getAttribute("data-ui-combo-whiteboard-local-menu-anchor")).toBe("wb-step-1");
    expect((menu as HTMLElement).style.position).toBe("fixed");

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(replace);
    fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: labels.closeMenu }));
    focusSpy.mockClear();
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu", { name: labels.menu })).toBeNull();
    expect(document.activeElement).toBe(sourceControl);
    expect(document.querySelector("[data-ui-combo-whiteboard-picker]")).toBeNull();
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });

  it("keeps an unavailable candidate inert and exposes its prepared reason and details action", () => {
    const onRequestAction = vi.fn();
    render(<WhiteboardHarness onRequestAction={onRequestAction} source={makeSource()} />);

    openAppendPicker();
    onRequestAction.mockClear();
    const candidate = screen.getByRole("button", {
      name: "Blocked uppercut. Requires a launcher. Attack level: Verified level unavailable",
    }) as HTMLButtonElement;
    expect(candidate.disabled).toBe(true);
    expect(screen.getByText("Requires a launcher")).toBeTruthy();
    fireEvent.focus(candidate);
    fireEvent.click(candidate);
    expect(onRequestAction).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Explain blocked uppercut" }));
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboWhiteboardActions.openCandidateDetails,
        candidateId: "candidate-disabled",
      }),
    );
  });

  it("renders prepared reasons for unavailable groups, details, and local actions", () => {
    const source = makeSource(comboWhiteboardModes.builderEditable, {
      candidates: baseSource.candidates.map((candidate) =>
        candidate.id === "candidate-a"
          ? {
              ...candidate,
              detailsAction: {
                available: false,
                disabledReason: "Candidate details are unavailable",
                id: "candidate-a-details",
                label: "Inspect standing jab",
              },
            }
          : candidate,
      ),
      groups: baseSource.groups.map((group) =>
        group.id === "group-b"
          ? { ...group, available: false, disabledReason: "Group requires another context" }
          : group,
      ),
      steps: baseSource.steps.map((step) =>
        step.id === "step-1"
          ? {
              ...step,
              actions: {
                ...step.actions,
                remove: {
                  available: false,
                  disabledReason: "This step must remain",
                  id: "step-1-remove",
                  label: "Remove starter jab",
                },
              },
            }
          : step,
      ),
    });
    render(
      <WhiteboardHarness
        initialPresentation={{
          localMenu: {
            state: comboWhiteboardLocalMenuStates.open,
            target: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "step-1" },
          },
        }}
        source={source}
      />,
    );

    expect(screen.getByText("This step must remain")).toBeTruthy();
    expect(document.querySelector("[data-ui-combo-whiteboard-picker]")).toBeNull();
    fireEvent.click(screen.getByRole("menuitem", { name: "Replace starter jab" }));

    for (const reason of ["Group requires another context", "Candidate details are unavailable"]) {
      expect(screen.getByText(reason)).toBeTruthy();
    }
    expect(
      (
        screen.getByRole("button", {
          name: "Kicks: Group requires another context",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      (
        screen.getByRole("button", {
          name: "Inspect standing jab: Candidate details are unavailable",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });

  it("fully unmounts the detail picker and prevents adversarial builder mutations", () => {
    const onRequestAction = vi.fn();
    const source = makeSource(comboWhiteboardModes.detailReadOnly, {
      boundaryIndex: 1,
      repairAction,
      truncateConfirmation,
    });
    render(
      <WhiteboardHarness
        initialPresentation={{
          localMenu: {
            state: comboWhiteboardLocalMenuStates.open,
            target: { kind: comboWhiteboardFocusTargetKinds.step, stepId: "step-1" },
          },
        }}
        onRequestAction={onRequestAction}
        source={source}
      />,
    );

    expect(screen.queryByLabelText(labels.picker)).toBeNull();
    expect(screen.queryByText(truncateConfirmation.message)).toBeNull();
    expect(screen.queryByRole("button", { name: repairAction.label })).toBeNull();
    expect(screen.getByRole("button", { name: detailActions.editCustomCombo.label })).toBeTruthy();

    for (const label of [
      "Replace starter jab",
      "Remove starter jab",
      "Undo to starter jab",
      "Pick up starter jab",
    ]) {
      const button = screen.getByRole("menuitem", { name: label }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      fireEvent.click(button);
    }
    expect(onRequestAction).not.toHaveBeenCalled();
  });

  it("keeps the saving path visible while the default-closed picker stays unavailable", () => {
    const onRequestAction = vi.fn();
    const source = makeSource(comboWhiteboardModes.savingFrozen);
    const view = render(
      <WhiteboardHarness
        initialPresentation={{
          pickUp: { state: comboWhiteboardPickUpStates.pickedUp, stepId: "step-1" },
        }}
        onRequestAction={onRequestAction}
        source={source}
      />,
    );

    expect(screen.getByText(labels.saving)).toBeTruthy();
    expect(screen.getByText("Starter jab")).toBeTruthy();
    expect(screen.queryByRole("dialog", { name: labels.picker })).toBeNull();
    expect(screen.getByLabelText(source.label).getAttribute("aria-busy")).toBe("true");
    expect(
      view.container.querySelector('[data-ui-combo-whiteboard-step="step-1"]')?.className,
    ).toContain("cursor-not-allowed");

    for (const button of screen.getAllByRole("button") as HTMLButtonElement[]) {
      expect(button.disabled).toBe(true);
      fireEvent.click(button);
    }
    expect(onRequestAction).not.toHaveBeenCalled();
  });

  it("preserves the invalid tail during truncate review and emits exact confirm/cancel payloads", () => {
    const onRequestAction = vi.fn();
    const source = makeSource(comboWhiteboardModes.pendingTruncate, { boundaryIndex: 1 });
    const view = render(<WhiteboardHarness onRequestAction={onRequestAction} source={source} />);

    expect(screen.getByText("Follow-up kick")).toBeTruthy();
    expect(view.container.querySelector('[data-ui-combo-whiteboard-step="step-2"]')).toHaveProperty(
      "dataset.invalid",
      "true",
    );
    expect(screen.getByRole("alert", { name: truncateConfirmation.message })).toBeTruthy();
    expect(screen.queryByRole("dialog", { name: labels.picker })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: truncateConfirmation.confirmAction.label }));
    fireEvent.click(screen.getByRole("button", { name: truncateConfirmation.cancelAction.label }));
    expect(onRequestAction.mock.calls.map(([intent]) => intent)).toEqual([
      {
        action: comboWhiteboardActions.confirmTruncate,
        confirmationId: truncateConfirmation.id,
        mode: comboWhiteboardModes.pendingTruncate,
        reason: "press",
        sourceFocusTarget: undefined,
        sourceSurface: "builder",
      },
      {
        action: comboWhiteboardActions.cancelTruncate,
        confirmationId: truncateConfirmation.id,
        mode: comboWhiteboardModes.pendingTruncate,
        reason: "press",
        sourceFocusTarget: undefined,
        sourceSurface: "builder",
      },
    ]);
    expect(screen.getByText("Follow-up kick")).toBeTruthy();
    expect(screen.getByRole("alert", { name: truncateConfirmation.message })).toBeTruthy();
  });

  it("uses controlled straight React Flow topology with stable node ids and semantic controls", () => {
    const source = makeSource();
    const view = render(<WhiteboardHarness source={source} />);
    const readIds = (selector: string) =>
      Array.from(view.container.querySelectorAll(selector), (element) =>
        element.getAttribute("data-id"),
      );

    const nodeIds = readIds(".react-flow__node");
    expect(nodeIds).toEqual([
      "connector:0",
      "step:step-1",
      "connector:1",
      "step:step-2",
      "transition:step-1:step-2",
      "connector:2",
    ]);
    expect(nodeIds).toHaveLength(
      source.steps.length + source.gaps.length + source.transitions.length,
    );
    expect(new Set(nodeIds).size).toBe(nodeIds.length);

    for (const node of view.container.querySelectorAll(".react-flow__node")) {
      expect(node.getAttribute("draggable")).not.toBe("true");
      expect(node.getAttribute("tabindex")).toBeNull();
      expect((node as HTMLElement).style.pointerEvents).toBe(
        node.getAttribute("data-id")?.startsWith("transition:") ? "none" : "all",
      );
    }
    expect(
      (view.container.querySelector('[data-id="transition:step-1:step-2"]') as HTMLElement).style
        .width,
    ).toBe("176px");
    expect(
      (view.container.querySelector('[data-id="transition:step-1:step-2"]') as HTMLElement).style
        .transform,
    ).toContain("translate(296px");
    expect(
      (view.container.querySelector('[data-id="connector:1"]') as HTMLElement).style.width,
    ).toBe("44px");
    const readNodeX = (id: string) => {
      const transform = (view.container.querySelector(`[data-id="${id}"]`) as HTMLElement).style
        .transform;
      const x = transform.match(/translate\(([-\d.]+)px/)?.[1];
      if (!x) throw new Error(`Node ${id} does not have a prepared x coordinate`);
      return Number(x);
    };
    expect(readNodeX("step:step-1") - (readNodeX("connector:0") + 44)).toBe(8);
    expect(readNodeX("connector:1") - (readNodeX("step:step-1") + 176)).toBe(8);
    expect(readNodeX("step:step-2") - (readNodeX("connector:1") + 44)).toBe(8);
    expect(readNodeX("connector:2") - (readNodeX("step:step-2") + 176)).toBe(8);
    expect(
      view.container
        .querySelector('[data-ui-combo-whiteboard-transition="step-1:step-2"]')
        ?.closest("[data-ui-combo-whiteboard-connector]"),
    ).toBeNull();
    for (const handle of view.container.querySelectorAll(".react-flow__handle")) {
      expect(handle.getAttribute("data-nodeid")).toBeTruthy();
      expect(handle.className).toContain("opacity-0");
      expect(handle.getAttribute("aria-hidden")).toBe("true");
      expect(handle.className.split(/\s+/)).not.toContain("connectable");
    }
    expect(
      view.container.querySelector('[data-ui-selectable-item="combo-step-step-1"]'),
    ).toBeInstanceOf(HTMLButtonElement);
    expect(
      view.container.querySelector('[data-ui-selectable-item="combo-gap-gap-1"]'),
    ).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByRole("application", { name: labels.board })).toBeTruthy();
    expect(view.container.querySelector(".react-flow__attribution")).toBeNull();
    expect(view.container.querySelector(".react-flow__edge-smoothstep")).toBeNull();
    expect(
      view.container.querySelector('[data-ui-combo-whiteboard-transition="step-1:step-2"]'),
    ).toBeTruthy();

    view.rerender(<WhiteboardHarness source={source} />);
    expect(readIds(".react-flow__node")).toEqual(nodeIds);
  });

  it("provides explicit mobile targets and enabled/disabled cursors", () => {
    const source = makeSource(comboWhiteboardModes.builderEditable, {
      responsiveFocus: {
        navigationScope: focusScope,
        responsiveMode: uiResponsiveModes.mobile,
      },
    });
    const view = render(<WhiteboardHarness source={source} />);

    openAppendPicker();

    const step = document.querySelector(
      '[data-ui-selectable-item="combo-step-step-1"]',
    ) as HTMLButtonElement;
    const gap = document.querySelector(
      '[data-ui-selectable-item="combo-gap-gap-1"]',
    ) as HTMLButtonElement;
    const group = screen.getByRole("button", { name: "Normals" });
    const candidate = screen.getByRole("button", { name: "Standing jab" });
    const unavailable = screen.getByRole("button", {
      name: "Blocked uppercut. Requires a launcher. Attack level: Verified level unavailable",
    });
    const root = screen.getByLabelText(source.label);
    const canvas = screen.getByRole("application", { name: labels.board });
    expect(root.getAttribute("data-ui-combo-whiteboard-compact-targets")).toBe("true");
    expect(root.className).toContain("[&_[data-ui-button]]:min-h-11");
    expect(canvas.getAttribute("data-ui-combo-whiteboard-canvas-zoom")).toBe("fixed");
    for (const actionLabel of [
      labels.useAppendTarget,
      labels.previousGroup,
      labels.nextGroup,
      "Inspect standing jab",
    ]) {
      const action = screen.getByRole("button", { name: actionLabel });
      expect(action.className).toContain("min-h-11");
      expect(action.className).toContain("min-w-11");
    }
    expect(step.className).toContain("min-h-11");
    expect(gap.className).toContain("min-h-11");
    expect(group.className).toContain("min-h-11");
    expect(candidate.className).toContain("min-h-16");
    expect(candidate.className).toContain("cursor-pointer");
    expect(unavailable.className).toContain("cursor-not-allowed");
    expect(
      (view.container.querySelector(".react-flow__viewport") as HTMLElement).style.transform,
    ).toContain("scale(1)");
  });
});

describe("comboWhiteboardTargetRecipe", () => {
  it("keeps the Whiteboard controller ring inset without changing the global focus ring", () => {
    const globalSelector = '.mk-combos-ui-root [data-controller-focused="true"]';
    const whiteboardStepSelector =
      '[data-ui-combo-whiteboard-step][data-controller-focused="true"]';
    const whiteboardConnectorSelector =
      '[data-ui-combo-whiteboard-connector][data-controller-focused="true"]';
    const globalRuleIndex = uiStylesSource.indexOf(globalSelector);
    const globalRuleEnd = uiStylesSource.indexOf("}", globalRuleIndex);
    const globalRule = uiStylesSource.slice(globalRuleIndex, globalRuleEnd);
    const whiteboardRuleIndex = uiStylesSource.indexOf(whiteboardStepSelector);
    const whiteboardRuleEnd = uiStylesSource.indexOf("}", whiteboardRuleIndex);
    const whiteboardRule = uiStylesSource.slice(whiteboardRuleIndex, whiteboardRuleEnd);

    expect(globalRuleIndex).toBeGreaterThanOrEqual(0);
    expect(globalRule).toContain("box-shadow: var(--ui-focus-ring)");
    expect(whiteboardRuleIndex).toBeGreaterThan(globalRuleIndex);
    expect(whiteboardRule).toContain(whiteboardConnectorSelector);
    expect(whiteboardRule.match(/\binset\b/gu)).toHaveLength(2);
    expect(whiteboardRule).not.toContain("var(--ui-focus-ring)");
  });

  it("keeps inset focused+picked and invalid affordances through stable disabled, busy, and frozen geometry", () => {
    const idle = comboWhiteboardTargetRecipe();
    const focusedPicked = comboWhiteboardTargetRecipe({ focused: true, pickedUp: true });
    const invalid = comboWhiteboardTargetRecipe({
      invalid: true,
      kind: comboWhiteboardTargetKinds.step,
    });
    const connector = comboWhiteboardTargetRecipe({ kind: comboWhiteboardTargetKinds.gap });
    const step = comboWhiteboardTargetRecipe({ kind: comboWhiteboardTargetKinds.step });
    const disabled = comboWhiteboardTargetRecipe({
      focused: true,
      state: comboWhiteboardTargetStates.disabled,
    });
    const busy = comboWhiteboardTargetRecipe({
      focused: true,
      pickedUp: true,
      state: comboWhiteboardTargetStates.busy,
    });
    const frozen = comboWhiteboardTargetRecipe({
      focused: true,
      pickedUp: true,
      state: comboWhiteboardTargetStates.frozen,
    });

    expect(focusedPicked).toContain("after:border-dashed");
    expect(focusedPicked).toContain("inset_0_0_0_4px_var(--ui-accent)");
    expect(focusedPicked).not.toContain("shadow-[var(--ui-focus-ring)]");
    expect(invalid).toContain("border-l-4");
    expect(invalid).toContain("var(--ui-destructive)");
    expect(invalid).toContain("before:content-['!']");
    expect(connector).toContain("w-11");
    expect(step).toContain("w-44");
    expect(step).toContain("border-[var(--ui-control-border)]");
    expect(step).toContain("bg-[var(--ui-control)]");
    expect(idle).not.toContain("shadow-[var(--ui-focus-ring)]");
    expect(disabled).toContain("cursor-not-allowed");
    expect(disabled).toContain("inset_0_0_0_4px_var(--ui-accent)");
    expect(busy).toContain("cursor-wait");
    expect(busy).toContain("inset_0_0_0_4px_var(--ui-accent)");
    expect(frozen).toContain("cursor-not-allowed");
    expect(frozen).toContain("saturate-50");
    expect(frozen).toContain("inset_0_0_0_4px_var(--ui-accent)");
  });
});

const frameLabels = {
  closeDetails: "Close frame details",
  details: "Frame details",
  focusMatchingWhiteboardStep: "Focus matching whiteboard step",
  lifecycle: {
    [comboFrameMeterLifecycles.pendingTruncate]: "Pending truncate",
    [comboFrameMeterLifecycles.ready]: "Frame data ready",
    [comboFrameMeterLifecycles.repairReview]: "Repair review",
    [comboFrameMeterLifecycles.savingFrozen]: "Saving frozen",
  },
  scope: "Frame scope",
  selectedMove: "Selected move",
  wholeCombo: "Whole combo",
} as const;

const frameSnapshot = {
  grid: {
    cellCount: 7,
    legend: [
      {
        id: "startup-legend",
        kind: comboFrameMeterSegmentKinds.startup,
        label: "Startup",
      },
    ],
    legendLabel: "Frame phase legend",
    sections: [
      {
        cellCount: 7,
        id: "step-1-section",
        label: "Starter jab",
        matchingWhiteboardStepId: "step-1",
        startCell: 0,
      },
    ],
    state: comboFrameMeterGridStates.available,
    tracks: [
      {
        id: "primary-track",
        kind: comboFrameMeterTrackKinds.primary,
        label: "Player",
        segments: [
          {
            cellCount: 7,
            details: [{ frameValue: 7, id: "startup-value", label: "Startup", value: "7 frames" }],
            endFrame: 7,
            id: "startup-segment",
            kind: comboFrameMeterSegmentKinds.startup,
            label: "Startup segment",
            matchingWhiteboardStepId: "step-1",
            rangeLabel: "Frames 1–7",
            startCell: 0,
            startFrame: 1,
            summary: "Prepared startup for the first whiteboard move.",
            validity: comboFrameMeterSegmentValidities.valid,
            validityLabel: "Valid",
          },
        ],
      },
    ],
  },
  id: "parent-frame-snapshot",
  label: "Parent-mediated frame meter",
  summary: [{ frameValue: 7, id: "total", label: "Total", value: "7 frames" }],
  summaryLabel: "Frame summary",
  timelineLabel: "Frame timeline",
} as const satisfies ComboFrameMeterSnapshot;

describe("Whiteboard and Frame Meter parent mediation", () => {
  it("maps Whiteboard focus into Frame inspection and Frame matching focus back into Whiteboard", () => {
    function ParentHarness() {
      const source = makeSource();
      const [inspectionTarget, setInspectionTarget] = useState<ComboFrameMeterInspectionTarget>();
      const whiteboardModel = useComboWhiteboardModel({ source });
      const frameModel = useComboFrameMeterModel({
        inspectionTarget,
        segmentIds: frameSnapshot.grid.tracks.flatMap((track) =>
          track.segments.map((segment) => segment.id),
        ),
      });
      const whiteboardFocus = whiteboardModel.state.focusTarget;

      return (
        <>
          <output data-testid="frame-inspection">
            {frameModel.state.inspectionTarget
              ? `${frameModel.state.inspectionTarget.kind}:${frameModel.state.inspectionTarget.id}`
              : "none"}
          </output>
          <output data-testid="whiteboard-focus">
            {whiteboardFocus.kind === comboWhiteboardFocusTargetKinds.step
              ? `step:${whiteboardFocus.stepId}`
              : whiteboardFocus.kind === comboWhiteboardFocusTargetKinds.gap
                ? `gap:${whiteboardFocus.gapId}`
                : whiteboardFocus.kind}
          </output>
          <ComboWhiteboard
            model={whiteboardModel}
            notationDisplayMode={notationDisplayModes.FGC}
            onRequestAction={(intent) => {
              if (intent.action === comboWhiteboardActions.focusStep) {
                setInspectionTarget({
                  id: intent.stepId,
                  kind: comboFrameMeterInspectionTargetKinds.step,
                });
              }
            }}
            source={source}
            sourceSurface="parent-builder"
          />
          <ComboFrameMeter
            labels={frameLabels}
            lifecycle={comboFrameMeterLifecycles.ready}
            model={frameModel}
            onRequestAction={(intent) => {
              if (intent.action === comboFrameMeterActions.focusMatchingWhiteboardStep) {
                whiteboardModel.methods.focusStep(intent.whiteboardStepId);
              }
            }}
            responsiveMode={uiResponsiveModes.desktop}
            snapshot={frameSnapshot}
            sourceFocusTarget="frame-meter"
            sourceSurface="parent-builder"
          />
        </>
      );
    }

    render(<ParentHarness />);
    fireEvent.focus(
      document.querySelector('[data-ui-selectable-item="combo-step-step-1"]') as HTMLButtonElement,
    );
    expect(screen.getByTestId("frame-inspection").textContent).toBe("step:step-1");
    expect(
      screen
        .getByLabelText(`${frameSnapshot.label}: ${frameLabels.selectedMove}`)
        .getAttribute("data-scope"),
    ).toBe(comboFrameMeterScopes.selectedMove);

    fireEvent.focus(
      document.querySelector('[data-ui-selectable-item="combo-gap-gap-1"]') as HTMLButtonElement,
    );
    expect(screen.getByTestId("whiteboard-focus").textContent).toBe("gap:gap-1");
    fireEvent.click(
      screen.getByRole("button", {
        name: "Startup segment. Frames 1–7. Valid",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: frameLabels.focusMatchingWhiteboardStep }));
    expect(screen.getByTestId("whiteboard-focus").textContent).toBe("step:step-1");
  });
});
