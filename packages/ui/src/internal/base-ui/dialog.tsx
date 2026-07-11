import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentPropsWithRef } from "react";

import { cx } from "../../recipes/class-name";
import { popupRecipe } from "../../recipes/popup";
import { surfaceRecipe } from "../../recipes/surface";
import type { UiDensityMode, UiMaterialMode, UiShapeMode } from "../../tokens/type";

export const InternalDialogRoot = BaseDialog.Root;

export const InternalDialogTrigger = BaseDialog.Trigger;

export const InternalDialogPortal = BaseDialog.Portal;

export type InternalDialogBackdropProps = ComponentPropsWithRef<typeof BaseDialog.Backdrop>;

export function InternalDialogBackdrop(props: InternalDialogBackdropProps) {
  const { className, ref, ...backdropProps } = props;

  return (
    <BaseDialog.Backdrop
      {...backdropProps}
      className={cx("fixed inset-0 bg-black/30 backdrop-blur-[2px]", className)}
      ref={ref}
    />
  );
}

InternalDialogBackdrop.displayName = "InternalDialogBackdrop";

export type InternalDialogPopupProps = ComponentPropsWithRef<typeof BaseDialog.Popup> & {
  density?: UiDensityMode;
  material?: UiMaterialMode;
  shape?: UiShapeMode;
};

export function InternalDialogPopup(props: InternalDialogPopupProps) {
  const {
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
        "fixed left-1/2 top-1/2 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2",
        className,
      )}
      data-ui-portal
      ref={ref}
    />
  );
}

InternalDialogPopup.displayName = "InternalDialogPopup";

export const InternalDialogTitle = BaseDialog.Title;

export const InternalDialogDescription = BaseDialog.Description;

export const InternalDialogClose = BaseDialog.Close;
