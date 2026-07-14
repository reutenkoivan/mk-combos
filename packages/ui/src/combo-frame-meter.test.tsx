import { act, fireEvent, render, screen } from "@mk-combos/contracts/test/unit/react";
import {
  ComboFrameMeter,
  type ComboFrameMeterInspectionTarget,
  type ComboFrameMeterLifecycle,
  type ComboFrameMeterModel,
  type ComboFrameMeterSnapshot,
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
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  createFrameMeterCellRecipe,
  createFrameMeterSegmentRecipe,
} from "./recipes/frame-meter-segment";

const frameMeterSegmentRecipe = createFrameMeterSegmentRecipe(
  comboFrameMeterSegmentValidities,
  comboFrameMeterSegmentKinds,
);
const frameMeterCellRecipe = createFrameMeterCellRecipe(
  comboFrameMeterSegmentValidities,
  comboFrameMeterSegmentKinds,
  comboFrameMeterTrackKinds,
);

const phaseLegendCategory = { id: "phases", label: "Phases" } as const;
const metaLegendCategory = { id: "meta", label: "Meta" } as const;

const segmentIds = [
  "startup",
  "active",
  "invalid-transition",
  "unavailable-window",
  "meta-link",
  "comparison-recovery",
] as const;
const stepTarget = {
  id: "step-1",
  kind: comboFrameMeterInspectionTargetKinds.step,
} as const satisfies ComboFrameMeterInspectionTarget;
const candidateTarget = {
  id: "candidate-1",
  kind: comboFrameMeterInspectionTargetKinds.candidate,
} as const satisfies ComboFrameMeterInspectionTarget;

const labels = {
  closeDetails: "Close segment details",
  details: "Segment details",
  focusMatchingWhiteboardStep: "Focus matching step",
  lifecycle: {
    [comboFrameMeterLifecycles.pendingTruncate]: "Pending truncate review",
    [comboFrameMeterLifecycles.ready]: "Frame data ready",
    [comboFrameMeterLifecycles.repairReview]: "Repair review",
    [comboFrameMeterLifecycles.savingFrozen]: "Saving frozen",
  },
  scope: "Frame scope",
  selectedMove: "Selected move",
  wholeCombo: "Whole combo",
} as const;
const selectedMeterLabel = `Combo frame meter: ${labels.selectedMove}`;
const wholeMeterLabel = `Combo frame meter: ${labels.wholeCombo}`;

