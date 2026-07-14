import { tv } from "tailwind-variants";

type FrameMeterSegmentValidityValues = {
  readonly invalid: string;
  readonly unavailable: string;
  readonly valid: string;
};

type FrameMeterSegmentKindValues = {
  readonly active: string;
  readonly cancel: string;
  readonly juggle: string;
  readonly link: string;
  readonly other: string;
  readonly recovery: string;
  readonly startup: string;
  readonly transition: string;
};

type FrameMeterTrackKindValues = {
  readonly comparison: string;
  readonly meta: string;
  readonly primary: string;
};

export const createFrameMeterSegmentRecipe = (
  comboFrameMeterSegmentValidities: FrameMeterSegmentValidityValues,
  comboFrameMeterSegmentKinds: FrameMeterSegmentKindValues,
) =>
  tv({
    base: [
      "inline-flex min-h-11 w-40 min-w-11 shrink-0 snap-start items-center justify-center overflow-hidden rounded-(--ui-radius-control) border px-2.5 py-1.5 text-left text-xs font-medium outline-none",
      "transition-[background-color,border-color,box-shadow,color,filter,opacity]",
      "focus-visible:shadow-(--ui-focus-ring)",
      "enabled:cursor-pointer enabled:hover:brightness-[1.08]",
      "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-55",
      "data-[frozen=true]:cursor-wait data-[frozen=true]:opacity-80",
    ].join(" "),
    compoundVariants: [
      {
        class: "border-(--ui-selection) shadow-[inset_0_-3px_0_var(--ui-selection)]",
        selected: true,
        validity: comboFrameMeterSegmentValidities.valid,
      },
      {
        class: "border-(--ui-selection) shadow-[inset_0_-3px_0_var(--ui-selection)]",
        selected: true,
        validity: comboFrameMeterSegmentValidities.unavailable,
      },
      {
        class:
          "border-(--ui-destructive) bg-(--ui-destructive-soft) text-(--ui-destructive) shadow-[inset_0_-3px_0_var(--ui-destructive)]",
        selected: true,
        validity: comboFrameMeterSegmentValidities.invalid,
      },
      {
        class:
          "border-(--ui-destructive) bg-(--ui-destructive-soft) text-(--ui-destructive) shadow-[var(--ui-focus-ring),inset_0_-3px_0_var(--ui-destructive)]",
        focused: true,
        validity: comboFrameMeterSegmentValidities.invalid,
      },
      {
        class: "border-(--ui-destructive) bg-(--ui-destructive-soft) text-(--ui-destructive)",
        frozen: true,
        validity: comboFrameMeterSegmentValidities.invalid,
      },
    ],
    defaultVariants: {
      focused: false,
      frozen: false,
      selected: false,
      validity: comboFrameMeterSegmentValidities.valid,
    },
    variants: {
      focused: {
        false: "",
        true: "shadow-(--ui-focus-ring)",
      },
      frozen: {
        false: "",
        true: "cursor-wait opacity-80",
      },
      kind: {
        [comboFrameMeterSegmentKinds.active]:
          "border-(--ui-frame-active-border) bg-(--ui-frame-active-soft)",
        [comboFrameMeterSegmentKinds.cancel]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition-soft)",
        [comboFrameMeterSegmentKinds.juggle]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition-soft)",
        [comboFrameMeterSegmentKinds.link]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition-soft)",
        [comboFrameMeterSegmentKinds.other]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition-soft)",
        [comboFrameMeterSegmentKinds.recovery]:
          "border-(--ui-frame-recovery-border) bg-(--ui-frame-recovery-soft)",
        [comboFrameMeterSegmentKinds.startup]:
          "border-(--ui-frame-startup-border) bg-(--ui-frame-startup-soft)",
        [comboFrameMeterSegmentKinds.transition]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition-soft)",
      },
      selected: {
        false: "",
        true: "border-(--ui-selection)",
      },
      validity: {
        [comboFrameMeterSegmentValidities.invalid]:
          "border-(--ui-destructive) bg-(--ui-destructive-soft) text-(--ui-destructive) enabled:hover:brightness-[0.96]",
        [comboFrameMeterSegmentValidities.unavailable]:
          "border-dashed border-(--ui-control-border) bg-(--ui-control) text-(--ui-muted-text) enabled:hover:bg-(--ui-control-hover)",
        [comboFrameMeterSegmentValidities.valid]: "text-(--ui-text)",
      },
    },
  });

