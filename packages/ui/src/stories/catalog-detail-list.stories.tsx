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
  comboListConfigSelectionSteps,
} from "../components/combo-list-config-module";
import { ComboMetadataGrid, comboMetadataImportances } from "../components/combo-metadata-grid";
import { EmptyState } from "../components/empty-state";
import { ErrorState, errorStateActionKinds, errorStateSeverities } from "../components/error-state";
import {
  type ActiveFilterChip,
  FilterControlGroup,
  filterChoicePresentations,
  filterFacetKinds,
} from "../components/filter-control-group";
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
import { comboPresentationModes, pickerSlotStatuses, uiResponsiveModes } from "../components/value";
import { mkxlCharacterIcons } from "../icons/game/mkxl/characters";
import { mkxlInteractableIcons } from "../icons/game/mkxl/interactables";
import { mkxlStageIcons } from "../icons/game/mkxl/stages";
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
  {
    count: 12,
    countLabel: "12 prepared combos",
    description: "Fast pressure and flexible conversions",
    id: "scorpion",
    imageSrc: scorpionIcon.src,
    label: "Scorpion",
  },
  {
    count: 8,
    countLabel: "8 prepared combos",
    description: "Control space and confirm into reliable damage",
    id: "sub-zero",
    imageSrc: subZeroIcon.src,
    label: "Sub-Zero",
  },
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

const mkxlFullRosterStoryCounts = [
  0, 1, 18, 9, 22, 14, 6, 0, 11, 3, 16, 24, 8, 7, 19, 13, 5, 17, 2, 21, 10, 15, 6, 20, 12, 28, 0, 9,
  31, 7, 4, 8, 23,
] as const;

const mkxlFullRosterOptions = mkxlCharacterIcons.map((asset, index): PickerOption => {
  const count = asset.id === "predator" ? undefined : mkxlFullRosterStoryCounts[index];
  const label = asset.accessibleLabel.replace(" character", "");

  return {
    ...(count === undefined
      ? {}
      : {
          count,
          countLabel: `${count} prepared ${count === 1 ? "combo" : "combos"}`,
        }),
    ...(asset.id === "jason-voorhees"
      ? { description: "Guest fighter with a deliberately long prepared description" }
      : {}),
    ...(asset.id === "goro"
      ? { disabledReason: "No prepared combos are available for this fighter" }
      : {}),
    id: asset.id,
    ...(asset.id === "triborg" ? {} : { imageSrc: asset.src }),
    label,
  };
});

const mkxlFullRosterSlots = mkxlFullRosterOptions.map(
  (option, index): PickerSlot => ({
    column: (index % 11) + 1,
    optionId: option.id,
    responsiveOrder: index + 1,
    row: Math.floor(index / 11) + 1,
    slotId: `mkxl-full-roster-${option.id}`,
    status:
      option.id === "goro" ? pickerSlotStatuses.disabledUnavailable : pickerSlotStatuses.selectable,
  }),
);

const scorpionVariationIds = [
  "scorpion:inferno",
  "scorpion:ninjutsu",
  "scorpion:hellfire",
] as const;

const variationPickerStoryCounts = [4, 6, 1] as const;

