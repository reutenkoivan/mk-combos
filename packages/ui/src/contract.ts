import { notationDisplayModes } from "@mk-combos/contracts/settings/type";

import { uiNotationIconKinds, uiNotationTokenStates, uiNotationTokens } from "./notation/value";
import {
  uiContrastModes,
  uiDensityModes,
  uiEmphasisModes,
  uiInteractionStates,
  uiMaterialModes,
  uiPlacementModes,
  uiSelectionStates,
  uiSemanticTokenNames,
  uiShapeModes,
  uiThemeModes,
  uiToneModes,
} from "./tokens/value";

export const uiContractGroups = {
  icons: {
    alertTriangle: "@mk-combos/ui/icons/alert-triangle",
    check: "@mk-combos/ui/icons/check",
    chevronDown: "@mk-combos/ui/icons/chevron-down",
    chevronLeft: "@mk-combos/ui/icons/chevron-left",
    chevronRight: "@mk-combos/ui/icons/chevron-right",
    chevronUp: "@mk-combos/ui/icons/chevron-up",
    circleHelp: "@mk-combos/ui/icons/circle-help",
    download: "@mk-combos/ui/icons/download",
    edit: "@mk-combos/ui/icons/edit",
    gamepad2: "@mk-combos/ui/icons/gamepad-2",
    menu: "@mk-combos/ui/icons/menu",
    plus: "@mk-combos/ui/icons/plus",
    search: "@mk-combos/ui/icons/search",
    settings: "@mk-combos/ui/icons/settings",
    trash2: "@mk-combos/ui/icons/trash-2",
    upload: "@mk-combos/ui/icons/upload",
    x: "@mk-combos/ui/icons/x",
  },
  notation: {
    runtime: "@mk-combos/ui/notation/runtime",
    schema: "@mk-combos/ui/notation/schema",
    type: "@mk-combos/ui/notation/type",
    value: "@mk-combos/ui/notation/value",
  },
  styles: {
    css: "@mk-combos/ui/styles.css",
  },
  tokens: {
    schema: "@mk-combos/ui/tokens/schema",
    type: "@mk-combos/ui/tokens/type",
    value: "@mk-combos/ui/tokens/value",
  },
} as const;

export const mkCombosUi = {
  packageName: "@mk-combos/ui",
  groups: uiContractGroups,
  valueSets: {
    notationDisplayModes,
    uiContrastModes,
    uiDensityModes,
    uiEmphasisModes,
    uiInteractionStates,
    uiMaterialModes,
    uiNotationIconKinds,
    uiNotationTokens,
    uiNotationTokenStates,
    uiPlacementModes,
    uiSelectionStates,
    uiSemanticTokenNames,
    uiShapeModes,
    uiThemeModes,
    uiToneModes,
  },
} as const;
