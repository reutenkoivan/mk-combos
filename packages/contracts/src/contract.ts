import { comboSources } from "./identity/value";
import { validationSeverities } from "./result/value";
import { appRouteKinds, gameRouteKinds } from "./routes/value";
import { languageCodes, notationDisplayModes } from "./settings/value";

export type { BackupEnvelope } from "./backup/type";
export type { ComboId, ComboRef, ComboSource, GameId, RouteComboSource } from "./identity/type";
export type {
  AppErr,
  AppError,
  AppOk,
  AppResult,
  ValidationMessage,
  ValidationSeverity,
} from "./result/type";
export type {
  AppRoute,
  AppRouteKind,
  BuilderRoute,
  BuilderRouteParams,
  CatalogRoute,
  CatalogRouteParams,
  ComboDetailRoute,
  ComboDetailRouteParams,
  GameRoute,
  GameRouteKind,
  ListsRoute,
  ListsRouteParams,
  RouteParamsByKind,
  SettingsRoute,
  SettingsRouteParams,
} from "./routes/type";
export type {
  AppSettings,
  GameUserState,
  LanguageCode,
  LocalAppState,
  LocalizedText,
  NotationDisplayMode,
} from "./settings/type";

export const contractGroups = {
  backup: {
    schema: "@mk-combos/contracts/backup/schema",
    type: "@mk-combos/contracts/backup/type",
  },
  build: {
    tsdown: "@mk-combos/contracts/build/tsdown/config",
    vite: "@mk-combos/contracts/build/vite/config",
    viteStorybook: "@mk-combos/contracts/build/vite/storybook",
  },
  env: {
    runtime: "@mk-combos/contracts/env/runtime",
    type: "@mk-combos/contracts/env/type",
    value: "@mk-combos/contracts/env/value",
  },
  identity: {
    schema: "@mk-combos/contracts/identity/schema",
    type: "@mk-combos/contracts/identity/type",
  },
  result: {
    runtime: "@mk-combos/contracts/result/runtime",
    schema: "@mk-combos/contracts/result/schema",
    type: "@mk-combos/contracts/result/type",
  },
  routes: {
    schema: "@mk-combos/contracts/routes/schema",
    type: "@mk-combos/contracts/routes/type",
  },
  settings: {
    schema: "@mk-combos/contracts/settings/schema",
    type: "@mk-combos/contracts/settings/type",
  },
  test: {
    e2eConfig: "@mk-combos/contracts/test/e2e/config",
    e2eTest: "@mk-combos/contracts/test/e2e/test",
    unitConfig: "@mk-combos/contracts/test/unit/config",
    unitReact: "@mk-combos/contracts/test/unit/react",
    unitSetup: "@mk-combos/contracts/test/unit/setup",
  },
} as const;

export const mkCombosContract = {
  packageName: "@mk-combos/contracts",
  groups: contractGroups,
  valueSets: {
    appRouteKinds,
    comboSources,
    gameRouteKinds,
    languageCodes,
    notationDisplayModes,
    validationSeverities,
  },
} as const;
