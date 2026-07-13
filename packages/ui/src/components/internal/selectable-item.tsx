import type { CSSProperties, ReactNode } from "react";

import { cx } from "../../recipes/class-name";
import { itemRecipe } from "../../recipes/item";
import type { UiToneMode } from "../../tokens/type";
import { uiInteractionStates, uiSelectionStates, uiToneModes } from "../../tokens/value";

export type SelectableItemProps = {
  accessibleLabel?: string;
  busy?: boolean;
  children: ReactNode;
  className?: string;
  current?: boolean;
  disabled?: boolean;
  onRequestFocus?: () => void;
  onRequestPress?: () => void;
  selected?: boolean;
  style?: CSSProperties;
  tone?: UiToneMode;
  value: string;
};

export function SelectableItem(props: SelectableItemProps) {
  const disabled = Boolean(props.disabled || props.busy);
  const selection = props.selected
    ? uiSelectionStates.selected
    : props.current
      ? uiSelectionStates.current
      : uiSelectionStates.none;

  return (
    <button
      aria-busy={props.busy || undefined}
      aria-current={props.current || undefined}
      aria-label={props.accessibleLabel}
      aria-pressed={props.selected}
      className={cx(
        itemRecipe({
          interactive: !disabled,
          selection,
          state: props.busy
            ? uiInteractionStates.loading
            : disabled
              ? uiInteractionStates.disabled
              : props.selected
                ? uiInteractionStates.selected
                : uiInteractionStates.idle,
          tone: props.tone ?? uiToneModes.neutral,
        }),
        props.className,
      )}
      data-disabled={disabled ? "true" : undefined}
      data-loading={props.busy ? "true" : undefined}
      data-ui-selectable-item={props.value}
      disabled={disabled}
      onClick={() => props.onRequestPress?.()}
      onFocus={() => props.onRequestFocus?.()}
      style={props.style}
      type="button"
    >
      {props.children}
    </button>
  );
}

SelectableItem.displayName = "SelectableItem";
