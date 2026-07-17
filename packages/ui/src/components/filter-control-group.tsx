import { type Ref, useEffect, useRef } from "react";

import { CheckIcon } from "../icons/check";
import { ChevronDownIcon } from "../icons/chevron-down";
import { FiltersIcon } from "../icons/filters";
import { ReturnIcon } from "../icons/return";
import { Trash2Icon } from "../icons/trash-2";
import { XIcon } from "../icons/x";
import { useUiRootContext } from "../internal/ui-root-context";
import { Button, IconButton } from "../primitives/button";
import { Show } from "../primitives/conditional";
import {
  DrawerBackdrop,
  DrawerContent,
  DrawerPopup,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
  drawerSwipeDirections,
} from "../primitives/drawer";
import { Field, FieldLabel, FieldMessage } from "../primitives/field";
import { Badge, LoadingIndicator } from "../primitives/state";
import { cx } from "../recipes/class-name";
import type { UiToneMode } from "../tokens/type";
import { uiEmphasisModes, uiToneModes } from "../tokens/value";
import { SelectableItem } from "./internal/selectable-item";
import type { ComponentActionIntent, UiResponsiveMode } from "./type";
import { componentInteractionReasons, uiResponsiveModes } from "./value";

export const filterControlGroupActions = {
  applyFilters: "applyFilters",
  clearAppliedFilters: "clearAppliedFilters",
  discardDraftFilters: "discardDraftFilters",
  openFilterGroup: "openFilterGroup",
  removeAppliedFilter: "removeAppliedFilter",
  removeDraftFilter: "removeDraftFilter",
  resetDraftFilters: "resetDraftFilters",
  toggleDraftOption: "toggleDraftOption",
} as const;

export type FilterControlGroupAction =
  (typeof filterControlGroupActions)[keyof typeof filterControlGroupActions];

export const filterFacetKinds = {
  multiChoice: "multiChoice",
  singleChoice: "singleChoice",
} as const;

export type FilterFacetKind = (typeof filterFacetKinds)[keyof typeof filterFacetKinds];

export const filterChoicePresentations = {
  compact: "compact",
  visual: "visual",
} as const;

export type FilterChoicePresentation =
  (typeof filterChoicePresentations)[keyof typeof filterChoicePresentations];

export const filterControlFocusIds = {
  apply: "filter-action-apply",
  discard: "filter-action-discard",
  reset: "filter-action-reset",
  option: (filterId: string, optionId: string) =>
    `filter-${encodeURIComponent(filterId)}-option-${encodeURIComponent(optionId)}`,
} as const;

export type FilterChoiceOption = {
  accessibleLabel?: string;
  available: boolean;
  count?: number;
  countLabel?: string;
  disabledReason?: string;
  id: string;
  imageAlt?: string;
  imageSrc?: string;
  label: string;
  tone?: UiToneMode;
};

type FilterFacetBase = {
  disabled?: boolean;
  id: string;
  label: string;
  message?: string;
};

type FilterChoiceFacetBase = FilterFacetBase & {
  options: readonly FilterChoiceOption[];
  presentation: FilterChoicePresentation;
  selectedValues: readonly string[];
};

export type FilterMultiChoiceFacet = FilterChoiceFacetBase & {
  kind: typeof filterFacetKinds.multiChoice;
};

export type FilterSingleChoiceFacet = FilterChoiceFacetBase & {
  kind: typeof filterFacetKinds.singleChoice;
};

export type FilterChoiceFacet = FilterMultiChoiceFacet | FilterSingleChoiceFacet;

export type FilterFacet = FilterChoiceFacet;

export type ActiveFilterChip = {
  filterId: string;
  id: string;
  label: string;
  removeLabel: string;
  tone?: UiToneMode;
  value: string;
};

export type FilterControlAppliedViewModel = {
  activeFilters: readonly ActiveFilterChip[];
  activeFiltersLabel: string;
  clearLabel: string;
  resultCountLabel: string;
};

export type FilterControlDraftViewModel = {
  activeFilters: readonly ActiveFilterChip[];
  activeFiltersLabel: string;
  applyLabel: string;
  discardLabel: string;
  facets: readonly FilterFacet[];
  loadingLabel: string;
  resetLabel: string;
  resultCountLabel: string;
};

export type FilterControlGroupIntent = ComponentActionIntent<FilterControlGroupAction> & {
  filterId?: string;
  selected?: boolean;
  value?: string;
};

