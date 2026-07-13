export const uiFloatingSides = {
  bottom: "bottom",
  left: "left",
  right: "right",
  top: "top",
} as const;

export type UiFloatingSide = (typeof uiFloatingSides)[keyof typeof uiFloatingSides];

export const uiFloatingAlignments = {
  center: "center",
  end: "end",
  start: "start",
} as const;

export type UiFloatingAlignment = (typeof uiFloatingAlignments)[keyof typeof uiFloatingAlignments];
