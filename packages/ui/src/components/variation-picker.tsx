import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import { Group } from "../primitives/layout";
import { cx } from "../recipes/class-name";
import { PickerGrid, pickerGridPlacements } from "./internal/picker-grid";
import type {
  ComponentActionIntent,
  PickerOption,
  PickerPresentationMode,
  PickerSlot,
  UiResponsiveMode,
} from "./type";
import { componentInteractionReasons, pickerPresentationModes } from "./value";

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
  presentation?: PickerPresentationMode;
  responsiveMode: UiResponsiveMode;
  selectedVariationId?: string;
  slots: readonly PickerSlot[];
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function VariationPicker(props: VariationPickerProps) {
  const commandDeck = props.presentation === pickerPresentationModes.commandDeck;
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
    <section
      data-ui-component="UI-CMP-008"
      className={cx("grid min-w-0", commandDeck ? "gap-4" : "gap-2")}
      data-picker-presentation={props.presentation ?? pickerPresentationModes.standard}
    >
      <Show when={Boolean(props.parentContextLabel)}>
        {() => <p className="text-xs text-(--ui-muted-text)">{props.parentContextLabel}</p>}
      </Show>
      <PickerGrid
        busy={props.busy}
        label={props.label}
        slots={props.slots}
        message={props.message}
        options={props.options}
        layoutId={props.layoutId}
        portraitLayout={commandDeck}
        presentation={props.presentation}
        focusedSlotId={props.focusedSlotId}
        responsiveMode={props.responsiveMode}
        selectedOptionId={props.selectedVariationId}
        disabled={props.disabled || !props.parentContextLabel}
        placement={commandDeck ? pickerGridPlacements.compact : undefined}
        onRequestAction={(intent) =>
          emit(
            intent.type === "focus"
              ? variationPickerActions.focusVariationSlot
              : variationPickerActions.selectVariation,
            { slotId: intent.slotId, variationId: intent.optionId },
          )
        }
      />
      <Show when={Boolean(props.backLabel || props.clearLabel)}>
        {() => (
          <Group className={commandDeck ? "border-t border-(--ui-command-border) pt-3" : undefined}>
            <Show when={Boolean(props.backLabel)}>
              {() => (
                <Button
                  className={commandDeck ? "rounded-none" : undefined}
                  onRequestPress={() => emit(variationPickerActions.returnToCharacterPicker)}
                >
                  {props.backLabel}
                </Button>
              )}
            </Show>
            <Show when={Boolean(props.clearLabel)}>
              {() => (
                <Button
                  className={commandDeck ? "rounded-none" : undefined}
                  onRequestPress={() => emit(variationPickerActions.clearVariation)}
                  disabled={!props.selectedVariationId || props.disabled || props.busy}
                >
                  {props.clearLabel}
                </Button>
              )}
            </Show>
          </Group>
        )}
      </Show>
    </section>
  );
}

VariationPicker.displayName = "VariationPicker";
