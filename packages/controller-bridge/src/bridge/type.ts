import type { z } from "zod/v4";

import type {
  ControllerBridgeConfigSchema,
  ControllerBridgePollInputSchema,
  ControllerBridgePollResultSchema,
  ControllerBridgeStateSchema,
  ControllerCommandBindingSchema,
  ControllerCommandEventPhaseSchema,
  ControllerCommandEventSchema,
  ControllerRepeatConfigSchema,
} from "./schema";

export type ControllerCommandBinding = z.output<typeof ControllerCommandBindingSchema>;

export type ControllerRepeatConfig = z.output<typeof ControllerRepeatConfigSchema>;

export type ControllerBridgeConfig = z.output<typeof ControllerBridgeConfigSchema>;

export type ControllerCommandEventPhase = z.output<typeof ControllerCommandEventPhaseSchema>;

export type ControllerCommandEvent = z.output<typeof ControllerCommandEventSchema>;

export type ControllerBridgeState = z.output<typeof ControllerBridgeStateSchema>;

export type ControllerBridgePollInput = z.output<typeof ControllerBridgePollInputSchema>;

export type ControllerBridgePollResult = z.output<typeof ControllerBridgePollResultSchema>;
