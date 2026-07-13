import type { ComboRef } from "@mk-combos/contracts/identity/type";
import { fireEvent, render, screen } from "@mk-combos/contracts/test/unit/react";
import {
  AddToListDialog,
  addToListDialogActions,
} from "@mk-combos/ui/components/add-to-list-dialog";
import {
  BuilderContextSetup,
  builderContextFieldKinds,
  builderContextSetupActions,
} from "@mk-combos/ui/components/builder-context-setup";
import { CharacterPicker, characterPickerActions } from "@mk-combos/ui/components/character-picker";
import {
  ComboActionsMenu,
  comboActionsMenuActions,
  comboActionsMenuStates,
} from "@mk-combos/ui/components/combo-actions-menu";
import { type ComboCardModel, comboCardActionKinds } from "@mk-combos/ui/components/combo-card";
import {
  ComboDetailHeader,
  comboDetailHeaderActionKinds,
  comboDetailHeaderActions,
} from "@mk-combos/ui/components/combo-detail-header";
import { ComboList, comboListActions, comboListStates } from "@mk-combos/ui/components/combo-list";
import {
  ComboListConfigModule,
  comboListConfigPickerKinds,
} from "@mk-combos/ui/components/combo-list-config-module";
import {
  ComboMetadataGrid,
  comboMetadataImportances,
} from "@mk-combos/ui/components/combo-metadata-grid";
import { EmptyState, emptyStateActions } from "@mk-combos/ui/components/empty-state";
import {
  ErrorState,
  errorStateActionKinds,
  errorStateActions,
  errorStateSeverities,
} from "@mk-combos/ui/components/error-state";
import {
  FilterControlGroup,
  filterControlGroupActions,
  filterFacetKinds,
  filterRangeBoundaries,
} from "@mk-combos/ui/components/filter-control-group";
import {
  ListEditDialog,
  listEditDialogActions,
  listEditDialogModes,
} from "@mk-combos/ui/components/list-edit-dialog";
import {
  NamedListDetail,
  namedListDetailActions,
} from "@mk-combos/ui/components/named-list-detail";
import { NamedListIndex, namedListIndexActions } from "@mk-combos/ui/components/named-list-index";
import {
  NotationRenderer,
  notationRendererDensities,
  notationRendererWrappingModes,
} from "@mk-combos/ui/components/notation-renderer";
import {
  StaleInvalidComboMarker,
  staleInvalidComboMarkerActionKinds,
  staleInvalidComboMarkerActions,
  staleInvalidComboMarkerStates,
} from "@mk-combos/ui/components/stale-invalid-combo-marker";
import type {
  ComboPresentationSummary,
  PickerOption,
  PickerSlot,
} from "@mk-combos/ui/components/type";
import { pickerSlotStatuses, uiResponsiveModes } from "@mk-combos/ui/components/value";
import { describe, expect, it, vi } from "vitest";

const comboRef = { comboId: "combo-1", gameId: "future-game", source: "seeded" } as const;
const secondComboRef = {
  comboId: "combo-2",
  gameId: "future-game",
  source: "seeded",
} as const;

const pickerOptions = [
  { count: 3, id: "fighter-1", label: "Fighter One" },
  {
    disabledReason: "Complete setup to unlock",
    id: "fighter-2",
    label: "Fighter Two",
  },
] as const satisfies readonly PickerOption[];

const pickerSlots = [
  {
    column: 2,
    optionId: "fighter-1",
    responsiveOrder: 3,
    row: 1,
    slotId: "slot-1",
    status: pickerSlotStatuses.selectable,
  },
  {
    column: 1,
    optionId: "fighter-2",
    responsiveOrder: 1,
    row: 2,
    slotId: "slot-2",
    status: pickerSlotStatuses.disabledUnavailable,
  },
  {
    column: 3,
    responsiveOrder: 2,
    row: 1,
    slotId: "slot-placeholder",
    status: pickerSlotStatuses.placeholder,
  },
] as const satisfies readonly PickerSlot[];

