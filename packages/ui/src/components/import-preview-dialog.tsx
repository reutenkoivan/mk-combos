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
  DialogViewport,
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
  const validationMessageKeyCounts = new Map<string, number>();
  const validationMessages = props.validationResult.gameSliceMessages?.map((message) => {
    const baseKey = `${message.gameId}-${message.tone}-${message.message}`;
    const occurrence = (validationMessageKeyCounts.get(baseKey) ?? 0) + 1;

    validationMessageKeyCounts.set(baseKey, occurrence);

    return { key: `${baseKey}-${occurrence}`, message };
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
        <DialogViewport>
          <DialogPopup
            className="grid-rows-[minmax(0,1fr)_auto] overflow-hidden"
            data-backup-candidate-id={props.backupCandidateId}
            data-ui-component="UI-CMP-028"
          >
            <div className="grid min-h-0 gap-4 overflow-y-auto overscroll-contain pb-3">
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
              {validationMessages?.map(({ key, message }) => (
                <StatusMessage key={key} tone={message.tone}>
                  {message.message}
                </StatusMessage>
              ))}
            </div>
            <div className="sticky bottom-0 z-10 flex flex-col-reverse items-stretch gap-2 border-t border-(--ui-separator) bg-(--ui-dialog) pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
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
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );
}

ImportPreviewDialog.displayName = "ImportPreviewDialog";
