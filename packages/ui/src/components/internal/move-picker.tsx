import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { Button } from "../../primitives/button";
import { Group, Stack } from "../../primitives/layout";
import { Badge, LoadingIndicator, StatusMessage } from "../../primitives/state";
import { cx } from "../../recipes/class-name";
import { uiToneModes } from "../../tokens/value";
import type {
  ComboWhiteboardCandidate,
  ComboWhiteboardEditTarget,
  ComboWhiteboardGroup,
  ComboWhiteboardLabels,
  ComboWhiteboardMetaItem,
} from "../combo-whiteboard";
import { NotationRenderer, notationRendererDensities } from "../notation-renderer";
import type { UiResponsiveMode } from "../type";
import { uiResponsiveModes } from "../value";
import { SelectableItem } from "./selectable-item";

export type MovePickerProps = {
  busy: boolean;
  canMoveToNextGroup: boolean;
  canMoveToPreviousGroup: boolean;
  candidates: readonly ComboWhiteboardCandidate[];
  disabled: boolean;
  editTarget: ComboWhiteboardEditTarget;
  editTargetLabel: string;
  focusedCandidateId?: string;
  groups: readonly ComboWhiteboardGroup[];
  labels: ComboWhiteboardLabels;
  notationDisplayMode: NotationDisplayMode;
  onFocusCandidate: (candidateId: string, focusTargetId?: string) => void;
  onMoveToNextGroup: () => void;
  onMoveToPreviousGroup: () => void;
  onOpenCandidateDetails: (candidateId: string, focusTargetId?: string) => void;
  onSelectCandidate: (candidateId: string, focusTargetId?: string) => void;
  onSelectGroup: (groupId: string) => void;
  onUseAppendTarget: () => void;
  responsiveMode: UiResponsiveMode;
  selectedGroupId?: string;
  statusMessage?: string;
};

const candidateAccessibleLabel = (candidate: ComboWhiteboardCandidate) => {
  const parts = [candidate.accessibleLabel ?? candidate.label];
  if (candidate.disabledReason) parts.push(candidate.disabledReason);
  for (const item of candidate.metaItems) {
    if ("reason" in item) parts.push(`${item.label}: ${item.reason}`);
  }
  return parts.join(". ");
};

