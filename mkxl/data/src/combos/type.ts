import type { z } from "zod/v4";

import type {
  MkxlComboDifficultySchema,
  MkxlComboMetadataSchema,
  MkxlComboPositionSchema,
  MkxlComboRouteStepSchema,
  MkxlComboRouteTypeSchema,
  MkxlComboStageContextSchema,
  MkxlSeededComboSchema,
} from "./schema";

export type MkxlComboDifficulty = z.output<typeof MkxlComboDifficultySchema>;

export type MkxlComboPosition = z.output<typeof MkxlComboPositionSchema>;

export type MkxlComboRouteType = z.output<typeof MkxlComboRouteTypeSchema>;

export type MkxlComboStageContext = z.output<typeof MkxlComboStageContextSchema>;

export type MkxlComboRouteStep = z.output<typeof MkxlComboRouteStepSchema>;

export type MkxlComboMetadata = z.output<typeof MkxlComboMetadataSchema>;

export type MkxlSeededCombo = z.output<typeof MkxlSeededComboSchema>;
