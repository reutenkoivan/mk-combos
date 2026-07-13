import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { AddToListDialog } from "../components/add-to-list-dialog";
import { BuilderContextSetup, builderContextFieldKinds } from "../components/builder-context-setup";
import { ComboActionsMenu, comboActionsMenuStates } from "../components/combo-actions-menu";
import { type ComboCardModel, comboCardActionKinds } from "../components/combo-card";
import { ComboDetailHeader, comboDetailHeaderActionKinds } from "../components/combo-detail-header";
import { ComboList, comboListStates } from "../components/combo-list";
import {
  ComboListConfigModule,
  comboListConfigPickerKinds,
} from "../components/combo-list-config-module";
import { ComboMetadataGrid, comboMetadataImportances } from "../components/combo-metadata-grid";
import { EmptyState } from "../components/empty-state";
import { ErrorState, errorStateActionKinds, errorStateSeverities } from "../components/error-state";
import { filterFacetKinds } from "../components/filter-control-group";
import { KameoPicker } from "../components/kameo-picker";
import { ListEditDialog, listEditDialogModes } from "../components/list-edit-dialog";
import { NamedListDetail } from "../components/named-list-detail";
import { NamedListIndex } from "../components/named-list-index";
import { NotationRenderer, notationRendererDensities } from "../components/notation-renderer";
import {
  StaleInvalidComboMarker,
  staleInvalidComboMarkerActionKinds,
  staleInvalidComboMarkerStates,
} from "../components/stale-invalid-combo-marker";
import type {
  ComboPresentationSummary,
  PickerOption,
  PickerSlot,
  UiResponsiveMode,
} from "../components/type";
import { pickerSlotStatuses, uiResponsiveModes } from "../components/value";
import { mkxlCharacterIcons } from "../icons/game/mkxl/characters";
import { mkxlVariationIcons } from "../icons/game/mkxl/variations";
import type { UiContrastMode, UiThemeMode } from "../tokens/type";
import { uiContrastModes, uiThemeModes, uiToneModes } from "../tokens/value";
import { StoryFrame } from "./story-frame";
import { storyViewportGlobals } from "./story-viewports";

type CatalogDetailListStoryArgs = {
  contrast: UiContrastMode;
  responsiveMode: UiResponsiveMode;
  theme: UiThemeMode;
};

function CatalogDetailListStorySurface(_props: CatalogDetailListStoryArgs) {
  return null;
}

const meta = {
  args: {
    contrast: uiContrastModes.standard,
    responsiveMode: uiResponsiveModes.desktop,
    theme: uiThemeModes.dark,
  },
  argTypes: {
    contrast: {
      control: "select",
      options: [uiContrastModes.standard, uiContrastModes.increased],
    },
    responsiveMode: {
      control: "select",
      options: [uiResponsiveModes.mobile, uiResponsiveModes.tablet, uiResponsiveModes.desktop],
    },
    theme: {
      control: "select",
      options: [uiThemeModes.dark, uiThemeModes.light],
    },
  },
  component: CatalogDetailListStorySurface,
  globals: storyViewportGlobals.desktop,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Components/Catalog Detail List",
} satisfies Meta<typeof CatalogDetailListStorySurface>;

export default meta;
type Story = StoryObj<typeof meta>;

const comboRef = { comboId: "combo-1", gameId: "future-game", source: "seeded" } as const;
const secondComboRef = {
  comboId: "combo-2",
  gameId: "future-game",
  source: "custom",
} as const;

const pickerOptions = [
  { count: 12, id: "fighter-1", label: "Fighter One" },
  { count: 8, id: "fighter-2", label: "Fighter Two" },
  {
    disabledReason: "Unavailable for the prepared context",
    id: "fighter-3",
    label: "Fighter Three",
  },
] as const satisfies readonly PickerOption[];

const pickerSlots = [
  {
    column: 1,
    optionId: "fighter-1",
    responsiveOrder: 2,
    row: 1,
    slotId: "slot-1",
    status: pickerSlotStatuses.selectable,
  },
  {
    column: 2,
    optionId: "fighter-2",
    responsiveOrder: 1,
    row: 1,
    slotId: "slot-2",
    status: pickerSlotStatuses.selectable,
  },
  {
    column: 1,
    optionId: "fighter-3",
    responsiveOrder: 3,
    row: 2,
    slotId: "slot-3",
    status: pickerSlotStatuses.disabledUnavailable,
  },
  {
    column: 2,
    responsiveOrder: 4,
    row: 2,
    slotId: "slot-placeholder",
    status: pickerSlotStatuses.placeholder,
  },
] as const satisfies readonly PickerSlot[];

