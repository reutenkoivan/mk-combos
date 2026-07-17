import type { LanguageCode } from "@mk-combos/contracts/settings/type";

import { useFieldMessage } from "../hooks/field-message";
import { useComponentValueEmitter } from "../hooks/intents";
import { Show } from "../primitives/conditional";
import { Field, FieldLabel, FieldMessage } from "../primitives/field";
import { SegmentedControl } from "../primitives/segmented-control";
import { uiToneModes } from "../tokens/value";
import type { ComponentValueIntent, LanguageSwitcherOption } from "./type";
import { componentOptionStatuses } from "./value";

export type LanguageSwitcherProps = {
  ariaLabel?: string;
  availableLanguages: readonly LanguageSwitcherOption[];
  busy?: boolean;
  controllerFocusedLanguage?: LanguageCode;
  disabled?: boolean;
  invalidSelectedLanguage?: boolean;
  label?: string;
  onRequestSelectLanguage?: (intent: ComponentValueIntent<LanguageCode>) => void;
  selectedLanguage: LanguageCode;
  sourceFocusTarget?: string;
  sourceSurface: string;
  validationMessage?: string;
};

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const blocked = Boolean(props.disabled || props.busy);
  const fieldMessage = useFieldMessage({
    hasMessage: Boolean(props.validationMessage),
    invalid: props.invalidSelectedLanguage,
  });
  const valueEmitter = useComponentValueEmitter<LanguageCode>({
    onRequest: props.onRequestSelectLanguage,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <Field
      data-ui-component="UI-CMP-003"
      aria-busy={props.busy || undefined}
      className="border-t border-(--ui-separator) py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center"
    >
      <Show when={Boolean(props.label)}>{() => <FieldLabel>{props.label}</FieldLabel>}</Show>
      <SegmentedControl
        {...fieldMessage.methods.getControlProps()}
        disabled={blocked}
        value={props.selectedLanguage}
        aria-label={props.ariaLabel ?? props.label}
        focusTargetIdPrefix={props.sourceFocusTarget}
        controllerFocusedValue={props.controllerFocusedLanguage}
        onValueChange={({ reason, value }) => valueEmitter.methods.emitValue(value, reason)}
        tone={props.invalidSelectedLanguage ? uiToneModes.destructive : uiToneModes.neutral}
        options={props.availableLanguages.map((option) => ({
          accessibleLabel: option.label,
          disabled: option.status === componentOptionStatuses.disabledUnavailable,
          label: option.shortLabel ?? option.label,
          value: option.language,
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

LanguageSwitcher.displayName = "LanguageSwitcher";