const snapshot = {
  grid: {
    cellCount: 32,
    legend: [
      {
        category: phaseLegendCategory,
        id: "startup-legend",
        kind: comboFrameMeterSegmentKinds.startup,
        label: "Startup",
      },
      {
        category: phaseLegendCategory,
        id: "active-legend",
        kind: comboFrameMeterSegmentKinds.active,
        label: "Active",
      },
      {
        category: phaseLegendCategory,
        id: "recovery-legend",
        kind: comboFrameMeterSegmentKinds.recovery,
        label: "Recovery",
      },
      {
        category: metaLegendCategory,
        description: "Prepared transition or unknown phase",
        id: "other-legend",
        kind: comboFrameMeterSegmentKinds.other,
        label: "Other",
      },
    ],
    legendLabel: "Frame phase legend",
    sections: [
      {
        cellCount: 20,
        id: "step-1-section",
        label: "1. Launcher",
        matchingWhiteboardStepId: "step-1",
        startCell: 0,
      },
      {
        cellCount: 12,
        id: "step-2-section",
        label: "2. Follow-up",
        matchingWhiteboardStepId: "step-2",
        startCell: 20,
      },
    ],
    state: comboFrameMeterGridStates.available,
    tracks: [
      {
        id: "player",
        kind: comboFrameMeterTrackKinds.primary,
        label: "Player",
        segments: [
          {
            cellCount: 8,
            details: [{ frameValue: 8, id: "startup-value", label: "Startup", value: "8 frames" }],
            endFrame: 8,
            frameCountLabel: "8 frames",
            id: "startup",
            kind: comboFrameMeterSegmentKinds.startup,
            label: "Startup move",
            matchingWhiteboardStepId: "step-1",
            rangeLabel: "Frames 1–8",
            startCell: 0,
            startFrame: 1,
            summary: "The move starts in eight frames.",
            validity: comboFrameMeterSegmentValidities.valid,
            validityLabel: "Valid",
          },
          {
            cellCount: 3,
            details: [{ frameValue: 3, id: "active-value", label: "Active", value: "3 frames" }],
            endFrame: 11,
            id: "active",
            kind: comboFrameMeterSegmentKinds.active,
            label: "Active frames",
            matchingWhiteboardStepId: "step-1",
            rangeLabel: "Frames 9–11",
            startCell: 8,
            startFrame: 9,
            summary: "The strike can connect for three frames.",
            validity: comboFrameMeterSegmentValidities.valid,
            validityLabel: "Valid",
          },
          {
            cellCount: 9,
            details: [{ frameValue: -4, id: "gap-value", label: "Gap", value: "4 frames" }],
            endFrame: 20,
            id: "invalid-transition",
            kind: comboFrameMeterSegmentKinds.recovery,
            label: "Invalid transition",
            rangeLabel: "Frames 12–20",
            reason: "Frame window misses the valid transition.",
            startCell: 11,
            startFrame: 12,
            summary: "The transition cannot reach the next move.",
            validity: comboFrameMeterSegmentValidities.invalid,
            validityLabel: "Invalid",
          },
          {
            cellCount: 12,
            details: [],
            id: "unavailable-window",
            kind: comboFrameMeterSegmentKinds.other,
            label: "Unavailable window",
            rangeLabel: "Frames 21–32 unavailable",
            reason: "No frame data is available for this window.",
            startCell: 20,
            summary: "This frame window is unavailable.",
            validity: comboFrameMeterSegmentValidities.unavailable,
            validityLabel: "Unavailable",
          },
        ],
      },
      {
        id: "meta",
        kind: comboFrameMeterTrackKinds.meta,
        label: "Meta",
        segments: [
          {
            cellCount: 3,
            details: [],
            id: "meta-link",
            kind: comboFrameMeterSegmentKinds.link,
            label: "Prepared link",
            rangeLabel: "Frames 19–21",
            startCell: 18,
            summary: "Prepared link window.",
            validity: comboFrameMeterSegmentValidities.valid,
            validityLabel: "Valid",
          },
        ],
      },
      {
        id: "opponent",
        kind: comboFrameMeterTrackKinds.comparison,
        label: "Opponent",
        segments: [
          {
            cellCount: 32,
            details: [],
            id: "comparison-recovery",
            kind: comboFrameMeterSegmentKinds.recovery,
            label: "Opponent recovery",
            rangeLabel: "Frames 1–32",
            startCell: 0,
            summary: "Aligned comparison track.",
            validity: comboFrameMeterSegmentValidities.valid,
            validityLabel: "Valid",
          },
        ],
      },
    ],
  },
  id: "snapshot-1",
  label: "Combo frame meter",
  summary: [
    { frameValue: 8, id: "startup", label: "Startup", value: "8 frames" },
    { frameValue: 32, id: "total", label: "Total", value: "32 frames" },
    { frameValue: -2, id: "advantage", label: "Block advantage", value: "−2" },
  ],
  summaryLabel: "Frame summary",
  timelineLabel: "Prepared frame grid",
} as const satisfies ComboFrameMeterSnapshot;

const requireModel = (model: ComboFrameMeterModel | undefined): ComboFrameMeterModel => {
  if (!model) {
    throw new Error("Frame meter model harness did not render");
  }
  return model;
};

