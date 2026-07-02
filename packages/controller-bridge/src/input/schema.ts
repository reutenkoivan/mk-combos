import { z } from "zod/v4";

import {
  controllerAxisDirections,
  controllerControlIds,
  controllerControlSources,
  defaultControllerInputConfig,
} from "./value";

export {
  controllerAxisDirections,
  controllerControlIds,
  controllerControlSources,
  defaultControllerInputConfig,
} from "./value";

export const KnownControllerControlIdSchema = z.enum(controllerControlIds);

export const ControllerControlIdSchema = z.string().min(1);

export const ControllerControlSourceSchema = z.enum(controllerControlSources);

export const ControllerAxisDirectionSchema = z.enum(controllerAxisDirections);

export const ControllerInputConfigSchema = z
  .object({
    axisPressThreshold: z
      .number()
      .min(0)
      .max(1)
      .default(defaultControllerInputConfig.axisPressThreshold),
    axisReleaseThreshold: z
      .number()
      .min(0)
      .max(1)
      .default(defaultControllerInputConfig.axisReleaseThreshold),
    buttonPressThreshold: z
      .number()
      .min(0)
      .max(1)
      .default(defaultControllerInputConfig.buttonPressThreshold),
  })
  .strict()
  .refine((config) => config.axisReleaseThreshold <= config.axisPressThreshold, {
    message: "Axis release threshold must be less than or equal to axis press threshold.",
    path: ["axisReleaseThreshold"],
  });

export const PartialControllerInputConfigSchema = z
  .object({
    axisPressThreshold: z.number().min(0).max(1).optional(),
    axisReleaseThreshold: z.number().min(0).max(1).optional(),
    buttonPressThreshold: z.number().min(0).max(1).optional(),
  })
  .strict()
  .refine(
    (config) =>
      config.axisPressThreshold === undefined ||
      config.axisReleaseThreshold === undefined ||
      config.axisReleaseThreshold <= config.axisPressThreshold,
    {
      message: "Axis release threshold must be less than or equal to axis press threshold.",
      path: ["axisReleaseThreshold"],
    },
  );

export const ControllerGamepadButtonSnapshotSchema = z
  .object({
    pressed: z.boolean().optional(),
    touched: z.boolean().optional(),
    value: z.number().min(0).max(1),
  })
  .strict();

export const ControllerGamepadSnapshotSchema = z
  .object({
    id: z.string(),
    index: z.number().int().nonnegative(),
    connected: z.boolean(),
    mapping: z.string().optional(),
    timestamp: z.number().nonnegative().optional(),
    buttons: z.array(ControllerGamepadButtonSnapshotSchema).readonly(),
    axes: z.array(z.number().min(-1).max(1)).readonly(),
  })
  .strict();

export const ControllerControlStateSchema = z
  .object({
    id: ControllerControlIdSchema,
    source: ControllerControlSourceSchema,
    pressed: z.boolean(),
    value: z.number().min(0).max(1),
    rawIndex: z.number().int().nonnegative(),
    direction: ControllerAxisDirectionSchema.optional(),
  })
  .strict();

export const NormalizedControllerInputSnapshotSchema = z
  .object({
    gamepadId: z.string(),
    gamepadIndex: z.number().int().nonnegative(),
    connected: z.boolean(),
    profileId: z.string().min(1),
    timestamp: z.number().nonnegative().optional(),
    controls: z.array(ControllerControlStateSchema).readonly(),
    pressedControls: z.array(ControllerControlIdSchema).readonly(),
  })
  .strict();
