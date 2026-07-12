import type { ChangeEvent } from "react";

import { cx } from "../recipes/class-name";
import { fieldRecipe } from "../recipes/field";
import type { UiDensityMode, UiShapeMode, UiToneMode } from "../tokens/type";
import { densityGapClasses, type UiPrimitiveProps } from "./internal";

export type FieldProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
};

export function Field(props: FieldProps) {
  const { children, className, density = "small", ref, ...fieldProps } = props;

  return (
    <div
      {...fieldProps}
      className={cx("grid min-w-0", densityGapClasses[density], className)}
      data-ui-field
      ref={ref}
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
      htmlFor={htmlFor}
      className={cx("text-xs font-medium text-[var(--ui-muted-text)]", className)}
      data-ui-field-label
      ref={ref}
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
    ref,
    shape = "fixed",
    tone = "neutral",
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
      aria-invalid={invalid || undefined}
      className={cx(
        fieldRecipe({
          shape,
          state: disabled ? "disabled" : invalid ? "invalid" : "idle",
          tone,
        }),
        className,
      )}
      data-disabled={disabled ? "true" : undefined}
      data-ui-text-input
      disabled={disabled}
      onChange={handleChange}
      ref={ref}
      type={type}
    />
  );
}

TextInput.displayName = "TextInput";

export type FieldMessageProps = UiPrimitiveProps<HTMLDivElement> & {
  invalid?: boolean;
  tone?: UiToneMode;
};

const fieldMessageToneClasses = {
  accent: "text-[var(--ui-accent-strong)]",
  destructive: "text-[var(--ui-destructive)]",
  neutral: "text-[var(--ui-muted-text)]",
  success: "text-[var(--ui-success)]",
  warning: "text-[var(--ui-warning)]",
} as const;

export function FieldMessage(props: FieldMessageProps) {
  const {
    children,
    className,
    invalid = false,
    ref,
    role,
    tone = "neutral",
    ...messageProps
  } = props;
  const resolvedTone = invalid ? "destructive" : tone;

  return (
    <div
      {...messageProps}
      className={cx("text-xs leading-snug", fieldMessageToneClasses[resolvedTone], className)}
      data-ui-field-message
      ref={ref}
      role={role ?? (invalid ? "alert" : undefined)}
    >
      {children}
    </div>
  );
}

FieldMessage.displayName = "FieldMessage";
