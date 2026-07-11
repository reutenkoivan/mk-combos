import type { z } from "zod/v4";

import type { MkCombosEnvSchema } from "./schema";

export type MkCombosEnv = z.output<typeof MkCombosEnvSchema>;
