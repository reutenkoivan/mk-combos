import { Popover as BasePopover } from "@base-ui/react/popover";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { useUiRootContext } from "../internal/ui-root-context";
import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import { Group, Stack } from "../primitives/layout";
import {
  PopoverArrow,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
} from "../primitives/popover";
import { uiFloatingAlignments, uiFloatingSides } from "../primitives/positioning";
import { SegmentedControl } from "../primitives/segmented-control";
import { Badge, StatusMessage } from "../primitives/state";
import { cx } from "../recipes/class-name";
import {
  createFrameMeterCellRecipe,
  createFrameMeterSegmentRecipe,
} from "../recipes/frame-meter-segment";
import { uiToneModes } from "../tokens/value";
import type { ComponentActionIntent, UiResponsiveMode } from "./type";
import { componentInteractionReasons, uiResponsiveModes } from "./value";

export const comboFrameMeterLifecycles = {
  pendingTruncate: "pendingTruncate",
  ready: "ready",
  repairReview: "repairReview",
  savingFrozen: "savingFrozen",
} as const;

export type ComboFrameMeterLifecycle =
  (typeof comboFrameMeterLifecycles)[keyof typeof comboFrameMeterLifecycles];

export const comboFrameMeterScopes = {
  selectedMove: "selectedMove",
  wholeCombo: "wholeCombo",
} as const;

export type ComboFrameMeterScope =
  (typeof comboFrameMeterScopes)[keyof typeof comboFrameMeterScopes];

export const comboFrameMeterDetailsStates = {
  closed: "closed",
  open: "open",
} as const;

export type ComboFrameMeterDetailsState =
  (typeof comboFrameMeterDetailsStates)[keyof typeof comboFrameMeterDetailsStates];

export const comboFrameMeterSegmentKinds = {
  active: "active",
  cancel: "cancel",
  juggle: "juggle",
  link: "link",
  other: "other",
  recovery: "recovery",
  startup: "startup",
  transition: "transition",
} as const;

export type ComboFrameMeterSegmentKind =
  (typeof comboFrameMeterSegmentKinds)[keyof typeof comboFrameMeterSegmentKinds];

export const comboFrameMeterSegmentValidities = {
  invalid: "invalid",
  unavailable: "unavailable",
  valid: "valid",
} as const;

export type ComboFrameMeterSegmentValidity =
  (typeof comboFrameMeterSegmentValidities)[keyof typeof comboFrameMeterSegmentValidities];

export const comboFrameMeterTrackKinds = {
  comparison: "comparison",
  meta: "meta",
  primary: "primary",
} as const;

export type ComboFrameMeterTrackKind =
  (typeof comboFrameMeterTrackKinds)[keyof typeof comboFrameMeterTrackKinds];

export const comboFrameMeterGridStates = {
  available: "available",
  unavailable: "unavailable",
} as const;

export type ComboFrameMeterGridState =
  (typeof comboFrameMeterGridStates)[keyof typeof comboFrameMeterGridStates];

const frameMeterSegmentRecipe = createFrameMeterSegmentRecipe(
  comboFrameMeterSegmentValidities,
  comboFrameMeterSegmentKinds,
);
const frameMeterCellRecipe = createFrameMeterCellRecipe(
  comboFrameMeterSegmentValidities,
  comboFrameMeterSegmentKinds,
  comboFrameMeterTrackKinds,
);

export const comboFrameMeterInspectionTargetKinds = {
  candidate: "candidate",
  step: "step",
} as const;

export type ComboFrameMeterInspectionTargetKind =
  (typeof comboFrameMeterInspectionTargetKinds)[keyof typeof comboFrameMeterInspectionTargetKinds];

export const comboFrameMeterActions = {
  clearTimelineFocus: "clearTimelineFocus",
  closeSegmentDetails: "closeSegmentDetails",
  focusMatchingWhiteboardStep: "focusMatchingWhiteboardStep",
  focusTimelineSegment: "focusTimelineSegment",
  openSegmentDetails: "openSegmentDetails",
  switchFrameScope: "switchFrameScope",
} as const;

export type ComboFrameMeterAction =
  (typeof comboFrameMeterActions)[keyof typeof comboFrameMeterActions];

export type ComboFrameMeterInspectionTarget =
  | {
      id: string;
      kind: typeof comboFrameMeterInspectionTargetKinds.candidate;
    }
  | {
      id: string;
      kind: typeof comboFrameMeterInspectionTargetKinds.step;
    };

export type ComboFrameMeterClosedDetails = {
  state: typeof comboFrameMeterDetailsStates.closed;
};

export type ComboFrameMeterOpenDetails = {
  segmentId: string;
  state: typeof comboFrameMeterDetailsStates.open;
};

export type ComboFrameMeterDetails = ComboFrameMeterClosedDetails | ComboFrameMeterOpenDetails;

const closedFrameMeterDetails: ComboFrameMeterClosedDetails = {
  state: comboFrameMeterDetailsStates.closed,
};

export type ComboFrameMeterValue = {
  frameValue?: number;
  id: string;
  label: string;
  value: string;
};

export type ComboFrameMeterSegment = {
  cellCount: number;
  details: readonly ComboFrameMeterValue[];
  endFrame?: number;
  frameCountLabel?: string;
  id: string;
  kind: ComboFrameMeterSegmentKind;
  label: string;
  matchingWhiteboardStepId?: string;
  rangeLabel: string;
  reason?: string;
  startCell: number;
  startFrame?: number;
  summary: string;
  validity: ComboFrameMeterSegmentValidity;
  validityLabel: string;
};

