import type { GameId } from "@mk-combos/contracts/identity/type";
import { validationSeverities } from "@mk-combos/contracts/result/value";
import {
  type BackupCollapsibleBlockProps,
  backupCollapsibleBlockActions,
} from "@mk-combos/ui/components/backup-collapsible-block";
import { exportDialogActions } from "@mk-combos/ui/components/export-dialog";
import { importPreviewDialogActions } from "@mk-combos/ui/components/import-preview-dialog";
import type {
  BackupLocalStateSummary,
  BackupOperationState,
  BackupValidationResult,
} from "@mk-combos/ui/components/type";
import {
  backupDisclosureStates,
  backupOperationStates,
  backupPersistenceModes,
  backupSliceStatuses,
  backupValidationStatuses,
} from "@mk-combos/ui/components/value";
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useLocalStateObservableState,
  useLocalStateSource,
} from "../../../app/local-state/provider";
import type { LocalStatePersistenceStatus } from "../../../app/local-state/type";
import {
  localGameSliceStatuses,
  localStatePersistenceStatuses,
} from "../../../app/local-state/value";
import { formatGameCopy } from "../../../app/localization/runtime";
import type { AppCopy } from "../../../app/localization/type";
import { resolveInstalledGame } from "../../../game-business/installed-games/runtime";
import type { InstalledGameBusiness } from "../../../game-business/installed-games/type";
import { installedGames } from "../../../game-business/installed-games/value";
import { downloadGameBackup } from "../internal/download";
import type { SettingsSection } from "../search/type";
import { settingsSections } from "../search/value";
import {
  createGameBackupDownload,
  formatGameBackupTimestamp,
  isMatchingGameBackupCandidate,
  validateGameBackupText,
} from "./runtime";
import type { GameBackupCandidate, GameBackupValidationFailureKind } from "./type";
import { gameBackupValidationFailureKinds } from "./value";

const settingsBackupSurface = "settings-game-backup";

type BackupFeedback = Readonly<{
  gameId: GameId;
  validation: BackupValidationResult;
}>;

type TargetOperation = Readonly<{
  gameId?: GameId;
  state: BackupOperationState;
}>;

type UseSettingsGameBackupInput = Readonly<{
  copy: AppCopy["backup"];
  section?: SettingsSection;
}>;

function getFailureMessage(
  kind: GameBackupValidationFailureKind,
  copy: AppCopy["backup"],
  gameLabel: string,
): string {
  switch (kind) {
    case gameBackupValidationFailureKinds.invalidSlice:
      return copy.invalidSlice;
    case gameBackupValidationFailureKinds.mismatchedGame:
      return formatGameCopy(copy.mismatchedGame, gameLabel);
    case gameBackupValidationFailureKinds.unsupportedVersion:
      return copy.unsupportedVersion;
    case gameBackupValidationFailureKinds.invalidEnvelope:
    case gameBackupValidationFailureKinds.invalidJson:
      return copy.invalidFile;
  }
}

function getPersistenceMode(
  persistenceStatus: LocalStatePersistenceStatus,
): BackupLocalStateSummary["persistenceMode"] {
  switch (persistenceStatus) {
    case localStatePersistenceStatuses.persistent:
      return backupPersistenceModes.persistent;
    case localStatePersistenceStatuses.sessionOnly:
      return backupPersistenceModes.sessionOnly;
    case localStatePersistenceStatuses.pending:
      return backupPersistenceModes.unavailable;
  }
}

function createLocalStateSummary(
  input: Readonly<{
    business: InstalledGameBusiness;
    copy: AppCopy["backup"];
    persistenceMode: BackupLocalStateSummary["persistenceMode"];
    sliceInvalid: boolean;
    validationMessageCount: number;
  }>,
): BackupLocalStateSummary {
  return {
    gameSlices: [
      {
        gameId: input.business.id,
        label: input.business.label,
        staleOrInvalidCount: input.validationMessageCount || undefined,
        status: input.sliceInvalid ? backupSliceStatuses.invalid : backupSliceStatuses.ready,
      },
    ],
    persistenceMode: input.persistenceMode,
    settingsSummary: input.sliceInvalid ? input.copy.invalidSlice : input.copy.sliceReady,
  };
}

