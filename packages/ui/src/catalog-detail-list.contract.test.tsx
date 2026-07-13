import type {
  AddToListDialogIntent,
  AddToListOption,
} from "@mk-combos/ui/components/add-to-list-dialog";
import {
  AddToListDialog,
  addToListDialogActions,
} from "@mk-combos/ui/components/add-to-list-dialog";
import type {
  BuilderContextChoiceField,
  BuilderContextField,
  BuilderContextFieldKind,
  BuilderContextFieldOption,
  BuilderContextSetupIntent,
  BuilderContextTextField,
} from "@mk-combos/ui/components/builder-context-setup";
import {
  BuilderContextSetup,
  builderContextFieldKinds,
  builderContextSetupActions,
} from "@mk-combos/ui/components/builder-context-setup";
import type { CharacterPickerIntent } from "@mk-combos/ui/components/character-picker";
import { CharacterPicker, characterPickerActions } from "@mk-combos/ui/components/character-picker";
import type {
  ComboActionsMenuAction,
  ComboActionsMenuIntent,
  ComboActionsMenuState,
} from "@mk-combos/ui/components/combo-actions-menu";
import {
  ComboActionsMenu,
  comboActionsMenuActions,
} from "@mk-combos/ui/components/combo-actions-menu";
import type { ComboCardActionKind } from "@mk-combos/ui/components/combo-card";
import { ComboCard, comboCardActions } from "@mk-combos/ui/components/combo-card";
import type {
  ComboDetailHeaderAction,
  ComboDetailHeaderActionDescriptor,
  ComboDetailHeaderActionKind,
  ComboDetailHeaderIntent,
} from "@mk-combos/ui/components/combo-detail-header";
import {
  ComboDetailHeader,
  comboDetailHeaderActions,
} from "@mk-combos/ui/components/combo-detail-header";
import type {
  ComboListAction,
  ComboListIntent,
  ComboListState,
} from "@mk-combos/ui/components/combo-list";
import { ComboList, comboListActions, comboListStates } from "@mk-combos/ui/components/combo-list";
import type {
  ComboListConfigGameContextPicker,
  ComboListConfigModuleAction,
  ComboListConfigModuleIntent,
  ComboListConfigPickerKind,
} from "@mk-combos/ui/components/combo-list-config-module";
import {
  ComboListConfigModule,
  comboListConfigModuleActions,
  comboListConfigPickerKinds,
} from "@mk-combos/ui/components/combo-list-config-module";
import type {
  ComboMetadataGridAction,
  ComboMetadataGridIntent,
  ComboMetadataImportance,
  ComboMetadataRow,
} from "@mk-combos/ui/components/combo-metadata-grid";
import {
  ComboMetadataGrid,
  comboMetadataGridActions,
} from "@mk-combos/ui/components/combo-metadata-grid";
import { EmptyState, emptyStateActions } from "@mk-combos/ui/components/empty-state";
import type {
  ErrorStateAction,
  ErrorStateActionDescriptor,
  ErrorStateActionKind,
  ErrorStateIntent,
  ErrorStateSeverity,
} from "@mk-combos/ui/components/error-state";
import { ErrorState, errorStateActions } from "@mk-combos/ui/components/error-state";
import type {
  ActiveFilterChip,
  FilterChoiceFacet,
  FilterChoiceOption,
  FilterControlGroupAction,
  FilterControlGroupIntent,
  FilterFacet,
  FilterFacetKind,
  FilterRangeBoundary,
  FilterRangeFacet,
} from "@mk-combos/ui/components/filter-control-group";
import {
  FilterControlGroup,
  filterControlGroupActions,
  filterFacetKinds,
} from "@mk-combos/ui/components/filter-control-group";
import type { KameoPickerIntent } from "@mk-combos/ui/components/kameo-picker";
import { KameoPicker, kameoPickerActions } from "@mk-combos/ui/components/kameo-picker";
import type {
  ListEditDialogIntent,
  ListEditDialogMode,
} from "@mk-combos/ui/components/list-edit-dialog";
import { ListEditDialog, listEditDialogActions } from "@mk-combos/ui/components/list-edit-dialog";
import type {
  NamedListDetailAction,
  NamedListDetailIntent,
} from "@mk-combos/ui/components/named-list-detail";
import {
  NamedListDetail,
  namedListDetailActions,
} from "@mk-combos/ui/components/named-list-detail";
import type {
  NamedListIndexIntent,
  NamedListIndexItem,
} from "@mk-combos/ui/components/named-list-index";
import { NamedListIndex, namedListIndexActions } from "@mk-combos/ui/components/named-list-index";
import type {
  NotationRendererAction,
  NotationRendererIntent,
  NotationRendererWrappingMode,
} from "@mk-combos/ui/components/notation-renderer";
import {
  NotationRenderer,
  notationRendererActions,
} from "@mk-combos/ui/components/notation-renderer";
import {
  ComboPresentationSummarySchema,
  ComponentActionDescriptorSchema,
  ComponentAvailabilitySchema,
  ComponentLabelValueSchema,
  NamedListSummarySchema,
  PickerOptionSchema,
  PickerSlotSchema,
} from "@mk-combos/ui/components/schema";
import type {
  StaleInvalidComboMarkerAction,
  StaleInvalidComboMarkerActionDescriptor,
  StaleInvalidComboMarkerActionKind,
  StaleInvalidComboMarkerState,
} from "@mk-combos/ui/components/stale-invalid-combo-marker";
import {
  StaleInvalidComboMarker,
  staleInvalidComboMarkerActions,
} from "@mk-combos/ui/components/stale-invalid-combo-marker";
import type { PickerSlotStatus } from "@mk-combos/ui/components/type";
import { pickerSlotStatuses } from "@mk-combos/ui/components/value";
import type { VariationPickerIntent } from "@mk-combos/ui/components/variation-picker";
import { VariationPicker, variationPickerActions } from "@mk-combos/ui/components/variation-picker";
import { mkCombosUi, uiContractGroups } from "@mk-combos/ui/contract";
import { describe, expect, it } from "vitest";

