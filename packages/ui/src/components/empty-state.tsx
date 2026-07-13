import { Button } from "../primitives/button";
import { Group, Stack } from "../primitives/layout";
import { uiToneModes } from "../tokens/value";
import type { ComponentActionDescriptor, ComponentActionIntent } from "./type";
import { componentInteractionReasons } from "./value";

export const emptyStateActions = {
  dismissEmptyState: "dismissEmptyState",
  runEmptyStateAction: "runEmptyStateAction",
} as const;

export type EmptyStateAction = (typeof emptyStateActions)[keyof typeof emptyStateActions];

export type EmptyStateModel = {
  actions: readonly ComponentActionDescriptor[];
  details?: string;
  dismissLabel?: string;
  message: string;
  stateToken: string;
  title: string;
};

export type EmptyStateIntent = ComponentActionIntent<EmptyStateAction> & {
  actionId?: string;
  stateToken: string;
};

export type EmptyStateProps = EmptyStateModel & {
  onRequestAction?: (intent: EmptyStateIntent) => void;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function EmptyState(props: EmptyStateProps) {
  const emit = (action: EmptyStateAction, actionId?: string) =>
    props.onRequestAction?.({
      action,
      actionId,
      reason: componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
      stateToken: props.stateToken,
    });

  return (
    <section
      aria-labelledby={`${props.stateToken}-empty-title`}
      className="grid min-w-0 place-items-start gap-3 rounded-[var(--ui-radius-surface)] bg-[var(--ui-content)] p-4"
      data-empty-state={props.stateToken}
      data-ui-component="UI-CMP-029"
    >
      <Stack>
        <h2 className="text-base font-semibold" id={`${props.stateToken}-empty-title`}>
          {props.title}
        </h2>
        <p className="text-sm text-[var(--ui-muted-text)]">{props.message}</p>
        {props.details && <p className="text-xs text-[var(--ui-muted-text)]">{props.details}</p>}
      </Stack>
      {(props.actions.length > 0 || props.dismissLabel) && (
        <Group>
          {props.actions.map((descriptor) => (
            <Button
              disabled={!descriptor.available}
              key={descriptor.id}
              onRequestPress={() => emit(emptyStateActions.runEmptyStateAction, descriptor.id)}
              tone={descriptor.tone ?? uiToneModes.neutral}
            >
              {descriptor.label}
            </Button>
          ))}
          {props.dismissLabel && (
            <Button onRequestPress={() => emit(emptyStateActions.dismissEmptyState)}>
              {props.dismissLabel}
            </Button>
          )}
        </Group>
      )}
    </section>
  );
}

EmptyState.displayName = "EmptyState";
