import type { z } from "zod/v4";

import type {
  BuilderComboFreshStateSchema,
  BuilderComboInvalidStateSchema,
  BuilderComboStaleStateSchema,
  BuilderComboStateSchema,
  BuilderComboStateStatusSchema,
} from "./schema";

export { builderComboStateStatuses } from "./value";

export type BuilderComboStateStatus = z.output<typeof BuilderComboStateStatusSchema>;

export type BuilderComboFreshState = z.output<typeof BuilderComboFreshStateSchema>;

export type BuilderComboStaleState = z.output<typeof BuilderComboStaleStateSchema>;

export type BuilderComboInvalidState = z.output<typeof BuilderComboInvalidStateSchema>;

export type BuilderComboState = z.output<typeof BuilderComboStateSchema>;
