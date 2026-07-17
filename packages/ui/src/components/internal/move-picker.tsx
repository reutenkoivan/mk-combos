import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { useUiRootContext } from "../../internal/ui-root-context";
import { Button } from "../../primitives/button";
import { Present, type PresentContentProps, Show } from "../../primitives/conditional";
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
      tone={props.item.tone}
      data-meta-status={props.item.status}
      className={cx(
        "h-auto min-h-5.5 min-w-0 max-w-full flex-wrap justify-start gap-x-1 gap-y-0.5 whitespace-normal py-1 text-start leading-tight",
        reason && "border-dashed",
      )}
    >
      <Show when={Boolean(reason)}>
        {() => (
          <span aria-hidden="true" className="font-black">
            ?
          </span>
        )}
      </Show>
      <span className="min-w-0 break-words font-semibold">{props.item.label}</span>
      <Show when={Boolean(props.item.value)}>
        {() => <span className="min-w-0 break-words">{props.item.value}</span>}
      </Show>
      <Show when={Boolean(reason)}>
        {() => <span className="min-w-0 break-words">{reason}</span>}
      </Show>
    </Badge>
  );
}

CandidateMetaBadge.displayName = "CandidateMetaBadge";

function CurrentGroupContent({ value }: PresentContentProps<ComboWhiteboardGroup>) {
  return <span className="text-xs text-(--ui-muted-text)">{value.label}</span>;
}

type CandidateDetailsContentValue = Readonly<{
  action: NonNullable<ComboWhiteboardCandidate["detailsAction"]>;
  blocked: boolean;
  candidate: ComboWhiteboardCandidate;
  onOpen: (candidateId: string, focusTargetId?: string) => void;
}>;

function CandidateDetailsContent({ value }: PresentContentProps<CandidateDetailsContentValue>) {
  return (
    <span className="grid min-w-0 content-start gap-1" data-ui-combo-whiteboard-candidate-details>
      <Button
        disabled={value.blocked || !value.action.available}
        onRequestPress={() => value.onOpen(value.candidate.id, value.candidate.focusTargetId)}
        className="h-auto min-h-11 w-full min-w-11 whitespace-normal px-3 py-2 leading-tight"
        aria-label={
          value.action.disabledReason
            ? `${value.action.label}: ${value.action.disabledReason}`
            : value.action.label
        }
      >
        {value.action.label}
      </Button>
      <Show when={Boolean(value.action.disabledReason)}>
        {() => (
          <span className="max-w-40 text-xs text-(--ui-destructive)">
            {value.action.disabledReason}
          </span>
        )}
      </Show>
    </span>
  );
}

