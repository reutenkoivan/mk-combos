import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

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
  mapBaseUiReason,
  type UiPrimitiveOpenChangePayload,
  type UiPrimitiveProps,
} from "./internal";

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

  return (
    <BaseCollapsible.Root
      {...rootProps}
      className={cx("grid min-w-0 gap-2", className)}
      data-ui-disclosure
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={(nextOpen, eventDetails) => {
        onOpenChange?.({
          open: nextOpen,
          reason: mapBaseUiReason(eventDetails.reason),
          sourceFocusTarget,
        });
      }}
      open={open}
      ref={ref}
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
    density = "small",
    disabled = false,
    emphasis = "normal",
    ref,
    shape = "fixed",
    tone = "neutral",
    type = "button",
    ...triggerProps
  } = props;

  return (
    <BaseCollapsible.Trigger
      {...triggerProps}
      className={cx(controlRecipe({ density, emphasis, shape, tone }), className)}
      data-disabled={disabled ? "true" : undefined}
      data-ui-disclosure-trigger
      disabled={disabled}
      ref={ref}
      type={type}
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
    density = "small",
    keepMounted = false,
    material = "separated",
    ref,
    shape = "fixed",
    tone = "neutral",
    ...panelProps
  } = props;

  return (
    <BaseCollapsible.Panel
      {...panelProps}
      className={cx(surfaceRecipe({ density, material, shape, tone }), className)}
      data-ui-disclosure-panel
      keepMounted={keepMounted}
      ref={ref}
    >
      {children}
    </BaseCollapsible.Panel>
  );
}

DisclosurePanel.displayName = "DisclosurePanel";