function createCandidateSummary(
  input: Readonly<{
    business: InstalledGameBusiness;
    candidate: GameBackupCandidate;
    copy: AppCopy["backup"];
    language: Parameters<typeof formatGameBackupTimestamp>[1];
    persistenceMode: BackupLocalStateSummary["persistenceMode"];
  }>,
): BackupLocalStateSummary {
  const normalizedSliceValidation = input.business.backup.validateSlice(
    input.candidate.normalizedSlice,
  );
  const invalid =
    !normalizedSliceValidation.ok ||
    input.candidate.messages.some((message) => message.severity === validationSeverities.error);

  return {
    gameSlices: [
      {
        gameId: input.business.id,
        label: input.business.label,
        staleOrInvalidCount: input.candidate.messages.length || undefined,
        status: invalid ? backupSliceStatuses.invalid : backupSliceStatuses.ready,
      },
    ],
    lastExportedAt: input.candidate.envelope.exportedAt,
    persistenceMode: input.persistenceMode,
    settingsSummary: `${input.copy.sliceSummary} ${input.copy.exportedAtLabel}: ${formatGameBackupTimestamp(
      input.candidate.envelope.exportedAt,
      input.language,
    )}`,
  };
}

function createCandidateValidation(
  candidate: GameBackupCandidate,
  copy: AppCopy["backup"],
): BackupValidationResult {
  const hasErrors = candidate.messages.some(
    (message) => message.severity === validationSeverities.error,
  );
  const hasWarnings = candidate.messages.some(
    (message) => message.severity === validationSeverities.warning,
  );

  if (hasErrors) {
    return { message: copy.invalidSlice, status: backupValidationStatuses.invalid };
  }

  if (hasWarnings) {
    return { message: copy.reviewWarning, status: backupValidationStatuses.warning };
  }

  return { status: backupValidationStatuses.valid };
}

function createCandidateId(file: File): string {
  return globalThis.crypto?.randomUUID?.() ?? `${file.name}-${file.lastModified}-${Date.now()}`;
}