export function MovePicker(props: MovePickerProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const currentGroup = props.groups.find((group) => group.id === props.selectedGroupId);
  const showGroups = props.groups.length > 0;
  const emptyMessage = props.statusMessage ?? props.labels.noCandidates;
  const compactTargetClassName =
    props.responsiveMode === uiResponsiveModes.desktop ? undefined : "min-h-11 min-w-11";
  const verticalCandidates = props.responsiveMode === uiResponsiveModes.mobile;

  return (
    <div
      data-ui-combo-whiteboard-picker
      aria-busy={props.busy || undefined}
      className="grid min-w-0 content-start gap-3"
      data-ui-combo-whiteboard-picker-layout={verticalCandidates ? "vertical" : "horizontal"}
    >
      <Stack density="mini">
        <Group justify="between">
          <span className="font-semibold text-(--ui-text)">{props.editTargetLabel}</span>
          <Button
            className={compactTargetClassName}
            disabled={props.disabled || props.busy}
            onRequestPress={props.onUseAppendTarget}
          >
            {props.labels.useAppendTarget}
          </Button>
        </Group>
        <Present value={currentGroup}>{CurrentGroupContent}</Present>
      </Stack>

      <Show when={showGroups}>
        {() => (
          <fieldset className="grid gap-2 border-0 p-0">
            <legend className="sr-only">{props.labels.groups}</legend>
            <Group className="overflow-x-auto p-1" wrap={false}>
              <Button
                className={compactTargetClassName}
                aria-label={props.labels.previousGroup}
                onRequestPress={props.onMoveToPreviousGroup}
                disabled={props.disabled || props.busy || !props.canMoveToPreviousGroup}
              >
                {props.labels.previousGroup}
              </Button>
              {props.groups.map((group) => (
                <SelectableItem
                  key={group.id}
                  value={`move-group-${group.id}`}
                  selected={group.id === props.selectedGroupId}
                  className="min-h-11 grid-cols-[1fr] px-3 py-2"
                  onRequestPress={() => props.onSelectGroup(group.id)}
                  disabled={props.disabled || props.busy || group.available === false}
                  accessibleLabel={
                    group.disabledReason
                      ? `${group.label}: ${group.disabledReason}`
                      : (group.accessibleLabel ?? group.label)
                  }
                >
                  <span className="grid gap-1">
                    <span>{group.label}</span>
                    <Show when={Boolean(group.disabledReason)}>
                      {() => (
                        <span className="text-xs text-(--ui-destructive)">
                          {group.disabledReason}
                        </span>
                      )}
                    </Show>
                  </span>
                </SelectableItem>
              ))}
              <Button
                className={compactTargetClassName}
                aria-label={props.labels.nextGroup}
                onRequestPress={props.onMoveToNextGroup}
                disabled={props.disabled || props.busy || !props.canMoveToNextGroup}
              >
                {props.labels.nextGroup}
              </Button>
            </Group>
          </fieldset>
        )}
      </Show>

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
          const controllerFocused = controllerFocusVisible && focused;

          return (
            <li
              key={candidate.id}
              data-ui-combo-whiteboard-candidate={candidate.id}
              data-controller-focused={controllerFocused ? "true" : undefined}
              data-ui-focus-target={candidate.focusTargetId ?? `combo-candidate-${candidate.id}`}
              className={cx(
                "grid min-w-0 grid-cols-1 content-start gap-2",
                verticalCandidates ? "w-full" : "w-72 shrink-0 snap-start",
              )}
            >
              <SelectableItem
                busy={props.busy}
                disabled={disabled}
                current={controllerFocused}
                value={`move-candidate-${candidate.id}`}
                accessibleLabel={candidateAccessibleLabel(candidate)}
                className="min-h-16 min-w-0 grid-cols-[minmax(0,1fr)] p-3 text-start"
                onRequestFocus={() => props.onFocusCandidate(candidate.id, candidate.focusTargetId)}
                onRequestPress={() =>
                  props.onSelectCandidate(candidate.id, candidate.focusTargetId)
                }
              >
                <span className="grid min-w-0 gap-1">
                  <span className="font-semibold">{candidate.label}</span>
                  <NotationRenderer
                    notation={candidate.notation}
                    accessibleLabel={candidate.notationLabel}
                    density={notationRendererDensities.compact}
                    notationDisplayMode={props.notationDisplayMode}
                  />
                  <span
                    data-ui-combo-whiteboard-candidate-meta
                    className="grid min-w-0 grid-cols-1 justify-items-start gap-1"
                  >
                    {candidate.metaItems.map((item) => (
                      <CandidateMetaBadge item={item} key={item.id} />
                    ))}
                  </span>
                  <Show when={Boolean(candidate.disabledReason)}>
                    {() => (
                      <span className="text-xs text-(--ui-destructive)">
                        {candidate.disabledReason}
                      </span>
                    )}
                  </Show>
                </span>
              </SelectableItem>
              <Present
                value={
                  candidate.detailsAction
                    ? {
                        action: candidate.detailsAction,
                        blocked: props.disabled || props.busy,
                        candidate,
                        onOpen: props.onOpenCandidateDetails,
                      }
                    : undefined
                }
              >
                {CandidateDetailsContent}
              </Present>
            </li>
          );
        })}
      </ul>

      <Show when={props.busy}>
        {() => <LoadingIndicator label={props.labels.loadingCandidates} />}
      </Show>
      <Show when={!props.busy && props.candidates.length === 0}>
        {() => <StatusMessage>{emptyMessage}</StatusMessage>}
      </Show>
      <Show when={Boolean(props.statusMessage) && props.candidates.length > 0}>
        {() => <StatusMessage tone={uiToneModes.neutral}>{props.statusMessage}</StatusMessage>}
      </Show>
      <Show when={props.labels.hints.length > 0}>
        {() => (
          <ul className="grid gap-1 pl-4 text-xs text-(--ui-muted-text)">
            {props.labels.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        )}
      </Show>
      <span className="sr-only" data-ui-combo-whiteboard-edit-target>
        {props.editTarget.operation}
      </span>
    </div>
  );
}

MovePicker.displayName = "MovePicker";
