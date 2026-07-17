import { Present, type PresentContentProps, Show } from "../primitives/conditional";

import { Breadcrumbs, type BreadcrumbsProps } from "./breadcrumbs";
import { ControllerHintStrip, type ControllerHintStripProps } from "./controller-hint-strip";
import { BreadcrumbItemContent } from "./internal/breadcrumb-item-content";
import { TopBarDropdownMenu, type TopBarDropdownMenuProps } from "./top-bar-dropdown-menu";
import type { UiResponsiveMode } from "./type";
import { uiResponsiveModes } from "./value";

export type GlobalTopBarProps = {
  breadcrumbs: BreadcrumbsProps;
  controllerHints?: ControllerHintStripProps;
  layoutMode: UiResponsiveMode;
  menu: TopBarDropdownMenuProps;
};

function CurrentLocationContent({ value }: PresentContentProps<BreadcrumbsProps["items"][number]>) {
  return (
    <span
      aria-current="page"
      title={value.truncationLabel ?? value.label}
      className="inline-flex min-w-0 flex-1 items-center border-l-2 border-(--ui-accent) pl-2 font-(--ui-font-display) text-sm font-semibold tracking-[-0.01em]"
    >
      <BreadcrumbItemContent item={value} />
    </span>
  );
}

type ControllerHintsContentValue = Readonly<{
  hints: ControllerHintStripProps;
  layoutMode: UiResponsiveMode;
}>;

function ControllerHintsContent({ value }: PresentContentProps<ControllerHintsContentValue>) {
  return <ControllerHintStrip {...value.hints} layoutMode={value.layoutMode} />;
}

export function GlobalTopBar(props: GlobalTopBarProps) {
  const currentLocation = props.breadcrumbs.items.find((item) => item.current);
  const controllerHintsValue = props.controllerHints
    ? { hints: props.controllerHints, layoutMode: props.layoutMode }
    : undefined;

  return (
    <header
      data-layout={props.layoutMode}
      data-ui-component="UI-CMP-001"
      className="flex min-w-0 items-center justify-between gap-2 border-b border-(--ui-separator) bg-(--ui-toolbar) p-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Show
          when={props.layoutMode === uiResponsiveModes.mobile}
          fallback={() => <Breadcrumbs {...props.breadcrumbs} layoutMode={props.layoutMode} />}
        >
          {() => <Present value={currentLocation}>{CurrentLocationContent}</Present>}
        </Show>
        <Present value={controllerHintsValue}>{ControllerHintsContent}</Present>
      </div>
      <TopBarDropdownMenu {...props.menu} layoutMode={props.layoutMode} />
    </header>
  );
}

GlobalTopBar.displayName = "GlobalTopBar";
