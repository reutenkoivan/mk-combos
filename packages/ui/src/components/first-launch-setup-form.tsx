import type { SubmitEvent } from "react";

import { useComponentActionEmitter } from "../hooks/intents";
import { useUiRootContext } from "../internal/ui-root-context";
import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import { StatusMessage } from "../primitives/state";
import { uiEmphasisModes, uiToneModes } from "../tokens/value";
import { DisplayModeSwitcher, type DisplayModeSwitcherProps } from "./display-mode-switcher";
import { GameSwitcher, type GameSwitcherProps, gameSwitcherContexts } from "./game-switcher";
import { LanguageSwitcher, type LanguageSwitcherProps } from "./language-switcher";
import { NotationLegendTable, type NotationLegendTableProps } from "./notation-legend-table";
import type { ComponentActionIntent } from "./type";

export const firstLaunchSetupFormActions = {
  acknowledgeSessionOnly: "acknowledgeSessionOnly",
  confirm: "confirm",
} as const;

export type FirstLaunchSetupFormAction =
  (typeof firstLaunchSetupFormActions)[keyof typeof firstLaunchSetupFormActions];

export type FirstLaunchSetupFormProps = {
  confirmAvailable: boolean;
  confirmDisabledReason?: string;
  confirmLabel: string;
  controllerFocusedAction?: FirstLaunchSetupFormAction;
  displayModeSwitcher: DisplayModeSwitcherProps;
  gameSwitcher: GameSwitcherProps;
  languageSwitcher: LanguageSwitcherProps;
  notationLegend: NotationLegendTableProps;
  onRequestAction?: (intent: ComponentActionIntent<FirstLaunchSetupFormAction>) => void;
  persistenceMessage?: string;
  saving?: boolean;
  sessionOnlyAcknowledgeLabel?: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
  validationMessage?: string;
  title?: string;
  description?: string;
};

export function FirstLaunchSetupForm(props: FirstLaunchSetupFormProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const actionEmitter = useComponentActionEmitter<FirstLaunchSetupFormAction>({
    onRequest: props.onRequestAction,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });
  const sessionOnly = Boolean(props.sessionOnlyAcknowledgeLabel);
  const submitAvailable = props.confirmAvailable && !props.saving;
  const submitAction = sessionOnly
    ? firstLaunchSetupFormActions.acknowledgeSessionOnly
    : firstLaunchSetupFormActions.confirm;
  const submitLabel = props.sessionOnlyAcknowledgeLabel ?? props.confirmLabel;
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitAvailable) {
      actionEmitter.methods.emitAction(submitAction);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid min-w-0 gap-4"
      data-ui-component="UI-CMP-006"
      aria-busy={props.saving || undefined}
    >
      <Show when={Boolean(props.title || props.description)}>
        {() => (
          <header className="grid gap-1 pb-2">
            <Show when={Boolean(props.title)}>
              {() => (
                <h2 className="font-(--ui-font-display) text-xl font-semibold tracking-[-0.01em]">
                  {props.title}
                </h2>
              )}
            </Show>
            <Show when={Boolean(props.description)}>
              {() => <p className="text-sm text-(--ui-muted-text)">{props.description}</p>}
            </Show>
          </header>
        )}
      </Show>
      <GameSwitcher {...props.gameSwitcher} context={gameSwitcherContexts.firstLaunch} />
      <LanguageSwitcher {...props.languageSwitcher} />
      <DisplayModeSwitcher {...props.displayModeSwitcher} />
      <NotationLegendTable {...props.notationLegend} />
      <Show when={Boolean(props.validationMessage)}>
        {() => (
          <StatusMessage tone={uiToneModes.destructive}>{props.validationMessage}</StatusMessage>
        )}
      </Show>
      <Show when={Boolean(props.persistenceMessage)}>
        {() => <StatusMessage tone={uiToneModes.warning}>{props.persistenceMessage}</StatusMessage>}
      </Show>
      <Show when={!props.confirmAvailable && Boolean(props.confirmDisabledReason)}>
        {() => (
          <StatusMessage tone={uiToneModes.neutral}>{props.confirmDisabledReason}</StatusMessage>
        )}
      </Show>
      <Button
        type="submit"
        loading={props.saving}
        tone={uiToneModes.accent}
        disabled={!submitAvailable}
        emphasis={uiEmphasisModes.prominent}
        data-ui-focus-target={props.sourceFocusTarget}
        className="w-full sm:justify-self-end sm:w-auto"
        data-controller-focused={
          controllerFocusVisible && props.controllerFocusedAction === submitAction
            ? "true"
            : undefined
        }
      >
        {submitLabel}
      </Button>
    </form>
  );
}

FirstLaunchSetupForm.displayName = "FirstLaunchSetupForm";
