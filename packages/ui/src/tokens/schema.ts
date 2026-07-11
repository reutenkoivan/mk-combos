import { z } from "zod/v4";

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
} from "./value";

export {
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
} from "./value";

export const UiThemeModeSchema = z.enum(uiThemeModes);

export const UiContrastModeSchema = z.enum(uiContrastModes);

export const UiSemanticTokenNameSchema = z.enum(uiSemanticTokenNames);

export const UiSemanticTokenSchema = z
  .object({
    cssVariable: z.string().regex(/^--ui-[a-z0-9-]+$/u),
    name: UiSemanticTokenNameSchema,
  })
  .strict();

export const UiDensityModeSchema = z.enum(uiDensityModes);

export const UiShapeModeSchema = z.enum(uiShapeModes);

export const UiMaterialModeSchema = z.enum(uiMaterialModes);

export const UiToneModeSchema = z.enum(uiToneModes);

export const UiEmphasisModeSchema = z.enum(uiEmphasisModes);

export const UiInteractionStateSchema = z.enum(uiInteractionStates);

export const UiSelectionStateSchema = z.enum(uiSelectionStates);

export const UiPlacementModeSchema = z.enum(uiPlacementModes);
