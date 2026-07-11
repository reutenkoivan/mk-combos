import { tv } from "tailwind-variants";

export const separatorRecipe = tv({
  base: "shrink-0 bg-[var(--ui-separator)]",
  defaultVariants: {
    density: "small",
    orientation: "horizontal",
    tone: "neutral",
  },
  variants: {
    density: {
      medium: "",
      mini: "opacity-70",
      small: "",
    },
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
    tone: {
      accent: "bg-[var(--ui-accent)]",
      destructive: "bg-[var(--ui-destructive-border)]",
      neutral: "",
      success: "bg-[var(--ui-success-border)]",
      warning: "bg-[var(--ui-warning-border)]",
    },
  },
});
