import { tv } from "tailwind-variants";

export const itemRecipe = tv({
  base: [
    "grid grid-cols-[auto_1fr_auto] items-center gap-2 text-(--ui-text) outline-none",
    "transition-[background-color,color,box-shadow]",
    "focus-visible:shadow-(--ui-focus-ring)",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
    "data-[loading=true]:cursor-wait data-[loading=true]:opacity-80",
  ].join(" "),
  compoundVariants: [
    {
      class:
        "[&:not([data-disabled=true])]:hover:bg-[color-mix(in_srgb,var(--ui-selection-muted)_72%,var(--ui-control-hover))]",
      interactive: true,
      selection: "current",
    },
    {
      class:
        "[&:not([data-disabled=true])]:hover:bg-[color-mix(in_srgb,var(--ui-highlight)_72%,var(--ui-control-hover))]",
      interactive: true,
      selection: "mixed",
    },
    {
      class:
        "[&:not([data-disabled=true])]:hover:bg-[color-mix(in_srgb,var(--ui-selection)_88%,var(--ui-text))]",
      interactive: true,
      selection: "selected",
    },
  ],
  defaultVariants: {
    density: "small",
    interactive: false,
    selection: "none",
    shape: "fixed",
    state: "idle",
    tone: "neutral",
  },
  variants: {
    density: {
      medium: "min-h-9 px-3 text-[13px]",
      mini: "min-h-6 px-2 text-xs",
      small: "min-h-8 px-2.5 text-[13px]",
    },
    interactive: {
      false: "",
      true: "[&:not([data-disabled=true])]:cursor-pointer [&:not([data-disabled=true])]:hover:bg-(--ui-control-hover)",
    },
    selection: {
      current: "bg-(--ui-selection-muted) font-medium",
      mixed: "bg-(--ui-highlight)",
      none: "",
      selected: "bg-(--ui-selection) text-(--ui-selection-text)",
    },
    shape: {
      capsule: "rounded-full",
      concentric: "rounded-[calc(var(--ui-radius-control)-2px)]",
      fixed: "rounded-(--ui-radius-control)",
    },
    state: {
      active: "bg-(--ui-control-active)",
      disabled: "cursor-not-allowed opacity-50",
      focusVisible: "shadow-(--ui-focus-ring)",
      hover: "bg-(--ui-control-hover)",
      idle: "",
      invalid: "text-(--ui-destructive)",
      loading: "cursor-wait opacity-80",
      open: "bg-(--ui-control-active)",
      selected: "bg-(--ui-selection) text-(--ui-selection-text)",
    },
    tone: {
      accent: "text-(--ui-accent-strong)",
      destructive: "text-(--ui-destructive)",
      neutral: "",
      success: "text-(--ui-success)",
      warning: "text-(--ui-warning)",
    },
  },
});
