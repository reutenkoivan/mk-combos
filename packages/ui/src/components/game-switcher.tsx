import { useId } from "react";

import { useFieldMessage } from "../hooks/field-message";
import { useComponentOpenChangeEmitter, useComponentValueEmitter } from "../hooks/intents";
import { ChevronDownIcon } from "../icons/chevron-down";
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
import { uiSelectionStates, uiToneModes } from "../tokens/value";
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
      aria-busy={props.busy || undefined}
      className={
        props.context === gameSwitcherContexts.firstLaunch
          ? "grid min-w-0 gap-2 border-t border-(--ui-separator) py-4"
          : "grid min-w-0 gap-1"
      }
      data-context={props.context}
      data-ui-component="UI-CMP-002"
    >
      {props.context === gameSwitcherContexts.firstLaunch && (
        <span className="text-sm font-medium" id={labelId}>
          {props.label}
        </span>
      )}
      <MenuRoot
        disabled={blocked}
        onOpenChange={menuChangeEmitter.methods.handleOpenChange}
        open={props.menuOpen}
        sourceFocusTarget={props.sourceFocusTarget}
      >
        <MenuTrigger
          {...fieldMessage.methods.getControlProps()}
          aria-label={props.context === gameSwitcherContexts.breadcrumbs ? props.label : undefined}
          aria-labelledby={props.context === gameSwitcherContexts.firstLaunch ? labelId : undefined}
          className="max-w-full justify-between"
          disabled={blocked}
          tone={props.invalidSelectedGame ? uiToneModes.destructive : uiToneModes.neutral}
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
                    disabled={blocked || unavailable}
                    key={option.gameId}
                    label={option.label}
                    onRequestSelect={({ reason, value }) =>
                      valueEmitter.methods.emitValue(value, reason)
                    }
                    selection={
                      option.gameId === props.selectedGameId
                        ? uiSelectionStates.selected
                        : uiSelectionStates.none
                    }
                    value={option.gameId}
                  >
                    <span className="grid min-w-0 gap-1">
                      <span className="truncate">{option.label}</span>
                      {(option.description || option.disabledReason) && (
                        <span className="text-xs text-(--ui-muted-text)">
                          {option.disabledReason ?? option.description}
                        </span>
                      )}
                    </span>
                  </MenuItem>
                );
              })}
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
      {props.validationMessage && (
        <StatusMessage
          id={fieldMessage.state.messageId}
          tone={props.invalidSelectedGame ? uiToneModes.destructive : uiToneModes.neutral}
        >
          {props.validationMessage}
        </StatusMessage>
      )}
    </div>
  );
}

GameSwitcher.displayName = "GameSwitcher";
