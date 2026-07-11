import { notationDisplayModes } from "@mk-combos/contracts/settings/type";
import { render, screen } from "@mk-combos/contracts/test/unit/react";
import * as contractEntry from "@mk-combos/ui/contract";
import { AlertTriangleIcon, alertTriangleIcon } from "@mk-combos/ui/icons/alert-triangle";
import { CheckIcon, checkIcon } from "@mk-combos/ui/icons/check";
import { ChevronDownIcon, chevronDownIcon } from "@mk-combos/ui/icons/chevron-down";
import { ChevronLeftIcon, chevronLeftIcon } from "@mk-combos/ui/icons/chevron-left";
import { ChevronRightIcon, chevronRightIcon } from "@mk-combos/ui/icons/chevron-right";
import { ChevronUpIcon, chevronUpIcon } from "@mk-combos/ui/icons/chevron-up";
import { CircleHelpIcon, circleHelpIcon } from "@mk-combos/ui/icons/circle-help";
import { DownloadIcon, downloadIcon } from "@mk-combos/ui/icons/download";
import { EditIcon, editIcon } from "@mk-combos/ui/icons/edit";
import { Gamepad2Icon, gamepad2Icon } from "@mk-combos/ui/icons/gamepad-2";
import { MenuIcon, menuIcon } from "@mk-combos/ui/icons/menu";
import { PlusIcon, plusIcon } from "@mk-combos/ui/icons/plus";
import { SearchIcon, searchIcon } from "@mk-combos/ui/icons/search";
import { SettingsIcon, settingsIcon } from "@mk-combos/ui/icons/settings";
import { Trash2Icon, trash2Icon } from "@mk-combos/ui/icons/trash-2";
import { UploadIcon, uploadIcon } from "@mk-combos/ui/icons/upload";
import { XIcon, xIcon } from "@mk-combos/ui/icons/x";
import {
  createNotationLegendRows,
  getNotationDisplayModeDescriptor,
  mapNotationSequence,
  mapNotationStep,
  mapNotationToken,
} from "@mk-combos/ui/notation/runtime";
import {
  notationDisplayModes as notationSchemaDisplayModes,
  UiNotationIconDescriptorSchema,
  UiNotationLegendRowSchema,
  UiNotationTokenSchema,
} from "@mk-combos/ui/notation/schema";
import type {
  UiNotationIconDescriptor,
  UiNotationIconKind,
  UiNotationLegendRow,
  UiNotationToken,
} from "@mk-combos/ui/notation/type";
import {
  notationDisplayModes as notationTypeDisplayModes,
  uiNotationDisplayModeIconNames as typeNotationDisplayModeIconNames,
  uiNotationIconKinds as typeNotationIconKinds,
  uiNotationModeTokenIconNames as typeNotationModeTokenIconNames,
  uiNotationModeTokenLabels as typeNotationModeTokenLabels,
  uiNotationTokenKinds as typeNotationTokenKinds,
  uiNotationTokenStates as typeNotationTokenStates,
  uiNotationTokens as typeNotationTokens,
} from "@mk-combos/ui/notation/type";
import {
  notationDisplayModes as notationValueDisplayModes,
  uiNotationTokens,
} from "@mk-combos/ui/notation/value";
import {
  uiContrastModes as schemaContrastModes,
  uiDensityModes as schemaDensityModes,
  uiEmphasisModes as schemaEmphasisModes,
  uiInteractionStates as schemaInteractionStates,
  uiMaterialModes as schemaMaterialModes,
  uiPlacementModes as schemaPlacementModes,
  uiSelectionStates as schemaSelectionStates,
  uiSemanticTokenNames as schemaSemanticTokenNames,
  uiShapeModes as schemaShapeModes,
  uiThemeModes as schemaThemeModes,
  uiToneModes as schemaToneModes,
  UiSemanticTokenSchema,
  UiThemeModeSchema,
  UiToneModeSchema,
} from "@mk-combos/ui/tokens/schema";
import type {
  UiContrastMode,
  UiDensityMode,
  UiEmphasisMode,
  UiInteractionState,
  UiMaterialMode,
  UiPlacementMode,
  UiSelectionState,
  UiSemanticToken,
  UiSemanticTokenName,
  UiThemeMode,
} from "@mk-combos/ui/tokens/type";
import {
  uiContrastModes as typeContrastModes,
  uiDensityModes as typeDensityModes,
  uiEmphasisModes as typeEmphasisModes,
  uiInteractionStates as typeInteractionStates,
  uiMaterialModes as typeMaterialModes,
  uiPlacementModes as typePlacementModes,
  uiSelectionStates as typeSelectionStates,
  uiSemanticTokenNames as typeSemanticTokenNames,
  uiSemanticTokens as typeSemanticTokens,
  uiShapeModes as typeShapeModes,
  uiThemeModes as typeThemeModes,
  uiToneModes as typeToneModes,
} from "@mk-combos/ui/tokens/type";
import { uiSemanticTokenNames, uiSemanticTokens } from "@mk-combos/ui/tokens/value";
import { describe, expect, it } from "vitest";

