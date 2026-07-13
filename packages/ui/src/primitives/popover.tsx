import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ReactNode } from "react";

import { useBaseUiOpenChangeHandler } from "../internal/base-ui/use-open-change-handler";
import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import { popupRecipe } from "../recipes/popup";
import type {
  UiControlPresentationMode,
  UiDensityMode,
  UiEmphasisMode,
  UiMaterialMode,
  UiShapeMode,
  UiToneMode,
} from "../tokens/type";
import {
  uiControlPresentationModes,
  uiDensityModes,
  uiEmphasisModes,
  uiMaterialModes,
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

export type PopoverRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  modal?: boolean | "trap-focus";
  onOpenChange?: (payload: UiPrimitiveOpenChangePayload) => void;
  open?: boolean;
  sourceFocusTarget?: string;
};

export function PopoverRoot(props: PopoverRootProps) {
  const { children, defaultOpen, modal = false, onOpenChange, open, sourceFocusTarget } = props;
  const handleOpenChange = useBaseUiOpenChangeHandler({ onOpenChange, sourceFocusTarget });

  return (
    <BasePopover.Root
      defaultOpen={defaultOpen}
      modal={modal}
      onOpenChange={handleOpenChange}
      open={open}
    >
      {children}
    </BasePopover.Root>
  );
}

PopoverRoot.displayName = "PopoverRoot";

export type PopoverTriggerProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function PopoverTrigger(props: PopoverTriggerProps) {
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
    <BasePopover.Trigger
      {...triggerProps}
      className={cx(controlRecipe({ appearance, density, emphasis, shape, tone }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-ui-popover-trigger
      disabled={disabled}
      ref={ref}
      type={type}
    >
      {children}
    </BasePopover.Trigger>
  );
}

PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverPortal = BasePopover.Portal;

export type PopoverPositionerProps = UiPrimitiveProps<HTMLDivElement> & {
  align?: UiFloatingAlignment;
  side?: UiFloatingSide;
  sideOffset?: number;
};

export function PopoverPositioner(props: PopoverPositionerProps) {
  const {
    align = uiFloatingAlignments.start,
    children,
    className,
    ref,
    side = uiFloatingSides.bottom,
    sideOffset = 8,
    ...positionerProps
  } = props;

  return (
    <BasePopover.Positioner
      {...positionerProps}
      align={align}
      className={cx("z-50", className)}
      data-ui-popover-positioner
      ref={ref}
      side={side}
      sideOffset={sideOffset}
    >
      {children}
    </BasePopover.Positioner>
  );
}

PopoverPositioner.displayName = "PopoverPositioner";

export type PopoverPopupProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
  material?: UiMaterialMode;
  shape?: UiShapeMode;
};

export function PopoverPopup(props: PopoverPopupProps) {
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
    <BasePopover.Popup
      {...popupProps}
      className={cx(popupRecipe({ density, material, shape }), className)}
      data-ui-popover-popup
      data-ui-portal
      ref={ref}
    >
      {children}
    </BasePopover.Popup>
  );
}

PopoverPopup.displayName = "PopoverPopup";

export type PopoverTitleProps = UiPrimitiveProps<HTMLHeadingElement>;

export function PopoverTitle(props: PopoverTitleProps) {
  const { children, className, ref, ...titleProps } = props;

  return (
    <BasePopover.Title
      {...titleProps}
      className={cx("text-sm font-semibold text-[var(--ui-text)]", className)}
      data-ui-popover-title
      ref={ref}
    >
      {children}
    </BasePopover.Title>
  );
}

PopoverTitle.displayName = "PopoverTitle";

export type PopoverDescriptionProps = UiPrimitiveProps<HTMLParagraphElement>;

export function PopoverDescription(props: PopoverDescriptionProps) {
  const { children, className, ref, ...descriptionProps } = props;

  return (
    <BasePopover.Description
      {...descriptionProps}
      className={cx("text-[13px] leading-snug text-[var(--ui-muted-text)]", className)}
      data-ui-popover-description
      ref={ref}
    >
      {children}
    </BasePopover.Description>
  );
}

PopoverDescription.displayName = "PopoverDescription";

export type PopoverCloseProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function PopoverClose(props: PopoverCloseProps) {
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
    ...closeProps
  } = props;

  return (
    <BasePopover.Close
      {...closeProps}
      className={cx(controlRecipe({ appearance, density, emphasis, shape, tone }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-ui-popover-close
      disabled={disabled}
      ref={ref}
      type={type}
    >
      {children}
    </BasePopover.Close>
  );
}

PopoverClose.displayName = "PopoverClose";
