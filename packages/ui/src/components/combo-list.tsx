import type { ComboRef } from "@mk-combos/contracts/identity/type";
import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { LoadingIndicator, StatusMessage } from "../primitives/state";
import {
  ComboCard,
  type ComboCardAction,
  type ComboCardIntent,
  type ComboCardModel,
} from "./combo-card";
import { EmptyState, type EmptyStateIntent, type EmptyStateModel } from "./empty-state";
import type { ComponentActionIntent } from "./type";

export const comboListActions = {
  addToList: "addToList",
  clearFilters: "clearFilters",
  duplicateToCustomCombo: "duplicateToCustomCombo",
  focusCombo: "focusCombo",
  openComboActions: "openComboActions",
  openComboDetail: "openComboDetail",
  returnFocusToConfig: "returnFocusToConfig",
} as const;

export type ComboListAction = (typeof comboListActions)[keyof typeof comboListActions];

export const comboListStates = {
  comboListReady: "comboListReady",
  contextIncomplete: "contextIncomplete",
  filteredList: "filteredList",
  listDisabled: "listDisabled",
  loadingCombos: "loadingCombos",
  noCombos: "noCombos",
  noFilterResults: "noFilterResults",
} as const;

export type ComboListState = (typeof comboListStates)[keyof typeof comboListStates];

export type ComboListIntent = ComponentActionIntent<ComboListAction> & {
  actionId?: string;
  comboRef?: ComboRef;
};

export type ComboListProps = {
  accessibleLabel: string;
  emptyState?: EmptyStateModel;
  items: readonly ComboCardModel[];
  notationDisplayMode: NotationDisplayMode;
  onRequestAction?: (intent: ComboListIntent) => void;
  sourceFocusTarget?: string;
  sourceSurface: string;
  state: ComboListState;
  statusMessage?: string;
};

const cardActionMap = {
  addToList: comboListActions.addToList,
  duplicateToCustomCombo: comboListActions.duplicateToCustomCombo,
  focusAction: comboListActions.focusCombo,
  focusCard: comboListActions.focusCombo,
  openContextualActions: comboListActions.openComboActions,
  openDetail: comboListActions.openComboDetail,
  returnFocusToList: comboListActions.returnFocusToConfig,
} as const satisfies Record<ComboCardAction, ComboListAction>;

function resolveComboListPresentation(state: ComboListState) {
  switch (state) {
    case comboListStates.comboListReady:
    case comboListStates.filteredList:
    case comboListStates.listDisabled:
      return { renderEmptyState: false, renderItems: true } as const;
    case comboListStates.loadingCombos:
      return { renderEmptyState: false, renderItems: true } as const;
    case comboListStates.contextIncomplete:
    case comboListStates.noCombos:
    case comboListStates.noFilterResults:
      return { renderEmptyState: true, renderItems: false } as const;
  }

  const unhandledState: never = state;
  return unhandledState;
}

export function ComboList(props: ComboListProps) {
  const loading = props.state === comboListStates.loadingCombos;
  const presentation = resolveComboListPresentation(props.state);
  const disabled =
    loading ||
    props.state === comboListStates.contextIncomplete ||
    props.state === comboListStates.listDisabled;
  const emitCardAction = (intent: ComboCardIntent) =>
    props.onRequestAction?.({
      action: cardActionMap[intent.action],
      actionId: intent.actionId,
      comboRef: intent.comboRef,
      reason: intent.reason,
      sourceFocusTarget: intent.sourceFocusTarget,
      sourceSurface: intent.sourceSurface,
    });
  const emitEmptyAction = (intent: EmptyStateIntent) =>
    props.onRequestAction?.({
      action:
        intent.actionId === comboListActions.clearFilters
          ? comboListActions.clearFilters
          : comboListActions.returnFocusToConfig,
      actionId: intent.actionId,
      reason: intent.reason,
      sourceFocusTarget: intent.sourceFocusTarget,
      sourceSurface: intent.sourceSurface,
    });

  return (
    <section
      aria-busy={loading || undefined}
      aria-label={props.accessibleLabel}
      className="grid min-w-0 gap-3"
      data-list-state={props.state}
      data-ui-component="UI-CMP-010"
    >
      {loading && <LoadingIndicator label={props.statusMessage ?? "Loading combos"} />}
      {!loading && props.statusMessage && <StatusMessage>{props.statusMessage}</StatusMessage>}
      {presentation.renderEmptyState && props.emptyState && (
        <EmptyState
          {...props.emptyState}
          onRequestAction={emitEmptyAction}
          sourceFocusTarget={props.sourceFocusTarget}
          sourceSurface={props.sourceSurface}
        />
      )}
      {presentation.renderItems && props.items.length > 0 && (
        <ul className="grid min-w-0 list-none gap-3 p-0">
          {props.items.map((model) => (
            <li key={`${model.summary.ref.source}-${model.summary.ref.comboId}`}>
              <ComboCard
                {...model}
                busy={loading}
                disabledReason={
                  model.disabledReason ?? (disabled ? props.statusMessage : undefined)
                }
                notationDisplayMode={props.notationDisplayMode}
                onRequestAction={emitCardAction}
                sourceFocusTarget={props.sourceFocusTarget}
                sourceSurface={props.sourceSurface}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

ComboList.displayName = "ComboList";
