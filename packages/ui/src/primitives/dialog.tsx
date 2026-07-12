import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import { popupRecipe } from "../recipes/popup";
import { surfaceRecipe } from "../recipes/surface";
import type {
  UiDensityMode,
  UiEmphasisMode,
  UiMaterialMode,
  UiShapeMode,
  UiToneMode,
} from "../tokens/type";
import {
  mapBaseUiReason,
  type UiPrimitiveOpenChangePayload,
  type UiPrimitiveProps,
} from "./internal";

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

  return (
    <BaseDialog.Root
      defaultOpen={defaultOpen}
      disablePointerDismissal={disablePointerDismissal}
      modal={modal}
      onOpenChange={(nextOpen, eventDetails) => {
        onOpenChange?.({
          open: nextOpen,
          reason: mapBaseUiReason(eventDetails.reason),
          sourceFocusTarget,
        });
      }}
      open={open}
    >
      {children}
    </BaseDialog.Root>
  );
}

DialogRoot.displayName = "DialogRoot";

export type DialogTriggerProps = UiPrimitiveProps<HTMLButtonElement> & {
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function DialogTrigger(props: DialogTriggerProps) {
  const {
    children,
    className,
    density = "small",
    disabled = false,
    emphasis = "normal",
    ref,
    shape = "fixed",
    tone = "neutral",
    type = "button",
    ...triggerProps
  } = props;

  return (
    <BaseDialog.Trigger
      {...triggerProps}
      className={cx(controlRecipe({ density, emphasis, shape, tone }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-ui-dialog-trigger
      disabled={disabled}
      ref={ref}
      type={type}
    >
      {children}
    </BaseDialog.Trigger>
  );
}

DialogTrigger.displayName = "DialogTrigger";

export const DialogPortal = BaseDialog.Portal;

export type DialogBackdropProps = Omit<UiPrimitiveProps<HTMLDivElement>, "children">;

export function DialogBackdrop(props: DialogBackdropProps) {
  const { className, ref, ...backdropProps } = props;

  return (
    <BaseDialog.Backdrop
      {...backdropProps}
      className={cx("fixed inset-0 bg-black/30 backdrop-blur-[2px]", className)}
      data-ui-dialog-backdrop
      ref={ref}
    />
  );
}

DialogBackdrop.displayName = "DialogBackdrop";

export type DialogPopupProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
  material?: UiMaterialMode;
  shape?: UiShapeMode;
};

export function DialogPopup(props: DialogPopupProps) {
  const {
    children,
    className,
    density = "medium",
    material = "elevated",
    ref,
    shape = "fixed",
    ...popupProps
  } = props;

  return (
    <BaseDialog.Popup
      {...popupProps}
      className={cx(
        popupRecipe({ density, material, shape }),
        surfaceRecipe({ density, material, shape }),
        "fixed inset-x-4 top-4 grid max-h-[calc(100vh-2rem)] overflow-auto sm:left-1/2 sm:top-1/2 sm:w-[min(32rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2",
        className,
      )}
      data-ui-dialog-popup
      data-ui-portal
      ref={ref}
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
      className={cx("text-sm font-semibold text-[var(--ui-text)]", className)}
      data-ui-dialog-title
      ref={ref}
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
      className={cx("text-[13px] leading-snug text-[var(--ui-muted-text)]", className)}
      data-ui-dialog-description
      ref={ref}
    >
      {children}
    </BaseDialog.Description>
  );
}

DialogDescription.displayName = "DialogDescription";

export type DialogCloseProps = UiPrimitiveProps<HTMLButtonElement> & {
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function DialogClose(props: DialogCloseProps) {
  const {
    children,
    className,
    density = "small",
    disabled = false,
    emphasis = "normal",
    ref,
    shape = "fixed",
    tone = "neutral",
    type = "button",
    ...closeProps
  } = props;

  return (
    <BaseDialog.Close
      {...closeProps}
      className={cx(controlRecipe({ density, emphasis, shape, tone }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-ui-dialog-close
      disabled={disabled}
      ref={ref}
      type={type}
    >
      {children}
    </BaseDialog.Close>
  );
}

DialogClose.displayName = "DialogClose";
