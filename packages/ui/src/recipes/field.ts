import { tv } from "tailwind-variants";

export const fieldRecipe = tv({
  base: [
    "inline-flex w-full items-center gap-2 border border-[var(--ui-control-border)]",
    "bg-[var(--ui-field)] text-[var(--ui-text)] shadow-[inset_0_1px_2px_rgb(18_28_45_/_6%)]",
    "cursor-text outline-none transition-[border-color,box-shadow]",
    "placeholder:text-[var(--ui-placeholder)]",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
  ].join(" "),
  compoundVariants: [
    {
      class: "enabled:hover:border-[color-mix(in_srgb,var(--ui-destructive)_88%,var(--ui-text))]",
      editable: true,
      tone: "destructive",
    },
    {
      class:
        "enabled:hover:border-[color-mix(in_srgb,var(--ui-success-border)_82%,var(--ui-text))]",
      editable: true,
      tone: "success",
    },
    {
      class:
        "enabled:hover:border-[color-mix(in_srgb,var(--ui-warning-border)_82%,var(--ui-text))]",
      editable: true,
      tone: "warning",
    },
    {
      class: "enabled:hover:border-[color-mix(in_srgb,var(--ui-destructive)_88%,var(--ui-text))]",
      editable: true,
      state: "invalid",
    },
  ],
  defaultVariants: {
    density: "medium",
    editable: true,
    shape: "fixed",
    state: "idle",
    tone: "neutral",
  },
  variants: {
    density: {
      medium: "min-h-8 px-2.5 text-[13px]",
      mini: "min-h-6 px-2 text-xs",
      small: "min-h-7 px-2 text-[13px]",
    },
    editable: {
      false: "",
      true: "enabled:hover:border-[var(--ui-accent)]",
    },
    shape: {
      capsule: "rounded-full",
      concentric: "rounded-[calc(var(--ui-radius-control)-2px)]",
      fixed: "rounded-[var(--ui-radius-control)]",
    },
    state: {
      active: "border-[var(--ui-accent)]",
      disabled: "cursor-not-allowed opacity-50",
      focusVisible: "shadow-[var(--ui-focus-ring)]",
      hover: "border-[var(--ui-accent)]",
      idle: "",
      invalid: "border-[var(--ui-destructive)] shadow-[0_0_0_1px_var(--ui-destructive)]",
      loading: "cursor-wait opacity-80",
      open: "border-[var(--ui-accent)]",
      selected: "border-[var(--ui-selection)]",
    },
    tone: {
      accent: "",
      destructive: "border-[var(--ui-destructive)]",
      neutral: "",
      success: "border-[var(--ui-success-border)]",
      warning: "border-[var(--ui-warning-border)]",
    },
  },
});