export type FilterControlGroupProps = {
  applied: FilterControlAppliedViewModel;
  busy?: boolean;
  controllerFocusedControlId?: string;
  disabled?: boolean;
  draft: FilterControlDraftViewModel;
  drawerRef?: Ref<HTMLDivElement>;
  label: string;
  onRequestAction?: (intent: FilterControlGroupIntent) => void;
  open: boolean;
  responsiveMode: UiResponsiveMode;
  sourceFocusTarget?: string;
  sourceSurface: string;
  triggerRef?: Ref<HTMLButtonElement>;
};

type FilterControlGroupEmit = (
  action: FilterControlGroupAction,
  detail?: Omit<
    FilterControlGroupIntent,
    "action" | "reason" | "sourceFocusTarget" | "sourceSurface"
  >,
) => void;

function assignRef<Element>(ref: Ref<Element> | undefined, value: Element | null): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function filterOptionFallback(label: string): string {
  const words = label.trim().split(/\s+/u).filter(Boolean);

  if (words.length < 2) {
    return label.slice(0, 2);
  }

  return words
    .slice(-2)
    .map((word) => word[0] ?? "")
    .join("");
}

function FilterFacetControl(props: {
  blocked: boolean;
  controllerFocusedControlId?: string;
  emit: FilterControlGroupEmit;
  facet: FilterChoiceFacet;
  responsiveMode: UiResponsiveMode;
}) {
  const { blocked, emit, facet } = props;
  const visual = facet.presentation === filterChoicePresentations.visual;
  const visualGrid =
    props.responsiveMode === uiResponsiveModes.mobile
      ? "grid-cols-[repeat(2,minmax(0,12rem))]"
      : props.responsiveMode === uiResponsiveModes.tablet
        ? "grid-cols-[repeat(3,minmax(0,12rem))]"
        : "grid-cols-[repeat(4,minmax(0,12rem))]";

  return (
    <fieldset
      aria-label={facet.label}
      data-filter-choice-presentation={facet.presentation}
      className={cx(
        "grid w-full min-w-0 max-w-full border-0 p-0",
        visual
          ? cx("justify-start gap-2", visualGrid)
          : "grid-cols-[repeat(2,minmax(0,1fr))] gap-2",
      )}
    >
      {facet.options.map((option) => {
        const selected = facet.selectedValues.includes(option.id);
        const focusId = filterControlFocusIds.option(facet.id, option.id);
        const countLabel = option.countLabel ?? option.count?.toString();
        const displayedCount = option.count?.toString() ?? option.countLabel;
        const accessibleLabel = [
          option.accessibleLabel ?? option.label,
          countLabel,
          option.disabledReason,
        ]
          .filter(Boolean)
          .join(": ");

        return (
          <SelectableItem
            key={option.id}
            value={focusId}
            tone={option.tone}
            selected={selected}
            accessibleLabel={accessibleLabel}
            disabled={blocked || facet.disabled || !option.available}
            controllerFocused={props.controllerFocusedControlId === focusId}
            onRequestPress={() =>
              emit(filterControlGroupActions.toggleDraftOption, {
                filterId: facet.id,
                selected: !selected,
                value: option.id,
              })
            }
            className={cx(
              "h-auto min-h-11 min-w-0 w-full max-w-full overflow-hidden rounded-(--ui-radius-control) border-0 bg-(--ui-command-surface)",
              visual
                ? "relative aspect-square grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] place-items-center gap-2 p-3 text-center"
                : "grid-cols-[minmax(0,1fr)_auto] px-3 py-2",
            )}
          >
            <Show when={visual}>
              {() => (
                <>
                  <span
                    aria-hidden="true"
                    data-filter-selected-marker={selected ? "true" : "false"}
                    className={cx(
                      "absolute end-2 top-2 grid size-6 place-items-center rounded-full bg-(--ui-command-locked)",
                      selected &&
                        "bg-(--ui-command-focus) text-(--ui-command-chrome) shadow-(--ui-focus-ring)",
                    )}
                  >
                    <Show when={selected}>
                      {() => <CheckIcon aria-hidden="true" size="small" />}
                    </Show>
                  </span>
                  <span className="row-start-1 grid size-12 place-items-center overflow-hidden rounded-(--ui-radius-control) bg-(--ui-command-locked)">
                    <Show
                      when={Boolean(option.imageSrc)}
                      fallback={() => (
                        <span
                          aria-hidden="true"
                          className="font-(--ui-font-display) text-sm font-semibold uppercase text-(--ui-command-muted-text)"
                        >
                          {filterOptionFallback(option.label)}
                        </span>
                      )}
                    >
                      {() => (
                        <img
                          width={48}
                          height={48}
                          src={option.imageSrc}
                          className="size-12 object-contain"
                          alt={option.imageAlt ?? option.label}
                        />
                      )}
                    </Show>
                  </span>
                </>
              )}
            </Show>
            <span
              className={cx(
                "grid min-w-0 gap-1",
                visual ? "row-start-2 content-center text-center" : "text-start",
              )}
            >
              <span className="break-words font-medium leading-snug">{option.label}</span>
              <Show when={Boolean(option.disabledReason)}>
                {() => (
                  <span className="break-words text-xs leading-snug text-(--ui-text)">
                    {option.disabledReason}
                  </span>
                )}
              </Show>
            </span>
            <Show when={Boolean(displayedCount)}>
              {() => (
                <Badge
                  density="mini"
                  tone={option.tone}
                  aria-label={countLabel}
                  data-filter-option-count={option.count}
                  className={cx(
                    "h-auto min-h-5 min-w-0 max-w-full shrink overflow-hidden whitespace-nowrap py-1 leading-snug",
                    visual ? "row-start-3 justify-self-center text-center" : "text-start",
                  )}
                >
                  {displayedCount}
                </Badge>
              )}
            </Show>
          </SelectableItem>
        );
      })}
    </fieldset>
  );
}

