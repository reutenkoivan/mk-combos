import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentPropsWithRef, ReactNode } from "react";

import { useBaseUiOpenChangeHandler } from "../internal/base-ui/use-open-change-handler";
import { useUiRootContext } from "../internal/ui-root-context";
import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import { itemRecipe } from "../recipes/item";
import { popupRecipe } from "../recipes/popup";
import type {
  UiControlPresentationMode,
  UiDensityMode,
  UiEmphasisMode,
  UiMaterialMode,
  UiSelectionState,
  UiShapeMode,
  UiToneMode,
} from "../tokens/type";
import {
  uiControlPresentationModes,
  uiDensityModes,
  uiEmphasisModes,
  uiInteractionStates,
  uiMaterialModes,
  uiSelectionStates,
  uiShapeModes,
  uiToneModes,
} from "../tokens/value";
import type { UiPrimitiveOpenChangePayload, UiPrimitiveProps } from "./internal";
import {
  type UiFloatingAlignment,
  type UiFloatingSide,
  uiFloatingAlignments,
  uiFloatingSides,
} from "./positioning";

export type MenuRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  loopFocus?: boolean;
  modal?: boolean;
  onOpenChange?: (payload: UiPrimitiveOpenChangePayload) => void;
  open?: boolean;
  sourceFocusTarget?: string;
};

export function MenuRoot(props: MenuRootProps) {
  const {
    children,
    defaultOpen,
    disabled = false,
    loopFocus = true,
    modal = false,
    onOpenChange,
    open,
    sourceFocusTarget,
  } = props;
  const handleOpenChange = useBaseUiOpenChangeHandler({ onOpenChange, sourceFocusTarget });

  return (
    <BaseMenu.Root
      open={open}
      modal={modal}
      disabled={disabled}
      loopFocus={loopFocus}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
    >
      {children}
    </BaseMenu.Root>
  );
}

MenuRoot.displayName = "MenuRoot";

export type MenuTriggerProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function MenuTrigger(props: MenuTriggerProps) {
  const {
    appearance = uiControlPresentationModes.filled,
    children,
    className,
    density = uiDensityModes.small,
    disabled = false,
    emphasis = uiEmphasisModes.normal,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    type = "button",
    ...triggerProps
  } = props;

  return (
    <BaseMenu.Trigger
      {...triggerProps}
      ref={ref}
      type={type}
      disabled={disabled}
      data-ui-menu-trigger
      data-disabled={disabled ? "true" : undefined}
      className={cx(controlRecipe({ appearance, density, emphasis, shape, tone }), className)}
    >
      {children}
    </BaseMenu.Trigger>
  );
}

MenuTrigger.displayName = "MenuTrigger";

export type MenuPortalProps = ComponentPropsWithRef<typeof BaseMenu.Portal>;

export function MenuPortal(props: MenuPortalProps) {
  const { className, ...portalProps } = props;
  const { contrast, controllerFocusVisible, density, responsiveMode, theme } = useUiRootContext();

  return (
    <BaseMenu.Portal
      {...portalProps}
      data-ui-portal="menu"
      data-ui-theme={theme}
      data-ui-density={density}
      data-ui-contrast={contrast}
      data-ui-responsive={responsiveMode}
      data-ui-controller-focus-visible={controllerFocusVisible ? "true" : "false"}
      className={(state) =>
        cx(
          "mk-combos-ui-root mk-combos-ui-portal-root",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}

MenuPortal.displayName = "MenuPortal";

export type MenuPositionerProps = UiPrimitiveProps<HTMLDivElement> & {
  align?: UiFloatingAlignment;
  side?: UiFloatingSide;
  sideOffset?: number;
};

export function MenuPositioner(props: MenuPositionerProps) {
  const {
    align = uiFloatingAlignments.end,
    children,
    className,
    ref,
    side = uiFloatingSides.bottom,
    sideOffset = 8,
    ...positionerProps
  } = props;

  return (
    <BaseMenu.Positioner
      {...positionerProps}
      ref={ref}
      side={side}
      align={align}
      data-ui-menu-positioner
      sideOffset={sideOffset}
      className={cx("z-50", className)}
    >
      {children}
    </BaseMenu.Positioner>
  );
}

MenuPositioner.displayName = "MenuPositioner";

export type MenuPopupProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
  material?: UiMaterialMode;
  shape?: UiShapeMode;
};

export function MenuPopup(props: MenuPopupProps) {
  const {
    children,
    className,
    density = uiDensityModes.small,
    material = uiMaterialModes.elevated,
    ref,
    shape = uiShapeModes.fixed,
    ...popupProps
  } = props;

  return (
    <BaseMenu.Popup
      {...popupProps}
      ref={ref}
      data-ui-menu-popup
      className={cx("min-w-44", popupRecipe({ density, material, shape }), className)}
    >
      {children}
    </BaseMenu.Popup>
  );
}

MenuPopup.displayName = "MenuPopup";

export type MenuGroupProps = UiPrimitiveProps<HTMLDivElement>;

export function MenuGroup(props: MenuGroupProps) {
  const { children, className, ref, ...groupProps } = props;

  return (
    <BaseMenu.Group
      {...groupProps}
      ref={ref}
      data-ui-menu-group
      className={cx("grid gap-1", className)}
    >
      {children}
    </BaseMenu.Group>
  );
}

MenuGroup.displayName = "MenuGroup";

export type MenuGroupLabelProps = UiPrimitiveProps<HTMLDivElement>;

export function MenuGroupLabel(props: MenuGroupLabelProps) {
  const { children, className, ref, ...labelProps } = props;

  return (
    <BaseMenu.GroupLabel
      {...labelProps}
      ref={ref}
      data-ui-menu-group-label
      className={cx("px-2 text-xs font-semibold text-(--ui-muted-text)", className)}
    >
      {children}
    </BaseMenu.GroupLabel>
  );
}

MenuGroupLabel.displayName = "MenuGroupLabel";

export type MenuItemSelectPayload<Value extends string> = {
  reason: "itemPress";
  value: Value;
};

export type MenuItemProps<Value extends string = string> = UiPrimitiveProps<HTMLElement> & {
  closeOnClick?: boolean;
  density?: UiDensityMode;
  disabled?: boolean;
  label?: string;
  onRequestSelect?: (payload: MenuItemSelectPayload<Value>) => void;
  selection?: UiSelectionState;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  value: Value;
};

export function MenuItem<Value extends string = string>(props: MenuItemProps<Value>) {
  const {
    children,
    className,
    closeOnClick = true,
    density = uiDensityModes.small,
    disabled = false,
    label,
    onRequestSelect,
    ref,
    selection = uiSelectionStates.none,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    value,
    ...itemProps
  } = props;

  return (
    <BaseMenu.Item
      {...itemProps}
      ref={ref}
      label={label}
      disabled={disabled}
      data-ui-menu-item={value}
      closeOnClick={closeOnClick}
      data-disabled={disabled ? "true" : undefined}
      onClick={() => onRequestSelect?.({ reason: "itemPress", value })}
      className={cx(
        itemRecipe({
          density,
          interactive: !disabled,
          selection,
          shape,
          state: disabled
            ? uiInteractionStates.disabled
            : selection === uiSelectionStates.selected
              ? uiInteractionStates.selected
              : uiInteractionStates.idle,
          tone,
        }),
        className,
      )}
    >
      {children}
    </BaseMenu.Item>
  );
}

MenuItem.displayName = "MenuItem";
