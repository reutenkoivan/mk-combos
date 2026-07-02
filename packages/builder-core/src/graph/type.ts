import type { z } from "zod/v4";

import type {
  BuilderGraphEdgeIdSchema,
  BuilderGraphEdgeSchema,
  BuilderGraphNodeIdSchema,
  BuilderGraphNodeSchema,
  BuilderGraphSchema,
  BuilderMetadataSchema,
  BuilderMoveIdSchema,
  BuilderMovePathSchema,
  BuilderPathStepIdSchema,
  BuilderPathStepSchema,
} from "./schema";

export type BuilderMetadata = z.output<typeof BuilderMetadataSchema>;

export type BuilderGraphNodeId = z.output<typeof BuilderGraphNodeIdSchema>;

export type BuilderGraphEdgeId = z.output<typeof BuilderGraphEdgeIdSchema>;

export type BuilderMoveId = z.output<typeof BuilderMoveIdSchema>;

export type BuilderPathStepId = z.output<typeof BuilderPathStepIdSchema>;

export type BuilderGraphNode = z.output<typeof BuilderGraphNodeSchema>;

export type BuilderGraphEdge = z.output<typeof BuilderGraphEdgeSchema>;

export type BuilderPathStep = z.output<typeof BuilderPathStepSchema>;

export type BuilderMovePath = z.output<typeof BuilderMovePathSchema>;

export type BuilderGraph = z.output<typeof BuilderGraphSchema>;
