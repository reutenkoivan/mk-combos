import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  type FilterFacet,
  filterChoicePresentations,
  filterControlFocusIds,
} from "@mk-combos/ui/components/filter-control-group";
import type { PickerOption, PickerSlot, UiResponsiveMode } from "@mk-combos/ui/components/type";
import { pickerSlotStatuses, uiResponsiveModes } from "@mk-combos/ui/components/value";

type PickerNavigationCommand = string;

type PickerFocusInput = Readonly<{
  commandId: PickerNavigationCommand;
  currentSlotId?: string;
  options: readonly PickerOption[];
  slots: readonly PickerSlot[];
}>;

type CatalogFilterTargetCoordinate = {
  column: number;
  id: string;
  row: number;
};

export type CatalogFilterControllerTarget = Readonly<
  | (CatalogFilterTargetCoordinate & {
      filterId: string;
      kind: "option";
      selected: boolean;
      value: string;
    })
  | (CatalogFilterTargetCoordinate & {
      action: "apply" | "discard" | "reset";
      kind: "action";
    })
>;

const filterCoordinateWidth = 12;
const compactOptionColumnCount = 2;

type FilterFacetPlacement = Readonly<{
  columnOffset: number;
  columnStep: number;
  controlColumnCount: number;
  row: number;
}>;

function visualOptionColumnCount(responsiveMode: UiResponsiveMode): number {
  if (responsiveMode === uiResponsiveModes.mobile) return 2;
  if (responsiveMode === uiResponsiveModes.tablet) return 3;
  return 4;
}

function filterFacetRowCount(facet: FilterFacet, controlColumnCount: number): number {
  return Math.max(1, Math.ceil(facet.options.length / controlColumnCount));
}

function prepareFilterFacetRows(
  facets: readonly FilterFacet[],
  responsiveMode: UiResponsiveMode,
): readonly FilterFacetPlacement[] {
  const placements: FilterFacetPlacement[] = [];
  const visualColumns = visualOptionColumnCount(responsiveMode);
  const splitCompactFacets = responsiveMode !== uiResponsiveModes.mobile;
  let row = 1;
  let pendingCompactRow: { readonly height: number; readonly row: number } | undefined;

  const flushCompactRow = () => {
    if (!pendingCompactRow) return;
    row = pendingCompactRow.row + pendingCompactRow.height;
    pendingCompactRow = undefined;
  };

  for (const facet of facets) {
    if (facet.presentation === filterChoicePresentations.visual) {
      flushCompactRow();
      placements.push({
        columnOffset: 0,
        columnStep: filterCoordinateWidth / visualColumns,
        controlColumnCount: visualColumns,
        row,
      });
      row += filterFacetRowCount(facet, visualColumns);
      continue;
    }

    const height = filterFacetRowCount(facet, compactOptionColumnCount);

    if (!splitCompactFacets) {
      flushCompactRow();
      placements.push({
        columnOffset: 0,
        columnStep: filterCoordinateWidth / compactOptionColumnCount,
        controlColumnCount: compactOptionColumnCount,
        row,
      });
      row += height;
      continue;
    }

    const pairRow = pendingCompactRow?.row ?? row;
    placements.push({
      columnOffset: pendingCompactRow === undefined ? 0 : filterCoordinateWidth / 2,
      columnStep: filterCoordinateWidth / (compactOptionColumnCount * 2),
      controlColumnCount: compactOptionColumnCount,
      row: pairRow,
    });

    if (pendingCompactRow === undefined) {
      pendingCompactRow = { height, row: pairRow };
    } else {
      const pendingHeight = pendingCompactRow.height;
      row = pairRow + Math.max(pendingHeight, height);
      pendingCompactRow = undefined;
    }
  }

  flushCompactRow();
  return placements;
}

export function createCatalogFilterControllerTargets(
  input: Readonly<{
    clearAvailable: boolean;
    facets: readonly FilterFacet[];
    responsiveMode: UiResponsiveMode;
  }>,
): readonly CatalogFilterControllerTarget[] {
  const targets: CatalogFilterControllerTarget[] = [
    {
      action: "discard",
      column: 0,
      id: filterControlFocusIds.discard,
      kind: "action",
      row: 0,
    },
  ];
  if (input.clearAvailable) {
    targets.push({
      action: "reset",
      column: filterCoordinateWidth / 3,
      id: filterControlFocusIds.reset,
      kind: "action",
      row: 0,
    });
  }
  targets.push({
    action: "apply",
    column: (filterCoordinateWidth / 3) * 2,
    id: filterControlFocusIds.apply,
    kind: "action",
    row: 0,
  });
  const placements = prepareFilterFacetRows(input.facets, input.responsiveMode);

  for (const [facetIndex, facet] of input.facets.entries()) {
    if (facet.disabled) {
      continue;
    }

    const placement = placements[facetIndex];
    if (!placement) continue;

    for (const [optionIndex, option] of facet.options.entries()) {
      if (!option.available) {
        continue;
      }

      targets.push({
        column:
          placement.columnOffset +
          (optionIndex % placement.controlColumnCount) * placement.columnStep,
        filterId: facet.id,
        id: filterControlFocusIds.option(facet.id, option.id),
        kind: "option",
        row: placement.row + Math.floor(optionIndex / placement.controlColumnCount),
        selected: facet.selectedValues.includes(option.id),
        value: option.id,
      });
    }
  }

  return targets;
}

