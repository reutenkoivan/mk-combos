import type { ComboRef } from "@mk-combos/contracts/identity/type";

import { AddToListIcon } from "../icons/add-to-list";
import { PlusIcon } from "../icons/plus";
import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import {
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogViewport,
} from "../primitives/dialog";
import { Group, Stack } from "../primitives/layout";
import { Badge, StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import { SelectableItem } from "./internal/selectable-item";
import type {
  ComboPresentationSummary,
  ComponentActionDescriptor,
  ComponentActionIntent,
  ComponentAvailability,
  NamedListSummary,
} from "./type";
import { componentInteractionReasons } from "./value";

export const addToListDialogActions = {
  closeAddToList: "closeAddToList",
  createListFromDialog: "createListFromDialog",
  retryAddToList: "retryAddToList",
  selectTargetList: "selectTargetList",
  submitAddToList: "submitAddToList",
} as const;

export type AddToListDialogAction =
  (typeof addToListDialogActions)[keyof typeof addToListDialogActions];

export type AddToListOption = {
  alreadyMember: boolean;
  available: boolean;
  disabledReason?: string;
  summary: NamedListSummary;
};

export type AddToListDialogIntent = ComponentActionIntent<AddToListDialogAction> & {
  actionId?: string;
  comboRef: ComboRef;
  targetListId?: string;
};

export type AddToListDialogProps = {
  busy?: boolean;
  cancelLabel: string;
  comboSummary: ComboPresentationSummary;
  compatibleListsLabel: string;
  compatibleLists: readonly AddToListOption[];
  createListAction?: ComponentActionDescriptor;
  description: string;
  errorMessage?: string;
  membershipLabel: string;
  onRequestAction?: (intent: AddToListDialogIntent) => void;
  open: boolean;
  retryAction?: ComponentActionDescriptor;
  selectedListId?: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
  submitAvailability: ComponentAvailability;
  submitLabel: string;
  title: string;
};

export function AddToListDialog(props: AddToListDialogProps) {
  const selected = props.compatibleLists.find(
    (option) => option.summary.id === props.selectedListId,
  );
  const canSubmit = Boolean(
    selected?.available &&
      !selected.alreadyMember &&
      props.submitAvailability.available &&
      !props.busy,
  );
  const emit = (action: AddToListDialogAction, targetListId?: string, actionId?: string) =>
    props.onRequestAction?.({
      action,
      actionId,
      comboRef: props.comboSummary.ref,
      reason: componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
      targetListId,
    });

  return (
    <DialogRoot
      open={props.open}
      disablePointerDismissal={props.busy}
      sourceFocusTarget={props.sourceFocusTarget}
      onOpenChange={({ open, reason, sourceFocusTarget }) => {
        if (!open) {
          props.onRequestAction?.({
            action: addToListDialogActions.closeAddToList,
            comboRef: props.comboSummary.ref,
            reason,
            sourceFocusTarget: sourceFocusTarget ?? props.sourceFocusTarget,
            sourceSurface: props.sourceSurface,
          });
        }
      }}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup
            data-ui-component="UI-CMP-021"
            className="grid-rows-[minmax(0,1fr)_auto] overflow-hidden"
          >
            <Stack className="min-h-0 overflow-y-auto overscroll-contain pb-3" density="medium">
              <Stack>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogDescription>{props.description}</DialogDescription>
              </Stack>
              <Stack>
                <strong>{props.comboSummary.title}</strong>
                <Group>
                  {props.comboSummary.contextItems.map((item) => (
                    <Badge
                      key={item.id}
                      className="h-auto min-h-5.5 max-w-full shrink whitespace-normal break-words py-1 text-start leading-snug"
                    >
                      {item.label}: {item.value}
                    </Badge>
                  ))}
                </Group>
              </Stack>
              <fieldset className="grid min-w-0 gap-2 border-0 p-0">
                <legend className="sr-only">{props.compatibleListsLabel}</legend>
                {props.compatibleLists.map((option) => {
                  const membershipSummary = option.alreadyMember
                    ? props.membershipLabel
                    : option.summary.itemCount;

                  return (
                    <SelectableItem
                      key={option.summary.id}
                      value={option.summary.id}
                      selected={option.summary.id === props.selectedListId}
                      className="grid-cols-[minmax(0,1fr)_auto] px-3 py-2"
                      disabled={!option.available || option.alreadyMember || props.busy}
                      onRequestPress={() =>
                        emit(addToListDialogActions.selectTargetList, option.summary.id)
                      }
                      accessibleLabel={[
                        option.summary.name,
                        option.alreadyMember ? props.membershipLabel : undefined,
                        option.disabledReason,
                      ]
                        .filter(Boolean)
                        .join(": ")}
                    >
                      <span className="grid min-w-0 gap-1 text-start">
                        <span className="break-words font-medium leading-snug">
                          {option.summary.name}
                        </span>
                        <Show when={Boolean(option.disabledReason)}>
                          {() => (
                            <span className="break-words text-xs leading-snug text-(--ui-muted-text)">
                              {option.disabledReason}
                            </span>
                          )}
                        </Show>
                      </span>
                      <span className="text-xs text-(--ui-muted-text)">{membershipSummary}</span>
                    </SelectableItem>
                  );
                })}
              </fieldset>
              <Show when={Boolean(props.errorMessage)}>
                {() => (
                  <StatusMessage tone={uiToneModes.destructive}>{props.errorMessage}</StatusMessage>
                )}
              </Show>
              <Show
                when={Boolean(
                  !props.submitAvailability.available && props.submitAvailability.disabledReason,
                )}
              >
                {() => <StatusMessage>{props.submitAvailability.disabledReason}</StatusMessage>}
              </Show>
              <Show
                when={Boolean(
                  props.createListAction &&
                    !props.createListAction.available &&
                    props.createListAction.disabledReason,
                )}
              >
                {() => (
                  <StatusMessage>
                    <span className="font-semibold text-(--ui-text)">
                      {props.createListAction?.label}:
                    </span>{" "}
                    {props.createListAction?.disabledReason}
                  </StatusMessage>
                )}
              </Show>
              <Show
                when={Boolean(
                  props.retryAction &&
                    props.errorMessage &&
                    !props.retryAction.available &&
                    props.retryAction.disabledReason,
                )}
              >
                {() => (
                  <StatusMessage>
                    <span className="font-semibold text-(--ui-text)">
                      {props.retryAction?.label}:
                    </span>{" "}
                    {props.retryAction?.disabledReason}
                  </StatusMessage>
                )}
              </Show>
            </Stack>
            <Group
              justify="end"
              className="sticky bottom-0 z-10 w-full flex-col-reverse items-stretch border-t border-(--ui-separator) bg-(--ui-dialog) pt-3 sm:flex-row sm:items-center"
            >
              <Show when={Boolean(props.createListAction)}>
                {() => (
                  <Button
                    disabled={!props.createListAction?.available || props.busy}
                    className="h-auto min-h-7 max-w-full shrink whitespace-normal break-words py-1.5 text-start leading-snug"
                    onRequestPress={() =>
                      emit(
                        addToListDialogActions.createListFromDialog,
                        undefined,
                        props.createListAction?.id,
                      )
                    }
                  >
                    <PlusIcon aria-hidden="true" size="small" />
                    {props.createListAction?.label}
                  </Button>
                )}
              </Show>
              <Show when={Boolean(props.retryAction && props.errorMessage)}>
                {() => (
                  <Button
                    disabled={!props.retryAction?.available || props.busy}
                    className="h-auto min-h-7 max-w-full shrink whitespace-normal break-words py-1.5 text-start leading-snug"
                    onRequestPress={() =>
                      emit(
                        addToListDialogActions.retryAddToList,
                        props.selectedListId,
                        props.retryAction?.id,
                      )
                    }
                  >
                    {props.retryAction?.label}
                  </Button>
                )}
              </Show>
              <Button
                disabled={props.busy}
                onRequestPress={() => emit(addToListDialogActions.closeAddToList)}
                className="h-auto min-h-7 max-w-full shrink whitespace-normal break-words py-1.5 text-start leading-snug"
              >
                {props.cancelLabel}
              </Button>
              <Button
                loading={props.busy}
                disabled={!canSubmit}
                tone={uiToneModes.accent}
                onRequestPress={() =>
                  emit(addToListDialogActions.submitAddToList, props.selectedListId)
                }
                className="h-auto min-h-7 max-w-full shrink whitespace-normal break-words py-1.5 text-start leading-snug"
              >
                <AddToListIcon aria-hidden="true" size="small" />
                {props.submitLabel}
              </Button>
            </Group>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );
}

AddToListDialog.displayName = "AddToListDialog";
