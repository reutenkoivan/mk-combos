import type { ReactNode } from "react";

import { InternalButton } from "../internal/base-ui/button";
import type {
  UiDensityMode,
  UiEmphasisMode,
  UiPlacementMode,
  UiShapeMode,
  UiToneMode,
} from "../tokens/type";
import type { UiPrimitiveProps } from "./internal";

export type ButtonPressPayload = {
  reason: "press";
  sourceFocusTarget?: string;
};

export type ButtonProps = UiPrimitiveProps<HTMLButtonElement> & {
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
      data-ui-button
      disabled={disabled}
      loading={loading}
      onClick={() => onRequestPress?.({ reason: "press", sourceFocusTarget })}
      type={type}
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
    <Button {...buttonProps} aria-label={label} data-ui-icon-button>
      {children}
    </Button>
  );
}

IconButton.displayName = "IconButton";
