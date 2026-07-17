import { useId } from "react";

import { useComponentActionEmitter } from "../hooks/intents";
import { ChevronDownIcon } from "../icons/chevron-down";
import { DownloadIcon } from "../icons/download";
import { UploadIcon } from "../icons/upload";
import { useUiRootContext } from "../internal/ui-root-context";
import { Button } from "../primitives/button";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
import { DisclosurePanel, DisclosureRoot, DisclosureTrigger } from "../primitives/disclosure";
import { StatusMessage } from "../primitives/state";
import { cx } from "../recipes/class-name";
import { uiEmphasisModes, uiMaterialModes, uiToneModes } from "../tokens/value";
import { ExportDialog, type ExportDialogProps } from "./export-dialog";
import { ImportPreviewDialog, type ImportPreviewDialogProps } from "./import-preview-dialog";
import type {
  BackupAvailability,
  BackupDisclosureState,
  BackupLocalStateSummary,
  BackupOperationState,
  BackupValidationResult,
  ComponentActionIntent,
} from "./type";
import {
  backupDisclosureStates,
  backupOperationStates,
  backupValidationStatuses,
  componentInteractionReasons,
} from "./value";

export const backupCollapsibleBlockActions = {
  collapse: "collapse",
  expand: "expand",
  export: "export",
  openFilePicker: "openFilePicker",
} as const;

export type BackupCollapsibleBlockAction =
  (typeof backupCollapsibleBlockActions)[keyof typeof backupCollapsibleBlockActions];

export type BackupCollapsibleBlockProps = {
  controllerFocusedAction?: BackupCollapsibleBlockAction;
  disclosureState: BackupDisclosureState;
  exportAvailability: BackupAvailability;
  exportDialog?: ExportDialogProps;
  exportLabel: string;
  importAvailability: BackupAvailability;
  importLabel: string;
  importPreviewDialog?: ImportPreviewDialogProps;
  importCompleteMessage?: string;
  localStateSummary: BackupLocalStateSummary;
  onRequestAction?: (intent: ComponentActionIntent<BackupCollapsibleBlockAction>) => void;
  operationState: BackupOperationState;
  initialAutoExpand?: boolean;
  sourceFocusTarget?: string;
  sourceSurface: string;
  title: string;
  validationResult: BackupValidationResult;
};

const blockingOperations: readonly BackupOperationState[] = [
  backupOperationStates.exporting,
  backupOperationStates.importFilePicker,
  backupOperationStates.importPreview,
  backupOperationStates.importValidating,
  backupOperationStates.replaceConfirm,
  backupOperationStates.replaceBusy,
];

function ExportDialogContent({ value }: PresentContentProps<ExportDialogProps>) {
  return <ExportDialog {...value} />;
}

function ImportPreviewDialogContent({ value }: PresentContentProps<ImportPreviewDialogProps>) {
  return <ImportPreviewDialog {...value} />;
}

