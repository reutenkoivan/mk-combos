import { useId } from "react";

import { useFieldMessage } from "../hooks/field-message";
import { useComponentOpenChangeEmitter, useComponentValueEmitter } from "../hooks/intents";
import { ChevronDownIcon } from "../icons/chevron-down";
import { useUiRootContext } from "../internal/ui-root-context";
import { Show } from "../primitives/conditional";
import {
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "../primitives/menu";
import { uiFloatingAlignments } from "../primitives/positioning";
import { StatusMessage } from "../primitives/state";
import { uiEmphasisModes, uiSelectionStates, uiToneModes } from "../tokens/value";
import type { ComponentActionIntent, ComponentValueIntent, GameSwitcherOption } from "./type";
import { componentOptionStatuses } from "./value";

export const gameSwitcherMenuActions = {
  close: "close",
  open: "open",
} as const;

export type GameSwitcherMenuAction =
  (typeof gameSwitcherMenuActions)[keyof typeof gameSwitcherMenuActions];

export const gameSwitcherContexts = {
  breadcrumbs: "breadcrumbs",
  firstLaunch: "firstLaunch",
} as const;

export type GameSwitcherContext = (typeof gameSwitcherContexts)[keyof typeof gameSwitcherContexts];

export type GameSwitcherProps = {
  availableGames: readonly GameSwitcherOption[];
  busy?: boolean;
  controllerFocused?: boolean;
  controllerFocusedGameId?: string;
  context: GameSwitcherContext;
  disabled?: boolean;
  invalidSelectedGame?: boolean;
  label: string;
  menuOpen: boolean;
  onRequestMenuChange?: (intent: ComponentActionIntent<GameSwitcherMenuAction>) => void;
  onRequestSelectGame?: (intent: ComponentValueIntent<string>) => void;
  selectedGameId: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
  validationMessage?: string;
};

export function GameSwitcher(props: GameSwitcherProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const labelId = useId();
  const selected = props.availableGames.find((option) => option.gameId === props.selectedGameId);
  const blocked = Boolean(props.disabled || props.busy);
  const fieldMessage = useFieldMessage({
    hasMessage: Boolean(props.validationMessage),
    invalid: props.invalidSelectedGame,
  });
  const menuChangeEmitter = useComponentOpenChangeEmitter<GameSwitcherMenuAction>({
    closeAction: gameSwitcherMenuActions.close,
    onRequest: props.onRequestMenuChange,
    openAction: gameSwitcherMenuActions.open,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });
  const valueEmitter = useComponentValueEmitter<string>({
    onRequest: props.onRequestSelectGame,
    sourceFocusTarget: props.sourceFocusTarget,
    sourceSurface: props.sourceSurface,
  });

  return (
    <div
      data-context={props.context}
      data-ui-component="UI-CMP-002"
      aria-busy={props.busy || undefined}
      className={
        props.context === gameSwitcherContexts.firstLaunch
          ? "grid min-w-0 gap-2 border-t border-(--ui-separator) py-4"
          : "grid min-w-0 gap-1"
      }
    >
      <Show when={props.context === gameSwitcherContexts.firstLaunch}>
        {() => (
          <span className="text-sm font-medium" id={labelId}>
            {props.label}
          </span>
        )}
      </Show>
      <MenuRoot
        disabled={blocked}
        open={props.menuOpen}
        sourceFocusTarget={props.sourceFocusTarget}
        onOpenChange={menuChangeEmitter.methods.handleOpenChange}
      >
        <MenuTrigger
          {...fieldMessage.methods.getControlProps()}
          disabled={blocked}
          className="max-w-full justify-between"
          data-ui-focus-target={props.sourceFocusTarget}
          tone={props.invalidSelectedGame ? uiToneModes.destructive : uiToneModes.neutral}
          aria-label={props.context === gameSwitcherContexts.breadcrumbs ? props.label : undefined}
          aria-labelledby={props.context === gameSwitcherContexts.firstLaunch ? labelId : undefined}
          data-controller-focused={
            controllerFocusVisible && props.controllerFocused ? "true" : undefined
          }
          emphasis={
            props.context === gameSwitcherContexts.breadcrumbs
              ? uiEmphasisModes.subtle
              : uiEmphasisModes.normal
          }
        >
          <span className="truncate">
            {selected?.shortLabel ?? selected?.label ?? props.selectedGameId}
          </span>
          <ChevronDownIcon aria-hidden="true" size="small" />
        </MenuTrigger>
        <MenuPortal>
          <MenuPositioner align={uiFloatingAlignments.start}>
            <MenuPopup aria-label={props.label} className="max-w-[min(22rem,calc(100vw-2rem))]">
              {props.availableGames.map((option) => {
                const unavailable = option.status === componentOptionStatuses.disabledUnavailable;
                return (
                  <MenuItem
                    key={option.gameId}
                    label={option.label}
                    value={option.gameId}
                    disabled={blocked || unavailable}
                    onRequestSelect={({ reason, value }) =>
                      valueEmitter.methods.emitValue(value, reason)
                    }
                    data-ui-focus-target={`${props.sourceFocusTarget ?? "game-switcher"}:${option.gameId}`}
                    selection={
                      option.gameId === props.selectedGameId
                        ? uiSelectionStates.selected
                        : uiSelectionStates.none
                    }
                    data-controller-focused={
                      controllerFocusVisible && props.controllerFocusedGameId === option.gameId
                        ? "true"
                        : undefined
                    }
                  >
                    <span className="grid min-w-0 gap-1">
                      <span className="truncate">{option.label}</span>
                      <Show when={Boolean(option.description || option.disabledReason)}>
                        {() => (
                          <span className="text-xs text-(--ui-muted-text)">
                            {option.disabledReason ?? option.description}
                          </span>
                        )}
                      </Show>
                    </span>
                  </MenuItem>
                );
              })}
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
      <Show when={Boolean(props.validationMessage)}>
        {() => (
          <StatusMessage
            id={fieldMessage.state.messageId}
            tone={props.invalidSelectedGame ? uiToneModes.destructive : uiToneModes.neutral}
          >
            {props.validationMessage}
          </StatusMessage>
        )}
      </Show>
    </div>
  );
}

GameSwitcher.displayName = "GameSwitcher";