function summary(
  title: string,
  ref: ComboRef = comboRef,
  notation: readonly (readonly string[])[] = [["F", "2"], ["UNKNOWN"]],
): ComboPresentationSummary {
  return {
    accessibleLabel: `${title} notation`,
    contextItems: [{ id: "fighter", label: "Fighter", value: "Prepared fighter" }],
    membershipHint: "In Favorites",
    metadataItems: [{ id: "damage", label: "Damage", value: "280" }],
    notation,
    notesSnippet: "Prepared notes",
    ref,
    title,
  };
}

function card(title: string, ref: ComboRef = comboRef): ComboCardModel {
  return {
    actions: [
      {
        available: true,
        id: `open-${ref.comboId}`,
        kind: comboCardActionKinds.openDetail,
        label: `Open ${title}`,
      },
      {
        available: false,
        disabledReason: "Custom copies unavailable",
        id: `duplicate-${ref.comboId}`,
        kind: comboCardActionKinds.duplicateToCustomCombo,
        label: `Duplicate ${title}`,
      },
    ],
    summary: summary(title, ref),
  };
}

describe("catalog presentation components", () => {
  it("uses prepared picker coordinates and compact order while unavailable slots stay inert", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <CharacterPicker
        clearLabel="Clear character"
        focusedSlotId="slot-1"
        label="Characters"
        layoutId="prepared-layout"
        onRequestAction={onRequestAction}
        options={pickerOptions}
        responsiveMode={uiResponsiveModes.desktop}
        selectedCharacterId="fighter-1"
        slots={pickerSlots}
        sourceFocusTarget="catalog-character"
        sourceSurface="catalog"
      />,
    );

    const available = screen.getByRole("button", { name: "Fighter One" });
    const unavailable = screen.getByRole("button", {
      name: "Fighter Two: Complete setup to unlock",
    });
    const placeholder = view.container.querySelector(
      '[data-picker-slot="slot-placeholder"]',
    ) as HTMLElement;

    expect(available.style.gridColumn).toBe("2");
    expect(available.style.gridRow).toBe("1");
    expect((unavailable as HTMLButtonElement).disabled).toBe(true);
    expect(placeholder.getAttribute("aria-hidden")).toBe("true");
    fireEvent.focus(available);
    fireEvent.click(available);
    fireEvent.click(unavailable);
    expect(onRequestAction).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: characterPickerActions.focusCharacterSlot,
        characterId: "fighter-1",
        reason: "triggerFocus",
        slotId: "slot-1",
      }),
    );
    expect(onRequestAction).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        action: characterPickerActions.selectCharacter,
        characterId: "fighter-1",
        reason: "press",
        sourceFocusTarget: "catalog-character",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledTimes(2);

    view.rerender(
      <CharacterPicker
        label="Characters"
        layoutId="prepared-layout"
        options={pickerOptions}
        responsiveMode={uiResponsiveModes.mobile}
        slots={pickerSlots}
        sourceSurface="catalog"
      />,
    );
    expect(screen.getByRole("button", { name: "Fighter One" }).style.order).toBe("3");
    expect(
      (view.container.querySelector('[data-picker-slot="slot-placeholder"]') as HTMLElement).style
        .order,
    ).toBe("2");
  });

  it("composes exactly one prepared context picker without branching on a game id", () => {
    const commonPicker = {
      label: "Characters",
      layoutId: "characters",
      options: pickerOptions,
      slots: pickerSlots,
      sourceSurface: "catalog",
    } as const;
    const filterGroup = {
      activeFilters: [],
      clearLabel: "Clear",
      expanded: false,
      facets: [],
      label: "Filters",
      resultCountLabel: "2 results",
      sourceSurface: "catalog",
    } as const;
    const view = render(
      <ComboListConfigModule
        characterPicker={commonPicker}
        filterGroup={filterGroup}
        gameContextPicker={{
          kind: comboListConfigPickerKinds.variation,
          props: {
            label: "Variations",
            layoutId: "variations",
            options: [],
            parentContextLabel: "Fighter One",
            slots: [],
            sourceSurface: "catalog",
          },
        }}
        responsiveMode={uiResponsiveModes.desktop}
      />,
    );

    expect(view.container.querySelector('[data-ui-component="UI-CMP-008"]')).toBeTruthy();
    expect(view.container.querySelector('[data-ui-component="UI-CMP-009"]')).toBeNull();

    view.rerender(
      <ComboListConfigModule
        characterPicker={commonPicker}
        filterGroup={filterGroup}
        gameContextPicker={{
          kind: comboListConfigPickerKinds.kameo,
          props: {
            label: "Partners",
            layoutId: "partners",
            options: [],
            parentContextLabel: "Fighter One",
            slots: [],
            sourceSurface: "catalog",
          },
        }}
        responsiveMode={uiResponsiveModes.tablet}
      />,
    );
    expect(view.container.querySelector('[data-ui-component="UI-CMP-008"]')).toBeNull();
    expect(view.container.querySelector('[data-ui-component="UI-CMP-009"]')).toBeTruthy();
  });

  it("emits controlled live filter, chip, range, disclosure, and clear intents", () => {
    const onRequestAction = vi.fn();
    render(
      <FilterControlGroup
        activeFilters={[
          {
            filterId: "range",
            id: "active-range",
            label: "Damage: 200+",
            removeLabel: "Remove damage filter",
            value: "200",
          },
        ]}
        clearLabel="Clear filters"
        expanded
        facets={[
          {
            id: "position",
            kind: filterFacetKinds.singleChoice,
            label: "Position",
            options: [{ available: true, id: "midscreen", label: "Midscreen" }],
            selectedValues: [],
          },
          {
            id: "tags",
            kind: filterFacetKinds.multiChoice,
            label: "Tags",
            options: [{ available: true, id: "easy", label: "Easy" }],
            selectedValues: ["easy"],
          },
          {
            id: "range",
            kind: filterFacetKinds.range,
            label: "Damage",
            maximumLabel: "Maximum damage",
            maximumValue: "500",
            minimumLabel: "Minimum damage",
            minimumValue: "200",
          },
        ]}
        label="Filters"
        onRequestAction={onRequestAction}
        resultCountLabel="12 results"
        sourceFocusTarget="filter-trigger"
        sourceSurface="catalog"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Midscreen" }));
    fireEvent.click(screen.getByRole("button", { name: "Easy" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Minimum damage" }), {
      target: { value: "250" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Remove damage filter" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    fireEvent.click(screen.getByRole("button", { name: /Filters/ }));

    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.updateOptionalFilter,
        filterId: "position",
        selected: true,
        value: "midscreen",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.updateOptionalFilter,
        filterId: "tags",
        selected: false,
        value: "easy",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.updateOptionalFilter,
        boundary: filterRangeBoundaries.minimum,
        filterId: "range",
        value: "250",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.removeActiveFilter,
        filterId: "range",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: filterControlGroupActions.clearFilters }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.closeFilterGroup,
        expanded: false,
      }),
    );
  });

  it("preserves prepared combo order and maps notation without mutating its source", () => {
    const notation = [["F", "2"], ["UNKNOWN"]] as const;
    const before = JSON.stringify(notation);
    const onRequestAction = vi.fn();
    const items = [card("Second", secondComboRef), card("First", comboRef)] as const;
    render(
      <ComboList
        accessibleLabel="Prepared combos"
        items={items}
        notationDisplayMode="PlayStation"
        onRequestAction={onRequestAction}
        sourceSurface="catalog"
        state={comboListStates.comboListReady}
      />,
    );

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["Second", "First"]);
    fireEvent.focus(screen.getByRole("article", { name: "Second notation" }));
    fireEvent.click(screen.getByRole("button", { name: "Open Second" }));
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboListActions.focusCombo,
        comboRef: secondComboRef,
        reason: "triggerFocus",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboListActions.openComboDetail,
        actionId: "open-combo-2",
        comboRef: secondComboRef,
      }),
    );
    expect(
      (screen.getByRole("button", { name: /Duplicate Second/ }) as HTMLButtonElement).disabled,
    ).toBe(true);

    const notationView = render(
      <NotationRenderer
        density={notationRendererDensities.detail}
        notation={notation}
        notationDisplayMode="Xbox"
        tokenState="invalid"
        wrappingMode={notationRendererWrappingModes.inline}
      />,
    );
    expect(JSON.stringify(notation)).toBe(before);
    expect(
      notationView.container
        .querySelector('[data-ui-component="UI-CMP-015"]')
        ?.getAttribute("aria-label"),
    ).toContain("Unknown notation token UNKNOWN");
    expect(notationView.container.querySelector('[data-token-state="invalid"]')).toBeTruthy();
  });

  it("uses the list state as the exclusive owner of empty, ready, and loading presentation", () => {
    const emptyState = {
      actions: [],
      message: "No prepared combos match this state",
      stateToken: "no-combos",
      title: "No combos",
    } as const;
    const view = render(
      <ComboList
        accessibleLabel="Prepared combos"
        emptyState={emptyState}
        items={[card("Contradictory card")]}
        notationDisplayMode="FGC"
        sourceSurface="catalog"
        state={comboListStates.noCombos}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "No combos" })).toBeTruthy();
    expect(screen.queryByRole("article", { name: "Contradictory card notation" })).toBeNull();

    view.rerender(
      <ComboList
        accessibleLabel="Prepared combos"
        emptyState={emptyState}
        items={[card("Ready card")]}
        notationDisplayMode="FGC"
        sourceSurface="catalog"
        state={comboListStates.comboListReady}
      />,
    );
    expect(screen.queryByRole("heading", { level: 2, name: "No combos" })).toBeNull();
    expect(screen.getByRole("article", { name: "Ready card notation" })).toBeTruthy();

    view.rerender(
      <ComboList
        accessibleLabel="Prepared combos"
        emptyState={emptyState}
        items={[card("Previous card")]}
        notationDisplayMode="FGC"
        sourceSurface="catalog"
        state={comboListStates.loadingCombos}
        statusMessage="Refreshing combos"
      />,
    );

    const previousCard = screen.getByRole("article", { name: "Previous card notation" });
    expect(screen.getByRole("status").textContent).toBe("Refreshing combos");
    expect(previousCard.getAttribute("aria-disabled")).toBe("true");
    expect(previousCard.getAttribute("tabindex")).toBe("-1");
    expect(screen.queryByRole("heading", { level: 2, name: "No combos" })).toBeNull();
    expect(
      (screen.getByRole("button", { name: "Open Previous card" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});

describe("detail, named-list, and system presentation components", () => {
  it("renders prepared detail metadata and returns anchored menu/header intents", () => {
    const headerAction = vi.fn();
    const menuAction = vi.fn();
    render(
      <>
        <ComboDetailHeader
          actions={[
            {
              available: true,
              id: "add",
              kind: comboDetailHeaderActionKinds.addToList,
              label: "Add to list",
            },
          ]}
          comboRef={comboRef}
          contextItems={[{ id: "fighter", label: "Fighter", value: "Prepared fighter" }]}
          onRequestAction={headerAction}
          sourceFocusTarget="detail-heading"
          sourceLabel="Seeded"
          sourceSurface="detail"
          title="Prepared detail"
        />
        <ComboMetadataGrid
          annotation="Prepared warning"
          label="Combo metadata"
          responsiveMode={uiResponsiveModes.mobile}
          rows={[
            {
              id: "damage",
              importance: comboMetadataImportances.critical,
              label: "Damage",
              statusLabel: "High",
              value: "280",
            },
          ]}
        />
        <ComboActionsMenu
          actions={[
            { available: true, id: "copy", label: "Copy notation" },
            {
              available: false,
              disabledReason: "Unavailable for this source",
              id: "delete",
              label: "Delete",
            },
          ]}
          comboRef={comboRef}
          label="Combo actions"
          menuState={comboActionsMenuStates.open}
          onRequestAction={menuAction}
          sourceFocusTarget="detail-actions"
          sourceSurface="detail"
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add to list" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Copy notation" }));
    expect(headerAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboDetailHeaderActions.openAddToList,
        actionId: "add",
        comboRef,
      }),
    );
    expect(menuAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboActionsMenuActions.selectComboAction,
        actionId: "copy",
        comboRef,
        reason: "itemPress",
        sourceFocusTarget: "detail-actions",
      }),
    );
    expect(screen.getByText("Prepared warning")).toBeTruthy();
    expect(
      (screen.getByRole("menuitem", { name: /Delete/ }) as HTMLElement).getAttribute(
        "aria-disabled",
      ),
    ).toBe("true");
  });

  it("emits list selection and target-index reorder without changing prepared order", () => {
    const indexAction = vi.fn();
    const detailAction = vi.fn();
    const firstCard = card("First", comboRef);
    const secondCard = card("Second", secondComboRef);
    const firstListCard = {
      ...firstCard,
      actions: [
        {
          available: true,
          id: "open-first",
          kind: comboCardActionKinds.openDetail,
          label: "Open First",
        },
      ],
    } as const;
    const secondListCard = {
      ...secondCard,
      actions: [
        {
          available: true,
          id: "open-second",
          kind: comboCardActionKinds.openDetail,
          label: "Open Second",
        },
      ],
    } as const;
    render(
      <>
        <NamedListIndex
          createAction={{ available: true, id: "create", label: "Create list" }}
          items={[
            {
              renameAction: { available: true, id: "rename", label: "Rename Favorites" },
              summary: { id: "favorites", itemCount: 2, name: "Favorites" },
            },
          ]}
          onRequestAction={indexAction}
          selectedListId="favorites"
          sourceSurface="lists"
        />
        <NamedListDetail
          items={[
            {
              card: firstListCard,
              id: "item-1",
              removeLabel: "Remove First",
              reorderDownLabel: "Move First down",
              reorderUpLabel: "Move First up",
            },
            {
              card: secondListCard,
              id: "item-2",
              removeLabel: "Remove Second",
              reorderDownLabel: "Move Second down",
              reorderUpLabel: "Move Second up",
            },
          ]}
          list={{ id: "favorites", itemCount: 2, name: "Favorites" }}
          notationDisplayMode="FGC"
          onRequestAction={detailAction}
          sourceSurface="lists"
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: /^Favorites2$/ }));
    fireEvent.click(screen.getByRole("button", { name: "Move First down" }));
    expect(indexAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: namedListIndexActions.selectList,
        listId: "favorites",
      }),
    );
    expect(detailAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: namedListDetailActions.reorderListItem,
        itemId: "item-1",
        listId: "favorites",
        targetIndex: 1,
      }),
    );
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["First", "Second"]);
  });

  it("keeps add-to-list target selection controlled and preserves focus-return metadata", () => {
    const onRequestAction = vi.fn();
    const props = {
      cancelLabel: "Cancel",
      comboSummary: summary("Prepared combo"),
      compatibleLists: [
        {
          alreadyMember: false,
          available: true,
          summary: { id: "favorites", itemCount: 2, name: "Favorites" },
        },
        {
          alreadyMember: true,
          available: true,
          summary: { id: "lab", itemCount: 4, name: "Lab" },
        },
      ],
      description: "Choose one prepared list",
      membershipLabel: "Already added",
      onRequestAction,
      open: true,
      sourceFocusTarget: "combo-card-1",
      sourceSurface: "catalog",
      submitAvailability: { available: true },
      submitLabel: "Add combo",
      title: "Add to list",
    } as const;
    const view = render(<AddToListDialog {...props} />);
    const favorites = screen.getByRole("button", { name: "Favorites" });

    fireEvent.click(favorites);
    expect(favorites.getAttribute("aria-pressed")).toBe("false");
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: addToListDialogActions.selectTargetList,
        comboRef,
        sourceFocusTarget: "combo-card-1",
        targetListId: "favorites",
      }),
    );
    expect((screen.getByRole("button", { name: "Lab" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Add combo" }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    view.rerender(<AddToListDialog {...props} selectedListId="favorites" />);
    fireEvent.click(screen.getByRole("button", { name: "Add combo" }));
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: addToListDialogActions.submitAddToList,
        targetListId: "favorites",
      }),
    );
  });

  it("keeps list editing and builder fields controlled with semantic change reasons", () => {
    const listAction = vi.fn();
    const builderAction = vi.fn();
    const view = render(
      <ListEditDialog
        cancelLabel="Cancel edit"
        description="Rename the prepared list"
        draftName="Favorites"
        fieldLabel="List name"
        mode={listEditDialogModes.renameList}
        onRequestAction={listAction}
        open
        selectedList={{ id: "favorites", itemCount: 2, name: "Favorites" }}
        sourceFocusTarget="favorites-row"
        sourceSurface="lists"
        submitAvailability={{ available: true }}
        submitLabel="Save name"
        title="Rename list"
        validationMessage="Name must be unique"
      />,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "List name" }), {
      target: { value: "Finishers" },
    });
    expect(listAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: listEditDialogActions.changeListDraftName,
        listId: "favorites",
        mode: listEditDialogModes.renameList,
        reason: "inputChange",
        value: "Finishers",
      }),
    );

    view.rerender(
      <ListEditDialog
        cancelLabel="Cancel delete"
        deleteImpactMessage="This removes the prepared list"
        description="Delete the prepared list"
        draftName="Favorites"
        fieldLabel="List name"
        mode={listEditDialogModes.deleteListConfirm}
        open
        selectedList={{ id: "favorites", itemCount: 2, name: "Favorites" }}
        sourceSurface="lists"
        submitAvailability={{ available: true }}
        submitLabel="Delete list"
        title="Delete list"
      />,
    );
    expect(screen.queryByRole("textbox", { name: "List name" })).toBeNull();
    expect(screen.getByText("This removes the prepared list")).toBeTruthy();

    view.unmount();
    render(
      <BuilderContextSetup
        confirmAction={{ available: true, id: "confirm", label: "Continue" }}
        label="Builder context"
        onRequestAction={builderAction}
        optionalFields={[
          {
            id: "stage",
            kind: builderContextFieldKinds.choice,
            label: "Stage",
            options: [{ available: true, id: "arena", label: "Arena" }],
          },
        ]}
        primaryFields={[
          {
            id: "fighter",
            kind: builderContextFieldKinds.choice,
            label: "Fighter",
            options: [{ available: true, id: "fighter-1", label: "Fighter One" }],
          },
        ]}
        runtimeFields={[
          {
            id: "runtime-note",
            kind: builderContextFieldKinds.text,
            label: "Runtime note",
            value: "Prepared",
          },
        ]}
        sourceSurface="builder"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Fighter One" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Runtime note" }), {
      target: { value: "Updated" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(builderAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: builderContextSetupActions.updateBuilderContext,
        fieldId: "fighter",
        reason: "press",
        value: "fighter-1",
      }),
    );
    expect(builderAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: builderContextSetupActions.updateRuntimeStartState,
        fieldId: "runtime-note",
        reason: "inputChange",
        value: "Updated",
      }),
    );
    expect(builderAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: builderContextSetupActions.confirmBuilderContext,
        actionId: "confirm",
      }),
    );
  });

  it("announces prepared empty/error/stale states and blocks critical dismissal", () => {
    const emptyAction = vi.fn();
    const errorAction = vi.fn();
    const staleAction = vi.fn();
    render(
      <>
        <EmptyState
          actions={[{ available: true, id: "choose", label: "Choose context" }]}
          message="Select a prepared context"
          onRequestAction={emptyAction}
          sourceSurface="catalog"
          stateToken="context-empty"
          title="No context"
        />
        <ErrorState
          actions={[
            {
              available: true,
              id: "retry",
              kind: errorStateActionKinds.retry,
              label: "Retry catalog",
            },
          ]}
          errorToken="catalog-error"
          message="Prepared recovery message"
          onRequestAction={errorAction}
          severity={errorStateSeverities.blocking}
          sourceSurface="catalog"
          title="Catalog unavailable"
        />
        <StaleInvalidComboMarker
          actions={[
            {
              available: true,
              id: "dismiss",
              kind: staleInvalidComboMarkerActionKinds.dismiss,
              label: "Dismiss invalid marker",
            },
            {
              available: true,
              id: "repair",
              kind: staleInvalidComboMarkerActionKinds.repair,
              label: "Repair combo",
            },
          ]}
          comboRef={comboRef}
          onRequestAction={staleAction}
          reason="A referenced catalog entry is unavailable"
          sourceSurface="detail"
          state={staleInvalidComboMarkerStates.invalid}
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Choose context" }));
    fireEvent.click(screen.getByRole("button", { name: "Retry catalog" }));
    fireEvent.click(screen.getByRole("button", { name: "Repair combo" }));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "Dismiss invalid marker" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(emptyAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: emptyStateActions.runEmptyStateAction,
        actionId: "choose",
      }),
    );
    expect(errorAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: errorStateActions.retryErrorAction,
        errorToken: "catalog-error",
      }),
    );
    expect(staleAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: staleInvalidComboMarkerActions.repairInvalidCombo,
        actionId: "repair",
        comboRef,
      }),
    );
  });
});