import { InternalButton } from "./internal/base-ui/button";
import {
  InternalDialogBackdrop,
  InternalDialogClose,
  InternalDialogDescription,
  InternalDialogPopup,
  InternalDialogPortal,
  InternalDialogRoot,
  InternalDialogTitle,
  InternalDialogTrigger,
} from "./internal/base-ui/dialog";
import { NotationIcon } from "./notation/renderer";
import * as recipeBarrel from "./recipes";
import { controlRecipe } from "./recipes/control";
import { fieldRecipe } from "./recipes/field";
import { indicatorRecipe } from "./recipes/indicator";
import { itemRecipe } from "./recipes/item";
import { popupRecipe } from "./recipes/popup";
import { separatorRecipe } from "./recipes/separator";
import { surfaceRecipe } from "./recipes/surface";

const acceptsUiTokenTypes = <
  _Tokens extends {
    contrast: UiContrastMode;
    density: UiDensityMode;
    emphasis: UiEmphasisMode;
    interaction: UiInteractionState;
    material: UiMaterialMode;
    placement: UiPlacementMode;
    selection: UiSelectionState;
    tokenName: UiSemanticTokenName;
    theme: UiThemeMode;
  },
>() => true;

const acceptsNotationTypes = <
  _Notation extends {
    descriptor: UiNotationIconDescriptor;
    iconKind: UiNotationIconKind;
    legendRow: UiNotationLegendRow;
    token: UiNotationToken;
  },
>() => true;

const notationControllerControlTokens = [
  "faceSouth",
  "faceEast",
  "faceWest",
  "faceNorth",
  "leftShoulder",
  "rightShoulder",
  "leftTrigger",
  "rightTrigger",
  "select",
  "start",
  "leftStickPress",
  "rightStickPress",
  "dpadUp",
  "dpadDown",
  "dpadLeft",
  "dpadRight",
  "home",
  "leftStickLeft",
  "leftStickRight",
  "leftStickUp",
  "leftStickDown",
  "rightStickLeft",
  "rightStickRight",
  "rightStickUp",
  "rightStickDown",
] as const;

const iconContracts = [
  { Component: AlertTriangleIcon, metadata: alertTriangleIcon },
  { Component: CheckIcon, metadata: checkIcon },
  { Component: ChevronDownIcon, metadata: chevronDownIcon },
  { Component: ChevronLeftIcon, metadata: chevronLeftIcon },
  { Component: ChevronRightIcon, metadata: chevronRightIcon },
  { Component: ChevronUpIcon, metadata: chevronUpIcon },
  { Component: CircleHelpIcon, metadata: circleHelpIcon },
  { Component: DownloadIcon, metadata: downloadIcon },
  { Component: EditIcon, metadata: editIcon },
  { Component: Gamepad2Icon, metadata: gamepad2Icon },
  { Component: MenuIcon, metadata: menuIcon },
  { Component: PlusIcon, metadata: plusIcon },
  { Component: SearchIcon, metadata: searchIcon },
  { Component: SettingsIcon, metadata: settingsIcon },
  { Component: Trash2Icon, metadata: trash2Icon },
  { Component: UploadIcon, metadata: uploadIcon },
  { Component: XIcon, metadata: xIcon },
] as const;

