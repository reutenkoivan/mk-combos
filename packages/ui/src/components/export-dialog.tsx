import { useComponentActionEmitter, useComponentOpenChangeEmitter } from "../hooks/intents";
import { DownloadIcon } from "../icons/download";
import { useUiRootContext } from "../internal/ui-root-context";
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
import { StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import type { BackupAvailability, BackupLocalStateSummary, ComponentActionIntent } from "./type";

export const exportDialogActions = {
  cancelExport: "cancelExport",
  close: "close",
  confirmExport: "confirmExport",
} as const;

export type ExportDialogAction = (typeof exportDialogActions)[keyof typeof exportDialogActions];

export type ExportDialogProps = {
  cancelLabel: string;
  confirmLabel: string;
  controllerFocusedAction?: ExportDialogAction;
  description: string;
  exportAvailability: BackupAvailability;
  localStateSummary: BackupLocalStateSummary;
  onRequestAction?: (intent: ComponentActionIntent<ExportDialogAction>) => void;
  open: boolean;
  sourceFocusTarget?: string;
  sourceSurface: string;
  title: string;
  busy?: boolean;
  warningMessage?: string;
};

export function ExportDialog(props: ExportDialogProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const actionEmitter = useComponentActionEmitter<ExportDialogAction>({
    onRequest: props.onRequestAction,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });
  const closeEmitter = useComponentOpenChangeEmitter<ExportDialogAction>({
    closeAction: exportDialogActions.close,
    onRequest: props.onRequestAction,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <DialogRoot
      open={props.open}
      sourceFocusTarget={props.sourceFocusTarget}
      onOpenChange={closeEmitter.methods.handleOpenChange}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup
            data-ui-component="UI-CMP-027"
            className="grid-rows-[minmax(0,1fr)_auto] overflow-hidden"
          >
            <div className="grid min-h-0 gap-4 overflow-y-auto overscroll-contain pb-3">
              <div className="grid gap-1">
                <DialogTitle>{props.title}</DialogTitle>
                <DialogDescription>{props.description}</DialogDescription>
              </div>
              <div className="grid gap-2 text-sm">
                <p>{props.localStateSummary.settingsSummary}</p>
                <p>{props.localStateSummary.gameSlices.map((slice) => slice.label).join(", ")}</p>
              </div>
              <Show when={Boolean(props.warningMessage)}>
                {() => (
                  <StatusMessage tone={uiToneModes.warning}>{props.warningMessage}</StatusMessage>
                )}
              </Show>
              <Show
                when={
                  Boolean(props.exportAvailability.disabledReason) &&
                  !props.exportAvailability.available
                }
              >
                {() => (
                  <StatusMessage tone={uiToneModes.warning}>
                    {props.exportAvailability.disabledReason}
                  </StatusMessage>
                )}
              </Show>
            </div>
            <div className="sticky bottom-0 z-10 flex flex-col-reverse items-stretch gap-2 border-t border-(--ui-separator) bg-(--ui-dialog) pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <Button
                data-ui-focus-target={`${props.sourceFocusTarget ?? "export-dialog"}:cancel`}
                onRequestPress={() =>
                  actionEmitter.methods.emitAction(exportDialogActions.cancelExport)
                }
                data-controller-focused={
                  controllerFocusVisible &&
                  props.controllerFocusedAction === exportDialogActions.cancelExport
                    ? "true"
                    : undefined
                }
              >
                {props.cancelLabel}
              </Button>
              <Button
                loading={props.busy}
                tone={uiToneModes.accent}
                disabled={!props.exportAvailability.available || props.busy}
                data-ui-focus-target={`${props.sourceFocusTarget ?? "export-dialog"}:confirm`}
                onRequestPress={() =>
                  actionEmitter.methods.emitAction(exportDialogActions.confirmExport)
                }
                data-controller-focused={
                  controllerFocusVisible &&
                  props.controllerFocusedAction === exportDialogActions.confirmExport
                    ? "true"
                    : undefined
                }
              >
                <DownloadIcon aria-hidden="true" size="small" />
                {props.confirmLabel}
              </Button>
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );
}

ExportDialog.displayName = "ExportDialog";
