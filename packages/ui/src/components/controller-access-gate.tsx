import { Gamepad2Icon } from "../icons/gamepad-2";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
import { LoadingIndicator, StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import type { ControllerAccessState, UiResponsiveMode } from "./type";
import { controllerAccessStates } from "./value";

type ControllerAccessGateProps = {
  description: string;
  hints?: readonly { inputLabel: string; label: string }[];
  layoutMode: UiResponsiveMode;
  profileLabel?: string;
  resumeFocusTarget?: string;
  state: ControllerAccessState;
  statusLabel: string;
  title: string;
};

type ControllerAccessPresentation = Readonly<{
  blockingError: boolean;
  waiting: boolean;
}>;

function resolveControllerAccessPresentation(
  state: ControllerAccessState,
): ControllerAccessPresentation | undefined {
  switch (state) {
    case controllerAccessStates.ready:
    case controllerAccessStates.suspended:
      return undefined;
    case controllerAccessStates.blocked:
    case controllerAccessStates.unsupported:
      return { blockingError: true, waiting: false };
    case controllerAccessStates.awaitingGesture:
    case controllerAccessStates.awaitingNeutral:
    case controllerAccessStates.checking:
    case controllerAccessStates.disconnected:
      return { blockingError: false, waiting: true };
  }

  const unhandledState: never = state;
  return unhandledState;
}

type ControllerAccessGateContentValue = Readonly<{
  presentation: ControllerAccessPresentation;
  props: ControllerAccessGateProps;
}>;

function ControllerAccessGateContent({
  value: { presentation, props },
}: PresentContentProps<ControllerAccessGateContentValue>) {
  const { blockingError, waiting } = presentation;

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-state={props.state}
      data-layout={props.layoutMode}
      data-ui-component="UI-CMP-038"
      aria-labelledby="controller-access-title"
      aria-describedby="controller-access-description"
      data-resume-focus-target={props.resumeFocusTarget}
      className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-[color-mix(in_srgb,var(--ui-window)_94%,black)] p-4"
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
              id="controller-access-title"
              className="font-(--ui-font-display) text-2xl font-semibold tracking-[-0.01em]"
            >
              {props.title}
            </h1>
            <p
              id="controller-access-description"
              className="text-sm leading-relaxed text-(--ui-muted-text)"
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
            <Show when={waiting}>
              {() => <LoadingIndicator label={props.statusLabel} tone={uiToneModes.warning} />}
            </Show>
            <span>{props.statusLabel}</span>
          </span>
        </StatusMessage>

        <Show when={Boolean(props.profileLabel)}>
          {() => <p className="text-xs text-(--ui-muted-text)">{props.profileLabel}</p>}
        </Show>

        <Show when={Boolean(props.hints?.length)}>
          {() => (
            <ul className="grid list-none divide-y divide-(--ui-separator) border-y border-(--ui-separator) p-0 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {props.hints?.map((hint) => (
                <li
                  key={`${hint.inputLabel}-${hint.label}`}
                  className="grid grid-cols-[auto_1fr] items-center gap-2 py-3 sm:px-3"
                >
                  <span className="grid min-h-8 min-w-8 place-items-center bg-(--ui-control) px-2 font-bold text-(--ui-accent-strong)">
                    {hint.inputLabel}
                  </span>
                  <span className="text-sm">{hint.label}</span>
                </li>
              ))}
            </ul>
          )}
        </Show>
      </section>
    </div>
  );
}

function ControllerAccessGate(props: ControllerAccessGateProps) {
  const presentation = resolveControllerAccessPresentation(props.state);
  const contentValue = presentation ? { presentation, props } : undefined;

  return <Present value={contentValue}>{ControllerAccessGateContent}</Present>;
}

export { ControllerAccessGate };

ControllerAccessGate.displayName = "ControllerAccessGate";
