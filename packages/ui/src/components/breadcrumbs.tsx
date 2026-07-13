import { useComponentValueEmitter } from "../hooks/intents";
import { ChevronRightIcon } from "../icons/chevron-right";
import { Button } from "../primitives/button";
import { GameSwitcher, type GameSwitcherProps, gameSwitcherContexts } from "./game-switcher";
import type { BreadcrumbItem, ComponentValueIntent, UiResponsiveMode } from "./type";
import { componentInteractionReasons, uiResponsiveModes } from "./value";

export type BreadcrumbsProps = {
  ariaLabel: string;
  gameSwitcher: GameSwitcherProps;
  items: readonly BreadcrumbItem[];
  layoutMode: UiResponsiveMode;
  onRequestNavigate?: (intent: ComponentValueIntent<string>) => void;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function Breadcrumbs(props: BreadcrumbsProps) {
  const valueEmitter = useComponentValueEmitter<string>({
    defaultReason: componentInteractionReasons.press,
    onRequest: props.onRequestNavigate,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  if (props.layoutMode !== uiResponsiveModes.desktop) {
    return null;
  }

  return (
    <nav
      aria-label={props.ariaLabel}
      className="min-w-0 overflow-hidden"
      data-ui-component="UI-CMP-032"
    >
      <ol className="flex min-w-0 flex-nowrap items-center gap-1 overflow-hidden">
        <li className="min-w-0 shrink-0">
          <GameSwitcher {...props.gameSwitcher} context={gameSwitcherContexts.breadcrumbs} />
        </li>
        {props.items.map((item) => (
          <li className="flex min-w-0 items-center gap-1" key={item.id}>
            <ChevronRightIcon aria-hidden="true" className="shrink-0" size="small" />
            {item.current ? (
              <span
                aria-current="page"
                className="truncate px-2 py-1 text-sm font-medium"
                title={item.truncationLabel ?? item.label}
              >
                {item.label}
              </span>
            ) : (
              <Button
                aria-label={
                  item.disabledReason
                    ? `${item.truncationLabel ?? item.label}: ${item.disabledReason}`
                    : (item.truncationLabel ?? item.label)
                }
                disabled={item.disabled || !item.target}
                onRequestPress={() =>
                  valueEmitter.methods.emitValue(item.id, componentInteractionReasons.press)
                }
              >
                <span className="max-w-48 truncate">{item.label}</span>
              </Button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

Breadcrumbs.displayName = "Breadcrumbs";
