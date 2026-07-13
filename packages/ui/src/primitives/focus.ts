export type UiFocusTarget = {
  id: string;
  selector?: string;
};

export type UiFocusTargetInput = string | UiFocusTarget;

export type UiFocusRestoreResult = {
  reason: UiFocusRestoreReason;
  restored: boolean;
  targetId: string;
};

export const createFocusTarget = (id: string, selector?: string): UiFocusTarget => ({
  id,
  selector,
});

const normalizeFocusTarget = (target: UiFocusTargetInput): UiFocusTarget =>
  typeof target === "string" ? { id: target } : target;

const escapeFocusTargetValue = (value: string) =>
  value.replace(/\\/gu, "\\\\").replace(/"/gu, '\\"');

export const getFocusTargetSelector = (target: UiFocusTargetInput) => {
  const normalizedTarget = normalizeFocusTarget(target);

  return (
    normalizedTarget.selector ??
    `[data-ui-focus-target="${escapeFocusTargetValue(normalizedTarget.id)}"]`
  );
};

export const getFocusTargetAttributes = (target: UiFocusTargetInput) => ({
  "data-ui-focus-target": normalizeFocusTarget(target).id,
});

export const findFocusTarget = (
  target: UiFocusTargetInput,
  root: Document | ParentNode | null | undefined = globalThis.document,
) => {
  if (!root) {
    return null;
  }

  const element = root.querySelector(getFocusTargetSelector(target));

  return element instanceof HTMLElement ? element : null;
};

const isDisabledFocusTarget = (element: HTMLElement) =>
  element.getAttribute("aria-disabled") === "true" ||
  element.getAttribute("data-disabled") === "true" ||
  ("disabled" in element && element.disabled === true);

export const restoreFocusTarget = (
  target: UiFocusTargetInput,
  root: Document | ParentNode | null | undefined = globalThis.document,
): UiFocusRestoreResult => {
  const normalizedTarget = normalizeFocusTarget(target);

  if (!root) {
    return {
      reason: uiFocusRestoreReasons.documentUnavailable,
      restored: false,
      targetId: normalizedTarget.id,
    };
  }

  const element = findFocusTarget(normalizedTarget, root);

  if (!element) {
    return {
      reason: uiFocusRestoreReasons.targetMissing,
      restored: false,
      targetId: normalizedTarget.id,
    };
  }

  if (isDisabledFocusTarget(element)) {
    return {
      reason: uiFocusRestoreReasons.targetDisabled,
      restored: false,
      targetId: normalizedTarget.id,
    };
  }

  element.focus();

  return {
    reason: uiFocusRestoreReasons.restored,
    restored: true,
    targetId: normalizedTarget.id,
  };
};
export const uiFocusRestoreReasons = {
  documentUnavailable: "documentUnavailable",
  restored: "restored",
  targetDisabled: "targetDisabled",
  targetMissing: "targetMissing",
} as const;

export type UiFocusRestoreReason =
  (typeof uiFocusRestoreReasons)[keyof typeof uiFocusRestoreReasons];
