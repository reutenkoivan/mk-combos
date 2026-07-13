import { useId } from "react";

import { Button } from "../primitives/button";
import { StatusMessage } from "../primitives/state";
import { cx } from "../recipes/class-name";
import { surfaceRecipe } from "../recipes/surface";
import { uiEmphasisModes, uiMaterialModes, uiPlacementModes, uiToneModes } from "../tokens/value";
import type { ComponentActionDescriptor, ComponentActionIntent, UiResponsiveMode } from "./type";
import { componentInteractionReasons, uiResponsiveModes } from "./value";

export const builderActionBarActions = {
  cancelBuilder: "cancelBuilder",
  confirmCancelBuilder: "confirmCancelBuilder",
  finishBuilder: "finishBuilder",
  openSavedComboAddToList: "openSavedComboAddToList",
  undoMove: "undoMove",
} as const;

export type BuilderActionBarAction =
  (typeof builderActionBarActions)[keyof typeof builderActionBarActions];

export const builderActionBarStates = {
  idle: "idle",
  saved: "saved",
  saveError: "saveError",
  saving: "saving",
} as const;

export type BuilderActionBarState =
  (typeof builderActionBarStates)[keyof typeof builderActionBarStates];

type BuilderActionBarDescriptorFor<Action extends BuilderActionBarAction> =
  ComponentActionDescriptor & {
    action: Action;
  };

export type BuilderActionBarActionDescriptor = {
  [Action in BuilderActionBarAction]: BuilderActionBarDescriptorFor<Action>;
}[BuilderActionBarAction];

export type BuilderActionBarIntent = ComponentActionIntent<BuilderActionBarAction> & {
  actionId: string;
  dirty: boolean;
  savedComboId?: string;
};

export type BuilderActionBarProps = {
  actions: readonly BuilderActionBarActionDescriptor[];
  dirty: boolean;
  label: string;
  onRequestAction?: (intent: BuilderActionBarIntent) => void;
  responsiveMode: UiResponsiveMode;
  savedComboId?: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
  state: BuilderActionBarState;
  status?: string;
};

const actionToneByAction = {
  [builderActionBarActions.cancelBuilder]: uiToneModes.destructive,
  [builderActionBarActions.confirmCancelBuilder]: uiToneModes.destructive,
  [builderActionBarActions.finishBuilder]: uiToneModes.accent,
  [builderActionBarActions.openSavedComboAddToList]: uiToneModes.success,
  [builderActionBarActions.undoMove]: uiToneModes.neutral,
} as const satisfies Record<BuilderActionBarAction, (typeof uiToneModes)[keyof typeof uiToneModes]>;

const statusToneByState = {
  [builderActionBarStates.idle]: uiToneModes.neutral,
  [builderActionBarStates.saved]: uiToneModes.success,
  [builderActionBarStates.saveError]: uiToneModes.destructive,
  [builderActionBarStates.saving]: uiToneModes.accent,
} as const satisfies Record<BuilderActionBarState, (typeof uiToneModes)[keyof typeof uiToneModes]>;

