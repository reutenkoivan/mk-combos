import { uiPrimitiveInteractionReasons } from "../primitives/interaction";

export const componentInteractionReasons = {
  ...uiPrimitiveInteractionReasons,
  press: "press",
} as const;

export const uiResponsiveModes = {
  desktop: "desktop",
  mobile: "mobile",
  tablet: "tablet",
} as const;

export const componentOptionStatuses = {
  available: "available",
  disabledUnavailable: "disabledUnavailable",
} as const;

export const backupDisclosureStates = {
  collapsed: "collapsed",
  expanded: "expanded",
} as const;

export const backupPersistenceModes = {
  persistent: "persistent",
  sessionOnly: "sessionOnly",
  unavailable: "unavailable",
} as const;

export const backupOperationStates = {
  exporting: "exporting",
  idle: "idle",
  importComplete: "importComplete",
  importFilePicker: "importFilePicker",
  importInvalid: "importInvalid",
  importPreview: "importPreview",
  importValidating: "importValidating",
  replaceBusy: "replaceBusy",
  replaceConfirm: "replaceConfirm",
} as const;

export const backupSliceStatuses = {
  invalid: "invalid",
  missing: "missing",
  ready: "ready",
  unsupported: "unsupported",
} as const;

export const backupValidationStatuses = {
  invalid: "invalid",
  none: "none",
  valid: "valid",
  warning: "warning",
} as const;

export const backupValidationMessageTones = {
  destructive: "destructive",
  neutral: "neutral",
  warning: "warning",
} as const;

export const controllerAccessStates = {
  awaitingGesture: "awaitingGesture",
  awaitingNeutral: "awaitingNeutral",
  blocked: "blocked",
  checking: "checking",
  disconnected: "disconnected",
  ready: "ready",
  suspended: "suspended",
  unsupported: "unsupported",
} as const;
