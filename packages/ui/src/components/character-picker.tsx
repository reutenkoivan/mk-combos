import { Button } from "../primitives/button";
import { Group } from "../primitives/layout";
import { PickerGrid } from "./internal/picker-grid";
import type { ComponentActionIntent, PickerOption, PickerSlot, UiResponsiveMode } from "./type";
import { componentInteractionReasons } from "./value";

export const characterPickerActions = {
  clearCharacter: "clearCharacter",
  focusCharacterSlot: "focusCharacterSlot",
  moveToGameSpecificPicker: "moveToGameSpecificPicker",
  selectCharacter: "selectCharacter",
} as const;

export type CharacterPickerAction =
  (typeof characterPickerActions)[keyof typeof characterPickerActions];

export type CharacterPickerIntent = ComponentActionIntent<CharacterPickerAction> & {
  characterId?: string;
  slotId?: string;
};

export type CharacterPickerProps = {
  busy?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  focusedSlotId?: string;
  label: string;
  layoutId: string;
  message?: string;
  nextLabel?: string;
  onRequestAction?: (intent: CharacterPickerIntent) => void;
  options: readonly PickerOption[];
  responsiveMode: UiResponsiveMode;
  selectedCharacterId?: string;
  slots: readonly PickerSlot[];
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function CharacterPicker(props: CharacterPickerProps) {
  const emit = (
    action: CharacterPickerAction,
    input: { characterId?: string; slotId?: string } = {},
  ) =>
    props.onRequestAction?.({
      action,
      characterId: input.characterId,
      reason:
        action === characterPickerActions.focusCharacterSlot
          ? componentInteractionReasons.triggerFocus
          : componentInteractionReasons.press,
      slotId: input.slotId,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });

  return (
    <section className="grid min-w-0 gap-2" data-ui-component="UI-CMP-007">
      <PickerGrid
        busy={props.busy}
        disabled={props.disabled}
        focusedSlotId={props.focusedSlotId}
        label={props.label}
        layoutId={props.layoutId}
        message={props.message}
        onRequestAction={(intent) =>
          emit(
            intent.type === "focus"
              ? characterPickerActions.focusCharacterSlot
              : characterPickerActions.selectCharacter,
            { characterId: intent.optionId, slotId: intent.slotId },
          )
        }
        options={props.options}
        responsiveMode={props.responsiveMode}
        selectedOptionId={props.selectedCharacterId}
        slots={props.slots}
      />
      {(props.clearLabel || props.nextLabel) && (
        <Group>
          {props.clearLabel && (
            <Button
              disabled={!props.selectedCharacterId || props.disabled || props.busy}
              onRequestPress={() => emit(characterPickerActions.clearCharacter)}
            >
              {props.clearLabel}
            </Button>
          )}
          {props.nextLabel && (
            <Button
              disabled={!props.selectedCharacterId || props.disabled || props.busy}
              onRequestPress={() => emit(characterPickerActions.moveToGameSpecificPicker)}
            >
              {props.nextLabel}
            </Button>
          )}
        </Group>
      )}
    </section>
  );
}

CharacterPicker.displayName = "CharacterPicker";