export type ComboFrameMeterTrack = {
  id: string;
  kind: ComboFrameMeterTrackKind;
  label: string;
  segments: readonly ComboFrameMeterSegment[];
};

export type ComboFrameMeterSection = {
  cellCount: number;
  id: string;
  label: string;
  matchingWhiteboardStepId?: string;
  startCell: number;
};

export type ComboFrameMeterLegendCategory = {
  id: string;
  label: string;
};

export type ComboFrameMeterLegendItem = {
  category?: ComboFrameMeterLegendCategory;
  description?: string;
  id: string;
  kind: ComboFrameMeterSegmentKind;
  label: string;
};

export type ComboFrameMeterAvailableGrid = {
  cellCount: number;
  legend: readonly ComboFrameMeterLegendItem[];
  legendLabel: string;
  sections: readonly ComboFrameMeterSection[];
  state: typeof comboFrameMeterGridStates.available;
  tracks: readonly ComboFrameMeterTrack[];
};

export type ComboFrameMeterUnavailableGrid = {
  label: string;
  reason: string;
  state: typeof comboFrameMeterGridStates.unavailable;
};

export type ComboFrameMeterGrid = ComboFrameMeterAvailableGrid | ComboFrameMeterUnavailableGrid;

export type ComboFrameMeterSnapshot = {
  grid: ComboFrameMeterGrid;
  id: string;
  label: string;
  summary: readonly ComboFrameMeterValue[];
  summaryLabel: string;
  timelineLabel: string;
};

export type ComboFrameMeterLabels = {
  closeDetails: string;
  details: string;
  focusMatchingWhiteboardStep: string;
  lifecycle: Readonly<Record<ComboFrameMeterLifecycle, string>>;
  scope: string;
  selectedMove: string;
  wholeCombo: string;
};

type ComboFrameMeterIntentBase = ComponentActionIntent<ComboFrameMeterAction> & {
  lifecycle: ComboFrameMeterLifecycle;
  scope: ComboFrameMeterScope;
};

export type ComboFrameMeterIntent =
  | (ComboFrameMeterIntentBase & {
      action:
        | typeof comboFrameMeterActions.clearTimelineFocus
        | typeof comboFrameMeterActions.closeSegmentDetails
        | typeof comboFrameMeterActions.focusTimelineSegment
        | typeof comboFrameMeterActions.openSegmentDetails;
      segmentId: string;
    })
  | (ComboFrameMeterIntentBase & {
      action: typeof comboFrameMeterActions.focusMatchingWhiteboardStep;
      segmentId: string;
      whiteboardStepId: string;
    })
  | (ComboFrameMeterIntentBase & {
      action: typeof comboFrameMeterActions.switchFrameScope;
      nextScope: ComboFrameMeterScope;
    });

type ComboFrameMeterRequestIntent = ComboFrameMeterIntent extends infer Intent
  ? Intent extends ComboFrameMeterIntent
    ? Omit<Intent, "lifecycle" | "scope">
    : never
  : never;

export type UseComboFrameMeterModelOptions = {
  initialDetailsSegmentId?: string;
  initialFocusedSegmentId?: string;
  initialScope?: ComboFrameMeterScope;
  inspectionTarget?: ComboFrameMeterInspectionTarget;
  segmentIds: readonly string[];
};

export type ComboFrameMeterModelState = {
  details: ComboFrameMeterDetails;
  focusedSegmentId?: string;
  inspectionTarget?: ComboFrameMeterInspectionTarget;
  scope: ComboFrameMeterScope;
};

export type ComboFrameMeterModelMethods = {
  clearTimelineFocus: () => void;
  closeSegmentDetails: () => void;
  focusTimelineSegment: (segmentId: string) => void;
  openSegmentDetails: (segmentId?: string) => void;
  rebasePresentation: () => void;
  switchFrameScope: (scope: ComboFrameMeterScope) => void;
};

export type ComboFrameMeterModel = {
  methods: ComboFrameMeterModelMethods;
  state: ComboFrameMeterModelState;
};

type LocalFrameMeterState = {
  acknowledgedInspectionKey?: string;
  details: ComboFrameMeterDetails;
  focusedSegmentId?: string;
  requestedScope: ComboFrameMeterScope;
};

const inspectionKeyOf = (target: ComboFrameMeterInspectionTarget | undefined) =>
  target ? `${target.kind}:${target.id}` : undefined;

const firstMatchingSegmentId = (segmentIds: readonly string[], requestedId?: string) =>
  requestedId && segmentIds.includes(requestedId) ? requestedId : segmentIds[0];

