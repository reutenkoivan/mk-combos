import type { z } from "zod/v4";

import type {
  ControllerButtonLabelMapSchema,
  ControllerProfileIdSchema,
  ControllerProfileListSchema,
  ControllerProfileSchema,
} from "./schema";

export { controllerProfileIds, controllerProfileMatchers, controllerProfiles } from "./value";

export type ControllerProfileId = z.output<typeof ControllerProfileIdSchema>;

export type ControllerButtonLabelMap = z.output<typeof ControllerButtonLabelMapSchema>;

export type ControllerProfile = z.output<typeof ControllerProfileSchema>;

export type ControllerProfileList = z.output<typeof ControllerProfileListSchema>;
