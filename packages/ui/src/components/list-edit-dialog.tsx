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
      open={props.open}
      disablePointerDismissal={props.busy}
      sourceFocusTarget={props.sourceFocusTarget}
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
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup
            data-ui-component="UI-CMP-022"
            data-list-edit-mode={props.mode}
            className="grid-rows-[minmax(0,1fr)_auto] overflow-hidden"
          >
            <Stack className="min-h-0 overflow-y-auto overscroll-contain pb-3" density="medium">
              <Stack>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogDescription>{props.description}</DialogDescription>
              </Stack>
              <Show
                when={nameMode}
                fallback={() => (
                  <Show when={Boolean(props.deleteImpactMessage)}>
                    {() => (
                      <p className="text-sm text-(--ui-destructive)">{props.deleteImpactMessage}</p>
                    )}
                  </Show>
                )}
              >
                {() => (
                  <Field>
                    <FieldLabel>{props.fieldLabel}</FieldLabel>
                    <TextInput
                      disabled={props.busy}
                      value={props.draftName}
                      aria-label={props.fieldLabel}
                      invalid={Boolean(props.validationMessage)}
                      onValueChange={({ value }) =>
                        emit(
                          listEditDialogActions.changeListDraftName,
                          value,
                          componentInteractionReasons.inputChange,
                        )
                      }
                    />
                    <Show when={Boolean(props.validationMessage)}>
                      {() => <FieldMessage invalid>{props.validationMessage}</FieldMessage>}
                    </Show>
                  </Field>
                )}
              </Show>
            </Stack>
            <Group
              justify="end"
              className="sticky bottom-0 z-10 w-full flex-col-reverse items-stretch border-t border-(--ui-separator) bg-(--ui-dialog) pt-3 sm:flex-row sm:items-center"
            >
              <Button
                disabled={props.busy}
                onRequestPress={() => emit(listEditDialogActions.closeListEdit)}
              >
                {props.cancelLabel}
              </Button>
              <Button
                loading={props.busy}
                disabled={!props.submitAvailability.available || props.busy}
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
