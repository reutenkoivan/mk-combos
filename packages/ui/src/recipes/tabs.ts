import { tv } from "tailwind-variants";

export const tabsTabRecipe = tv({
  base: [
    "relative inline-flex min-h-11 shrink-0 items-center justify-center px-3 py-2",
    "text-sm font-medium text-(--ui-muted-text) outline-none",
    "transition-[background-color,color,box-shadow]",
    "[&:not([data-disabled])]:cursor-pointer",
    "[&:not([data-disabled])]:hover:bg-(--ui-control-hover)",
    "[&:not([data-disabled])]:hover:text-(--ui-text)",
    "[&:not([data-disabled])]:active:bg-(--ui-control-active)",
    "focus-visible:shadow-(--ui-focus-ring)",
    "data-[active]:text-(--ui-text)",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
  ].join(" "),
});

export const tabsIndicatorRecipe = tv({
  base: [
    "pointer-events-none absolute bg-(--ui-accent-strong)",
    "transition-[left,top,width,height] duration-200 motion-reduce:transition-none",
    "data-[orientation=horizontal]:bottom-0",
    "data-[orientation=horizontal]:left-(--active-tab-left)",
    "data-[orientation=horizontal]:h-0.5",
    "data-[orientation=horizontal]:w-(--active-tab-width)",
    "data-[orientation=vertical]:right-0",
    "data-[orientation=vertical]:top-(--active-tab-top)",
    "data-[orientation=vertical]:h-(--active-tab-height)",
    "data-[orientation=vertical]:w-0.5",
  ].join(" "),
});
