import type { z } from "zod/v4";

import type {
  Mk1CharacterGraphSchema,
  Mk1GraphEdgeSchema,
  Mk1GraphNodeSchema,
  Mk1KameoGraphOverlaySchema,
} from "./schema";

export type Mk1GraphNode = z.output<typeof Mk1GraphNodeSchema>;

export type Mk1GraphEdge = z.output<typeof Mk1GraphEdgeSchema>;

export type Mk1CharacterGraph = z.output<typeof Mk1CharacterGraphSchema>;

export type Mk1KameoGraphOverlay = z.output<typeof Mk1KameoGraphOverlaySchema>;
