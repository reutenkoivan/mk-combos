import { tv } from "tailwind-variants";

export const surfaceRecipe = tv({
  base: "text-[var(--ui-text)]",
  compoundVariants: [
    {
      class: "backdrop-blur-xl",
      material: "glass",
    },
    {
      class: "shadow-[var(--ui-shadow)]",
      material: "elevated",
    },
  ],
  defaultVariants: {
    density: "small",
    material: "opaque",
    placement: "block",
    shape: "fixed",
    tone: "neutral",
  },
  variants: {
    density: {
      medium: "p-4",
      mini: "p-2",
      small: "p-3",
    },
    material: {
      elevated: "border border-[var(--ui-separator)] bg-[var(--ui-content)]",
      glass: "border border-[var(--ui-separator)] bg-[var(--ui-glass)]",
      none: "bg-transparent",
      opaque: "bg-[var(--ui-content)]",
      separated: "bg-[var(--ui-inspector)]",
    },
    placement: {
      block: "",
      floating: "z-50",
      inline: "inline-flex",
      sidebar: "bg-[var(--ui-sidebar)]",
      toolbar: "bg-[var(--ui-toolbar)]",
    },
    shape: {
      capsule: "rounded-full",
      concentric: "rounded-[calc(var(--ui-radius-surface)-4px)]",
      fixed: "rounded-[var(--ui-radius-surface)]",
    },
    tone: {
      accent: "border-[var(--ui-accent)]",
      destructive: "border-[var(--ui-destructive-border)] bg-[var(--ui-destructive-soft)]",
      neutral: "",
      success: "border-[var(--ui-success-border)] bg-[var(--ui-success-soft)]",
      warning: "border-[var(--ui-warning-border)] bg-[var(--ui-warning-soft)]",
    },
  },
});