describe("useComboFrameMeterModel", () => {
  it("selects new step and candidate targets while preserving a manual whole-combo override", () => {
    let model: ComboFrameMeterModel | undefined;

    function Harness(props: { target?: ComboFrameMeterInspectionTarget }) {
      model = useComboFrameMeterModel({
        inspectionTarget: props.target,
        segmentIds,
      });
      return <output>{model.state.scope}</output>;
    }

    const view = render(<Harness target={stepTarget} />);
    expect(requireModel(model).state.scope).toBe(comboFrameMeterScopes.selectedMove);

    act(() => requireModel(model).methods.switchFrameScope(comboFrameMeterScopes.wholeCombo));
    const manualWholeCombo = requireModel(model);
    expect(manualWholeCombo.state.scope).toBe(comboFrameMeterScopes.wholeCombo);

    view.rerender(
      <Harness target={{ id: stepTarget.id, kind: comboFrameMeterInspectionTargetKinds.step }} />,
    );
    expect(requireModel(model).state.scope).toBe(comboFrameMeterScopes.wholeCombo);

    view.rerender(<Harness target={candidateTarget} />);
    expect(requireModel(model).state.scope).toBe(comboFrameMeterScopes.selectedMove);

    act(() => requireModel(model).methods.switchFrameScope(comboFrameMeterScopes.wholeCombo));
    view.rerender(<Harness />);
    expect(requireModel(model).state.scope).toBe(comboFrameMeterScopes.wholeCombo);
    view.rerender(<Harness target={stepTarget} />);
    expect(requireModel(model).state.scope).toBe(comboFrameMeterScopes.selectedMove);
  });

  it("keeps result references stable for unchanged renders and no-op methods", () => {
    let model: ComboFrameMeterModel | undefined;

    function Harness() {
      model = useComboFrameMeterModel({ inspectionTarget: stepTarget, segmentIds });
      return null;
    }

    const view = render(<Harness />);
    const initial = requireModel(model);
    view.rerender(<Harness />);
    expect(requireModel(model)).toBe(initial);

    act(() => requireModel(model).methods.focusTimelineSegment("startup"));
    expect(requireModel(model)).toBe(initial);
    act(() => requireModel(model).methods.closeSegmentDetails());
    expect(requireModel(model)).toBe(initial);
    act(() => requireModel(model).methods.focusTimelineSegment("missing-segment"));
    expect(requireModel(model)).toBe(initial);

    act(() => requireModel(model).methods.openSegmentDetails("startup"));
    const opened = requireModel(model);
    act(() => requireModel(model).methods.clearTimelineFocus());
    expect(requireModel(model)).toBe(opened);
  });

  it("owns segment focus and details, then rebases presentation state", () => {
    let model: ComboFrameMeterModel | undefined;

    function Harness() {
      model = useComboFrameMeterModel({
        initialScope: comboFrameMeterScopes.wholeCombo,
        inspectionTarget: stepTarget,
        segmentIds,
      });
      return null;
    }

    render(<Harness />);
    expect(requireModel(model).state).toMatchObject({
      details: { state: comboFrameMeterDetailsStates.closed },
      focusedSegmentId: "startup",
      scope: comboFrameMeterScopes.wholeCombo,
    });

    act(() => requireModel(model).methods.focusTimelineSegment("invalid-transition"));
    expect(requireModel(model).state.focusedSegmentId).toBe("invalid-transition");
    act(() => requireModel(model).methods.openSegmentDetails());
    expect(requireModel(model).state).toMatchObject({
      details: {
        segmentId: "invalid-transition",
        state: comboFrameMeterDetailsStates.open,
      },
      focusedSegmentId: "invalid-transition",
    });

    act(() => requireModel(model).methods.closeSegmentDetails());
    expect(requireModel(model).state.details).toEqual({
      state: comboFrameMeterDetailsStates.closed,
    });
    expect(requireModel(model).state.focusedSegmentId).toBe("invalid-transition");

    act(() => requireModel(model).methods.clearTimelineFocus());
    expect(requireModel(model).state).toMatchObject({
      details: { state: comboFrameMeterDetailsStates.closed },
      focusedSegmentId: undefined,
    });
    const cleared = requireModel(model);
    act(() => requireModel(model).methods.clearTimelineFocus());
    expect(requireModel(model)).toBe(cleared);

    act(() => requireModel(model).methods.openSegmentDetails());
    expect(requireModel(model).state).toMatchObject({
      details: { segmentId: "startup", state: comboFrameMeterDetailsStates.open },
      focusedSegmentId: "startup",
    });

    act(() => requireModel(model).methods.openSegmentDetails("unavailable-window"));
    const beforeStaleOpen = requireModel(model);
    act(() => requireModel(model).methods.openSegmentDetails("stale-segment"));
    expect(requireModel(model)).toBe(beforeStaleOpen);
    act(() => requireModel(model).methods.rebasePresentation());
    expect(requireModel(model).state).toMatchObject({
      details: { state: comboFrameMeterDetailsStates.closed },
      focusedSegmentId: "startup",
      scope: comboFrameMeterScopes.selectedMove,
    });
  });
});

type MeterHarnessProps = {
  initialDetailsSegmentId?: string;
  lifecycle: ComboFrameMeterLifecycle;
  onRequestAction?: NonNullable<ComponentProps<typeof ComboFrameMeter>["onRequestAction"]>;
  responsiveMode?: (typeof uiResponsiveModes)[keyof typeof uiResponsiveModes];
  snapshot?: ComboFrameMeterSnapshot;
  target?: ComboFrameMeterInspectionTarget;
};

function MeterHarness(props: MeterHarnessProps) {
  const model = useComboFrameMeterModel({
    initialDetailsSegmentId: props.initialDetailsSegmentId,
    inspectionTarget: props.target ?? stepTarget,
    segmentIds,
  });

  return (
    <ComboFrameMeter
      labels={labels}
      lifecycle={props.lifecycle}
      model={model}
      onRequestAction={props.onRequestAction}
      responsiveMode={props.responsiveMode ?? uiResponsiveModes.desktop}
      snapshot={props.snapshot ?? snapshot}
      sourceFocusTarget="frame-zone"
      sourceSurface="builder"
    />
  );
}

