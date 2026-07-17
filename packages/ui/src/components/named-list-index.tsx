import { EditIcon } from "../icons/edit";
import { PlusIcon } from "../icons/plus";
import { Trash2Icon } from "../icons/trash-2";
import { Button, IconButton } from "../primitives/button";
import { Present, type PresentContentProps, Show } from "../primitives/conditional";
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

type NamedListIndexEmptyStateContentValue = Readonly<{
  emitEmpty: (intent: EmptyStateIntent) => void;
  model: EmptyStateModel;
  sourceFocusTarget: string | undefined;
  sourceSurface: string;
}>;

function NamedListIndexEmptyStateContent({
  value,
}: PresentContentProps<NamedListIndexEmptyStateContentValue>) {
  return (
    <EmptyState
      {...value.model}
      onRequestAction={value.emitEmpty}
      sourceSurface={value.sourceSurface}
      sourceFocusTarget={value.sourceFocusTarget}
    />
  );
}

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
  const emptyStateContentValue =
    !props.loading && props.items.length === 0 && props.emptyState
      ? {
          emitEmpty,
          model: props.emptyState,
          sourceFocusTarget: props.sourceFocusTarget,
          sourceSurface: props.sourceSurface,
        }
      : undefined;

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
      <Show when={Boolean(props.loading)}>
        {() => <LoadingIndicator label="Loading named lists" />}
      </Show>
      <Present value={emptyStateContentValue}>{NamedListIndexEmptyStateContent}</Present>
      <Show when={props.items.length > 0}>
        {() => (
          <ul className="grid min-w-0 list-none gap-2 p-0">
            {props.items.map((item) => (
              <li
                key={item.summary.id}
                className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-2"
              >
                <SelectableItem
                  value={item.summary.id}
                  className="grid-cols-[1fr_auto] px-3 py-2"
                  current={item.summary.id === props.selectedListId}
                  controllerFocused={item.summary.id === props.focusedListId}
                  onRequestFocus={() => emit(namedListIndexActions.focusList, item.summary.id)}
                  onRequestPress={() => emit(namedListIndexActions.selectList, item.summary.id)}
                >
                  <span className="truncate text-start font-semibold">{item.summary.name}</span>
                  <span className="text-xs text-(--ui-muted-text)">{item.summary.itemCount}</span>
                </SelectableItem>
                <Group>
                  <Show when={Boolean(item.renameAction)}>
                    {() => (
                      <IconButton
                        label={item.renameAction?.label ?? ""}
                        disabled={item.renameAction?.available !== true}
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
                  </Show>
                  <Show when={Boolean(item.deleteAction)}>
                    {() => (
                      <IconButton
                        label={item.deleteAction?.label ?? ""}
                        disabled={item.deleteAction?.available !== true}
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
                  </Show>
                </Group>
              </li>
            ))}
          </ul>
        )}
      </Show>
    </nav>
  );
}

NamedListIndex.displayName = "NamedListIndex";
