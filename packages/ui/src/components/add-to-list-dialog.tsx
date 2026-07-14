import type { ComboRef } from "@mk-combos/contracts/identity/type";

import { PlusIcon } from "../icons/plus";
import { Button } from "../primitives/button";
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
      disablePointerDismissal={props.busy}
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
      open={props.open}
      sourceFocusTarget={props.sourceFocusTarget}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup
            className="grid-rows-[minmax(0,1fr)_auto] overflow-hidden"
            data-ui-component="UI-CMP-021"
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
                    <Badge key={item.id}>
                      {item.label}: {item.value}
                    </Badge>
                  ))}
                </Group>
              </Stack>
              <fieldset className="grid min-w-0 gap-2 border-0 p-0">
                <legend className="sr-only">Compatible named lists</legend>
                {props.compatibleLists.map((option) => (
                  <SelectableItem
                    accessibleLabel={option.disabledReason ?? option.summary.name}
                    className="grid-cols-[1fr_auto] px-3 py-2"
                    disabled={!option.available || option.alreadyMember || props.busy}
                    key={option.summary.id}
                    onRequestPress={() =>
                      emit(addToListDialogActions.selectTargetList, option.summary.id)
                    }
                    selected={option.summary.id === props.selectedListId}
                    value={option.summary.id}
                  >
                    <span className="text-start">{option.summary.name}</span>
                    <span className="text-xs text-(--ui-muted-text)">
                      {option.alreadyMember ? props.membershipLabel : option.summary.itemCount}
                    </span>
                  </SelectableItem>
                ))}
              </fieldset>
              {props.errorMessage && (
                <StatusMessage tone={uiToneModes.destructive}>{props.errorMessage}</StatusMessage>
              )}
            </Stack>
            <Group
              className="sticky bottom-0 z-10 w-full flex-col-reverse items-stretch border-t border-(--ui-separator) bg-(--ui-dialog) pt-3 sm:flex-row sm:items-center"
              justify="end"
            >
              {props.createListAction && (
                <Button
                  disabled={!props.createListAction.available || props.busy}
                  onRequestPress={() =>
                    emit(
                      addToListDialogActions.createListFromDialog,
                      undefined,
                      props.createListAction?.id,
                    )
                  }
                >
                  <PlusIcon aria-hidden="true" size="small" />
                  {props.createListAction.label}
                </Button>
              )}
              {props.retryAction && props.errorMessage && (
                <Button
                  disabled={!props.retryAction.available || props.busy}
                  onRequestPress={() =>
                    emit(
                      addToListDialogActions.retryAddToList,
                      props.selectedListId,
                      props.retryAction?.id,
                    )
                  }
                >
                  {props.retryAction.label}
                </Button>
              )}
              <Button
                disabled={props.busy}
                onRequestPress={() => emit(addToListDialogActions.closeAddToList)}
              >
                {props.cancelLabel}
              </Button>
              <Button
                disabled={!canSubmit}
                loading={props.busy}
                onRequestPress={() =>
                  emit(addToListDialogActions.submitAddToList, props.selectedListId)
                }
                tone={uiToneModes.accent}
              >
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