export function BuilderActionBar(props: BuilderActionBarProps) {
  const statusId = useId();
  const saving = props.state === builderActionBarStates.saving;
  const compact = props.responsiveMode !== uiResponsiveModes.desktop;
  const descriptorsByAction = new Map(
    props.actions.map((descriptor) => [descriptor.action, descriptor] as const),
  );
  const undoAction = descriptorsByAction.get(builderActionBarActions.undoMove);
  const finishAction = descriptorsByAction.get(builderActionBarActions.finishBuilder);
  const cancelActions = [
    descriptorsByAction.get(builderActionBarActions.cancelBuilder),
    descriptorsByAction.get(builderActionBarActions.confirmCancelBuilder),
  ].filter((descriptor): descriptor is BuilderActionBarActionDescriptor => Boolean(descriptor));
  const savedComboAction =
    props.state === builderActionBarStates.saved && props.savedComboId
      ? descriptorsByAction.get(builderActionBarActions.openSavedComboAddToList)
      : undefined;
  const primaryAction = savedComboAction ?? finishAction;

  const emit = (descriptor: BuilderActionBarActionDescriptor) => {
    if (saving || !descriptor.available) {
      return;
    }

    if (descriptor.action === builderActionBarActions.openSavedComboAddToList) {
      if (!props.savedComboId) {
        return;
      }
      props.onRequestAction?.({
        action: descriptor.action,
        actionId: descriptor.id,
        dirty: props.dirty,
        reason: componentInteractionReasons.press,
        savedComboId: props.savedComboId,
        sourceFocusTarget: props.sourceFocusTarget,
        sourceSurface: props.sourceSurface,
      });
      return;
    }

    props.onRequestAction?.({
      action: descriptor.action,
      actionId: descriptor.id,
      dirty: props.dirty,
      reason: componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });
  };

  const renderAction = (
    descriptor: BuilderActionBarActionDescriptor,
    presentation: { block?: boolean; primary?: boolean } = {},
  ) => {
    const unavailableReasonId = `${statusId}-${descriptor.id}-unavailable`;
    const unavailable = !descriptor.available;
    const finishSaving = saving && descriptor.action === builderActionBarActions.finishBuilder;
    const block = presentation.block ?? compact;

    return (
      <div
        className={cx("grid min-w-0 gap-1", block && "w-full")}
        data-builder-action-wrapper={descriptor.action}
        key={descriptor.id}
      >
        <Button
          aria-describedby={
            unavailable && descriptor.disabledReason ? unavailableReasonId : undefined
          }
          className={compact ? "min-h-11" : undefined}
          data-builder-action={descriptor.action}
          disabled={saving || unavailable}
          emphasis={presentation.primary ? uiEmphasisModes.prominent : undefined}
          loading={finishSaving}
          onRequestPress={() => emit(descriptor)}
          placement={block ? uiPlacementModes.block : uiPlacementModes.inline}
          sourceFocusTarget={props.sourceFocusTarget}
          tone={descriptor.tone ?? actionToneByAction[descriptor.action]}
        >
          {descriptor.label}
        </Button>
        {unavailable && descriptor.disabledReason && (
          <StatusMessage id={unavailableReasonId}>{descriptor.disabledReason}</StatusMessage>
        )}
      </div>
    );
  };

  const statusRegion = (
    <div
      className={cx(
        "grid min-h-5 min-w-0 content-center",
        compact ? "justify-items-start" : "justify-items-center text-center",
      )}
      data-builder-action-region="status"
    >
      {props.status ? (
        <StatusMessage
          aria-atomic="true"
          aria-live={props.state === builderActionBarStates.saveError ? "assertive" : "polite"}
          id={statusId}
          tone={statusToneByState[props.state]}
        >
          {props.status}
        </StatusMessage>
      ) : (
        <span aria-hidden="true" className="block h-5" />
      )}
    </div>
  );

  return (
    <section
      aria-busy={saving || undefined}
      aria-label={props.label}
      className={cx(
        surfaceRecipe({ material: uiMaterialModes.elevated }),
        "grid min-h-[5.25rem] min-w-0 gap-3",
      )}
      data-dirty={props.dirty}
      data-layout={compact ? "compact" : "dock"}
      data-state={props.state}
      data-ui-component="UI-CMP-026"
    >
      {compact ? (
        <div className="grid min-w-0 gap-3">
          {primaryAction && (
            <div data-builder-action-region="primary">
              {renderAction(primaryAction, { block: true, primary: true })}
            </div>
          )}
          {statusRegion}
          {(undoAction || cancelActions.length > 0) && (
            <div className="grid min-w-0 grid-cols-2 gap-2" data-builder-action-region="secondary">
              {undoAction && renderAction(undoAction, { block: true })}
              {cancelActions.map((descriptor) => renderAction(descriptor, { block: true }))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(12rem,auto)_minmax(0,1fr)] items-center gap-3">
          <div className="flex min-w-0 justify-start" data-builder-action-region="undo">
            {undoAction && renderAction(undoAction)}
          </div>
          {statusRegion}
          <div
            className="flex min-w-0 flex-wrap items-start justify-end gap-2"
            data-builder-action-region="primary"
          >
            {cancelActions.map((descriptor) => renderAction(descriptor))}
            {primaryAction && renderAction(primaryAction, { primary: true })}
          </div>
        </div>
      )}
    </section>
  );
}

BuilderActionBar.displayName = "BuilderActionBar";
