import type { z } from "zod/v4";

import type {
  MkxlGraphEdgeSchema,
  MkxlGraphNodeKindSchema,
  MkxlGraphNodeSchema,
  MkxlStageGraphFragmentSchema,
  MkxlVariationGraphSchema,
} from "./schema";

export type MkxlGraphNode = z.output<typeof MkxlGraphNodeSchema>;
export type MkxlGraphNodeKind = z.output<typeof MkxlGraphNodeKindSchema>;

export type MkxlGraphEdge = z.output<typeof MkxlGraphEdgeSchema>;

export type MkxlVariationGraph = z.output<typeof MkxlVariationGraphSchema>;

export type MkxlStageGraphFragment = z.output<typeof MkxlStageGraphFragmentSchema>;
