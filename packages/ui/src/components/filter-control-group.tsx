import { ChevronDownIcon } from "../icons/chevron-down";
import { XIcon } from "../icons/x";
import { Button, IconButton } from "../primitives/button";
import { DisclosurePanel, DisclosureRoot, DisclosureTrigger } from "../primitives/disclosure";
import { Field, FieldLabel, FieldMessage, TextInput } from "../primitives/field";
import { Group, Stack } from "../primitives/layout";
import { LoadingIndicator, StatusMessage } from "../primitives/state";
import { uiToneModes } from "../tokens/value";
import { SelectableItem } from "./internal/selectable-item";
import type { ComponentActionIntent } from "./type";
import { componentInteractionReasons } from "./value";

export const filterControlGroupActions = {
  clearFilters: "clearFilters",
  closeFilterGroup: "closeFilterGroup",
  removeActiveFilter: "removeActiveFilter",
  returnFocusToCatalog: "returnFocusToCatalog",
  toggleFilterGroup: "toggleFilterGroup",
  updateOptionalFilter: "updateOptionalFilter",
} as const;

export type FilterControlGroupAction =
  (typeof filterControlGroupActions)[keyof typeof filterControlGroupActions];

export const filterFacetKinds = {
  multiChoice: "multiChoice",
  range: "range",
  singleChoice: "singleChoice",
} as const;

export type FilterFacetKind = (typeof filterFacetKinds)[keyof typeof filterFacetKinds];

export const filterRangeBoundaries = {
  maximum: "maximum",
  minimum: "minimum",
} as const;

export type FilterRangeBoundary =
  (typeof filterRangeBoundaries)[keyof typeof filterRangeBoundaries];

export type FilterChoiceOption = {
  available: boolean;
  disabledReason?: string;
  id: string;
  label: string;
};

type FilterFacetBase = {
  disabled?: boolean;
  id: string;
  label: string;
  message?: string;
};

export type FilterChoiceFacet = FilterFacetBase & {
  kind: typeof filterFacetKinds.multiChoice | typeof filterFacetKinds.singleChoice;
  options: readonly FilterChoiceOption[];
  selectedValues: readonly string[];
};

export type FilterRangeFacet = FilterFacetBase & {
  kind: typeof filterFacetKinds.range;
  maximumLabel: string;
  maximumValue: string;
  minimumLabel: string;
  minimumValue: string;
};

export type FilterFacet = FilterChoiceFacet | FilterRangeFacet;

export type ActiveFilterChip = {
  filterId: string;
  id: string;
  label: string;
  removeLabel: string;
  value: string;
};

export type FilterControlGroupIntent = ComponentActionIntent<FilterControlGroupAction> & {
  boundary?: FilterRangeBoundary;
  expanded?: boolean;
  filterId?: string;
  selected?: boolean;
  value?: string;
};

export type FilterControlGroupProps = {
  activeFilters: readonly ActiveFilterChip[];
  busy?: boolean;
  clearLabel: string;
  disabled?: boolean;
  expanded: boolean;
  facets: readonly FilterFacet[];
  label: string;
  onRequestAction?: (intent: FilterControlGroupIntent) => void;
  resultCountLabel: string;
  sourceFocusTarget?: string;
  sourceSurface: string;
  validationMessage?: string;
};

type FilterControlGroupEmit = (
  action: FilterControlGroupAction,
  detail?: Omit<
    FilterControlGroupIntent,
    "action" | "reason" | "sourceFocusTarget" | "sourceSurface"
  >,
) => void;

