import { z } from "zod/v4";

import { ControllerCommandIdSchema } from "../command/schema";
import {
  ControllerControlIdSchema,
  ControllerGamepadSnapshotSchema,
  NormalizedControllerInputSnapshotSchema,
  PartialControllerInputConfigSchema,
} from "../input/schema";
import { ControllerProfileIdSchema } from "../profile/schema";

export const ControllerCommandBindingSchema = z
  .object({
    controlId: ControllerControlIdSchema,
    commandId: ControllerCommandIdSchema,
    repeat: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const ControllerRepeatConfigSchema = z
  .object({
    initialDelayMs: z.number().nonnegative(),
    intervalMs: z.number().positive(),
  })
  .strict();

export const ControllerBridgeConfigSchema = z
  .object({
    activeGamepadIndex: z.number().int().nonnegative().optional(),
    bindings: z.array(ControllerCommandBindingSchema).readonly().optional(),
    input: PartialControllerInputConfigSchema.optional(),
    repeat: ControllerRepeatConfigSchema.optional(),
  })
  .strict();

export const ControllerCommandEventPhaseSchema = z.enum(["press", "repeat"]);

export const ControllerCommandEventSchema = z
  .object({
    sequence: z.number().int().nonnegative(),
    commandId: ControllerCommandIdSchema,
    controlId: ControllerControlIdSchema,
    gamepadId: z.string(),
    gamepadIndex: z.number().int().nonnegative(),
    profileId: ControllerProfileIdSchema,
    phase: ControllerCommandEventPhaseSchema,
    timestamp: z.number().nonnegative(),
    value: z.number().min(0).max(1).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const ControllerBridgeStateSchema = z
  .object({
    connected: z.boolean(),
    activeGamepadIndex: z.number().int().nonnegative().optional(),
    profileId: ControllerProfileIdSchema.optional(),
    lastConnectedAt: z.number().nonnegative().optional(),
    lastDisconnectedAt: z.number().nonnegative().optional(),
  })
  .strict();

export const ControllerBridgePollInputSchema = z
  .object({
    timestamp: z.number().nonnegative(),
    gamepads: z.array(ControllerGamepadSnapshotSchema).readonly(),
    activeGamepadIndex: z.number().int().nonnegative().optional(),
    bindings: z.array(ControllerCommandBindingSchema).readonly().optional(),
  })
  .strict();

export const ControllerBridgePollResultSchema = z
  .object({
    state: ControllerBridgeStateSchema,
    activeGamepad: NormalizedControllerInputSnapshotSchema.optional(),
    events: z.array(ControllerCommandEventSchema).readonly(),
  })
  .strict();
