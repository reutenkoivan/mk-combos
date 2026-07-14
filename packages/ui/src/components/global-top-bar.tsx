import { Breadcrumbs, type BreadcrumbsProps } from "./breadcrumbs";
import { ControllerHintStrip, type ControllerHintStripProps } from "./controller-hint-strip";
import { TopBarDropdownMenu, type TopBarDropdownMenuProps } from "./top-bar-dropdown-menu";
import type { UiResponsiveMode } from "./type";
import { uiResponsiveModes } from "./value";

export type GlobalTopBarProps = {
  breadcrumbs: BreadcrumbsProps;
  controllerHints?: ControllerHintStripProps;
  layoutMode: UiResponsiveMode;
  menu: TopBarDropdownMenuProps;
};

export function GlobalTopBar(props: GlobalTopBarProps) {
  const currentLocation = props.breadcrumbs.items.find((item) => item.current);

  return (
    <header
      className="flex min-w-0 items-center justify-between gap-2 border-b border-(--ui-separator) bg-(--ui-toolbar) p-2"
      data-layout={props.layoutMode}
      data-ui-component="UI-CMP-001"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {props.layoutMode === uiResponsiveModes.desktop ? (
          <Breadcrumbs {...props.breadcrumbs} layoutMode={props.layoutMode} />
        ) : (
          currentLocation && (
            <span
              aria-current="page"
              className="min-w-0 flex-1 truncate border-l-2 border-(--ui-accent) pl-2 font-(--ui-font-display) text-sm font-semibold tracking-[-0.01em]"
              title={currentLocation.truncationLabel ?? currentLocation.label}
            >
              {currentLocation.label}
            </span>
          )
        )}
        {props.controllerHints && (
          <ControllerHintStrip {...props.controllerHints} layoutMode={props.layoutMode} />
        )}
      </div>
      <TopBarDropdownMenu {...props.menu} layoutMode={props.layoutMode} />
    </header>
  );
}

GlobalTopBar.displayName = "GlobalTopBar";
