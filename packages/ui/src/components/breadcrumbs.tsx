import { useComponentValueEmitter } from "../hooks/intents";
import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
import { uiEmphasisModes } from "../tokens/value";
import { GameSwitcher, type GameSwitcherProps, gameSwitcherContexts } from "./game-switcher";
import { BreadcrumbItemContent } from "./internal/breadcrumb-item-content";
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

  if (props.layoutMode === uiResponsiveModes.mobile) {
    return null;
  }

  return (
    <nav
      aria-label={props.ariaLabel}
      data-ui-component="UI-CMP-032"
      data-breadcrumb-compact-controls
      className="h-7 min-w-0 [--ui-focus-ring:inset_0_0_0_2px_var(--ui-accent)]"
    >
      <ol className="flex h-7 min-w-0 flex-nowrap items-center gap-1">
        <li className="flex h-7 min-w-0 shrink-0 items-center">
          <GameSwitcher {...props.gameSwitcher} context={gameSwitcherContexts.breadcrumbs} />
        </li>
        {props.items.map((item) => (
          <li className="flex h-7 min-w-0 shrink items-center gap-1" key={item.id}>
            <span
              aria-hidden="true"
              data-breadcrumb-separator
              className="inline-flex h-7 shrink-0 items-center px-1 font-mono text-[13px] text-(--ui-muted-text)"
            >
              /
            </span>
            <Show
              when={Boolean(item.current)}
              fallback={() => (
                <Button
                  className="min-w-0 shrink"
                  emphasis={uiEmphasisModes.subtle}
                  disabled={item.disabled || !item.target}
                  onRequestPress={() =>
                    valueEmitter.methods.emitValue(item.id, componentInteractionReasons.press)
                  }
                  aria-label={
                    item.disabledReason
                      ? `${item.truncationLabel ?? item.label}: ${item.disabledReason}`
                      : (item.truncationLabel ?? item.label)
                  }
                >
                  <BreadcrumbItemContent className="max-w-48" item={item} />
                </Button>
              )}
            >
              {() => (
                <span
                  aria-current="page"
                  title={item.truncationLabel ?? item.label}
                  className="inline-flex h-7 min-w-0 shrink items-center px-2.5 text-[13px] font-medium"
                >
                  <BreadcrumbItemContent className="max-w-48" item={item} />
                </span>
              )}
            </Show>
          </li>
        ))}
      </ol>
    </nav>
  );
}

Breadcrumbs.displayName = "Breadcrumbs";
