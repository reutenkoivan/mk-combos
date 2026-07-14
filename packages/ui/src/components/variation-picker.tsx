import { Button } from "../primitives/button";
import { Group } from "../primitives/layout";
import { PickerGrid } from "./internal/picker-grid";
import type { ComponentActionIntent, PickerOption, PickerSlot, UiResponsiveMode } from "./type";
import { componentInteractionReasons } from "./value";

export const variationPickerActions = {
  clearVariation: "clearVariation",
  focusVariationSlot: "focusVariationSlot",
  returnToCharacterPicker: "returnToCharacterPicker",
  selectVariation: "selectVariation",
} as const;

export type VariationPickerAction =
  (typeof variationPickerActions)[keyof typeof variationPickerActions];

export type VariationPickerIntent = ComponentActionIntent<VariationPickerAction> & {
  slotId?: string;
  variationId?: string;
};

export type VariationPickerProps = {
  backLabel?: string;
  busy?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  focusedSlotId?: string;
  label: string;
  layoutId: string;
  message?: string;
  onRequestAction?: (intent: VariationPickerIntent) => void;
  options: readonly PickerOption[];
  parentContextLabel?: string;
  responsiveMode: UiResponsiveMode;
  selectedVariationId?: string;
  slots: readonly PickerSlot[];
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function VariationPicker(props: VariationPickerProps) {
  const emit = (
    action: VariationPickerAction,
    input: { slotId?: string; variationId?: string } = {},
  ) =>
    props.onRequestAction?.({
      action,
      reason:
        action === variationPickerActions.focusVariationSlot
          ? componentInteractionReasons.triggerFocus
          : componentInteractionReasons.press,
      slotId: input.slotId,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
      variationId: input.variationId,
    });

  return (
    <section className="grid min-w-0 gap-2" data-ui-component="UI-CMP-008">
      {props.parentContextLabel && (
        <p className="text-xs text-(--ui-muted-text)">{props.parentContextLabel}</p>
      )}
      <PickerGrid
        busy={props.busy}
        disabled={props.disabled || !props.parentContextLabel}
        focusedSlotId={props.focusedSlotId}
        label={props.label}
        layoutId={props.layoutId}
        message={props.message}
        onRequestAction={(intent) =>
          emit(
            intent.type === "focus"
              ? variationPickerActions.focusVariationSlot
              : variationPickerActions.selectVariation,
            { slotId: intent.slotId, variationId: intent.optionId },
          )
        }
        options={props.options}
        responsiveMode={props.responsiveMode}
        selectedOptionId={props.selectedVariationId}
        slots={props.slots}
      />
      {(props.backLabel || props.clearLabel) && (
        <Group>
          {props.backLabel && (
            <Button onRequestPress={() => emit(variationPickerActions.returnToCharacterPicker)}>
              {props.backLabel}
            </Button>
          )}
          {props.clearLabel && (
            <Button
              disabled={!props.selectedVariationId || props.disabled || props.busy}
              onRequestPress={() => emit(variationPickerActions.clearVariation)}
            >
              {props.clearLabel}
            </Button>
          )}
        </Group>
      )}
    </section>
  );
}

VariationPicker.displayName = "VariationPicker";
