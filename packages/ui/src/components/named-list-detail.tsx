import type { ComboRef } from "@mk-combos/contracts/identity/type";
import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { ChevronDownIcon } from "../icons/chevron-down";
import { ChevronUpIcon } from "../icons/chevron-up";
import { Trash2Icon } from "../icons/trash-2";
import { IconButton } from "../primitives/button";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
import { Group, Stack } from "../primitives/layout";
import {
  ComboCard,
  type ComboCardAction,
  type ComboCardActionDescriptor,
  type ComboCardIntent,
  type ComboCardModel,
} from "./combo-card";
import { EmptyState, type EmptyStateIntent, type EmptyStateModel } from "./empty-state";
import {
  StaleInvalidComboMarker,
  type StaleInvalidComboMarkerIntent,
  type StaleInvalidComboMarkerModel,
} from "./stale-invalid-combo-marker";
import type { ComponentActionIntent, NamedListSummary } from "./type";
import { componentInteractionReasons } from "./value";

export const namedListDetailActions = {
  focusListItem: "focusListItem",
  openAddToList: "openAddToList",
  openComboDetail: "openComboDetail",
  removeFromList: "removeFromList",
  reorderListItem: "reorderListItem",
} as const;

export type NamedListDetailAction =
  (typeof namedListDetailActions)[keyof typeof namedListDetailActions];

type NamedListDetailCardAction = Extract<ComboCardAction, "addToList" | "openDetail">;

export type NamedListDetailItem = {
  card: Omit<ComboCardModel, "actions"> & {
    actions: readonly (ComboCardActionDescriptor & { kind: NamedListDetailCardAction })[];
  };
  id: string;
  marker?: StaleInvalidComboMarkerModel;
  removeLabel: string;
  reorderDownLabel: string;
  reorderUpLabel: string;
};

export type NamedListDetailIntent = ComponentActionIntent<NamedListDetailAction> & {
  actionId?: string;
  comboRef?: ComboRef;
  itemId?: string;
  listId: string;
  targetIndex?: number;
};

export type NamedListDetailProps = {
  emptyState?: EmptyStateModel;
  focusedItemId?: string;
  items: readonly NamedListDetailItem[];
  list: NamedListSummary;
  notationDisplayMode: NotationDisplayMode;
  onRequestAction?: (intent: NamedListDetailIntent) => void;
  onRequestMarkerAction?: (intent: StaleInvalidComboMarkerIntent) => void;
  sourceFocusTarget?: string;
  sourceSurface: string;
  statusMessage?: string;
};

const cardActionMap = {
  addToList: namedListDetailActions.openAddToList,
  focusCard: namedListDetailActions.focusListItem,
  openDetail: namedListDetailActions.openComboDetail,
} as const satisfies Partial<Record<ComboCardAction, NamedListDetailAction>>;

type NamedListEmptyStateContentValue = Readonly<{
  emitEmpty: (intent: EmptyStateIntent) => void;
  model: EmptyStateModel;
  sourceFocusTarget: string | undefined;
  sourceSurface: string;
}>;

function NamedListEmptyStateContent({
  value,
}: PresentContentProps<NamedListEmptyStateContentValue>) {
  return (
    <EmptyState
      {...value.model}
      onRequestAction={value.emitEmpty}
      sourceSurface={value.sourceSurface}
      sourceFocusTarget={value.sourceFocusTarget}
    />
  );
}

type NamedListMarkerContentValue = Readonly<{
  marker: StaleInvalidComboMarkerModel;
  onRequestAction: NamedListDetailProps["onRequestMarkerAction"];
  sourceFocusTarget: string | undefined;
  sourceSurface: string;
}>;

function NamedListMarkerContent({ value }: PresentContentProps<NamedListMarkerContentValue>) {
  return (
    <StaleInvalidComboMarker
      {...value.marker}
      sourceSurface={value.sourceSurface}
      onRequestAction={value.onRequestAction}
      sourceFocusTarget={value.sourceFocusTarget}
    />
  );
}