function FilterFacetControl(props: {
  blocked: boolean;
  emit: FilterControlGroupEmit;
  facet: FilterFacet;
}) {
  const { blocked, emit, facet } = props;

  switch (facet.kind) {
    case filterFacetKinds.range:
      return (
        <Group>
          <TextInput
            aria-label={facet.minimumLabel}
            disabled={blocked || facet.disabled}
            onValueChange={({ value }) =>
              emit(filterControlGroupActions.updateOptionalFilter, {
                boundary: filterRangeBoundaries.minimum,
                filterId: facet.id,
                value,
              })
            }
            value={facet.minimumValue}
          />
          <TextInput
            aria-label={facet.maximumLabel}
            disabled={blocked || facet.disabled}
            onValueChange={({ value }) =>
              emit(filterControlGroupActions.updateOptionalFilter, {
                boundary: filterRangeBoundaries.maximum,
                filterId: facet.id,
                value,
              })
            }
            value={facet.maximumValue}
          />
        </Group>
      );
    case filterFacetKinds.multiChoice:
    case filterFacetKinds.singleChoice:
      return (
        <Group aria-label={facet.label} role="group">
          {facet.options.map((option) => {
            const selected = facet.selectedValues.includes(option.id);
            return (
              <SelectableItem
                accessibleLabel={option.disabledReason ?? option.label}
                className="grid-cols-[1fr] px-3 py-2"
                disabled={blocked || facet.disabled || !option.available}
                key={option.id}
                onRequestPress={() =>
                  emit(filterControlGroupActions.updateOptionalFilter, {
                    filterId: facet.id,
                    selected: !selected,
                    value: option.id,
                  })
                }
                selected={selected}
                value={`${facet.id}-${option.id}`}
              >
                <span>{option.label}</span>
              </SelectableItem>
            );
          })}
        </Group>
      );
  }

  const unhandledFacet: never = facet;
  return unhandledFacet;
}

export function FilterControlGroup(props: FilterControlGroupProps) {
  const blocked = Boolean(props.disabled || props.busy);
  const emit: FilterControlGroupEmit = (action, detail = {}) =>
    props.onRequestAction?.({
      action,
      ...detail,
      reason: componentInteractionReasons.press,
      sourceFocusTarget: props.sourceFocusTarget,
      sourceSurface: props.sourceSurface,
    });

  return (
    <section className="grid min-w-0 gap-2" data-ui-component="UI-CMP-013">
      <DisclosureRoot
        disabled={blocked}
        onOpenChange={({ open, reason, sourceFocusTarget }) =>
          props.onRequestAction?.({
            action: open
              ? filterControlGroupActions.toggleFilterGroup
              : filterControlGroupActions.closeFilterGroup,
            expanded: open,
            reason,
            sourceFocusTarget: sourceFocusTarget ?? props.sourceFocusTarget,
            sourceSurface: props.sourceSurface,
          })
        }
        open={props.expanded}
        sourceFocusTarget={props.sourceFocusTarget}
      >
        <Stack>
          <Group justify="between">
            <DisclosureTrigger className="justify-between">
              {props.label}
              <ChevronDownIcon aria-hidden="true" size="small" />
            </DisclosureTrigger>
            <span aria-live="polite" className="text-sm text-[var(--ui-muted-text)]">
              {props.resultCountLabel}
            </span>
            {props.activeFilters.length > 0 && (
              <Button
                disabled={blocked}
                onRequestPress={() => emit(filterControlGroupActions.clearFilters)}
              >
                {props.clearLabel}
              </Button>
            )}
          </Group>
          {props.activeFilters.length > 0 && (
            <ul
              aria-label="Active filters"
              className="flex min-w-0 list-none flex-wrap items-center justify-start gap-2 p-0"
            >
              {props.activeFilters.map((chip) => (
                <li
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--ui-selection-muted)] px-2 py-1 text-xs"
                  key={chip.id}
                >
                  {chip.label}
                  <IconButton
                    disabled={blocked}
                    label={chip.removeLabel}
                    onRequestPress={() =>
                      emit(filterControlGroupActions.removeActiveFilter, {
                        filterId: chip.filterId,
                        value: chip.value,
                      })
                    }
                  >
                    <XIcon aria-hidden="true" size="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </Stack>
        <DisclosurePanel className="grid gap-3" keepMounted>
          {props.facets.map((facet) => (
            <Field key={facet.id}>
              <FieldLabel>{facet.label}</FieldLabel>
              <FilterFacetControl blocked={blocked} emit={emit} facet={facet} />
              {facet.message && <FieldMessage>{facet.message}</FieldMessage>}
            </Field>
          ))}
          {props.busy && <LoadingIndicator label="Loading filters" />}
        </DisclosurePanel>
      </DisclosureRoot>
      {props.validationMessage && (
        <StatusMessage tone={uiToneModes.destructive}>{props.validationMessage}</StatusMessage>
      )}
    </section>
  );
}

FilterControlGroup.displayName = "FilterControlGroup";
