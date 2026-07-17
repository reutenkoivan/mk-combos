import type { ChangeEvent } from "react";

import { cx } from "../recipes/class-name";
import { fieldRecipe } from "../recipes/field";
import type { UiDensityMode, UiShapeMode, UiToneMode } from "../tokens/type";
import { uiDensityModes, uiInteractionStates, uiShapeModes, uiToneModes } from "../tokens/value";
import { densityGapClasses, type UiPrimitiveProps } from "./internal";

export type FieldProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
};

export function Field(props: FieldProps) {
  const { children, className, density = uiDensityModes.small, ref, ...fieldProps } = props;

  return (
    <div
      {...fieldProps}
      ref={ref}
      data-ui-field
      className={cx("grid min-w-0", densityGapClasses[density], className)}
    >
      {children}
    </div>
  );
}

Field.displayName = "Field";

export type FieldLabelProps = UiPrimitiveProps<HTMLLabelElement> & {
  htmlFor?: string;
};

export function FieldLabel(props: FieldLabelProps) {
  const { children, className, htmlFor, ref, ...labelProps } = props;

  return (
    <label
      {...labelProps}
      ref={ref}
      htmlFor={htmlFor}
      data-ui-field-label
      className={cx("text-xs font-medium text-(--ui-muted-text)", className)}
    >
      {children}
    </label>
  );
}

FieldLabel.displayName = "FieldLabel";

export type TextInputChangePayload = {
  reason: "inputChange";
  value: string;
};

export type TextInputProps = Omit<UiPrimitiveProps<HTMLInputElement>, "children"> & {
  autoComplete?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  onValueChange?: (payload: TextInputChangePayload) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "email" | "password" | "search" | "text" | "url";
  value?: string;
};

export function TextInput(props: TextInputProps) {
  const {
    className,
    disabled = false,
    invalid = false,
    onValueChange,
    readOnly = false,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    type = "text",
    ...inputProps
  } = props;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.({
      reason: "inputChange",
      value: event.currentTarget.value,
    });
  };

  return (
    <input
      {...inputProps}
      ref={ref}
      type={type}
      data-ui-text-input
      disabled={disabled}
      readOnly={readOnly}
      onChange={handleChange}
      aria-invalid={invalid || undefined}
      data-disabled={disabled ? "true" : undefined}
      className={cx(
        fieldRecipe({
          editable: !disabled && !readOnly,
          shape,
          state: disabled
            ? uiInteractionStates.disabled
            : invalid
              ? uiInteractionStates.invalid
              : uiInteractionStates.idle,
          tone,
        }),
        className,
      )}
    />
  );
}

TextInput.displayName = "TextInput";

export type FieldMessageProps = UiPrimitiveProps<HTMLDivElement> & {
  invalid?: boolean;
  tone?: UiToneMode;
};

const fieldMessageToneClasses = {
  accent: "text-(--ui-accent-strong)",
  destructive: "text-(--ui-destructive)",
  neutral: "text-(--ui-muted-text)",
  success: "text-(--ui-success)",
  warning: "text-(--ui-warning)",
} as const;

export function FieldMessage(props: FieldMessageProps) {
  const {
    children,
    className,
    invalid = false,
    ref,
    role,
    tone = uiToneModes.neutral,
    ...messageProps
  } = props;
  const resolvedTone = invalid ? uiToneModes.destructive : tone;

  return (
    <div
      {...messageProps}
      ref={ref}
      data-ui-field-message
      role={role ?? (invalid ? "alert" : undefined)}
      className={cx("text-xs leading-snug", fieldMessageToneClasses[resolvedTone], className)}
    >
      {children}
    </div>
  );
}

FieldMessage.displayName = "FieldMessage";
