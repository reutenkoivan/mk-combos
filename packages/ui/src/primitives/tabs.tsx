import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cx } from "../recipes/class-name";
import { tabsIndicatorRecipe, tabsTabRecipe } from "../recipes/tabs";
import {
  mapBaseUiReason,
  type UiPrimitiveProps,
  type UiPrimitiveValueChangePayload,
} from "./internal";

export type TabsRootProps = UiPrimitiveProps<HTMLDivElement> & {
  onValueChange?: (payload: UiPrimitiveValueChangePayload<string>) => void;
  orientation?: "horizontal" | "vertical";
  value: string;
};

export function TabsRoot(props: TabsRootProps) {
  const {
    children,
    className,
    onValueChange,
    orientation = "horizontal",
    ref,
    value,
    ...rootProps
  } = props;

  return (
    <BaseTabs.Root
      {...rootProps}
      ref={ref}
      data-ui-tabs
      value={value}
      orientation={orientation}
      className={cx("grid min-w-0 gap-4", className)}
      onValueChange={(nextValue, eventDetails) => {
        if (typeof nextValue === "string") {
          onValueChange?.({
            reason: mapBaseUiReason(eventDetails.reason),
            value: nextValue,
          });
        }
      }}
    >
      {children}
    </BaseTabs.Root>
  );
}

TabsRoot.displayName = "TabsRoot";

export type TabsListProps = UiPrimitiveProps<HTMLDivElement> & {
  activateOnFocus?: boolean;
  loopFocus?: boolean;
};

export function TabsList(props: TabsListProps) {
  const {
    activateOnFocus = false,
    children,
    className,
    loopFocus = true,
    ref,
    ...listProps
  } = props;

  return (
    <BaseTabs.List
      {...listProps}
      ref={ref}
      data-ui-tabs-list
      loopFocus={loopFocus}
      activateOnFocus={activateOnFocus}
      className={cx(
        "relative flex min-w-0 overflow-x-auto border-(--ui-separator)",
        "data-[orientation=horizontal]:border-b",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r",
        className,
      )}
    >
      {children}
      <BaseTabs.Indicator className={tabsIndicatorRecipe()} data-ui-tabs-indicator />
    </BaseTabs.List>
  );
}

TabsList.displayName = "TabsList";

export type TabsTabProps = UiPrimitiveProps<HTMLButtonElement> & {
  disabled?: boolean;
  value: string;
};

export function TabsTab(props: TabsTabProps) {
  const { children, className, disabled = false, ref, value, ...tabProps } = props;

  return (
    <BaseTabs.Tab
      {...tabProps}
      ref={ref}
      value={value}
      disabled={disabled}
      data-ui-tabs-tab={value}
      className={cx(tabsTabRecipe(), className)}
      data-disabled={disabled ? "true" : undefined}
    >
      {children}
    </BaseTabs.Tab>
  );
}

TabsTab.displayName = "TabsTab";

export type TabsPanelProps = UiPrimitiveProps<HTMLDivElement> & {
  keepMounted?: boolean;
  value: string;
};

export function TabsPanel(props: TabsPanelProps) {
  const { children, className, keepMounted = false, ref, value, ...panelProps } = props;

  return (
    <BaseTabs.Panel
      {...panelProps}
      ref={ref}
      value={value}
      keepMounted={keepMounted}
      data-ui-tabs-panel={value}
      className={cx("min-w-0 outline-none focus-visible:shadow-(--ui-focus-ring)", className)}
    >
      {children}
    </BaseTabs.Panel>
  );
}

TabsPanel.displayName = "TabsPanel";