export function BackupCollapsibleBlock(props: BackupCollapsibleBlockProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const summaryId = useId();
  const blocking = blockingOperations.includes(props.operationState);
  const expanded = props.disclosureState === backupDisclosureStates.expanded;
  const busy =
    props.operationState !== backupOperationStates.idle &&
    props.operationState !== backupOperationStates.importComplete;
  const actionEmitter = useComponentActionEmitter<BackupCollapsibleBlockAction>({
    defaultReason: componentInteractionReasons.press,
    onRequest: props.onRequestAction,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <>
      <section
        data-ui-component="UI-CMP-034"
        data-operation={props.operationState}
        className="border-t border-(--ui-separator) pt-4"
        data-initial-auto-expand={props.initialAutoExpand || undefined}
      >
        <DisclosureRoot
          open={expanded}
          disabled={blocking}
          sourceFocusTarget={props.sourceFocusTarget}
          onOpenChange={({ open }) =>
            actionEmitter.methods.emitAction(
              open ? backupCollapsibleBlockActions.expand : backupCollapsibleBlockActions.collapse,
            )
          }
        >
          <DisclosureTrigger
            disabled={blocking}
            aria-label={props.title}
            aria-describedby={summaryId}
            emphasis={uiEmphasisModes.subtle}
            data-ui-focus-target={props.sourceFocusTarget}
            className="min-h-11 w-full justify-between px-0"
            data-controller-focused={
              controllerFocusVisible &&
              (props.controllerFocusedAction === backupCollapsibleBlockActions.expand ||
                props.controllerFocusedAction === backupCollapsibleBlockActions.collapse)
                ? "true"
                : undefined
            }
          >
            <span className="grid min-w-0 gap-0.5 text-left">
              <span>{props.title}</span>
              <span className="truncate text-xs font-normal text-(--ui-muted-text)" id={summaryId}>
                {props.localStateSummary.settingsSummary}
              </span>
            </span>
            <ChevronDownIcon
              size="small"
              aria-hidden="true"
              className={cx(
                "shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none",
                expanded && "rotate-180",
              )}
            />
          </DisclosureTrigger>
          <DisclosurePanel className="p-0" material={uiMaterialModes.none}>
            <div className="grid gap-4 pt-3">
              <Show when={Boolean(props.validationResult.message)}>
                {() => (
                  <StatusMessage
                    tone={
                      props.validationResult.status === backupValidationStatuses.invalid
                        ? uiToneModes.destructive
                        : uiToneModes.warning
                    }
                  >
                    {props.validationResult.message}
                  </StatusMessage>
                )}
              </Show>
              <Show
                when={Boolean(
                  props.operationState === backupOperationStates.importComplete &&
                    props.importCompleteMessage,
                )}
              >
                {() => (
                  <StatusMessage tone={uiToneModes.success}>
                    {props.importCompleteMessage}
                  </StatusMessage>
                )}
              </Show>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                  <Button
                    disabled={!props.exportAvailability.available || busy}
                    loading={props.operationState === backupOperationStates.exporting}
                    data-ui-focus-target={`${props.sourceFocusTarget ?? "backup"}:export`}
                    onRequestPress={() =>
                      actionEmitter.methods.emitAction(backupCollapsibleBlockActions.export)
                    }
                    data-controller-focused={
                      controllerFocusVisible &&
                      props.controllerFocusedAction === backupCollapsibleBlockActions.export
                        ? "true"
                        : undefined
                    }
                  >
                    <DownloadIcon aria-hidden="true" size="small" />
                    {props.exportLabel}
                  </Button>
                  <Show
                    when={Boolean(
                      !props.exportAvailability.available &&
                        props.exportAvailability.disabledReason,
                    )}
                  >
                    {() => <StatusMessage>{props.exportAvailability.disabledReason}</StatusMessage>}
                  </Show>
                </div>
                <div className="grid gap-1">
                  <Button
                    disabled={!props.importAvailability.available || busy}
                    data-ui-focus-target={`${props.sourceFocusTarget ?? "backup"}:import`}
                    onRequestPress={() =>
                      actionEmitter.methods.emitAction(backupCollapsibleBlockActions.openFilePicker)
                    }
                    loading={
                      props.operationState === backupOperationStates.importFilePicker ||
                      props.operationState === backupOperationStates.importValidating
                    }
                    data-controller-focused={
                      controllerFocusVisible &&
                      props.controllerFocusedAction === backupCollapsibleBlockActions.openFilePicker
                        ? "true"
                        : undefined
                    }
                  >
                    <UploadIcon aria-hidden="true" size="small" />
                    {props.importLabel}
                  </Button>
                  <Show
                    when={Boolean(
                      !props.importAvailability.available &&
                        props.importAvailability.disabledReason,
                    )}
                  >
                    {() => <StatusMessage>{props.importAvailability.disabledReason}</StatusMessage>}
                  </Show>
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </DisclosureRoot>
      </section>
      <Present value={props.exportDialog}>{ExportDialogContent}</Present>
      <Present value={props.importPreviewDialog}>{ImportPreviewDialogContent}</Present>
    </>
  );
}

BackupCollapsibleBlock.displayName = "BackupCollapsibleBlock";
