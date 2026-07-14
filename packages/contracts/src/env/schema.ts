import { z } from "zod/v4";

type MkCombosEnvCommon = Readonly<{
  isCi: boolean;
  isTsdownVerbose: boolean;
  viteBase: string;
}>;

type MkCombosProductionEnv = MkCombosEnvCommon &
  Readonly<{
    nodeEnv: "production";
    isProduction: true;
  }>;

type MkCombosNonProductionEnv = MkCombosEnvCommon &
  Readonly<{
    nodeEnv: string | undefined;
    isProduction: false;
  }>;

type MkCombosEnvValue = MkCombosProductionEnv | MkCombosNonProductionEnv;

const isTsdownVerboseValue = (value: string | undefined) =>
  value === "1" || value === "true" || value === "yes";

const ProcessEnvSchema = z.looseObject({
  CI: z.string().optional(),
  NODE_ENV: z.string().optional(),
  TSDOWN_VERBOSE: z.string().optional(),
  VITE_BASE: z.string().default("./"),
});

const toMkCombosEnv = (env: z.output<typeof ProcessEnvSchema>): MkCombosEnvValue => {
  const flags = {
    isCi: Boolean(env.CI),
    isTsdownVerbose: isTsdownVerboseValue(env.TSDOWN_VERBOSE),
    viteBase: env.VITE_BASE,
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
    nodeEnv: env.NODE_ENV,
    isProduction: false,
  };
};

export const MkCombosEnvSchema = ProcessEnvSchema.transform(toMkCombosEnv);
