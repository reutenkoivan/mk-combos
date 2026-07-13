import type { z } from "zod/v4";

import type {
  MkxlInteractableSchema,
  MkxlInteractableUsagePolicySchema,
  MkxlStageSchema,
  MkxlStageSegmentSchema,
  MkxlStageZoneSchema,
} from "./schema";

export type MkxlStageSegment = z.output<typeof MkxlStageSegmentSchema>;

export type MkxlStageZone = z.output<typeof MkxlStageZoneSchema>;

export type MkxlInteractable = z.output<typeof MkxlInteractableSchema>;
export type MkxlInteractableUsagePolicy = z.output<typeof MkxlInteractableUsagePolicySchema>;

export type MkxlStage = z.output<typeof MkxlStageSchema>;