describe("ComboFrameMeter", () => {
  it("renders every lifecycle as one explicit accessible state", () => {
    const view = render(<MeterHarness lifecycle={comboFrameMeterLifecycles.ready} />);

    for (const lifecycle of Object.values(comboFrameMeterLifecycles)) {
      view.rerender(<MeterHarness lifecycle={lifecycle} />);
      const meter = screen.getByLabelText(selectedMeterLabel);
      expect(meter.getAttribute("data-lifecycle")).toBe(lifecycle);
      expect(screen.getByText(labels.lifecycle[lifecycle])).toBeTruthy();
      expect(meter.getAttribute("aria-busy")).toBe(
        lifecycle === comboFrameMeterLifecycles.savingFrozen ? "true" : null,
      );
    }
  });

  it("keeps the three headline metrics aligned in compact modes", () => {
    const view = render(
      <MeterHarness
        lifecycle={comboFrameMeterLifecycles.ready}
        responsiveMode={uiResponsiveModes.tablet}
      />,
    );

    const summary = screen.getByRole("list", { name: snapshot.summaryLabel });
    expect(summary.className).toContain("grid-cols-3");

    view.rerender(<MeterHarness lifecycle={comboFrameMeterLifecycles.ready} />);
    expect(screen.getByRole("list", { name: snapshot.summaryLabel }).className).toContain(
      "auto-fit",
    );
  });

  it("uses exact prepared cell spans, aligned tracks, and horizontal-only overflow", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <MeterHarness
        lifecycle={comboFrameMeterLifecycles.ready}
        onRequestAction={onRequestAction}
      />,
    );

    const startup = view.container.querySelector('[data-frame-cell-run="startup"]') as HTMLElement;
    const invalid = view.container.querySelector(
      '[data-frame-cell-run="invalid-transition"]',
    ) as HTMLElement;
    const secondSection = view.container.querySelector(
      '[data-section-id="step-2-section"]',
    ) as HTMLElement;
    const metaLink = view.container.querySelector(
      '[data-frame-cell-run="meta-link"]',
    ) as HTMLElement;

    expect(startup.style.gridColumn).toBe("1 / span 8");
    expect(startup.getAttribute("data-start-cell")).toBe("0");
    expect(startup.getAttribute("data-cell-count")).toBe("8");
    expect(invalid.style.gridColumn).toBe("12 / span 9");
    expect(secondSection.style.gridColumn).toBe("21 / span 12");
    expect(metaLink.style.gridColumn).toBe("19 / span 3");
    expect(metaLink.className).toContain("h-4");
    expect(startup.style.left).toBe("");
    expect(startup.style.width).toBe("");
    expect(startup.style.top).toBe("");

    const timeline = view.container.querySelector("[data-frame-timeline]") as HTMLElement;
    expect(timeline.className).toContain("overflow-x-auto");
    expect(timeline.className).toContain("overflow-y-visible");
    expect(timeline.className).not.toContain("overflow-y-hidden");
    expect(view.container.querySelector('[data-track-kind="meta"]')).toBeTruthy();
    expect(view.container.querySelector('[data-track-kind="comparison"]')).toBeTruthy();
    expect(screen.getByRole("region", { name: "Frame phase legend" })).toBeTruthy();
    expect(screen.getByText("32 frames")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: labels.wholeCombo }));
    expect(onRequestAction).toHaveBeenCalledWith({
      action: comboFrameMeterActions.switchFrameScope,
      lifecycle: comboFrameMeterLifecycles.ready,
      nextScope: comboFrameMeterScopes.wholeCombo,
      reason: expect.any(String),
      scope: comboFrameMeterScopes.selectedMove,
      sourceFocusTarget: "frame-zone",
      sourceSurface: "builder",
    });
    expect(screen.getByLabelText(wholeMeterLabel).getAttribute("data-scope")).toBe(
      comboFrameMeterScopes.wholeCombo,
    );
  });

  it("shows phase frame counts below the primary track and grouped legend after the timeline", () => {
    const view = render(<MeterHarness lifecycle={comboFrameMeterLifecycles.ready} />);
    const preparedSection = view.container.querySelector(
      '[data-section-id="step-1-section"]',
    ) as HTMLElement;
    const fallbackSection = view.container.querySelector(
      '[data-section-id="step-2-section"]',
    ) as HTMLElement;
    const preparedCount = view.container.querySelector(
      '[data-segment-frame-count="startup"]',
    ) as HTMLElement;
    const fallbackCount = view.container.querySelector(
      '[data-segment-frame-count="active"]',
    ) as HTMLElement;
    const primaryTrack = view.container.querySelector('[data-track-kind="primary"]') as HTMLElement;
    const countRow = view.container.querySelector("[data-frame-section-counts]") as HTMLElement;
    const navigation = view.container.querySelector(
      "[data-frame-segment-navigation]",
    ) as HTMLElement;
    const timeline = view.container.querySelector("[data-frame-timeline]") as HTMLElement;
    const legend = screen.getByRole("region", { name: "Frame phase legend" });

    expect(preparedSection.textContent).toBe("1. Launcher");
    expect(fallbackSection.textContent).toBe("2. Follow-up");
    expect(preparedCount.getAttribute("data-frame-count-label")).toBe("8 frames");
    expect(preparedCount.textContent).toBe("Startup move: 8 frames");
    expect(fallbackCount.getAttribute("data-frame-count-label")).toBe("3f");
    expect(fallbackCount.textContent).toBe("Active frames: 3f");
    expect(view.container.querySelectorAll("[data-segment-frame-count]")).toHaveLength(4);
    expect(primaryTrack.nextElementSibling).toBe(countRow);
    expect(navigation).toBeNull();
    expect(timeline.nextElementSibling).toBe(legend);
    expect(screen.getByRole("group", { name: "Phases" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Meta" })).toBeTruthy();
  });

  it("renders a truthful unavailable grid without fabricated frame cells", () => {
    const unavailableSnapshot = {
      ...snapshot,
      grid: {
        label: "Exact frame grid unavailable",
        reason: "The prepared source does not contain verified phase counts.",
        state: comboFrameMeterGridStates.unavailable,
      },
    } as const satisfies ComboFrameMeterSnapshot;

    const view = render(
      <MeterHarness lifecycle={comboFrameMeterLifecycles.ready} snapshot={unavailableSnapshot} />,
    );

    expect(screen.getByText(/Exact frame grid unavailable/)).toBeTruthy();
    expect(screen.getByText(/does not contain verified phase counts/)).toBeTruthy();
    expect(view.container.querySelector("[data-frame-timeline]")).toBeNull();
    expect(view.container.querySelector("[data-frame-cell-run]")).toBeNull();
  });

  it("keeps invalid and unavailable reasons readable and details keyboard reachable", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <MeterHarness
        lifecycle={comboFrameMeterLifecycles.pendingTruncate}
        onRequestAction={onRequestAction}
      />,
    );

    const invalid = screen.getByRole("button", {
      name: /Invalid transition\. Frames 12–20\. Invalid\. Frame window misses/,
    });
    const unavailable = screen.getByRole("button", {
      name: /Unavailable window\. Frames 21–32 unavailable\. Unavailable\. No frame data/,
    });
    expect(screen.getByText(/Frame window misses the valid transition/)).toBeTruthy();
    expect(screen.getByText(/No frame data is available for this window/)).toBeTruthy();

    fireEvent.focus(invalid);
    fireEvent.click(invalid);
    expect(invalid.getAttribute("aria-expanded")).toBe("true");
    expect(invalid.getAttribute("aria-controls")).toBe("snapshot-1-segment-details");
    expect(screen.getByRole("dialog", { name: "Invalid transition" })).toBeTruthy();
    expect(document.querySelector("[data-ui-popover-arrow]")).toBeTruthy();
    expect(view.container.querySelector("[data-segment-details]")).toBeNull();
    expect(invalid.className).toContain("scale-[1.06]");
    expect(invalid.className).toContain("outline-2");
    expect(screen.getByText("The transition cannot reach the next move.")).toBeTruthy();
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboFrameMeterActions.focusTimelineSegment,
        reason: "triggerFocus",
        segmentId: "invalid-transition",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboFrameMeterActions.openSegmentDetails,
        reason: "press",
        segmentId: "invalid-transition",
      }),
    );
    expect(unavailable.getAttribute("data-validity")).toBe(
      comboFrameMeterSegmentValidities.unavailable,
    );

    fireEvent.click(invalid);
    expect(screen.getByRole("dialog", { name: "Invalid transition" })).toBeTruthy();
    expect(
      onRequestAction.mock.calls.filter(
        ([intent]) => intent.action === comboFrameMeterActions.openSegmentDetails,
      ),
    ).toHaveLength(1);

    fireEvent.click(unavailable);
    expect(screen.getByRole("dialog", { name: "Unavailable window" })).toBeTruthy();
    expect(unavailable.className).toContain("scale-[1.06]");
    expect(invalid.className).not.toContain("scale-[1.06]");

    fireEvent.click(invalid);
    expect(screen.getByRole("dialog", { name: "Invalid transition" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: labels.closeDetails }));
    expect(screen.queryByRole("dialog", { name: "Invalid transition" })).toBeNull();
    expect(document.activeElement).toBe(invalid);
    expect(invalid.getAttribute("aria-expanded")).toBe("false");
    expect(onRequestAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: comboFrameMeterActions.closeSegmentDetails,
        segmentId: "invalid-transition",
      }),
    );

    fireEvent.keyDown(invalid, { key: "Escape" });
    expect(document.activeElement).not.toBe(invalid);
    expect(invalid.getAttribute("data-focused")).toBeNull();
    expect(invalid.tabIndex).toBe(-1);
    expect(screen.getByRole("button", { name: /Startup move\. Frames 1–8\. Valid/ }).tabIndex).toBe(
      0,
    );
    expect(onRequestAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: comboFrameMeterActions.clearTimelineFocus,
        reason: "escapeKey",
        segmentId: "invalid-transition",
      }),
    );

    invalid.focus();
    fireEvent.click(invalid);
    fireEvent.keyDown(invalid, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Invalid transition" })).toBeNull();
    expect(document.activeElement).toBe(invalid);
    expect(invalid.className).not.toContain("scale-[1.06]");
    expect(onRequestAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: comboFrameMeterActions.closeSegmentDetails,
        reason: "escapeKey",
        segmentId: "invalid-transition",
      }),
    );
    const closeIntentCount = onRequestAction.mock.calls.filter(
      ([intent]) => intent.action === comboFrameMeterActions.closeSegmentDetails,
    ).length;

    fireEvent.keyDown(invalid, { key: "Escape" });
    expect(document.activeElement).not.toBe(invalid);
    expect(invalid.getAttribute("data-focused")).toBeNull();
    expect(onRequestAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: comboFrameMeterActions.clearTimelineFocus,
        reason: "escapeKey",
        segmentId: "invalid-transition",
      }),
    );
    expect(
      onRequestAction.mock.calls.filter(
        ([intent]) => intent.action === comboFrameMeterActions.closeSegmentDetails,
      ),
    ).toHaveLength(closeIntentCount);
  });

  it("uses the desktop timeline cells as one roving segment focus model", () => {
    const view = render(<MeterHarness lifecycle={comboFrameMeterLifecycles.ready} />);
    const navigator = view.container.querySelector(
      "[data-frame-segment-navigation]",
    ) as HTMLElement;
    const startup = screen.getByRole("button", {
      name: /Startup move\. Frames 1–8\. Valid/,
    }) as HTMLButtonElement;
    const active = screen.getByRole("button", {
      name: /Active frames\. Frames 9–11\. Valid/,
    }) as HTMLButtonElement;

    expect(startup.tabIndex).toBe(0);
    expect(active.tabIndex).toBe(-1);
    expect(navigator).toBeNull();
    expect(
      screen
        .getByRole("toolbar", { name: snapshot.timelineLabel })
        .getAttribute("aria-orientation"),
    ).toBe("horizontal");
    expect(startup.getAttribute("data-frame-cell-run")).toBe("startup");
    expect(active.getAttribute("data-frame-cell-run")).toBe("active");
    expect(view.container.querySelectorAll("[data-frame-cell-run][tabindex]")).toHaveLength(
      segmentIds.length,
    );

    startup.focus();
    fireEvent.keyDown(startup, { key: "ArrowRight" });
    expect(document.activeElement).toBe(active);
    expect(active.tabIndex).toBe(0);
    expect(startup.tabIndex).toBe(-1);
  });

  it("emits the matching whiteboard step payload for parent mediation", () => {
    const onRequestAction = vi.fn();
    render(
      <MeterHarness
        initialDetailsSegmentId="startup"
        lifecycle={comboFrameMeterLifecycles.ready}
        onRequestAction={onRequestAction}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: labels.focusMatchingWhiteboardStep }));
    expect(onRequestAction).toHaveBeenCalledWith({
      action: comboFrameMeterActions.focusMatchingWhiteboardStep,
      lifecycle: comboFrameMeterLifecycles.ready,
      reason: "press",
      scope: comboFrameMeterScopes.selectedMove,
      segmentId: "startup",
      sourceFocusTarget: "frame-zone",
      sourceSurface: "builder",
      whiteboardStepId: "step-1",
    });
  });

  it("keeps a frozen timeline and open details visible while every action stays inert", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <MeterHarness
        initialDetailsSegmentId="startup"
        lifecycle={comboFrameMeterLifecycles.savingFrozen}
        onRequestAction={onRequestAction}
      />,
    );

    expect(view.container.querySelector("[data-frame-timeline]")).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "Startup move" })).toBeTruthy();
    const startup = view.container.querySelector(
      '[data-frame-cell-run="startup"]',
    ) as HTMLButtonElement;
    expect(startup.disabled).toBe(true);
    expect(startup.getAttribute("data-frozen")).toBe("true");
    expect(
      (
        screen.getByRole("button", {
          name: labels.focusMatchingWhiteboardStep,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: labels.closeDetails }) as HTMLButtonElement).disabled,
    ).toBe(true);

    fireEvent.focus(startup);
    fireEvent.click(startup);
    fireEvent.keyDown(startup, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: labels.wholeCombo }));
    fireEvent.click(screen.getByRole("button", { name: labels.closeDetails }));
    expect(onRequestAction).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Startup move" })).toBeTruthy();
  });

  it("provides explicit 44px controller targets in compact responsive modes", () => {
    const view = render(
      <MeterHarness
        initialDetailsSegmentId="startup"
        lifecycle={comboFrameMeterLifecycles.ready}
        responsiveMode={uiResponsiveModes.mobile}
      />,
    );

    expect(screen.getByLabelText(labels.scope).className).toContain(
      "[&_[data-ui-segmented-control-option]]:min-h-11",
    );
    const navigation = view.container.querySelector(
      "[data-frame-segment-navigation]",
    ) as HTMLElement;
    const startupControl = screen.getByRole("button", {
      name: /Startup move\. Frames 1–8\. Valid/,
    });
    const startupCell = view.container.querySelector(
      '[data-frame-cell-run="startup"]',
    ) as HTMLElement;
    expect(navigation.getAttribute("aria-orientation")).toBe("horizontal");
    expect(startupControl.className).toContain("min-h-11");
    expect(startupControl.className).toContain("min-w-11");
    expect(startupCell.className).toContain("scale-[1.06]");
    expect(startupCell.getAttribute("tabindex")).toBeNull();
    expect(
      screen.getByRole("button", { name: labels.focusMatchingWhiteboardStep }).className,
    ).toContain("min-h-11");
    expect(screen.getByRole("button", { name: labels.closeDetails }).className).toContain(
      "min-w-11",
    );
  });

  it("dismisses compact segment focus with Escape when details are already closed", () => {
    const onRequestAction = vi.fn();
    render(
      <MeterHarness
        lifecycle={comboFrameMeterLifecycles.ready}
        onRequestAction={onRequestAction}
        responsiveMode={uiResponsiveModes.mobile}
      />,
    );
    const startup = screen.getByRole("button", {
      name: /Startup move\. Frames 1–8\. Valid/,
    }) as HTMLButtonElement;
    const active = screen.getByRole("button", {
      name: /Active frames\. Frames 9–11\. Valid/,
    }) as HTMLButtonElement;

    act(() => active.focus());
    expect(document.activeElement).toBe(active);
    expect(active.getAttribute("data-focused")).toBe("true");
    expect(active.tabIndex).toBe(0);

    fireEvent.keyDown(active, { key: "Escape" });
    expect(document.activeElement).not.toBe(active);
    expect(active.getAttribute("data-focused")).toBeNull();
    expect(active.tabIndex).toBe(-1);
    expect(startup.tabIndex).toBe(0);
    expect(onRequestAction).toHaveBeenLastCalledWith({
      action: comboFrameMeterActions.clearTimelineFocus,
      lifecycle: comboFrameMeterLifecycles.ready,
      reason: "escapeKey",
      scope: comboFrameMeterScopes.selectedMove,
      segmentId: "active",
      sourceFocusTarget: "frame-zone",
      sourceSurface: "builder",
    });
  });
});

