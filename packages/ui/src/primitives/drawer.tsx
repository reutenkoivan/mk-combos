import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import type { ComponentPropsWithRef, ReactNode } from "react";

import { useBaseUiOpenChangeHandler } from "../internal/base-ui/use-open-change-handler";
import { useUiRootContext } from "../internal/ui-root-context";
import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import { popupRecipe } from "../recipes/popup";
import { surfaceRecipe } from "../recipes/surface";
import type {
  UiControlPresentationMode,
  UiDensityMode,
  UiEmphasisMode,
  UiMaterialMode,
  UiPlacementMode,
  UiShapeMode,
  UiToneMode,
} from "../tokens/type";
import {
  uiControlPresentationModes,
  uiDensityModes,
  uiEmphasisModes,
  uiMaterialModes,
  uiPlacementModes,
  uiShapeModes,
  uiToneModes,
} from "../tokens/value";
import type { UiPrimitiveOpenChangePayload, UiPrimitiveProps } from "./internal";

export const drawerSwipeDirections = {
  down: "down",
  left: "left",
  right: "right",
  up: "up",
} as const;

export type DrawerSwipeDirection =
  (typeof drawerSwipeDirections)[keyof typeof drawerSwipeDirections];

export type DrawerRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  disablePointerDismissal?: boolean;
  modal?: boolean | "trap-focus";
  onOpenChange?: (payload: UiPrimitiveOpenChangePayload) => void;
  open?: boolean;
  sourceFocusTarget?: string;
  swipeDirection?: DrawerSwipeDirection;
};

export function DrawerRoot(props: DrawerRootProps) {
  const {
    children,
    defaultOpen,
    disablePointerDismissal,
    modal = true,
    onOpenChange,
    open,
    sourceFocusTarget,
    swipeDirection = drawerSwipeDirections.down,
  } = props;
  const handleOpenChange = useBaseUiOpenChangeHandler({ onOpenChange, sourceFocusTarget });

  return (
    <BaseDrawer.Root
      defaultOpen={defaultOpen}
      disablePointerDismissal={disablePointerDismissal}
      modal={modal}
      onOpenChange={handleOpenChange}
      open={open}
      swipeDirection={swipeDirection}
    >
      {children}
    </BaseDrawer.Root>
  );
}

DrawerRoot.displayName = "DrawerRoot";

