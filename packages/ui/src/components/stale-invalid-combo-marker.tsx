import type { ComboRef } from "@mk-combos/contracts/identity/type";

import { AlertTriangleIcon } from "../icons/alert-triangle";
import { EditIcon } from "../icons/edit";
import { RepairIcon } from "../icons/repair";
import { Trash2Icon } from "../icons/trash-2";
import { ViewDetailIcon } from "../icons/view-detail";
import { XIcon } from "../icons/x";
import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import { Group, Stack } from "../primitives/layout";
import { Badge, StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import type { ComponentActionDescriptor, ComponentActionIntent } from "./type";
import { componentInteractionReasons } from "./value";

export const staleInvalidComboMarkerActions = {
  dismissInvalidMarker: "dismissInvalidMarker",
  editInvalidCombo: "editInvalidCombo",
  openInvalidComboDetail: "openInvalidComboDetail",
  removeInvalidComboFromList: "removeInvalidComboFromList",
  repairInvalidCombo: "repairInvalidCombo",
} as const;

export type StaleInvalidComboMarkerAction =
  (typeof staleInvalidComboMarkerActions)[keyof typeof staleInvalidComboMarkerActions];

export const staleInvalidComboMarkerStates = {
  informational: "informational",
  invalid: "invalid",
  repairAvailable: "repairAvailable",
  repairUnavailable: "repairUnavailable",
  stale: "stale",
} as const;

export type StaleInvalidComboMarkerState =
  (typeof staleInvalidComboMarkerStates)[keyof typeof staleInvalidComboMarkerStates];

export const staleInvalidComboMarkerActionKinds = {
  dismiss: "dismiss",
  edit: "edit",
  openDetail: "openDetail",
  removeFromList: "removeFromList",
  repair: "repair",
} as const;

export type StaleInvalidComboMarkerActionKind =
  (typeof staleInvalidComboMarkerActionKinds)[keyof typeof staleInvalidComboMarkerActionKinds];

export type StaleInvalidComboMarkerActionDescriptor = ComponentActionDescriptor & {
  kind: StaleInvalidComboMarkerActionKind;
};

export type StaleInvalidComboMarkerModel = {
  actions: readonly StaleInvalidComboMarkerActionDescriptor[];
  affectedReference?: string;
  comboRef: ComboRef;
  reason: string;
  state: StaleInvalidComboMarkerState;
  stateLabel: string;
  validPrefixSummary?: string;
};

export type StaleInvalidComboMarkerIntent = ComponentActionIntent<StaleInvalidComboMarkerAction> & {
  actionId: string;
  affectedReference?: string;
  comboRef: ComboRef;
};

export type StaleInvalidComboMarkerProps = StaleInvalidComboMarkerModel & {
  onRequestAction?: (intent: StaleInvalidComboMarkerIntent) => void;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

const actionByKind = {
  dismiss: staleInvalidComboMarkerActions.dismissInvalidMarker,
  edit: staleInvalidComboMarkerActions.editInvalidCombo,
  openDetail: staleInvalidComboMarkerActions.openInvalidComboDetail,
  removeFromList: staleInvalidComboMarkerActions.removeInvalidComboFromList,
  repair: staleInvalidComboMarkerActions.repairInvalidCombo,
} as const satisfies Record<StaleInvalidComboMarkerActionKind, StaleInvalidComboMarkerAction>;

function renderMarkerActionIcon(kind: StaleInvalidComboMarkerActionKind) {
  switch (kind) {
    case staleInvalidComboMarkerActionKinds.dismiss:
      return <XIcon aria-hidden="true" size="small" />;
    case staleInvalidComboMarkerActionKinds.edit:
      return <EditIcon aria-hidden="true" size="small" />;
    case staleInvalidComboMarkerActionKinds.openDetail:
      return <ViewDetailIcon aria-hidden="true" size="small" />;
    case staleInvalidComboMarkerActionKinds.removeFromList:
      return <Trash2Icon aria-hidden="true" size="small" />;
    case staleInvalidComboMarkerActionKinds.repair:
      return <RepairIcon aria-hidden="true" size="small" />;
  }

  const unhandledKind: never = kind;
  return unhandledKind;
}

export function StaleInvalidComboMarker(props: StaleInvalidComboMarkerProps) {
  const informational = props.state === staleInvalidComboMarkerStates.informational;
  const disabledReasonActions = props.actions.filter(
    (descriptor) => !descriptor.available && descriptor.disabledReason,
  );

  return (
    <section
      data-ui-component="UI-CMP-031"
      data-marker-state={props.state}
      className="grid min-w-0 gap-2 rounded-(--ui-radius-control) border border-(--ui-warning-border) bg-(--ui-warning-soft) p-3"
    >
      <Group align="start" wrap={false}>
        <AlertTriangleIcon aria-hidden="true" size="small" />
        <Stack>
          <Badge
            tone={informational ? uiToneModes.neutral : uiToneModes.warning}
            className="h-auto min-h-5.5 max-w-full shrink whitespace-normal break-words py-1 text-start leading-snug"
          >
            {props.stateLabel}
          </Badge>
          <StatusMessage
            className="break-words"
            tone={informational ? uiToneModes.neutral : uiToneModes.warning}
          >
            {props.reason}
          </StatusMessage>
        </Stack>
      </Group>
      <Show when={Boolean(props.affectedReference)}>
        {() => (
          <code className="break-all text-xs leading-snug text-(--ui-muted-text)">
            {props.affectedReference}
          </code>
        )}
      </Show>
      <Show when={Boolean(props.validPrefixSummary)}>
        {() => (
          <p className="break-words text-xs leading-snug text-(--ui-muted-text)">
            {props.validPrefixSummary}
          </p>
        )}
      </Show>
      <Show when={props.actions.length > 0}>
        {() => (
          <Group>
            {props.actions.map((descriptor) => {
              const dismissBlocked =
                descriptor.kind === staleInvalidComboMarkerActionKinds.dismiss && !informational;
              return (
                <Button
                  key={descriptor.id}
                  tone={descriptor.tone ?? uiToneModes.warning}
                  disabled={!descriptor.available || dismissBlocked}
                  className="h-auto min-h-7 max-w-full shrink whitespace-normal break-words py-1.5 text-start leading-snug"
                  onRequestPress={() =>
                    props.onRequestAction?.({
                      action: actionByKind[descriptor.kind],
                      actionId: descriptor.id,
                      affectedReference: props.affectedReference,
                      comboRef: props.comboRef,
                      reason: componentInteractionReasons.press,
                      sourceFocusTarget: props.sourceFocusTarget,
                      sourceSurface: props.sourceSurface,
                    })
                  }
                >
                  {renderMarkerActionIcon(descriptor.kind)}
                  {descriptor.label}
                </Button>
              );
            })}
          </Group>
        )}
      </Show>
      <Show when={disabledReasonActions.length > 0}>
        {() => (
          <ul className="grid min-w-0 list-none gap-1 p-0">
            {disabledReasonActions.map((descriptor) => (
              <li
                key={`${descriptor.id}-disabled-reason`}
                className="break-words text-xs leading-snug text-(--ui-muted-text)"
              >
                <span className="font-semibold text-(--ui-text)">{descriptor.label}:</span>{" "}
                {descriptor.disabledReason}
              </li>
            ))}
          </ul>
        )}
      </Show>
    </section>
  );
}

StaleInvalidComboMarker.displayName = "StaleInvalidComboMarker";