describe("frameMeterSegmentRecipe", () => {
  it("preserves invalid tone through selected, focused, and frozen combinations", () => {
    const selectedInvalid = frameMeterSegmentRecipe({
      selected: true,
      validity: comboFrameMeterSegmentValidities.invalid,
    });
    const focusedInvalid = frameMeterSegmentRecipe({
      focused: true,
      validity: comboFrameMeterSegmentValidities.invalid,
    });
    const frozenInvalid = frameMeterSegmentRecipe({
      frozen: true,
      validity: comboFrameMeterSegmentValidities.invalid,
    });

    expect(selectedInvalid).toContain("bg-(--ui-destructive-soft)");
    expect(selectedInvalid).toContain("inset_0_-3px_0_var(--ui-destructive)");
    expect(focusedInvalid).toContain("bg-(--ui-destructive-soft)");
    expect(focusedInvalid).toContain("var(--ui-focus-ring)");
    expect(frozenInvalid).toContain("bg-(--ui-destructive-soft)");
    expect(frozenInvalid).toContain("cursor-wait");
  });

  it("provides a 44px target and distinct enabled, disabled, and frozen cursors", () => {
    const enabled = frameMeterSegmentRecipe();
    const frozen = frameMeterSegmentRecipe({ frozen: true });

    expect(enabled).toContain("min-h-11");
    expect(enabled).toContain("min-w-11");
    expect(enabled).toContain("shrink-0");
    expect(enabled).toContain("w-40");
    expect(enabled).toContain("cursor-pointer");
    expect(enabled).toContain("data-[disabled=true]:cursor-not-allowed");
    expect(frozen).toContain("cursor-wait");
  });

  it("keeps selection visible for valid and unavailable segments", () => {
    const selectedValid = frameMeterSegmentRecipe({
      selected: true,
      validity: comboFrameMeterSegmentValidities.valid,
    });
    const selectedUnavailable = frameMeterSegmentRecipe({
      selected: true,
      validity: comboFrameMeterSegmentValidities.unavailable,
    });

    expect(selectedValid).toContain("inset_0_-3px_0_var(--ui-selection)");
    expect(selectedValid).toContain("enabled:hover");
    expect(selectedUnavailable).toContain("inset_0_-3px_0_var(--ui-selection)");
    expect(selectedUnavailable).toContain("enabled:hover");
  });

  it("uses phase-specific cells and patterned invalid feedback", () => {
    const startup = frameMeterCellRecipe({
      kind: comboFrameMeterSegmentKinds.startup,
      validity: comboFrameMeterSegmentValidities.valid,
    });
    const active = frameMeterCellRecipe({
      kind: comboFrameMeterSegmentKinds.active,
      validity: comboFrameMeterSegmentValidities.valid,
    });
    const invalidRecovery = frameMeterCellRecipe({
      kind: comboFrameMeterSegmentKinds.recovery,
      validity: comboFrameMeterSegmentValidities.invalid,
    });
    const metaLink = frameMeterCellRecipe({
      kind: comboFrameMeterSegmentKinds.link,
      trackKind: comboFrameMeterTrackKinds.meta,
      validity: comboFrameMeterSegmentValidities.valid,
    });

    expect(startup).toContain("bg-(--ui-frame-startup)");
    expect(active).toContain("bg-(--ui-frame-active)");
    expect(invalidRecovery).toContain("bg-(--ui-frame-recovery)");
    expect(invalidRecovery).toContain("repeating-linear-gradient");
    expect(invalidRecovery).toContain("outline-(--ui-destructive)");
    expect(metaLink).toContain("bg-(--ui-frame-transition)");
    expect(metaLink).toContain("h-4");
  });

  it("wires interactive, selected, focused, and frozen timeline cell states", () => {
    const selectedValid = frameMeterCellRecipe({
      interactive: true,
      kind: comboFrameMeterSegmentKinds.startup,
      selected: true,
      validity: comboFrameMeterSegmentValidities.valid,
    });
    const selectedInvalid = frameMeterCellRecipe({
      kind: comboFrameMeterSegmentKinds.recovery,
      selected: true,
      validity: comboFrameMeterSegmentValidities.invalid,
    });
    const focusedSelected = frameMeterCellRecipe({
      focused: true,
      kind: comboFrameMeterSegmentKinds.active,
      selected: true,
      validity: comboFrameMeterSegmentValidities.valid,
    });
    const frozen = frameMeterCellRecipe({
      frozen: true,
      kind: comboFrameMeterSegmentKinds.active,
      validity: comboFrameMeterSegmentValidities.valid,
    });

    expect(selectedValid).toContain("scale-[1.06]");
    expect(selectedValid).toContain("outline-offset-2");
    expect(selectedValid).toContain("outline-(--ui-selection)");
    expect(selectedValid).toContain("enabled:cursor-pointer");
    expect(selectedValid).toContain("motion-reduce:transition-none");
    expect(selectedInvalid).toContain("repeating-linear-gradient");
    expect(selectedInvalid).toContain("outline-(--ui-selection)");
    expect(focusedSelected).toContain("shadow-(--ui-focus-ring)");
    expect(focusedSelected).toContain("z-30");
    expect(frozen).toContain("cursor-wait");
  });
});
