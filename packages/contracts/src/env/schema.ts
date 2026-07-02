import { z } from "zod/v4";
import type { MkCombosEnv } from "./type";

type MkCombosNonProductionNodeEnv = Extract<MkCombosEnv, { isProduction: false }>["nodeEnv"];

const isTsdownVerboseValue = (value: string | undefined) =>
  value === "1" || value === "true" || value === "yes";

const toNonProductionNodeEnv = (nodeEnv: string | undefined): MkCombosNonProductionNodeEnv => {
  if (nodeEnv === undefined || nodeEnv === "development" || nodeEnv === "test") {
    return nodeEnv;
  }

  return nodeEnv as MkCombosNonProductionNodeEnv;
};

const ProcessEnvSchema = z.looseObject({
  CI: z.string().optional(),
  NODE_ENV: z.string().optional(),
  TSDOWN_VERBOSE: z.string().optional(),
});

export const MkCombosEnvSchema: z.ZodType<MkCombosEnv> = ProcessEnvSchema.transform(
  (env): MkCombosEnv => {
    const flags = {
      isCi: Boolean(env.CI),
      isTsdownVerbose: isTsdownVerboseValue(env.TSDOWN_VERBOSE),
    };

    if (env.NODE_ENV === "production") {
      return {
        ...flags,
        nodeEnv: "production",
        isProduction: true,
      };
    }

    return {
      ...flags,
      nodeEnv: toNonProductionNodeEnv(env.NODE_ENV),
      isProduction: false,
    };
  },
);
