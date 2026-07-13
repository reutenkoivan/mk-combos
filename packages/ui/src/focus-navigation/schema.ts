import { z } from "zod/v4";

import { uiFocusDirections } from "./value";

export const UiFocusDirectionSchema = z.enum(uiFocusDirections);

export const UiFocusNeighborsSchema = z
  .object({
    down: z.string().min(1).optional(),
    left: z.string().min(1).optional(),
    right: z.string().min(1).optional(),
    up: z.string().min(1).optional(),
  })
  .strict();

export const UiFocusNavigationTargetSchema = z
  .object({
    disabled: z.boolean().optional(),
    id: z.string().min(1),
    neighbors: UiFocusNeighborsSchema,
  })
  .strict();

export const UiFocusNavigationScopeSchema = z
  .object({
    availableCommandIds: z.array(z.string().min(1)).readonly(),
    entryTargetId: z.string().min(1),
    fallbackTargetId: z.string().min(1),
    id: z.string().min(1),
    targets: z.array(UiFocusNavigationTargetSchema).readonly(),
  })
  .strict();

export { uiFocusDirections };
