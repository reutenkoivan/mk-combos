export const controllerCapabilityStates = {
  awaitingGesture: "awaitingGesture",
  awaitingNeutral: "awaitingNeutral",
  blocked: "blocked",
  checking: "checking",
  disconnected: "disconnected",
  ready: "ready",
  suspended: "suspended",
  unsupported: "unsupported",
} as const;

export const controllerCapabilityReasons = {
  apiUnavailable: "apiUnavailable",
  controllerDisconnected: "controllerDisconnected",
  documentHidden: "documentHidden",
  gestureRequired: "gestureRequired",
  insecureContext: "insecureContext",
  neutralRequired: "neutralRequired",
  none: "none",
  permissionBlocked: "permissionBlocked",
} as const;