export function useComboFrameMeterModel(
  options: UseComboFrameMeterModelOptions,
): ComboFrameMeterModel {
  const inspectionKey = inspectionKeyOf(options.inspectionTarget);
  const [local, setLocal] = useState<LocalFrameMeterState>(() => {
    const focusedSegmentId = firstMatchingSegmentId(
      options.segmentIds,
      options.initialFocusedSegmentId,
    );
    const initialDetailsSegmentId =
      options.initialDetailsSegmentId &&
      options.segmentIds.includes(options.initialDetailsSegmentId)
        ? options.initialDetailsSegmentId
        : undefined;

    return {
      acknowledgedInspectionKey: inspectionKey,
      details:
        options.initialDetailsSegmentId && initialDetailsSegmentId
          ? { segmentId: initialDetailsSegmentId, state: comboFrameMeterDetailsStates.open }
          : closedFrameMeterDetails,
      focusedSegmentId,
      requestedScope:
        options.initialScope ??
        (inspectionKey ? comboFrameMeterScopes.selectedMove : comboFrameMeterScopes.wholeCombo),
    };
  });

  const effectiveScope = !inspectionKey
    ? comboFrameMeterScopes.wholeCombo
    : local.acknowledgedInspectionKey !== inspectionKey
      ? comboFrameMeterScopes.selectedMove
      : local.requestedScope;
  const focusedSegmentId =
    local.focusedSegmentId && options.segmentIds.includes(local.focusedSegmentId)
      ? local.focusedSegmentId
      : undefined;
  const details =
    local.details.state === comboFrameMeterDetailsStates.open &&
    options.segmentIds.includes(local.details.segmentId)
      ? local.details
      : closedFrameMeterDetails;

  useEffect(() => {
    setLocal((current) => {
      if (!inspectionKey) {
        return current.acknowledgedInspectionKey === undefined &&
          current.requestedScope === comboFrameMeterScopes.wholeCombo
          ? current
          : {
              ...current,
              acknowledgedInspectionKey: undefined,
              requestedScope: comboFrameMeterScopes.wholeCombo,
            };
      }

      return current.acknowledgedInspectionKey === inspectionKey
        ? current
        : {
            ...current,
            acknowledgedInspectionKey: inspectionKey,
            requestedScope: comboFrameMeterScopes.selectedMove,
          };
    });
  }, [inspectionKey]);

  const normalizeForCurrentInspection = useCallback(
    (current: LocalFrameMeterState): LocalFrameMeterState => {
      const scope = !inspectionKey
        ? comboFrameMeterScopes.wholeCombo
        : current.acknowledgedInspectionKey !== inspectionKey
          ? comboFrameMeterScopes.selectedMove
          : current.requestedScope;

      if (current.acknowledgedInspectionKey === inspectionKey && current.requestedScope === scope) {
        return current;
      }

      return {
        ...current,
        acknowledgedInspectionKey: inspectionKey,
        requestedScope: scope,
      };
    },
    [inspectionKey],
  );

  const focusTimelineSegment = useCallback(
    (segmentId: string) => {
      if (!options.segmentIds.includes(segmentId)) {
        return;
      }
      setLocal((current) => {
        const normalized = normalizeForCurrentInspection(current);
        return normalized.focusedSegmentId === segmentId
          ? normalized
          : { ...normalized, focusedSegmentId: segmentId };
      });
    },
    [normalizeForCurrentInspection, options.segmentIds],
  );

  const clearTimelineFocus = useCallback(() => {
    setLocal((current) => {
      const normalized = normalizeForCurrentInspection(current);
      return normalized.details.state === comboFrameMeterDetailsStates.open ||
        normalized.focusedSegmentId === undefined
        ? normalized
        : { ...normalized, focusedSegmentId: undefined };
    });
  }, [normalizeForCurrentInspection]);

  const openSegmentDetails = useCallback(
    (segmentId?: string) => {
      if (segmentId && !options.segmentIds.includes(segmentId)) {
        return;
      }
      const resolvedSegmentId = firstMatchingSegmentId(
        options.segmentIds,
        segmentId ?? focusedSegmentId,
      );
      if (!resolvedSegmentId) {
        return;
      }
      setLocal((current) => {
        const normalized = normalizeForCurrentInspection(current);
        if (
          normalized.details.state === comboFrameMeterDetailsStates.open &&
          normalized.details.segmentId === resolvedSegmentId &&
          normalized.focusedSegmentId === resolvedSegmentId
        ) {
          return normalized;
        }
        return {
          ...normalized,
          details: {
            segmentId: resolvedSegmentId,
            state: comboFrameMeterDetailsStates.open,
          },
          focusedSegmentId: resolvedSegmentId,
        };
      });
    },
    [focusedSegmentId, normalizeForCurrentInspection, options.segmentIds],
  );

  const closeSegmentDetails = useCallback(() => {
    setLocal((current) => {
      const normalized = normalizeForCurrentInspection(current);
      return normalized.details.state === comboFrameMeterDetailsStates.closed
        ? normalized
        : { ...normalized, details: closedFrameMeterDetails };
    });
  }, [normalizeForCurrentInspection]);

  const switchFrameScope = useCallback(
    (scope: ComboFrameMeterScope) => {
      const nextScope =
        scope === comboFrameMeterScopes.selectedMove && !inspectionKey
          ? comboFrameMeterScopes.wholeCombo
          : scope;
      setLocal((current) => {
        if (
          current.requestedScope === nextScope &&
          current.acknowledgedInspectionKey === inspectionKey
        ) {
          return current;
        }
        return {
          ...current,
          acknowledgedInspectionKey: inspectionKey,
          requestedScope: nextScope,
        };
      });
    },
    [inspectionKey],
  );

  const rebasePresentation = useCallback(() => {
    setLocal({
      acknowledgedInspectionKey: inspectionKey,
      details: closedFrameMeterDetails,
      focusedSegmentId: options.segmentIds[0],
      requestedScope: inspectionKey
        ? comboFrameMeterScopes.selectedMove
        : comboFrameMeterScopes.wholeCombo,
    });
  }, [inspectionKey, options.segmentIds]);

  const state = useMemo<ComboFrameMeterModelState>(
    () => ({
      details,
      focusedSegmentId,
      inspectionTarget: options.inspectionTarget,
      scope: effectiveScope,
    }),
    [details, effectiveScope, focusedSegmentId, options.inspectionTarget],
  );
  const methods = useMemo<ComboFrameMeterModelMethods>(
    () => ({
      clearTimelineFocus,
      closeSegmentDetails,
      focusTimelineSegment,
      openSegmentDetails,
      rebasePresentation,
      switchFrameScope,
    }),
    [
      clearTimelineFocus,
      closeSegmentDetails,
      focusTimelineSegment,
      openSegmentDetails,
      rebasePresentation,
      switchFrameScope,
    ],
  );

  return useMemo(() => ({ methods, state }), [methods, state]);
}

