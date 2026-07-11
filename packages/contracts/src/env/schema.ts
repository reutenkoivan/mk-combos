import { z } from "zod/v4";

type MkCombosEnvFlags = Readonly<{
  isCi: boolean;
  isTsdownVerbose: boolean;
}>;

type MkCombosProductionEnv = MkCombosEnvFlags &
  Readonly<{
    nodeEnv: "production";
    isProduction: true;
  }>;

type MkCombosNonProductionEnv = MkCombosEnvFlags &
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
});

const toMkCombosEnv = (env: z.output<typeof ProcessEnvSchema>): MkCombosEnvValue => {
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
    nodeEnv: env.NODE_ENV,
    isProduction: false,
  };
};

export const MkCombosEnvSchema = ProcessEnvSchema.transform(toMkCombosEnv);