const variationPickerOptions = scorpionVariationIds.map((id, index) => {
  const asset = requireIcon(mkxlVariationIcons, id);
  const count = variationPickerStoryCounts[index] ?? 0;

  return {
    count,
    countLabel: `${count} prepared ${count === 1 ? "combo" : "combos"}`,
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

const kameoPickerOptions = [
  {
    count: 9,
    countLabel: "9 prepared pair routes",
    id: "sektor",
    label: "Sektor",
  },
  {
    count: 4,
    countLabel: "4 prepared pair routes",
    id: "cyrax",
    label: "Cyrax",
  },
  {
    disabledReason: "No prepared combos are available for this pairing",
    id: "frost",
    label: "Frost",
  },
] as const satisfies readonly PickerOption[];

const kameoPickerSlots = kameoPickerOptions.map((option, index) => ({
  column: index + 1,
  optionId: option.id,
  responsiveOrder: index + 1,
  row: 1,
  slotId: `kameo-slot-${index + 1}`,
  status:
    option.id === "frost" ? pickerSlotStatuses.disabledUnavailable : pickerSlotStatuses.selectable,
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
    { id: "meter", label: "Meter", value: title === "Corner route" ? "2 bars" : "1 bar" },
    { id: "routeType", label: "Route", tone: uiToneModes.accent, value: "Conversion" },
    {
      id: "position",
      label: "Position",
      value: title === "Corner route" ? "Corner" : "Midscreen",
    },
    {
      id: "difficulty",
      label: "Difficulty",
      tone: uiToneModes.warning,
      value: "Medium",
    },
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
  affectedReference: "fighter-stale",
  comboRef,
  reason: "This combo references a catalog entry that is no longer available.",
  state: staleInvalidComboMarkerStates.invalid,
  stateLabel: "Invalid combo",
  validPrefixSummary: "The first three prepared steps are still valid.",
} as const;

function Frame(props: CatalogDetailListStoryArgs & { children: ReactNode }) {
  return (
    <StoryFrame contrast={props.contrast} responsiveMode={props.responsiveMode} theme={props.theme}>
      {props.children}
    </StoryFrame>
  );
}

function CommandDeckCharacterSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <ComboListConfigModule
        sourceFocusTarget="slot-1"
        responsiveMode={props.responsiveMode}
        contextSelection={{
          characterPicker: {
            focusedSlotId: "slot-1",
            label: "Fighter roster",
            layoutId: "command-deck-characters",
            options: characterPickerOptions,
            selectedCharacterId: "scorpion",
            slots: characterPickerSlots,
            sourceSurface: "storybook-command-deck",
          },
          commands: [
            { commandId: "navigate", inputLabel: "D-PAD", label: "Navigate" },
            { commandId: "select", inputLabel: "A", label: "Select fighter" },
            { commandId: "back", inputLabel: "B", label: "Back" },
          ],
          header: {
            description: "Choose the fighter that owns the combo route.",
            gameLabel: "Mortal Kombat XL",
            instruction: "Controller / pointer ready",
            optionCountLabel: "2 available / 3 authored",
            stepLabel: "01 / Fighter roster",
            title: "Select fighter",
          },
          step: comboListConfigSelectionSteps.character,
        }}
      />
    </Frame>
  );
}

function CommandDeckFullRosterSurface(props: CatalogDetailListStoryArgs) {
  const focusedSlotId = "mkxl-full-roster-sub-zero";

  return (
    <StoryFrame
      theme={props.theme}
      contrast={props.contrast}
      contentClassName="max-w-[96rem]"
      responsiveMode={props.responsiveMode}
    >
      <ComboListConfigModule
        sourceFocusTarget={focusedSlotId}
        responsiveMode={props.responsiveMode}
        contextSelection={{
          characterPicker: {
            focusedSlotId,
            label: "Complete fighter roster",
            layoutId: "command-deck-mkxl-full-roster",
            options: mkxlFullRosterOptions,
            selectedCharacterId: "sub-zero",
            slots: mkxlFullRosterSlots,
            sourceSurface: "storybook-command-deck-full-roster",
          },
          header: {
            description:
              "All 33 roster entries keep a stable authored order while the portrait grid reflows.",
            gameLabel: "Mortal Kombat XL",
            instruction: "Controller / pointer ready",
            optionCountLabel: "32 available / 33 roster entries",
            stepLabel: "01 / Fighter roster",
            title: "Select fighter",
          },
          step: comboListConfigSelectionSteps.character,
        }}
      />
    </StoryFrame>
  );
}

function CommandDeckSpecificationSurface(
  props: CatalogDetailListStoryArgs & { kind?: "kameo" | "variation" },
) {
  const kameo = props.kind === "kameo";

  return (
    <Frame {...props}>
      <ComboListConfigModule
        responsiveMode={props.responsiveMode}
        sourceFocusTarget={kameo ? "kameo-slot-2" : "variation-slot-2"}
        contextSelection={{
          gameContextPicker: kameo
            ? {
                kind: comboListConfigPickerKinds.kameo,
                props: {
                  focusedSlotId: "kameo-slot-2",
                  label: "Kameo roster",
                  layoutId: "command-deck-kameos",
                  options: kameoPickerOptions,
                  parentContextLabel: "Selected fighter: Scorpion",
                  selectedKameoId: "sektor",
                  slots: kameoPickerSlots,
                  sourceSurface: "storybook-command-deck",
                },
              }
            : {
                kind: comboListConfigPickerKinds.variation,
                props: {
                  focusedSlotId: "variation-slot-2",
                  label: "Variation loadout",
                  layoutId: "command-deck-variations",
                  options: variationPickerOptions,
                  parentContextLabel: "Selected fighter: Scorpion",
                  selectedVariationId: "scorpion:ninjutsu",
                  slots: variationPickerSlots,
                  sourceSurface: "storybook-command-deck",
                },
              },
          header: {
            announcement: kameo ? "Kameo selection step" : "Variation selection step",
            description: kameo
              ? "Lock a compatible assist for this fighter."
              : "Lock the style that defines the combo catalog.",
            gameLabel: kameo ? "Mortal Kombat 1" : "Mortal Kombat XL",
            instruction: "Catalog breadcrumb or controller Back returns to the fighter roster",
            optionCountLabel: kameo ? "2 available / 3 pairings" : "3 available loadouts",
            stepLabel: kameo ? "02 / Kameo" : "02 / Variation",
            title: kameo ? "Select kameo" : "Select variation",
          },
          lockedCharacter: {
            gameLabel: kameo ? "MK1" : "MKXL",
            id: "scorpion",
            imageAlt: "Scorpion",
            imageSrc: scorpionIcon.src,
            label: "Scorpion",
            progressLabel: "02 / 02",
          },
          step: comboListConfigSelectionSteps.specification,
        }}
      />
    </Frame>
  );
}

const filterDrawerFacets = [
  {
    id: "position",
    kind: filterFacetKinds.multiChoice,
    label: "Position",
    options: [
      { available: true, count: 8, countLabel: "8 routes", id: "midscreen", label: "Midscreen" },
      { available: true, count: 4, countLabel: "4 routes", id: "corner", label: "Corner" },
    ],
    presentation: filterChoicePresentations.compact,
    selectedValues: ["midscreen"],
  },
  {
    id: "stage",
    kind: filterFacetKinds.singleChoice,
    label: "Arena",
    options: [
      {
        available: true,
        count: 4,
        id: "crossroads",
        imageAlt: mkxlStageIcons.find((icon) => icon.id === "crossroads")?.accessibleLabel,
        imageSrc: mkxlStageIcons.find((icon) => icon.id === "crossroads")?.src,
        label: "Crossroads",
      },
      {
        available: true,
        count: 2,
        id: "dead-woods",
        imageAlt: mkxlStageIcons.find((icon) => icon.id === "dead-woods")?.accessibleLabel,
        imageSrc: mkxlStageIcons.find((icon) => icon.id === "dead-woods")?.src,
        label: "Dead Woods",
      },
    ],
    presentation: filterChoicePresentations.visual,
    selectedValues: ["crossroads"],
  },
  {
    id: "interactable",
    kind: filterFacetKinds.multiChoice,
    label: "Interactables",
    options: [
      {
        available: true,
        count: 2,
        id: "crossroads:body-toss",
        imageAlt: mkxlInteractableIcons.find((icon) => icon.id === "crossroads:body-toss")
          ?.accessibleLabel,
        imageSrc: mkxlInteractableIcons.find((icon) => icon.id === "crossroads:body-toss")?.src,
        label: "Body Toss",
      },
      {
        available: true,
        count: 1,
        id: "crossroads:position-escape",
        label: "Position Escape",
      },
    ],
    presentation: filterChoicePresentations.visual,
    selectedValues: [],
  },
] as const;

const activeFilterChipVisualStates = [
  {
    filterId: "position",
    id: "chip-neutral",
    label: "Center",
    removeLabel: "Remove midscreen position",
    tone: uiToneModes.neutral,
    value: "midscreen",
  },
  {
    filterId: "routeClass",
    id: "chip-accent",
    label: "Conversion",
    removeLabel: "Remove conversion route class",
    tone: uiToneModes.accent,
    value: "conversion",
  },
  {
    filterId: "difficulty",
    id: "chip-success",
    label: "Easy",
    removeLabel: "Remove easy difficulty",
    tone: uiToneModes.success,
    value: "easy",
  },
  {
    filterId: "meter",
    id: "chip-warning",
    label: "1 bar",
    removeLabel: "Remove meter filter",
    tone: uiToneModes.warning,
    value: "1",
  },
  {
    filterId: "interactable",
    id: "chip-destructive",
    label: "Імператорський двір — права колона",
    removeLabel: "Прибрати фільтр взаємодії",
    tone: uiToneModes.destructive,
    value: "emperors-courtyard-right-column",
  },
] as const satisfies readonly ActiveFilterChip[];

const denseActiveFilterChips = [
  ...activeFilterChipVisualStates,
  {
    filterId: "position",
    id: "position-corner",
    label: "У куті",
    removeLabel: "Прибрати фільтр «Позиція: У куті»",
    value: "corner",
  },
  {
    filterId: "meter",
    id: "meter-zero",
    label: "Без шкали",
    removeLabel: "Прибрати фільтр «Шкала: Без шкали»",
    value: "0",
  },
  {
    filterId: "difficulty",
    id: "difficulty-medium",
    label: "Середнє",
    removeLabel: "Прибрати фільтр «Складність: Середнє»",
    value: "medium",
  },
  {
    filterId: "routeClass",
    id: "route-basic",
    label: "Базове",
    removeLabel: "Прибрати фільтр «Клас маршруту: Базове»",
    value: "bnb",
  },
  {
    filterId: "routeClass",
    id: "route-kameo",
    label: "З камео",
    removeLabel: "Прибрати фільтр «Клас маршруту: З камео»",
    value: "kameo",
  },
  {
    filterId: "source",
    id: "source-editors",
    label: "Від редакції",
    removeLabel: "Прибрати фільтр «Джерело: Від редакції»",
    value: "curated",
  },
  {
    filterId: "source",
    id: "source-players",
    label: "Від гравців",
    removeLabel: "Прибрати фільтр «Джерело: Від гравців»",
    value: "community",
  },
] as const satisfies readonly ActiveFilterChip[];

function CommandDeckBrowseSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <div className="grid h-72 min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-(--ui-command-surface)">
        <div className="border-b border-(--ui-command-border)">
          <FilterControlGroup
            open={false}
            label="Filters"
            responsiveMode={props.responsiveMode}
            sourceSurface="storybook-command-deck"
            applied={{
              activeFilters: activeFilterChipVisualStates,
              activeFiltersLabel: "Active filters",
              clearLabel: "Clear filters",
              resultCountLabel: "12 routes",
            }}
            draft={{
              activeFilters: activeFilterChipVisualStates,
              activeFiltersLabel: "Draft filters",
              applyLabel: "Apply filters",
              discardLabel: "Discard changes",
              facets: filterDrawerFacets,
              loadingLabel: "Loading filters",
              resetLabel: "Reset filters",
              resultCountLabel: "12 routes",
            }}
          />
        </div>
        <section
          data-story-catalog-result-scroller
          aria-label="Scrollable catalog results"
          className="min-h-0 scroll-pb-14 overflow-y-auto pb-14"
        >
          <ComboList
            items={preparedCards}
            notationDisplayMode="PlayStation"
            state={comboListStates.filteredList}
            sourceSurface="storybook-command-deck"
            statusMessage="Reliability order · 2 shown"
            accessibleLabel="Scorpion Ninjutsu combo routes"
            presentation={comboPresentationModes.commandDeck}
          />
        </section>
        <footer className="flex min-h-11 items-center gap-4 border-t border-(--ui-command-border) bg-(--ui-command-chrome) px-2 font-mono text-xs text-(--ui-command-chrome-text)">
          <span>D-Pad · Navigate</span>
          <span>A · View combo</span>
        </footer>
      </div>
    </Frame>
  );
}

function CommandDeckFilterDrawerSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <FilterControlGroup
        open
        label="Filter drawer"
        sourceSurface="storybook-filter-drawer"
        responsiveMode={props.responsiveMode}
        applied={{
          activeFilters: activeFilterChipVisualStates.slice(0, 2),
          activeFiltersLabel: "Active filters",
          clearLabel: "Clear filters",
          resultCountLabel: "12 routes",
        }}
        draft={{
          activeFilters: activeFilterChipVisualStates,
          activeFiltersLabel: "Draft filters",
          applyLabel: "Apply filters",
          discardLabel: "Discard changes",
          facets: filterDrawerFacets,
          loadingLabel: "Updating preview",
          resetLabel: "Reset filters",
          resultCountLabel: "12 matching routes",
        }}
      />
      <ComboList
        items={preparedCards}
        notationDisplayMode="PlayStation"
        sourceSurface="storybook-filter-drawer"
        state={comboListStates.filteredList}
        accessibleLabel="Live filter preview"
        presentation={comboPresentationModes.commandDeck}
      />
    </Frame>
  );
}

function ActiveFilterChipsSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <div className="grid min-w-0 gap-4 p-3 sm:p-4">
        <section aria-label="Enabled active-filter capsules" className="grid min-w-0 gap-2">
          <h2 className="font-(--ui-font-display) text-sm font-semibold uppercase tracking-[0.08em]">
            Enabled summary
          </h2>
          <FilterControlGroup
            open={false}
            label="Filters"
            responsiveMode={props.responsiveMode}
            sourceSurface="storybook-active-filter-chips"
            applied={{
              activeFilters: denseActiveFilterChips,
              activeFiltersLabel: "Active filter tone examples",
              clearLabel: "Clear filters",
              resultCountLabel: "12 routes",
            }}
            draft={{
              activeFilters: denseActiveFilterChips,
              activeFiltersLabel: "Draft filter tone examples",
              applyLabel: "Apply filters",
              discardLabel: "Discard changes",
              facets: filterDrawerFacets,
              loadingLabel: "Loading filters",
              resetLabel: "Reset filters",
              resultCountLabel: "12 routes",
            }}
          />
        </section>

        <section aria-label="Disabled active-filter capsules" className="grid min-w-0 gap-2">
          <h2 className="font-(--ui-font-display) text-sm font-semibold uppercase tracking-[0.08em]">
            Disabled filter drawer
          </h2>
          <div className="h-[28rem] min-h-0 min-w-0">
            <FilterControlGroup
              busy
              open
              disabled
              label="Filter drawer"
              responsiveMode={props.responsiveMode}
              sourceSurface="storybook-active-filter-chips-disabled"
              applied={{
                activeFilters: denseActiveFilterChips,
                activeFiltersLabel: "Disabled active filter tone examples",
                clearLabel: "Clear filters",
                resultCountLabel: "12 routes",
              }}
              draft={{
                activeFilters: denseActiveFilterChips,
                activeFiltersLabel: "Disabled draft filter tone examples",
                applyLabel: "Apply filters",
                discardLabel: "Discard changes",
                facets: filterDrawerFacets,
                loadingLabel: "Updating preview",
                resetLabel: "Reset filters",
                resultCountLabel: "12 matching routes",
              }}
            />
          </div>
        </section>
      </div>
    </Frame>
  );
}

