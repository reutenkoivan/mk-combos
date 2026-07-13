import type { z } from "zod/v4";

import type {
  UiFocusDirectionSchema,
  UiFocusNavigationScopeSchema,
  UiFocusNavigationTargetSchema,
  UiFocusNeighborsSchema,
} from "./schema";

export { uiFocusDirections } from "./value";

export type UiFocusDirection = z.output<typeof UiFocusDirectionSchema>;
export type UiFocusNeighbors = z.output<typeof UiFocusNeighborsSchema>;
export type UiFocusNavigationTarget = z.output<typeof UiFocusNavigationTargetSchema>;
export type UiFocusNavigationScope = z.output<typeof UiFocusNavigationScopeSchema>;
