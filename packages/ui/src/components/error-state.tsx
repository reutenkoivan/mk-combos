import { AlertTriangleIcon } from "../icons/alert-triangle";
import { Button } from "../primitives/button";
import { Group, Stack } from "../primitives/layout";
import { uiToneModes } from "../tokens/value";
import type { ComponentActionDescriptor, ComponentActionIntent } from "./type";
import { componentInteractionReasons } from "./value";

export const errorStateActions = {
  dismissRecoverableError: "dismissRecoverableError",
  navigateErrorFallback: "navigateErrorFallback",
  retryErrorAction: "retryErrorAction",
} as const;

export type ErrorStateAction = (typeof errorStateActions)[keyof typeof errorStateActions];

export const errorStateActionKinds = {
  dismiss: "dismiss",
  fallback: "fallback",
  retry: "retry",
} as const;

export type ErrorStateActionKind =
  (typeof errorStateActionKinds)[keyof typeof errorStateActionKinds];

export const errorStateSeverities = {
  blocking: "blocking",
  recoverable: "recoverable",
  warning: "warning",
} as const;

export type ErrorStateSeverity = (typeof errorStateSeverities)[keyof typeof errorStateSeverities];

export type ErrorStateActionDescriptor = ComponentActionDescriptor & {
  kind: ErrorStateActionKind;
};

export type ErrorStateIntent = ComponentActionIntent<ErrorStateAction> & {
  actionId: string;
  errorToken: string;
};

export type ErrorStateProps = {
  actions: readonly ErrorStateActionDescriptor[];
  errorToken: string;
  message: string;
  onRequestAction?: (intent: ErrorStateIntent) => void;
  severity: ErrorStateSeverity;
  sourceFocusTarget?: string;
  sourceSurface: string;
  technicalReference?: string;
  title: string;
};

const actionByKind = {
  dismiss: errorStateActions.dismissRecoverableError,
  fallback: errorStateActions.navigateErrorFallback,
  retry: errorStateActions.retryErrorAction,
} as const satisfies Record<ErrorStateActionKind, ErrorStateAction>;

export function ErrorState(props: ErrorStateProps) {
  const blocking = props.severity === errorStateSeverities.blocking;

  return (
    <section
      aria-labelledby={`${props.errorToken}-error-title`}
      className="grid min-w-0 gap-3 rounded-(--ui-radius-surface) border border-(--ui-destructive-border) bg-(--ui-destructive-soft) p-4"
      data-error-severity={props.severity}
      data-error-token={props.errorToken}
      data-ui-component="UI-CMP-030"
      role={blocking ? "alert" : "status"}
    >
      <Group align="start" wrap={false}>
        <AlertTriangleIcon aria-hidden="true" size="small" />
        <Stack>
          <h2 className="font-semibold" id={`${props.errorToken}-error-title`}>
            {props.title}
          </h2>
          <p className="text-sm">{props.message}</p>
        </Stack>
      </Group>
      {props.technicalReference && (
        <code className="text-xs text-(--ui-muted-text)">{props.technicalReference}</code>
      )}
      {props.actions.length > 0 && (
        <Group>
          {props.actions.map((descriptor) => (
            <Button
              disabled={!descriptor.available}
              key={descriptor.id}
              onRequestPress={() =>
                props.onRequestAction?.({
                  action: actionByKind[descriptor.kind],
                  actionId: descriptor.id,
                  errorToken: props.errorToken,
                  reason: componentInteractionReasons.press,
                  sourceFocusTarget: props.sourceFocusTarget,
                  sourceSurface: props.sourceSurface,
                })
              }
              tone={descriptor.tone ?? uiToneModes.destructive}
            >
              {descriptor.label}
            </Button>
          ))}
        </Group>
      )}
    </section>
  );
}

ErrorState.displayName = "ErrorState";
