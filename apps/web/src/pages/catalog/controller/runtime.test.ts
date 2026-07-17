import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  type FilterFacet,
  filterChoicePresentations,
} from "@mk-combos/ui/components/filter-control-group";
import { pickerSlotStatuses, uiResponsiveModes } from "@mk-combos/ui/components/value";
import { describe, expect, it } from "vitest";

import {
  type CatalogFilterControllerTarget,
  createCatalogFilterControllerTargets,
  resolveFilterFocusIndex,
  resolveLinearFocusIndex,
  resolvePickerFocusSlotId,
} from "./runtime";

const options = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { disabledReason: "Unavailable", id: "three", label: "Three" },
  { id: "four", label: "Four" },
];
const slots = [
  {
    column: 1,
    optionId: "one",
    responsiveOrder: 2,
    row: 1,
    slotId: "slot-one",
    status: pickerSlotStatuses.selectable,
  },
  {
    column: 3,
    optionId: "two",
    responsiveOrder: 1,
    row: 1,
    slotId: "slot-two",
    status: pickerSlotStatuses.selectable,
  },
  {
    column: 1,
    optionId: "three",
    responsiveOrder: 3,
    row: 2,
    slotId: "slot-three",
    status: pickerSlotStatuses.disabledUnavailable,
  },
  {
    column: 2,
    optionId: "four",
    responsiveOrder: 4,
    row: 3,
    slotId: "slot-four",
    status: pickerSlotStatuses.selectable,
  },
] as const;

const filterFacets = [
  {
    id: "source",
    kind: "multiChoice",
    label: "Source",
    options: [
      { available: true, id: "curated", label: "Curated" },
      { available: true, id: "personal", label: "Personal" },
      { available: false, id: "legacy", label: "Legacy" },
      { available: true, id: "tournament", label: "Tournament" },
    ],
    presentation: filterChoicePresentations.compact,
    selectedValues: ["curated"],
  },
  {
    id: "route",
    kind: "singleChoice",
    label: "Route",
    options: [
      { available: true, id: "ground", label: "Ground" },
      { available: true, id: "air", label: "Air" },
    ],
    presentation: filterChoicePresentations.compact,
    selectedValues: [],
  },
  {
    id: "stage",
    kind: "singleChoice",
    label: "Arena",
    options: [
      { available: true, id: "crossroads", label: "Crossroads" },
      { available: true, id: "dead-woods", label: "Dead Woods" },
      { available: true, id: "the-pit", label: "The Pit" },
      { available: true, id: "training-room", label: "Training Room" },
    ],
    presentation: filterChoicePresentations.visual,
    selectedValues: ["crossroads"],
  },
  {
    id: "interactable",
    kind: "multiChoice",
    label: "Interactables",
    options: [
      { available: true, id: "body-toss", label: "Body Toss" },
      { available: true, id: "wall-dive", label: "Wall Dive" },
    ],
    presentation: filterChoicePresentations.visual,
    selectedValues: [],
  },
  {
    id: "meter",
    kind: "multiChoice",
    label: "Meter",
    options: [
      { available: true, id: "no-meter", label: "No meter" },
      { available: true, id: "one-bar", label: "One bar" },
    ],
    presentation: filterChoicePresentations.compact,
    selectedValues: [],
  },
] as const satisfies readonly FilterFacet[];

function resolvedFilterTargetId(
  targets: readonly CatalogFilterControllerTarget[],
  currentId: string,
  commandId: string,
): string | undefined {
  const currentIndex = targets.findIndex((target) => target.id === currentId);
  const nextIndex = resolveFilterFocusIndex({ commandId, currentIndex, targets });
  return targets[nextIndex]?.id;
}

