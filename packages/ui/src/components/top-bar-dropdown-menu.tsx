import type { ReactNode } from "react";
import { useComponentActionEmitter, useComponentOpenChangeEmitter } from "../hooks/intents";
import { MenuIcon } from "../icons/menu";
import { XIcon } from "../icons/x";
import {
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerPopup,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
  drawerSwipeDirections,
} from "../primitives/drawer";
import {
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "../primitives/menu";
import { uiFloatingAlignments } from "../primitives/positioning";
import { cx } from "../recipes/class-name";
import { itemRecipe } from "../recipes/item";
import {
  uiControlPresentationModes,
  uiDensityModes,
  uiEmphasisModes,
  uiInteractionStates,
  uiPlacementModes,
  uiSelectionStates,
  uiToneModes,
} from "../tokens/value";
import { GameSwitcher, type GameSwitcherProps } from "./game-switcher";
import type { BreadcrumbItem, ComponentActionIntent, UiResponsiveMode } from "./type";
import { componentInteractionReasons, uiResponsiveModes } from "./value";

export const topBarDropdownMenuChangeActions = {
  close: "close",
  open: "open",
} as const;

export type TopBarDropdownMenuChangeAction =
  (typeof topBarDropdownMenuChangeActions)[keyof typeof topBarDropdownMenuChangeActions];

export const topBarMenuActionTones = {
  destructive: uiToneModes.destructive,
  neutral: uiToneModes.neutral,
} as const;

export type TopBarMenuActionTone =
  (typeof topBarMenuActionTones)[keyof typeof topBarMenuActionTones];

export type TopBarMenuAction = {
  available: boolean;
  disabledReason?: string;
  id: string;
  label: string;
  tone?: TopBarMenuActionTone;
};

export type TopBarDropdownMenuProps = {
  actions: readonly TopBarMenuAction[];
  breadcrumbs?: readonly BreadcrumbItem[];
  responsiveCloseLabel?: string;
  responsiveGameSwitcher?: GameSwitcherProps;
  responsiveNavigationLabel?: string;
  disabled?: boolean;
  label: string;
  layoutMode: UiResponsiveMode;
  navigationPending?: boolean;
  onRequestAction?: (intent: ComponentActionIntent<string>) => void;
  onRequestMenuChange?: (intent: ComponentActionIntent<TopBarDropdownMenuChangeAction>) => void;
  open: boolean;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

type DrawerActionProps = {
  action: string;
  ariaLabel: string;
  children: ReactNode;
  current?: boolean;
  disabled: boolean;
  onRequestAction: (action: string) => void;
  sourceFocusTarget?: string;
  tone?: TopBarMenuActionTone;
};

function DrawerAction(props: DrawerActionProps) {
  const className = cx(
    itemRecipe({
      density: uiDensityModes.medium,
      interactive: !props.current && !props.disabled,
      selection: props.current ? uiSelectionStates.current : uiSelectionStates.none,
      state: props.current
        ? uiInteractionStates.idle
        : props.disabled
          ? uiInteractionStates.disabled
          : uiInteractionStates.idle,
      tone: props.tone,
    }),
    "h-auto w-full justify-start border-transparent bg-transparent text-left font-normal normal-case tracking-normal shadow-none",
  );

  if (props.current) {
    return (
      <div aria-current="page" className={className}>
        {props.children}
      </div>
    );
  }

  return (
    <DrawerClose
      aria-label={props.ariaLabel}
      className={className}
      disabled={props.disabled}
      emphasis={uiEmphasisModes.subtle}
      onRequestPress={() => props.onRequestAction(props.action)}
      placement={uiPlacementModes.sidebar}
      sourceFocusTarget={props.sourceFocusTarget}
      tone={props.tone}
    >
      {props.children}
    </DrawerClose>
  );
}

const getBreadcrumbAriaLabel = (item: BreadcrumbItem) =>
  item.disabledReason ? `${item.label}: ${item.disabledReason}` : item.label;

const getActionAriaLabel = (action: TopBarMenuAction) =>
  action.disabledReason ? `${action.label}: ${action.disabledReason}` : action.label;

function DesktopTopBarMenu(props: TopBarDropdownMenuProps & { blocked: boolean }) {
  const actionEmitter = useComponentActionEmitter<string>({
    defaultReason: componentInteractionReasons.itemPress,
    onRequest: props.onRequestAction,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });
  const menuChangeEmitter = useComponentOpenChangeEmitter<TopBarDropdownMenuChangeAction>({
    closeAction: topBarDropdownMenuChangeActions.close,
    onRequest: props.onRequestMenuChange,
    openAction: topBarDropdownMenuChangeActions.open,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <MenuRoot
      disabled={props.blocked}
      onOpenChange={menuChangeEmitter.methods.handleOpenChange}
      open={props.open}
      sourceFocusTarget={props.sourceFocusTarget}
    >
      <MenuTrigger
        appearance={uiControlPresentationModes.icon}
        aria-label={props.label}
        disabled={props.blocked}
      >
        <MenuIcon aria-hidden="true" size="small" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner align={uiFloatingAlignments.end}>
          <MenuPopup className="w-[min(24rem,calc(100vw-1rem))]">
            <MenuGroup>
              {props.actions.map((action) => (
                <MenuItem
                  aria-label={getActionAriaLabel(action)}
                  disabled={!action.available || props.blocked}
                  key={action.id}
                  onRequestSelect={() => actionEmitter.methods.emitAction(action.id)}
                  tone={action.tone}
                  value={action.id}
                >
                  {action.label}
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  );
}

function ResponsiveTopBarDrawer(props: TopBarDropdownMenuProps & { blocked: boolean }) {
  const actionEmitter = useComponentActionEmitter<string>({
    defaultReason: componentInteractionReasons.itemPress,
    onRequest: props.onRequestAction,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });
  const menuChangeEmitter = useComponentOpenChangeEmitter<TopBarDropdownMenuChangeAction>({
    closeAction: topBarDropdownMenuChangeActions.close,
    onRequest: props.onRequestMenuChange,
    openAction: topBarDropdownMenuChangeActions.open,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });
  const breadcrumbIds = new Set(props.breadcrumbs?.map((item) => item.id));
  const actions = props.actions.filter((action) => !breadcrumbIds.has(action.id));
  const navigationLabel = props.responsiveNavigationLabel ?? props.label;

  return (
    <DrawerRoot
      onOpenChange={menuChangeEmitter.methods.handleOpenChange}
      open={props.open}
      sourceFocusTarget={props.sourceFocusTarget}
      swipeDirection={drawerSwipeDirections.right}
    >
      <DrawerTrigger
        appearance={uiControlPresentationModes.icon}
        aria-label={props.label}
        disabled={props.blocked}
      >
        <MenuIcon aria-hidden="true" size="small" />
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerBackdrop />
        <DrawerViewport className="justify-end">
          <DrawerPopup className="h-dvh max-h-dvh w-full max-w-96 shrink-0 overflow-y-auto rounded-none border-y-0 border-r-0 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] [transform:translateX(var(--drawer-swipe-movement-x))] data-ending-style:[transform:translateX(100%)] data-starting-style:[transform:translateX(100%)]">
            <DrawerContent>
              <header className="flex items-center justify-between gap-2 border-b border-(--ui-separator) pb-2">
                <DrawerTitle>{navigationLabel}</DrawerTitle>
                <DrawerClose
                  appearance={uiControlPresentationModes.icon}
                  aria-label={props.responsiveCloseLabel ?? `Close ${navigationLabel}`}
                >
                  <XIcon aria-hidden="true" size="small" />
                </DrawerClose>
              </header>
              {props.responsiveGameSwitcher && (
                <section className="grid gap-1">
                  <h2 className="px-2 text-xs font-semibold text-(--ui-muted-text)">
                    {props.responsiveGameSwitcher.label}
                  </h2>
                  <GameSwitcher {...props.responsiveGameSwitcher} context="breadcrumbs" />
                </section>
              )}
              {props.breadcrumbs && props.breadcrumbs.length > 0 && (
                <section className="grid gap-1">
                  <h2 className="px-2 text-xs font-semibold text-(--ui-muted-text)">
                    {navigationLabel}
                  </h2>
                  {props.breadcrumbs.map((item) => (
                    <DrawerAction
                      action={`breadcrumb:${item.id}`}
                      ariaLabel={getBreadcrumbAriaLabel(item)}
                      current={item.current}
                      disabled={item.disabled || !item.target || props.blocked}
                      key={item.id}
                      onRequestAction={actionEmitter.methods.emitAction}
                      sourceFocusTarget={props.sourceFocusTarget}
                    >
                      <span className="min-w-0 truncate">{item.label}</span>
                    </DrawerAction>
                  ))}
                </section>
              )}
              <section className="grid gap-1 border-t border-(--ui-separator) pt-2">
                {actions.map((action) => (
                  <DrawerAction
                    action={action.id}
                    ariaLabel={getActionAriaLabel(action)}
                    disabled={!action.available || props.blocked}
                    key={action.id}
                    onRequestAction={actionEmitter.methods.emitAction}
                    sourceFocusTarget={props.sourceFocusTarget}
                    tone={action.tone}
                  >
                    {action.label}
                  </DrawerAction>
                ))}
              </section>
            </DrawerContent>
          </DrawerPopup>
        </DrawerViewport>
      </DrawerPortal>
    </DrawerRoot>
  );
}

export function TopBarDropdownMenu(props: TopBarDropdownMenuProps) {
  const blocked = Boolean(props.disabled || props.navigationPending);

  return (
    <div className="shrink-0" data-ui-component="UI-CMP-033">
      {props.layoutMode === uiResponsiveModes.desktop ? (
        <DesktopTopBarMenu {...props} blocked={blocked} />
      ) : (
        <ResponsiveTopBarDrawer {...props} blocked={blocked} />
      )}
    </div>
  );
}

TopBarDropdownMenu.displayName = "TopBarDropdownMenu";
