import type { ComboRef } from "@mk-combos/contracts/identity/type";
import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";

import { AddToListIcon } from "../icons/add-to-list";
import { DuplicateIcon } from "../icons/duplicate";
import { MenuIcon } from "../icons/menu";
import { ReturnIcon } from "../icons/return";
import { ViewDetailIcon } from "../icons/view-detail";
import { useUiRootContext } from "../internal/ui-root-context";
import { Button } from "../primitives/button";
import { Show } from "../primitives/conditional";
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
  ComboPresentationMode,
  ComboPresentationSummary,
  ComponentActionDescriptor,
  ComponentActionIntent,
} from "./type";
import { comboPresentationModes, componentInteractionReasons } from "./value";

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
  disabled?: boolean;
  disabledReason?: string;
  focused?: boolean;
  presentation?: ComboPresentationMode;
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

const comboMetadataToneTextClasses = {
  [uiToneModes.accent]: "text-[color-mix(in_srgb,var(--ui-accent-strong)_90%,var(--ui-text)_10%)]",
  [uiToneModes.destructive]:
    "text-[color-mix(in_srgb,var(--ui-destructive)_90%,var(--ui-text)_10%)]",
  [uiToneModes.neutral]: "text-(--ui-text)",
  [uiToneModes.success]: "text-[color-mix(in_srgb,var(--ui-success)_90%,var(--ui-text)_10%)]",
  [uiToneModes.warning]: "text-[color-mix(in_srgb,var(--ui-warning)_90%,var(--ui-text)_10%)]",
} as const;

function ComboMetadataToneValue(props: {
  tone: NonNullable<ComboPresentationSummary["metadataItems"][number]["tone"]>;
  value: string;
}) {
  return (
    <span
      data-combo-metadata-tone={props.tone}
      className={cx("break-words", comboMetadataToneTextClasses[props.tone])}
    >
      {props.value}
    </span>
  );
}

function renderComboCardActionIcon(kind: ComboCardActionKind) {
  switch (kind) {
    case comboCardActionKinds.addToList:
      return <AddToListIcon aria-hidden="true" size="small" />;
    case comboCardActionKinds.duplicateToCustomCombo:
      return <DuplicateIcon aria-hidden="true" size="small" />;
    case comboCardActionKinds.openContextualActions:
      return <MenuIcon aria-hidden="true" size="small" />;
    case comboCardActionKinds.openDetail:
      return <ViewDetailIcon aria-hidden="true" size="small" />;
    case comboCardActionKinds.returnFocusToList:
      return <ReturnIcon aria-hidden="true" size="small" />;
    case comboCardActionKinds.focusAction:
      return null;
  }

  const unhandledKind: never = kind;
  return unhandledKind;
}

function FlatMetadataValue(props: {
  item: ComboPresentationSummary["metadataItems"][number];
  primary: boolean;
  sizeClass: string;
}) {
  return (
    <dd
      data-combo-primary-metric={props.primary ? "true" : undefined}
      className={cx(
        "break-words font-(--ui-font-display) font-semibold uppercase leading-none",
        props.sizeClass,
        props.primary && !props.item.tone && "text-(--ui-command-accent)",
      )}
    >
      <Show fallback={() => props.item.value} when={Boolean(props.item.tone)}>
        {() => (
          <ComboMetadataToneValue
            value={props.item.value}
            tone={props.item.tone ?? uiToneModes.neutral}
          />
        )}
      </Show>
    </dd>
  );
}

function StandardMetadataItem(props: { item: ComboPresentationSummary["metadataItems"][number] }) {
  return (
    <Show
      when={Boolean(props.item.tone)}
      fallback={() => (
        <Badge
          tone={uiToneModes.neutral}
          data-combo-metadata-id={props.item.id}
          className="h-auto min-h-5.5 max-w-full shrink whitespace-normal break-words py-1 text-start leading-snug"
        >
          <span className="break-words leading-snug">
            {props.item.label}: {props.item.value}
          </span>
        </Badge>
      )}
    >
      {() => (
        <div
          data-combo-metadata-id={props.item.id}
          className="inline-flex min-w-0 max-w-full shrink items-baseline gap-1 font-medium leading-snug"
        >
          <span className="break-words text-(--ui-muted-text)" data-combo-metadata-label>
            {props.item.label}:
          </span>
          <ComboMetadataToneValue
            value={props.item.value}
            tone={props.item.tone ?? uiToneModes.neutral}
          />
        </div>
      )}
    </Show>
  );
}