import uiPackage from "../package.json";
import uiTsdownConfig from "../tsdown.config";

const publicComponents = [
  AddToListDialog,
  BuilderContextSetup,
  CharacterPicker,
  ComboActionsMenu,
  ComboCard,
  ComboDetailHeader,
  ComboList,
  ComboListConfigModule,
  ComboMetadataGrid,
  EmptyState,
  ErrorState,
  FilterControlGroup,
  KameoPicker,
  ListEditDialog,
  NamedListDetail,
  NamedListIndex,
  NotationRenderer,
  StaleInvalidComboMarker,
  VariationPicker,
] as const;

type PublicCatalogDetailListTypes = {
  activeFilterChip: ActiveFilterChip;
  addToListDialogIntent: AddToListDialogIntent;
  addToListOption: AddToListOption;
  builderContextChoiceField: BuilderContextChoiceField;
  builderContextField: BuilderContextField;
  builderContextFieldKind: BuilderContextFieldKind;
  builderContextFieldOption: BuilderContextFieldOption;
  builderContextSetupIntent: BuilderContextSetupIntent;
  builderContextTextField: BuilderContextTextField;
  characterPickerIntent: CharacterPickerIntent;
  comboActionsMenuAction: ComboActionsMenuAction;
  comboActionsMenuIntent: ComboActionsMenuIntent;
  comboActionsMenuState: ComboActionsMenuState;
  comboCardActionKind: ComboCardActionKind;
  comboDetailHeaderAction: ComboDetailHeaderAction;
  comboDetailHeaderActionDescriptor: ComboDetailHeaderActionDescriptor;
  comboDetailHeaderActionKind: ComboDetailHeaderActionKind;
  comboDetailHeaderIntent: ComboDetailHeaderIntent;
  comboListAction: ComboListAction;
  comboListConfigGameContextPicker: ComboListConfigGameContextPicker;
  comboListConfigModuleAction: ComboListConfigModuleAction;
  comboListConfigModuleIntent: ComboListConfigModuleIntent;
  comboListConfigPickerKind: ComboListConfigPickerKind;
  comboListIntent: ComboListIntent;
  comboListState: ComboListState;
  comboMetadataGridAction: ComboMetadataGridAction;
  comboMetadataGridIntent: ComboMetadataGridIntent;
  comboMetadataImportance: ComboMetadataImportance;
  comboMetadataRow: ComboMetadataRow;
  errorStateAction: ErrorStateAction;
  errorStateActionDescriptor: ErrorStateActionDescriptor;
  errorStateActionKind: ErrorStateActionKind;
  errorStateIntent: ErrorStateIntent;
  errorStateSeverity: ErrorStateSeverity;
  filterChoiceFacet: FilterChoiceFacet;
  filterChoiceOption: FilterChoiceOption;
  filterControlGroupAction: FilterControlGroupAction;
  filterControlGroupIntent: FilterControlGroupIntent;
  filterFacet: FilterFacet;
  filterFacetKind: FilterFacetKind;
  filterRangeBoundary: FilterRangeBoundary;
  filterRangeFacet: FilterRangeFacet;
  kameoPickerIntent: KameoPickerIntent;
  listEditDialogIntent: ListEditDialogIntent;
  listEditDialogMode: ListEditDialogMode;
  namedListDetailAction: NamedListDetailAction;
  namedListDetailIntent: NamedListDetailIntent;
  namedListIndexIntent: NamedListIndexIntent;
  namedListIndexItem: NamedListIndexItem;
  notationRendererAction: NotationRendererAction;
  notationRendererIntent: NotationRendererIntent;
  notationRendererWrappingMode: NotationRendererWrappingMode;
  pickerSlotStatus: PickerSlotStatus;
  staleInvalidComboMarkerAction: StaleInvalidComboMarkerAction;
  staleInvalidComboMarkerActionDescriptor: StaleInvalidComboMarkerActionDescriptor;
  staleInvalidComboMarkerActionKind: StaleInvalidComboMarkerActionKind;
  staleInvalidComboMarkerState: StaleInvalidComboMarkerState;
  variationPickerIntent: VariationPickerIntent;
};