export function useSettingsGameBackup({ copy, section }: UseSettingsGameBackupInput) {
  const localState = useLocalStateObservableState();
  const localStateSource = useLocalStateSource();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerTargetRef = useRef<GameId | undefined>(undefined);
  const pickerCancelCleanupRef = useRef<(() => void) | undefined>(undefined);
  const previousCopyRef = useRef(copy);
  const previousSectionRef = useRef(section);
  const initialBackupFocusRef = useRef(section === settingsSections.backup);
  const [expandedGameId, setExpandedGameId] = useState<GameId | undefined>(() =>
    section === settingsSections.backup ? localState.resolvedActiveGameId : undefined,
  );
  const [exportGameId, setExportGameId] = useState<GameId>();
  const [candidate, setCandidate] = useState<GameBackupCandidate>();
  const [feedback, setFeedback] = useState<BackupFeedback>();
  const [operation, setOperation] = useState<TargetOperation>({
    state: backupOperationStates.idle,
  });

  const operationActive =
    exportGameId !== undefined ||
    operation.state === backupOperationStates.importFilePicker ||
    operation.state === backupOperationStates.importValidating ||
    operation.state === backupOperationStates.importPreview ||
    operation.state === backupOperationStates.replaceConfirm ||
    operation.state === backupOperationStates.replaceBusy ||
    operation.state === backupOperationStates.exporting;

  useEffect(() => {
    if (previousCopyRef.current !== copy) {
      previousCopyRef.current = copy;
      setFeedback(undefined);
    }
  }, [copy]);

  useEffect(() => {
    const previousSection = previousSectionRef.current;
    const enteredBackup =
      section === settingsSections.backup && previousSection !== settingsSections.backup;
    const leftBackup =
      section !== settingsSections.backup && previousSection === settingsSections.backup;
    const shouldFocus = initialBackupFocusRef.current || enteredBackup;

    previousSectionRef.current = section;
    initialBackupFocusRef.current = false;

    if (section === settingsSections.backup && shouldFocus) {
      const focusTarget = `settings-backup-${localState.resolvedActiveGameId}`;

      setExpandedGameId(localState.resolvedActiveGameId);
      const timeout = globalThis.setTimeout(() => {
        const trigger = Array.from(
          document.querySelectorAll<HTMLElement>("[data-ui-focus-target]"),
        ).find((element) => element.dataset.uiFocusTarget === focusTarget);

        trigger?.focus();
      }, 0);

      return () => globalThis.clearTimeout(timeout);
    }

    if (leftBackup) {
      setExpandedGameId(undefined);
    }
  }, [localState.resolvedActiveGameId, section]);

  useEffect(
    () => () => {
      pickerCancelCleanupRef.current?.();
    },
    [],
  );

  const closeExportDialog = useCallback(() => {
    if (operation.state !== backupOperationStates.exporting) {
      setExportGameId(undefined);
    }
  }, [operation.state]);

  const cancelImport = useCallback(() => {
    if (operation.state === backupOperationStates.replaceBusy) {
      return;
    }

    pickerCancelCleanupRef.current?.();
    pickerTargetRef.current = undefined;
    setCandidate(undefined);
    setFeedback(undefined);
    setOperation({ state: backupOperationStates.idle });
  }, [operation.state]);

  const requestFilePicker = useCallback((gameId: GameId) => {
    const input = fileInputRef.current;

    if (input === null) {
      return;
    }

    input.value = "";
    pickerCancelCleanupRef.current?.();
    pickerTargetRef.current = gameId;
    setCandidate(undefined);
    setFeedback(undefined);
    setOperation({ gameId, state: backupOperationStates.importFilePicker });

    const settleCancelledPicker = () => {
      pickerCancelCleanupRef.current?.();

      if (pickerTargetRef.current === gameId) {
        pickerTargetRef.current = undefined;
        setOperation({ state: backupOperationStates.idle });
      }
    };

    input.addEventListener("cancel", settleCancelledPicker, { once: true });
    pickerCancelCleanupRef.current = () => {
      input.removeEventListener("cancel", settleCancelledPicker);
      pickerCancelCleanupRef.current = undefined;
    };
    input.click();
  }, []);

  const handleFileInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      const gameId = pickerTargetRef.current;

      event.currentTarget.value = "";
      pickerCancelCleanupRef.current?.();
      pickerTargetRef.current = undefined;

      if (file === undefined || gameId === undefined) {
        setOperation({ state: backupOperationStates.idle });
        return;
      }

      const business = resolveInstalledGame(gameId);

      if (business === undefined) {
        setFeedback({
          gameId,
          validation: { message: copy.mismatchedGame, status: backupValidationStatuses.invalid },
        });
        setOperation({ state: backupOperationStates.idle });
        return;
      }

      setOperation({ gameId, state: backupOperationStates.importValidating });

      try {
        const validation = validateGameBackupText({
          business,
          candidateId: createCandidateId(file),
          text: await file.text(),
        });

        if (!validation.ok) {
          setCandidate(undefined);
          setFeedback({
            gameId,
            validation: {
              message: getFailureMessage(validation.kind, copy, business.label),
              status: backupValidationStatuses.invalid,
            },
          });
          setOperation({ state: backupOperationStates.idle });
          return;
        }

        const candidateValidation = createCandidateValidation(validation.candidate, copy);

        if (candidateValidation.status === backupValidationStatuses.invalid) {
          setCandidate(undefined);
          setFeedback({ gameId, validation: candidateValidation });
          setOperation({ state: backupOperationStates.idle });
          return;
        }

        setCandidate(validation.candidate);
        setFeedback({
          gameId,
          validation: candidateValidation,
        });
        setOperation({ gameId, state: backupOperationStates.importPreview });
      } catch {
        setCandidate(undefined);
        setFeedback({
          gameId,
          validation: { message: copy.invalidFile, status: backupValidationStatuses.invalid },
        });
        setOperation({ state: backupOperationStates.idle });
      }
    },
    [copy],
  );

  const confirmExport = useCallback(
    (gameId: GameId) => {
      const business = resolveInstalledGame(gameId);
      const slice = localState.games[gameId];

      if (business === undefined || slice === undefined || exportGameId !== gameId) {
        return;
      }

      setOperation({ gameId, state: backupOperationStates.exporting });
      const result = createGameBackupDownload({
        business,
        exportedAt: new Date().toISOString(),
        slice,
      });

      if (!result.ok) {
        setFeedback({
          gameId,
          validation: { message: copy.exportFailure, status: backupValidationStatuses.invalid },
        });
        setExportGameId(undefined);
        setOperation({ state: backupOperationStates.idle });
        return;
      }

      try {
        downloadGameBackup(result.download);
        setExportGameId(undefined);
        setOperation({ state: backupOperationStates.idle });
      } catch {
        setFeedback({
          gameId,
          validation: { message: copy.exportFailure, status: backupValidationStatuses.invalid },
        });
        setExportGameId(undefined);
        setOperation({ state: backupOperationStates.idle });
      }
    },
    [copy.exportFailure, exportGameId, localState.games],
  );

  const confirmImport = useCallback(
    (gameId: GameId, candidateId: string) => {
      if (!isMatchingGameBackupCandidate(candidate, candidateId, gameId)) {
        return;
      }

      setOperation({ gameId, state: backupOperationStates.replaceBusy });
      const result = localStateSource.replaceGameSlice(gameId, candidate.normalizedSlice);

      if (!result.ok) {
        setFeedback({
          gameId,
          validation: { message: copy.importFailure, status: backupValidationStatuses.invalid },
        });
        setOperation({ state: backupOperationStates.idle });
        return;
      }

      setCandidate(undefined);
      setFeedback({
        gameId,
        validation:
          result.persistenceStatus === localStatePersistenceStatuses.sessionOnly
            ? { message: copy.sessionOnly, status: backupValidationStatuses.warning }
            : { status: backupValidationStatuses.none },
      });
      setOperation({ gameId, state: backupOperationStates.importComplete });
    },
    [candidate, copy.importFailure, copy.sessionOnly, localStateSource],
  );

  const persistenceMode = getPersistenceMode(localState.persistenceStatus);
  const blocks = useMemo(
    () =>
      installedGames.map((business) => {
        const slice = localState.games[business.id];
        const sliceState = localState.installedGameSlices[business.id];
        const summary = createLocalStateSummary({
          business,
          copy,
          persistenceMode,
          sliceInvalid: slice === undefined || sliceState?.status !== localGameSliceStatuses.valid,
          validationMessageCount: sliceState?.messages.length ?? 0,
        });
        const ownsOperation = operation.gameId === business.id;
        const blockedByOther = operationActive && !ownsOperation && exportGameId !== business.id;
        const sliceReady =
          slice !== undefined && sliceState?.status === localGameSliceStatuses.valid;
        const validationResult =
          feedback?.gameId === business.id
            ? feedback.validation
            : { status: backupValidationStatuses.none };
        const blockOperation = ownsOperation
          ? operation.state
          : operationActive
            ? backupOperationStates.replaceConfirm
            : backupOperationStates.idle;
        const candidateSummary =
          candidate !== undefined && candidate.envelope.gameId === business.id
            ? createCandidateSummary({
                business,
                candidate,
                copy,
                language: localState.appliedSettings.language,
                persistenceMode,
              })
            : undefined;
        const exportAvailability =
          sliceReady && !blockedByOther
            ? { available: true }
            : {
                available: false,
                disabledReason: blockedByOther ? copy.operationBlocked : copy.invalidSlice,
              };
        const importAvailability = blockedByOther
          ? { available: false, disabledReason: copy.operationBlocked }
          : { available: true };
        const props: BackupCollapsibleBlockProps = {
          disclosureState:
            expandedGameId === business.id
              ? backupDisclosureStates.expanded
              : backupDisclosureStates.collapsed,
          exportAvailability,
          exportDialog:
            exportGameId === business.id
              ? {
                  busy: operation.state === backupOperationStates.exporting,
                  cancelLabel: copy.cancel,
                  confirmLabel: copy.confirmExport,
                  description: copy.exportDescription,
                  exportAvailability,
                  localStateSummary: summary,
                  onRequestAction: ({ action }) => {
                    if (action === exportDialogActions.confirmExport) {
                      confirmExport(business.id);
                      return;
                    }

                    closeExportDialog();
                  },
                  open: true,
                  sourceFocusTarget: `settings-backup-export-${business.id}`,
                  sourceSurface: settingsBackupSurface,
                  title: formatGameCopy(copy.exportTitle, business.label),
                  warningMessage:
                    persistenceMode === backupPersistenceModes.sessionOnly
                      ? copy.exportSessionOnly
                      : undefined,
                }
              : undefined,
          exportLabel: copy.exportLabel,
          importAvailability,
          importCompleteMessage:
            operation.state === backupOperationStates.importComplete && ownsOperation
              ? formatGameCopy(copy.importComplete, business.label)
              : undefined,
          importLabel: copy.importLabel,
          importPreviewDialog:
            candidate !== undefined && candidateSummary !== undefined
              ? {
                  backupCandidateId: candidate.id,
                  busy: operation.state === backupOperationStates.replaceBusy,
                  cancelLabel: copy.cancel,
                  confirmLabel: formatGameCopy(copy.confirmReplace, business.label),
                  confirmationAvailability:
                    candidateSummary.gameSlices[0]?.status === backupSliceStatuses.ready &&
                    validationResult.status !== backupValidationStatuses.invalid
                      ? { available: true }
                      : { available: false, disabledReason: copy.invalidSlice },
                  description: formatGameCopy(copy.importDescription, business.label),
                  localStateSummary: candidateSummary,
                  onRequestAction: ({ action, backupCandidateId }) => {
                    if (action === importPreviewDialogActions.confirmReplace) {
                      confirmImport(business.id, backupCandidateId);
                      return;
                    }

                    if (action === importPreviewDialogActions.retryFileSelection) {
                      cancelImport();
                      requestFilePicker(business.id);
                      return;
                    }

                    cancelImport();
                  },
                  open: true,
                  replaceImpactSummary: formatGameCopy(copy.replaceImpact, business.label),
                  retryLabel: copy.chooseAnotherFile,
                  sourceFocusTarget: `settings-backup-import-${business.id}`,
                  sourceSurface: settingsBackupSurface,
                  title: formatGameCopy(copy.importTitle, business.label),
                  validationResult,
                }
              : undefined,
          localStateSummary: summary,
          onRequestAction: ({ action }) => {
            if (operationActive) {
              return;
            }

            switch (action) {
              case backupCollapsibleBlockActions.expand:
                setExpandedGameId(business.id);
                return;
              case backupCollapsibleBlockActions.collapse:
                setExpandedGameId(undefined);
                return;
              case backupCollapsibleBlockActions.export:
                setFeedback(undefined);
                setOperation({ state: backupOperationStates.idle });
                setExportGameId(business.id);
                return;
              case backupCollapsibleBlockActions.openFilePicker:
                requestFilePicker(business.id);
            }
          },
          operationState: blockOperation,
          redirectAutoExpand:
            section === settingsSections.backup && localState.resolvedActiveGameId === business.id,
          sourceFocusTarget: `settings-backup-${business.id}`,
          sourceSurface: settingsBackupSurface,
          title: business.label,
          validationResult,
        };

        return { gameId: business.id, props };
      }),
    [
      candidate,
      cancelImport,
      closeExportDialog,
      confirmExport,
      confirmImport,
      copy,
      expandedGameId,
      exportGameId,
      feedback,
      localState.games,
      localState.appliedSettings.language,
      localState.installedGameSlices,
      localState.resolvedActiveGameId,
      operation.gameId,
      operation.state,
      operationActive,
      persistenceMode,
      requestFilePicker,
      section,
    ],
  );

  return {
    blocks,
    fileInput: {
      accept: ".json,application/json",
      onChange: handleFileInputChange,
      ref: fileInputRef,
    },
    operationActive,
  };
}