const requireIcon = <Asset extends { id: string }>(assets: readonly Asset[], id: string) => {
  const asset = assets.find((candidate) => candidate.id === id);

  if (!asset) {
    throw new Error(`Missing Storybook icon asset: ${id}`);
  }

  return asset;
};

const scorpionIcon = requireIcon(mkxlCharacterIcons, "scorpion");
const subZeroIcon = requireIcon(mkxlCharacterIcons, "sub-zero");
const shinnokIcon = requireIcon(mkxlCharacterIcons, "shinnok");

const characterPickerOptions = [
  { count: 12, id: "scorpion", imageSrc: scorpionIcon.src, label: "Scorpion" },
  { count: 8, id: "sub-zero", imageSrc: subZeroIcon.src, label: "Sub-Zero" },
  {
    disabledReason: "Unlock required",
    id: "shinnok",
    imageSrc: shinnokIcon.src,
    label: "Shinnok",
  },
] as const satisfies readonly PickerOption[];

const characterPickerSlots = pickerSlots.map((slot, index) => ({
  ...slot,
  optionId: characterPickerOptions[index]?.id,
})) satisfies readonly PickerSlot[];

const scorpionVariationIds = [
  "scorpion:inferno",
  "scorpion:ninjutsu",
  "scorpion:hellfire",
] as const;

const variationPickerOptions = scorpionVariationIds.map((id) => {
  const asset = requireIcon(mkxlVariationIcons, id);

  return {
    id,
    imageSrc: asset.src,
    label: asset.accessibleLabel.replace(" variation", ""),
  };
}) satisfies readonly PickerOption[];

const variationPickerSlots = variationPickerOptions.map((option, index) => ({
  column: index + 1,
  optionId: option.id,
  responsiveOrder: index + 1,
  row: 1,
  slotId: `variation-slot-${index + 1}`,
  status: pickerSlotStatuses.selectable,
})) satisfies readonly PickerSlot[];

const compatibleListOptions = [
  {
    alreadyMember: false,
    available: true,
    summary: { id: "favorites", itemCount: 2, name: "Favorites" },
  },
  {
    alreadyMember: true,
    available: true,
    summary: { id: "lab", itemCount: 5, name: "Lab notes" },
  },
] as const;

const overflowCompatibleListOptions = [
  ...compatibleListOptions,
  ...Array.from({ length: 10 }, (_, index) => ({
    alreadyMember: false,
    available: true,
    summary: {
      id: `prepared-list-${index + 1}`,
      itemCount: index + 1,
      name: `Prepared list ${index + 1} with a readable long label`,
    },
  })),
];

const preparedSummary = (
  title: string,
  ref: typeof comboRef | typeof secondComboRef,
): ComboPresentationSummary => ({
  accessibleLabel: `${title} notation`,
  contextItems: [
    { id: "fighter", label: "Fighter", value: "Fighter One" },
    { id: "context", label: "Context", value: "Prepared option" },
  ],
  membershipHint: "Saved in Favorites",
  metadataItems: [
    { id: "damage", label: "Damage", value: title === "Corner route" ? "342" : "281" },
    { id: "difficulty", label: "Difficulty", value: "Medium" },
  ],
  notation: [["F", "2"], ["1", "2"], ["UNKNOWN"]],
  notesSnippet: "Prepared localized notes remain page-owned.",
  ref,
  title,
});

const preparedCards = [
  {
    actions: [
      {
        available: true,
        id: "open-detail",
        kind: comboCardActionKinds.openDetail,
        label: "Open detail",
      },
      {
        available: true,
        id: "add-to-list",
        kind: comboCardActionKinds.addToList,
        label: "Add to list",
      },
    ],
    focused: true,
    selected: true,
    summary: preparedSummary("Midscreen route", comboRef),
  },
  {
    actions: [
      {
        available: true,
        id: "open-corner",
        kind: comboCardActionKinds.openDetail,
        label: "Open detail",
      },
      {
        available: false,
        disabledReason: "Only custom combos can be edited",
        id: "duplicate-corner",
        kind: comboCardActionKinds.duplicateToCustomCombo,
        label: "Duplicate",
      },
    ],
    summary: preparedSummary("Corner route", secondComboRef),
  },
] as const satisfies readonly ComboCardModel[];

