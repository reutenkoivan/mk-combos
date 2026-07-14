import { tv } from "tailwind-variants";

export const popupRecipe = tv({
  base: [
    "z-50 max-h-[min(var(--available-height,24rem),24rem)] overflow-auto",
    "border border-[color-mix(in_srgb,var(--ui-separator)_88%,transparent)] text-(--ui-text) outline-none",
  ].join(" "),
  compoundVariants: [
    {
      class: "backdrop-blur-xl",
      material: "glass",
    },
  ],
  defaultVariants: {
    density: "medium",
    material: "elevated",
    placement: "floating",
    shape: "fixed",
  },
  variants: {
    density: {
      medium: "p-2",
      mini: "p-1",
      small: "p-1.5",
    },
    material: {
      elevated: "bg-(--ui-popover) shadow-(--ui-shadow)",
      glass: "bg-(--ui-glass) shadow-(--ui-shadow)",
      none: "border-transparent bg-transparent",
      opaque: "bg-(--ui-popover)",
      separated: "bg-(--ui-popover)",
    },
    placement: {
      block: "",
      floating: "",
      inline: "inline-flex",
      sidebar: "",
      toolbar: "",
    },
    shape: {
      capsule: "rounded-full",
      concentric: "rounded-[calc(var(--ui-radius-surface)-3px)]",
      fixed: "rounded-(--ui-radius-surface)",
    },
  },
});