function CandidateMetaBadge(props: { item: ComboWhiteboardMetaItem }) {
  const reason = "reason" in props.item ? props.item.reason : undefined;

  return (
    <Badge
      className={cx(
        "h-auto min-h-5.5 min-w-0 max-w-full flex-wrap justify-start gap-x-1 gap-y-0.5 whitespace-normal py-1 text-start leading-tight",
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
      <span className="min-w-0 break-words font-semibold">{props.item.label}</span>
      {props.item.value && <span className="min-w-0 break-words">{props.item.value}</span>}
      {reason && <span className="min-w-0 break-words">{reason}</span>}
    </Badge>
  );
}

CandidateMetaBadge.displayName = "CandidateMetaBadge";

export function MovePicker(props: MovePickerProps) {
  const currentGroup = props.groups.find((group) => group.id === props.selectedGroupId);
  const showGroups = props.groups.length > 0;
  const emptyMessage = props.statusMessage ?? props.labels.noCandidates;
  const compactTargetClassName =
    props.responsiveMode === uiResponsiveModes.desktop ? undefined : "min-h-11 min-w-11";
  const verticalCandidates = props.responsiveMode === uiResponsiveModes.mobile;

  return (
    <div
      aria-busy={props.busy || undefined}
      className="grid min-w-0 content-start gap-3"
      data-ui-combo-whiteboard-picker
      data-ui-combo-whiteboard-picker-layout={verticalCandidates ? "vertical" : "horizontal"}
    >
      <Stack density="mini">
        <Group justify="between">
          <span className="font-semibold text-[var(--ui-text)]">{props.editTargetLabel}</span>
          <Button
            className={compactTargetClassName}
            disabled={props.disabled || props.busy}
            onRequestPress={props.onUseAppendTarget}
          >
            {props.labels.useAppendTarget}
          </Button>
        </Group>
        {currentGroup && (
          <span className="text-xs text-[var(--ui-muted-text)]">{currentGroup.label}</span>
        )}
      </Stack>

      {showGroups && (
        <fieldset className="grid gap-2 border-0 p-0">
          <legend className="sr-only">{props.labels.groups}</legend>
          <Group className="overflow-x-auto p-1" wrap={false}>
            <Button
              aria-label={props.labels.previousGroup}
              className={compactTargetClassName}
              disabled={props.disabled || props.busy || !props.canMoveToPreviousGroup}
              onRequestPress={props.onMoveToPreviousGroup}
            >
              {props.labels.previousGroup}
            </Button>
            {props.groups.map((group) => (
              <SelectableItem
                accessibleLabel={
                  group.disabledReason
                    ? `${group.label}: ${group.disabledReason}`
                    : (group.accessibleLabel ?? group.label)
                }
                className="min-h-11 grid-cols-[1fr] px-3 py-2"
                disabled={props.disabled || props.busy || group.available === false}
                key={group.id}
                onRequestPress={() => props.onSelectGroup(group.id)}
                selected={group.id === props.selectedGroupId}
                value={`move-group-${group.id}`}
              >
                <span className="grid gap-1">
                  <span>{group.label}</span>
                  {group.disabledReason && (
                    <span className="text-xs text-[var(--ui-destructive)]">
                      {group.disabledReason}
                    </span>
                  )}
                </span>
              </SelectableItem>
            ))}
            <Button
              aria-label={props.labels.nextGroup}
              className={compactTargetClassName}
              disabled={props.disabled || props.busy || !props.canMoveToNextGroup}
              onRequestPress={props.onMoveToNextGroup}
            >
              {props.labels.nextGroup}
            </Button>
          </Group>
        </fieldset>
      )}

      <ul
        aria-label={props.labels.candidates}
        className={cx(
          "min-w-0 list-none gap-2 p-0",
          verticalCandidates
            ? "grid"
            : "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain p-1",
        )}
      >
        {props.candidates.map((candidate) => {
          const disabled = props.disabled || props.busy || !candidate.available;
          const focused = candidate.id === props.focusedCandidateId;

          return (
            <li
              className={cx(
                "grid min-w-0 grid-cols-1 content-start gap-2",
                verticalCandidates ? "w-full" : "w-72 shrink-0 snap-start",
              )}
              data-controller-focused={focused ? "true" : undefined}
              data-ui-combo-whiteboard-candidate={candidate.id}
              data-ui-focus-target={candidate.focusTargetId ?? `combo-candidate-${candidate.id}`}
              key={candidate.id}
            >
              <SelectableItem
                accessibleLabel={candidateAccessibleLabel(candidate)}
                busy={props.busy}
                className="min-h-16 min-w-0 grid-cols-[minmax(0,1fr)] p-3 text-start"
                current={focused}
                disabled={disabled}
                onRequestFocus={() => props.onFocusCandidate(candidate.id, candidate.focusTargetId)}
                onRequestPress={() =>
                  props.onSelectCandidate(candidate.id, candidate.focusTargetId)
                }
                value={`move-candidate-${candidate.id}`}
              >
                <span className="grid min-w-0 gap-1">
                  <span className="font-semibold">{candidate.label}</span>
                  <NotationRenderer
                    accessibleLabel={candidate.notationLabel}
                    density={notationRendererDensities.compact}
                    notation={candidate.notation}
                    notationDisplayMode={props.notationDisplayMode}
                  />
                  <span
                    className="grid min-w-0 grid-cols-1 justify-items-start gap-1"
                    data-ui-combo-whiteboard-candidate-meta
                  >
                    {candidate.metaItems.map((item) => (
                      <CandidateMetaBadge item={item} key={item.id} />
                    ))}
                  </span>
                  {candidate.disabledReason && (
                    <span className="text-xs text-[var(--ui-destructive)]">
                      {candidate.disabledReason}
                    </span>
                  )}
                </span>
              </SelectableItem>
              {candidate.detailsAction && (
                <span
                  className="grid min-w-0 content-start gap-1"
                  data-ui-combo-whiteboard-candidate-details
                >
                  <Button
                    aria-label={
                      candidate.detailsAction.disabledReason
                        ? `${candidate.detailsAction.label}: ${candidate.detailsAction.disabledReason}`
                        : candidate.detailsAction.label
                    }
                    className="h-auto min-h-11 w-full min-w-11 whitespace-normal px-3 py-2 leading-tight"
                    disabled={props.disabled || props.busy || !candidate.detailsAction.available}
                    onRequestPress={() =>
                      props.onOpenCandidateDetails(candidate.id, candidate.focusTargetId)
                    }
                  >
                    {candidate.detailsAction.label}
                  </Button>
                  {candidate.detailsAction.disabledReason && (
                    <span className="max-w-40 text-xs text-[var(--ui-destructive)]">
                      {candidate.detailsAction.disabledReason}
                    </span>
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {props.busy && <LoadingIndicator label={props.labels.loadingCandidates} />}
      {!props.busy && props.candidates.length === 0 && (
        <StatusMessage>{emptyMessage}</StatusMessage>
      )}
      {props.statusMessage && props.candidates.length > 0 && (
        <StatusMessage tone={uiToneModes.neutral}>{props.statusMessage}</StatusMessage>
      )}
      {props.labels.hints.length > 0 && (
        <ul className="grid gap-1 pl-4 text-xs text-[var(--ui-muted-text)]">
          {props.labels.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      )}
      <span className="sr-only" data-ui-combo-whiteboard-edit-target>
        {props.editTarget.operation}
      </span>
    </div>
  );
}

MovePicker.displayName = "MovePicker";
