import type { z } from "zod/v4";

import type {
  Mk1ComboDifficultySchema,
  Mk1ComboMetadataSchema,
  Mk1ComboPositionSchema,
  Mk1ComboRouteStepSchema,
  Mk1ComboRouteTypeSchema,
  Mk1SeededComboSchema,
} from "./schema";

export type Mk1ComboDifficulty = z.output<typeof Mk1ComboDifficultySchema>;

export type Mk1ComboPosition = z.output<typeof Mk1ComboPositionSchema>;

export type Mk1ComboRouteType = z.output<typeof Mk1ComboRouteTypeSchema>;

export type Mk1ComboRouteStep = z.output<typeof Mk1ComboRouteStepSchema>;

export type Mk1ComboMetadata = z.output<typeof Mk1ComboMetadataSchema>;

export type Mk1SeededCombo = z.output<typeof Mk1SeededComboSchema>;
