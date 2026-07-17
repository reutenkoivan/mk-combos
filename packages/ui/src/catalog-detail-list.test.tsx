import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  comboListConfigModuleActions,
  comboListConfigPickerKinds,
  comboListConfigSelectionSteps,
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
  filterChoicePresentations,
  filterControlFocusIds,
  filterControlGroupActions,
  filterFacetKinds,
} from "@mk-combos/ui/components/filter-control-group";
import { KameoPicker, kameoPickerActions } from "@mk-combos/ui/components/kameo-picker";
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
import {
  comboPresentationModes,
  pickerPresentationModes,
  pickerSlotStatuses,
  uiResponsiveModes,
} from "@mk-combos/ui/components/value";
import { VariationPicker, variationPickerActions } from "@mk-combos/ui/components/variation-picker";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import { uiToneModes } from "@mk-combos/ui/tokens/value";
import { describe, expect, it, vi } from "vitest";

const comboRef = { comboId: "combo-1", gameId: "future-game", source: "seeded" } as const;
const secondComboRef = {
  comboId: "combo-2",
  gameId: "future-game",
  source: "seeded",
} as const;

type Rgb = readonly [number, number, number];

function parseHexColor(value: string): Rgb {
  return [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function mixSrgb(primary: Rgb, secondary: Rgb, primaryWeight: number): Rgb {
  return primary.map(
    (channel, index) => channel * primaryWeight + (secondary[index] ?? 0) * (1 - primaryWeight),
  ) as [number, number, number];
}

function relativeLuminance(color: Rgb): number {
  const [red, green, blue] = color.map((channel) => {
    const normalized = channel / 255;

    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * (red ?? 0) + 0.7152 * (green ?? 0) + 0.0722 * (blue ?? 0);
}

function contrastRatio(foreground: Rgb, background: Rgb): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));

  return (lighter + 0.05) / (darker + 0.05);
}

function cssThemeBlock(styles: string, selector: string): string {
  const selectorIndex = styles.indexOf(selector);
  const blockStart = styles.indexOf("{", selectorIndex);
  const blockEnd = styles.indexOf("\n}", blockStart);

  if (selectorIndex < 0 || blockStart < 0 || blockEnd < 0) {
    throw new Error(`Missing CSS theme block for ${selector}`);
  }

  return styles.slice(blockStart + 1, blockEnd);
}

function cssTokenColor(block: string, token: string): Rgb {
  const match = new RegExp(`--ui-${token}:\\s*(#[0-9a-f]{6})`, "i").exec(block);

  if (match?.[1] === undefined) {
    throw new Error(`Missing hexadecimal UI token --ui-${token}`);
  }

  return parseHexColor(match[1]);
}

const pickerOptions = [
  {
    count: 3,
    countLabel: "3 prepared combos",
    description: "Prepared context description",
    id: "fighter-1",
    label: "Fighter One",
  },
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
    metadataItems: [
      { id: "damage", label: "Damage", value: "280" },
      { id: "meter", label: "Meter", value: "1 bar" },
      { id: "routeType", label: "Route", tone: uiToneModes.accent, value: "Conversion" },
      { id: "position", label: "Position", value: "Midscreen" },
      {
        id: "difficulty",
        label: "Difficulty",
        tone: uiToneModes.warning,
        value: "Medium",
      },
    ],
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
        label="Characters"
        slots={pickerSlots}
        focusedSlotId="slot-1"
        options={pickerOptions}
        sourceSurface="catalog"
        layoutId="prepared-layout"
        clearLabel="Clear character"
        selectedCharacterId="fighter-1"
        onRequestAction={onRequestAction}
        sourceFocusTarget="catalog-character"
        responsiveMode={uiResponsiveModes.desktop}
      />,
    );

    const available = screen.getByRole("button", { name: "Fighter One: 3 prepared combos" });
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
    expect(screen.getByText("Prepared context description")).toBeTruthy();
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
        slots={pickerSlots}
        options={pickerOptions}
        sourceSurface="catalog"
        layoutId="prepared-layout"
        responsiveMode={uiResponsiveModes.mobile}
      />,
    );
    expect(screen.getByRole("button", { name: "Fighter One: 3 prepared combos" }).style.order).toBe(
      "3",
    );
    expect(
      (view.container.querySelector('[data-picker-slot="slot-placeholder"]') as HTMLElement).style
        .order,
    ).toBe("2");
  });

  it("renders command-deck characters as fluid portrait tiles at every responsive mode", () => {
    const onRequestAction = vi.fn();
    const portraitOptions = [
      {
        count: 12,
        countLabel: "12 підготовлених комбо",
        description: "Стабільні переходи з будь-якої позиції",
        id: "portrait-fighter",
        imageAlt: "Логотип бійця",
        imageSrc: "/portrait-fighter.svg",
        label: "Дуже довге ім’я бійця",
      },
      {
        count: 7,
        countLabel: "7 підготовлених комбо",
        disabledReason: "Дані ще недоступні",
        id: "missing-portrait",
        label: "Бієць без логотипа",
      },
      {
        id: "uncounted-fighter",
        imageSrc: "/uncounted-fighter.svg",
        label: "Бієць без лічильника",
      },
    ] as const satisfies readonly PickerOption[];
    const portraitSlots = [
      {
        column: 3,
        optionId: "portrait-fighter",
        responsiveOrder: 2,
        row: 2,
        slotId: "portrait-slot",
        status: pickerSlotStatuses.selectable,
      },
      {
        column: 1,
        optionId: "missing-portrait",
        responsiveOrder: 1,
        row: 1,
        slotId: "missing-slot",
        status: pickerSlotStatuses.disabledUnavailable,
      },
      {
        column: 2,
        optionId: "uncounted-fighter",
        responsiveOrder: 3,
        row: 1,
        slotId: "uncounted-slot",
        status: pickerSlotStatuses.selectable,
      },
    ] as const satisfies readonly PickerSlot[];
    const view = render(
      <UiRoot controllerFocusVisible>
        <CharacterPicker
          label="Персонажі"
          slots={portraitSlots}
          sourceSurface="catalog"
          options={portraitOptions}
          focusedSlotId="portrait-slot"
          layoutId="fluid-portrait-layout"
          onRequestAction={onRequestAction}
          selectedCharacterId="portrait-fighter"
          responsiveMode={uiResponsiveModes.desktop}
          presentation={pickerPresentationModes.commandDeck}
        />
      </UiRoot>,
    );

    const character = screen.getByRole("button", {
      name: "Дуже довге ім’я бійця: 12 підготовлених комбо",
    });
    const unavailable = screen.getByRole("button", {
      name: "Бієць без логотипа: 7 підготовлених комбо: Дані ще недоступні",
    });
    const uncounted = screen.getByRole("button", { name: "Бієць без лічильника" });
    const portrait = character.querySelector<HTMLElement>("[data-picker-option-portrait]");
    const portraitLayout = character.querySelector<HTMLElement>(
      '[data-picker-option-layout="portrait"]',
    );
    const label = character.querySelector<HTMLElement>("[data-picker-option-label]");
    const count = character.querySelector<HTMLElement>('[data-picker-option-count="12"]');
    const marker = character.querySelector<HTMLElement>("[data-picker-option-marker]");
    const grid = view.container.querySelector<HTMLElement>("[data-ui-picker-grid] > div");

    expect(portraitLayout).toBeTruthy();
    expect(character.style.order).toBe("2");
    expect(character.style.gridColumn).toBe("");
    expect(character.style.gridRow).toBe("");
    expect(grid?.style.gridTemplateColumns).toContain("auto-fit");
    expect(grid?.style.gridTemplateColumns).toContain("7.5rem");
    expect(grid?.className).toContain("max-w-[96rem]");
    expect(grid?.className).toContain("justify-self-center");
    expect(portrait?.querySelector("img")?.getAttribute("src")).toBe("/portrait-fighter.svg");
    expect(portrait?.contains(count ?? null)).toBe(true);
    expect(count?.textContent).toBe("12");
    expect(count?.getAttribute("aria-hidden")).toBe("true");
    expect(count?.className).toContain("pointer-events-none");
    expect(count?.className).toContain("rounded-full");
    expect(count?.className).toContain("border-(--ui-destructive)");
    expect(count?.className).toContain("bg-(--ui-destructive)");
    expect(count?.className).toContain("text-(--ui-accent-text)");
    expect(label?.textContent).toBe("Дуже довге ім’я бійця");
    expect(label?.className).toContain("break-words");
    expect(portrait?.compareDocumentPosition(label as Node) ?? 0).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByText("Стабільні переходи з будь-якої позиції")).toBeTruthy();
    expect(marker).toBeTruthy();
    expect(portrait?.contains(marker ?? null)).toBe(false);
    expect(unavailable.querySelector("[data-picker-missing-asset]")).toBeTruthy();
    expect(unavailable.querySelector('[data-picker-option-count="7"]')).toBeTruthy();
    expect((unavailable as HTMLButtonElement).disabled).toBe(true);
    expect(uncounted.querySelector("[data-picker-option-count]")).toBeNull();

    fireEvent.click(unavailable);
    fireEvent.click(character);
    expect(onRequestAction).toHaveBeenCalledTimes(1);
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: characterPickerActions.selectCharacter,
        characterId: "portrait-fighter",
      }),
    );

    for (const responsiveMode of Object.values(uiResponsiveModes)) {
      view.rerender(
        <UiRoot controllerFocusVisible>
          <CharacterPicker
            label="Персонажі"
            slots={portraitSlots}
            sourceSurface="catalog"
            options={portraitOptions}
            focusedSlotId="portrait-slot"
            responsiveMode={responsiveMode}
            layoutId="fluid-portrait-layout"
            selectedCharacterId="portrait-fighter"
            presentation={pickerPresentationModes.commandDeck}
          />
        </UiRoot>,
      );

      const responsiveGrid = view.container.querySelector<HTMLElement>(
        "[data-ui-picker-grid] > div",
      );
      const responsiveCharacter = screen.getByRole("button", {
        name: "Дуже довге ім’я бійця: 12 підготовлених комбо",
      });

      expect(responsiveGrid?.style.gridTemplateColumns).toContain("auto-fit");
      expect(responsiveCharacter.style.order).toBe("2");
      expect(responsiveCharacter.style.gridColumn).toBe("");
      expect(responsiveCharacter.style.gridRow).toBe("");
    }
  });

  it("renders command-deck variations as compact portrait cards while standard stays authored", () => {
    const onRequestAction = vi.fn();
    const specificationOptions = [
      {
        count: 6,
        countLabel: "6 комбо",
        description: "Стабільний маршрут із центру арени",
        id: "ruthless",
        imageAlt: "Безжальна варіація",
        imageSrc: "/ruthless.svg",
        label: "Безжальна",
      },
      {
        count: 1,
        countLabel: "1 комбо",
        disabledReason: "Ця варіація поки недоступна",
        id: "vicious",
        label: "Жорстока",
      },
      {
        count: 0,
        countLabel: "0 комбо",
        id: "lackey",
        imageSrc: "/lackey.svg",
        label: "Дуже довга українська назва варіації",
      },
    ] as const satisfies readonly PickerOption[];
    const specificationSlots = [
      {
        column: 3,
        optionId: "ruthless",
        responsiveOrder: 2,
        row: 2,
        slotId: "ruthless-slot",
        status: pickerSlotStatuses.selectable,
      },
      {
        column: 1,
        optionId: "vicious",
        responsiveOrder: 3,
        row: 1,
        slotId: "vicious-slot",
        status: pickerSlotStatuses.disabledUnavailable,
      },
      {
        column: 2,
        optionId: "lackey",
        responsiveOrder: 1,
        row: 3,
        slotId: "lackey-slot",
        status: pickerSlotStatuses.selectable,
      },
    ] as const satisfies readonly PickerSlot[];
    const view = render(
      <UiRoot controllerFocusVisible>
        <VariationPicker
          label="Варіація"
          sourceSurface="catalog"
          slots={specificationSlots}
          focusedSlotId="lackey-slot"
          options={specificationOptions}
          selectedVariationId="ruthless"
          onRequestAction={onRequestAction}
          layoutId="compact-variation-layout"
          responsiveMode={uiResponsiveModes.desktop}
          parentContextLabel="Обраний боєць: Ферра/Торр"
          presentation={pickerPresentationModes.commandDeck}
        />
      </UiRoot>,
    );

    const picker = view.container.querySelector<HTMLElement>("[data-ui-picker-grid]");
    const grid = picker?.querySelector<HTMLElement>(":scope > div");
    const selected = screen.getByRole("button", { name: "Безжальна: 6 комбо" });
    const unavailable = screen.getByRole("button", {
      name: "Жорстока: 1 комбо: Ця варіація поки недоступна",
    });
    const controllerFocused = screen.getByRole("button", {
      name: "Дуже довга українська назва варіації: 0 комбо",
    });
    const portrait = selected.querySelector<HTMLElement>("[data-picker-option-portrait]");
    const count = selected.querySelector<HTMLElement>('[data-picker-option-count="6"]');
    const label = selected.querySelector<HTMLElement>("[data-picker-option-label]");

    expect(picker?.getAttribute("data-picker-orientation")).toBe("portrait");
    expect(picker?.getAttribute("data-picker-placement")).toBe("compact");
    expect(grid?.style.gridTemplateColumns).toContain("8rem");
    expect(grid?.style.gridTemplateColumns).toContain("10rem");
    expect(grid?.style.gridTemplateColumns).not.toContain("1fr");
    expect(grid?.className).toContain("justify-center");
    expect(grid?.className).toContain("gap-4");
    expect(selected.className).toContain("min-h-44");
    expect(unavailable.className).toContain("min-h-44");
    expect(controllerFocused.className).toContain("min-h-44");
    expect(selected.style.order).toBe("2");
    expect(selected.style.gridColumn).toBe("");
    expect(selected.style.gridRow).toBe("");
    expect(portrait?.className).toContain("h-16");
    expect(portrait?.className).toContain("w-16");
    expect(portrait?.querySelector("img")?.className).toContain("h-16");
    expect(portrait?.contains(count ?? null)).toBe(true);
    expect(count?.textContent).toBe("6");
    expect(label?.textContent).toBe("Безжальна");
    expect(portrait?.compareDocumentPosition(label as Node) ?? 0).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(selected.querySelector('[data-picker-option-marker="selected"]')).toBeTruthy();
    expect(selected.querySelector('[data-ui-icon="check"]')).toBeTruthy();
    expect(
      controllerFocused.querySelector('[data-picker-option-marker="controller-focused"]'),
    ).toBeTruthy();
    expect(controllerFocused.textContent).toContain("◎");
    expect(controllerFocused.getAttribute("data-controller-focused")).toBe("true");
    expect(unavailable.querySelector("[data-picker-missing-asset]")).toBeTruthy();
    expect(unavailable.textContent).toContain("Ця варіація поки недоступна");
    expect((unavailable as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(unavailable);
    fireEvent.click(selected);
    expect(onRequestAction).toHaveBeenCalledTimes(1);
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: variationPickerActions.selectVariation,
        variationId: "ruthless",
      }),
    );

    for (const responsiveMode of Object.values(uiResponsiveModes)) {
      view.rerender(
        <UiRoot controllerFocusVisible>
          <VariationPicker
            label="Варіація"
            sourceSurface="catalog"
            slots={specificationSlots}
            focusedSlotId="lackey-slot"
            options={specificationOptions}
            selectedVariationId="ruthless"
            responsiveMode={responsiveMode}
            layoutId="compact-variation-layout"
            parentContextLabel="Обраний боєць: Ферра/Торр"
            presentation={pickerPresentationModes.commandDeck}
          />
        </UiRoot>,
      );

      const responsivePicker = view.container.querySelector<HTMLElement>("[data-ui-picker-grid]");
      const responsiveSelected = screen.getByRole("button", { name: "Безжальна: 6 комбо" });

      expect(responsivePicker?.getAttribute("data-picker-placement")).toBe("compact");
      expect(responsiveSelected.style.order).toBe("2");
      expect(responsiveSelected.style.gridColumn).toBe("");
      expect(responsiveSelected.style.gridRow).toBe("");
    }

    onRequestAction.mockClear();
    view.rerender(
      <VariationPicker
        label="Variation"
        slots={specificationSlots}
        backLabel="Back to fighters"
        clearLabel="Clear variation"
        options={specificationOptions}
        selectedVariationId="ruthless"
        onRequestAction={onRequestAction}
        layoutId="authored-variation-layout"
        sourceSurface="standalone-variation"
        responsiveMode={uiResponsiveModes.desktop}
        presentation={pickerPresentationModes.standard}
        parentContextLabel="Selected fighter: Ferra/Torr"
      />,
    );

    const standardPicker = view.container.querySelector<HTMLElement>("[data-ui-picker-grid]");
    const standardSelected = screen.getByRole("button", { name: "Безжальна: 6 комбо" });

    expect(standardPicker?.getAttribute("data-picker-orientation")).toBe("horizontal");
    expect(standardPicker?.getAttribute("data-picker-placement")).toBe("authored");
    expect(standardSelected.querySelector("[data-picker-option-layout]")).toBeNull();
    expect(standardSelected.style.gridColumn).toBe("3");
    expect(standardSelected.style.gridRow).toBe("2");
    fireEvent.click(screen.getByRole("button", { name: "Back to fighters" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear variation" }));
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: variationPickerActions.returnToCharacterPicker }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: variationPickerActions.clearVariation }),
    );
  });

  it("keeps compact kameo cards stable while busy and emits selection when ready", () => {
    const onRequestAction = vi.fn();
    const kameoOptions = [
      {
        count: 4,
        countLabel: "4 комбо",
        id: "cyrax",
        imageAlt: "Камeо Сайракс",
        imageSrc: "/cyrax.svg",
        label: "Сайракс",
      },
      {
        count: 2,
        countLabel: "2 комбо",
        id: "sareena",
        label: "Саріна",
      },
    ] as const satisfies readonly PickerOption[];
    const kameoSlots = [
      {
        column: 2,
        optionId: "cyrax",
        responsiveOrder: 2,
        row: 2,
        slotId: "cyrax-slot",
        status: pickerSlotStatuses.selectable,
      },
      {
        column: 1,
        optionId: "sareena",
        responsiveOrder: 1,
        row: 1,
        slotId: "sareena-slot",
        status: pickerSlotStatuses.selectable,
      },
    ] as const satisfies readonly PickerSlot[];
    const view = render(
      <UiRoot controllerFocusVisible>
        <KameoPicker
          busy
          label="Камео"
          slots={kameoSlots}
          options={kameoOptions}
          selectedKameoId="cyrax"
          sourceSurface="catalog"
          focusedSlotId="cyrax-slot"
          message="Завантажуємо камео"
          layoutId="compact-kameo-layout"
          onRequestAction={onRequestAction}
          responsiveMode={uiResponsiveModes.tablet}
          parentContextLabel="Обраний боєць: Скорпіон"
          presentation={pickerPresentationModes.commandDeck}
        />
      </UiRoot>,
    );

    const picker = view.container.querySelector<HTMLElement>("[data-ui-picker-grid]");
    const cyrax = screen.getByRole("button", { name: "Сайракс: 4 комбо" });
    const sareena = screen.getByRole("button", { name: "Саріна: 2 комбо" });

    expect(picker?.getAttribute("data-picker-orientation")).toBe("portrait");
    expect(picker?.getAttribute("data-picker-placement")).toBe("compact");
    expect(picker?.getAttribute("aria-busy")).toBe("true");
    expect(cyrax.className).toContain("min-h-44");
    expect(sareena.className).toContain("min-h-44");
    expect(cyrax.getAttribute("data-loading")).toBe("true");
    expect((cyrax as HTMLButtonElement).disabled).toBe(true);
    expect(cyrax.querySelector('[data-picker-option-layout="portrait"]')).toBeTruthy();
    expect(cyrax.querySelector('[data-picker-option-count="4"]')?.textContent).toBe("4");
    expect(cyrax.querySelector('[data-picker-option-marker="selected"]')).toBeTruthy();
    expect(sareena.querySelector("[data-picker-missing-asset]")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Завантажуємо камео");
    fireEvent.click(cyrax);
    expect(onRequestAction).not.toHaveBeenCalled();

    view.rerender(
      <UiRoot controllerFocusVisible>
        <KameoPicker
          label="Камео"
          slots={kameoSlots}
          options={kameoOptions}
          selectedKameoId="cyrax"
          sourceSurface="catalog"
          focusedSlotId="cyrax-slot"
          layoutId="compact-kameo-layout"
          onRequestAction={onRequestAction}
          responsiveMode={uiResponsiveModes.mobile}
          parentContextLabel="Обраний боєць: Скорпіон"
          presentation={pickerPresentationModes.commandDeck}
        />
      </UiRoot>,
    );

    const readyCyrax = screen.getByRole("button", { name: "Сайракс: 4 комбо" });

    expect(readyCyrax.style.order).toBe("2");
    expect(readyCyrax.style.gridColumn).toBe("");
    expect((readyCyrax as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(readyCyrax);
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: kameoPickerActions.selectKameo,
        kameoId: "cyrax",
      }),
    );
  });

  it("keeps zero picker counts present and gives selection priority over controller focus", () => {
    const zeroCountOptions = [
      {
        count: 0,
        countLabel: "0 комбінацій",
        id: "fighter-zero",
        imageSrc: "/fighter-zero.svg",
        label: "Fighter Zero",
      },
    ] as const satisfies readonly PickerOption[];
    const zeroCountSlots = [
      {
        column: 1,
        optionId: "fighter-zero",
        row: 1,
        slotId: "slot-zero",
        status: pickerSlotStatuses.selectable,
      },
    ] as const satisfies readonly PickerSlot[];
    const view = render(
      <UiRoot controllerFocusVisible>
        <CharacterPicker
          slots={zeroCountSlots}
          sourceSurface="catalog"
          focusedSlotId="slot-zero"
          options={zeroCountOptions}
          layoutId="zero-count-picker"
          label="Zero-count characters"
          responsiveMode={uiResponsiveModes.desktop}
          presentation={pickerPresentationModes.commandDeck}
        />
      </UiRoot>,
    );

    const option = screen.getByRole("button", { name: "Fighter Zero: 0 комбінацій" });
    const count = option.querySelector('[data-picker-option-count="0"]');

    expect(count?.textContent).toBe("0");
    expect(count?.getAttribute("aria-hidden")).toBe("true");
    expect(option.textContent).toContain("◎");

    view.rerender(
      <UiRoot controllerFocusVisible>
        <CharacterPicker
          slots={zeroCountSlots}
          sourceSurface="catalog"
          focusedSlotId="slot-zero"
          options={zeroCountOptions}
          layoutId="zero-count-picker"
          label="Zero-count characters"
          selectedCharacterId="fighter-zero"
          responsiveMode={uiResponsiveModes.desktop}
          presentation={pickerPresentationModes.commandDeck}
        />
      </UiRoot>,
    );

    expect(option.querySelector('[data-ui-icon="check"]')).toBeTruthy();
    expect(option.textContent).not.toContain("◎");
  });

  it("renders pathname-ready character and specification steps as exclusive command-deck surfaces", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <ComboListConfigModule
        onRequestAction={onRequestAction}
        responsiveMode={uiResponsiveModes.desktop}
        contextSelection={{
          characterPicker: {
            focusedSlotId: "slot-1",
            label: "Fighter roster",
            layoutId: "command-deck-roster",
            options: pickerOptions,
            selectedCharacterId: "fighter-1",
            slots: pickerSlots,
            sourceSurface: "catalog-selector",
          },
          commands: [{ commandId: "select", inputLabel: "A", label: "Select" }],
          header: {
            description: "Prepared character guidance",
            gameLabel: "Prepared game",
            optionCountLabel: "1 available / 2 total",
            stepLabel: "01 / Fighter roster",
            title: "Select fighter",
          },
          step: comboListConfigSelectionSteps.character,
        }}
      />,
    );

    const selector = view.container.querySelector("[data-command-deck-selector]");
    const selectorHeader = selector?.querySelector<HTMLElement>("[data-command-deck-header]");
    const pickerRegion = selector?.querySelector<HTMLElement>("[data-command-deck-picker-region]");
    const selectorHeading = screen.getByRole("heading", { name: "Select fighter" });
    const selectorDescription = screen.getByText("Prepared character guidance");
    const selected = screen.getByRole("button", { name: "Fighter One: 3 prepared combos" });

    expect(selector?.getAttribute("data-command-deck-step")).toBe("character");
    expect(selector?.className).toContain("min-h-[calc(100dvh-6rem)]");
    expect(selectorHeader?.className).toContain("gap-2");
    expect(selectorHeader?.className).toContain("p-3");
    expect(selectorHeader?.className).not.toContain("sm:p-6");
    expect(pickerRegion?.className).toContain("p-2");
    expect(pickerRegion?.className).toContain("min-[40rem]:p-3");
    expect(pickerRegion?.className).not.toContain("lg:p-6");
    expect(selectorHeading.className).toContain("text-3xl");
    expect(selectorHeading.className).not.toContain("sm:text-4xl");
    expect(selectorDescription.className).toContain("leading-5");
    expect(selected.id).toBe("picker-command-deck-roster--slot-1");
    expect(selected.getAttribute("aria-pressed")).toBe("true");
    expect(selected.getAttribute("data-controller-focused")).toBe("true");
    expect(selected.getAttribute("tabindex")).toBe("0");
    expect(
      screen
        .getByRole("button", { name: "Fighter Two: Complete setup to unlock" })
        .getAttribute("tabindex"),
    ).toBe("-1");
    expect(view.container.querySelector("[data-picker-missing-asset]")).toBeTruthy();
    expect(screen.getByText("01 / Fighter roster")).toBeTruthy();

    view.rerender(
      <ComboListConfigModule
        onRequestAction={onRequestAction}
        sourceFocusTarget="locked-fighter"
        responsiveMode={uiResponsiveModes.desktop}
        contextSelection={{
          commands: [{ commandId: "back", inputLabel: "B", label: "Change fighter" }],
          gameContextPicker: {
            kind: comboListConfigPickerKinds.variation,
            props: {
              focusedSlotId: "slot-1",
              label: "Variation",
              layoutId: "command-deck-variation",
              options: pickerOptions.slice(0, 1),
              parentContextLabel: "Fighter One",
              slots: pickerSlots.slice(0, 1),
              sourceSurface: "catalog-selector",
            },
          },
          header: {
            stepLabel: "02 / Variation",
            title: "Select variation",
          },
          lockedCharacter: {
            changeLabel: "Change fighter",
            id: "fighter-1",
            label: "Fighter One",
            progressLabel: "02 / 02",
          },
          step: comboListConfigSelectionSteps.specification,
        }}
      />,
    );

    const variation = screen.getByRole("button", { name: "Fighter One: 3 prepared combos" });
    const specificationHeader = view.container.querySelector<HTMLElement>(
      "[data-command-deck-header]",
    );
    const specificationPickerRegion = view.container.querySelector<HTMLElement>(
      "[data-command-deck-picker-region]",
    );
    const specificationHeading = screen.getByRole("heading", { name: "Select variation" });

    expect(view.container.querySelector('[data-ui-component="UI-CMP-007"]')).toBeNull();
    expect(view.container.querySelector('[data-ui-component="UI-CMP-008"]')).toBeTruthy();
    expect(
      view.container
        .querySelector('[data-ui-component="UI-CMP-008"]')
        ?.getAttribute("data-picker-presentation"),
    ).toBe(pickerPresentationModes.commandDeck);
    expect(variation.querySelector('[data-picker-option-layout="portrait"]')).toBeTruthy();
    expect(variation.className).toContain("min-h-44");
    expect(variation.style.order).toBe("3");
    expect(variation.style.gridColumn).toBe("");
    expect(variation.style.gridRow).toBe("");
    expect(
      view.container.querySelector("[data-ui-picker-grid]")?.getAttribute("data-picker-placement"),
    ).toBe("compact");
    expect(specificationHeader?.className).toContain("gap-4");
    expect(specificationHeader?.className).toContain("sm:p-6");
    expect(specificationPickerRegion?.className).toContain("lg:p-6");
    expect(specificationHeading.className).toContain("sm:text-4xl");
    fireEvent.click(screen.getAllByRole("button", { name: "Change fighter" })[0] as HTMLElement);
    expect(onRequestAction).toHaveBeenCalledWith({
      action: comboListConfigModuleActions.changeCharacter,
      reason: "press",
      sourceFocusTarget: "locked-fighter",
      sourceSurface: "catalog-selector",
    });
  });

  it("does not reserve an action track when the locked character has no change action", () => {
    const view = render(
      <ComboListConfigModule
        responsiveMode={uiResponsiveModes.desktop}
        contextSelection={{
          gameContextPicker: {
            kind: comboListConfigPickerKinds.kameo,
            props: {
              label: "Kameo",
              layoutId: "locked-character-kameo",
              options: pickerOptions.slice(0, 1),
              parentContextLabel: "Selected fighter: Fighter One",
              slots: pickerSlots.slice(0, 1),
              sourceSurface: "catalog-selector",
            },
          },
          header: {
            stepLabel: "02 / Kameo",
            title: "Select kameo",
          },
          lockedCharacter: {
            id: "fighter-1",
            label: "Fighter One",
            progressLabel: "02 / 02",
          },
          step: comboListConfigSelectionSteps.specification,
        }}
      />,
    );

    const lockedCharacter = view.container.querySelector<HTMLElement>(
      '[data-command-deck-locked-character="fighter-1"]',
    );

    expect(lockedCharacter?.className).toContain("grid-cols-[auto_minmax(0,1fr)]");
    expect(lockedCharacter?.className).not.toContain("sm:grid-cols-[auto_minmax(0,1fr)_auto]");
    expect(screen.queryByRole("button", { name: "Change fighter" })).toBeNull();
  });

  it("keeps the localized loading status visible while collapsed filters are busy", () => {
    render(
      <FilterControlGroup
        busy
        open={false}
        label="Фільтри"
        sourceSurface="catalog"
        responsiveMode={uiResponsiveModes.desktop}
        applied={{
          activeFilters: [],
          activeFiltersLabel: "Активні фільтри",
          clearLabel: "Очистити",
          resultCountLabel: "3 комбінації",
        }}
        draft={{
          activeFilters: [],
          activeFiltersLabel: "Чернетка фільтрів",
          applyLabel: "Застосувати",
          discardLabel: "Відкинути",
          facets: [],
          loadingLabel: "Оновлення фільтрів",
          resetLabel: "Скинути",
          resultCountLabel: "3 комбінації",
        }}
      />,
    );

    expect(screen.getByRole("status").textContent).toBe("Оновлення фільтрів");
    expect(screen.getByRole("button", { name: /Фільтри/ }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("keeps mobile Discard available while Apply is busy and the group is disabled", () => {
    render(
      <FilterControlGroup
        busy
        disabled
        open
        label="Filter drawer"
        sourceSurface="filter-drawer"
        responsiveMode={uiResponsiveModes.mobile}
        applied={{
          activeFilters: [],
          activeFiltersLabel: "Active filters",
          clearLabel: "Clear filters",
          resultCountLabel: "0 results",
        }}
        draft={{
          activeFilters: [],
          activeFiltersLabel: "Draft filters",
          applyLabel: "Apply filters",
          discardLabel: "Discard changes",
          facets: [],
          loadingLabel: "Updating preview",
          resetLabel: "Reset filters",
          resultCountLabel: "0 results",
        }}
      />,
    );
    const surface = document.querySelector("[data-filter-drawer]");
    const header = surface?.querySelector("header");
    const discard = screen.getByRole("button", { name: "Discard changes" });
    const reset = screen.getByRole("button", { name: "Reset filters" });
    const apply = screen.getByRole("button", { name: "Apply filters" });

    expect(surface?.getAttribute("aria-busy")).toBe("true");
    expect(header?.className).toContain("grid-cols-1");
    expect((discard as HTMLButtonElement).disabled).toBe(false);
    expect((reset as HTMLButtonElement).disabled).toBe(true);
    expect((apply as HTMLButtonElement).disabled).toBe(true);
    expect(apply.getAttribute("aria-busy")).toBe("true");
    expect(apply.textContent).toContain("Apply filters");
  });

  it("keeps the summary mounted while the controlled drawer follows its ref lifecycle", () => {
    const drawerRef = vi.fn();
    const props = {
      applied: {
        activeFilters: [],
        activeFiltersLabel: "Active filters",
        clearLabel: "Clear filters",
        resultCountLabel: "0 results",
      },
      draft: {
        activeFilters: [],
        activeFiltersLabel: "Draft filters",
        applyLabel: "Apply filters",
        discardLabel: "Discard filters",
        facets: [],
        loadingLabel: "Loading filters",
        resetLabel: "Reset filters",
        resultCountLabel: "0 results",
      },
      label: "Filters",
      open: false,
      responsiveMode: uiResponsiveModes.desktop,
      sourceSurface: "catalog",
    } as const;
    const view = render(<FilterControlGroup {...props} />);

    expect(view.container.querySelectorAll("[data-filter-summary-toolbar]")).toHaveLength(1);
    expect(document.querySelector("[data-filter-drawer]")).toBeNull();

    view.rerender(<FilterControlGroup {...props} open drawerRef={drawerRef} />);

    expect(view.container.querySelectorAll("[data-filter-summary-toolbar]")).toHaveLength(1);
    expect(document.querySelectorAll("[data-filter-drawer]")).toHaveLength(1);
    expect(document.querySelector("[data-active-filter-list]")).toBeNull();
    expect(drawerRef).toHaveBeenCalledWith(expect.any(HTMLElement));

    view.rerender(<FilterControlGroup {...props} />);

    expect(drawerRef).toHaveBeenLastCalledWith(null);
    expect(view.container.querySelectorAll("[data-filter-summary-toolbar]")).toHaveLength(1);
    expect(document.querySelector("[data-filter-drawer]")).toBeNull();
  });

  it("emits controlled choice, chip, disclosure, and clear intents", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <FilterControlGroup
        open
        label="Filters"
        sourceSurface="catalog"
        onRequestAction={onRequestAction}
        sourceFocusTarget="filter-trigger"
        responsiveMode={uiResponsiveModes.desktop}
        applied={{
          activeFilters: [
            {
              filterId: "routeClass",
              id: "active-route-class",
              label: "Conversion",
              removeLabel: "Remove route class filter",
              tone: uiToneModes.warning,
              value: "conversion",
            },
          ],
          activeFiltersLabel: "Active filters",
          clearLabel: "Clear filters",
          resultCountLabel: "12 results",
        }}
        draft={{
          activeFilters: [
            {
              filterId: "routeClass",
              id: "draft-route-class",
              label: "Conversion",
              removeLabel: "Remove draft route class filter",
              tone: uiToneModes.warning,
              value: "conversion",
            },
          ],
          activeFiltersLabel: "Draft filters",
          applyLabel: "Apply filters",
          discardLabel: "Discard filters",
          facets: [
            {
              id: "position",
              kind: filterFacetKinds.singleChoice,
              label: "Position",
              options: [{ available: true, id: "midscreen", label: "Midscreen" }],
              presentation: filterChoicePresentations.compact,
              selectedValues: [],
            },
            {
              id: "tags",
              kind: filterFacetKinds.multiChoice,
              label: "Tags",
              options: [
                {
                  available: true,
                  count: 7,
                  countLabel: "7 комбінацій",
                  id: "easy",
                  label: "Легко виконати",
                },
              ],
              presentation: filterChoicePresentations.compact,
              selectedValues: ["easy"],
            },
          ],
          loadingLabel: "Loading filters",
          resetLabel: "Reset filters",
          resultCountLabel: "12 draft results",
        }}
      />,
    );

    const filterTrigger = view.container.querySelector<HTMLButtonElement>(
      '[data-filter-summary-action="open"]',
    ) as HTMLButtonElement;
    const filterChevron = filterTrigger.querySelector<SVGElement>('[data-ui-icon="chevron-down"]');

    expect(filterTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(filterChevron?.getAttribute("class")).toContain("rotate-180");
    expect(filterChevron?.getAttribute("class")).toContain("motion-reduce:transition-none");
    expect(view.container.querySelector("[data-filter-summary-facets]")).toBeNull();
    expect(screen.queryByRole("button", { name: "Position: —" })).toBeNull();
    expect(view.container.querySelectorAll('ul[aria-label="Active filters"]')).toHaveLength(1);
    const activeFilterList = view.container.querySelector<HTMLUListElement>(
      'ul[aria-label="Active filters"]',
    ) as HTMLUListElement;
    const activeFilter = activeFilterList.querySelector<HTMLElement>(
      '[data-filter-id="routeClass"][data-filter-value="conversion"]',
    );
    const activeFilterBadge = activeFilter?.querySelector<HTMLElement>("[data-ui-badge]");
    const activeFilterLabel = activeFilterBadge?.querySelector<HTMLElement>("span");
    const removeActiveFilter = activeFilter?.querySelector<HTMLButtonElement>(
      'button[aria-label="Remove route class filter"]',
    ) as HTMLButtonElement;
    const filterSummaryToolbar = view.container.querySelector<HTMLElement>(
      "[data-filter-summary-toolbar]",
    );
    const filterSummaryChipRow = view.container.querySelector<HTMLElement>(
      "[data-filter-summary-chip-row]",
    );
    const filterSummaryResultCount = view.container.querySelector<HTMLElement>(
      "[data-filter-summary-result-count]",
    );
    const clearFilters = view.container.querySelector<HTMLButtonElement>(
      '[data-filter-summary-action="clear"]',
    ) as HTMLButtonElement;

    expect(activeFilterList.children).toHaveLength(1);
    expect(activeFilterList.className).toContain("flex-wrap");
    expect(activeFilterList.className).not.toContain("overflow-x-auto");
    expect(activeFilterList.className.split(/\s+/)).toContain("gap-1");
    expect(activeFilterList.className.split(/\s+/)).not.toContain("gap-1.5");
    expect(activeFilter?.getAttribute("data-filter-tone")).toBe(uiToneModes.warning);
    expect(activeFilter?.className).toContain("min-h-8");
    expect(activeFilter?.className.split(/\s+/)).not.toContain("pe-1.5");
    expect(activeFilterBadge?.className).toContain("h-auto");
    expect(activeFilterBadge?.className).toContain("min-h-8");
    expect(activeFilterBadge?.className).toContain("rounded-full");
    expect(activeFilterBadge?.className).toContain("ps-2");
    expect(activeFilterBadge?.className).toContain("pe-8");
    expect(activeFilterBadge?.className).toContain("peer-[:enabled:hover]:brightness-[1.08]");
    expect(activeFilterBadge?.className).toContain("peer-[:enabled:active]:brightness-[0.94]");
    expect(activeFilterBadge?.className).not.toContain("peer-focus-visible:shadow");
    expect(activeFilterBadge?.className).toContain("peer-disabled:opacity-50");
    expect(activeFilterLabel?.className).toContain("whitespace-normal");
    expect(activeFilterLabel?.className).toContain("break-words");
    expect(activeFilterLabel?.textContent).toBe("Conversion");
    expect(removeActiveFilter.hasAttribute("data-filter-chip-remove")).toBe(true);
    expect(removeActiveFilter.className).toContain("h-full");
    expect(removeActiveFilter.className).not.toContain("!");
    expect(removeActiveFilter.className.split(/\s+/)).not.toContain("min-h-8");
    expect(removeActiveFilter.className).toContain("w-full");
    expect(removeActiveFilter.className).toContain("min-w-0");
    expect(removeActiveFilter.className).toContain(
      "[--ui-focus-ring:inset_0_0_0_2px_var(--ui-accent)]",
    );
    expect(removeActiveFilter.className).toContain("rounded-full");
    expect(removeActiveFilter.className).toContain("peer");
    expect(removeActiveFilter.className.split(/\s+/)).not.toContain("translate-x-1.5");
    expect(removeActiveFilter.className).not.toContain("text-transparent");
    expect(
      removeActiveFilter.querySelector('[data-ui-icon="x"]')?.getAttribute("class"),
    ).not.toContain("translate-x-1.5");
    expect(activeFilter?.querySelectorAll('[data-ui-icon="x"]')).toHaveLength(1);
    expect(filterSummaryToolbar?.className).toContain("grid-cols-[auto_minmax(0,1fr)_auto]");
    expect(filterSummaryToolbar?.className.split(/\s+/)).toEqual(
      expect.arrayContaining(["items-center", "p-1"]),
    );
    expect(filterSummaryToolbar?.className.split(/\s+/)).not.toContain("items-start");
    expect(filterSummaryToolbar?.className.split(/\s+/)).not.toContain("p-2");
    expect(filterSummaryToolbar?.className).not.toContain("divide-x");
    expect(filterSummaryChipRow?.className).toContain("flex-wrap");
    expect(filterSummaryChipRow?.className.split(/\s+/)).not.toContain("py-1");
    expect(filterSummaryChipRow?.className).not.toContain("overflow-hidden");
    expect(filterSummaryResultCount?.getAttribute("aria-live")).toBe("polite");
    expect(filterSummaryResultCount?.textContent).toBe("12 results");
    expect(filterTrigger.textContent).not.toContain("12 results");
    expect(filterTrigger.className).toContain("min-h-11");
    expect(filterTrigger.className).toContain("border-0");
    expect(filterTrigger.className).toContain("w-auto");
    expect(filterTrigger.className).not.toContain("min-h-16");
    expect(clearFilters.className).toContain("size-11");
    expect(clearFilters.className).toContain("border-0");
    expect(clearFilters.className).toContain("bg-transparent");
    expect(clearFilters.querySelector('[data-ui-icon="x"]')).toBeTruthy();

    const easyFilter = screen.getByRole("button", { name: "Легко виконати: 7 комбінацій" });

    fireEvent.click(screen.getByRole("button", { name: "Midscreen" }));
    fireEvent.click(easyFilter);
    fireEvent.click(removeActiveFilter);
    fireEvent.click(clearFilters);
    fireEvent.click(filterTrigger);

    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.toggleDraftOption,
        filterId: "position",
        selected: true,
        value: "midscreen",
      }),
    );
    expect(screen.getByLabelText("Active filters")).toBeTruthy();
    expect(easyFilter.textContent).toContain("7");
    expect(easyFilter.textContent).not.toContain("7 комбінацій");
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.toggleDraftOption,
        filterId: "tags",
        selected: false,
        value: "easy",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.removeAppliedFilter,
        filterId: "routeClass",
        value: "conversion",
      }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: filterControlGroupActions.clearAppliedFilters }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.discardDraftFilters,
      }),
    );
  });

  it("keeps a blocked active-filter capsule visible while its remove target is inert", () => {
    const onRequestAction = vi.fn();
    const view = render(
      <FilterControlGroup
        disabled
        open={false}
        label="Filters"
        sourceSurface="catalog"
        onRequestAction={onRequestAction}
        responsiveMode={uiResponsiveModes.desktop}
        applied={{
          activeFilters: [
            {
              filterId: "difficulty",
              id: "difficulty-easy",
              label: "Easy",
              removeLabel: "Remove easy difficulty",
              tone: uiToneModes.success,
              value: "easy",
            },
          ],
          activeFiltersLabel: "Active filters",
          clearLabel: "Clear filters",
          resultCountLabel: "3 results",
        }}
        draft={{
          activeFilters: [],
          activeFiltersLabel: "Draft filters",
          applyLabel: "Apply filters",
          discardLabel: "Discard filters",
          facets: [],
          loadingLabel: "Loading filters",
          resetLabel: "Reset filters",
          resultCountLabel: "3 results",
        }}
      />,
    );

    const activeFilter = view.container.querySelector<HTMLElement>(
      '[data-filter-id="difficulty"][data-filter-value="easy"]',
    );
    const activeFilterBadge = activeFilter?.querySelector<HTMLElement>("[data-ui-badge]");
    const removeActiveFilter = screen.getByRole("button", {
      name: "Remove easy difficulty",
    });

    expect((removeActiveFilter as HTMLButtonElement).disabled).toBe(true);
    expect(removeActiveFilter.className).toContain("cursor-not-allowed");
    expect(activeFilterBadge?.className).toContain("peer-disabled:opacity-50");
    expect(activeFilter?.querySelectorAll('[data-ui-icon="x"]')).toHaveLength(1);
    fireEvent.click(removeActiveFilter);
    expect(onRequestAction).not.toHaveBeenCalled();
  });

  it("renders the modal filter drawer and emits apply or discard", () => {
    const onRequestAction = vi.fn();
    render(
      <FilterControlGroup
        open
        label="Filter drawer"
        sourceSurface="filter-drawer"
        onRequestAction={onRequestAction}
        responsiveMode={uiResponsiveModes.desktop}
        controllerFocusedControlId={filterControlFocusIds.option("stage", "crossroads")}
        applied={{
          activeFilters: [],
          activeFiltersLabel: "Active filters",
          clearLabel: "Clear filters",
          resultCountLabel: "12 routes",
        }}
        draft={{
          activeFilters: [
            {
              filterId: "stage",
              id: "crossroads-chip",
              label: "Crossroads",
              removeLabel: "Remove Crossroads",
              value: "crossroads",
            },
          ],
          activeFiltersLabel: "Draft filters",
          applyLabel: "Apply filters",
          discardLabel: "Discard changes",
          facets: [
            {
              id: "stage",
              kind: filterFacetKinds.singleChoice,
              label: "Arena",
              options: [
                {
                  available: true,
                  count: 4,
                  countLabel: "4 routes",
                  id: "crossroads",
                  label: "Crossroads",
                },
                { available: true, count: 2, id: "dead-woods", label: "Dead Woods" },
              ],
              presentation: filterChoicePresentations.visual,
              selectedValues: ["crossroads"],
            },
          ],
          loadingLabel: "Updating preview",
          resetLabel: "Reset filters",
          resultCountLabel: "12 matching routes",
        }}
      />,
    );

    const surface = document.querySelector("[data-filter-drawer]");
    const draftFilterList = screen.getByLabelText("Draft filters");
    const draftFilter = draftFilterList.querySelector<HTMLElement>(
      '[data-filter-id="stage"][data-filter-value="crossroads"]',
    );
    const draftFilterBadge = draftFilter?.querySelector<HTMLElement>("[data-ui-badge]");
    const removeDraftFilter = screen.getByRole("button", { name: "Remove Crossroads" });
    const discardChanges = screen.getByRole("button", { name: "Discard changes" });
    const resetFilters = screen.getByRole("button", { name: "Reset filters" });
    const applyFilters = screen.getByRole("button", { name: "Apply filters" });
    expect(surface?.className).toContain("h-dvh");
    expect(surface?.className).toContain("max-w-[42rem]");
    expect(surface?.getAttribute("role")).toBe("dialog");
    expect(surface?.getAttribute("tabindex")).toBe("-1");
    expect(surface?.querySelector("[data-ui-disclosure-trigger]")).toBeNull();
    expect(surface?.querySelector("[data-filter-facet-list]")?.className).toContain("grid-cols-2");
    expect(screen.getByRole("group", { name: "Arena" }).className).toContain(
      "grid-cols-[repeat(4,minmax(0,12rem))]",
    );
    expect(screen.getByRole("group", { name: "Arena" }).className).toContain("justify-start");
    const focusedOption = screen.getByRole("button", { name: "Crossroads: 4 routes" });
    expect(focusedOption.textContent).toContain("4");
    expect(focusedOption.textContent).not.toContain("4 routes");
    expect(focusedOption.getAttribute("data-controller-focused")).toBe("true");
    expect(focusedOption.className).toContain("min-h-11");
    expect(focusedOption.querySelector("img")).toBeNull();
    expect(focusedOption.querySelector('[data-filter-selected-marker="true"]')).toBeTruthy();
    expect(discardChanges.querySelector('[data-ui-icon="return"]')).toBeTruthy();
    expect(resetFilters.querySelector('[data-ui-icon="trash-2"]')).toBeTruthy();
    expect(applyFilters.querySelector('[data-ui-icon="check"]')).toBeTruthy();
    expect(applyFilters.getAttribute("data-loading")).toBeNull();
    expect(draftFilterList.className).toContain("flex-wrap");
    expect(draftFilterList.className).not.toContain("overflow-x-auto");
    expect(draftFilterList.className.split(/\s+/)).toContain("gap-1");
    expect(draftFilter?.className).toContain("min-h-8");
    expect(draftFilter?.className.split(/\s+/)).not.toContain("pe-1.5");
    expect(draftFilterBadge?.className).toContain("h-auto");
    expect(draftFilterBadge?.className).toContain("min-h-8");
    expect(draftFilterBadge?.className).toContain("rounded-full");
    expect(draftFilterBadge?.className).toContain("ps-2");
    expect(draftFilterBadge?.className).toContain("pe-8");
    expect(draftFilterBadge?.className).not.toContain("peer-focus-visible:shadow");
    expect(removeDraftFilter.hasAttribute("data-filter-chip-remove")).toBe(true);
    expect(removeDraftFilter.className).toContain("h-full");
    expect(removeDraftFilter.className).not.toContain("!");
    expect(removeDraftFilter.className.split(/\s+/)).not.toContain("min-h-8");
    expect(removeDraftFilter.className).toContain("w-full");
    expect(removeDraftFilter.className).toContain("min-w-0");
    expect(removeDraftFilter.className).toContain(
      "[--ui-focus-ring:inset_0_0_0_2px_var(--ui-accent)]",
    );
    expect(draftFilter?.querySelectorAll('[data-ui-icon="x"]')).toHaveLength(1);
    fireEvent.click(applyFilters);
    fireEvent.click(discardChanges);
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: filterControlGroupActions.applyFilters }),
    );
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: filterControlGroupActions.discardDraftFilters,
      }),
    );
  });

  it("exempts only active-filter chip remove targets from responsive control sizing", () => {
    const packageStylesPath = resolve(process.cwd(), "src/styles.css");
    const workspaceStylesPath = resolve(process.cwd(), "packages/ui/src/styles.css");
    const uiStyles = readFileSync(
      existsSync(packageStylesPath) ? packageStylesPath : workspaceStylesPath,
      "utf8",
    );

    expect(uiStyles).toContain(
      '.mk-combos-ui-root[data-ui-responsive="mobile"] [data-ui-button]:not([data-filter-chip-remove]),',
    );
    expect(uiStyles).toContain(
      '.mk-combos-ui-root[data-ui-responsive="tablet"] [data-ui-button]:not([data-filter-chip-remove]),',
    );
    expect(uiStyles).toContain("  min-height: 2.75rem;\n  min-width: 2.75rem;");
  });

  it("preserves prepared combo order and maps notation without mutating its source", () => {
    const notation = [["F", "2"], ["UNKNOWN"]] as const;
    const before = JSON.stringify(notation);
    const onRequestAction = vi.fn();
    const items = [card("Second", secondComboRef), card("First", comboRef)] as const;
    render(
      <ComboList
        items={items}
        sourceSurface="catalog"
        accessibleLabel="Prepared combos"
        notationDisplayMode="PlayStation"
        onRequestAction={onRequestAction}
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
    expect(screen.getAllByText("Custom copies unavailable")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 3, name: "Second" }).className).not.toContain(
      "truncate",
    );
    const wrappingBadges = [
      screen.getAllByText("Fighter: Prepared fighter")[0]?.closest("[data-ui-badge]"),
      screen.getAllByText("Damage: 280")[0]?.closest("[data-ui-badge]"),
    ];
    for (const badge of wrappingBadges) {
      expect(badge?.className).toContain("h-auto");
      expect(badge?.className).toContain("whitespace-normal");
      expect(badge?.className.split(" ")).not.toContain("h-5.5");
    }

    const notationView = render(
      <NotationRenderer
        notation={notation}
        tokenState="invalid"
        notationDisplayMode="Xbox"
        density={notationRendererDensities.detail}
        wrappingMode={notationRendererWrappingModes.inline}
        routeSteps={[
          {
            emphasis: "primary",
            kind: "starter",
            notation: ["F", "2"],
            repetitionCount: 2,
          },
          {
            emphasis: "warning",
            kind: "finish",
            notation: ["UNKNOWN"],
            repetitionCount: 1,
          },
        ]}
      />,
    );
    expect(JSON.stringify(notation)).toBe(before);
    expect(
      notationView.container
        .querySelector('[data-ui-component="UI-CMP-015"]')
        ?.getAttribute("aria-label"),
    ).toContain("Unknown notation token UNKNOWN");
    expect(notationView.container.querySelector('[data-token-state="invalid"]')).toBeTruthy();
    expect(
      notationView.container
        .querySelector('[data-ui-notation-kind="starter"]')
        ?.getAttribute("data-ui-notation-repetition"),
    ).toBe("2");
    expect(notationView.container.querySelector("[data-ui-notation-repeat]")?.textContent).toBe(
      "×2",
    );

    const commandNotationView = render(
      <NotationRenderer
        notationDisplayMode="FGC"
        notation={[["1"], ["2"], ["UNKNOWN"]]}
        density={notationRendererDensities.command}
        routeSteps={[
          {
            emphasis: "standard",
            kind: "string",
            notation: ["1"],
            repetitionCount: 1,
          },
          {
            emphasis: "strong",
            kind: "meter",
            notation: ["2"],
            repetitionCount: 1,
          },
          {
            emphasis: "strong",
            kind: "finish",
            notation: ["UNKNOWN"],
            repetitionCount: 1,
          },
        ]}
      />,
    );
    const commandKeycaps = Array.from(
      commandNotationView.container.querySelectorAll<HTMLElement>("[data-ui-notation-keycap]"),
    );

    expect(commandKeycaps).toHaveLength(3);
    for (const keycap of commandKeycaps) {
      expect(keycap.className).not.toContain("border-(--ui-command-border)");
      expect(keycap.className).not.toContain("bg-(--ui-command-locked)");
    }

    const standardIcon = commandNotationView.container.querySelector<HTMLElement>(
      '[data-ui-notation-step="0"] [data-ui-notation-icon]',
    );
    const strongIcon = commandNotationView.container.querySelector<HTMLElement>(
      '[data-ui-notation-step="1"] [data-ui-notation-icon]',
    );
    const invalidStrongIcon = commandNotationView.container.querySelector<HTMLElement>(
      '[data-ui-notation-step="2"] [data-ui-notation-icon]',
    );

    expect(standardIcon?.className).toContain("border-(--ui-control-border)");
    expect(standardIcon?.className).not.toContain("border-(--ui-command-accent)");
    expect(strongIcon?.className).toContain("border-(--ui-command-accent)");
    expect(invalidStrongIcon?.className).toContain("border-(--ui-destructive-border)");
    expect(invalidStrongIcon?.className).not.toContain("border-(--ui-command-accent)");
  });

  it("renders every prepared metadata tone as text-only emphasis in all card presentations", () => {
    const metadataToneClasses = {
      [uiToneModes.accent]:
        "text-[color-mix(in_srgb,var(--ui-accent-strong)_90%,var(--ui-text)_10%)]",
      [uiToneModes.destructive]:
        "text-[color-mix(in_srgb,var(--ui-destructive)_90%,var(--ui-text)_10%)]",
      [uiToneModes.neutral]: "text-(--ui-text)",
      [uiToneModes.success]: "text-[color-mix(in_srgb,var(--ui-success)_90%,var(--ui-text)_10%)]",
      [uiToneModes.warning]: "text-[color-mix(in_srgb,var(--ui-warning)_90%,var(--ui-text)_10%)]",
    } as const;
    const metadataItems = Object.values(uiToneModes).map((tone) => ({
      id: `tone-${tone}`,
      label: `${tone} label`,
      tone,
      value: `${tone} value`,
    }));
    const baseCard = card("Tone matrix");
    const toneCard = {
      ...baseCard,
      summary: {
        ...baseCard.summary,
        metadataItems,
      },
    };
    const presentations = [
      comboPresentationModes.standard,
      comboPresentationModes.commandDeck,
    ] as const;
    const view = render(
      <ComboList
        items={[toneCard]}
        sourceSurface="catalog"
        notationDisplayMode="FGC"
        accessibleLabel="Tone matrix"
        presentation={presentations[0]}
        state={comboListStates.comboListReady}
      />,
    );

    for (const presentation of presentations) {
      view.rerender(
        <ComboList
          items={[toneCard]}
          sourceSurface="catalog"
          notationDisplayMode="FGC"
          presentation={presentation}
          accessibleLabel="Tone matrix"
          state={comboListStates.comboListReady}
        />,
      );

      const cardElement = view.container.querySelector<HTMLElement>('[data-combo-id="combo-1"]');
      expect(cardElement?.getAttribute("data-combo-presentation")).toBe(presentation);

      for (const tone of Object.values(uiToneModes)) {
        const metadataItem = cardElement?.querySelector<HTMLElement>(
          `[data-combo-metadata-id="tone-${tone}"]`,
        );
        const label = metadataItem?.querySelector<HTMLElement>("[data-combo-metadata-label]");
        const value = metadataItem?.querySelector<HTMLElement>(
          `[data-combo-metadata-tone="${tone}"]`,
        );

        expect(label?.className).toContain("text-(--ui-muted-text)");
        expect(value?.textContent).toBe(`${tone} value`);
        expect(value?.className).toContain(metadataToneClasses[tone]);
        expect(value?.closest("[data-ui-badge]")).toBeNull();
        expect(metadataItem?.className).not.toMatch(/(?:^|\s)(?:bg-|border|p[xy]?-[^\s]+)/);
        expect(value?.className).not.toMatch(/(?:^|\s)(?:bg-|border|p[xy]?-[^\s]+)/);
      }
    }
  });

  it("keeps toned metadata text at WCAG AA contrast on every light and dark card surface", () => {
    const packageStylesPath = resolve(process.cwd(), "src/styles.css");
    const workspaceStylesPath = resolve(process.cwd(), "packages/ui/src/styles.css");
    const uiStyles = readFileSync(
      existsSync(packageStylesPath) ? packageStylesPath : workspaceStylesPath,
      "utf8",
    );
    const themes = [
      { name: "light", selector: ":root," },
      {
        name: "dark",
        selector: '[data-ui-theme="dark"] {\n  color-scheme: dark;',
      },
    ] as const;
    const toneTokens = {
      [uiToneModes.accent]: "accent-strong",
      [uiToneModes.destructive]: "destructive",
      [uiToneModes.neutral]: "text",
      [uiToneModes.success]: "success",
      [uiToneModes.warning]: "warning",
    } as const;

    for (const theme of themes) {
      const block = cssThemeBlock(uiStyles, theme.selector);
      const text = cssTokenColor(block, "text");
      const commandSurface = cssTokenColor(block, "command-surface");
      const cardSurfaces = {
        commandDeck: cssTokenColor(block, "command-row"),
        selectedCommandDeck: mixSrgb(
          cssTokenColor(block, "command-accent-fill"),
          commandSurface,
          0.14,
        ),
        selectedStandard: cssTokenColor(block, "selection-muted"),
        standard: cssTokenColor(block, "content"),
      };

      for (const [tone, token] of Object.entries(toneTokens)) {
        const semanticColor = cssTokenColor(block, token);
        const foreground = tone === uiToneModes.neutral ? text : mixSrgb(semanticColor, text, 0.9);

        for (const [surface, background] of Object.entries(cardSurfaces)) {
          expect(
            contrastRatio(foreground, background),
            `${theme.name} ${tone} metadata on ${surface}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it("wires command-deck and filter-preview presentations through ordered cards", () => {
    const onRequestAction = vi.fn();
    const commandRoute = card("Command route");
    const view = render(
      <ComboList
        sourceSurface="catalog"
        accessibleLabel="Command routes"
        notationDisplayMode="PlayStation"
        onRequestAction={onRequestAction}
        state={comboListStates.comboListReady}
        presentation={comboPresentationModes.commandDeck}
        items={[
          {
            ...commandRoute,
            actions: [
              ...commandRoute.actions,
              {
                available: true,
                id: "add-command-route",
                kind: comboCardActionKinds.addToList,
                label: "Add Command route",
              },
            ],
            focused: true,
            selected: true,
          },
          card("Second command route", secondComboRef),
        ]}
      />,
    );

    const cardElement = screen.getByRole("article", { name: "Command route notation" });
    const orderedList = view.container.querySelector("ol") as HTMLOListElement;
    const visibleIndexes = Array.from(
      view.container.querySelectorAll<HTMLElement>("[data-combo-visible-index]"),
    );
    const metrics = cardElement.querySelector('[data-combo-row-region="metrics"]') as HTMLElement;
    const rowAction = view.container.querySelector<HTMLButtonElement>(
      '[data-combo-index="1"] [data-combo-row-action="open-detail"]',
    );
    const supportingAction = screen.getByRole("button", { name: "Add Command route" });

    expect(orderedList.className).toContain("divide-y");
    expect(orderedList.className).toContain("divide-(--ui-command-border)");
    expect(orderedList.className.split(" ")).not.toContain("border");
    expect(orderedList.children).toHaveLength(2);
    expect(
      Array.from(orderedList.children).every((row) => !row.className.split(" ").includes("border")),
    ).toBe(true);
    expect(visibleIndexes.map((index) => index.textContent)).toEqual(["01", "02"]);
    expect(visibleIndexes.every((index) => index.className.includes("border-e"))).toBe(true);
    expect(visibleIndexes.every((index) => !index.className.split(" ").includes("border"))).toBe(
      true,
    );
    expect(cardElement.getAttribute("data-combo-presentation")).toBe("commandDeck");
    expect(cardElement.getAttribute("data-controller-focused")).toBe("true");
    expect(cardElement.getAttribute("aria-current")).toBe("true");
    expect(cardElement.getAttribute("tabindex")).toBe("-1");
    expect(cardElement.className.split(" ")).not.toContain("border");
    expect(cardElement.className).toContain("pointer-events-none");
    expect(cardElement.querySelector("[data-combo-selected-marker]")).toBeTruthy();
    expect(cardElement.querySelector("[data-combo-local-action]")).toBeNull();
    expect(cardElement.querySelector('[data-combo-row-region="detail-action"]')).toBeNull();
    expect(rowAction?.getAttribute("aria-label")).toBe(
      "Open Command route: Command route notation",
    );
    expect(rowAction?.className).toContain("absolute");
    expect(rowAction?.className).toContain("inset-0");
    expect(rowAction?.disabled).toBe(false);
    expect(supportingAction.className).toContain("pointer-events-auto");
    expect(cardElement.querySelector("h3")).toBeNull();
    expect(
      cardElement
        .querySelector('[data-ui-component="UI-CMP-015"]')
        ?.getAttribute("data-ui-notation-density"),
    ).toBe(notationRendererDensities.command);
    expect(cardElement.querySelector("[data-combo-input-profile]")).toBeNull();
    expect(
      cardElement.querySelector('[data-ui-notation-icon="notation-playstation-triangle"]'),
    ).toBeTruthy();
    expect(cardElement.textContent).toContain("Fighter: Prepared fighter");
    expect(cardElement.textContent).toContain("Prepared notes");
    expect(cardElement.textContent).toContain("In Favorites");
    expect(Array.from(metrics.querySelectorAll("dt"), (term) => term.textContent)).toEqual([
      "Damage",
      "Meter",
      "Route",
      "Position",
      "Difficulty",
    ]);
    expect(
      metrics.querySelector(
        '[data-combo-metadata-id="routeType"] [data-combo-metadata-tone="accent"]',
      )?.textContent,
    ).toBe("Conversion");
    expect(
      metrics.querySelector(
        '[data-combo-metadata-id="difficulty"] [data-combo-metadata-tone="warning"]',
      )?.textContent,
    ).toBe("Medium");
    expect(metrics.querySelector('[data-combo-metadata-id="damage"] [data-ui-badge]')).toBeNull();
    expect(metrics.querySelector('[data-combo-metadata-id="damage"] dd')?.textContent).toBe("280");
    expect(metrics.className).toContain("border-t");
    expect(metrics.className).toContain("lg:border-s");
    for (const value of metrics.querySelectorAll("dd")) {
      expect(value.className).toContain("break-words");
      expect(value.className).not.toContain("truncate");
    }
    fireEvent.focus(rowAction as HTMLButtonElement);
    expect(onRequestAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: comboListActions.focusCombo,
        comboRef,
        reason: "triggerFocus",
      }),
    );
    onRequestAction.mockClear();
    fireEvent.click(supportingAction);
    expect(onRequestAction).toHaveBeenCalledTimes(1);
    expect(onRequestAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: comboListActions.addToList,
        actionId: "add-command-route",
      }),
    );
    onRequestAction.mockClear();
    fireEvent.click(rowAction as HTMLButtonElement);
    expect(onRequestAction).toHaveBeenCalledTimes(1);
    expect(onRequestAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: comboListActions.openComboDetail,
        actionId: "open-combo-1",
        comboRef,
        reason: "press",
      }),
    );

    const unavailableCard = card("Unavailable route");
    view.rerender(
      <ComboList
        sourceSurface="catalog"
        notationDisplayMode="FGC"
        onRequestAction={onRequestAction}
        accessibleLabel="Unavailable routes"
        state={comboListStates.comboListReady}
        presentation={comboPresentationModes.commandDeck}
        items={[{ ...unavailableCard, disabledReason: "Detail is unavailable" }]}
      />,
    );
    const disabledRowAction = view.container.querySelector<HTMLButtonElement>(
      '[data-combo-row-action="open-detail"]',
    );
    onRequestAction.mockClear();
    expect(disabledRowAction?.disabled).toBe(true);
    fireEvent.click(disabledRowAction as HTMLButtonElement);
    expect(onRequestAction).not.toHaveBeenCalled();

    view.rerender(
      <ComboList
        sourceSurface="catalog"
        notationDisplayMode="FGC"
        onRequestAction={onRequestAction}
        accessibleLabel="Actionless routes"
        state={comboListStates.comboListReady}
        presentation={comboPresentationModes.commandDeck}
        items={[{ ...card("Actionless route"), actions: [] }]}
      />,
    );
    const actionlessCard = screen.getByRole("article", { name: "Actionless route notation" });
    expect(view.container.querySelector('[data-combo-row-action="open-detail"]')).toBeNull();
    expect(actionlessCard.getAttribute("tabindex")).toBe("0");
    expect(actionlessCard.className).not.toContain("pointer-events-none");
    onRequestAction.mockClear();
    fireEvent.focus(actionlessCard);
    expect(onRequestAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: comboListActions.focusCombo,
        comboRef,
        reason: "triggerFocus",
      }),
    );
  });

  it("keeps logical targets while controller focus presentation is globally hidden", () => {
    const focusedCard = card("Hidden controller route");
    const view = render(
      <UiRoot controllerFocusVisible={false}>
        <CharacterPicker
          slots={pickerSlots}
          focusedSlotId="slot-1"
          options={pickerOptions}
          sourceSurface="catalog"
          layoutId="hidden-focus-picker"
          label="Hidden-focus characters"
          responsiveMode={uiResponsiveModes.desktop}
        />
        <FilterControlGroup
          open
          sourceSurface="catalog"
          label="Hidden-focus filter drawer"
          responsiveMode={uiResponsiveModes.desktop}
          controllerFocusedControlId={filterControlFocusIds.option("position", "midscreen")}
          applied={{
            activeFilters: [],
            activeFiltersLabel: "Hidden-focus filters",
            clearLabel: "Clear hidden-focus filters",
            resultCountLabel: "1 route",
          }}
          draft={{
            activeFilters: [],
            activeFiltersLabel: "Hidden-focus draft filters",
            applyLabel: "Apply hidden-focus filters",
            discardLabel: "Close hidden-focus filters",
            facets: [
              {
                id: "position",
                kind: filterFacetKinds.singleChoice,
                label: "Hidden-focus position",
                options: [{ available: true, id: "midscreen", label: "Hidden-focus midscreen" }],
                presentation: filterChoicePresentations.compact,
                selectedValues: [],
              },
            ],
            loadingLabel: "Loading hidden-focus filters",
            resetLabel: "Reset hidden-focus filters",
            resultCountLabel: "1 route",
          }}
        />
        <ComboList
          sourceSurface="catalog"
          notationDisplayMode="FGC"
          accessibleLabel="Hidden-focus routes"
          state={comboListStates.comboListReady}
          items={[{ ...focusedCard, focused: true }]}
          presentation={comboPresentationModes.commandDeck}
        />
        <NamedListIndex
          sourceSurface="lists"
          focusedListId="favorites"
          selectedListId="favorites"
          createAction={{ available: true, id: "create", label: "Create hidden-focus list" }}
          items={[{ summary: { id: "favorites", itemCount: 2, name: "Hidden-focus favorites" } }]}
        />
      </UiRoot>,
    );

    const pickerTarget = view.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Fighter One: 3 prepared combos"]',
    ) as HTMLButtonElement;
    const filterTarget = screen.getByRole("button", { name: "Hidden-focus midscreen" });
    const comboTarget = view.container.querySelector<HTMLElement>(
      'article[aria-label="Hidden controller route notation"]',
    ) as HTMLElement;
    const listTarget = view.container.querySelector<HTMLButtonElement>(
      '[data-ui-selectable-item="favorites"]',
    ) as HTMLButtonElement;

    expect(view.container.firstElementChild?.getAttribute("data-ui-controller-focus-visible")).toBe(
      "false",
    );
    expect(pickerTarget.getAttribute("data-controller-focused")).toBeNull();
    expect(pickerTarget.getAttribute("tabindex")).toBe("0");
    expect(filterTarget.getAttribute("data-controller-focused")).toBeNull();
    expect(comboTarget.getAttribute("data-controller-focused")).toBeNull();
    expect(listTarget.getAttribute("data-controller-focused")).toBeNull();
    expect(listTarget.getAttribute("aria-current")).toBe("true");
    expect(listTarget.getAttribute("aria-pressed")).toBeNull();
    expect(view.container.textContent).not.toContain("◎");
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
        emptyState={emptyState}
        sourceSurface="catalog"
        notationDisplayMode="FGC"
        state={comboListStates.noCombos}
        accessibleLabel="Prepared combos"
        items={[card("Contradictory card")]}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "No combos" })).toBeTruthy();
    expect(screen.queryByRole("article", { name: "Contradictory card notation" })).toBeNull();

    view.rerender(
      <ComboList
        emptyState={emptyState}
        sourceSurface="catalog"
        notationDisplayMode="FGC"
        items={[card("Ready card")]}
        accessibleLabel="Prepared combos"
        state={comboListStates.comboListReady}
      />,
    );
    expect(screen.queryByRole("heading", { level: 2, name: "No combos" })).toBeNull();
    expect(screen.getByRole("article", { name: "Ready card notation" })).toBeTruthy();

    view.rerender(
      <ComboList
        emptyState={emptyState}
        sourceSurface="catalog"
        notationDisplayMode="FGC"
        items={[card("Previous card")]}
        accessibleLabel="Prepared combos"
        statusMessage="Refreshing combos"
        state={comboListStates.loadingCombos}
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

    view.rerender(
      <ComboList
        sourceSurface="catalog"
        notationDisplayMode="FGC"
        accessibleLabel="Disabled combos"
        state={comboListStates.listDisabled}
        disabledReason="Choose an available context"
        items={[card("Disabled without status text")]}
      />,
    );
    const disabledWithoutStatus = screen.getByRole("article", {
      name: "Disabled without status text notation",
    });
    expect(disabledWithoutStatus.getAttribute("aria-disabled")).toBe("true");
    expect(disabledWithoutStatus.getAttribute("tabindex")).toBe("-1");
    expect(screen.getByText("Choose an available context")).toBeTruthy();
  });
});

describe("detail, named-list, and system presentation components", () => {
  it("renders prepared detail metadata and returns anchored menu/header intents", () => {
    const headerAction = vi.fn();
    const menuAction = vi.fn();
    render(
      <>
        <ComboDetailHeader
          comboRef={comboRef}
          sourceLabel="Seeded"
          sourceSurface="detail"
          title="Prepared detail"
          onRequestAction={headerAction}
          controllerFocusedActionId="add"
          sourceFocusTarget="detail-heading"
          contextItems={[{ id: "fighter", label: "Fighter", value: "Prepared fighter" }]}
          actions={[
            {
              available: true,
              id: "add",
              kind: comboDetailHeaderActionKinds.addToList,
              label: "Add to list",
            },
            {
              available: false,
              disabledReason: "Only custom combos can be repaired",
              id: "repair",
              kind: comboDetailHeaderActionKinds.repair,
              label: "Repair combo",
            },
          ]}
        />
        <ComboMetadataGrid
          label="Combo metadata"
          annotation="Prepared warning"
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
          comboRef={comboRef}
          label="Combo actions"
          sourceSurface="detail"
          onRequestAction={menuAction}
          sourceFocusTarget="detail-actions"
          menuState={comboActionsMenuStates.open}
          actions={[
            { available: true, id: "copy", label: "Copy notation" },
            {
              available: false,
              disabledReason: "Unavailable for this source",
              id: "delete",
              label: "Delete",
            },
          ]}
        />
      </>,
    );

    expect(
      screen.getByRole("button", { name: "Add to list" }).getAttribute("data-controller-focused"),
    ).toBe("true");

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
    const criticalMetadata = screen.getByText("280").closest("[data-metadata-importance]");
    expect(criticalMetadata?.getAttribute("data-metadata-importance")).toBe("critical");
    expect(criticalMetadata?.className).toContain("bg-(--ui-warning-soft)");
    expect(screen.getByText("Only custom combos can be repaired")).toBeTruthy();
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
          sourceSurface="lists"
          focusedListId="favorites"
          selectedListId="favorites"
          onRequestAction={indexAction}
          createAction={{ available: true, id: "create", label: "Create list" }}
          items={[
            {
              renameAction: { available: true, id: "rename", label: "Rename Favorites" },
              summary: { id: "favorites", itemCount: 2, name: "Favorites" },
            },
          ]}
        />
        <NamedListDetail
          sourceSurface="lists"
          notationDisplayMode="FGC"
          onRequestAction={detailAction}
          list={{ id: "favorites", itemCount: 2, name: "Favorites" }}
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
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: /^Favorites2$/ }));
    expect(screen.getByRole("button", { name: /^Favorites2$/ }).getAttribute("aria-current")).toBe(
      "true",
    );
    expect(
      screen.getByRole("button", { name: /^Favorites2$/ }).getAttribute("aria-pressed"),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: /^Favorites2$/ }).getAttribute("data-controller-focused"),
    ).toBe("true");
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
      compatibleListsLabel: "Compatible named lists",
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
    const existingMembership = screen.getByRole("button", { name: "Lab: Already added" });

    expect(favorites.textContent).toContain("2");
    expect(existingMembership.textContent).toContain("Already added");
    expect(existingMembership.textContent).not.toContain("4");

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
    expect((existingMembership as HTMLButtonElement).disabled).toBe(true);
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
        open
        title="Rename list"
        draftName="Favorites"
        sourceSurface="lists"
        fieldLabel="List name"
        submitLabel="Save name"
        cancelLabel="Cancel edit"
        onRequestAction={listAction}
        sourceFocusTarget="favorites-row"
        mode={listEditDialogModes.renameList}
        submitAvailability={{ available: true }}
        description="Rename the prepared list"
        validationMessage="Name must be unique"
        selectedList={{ id: "favorites", itemCount: 2, name: "Favorites" }}
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
        open
        title="Delete list"
        draftName="Favorites"
        sourceSurface="lists"
        fieldLabel="List name"
        submitLabel="Delete list"
        cancelLabel="Cancel delete"
        submitAvailability={{ available: true }}
        description="Delete the prepared list"
        mode={listEditDialogModes.deleteListConfirm}
        deleteImpactMessage="This removes the prepared list"
        selectedList={{ id: "favorites", itemCount: 2, name: "Favorites" }}
      />,
    );
    expect(screen.queryByRole("textbox", { name: "List name" })).toBeNull();
    expect(screen.getByText("This removes the prepared list")).toBeTruthy();

    view.unmount();
    render(
      <BuilderContextSetup
        label="Builder context"
        sourceSurface="builder"
        onRequestAction={builderAction}
        confirmAction={{ available: true, id: "confirm", label: "Continue" }}
        runtimeFields={[
          {
            id: "runtime-note",
            kind: builderContextFieldKinds.text,
            label: "Runtime note",
            value: "Prepared",
          },
        ]}
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
          title="No context"
          sourceSurface="catalog"
          stateToken="context-empty"
          onRequestAction={emptyAction}
          message="Select a prepared context"
          actions={[{ available: true, id: "choose", label: "Choose context" }]}
        />
        <ErrorState
          sourceSurface="catalog"
          errorToken="catalog-error"
          title="Catalog unavailable"
          onRequestAction={errorAction}
          controllerFocusedActionId="retry"
          message="Prepared recovery message"
          severity={errorStateSeverities.blocking}
          actions={[
            {
              available: true,
              id: "retry",
              kind: errorStateActionKinds.retry,
              label: "Retry catalog",
            },
          ]}
        />
        <StaleInvalidComboMarker
          comboRef={comboRef}
          sourceSurface="detail"
          stateLabel="Invalid combo"
          onRequestAction={staleAction}
          state={staleInvalidComboMarkerStates.invalid}
          reason="A referenced catalog entry is unavailable"
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
        />
      </>,
    );

    expect(
      screen.getByRole("button", { name: "Retry catalog" }).getAttribute("data-controller-focused"),
    ).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Choose context" }));
    fireEvent.click(screen.getByRole("button", { name: "Retry catalog" }));
    fireEvent.click(screen.getByRole("button", { name: "Repair combo" }));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Invalid combo")).toBeTruthy();
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
