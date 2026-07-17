import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentPropsWithRef } from "react";

import { cx } from "../../recipes/class-name";
import { controlRecipe } from "../../recipes/control";
import type {
  UiControlPresentationMode,
  UiDensityMode,
  UiEmphasisMode,
  UiPlacementMode,
  UiShapeMode,
  UiToneMode,
} from "../../tokens/type";

export type InternalButtonProps = ComponentPropsWithRef<typeof BaseButton> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  emphasis?: UiEmphasisMode;
  loading?: boolean;
  placement?: UiPlacementMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
};

export function InternalButton(props: InternalButtonProps) {
  const {
    appearance = "filled",
    className,
    density = "small",
    disabled,
    emphasis = "normal",
    loading = false,
    placement = "inline",
    ref,
    shape = "fixed",
    tone = "neutral",
    ...buttonProps
  } = props;

  return (
    <BaseButton
      {...buttonProps}
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      className={cx(
        controlRecipe({
          appearance,
          density,
          emphasis,
          placement,
          shape,
          state: loading ? "loading" : disabled ? "disabled" : "idle",
          tone,
        }),
        className,
      )}
    />
  );
}

InternalButton.displayName = "InternalButton";
