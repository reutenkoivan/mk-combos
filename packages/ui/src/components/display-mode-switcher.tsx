import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { useFieldMessage } from "../hooks/field-message";
import { useComponentValueEmitter } from "../hooks/intents";
import { Field, FieldLabel, FieldMessage } from "../primitives/field";
import { SegmentedControl } from "../primitives/segmented-control";
import { uiToneModes } from "../tokens/value";
import type { ComponentValueIntent, DisplayModeSwitcherOption } from "./type";
import { componentOptionStatuses } from "./value";

export type DisplayModeSwitcherProps = {
  ariaLabel?: string;
  availableDisplayModes: readonly DisplayModeSwitcherOption[];
  busy?: boolean;
  disabled?: boolean;
  invalidSelectedDisplayMode?: boolean;
  label?: string;
  onRequestSelectDisplayMode?: (intent: ComponentValueIntent<NotationDisplayMode>) => void;
  selectedDisplayMode: NotationDisplayMode;
  sourceFocusTarget?: string;
  sourceSurface: string;
  validationMessage?: string;
};

export function DisplayModeSwitcher(props: DisplayModeSwitcherProps) {
  const blocked = Boolean(props.disabled || props.busy);
  const fieldMessage = useFieldMessage({
    hasMessage: Boolean(props.validationMessage),
    invalid: props.invalidSelectedDisplayMode,
  });
  const valueEmitter = useComponentValueEmitter<NotationDisplayMode>({
    onRequest: props.onRequestSelectDisplayMode,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <Field
      aria-busy={props.busy || undefined}
      className="border-t border-(--ui-separator) py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center"
      data-ui-component="UI-CMP-004"
    >
      {props.label && <FieldLabel>{props.label}</FieldLabel>}
      <SegmentedControl
        {...fieldMessage.methods.getControlProps()}
        aria-label={props.ariaLabel ?? props.label}
        disabled={blocked}
        onValueChange={({ reason, value }) => valueEmitter.methods.emitValue(value, reason)}
        options={props.availableDisplayModes.map((option) => ({
          accessibleLabel: option.label,
          disabled: option.status === componentOptionStatuses.disabledUnavailable,
          label: option.shortLabel ?? option.label,
          value: option.mode,
        }))}
        tone={props.invalidSelectedDisplayMode ? uiToneModes.destructive : uiToneModes.neutral}
        value={props.selectedDisplayMode}
      />
      {props.validationMessage && (
        <FieldMessage {...fieldMessage.methods.getMessageProps()}>
          {props.validationMessage}
        </FieldMessage>
      )}
    </Field>
  );
}

DisplayModeSwitcher.displayName = "DisplayModeSwitcher";
