import type { z } from "zod/v4";

import type {
  MkxlGraphEdgeSchema,
  MkxlGraphNodeKindSchema,
  MkxlGraphNodeSchema,
  MkxlGraphTimingKindSchema,
  MkxlGraphTimingSchema,
  MkxlStageGraphFragmentSchema,
  MkxlVariationGraphSchema,
} from "./schema";

export type MkxlGraphNode = z.output<typeof MkxlGraphNodeSchema>;
export type MkxlGraphNodeKind = z.output<typeof MkxlGraphNodeKindSchema>;

export type MkxlGraphTimingKind = z.output<typeof MkxlGraphTimingKindSchema>;

export type MkxlGraphTiming = z.output<typeof MkxlGraphTimingSchema>;

export type MkxlGraphEdge = z.output<typeof MkxlGraphEdgeSchema>;

export type MkxlVariationGraph = z.output<typeof MkxlVariationGraphSchema>;

export type MkxlStageGraphFragment = z.output<typeof MkxlStageGraphFragmentSchema>;
