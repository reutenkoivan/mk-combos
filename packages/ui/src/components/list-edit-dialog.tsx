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
import { Field, FieldLabel, FieldMessage, TextInput } from "../primitives/field";
import { Group, Stack } from "../primitives/layout";
import { uiToneModes } from "../tokens/value";
import type { ComponentActionIntent, ComponentAvailability, NamedListSummary } from "./type";
import { componentInteractionReasons } from "./value";

export const listEditDialogActions = {
  changeListDraftName: "changeListDraftName",
  closeListEdit: "closeListEdit",
  returnFocusToLists: "returnFocusToLists",
  submitListEdit: "submitListEdit",
} as const;

export type ListEditDialogAction =
  (typeof listEditDialogActions)[keyof typeof listEditDialogActions];

export const listEditDialogModes = {
  createList: "createList",
  deleteListConfirm: "deleteListConfirm",
  renameList: "renameList",
} as const;

export type ListEditDialogMode = (typeof listEditDialogModes)[keyof typeof listEditDialogModes];

export type ListEditDialogIntent = ComponentActionIntent<ListEditDialogAction> & {
  listId?: string;
  mode: ListEditDialogMode;
  value?: string;
};

export type ListEditDialogProps = {
  busy?: boolean;
  cancelLabel: string;
  deleteImpactMessage?: string;
  description: string;
  draftName: string;
  fieldLabel: string;
  mode: ListEditDialogMode;
  onRequestAction?: (intent: ListEditDialogIntent) => void;
  open: boolean;
  selectedList?: NamedListSummary;
  sourceFocusTarget?: string;
  sourceSurface: string;
  submitAvailability: ComponentAvailability;
  submitLabel: string;
  title: string;
  validationMessage?: string;
};

export function ListEditDialog(props: ListEditDialogProps) {
  const emit = (
    action: ListEditDialogAction,
    value?: string,
    reason: "inputChange" | "press" = componentInteractionReasons.press,
  ) =>
    props.onRequestAction?.({
      action,
      listId: props.selectedList?.id,
      mode: props.mode,
      reason,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
      value,
    });
  const nameMode = props.mode !== listEditDialogModes.deleteListConfirm;

  return (
    <DialogRoot
      disablePointerDismissal={props.busy}
      onOpenChange={({ open, reason, sourceFocusTarget }) => {
        if (!open) {
          props.onRequestAction?.({
            action: listEditDialogActions.closeListEdit,
            listId: props.selectedList?.id,
            mode: props.mode,
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
            data-list-edit-mode={props.mode}
            data-ui-component="UI-CMP-022"
          >
            <Stack className="min-h-0 overflow-y-auto overscroll-contain pb-3" density="medium">
              <Stack>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogDescription>{props.description}</DialogDescription>
              </Stack>
              {nameMode ? (
                <Field>
                  <FieldLabel>{props.fieldLabel}</FieldLabel>
                  <TextInput
                    aria-label={props.fieldLabel}
                    disabled={props.busy}
                    invalid={Boolean(props.validationMessage)}
                    onValueChange={({ value }) =>
                      emit(
                        listEditDialogActions.changeListDraftName,
                        value,
                        componentInteractionReasons.inputChange,
                      )
                    }
                    value={props.draftName}
                  />
                  {props.validationMessage && (
                    <FieldMessage invalid>{props.validationMessage}</FieldMessage>
                  )}
                </Field>
              ) : (
                props.deleteImpactMessage && (
                  <p className="text-sm text-[var(--ui-destructive)]">
                    {props.deleteImpactMessage}
                  </p>
                )
              )}
            </Stack>
            <Group
              className="sticky bottom-0 z-10 w-full flex-col-reverse items-stretch border-t border-[var(--ui-separator)] bg-[var(--ui-dialog)] pt-3 sm:flex-row sm:items-center"
              justify="end"
            >
              <Button
                disabled={props.busy}
                onRequestPress={() => emit(listEditDialogActions.closeListEdit)}
              >
                {props.cancelLabel}
              </Button>
              <Button
                disabled={!props.submitAvailability.available || props.busy}
                loading={props.busy}
                onRequestPress={() => emit(listEditDialogActions.submitListEdit, props.draftName)}
                tone={
                  props.mode === listEditDialogModes.deleteListConfirm
                    ? uiToneModes.destructive
                    : uiToneModes.accent
                }
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

ListEditDialog.displayName = "ListEditDialog";