describe("@mk-combos/ui foundation", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual(["mkCombosUi", "uiContractGroups"]);
    expect(contractEntry.mkCombosUi.packageName).toBe("@mk-combos/ui");
    expect(contractEntry.mkCombosUi.groups).toBe(contractEntry.uiContractGroups);
    expect(contractEntry.uiContractGroups.tokens).toEqual({
      schema: "@mk-combos/ui/tokens/schema",
      type: "@mk-combos/ui/tokens/type",
      value: "@mk-combos/ui/tokens/value",
    });
    expect(contractEntry.uiContractGroups.notation).toEqual({
      runtime: "@mk-combos/ui/notation/runtime",
      schema: "@mk-combos/ui/notation/schema",
      type: "@mk-combos/ui/notation/type",
      value: "@mk-combos/ui/notation/value",
    });
    expect(contractEntry.uiContractGroups.styles.css).toBe("@mk-combos/ui/styles.css");
    expect(contractEntry.uiContractGroups.icons.gamepad2).toBe("@mk-combos/ui/icons/gamepad-2");
    expect(contractEntry.mkCombosUi.valueSets.notationDisplayModes).toBe(notationDisplayModes);
  });

  it("keeps token schemas strict and semantic", () => {
    const token = UiSemanticTokenSchema.parse({
      cssVariable: uiSemanticTokens.window,
      name: "window",
    }) satisfies UiSemanticToken;

    expect(token).toEqual({
      cssVariable: "--ui-window",
      name: "window",
    });
    expect(UiThemeModeSchema.safeParse("dark").success).toBe(true);
    expect(UiToneModeSchema.safeParse("purple").success).toBe(false);
    expect(UiSemanticTokenSchema.safeParse({ ...token, rawColor: "#fff" }).success).toBe(false);
    expect(uiSemanticTokenNames).toContain("selection-muted");
    expect(schemaThemeModes).toBe(typeThemeModes);
    expect(schemaContrastModes).toBe(typeContrastModes);
    expect(schemaDensityModes).toBe(typeDensityModes);
    expect(schemaEmphasisModes).toBe(typeEmphasisModes);
    expect(schemaInteractionStates).toBe(typeInteractionStates);
    expect(schemaMaterialModes).toBe(typeMaterialModes);
    expect(schemaPlacementModes).toBe(typePlacementModes);
    expect(schemaSelectionStates).toBe(typeSelectionStates);
    expect(schemaSemanticTokenNames).toBe(typeSemanticTokenNames);
    expect(schemaShapeModes).toBe(typeShapeModes);
    expect(schemaToneModes).toBe(typeToneModes);
    expect(typeSemanticTokens).toBe(uiSemanticTokens);
    expect(acceptsUiTokenTypes()).toBe(true);
  });

  it("maps notation without mutating source notation", () => {
    const notation = [["F", "2"], ["AMP"], ["K"], ["UNKNOWN"]] as const;
    const before = JSON.stringify(notation);

    const mapped = mapNotationSequence(notation, "PlayStation");

    expect(JSON.stringify(notation)).toBe(before);
    expect(mapped[0]?.map((token) => token.displayLabel)).toEqual(["Forward", "Triangle"]);
    expect(mapped[1]?.[0]).toEqual(
      expect.objectContaining({
        iconName: "notation-amplify",
        kind: "modifier",
      }),
    );
    expect(mapped[3]?.[0]).toEqual(
      expect.objectContaining({
        accessibleLabel: "Unknown notation token UNKNOWN",
        iconName: "notation-unknown",
        kind: "state",
      }),
    );
  });

  it("creates strict notation descriptors and legend rows", () => {
    const token = mapNotationToken("1", "Xbox") satisfies UiNotationIconDescriptor;
    const fgcMode = getNotationDisplayModeDescriptor("FGC");
    const step = mapNotationStep(["1", "2"], "FGC");
    const legendRows = createNotationLegendRows(["FGC", "PlayStation", "Xbox"]);

    expect(token).toEqual(
      expect.objectContaining({
        accessibleLabel: "Xbox X",
        displayLabel: "X",
        iconName: "notation-xbox-x",
        kind: "attack",
      }),
    );
    expect(UiNotationTokenSchema.safeParse("K").success).toBe(true);
    expect(uiNotationTokens).toContain("BLK");
    expect(UiNotationIconDescriptorSchema.safeParse({ ...token, rawSvg: "<svg />" }).success).toBe(
      false,
    );
    expect(legendRows).toHaveLength(3);
    expect(UiNotationLegendRowSchema.safeParse(legendRows[0]).success).toBe(true);
    expect(fgcMode.iconName).toBe("notation-display-fgc");
    expect(step.map((descriptor) => descriptor.displayLabel)).toEqual(["1", "2"]);
    expect(notationSchemaDisplayModes).toBe(notationDisplayModes);
    expect(notationTypeDisplayModes).toBe(notationDisplayModes);
    expect(notationValueDisplayModes).toBe(notationDisplayModes);
    expect(typeNotationDisplayModeIconNames.FGC).toBe("notation-display-fgc");
    expect(typeNotationIconKinds).toContain("frameWindow");
    expect(typeNotationIconKinds).toContain("control");
    expect(typeNotationModeTokenIconNames.PlayStation["1"]).toBe("notation-playstation-square");
    expect(typeNotationModeTokenLabels.Xbox["3"]).toBe("A");
    expect(typeNotationTokenKinds.K).toBe("attack");
    expect(typeNotationTokenStates).toContain("stale");
    expect(typeNotationTokens).toBe(uiNotationTokens);
    expect(acceptsNotationTypes()).toBe(true);
  });

  it("covers every standard controller control in notation registry", () => {
    for (const token of notationControllerControlTokens) {
      expect(UiNotationTokenSchema.safeParse(token).success).toBe(true);
      expect(uiNotationTokens).toContain(token);
      expect(typeNotationModeTokenLabels.PlayStation[token].length).toBeGreaterThan(0);
      expect(typeNotationModeTokenLabels.Xbox[token].length).toBeGreaterThan(0);
      expect(typeNotationModeTokenIconNames.PlayStation[token]).toMatch(/^notation-playstation-/);
      expect(typeNotationModeTokenIconNames.Xbox[token]).toMatch(/^notation-xbox-/);
    }

    expect(typeNotationModeTokenLabels.PlayStation.leftTrigger).toBe("L2");
    expect(typeNotationModeTokenLabels.PlayStation.start).toBe("Options");
    expect(typeNotationModeTokenLabels.PlayStation.home).toBe("PS");
    expect(typeNotationModeTokenLabels.Xbox.leftTrigger).toBe("LT");
    expect(typeNotationModeTokenLabels.Xbox.select).toBe("View");
    expect(typeNotationModeTokenLabels.Xbox.home).toBe("Guide");
    expect(typeNotationModeTokenIconNames.PlayStation.rightStickDown).toBe(
      "notation-playstation-right-stick-down",
    );
    expect(typeNotationModeTokenIconNames.Xbox.rightStickDown).toBe(
      "notation-xbox-right-stick-down",
    );
    expect(typeNotationTokenKinds.leftTrigger).toBe("control");
    expect(typeNotationTokenKinds.rightStickDown).toBe("direction");
    expect(mapNotationToken("rightStickDown", "Xbox")).toEqual(
      expect.objectContaining({
        accessibleLabel: "Xbox Right stick down",
        displayLabel: "Right stick down",
        iconName: "notation-xbox-right-stick-down",
        kind: "direction",
      }),
    );
  });

  it("produces recipe classes from semantic axes", () => {
    expect(controlRecipe({ emphasis: "prominent", tone: "accent" })).toContain("var(--ui-accent)");
    expect(fieldRecipe({ state: "invalid" })).toContain("var(--ui-destructive)");
    expect(surfaceRecipe({ material: "glass" })).toContain("backdrop-blur");
    expect(itemRecipe({ selection: "selected" })).toContain("var(--ui-selection)");
    expect(indicatorRecipe({ tone: "warning" })).toContain("var(--ui-warning)");
    expect(popupRecipe({ material: "elevated" })).toContain("var(--ui-shadow)");
    expect(separatorRecipe({ orientation: "vertical" })).toContain("w-px");
    expect(recipeBarrel.controlRecipe).toBe(controlRecipe);
    expect(recipeBarrel.fieldRecipe).toBe(fieldRecipe);
    expect(recipeBarrel.indicatorRecipe).toBe(indicatorRecipe);
    expect(recipeBarrel.itemRecipe).toBe(itemRecipe);
    expect(recipeBarrel.popupRecipe).toBe(popupRecipe);
    expect(recipeBarrel.separatorRecipe).toBe(separatorRecipe);
    expect(recipeBarrel.surfaceRecipe).toBe(surfaceRecipe);
    expect(recipeBarrel.cx("a", false, "b")).toBe("a b");
  });

  it("renders icon facade components with accessible defaults", () => {
    render(
      <div>
        {iconContracts.map(({ Component, metadata }) => (
          <Component key={metadata.name} size={16} />
        ))}
        <ChevronDownIcon aria-label="Open menu" size={16} />
        <Gamepad2Icon aria-label="Decorative controller" decorative size={16} />
      </div>,
    );

    for (const { metadata } of iconContracts) {
      expect(screen.getByRole("img", { name: metadata.accessibleLabel })).toBeTruthy();
    }

    expect(screen.getByRole("img", { name: "Open menu" })).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Decorative controller" })).toBeNull();
  });

  it("renders notation descriptors as platform glyphs", () => {
    const getSvgAttribute = (element: HTMLElement, attribute: string) =>
      element.querySelector("[data-ui-notation-svg]")?.getAttribute(attribute);
    const getSvgColor = (element: HTMLElement) =>
      element
        .querySelector("[data-ui-notation-svg-color]")
        ?.getAttribute("data-ui-notation-svg-color");
    const getSvgBackground = (element: HTMLElement) =>
      element
        .querySelector("[data-ui-notation-svg-background]")
        ?.getAttribute("data-ui-notation-svg-background") ?? null;
    const getSvgActiveDirection = (element: HTMLElement) =>
      element
        .querySelector("[data-ui-notation-svg-active='true']")
        ?.getAttribute("data-ui-notation-svg-direction");
    const getSvgStick = (element: HTMLElement) =>
      element
        .querySelector("[data-ui-notation-svg-stick]")
        ?.getAttribute("data-ui-notation-svg-stick");
    const getBadge = (element: HTMLElement) =>
      element.querySelector("[data-ui-notation-badge]")?.getAttribute("data-ui-notation-badge");

    render(
      <div>
        {(["1", "2", "3", "4"] as const).map((token) => (
          <NotationIcon descriptor={mapNotationToken(token, "PlayStation")} key={`ps-${token}`} />
        ))}
        {(["1", "2", "3", "4"] as const).map((token) => (
          <NotationIcon descriptor={mapNotationToken(token, "Xbox")} key={`xbox-${token}`} />
        ))}
        <NotationIcon descriptor={mapNotationToken("leftTrigger", "PlayStation")} />
        <NotationIcon descriptor={mapNotationToken("dpadUp", "PlayStation")} />
        <NotationIcon descriptor={mapNotationToken("leftStickLeft", "PlayStation")} />
        <NotationIcon descriptor={mapNotationToken("start", "PlayStation")} />
        <NotationIcon descriptor={mapNotationToken("dpadLeft", "Xbox")} />
        <NotationIcon descriptor={mapNotationToken("rightShoulder", "Xbox")} />
        <NotationIcon descriptor={mapNotationToken("rightStickDown", "Xbox")} />
        <NotationIcon descriptor={mapNotationToken("start", "Xbox")} />
        <NotationIcon descriptor={mapNotationToken("UNKNOWN", "Xbox")} />
      </div>,
    );

    const playStationSquare = screen.getByRole("img", { name: "PlayStation Square" });
    const playStationTriangle = screen.getByRole("img", { name: "PlayStation Triangle" });
    const playStationCross = screen.getByRole("img", { name: "PlayStation Cross" });
    const playStationCircle = screen.getByRole("img", { name: "PlayStation Circle" });
    const xboxX = screen.getByRole("img", { name: "Xbox X" });
    const xboxY = screen.getByRole("img", { name: "Xbox Y" });
    const xboxA = screen.getByRole("img", { name: "Xbox A" });
    const xboxB = screen.getByRole("img", { name: "Xbox B" });
    const playStationL2 = screen.getByRole("img", { name: "PlayStation L2" });
    const playStationDpadUp = screen.getByRole("img", { name: "PlayStation D-pad up" });
    const playStationLeftStickLeft = screen.getByRole("img", {
      name: "PlayStation Left stick left",
    });
    const playStationOptions = screen.getByRole("img", { name: "PlayStation Options" });
    const xboxDpadLeft = screen.getByRole("img", { name: "Xbox D-pad left" });
    const xboxRb = screen.getByRole("img", { name: "Xbox RB" });
    const xboxRightStickDown = screen.getByRole("img", { name: "Xbox Right stick down" });
    const xboxMenu = screen.getByRole("img", { name: "Xbox Menu" });
    const unknown = screen.getByRole("img", { name: "Unknown notation token UNKNOWN" });

    expect(playStationSquare.getAttribute("data-ui-notation-platform")).toBe("playstation");
    expect(playStationSquare.getAttribute("data-ui-notation-glyph")).toBe("square");
    expect(playStationTriangle.getAttribute("data-ui-notation-glyph")).toBe("triangle");
    expect(playStationCross.getAttribute("data-ui-notation-glyph")).toBe("cross");
    expect(playStationCircle.getAttribute("data-ui-notation-glyph")).toBe("circle");
    expect(getSvgAttribute(playStationSquare, "data-ui-notation-svg")).toBe("playstation-square");
    expect(getSvgAttribute(playStationTriangle, "data-ui-notation-svg")).toBe(
      "playstation-triangle",
    );
    expect(getSvgAttribute(playStationCross, "data-ui-notation-svg")).toBe("playstation-cross");
    expect(getSvgAttribute(playStationCircle, "data-ui-notation-svg")).toBe("playstation-circle");
    expect(getSvgColor(playStationSquare)).toBe("#ff7ab6");
    expect(getSvgColor(playStationTriangle)).toBe("#00d084");
    expect(getSvgColor(playStationCross)).toBe("#2f8df7");
    expect(getSvgColor(playStationCircle)).toBe("#ff3b46");
    expect(xboxX.getAttribute("data-ui-notation-platform")).toBe("xbox");
    expect(xboxX.getAttribute("data-ui-notation-glyph")).toBe("X");
    expect(getSvgAttribute(xboxX, "data-ui-notation-svg")).toBe("xbox-x");
    expect(getSvgAttribute(xboxY, "data-ui-notation-svg")).toBe("xbox-y");
    expect(getSvgAttribute(xboxA, "data-ui-notation-svg")).toBe("xbox-a");
    expect(getSvgAttribute(xboxB, "data-ui-notation-svg")).toBe("xbox-b");
    expect(getSvgColor(xboxX)).toBe("#1ba9f5");
    expect(getSvgColor(xboxY)).toBe("#f3df31");
    expect(getSvgColor(xboxA)).toBe("#79d14b");
    expect(getSvgColor(xboxB)).toBe("#ff4a4a");
    expect(getSvgBackground(xboxX)).toBeNull();
    expect(getSvgBackground(xboxY)).toBeNull();
    expect(getSvgBackground(xboxA)).toBeNull();
    expect(getSvgBackground(xboxB)).toBeNull();
    expect(playStationL2.getAttribute("data-ui-notation-platform")).toBe("playstation");
    expect(playStationL2.getAttribute("data-ui-notation-icon")).toBe("notation-playstation-l2");
    expect(playStationL2.getAttribute("data-ui-notation-glyph")).toBe("L2");
    expect(getSvgAttribute(playStationL2, "data-ui-notation-svg")).toBeUndefined();
    expect(getBadge(playStationL2)).toBe("L2");
    expect(playStationDpadUp.getAttribute("data-ui-notation-platform")).toBe("playstation");
    expect(playStationDpadUp.getAttribute("data-ui-notation-glyph")).toBe("D-Up");
    expect(getSvgAttribute(playStationDpadUp, "data-ui-notation-svg")).toBe("playstation-dpad-up");
    expect(getSvgActiveDirection(playStationDpadUp)).toBe("up");
    expect(getSvgColor(playStationDpadUp)).toBe("currentColor");
    expect(playStationLeftStickLeft.getAttribute("data-ui-notation-platform")).toBe("playstation");
    expect(playStationLeftStickLeft.getAttribute("data-ui-notation-glyph")).toBe("L-Left");
    expect(getSvgAttribute(playStationLeftStickLeft, "data-ui-notation-svg")).toBe(
      "playstation-left-stick-left",
    );
    expect(getSvgActiveDirection(playStationLeftStickLeft)).toBe("left");
    expect(getSvgStick(playStationLeftStickLeft)).toBe("left");
    expect(playStationOptions.getAttribute("data-ui-notation-platform")).toBe("playstation");
    expect(playStationOptions.getAttribute("data-ui-notation-glyph")).toBe("Options");
    expect(getSvgAttribute(playStationOptions, "data-ui-notation-svg")).toBeUndefined();
    expect(getBadge(playStationOptions)).toBe("Options");
    expect(xboxDpadLeft.getAttribute("data-ui-notation-platform")).toBe("xbox");
    expect(xboxDpadLeft.getAttribute("data-ui-notation-glyph")).toBe("D-Left");
    expect(getSvgAttribute(xboxDpadLeft, "data-ui-notation-svg")).toBe("xbox-dpad-left");
    expect(getSvgActiveDirection(xboxDpadLeft)).toBe("left");
    expect(xboxRb.getAttribute("data-ui-notation-platform")).toBe("xbox");
    expect(xboxRb.getAttribute("data-ui-notation-icon")).toBe("notation-xbox-rb");
    expect(xboxRb.getAttribute("data-ui-notation-glyph")).toBe("RB");
    expect(getSvgAttribute(xboxRb, "data-ui-notation-svg")).toBeUndefined();
    expect(getBadge(xboxRb)).toBe("RB");
    expect(xboxRightStickDown.getAttribute("data-ui-notation-platform")).toBe("xbox");
    expect(xboxRightStickDown.getAttribute("data-ui-notation-glyph")).toBe("R-Down");
    expect(getSvgAttribute(xboxRightStickDown, "data-ui-notation-svg")).toBe(
      "xbox-right-stick-down",
    );
    expect(getSvgActiveDirection(xboxRightStickDown)).toBe("down");
    expect(getSvgStick(xboxRightStickDown)).toBe("right");
    expect(xboxMenu.getAttribute("data-ui-notation-platform")).toBe("xbox");
    expect(xboxMenu.getAttribute("data-ui-notation-glyph")).toBe("Menu");
    expect(getSvgAttribute(xboxMenu, "data-ui-notation-svg")).toBeUndefined();
    expect(getBadge(xboxMenu)).toBe("Menu");
    expect(xboxY.textContent).not.toContain("Y");
    expect(xboxA.textContent).not.toContain("A");
    expect(xboxB.textContent).not.toContain("B");
    expect(unknown.getAttribute("data-ui-notation-icon")).toBe("notation-unknown");
    expect(unknown.getAttribute("data-ui-notation-glyph")).toBe("?");
  });

  it("keeps Base UI mechanics behind an internal wrapper", () => {
    render(<InternalButton>Save</InternalButton>);

    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
    expect(InternalDialogRoot).toBeTruthy();
    expect(InternalDialogTrigger).toBeTruthy();
    expect(InternalDialogPortal).toBeTruthy();
    expect(InternalDialogBackdrop).toBeTruthy();
    expect(InternalDialogPopup).toBeTruthy();
    expect(InternalDialogTitle).toBeTruthy();
    expect(InternalDialogDescription).toBeTruthy();
    expect(InternalDialogClose).toBeTruthy();
  });
});