export function NamedListDetail(props: NamedListDetailProps) {
  const emitCard = (item: NamedListDetailItem, intent: ComboCardIntent) => {
    const action = cardActionMap[intent.action as keyof typeof cardActionMap];
    if (!action) {
      return;
    }
    props.onRequestAction?.({
      action,
      actionId: intent.actionId,
      comboRef: intent.comboRef,
      itemId: item.id,
      listId: props.list.id,
      reason: intent.reason,
      sourceFocusTarget: intent.sourceFocusTarget,
      sourceSurface: intent.sourceSurface,
    });
  };
  const emitEmpty = (intent: EmptyStateIntent) =>
    props.onRequestAction?.({
      action: namedListDetailActions.openAddToList,
      actionId: intent.actionId,
      listId: props.list.id,
      reason: intent.reason,
      sourceFocusTarget: intent.sourceFocusTarget,
      sourceSurface: intent.sourceSurface,
    });
  const emptyStateContentValue =
    props.items.length === 0 && props.emptyState
      ? {
          emitEmpty,
          model: props.emptyState,
          sourceFocusTarget: props.sourceFocusTarget,
          sourceSurface: props.sourceSurface,
        }
      : undefined;

  return (
    <section className="grid min-w-0 gap-3" data-ui-component="UI-CMP-020">
      <Stack>
        <h2 className="text-lg font-semibold">{props.list.name}</h2>
        <span className="text-sm text-(--ui-muted-text)">{props.list.itemCount}</span>
        <Show when={Boolean(props.statusMessage)}>
          {() => <p className="text-sm text-(--ui-muted-text)">{props.statusMessage}</p>}
        </Show>
      </Stack>
      <Present value={emptyStateContentValue}>{NamedListEmptyStateContent}</Present>
      <Show when={props.items.length > 0}>
        {() => (
          <ul className="grid min-w-0 list-none gap-3 p-0">
            {props.items.map((item, index) => (
              <li className="grid min-w-0 gap-2" key={item.id}>
                <ComboCard
                  {...item.card}
                  sourceSurface={props.sourceSurface}
                  focused={item.id === props.focusedItemId}
                  sourceFocusTarget={props.sourceFocusTarget}
                  notationDisplayMode={props.notationDisplayMode}
                  onRequestAction={(intent) => emitCard(item, intent)}
                />
                <Group>
                  <IconButton
                    disabled={index === 0}
                    label={item.reorderUpLabel}
                    onRequestPress={() =>
                      props.onRequestAction?.({
                        action: namedListDetailActions.reorderListItem,
                        comboRef: item.card.summary.ref,
                        itemId: item.id,
                        listId: props.list.id,
                        reason: componentInteractionReasons.press,
                        sourceFocusTarget: props.sourceFocusTarget,
                        sourceSurface: props.sourceSurface,
                        targetIndex: index - 1,
                      })
                    }
                  >
                    <ChevronUpIcon aria-hidden="true" size="small" />
                  </IconButton>
                  <IconButton
                    label={item.reorderDownLabel}
                    disabled={index === props.items.length - 1}
                    onRequestPress={() =>
                      props.onRequestAction?.({
                        action: namedListDetailActions.reorderListItem,
                        comboRef: item.card.summary.ref,
                        itemId: item.id,
                        listId: props.list.id,
                        reason: componentInteractionReasons.press,
                        sourceFocusTarget: props.sourceFocusTarget,
                        sourceSurface: props.sourceSurface,
                        targetIndex: index + 1,
                      })
                    }
                  >
                    <ChevronDownIcon aria-hidden="true" size="small" />
                  </IconButton>
                  <IconButton
                    label={item.removeLabel}
                    onRequestPress={() =>
                      props.onRequestAction?.({
                        action: namedListDetailActions.removeFromList,
                        comboRef: item.card.summary.ref,
                        itemId: item.id,
                        listId: props.list.id,
                        reason: componentInteractionReasons.press,
                        sourceFocusTarget: props.sourceFocusTarget,
                        sourceSurface: props.sourceSurface,
                      })
                    }
                  >
                    <Trash2Icon aria-hidden="true" size="small" />
                  </IconButton>
                </Group>
                <Present
                  value={
                    item.marker
                      ? {
                          marker: item.marker,
                          onRequestAction: props.onRequestMarkerAction,
                          sourceFocusTarget: props.sourceFocusTarget,
                          sourceSurface: props.sourceSurface,
                        }
                      : undefined
                  }
                >
                  {NamedListMarkerContent}
                </Present>
              </li>
            ))}
          </ul>
        )}
      </Show>
    </section>
  );
}

NamedListDetail.displayName = "NamedListDetail";
