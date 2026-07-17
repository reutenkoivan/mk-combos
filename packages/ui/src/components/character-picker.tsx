import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import { Group } from "../primitives/layout";
import { cx } from "../recipes/class-name";
import { PickerGrid } from "./internal/picker-grid";
import type {
  ComponentActionIntent,
  PickerOption,
  PickerPresentationMode,
  PickerSlot,
  UiResponsiveMode,
} from "./type";
import { componentInteractionReasons, pickerPresentationModes } from "./value";

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
  presentation?: PickerPresentationMode;
  responsiveMode: UiResponsiveMode;
  selectedCharacterId?: string;
  slots: readonly PickerSlot[];
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function CharacterPicker(props: CharacterPickerProps) {
  const commandDeck = props.presentation === pickerPresentationModes.commandDeck;
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
    <section
      data-ui-component="UI-CMP-007"
      className={cx("grid min-w-0", commandDeck ? "gap-4" : "gap-2")}
      data-picker-presentation={props.presentation ?? pickerPresentationModes.standard}
    >
      <PickerGrid
        busy={props.busy}
        label={props.label}
        slots={props.slots}
        message={props.message}
        options={props.options}
        disabled={props.disabled}
        layoutId={props.layoutId}
        portraitLayout={commandDeck}
        presentation={props.presentation}
        focusedSlotId={props.focusedSlotId}
        responsiveMode={props.responsiveMode}
        selectedOptionId={props.selectedCharacterId}
        onRequestAction={(intent) =>
          emit(
            intent.type === "focus"
              ? characterPickerActions.focusCharacterSlot
              : characterPickerActions.selectCharacter,
            { characterId: intent.optionId, slotId: intent.slotId },
          )
        }
      />
      <Show when={Boolean(props.clearLabel || props.nextLabel)}>
        {() => (
          <Group className={commandDeck ? "border-t border-(--ui-command-border) pt-3" : undefined}>
            <Show when={Boolean(props.clearLabel)}>
              {() => (
                <Button
                  className={commandDeck ? "rounded-none" : undefined}
                  onRequestPress={() => emit(characterPickerActions.clearCharacter)}
                  disabled={!props.selectedCharacterId || props.disabled || props.busy}
                >
                  {props.clearLabel}
                </Button>
              )}
            </Show>
            <Show when={Boolean(props.nextLabel)}>
              {() => (
                <Button
                  className={commandDeck ? "rounded-none" : undefined}
                  disabled={!props.selectedCharacterId || props.disabled || props.busy}
                  onRequestPress={() => emit(characterPickerActions.moveToGameSpecificPicker)}
                >
                  {props.nextLabel}
                </Button>
              )}
            </Show>
          </Group>
        )}
      </Show>
    </section>
  );
}

CharacterPicker.displayName = "CharacterPicker";
