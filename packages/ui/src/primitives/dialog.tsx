import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentPropsWithRef, ReactNode } from "react";

import type { UiResponsiveMode } from "../components/type";
import { uiResponsiveModes } from "../components/value";
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

export type DialogRootProps = {
  children?: ReactNode;
  defaultOpen?: boolean;
  disablePointerDismissal?: boolean;
  modal?: boolean | "trap-focus";
  onOpenChange?: (payload: UiPrimitiveOpenChangePayload) => void;
  open?: boolean;
  sourceFocusTarget?: string;
};

export function DialogRoot(props: DialogRootProps) {
  const {
    children,
    defaultOpen,
    disablePointerDismissal,
    modal = true,
    onOpenChange,
    open,
    sourceFocusTarget,
  } = props;
  const handleOpenChange = useBaseUiOpenChangeHandler({ onOpenChange, sourceFocusTarget });

  return (
    <BaseDialog.Root
      open={open}
      modal={modal}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      disablePointerDismissal={disablePointerDismissal}
    >
      {children}
    </BaseDialog.Root>
  );
}

DialogRoot.displayName = "DialogRoot";

export type DialogTriggerProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function DialogTrigger(props: DialogTriggerProps) {
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
    <BaseDialog.Trigger
      {...triggerProps}
      ref={ref}
      type={type}
      disabled={disabled}
      data-ui-dialog-trigger
      data-disabled={disabled ? "true" : undefined}
      className={cx(controlRecipe({ appearance, density, emphasis, shape, tone }), className)}
    >
      {children}
    </BaseDialog.Trigger>
  );
}

DialogTrigger.displayName = "DialogTrigger";

export type DialogPortalProps = ComponentPropsWithRef<typeof BaseDialog.Portal>;

export function DialogPortal(props: DialogPortalProps) {
  const { className, ...portalProps } = props;
  const { contrast, controllerFocusVisible, density, responsiveMode, theme } = useUiRootContext();

  return (
    <BaseDialog.Portal
      {...portalProps}
      data-ui-theme={theme}
      data-ui-portal="dialog"
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

DialogPortal.displayName = "DialogPortal";

export type DialogBackdropProps = Omit<UiPrimitiveProps<HTMLDivElement>, "children">;

export function DialogBackdrop(props: DialogBackdropProps) {
  const { className, ref, ...backdropProps } = props;

  return (
    <BaseDialog.Backdrop
      {...backdropProps}
      ref={ref}
      data-ui-dialog-backdrop
      className={cx(
        "fixed inset-0 z-40 bg-black/40 backdrop-blur-[3px] transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
    />
  );
}

DialogBackdrop.displayName = "DialogBackdrop";

const dialogViewportClasses = {
  [uiResponsiveModes.desktop]:
    "place-items-center pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]",
  [uiResponsiveModes.mobile]:
    "items-end justify-items-stretch pt-[max(1rem,env(safe-area-inset-top))]",
  [uiResponsiveModes.tablet]:
    "items-end justify-items-center pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]",
} as const satisfies Record<UiResponsiveMode, string>;

export type DialogViewportProps = UiPrimitiveProps<HTMLDivElement>;

export function DialogViewport(props: DialogViewportProps) {
  const { children, className, ref, ...viewportProps } = props;
  const { responsiveMode } = useUiRootContext();

  return (
    <BaseDialog.Viewport
      {...viewportProps}
      ref={ref}
      data-ui-dialog-viewport
      data-ui-dialog-placement={responsiveMode}
      className={cx(
        "pointer-events-none fixed inset-0 z-50 grid min-h-dvh w-full overflow-hidden overscroll-contain",
        dialogViewportClasses[responsiveMode],
        className,
      )}
    >
      {children}
    </BaseDialog.Viewport>
  );
}

DialogViewport.displayName = "DialogViewport";

const dialogPopupClasses = {
  [uiResponsiveModes.desktop]:
    "w-[min(34rem,calc(100vw-2rem))] rounded-(--ui-radius-surface) p-4 data-ending-style:scale-[0.98] data-starting-style:scale-[0.98]",
  [uiResponsiveModes.mobile]:
    "w-full rounded-b-none rounded-t-(--ui-radius-surface) p-4 pb-[max(1rem,env(safe-area-inset-bottom))] data-ending-style:translate-y-4 data-starting-style:translate-y-4",
  [uiResponsiveModes.tablet]:
    "w-full max-w-[42rem] rounded-b-none rounded-t-(--ui-radius-surface) p-4 pb-[max(1rem,env(safe-area-inset-bottom))] data-ending-style:translate-y-4 data-starting-style:translate-y-4",
} as const satisfies Record<UiResponsiveMode, string>;

export type DialogPopupProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
  finalFocus?: ComponentPropsWithRef<typeof BaseDialog.Popup>["finalFocus"];
  material?: UiMaterialMode;
  shape?: UiShapeMode;
};

export function DialogPopup(props: DialogPopupProps) {
  const {
    children,
    className,
    density = uiDensityModes.medium,
    finalFocus,
    material = uiMaterialModes.elevated,
    ref,
    shape = uiShapeModes.fixed,
    ...popupProps
  } = props;
  const { responsiveMode } = useUiRootContext();

  return (
    <BaseDialog.Popup
      {...popupProps}
      ref={ref}
      finalFocus={finalFocus}
      data-ui-dialog-popup
      data-ui-dialog-placement={responsiveMode}
      className={cx(
        popupRecipe({ density, material, shape }),
        surfaceRecipe({ density, material, shape }),
        "pointer-events-auto relative grid max-h-[88dvh] min-h-0 overflow-auto overscroll-contain bg-(--ui-dialog) transition-[opacity,transform] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        dialogPopupClasses[responsiveMode],
        className,
      )}
    >
      {children}
    </BaseDialog.Popup>
  );
}

DialogPopup.displayName = "DialogPopup";

export type DialogTitleProps = UiPrimitiveProps<HTMLHeadingElement>;

export function DialogTitle(props: DialogTitleProps) {
  const { children, className, ref, ...titleProps } = props;

  return (
    <BaseDialog.Title
      {...titleProps}
      ref={ref}
      data-ui-dialog-title
      className={cx("text-base font-semibold tracking-[-0.01em] text-(--ui-text)", className)}
    >
      {children}
    </BaseDialog.Title>
  );
}

DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = UiPrimitiveProps<HTMLParagraphElement>;

export function DialogDescription(props: DialogDescriptionProps) {
  const { children, className, ref, ...descriptionProps } = props;

  return (
    <BaseDialog.Description
      {...descriptionProps}
      ref={ref}
      data-ui-dialog-description
      className={cx("text-sm leading-relaxed text-(--ui-muted-text)", className)}
    >
      {children}
    </BaseDialog.Description>
  );
}

DialogDescription.displayName = "DialogDescription";

export type DialogCloseProps = UiPrimitiveProps<HTMLButtonElement> & {
  appearance?: UiControlPresentationMode;
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function DialogClose(props: DialogCloseProps) {
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
    <BaseDialog.Close
      {...closeProps}
      ref={ref}
      type={type}
      disabled={disabled}
      data-ui-dialog-close
      data-disabled={disabled ? "true" : undefined}
      className={cx(controlRecipe({ appearance, density, emphasis, shape, tone }), className)}
    >
      {children}
    </BaseDialog.Close>
  );
}

DialogClose.displayName = "DialogClose";
