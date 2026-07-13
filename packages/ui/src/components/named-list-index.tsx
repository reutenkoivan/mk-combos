import { EditIcon } from "../icons/edit";
import { PlusIcon } from "../icons/plus";
import { Trash2Icon } from "../icons/trash-2";
import { Button, IconButton } from "../primitives/button";
import { Group } from "../primitives/layout";
import { LoadingIndicator } from "../primitives/state";
import { EmptyState, type EmptyStateIntent, type EmptyStateModel } from "./empty-state";
import { SelectableItem } from "./internal/selectable-item";
import type { ComponentActionDescriptor, ComponentActionIntent, NamedListSummary } from "./type";
import { componentInteractionReasons } from "./value";

export const namedListIndexActions = {
  focusList: "focusList",
  openCreateList: "openCreateList",
  openDeleteListConfirm: "openDeleteListConfirm",
  openRenameList: "openRenameList",
  selectList: "selectList",
} as const;

export type NamedListIndexAction =
  (typeof namedListIndexActions)[keyof typeof namedListIndexActions];

export type NamedListIndexItem = {
  deleteAction?: ComponentActionDescriptor;
  renameAction?: ComponentActionDescriptor;
  summary: NamedListSummary;
};

export type NamedListIndexIntent = ComponentActionIntent<NamedListIndexAction> & {
  actionId?: string;
  listId?: string;
};

export type NamedListIndexProps = {
  createAction: ComponentActionDescriptor;
  emptyState?: EmptyStateModel;
  focusedListId?: string;
  items: readonly NamedListIndexItem[];
  loading?: boolean;
  onRequestAction?: (intent: NamedListIndexIntent) => void;
  selectedListId?: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function NamedListIndex(props: NamedListIndexProps) {
  const emit = (action: NamedListIndexAction, listId?: string, actionId?: string) =>
    props.onRequestAction?.({
      action,
      actionId,
      listId,
      reason:
        action === namedListIndexActions.focusList
          ? componentInteractionReasons.triggerFocus
          : componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });
  const emitEmpty = (intent: EmptyStateIntent) =>
    props.onRequestAction?.({
      action: namedListIndexActions.openCreateList,
      actionId: intent.actionId,
      reason: intent.reason,
      sourceFocusTarget: intent.sourceFocusTarget,
      sourceSurface: intent.sourceSurface,
    });

  return (
    <nav aria-label="Named lists" className="grid min-w-0 gap-3" data-ui-component="UI-CMP-019">
      <Button
        disabled={!props.createAction.available || props.loading}
        onRequestPress={() =>
          emit(namedListIndexActions.openCreateList, undefined, props.createAction.id)
        }
      >
        <PlusIcon aria-hidden="true" size="small" />
        {props.createAction.label}
      </Button>
      {props.loading && <LoadingIndicator label="Loading named lists" />}
      {!props.loading && props.items.length === 0 && props.emptyState && (
        <EmptyState
          {...props.emptyState}
          onRequestAction={emitEmpty}
          sourceFocusTarget={props.sourceFocusTarget}
          sourceSurface={props.sourceSurface}
        />
      )}
      {props.items.length > 0 && (
        <ul className="grid min-w-0 list-none gap-2 p-0">
          {props.items.map((item) => (
            <li
              className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-2"
              key={item.summary.id}
            >
              <SelectableItem
                className="grid-cols-[1fr_auto] px-3 py-2"
                current={item.summary.id === props.selectedListId}
                onRequestFocus={() => emit(namedListIndexActions.focusList, item.summary.id)}
                onRequestPress={() => emit(namedListIndexActions.selectList, item.summary.id)}
                selected={item.summary.id === props.focusedListId}
                value={item.summary.id}
              >
                <span className="truncate text-start font-semibold">{item.summary.name}</span>
                <span className="text-xs text-[var(--ui-muted-text)]">
                  {item.summary.itemCount}
                </span>
              </SelectableItem>
              <Group>
                {item.renameAction && (
                  <IconButton
                    disabled={!item.renameAction.available}
                    label={item.renameAction.label}
                    onRequestPress={() =>
                      emit(
                        namedListIndexActions.openRenameList,
                        item.summary.id,
                        item.renameAction?.id,
                      )
                    }
                  >
                    <EditIcon aria-hidden="true" size="small" />
                  </IconButton>
                )}
                {item.deleteAction && (
                  <IconButton
                    disabled={!item.deleteAction.available}
                    label={item.deleteAction.label}
                    onRequestPress={() =>
                      emit(
                        namedListIndexActions.openDeleteListConfirm,
                        item.summary.id,
                        item.deleteAction?.id,
                      )
                    }
                  >
                    <Trash2Icon aria-hidden="true" size="small" />
                  </IconButton>
                )}
              </Group>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

NamedListIndex.displayName = "NamedListIndex";