function CatalogReadySurface(props: CatalogDetailListStoryArgs) {
  return <CommandDeckBrowseSurface {...props} />;
}

function MobileDenseUkrainianSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <ComboListConfigModule
        responsiveMode={props.responsiveMode}
        contextSelection={{
          characterPicker: {
            focusedSlotId: "slot-1",
            label: "Список бійців",
            layoutId: "ukrainian-character-layout",
            options: (characterPickerOptions as readonly PickerOption[]).map((option) => ({
              ...option,
              countLabel:
                option.id === "scorpion"
                  ? "12 комбінацій"
                  : option.count !== undefined
                    ? `${option.count} комбінацій`
                    : undefined,
            })),
            selectedCharacterId: "scorpion",
            slots: characterPickerSlots,
            sourceSurface: "storybook-mobile-catalog",
          },
          commands: [
            { commandId: "navigate", inputLabel: "D-PAD", label: "Навігація" },
            { commandId: "select", inputLabel: "A", label: "Обрати бійця" },
          ],
          header: {
            gameLabel: "Mortal Kombat XL",
            optionCountLabel: "2 доступно / 3 у складі",
            stepLabel: "01 / Список бійців",
            title: "Оберіть бійця",
          },
          step: comboListConfigSelectionSteps.character,
        }}
      />
    </Frame>
  );
}

function LoadingSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <ComboListConfigModule
        responsiveMode={props.responsiveMode}
        contextSelection={{
          characterPicker: {
            busy: true,
            disabled: true,
            label: "Fighter roster",
            layoutId: "loading-layout",
            message: "Loading prepared options",
            options: characterPickerOptions,
            slots: characterPickerSlots,
            sourceSurface: "storybook-loading",
          },
          header: {
            gameLabel: "Mortal Kombat XL",
            optionCountLabel: "Loading roster",
            stepLabel: "01 / Fighter roster",
            title: "Select fighter",
          },
          step: comboListConfigSelectionSteps.character,
        }}
      />
    </Frame>
  );
}

function DetailAndListsSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <ComboDetailHeader
        comboRef={comboRef}
        sourceLabel="Seeded"
        marker={invalidMarker}
        title="Midscreen route"
        sourceSurface="storybook-detail"
        contextItems={preparedSummary("Midscreen route", comboRef).contextItems}
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
      />
      <NotationRenderer
        tokenState="stale"
        notationDisplayMode="FGC"
        density={notationRendererDensities.detail}
        notation={preparedSummary("Midscreen route", comboRef).notation}
      />
      <ComboMetadataGrid
        label="Combo metadata"
        responsiveMode={props.responsiveMode}
        annotation="Prepared values may be stale until the page-level repair succeeds."
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
        comboRef={comboRef}
        label="Combo actions"
        sourceSurface="storybook-detail"
        menuState={comboActionsMenuStates.open}
        actions={[
          { available: true, id: "copy", label: "Copy notation" },
          {
            available: false,
            disabledReason: "Unavailable for seeded combos",
            id: "delete",
            label: "Delete",
          },
        ]}
      />
      <section className="grid gap-4 lg:grid-cols-[minmax(14rem,0.35fr)_1fr]">
        <NamedListIndex
          focusedListId="favorites"
          selectedListId="favorites"
          sourceSurface="storybook-lists"
          createAction={{ available: true, id: "create", label: "Create list" }}
          items={[
            {
              deleteAction: { available: true, id: "delete", label: "Delete Favorites" },
              renameAction: { available: true, id: "rename", label: "Rename Favorites" },
              summary: { id: "favorites", itemCount: 2, name: "Favorites" },
            },
          ]}
        />
        <NamedListDetail
          notationDisplayMode="FGC"
          focusedItemId="list-item-1"
          sourceSurface="storybook-lists"
          list={{ id: "favorites", itemCount: 2, name: "Favorites" }}
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
        />
      </section>
    </Frame>
  );
}

