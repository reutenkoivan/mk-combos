import type { ReactNode } from "react";
import { useComponentActionEmitter, useComponentOpenChangeEmitter } from "../hooks/intents";
import { MenuIcon } from "../icons/menu";
import { XIcon } from "../icons/x";
import { useUiRootContext } from "../internal/ui-root-context";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
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
import { GameSwitcher, type GameSwitcherProps, gameSwitcherContexts } from "./game-switcher";
import { BreadcrumbItemContent } from "./internal/breadcrumb-item-content";
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
  controllerFocusedActionId?: string;
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
  controllerFocused?: boolean;
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

  return (
    <Show
      when={props.current === true}
      fallback={() => (
        <DrawerClose
          tone={props.tone}
          className={className}
          disabled={props.disabled}
          aria-label={props.ariaLabel}
          emphasis={uiEmphasisModes.subtle}
          data-ui-focus-target={props.action}
          placement={uiPlacementModes.sidebar}
          sourceFocusTarget={props.sourceFocusTarget}
          onRequestPress={() => props.onRequestAction(props.action)}
          data-controller-focused={props.controllerFocused ? "true" : undefined}
        >
          {props.children}
        </DrawerClose>
      )}
    >
      {() => (
        <div aria-current="page" className={className}>
          {props.children}
        </div>
      )}
    </Show>
  );
}

const getBreadcrumbAriaLabel = (item: BreadcrumbItem) =>
  item.disabledReason ? `${item.label}: ${item.disabledReason}` : item.label;

const getActionAriaLabel = (action: TopBarMenuAction) =>
  action.disabledReason ? `${action.label}: ${action.disabledReason}` : action.label;

function ResponsiveGameSwitcherContent({ value }: PresentContentProps<GameSwitcherProps>) {
  return (
    <section className="grid gap-1">
      <h2 className="px-2 text-xs font-semibold text-(--ui-muted-text)">{value.label}</h2>
      <GameSwitcher {...value} context={gameSwitcherContexts.breadcrumbs} />
    </section>
  );
}

function DesktopTopBarMenu(props: TopBarDropdownMenuProps & { blocked: boolean }) {
  const { controllerFocusVisible } = useUiRootContext();
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
      open={props.open}
      disabled={props.blocked}
      sourceFocusTarget={props.sourceFocusTarget}
      onOpenChange={menuChangeEmitter.methods.handleOpenChange}
    >
      <MenuTrigger
        aria-label={props.label}
        disabled={props.blocked}
        appearance={uiControlPresentationModes.icon}
        data-ui-focus-target={props.sourceFocusTarget}
      >
        <MenuIcon aria-hidden="true" size="small" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner align={uiFloatingAlignments.end}>
          <MenuPopup className="w-[min(24rem,calc(100vw-1rem))]">
            <MenuGroup>
              {props.actions.map((action) => (
                <MenuItem
                  key={action.id}
                  value={action.id}
                  tone={action.tone}
                  data-ui-focus-target={action.id}
                  aria-label={getActionAriaLabel(action)}
                  disabled={!action.available || props.blocked}
                  onRequestSelect={() => actionEmitter.methods.emitAction(action.id)}
                  data-controller-focused={
                    controllerFocusVisible && props.controllerFocusedActionId === action.id
                      ? "true"
                      : undefined
                  }
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
  const { controllerFocusVisible } = useUiRootContext();
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
  const showResponsiveNavigation = props.layoutMode === uiResponsiveModes.mobile;

  return (
    <DrawerRoot
      open={props.open}
      sourceFocusTarget={props.sourceFocusTarget}
      swipeDirection={drawerSwipeDirections.right}
      onOpenChange={menuChangeEmitter.methods.handleOpenChange}
    >
      <DrawerTrigger
        aria-label={props.label}
        disabled={props.blocked}
        appearance={uiControlPresentationModes.icon}
        data-ui-focus-target={props.sourceFocusTarget}
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
              <Show when={showResponsiveNavigation}>
                {() => (
                  <Present value={props.responsiveGameSwitcher}>
                    {ResponsiveGameSwitcherContent}
                  </Present>
                )}
              </Show>
              <Show when={showResponsiveNavigation && Boolean(props.breadcrumbs?.length)}>
                {() => (
                  <section className="grid gap-1">
                    <h2 className="px-2 text-xs font-semibold text-(--ui-muted-text)">
                      {navigationLabel}
                    </h2>
                    {props.breadcrumbs?.map((item) => (
                      <DrawerAction
                        key={item.id}
                        current={item.current}
                        action={`breadcrumb:${item.id}`}
                        ariaLabel={getBreadcrumbAriaLabel(item)}
                        sourceFocusTarget={props.sourceFocusTarget}
                        onRequestAction={actionEmitter.methods.emitAction}
                        disabled={item.disabled || !item.target || props.blocked}
                        controllerFocused={
                          controllerFocusVisible &&
                          props.controllerFocusedActionId === `breadcrumb:${item.id}`
                        }
                      >
                        <BreadcrumbItemContent item={item} />
                      </DrawerAction>
                    ))}
                  </section>
                )}
              </Show>
              <section className="grid gap-1 border-t border-(--ui-separator) pt-2">
                {actions.map((action) => (
                  <DrawerAction
                    key={action.id}
                    action={action.id}
                    tone={action.tone}
                    ariaLabel={getActionAriaLabel(action)}
                    disabled={!action.available || props.blocked}
                    sourceFocusTarget={props.sourceFocusTarget}
                    onRequestAction={actionEmitter.methods.emitAction}
                    controllerFocused={
                      controllerFocusVisible && props.controllerFocusedActionId === action.id
                    }
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
      <Show
        when={props.layoutMode === uiResponsiveModes.desktop}
        fallback={() => <ResponsiveTopBarDrawer {...props} blocked={blocked} />}
      >
        {() => <DesktopTopBarMenu {...props} blocked={blocked} />}
      </Show>
    </div>
  );
}

TopBarDropdownMenu.displayName = "TopBarDropdownMenu";
