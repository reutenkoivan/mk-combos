import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

import { useBaseUiOpenChangeHandler } from "../internal/base-ui/use-open-change-handler";
import { cx } from "../recipes/class-name";
import { controlRecipe } from "../recipes/control";
import { surfaceRecipe } from "../recipes/surface";
import type {
  UiDensityMode,
  UiEmphasisMode,
  UiMaterialMode,
  UiShapeMode,
  UiToneMode,
} from "../tokens/type";
import {
  uiDensityModes,
  uiEmphasisModes,
  uiMaterialModes,
  uiShapeModes,
  uiToneModes,
} from "../tokens/value";
import type { UiPrimitiveOpenChangePayload, UiPrimitiveProps } from "./internal";

export type DisclosureRootProps = UiPrimitiveProps<HTMLDivElement> & {
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (payload: UiPrimitiveOpenChangePayload) => void;
  open?: boolean;
  sourceFocusTarget?: string;
};

export function DisclosureRoot(props: DisclosureRootProps) {
  const {
    children,
    className,
    defaultOpen,
    disabled = false,
    onOpenChange,
    open,
    ref,
    sourceFocusTarget,
    ...rootProps
  } = props;
  const handleOpenChange = useBaseUiOpenChangeHandler({ onOpenChange, sourceFocusTarget });

  return (
    <BaseCollapsible.Root
      {...rootProps}
      ref={ref}
      open={open}
      data-ui-disclosure
      disabled={disabled}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      className={cx("grid min-w-0 gap-2", className)}
    >
      {children}
    </BaseCollapsible.Root>
  );
}

DisclosureRoot.displayName = "DisclosureRoot";

export type DisclosureTriggerProps = UiPrimitiveProps<HTMLButtonElement> & {
  density?: UiDensityMode;
  disabled?: boolean;
  emphasis?: UiEmphasisMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
  type?: "button" | "reset" | "submit";
};

export function DisclosureTrigger(props: DisclosureTriggerProps) {
  const {
    children,
    className,
    density = uiDensityModes.small,
    disabled = false,
    emphasis = uiEmphasisModes.normal,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    type = "button",
    ...triggerProps
  } = props;

  return (
    <BaseCollapsible.Trigger
      {...triggerProps}
      ref={ref}
      type={type}
      disabled={disabled}
      data-ui-disclosure-trigger
      data-disabled={disabled ? "true" : undefined}
      className={cx(controlRecipe({ density, emphasis, shape, tone }), className)}
    >
      {children}
    </BaseCollapsible.Trigger>
  );
}

DisclosureTrigger.displayName = "DisclosureTrigger";

export type DisclosurePanelProps = UiPrimitiveProps<HTMLDivElement> & {
  density?: UiDensityMode;
  keepMounted?: boolean;
  material?: UiMaterialMode;
  shape?: UiShapeMode;
  tone?: UiToneMode;
};

export function DisclosurePanel(props: DisclosurePanelProps) {
  const {
    children,
    className,
    density = uiDensityModes.small,
    keepMounted = false,
    material = uiMaterialModes.separated,
    ref,
    shape = uiShapeModes.fixed,
    tone = uiToneModes.neutral,
    ...panelProps
  } = props;

  return (
    <BaseCollapsible.Panel
      {...panelProps}
      ref={ref}
      data-ui-disclosure-panel
      keepMounted={keepMounted}
      className={cx(
        surfaceRecipe({ density, material, shape, tone }),
        "box-border h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-200 ease-out [&[hidden]:not([hidden='until-found'])]:hidden data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </BaseCollapsible.Panel>
  );
}

DisclosurePanel.displayName = "DisclosurePanel";
