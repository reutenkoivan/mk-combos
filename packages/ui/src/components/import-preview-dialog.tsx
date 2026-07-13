import { AlertTriangleIcon } from "../icons/alert-triangle";
import { UploadIcon } from "../icons/upload";
import { Button } from "../primitives/button";
import {
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "../primitives/dialog";
import { StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import { createActionIntent } from "./runtime";
import type {
  BackupAvailability,
  BackupLocalStateSummary,
  BackupValidationResult,
  ComponentActionIntent,
} from "./type";
import { backupValidationStatuses, componentInteractionReasons } from "./value";

export const importPreviewDialogActions = {
  cancelImport: "cancelImport",
  close: "close",
  confirmReplace: "confirmReplace",
  retryFileSelection: "retryFileSelection",
} as const;

export type ImportPreviewDialogAction =
  (typeof importPreviewDialogActions)[keyof typeof importPreviewDialogActions];

export type ImportPreviewDialogProps = {
  backupCandidateId: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmationAvailability: BackupAvailability;
  description: string;
  localStateSummary: BackupLocalStateSummary;
  onRequestAction?: (intent: ImportPreviewActionIntent) => void;
  open: boolean;
  replaceImpactSummary: string;
  retryLabel: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
  title: string;
  validationResult: BackupValidationResult;
  busy?: boolean;
};

export type ImportPreviewActionIntent = ComponentActionIntent<ImportPreviewDialogAction> & {
  backupCandidateId: string;
};

export function ImportPreviewDialog(props: ImportPreviewDialogProps) {
  const canReplace =
    props.confirmationAvailability.available &&
    (props.validationResult.status === backupValidationStatuses.valid ||
      props.validationResult.status === backupValidationStatuses.warning) &&
    !props.busy;
  const emit = (action: ImportPreviewDialogAction) =>
    props.onRequestAction?.({
      ...createActionIntent({
        action,
        reason: componentInteractionReasons.press,
        sourceFocusTarget: props.sourceFocusTarget,
        sourceSurface: props.sourceSurface,
      }),
      backupCandidateId: props.backupCandidateId,
    });

  return (
    <DialogRoot
      disablePointerDismissal={props.busy}
      onOpenChange={({ open, reason }) => {
        if (!open) {
          props.onRequestAction?.({
            ...createActionIntent({
              action: importPreviewDialogActions.close,
              reason,
              sourceFocusTarget: props.sourceFocusTarget,
              sourceSurface: props.sourceSurface,
            }),
            backupCandidateId: props.backupCandidateId,
          });
        }
      }}
      open={props.open}
      sourceFocusTarget={props.sourceFocusTarget}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup
          data-backup-candidate-id={props.backupCandidateId}
          data-ui-component="UI-CMP-028"
        >
          <div className="grid gap-4">
            <div className="grid gap-1">
              <DialogTitle>{props.title}</DialogTitle>
              <DialogDescription>{props.description}</DialogDescription>
            </div>
            <div className="grid gap-2 text-sm">
              <p>{props.localStateSummary.settingsSummary}</p>
              <p>{props.replaceImpactSummary}</p>
            </div>
            {props.validationResult.message && (
              <StatusMessage
                tone={
                  props.validationResult.status === backupValidationStatuses.invalid
                    ? uiToneModes.destructive
                    : uiToneModes.warning
                }
              >
                <AlertTriangleIcon aria-hidden="true" size="small" />
                {props.validationResult.message}
              </StatusMessage>
            )}
            {props.validationResult.gameSliceMessages?.map((message) => (
              <StatusMessage key={`${message.gameId}-${message.message}`} tone={message.tone}>
                {message.message}
              </StatusMessage>
            ))}
            <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-[var(--ui-separator)] bg-[var(--ui-dialog)] pt-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                disabled={props.busy}
                onRequestPress={() => emit(importPreviewDialogActions.cancelImport)}
              >
                {props.cancelLabel}
              </Button>
              <Button
                disabled={props.busy}
                onRequestPress={() => emit(importPreviewDialogActions.retryFileSelection)}
              >
                {props.retryLabel}
              </Button>
              <Button
                disabled={!canReplace}
                loading={props.busy}
                onRequestPress={() => emit(importPreviewDialogActions.confirmReplace)}
                tone={uiToneModes.destructive}
              >
                <UploadIcon aria-hidden="true" size="small" />
                {props.confirmLabel}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}

ImportPreviewDialog.displayName = "ImportPreviewDialog";
