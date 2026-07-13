import type { z } from "zod/v4";

import type {
  Mk1CharacterGraphSchema,
  Mk1GraphEdgeSchema,
  Mk1GraphNodeKindSchema,
  Mk1GraphNodeSchema,
  Mk1GraphTimingKindSchema,
  Mk1GraphTimingSchema,
  Mk1KameoGraphOverlaySchema,
} from "./schema";

export type Mk1GraphNode = z.output<typeof Mk1GraphNodeSchema>;
export type Mk1GraphNodeKind = z.output<typeof Mk1GraphNodeKindSchema>;

export type Mk1GraphTimingKind = z.output<typeof Mk1GraphTimingKindSchema>;

export type Mk1GraphTiming = z.output<typeof Mk1GraphTimingSchema>;

export type Mk1GraphEdge = z.output<typeof Mk1GraphEdgeSchema>;

export type Mk1CharacterGraph = z.output<typeof Mk1CharacterGraphSchema>;

export type Mk1KameoGraphOverlay = z.output<typeof Mk1KameoGraphOverlaySchema>;
