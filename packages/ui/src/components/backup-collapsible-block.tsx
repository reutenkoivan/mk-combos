import { useComponentActionEmitter } from "../hooks/intents";
import { ChevronDownIcon } from "../icons/chevron-down";
import { DownloadIcon } from "../icons/download";
import { UploadIcon } from "../icons/upload";
import { Button } from "../primitives/button";
import { DisclosurePanel, DisclosureRoot, DisclosureTrigger } from "../primitives/disclosure";
import { Badge, StatusMessage } from "../primitives/state";
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
  backupSliceStatuses,
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
  disclosureState: BackupDisclosureState;
  exportAvailability: BackupAvailability;
  exportDialog?: ExportDialogProps;
  exportLabel: string;
  importAvailability: BackupAvailability;
  importLabel: string;
  importExternalInputNotice: string;
  importPreviewDialog?: ImportPreviewDialogProps;
  importCompleteMessage?: string;
  localStateSummary: BackupLocalStateSummary;
  onRequestAction?: (intent: ComponentActionIntent<BackupCollapsibleBlockAction>) => void;
  operationState: BackupOperationState;
  redirectAutoExpand?: boolean;
  sourceFocusTarget?: string;
  sourceSurface: string;
  title: string;
  validationResult: BackupValidationResult;
};

const blockingOperations: readonly BackupOperationState[] = [
  backupOperationStates.replaceConfirm,
  backupOperationStates.replaceBusy,
];

export function BackupCollapsibleBlock(props: BackupCollapsibleBlockProps) {
  const blocking = blockingOperations.includes(props.operationState);
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
        className="border-t border-[var(--ui-separator)] pt-4"
        data-operation={props.operationState}
        data-redirect-auto-expand={props.redirectAutoExpand || undefined}
        data-ui-component="UI-CMP-034"
      >
        <DisclosureRoot
          disabled={blocking}
          onOpenChange={({ open }) =>
            actionEmitter.methods.emitAction(
              open ? backupCollapsibleBlockActions.expand : backupCollapsibleBlockActions.collapse,
            )
          }
          open={props.disclosureState === backupDisclosureStates.expanded}
          sourceFocusTarget={props.sourceFocusTarget}
        >
          <DisclosureTrigger
            aria-label={props.title}
            className="min-h-11 w-full justify-between px-0"
            disabled={blocking}
            emphasis={uiEmphasisModes.subtle}
          >
            <span>{props.title}</span>
            <ChevronDownIcon aria-hidden="true" size="small" />
          </DisclosureTrigger>
          <DisclosurePanel className="p-0" material={uiMaterialModes.none}>
            <div className="grid gap-4 pt-3">
              <div className="grid gap-2">
                <p className="text-sm">{props.localStateSummary.settingsSummary}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>{props.localStateSummary.persistenceMode}</Badge>
                  {props.localStateSummary.gameSlices.map((slice) => (
                    <Badge
                      key={slice.gameId}
                      tone={
                        slice.status === backupSliceStatuses.invalid
                          ? uiToneModes.destructive
                          : slice.status === backupSliceStatuses.unsupported
                            ? uiToneModes.warning
                            : uiToneModes.neutral
                      }
                    >
                      {slice.label}: {slice.status}
                    </Badge>
                  ))}
                </div>
              </div>
              {props.validationResult.message && (
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
              {props.operationState === backupOperationStates.importComplete &&
                props.importCompleteMessage && (
                  <StatusMessage tone={uiToneModes.success}>
                    {props.importCompleteMessage}
                  </StatusMessage>
                )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                  <Button
                    disabled={!props.exportAvailability.available || busy}
                    loading={props.operationState === backupOperationStates.exporting}
                    onRequestPress={() =>
                      actionEmitter.methods.emitAction(backupCollapsibleBlockActions.export)
                    }
                  >
                    <DownloadIcon aria-hidden="true" size="small" />
                    {props.exportLabel}
                  </Button>
                  {!props.exportAvailability.available &&
                    props.exportAvailability.disabledReason && (
                      <StatusMessage>{props.exportAvailability.disabledReason}</StatusMessage>
                    )}
                </div>
                <div className="grid gap-1">
                  <StatusMessage tone={uiToneModes.warning}>
                    {props.importExternalInputNotice}
                  </StatusMessage>
                  <Button
                    disabled={!props.importAvailability.available || busy}
                    loading={
                      props.operationState === backupOperationStates.importFilePicker ||
                      props.operationState === backupOperationStates.importValidating
                    }
                    onRequestPress={() =>
                      actionEmitter.methods.emitAction(backupCollapsibleBlockActions.openFilePicker)
                    }
                  >
                    <UploadIcon aria-hidden="true" size="small" />
                    {props.importLabel}
                  </Button>
                  {!props.importAvailability.available &&
                    props.importAvailability.disabledReason && (
                      <StatusMessage>{props.importAvailability.disabledReason}</StatusMessage>
                    )}
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </DisclosureRoot>
      </section>
      {props.exportDialog && <ExportDialog {...props.exportDialog} />}
      {props.importPreviewDialog && <ImportPreviewDialog {...props.importPreviewDialog} />}
    </>
  );
}

BackupCollapsibleBlock.displayName = "BackupCollapsibleBlock";
