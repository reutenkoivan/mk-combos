import type { ThemePreference } from "@mk-combos/contracts/settings/type";

import { useFieldMessage } from "../hooks/field-message";
import { useComponentValueEmitter } from "../hooks/intents";
import { Show } from "../primitives/conditional";
import { Field, FieldLabel, FieldMessage } from "../primitives/field";
import { SegmentedControl } from "../primitives/segmented-control";
import { uiToneModes } from "../tokens/value";
import type { ComponentValueIntent, ThemePreferenceSwitcherOption } from "./type";
import { componentOptionStatuses } from "./value";

export type ThemePreferenceSwitcherProps = {
  ariaLabel?: string;
  availableThemePreferences: readonly ThemePreferenceSwitcherOption[];
  busy?: boolean;
  controllerFocusedThemePreference?: ThemePreference;
  disabled?: boolean;
  invalidSelectedThemePreference?: boolean;
  label?: string;
  onRequestSelectThemePreference?: (intent: ComponentValueIntent<ThemePreference>) => void;
  selectedThemePreference: ThemePreference;
  sourceFocusTarget?: string;
  sourceSurface: string;
  validationMessage?: string;
};

export function ThemePreferenceSwitcher(props: ThemePreferenceSwitcherProps) {
  const blocked = Boolean(props.disabled || props.busy);
  const fieldMessage = useFieldMessage({
    hasMessage: Boolean(props.validationMessage),
    invalid: props.invalidSelectedThemePreference,
  });
  const valueEmitter = useComponentValueEmitter<ThemePreference>({
    onRequest: props.onRequestSelectThemePreference,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <Field
      aria-busy={props.busy || undefined}
      data-ui-component="theme-preference-switcher"
      className="border-t border-(--ui-separator) py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center"
    >
      <Show when={Boolean(props.label)}>{() => <FieldLabel>{props.label}</FieldLabel>}</Show>
      <SegmentedControl
        {...fieldMessage.methods.getControlProps()}
        disabled={blocked}
        value={props.selectedThemePreference}
        aria-label={props.ariaLabel ?? props.label}
        focusTargetIdPrefix={props.sourceFocusTarget}
        controllerFocusedValue={props.controllerFocusedThemePreference}
        onValueChange={({ reason, value }) => valueEmitter.methods.emitValue(value, reason)}
        tone={props.invalidSelectedThemePreference ? uiToneModes.destructive : uiToneModes.neutral}
        options={props.availableThemePreferences.map((option) => ({
          accessibleLabel: option.label,
          disabled: option.status === componentOptionStatuses.disabledUnavailable,
          label: option.shortLabel ?? option.label,
          value: option.preference,
        }))}
      />
      <Show when={Boolean(props.validationMessage)}>
        {() => (
          <FieldMessage {...fieldMessage.methods.getMessageProps()}>
            {props.validationMessage}
          </FieldMessage>
        )}
      </Show>
    </Field>
  );
}

ThemePreferenceSwitcher.displayName = "ThemePreferenceSwitcher";
