import type { ComboRef } from "@mk-combos/contracts/identity/type";

import { AddToListIcon } from "../icons/add-to-list";
import { DuplicateIcon } from "../icons/duplicate";
import { EditIcon } from "../icons/edit";
import { RepairIcon } from "../icons/repair";
import { ReturnIcon } from "../icons/return";
import { useUiRootContext } from "../internal/ui-root-context";
import { Button } from "../primitives/button";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
import { Group, Stack } from "../primitives/layout";
import { Badge } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import {
  StaleInvalidComboMarker,
  type StaleInvalidComboMarkerIntent,
  type StaleInvalidComboMarkerModel,
  type StaleInvalidComboMarkerProps,
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
  controllerFocusedActionId?: string;
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

function renderHeaderActionIcon(kind: ComboDetailHeaderActionKind) {
  switch (kind) {
    case comboDetailHeaderActionKinds.addToList:
      return <AddToListIcon aria-hidden="true" size="small" />;
    case comboDetailHeaderActionKinds.duplicate:
      return <DuplicateIcon aria-hidden="true" size="small" />;
    case comboDetailHeaderActionKinds.edit:
      return <EditIcon aria-hidden="true" size="small" />;
    case comboDetailHeaderActionKinds.repair:
      return <RepairIcon aria-hidden="true" size="small" />;
    case comboDetailHeaderActionKinds.returnToSource:
      return <ReturnIcon aria-hidden="true" size="small" />;
  }

  const unhandledKind: never = kind;
  return unhandledKind;
}

function StaleInvalidComboMarkerContent({
  value,
}: PresentContentProps<StaleInvalidComboMarkerProps>) {
  return <StaleInvalidComboMarker {...value} />;
}

export function ComboDetailHeader(props: ComboDetailHeaderProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const disabledReasonActions = props.actions.filter(
    (descriptor) => !descriptor.available && descriptor.disabledReason,
  );

  return (
    <header className="grid min-w-0 gap-3" data-ui-component="UI-CMP-014">
      <Stack>
        <Group justify="between">
          <h1 className="min-w-0 break-words text-xl font-semibold leading-snug">{props.title}</h1>
          <Badge className="h-auto max-w-full shrink whitespace-normal break-words py-1 text-start leading-snug">
            {props.sourceLabel}
          </Badge>
        </Group>
        <Show when={props.contextItems.length > 0}>
          {() => (
            <Group>
              {props.contextItems.map((item) => (
                <Badge
                  key={item.id}
                  tone={item.tone ?? uiToneModes.neutral}
                  className="h-auto min-h-5.5 max-w-full shrink whitespace-normal break-words py-1 text-start leading-snug"
                >
                  <span className="break-words leading-snug">
                    {item.label}: {item.value}
                  </span>
                </Badge>
              ))}
            </Group>
          )}
        </Show>
      </Stack>
      <Show when={props.actions.length > 0}>
        {() => (
          <Group>
            {props.actions.map((descriptor) => (
              <Button
                key={descriptor.id}
                loading={props.busy}
                data-ui-focus-target={descriptor.id}
                tone={descriptor.tone ?? uiToneModes.neutral}
                disabled={props.busy || !descriptor.available}
                className="h-auto min-h-7 max-w-full shrink whitespace-normal break-words py-1.5 text-start leading-snug"
                data-controller-focused={
                  controllerFocusVisible && props.controllerFocusedActionId === descriptor.id
                    ? "true"
                    : undefined
                }
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
              >
                {renderHeaderActionIcon(descriptor.kind)}
                {descriptor.label}
              </Button>
            ))}
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
      <Present
        value={
          props.marker
            ? {
                ...props.marker,
                onRequestAction: props.onRequestMarkerAction,
                sourceFocusTarget: props.sourceFocusTarget,
                sourceSurface: props.sourceSurface,
              }
            : undefined
        }
      >
        {StaleInvalidComboMarkerContent}
      </Present>
    </header>
  );
}

ComboDetailHeader.displayName = "ComboDetailHeader";