function AddToListSurface(props: CatalogDetailListStoryArgs & { overflow?: boolean }) {
  return (
    <Frame {...props}>
      <p className="text-sm text-(--ui-muted-text)">
        The dialog remains open because Storybook supplies controlled state.
      </p>
      <AddToListDialog
        open
        title="Add to list"
        cancelLabel="Cancel"
        submitLabel="Add combo"
        selectedListId="favorites"
        membershipLabel="Already added"
        sourceFocusTarget="combo-card-1"
        sourceSurface="storybook-catalog"
        submitAvailability={{ available: true }}
        compatibleListsLabel="Compatible named lists"
        description="Choose one compatible prepared list."
        comboSummary={preparedSummary("Midscreen route", comboRef)}
        createListAction={{ available: true, id: "create", label: "Create new list" }}
        compatibleLists={props.overflow ? overflowCompatibleListOptions : compatibleListOptions}
      />
    </Frame>
  );
}

function EditAndBuilderSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <BuilderContextSetup
        label="Prepared builder context"
        sourceSurface="storybook-builder"
        validationMessage="Resolve the prepared runtime field before continuing."
        confirmAction={{
          available: false,
          disabledReason: "Resolve validation",
          id: "confirm",
          label: "Continue",
        }}
        optionalFields={[
          {
            id: "stage",
            kind: builderContextFieldKinds.choice,
            label: "Optional stage context",
            options: [{ available: true, id: "arena", label: "Arena" }],
            value: "arena",
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
      />
      <ListEditDialog
        open
        title="Rename list"
        cancelLabel="Cancel"
        draftName="Favorites"
        fieldLabel="List name"
        submitLabel="Rename list"
        sourceSurface="storybook-lists"
        sourceFocusTarget="favorites-row"
        mode={listEditDialogModes.renameList}
        validationMessage="A list with this name already exists."
        selectedList={{ id: "favorites", itemCount: 2, name: "Favorites" }}
        description="The draft and validation state remain page-owned."
        submitAvailability={{ available: false, disabledReason: "Name already exists" }}
      />
    </Frame>
  );
}

function SystemStatesSurface(props: CatalogDetailListStoryArgs) {
  return (
    <Frame {...props}>
      <EmptyState
        title="No combo context"
        stateToken="catalog-empty"
        sourceSurface="storybook-system"
        details="Filters never change the required context."
        message="Select a prepared character context to continue."
        actions={[{ available: true, id: "choose-context", label: "Choose context" }]}
      />
      <ErrorState
        title="Unable to load combos"
        errorToken="catalog-load-error"
        sourceSurface="storybook-system"
        technicalReference="CATALOG-LOAD-001"
        severity={errorStateSeverities.blocking}
        message="The prepared recovery operation remains page-owned."
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
      />
      <StaleInvalidComboMarker {...invalidMarker} sourceSurface="storybook-system" />
      <ComboList
        items={[]}
        notationDisplayMode="FGC"
        sourceSurface="storybook-system"
        accessibleLabel="Empty filtered list"
        state={comboListStates.noFilterResults}
        emptyState={{
          actions: [{ available: true, id: "clearFilters", label: "Clear filters" }],
          message: "No prepared summaries match the active filters.",
          stateToken: "no-filter-results",
          title: "No matching combos",
        }}
      />
    </Frame>
  );
}

export const CatalogDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <CatalogReadySurface {...args} />,
};

