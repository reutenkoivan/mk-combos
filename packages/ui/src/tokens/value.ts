export const uiThemeModes = {
  dark: "dark",
  light: "light",
} as const;

export const uiContrastModes = {
  increased: "increased",
  standard: "standard",
} as const;

export const uiSemanticTokenNames = {
  accent: "accent",
  "accent-strong": "accent-strong",
  "accent-text": "accent-text",
  content: "content",
  control: "control",
  "control-active": "control-active",
  "control-border": "control-border",
  "control-hover": "control-hover",
  destructive: "destructive",
  "destructive-border": "destructive-border",
  "destructive-soft": "destructive-soft",
  dialog: "dialog",
  field: "field",
  glass: "glass",
  highlight: "highlight",
  inspector: "inspector",
  menu: "menu",
  "muted-text": "muted-text",
  placeholder: "placeholder",
  popover: "popover",
  selection: "selection",
  "selection-muted": "selection-muted",
  "selection-text": "selection-text",
  separator: "separator",
  shadow: "shadow",
  sidebar: "sidebar",
  success: "success",
  "success-border": "success-border",
  "success-soft": "success-soft",
  text: "text",
  toolbar: "toolbar",
  warning: "warning",
  "warning-border": "warning-border",
  "warning-soft": "warning-soft",
  window: "window",
} as const;

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
} as const satisfies Record<
  (typeof uiSemanticTokenNames)[keyof typeof uiSemanticTokenNames],
  `--ui-${string}`
>;

export const uiDensityModes = {
  medium: "medium",
  mini: "mini",
  small: "small",
} as const;

export const uiShapeModes = {
  capsule: "capsule",
  concentric: "concentric",
  fixed: "fixed",
} as const;

export const uiMaterialModes = {
  elevated: "elevated",
  glass: "glass",
  none: "none",
  opaque: "opaque",
  separated: "separated",
} as const;

export const uiToneModes = {
  accent: "accent",
  destructive: "destructive",
  neutral: "neutral",
  success: "success",
  warning: "warning",
} as const;

export const uiEmphasisModes = {
  normal: "normal",
  prominent: "prominent",
  subtle: "subtle",
} as const;

export const uiControlPresentationModes = {
  filled: "filled",
  icon: "icon",
} as const;

export const uiInteractionStates = {
  active: "active",
  disabled: "disabled",
  focusVisible: "focusVisible",
  hover: "hover",
  idle: "idle",
  invalid: "invalid",
  loading: "loading",
  open: "open",
  selected: "selected",
} as const;

export const uiSelectionStates = {
  current: "current",
  mixed: "mixed",
  none: "none",
  selected: "selected",
} as const;

export const uiPlacementModes = {
  block: "block",
  floating: "floating",
  inline: "inline",
  sidebar: "sidebar",
  toolbar: "toolbar",
} as const;
