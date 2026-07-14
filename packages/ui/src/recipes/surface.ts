import { tv } from "tailwind-variants";

export const surfaceRecipe = tv({
  base: "text-(--ui-text)",
  compoundVariants: [
    {
      class: "backdrop-blur-xl",
      material: "glass",
    },
    {
      class: "shadow-(--ui-shadow)",
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
      elevated: "border border-(--ui-separator) bg-(--ui-content)",
      glass: "border border-(--ui-separator) bg-(--ui-glass)",
      none: "bg-transparent",
      opaque: "bg-(--ui-content)",
      separated: "bg-(--ui-inspector)",
    },
    placement: {
      block: "",
      floating: "z-50",
      inline: "inline-flex",
      sidebar: "bg-(--ui-sidebar)",
      toolbar: "bg-(--ui-toolbar)",
    },
    shape: {
      capsule: "rounded-full",
      concentric: "rounded-[calc(var(--ui-radius-surface)-4px)]",
      fixed: "rounded-(--ui-radius-surface)",
    },
    tone: {
      accent: "border-(--ui-accent)",
      destructive: "border-(--ui-destructive-border) bg-(--ui-destructive-soft)",
      neutral: "",
      success: "border-(--ui-success-border) bg-(--ui-success-soft)",
      warning: "border-(--ui-warning-border) bg-(--ui-warning-soft)",
    },
  },
});