export const CommandDeckCharacterDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <CommandDeckCharacterSurface {...args} />,
};

export const CommandDeckFullRosterDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <CommandDeckFullRosterSurface {...args} />,
};

export const CommandDeckFullRosterTabletLight: Story = {
  args: {
    responsiveMode: uiResponsiveModes.tablet,
    theme: uiThemeModes.light,
  },
  globals: storyViewportGlobals.tablet,
  render: (args) => <CommandDeckFullRosterSurface {...args} />,
};

export const CommandDeckFullRosterMobileIncreasedContrast: Story = {
  args: {
    contrast: uiContrastModes.increased,
    responsiveMode: uiResponsiveModes.mobile,
  },
  globals: storyViewportGlobals.mobile,
  render: (args) => <CommandDeckFullRosterSurface {...args} />,
};

export const CommandDeckVariationDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <CommandDeckSpecificationSurface {...args} />,
};

export const CommandDeckVariationTablet: Story = {
  args: { responsiveMode: uiResponsiveModes.tablet },
  globals: storyViewportGlobals.tablet,
  render: (args) => <CommandDeckSpecificationSurface {...args} />,
};

export const CommandDeckVariationMobile: Story = {
  args: { responsiveMode: uiResponsiveModes.mobile },
  globals: storyViewportGlobals.mobile,
  render: (args) => <CommandDeckSpecificationSurface {...args} />,
};

export const CommandDeckKameoDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <CommandDeckSpecificationSurface {...args} kind="kameo" />,
};

export const CommandDeckKameoTablet: Story = {
  args: { responsiveMode: uiResponsiveModes.tablet },
  globals: storyViewportGlobals.tablet,
  render: (args) => <CommandDeckSpecificationSurface {...args} kind="kameo" />,
};

export const CommandDeckKameoMobile: Story = {
  args: {
    responsiveMode: uiResponsiveModes.mobile,
    theme: uiThemeModes.light,
  },
  globals: storyViewportGlobals.mobile,
  render: (args) => <CommandDeckSpecificationSurface {...args} kind="kameo" />,
};

export const CommandDeckBrowseDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <CommandDeckBrowseSurface {...args} />,
};

export const CommandDeckBrowseMobile: Story = {
  args: {
    contrast: uiContrastModes.increased,
    responsiveMode: uiResponsiveModes.mobile,
  },
  globals: storyViewportGlobals.mobile,
  render: (args) => <CommandDeckBrowseSurface {...args} />,
};

export const CommandDeckFilterDrawerMobile: Story = {
  args: { responsiveMode: uiResponsiveModes.mobile },
  globals: storyViewportGlobals.mobile,
  render: (args) => <CommandDeckFilterDrawerSurface {...args} />,
};

export const ActiveFilterChipsDesktop: Story = {
  globals: storyViewportGlobals.desktop,
  render: (args) => <ActiveFilterChipsSurface {...args} />,
};

export const ActiveFilterChipsMobile: Story = {
  args: {
    contrast: uiContrastModes.increased,
    responsiveMode: uiResponsiveModes.mobile,
    theme: uiThemeModes.light,
  },
  globals: storyViewportGlobals.mobile,
  render: (args) => <ActiveFilterChipsSurface {...args} />,
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

export const CatalogMobileDenseUkrainian: Story = {
  args: {
    contrast: uiContrastModes.increased,
    responsiveMode: uiResponsiveModes.mobile,
    theme: uiThemeModes.light,
  },
  globals: storyViewportGlobals.mobile,
  render: (args) => <MobileDenseUkrainianSurface {...args} />,
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