export const createFrameMeterCellRecipe = (
  comboFrameMeterSegmentValidities: FrameMeterSegmentValidityValues,
  comboFrameMeterSegmentKinds: FrameMeterSegmentKindValues,
  comboFrameMeterTrackKinds: FrameMeterTrackKindValues,
) =>
  tv({
    base: [
      "relative h-7 origin-center appearance-none overflow-hidden border-y border-r p-0 text-inherit",
      "after:pointer-events-none after:absolute after:inset-0 after:border-r after:border-(--ui-frame-cell-divider)",
      "transition-[filter,outline-color,transform] motion-reduce:transition-none",
    ].join(" "),
    compoundVariants: [
      {
        class:
          "outline outline-2 outline-offset-[-2px] outline-(--ui-destructive) after:bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,color-mix(in_srgb,var(--ui-destructive)_48%,transparent)_4px,color-mix(in_srgb,var(--ui-destructive)_48%,transparent)_7px)]",
        validity: comboFrameMeterSegmentValidities.invalid,
      },
      {
        class: "outline-offset-2 outline-(--ui-selection)",
        selected: true,
        validity: comboFrameMeterSegmentValidities.invalid,
      },
      {
        class: "z-30",
        focused: true,
        selected: true,
      },
    ],
    defaultVariants: {
      focused: false,
      frozen: false,
      interactive: false,
      selected: false,
      trackKind: comboFrameMeterTrackKinds.primary,
      validity: comboFrameMeterSegmentValidities.valid,
    },
    variants: {
      focused: {
        false: "",
        true: "z-30 shadow-(--ui-focus-ring)",
      },
      frozen: {
        false: "",
        true: "cursor-wait opacity-80",
      },
      interactive: {
        false: "",
        true: "enabled:cursor-pointer enabled:hover:brightness-[1.08] disabled:cursor-wait",
      },
      kind: {
        [comboFrameMeterSegmentKinds.active]:
          "border-(--ui-frame-active-border) bg-(--ui-frame-active)",
        [comboFrameMeterSegmentKinds.cancel]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition)",
        [comboFrameMeterSegmentKinds.juggle]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition)",
        [comboFrameMeterSegmentKinds.link]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition)",
        [comboFrameMeterSegmentKinds.other]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition)",
        [comboFrameMeterSegmentKinds.recovery]:
          "border-(--ui-frame-recovery-border) bg-(--ui-frame-recovery)",
        [comboFrameMeterSegmentKinds.startup]:
          "border-(--ui-frame-startup-border) bg-(--ui-frame-startup)",
        [comboFrameMeterSegmentKinds.transition]:
          "border-(--ui-frame-transition-border) bg-(--ui-frame-transition)",
      },
      trackKind: {
        [comboFrameMeterTrackKinds.comparison]: "h-7",
        [comboFrameMeterTrackKinds.meta]: "h-4",
        [comboFrameMeterTrackKinds.primary]: "h-7",
      },
      selected: {
        false: "",
        true: "z-20 scale-[1.06] outline outline-2 outline-offset-2 outline-(--ui-selection)",
      },
      validity: {
        [comboFrameMeterSegmentValidities.invalid]: "",
        [comboFrameMeterSegmentValidities.unavailable]:
          "border-dashed bg-(--ui-control) opacity-65",
        [comboFrameMeterSegmentValidities.valid]: "",
      },
    },
  });