function ActiveFilterList(props: {
  activeFilters: readonly ActiveFilterChip[];
  activeFiltersLabel: string;
  blocked: boolean;
  emit: FilterControlGroupEmit;
  removeAction:
    | typeof filterControlGroupActions.removeAppliedFilter
    | typeof filterControlGroupActions.removeDraftFilter;
}) {
  return (
    <Show when={props.activeFilters.length > 0}>
      {() => (
        <ul
          data-active-filter-list
          aria-label={props.activeFiltersLabel}
          className="flex min-w-0 list-none flex-wrap items-center justify-start gap-1 p-0"
        >
          {props.activeFilters.map((chip) => (
            <li
              key={chip.id}
              data-filter-id={chip.filterId}
              data-filter-value={chip.value}
              data-filter-tone={chip.tone ?? uiToneModes.neutral}
              className="relative grid min-h-8 min-w-0 max-w-full items-center"
            >
              <IconButton
                data-filter-chip-remove
                disabled={props.blocked}
                label={chip.removeLabel}
                tone={chip.tone ?? uiToneModes.neutral}
                onRequestPress={() =>
                  props.emit(props.removeAction, {
                    filterId: chip.filterId,
                    value: chip.value,
                  })
                }
                className="peer col-start-1 row-start-1 z-10 h-full w-full min-w-0 justify-end rounded-full border-transparent bg-transparent py-0 ps-0 pe-2 [--ui-focus-ring:inset_0_0_0_2px_var(--ui-accent)] enabled:hover:border-transparent enabled:hover:bg-transparent"
              >
                <XIcon aria-hidden="true" className="shrink-0" size="small" />
              </IconButton>
              <Badge
                density="mini"
                tone={chip.tone ?? uiToneModes.neutral}
                className="pointer-events-none col-start-1 row-start-1 h-auto min-h-8 min-w-0 max-w-full justify-start rounded-full py-1 ps-2 pe-8 text-start transition-[filter,opacity] peer-[:enabled:hover]:brightness-[1.08] peer-[:enabled:active]:brightness-[0.94] peer-disabled:opacity-50 motion-reduce:transition-none"
              >
                <span className="min-w-0 whitespace-normal break-words leading-snug">
                  {chip.label}
                </span>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Show>
  );
}

function FilterFacetList(props: {
  blocked: boolean;
  controllerFocusedControlId?: string;
  emit: FilterControlGroupEmit;
  facets: readonly FilterFacet[];
  responsiveMode: UiResponsiveMode;
}) {
  const splitFacets = props.responsiveMode !== uiResponsiveModes.mobile;

  return (
    <div data-filter-facet-list className={cx("grid min-w-0 gap-4", splitFacets && "grid-cols-2")}>
      {props.facets.map((facet, index) => (
        <Field
          key={facet.id}
          data-filter-facet-index={index + 1}
          data-filter-facet-presentation={facet.presentation}
          className={cx(
            "grid min-w-0 content-start gap-3 rounded-(--ui-radius-surface) bg-(--ui-command-locked) p-3",
            facet.presentation === filterChoicePresentations.visual && "col-span-full",
          )}
        >
          <FieldLabel className="font-mono uppercase tracking-[0.08em]">{facet.label}</FieldLabel>
          <div className="grid min-w-0 gap-2">
            <FilterFacetControl
              facet={facet}
              emit={props.emit}
              blocked={props.blocked}
              responsiveMode={props.responsiveMode}
              controllerFocusedControlId={props.controllerFocusedControlId}
            />
            <Show when={Boolean(facet.message)}>
              {() => <FieldMessage>{facet.message}</FieldMessage>}
            </Show>
          </div>
        </Field>
      ))}
    </div>
  );
}

function FilterSummary(props: {
  blocked: boolean;
  controlGroupProps: FilterControlGroupProps;
  emit: FilterControlGroupEmit;
  setTriggerRef: (node: HTMLButtonElement | null) => void;
}) {
  const { applied } = props.controlGroupProps;
  const hasActiveFilters = applied.activeFilters.length > 0;

  return (
    <section
      aria-busy={props.controlGroupProps.busy || undefined}
      data-ui-component="UI-CMP-013"
      data-filter-open={props.controlGroupProps.open ? "true" : "false"}
      className="grid min-w-0 gap-2"
    >
      <div
        data-filter-summary-toolbar
        className={cx(
          "grid min-h-11 min-w-0 items-center gap-2 bg-(--ui-command-locked) p-1",
          hasActiveFilters
            ? "grid-cols-[auto_minmax(0,1fr)_auto]"
            : "grid-cols-[auto_minmax(0,1fr)]",
        )}
      >
        <DrawerTrigger
          ref={props.setTriggerRef}
          disabled={props.blocked}
          aria-label={props.controlGroupProps.label}
          data-filter-summary-action="open"
          emphasis={uiEmphasisModes.subtle}
          className="h-auto min-h-11 min-w-11 w-auto shrink-0 justify-start rounded-(--ui-radius-control) border-0 bg-transparent px-2 py-0 text-start font-(--ui-font-display) text-xs font-semibold uppercase tracking-[0.08em] focus-visible:z-20 aria-expanded:bg-(--ui-command-surface) aria-expanded:text-(--ui-command-focus) enabled:hover:bg-(--ui-command-surface)"
        >
          <FiltersIcon aria-hidden="true" className="shrink-0" size="small" />
          <span className="whitespace-nowrap leading-none max-[40rem]:sr-only">
            {props.controlGroupProps.label}
          </span>
          <ChevronDownIcon
            size="small"
            aria-hidden="true"
            className={cx(
              "shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none",
              props.controlGroupProps.open && "rotate-180",
            )}
          />
        </DrawerTrigger>
        <div
          data-filter-summary-chip-row
          className="flex min-h-11 min-w-0 flex-wrap items-center gap-2"
        >
          <span
            aria-live="polite"
            data-filter-summary-result-count
            className="shrink-0 whitespace-nowrap font-mono text-[0.65rem] font-normal uppercase text-(--ui-command-focus)"
          >
            {applied.resultCountLabel}
          </span>
          <Show when={hasActiveFilters}>
            {() => (
              <ActiveFilterList
                emit={props.emit}
                blocked={props.blocked}
                activeFilters={applied.activeFilters}
                activeFiltersLabel={applied.activeFiltersLabel}
                removeAction={filterControlGroupActions.removeAppliedFilter}
              />
            )}
          </Show>
        </div>
        <Show when={hasActiveFilters}>
          {() => (
            <IconButton
              label={applied.clearLabel}
              disabled={props.blocked}
              onRequestPress={() => props.emit(filterControlGroupActions.clearAppliedFilters)}
              data-filter-summary-action="clear"
              className="size-11 shrink-0 rounded-full border-0 bg-transparent p-0 focus-visible:z-20 enabled:hover:bg-(--ui-command-surface)"
            >
              <XIcon aria-hidden="true" className="shrink-0" size="small" />
            </IconButton>
          )}
        </Show>
      </div>
      <Show when={Boolean(props.controlGroupProps.busy && !props.controlGroupProps.open)}>
        {() => <LoadingIndicator label={props.controlGroupProps.draft.loadingLabel} />}
      </Show>
    </section>
  );
}

function FilterDrawer(props: {
  blocked: boolean;
  controlGroupProps: FilterControlGroupProps;
  drawerSurfaceRef: React.RefObject<HTMLDivElement | null>;
  emit: FilterControlGroupEmit;
  setDrawerRef: (node: HTMLDivElement | null) => void;
  triggerElementRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { draft } = props.controlGroupProps;
  const mobile = props.controlGroupProps.responsiveMode === uiResponsiveModes.mobile;
  const hasActiveFilters = draft.activeFilters.length > 0;

  return (
    <DrawerPortal>
      <DrawerBackdrop />
      <DrawerViewport className="justify-start">
        <DrawerPopup
          ref={props.setDrawerRef}
          finalFocus={props.triggerElementRef}
          initialFocus={props.drawerSurfaceRef}
          tabIndex={-1}
          aria-busy={props.controlGroupProps.busy || undefined}
          data-ui-component="UI-CMP-013"
          data-filter-drawer
          className={cx(
            "grid h-dvh max-h-dvh w-full max-w-[42rem] shrink-0 overflow-hidden rounded-none bg-(--ui-command-surface) p-0 [transform:translateX(var(--drawer-swipe-movement-x))] data-ending-style:[transform:translateX(-100%)] data-starting-style:[transform:translateX(-100%)]",
            mobile ? "border-0" : "border-y-0 border-s-0 border-e",
          )}
        >
          <DrawerContent
            className={cx(
              "grid h-full min-h-0 min-w-0 gap-0",
              hasActiveFilters
                ? "grid-rows-[auto_auto_minmax(0,1fr)]"
                : "grid-rows-[auto_minmax(0,1fr)]",
            )}
          >
            <header
              className={cx(
                "grid min-w-0 gap-3 bg-(--ui-command-chrome) pb-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-(--ui-command-chrome-text)",
                mobile ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_auto] items-center p-4",
              )}
            >
              <div className="grid min-w-0 gap-1">
                <div className="flex min-w-0 items-center gap-2">
                  <FiltersIcon aria-hidden="true" className="shrink-0" size="small" />
                  <DrawerTitle className="break-words text-2xl uppercase leading-none">
                    {props.controlGroupProps.label}
                  </DrawerTitle>
                </div>
                <p
                  aria-live="polite"
                  className="min-w-0 break-words font-mono text-xs uppercase tracking-[0.08em] text-(--ui-command-muted-text)"
                >
                  {draft.resultCountLabel}
                </p>
              </div>
              <div className="grid min-w-0 grid-cols-[auto_auto_minmax(0,1fr)] items-stretch gap-2">
                <IconButton
                  label={draft.discardLabel}
                  onRequestPress={() => props.emit(filterControlGroupActions.discardDraftFilters)}
                  data-controller-focused={
                    props.controlGroupProps.controllerFocusedControlId ===
                    filterControlFocusIds.discard
                      ? "true"
                      : undefined
                  }
                  className={cx(
                    "size-11 rounded-full border-0 bg-transparent p-0 text-(--ui-command-chrome-text)",
                    props.controlGroupProps.controllerFocusedControlId ===
                      filterControlFocusIds.discard && "shadow-[0_0_0_2px_var(--ui-command-focus)]",
                  )}
                >
                  <ReturnIcon aria-hidden="true" className="shrink-0" size="small" />
                </IconButton>
                <IconButton
                  label={draft.resetLabel}
                  disabled={props.blocked || !hasActiveFilters}
                  onRequestPress={() => props.emit(filterControlGroupActions.resetDraftFilters)}
                  data-controller-focused={
                    props.controlGroupProps.controllerFocusedControlId ===
                    filterControlFocusIds.reset
                      ? "true"
                      : undefined
                  }
                  className={cx(
                    "size-11 rounded-full border-0 bg-transparent p-0 text-(--ui-command-chrome-text)",
                    props.controlGroupProps.controllerFocusedControlId ===
                      filterControlFocusIds.reset && "shadow-[0_0_0_2px_var(--ui-command-focus)]",
                  )}
                >
                  <Trash2Icon aria-hidden="true" className="shrink-0" size="small" />
                </IconButton>
                <Button
                  loading={props.controlGroupProps.busy}
                  tone={uiToneModes.accent}
                  disabled={Boolean(props.controlGroupProps.disabled)}
                  emphasis={uiEmphasisModes.prominent}
                  onRequestPress={() => props.emit(filterControlGroupActions.applyFilters)}
                  data-controller-focused={
                    props.controlGroupProps.controllerFocusedControlId ===
                    filterControlFocusIds.apply
                      ? "true"
                      : undefined
                  }
                  className={cx(
                    "h-auto min-h-11 min-w-0 rounded-(--ui-radius-control) whitespace-normal",
                    props.controlGroupProps.controllerFocusedControlId ===
                      filterControlFocusIds.apply && "shadow-[0_0_0_2px_var(--ui-command-focus)]",
                  )}
                >
                  <CheckIcon aria-hidden="true" className="shrink-0" size="small" />
                  {draft.applyLabel}
                </Button>
              </div>
            </header>
            <Show when={hasActiveFilters}>
              {() => (
                <div className="min-w-0 bg-(--ui-command-locked) px-3 py-2">
                  <ActiveFilterList
                    emit={props.emit}
                    blocked={props.blocked}
                    activeFilters={draft.activeFilters}
                    activeFiltersLabel={draft.activeFiltersLabel}
                    removeAction={filterControlGroupActions.removeDraftFilter}
                  />
                </div>
              )}
            </Show>
            <div className="min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <FilterFacetList
                emit={props.emit}
                blocked={props.blocked}
                facets={draft.facets}
                responsiveMode={props.controlGroupProps.responsiveMode}
                controllerFocusedControlId={props.controlGroupProps.controllerFocusedControlId}
              />
              <Show when={Boolean(props.controlGroupProps.busy)}>
                {() => (
                  <div className="pt-3">
                    <LoadingIndicator label={draft.loadingLabel} />
                  </div>
                )}
              </Show>
            </div>
          </DrawerContent>
        </DrawerPopup>
      </DrawerViewport>
    </DrawerPortal>
  );
}

export function FilterControlGroup(props: FilterControlGroupProps) {
  const { controllerFocusVisible } = useUiRootContext();
  const drawerSurfaceRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLButtonElement>(null);
  const blocked = Boolean(props.disabled || props.busy);
  const controllerFocusedControlId = controllerFocusVisible
    ? props.controllerFocusedControlId
    : undefined;
  const emit: FilterControlGroupEmit = (action, detail = {}) =>
    props.onRequestAction?.({
      action,
      ...detail,
      reason: componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });

  useEffect(() => {
    if (!controllerFocusedControlId) {
      return;
    }

    const focusedControl = drawerSurfaceRef.current?.querySelector<HTMLElement>(
      '[data-controller-focused="true"]',
    );

    focusedControl?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [controllerFocusedControlId]);

  const setDrawerRef = (node: HTMLDivElement | null) => {
    drawerSurfaceRef.current = node;
    assignRef(props.drawerRef, node);
  };
  const setTriggerRef = (node: HTMLButtonElement | null) => {
    triggerElementRef.current = node;
    assignRef(props.triggerRef, node);
  };

  return (
    <DrawerRoot
      modal
      open={props.open}
      sourceFocusTarget={props.sourceFocusTarget}
      swipeDirection={drawerSwipeDirections.left}
      onOpenChange={({ open, reason, sourceFocusTarget }) =>
        props.onRequestAction?.({
          action: open
            ? filterControlGroupActions.openFilterGroup
            : filterControlGroupActions.discardDraftFilters,
          reason,
          sourceFocusTarget: sourceFocusTarget ?? props.sourceFocusTarget,
          sourceSurface: props.sourceSurface,
        })
      }
    >
      <FilterSummary
        emit={emit}
        blocked={blocked}
        controlGroupProps={props}
        setTriggerRef={setTriggerRef}
      />
      <FilterDrawer
        emit={emit}
        blocked={blocked}
        controlGroupProps={{ ...props, controllerFocusedControlId }}
        setDrawerRef={setDrawerRef}
        drawerSurfaceRef={drawerSurfaceRef}
        triggerElementRef={triggerElementRef}
      />
    </DrawerRoot>
  );
}

FilterControlGroup.displayName = "FilterControlGroup";
