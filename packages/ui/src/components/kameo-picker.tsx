import { Button } from "../primitives/button";
import { Group } from "../primitives/layout";
import { PickerGrid } from "./internal/picker-grid";
import type { ComponentActionIntent, PickerOption, PickerSlot, UiResponsiveMode } from "./type";
import { componentInteractionReasons } from "./value";

export const kameoPickerActions = {
  clearKameo: "clearKameo",
  focusKameoSlot: "focusKameoSlot",
  returnToCharacterPicker: "returnToCharacterPicker",
  selectKameo: "selectKameo",
} as const;

export type KameoPickerAction = (typeof kameoPickerActions)[keyof typeof kameoPickerActions];

export type KameoPickerIntent = ComponentActionIntent<KameoPickerAction> & {
  kameoId?: string;
  slotId?: string;
};

export type KameoPickerProps = {
  backLabel?: string;
  busy?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  focusedSlotId?: string;
  label: string;
  layoutId: string;
  message?: string;
  onRequestAction?: (intent: KameoPickerIntent) => void;
  options: readonly PickerOption[];
  parentContextLabel?: string;
  responsiveMode: UiResponsiveMode;
  selectedKameoId?: string;
  slots: readonly PickerSlot[];
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function KameoPicker(props: KameoPickerProps) {
  const emit = (action: KameoPickerAction, input: { kameoId?: string; slotId?: string } = {}) =>
    props.onRequestAction?.({
      action,
      kameoId: input.kameoId,
      reason:
        action === kameoPickerActions.focusKameoSlot
          ? componentInteractionReasons.triggerFocus
          : componentInteractionReasons.press,
      slotId: input.slotId,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });

  return (
    <section className="grid min-w-0 gap-2" data-ui-component="UI-CMP-009">
      {props.parentContextLabel && (
        <p className="text-xs text-[var(--ui-muted-text)]">{props.parentContextLabel}</p>
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
              ? kameoPickerActions.focusKameoSlot
              : kameoPickerActions.selectKameo,
            { kameoId: intent.optionId, slotId: intent.slotId },
          )
        }
        options={props.options}
        responsiveMode={props.responsiveMode}
        selectedOptionId={props.selectedKameoId}
        slots={props.slots}
      />
      {(props.backLabel || props.clearLabel) && (
        <Group>
          {props.backLabel && (
            <Button onRequestPress={() => emit(kameoPickerActions.returnToCharacterPicker)}>
              {props.backLabel}
            </Button>
          )}
          {props.clearLabel && (
            <Button
              disabled={!props.selectedKameoId || props.disabled || props.busy}
              onRequestPress={() => emit(kameoPickerActions.clearKameo)}
            >
              {props.clearLabel}
            </Button>
          )}
        </Group>
      )}
    </section>
  );
}

KameoPicker.displayName = "KameoPicker";
