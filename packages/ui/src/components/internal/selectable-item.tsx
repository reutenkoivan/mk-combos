import type { CSSProperties, ReactNode, Ref } from "react";

import { useUiRootContext } from "../../internal/ui-root-context";
import { cx } from "../../recipes/class-name";
import { itemRecipe } from "../../recipes/item";
import type { UiToneMode } from "../../tokens/type";
import { uiInteractionStates, uiSelectionStates, uiToneModes } from "../../tokens/value";

export type SelectableItemProps = {
  accessibleLabel?: string;
  busy?: boolean;
  children: ReactNode;
  className?: string;
  controllerFocused?: boolean;
  current?: boolean;
  disabled?: boolean;
  id?: string;
  onRequestFocus?: () => void;
  onRequestPress?: () => void;
  ref?: Ref<HTMLButtonElement>;
  selected?: boolean;
  style?: CSSProperties;
  tabIndex?: number;
  tone?: UiToneMode;
  value: string;
};

export function SelectableItem(props: SelectableItemProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const disabled = Boolean(props.disabled || props.busy);
  const controllerFocused = controllerFocusVisible && props.controllerFocused;
  const selection = props.selected
    ? uiSelectionStates.selected
    : props.current
      ? uiSelectionStates.current
      : uiSelectionStates.none;

  return (
    <button
      id={props.id}
      type="button"
      ref={props.ref}
      disabled={disabled}
      style={props.style}
      tabIndex={props.tabIndex}
      aria-pressed={props.selected}
      aria-busy={props.busy || undefined}
      aria-label={props.accessibleLabel}
      data-ui-selectable-item={props.value}
      onClick={() => props.onRequestPress?.()}
      onFocus={() => props.onRequestFocus?.()}
      aria-current={props.current || undefined}
      data-disabled={disabled ? "true" : undefined}
      data-loading={props.busy ? "true" : undefined}
      data-controller-focused={controllerFocused ? "true" : undefined}
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
    >
      {props.children}
    </button>
  );
}

SelectableItem.displayName = "SelectableItem";
