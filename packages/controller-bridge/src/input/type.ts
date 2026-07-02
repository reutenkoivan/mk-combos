import type { z } from "zod/v4";

import type {
  ControllerAxisDirectionSchema,
  ControllerControlIdSchema,
  ControllerControlSourceSchema,
  ControllerControlStateSchema,
  ControllerGamepadButtonSnapshotSchema,
  ControllerGamepadSnapshotSchema,
  ControllerInputConfigSchema,
  KnownControllerControlIdSchema,
  NormalizedControllerInputSnapshotSchema,
} from "./schema";

export {
  controllerAxisDirections,
  controllerControlIds,
  controllerControlSources,
  defaultControllerInputConfig,
} from "./value";

export type KnownControllerControlId = z.output<typeof KnownControllerControlIdSchema>;

export type ControllerControlId = z.output<typeof ControllerControlIdSchema>;

export type ControllerControlSource = z.output<typeof ControllerControlSourceSchema>;

export type ControllerAxisDirection = z.output<typeof ControllerAxisDirectionSchema>;

export type ControllerInputConfig = z.output<typeof ControllerInputConfigSchema>;

export type ControllerGamepadButtonSnapshot = z.output<
  typeof ControllerGamepadButtonSnapshotSchema
>;

export type ControllerGamepadSnapshot = z.output<typeof ControllerGamepadSnapshotSchema>;

export type ControllerControlState = z.output<typeof ControllerControlStateSchema>;

export type NormalizedControllerInputSnapshot = z.output<
  typeof NormalizedControllerInputSnapshotSchema
>;
