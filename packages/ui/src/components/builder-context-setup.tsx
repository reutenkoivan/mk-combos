import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import { Field, FieldLabel, FieldMessage, TextInput } from "../primitives/field";
import { Group, Stack } from "../primitives/layout";
import { StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import { SelectableItem } from "./internal/selectable-item";
import type { ComponentActionDescriptor, ComponentActionIntent } from "./type";
import { componentInteractionReasons } from "./value";

export const builderContextSetupActions = {
  confirmBuilderContext: "confirmBuilderContext",
  resetBuilderContext: "resetBuilderContext",
  updateBuilderContext: "updateBuilderContext",
  updateRuntimeStartState: "updateRuntimeStartState",
  updateStageContext: "updateStageContext",
} as const;

export type BuilderContextSetupAction =
  (typeof builderContextSetupActions)[keyof typeof builderContextSetupActions];

export const builderContextFieldKinds = {
  choice: "choice",
  text: "text",
} as const;

export type BuilderContextFieldKind =
  (typeof builderContextFieldKinds)[keyof typeof builderContextFieldKinds];

export type BuilderContextFieldOption = {
  available: boolean;
  disabledReason?: string;
  id: string;
  label: string;
};

type BuilderContextFieldBase = {
  disabled?: boolean;
  id: string;
  label: string;
  validationMessage?: string;
};

export type BuilderContextChoiceField = BuilderContextFieldBase & {
  kind: typeof builderContextFieldKinds.choice;
  options: readonly BuilderContextFieldOption[];
  value?: string;
};

export type BuilderContextTextField = BuilderContextFieldBase & {
  kind: typeof builderContextFieldKinds.text;
  placeholder?: string;
  value: string;
};

export type BuilderContextField = BuilderContextChoiceField | BuilderContextTextField;

export type BuilderContextSetupIntent = ComponentActionIntent<BuilderContextSetupAction> & {
  actionId?: string;
  fieldId?: string;
  value?: string;
};

export type BuilderContextSetupProps = {
  busy?: boolean;
  confirmAction: ComponentActionDescriptor;
  label: string;
  onRequestAction?: (intent: BuilderContextSetupIntent) => void;
  optionalFields: readonly BuilderContextField[];
  primaryFields: readonly BuilderContextField[];
  resetAction?: ComponentActionDescriptor;
  runtimeFields: readonly BuilderContextField[];
  sourceFocusTarget?: string;
  sourceSurface: string;
  validationMessage?: string;
};

type FieldGroupProps = {
  action: BuilderContextSetupAction;
  busy?: boolean;
  fields: readonly BuilderContextField[];
  onRequestChange: (
    action: BuilderContextSetupAction,
    fieldId: string,
    value: string,
    reason: "inputChange" | "press",
  ) => void;
};

function renderBuilderContextField(field: BuilderContextField, props: FieldGroupProps) {
  switch (field.kind) {
    case builderContextFieldKinds.choice:
      return (
        <Group aria-label={field.label} role="group">
          {field.options.map((option) => (
            <SelectableItem
              key={option.id}
              selected={option.id === field.value}
              value={`${field.id}-${option.id}`}
              className="grid-cols-[1fr] px-3 py-2"
              accessibleLabel={option.disabledReason ?? option.label}
              disabled={props.busy || field.disabled || !option.available}
              onRequestPress={() =>
                props.onRequestChange(props.action, field.id, option.id, "press")
              }
            >
              <span>{option.label}</span>
            </SelectableItem>
          ))}
        </Group>
      );
    case builderContextFieldKinds.text:
      return (
        <TextInput
          value={field.value}
          aria-label={field.label}
          placeholder={field.placeholder}
          disabled={props.busy || field.disabled}
          invalid={Boolean(field.validationMessage)}
          onValueChange={({ value }) =>
            props.onRequestChange(props.action, field.id, value, "inputChange")
          }
        />
      );
  }

  const unhandledField: never = field;
  return unhandledField;
}

function FieldGroup(props: FieldGroupProps) {
  return props.fields.map((field) => (
    <Field key={field.id}>
      <FieldLabel>{field.label}</FieldLabel>
      {renderBuilderContextField(field, props)}
      <Show when={Boolean(field.validationMessage)}>
        {() => <FieldMessage invalid>{field.validationMessage}</FieldMessage>}
      </Show>
    </Field>
  ));
}

export function BuilderContextSetup(props: BuilderContextSetupProps) {
  const emitChange = (
    action: BuilderContextSetupAction,
    fieldId: string,
    value: string,
    reason: "inputChange" | "press",
  ) =>
    props.onRequestAction?.({
      action,
      fieldId,
      reason: componentInteractionReasons[reason],
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
      value,
    });
  const emitAction = (action: BuilderContextSetupAction, actionId?: string) =>
    props.onRequestAction?.({
      action,
      actionId,
      reason: componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });

  return (
    <section
      aria-label={props.label}
      className="grid min-w-0 gap-4"
      data-ui-component="UI-CMP-023"
      aria-busy={props.busy || undefined}
    >
      <Stack density="medium">
        <FieldGroup
          busy={props.busy}
          fields={props.primaryFields}
          onRequestChange={emitChange}
          action={builderContextSetupActions.updateBuilderContext}
        />
        <FieldGroup
          busy={props.busy}
          onRequestChange={emitChange}
          fields={props.optionalFields}
          action={builderContextSetupActions.updateStageContext}
        />
        <FieldGroup
          busy={props.busy}
          fields={props.runtimeFields}
          onRequestChange={emitChange}
          action={builderContextSetupActions.updateRuntimeStartState}
        />
      </Stack>
      <Show when={Boolean(props.validationMessage)}>
        {() => (
          <StatusMessage tone={uiToneModes.destructive}>{props.validationMessage}</StatusMessage>
        )}
      </Show>
      <Group>
        <Show when={Boolean(props.resetAction)}>
          {() => (
            <Button
              disabled={!props.resetAction?.available || props.busy}
              onRequestPress={() =>
                emitAction(builderContextSetupActions.resetBuilderContext, props.resetAction?.id)
              }
            >
              {props.resetAction?.label}
            </Button>
          )}
        </Show>
        <Button
          loading={props.busy}
          tone={uiToneModes.accent}
          disabled={!props.confirmAction.available || props.busy}
          onRequestPress={() =>
            emitAction(builderContextSetupActions.confirmBuilderContext, props.confirmAction.id)
          }
        >
          {props.confirmAction.label}
        </Button>
      </Group>
    </section>
  );
}

BuilderContextSetup.displayName = "BuilderContextSetup";