export type ComboFrameMeterProps = {
  labels: ComboFrameMeterLabels;
  lifecycle: ComboFrameMeterLifecycle;
  model: ComboFrameMeterModel;
  onRequestAction?: (intent: ComboFrameMeterIntent) => void;
  responsiveMode: UiResponsiveMode;
  snapshot: ComboFrameMeterSnapshot;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

const lifecycleTone = {
  [comboFrameMeterLifecycles.pendingTruncate]: uiToneModes.destructive,
  [comboFrameMeterLifecycles.ready]: uiToneModes.neutral,
  [comboFrameMeterLifecycles.repairReview]: uiToneModes.warning,
  [comboFrameMeterLifecycles.savingFrozen]: uiToneModes.accent,
} as const;

const frameMeterCellWidthRem = 1.05;
const frameMeterTrackLabelWidthRem = 7;

const getSnapshotSegments = (
  snapshot: ComboFrameMeterSnapshot,
): readonly ComboFrameMeterSegment[] =>
  snapshot.grid.state === comboFrameMeterGridStates.available
    ? snapshot.grid.tracks.flatMap((track) => track.segments)
    : [];

const getFrameGridStyle = (cellCount: number): CSSProperties => ({
  gridTemplateColumns: `repeat(${cellCount}, ${frameMeterCellWidthRem}rem)`,
});

const getFrameGridMinWidth = (cellCount: number) =>
  `${frameMeterTrackLabelWidthRem + cellCount * frameMeterCellWidthRem}rem`;

type FrameMeterLegendGroup = {
  items: readonly ComboFrameMeterLegendItem[];
  key: string;
  label?: string;
};

const groupFrameMeterLegend = (
  items: readonly ComboFrameMeterLegendItem[],
): readonly FrameMeterLegendGroup[] => {
  const groupIndexes = new Map<string | undefined, number>();
  const groups: Array<{
    items: ComboFrameMeterLegendItem[];
    key: string;
    label?: string;
  }> = [];

  for (const item of items) {
    const categoryId = item.category?.id;
    const existingIndex = groupIndexes.get(categoryId);

    if (existingIndex !== undefined) {
      groups[existingIndex]?.items.push(item);
      continue;
    }

    groupIndexes.set(categoryId, groups.length);
    groups.push({
      items: [item],
      key: categoryId ? `category:${categoryId}` : "category:uncategorized",
      ...(item.category ? { label: item.category.label } : {}),
    });
  }

  return groups;
};

const validityTone = (validity: ComboFrameMeterSegmentValidity) =>
  validity === comboFrameMeterSegmentValidities.invalid
    ? uiToneModes.destructive
    : validity === comboFrameMeterSegmentValidities.unavailable
      ? uiToneModes.warning
      : uiToneModes.neutral;

function SegmentValidityIndicator(props: { validity: ComboFrameMeterSegmentValidity }) {
  switch (props.validity) {
    case comboFrameMeterSegmentValidities.invalid:
      return <span aria-hidden="true">!</span>;
    case comboFrameMeterSegmentValidities.unavailable:
      return <span aria-hidden="true">?</span>;
    case comboFrameMeterSegmentValidities.valid:
      return null;
  }

  const unhandledValidity: never = props.validity;
  return unhandledValidity;
}

export function ComboFrameMeter(props: ComboFrameMeterProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const frozen = props.lifecycle === comboFrameMeterLifecycles.savingFrozen;
  const compact = props.responsiveMode !== uiResponsiveModes.desktop;
  const availableGrid =
    props.snapshot.grid.state === comboFrameMeterGridStates.available
      ? props.snapshot.grid
      : undefined;
  const popoverId = useId();
  const segmentAnchorRefs = useRef(new Map<string, HTMLElement>());
  const segmentTriggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const restoringFocus = useRef(false);
  const segments = useMemo(() => getSnapshotSegments(props.snapshot), [props.snapshot]);
  const segmentTriggerIds = useMemo(
    () =>
      new Map(
        segments.map((segment, index) => [segment.id, `${popoverId}-segment-${index}`] as const),
      ),
    [popoverId, segments],
  );
  const segmentIndexes = useMemo(
    () => new Map(segments.map((segment, index) => [segment.id, index] as const)),
    [segments],
  );
  const legendGroups = useMemo(
    () => groupFrameMeterLegend(availableGrid?.legend ?? []),
    [availableGrid],
  );
  const openSegmentId =
    props.model.state.details.state === comboFrameMeterDetailsStates.open
      ? props.model.state.details.segmentId
      : undefined;
  const openSegment = segments.find((segment) => segment.id === openSegmentId);
  const openTriggerId = openSegmentId ? segmentTriggerIds.get(openSegmentId) : undefined;
  const detailsId = `${props.snapshot.id}-segment-details`;
  const scopeLabel =
    props.model.state.scope === comboFrameMeterScopes.selectedMove
      ? props.labels.selectedMove
      : props.labels.wholeCombo;
  const desktopTimelineAccessibility = compact
    ? {}
    : {
        "aria-label": props.snapshot.timelineLabel,
        "aria-orientation": "horizontal" as const,
        role: "toolbar" as const,
      };

  const emit = (intent: ComboFrameMeterRequestIntent) => {
    if (frozen) {
      return;
    }
    const context = {
      lifecycle: props.lifecycle,
      scope: props.model.state.scope,
    };

    switch (intent.action) {
      case comboFrameMeterActions.clearTimelineFocus:
      case comboFrameMeterActions.closeSegmentDetails:
      case comboFrameMeterActions.focusTimelineSegment:
      case comboFrameMeterActions.openSegmentDetails:
        props.onRequestAction?.({ ...intent, ...context });
        return;
      case comboFrameMeterActions.focusMatchingWhiteboardStep:
        props.onRequestAction?.({ ...intent, ...context });
        return;
      case comboFrameMeterActions.switchFrameScope:
        props.onRequestAction?.({ ...intent, ...context });
        return;
    }

    const unhandledIntent: never = intent;
    return unhandledIntent;
  };

  const focusSegment = (segmentId: string) => {
    if (frozen) {
      return;
    }
    props.model.methods.focusTimelineSegment(segmentId);
    if (restoringFocus.current) {
      return;
    }
    emit({
      action: comboFrameMeterActions.focusTimelineSegment,
      reason: componentInteractionReasons.triggerFocus,
      segmentId,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });
  };

  const openDetails = (segmentId: string) => {
    if (frozen) {
      return;
    }
    if (
      props.model.state.details.state === comboFrameMeterDetailsStates.open &&
      props.model.state.details.segmentId === segmentId
    ) {
      return;
    }
    props.model.methods.openSegmentDetails(segmentId);
    emit({
      action: comboFrameMeterActions.openSegmentDetails,
      reason: componentInteractionReasons.press,
      segmentId,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });
  };

  const moveSegmentFocus = (segmentId: string, delta: -1 | 1) => {
    if (frozen || segments.length === 0) {
      return;
    }
    const currentIndex = segments.findIndex((segment) => segment.id === segmentId);
    const nextIndex =
      currentIndex < 0 ? 0 : (currentIndex + delta + segments.length) % segments.length;
    const nextSegment = segments[nextIndex];
    if (!nextSegment) {
      return;
    }
    segmentTriggerRefs.current.get(nextSegment.id)?.focus();
  };

  const handleSegmentKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    segmentId: string,
  ) => {
    if (event.key === "Escape") {
      if (frozen || openSegment) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      props.model.methods.clearTimelineFocus();
      event.currentTarget.blur();
      emit({
        action: comboFrameMeterActions.clearTimelineFocus,
        reason: componentInteractionReasons.escapeKey,
        segmentId,
        sourceFocusTarget: props.sourceFocusTarget,
        sourceSurface: props.sourceSurface,
      });
      return;
    }
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    event.preventDefault();
    moveSegmentFocus(segmentId, event.key === "ArrowLeft" ? -1 : 1);
  };

  const closeDetails = (segmentId: string, reason: ComboFrameMeterIntent["reason"]) => {
    if (frozen) {
      return;
    }
    props.model.methods.closeSegmentDetails();
    restoringFocus.current = true;
    segmentTriggerRefs.current.get(segmentId)?.focus();
    restoringFocus.current = false;
    emit({
      action: comboFrameMeterActions.closeSegmentDetails,
      reason,
      segmentId,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });
  };

  const timelineGrid = props.snapshot.grid;
  return (
    <PopoverRoot
      modal={false}
      open={Boolean(openSegment)}
      triggerId={openTriggerId ?? null}
      sourceFocusTarget={props.sourceFocusTarget}
      onOpenChange={({ open, reason }) => {
        if (frozen || open || reason === componentInteractionReasons.triggerPress || !openSegment) {
          return;
        }
        closeDetails(openSegment.id, reason);
      }}
    >
      <section
        aria-busy={frozen || undefined}
        data-ui-component="UI-CMP-036"
        data-lifecycle={props.lifecycle}
        data-scope={props.model.state.scope}
        data-ui-responsive={props.responsiveMode}
        aria-label={`${props.snapshot.label}: ${scopeLabel}`}
        data-details-state={props.model.state.details.state}
        className="grid min-w-0 gap-4 rounded-(--ui-radius-surface) border border-(--ui-frame-panel-border) bg-(--ui-frame-surface) p-4 text-(--ui-frame-surface-text)"
      >
        <SegmentedControl
          disabled={frozen}
          aria-label={props.labels.scope}
          value={props.model.state.scope}
          className={
            compact
              ? "[&_[data-ui-segmented-control-option]]:min-h-11 [&_[data-ui-segmented-control-option]]:min-w-11"
              : undefined
          }
          options={[
            {
              disabled: !props.model.state.inspectionTarget,
              label: props.labels.selectedMove,
              value: comboFrameMeterScopes.selectedMove,
            },
            { label: props.labels.wholeCombo, value: comboFrameMeterScopes.wholeCombo },
          ]}
          onValueChange={({ reason, value }) => {
            props.model.methods.switchFrameScope(value);
            emit({
              action: comboFrameMeterActions.switchFrameScope,
              nextScope: value,
              reason,
              sourceFocusTarget: props.sourceFocusTarget,
              sourceSurface: props.sourceSurface,
            });
          }}
        />

        <StatusMessage tone={lifecycleTone[props.lifecycle]}>
          {props.labels.lifecycle[props.lifecycle]}
        </StatusMessage>

        <Show when={props.snapshot.summary.length > 0}>
          {() => (
            <ul
              aria-label={props.snapshot.summaryLabel}
              className={cx(
                "grid min-w-0 list-none gap-px overflow-hidden rounded-(--ui-radius-control) border border-(--ui-frame-panel-border) bg-(--ui-frame-panel-border) p-0",
                compact ? "grid-cols-3" : "grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]",
              )}
            >
              {props.snapshot.summary.map((item) => (
                <li className="grid min-w-0 gap-1 bg-(--ui-frame-track) p-3" key={item.id}>
                  <span className="text-xs uppercase tracking-wide text-(--ui-frame-muted-text)">
                    {item.label}
                  </span>
                  <strong className="text-lg" data-frame-value={item.frameValue}>
                    {item.value}
                  </strong>
                </li>
              ))}
            </ul>
          )}
        </Show>

        {timelineGrid.state === comboFrameMeterGridStates.unavailable ? (
          <StatusMessage tone={uiToneModes.warning}>
            <strong>{timelineGrid.label}:</strong> {timelineGrid.reason}
          </StatusMessage>
        ) : (
          <fieldset className="grid min-w-0 gap-3 border-0 p-0">
            <legend className="sr-only">{props.snapshot.timelineLabel}</legend>
            <div
              {...desktopTimelineAccessibility}
              data-frame-timeline
              className="min-w-0 overflow-x-auto overflow-y-visible rounded-(--ui-radius-control) border border-(--ui-frame-panel-border) bg-(--ui-frame-track) p-3"
            >
              <div
                data-frame-timeline-grid
                className="grid min-w-max gap-2"
                style={{ minWidth: getFrameGridMinWidth(timelineGrid.cellCount) }}
              >
                <Show when={timelineGrid.sections.length > 0}>
                  {() => (
                    <div className="grid grid-cols-[7rem_auto] items-end gap-0" data-frame-sections>
                      <span aria-hidden="true" />
                      <div className="grid" style={getFrameGridStyle(timelineGrid.cellCount)}>
                        {timelineGrid.sections.map((section) => (
                          <span
                            key={section.id}
                            data-section-id={section.id}
                            data-cell-count={section.cellCount}
                            data-start-cell={section.startCell}
                            data-matching-whiteboard-step-id={section.matchingWhiteboardStepId}
                            style={{
                              gridColumn: `${section.startCell + 1} / span ${section.cellCount}`,
                            }}
                            className="truncate border-l border-(--ui-frame-boundary) px-1 pb-1 text-xs font-semibold text-(--ui-frame-muted-text)"
                          >
                            {section.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Show>

                {timelineGrid.tracks.map((track) => (
                  <div className="grid gap-1" data-frame-track-group={track.id} key={track.id}>
                    <div
                      data-frame-track={track.id}
                      data-track-kind={track.kind}
                      className="grid grid-cols-[7rem_auto] items-center gap-0"
                    >
                      <strong
                        className={cx(
                          "sticky left-0 z-10 self-stretch bg-(--ui-frame-track) pr-2",
                          track.kind === comboFrameMeterTrackKinds.meta
                            ? "py-0.5 text-xs uppercase tracking-wide text-(--ui-frame-muted-text)"
                            : "py-2 text-sm",
                        )}
                      >
                        {track.label}
                      </strong>
                      <div
                        aria-hidden={compact ? "true" : undefined}
                        style={getFrameGridStyle(timelineGrid.cellCount)}
                        className={cx(
                          "grid",
                          track.kind === comboFrameMeterTrackKinds.meta ? "min-h-4" : "min-h-7",
                        )}
                      >
                        {track.segments.map((segment) => {
                          const selected = openSegmentId === segment.id;
                          const focused = props.model.state.focusedSegmentId === segment.id;
                          const controllerFocused = controllerFocusVisible && focused;
                          const segmentIndex = segmentIndexes.get(segment.id) ?? 0;
                          const triggerId = segmentTriggerIds.get(segment.id);
                          const ariaLabel = `${segment.label}. ${segment.rangeLabel}. ${segment.validityLabel}${segment.reason ? `. ${segment.reason}` : ""}`;
                          const style = {
                            gridColumn: `${segment.startCell + 1} / span ${segment.cellCount}`,
                          };
                          const cellClassName = frameMeterCellRecipe({
                            focused: !compact && controllerFocused,
                            frozen,
                            interactive: !compact,
                            kind: segment.kind,
                            selected,
                            trackKind: track.kind,
                            validity: segment.validity,
                          });

                          return (
                            <Show
                              when={!compact}
                              key={segment.id}
                              fallback={() => (
                                <span
                                  style={style}
                                  key={segment.id}
                                  data-kind={segment.kind}
                                  className={cellClassName}
                                  data-frame-cell-run={segment.id}
                                  data-validity={segment.validity}
                                  data-cell-count={segment.cellCount}
                                  data-start-cell={segment.startCell}
                                  data-frozen={frozen ? "true" : undefined}
                                  data-selected={selected ? "true" : undefined}
                                  title={`${segment.label}: ${segment.rangeLabel}`}
                                  data-focused={controllerFocused ? "true" : undefined}
                                  ref={(element) => {
                                    if (element) {
                                      segmentAnchorRefs.current.set(segment.id, element);
                                    } else {
                                      segmentAnchorRefs.current.delete(segment.id);
                                    }
                                  }}
                                />
                              )}
                            >
                              {() => (
                                <BasePopover.Trigger
                                  style={style}
                                  type="button"
                                  id={triggerId}
                                  key={segment.id}
                                  disabled={frozen}
                                  aria-label={ariaLabel}
                                  aria-pressed={selected}
                                  data-kind={segment.kind}
                                  className={cellClassName}
                                  data-frame-cell-run={segment.id}
                                  data-validity={segment.validity}
                                  data-cell-count={segment.cellCount}
                                  data-start-cell={segment.startCell}
                                  data-frozen={frozen ? "true" : undefined}
                                  onClick={() => openDetails(segment.id)}
                                  onFocus={() => focusSegment(segment.id)}
                                  data-selected={selected ? "true" : undefined}
                                  title={`${segment.label}: ${segment.rangeLabel}`}
                                  data-focused={controllerFocused ? "true" : undefined}
                                  onKeyDown={(event) => handleSegmentKeyDown(event, segment.id)}
                                  tabIndex={
                                    frozen
                                      ? -1
                                      : focused ||
                                          (!props.model.state.focusedSegmentId &&
                                            segmentIndex === 0)
                                        ? 0
                                        : -1
                                  }
                                  aria-describedby={
                                    segment.reason
                                      ? `${props.snapshot.id}-${segment.id}-reason`
                                      : undefined
                                  }
                                  ref={(element: HTMLButtonElement | null) => {
                                    if (element) {
                                      segmentAnchorRefs.current.set(segment.id, element);
                                      segmentTriggerRefs.current.set(segment.id, element);
                                    } else {
                                      segmentAnchorRefs.current.delete(segment.id);
                                      segmentTriggerRefs.current.delete(segment.id);
                                    }
                                  }}
                                />
                              )}
                            </Show>
                          );
                        })}
                      </div>
                    </div>

                    <Show
                      when={
                        track.kind === comboFrameMeterTrackKinds.primary &&
                        timelineGrid.sections.length > 0
                      }
                    >
                      {() => (
                        <div className="grid grid-cols-[7rem_auto] gap-0" data-frame-section-counts>
                          <span aria-hidden="true" />
                          <div className="grid" style={getFrameGridStyle(timelineGrid.cellCount)}>
                            {track.segments.map((segment) => {
                              const frameCountLabel =
                                segment.frameCountLabel ?? `${segment.cellCount}f`;

                              return (
                                <span
                                  key={segment.id}
                                  data-cell-count={segment.cellCount}
                                  data-segment-frame-count={segment.id}
                                  data-frame-count-label={frameCountLabel}
                                  className="px-1 text-center text-[0.6875rem] font-semibold tabular-nums text-(--ui-frame-muted-text)"
                                  style={{
                                    gridColumn: `${segment.startCell + 1} / span ${segment.cellCount}`,
                                  }}
                                >
                                  <span className="sr-only">{segment.label}: </span>
                                  {frameCountLabel}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </Show>
                  </div>
                ))}
              </div>
            </div>

            <Show when={compact && segments.length > 0}>
              {() => (
                <div
                  role="toolbar"
                  aria-orientation="horizontal"
                  data-frame-segment-navigation
                  aria-label={props.snapshot.timelineLabel}
                  className="flex min-w-0 snap-x snap-proximity gap-1 overflow-x-auto pb-1"
                >
                  {segments.map((segment, index) => {
                    const selected = openSegmentId === segment.id;
                    const focused = props.model.state.focusedSegmentId === segment.id;
                    const controllerFocused = controllerFocusVisible && focused;
                    const describedBy = segment.reason
                      ? `${props.snapshot.id}-${segment.id}-reason`
                      : undefined;
                    const triggerId = segmentTriggerIds.get(segment.id);

                    return (
                      <BasePopover.Trigger
                        type="button"
                        id={triggerId}
                        key={segment.id}
                        disabled={frozen}
                        aria-pressed={selected}
                        aria-expanded={selected}
                        data-kind={segment.kind}
                        aria-controls={detailsId}
                        data-segment-id={segment.id}
                        aria-describedby={describedBy}
                        data-validity={segment.validity}
                        data-frozen={frozen ? "true" : undefined}
                        onClick={() => openDetails(segment.id)}
                        onFocus={() => focusSegment(segment.id)}
                        data-disabled={frozen ? "true" : undefined}
                        data-focused={controllerFocused ? "true" : undefined}
                        onKeyDown={(event) => handleSegmentKeyDown(event, segment.id)}
                        tabIndex={
                          frozen
                            ? -1
                            : focused || (!props.model.state.focusedSegmentId && index === 0)
                              ? 0
                              : -1
                        }
                        aria-label={`${segment.label}. ${segment.rangeLabel}. ${segment.validityLabel}${segment.reason ? `. ${segment.reason}` : ""}`}
                        className={frameMeterSegmentRecipe({
                          focused: controllerFocused,
                          frozen,
                          kind: segment.kind,
                          selected,
                          validity: segment.validity,
                        })}
                        ref={(element: HTMLButtonElement | null) => {
                          if (element) {
                            segmentTriggerRefs.current.set(segment.id, element);
                          } else {
                            segmentTriggerRefs.current.delete(segment.id);
                          }
                        }}
                      >
                        <span className="grid min-w-0 gap-1">
                          <span className="inline-flex items-center gap-1">
                            <SegmentValidityIndicator validity={segment.validity} />
                            <span className="truncate">{segment.label}</span>
                          </span>
                          <span className="truncate font-normal">{segment.rangeLabel}</span>
                        </span>
                      </BasePopover.Trigger>
                    );
                  })}
                </div>
              )}
            </Show>

            <Show when={legendGroups.length > 0}>
              {() => (
                <section
                  data-frame-legend
                  aria-label={timelineGrid.legendLabel}
                  className={cx(
                    "grid min-w-0 gap-3 text-xs",
                    compact || legendGroups.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]",
                  )}
                >
                  {legendGroups.map((group) => (
                    <fieldset
                      key={group.key}
                      data-frame-legend-category={group.key}
                      className="grid min-w-0 content-start gap-2 border-0 p-0"
                    >
                      <legend
                        className={cx(
                          group.label
                            ? "text-xs font-semibold uppercase tracking-wide text-(--ui-frame-muted-text)"
                            : "sr-only",
                        )}
                      >
                        {group.label ?? timelineGrid.legendLabel}
                      </legend>
                      <ul className="flex min-w-0 list-none flex-wrap gap-3 p-0">
                        {group.items.map((item) => {
                          const descriptionSuffix = item.description
                            ? ` — ${item.description}`
                            : "";

                          return (
                            <li className="inline-flex min-w-0 items-center gap-2" key={item.id}>
                              <span
                                aria-hidden="true"
                                className={cx(
                                  frameMeterCellRecipe({
                                    kind: item.kind,
                                    validity: comboFrameMeterSegmentValidities.valid,
                                  }),
                                  "h-4 w-7 shrink-0 rounded-sm border-l",
                                )}
                              />
                              <span>
                                <strong>{item.label}</strong>
                                {descriptionSuffix}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </fieldset>
                  ))}
                </section>
              )}
            </Show>
          </fieldset>
        )}

        {segments
          .filter((segment) => segment.reason)
          .map((segment) => (
            <StatusMessage
              key={segment.id}
              id={`${props.snapshot.id}-${segment.id}-reason`}
              tone={
                segment.validity === comboFrameMeterSegmentValidities.invalid
                  ? uiToneModes.destructive
                  : uiToneModes.warning
              }
            >
              <strong>{segment.validityLabel}:</strong> {segment.reason}
            </StatusMessage>
          ))}
      </section>

      <Show when={Boolean(openSegment)}>
        {() => {
          if (!openSegment) {
            return null;
          }

          return (
            <PopoverPortal>
              <PopoverPositioner
                sideOffset={10}
                key={openSegment.id}
                side={uiFloatingSides.top}
                align={uiFloatingAlignments.center}
                anchor={() => segmentAnchorRefs.current.get(openSegment.id) ?? null}
              >
                <PopoverArrow
                  className={
                    openSegment.validity === comboFrameMeterSegmentValidities.invalid
                      ? "border-(--ui-destructive) bg-(--ui-destructive-soft)"
                      : undefined
                  }
                />
                <PopoverPopup
                  id={detailsId}
                  aria-live="polite"
                  data-segment-details={openSegment.id}
                  aria-label={`${props.labels.details}: ${openSegment.label}`}
                  className={cx(
                    "grid w-[min(22rem,calc(100vw-2rem))] min-w-0 gap-3 p-3",
                    openSegment.validity === comboFrameMeterSegmentValidities.invalid
                      ? "border-(--ui-destructive) bg-(--ui-destructive-soft)"
                      : undefined,
                  )}
                >
                  <Group justify="between">
                    <PopoverTitle>{openSegment.label}</PopoverTitle>
                    <Badge tone={validityTone(openSegment.validity)}>
                      {openSegment.validityLabel}
                    </Badge>
                  </Group>
                  <PopoverDescription className="text-sm text-(--ui-text)">
                    {openSegment.summary}
                  </PopoverDescription>
                  <Stack role="list">
                    {openSegment.details.map((item) => (
                      <Group justify="between" key={item.id} role="listitem" wrap={false}>
                        <span className="text-(--ui-muted-text)">{item.label}</span>
                        <span data-frame-value={item.frameValue}>{item.value}</span>
                      </Group>
                    ))}
                  </Stack>
                  <Show when={Boolean(openSegment.reason)}>
                    {() => (
                      <StatusMessage
                        tone={
                          openSegment.validity === comboFrameMeterSegmentValidities.invalid
                            ? uiToneModes.destructive
                            : uiToneModes.warning
                        }
                      >
                        {openSegment.reason}
                      </StatusMessage>
                    )}
                  </Show>
                  <Group>
                    <Show when={Boolean(openSegment.matchingWhiteboardStepId)}>
                      {() => (
                        <Button
                          disabled={frozen}
                          className={compact ? "min-h-11 min-w-11" : undefined}
                          onRequestPress={() =>
                            emit({
                              action: comboFrameMeterActions.focusMatchingWhiteboardStep,
                              reason: componentInteractionReasons.press,
                              segmentId: openSegment.id,
                              sourceFocusTarget: props.sourceFocusTarget,
                              sourceSurface: props.sourceSurface,
                              whiteboardStepId: openSegment.matchingWhiteboardStepId ?? "",
                            })
                          }
                        >
                          {props.labels.focusMatchingWhiteboardStep}
                        </Button>
                      )}
                    </Show>
                    <PopoverClose
                      disabled={frozen}
                      className={compact ? "min-h-11 min-w-11" : undefined}
                    >
                      {props.labels.closeDetails}
                    </PopoverClose>
                  </Group>
                </PopoverPopup>
              </PopoverPositioner>
            </PopoverPortal>
          );
        }}
      </Show>
    </PopoverRoot>
  );
}

ComboFrameMeter.displayName = "ComboFrameMeter";
