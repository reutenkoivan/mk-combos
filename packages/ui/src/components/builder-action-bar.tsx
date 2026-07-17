import { useId } from "react";

import { Button } from "../primitives/button";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
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

function BuilderActionStatusRegion(props: {
  compact: boolean;
  state: BuilderActionBarState;
  status: string | undefined;
  statusId: string;
}) {
  return (
    <div
      data-builder-action-region="status"
      className={cx(
        "grid min-h-5 min-w-0 content-center",
        props.compact ? "justify-items-start" : "justify-items-center text-center",
      )}
    >
      <Show
        when={Boolean(props.status)}
        fallback={() => <span aria-hidden="true" className="block h-5" />}
      >
        {() => (
          <StatusMessage
            aria-atomic="true"
            id={props.statusId}
            tone={statusToneByState[props.state]}
            aria-live={props.state === builderActionBarStates.saveError ? "assertive" : "polite"}
          >
            {props.status}
          </StatusMessage>
        )}
      </Show>
    </div>
  );
}

type BuilderActionValue = Readonly<{
  compact: boolean;
  descriptor: BuilderActionBarActionDescriptor;
  onRequestAction: (descriptor: BuilderActionBarActionDescriptor) => void;
  presentation: Readonly<{ block?: boolean; primary?: boolean }>;
  saving: boolean;
  sourceFocusTarget: string | undefined;
  statusId: string;
}>;

type BuilderActionSharedValue = Omit<BuilderActionValue, "descriptor" | "presentation">;

function BuilderAction({ value }: PresentContentProps<BuilderActionValue>) {
  const unavailableReasonId = `${value.statusId}-${value.descriptor.id}-unavailable`;
  const unavailable = !value.descriptor.available;
  const finishSaving =
    value.saving && value.descriptor.action === builderActionBarActions.finishBuilder;
  const block = value.presentation.block ?? value.compact;

  return (
    <div
      className={cx("grid min-w-0 gap-1", block && "w-full")}
      data-builder-action-wrapper={value.descriptor.action}
    >
      <Button
        loading={finishSaving}
        disabled={value.saving || unavailable}
        sourceFocusTarget={value.sourceFocusTarget}
        data-builder-action={value.descriptor.action}
        className={value.compact ? "min-h-11" : undefined}
        onRequestPress={() => value.onRequestAction(value.descriptor)}
        placement={block ? uiPlacementModes.block : uiPlacementModes.inline}
        emphasis={value.presentation.primary ? uiEmphasisModes.prominent : undefined}
        tone={value.descriptor.tone ?? actionToneByAction[value.descriptor.action]}
        aria-describedby={
          unavailable && value.descriptor.disabledReason ? unavailableReasonId : undefined
        }
      >
        {value.descriptor.label}
      </Button>
      <Show when={Boolean(unavailable && value.descriptor.disabledReason)}>
        {() => (
          <StatusMessage id={unavailableReasonId}>{value.descriptor.disabledReason}</StatusMessage>
        )}
      </Show>
    </div>
  );
}

function BuilderPrimaryActionRegion({ value }: PresentContentProps<BuilderActionValue>) {
  return (
    <div data-builder-action-region="primary">
      <BuilderAction value={value} />
    </div>
  );
}

const createBuilderActionValue = (
  descriptor: BuilderActionBarActionDescriptor | undefined,
  shared: BuilderActionSharedValue,
  presentation: BuilderActionValue["presentation"] = {},
): BuilderActionValue | undefined =>
  descriptor
    ? {
        ...shared,
        descriptor,
        presentation,
      }
    : undefined;

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

  const actionSharedValue: BuilderActionSharedValue = {
    compact,
    onRequestAction: emit,
    saving,
    sourceFocusTarget: props.sourceFocusTarget,
    statusId,
  };

  return (
    <section
      aria-label={props.label}
      data-dirty={props.dirty}
      data-state={props.state}
      aria-busy={saving || undefined}
      data-ui-component="UI-CMP-026"
      data-layout={compact ? "compact" : "dock"}
      className={cx(
        surfaceRecipe({ material: uiMaterialModes.elevated }),
        "grid min-h-[5.25rem] min-w-0 gap-3",
      )}
    >
      <Show
        when={compact}
        fallback={() => (
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(12rem,auto)_minmax(0,1fr)] items-center gap-3">
            <div className="flex min-w-0 justify-start" data-builder-action-region="undo">
              <Present value={createBuilderActionValue(undoAction, actionSharedValue)}>
                {BuilderAction}
              </Present>
            </div>
            <BuilderActionStatusRegion
              compact={compact}
              state={props.state}
              statusId={statusId}
              status={props.status}
            />
            <div
              data-builder-action-region="primary"
              className="flex min-w-0 flex-wrap items-start justify-end gap-2"
            >
              {cancelActions.map((descriptor) => (
                <BuilderAction
                  key={descriptor.id}
                  value={{
                    ...actionSharedValue,
                    descriptor,
                    presentation: {},
                  }}
                />
              ))}
              <Present
                value={createBuilderActionValue(primaryAction, actionSharedValue, {
                  primary: true,
                })}
              >
                {BuilderAction}
              </Present>
            </div>
          </div>
        )}
      >
        {() => (
          <div className="grid min-w-0 gap-3">
            <Present
              value={createBuilderActionValue(primaryAction, actionSharedValue, {
                block: true,
                primary: true,
              })}
            >
              {BuilderPrimaryActionRegion}
            </Present>
            <BuilderActionStatusRegion
              compact={compact}
              state={props.state}
              statusId={statusId}
              status={props.status}
            />
            <Show when={Boolean(undoAction || cancelActions.length > 0)}>
              {() => (
                <div
                  data-builder-action-region="secondary"
                  className="grid min-w-0 grid-cols-2 gap-2"
                >
                  <Present
                    value={createBuilderActionValue(undoAction, actionSharedValue, { block: true })}
                  >
                    {BuilderAction}
                  </Present>
                  {cancelActions.map((descriptor) => (
                    <BuilderAction
                      key={descriptor.id}
                      value={{
                        ...actionSharedValue,
                        descriptor,
                        presentation: { block: true },
                      }}
                    />
                  ))}
                </div>
              )}
            </Show>
          </div>
        )}
      </Show>
    </section>
  );
}

BuilderActionBar.displayName = "BuilderActionBar";
