import { tv } from "tailwind-variants";

const insetFocusRing = "shadow-[inset_0_0_0_2px_var(--ui-window),inset_0_0_0_4px_var(--ui-accent)]";

export const comboWhiteboardTargetKinds = {
  gap: "gap",
  step: "step",
} as const;

export const comboWhiteboardTargetStates = {
  busy: "busy",
  disabled: "disabled",
  frozen: "frozen",
  idle: "idle",
} as const;

export type ComboWhiteboardTargetState =
  (typeof comboWhiteboardTargetStates)[keyof typeof comboWhiteboardTargetStates];

export const comboWhiteboardTargetRecipe = tv({
  base: "relative outline-none transition-[background-color,border-color,box-shadow,opacity]",
  compoundVariants: [
    {
      class: `bg-[var(--ui-selection-muted)] ${insetFocusRing} after:pointer-events-none after:absolute after:inset-1 after:border after:border-dashed after:border-[var(--ui-accent)] after:content-['']`,
      focused: true,
      pickedUp: true,
    },
    {
      class: `opacity-65 ${insetFocusRing}`,
      focused: true,
      state: comboWhiteboardTargetStates.disabled,
    },
    {
      class: `cursor-wait opacity-80 ${insetFocusRing}`,
      focused: true,
      state: comboWhiteboardTargetStates.busy,
    },
    {
      class: `opacity-70 ${insetFocusRing}`,
      focused: true,
      state: comboWhiteboardTargetStates.frozen,
    },
    {
      class: "cursor-wait opacity-80",
      pickedUp: true,
      state: comboWhiteboardTargetStates.busy,
    },
    {
      class: "opacity-70",
      pickedUp: true,
      state: comboWhiteboardTargetStates.frozen,
    },
  ],
  defaultVariants: {
    focused: false,
    invalid: false,
    kind: comboWhiteboardTargetKinds.step,
    pickedUp: false,
    state: comboWhiteboardTargetStates.idle,
  },
  variants: {
    focused: {
      false: "",
      true: `z-10 ${insetFocusRing}`,
    },
    kind: {
      gap: "grid w-11 place-items-center gap-1",
      step: "grid h-full w-44 gap-1 rounded-[var(--ui-radius-control)] border border-[var(--ui-control-border)] bg-[var(--ui-control)] p-1",
    },
    invalid: {
      false: "",
      true: "border-l-4 border-[var(--ui-destructive)] bg-[var(--ui-destructive-soft)] before:absolute before:right-1 before:top-1 before:z-20 before:grid before:h-5 before:w-5 before:place-items-center before:rounded-full before:border before:border-current before:text-xs before:font-black before:content-['!']",
    },
    pickedUp: {
      false: "",
      true: "bg-[var(--ui-selection-muted)]",
    },
    state: {
      busy: "cursor-wait opacity-80",
      disabled: "cursor-not-allowed opacity-50",
      frozen: "cursor-not-allowed opacity-70 saturate-50",
      idle: "",
    },
  },
});