export function ComboCard(props: ComboCardProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const disabled = Boolean(props.disabled || props.disabledReason || props.busy);
  const controllerFocused = controllerFocusVisible && props.focused;
  const presentation = props.presentation ?? comboPresentationModes.standard;
  const commandDeck = presentation === comboPresentationModes.commandDeck;
  const flat = commandDeck;
  const localDetailAction = flat
    ? props.actions.find((descriptor) => descriptor.kind === comboCardActionKinds.openDetail)
    : undefined;
  const rowOverlayOwned = Boolean(localDetailAction);
  const supportingActions = flat
    ? props.actions.filter((descriptor) => descriptor !== localDetailAction)
    : props.actions;
  const disabledReasonActions = props.actions.filter(
    (descriptor) => !descriptor.available && descriptor.disabledReason,
  );
  const flatMetadataItems = props.summary.metadataItems;
  const hasMetrics = flatMetadataItems.length > 0;
  const flatGridClass =
    commandDeck && hasMetrics
      ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,0.35fr)]"
      : "grid-cols-1";
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
      data-ui-component="UI-CMP-011"
      aria-busy={props.busy || undefined}
      aria-disabled={disabled || undefined}
      data-combo-presentation={presentation}
      aria-current={props.selected || undefined}
      data-combo-id={props.summary.ref.comboId}
      tabIndex={disabled || rowOverlayOwned ? -1 : 0}
      aria-label={props.summary.accessibleLabel}
      data-controller-focused={controllerFocused ? "true" : undefined}
      onFocus={(event) => {
        if (event.target === event.currentTarget) {
          emit(comboCardActions.focusCard);
        }
      }}
      className={cx(
        "grid min-w-0 outline-none focus-visible:shadow-(--ui-focus-ring)",
        flat && "relative z-10 overflow-hidden rounded-none",
        rowOverlayOwned &&
          "pointer-events-none peer-hover:brightness-[1.02] peer-active:brightness-[0.98]",
        commandDeck && "bg-(--ui-command-row)",
        flat && flatGridClass,
        !flat && "gap-3 rounded-(--ui-radius-surface) bg-(--ui-content) p-3",
        props.selected &&
          (flat
            ? "bg-[color-mix(in_srgb,var(--ui-command-accent-fill)_14%,var(--ui-command-surface))]"
            : "bg-(--ui-selection-muted)"),
        controllerFocused && !flat && "shadow-(--ui-focus-ring)",
        disabled && "opacity-70",
      )}
    >
      <Show
        when={flat}
        fallback={() => (
          <>
            <Stack>
              <h3 className="break-words font-semibold leading-snug">{props.summary.title}</h3>
              <NotationRenderer
                notation={props.summary.notation}
                routeSteps={props.summary.routeSteps}
                accessibleLabel={props.summary.accessibleLabel}
                notationDisplayMode={props.notationDisplayMode}
                density={props.density ?? notationRendererDensities.list}
              />
              <Show when={props.summary.contextItems.length > 0}>
                {() => (
                  <Group>
                    {props.summary.contextItems.map((item) => (
                      <Badge
                        key={item.id}
                        tone={item.tone ?? uiToneModes.neutral}
                        className="h-auto min-h-5.5 max-w-full shrink whitespace-normal break-words py-1 text-start leading-snug"
                      >
                        <span className="break-words leading-snug">
                          {item.label}: {item.value}
                        </span>
                      </Badge>
                    ))}
                  </Group>
                )}
              </Show>
            </Stack>
            <Show when={props.summary.metadataItems.length > 0}>
              {() => (
                <Group>
                  {props.summary.metadataItems.map((item) => (
                    <StandardMetadataItem item={item} key={item.id} />
                  ))}
                </Group>
              )}
            </Show>
            <Show when={Boolean(props.summary.notesSnippet)}>
              {() => (
                <p className="break-words text-sm leading-snug text-(--ui-muted-text)">
                  {props.summary.notesSnippet}
                </p>
              )}
            </Show>
            <Show when={Boolean(props.summary.membershipHint)}>
              {() => (
                <p className="break-words text-xs leading-snug text-(--ui-muted-text)">
                  {props.summary.membershipHint}
                </p>
              )}
            </Show>
            <Show when={Boolean(props.disabledReason)}>
              {() => (
                <p className="break-words text-xs leading-snug text-(--ui-destructive)">
                  {props.disabledReason}
                </p>
              )}
            </Show>
            <Show when={props.actions.length > 0}>
              {() => (
                <Group>
                  {props.actions.map((descriptor) => (
                    <Button
                      key={descriptor.id}
                      disabled={disabled || !descriptor.available}
                      tone={descriptor.tone ?? uiToneModes.neutral}
                      onRequestPress={() => emit(comboCardActions[descriptor.kind], descriptor.id)}
                      className="h-auto min-h-7 max-w-full shrink whitespace-normal break-words py-1.5 text-start leading-snug"
                    >
                      {renderComboCardActionIcon(descriptor.kind)}
                      {descriptor.label}
                      <Show when={Boolean(!descriptor.available && descriptor.disabledReason)}>
                        {() => <span className="sr-only">: {descriptor.disabledReason}</span>}
                      </Show>
                    </Button>
                  ))}
                </Group>
              )}
            </Show>
            <Show when={disabledReasonActions.length > 0}>
              {() => (
                <ul className="grid min-w-0 list-none gap-1 p-0">
                  {disabledReasonActions.map((descriptor) => (
                    <li
                      key={`${descriptor.id}-disabled-reason`}
                      className="break-words text-xs leading-snug text-(--ui-muted-text)"
                    >
                      <span className="font-semibold text-(--ui-text)">{descriptor.label}:</span>{" "}
                      {descriptor.disabledReason}
                    </li>
                  ))}
                </ul>
              )}
            </Show>
          </>
        )}
      >
        {() => (
          <>
            <Show when={Boolean(props.selected)}>
              {() => (
                <span
                  aria-hidden="true"
                  data-combo-selected-marker
                  className="absolute inset-y-0 start-0 z-10 w-1 bg-(--ui-command-accent-fill)"
                />
              )}
            </Show>
            <div
              data-combo-row-region="route"
              className="col-start-1 row-start-1 grid min-w-0 content-center gap-1.5 p-2.5"
            >
              <Show when={props.summary.contextItems.length > 0}>
                {() => (
                  <header className="grid min-w-0 gap-1">
                    <Group className="gap-1">
                      {props.summary.contextItems.map((item) => (
                        <Badge
                          key={item.id}
                          tone={item.tone ?? uiToneModes.neutral}
                          className="h-auto min-h-4 max-w-full shrink whitespace-normal rounded-none border-(--ui-command-border) px-1 py-0.5 text-start font-mono text-[8px] uppercase leading-none"
                        >
                          {item.label}: {item.value}
                        </Badge>
                      ))}
                    </Group>
                  </header>
                )}
              </Show>
              <NotationRenderer
                notation={props.summary.notation}
                routeSteps={props.summary.routeSteps}
                accessibleLabel={props.summary.accessibleLabel}
                notationDisplayMode={props.notationDisplayMode}
                density={props.density ?? notationRendererDensities.command}
              />
              <Show when={Boolean(props.summary.notesSnippet)}>
                {() => (
                  <p className="break-words text-[10px] leading-tight text-(--ui-muted-text)">
                    {props.summary.notesSnippet}
                  </p>
                )}
              </Show>
              <Show when={Boolean(props.summary.membershipHint)}>
                {() => (
                  <p className="break-words text-[10px] leading-tight text-(--ui-muted-text)">
                    {props.summary.membershipHint}
                  </p>
                )}
              </Show>
              <Show when={Boolean(props.disabledReason)}>
                {() => (
                  <p className="break-words text-xs leading-snug text-(--ui-destructive)">
                    {props.disabledReason}
                  </p>
                )}
              </Show>
              <Show when={supportingActions.length > 0}>
                {() => (
                  <Group className="gap-1.5">
                    {supportingActions.map((descriptor) => (
                      <Button
                        key={descriptor.id}
                        disabled={disabled || !descriptor.available}
                        tone={descriptor.tone ?? uiToneModes.neutral}
                        onRequestPress={() =>
                          emit(comboCardActions[descriptor.kind], descriptor.id)
                        }
                        className="pointer-events-auto relative z-20 h-auto min-h-7 max-w-full shrink whitespace-normal break-words rounded-none py-1.5 text-start text-xs leading-snug"
                      >
                        {renderComboCardActionIcon(descriptor.kind)}
                        {descriptor.label}
                        <Show when={Boolean(!descriptor.available && descriptor.disabledReason)}>
                          {() => <span className="sr-only">: {descriptor.disabledReason}</span>}
                        </Show>
                      </Button>
                    ))}
                  </Group>
                )}
              </Show>
              <Show when={disabledReasonActions.length > 0}>
                {() => (
                  <ul className="grid min-w-0 list-none gap-1 p-0">
                    {disabledReasonActions.map((descriptor) => (
                      <li
                        key={`${descriptor.id}-disabled-reason`}
                        className="break-words text-xs leading-snug text-(--ui-muted-text)"
                      >
                        <span className="font-semibold text-(--ui-text)">{descriptor.label}:</span>{" "}
                        {descriptor.disabledReason}
                      </li>
                    ))}
                  </ul>
                )}
              </Show>
            </div>
            <Show when={commandDeck && hasMetrics}>
              {() => (
                <dl
                  data-combo-row-region="metrics"
                  className="col-start-1 row-start-2 grid min-w-0 grid-cols-3 content-center gap-2 border-t border-(--ui-command-border) p-2.5 lg:col-start-2 lg:row-start-1 lg:border-s lg:border-t-0"
                >
                  {flatMetadataItems.map((item, index) => (
                    <div
                      key={item.id}
                      data-combo-metadata-id={item.id}
                      className="grid min-w-0 content-center gap-0.5"
                    >
                      <dt
                        data-combo-metadata-label
                        className="break-words font-(--ui-font-display) text-[8px] font-semibold uppercase leading-none tracking-[0.08em] text-(--ui-muted-text)"
                      >
                        {item.label}
                      </dt>
                      <FlatMetadataValue
                        item={item}
                        primary={index === 0}
                        sizeClass={cx("text-xs", index === 0 && "text-base")}
                      />
                    </div>
                  ))}
                </dl>
              )}
            </Show>
          </>
        )}
      </Show>
    </article>
  );
}

ComboCard.displayName = "ComboCard";
