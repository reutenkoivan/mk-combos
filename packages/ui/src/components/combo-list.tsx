import type { ComboRef } from "@mk-combos/contracts/identity/type";
import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { Button } from "../primitives/button";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
import { LoadingIndicator, StatusMessage } from "../primitives/state";
import {
  ComboCard,
  type ComboCardAction,
  type ComboCardIntent,
  type ComboCardModel,
  comboCardActionKinds,
  comboCardActions,
} from "./combo-card";
import { EmptyState, type EmptyStateIntent, type EmptyStateModel } from "./empty-state";
import type { ComboPresentationMode, ComponentActionIntent } from "./type";
import { comboPresentationModes, componentInteractionReasons } from "./value";

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
  disabledReason?: string;
  emptyState?: EmptyStateModel;
  items: readonly ComboCardModel[];
  notationDisplayMode: NotationDisplayMode;
  onRequestAction?: (intent: ComboListIntent) => void;
  presentation?: ComboPresentationMode;
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

type ComboListEmptyStateValue = Readonly<{
  model: EmptyStateModel;
  onRequestAction: (intent: EmptyStateIntent) => void;
  sourceFocusTarget: string | undefined;
  sourceSurface: string;
}>;

function ComboListEmptyState({ value }: PresentContentProps<ComboListEmptyStateValue>) {
  return (
    <EmptyState
      {...value.model}
      sourceSurface={value.sourceSurface}
      onRequestAction={value.onRequestAction}
      sourceFocusTarget={value.sourceFocusTarget}
    />
  );
}

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
  const listDisabled = props.state === comboListStates.listDisabled;
  const presentation = props.presentation ?? comboPresentationModes.standard;
  const flat = presentation === comboPresentationModes.commandDeck;
  const statePresentation = resolveComboListPresentation(props.state);
  const disabled = loading || props.state === comboListStates.contextIncomplete || listDisabled;
  const visibleStatusMessage =
    props.statusMessage ?? (listDisabled ? props.disabledReason : undefined);
  const emitCardAction = (intent: ComboCardIntent) =>
    props.onRequestAction?.({
      action: cardActionMap[intent.action],
      actionId: intent.actionId,
      comboRef: intent.comboRef,
      reason: intent.reason,
      sourceFocusTarget: intent.sourceFocusTarget,
      sourceSurface: intent.sourceSurface,
    });
  const emitFlatRowAction = (
    model: ComboCardModel,
    action: typeof comboCardActions.focusCard | typeof comboCardActions.openDetail,
    actionId?: string,
  ) =>
    emitCardAction({
      action,
      actionId,
      comboRef: model.summary.ref,
      reason:
        action === comboCardActions.focusCard
          ? componentInteractionReasons.triggerFocus
          : componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
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
      data-list-state={props.state}
      aria-busy={loading || undefined}
      className="grid min-w-0 gap-3"
      data-ui-component="UI-CMP-010"
      aria-label={props.accessibleLabel}
      data-combo-presentation={presentation}
      aria-disabled={listDisabled || undefined}
    >
      <Show when={loading}>
        {() => <LoadingIndicator label={props.statusMessage ?? "Loading combos"} />}
      </Show>
      <Show when={Boolean(!loading && visibleStatusMessage)}>
        {() => <StatusMessage>{visibleStatusMessage}</StatusMessage>}
      </Show>
      <Present
        value={
          statePresentation.renderEmptyState && props.emptyState
            ? {
                model: props.emptyState,
                onRequestAction: emitEmptyAction,
                sourceFocusTarget: props.sourceFocusTarget,
                sourceSurface: props.sourceSurface,
              }
            : undefined
        }
      >
        {ComboListEmptyState}
      </Present>
      <Show when={statePresentation.renderItems && props.items.length > 0}>
        {() => (
          <ol
            className={
              presentation === comboPresentationModes.standard
                ? "grid min-w-0 list-none gap-3 p-0"
                : "grid min-w-0 list-none divide-y divide-(--ui-command-border) p-0"
            }
          >
            {props.items.map((model, index) => {
              const rowDetailAction = flat
                ? model.actions.find(
                    (descriptor) => descriptor.kind === comboCardActionKinds.openDetail,
                  )
                : undefined;
              const rowDisabled = Boolean(
                model.disabled || model.disabledReason || disabled || !rowDetailAction?.available,
              );

              return (
                <li
                  data-combo-index={index + 1}
                  key={`${model.summary.ref.source}-${model.summary.ref.comboId}`}
                  className={
                    flat
                      ? "relative grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] bg-(--ui-command-row) focus-within:shadow-(--ui-focus-ring)"
                      : "min-w-0"
                  }
                  onFocus={(event) => {
                    if (
                      event.target instanceof HTMLElement &&
                      event.target.dataset.comboRowAction === "open-detail"
                    ) {
                      emitFlatRowAction(model, comboCardActions.focusCard);
                    }
                  }}
                >
                  <Show when={Boolean(rowDetailAction)}>
                    {() => (
                      <Button
                        disabled={rowDisabled}
                        data-combo-row-action="open-detail"
                        aria-label={`${rowDetailAction?.label}: ${model.summary.accessibleLabel}`}
                        onRequestPress={() =>
                          emitFlatRowAction(model, comboCardActions.openDetail, rowDetailAction?.id)
                        }
                        className="peer absolute inset-0 z-0 h-auto min-w-0 rounded-none border-0 bg-transparent p-0 outline-none"
                      />
                    )}
                  </Show>
                  <Show when={flat}>
                    {() => (
                      <span
                        aria-hidden="true"
                        data-combo-visible-index
                        className="pointer-events-none relative z-10 grid min-h-11 place-items-center border-e border-(--ui-command-border) bg-(--ui-command-chrome) font-mono text-xs font-semibold text-(--ui-command-chrome-text)"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </Show>
                  <ComboCard
                    {...model}
                    busy={loading}
                    onRequestAction={emitCardAction}
                    disabled={model.disabled || disabled}
                    sourceSurface={props.sourceSurface}
                    sourceFocusTarget={props.sourceFocusTarget}
                    notationDisplayMode={props.notationDisplayMode}
                    presentation={model.presentation ?? presentation}
                  />
                </li>
              );
            })}
          </ol>
        )}
      </Show>
    </section>
  );
}

ComboList.displayName = "ComboList";
