import type { ComboRef } from "@mk-combos/contracts/identity/type";

import { AlertTriangleIcon } from "../icons/alert-triangle";
import { Button } from "../primitives/button";
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

export function StaleInvalidComboMarker(props: StaleInvalidComboMarkerProps) {
  const informational = props.state === staleInvalidComboMarkerStates.informational;

  return (
    <section
      className="grid min-w-0 gap-2 rounded-[var(--ui-radius-control)] border border-[var(--ui-warning-border)] bg-[var(--ui-warning-soft)] p-3"
      data-marker-state={props.state}
      data-ui-component="UI-CMP-031"
    >
      <Group align="start" wrap={false}>
        <AlertTriangleIcon aria-hidden="true" size="small" />
        <Stack>
          <Badge tone={informational ? uiToneModes.neutral : uiToneModes.warning}>
            {props.state}
          </Badge>
          <StatusMessage tone={informational ? uiToneModes.neutral : uiToneModes.warning}>
            {props.reason}
          </StatusMessage>
        </Stack>
      </Group>
      {props.affectedReference && (
        <code className="text-xs text-[var(--ui-muted-text)]">{props.affectedReference}</code>
      )}
      {props.validPrefixSummary && (
        <p className="text-xs text-[var(--ui-muted-text)]">{props.validPrefixSummary}</p>
      )}
      {props.actions.length > 0 && (
        <Group>
          {props.actions.map((descriptor) => {
            const dismissBlocked =
              descriptor.kind === staleInvalidComboMarkerActionKinds.dismiss && !informational;
            return (
              <Button
                disabled={!descriptor.available || dismissBlocked}
                key={descriptor.id}
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
                tone={descriptor.tone ?? uiToneModes.warning}
              >
                {descriptor.label}
              </Button>
            );
          })}
        </Group>
      )}
    </section>
  );
}

StaleInvalidComboMarker.displayName = "StaleInvalidComboMarker";
