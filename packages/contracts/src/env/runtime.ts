import { MkCombosEnvSchema } from "#env/schema";

import type { MkCombosEnv } from "./type";

export const getMkCombosEnv = (): MkCombosEnv => MkCombosEnvSchema.parse(process.env);
