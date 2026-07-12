import type { AriaRole, ReactNode, Ref } from "react";

export type UiPrimitiveInteractionReason =
  | "none"
  | "triggerPress"
  | "triggerHover"
  | "triggerFocus"
  | "outsidePress"
  | "itemPress"
  | "closePress"
  | "focusOut"
  | "escapeKey"
  | "listNavigation"
  | "imperativeAction";

const baseUiReasonMap: Record<string, UiPrimitiveInteractionReason> = {
  "close-press": "closePress",
  "escape-key": "escapeKey",
  "focus-out": "focusOut",
  "imperative-action": "imperativeAction",
  "item-press": "itemPress",
  "list-navigation": "listNavigation",
  none: "none",
  "outside-press": "outsidePress",
  "trigger-focus": "triggerFocus",
  "trigger-hover": "triggerHover",
  "trigger-press": "triggerPress",
};

export const mapBaseUiReason = (reason: string | undefined): UiPrimitiveInteractionReason => {
  if (!reason) {
    return "none";
  }

  return baseUiReasonMap[reason] ?? "none";
};

type UiPrimitiveDataAttributes = {
  [Key in `data-${string}`]?: string | number | boolean | undefined;
};

type UiPrimitiveAriaProps = {
  "aria-busy"?: boolean | "false" | "true";
  "aria-controls"?: string;
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

export type UiPrimitiveOpenChangePayload = {
  open: boolean;
  reason: UiPrimitiveInteractionReason;
  sourceFocusTarget?: string;
};

export type UiPrimitiveValueChangePayload<Value extends string> = {
  reason: UiPrimitiveInteractionReason;
  value: Value;
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
