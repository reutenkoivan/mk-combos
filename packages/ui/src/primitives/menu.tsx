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
      defaultOpen={defaultOpen}
      disabled={disabled}
      loopFocus={loopFocus}
      modal={modal}
      onOpenChange={handleOpenChange}
      open={open}
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
      className={cx(controlRecipe({ appearance, density, emphasis, shape, tone }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-ui-menu-trigger
      disabled={disabled}
      ref={ref}
      type={type}
    >
      {children}
    </BaseMenu.Trigger>
  );
}

MenuTrigger.displayName = "MenuTrigger";

export type MenuPortalProps = ComponentPropsWithRef<typeof BaseMenu.Portal>;

export function MenuPortal(props: MenuPortalProps) {
  const { className, ...portalProps } = props;
  const { contrast, density, responsiveMode, theme } = useUiRootContext();

  return (
    <BaseMenu.Portal
      {...portalProps}
      className={(state) =>
        cx(
          "mk-combos-ui-root mk-combos-ui-portal-root",
          typeof className === "function" ? className(state) : className,
        )
      }
      data-ui-contrast={contrast}
      data-ui-density={density}
      data-ui-portal="menu"
      data-ui-responsive={responsiveMode}
      data-ui-theme={theme}
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
      align={align}
      className={cx("z-50", className)}
      data-ui-menu-positioner
      ref={ref}
      side={side}
      sideOffset={sideOffset}
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
      className={cx("min-w-44", popupRecipe({ density, material, shape }), className)}
      data-ui-menu-popup
      ref={ref}
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
      className={cx("grid gap-1", className)}
      data-ui-menu-group
      ref={ref}
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
      className={cx("px-2 text-xs font-semibold text-[var(--ui-muted-text)]", className)}
      data-ui-menu-group-label
      ref={ref}
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
      closeOnClick={closeOnClick}
      data-disabled={disabled ? "true" : undefined}
      data-ui-menu-item={value}
      disabled={disabled}
      label={label}
      onClick={() => onRequestSelect?.({ reason: "itemPress", value })}
      ref={ref}
    >
      {children}
    </BaseMenu.Item>
  );
}

MenuItem.displayName = "MenuItem";