const invalidMarker = {
  actions: [
    {
      available: true,
      id: "dismiss-marker",
      kind: staleInvalidComboMarkerActionKinds.dismiss,
      label: "Dismiss",
    },
    {
      available: true,
      id: "repair-marker",
      kind: staleInvalidComboMarkerActionKinds.repair,
      label: "Repair combo",
    },
  ],
  affectedReference: "fighter-legacy",
  comboRef,
  reason: "This combo references a catalog entry that is no longer available.",
  state: staleInvalidComboMarkerStates.invalid,
  validPrefixSummary: "The first three prepared steps are still valid.",
} as const;

function Frame(props: CatalogDetailListStoryArgs & { children: ReactNode }) {
  return (
    <StoryFrame contrast={props.contrast} responsiveMode={props.responsiveMode} theme={props.theme}>
      {props.children}
    </StoryFrame>
  );
}

function CatalogReadySurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <ComboListConfigModule
        characterPicker={{
          clearLabel: "Clear character",
          focusedSlotId: "slot-1",
          label: "Characters",
          layoutId: "prepared-character-layout",
          options: characterPickerOptions,
          selectedCharacterId: "scorpion",
          slots: characterPickerSlots,
          sourceSurface: "storybook-catalog",
        }}
        filterGroup={{
          activeFilters: [
            {
              filterId: "difficulty",
              id: "difficulty-medium",
              label: "Difficulty: Medium",
              removeLabel: "Remove difficulty filter",
              value: "medium",
            },
          ],
          clearLabel: "Clear filters",
          expanded: true,
          facets: [
            {
              id: "difficulty",
              kind: filterFacetKinds.singleChoice,
              label: "Difficulty",
              options: [
                { available: true, id: "easy", label: "Easy" },
                { available: true, id: "medium", label: "Medium" },
              ],
              selectedValues: ["medium"],
            },
            {
              id: "damage",
              kind: filterFacetKinds.range,
              label: "Damage",
              maximumLabel: "Maximum damage",
              maximumValue: "400",
              minimumLabel: "Minimum damage",
              minimumValue: "250",
            },
          ],
          label: "Filters",
          resultCountLabel: "2 results",
          sourceSurface: "storybook-catalog",
        }}
        gameContextPicker={{
          kind: comboListConfigPickerKinds.variation,
          props: {
            label: "Prepared context",
            layoutId: "prepared-context-layout",
            options: variationPickerOptions,
            parentContextLabel: "Scorpion",
            selectedVariationId: "scorpion:ninjutsu",
            slots: variationPickerSlots,
            sourceSurface: "storybook-catalog",
          },
        }}
        responsiveMode={props.responsiveMode}
      />
      <KameoPicker
        label="Alternative prepared picker"
        layoutId="prepared-partner-layout"
        options={pickerOptions.slice(0, 2)}
        parentContextLabel="Fighter One"
        responsiveMode={props.responsiveMode}
        selectedKameoId="fighter-1"
        slots={pickerSlots.slice(0, 2)}
        sourceSurface="storybook-catalog"
      />
      <ComboList
        accessibleLabel="Prepared combo results"
        items={preparedCards}
        notationDisplayMode="PlayStation"
        sourceSurface="storybook-catalog"
        state={comboListStates.filteredList}
        statusMessage="Prepared order · 2 filtered results"
      />
    </Frame>
  );
}

function LoadingSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <ComboListConfigModule
        characterPicker={{
          busy: true,
          disabled: true,
          label: "Characters",
          layoutId: "loading-layout",
          message: "Loading prepared options",
          options: characterPickerOptions,
          slots: characterPickerSlots,
          sourceSurface: "storybook-loading",
        }}
        filterGroup={{
          activeFilters: [],
          busy: true,
          clearLabel: "Clear filters",
          expanded: false,
          facets: [],
          label: "Filters",
          resultCountLabel: "Loading results",
          sourceSurface: "storybook-loading",
        }}
        responsiveMode={props.responsiveMode}
      />
      <ComboList
        accessibleLabel="Loading combos"
        items={preparedCards}
        notationDisplayMode="Xbox"
        sourceSurface="storybook-loading"
        state={comboListStates.loadingCombos}
        statusMessage="Loading combo summaries"
      />
    </Frame>
  );
}

function DetailAndListsSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <ComboDetailHeader
        actions={[
          {
            available: true,
            id: "return",
            kind: comboDetailHeaderActionKinds.returnToSource,
            label: "Return to catalog",
          },
          {
            available: true,
            id: "add",
            kind: comboDetailHeaderActionKinds.addToList,
            label: "Add to list",
            tone: uiToneModes.accent,
          },
        ]}
        comboRef={comboRef}
        contextItems={preparedSummary("Midscreen route", comboRef).contextItems}
        marker={invalidMarker}
        sourceLabel="Seeded"
        sourceSurface="storybook-detail"
        title="Midscreen route"
      />
      <NotationRenderer
        density={notationRendererDensities.detail}
        notation={preparedSummary("Midscreen route", comboRef).notation}
        notationDisplayMode="FGC"
        tokenState="stale"
      />
      <ComboMetadataGrid
        annotation="Prepared values may be stale until the page-level repair succeeds."
        label="Combo metadata"
        responsiveMode={props.responsiveMode}
        rows={[
          {
            id: "damage",
            importance: comboMetadataImportances.critical,
            label: "Damage",
            statusLabel: "Stale",
            tone: uiToneModes.warning,
            value: "281",
          },
          {
            id: "position",
            importance: comboMetadataImportances.normal,
            label: "Position",
            value: "Midscreen",
          },
        ]}
      />
      <ComboActionsMenu
        actions={[
          { available: true, id: "copy", label: "Copy notation" },
          {
            available: false,
            disabledReason: "Unavailable for seeded combos",
            id: "delete",
            label: "Delete",
          },
        ]}
        comboRef={comboRef}
        label="Combo actions"
        menuState={comboActionsMenuStates.open}
        sourceSurface="storybook-detail"
      />
      <section className="grid gap-4 lg:grid-cols-[minmax(14rem,0.35fr)_1fr]">
        <NamedListIndex
          createAction={{ available: true, id: "create", label: "Create list" }}
          focusedListId="favorites"
          items={[
            {
              deleteAction: { available: true, id: "delete", label: "Delete Favorites" },
              renameAction: { available: true, id: "rename", label: "Rename Favorites" },
              summary: { id: "favorites", itemCount: 2, name: "Favorites" },
            },
          ]}
          selectedListId="favorites"
          sourceSurface="storybook-lists"
        />
        <NamedListDetail
          focusedItemId="list-item-1"
          items={[
            {
              card: preparedCards[0],
              id: "list-item-1",
              marker: invalidMarker,
              removeLabel: "Remove Midscreen route",
              reorderDownLabel: "Move Midscreen route down",
              reorderUpLabel: "Move Midscreen route up",
            },
            {
              card: { ...preparedCards[1], actions: [preparedCards[1].actions[0]] },
              id: "list-item-2",
              removeLabel: "Remove Corner route",
              reorderDownLabel: "Move Corner route down",
              reorderUpLabel: "Move Corner route up",
            },
          ]}
          list={{ id: "favorites", itemCount: 2, name: "Favorites" }}
          notationDisplayMode="FGC"
          sourceSurface="storybook-lists"
        />
      </section>
    </Frame>
  );
}

function AddToListSurface(props: CatalogDetailListStoryArgs & { overflow?: boolean }) {
  return (
    <Frame {...props}>
      <p className="text-sm text-[var(--ui-muted-text)]">
        The dialog remains open because Storybook supplies controlled state.
      </p>
      <AddToListDialog
        cancelLabel="Cancel"
        comboSummary={preparedSummary("Midscreen route", comboRef)}
        compatibleLists={props.overflow ? overflowCompatibleListOptions : compatibleListOptions}
        createListAction={{ available: true, id: "create", label: "Create new list" }}
        description="Choose one compatible prepared list."
        membershipLabel="Already added"
        open
        selectedListId="favorites"
        sourceFocusTarget="combo-card-1"
        sourceSurface="storybook-catalog"
        submitAvailability={{ available: true }}
        submitLabel="Add combo"
        title="Add to list"
      />
    </Frame>
  );
}

function EditAndBuilderSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <BuilderContextSetup
        confirmAction={{
          available: false,
          disabledReason: "Resolve validation",
          id: "confirm",
          label: "Continue",
        }}
        label="Prepared builder context"
        optionalFields={[
          {
            id: "stage",
            kind: builderContextFieldKinds.choice,
            label: "Optional stage context",
            options: [{ available: true, id: "arena", label: "Arena" }],
            value: "arena",
          },
        ]}
        primaryFields={[
          {
            id: "fighter",
            kind: builderContextFieldKinds.choice,
            label: "Primary context",
            options: [
              { available: true, id: "fighter-1", label: "Fighter One" },
              {
                available: false,
                disabledReason: "Unavailable",
                id: "fighter-2",
                label: "Fighter Two",
              },
            ],
            value: "fighter-1",
          },
        ]}
        runtimeFields={[
          {
            id: "runtime-start",
            kind: builderContextFieldKinds.text,
            label: "Runtime start state",
            validationMessage: "Prepared runtime state is incomplete",
            value: "",
          },
        ]}
        sourceSurface="storybook-builder"
        validationMessage="Resolve the prepared runtime field before continuing."
      />
      <ListEditDialog
        cancelLabel="Cancel"
        description="The draft and validation state remain page-owned."
        draftName="Favorites"
        fieldLabel="List name"
        mode={listEditDialogModes.renameList}
        open
        selectedList={{ id: "favorites", itemCount: 2, name: "Favorites" }}
        sourceFocusTarget="favorites-row"
        sourceSurface="storybook-lists"
        submitAvailability={{ available: false, disabledReason: "Name already exists" }}
        submitLabel="Rename list"
        title="Rename list"
        validationMessage="A list with this name already exists."
      />
    </Frame>
  );
}

function SystemStatesSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <EmptyState
        actions={[{ available: true, id: "choose-context", label: "Choose context" }]}
        details="Filters never change the required context."
        message="Select a prepared character context to continue."
        sourceSurface="storybook-system"
        stateToken="catalog-empty"
        title="No combo context"
      />
      <ErrorState
        actions={[
          {
            available: true,
            id: "retry",
            kind: errorStateActionKinds.retry,
            label: "Retry",
          },
          {
            available: true,
            id: "fallback",
            kind: errorStateActionKinds.fallback,
            label: "Return to catalog",
          },
        ]}
        errorToken="catalog-load-error"
        message="The prepared recovery operation remains page-owned."
        severity={errorStateSeverities.blocking}
        sourceSurface="storybook-system"
        technicalReference="CATALOG-LOAD-001"
        title="Unable to load combos"
      />
      <StaleInvalidComboMarker {...invalidMarker} sourceSurface="storybook-system" />
      <ComboList
        accessibleLabel="Empty filtered list"
        emptyState={{
          actions: [{ available: true, id: "clearFilters", label: "Clear filters" }],
          message: "No prepared summaries match the active filters.",
          stateToken: "no-filter-results",
          title: "No matching combos",
        }}
        items={[]}
        notationDisplayMode="FGC"
        sourceSurface="storybook-system"
        state={comboListStates.noFilterResults}
      />
    </Frame>
  );
}

export const CatalogDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <CatalogReadySurface {...args} />,
};

export const CatalogMobileLoading: Story = {
  args: {
    contrast: uiContrastModes.increased,
    responsiveMode: uiResponsiveModes.mobile,
    theme: uiThemeModes.light,
  },
  globals: storyViewportGlobals.mobile,
  render: (args) => <LoadingSurface {...args} />,
};

export const DetailTabletAndLists: Story = {
  args: {
    responsiveMode: uiResponsiveModes.tablet,
    theme: uiThemeModes.light,
  },
  globals: storyViewportGlobals.tablet,
  render: (args) => <DetailAndListsSurface {...args} />,
};

export const AddToListDialogOpen: Story = {
  args: { responsiveMode: uiResponsiveModes.mobile },
  globals: storyViewportGlobals.mobile,
  render: (args) => <AddToListSurface {...args} />,
};

export const MobileAddToListDialogOverflow: Story = {
  args: { responsiveMode: uiResponsiveModes.mobile },
  globals: storyViewportGlobals.mobile,
  render: (args) => <AddToListSurface {...args} overflow />,
};

export const ListEditDialogOpenAndBuilderValidation: Story = {
  args: { contrast: uiContrastModes.increased },
  globals: storyViewportGlobals.desktop,
  render: (args) => <EditAndBuilderSurface {...args} />,
};

export const EmptyErrorAndStaleStates: Story = {
  args: { theme: uiThemeModes.light },
  globals: storyViewportGlobals.desktop,
  render: (args) => <SystemStatesSurface {...args} />,
};
