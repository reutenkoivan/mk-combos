import { tv } from "tailwind-variants";

export const indicatorRecipe = tv({
  base: "inline-flex shrink-0 items-center justify-center border font-medium leading-none",
  defaultVariants: {
    density: "small",
    shape: "fixed",
    state: "idle",
    tone: "neutral",
  },
  variants: {
    density: {
      medium: "h-6 min-w-6 px-1.5 text-[13px]",
      mini: "h-5 min-w-5 px-1 text-xs",
      small: "h-5.5 min-w-5.5 px-1.5 text-xs",
    },
    shape: {
      capsule: "rounded-full",
      concentric: "rounded-[calc(var(--ui-radius-control)-3px)]",
      fixed: "rounded-md",
    },
    state: {
      active: "bg-(--ui-control-active)",
      disabled: "opacity-50",
      focusVisible: "shadow-(--ui-focus-ring)",
      hover: "bg-(--ui-control-hover)",
      idle: "",
      invalid: "border-(--ui-destructive-border) bg-(--ui-destructive-soft)",
      loading: "opacity-80",
      open: "bg-(--ui-control-active)",
      selected: "border-(--ui-selection) bg-(--ui-selection-muted)",
    },
    tone: {
      accent: "border-(--ui-accent) bg-(--ui-selection-muted) text-(--ui-accent-strong)",
      destructive:
        "border-(--ui-destructive-border) bg-(--ui-destructive-soft) text-(--ui-destructive)",
      neutral: "border-(--ui-control-border) bg-(--ui-control) text-(--ui-text)",
      success: "border-(--ui-success-border) bg-(--ui-success-soft) text-(--ui-success)",
      warning: "border-(--ui-warning-border) bg-(--ui-warning-soft) text-(--ui-warning)",
    },
  },
});
