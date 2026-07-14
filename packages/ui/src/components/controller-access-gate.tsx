import { Gamepad2Icon } from "../icons/gamepad-2";
import { LoadingIndicator, StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import type { ControllerAccessState, UiResponsiveMode } from "./type";
import { controllerAccessStates } from "./value";

export type ControllerAccessGateProps = {
  description: string;
  hints?: readonly { inputLabel: string; label: string }[];
  layoutMode: UiResponsiveMode;
  profileLabel?: string;
  resumeFocusTarget?: string;
  state: ControllerAccessState;
  statusLabel: string;
  title: string;
};

export function ControllerAccessGate(props: ControllerAccessGateProps) {
  if (
    props.state === controllerAccessStates.ready ||
    props.state === controllerAccessStates.suspended
  ) {
    return null;
  }

  const blockingError =
    props.state === controllerAccessStates.unsupported ||
    props.state === controllerAccessStates.blocked;
  const waiting =
    props.state === controllerAccessStates.checking ||
    props.state === controllerAccessStates.awaitingGesture ||
    props.state === controllerAccessStates.awaitingNeutral ||
    props.state === controllerAccessStates.disconnected;

  return (
    <div
      aria-describedby="controller-access-description"
      aria-labelledby="controller-access-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-[color-mix(in_srgb,var(--ui-window)_94%,black)] p-4"
      data-layout={props.layoutMode}
      data-resume-focus-target={props.resumeFocusTarget}
      data-state={props.state}
      data-ui-component="UI-CMP-038"
      role="dialog"
    >
      <section className="grid w-full max-w-xl gap-5 p-1 sm:p-4">
        <div className="grid grid-cols-[auto_1fr] items-start gap-4">
          <span className="grid h-12 w-12 place-items-center text-(--ui-accent-strong)">
            <Gamepad2Icon aria-hidden="true" size={24} />
          </span>
          <div className="grid gap-2">
            <span className="text-xs font-medium text-(--ui-accent-strong)">
              Controller-only access
            </span>
            <h1
              className="font-(--ui-font-display) text-2xl font-semibold tracking-[-0.01em]"
              id="controller-access-title"
            >
              {props.title}
            </h1>
            <p
              className="text-sm leading-relaxed text-(--ui-muted-text)"
              id="controller-access-description"
            >
              {props.description}
            </p>
          </div>
        </div>

        <StatusMessage
          aria-live={blockingError ? "assertive" : "polite"}
          className="border-l-2 border-current py-2 pl-3"
          tone={
            blockingError
              ? uiToneModes.destructive
              : waiting
                ? uiToneModes.warning
                : uiToneModes.neutral
          }
        >
          <span className="inline-flex items-center gap-2">
            {waiting && <LoadingIndicator label={props.statusLabel} tone={uiToneModes.warning} />}
            <span>{props.statusLabel}</span>
          </span>
        </StatusMessage>

        {props.profileLabel && (
          <p className="text-xs text-(--ui-muted-text)">{props.profileLabel}</p>
        )}

        {props.hints && props.hints.length > 0 && (
          <ul className="grid list-none divide-y divide-(--ui-separator) border-y border-(--ui-separator) p-0 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {props.hints.map((hint) => (
              <li
                className="grid grid-cols-[auto_1fr] items-center gap-2 py-3 sm:px-3"
                key={`${hint.inputLabel}-${hint.label}`}
              >
                <span className="grid min-h-8 min-w-8 place-items-center bg-(--ui-control) px-2 font-bold text-(--ui-accent-strong)">
                  {hint.inputLabel}
                </span>
                <span className="text-sm">{hint.label}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

ControllerAccessGate.displayName = "ControllerAccessGate";
