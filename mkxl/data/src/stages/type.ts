import type { z } from "zod/v4";

import type {
  MkxlInteractableSchema,
  MkxlStageSchema,
  MkxlStageSegmentSchema,
  MkxlStageZoneSchema,
} from "./schema";

export type MkxlStageSegment = z.output<typeof MkxlStageSegmentSchema>;

export type MkxlStageZone = z.output<typeof MkxlStageZoneSchema>;

export type MkxlInteractable = z.output<typeof MkxlInteractableSchema>;

export type MkxlStage = z.output<typeof MkxlStageSchema>;
