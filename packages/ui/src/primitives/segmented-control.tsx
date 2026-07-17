import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import { useUiRootContext } from "../internal/ui-root-context";
import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import type { UiDensityMode, UiShapeMode, UiToneMode } from "../tokens/type";
import { uiDensityModes, uiInteractionStates, uiShapeModes, uiToneModes } from "../tokens/value";
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
  controllerFocusedValue?: Value;
  focusTargetIdPrefix?: string;
  onValueChange?: (payload: UiPrimitiveValueChangePayload<Value>) => void;
  options: readonly SegmentedControlOption<Value>[];
  shape?: UiShapeMode;
  tone?: UiToneMode;
  value: Value;
};

export function SegmentedControl<Value extends string>(props: SegmentedControlProps<Value>) {
  const { controllerFocusVisible } = useUiRootContext();
  const {
    "aria-label": ariaLabel,
    className,
    controllerFocusedValue,
    density = uiDensityModes.small,
    disabled = false,
    focusTargetIdPrefix,
    onValueChange,
    options,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    value,
    ...controlProps
  } = props;

  return (
    <ToggleGroup
      {...controlProps}
      ref={ref}
      value={[value]}
      multiple={false}
      disabled={disabled}
      aria-label={ariaLabel}
      data-ui-segmented-control
      data-disabled={disabled ? "true" : undefined}
      className={cx(
        "inline-flex min-w-0 flex-wrap items-center gap-1 rounded-(--ui-radius-control) bg-(--ui-control) p-1",
        className,
      )}
      onValueChange={(groupValue, eventDetails) => {
        const nextValue = groupValue[0];

        if (nextValue) {
          onValueChange?.({
            reason: mapBaseUiReason(eventDetails.reason),
            value: nextValue,
          });
        }
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Toggle
            key={option.value}
            value={option.value}
            aria-label={option.accessibleLabel}
            disabled={disabled || option.disabled}
            data-selected={selected ? "true" : undefined}
            data-ui-segmented-control-option={option.value}
            data-disabled={disabled || option.disabled ? "true" : undefined}
            data-controller-focused={
              controllerFocusVisible && controllerFocusedValue === option.value ? "true" : undefined
            }
            data-ui-focus-target={
              focusTargetIdPrefix ? `${focusTargetIdPrefix}:${option.value}` : option.value
            }
            className={controlRecipe({
              density,
              shape,
              state: selected ? uiInteractionStates.selected : uiInteractionStates.idle,
              tone,
            })}
          >
            {option.label}
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
}

SegmentedControl.displayName = "SegmentedControl";
