import { notationDisplayModes } from "@mk-combos/contracts/settings/type";
import { fireEvent, render, screen } from "@mk-combos/contracts/test/unit/react";
import * as contractEntry from "@mk-combos/ui/contract";
import { getControllerFocusAttributes, moveFocus } from "@mk-combos/ui/focus-navigation/runtime";
import {
  uiFocusDirections as schemaFocusDirections,
  UiFocusNavigationScopeSchema,
} from "@mk-combos/ui/focus-navigation/schema";
import type { UiFocusDirection, UiFocusNeighbors } from "@mk-combos/ui/focus-navigation/type";
import { uiFocusDirections as typeFocusDirections } from "@mk-combos/ui/focus-navigation/type";
import { uiFocusDirections } from "@mk-combos/ui/focus-navigation/value";
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
  uiNotationIconKinds,
  uiNotationTokenStates,
  uiNotationTokens,
} from "@mk-combos/ui/notation/value";
import { Button, type ButtonPressPayload, IconButton } from "@mk-combos/ui/primitives/button";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  type DialogTriggerProps,
  DialogViewport,
  type DialogViewportProps,
} from "@mk-combos/ui/primitives/dialog";
import {
  DisclosurePanel,
  DisclosureRoot,
  DisclosureTrigger,
} from "@mk-combos/ui/primitives/disclosure";
import {
  DrawerBackdrop,
  DrawerClose,
  type DrawerClosePressPayload,
  DrawerContent,
  DrawerDescription,
  DrawerPopup,
  DrawerPortal,
  DrawerRoot,
  type DrawerSwipeDirection,
  DrawerTitle,
  DrawerTrigger,
  type DrawerTriggerProps,
  DrawerViewport,
  drawerSwipeDirections,
} from "@mk-combos/ui/primitives/drawer";
import {
  Field,
  FieldLabel,
  FieldMessage,
  TextInput,
  type TextInputChangePayload,
} from "@mk-combos/ui/primitives/field";
import {
  createFocusTarget,
  findFocusTarget,
  getFocusTargetAttributes,
  getFocusTargetSelector,
  restoreFocusTarget,
  type UiFocusRestoreReason,
  uiFocusRestoreReasons,
} from "@mk-combos/ui/primitives/focus";
import {
  type UiPrimitiveInteractionReason,
  uiPrimitiveInteractionReasons,
} from "@mk-combos/ui/primitives/interaction";
import {
  Grid,
  type GridColumnMode,
  Group,
  gridColumnModes,
  Panel,
  Separator,
  type SeparatorOrientation,
  Stack,
  Surface,
  separatorOrientations,
  type UiAlign,
  type UiJustify,
  UiRoot,
  uiAlignments,
  uiJustifications,
  WorkstationSection,
  type WorkstationSectionProps,
} from "@mk-combos/ui/primitives/layout";
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  type MenuItemSelectPayload,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  type MenuTriggerProps,
} from "@mk-combos/ui/primitives/menu";
import {
  PopoverArrow,
  type PopoverArrowProps,
  PopoverClose,
  type PopoverCloseProps,
  PopoverDescription,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  type PopoverPositionerProps,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  type PopoverTriggerProps,
} from "@mk-combos/ui/primitives/popover";
import {
  type UiFloatingAlignment,
  type UiFloatingSide,
  uiFloatingAlignments,
  uiFloatingSides,
} from "@mk-combos/ui/primitives/positioning";
import {
  SegmentedControl,
  type SegmentedControlOption,
} from "@mk-combos/ui/primitives/segmented-control";
import { Badge, LoadingIndicator, StatusMessage } from "@mk-combos/ui/primitives/state";
import {
  uiContrastModes as schemaContrastModes,
  uiControlPresentationModes as schemaControlPresentationModes,
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
  UiControlPresentationModeSchema,
  UiSemanticTokenSchema,
  UiThemeModeSchema,
  UiToneModeSchema,
} from "@mk-combos/ui/tokens/schema";
import type {
  UiContrastMode,
  UiControlPresentationMode,
  UiDensityMode,
  UiEmphasisMode,
  UiInteractionState,
  UiMaterialMode,
  UiPlacementMode,
  UiSelectionState,
  UiSemanticToken,
  UiSemanticTokenName,
  UiShapeMode,
  UiThemeMode,
  UiToneMode,
} from "@mk-combos/ui/tokens/type";
import {
  uiContrastModes as typeContrastModes,
  uiControlPresentationModes as typeControlPresentationModes,
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
import {
  uiContrastModes,
  uiControlPresentationModes,
  uiDensityModes,
  uiEmphasisModes,
  uiInteractionStates,
  uiMaterialModes,
  uiPlacementModes,
  uiSelectionStates,
  uiSemanticTokenNames,
  uiSemanticTokens,
  uiShapeModes,
  uiThemeModes,
  uiToneModes,
} from "@mk-combos/ui/tokens/value";
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
import { mapBaseUiReason } from "./primitives/internal";
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
    controlPresentation: UiControlPresentationMode;
    density: UiDensityMode;
    emphasis: UiEmphasisMode;
    interaction: UiInteractionState;
    material: UiMaterialMode;
    placement: UiPlacementMode;
    selection: UiSelectionState;
    tokenName: UiSemanticTokenName;
    shape: UiShapeMode;
    theme: UiThemeMode;
    tone: UiToneMode;
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

const acceptsPrimitiveTypes = <
  _Primitive extends {
    buttonPayload: ButtonPressPayload;
    drawerDirection: DrawerSwipeDirection;
    drawerClosePayload: DrawerClosePressPayload;
    drawerTriggerProps: DrawerTriggerProps;
    dialogTriggerProps: DialogTriggerProps;
    dialogViewportProps: DialogViewportProps;
    inputPayload: TextInputChangePayload;
    menuItemPayload: MenuItemSelectPayload<"edit">;
    menuTriggerProps: MenuTriggerProps;
    popoverCloseProps: PopoverCloseProps;
    popoverArrowProps: PopoverArrowProps;
    popoverPositionerProps: PopoverPositionerProps;
    popoverTriggerProps: PopoverTriggerProps;
    segmentOption: SegmentedControlOption<"EN" | "UA">;
    workstationSection: WorkstationSectionProps;
    focusNeighbors: UiFocusNeighbors;
    focusRestoreReason: UiFocusRestoreReason;
    floatingAlignment: UiFloatingAlignment;
    floatingSide: UiFloatingSide;
    gridColumns: GridColumnMode;
    interactionReason: UiPrimitiveInteractionReason;
    layoutAlign: UiAlign;
    layoutJustify: UiJustify;
    separatorOrientation: SeparatorOrientation;
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
    expect(contractEntry.uiContractGroups.focusNavigation).toEqual({
      runtime: "@mk-combos/ui/focus-navigation/runtime",
      schema: "@mk-combos/ui/focus-navigation/schema",
      type: "@mk-combos/ui/focus-navigation/type",
      value: "@mk-combos/ui/focus-navigation/value",
    });
    expect(contractEntry.uiContractGroups.hooks).toEqual({
      fieldMessage: "@mk-combos/ui/hooks/field-message",
      focusNavigation: "@mk-combos/ui/hooks/focus-navigation",
      intents: "@mk-combos/ui/hooks/intents",
      openState: "@mk-combos/ui/hooks/open-state",
      responsiveMode: "@mk-combos/ui/hooks/responsive-mode",
    });
    expect(contractEntry.uiContractGroups.components.controllerAccessGate).toBe(
      "@mk-combos/ui/components/controller-access-gate",
    );
    expect(contractEntry.uiContractGroups.primitives).toEqual({
      button: "@mk-combos/ui/primitives/button",
      dialog: "@mk-combos/ui/primitives/dialog",
      drawer: "@mk-combos/ui/primitives/drawer",
      disclosure: "@mk-combos/ui/primitives/disclosure",
      field: "@mk-combos/ui/primitives/field",
      focus: "@mk-combos/ui/primitives/focus",
      interaction: "@mk-combos/ui/primitives/interaction",
      layout: "@mk-combos/ui/primitives/layout",
      menu: "@mk-combos/ui/primitives/menu",
      popover: "@mk-combos/ui/primitives/popover",
      positioning: "@mk-combos/ui/primitives/positioning",
      segmentedControl: "@mk-combos/ui/primitives/segmented-control",
      state: "@mk-combos/ui/primitives/state",
    });
    expect(contractEntry.uiContractGroups.styles.css).toBe("@mk-combos/ui/styles.css");
    expect(contractEntry.uiContractGroups.icons.gamepad2).toBe("@mk-combos/ui/icons/gamepad-2");
    expect(contractEntry.mkCombosUi.valueSets.notationDisplayModes).toBe(notationDisplayModes);
    expect(contractEntry.mkCombosUi.valueSets.uiFocusDirections).toBe(uiFocusDirections);
    expect(schemaFocusDirections).toBe(uiFocusDirections);
    expect(typeFocusDirections).toBe(uiFocusDirections);
  });

  it("keeps focus navigation strict and deterministic", () => {
    const direction: UiFocusDirection = "right";
    const scope = UiFocusNavigationScopeSchema.parse({
      availableCommandIds: ["navRight"],
      entryTargetId: "a",
      fallbackTargetId: "a",
      id: "test",
      targets: [
        { id: "a", neighbors: { right: "b" } },
        { id: "b", neighbors: { left: "a" } },
      ],
    });

    expect(moveFocus(scope, "a", direction)).toBe("b");
    expect(getControllerFocusAttributes({ focused: true, targetId: "b" })).toEqual({
      "data-controller-focused": "true",
      "data-ui-focus-target": "b",
    });
    expect(
      UiFocusNavigationScopeSchema.safeParse({ ...scope, nativeKeyboardEvent: {} }).success,
    ).toBe(false);
  });

  it("publishes exact closed foundation dictionaries", () => {
    expect(uiThemeModes).toEqual({ dark: "dark", light: "light" });
    expect(uiContrastModes).toEqual({ increased: "increased", standard: "standard" });
    expect(uiSemanticTokenNames).toEqual({
      accent: "accent",
      "accent-strong": "accent-strong",
      "accent-text": "accent-text",
      content: "content",
      control: "control",
      "control-active": "control-active",
      "control-border": "control-border",
      "control-hover": "control-hover",
      destructive: "destructive",
      "destructive-border": "destructive-border",
      "destructive-soft": "destructive-soft",
      dialog: "dialog",
      field: "field",
      glass: "glass",
      highlight: "highlight",
      inspector: "inspector",
      menu: "menu",
      "muted-text": "muted-text",
      placeholder: "placeholder",
      popover: "popover",
      selection: "selection",
      "selection-muted": "selection-muted",
      "selection-text": "selection-text",
      separator: "separator",
      shadow: "shadow",
      sidebar: "sidebar",
      success: "success",
      "success-border": "success-border",
      "success-soft": "success-soft",
      text: "text",
      toolbar: "toolbar",
      warning: "warning",
      "warning-border": "warning-border",
      "warning-soft": "warning-soft",
      window: "window",
    });
    expect(uiDensityModes).toEqual({ medium: "medium", mini: "mini", small: "small" });
    expect(uiShapeModes).toEqual({ capsule: "capsule", concentric: "concentric", fixed: "fixed" });
    expect(uiMaterialModes).toEqual({
      elevated: "elevated",
      glass: "glass",
      none: "none",
      opaque: "opaque",
      separated: "separated",
    });
    expect(uiToneModes).toEqual({
      accent: "accent",
      destructive: "destructive",
      neutral: "neutral",
      success: "success",
      warning: "warning",
    });
    expect(uiEmphasisModes).toEqual({
      normal: "normal",
      prominent: "prominent",
      subtle: "subtle",
    });
    expect(uiControlPresentationModes).toEqual({ filled: "filled", icon: "icon" });
    expect(uiInteractionStates).toEqual({
      active: "active",
      disabled: "disabled",
      focusVisible: "focusVisible",
      hover: "hover",
      idle: "idle",
      invalid: "invalid",
      loading: "loading",
      open: "open",
      selected: "selected",
    });
    expect(uiSelectionStates).toEqual({
      current: "current",
      mixed: "mixed",
      none: "none",
      selected: "selected",
    });
    expect(uiPlacementModes).toEqual({
      block: "block",
      floating: "floating",
      inline: "inline",
      sidebar: "sidebar",
      toolbar: "toolbar",
    });
    expect(uiFocusDirections).toEqual({ down: "down", left: "left", right: "right", up: "up" });
    expect(uiNotationIconKinds).toEqual({
      attack: "attack",
      control: "control",
      direction: "direction",
      displayMode: "displayMode",
      frameWindow: "frameWindow",
      modifier: "modifier",
      separator: "separator",
      state: "state",
    });
    expect(uiNotationTokenStates).toEqual({
      disabled: "disabled",
      focused: "focused",
      highlighted: "highlighted",
      invalid: "invalid",
      ready: "ready",
      stale: "stale",
      unavailable: "unavailable",
    });
    expect(uiNotationTokens).toEqual({
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      AMP: "AMP",
      B: "B",
      BLK: "BLK",
      D: "D",
      F: "F",
      INT: "INT",
      K: "K",
      SS: "SS",
      U: "U",
      dpadDown: "dpadDown",
      dpadLeft: "dpadLeft",
      dpadRight: "dpadRight",
      dpadUp: "dpadUp",
      faceEast: "faceEast",
      faceNorth: "faceNorth",
      faceSouth: "faceSouth",
      faceWest: "faceWest",
      home: "home",
      leftShoulder: "leftShoulder",
      leftStickDown: "leftStickDown",
      leftStickLeft: "leftStickLeft",
      leftStickPress: "leftStickPress",
      leftStickRight: "leftStickRight",
      leftStickUp: "leftStickUp",
      leftTrigger: "leftTrigger",
      rightShoulder: "rightShoulder",
      rightStickDown: "rightStickDown",
      rightStickLeft: "rightStickLeft",
      rightStickPress: "rightStickPress",
      rightStickRight: "rightStickRight",
      rightStickUp: "rightStickUp",
      rightTrigger: "rightTrigger",
      select: "select",
      start: "start",
    });
    expect(uiPrimitiveInteractionReasons).toEqual({
      closePress: "closePress",
      closeWatcher: "closeWatcher",
      escapeKey: "escapeKey",
      focusOut: "focusOut",
      imperativeAction: "imperativeAction",
      itemPress: "itemPress",
      listNavigation: "listNavigation",
      none: "none",
      outsidePress: "outsidePress",
      swipe: "swipe",
      triggerFocus: "triggerFocus",
      triggerHover: "triggerHover",
      triggerPress: "triggerPress",
    });
    expect(uiFloatingSides).toEqual({ bottom: "bottom", left: "left", right: "right", top: "top" });
    expect(uiFloatingAlignments).toEqual({ center: "center", end: "end", start: "start" });
    expect(drawerSwipeDirections).toEqual({ down: "down", left: "left", right: "right", up: "up" });
    expect(uiFocusRestoreReasons).toEqual({
      documentUnavailable: "documentUnavailable",
      restored: "restored",
      targetDisabled: "targetDisabled",
      targetMissing: "targetMissing",
    });
    expect(uiAlignments).toEqual({
      center: "center",
      end: "end",
      start: "start",
      stretch: "stretch",
    });
    expect(uiJustifications).toEqual({
      between: "between",
      center: "center",
      end: "end",
      start: "start",
    });
    expect(gridColumnModes).toEqual({ auto: "auto", one: "one", three: "three", two: "two" });
    expect(separatorOrientations).toEqual({ horizontal: "horizontal", vertical: "vertical" });

    expect(contractEntry.mkCombosUi.valueSets.uiThemeModes).toBe(uiThemeModes);
    expect(contractEntry.mkCombosUi.valueSets.uiNotationTokens).toBe(uiNotationTokens);
    expect(contractEntry.mkCombosUi.valueSets.uiPrimitiveInteractionReasons).toBe(
      uiPrimitiveInteractionReasons,
    );
    expect(contractEntry.mkCombosUi.valueSets.uiFloatingSides).toBe(uiFloatingSides);
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
    expect(UiControlPresentationModeSchema.safeParse("icon").success).toBe(true);
    expect(UiToneModeSchema.safeParse("purple").success).toBe(false);
    expect(UiSemanticTokenSchema.safeParse({ ...token, rawColor: "#fff" }).success).toBe(false);
    expect(Object.values(uiSemanticTokenNames)).toContain("selection-muted");
    expect(schemaThemeModes).toBe(typeThemeModes);
    expect(schemaContrastModes).toBe(typeContrastModes);
    expect(schemaControlPresentationModes).toBe(typeControlPresentationModes);
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
    expect(uiControlPresentationModes).toEqual({ filled: "filled", icon: "icon" });
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
    expect(Object.values(uiNotationTokens)).toContain("BLK");
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
    expect(Object.values(typeNotationIconKinds)).toContain("frameWindow");
    expect(Object.values(typeNotationIconKinds)).toContain("control");
    expect(typeNotationModeTokenIconNames.PlayStation["1"]).toBe("notation-playstation-square");
    expect(typeNotationModeTokenLabels.Xbox["3"]).toBe("A");
    expect(typeNotationTokenKinds.K).toBe("attack");
    expect(Object.values(typeNotationTokenStates)).toContain("stale");
    expect(typeNotationTokens).toBe(uiNotationTokens);
    expect(acceptsNotationTypes()).toBe(true);
  });

  it("covers every standard controller control in notation registry", () => {
    for (const token of notationControllerControlTokens) {
      expect(UiNotationTokenSchema.safeParse(token).success).toBe(true);
      expect(Object.values(uiNotationTokens)).toContain(token);
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
    const filledControlClasses = controlRecipe();
    const iconControlClasses = controlRecipe({ appearance: "icon" });
    const prominentAccentClasses = controlRecipe({ emphasis: "prominent", tone: "accent" });
    const selectedControlClasses = controlRecipe({ state: "selected" });
    const disabledControlClasses = controlRecipe({ state: "disabled" });
    const loadingControlClasses = controlRecipe({ state: "loading" });
    const editableFieldClasses = fieldRecipe();
    const invalidFieldClasses = fieldRecipe({ state: "invalid" });
    const readOnlyFieldClasses = fieldRecipe({ editable: false });
    const disabledFieldClasses = fieldRecipe({ state: "disabled" });
    const loadingFieldClasses = fieldRecipe({ state: "loading" });
    const interactiveItemClasses = itemRecipe({ interactive: true });
    const selectedItemClasses = itemRecipe({ interactive: true, selection: "selected" });
    const disabledItemClasses = itemRecipe({ interactive: true, state: "disabled" });
    const loadingItemClasses = itemRecipe({ interactive: true, state: "loading" });
    const staticItemClasses = itemRecipe();

    expect(filledControlClasses).toContain("cursor-pointer");
    expect(filledControlClasses).toContain("font-medium");
    expect(filledControlClasses).not.toContain("uppercase");
    expect(filledControlClasses).toContain("enabled:hover:bg-[var(--ui-control-hover)]");
    expect(prominentAccentClasses).toContain("var(--ui-accent)");
    expect(prominentAccentClasses).toContain("enabled:hover:bg-[color-mix");
    expect(selectedControlClasses).toContain("var(--ui-selection-muted)");
    expect(selectedControlClasses).toContain("enabled:hover:bg-[color-mix");
    expect(iconControlClasses).toContain("border-transparent");
    expect(iconControlClasses).toContain("bg-transparent");
    expect(iconControlClasses).toContain("cursor-pointer");
    expect(iconControlClasses).toContain("shadow-none");
    expect(iconControlClasses).toContain("enabled:hover:border-transparent");
    expect(iconControlClasses).toContain("enabled:hover:bg-transparent");
    expect(iconControlClasses).toContain("enabled:hover:text-[var(--ui-accent-strong)]");
    expect(disabledControlClasses).toContain("cursor-not-allowed");
    expect(disabledControlClasses).not.toContain("pointer-events-none");
    expect(loadingControlClasses).toContain("cursor-wait");
    expect(editableFieldClasses).toContain("cursor-text");
    expect(editableFieldClasses).toContain("enabled:hover:border-[var(--ui-accent)]");
    expect(invalidFieldClasses).toContain("var(--ui-destructive)");
    expect(invalidFieldClasses).toContain("enabled:hover:border-[color-mix");
    expect(readOnlyFieldClasses).toContain("cursor-text");
    expect(readOnlyFieldClasses).not.toContain("hover:");
    expect(disabledFieldClasses).toContain("cursor-not-allowed");
    expect(disabledFieldClasses).not.toContain("pointer-events-none");
    expect(loadingFieldClasses).toContain("cursor-wait");
    expect(surfaceRecipe({ material: "glass" })).toContain("backdrop-blur");
    expect(interactiveItemClasses).toContain("[&:not([data-disabled=true])]:cursor-pointer");
    expect(interactiveItemClasses).toContain(
      "[&:not([data-disabled=true])]:hover:bg-[var(--ui-control-hover)]",
    );
    expect(selectedItemClasses).toContain("var(--ui-selection)");
    expect(selectedItemClasses).toContain("[&:not([data-disabled=true])]:hover:bg-[color-mix");
    expect(disabledItemClasses).toContain("cursor-not-allowed");
    expect(disabledItemClasses).not.toContain("pointer-events-none");
    expect(loadingItemClasses).toContain("cursor-wait");
    expect(staticItemClasses).not.toContain("cursor-pointer");
    expect(staticItemClasses).not.toContain("hover:");
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

  it("renders public base primitives with semantic callbacks and stable states", () => {
    const buttonPayloads: Array<{ reason: "press"; sourceFocusTarget?: string }> = [];
    const inputPayloads: Array<{ reason: "inputChange"; value: string }> = [];
    const segmentPayloads: Array<{ reason: string; value: "EN" | "UA" }> = [];

    render(
      <UiRoot contrast="increased" theme="dark">
        <Stack density="medium">
          <WorkstationSection description="Prepared module" title="Combat workstation">
            <p>Section content</p>
          </WorkstationSection>
          <Surface material="separated">
            <Panel density="medium">
              <Grid columns="two">
                <Group>
                  <Button
                    onRequestPress={(payload) => buttonPayloads.push(payload)}
                    sourceFocusTarget="save-action"
                    tone="accent"
                  >
                    Save
                  </Button>
                  <Button disabled loading>
                    Saving
                  </Button>
                  <IconButton label="Open actions">
                    <MenuIcon decorative size={14} />
                  </IconButton>
                </Group>
                <Group>
                  <Badge tone="success">Ready</Badge>
                  <LoadingIndicator label="Loading data" />
                  <StatusMessage tone="warning">Needs review</StatusMessage>
                </Group>
              </Grid>
              <Separator aria-label="Primitive split" />
              <Field>
                <FieldLabel htmlFor="query">Query</FieldLabel>
                <TextInput
                  id="query"
                  onValueChange={(payload) => inputPayloads.push(payload)}
                  placeholder="Search"
                  value=""
                />
                <FieldMessage invalid>Required field</FieldMessage>
              </Field>
              <TextInput aria-label="Read only query" readOnly value="Locked" />
              <SegmentedControl
                aria-label="Language"
                onValueChange={(payload) => segmentPayloads.push(payload)}
                options={[
                  { label: "English", value: "EN" },
                  { label: "Ukrainian", value: "UA" },
                ]}
                value="UA"
              />
            </Panel>
          </Surface>
        </Stack>
      </UiRoot>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Query" }), {
      target: { value: "Scorpion" },
    });
    fireEvent.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("button", { name: "Saving" }).getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("button", { name: "Saving" }).getAttribute("data-loading")).toBe(
      "true",
    );
    expect(screen.getByRole("button", { name: "Save" }).className).toContain("cursor-pointer");
    expect(screen.getByRole("button", { name: "Save" }).className).toContain("enabled:hover:bg");
    expect(screen.getByRole("button", { name: "Saving" }).className).toContain("cursor-wait");
    expect(screen.getByRole("button", { name: "Saving" }).className).not.toContain(
      "pointer-events-none",
    );
    expect(screen.getByRole("button", { name: "Saving" })).toHaveProperty("disabled", true);
    expect(screen.getByRole("button", { name: "Open actions" }).className).toContain(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: "Open actions" }).className).toContain(
      "enabled:hover:bg-transparent",
    );
    expect(screen.getByRole("textbox", { name: "Query" }).className).toContain("cursor-text");
    expect(screen.getByRole("textbox", { name: "Query" }).className).toContain(
      "enabled:hover:border-[var(--ui-accent)]",
    );
    expect(screen.getByRole("textbox", { name: "Read only query" }).className).toContain(
      "cursor-text",
    );
    expect(screen.getByRole("textbox", { name: "Read only query" }).className).not.toContain(
      "hover:",
    );
    expect(screen.getByRole("button", { name: "English" }).className).toContain("cursor-pointer");
    expect(screen.getByRole("button", { name: "English" }).className).toContain("enabled:hover:bg");
    expect(screen.getByRole("button", { name: "Ukrainian" }).className).toContain(
      "enabled:hover:bg-[color-mix",
    );
    expect(screen.getAllByRole("status")[0]?.textContent).toBe("Loading data");
    expect(screen.getByRole("alert").textContent).toBe("Required field");
    expect(screen.getByRole("separator", { name: "Primitive split" })).toBeTruthy();
    expect(buttonPayloads[0]).toEqual({
      reason: "press",
      sourceFocusTarget: "save-action",
    });
    expect(inputPayloads[0]).toEqual({
      reason: "inputChange",
      value: "Scorpion",
    });
    expect(segmentPayloads[0]).toEqual({
      reason: "none",
      value: "EN",
    });
    expect(buttonPayloads[0]).not.toHaveProperty("event");
    expect(inputPayloads[0]).not.toHaveProperty("event");
    expect(segmentPayloads[0]).not.toHaveProperty("event");
    expect(acceptsPrimitiveTypes()).toBe(true);
  });

  it("keeps disabled controls and items inert while exposing semantic cursors", () => {
    const buttonPayloads: ButtonPressPayload[] = [];
    const menuPayloads: MenuItemSelectPayload<"disabled-item">[] = [];
    const segmentPayloads: Array<{ reason: string; value: "EN" | "UA" }> = [];

    render(
      <div>
        <Button disabled onRequestPress={(payload) => buttonPayloads.push(payload)}>
          Disabled action
        </Button>
        <TextInput aria-label="Disabled query" disabled value="Locked" />
        <SegmentedControl
          aria-label="Disabled option selector"
          onValueChange={(payload) => segmentPayloads.push(payload)}
          options={[
            { label: "English", value: "EN" },
            { disabled: true, label: "Ukrainian", value: "UA" },
          ]}
          value="EN"
        />
        <MenuRoot open>
          <MenuTrigger>Disabled item menu</MenuTrigger>
          <MenuPortal>
            <MenuPositioner>
              <MenuPopup>
                <MenuItem
                  disabled
                  onRequestSelect={(payload) => menuPayloads.push(payload)}
                  value="disabled-item"
                >
                  Disabled menu item
                </MenuItem>
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </MenuRoot>
      </div>,
    );

    const disabledButton = screen.getByRole("button", { name: "Disabled action" });
    const disabledField = screen.getByRole("textbox", { name: "Disabled query" });
    const disabledSegment = screen.getByRole("button", { name: "Ukrainian" });
    const disabledItem = screen.getByRole("menuitem", { name: "Disabled menu item" });

    for (const element of [disabledButton, disabledField, disabledSegment, disabledItem]) {
      expect(element.className).toContain("cursor-not-allowed");
      expect(element.className).not.toContain("pointer-events-none");
    }
    expect(disabledButton).toHaveProperty("disabled", true);
    expect(disabledField).toHaveProperty("disabled", true);
    expect(disabledSegment).toHaveProperty("disabled", true);
    expect(disabledItem.getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(disabledButton);
    fireEvent.change(disabledField, { target: { value: "Changed" } });
    fireEvent.click(disabledSegment);
    fireEvent.click(disabledItem);

    expect(buttonPayloads).toEqual([]);
    expect(menuPayloads).toEqual([]);
    expect(segmentPayloads).toEqual([]);
  });

  it("wraps Base UI disclosure, popover, and menu mechanics behind semantic surfaces", () => {
    const disclosurePayloads: Array<{ open: boolean; reason: string; sourceFocusTarget?: string }> =
      [];
    const menuPayloads: Array<{ reason: "itemPress"; value: "edit" }> = [];

    render(
      <UiRoot contrast="increased" responsiveMode="tablet" theme="light">
        <DialogRoot modal={false}>
          <DialogTrigger>Open lightweight dialog</DialogTrigger>
        </DialogRoot>

        <DisclosureRoot
          onOpenChange={(payload) => disclosurePayloads.push(payload)}
          open={false}
          sourceFocusTarget="backup-trigger"
        >
          <DisclosureTrigger>Backup details</DisclosureTrigger>
          <DisclosurePanel>Collapsed backup content</DisclosurePanel>
        </DisclosureRoot>

        <PopoverRoot open>
          <PopoverTrigger>Open popover</PopoverTrigger>
          <PopoverPortal>
            <PopoverPositioner>
              <PopoverArrow />
              <PopoverPopup>
                <PopoverTitle>Controller hints</PopoverTitle>
                <PopoverDescription>Hints stay in an anchored surface.</PopoverDescription>
                <PopoverClose>Close popover</PopoverClose>
              </PopoverPopup>
            </PopoverPositioner>
          </PopoverPortal>
        </PopoverRoot>

        <MenuRoot open>
          <MenuTrigger>Open actions menu</MenuTrigger>
          <MenuPortal>
            <MenuPositioner>
              <MenuPopup>
                <MenuGroup>
                  <MenuGroupLabel>Actions</MenuGroupLabel>
                  <MenuItem onRequestSelect={(payload) => menuPayloads.push(payload)} value="edit">
                    Edit
                  </MenuItem>
                </MenuGroup>
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </MenuRoot>
      </UiRoot>,
    );

    const trigger = screen.getByRole("button", { name: "Backup details" });

    expect(screen.getByRole("button", { name: "Open lightweight dialog" }).className).toContain(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: "Open popover" }).className).toContain(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: "Close popover" }).className).toContain(
      "cursor-pointer",
    );
    expect(document.querySelector("[data-ui-popover-arrow]")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Open actions menu" }).className).toContain(
      "cursor-pointer",
    );
    expect(screen.getByRole("menuitem", { name: "Edit" }).className).toContain("cursor-pointer");
    for (const portalKind of ["menu", "popover"]) {
      const portal = document.querySelector(`[data-ui-portal="${portalKind}"]`);
      expect(portal?.className).toContain("mk-combos-ui-portal-root");
      expect(portal?.getAttribute("data-ui-contrast")).toBe("increased");
      expect(portal?.getAttribute("data-ui-responsive")).toBe("tablet");
      expect(portal?.getAttribute("data-ui-theme")).toBe("light");
    }
    expect(trigger.className).toContain("cursor-pointer");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("Collapsed backup content")).toBeNull();
    expect(screen.getByText("Controller hints")).toBeTruthy();

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(disclosurePayloads[0]).toEqual({
      open: true,
      reason: "triggerPress",
      sourceFocusTarget: "backup-trigger",
    });
    expect(menuPayloads[0]).toEqual({
      reason: "itemPress",
      value: "edit",
    });
    expect(disclosurePayloads[0]).not.toHaveProperty("event");
    expect(menuPayloads[0]).not.toHaveProperty("event");
  });

  it("renders modal dialog primitives with accessible title and close control", () => {
    const renderDialog = (
      responsiveMode: "desktop" | "mobile" | "tablet",
      contrast: "increased" | "standard",
      theme: "dark" | "light",
    ) => (
      <UiRoot contrast={contrast} responsiveMode={responsiveMode} theme={theme}>
        <DialogRoot open>
          <DialogPortal className={() => "dialog-portal-custom"}>
            <DialogBackdrop />
            <DialogViewport>
              <DialogPopup>
                <DialogTitle>Confirm import</DialogTitle>
                <DialogDescription>Review backup before replacing local data.</DialogDescription>
                <DialogClose>Close dialog</DialogClose>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>
      </UiRoot>
    );
    const view = render(renderDialog("tablet", "standard", "light"));

    expect(screen.getByRole("dialog", { name: "Confirm import" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close dialog" }).className).toContain(
      "cursor-pointer",
    );
    const portal = document.querySelector('[data-ui-portal="dialog"]');
    const backdrop = document.querySelector<HTMLElement>("[data-ui-dialog-backdrop]");
    const popup = document.querySelector<HTMLElement>("[data-ui-dialog-popup]");
    const viewport = document.querySelector<HTMLElement>("[data-ui-dialog-viewport]");
    expect(portal?.className).toContain("dialog-portal-custom");
    expect(portal?.className).toContain("mk-combos-ui-portal-root");
    expect(portal?.getAttribute("data-ui-contrast")).toBe("standard");
    expect(portal?.getAttribute("data-ui-responsive")).toBe("tablet");
    expect(portal?.getAttribute("data-ui-theme")).toBe("light");
    expect(backdrop?.className).toContain("z-40");
    expect(viewport?.className).toContain("z-50");
    expect(backdrop?.parentElement).toBe(portal);
    expect(viewport?.parentElement).toBe(portal);
    expect(viewport?.className).toContain("items-end");
    expect(viewport?.className).toContain("justify-items-center");
    expect(popup?.className).toContain("max-w-[42rem]");
    expect(popup?.className).not.toContain("fixed");
    expect(popup?.parentElement).toBe(viewport);

    view.rerender(renderDialog("mobile", "standard", "dark"));
    expect(document.querySelector('[data-ui-portal="dialog"]')?.getAttribute("data-ui-theme")).toBe(
      "dark",
    );
    expect(document.querySelector("[data-ui-dialog-viewport]")?.className).toContain(
      "justify-items-stretch",
    );
    expect(document.querySelector("[data-ui-dialog-popup]")?.className).not.toContain(
      "max-w-[42rem]",
    );

    view.rerender(renderDialog("desktop", "increased", "dark"));
    expect(
      document.querySelector('[data-ui-portal="dialog"]')?.getAttribute("data-ui-contrast"),
    ).toBe("increased");
    expect(document.querySelector("[data-ui-dialog-viewport]")?.className).toContain(
      "place-items-center",
    );
    expect(document.querySelector("[data-ui-dialog-popup]")?.className).toContain(
      "w-[min(34rem,calc(100vw-2rem))]",
    );
    expect(document.querySelector("[data-ui-dialog-popup]")?.className).toContain("max-h-[88dvh]");
  });

  it("wraps a controlled drawer with semantic close payloads", () => {
    const openPayloads: Array<{ open: boolean; reason: string; sourceFocusTarget?: string }> = [];

    render(
      <UiRoot contrast="increased" responsiveMode="mobile" theme="light">
        <DrawerRoot
          onOpenChange={(payload) => openPayloads.push(payload)}
          open
          sourceFocusTarget="navigation-trigger"
          swipeDirection="right"
        >
          <DrawerTrigger>Open navigation</DrawerTrigger>
          <DrawerPortal>
            <DrawerBackdrop />
            <DrawerViewport>
              <DrawerPopup>
                <DrawerContent>
                  <DrawerTitle>Navigation</DrawerTitle>
                  <DrawerDescription>Responsive destinations</DrawerDescription>
                  <DrawerClose>Close navigation</DrawerClose>
                </DrawerContent>
              </DrawerPopup>
            </DrawerViewport>
          </DrawerPortal>
        </DrawerRoot>
      </UiRoot>,
    );

    expect(screen.getByRole("dialog", { name: "Navigation" })).toBeTruthy();
    const drawerTrigger = document.querySelector<HTMLButtonElement>("[data-ui-drawer-trigger]");
    const closeButton = screen.getByRole("button", { name: "Close navigation" });

    expect(drawerTrigger?.className).toContain("cursor-pointer");
    expect(closeButton.className).toContain("cursor-pointer");
    const drawerPortal = document.querySelector('[data-ui-portal="drawer"]');
    expect(drawerPortal?.getAttribute("data-ui-contrast")).toBe("increased");
    expect(drawerPortal?.getAttribute("data-ui-responsive")).toBe("mobile");
    expect(drawerPortal?.getAttribute("data-ui-theme")).toBe("light");
    fireEvent.click(closeButton);
    expect(openPayloads[0]).toEqual({
      open: false,
      reason: "closePress",
      sourceFocusTarget: "navigation-trigger",
    });
    expect(openPayloads[0]).not.toHaveProperty("event");
    expect(mapBaseUiReason("swipe")).toBe("swipe");
    expect(mapBaseUiReason("close-watcher")).toBe("closeWatcher");
  });

  it("restores focus through UI-owned focus target helpers", () => {
    const target = createFocusTarget("return-action");

    render(
      <button {...getFocusTargetAttributes(target)} type="button">
        Return action
      </button>,
    );

    const element = screen.getByRole("button", { name: "Return action" });
    const result = restoreFocusTarget(target);

    expect(getFocusTargetSelector(target)).toBe('[data-ui-focus-target="return-action"]');
    expect(findFocusTarget(target)).toBe(element);
    expect(result).toEqual({
      reason: "restored",
      restored: true,
      targetId: "return-action",
    });
    expect(document.activeElement).toBe(element);
    expect(restoreFocusTarget("missing-action")).toEqual({
      reason: "targetMissing",
      restored: false,
      targetId: "missing-action",
    });
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

  it("normalizes semantic icon sizes to bounded SVG dimensions", () => {
    const { container } = render(
      <div>
        <ChevronDownIcon data-testid="semantic-icon" size="small" />
        <MenuIcon data-testid="numeric-icon" size={14} />
      </div>,
    );

    const semanticIcon = container.querySelector('[data-testid="semantic-icon"]');
    const numericIcon = container.querySelector('[data-testid="numeric-icon"]');

    expect(semanticIcon?.getAttribute("width")).toBe("16");
    expect(semanticIcon?.getAttribute("height")).toBe("16");
    expect(numericIcon?.getAttribute("width")).toBe("14");
    expect(numericIcon?.getAttribute("height")).toBe("14");
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
