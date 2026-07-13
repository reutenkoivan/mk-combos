import type { AriaRole, ReactNode, Ref } from "react";
import { z } from "zod/v4";

import { type UiPrimitiveInteractionReason, uiPrimitiveInteractionReasons } from "./interaction";

export type {
  UiPrimitiveInteractionReason,
  UiPrimitiveOpenChangePayload,
  UiPrimitiveValueChangePayload,
} from "./interaction";

const baseUiReasonMap: Record<string, UiPrimitiveInteractionReason> = {
  "close-press": uiPrimitiveInteractionReasons.closePress,
  "close-watcher": uiPrimitiveInteractionReasons.closeWatcher,
  "escape-key": uiPrimitiveInteractionReasons.escapeKey,
  "focus-out": uiPrimitiveInteractionReasons.focusOut,
  "imperative-action": uiPrimitiveInteractionReasons.imperativeAction,
  "item-press": uiPrimitiveInteractionReasons.itemPress,
  "list-navigation": uiPrimitiveInteractionReasons.listNavigation,
  none: uiPrimitiveInteractionReasons.none,
  "outside-press": uiPrimitiveInteractionReasons.outsidePress,
  "trigger-focus": uiPrimitiveInteractionReasons.triggerFocus,
  "trigger-hover": uiPrimitiveInteractionReasons.triggerHover,
  "trigger-press": uiPrimitiveInteractionReasons.triggerPress,
  swipe: uiPrimitiveInteractionReasons.swipe,
};

const BaseUiReasonSchema = z
  .string()
  .optional()
  .transform<UiPrimitiveInteractionReason>((reason) =>
    reason
      ? (baseUiReasonMap[reason] ?? uiPrimitiveInteractionReasons.none)
      : uiPrimitiveInteractionReasons.none,
  );

export const mapBaseUiReason = (reason: string | undefined): UiPrimitiveInteractionReason =>
  BaseUiReasonSchema.parse(reason);

type UiPrimitiveDataAttributes = {
  [Key in `data-${string}`]?: string | number | boolean | undefined;
};

type UiPrimitiveAriaProps = {
  "aria-busy"?: boolean | "false" | "true";
  "aria-controls"?: string;
  "aria-current"?: "date" | "false" | "location" | "page" | "step" | "time" | "true";
  "aria-describedby"?: string;
  "aria-expanded"?: boolean | "false" | "true";
  "aria-invalid"?: boolean | "false" | "grammar" | "spelling" | "true";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-live"?: "assertive" | "off" | "polite";
  id?: string;
  role?: AriaRole;
};

export type UiPrimitiveProps<Element extends HTMLElement> = UiPrimitiveAriaProps &
  UiPrimitiveDataAttributes & {
    children?: ReactNode;
    className?: string;
    ref?: Ref<Element>;
  };

export const densityGapClasses = {
  medium: "gap-3",
  mini: "gap-1",
  small: "gap-2",
} as const;

export const alignClasses = {
  center: "items-center",
  end: "items-end",
  start: "items-start",
  stretch: "items-stretch",
} as const;

export const justifyClasses = {
  between: "justify-between",
  center: "justify-center",
  end: "justify-end",
  start: "justify-start",
} as const;
