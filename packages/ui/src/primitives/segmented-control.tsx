import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import type { UiDensityMode, UiShapeMode, UiToneMode } from "../tokens/type";
import {
  mapBaseUiReason,
  type UiPrimitiveProps,
  type UiPrimitiveValueChangePayload,
} from "./internal";

export type SegmentedControlOption<Value extends string> = {
  accessibleLabel?: string;
  disabled?: boolean;
  label: string;
  value: Value;
};

export type SegmentedControlProps<Value extends string> = Omit<
  UiPrimitiveProps<HTMLDivElement>,
  "children"
> & {
  density?: UiDensityMode;
  disabled?: boolean;
  onValueChange?: (payload: UiPrimitiveValueChangePayload<Value>) => void;
  options: readonly SegmentedControlOption<Value>[];
  shape?: UiShapeMode;
  tone?: UiToneMode;
  value: Value;
};

export function SegmentedControl<Value extends string>(props: SegmentedControlProps<Value>) {
  const {
    "aria-label": ariaLabel,
    className,
    density = "small",
    disabled = false,
    onValueChange,
    options,
    ref,
    shape = "fixed",
    tone = "neutral",
    value,
    ...controlProps
  } = props;

  return (
    <ToggleGroup
      {...controlProps}
      aria-label={ariaLabel}
      className={cx(
        "inline-flex min-w-0 items-center gap-1 rounded-[var(--ui-radius-control)] bg-[var(--ui-control)] p-1",
        className,
      )}
      data-disabled={disabled ? "true" : undefined}
      data-ui-segmented-control
      disabled={disabled}
      multiple={false}
      onValueChange={(groupValue, eventDetails) => {
        const nextValue = groupValue[0];

        if (nextValue) {
          onValueChange?.({
            reason: mapBaseUiReason(eventDetails.reason),
            value: nextValue,
          });
        }
      }}
      ref={ref}
      value={[value]}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Toggle
            aria-label={option.accessibleLabel}
            className={controlRecipe({
              density,
              shape,
              state: selected ? "selected" : "idle",
              tone,
            })}
            data-selected={selected ? "true" : undefined}
            data-ui-segmented-control-option={option.value}
            disabled={disabled || option.disabled}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
}

SegmentedControl.displayName = "SegmentedControl";
