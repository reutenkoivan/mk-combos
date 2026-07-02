import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

import { controllerCommandGroups, knownControllerCommandIds } from "./value";

export {
  controllerCommandGroups,
  controllerCommandMetadata,
  knownControllerCommandIds,
} from "./value";

export const KnownControllerCommandIdSchema = z.enum(knownControllerCommandIds);

export const ControllerCommandIdSchema = z.string().min(1);

export const ControllerCommandGroupSchema = z.enum(controllerCommandGroups);

export const ControllerCommandMetadataSchema = z
  .object({
    id: ControllerCommandIdSchema,
    group: ControllerCommandGroupSchema,
    label: LocalizedTextSchema,
    description: LocalizedTextSchema.optional(),
    repeatable: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const ControllerCommandMetadataListSchema = z
  .array(ControllerCommandMetadataSchema)
  .readonly();
