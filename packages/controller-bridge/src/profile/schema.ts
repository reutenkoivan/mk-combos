import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

import { controllerProfileIds } from "./value";

export { controllerProfileIds, controllerProfileMatchers, controllerProfiles } from "./value";

export const ControllerProfileIdSchema = z.enum(controllerProfileIds);

export const ControllerButtonLabelMapSchema = z.record(z.string(), LocalizedTextSchema);

export const ControllerProfileSchema = z
  .object({
    id: ControllerProfileIdSchema,
    label: LocalizedTextSchema,
    matchers: z.array(z.string()).readonly(),
    buttonLabels: ControllerButtonLabelMapSchema,
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const ControllerProfileListSchema = z.array(ControllerProfileSchema).readonly();
