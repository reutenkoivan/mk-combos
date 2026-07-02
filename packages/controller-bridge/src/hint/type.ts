import type { z } from "zod/v4";

import type {
  ControllerHintListSchema,
  ControllerHintRequestSchema,
  ControllerHintRowSchema,
} from "./schema";

export type ControllerHintRow = z.output<typeof ControllerHintRowSchema>;

export type ControllerHintList = z.output<typeof ControllerHintListSchema>;

export type ControllerHintRequest = z.output<typeof ControllerHintRequestSchema>;
