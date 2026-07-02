import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";
import { ControllerCommandBindingSchema } from "../bridge/schema";
import { ControllerCommandIdSchema } from "../command/schema";
import { ControllerControlIdSchema } from "../input/schema";
import { ControllerProfileIdSchema } from "../profile/schema";

export const ControllerHintRowSchema = z
  .object({
    commandId: ControllerCommandIdSchema,
    commandLabel: LocalizedTextSchema,
    commandDescription: LocalizedTextSchema.optional(),
    controlId: ControllerControlIdSchema,
    controlLabel: LocalizedTextSchema,
    profileId: ControllerProfileIdSchema,
    available: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const ControllerHintListSchema = z.array(ControllerHintRowSchema).readonly();

export const ControllerHintRequestSchema = z
  .object({
    profileId: z.string().min(1).optional(),
    bindings: z.array(ControllerCommandBindingSchema).readonly().optional(),
    commandIds: z.array(ControllerCommandIdSchema).readonly().optional(),
    availableCommandIds: z.array(ControllerCommandIdSchema).readonly().optional(),
  })
  .strict();
