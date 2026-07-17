import type { ComboRef } from "@mk-combos/contracts/identity/type";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  type ComboDetailHeaderIntent,
  comboDetailHeaderActionKinds,
  comboDetailHeaderActions,
} from "@mk-combos/ui/components/combo-detail-header";
import { useComboFrameMeterModel } from "@mk-combos/ui/components/combo-frame-meter";
import { useComboWhiteboardModel } from "@mk-combos/ui/components/combo-whiteboard";
import type { ErrorStateIntent } from "@mk-combos/ui/components/error-state";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { useNavigate } from "@tanstack/react-router";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";

import { useControllerCommandScope } from "../../../app/controller-session/provider";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayers,
} from "../../../app/controller-session/value";
import { useLocalStateObservableState } from "../../../app/local-state/provider";
import { getAppCopy } from "../../../app/localization/runtime";
import { useAppResponsiveMode } from "../../../app/providers/provider";
import { useActiveGameBusiness } from "../../../game-business/active-game/provider";
import {
  type InstalledCatalogSearch,
  installedCatalogSelectionStatuses,
} from "../../../game-business/installed-games/catalog-adapter/type";
import { resolveInstalledGameCatalogAdapter } from "../../../game-business/installed-games/runtime";
import type { ComboDetailPathParams } from "../path-params/type";
import {
  createEmptyDetailWhiteboardSource,
  createUnavailableFramePresentation,
  prepareComboDetail,
  prepareUnavailableComboDetail,
} from "./runtime";
import { comboDetailPageStates } from "./value";

const comboDetailReturnTarget = "combo-detail-return";
const comboDetailStepTarget = (stepId: string) => `combo-detail-step-${stepId}`;
const navigationCommandIds = [
  knownControllerCommandIds.navUp,
  knownControllerCommandIds.navDown,
  knownControllerCommandIds.navLeft,
  knownControllerCommandIds.navRight,
] as const;

function compactCatalogSearch(
  search: InstalledCatalogSearch,
): Record<string, string | readonly string[]> {
  const compactSearch: Record<string, string | readonly string[]> = {};

  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined) {
      compactSearch[key] = value;
    }
  }

  return compactSearch;
}

