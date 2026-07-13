import type { z } from "zod/v4";

import type {
  ControllerBrowserSourceResultSchema,
  ControllerCapabilityReasonSchema,
  ControllerCapabilityStateSchema,
} from "./schema";

export {
  controllerCapabilityReasons,
  controllerCapabilityStates,
} from "./value";

export type ControllerCapabilityState = z.output<typeof ControllerCapabilityStateSchema>;

export type ControllerCapabilityReason = z.output<typeof ControllerCapabilityReasonSchema>;

export type ControllerBrowserSourceResult = z.output<typeof ControllerBrowserSourceResultSchema>;