export type DrawerTriggerProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function DrawerTrigger(props: DrawerTriggerProps) {
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
    <BaseDrawer.Trigger
      {...triggerProps}
      className={cx(controlRecipe({ appearance, density, emphasis, shape, tone }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-ui-drawer-trigger
      disabled={disabled}
      ref={ref}
      type={type}
    >
      {children}
    </BaseDrawer.Trigger>
  );
}

DrawerTrigger.displayName = "DrawerTrigger";

export type DrawerPortalProps = ComponentPropsWithRef<typeof BaseDrawer.Portal>;

export function DrawerPortal(props: DrawerPortalProps) {
  const { className, ...portalProps } = props;
  const { contrast, density, responsiveMode, theme } = useUiRootContext();

  return (
    <BaseDrawer.Portal
      {...portalProps}
      className={(state) =>
        cx(
          "mk-combos-ui-root mk-combos-ui-portal-root",
          typeof className === "function" ? className(state) : className,
        )
      }
      data-ui-contrast={contrast}
      data-ui-density={density}
      data-ui-portal="drawer"
      data-ui-responsive={responsiveMode}
      data-ui-theme={theme}
    />
  );
}

DrawerPortal.displayName = "DrawerPortal";

export type DrawerBackdropProps = Omit<UiPrimitiveProps<HTMLDivElement>, "children">;

export function DrawerBackdrop(props: DrawerBackdropProps) {
  const { className, ref, ...backdropProps } = props;

  return (
    <BaseDrawer.Backdrop
      {...backdropProps}
      className={cx(
        "fixed inset-0 z-40 min-h-dvh bg-black/45 opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-300 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 motion-reduce:transition-none",
        className,
      )}
      data-ui-drawer-backdrop
      ref={ref}
    />
  );
}

DrawerBackdrop.displayName = "DrawerBackdrop";

export type DrawerViewportProps = UiPrimitiveProps<HTMLDivElement>;

export function DrawerViewport(props: DrawerViewportProps) {
  const { children, className, ref, ...viewportProps } = props;

  return (
    <BaseDrawer.Viewport
      {...viewportProps}
      className={cx("fixed inset-0 z-50 flex items-stretch", className)}
      data-ui-drawer-viewport
      ref={ref}
    >
      {children}
    </BaseDrawer.Viewport>
  );
}

DrawerViewport.displayName = "DrawerViewport";

export type DrawerPopupProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
  material?: UiMaterialMode;
  shape?: UiShapeMode;
};

export function DrawerPopup(props: DrawerPopupProps) {
  const {
    children,
    className,
    density = uiDensityModes.medium,
    material = uiMaterialModes.elevated,
    ref,
    shape = uiShapeModes.fixed,
    ...popupProps
  } = props;

  return (
    <BaseDrawer.Popup
      {...popupProps}
      className={cx(
        popupRecipe({ density, material, shape }),
        surfaceRecipe({ density, material, shape }),
        "overscroll-contain touch-auto outline-none transition-transform duration-300 ease-out data-swiping:select-none data-swiping:duration-0 motion-reduce:transition-none",
        className,
      )}
      data-ui-drawer-popup
      ref={ref}
    >
      {children}
    </BaseDrawer.Popup>
  );
}

DrawerPopup.displayName = "DrawerPopup";

export type DrawerContentProps = UiPrimitiveProps<HTMLDivElement>;

export function DrawerContent(props: DrawerContentProps) {
  const { children, className, ref, ...contentProps } = props;

  return (
    <BaseDrawer.Content
      {...contentProps}
      className={cx("grid min-w-0 gap-3", className)}
      data-ui-drawer-content
      ref={ref}
    >
      {children}
    </BaseDrawer.Content>
  );
}

DrawerContent.displayName = "DrawerContent";

export type DrawerTitleProps = UiPrimitiveProps<HTMLHeadingElement>;

export function DrawerTitle(props: DrawerTitleProps) {
  const { children, className, ref, ...titleProps } = props;

  return (
    <BaseDrawer.Title
      {...titleProps}
      className={cx(
        "font-(--ui-font-display) text-base font-semibold tracking-[-0.01em]",
        className,
      )}
      data-ui-drawer-title
      ref={ref}
    >
      {children}
    </BaseDrawer.Title>
  );
}

DrawerTitle.displayName = "DrawerTitle";

export type DrawerDescriptionProps = UiPrimitiveProps<HTMLParagraphElement>;

export function DrawerDescription(props: DrawerDescriptionProps) {
  const { children, className, ref, ...descriptionProps } = props;

  return (
    <BaseDrawer.Description
      {...descriptionProps}
      className={cx("text-[13px] leading-snug text-(--ui-muted-text)", className)}
      data-ui-drawer-description
      ref={ref}
    >
      {children}
    </BaseDrawer.Description>
  );
}

DrawerDescription.displayName = "DrawerDescription";

export type DrawerClosePressPayload = {
  reason: "press";
  sourceFocusTarget?: string;
};

export type DrawerCloseProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  onRequestPress?: (payload: DrawerClosePressPayload) => void;
  placement?: UiPlacementMode;
  shape?: UiShapeMode;
  sourceFocusTarget?: string;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function DrawerClose(props: DrawerCloseProps) {
  const {
    appearance = uiControlPresentationModes.filled,
    children,
    className,
    density = uiDensityModes.small,
    disabled = false,
    emphasis = uiEmphasisModes.normal,
    onRequestPress,
    placement = uiPlacementModes.inline,
    ref,
    shape = uiShapeModes.fixed,
    sourceFocusTarget,
    tone = uiToneModes.neutral,
    type = "button",
    ...closeProps
  } = props;

  return (
    <BaseDrawer.Close
      {...closeProps}
      className={cx(
        controlRecipe({ appearance, density, emphasis, placement, shape, tone }),
        className,
      )}
      data-disabled={disabled ? "true" : undefined}
      data-ui-drawer-close
      disabled={disabled}
      onClick={() => onRequestPress?.({ reason: "press", sourceFocusTarget })}
      ref={ref}
      type={type}
    >
      {children}
    </BaseDrawer.Close>
  );
}

DrawerClose.displayName = "DrawerClose";
