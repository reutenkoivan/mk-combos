import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentPropsWithRef } from "react";

import { cx } from "../../recipes/class-name";
import { controlRecipe } from "../../recipes/control";
import type {
  UiDensityMode,
  UiEmphasisMode,
  UiPlacementMode,
  UiShapeMode,
  UiToneMode,
} from "../../tokens/type";

export type InternalButtonProps = ComponentPropsWithRef<typeof BaseButton> & {
  density?: UiDensityMode;
  emphasis?: UiEmphasisMode;
  loading?: boolean;
  placement?: UiPlacementMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
};

export function InternalButton(props: InternalButtonProps) {
  const {
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
      aria-busy={loading || undefined}
      className={cx(
        controlRecipe({
          density,
          emphasis,
          placement,
          shape,
          state: disabled ? "disabled" : loading ? "loading" : "idle",
          tone,
        }),
        className,
      )}
      data-disabled={disabled ? "true" : undefined}
      data-loading={loading ? "true" : undefined}
      disabled={disabled || loading}
      ref={ref}
    />
  );
}

InternalButton.displayName = "InternalButton";
