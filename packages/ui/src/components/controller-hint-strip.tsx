import { useComponentOpenChangeEmitter } from "../hooks/intents";
import { Gamepad2Icon } from "../icons/gamepad-2";
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

  if (!visible) {
    return null;
  }

  const connected = props.connectionState === controllerConnectionStates.connected;
  const layoutMode = props.layoutMode ?? uiResponsiveModes.desktop;
  const visibleHints = props.hints.slice(0, layoutMode === uiResponsiveModes.mobile ? 2 : 3);

  return (
    <div
      className="flex min-w-0 items-center gap-2"
      data-layout={layoutMode}
      data-ui-component="UI-CMP-005"
    >
      <PopoverRoot
        onOpenChange={panelChangeEmitter.methods.handleOpenChange}
        open={props.panelOpen}
        sourceFocusTarget={props.sourceFocusTarget}
      >
        <PopoverTrigger
          appearance={uiControlPresentationModes.icon}
          aria-label={props.label}
          className="h-7 w-7 min-w-7 p-0 aria-expanded:text-(--ui-accent-strong)"
          data-connection-state={props.connectionState}
          data-panel-state={props.panelOpen ? "open" : "closed"}
          tone={connected ? uiToneModes.success : uiToneModes.warning}
        >
          <Gamepad2Icon
            aria-hidden="true"
            size="small"
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
                      className="grid grid-cols-[auto_1fr] items-start gap-2 rounded-(--ui-radius-control) p-1"
                      key={hint.commandId}
                    >
                      <Badge>{hint.inputLabel}</Badge>
                      <span className="grid gap-1">
                        <span className="text-sm font-medium">{hint.label}</span>
                        {hint.description && (
                          <span className="text-xs text-(--ui-muted-text)">{hint.description}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      </PopoverRoot>
      {connected && (
        <div
          className={
            layoutMode === uiResponsiveModes.mobile
              ? "fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 flex min-w-0 items-center justify-center gap-3 rounded-(--ui-radius-control) bg-(--ui-glass) p-2 shadow-(--ui-shadow) backdrop-blur-xl"
              : "flex min-w-0 items-center gap-2"
          }
        >
          {visibleHints.map((hint) => (
            <span className="inline-flex min-w-0 items-center gap-1 text-xs" key={hint.commandId}>
              <Badge tone={uiToneModes.accent}>{hint.inputLabel}</Badge>
              <span className="truncate text-(--ui-muted-text)">{hint.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

ControllerHintStrip.displayName = "ControllerHintStrip";
