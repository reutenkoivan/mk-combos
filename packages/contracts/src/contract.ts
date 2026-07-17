import { catalogFilterChangeKinds } from "./catalog-filter/value";
import { comboSources } from "./identity/value";
import { validationSeverities } from "./result/value";
import { gameRouteKinds } from "./routes/value";
import { languageCodes, notationDisplayModes, themePreferences } from "./settings/value";

export type { GameBackupEnvelope } from "./backup/type";
export type { CatalogFilterChange, CatalogFilterChangeKind } from "./catalog-filter/type";
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
} from "./routes/type";
export type {
  AppSettings,
  GameUserState,
  LanguageCode,
  LocalAppState,
  LocalizedText,
  NotationDisplayMode,
  ThemePreference,
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
  catalogFilter: {
    schema: "@mk-combos/contracts/catalog-filter/schema",
    type: "@mk-combos/contracts/catalog-filter/type",
    value: "@mk-combos/contracts/catalog-filter/value",
  },
  env: {
    runtime: "@mk-combos/contracts/env/runtime",
    type: "@mk-combos/contracts/env/type",
    value: "@mk-combos/contracts/env/value",
  },
  identity: {
    schema: "@mk-combos/contracts/identity/schema",
    type: "@mk-combos/contracts/identity/type",
    value: "@mk-combos/contracts/identity/value",
  },
  result: {
    runtime: "@mk-combos/contracts/result/runtime",
    schema: "@mk-combos/contracts/result/schema",
    type: "@mk-combos/contracts/result/type",
    value: "@mk-combos/contracts/result/value",
  },
  routes: {
    schema: "@mk-combos/contracts/routes/schema",
    type: "@mk-combos/contracts/routes/type",
    value: "@mk-combos/contracts/routes/value",
  },
  settings: {
    schema: "@mk-combos/contracts/settings/schema",
    type: "@mk-combos/contracts/settings/type",
    value: "@mk-combos/contracts/settings/value",
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
    catalogFilterChangeKinds,
    comboSources,
    gameRouteKinds,
    languageCodes,
    notationDisplayModes,
    themePreferences,
    validationSeverities,
  },
} as const;
