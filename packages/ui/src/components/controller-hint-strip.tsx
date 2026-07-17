import { useComponentOpenChangeEmitter } from "../hooks/intents";
import { Gamepad2Icon } from "../icons/gamepad-2";
import { Show } from "../primitives/conditional";
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "../primitives/popover";
import { uiFloatingAlignments } from "../primitives/positioning";
import { Badge, StatusMessage } from "../primitives/state";
import { uiControlPresentationModes, uiToneModes } from "../tokens/value";
import type { ComponentActionIntent, UiResponsiveMode } from "./type";
import { uiResponsiveModes } from "./value";

export const controllerHintStripPanelActions = {
  close: "close",
  open: "open",
} as const;

export type ControllerHintStripPanelAction =
  (typeof controllerHintStripPanelActions)[keyof typeof controllerHintStripPanelActions];

export const controllerConnectionStates = {
  connected: "connected",
  disconnected: "disconnected",
} as const;

export const controllerHintStripPresentations = {
  commandRibbon: "commandRibbon",
  standard: "standard",
} as const;

type ControllerHintStripPresentation =
  (typeof controllerHintStripPresentations)[keyof typeof controllerHintStripPresentations];

export type ControllerConnectionState =
  (typeof controllerConnectionStates)[keyof typeof controllerConnectionStates];

export type ControllerHint = {
  commandId: string;
  description?: string;
  inputLabel: string;
  label: string;
};

export type ControllerHintStripProps = {
  connectionState: ControllerConnectionState;
  hasRecentDisconnect: boolean;
  hints: readonly ControllerHint[];
  label: string;
  onRequestHintPanelChange?: (
    intent: ComponentActionIntent<ControllerHintStripPanelAction>,
  ) => void;
  panelOpen: boolean;
  presentation?: ControllerHintStripPresentation;
  profileLabel?: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
  layoutMode?: UiResponsiveMode;
};

export function ControllerHintStrip(props: ControllerHintStripProps) {
  const panelChangeEmitter = useComponentOpenChangeEmitter<ControllerHintStripPanelAction>({
    closeAction: controllerHintStripPanelActions.close,
    onRequest: props.onRequestHintPanelChange,
    openAction: controllerHintStripPanelActions.open,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });
  const visible =
    props.connectionState === controllerConnectionStates.connected || props.hasRecentDisconnect;

  return (
    <Show when={visible}>
      {() => {
        const connected = props.connectionState === controllerConnectionStates.connected;
        const layoutMode = props.layoutMode ?? uiResponsiveModes.desktop;
        const presentation = props.presentation ?? controllerHintStripPresentations.standard;
        const commandRibbon = presentation === controllerHintStripPresentations.commandRibbon;
        const visibleHints = commandRibbon
          ? props.hints
          : props.hints.slice(0, layoutMode === uiResponsiveModes.mobile ? 2 : 3);

        return (
          <div
            data-layout={layoutMode}
            data-ui-component="UI-CMP-005"
            data-presentation={presentation}
            className={
              commandRibbon
                ? "sticky bottom-0 z-30 flex min-w-0 flex-wrap items-center gap-3 rounded-none border border-(--ui-command-border) bg-(--ui-command-chrome) p-2 text-(--ui-command-chrome-text)"
                : "flex min-w-0 items-center gap-2"
            }
          >
            <PopoverRoot
              open={props.panelOpen}
              sourceFocusTarget={props.sourceFocusTarget}
              onOpenChange={panelChangeEmitter.methods.handleOpenChange}
            >
              <PopoverTrigger
                aria-label={props.label}
                appearance={uiControlPresentationModes.icon}
                data-connection-state={props.connectionState}
                data-panel-state={props.panelOpen ? "open" : "closed"}
                tone={connected ? uiToneModes.success : uiToneModes.warning}
                className="h-7 w-7 min-w-7 p-0 aria-expanded:text-(--ui-accent-strong)"
              >
                <Gamepad2Icon
                  size="small"
                  aria-hidden="true"
                  strokeDasharray={connected ? undefined : "3 2"}
                />
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverPositioner align={uiFloatingAlignments.end}>
                  <PopoverPopup className="w-[min(20rem,calc(100vw-2rem))]">
                    <div className="grid gap-2">
                      <div className="grid gap-1 border-b border-(--ui-separator) p-1 pb-2">
                        <PopoverTitle>{props.profileLabel ?? props.label}</PopoverTitle>
                        <StatusMessage tone={connected ? uiToneModes.success : uiToneModes.warning}>
                          {props.label}
                        </StatusMessage>
                      </div>
                      <ol className="grid list-none gap-1 p-0">
                        {props.hints.map((hint) => (
                          <li
                            key={hint.commandId}
                            className="grid grid-cols-[auto_1fr] items-start gap-2 rounded-(--ui-radius-control) p-1"
                          >
                            <Badge>{hint.inputLabel}</Badge>
                            <span className="grid gap-1">
                              <span className="text-sm font-medium">{hint.label}</span>
                              <Show when={Boolean(hint.description)}>
                                {() => (
                                  <span className="text-xs text-(--ui-muted-text)">
                                    {hint.description}
                                  </span>
                                )}
                              </Show>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </PopoverPopup>
                </PopoverPositioner>
              </PopoverPortal>
            </PopoverRoot>
            <Show when={connected}>
              {() => (
                <div
                  className={
                    commandRibbon
                      ? "flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-4 gap-y-2"
                      : layoutMode === uiResponsiveModes.mobile
                        ? "fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 flex min-w-0 items-center justify-center gap-3 rounded-(--ui-radius-control) bg-(--ui-glass) p-2 shadow-(--ui-shadow) backdrop-blur-xl"
                        : "flex min-w-0 items-center gap-2"
                  }
                >
                  {visibleHints.map((hint) => (
                    <span
                      key={hint.commandId}
                      className="inline-flex min-w-0 items-center gap-1 text-xs"
                    >
                      <Badge
                        tone={uiToneModes.accent}
                        className={commandRibbon ? "rounded-none font-mono" : undefined}
                      >
                        {hint.inputLabel}
                      </Badge>
                      <span
                        className={
                          commandRibbon
                            ? "break-words text-(--ui-command-muted-text)"
                            : "truncate text-(--ui-muted-text)"
                        }
                      >
                        {hint.label}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </Show>
          </div>
        );
      }}
    </Show>
  );
}

ControllerHintStrip.displayName = "ControllerHintStrip";