export function useComboDetailState(params: ComboDetailPathParams) {
  const business = useActiveGameBusiness();
  const localState = useLocalStateObservableState();
  const responsiveMode = useAppResponsiveMode();
  const navigate = useNavigate();
  const catalogAdapter = resolveInstalledGameCatalogAdapter(business.id);
  const copy = getAppCopy(localState.appliedSettings.language);
  const fallbackRef = useMemo(
    () =>
      ({
        comboId: params.comboId,
        gameId: business.id,
        source: comboSources.seeded,
      }) as const satisfies ComboRef,
    [business.id, params.comboId],
  );
  const resolvedRef = useMemo(
    () =>
      catalogAdapter?.resolveComboRef({
        characterSlug: params.character,
        comboId: params.comboId,
        slice: localState.games[business.id],
        specificationSlug: params.specification,
      }),
    [business.id, catalogAdapter, localState.games, params],
  );
  const ref = resolvedRef ?? fallbackRef;
  const prepared = useMemo(() => {
    if (!resolvedRef) {
      return prepareUnavailableComboDetail(fallbackRef, copy.comboDetail);
    }

    return prepareComboDetail({
      business,
      copy: copy.comboDetail,
      language: localState.appliedSettings.language,
      params: resolvedRef,
      responsiveMode,
      slice: localState.games[business.id],
    });
  }, [
    business,
    copy.comboDetail,
    fallbackRef,
    localState.appliedSettings.language,
    localState.games,
    resolvedRef,
    responsiveMode,
  ]);
  const fallbackWhiteboardSource = useMemo(
    () => createEmptyDetailWhiteboardSource(copy.comboDetail, responsiveMode),
    [copy.comboDetail, responsiveMode],
  );
  const whiteboardSource =
    prepared.state === comboDetailPageStates.ready
      ? prepared.whiteboardSource
      : fallbackWhiteboardSource;
  const fallbackFrame = useMemo(
    () => createUnavailableFramePresentation(ref, 0, copy.comboDetail),
    [copy.comboDetail, ref],
  );
  const frameSnapshot =
    prepared.state === comboDetailPageStates.ready
      ? prepared.frameSnapshot
      : fallbackFrame.snapshot;
  const whiteboardModel = useComboWhiteboardModel({ source: whiteboardSource });
  const frameModel = useComboFrameMeterModel({ segmentIds: [] });
  const [controllerTargetId, setControllerTargetId] = useState(comboDetailReturnTarget);
  const rebaseWhiteboardPresentation = whiteboardModel.methods.rebasePresentation;

  useEffect(() => {
    rebaseWhiteboardPresentation(whiteboardSource);
  }, [rebaseWhiteboardPresentation, whiteboardSource]);

  const returnToCatalog = useCallback(() => {
    startTransition(() => {
      const restored = catalogAdapter?.restoreLastCatalog(localState.games[business.id]);
      const selection = restored?.ok ? restored.selection : undefined;

      if (
        selection?.status === installedCatalogSelectionStatuses.ready &&
        selection.characterSlug === params.character &&
        selection.specificationSlug === params.specification
      ) {
        void navigate({
          params: {
            character: selection.characterSlug,
            gameId: business.id,
            specification: selection.specificationSlug,
          },
          search: compactCatalogSearch(selection.canonicalSearch),
          to: "/$gameId/catalog/$character/$specification",
        });
        return;
      }

      void navigate({
        params: {
          character: params.character,
          gameId: business.id,
          specification: params.specification,
        },
        search: {},
        to: "/$gameId/catalog/$character/$specification",
      });
    });
  }, [business.id, catalogAdapter, localState.games, navigate, params]);

  const handleHeaderAction = useCallback(
    (intent: ComboDetailHeaderIntent) => {
      if (intent.action === comboDetailHeaderActions.returnToSource) {
        returnToCatalog();
      }
    },
    [returnToCatalog],
  );

  const handleErrorAction = useCallback(
    (_intent: ErrorStateIntent) => {
      returnToCatalog();
    },
    [returnToCatalog],
  );

  const ready = prepared.state === comboDetailPageStates.ready;
  const steps = ready ? whiteboardSource.steps : [];
  const returnAction = ready
    ? prepared.header.actions.find(
        (action) => action.kind === comboDetailHeaderActionKinds.returnToSource && action.available,
      )
    : undefined;
  const errorAction = ready ? undefined : prepared.error.actions.find((action) => action.available);
  const focusedStepIndex = steps.findIndex(
    (step) => comboDetailStepTarget(step.id) === controllerTargetId,
  );

  useEffect(() => {
    if (
      controllerTargetId !== comboDetailReturnTarget &&
      !steps.some((step) => comboDetailStepTarget(step.id) === controllerTargetId)
    ) {
      setControllerTargetId(comboDetailReturnTarget);
      whiteboardModel.methods.resetPresentation();
    }
  }, [controllerTargetId, steps, whiteboardModel.methods]);

  const focusReturn = useCallback(() => {
    setControllerTargetId(comboDetailReturnTarget);
    whiteboardModel.methods.resetPresentation();
  }, [whiteboardModel.methods]);
  const focusStep = useCallback(
    (index: number) => {
      const step = steps[Math.max(0, Math.min(steps.length - 1, index))];

      if (!step) {
        return;
      }

      setControllerTargetId(comboDetailStepTarget(step.id));
      whiteboardModel.methods.focusStep(step.id);
    },
    [steps, whiteboardModel.methods],
  );

  useControllerCommandScope({
    commandIds: [
      ...(ready && steps.length > 0 ? navigationCommandIds : []),
      ...(!ready || controllerTargetId === comboDetailReturnTarget
        ? [knownControllerCommandIds.confirm]
        : []),
      knownControllerCommandIds.back,
    ],
    enabled: true,
    handleCommand: (event) => {
      if (!ready) {
        if (
          event.commandId === knownControllerCommandIds.confirm ||
          event.commandId === knownControllerCommandIds.back
        ) {
          returnToCatalog();
          return true;
        }
        return false;
      }

      switch (event.commandId) {
        case knownControllerCommandIds.navDown:
          if (controllerTargetId === comboDetailReturnTarget) {
            focusStep(0);
          } else if (responsiveMode === uiResponsiveModes.mobile) {
            focusStep(focusedStepIndex + 1);
          }
          return steps.length > 0;
        case knownControllerCommandIds.navUp:
          if (controllerTargetId === comboDetailReturnTarget) {
            return steps.length > 0;
          }
          if (responsiveMode !== uiResponsiveModes.mobile || focusedStepIndex <= 0) {
            focusReturn();
          } else {
            focusStep(focusedStepIndex - 1);
          }
          return true;
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navRight:
          if (
            responsiveMode !== uiResponsiveModes.mobile &&
            controllerTargetId !== comboDetailReturnTarget
          ) {
            focusStep(
              focusedStepIndex + (event.commandId === knownControllerCommandIds.navLeft ? -1 : 1),
            );
          }
          return steps.length > 0;
        case knownControllerCommandIds.confirm:
          if (controllerTargetId !== comboDetailReturnTarget || !returnAction) {
            return false;
          }
          returnToCatalog();
          return true;
        case knownControllerCommandIds.back:
          returnToCatalog();
          return true;
        default:
          return false;
      }
    },
    id: `combo-detail-${business.id}`,
    layer: controllerCommandScopeLayers.page,
    ribbon: {
      accessibleLabel: copy.comboDetail.title,
      commands: [
        ...(ready && steps.length > 0
          ? [
              {
                commandIds: navigationCommandIds,
                id: "combo-detail-navigation",
                label: copy.catalog.navigateCommand,
              },
            ]
          : []),
        ...(!ready && errorAction
          ? [
              {
                commandIds: [knownControllerCommandIds.confirm],
                id: "combo-detail-recovery",
                label: errorAction.label,
              },
            ]
          : controllerTargetId === comboDetailReturnTarget && returnAction
            ? [
                {
                  commandIds: [knownControllerCommandIds.confirm],
                  id: "combo-detail-return",
                  label: returnAction.label,
                },
              ]
            : []),
        {
          commandIds: [knownControllerCommandIds.back],
          id: "combo-detail-back",
          label: copy.comboDetail.backToCatalog,
        },
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  });

  return {
    controllerFocusedErrorActionId: !ready ? errorAction?.id : undefined,
    controllerFocusedHeaderActionId:
      ready && controllerTargetId === comboDetailReturnTarget ? returnAction?.id : undefined,
    copy: copy.comboDetail,
    frameModel,
    frameSnapshot,
    handleErrorAction,
    handleHeaderAction,
    notationDisplayMode: localState.appliedSettings.notationDisplayMode,
    prepared,
    responsiveMode,
    whiteboardModel,
    whiteboardSource,
  };
}
