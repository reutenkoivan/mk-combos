import type { ComboRef } from "@mk-combos/contracts/identity/type";

import { Button } from "../primitives/button";
import { Group, Stack } from "../primitives/layout";
import { Badge } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import {
  StaleInvalidComboMarker,
  type StaleInvalidComboMarkerIntent,
  type StaleInvalidComboMarkerModel,
} from "./stale-invalid-combo-marker";
import type { ComponentActionDescriptor, ComponentActionIntent, ComponentLabelValue } from "./type";
import { componentInteractionReasons } from "./value";

export const comboDetailHeaderActions = {
  duplicateCombo: "duplicateCombo",
  editCustomCombo: "editCustomCombo",
  openAddToList: "openAddToList",
  repairCustomCombo: "repairCustomCombo",
  returnToSource: "returnToSource",
} as const;

export type ComboDetailHeaderAction =
  (typeof comboDetailHeaderActions)[keyof typeof comboDetailHeaderActions];

export const comboDetailHeaderActionKinds = {
  addToList: "addToList",
  duplicate: "duplicate",
  edit: "edit",
  repair: "repair",
  returnToSource: "returnToSource",
} as const;

export type ComboDetailHeaderActionKind =
  (typeof comboDetailHeaderActionKinds)[keyof typeof comboDetailHeaderActionKinds];

export type ComboDetailHeaderActionDescriptor = ComponentActionDescriptor & {
  kind: ComboDetailHeaderActionKind;
};

export type ComboDetailHeaderIntent = ComponentActionIntent<ComboDetailHeaderAction> & {
  actionId: string;
  comboRef: ComboRef;
};

export type ComboDetailHeaderProps = {
  actions: readonly ComboDetailHeaderActionDescriptor[];
  busy?: boolean;
  comboRef: ComboRef;
  contextItems: readonly ComponentLabelValue[];
  marker?: StaleInvalidComboMarkerModel;
  onRequestAction?: (intent: ComboDetailHeaderIntent) => void;
  onRequestMarkerAction?: (intent: StaleInvalidComboMarkerIntent) => void;
  sourceFocusTarget?: string;
  sourceLabel: string;
  sourceSurface: string;
  title: string;
};

const actionByKind = {
  addToList: comboDetailHeaderActions.openAddToList,
  duplicate: comboDetailHeaderActions.duplicateCombo,
  edit: comboDetailHeaderActions.editCustomCombo,
  repair: comboDetailHeaderActions.repairCustomCombo,
  returnToSource: comboDetailHeaderActions.returnToSource,
} as const satisfies Record<ComboDetailHeaderActionKind, ComboDetailHeaderAction>;

export function ComboDetailHeader(props: ComboDetailHeaderProps) {
  return (
    <header className="grid min-w-0 gap-3" data-ui-component="UI-CMP-014">
      <Stack>
        <Group justify="between">
          <h1 className="min-w-0 text-xl font-semibold">{props.title}</h1>
          <Badge>{props.sourceLabel}</Badge>
        </Group>
        {props.contextItems.length > 0 && (
          <Group>
            {props.contextItems.map((item) => (
              <Badge key={item.id} tone={item.tone ?? uiToneModes.neutral}>
                {item.label}: {item.value}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
      {props.actions.length > 0 && (
        <Group>
          {props.actions.map((descriptor) => (
            <Button
              disabled={props.busy || !descriptor.available}
              key={descriptor.id}
              loading={props.busy}
              onRequestPress={() =>
                props.onRequestAction?.({
                  action: actionByKind[descriptor.kind],
                  actionId: descriptor.id,
                  comboRef: props.comboRef,
                  reason: componentInteractionReasons.press,
                  sourceFocusTarget: props.sourceFocusTarget,
                  sourceSurface: props.sourceSurface,
                })
              }
              tone={descriptor.tone ?? uiToneModes.neutral}
            >
              {descriptor.label}
            </Button>
          ))}
        </Group>
      )}
      {props.marker && (
        <StaleInvalidComboMarker
          {...props.marker}
          onRequestAction={props.onRequestMarkerAction}
          sourceFocusTarget={props.sourceFocusTarget}
          sourceSurface={props.sourceSurface}
        />
      )}
    </header>
  );
}

ComboDetailHeader.displayName = "ComboDetailHeader";