function filterDirectionalScore(
  commandId: PickerNavigationCommand,
  current: CatalogFilterControllerTarget,
  candidate: CatalogFilterControllerTarget,
): Readonly<{ primary: number; secondary: number }> | undefined {
  const rowDistance = candidate.row - current.row;
  const columnDistance = candidate.column - current.column;

  switch (commandId) {
    case knownControllerCommandIds.navDown:
      return rowDistance > 0
        ? { primary: rowDistance, secondary: Math.abs(columnDistance) }
        : undefined;
    case knownControllerCommandIds.navLeft:
      return columnDistance < 0
        ? { primary: Math.abs(rowDistance), secondary: Math.abs(columnDistance) }
        : undefined;
    case knownControllerCommandIds.navRight:
      return columnDistance > 0
        ? { primary: Math.abs(rowDistance), secondary: columnDistance }
        : undefined;
    case knownControllerCommandIds.navUp:
      return rowDistance < 0
        ? { primary: Math.abs(rowDistance), secondary: Math.abs(columnDistance) }
        : undefined;
    default:
      return undefined;
  }
}

export function resolveFilterFocusIndex(
  input: Readonly<{
    commandId: PickerNavigationCommand;
    currentIndex: number;
    targets: readonly CatalogFilterControllerTarget[];
  }>,
): number {
  if (input.targets.length === 0) {
    return -1;
  }

  const currentIndex = Math.min(input.targets.length - 1, Math.max(0, input.currentIndex));
  const current = input.targets[currentIndex];

  if (!current) {
    return -1;
  }

  let bestIndex = currentIndex;
  let bestPrimary = Number.POSITIVE_INFINITY;
  let bestSecondary = Number.POSITIVE_INFINITY;

  for (const [candidateIndex, candidate] of input.targets.entries()) {
    if (candidateIndex === currentIndex) {
      continue;
    }

    const score = filterDirectionalScore(input.commandId, current, candidate);

    if (!score) {
      continue;
    }

    if (
      score.primary < bestPrimary ||
      (score.primary === bestPrimary && score.secondary < bestSecondary)
    ) {
      bestIndex = candidateIndex;
      bestPrimary = score.primary;
      bestSecondary = score.secondary;
    }
  }

  return bestIndex;
}

function isSelectableSlot(
  slot: PickerSlot,
  optionsById: ReadonlyMap<string, PickerOption>,
): boolean {
  if (
    !slot.optionId ||
    slot.status === pickerSlotStatuses.placeholder ||
    slot.status === pickerSlotStatuses.disabledUnavailable
  ) {
    return false;
  }

  return !optionsById.get(slot.optionId)?.disabledReason;
}

function linearPickerFocusTarget(
  slots: readonly PickerSlot[],
  currentSlotId: string | undefined,
  commandId: PickerNavigationCommand,
): string | undefined {
  if (slots.length === 0) {
    return undefined;
  }

  const currentIndex = Math.max(
    0,
    slots.findIndex((slot) => slot.slotId === currentSlotId),
  );
  const delta =
    commandId === knownControllerCommandIds.navLeft || commandId === knownControllerCommandIds.navUp
      ? -1
      : 1;
  const nextIndex = Math.min(slots.length - 1, Math.max(0, currentIndex + delta));

  return slots[nextIndex]?.slotId;
}

export function resolvePickerFocusSlotId(input: PickerFocusInput): string | undefined {
  const optionsById = new Map(input.options.map((option) => [option.id, option]));
  const selectableSlots = input.slots
    .map((slot, sourceIndex) => ({
      navigationOrder: slot.responsiveOrder ?? sourceIndex + 1,
      slot,
      sourceIndex,
    }))
    .filter(({ slot }) => isSelectableSlot(slot, optionsById))
    .sort(
      (left, right) =>
        left.navigationOrder - right.navigationOrder || left.sourceIndex - right.sourceIndex,
    )
    .map(({ slot }) => slot);

  return linearPickerFocusTarget(selectableSlots, input.currentSlotId, input.commandId);
}

export function resolveLinearFocusIndex(
  input: Readonly<{
    commandId: PickerNavigationCommand;
    currentIndex: number;
    itemCount: number;
  }>,
): number {
  if (input.itemCount <= 0) {
    return -1;
  }

  const delta =
    input.commandId === knownControllerCommandIds.navLeft ||
    input.commandId === knownControllerCommandIds.navUp
      ? -1
      : 1;

  return Math.min(input.itemCount - 1, Math.max(0, input.currentIndex + delta));
}
