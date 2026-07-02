declare const nonProductionNodeEnvBrand: unique symbol;

type NonProductionNodeEnv = string & {
  readonly [nonProductionNodeEnvBrand]: "NonProductionNodeEnv";
};

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
    nodeEnv: "development" | "test" | NonProductionNodeEnv | undefined;
    isProduction: false;
  }>;

export type MkCombosEnv = MkCombosProductionEnv | MkCombosNonProductionEnv;