const acceptsPublicCatalogDetailListTypes = <_Contract extends PublicCatalogDetailListTypes>() =>
  true;

const roadmapComponentSubpaths = {
  addToListDialog: "@mk-combos/ui/components/add-to-list-dialog",
  builderContextSetup: "@mk-combos/ui/components/builder-context-setup",
  characterPicker: "@mk-combos/ui/components/character-picker",
  comboActionsMenu: "@mk-combos/ui/components/combo-actions-menu",
  comboCard: "@mk-combos/ui/components/combo-card",
  comboDetailHeader: "@mk-combos/ui/components/combo-detail-header",
  comboList: "@mk-combos/ui/components/combo-list",
  comboListConfigModule: "@mk-combos/ui/components/combo-list-config-module",
  comboMetadataGrid: "@mk-combos/ui/components/combo-metadata-grid",
  emptyState: "@mk-combos/ui/components/empty-state",
  errorState: "@mk-combos/ui/components/error-state",
  filterControlGroup: "@mk-combos/ui/components/filter-control-group",
  kameoPicker: "@mk-combos/ui/components/kameo-picker",
  listEditDialog: "@mk-combos/ui/components/list-edit-dialog",
  namedListDetail: "@mk-combos/ui/components/named-list-detail",
  namedListIndex: "@mk-combos/ui/components/named-list-index",
  notationRenderer: "@mk-combos/ui/components/notation-renderer",
  staleInvalidComboMarker: "@mk-combos/ui/components/stale-invalid-combo-marker",
  variationPicker: "@mk-combos/ui/components/variation-picker",
} as const;

