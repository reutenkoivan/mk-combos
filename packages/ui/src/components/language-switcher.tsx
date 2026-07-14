import type { LanguageCode } from "@mk-combos/contracts/settings/type";

import { useFieldMessage } from "../hooks/field-message";
import { useComponentValueEmitter } from "../hooks/intents";
import { Field, FieldLabel, FieldMessage } from "../primitives/field";
import { SegmentedControl } from "../primitives/segmented-control";
import { uiToneModes } from "../tokens/value";
import type { ComponentValueIntent, LanguageSwitcherOption } from "./type";
import { componentOptionStatuses } from "./value";

export type LanguageSwitcherProps = {
  ariaLabel?: string;
  availableLanguages: readonly LanguageSwitcherOption[];
  busy?: boolean;
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
      aria-busy={props.busy || undefined}
      className="border-t border-(--ui-separator) py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center"
      data-ui-component="UI-CMP-003"
    >
      {props.label && <FieldLabel>{props.label}</FieldLabel>}
      <SegmentedControl
        {...fieldMessage.methods.getControlProps()}
        aria-label={props.ariaLabel ?? props.label}
        disabled={blocked}
        onValueChange={({ reason, value }) => valueEmitter.methods.emitValue(value, reason)}
        options={props.availableLanguages.map((option) => ({
          accessibleLabel: option.label,
          disabled: option.status === componentOptionStatuses.disabledUnavailable,
          label: option.shortLabel ?? option.label,
          value: option.language,
        }))}
        tone={props.invalidSelectedLanguage ? uiToneModes.destructive : uiToneModes.neutral}
        value={props.selectedLanguage}
      />
      {props.validationMessage && (
        <FieldMessage {...fieldMessage.methods.getMessageProps()}>
          {props.validationMessage}
        </FieldMessage>
      )}
    </Field>
  );
}

LanguageSwitcher.displayName = "LanguageSwitcher";
