import { useComponentActionEmitter } from "../hooks/intents";
import { Button } from "../primitives/button";
import { StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
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
  const actionEmitter = useComponentActionEmitter<FirstLaunchSetupFormAction>({
    onRequest: props.onRequestAction,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <section className="grid min-w-0 gap-4" data-ui-component="UI-CMP-006">
      {(props.title || props.description) && (
        <header className="grid gap-1 pb-2">
          {props.title && (
            <h1 className="font-[var(--ui-font-display)] text-xl font-semibold tracking-[-0.01em]">
              {props.title}
            </h1>
          )}
          {props.description && (
            <p className="text-sm text-[var(--ui-muted-text)]">{props.description}</p>
          )}
        </header>
      )}
      <GameSwitcher {...props.gameSwitcher} context={gameSwitcherContexts.firstLaunch} />
      <LanguageSwitcher {...props.languageSwitcher} />
      <DisplayModeSwitcher {...props.displayModeSwitcher} />
      <NotationLegendTable {...props.notationLegend} />
      {props.validationMessage && (
        <StatusMessage tone={uiToneModes.destructive}>{props.validationMessage}</StatusMessage>
      )}
      {props.persistenceMessage && (
        <div className="grid gap-2">
          <StatusMessage tone={uiToneModes.warning}>{props.persistenceMessage}</StatusMessage>
          {props.sessionOnlyAcknowledgeLabel && (
            <Button
              onRequestPress={() =>
                actionEmitter.methods.emitAction(firstLaunchSetupFormActions.acknowledgeSessionOnly)
              }
            >
              {props.sessionOnlyAcknowledgeLabel}
            </Button>
          )}
        </div>
      )}
      {!props.confirmAvailable && props.confirmDisabledReason && (
        <StatusMessage tone={uiToneModes.neutral}>{props.confirmDisabledReason}</StatusMessage>
      )}
      <Button
        disabled={!props.confirmAvailable || props.saving}
        loading={props.saving}
        onRequestPress={() => actionEmitter.methods.emitAction(firstLaunchSetupFormActions.confirm)}
        tone={uiToneModes.accent}
      >
        {props.confirmLabel}
      </Button>
    </section>
  );
}

FirstLaunchSetupForm.displayName = "FirstLaunchSetupForm";
