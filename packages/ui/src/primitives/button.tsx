import type { ReactNode } from "react";

import { InternalButton } from "../internal/base-ui/button";
import type {
  UiControlPresentationMode,
  UiDensityMode,
  UiEmphasisMode,
  UiPlacementMode,
  UiShapeMode,
  UiToneMode,
} from "../tokens/type";
import { uiControlPresentationModes } from "../tokens/value";
import type { UiPrimitiveProps } from "./internal";

export type ButtonPressPayload = {
  reason: "press";
  sourceFocusTarget?: string;
};

export type ButtonProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  disabled?: boolean;
  density?: UiDensityMode;
  emphasis?: UiEmphasisMode;
  loading?: boolean;
  onRequestPress?: (payload: ButtonPressPayload) => void;
  placement?: UiPlacementMode;
  shape?: UiShapeMode;
  sourceFocusTarget?: string;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function Button(props: ButtonProps) {
  const {
    children,
    disabled = false,
    loading = false,
    onRequestPress,
    sourceFocusTarget,
    type = "button",
    ...buttonProps
  } = props;

  return (
    <InternalButton
      {...buttonProps}
      type={type}
      data-ui-button
      loading={loading}
      disabled={disabled}
      onClick={() => onRequestPress?.({ reason: "press", sourceFocusTarget })}
    >
      {children}
    </InternalButton>
  );
}

Button.displayName = "Button";

export type IconButtonProps = Omit<ButtonProps, "aria-label" | "children"> & {
  children: ReactNode;
  label: string;
};

export function IconButton(props: IconButtonProps) {
  const { children, label, ...buttonProps } = props;

  return (
    <Button
      {...buttonProps}
      aria-label={label}
      data-ui-icon-button
      appearance={uiControlPresentationModes.icon}
    >
      {children}
    </Button>
  );
}

IconButton.displayName = "IconButton";
