import type { z } from "zod/v4";

import type {
  UiContrastModeSchema,
  UiControlPresentationModeSchema,
  UiDensityModeSchema,
  UiEmphasisModeSchema,
  UiInteractionStateSchema,
  UiMaterialModeSchema,
  UiPlacementModeSchema,
  UiSelectionStateSchema,
  UiSemanticTokenNameSchema,
  UiSemanticTokenSchema,
  UiShapeModeSchema,
  UiThemeModeSchema,
  UiToneModeSchema,
} from "./schema";

export {
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
} from "./value";

export type UiThemeMode = z.output<typeof UiThemeModeSchema>;

export type UiContrastMode = z.output<typeof UiContrastModeSchema>;

export type UiControlPresentationMode = z.output<typeof UiControlPresentationModeSchema>;

export type UiSemanticTokenName = z.output<typeof UiSemanticTokenNameSchema>;

export type UiSemanticToken = z.output<typeof UiSemanticTokenSchema>;

export type UiDensityMode = z.output<typeof UiDensityModeSchema>;

export type UiShapeMode = z.output<typeof UiShapeModeSchema>;

export type UiMaterialMode = z.output<typeof UiMaterialModeSchema>;

export type UiToneMode = z.output<typeof UiToneModeSchema>;

export type UiEmphasisMode = z.output<typeof UiEmphasisModeSchema>;

export type UiInteractionState = z.output<typeof UiInteractionStateSchema>;

export type UiSelectionState = z.output<typeof UiSelectionStateSchema>;

export type UiPlacementMode = z.output<typeof UiPlacementModeSchema>;
