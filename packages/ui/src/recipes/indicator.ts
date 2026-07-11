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
      active: "bg-[var(--ui-control-active)]",
      disabled: "opacity-50",
      focusVisible: "shadow-[var(--ui-focus-ring)]",
      hover: "bg-[var(--ui-control-hover)]",
      idle: "",
      invalid: "border-[var(--ui-destructive-border)] bg-[var(--ui-destructive-soft)]",
      loading: "opacity-80",
      open: "bg-[var(--ui-control-active)]",
      selected: "border-[var(--ui-selection)] bg-[var(--ui-selection-muted)]",
    },
    tone: {
      accent:
        "border-[var(--ui-accent)] bg-[var(--ui-selection-muted)] text-[var(--ui-accent-strong)]",
      destructive:
        "border-[var(--ui-destructive-border)] bg-[var(--ui-destructive-soft)] text-[var(--ui-destructive)]",
      neutral: "border-[var(--ui-control-border)] bg-[var(--ui-control)] text-[var(--ui-text)]",
      success:
        "border-[var(--ui-success-border)] bg-[var(--ui-success-soft)] text-[var(--ui-success)]",
      warning:
        "border-[var(--ui-warning-border)] bg-[var(--ui-warning-soft)] text-[var(--ui-warning)]",
    },
  },
});