describe("catalog, detail, and named-list public contracts", () => {
  it("publishes every roadmap component through an explicit importable subpath", () => {
    expect(acceptsPublicCatalogDetailListTypes()).toBe(true);
    for (const Component of publicComponents) {
      expect(Component).toBeTypeOf("function");
    }

    expect(uiContractGroups.components).toEqual(expect.objectContaining(roadmapComponentSubpaths));
  });

  it("keeps package, publish, tsdown, and contract metadata in parity", async () => {
    const resolvedTsdownExport = await uiTsdownConfig({}, { ci: true });
    const resolvedTsdownConfig = Array.isArray(resolvedTsdownExport)
      ? resolvedTsdownExport[0]
      : resolvedTsdownExport;
    const sourceExports = uiPackage.exports as Record<string, string>;
    const publishExports = uiPackage.publishConfig.exports as Record<string, string>;
    const tsdownEntries = resolvedTsdownConfig?.entry as Record<string, string>;

    for (const contractSubpath of Object.values(roadmapComponentSubpaths)) {
      const packageSubpath = `.${contractSubpath.slice("@mk-combos/ui".length)}`;
      const entrySubpath = packageSubpath.slice(2);

      expect(sourceExports[packageSubpath]).toBe(`./src/${entrySubpath}.tsx`);
      expect(publishExports[packageSubpath]).toBe(`./dist/${entrySubpath}.mjs`);
      expect(tsdownEntries[entrySubpath]).toBe(`src/${entrySubpath}.tsx`);
    }
  });

  it("publishes exact action dictionaries without request prefixes", () => {
    expect(characterPickerActions).toEqual({
      clearCharacter: "clearCharacter",
      focusCharacterSlot: "focusCharacterSlot",
      moveToGameSpecificPicker: "moveToGameSpecificPicker",
      selectCharacter: "selectCharacter",
    });
    expect(variationPickerActions).toEqual({
      clearVariation: "clearVariation",
      focusVariationSlot: "focusVariationSlot",
      returnToCharacterPicker: "returnToCharacterPicker",
      selectVariation: "selectVariation",
    });
    expect(kameoPickerActions).toEqual({
      clearKameo: "clearKameo",
      focusKameoSlot: "focusKameoSlot",
      returnToCharacterPicker: "returnToCharacterPicker",
      selectKameo: "selectKameo",
    });
    expect(comboListActions).toEqual({
      addToList: "addToList",
      clearFilters: "clearFilters",
      duplicateToCustomCombo: "duplicateToCustomCombo",
      focusCombo: "focusCombo",
      openComboActions: "openComboActions",
      openComboDetail: "openComboDetail",
      returnFocusToConfig: "returnFocusToConfig",
    });
    expect(comboCardActions).toEqual({
      addToList: "addToList",
      duplicateToCustomCombo: "duplicateToCustomCombo",
      focusAction: "focusAction",
      focusCard: "focusCard",
      openContextualActions: "openContextualActions",
      openDetail: "openDetail",
      returnFocusToList: "returnFocusToList",
    });
    expect(filterControlGroupActions).toEqual({
      clearFilters: "clearFilters",
      closeFilterGroup: "closeFilterGroup",
      removeActiveFilter: "removeActiveFilter",
      returnFocusToCatalog: "returnFocusToCatalog",
      toggleFilterGroup: "toggleFilterGroup",
      updateOptionalFilter: "updateOptionalFilter",
    });
    expect(comboDetailHeaderActions).toEqual({
      duplicateCombo: "duplicateCombo",
      editCustomCombo: "editCustomCombo",
      openAddToList: "openAddToList",
      repairCustomCombo: "repairCustomCombo",
      returnToSource: "returnToSource",
    });
    expect(comboActionsMenuActions).toEqual({
      closeActions: "closeActions",
      openActions: "openActions",
      returnFocusToDetail: "returnFocusToDetail",
      selectComboAction: "selectComboAction",
    });
    expect(namedListIndexActions).toEqual({
      focusList: "focusList",
      openCreateList: "openCreateList",
      openDeleteListConfirm: "openDeleteListConfirm",
      openRenameList: "openRenameList",
      selectList: "selectList",
    });
    expect(namedListDetailActions).toEqual({
      focusListItem: "focusListItem",
      openAddToList: "openAddToList",
      openComboDetail: "openComboDetail",
      removeFromList: "removeFromList",
      reorderListItem: "reorderListItem",
    });
    expect(addToListDialogActions).toEqual({
      closeAddToList: "closeAddToList",
      createListFromDialog: "createListFromDialog",
      retryAddToList: "retryAddToList",
      selectTargetList: "selectTargetList",
      submitAddToList: "submitAddToList",
    });
    expect(listEditDialogActions).toEqual({
      changeListDraftName: "changeListDraftName",
      closeListEdit: "closeListEdit",
      returnFocusToLists: "returnFocusToLists",
      submitListEdit: "submitListEdit",
    });
    expect(builderContextSetupActions).toEqual({
      confirmBuilderContext: "confirmBuilderContext",
      resetBuilderContext: "resetBuilderContext",
      updateBuilderContext: "updateBuilderContext",
      updateRuntimeStartState: "updateRuntimeStartState",
      updateStageContext: "updateStageContext",
    });
    expect(emptyStateActions).toEqual({
      dismissEmptyState: "dismissEmptyState",
      runEmptyStateAction: "runEmptyStateAction",
    });
    expect(errorStateActions).toEqual({
      dismissRecoverableError: "dismissRecoverableError",
      navigateErrorFallback: "navigateErrorFallback",
      retryErrorAction: "retryErrorAction",
    });
    expect(staleInvalidComboMarkerActions).toEqual({
      dismissInvalidMarker: "dismissInvalidMarker",
      editInvalidCombo: "editInvalidCombo",
      openInvalidComboDetail: "openInvalidComboDetail",
      removeInvalidComboFromList: "removeInvalidComboFromList",
      repairInvalidCombo: "repairInvalidCombo",
    });
    expect(comboListConfigModuleActions).toEqual({
      clearFilters: "clearFilters",
      closeFilterGroup: "closeFilterGroup",
      removeActiveFilter: "removeActiveFilter",
      returnFocusToCatalog: "returnFocusToCatalog",
      selectCharacter: "selectCharacter",
      selectGameContext: "selectGameContext",
      toggleFilterGroup: "toggleFilterGroup",
      updateOptionalFilter: "updateOptionalFilter",
    });
    expect(notationRendererActions).toEqual({});
    expect(comboMetadataGridActions).toEqual({});
  });

  it("publishes exact rendering discriminants from runtime dictionaries", () => {
    expect(builderContextFieldKinds).toEqual({ choice: "choice", text: "text" });
    expect(comboListConfigPickerKinds).toEqual({ kameo: "kameo", variation: "variation" });
    expect(filterFacetKinds).toEqual({
      multiChoice: "multiChoice",
      range: "range",
      singleChoice: "singleChoice",
    });
    expect(comboListStates).toEqual({
      comboListReady: "comboListReady",
      contextIncomplete: "contextIncomplete",
      filteredList: "filteredList",
      listDisabled: "listDisabled",
      loadingCombos: "loadingCombos",
      noCombos: "noCombos",
      noFilterResults: "noFilterResults",
    });
  });

  it("keeps shared prepared view-model schemas strict and game-agnostic", () => {
    const comboRef = { comboId: "combo-1", gameId: "future-game", source: "seeded" } as const;
    const labelValue = ComponentLabelValueSchema.parse({
      id: "context",
      label: "Context",
      value: "Prepared value",
    });
    const slot = PickerSlotSchema.parse({
      column: 2,
      optionId: "fighter-1",
      responsiveOrder: 1,
      row: 3,
      slotId: "slot-1",
      status: pickerSlotStatuses.selectable,
    });
    const option = PickerOptionSchema.parse({
      disabledReason: "Prepared unavailable reason",
      id: "fighter-1",
      label: "Fighter One",
    });
    const combo = ComboPresentationSummarySchema.parse({
      accessibleLabel: "Fighter One combo",
      contextItems: [labelValue],
      metadataItems: [],
      notation: [["F", "2"]],
      ref: comboRef,
      title: "Prepared combo title",
    });

    expect(slot).toEqual(expect.objectContaining({ column: 2, row: 3 }));
    expect(option.id).toBe("fighter-1");
    expect(combo.ref.gameId).toBe("future-game");
    expect(ComponentAvailabilitySchema.safeParse({ available: true, ownerState: {} }).success).toBe(
      false,
    );
    expect(
      ComponentActionDescriptorSchema.safeParse({
        available: true,
        id: "open",
        label: "Open",
        rawDomEvent: {},
      }).success,
    ).toBe(false);
    expect(PickerSlotSchema.safeParse({ ...slot, gameId: "mk1" }).success).toBe(false);
    expect(ComboPresentationSummarySchema.safeParse({ ...combo, routeState: {} }).success).toBe(
      false,
    );
    expect(
      NamedListSummarySchema.safeParse({ id: "list-1", itemCount: 2, name: "Favorites" }).success,
    ).toBe(true);
    expect(pickerSlotStatuses).toEqual({
      disabledUnavailable: "disabledUnavailable",
      placeholder: "placeholder",
      selectable: "selectable",
    });
    expect(mkCombosUi.valueSets.pickerSlotStatuses).toBe(pickerSlotStatuses);
  });
});
