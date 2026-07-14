import type { ComboRef } from "@mk-combos/contracts/identity/type";
import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { Button } from "../primitives/button";
import { Group, Stack } from "../primitives/layout";
import { Badge } from "../primitives/state";
import { cx } from "../recipes/class-name";
import { uiToneModes } from "../tokens/value";
import {
  NotationRenderer,
  type NotationRendererDensity,
  notationRendererDensities,
} from "./notation-renderer";
import type {
  ComboPresentationSummary,
  ComponentActionDescriptor,
  ComponentActionIntent,
} from "./type";
import { componentInteractionReasons } from "./value";

export const comboCardActions = {
  addToList: "addToList",
  duplicateToCustomCombo: "duplicateToCustomCombo",
  focusAction: "focusAction",
  focusCard: "focusCard",
  openContextualActions: "openContextualActions",
  openDetail: "openDetail",
  returnFocusToList: "returnFocusToList",
} as const;

export type ComboCardAction = (typeof comboCardActions)[keyof typeof comboCardActions];

export const comboCardActionKinds = {
  addToList: "addToList",
  duplicateToCustomCombo: "duplicateToCustomCombo",
  focusAction: "focusAction",
  openContextualActions: "openContextualActions",
  openDetail: "openDetail",
  returnFocusToList: "returnFocusToList",
} as const;

export type ComboCardActionKind = (typeof comboCardActionKinds)[keyof typeof comboCardActionKinds];

export type ComboCardActionDescriptor = ComponentActionDescriptor & {
  kind: ComboCardActionKind;
};

export type ComboCardModel = {
  actions: readonly ComboCardActionDescriptor[];
  disabledReason?: string;
  focused?: boolean;
  selected?: boolean;
  summary: ComboPresentationSummary;
};

export type ComboCardIntent = ComponentActionIntent<ComboCardAction> & {
  actionId?: string;
  comboRef: ComboRef;
};

export type ComboCardProps = ComboCardModel & {
  busy?: boolean;
  density?: NotationRendererDensity;
  notationDisplayMode: NotationDisplayMode;
  onRequestAction?: (intent: ComboCardIntent) => void;
  sourceFocusTarget?: string;
  sourceSurface: string;
};

export function ComboCard(props: ComboCardProps) {
  const disabled = Boolean(props.disabledReason || props.busy);
  const emit = (action: ComboCardAction, actionId?: string) =>
    props.onRequestAction?.({
      action,
      actionId,
      comboRef: props.summary.ref,
      reason:
        action === comboCardActions.focusCard
          ? componentInteractionReasons.triggerFocus
          : componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });

  return (
    <article
      aria-busy={props.busy || undefined}
      aria-current={props.selected || undefined}
      aria-disabled={disabled || undefined}
      aria-label={props.summary.accessibleLabel}
      className={cx(
        "grid min-w-0 gap-3 rounded-(--ui-radius-surface) bg-(--ui-content) p-3 outline-none focus-visible:shadow-(--ui-focus-ring)",
        props.selected && "bg-(--ui-selection-muted)",
        props.focused && "shadow-(--ui-focus-ring)",
        disabled && "opacity-70",
      )}
      data-combo-id={props.summary.ref.comboId}
      data-ui-component="UI-CMP-011"
      onFocus={(event) => {
        if (event.target === event.currentTarget) {
          emit(comboCardActions.focusCard);
        }
      }}
      tabIndex={disabled ? -1 : 0}
    >
      <Stack>
        <h3 className="truncate font-semibold">{props.summary.title}</h3>
        <NotationRenderer
          accessibleLabel={props.summary.accessibleLabel}
          density={props.density ?? notationRendererDensities.list}
          notation={props.summary.notation}
          notationDisplayMode={props.notationDisplayMode}
        />
        {props.summary.contextItems.length > 0 && (
          <Group>
            {props.summary.contextItems.map((item) => (
              <Badge key={item.id} tone={item.tone ?? uiToneModes.neutral}>
                {item.label}: {item.value}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
      {props.summary.metadataItems.length > 0 && (
        <Group>
          {props.summary.metadataItems.map((item) => (
            <Badge key={item.id} tone={item.tone ?? uiToneModes.neutral}>
              {item.label}: {item.value}
            </Badge>
          ))}
        </Group>
      )}
      {props.summary.notesSnippet && (
        <p className="text-sm text-(--ui-muted-text)">{props.summary.notesSnippet}</p>
      )}
      {props.summary.membershipHint && (
        <p className="text-xs text-(--ui-muted-text)">{props.summary.membershipHint}</p>
      )}
      {props.disabledReason && (
        <p className="text-xs text-(--ui-destructive)">{props.disabledReason}</p>
      )}
      {props.actions.length > 0 && (
        <Group>
          {props.actions.map((descriptor) => (
            <Button
              disabled={disabled || !descriptor.available}
              key={descriptor.id}
              onRequestPress={() => emit(comboCardActions[descriptor.kind], descriptor.id)}
              tone={descriptor.tone ?? uiToneModes.neutral}
            >
              {descriptor.label}
              {!descriptor.available && descriptor.disabledReason && (
                <span className="sr-only">: {descriptor.disabledReason}</span>
              )}
            </Button>
          ))}
        </Group>
      )}
    </article>
  );
}

ComboCard.displayName = "ComboCard";
