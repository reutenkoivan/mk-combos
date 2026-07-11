import { tv } from "tailwind-variants";

export const controlRecipe = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center gap-1.5",
    "border border-[var(--ui-control-border)] bg-[var(--ui-control)] text-[var(--ui-text)]",
    "font-medium leading-none outline-none transition-[background-color,border-color,color,box-shadow]",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
    "data-[loading=true]:cursor-wait",
  ].join(" "),
  compoundVariants: [
    {
      class: "rounded-full px-5",
      emphasis: "prominent",
      shape: "capsule",
    },
    {
      class:
        "border-[var(--ui-destructive)] bg-[var(--ui-destructive)] text-[var(--ui-accent-text)]",
      emphasis: "prominent",
      tone: "destructive",
    },
    {
      class: "border-[var(--ui-accent)] bg-[var(--ui-accent)] text-[var(--ui-accent-text)]",
      emphasis: "prominent",
      tone: "accent",
    },
  ],
  defaultVariants: {
    density: "small",
    emphasis: "normal",
    placement: "inline",
    shape: "fixed",
    state: "idle",
    tone: "neutral",
  },
  variants: {
    density: {
      medium: "h-8 min-w-8 px-3 text-[13px]",
      mini: "h-6 min-w-6 px-2 text-xs",
      small: "h-7 min-w-7 px-2.5 text-[13px]",
    },
    emphasis: {
      normal: "shadow-[inset_0_1px_0_rgb(255_255_255_/_35%)]",
      prominent: "shadow-sm",
      subtle: "bg-transparent shadow-none",
    },
    placement: {
      block: "w-full",
      floating: "shadow-md",
      inline: "",
      sidebar: "justify-start",
      toolbar: "min-w-7 px-2",
    },
    shape: {
      capsule: "rounded-full",
      concentric: "rounded-[calc(var(--ui-radius-control)-2px)]",
      fixed: "rounded-[var(--ui-radius-control)]",
    },
    state: {
      active: "bg-[var(--ui-control-active)]",
      disabled: "pointer-events-none opacity-50",
      focusVisible: "shadow-[var(--ui-focus-ring)]",
      hover: "bg-[var(--ui-control-hover)]",
      idle: "",
      invalid: "border-[var(--ui-destructive)] text-[var(--ui-destructive)]",
      loading: "cursor-wait opacity-80",
      open: "bg-[var(--ui-control-active)]",
      selected: "border-[var(--ui-selection)] bg-[var(--ui-selection-muted)]",
    },
    tone: {
      accent: "text-[var(--ui-accent-strong)]",
      destructive: "text-[var(--ui-destructive)]",
      neutral: "",
      success: "text-[var(--ui-success)]",
      warning: "text-[var(--ui-warning)]",
    },
  },
});
