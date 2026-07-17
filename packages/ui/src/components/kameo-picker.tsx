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
  presentation?: PickerPresentationMode;
  responsiveMode: UiResponsiveMode;
  selectedKameoId?: string;
  slots: readonly PickerSlot[];
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function KameoPicker(props: KameoPickerProps) {
  const commandDeck = props.presentation === pickerPresentationModes.commandDeck;
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
    <section
      data-ui-component="UI-CMP-009"
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
        selectedOptionId={props.selectedKameoId}
        disabled={props.disabled || !props.parentContextLabel}
        placement={commandDeck ? pickerGridPlacements.compact : undefined}
        onRequestAction={(intent) =>
          emit(
            intent.type === "focus"
              ? kameoPickerActions.focusKameoSlot
              : kameoPickerActions.selectKameo,
            { kameoId: intent.optionId, slotId: intent.slotId },
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
                  onRequestPress={() => emit(kameoPickerActions.returnToCharacterPicker)}
                >
                  {props.backLabel}
                </Button>
              )}
            </Show>
            <Show when={Boolean(props.clearLabel)}>
              {() => (
                <Button
                  className={commandDeck ? "rounded-none" : undefined}
                  onRequestPress={() => emit(kameoPickerActions.clearKameo)}
                  disabled={!props.selectedKameoId || props.disabled || props.busy}
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

KameoPicker.displayName = "KameoPicker";
