import { z } from "zod/v4";

import { ControllerGamepadSnapshotSchema } from "../input/schema";
import { controllerCapabilityReasons, controllerCapabilityStates } from "./value";

export const ControllerCapabilityStateSchema = z.enum(controllerCapabilityStates);

export const ControllerCapabilityReasonSchema = z.enum(controllerCapabilityReasons);

export const ControllerBrowserSourceResultSchema = z
  .object({
    state: ControllerCapabilityStateSchema,
    reason: ControllerCapabilityReasonSchema,
    gamepads: z.array(ControllerGamepadSnapshotSchema).readonly(),
  })
  .strict();

export { controllerCapabilityReasons, controllerCapabilityStates };
