export const uiThemeModes = ["light", "dark"] as const;

export const uiContrastModes = ["standard", "increased"] as const;

export const uiSemanticTokenNames = [
  "window",
  "content",
  "sidebar",
  "toolbar",
  "inspector",
  "popover",
  "menu",
  "dialog",
  "glass",
  "control",
  "control-hover",
  "control-active",
  "control-border",
  "field",
  "text",
  "muted-text",
  "placeholder",
  "separator",
  "highlight",
  "shadow",
  "selection",
  "selection-muted",
  "selection-text",
  "accent",
  "accent-strong",
  "accent-text",
  "destructive",
  "destructive-soft",
  "destructive-border",
  "success",
  "success-soft",
  "success-border",
  "warning",
  "warning-soft",
  "warning-border",
] as const;

export const uiSemanticTokens = {
  window: "--ui-window",
  content: "--ui-content",
  sidebar: "--ui-sidebar",
  toolbar: "--ui-toolbar",
  inspector: "--ui-inspector",
  popover: "--ui-popover",
  menu: "--ui-menu",
  dialog: "--ui-dialog",
  glass: "--ui-glass",
  control: "--ui-control",
  "control-hover": "--ui-control-hover",
  "control-active": "--ui-control-active",
  "control-border": "--ui-control-border",
  field: "--ui-field",
  text: "--ui-text",
  "muted-text": "--ui-muted-text",
  placeholder: "--ui-placeholder",
  separator: "--ui-separator",
  highlight: "--ui-highlight",
  shadow: "--ui-shadow",
  selection: "--ui-selection",
  "selection-muted": "--ui-selection-muted",
  "selection-text": "--ui-selection-text",
  accent: "--ui-accent",
  "accent-strong": "--ui-accent-strong",
  "accent-text": "--ui-accent-text",
  destructive: "--ui-destructive",
  "destructive-soft": "--ui-destructive-soft",
  "destructive-border": "--ui-destructive-border",
  success: "--ui-success",
  "success-soft": "--ui-success-soft",
  "success-border": "--ui-success-border",
  warning: "--ui-warning",
  "warning-soft": "--ui-warning-soft",
  "warning-border": "--ui-warning-border",
} as const satisfies Record<(typeof uiSemanticTokenNames)[number], `--ui-${string}`>;

export const uiDensityModes = ["mini", "small", "medium"] as const;

export const uiShapeModes = ["fixed", "capsule", "concentric"] as const;

export const uiMaterialModes = ["none", "opaque", "glass", "elevated", "separated"] as const;

export const uiToneModes = ["neutral", "accent", "destructive", "success", "warning"] as const;

export const uiEmphasisModes = ["subtle", "normal", "prominent"] as const;

export const uiInteractionStates = [
  "idle",
  "hover",
  "active",
  "focusVisible",
  "disabled",
  "selected",
  "open",
  "invalid",
  "loading",
] as const;

export const uiSelectionStates = ["none", "selected", "current", "mixed"] as const;

export const uiPlacementModes = ["inline", "block", "floating", "toolbar", "sidebar"] as const;