describe("catalog controller focus", () => {
  it("uses one responsiveOrder graph and skips disabled or placeholder slots", () => {
    const input = {
      currentSlotId: "slot-one",
      options,
      slots: [
        ...slots,
        {
          column: 2,
          responsiveOrder: 3,
          row: 2,
          slotId: "slot-placeholder",
          status: pickerSlotStatuses.placeholder,
        },
      ],
    } as const;

    expect(
      resolvePickerFocusSlotId({
        ...input,
        commandId: knownControllerCommandIds.navLeft,
      }),
    ).toBe("slot-two");
    expect(
      resolvePickerFocusSlotId({
        ...input,
        commandId: knownControllerCommandIds.navUp,
      }),
    ).toBe("slot-two");
    expect(
      resolvePickerFocusSlotId({
        ...input,
        commandId: knownControllerCommandIds.navRight,
      }),
    ).toBe("slot-four");
    expect(
      resolvePickerFocusSlotId({
        ...input,
        commandId: knownControllerCommandIds.navDown,
      }),
    ).toBe("slot-four");
    expect(
      resolvePickerFocusSlotId({
        ...input,
        commandId: knownControllerCommandIds.navLeft,
        currentSlotId: "slot-two",
      }),
    ).toBe("slot-two");
    expect(
      resolvePickerFocusSlotId({
        ...input,
        commandId: knownControllerCommandIds.navRight,
        currentSlotId: "slot-four",
      }),
    ).toBe("slot-four");
  });

  it("falls back to one-based source order when responsiveOrder is absent", () => {
    const fallbackOptions = [
      { id: "source-first", label: "Source first" },
      { id: "authored-second", label: "Authored second" },
      { id: "source-third", label: "Source third" },
    ] as const;
    const fallbackSlots = [
      {
        column: 8,
        optionId: "source-first",
        row: 3,
        slotId: "slot-source-first",
        status: pickerSlotStatuses.selectable,
      },
      {
        column: 1,
        optionId: "authored-second",
        responsiveOrder: 2,
        row: 1,
        slotId: "slot-authored-second",
        status: pickerSlotStatuses.selectable,
      },
      {
        column: 0,
        optionId: "source-third",
        row: 0,
        slotId: "slot-source-third",
        status: pickerSlotStatuses.selectable,
      },
    ] as const;

    expect(
      resolvePickerFocusSlotId({
        commandId: knownControllerCommandIds.navRight,
        currentSlotId: "slot-source-first",
        options: fallbackOptions,
        slots: fallbackSlots,
      }),
    ).toBe("slot-authored-second");
    expect(
      resolvePickerFocusSlotId({
        commandId: knownControllerCommandIds.navDown,
        currentSlotId: "slot-authored-second",
        options: fallbackOptions,
        slots: fallbackSlots,
      }),
    ).toBe("slot-source-third");
  });

  it("clamps linear list focus without wrapping", () => {
    expect(
      resolveLinearFocusIndex({
        commandId: knownControllerCommandIds.navUp,
        currentIndex: 0,
        itemCount: 3,
      }),
    ).toBe(0);
    expect(
      resolveLinearFocusIndex({
        commandId: knownControllerCommandIds.navDown,
        currentIndex: 2,
        itemCount: 3,
      }),
    ).toBe(2);
  });

  it("matches the tablet compact-pair and three-column visual grid", () => {
    const targets = createCatalogFilterControllerTargets({
      clearAvailable: true,
      facets: filterFacets,
      responsiveMode: uiResponsiveModes.tablet,
    });

    expect(targets.find((target) => target.id === "filter-source-option-legacy")).toBeUndefined();
    expect(targets.find((target) => target.id === "filter-source-option-tournament")).toMatchObject(
      { column: 3, row: 2 },
    );
    expect(targets.find((target) => target.id === "filter-route-option-ground")).toMatchObject({
      column: 6,
      row: 1,
    });
    expect(targets.find((target) => target.id === "filter-stage-option-crossroads")).toMatchObject({
      column: 0,
      row: 3,
    });
    expect(
      targets.find((target) => target.id === "filter-stage-option-training-room"),
    ).toMatchObject({ column: 0, row: 4 });
    expect(targets.find((target) => target.id === "filter-meter-option-no-meter")).toMatchObject({
      column: 0,
      row: 6,
    });
    expect(targets.filter((target) => target.kind === "action")).toEqual([
      { action: "discard", column: 0, id: "filter-action-discard", kind: "action", row: 0 },
      { action: "reset", column: 4, id: "filter-action-reset", kind: "action", row: 0 },
      { action: "apply", column: 8, id: "filter-action-apply", kind: "action", row: 0 },
    ]);
  });

  it("resolves all tablet directions by the nearest authored coordinates", () => {
    const targets = createCatalogFilterControllerTargets({
      clearAvailable: true,
      facets: filterFacets,
      responsiveMode: uiResponsiveModes.tablet,
    });

    expect(
      resolvedFilterTargetId(
        targets,
        "filter-source-option-personal",
        knownControllerCommandIds.navRight,
      ),
    ).toBe("filter-route-option-ground");
    expect(
      resolvedFilterTargetId(
        targets,
        "filter-route-option-ground",
        knownControllerCommandIds.navLeft,
      ),
    ).toBe("filter-source-option-personal");
    expect(
      resolvedFilterTargetId(
        targets,
        "filter-source-option-tournament",
        knownControllerCommandIds.navDown,
      ),
    ).toBe("filter-stage-option-dead-woods");
    expect(
      resolvedFilterTargetId(
        targets,
        "filter-stage-option-dead-woods",
        knownControllerCommandIds.navUp,
      ),
    ).toBe("filter-source-option-tournament");
    expect(
      resolvedFilterTargetId(
        targets,
        "filter-stage-option-crossroads",
        knownControllerCommandIds.navRight,
      ),
    ).toBe("filter-stage-option-dead-woods");
  });

  it("matches the mobile two-column visual grid and stacked primary action", () => {
    const targets = createCatalogFilterControllerTargets({
      clearAvailable: true,
      facets: filterFacets,
      responsiveMode: uiResponsiveModes.mobile,
    });

    expect(targets.find((target) => target.id === "filter-stage-option-crossroads")).toMatchObject({
      column: 0,
      row: 4,
    });
    expect(targets.find((target) => target.id === "filter-meter-option-no-meter")).toMatchObject({
      column: 0,
      row: 7,
    });
    expect(targets.filter((target) => target.kind === "action")).toEqual([
      { action: "discard", column: 0, id: "filter-action-discard", kind: "action", row: 0 },
      { action: "reset", column: 4, id: "filter-action-reset", kind: "action", row: 0 },
      { action: "apply", column: 8, id: "filter-action-apply", kind: "action", row: 0 },
    ]);

    expect(
      resolvedFilterTargetId(
        targets,
        "filter-source-option-curated",
        knownControllerCommandIds.navRight,
      ),
    ).toBe("filter-source-option-personal");
    expect(
      resolvedFilterTargetId(
        targets,
        "filter-source-option-personal",
        knownControllerCommandIds.navLeft,
      ),
    ).toBe("filter-source-option-curated");
    expect(
      resolvedFilterTargetId(
        targets,
        "filter-source-option-tournament",
        knownControllerCommandIds.navDown,
      ),
    ).toBe("filter-route-option-air");
    expect(
      resolvedFilterTargetId(
        targets,
        "filter-stage-option-training-room",
        knownControllerCommandIds.navUp,
      ),
    ).toBe("filter-stage-option-dead-woods");
  });

  it("uses four visual columns on desktop", () => {
    const targets = createCatalogFilterControllerTargets({
      clearAvailable: false,
      facets: filterFacets,
      responsiveMode: uiResponsiveModes.desktop,
    });

    expect(
      filterFacets[2].options.map(
        (option) =>
          targets.find((target) => target.id === `filter-stage-option-${option.id}`)?.column,
      ),
    ).toEqual([0, 3, 6, 9]);
  });

  it("flushes an unpaired compact facet before a full-width visual facet", () => {
    const targets = createCatalogFilterControllerTargets({
      clearAvailable: false,
      facets: [filterFacets[0], filterFacets[2]],
      responsiveMode: uiResponsiveModes.tablet,
    });

    expect(targets.find((target) => target.id === "filter-source-option-tournament")).toMatchObject(
      { row: 2 },
    );
    expect(targets.find((target) => target.id === "filter-stage-option-crossroads")).toMatchObject({
      row: 3,
    });
    expect(targets.find((target) => target.id === "filter-action-discard")).toMatchObject({
      row: 0,
    });
  });
});
