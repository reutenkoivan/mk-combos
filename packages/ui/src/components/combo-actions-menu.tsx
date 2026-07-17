import type { ComboRef } from "@mk-combos/contracts/identity/type";

import { MenuIcon } from "../icons/menu";
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
import type { ComponentActionDescriptor, ComponentActionIntent } from "./type";
import { componentInteractionReasons } from "./value";

export const comboActionsMenuActions = {
  closeActions: "closeActions",
  openActions: "openActions",
  returnFocusToDetail: "returnFocusToDetail",
  selectComboAction: "selectComboAction",
} as const;

export type ComboActionsMenuAction =
  (typeof comboActionsMenuActions)[keyof typeof comboActionsMenuActions];

export const comboActionsMenuStates = {
  busy: "busy",
  closed: "closed",
  disabled: "disabled",
  open: "open",
} as const;

export type ComboActionsMenuState =
  (typeof comboActionsMenuStates)[keyof typeof comboActionsMenuStates];

export type ComboActionsMenuIntent = ComponentActionIntent<ComboActionsMenuAction> & {
  actionId?: string;
  comboRef: ComboRef;
};

export type ComboActionsMenuProps = {
  actions: readonly ComponentActionDescriptor[];
  comboRef: ComboRef;
  label: string;
  menuState: ComboActionsMenuState;
  onRequestAction?: (intent: ComboActionsMenuIntent) => void;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function ComboActionsMenu(props: ComboActionsMenuProps) {
  const blocked =
    props.menuState === comboActionsMenuStates.disabled ||
    props.menuState === comboActionsMenuStates.busy;
  const open = props.menuState === comboActionsMenuStates.open;

  return (
    <div data-menu-state={props.menuState} data-ui-component="UI-CMP-018">
      <MenuRoot
        open={open}
        disabled={blocked}
        sourceFocusTarget={props.sourceFocusTarget}
        onOpenChange={({ open: nextOpen, reason, sourceFocusTarget }) =>
          props.onRequestAction?.({
            action: nextOpen
              ? comboActionsMenuActions.openActions
              : comboActionsMenuActions.closeActions,
            comboRef: props.comboRef,
            reason,
            sourceFocusTarget: sourceFocusTarget ?? props.sourceFocusTarget,
            sourceSurface: props.sourceSurface,
          })
        }
      >
        <MenuTrigger aria-label={props.label} disabled={blocked}>
          <MenuIcon aria-hidden="true" size="small" />
          {props.label}
        </MenuTrigger>
        <MenuPortal>
          <MenuPositioner align={uiFloatingAlignments.end}>
            <MenuPopup aria-label={props.label}>
              {props.actions.map((descriptor) => (
                <MenuItem
                  key={descriptor.id}
                  value={descriptor.id}
                  label={descriptor.label}
                  disabled={!descriptor.available || blocked}
                  onRequestSelect={() =>
                    props.onRequestAction?.({
                      action: comboActionsMenuActions.selectComboAction,
                      actionId: descriptor.id,
                      comboRef: props.comboRef,
                      reason: componentInteractionReasons.itemPress,
                      sourceFocusTarget: props.sourceFocusTarget,
                      sourceSurface: props.sourceSurface,
                    })
                  }
                >
                  <span className="grid min-w-0 gap-1">
                    <span>{descriptor.label}</span>
                    <Show when={Boolean(!descriptor.available && descriptor.disabledReason)}>
                      {() => (
                        <span className="text-xs text-(--ui-muted-text)">
                          {descriptor.disabledReason}
                        </span>
                      )}
                    </Show>
                  </span>
                </MenuItem>
              ))}
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
    </div>
  );
}

ComboActionsMenu.displayName = "ComboActionsMenu";
