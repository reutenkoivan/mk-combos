export const uiPrimitiveInteractionReasons = {
  closePress: "closePress",
  closeWatcher: "closeWatcher",
  escapeKey: "escapeKey",
  focusOut: "focusOut",
  imperativeAction: "imperativeAction",
  itemPress: "itemPress",
  listNavigation: "listNavigation",
  none: "none",
  outsidePress: "outsidePress",
  swipe: "swipe",
  triggerFocus: "triggerFocus",
  triggerHover: "triggerHover",
  triggerPress: "triggerPress",
} as const;

export type UiPrimitiveInteractionReason =
  (typeof uiPrimitiveInteractionReasons)[keyof typeof uiPrimitiveInteractionReasons];

export type UiPrimitiveOpenChangePayload = {
  open: boolean;
  reason: UiPrimitiveInteractionReason;
  sourceFocusTarget?: string;
};

export type UiPrimitiveValueChangePayload<Value extends string> = {
  reason: UiPrimitiveInteractionReason;
  value: Value;
};
