import { tv } from "tailwind-variants";

export const controlRecipe = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center gap-1.5",
    "border border-[var(--ui-control-border)] bg-[var(--ui-control)] text-[var(--ui-text)]",
    "font-semibold uppercase tracking-[0.035em] leading-none outline-none transition-[background-color,border-color,color,box-shadow,transform]",
    "cursor-pointer enabled:hover:bg-[var(--ui-control-hover)]",
    "active:translate-y-px",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
    "data-[loading=true]:cursor-wait",
  ].join(" "),
  compoundVariants: [
    {
      class: "px-5",
      emphasis: "prominent",
      shape: "capsule",
    },
    {
      class:
        "border-[var(--ui-destructive)] bg-[var(--ui-destructive)] text-[var(--ui-accent-text)] enabled:hover:border-[color-mix(in_srgb,var(--ui-destructive)_88%,var(--ui-text))] enabled:hover:bg-[color-mix(in_srgb,var(--ui-destructive)_88%,var(--ui-text))]",
      emphasis: "prominent",
      tone: "destructive",
    },
    {
      class:
        "border-[var(--ui-accent)] bg-[var(--ui-accent)] text-[var(--ui-accent-text)] enabled:hover:border-[color-mix(in_srgb,var(--ui-accent)_88%,var(--ui-text))] enabled:hover:bg-[color-mix(in_srgb,var(--ui-accent)_88%,var(--ui-text))]",
      emphasis: "prominent",
      tone: "accent",
    },
    {
      appearance: "icon",
      class:
        "border-transparent bg-transparent shadow-none enabled:hover:border-transparent enabled:hover:bg-transparent enabled:hover:text-[var(--ui-accent-strong)] active:bg-transparent aria-expanded:bg-transparent aria-expanded:text-[var(--ui-accent-strong)]",
    },
    {
      appearance: "filled",
      class:
        "enabled:hover:bg-[color-mix(in_srgb,var(--ui-selection-muted)_72%,var(--ui-control-hover))]",
      state: "selected",
    },
  ],
  defaultVariants: {
    appearance: "filled",
    density: "small",
    emphasis: "normal",
    placement: "inline",
    shape: "fixed",
    state: "idle",
    tone: "neutral",
  },
  variants: {
    appearance: {
      filled: "",
      icon: "",
    },
    density: {
      medium: "h-8 min-w-8 px-3 text-[13px]",
      mini: "h-6 min-w-6 px-2 text-xs",
      small: "h-7 min-w-7 px-2.5 text-[13px]",
    },
    emphasis: {
      normal: "shadow-[inset_0_1px_0_rgb(255_255_255_/_35%)]",
      prominent: "shadow-sm",
      subtle: "border-transparent bg-transparent shadow-none",
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
      disabled: "cursor-not-allowed opacity-50",
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
