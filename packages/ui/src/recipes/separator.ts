import { tv } from "tailwind-variants";

export const separatorRecipe = tv({
  base: "shrink-0 bg-(--ui-separator)",
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
      accent: "bg-(--ui-accent)",
      destructive: "bg-(--ui-destructive-border)",
      neutral: "",
      success: "bg-(--ui-success-border)",
      warning: "bg-(--ui-warning-border)",
    },
  },
});
