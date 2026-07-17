import {
  mkxlCatalogContextStatuses,
  mkxlCatalogOptionAvailabilities,
  mkxlCatalogRecoveryCodes,
} from "./context/value";
import {
  mkxlCatalogFilterIds,
  mkxlCatalogFilterQueryKeys,
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogSingleSelectFilterIds,
  mkxlCatalogSources,
} from "./filters/value";
import { mkxlCatalogRouteStepEmphases, mkxlCatalogRouteStepKinds } from "./summary/value";

export const mkxlCatalogContractGroups = {
  context: {
    runtime: "@mk-combos/mkxl-catalog/context/runtime",
    schema: "@mk-combos/mkxl-catalog/context/schema",
    type: "@mk-combos/mkxl-catalog/context/type",
    value: "@mk-combos/mkxl-catalog/context/value",
  },
  filters: {
    runtime: "@mk-combos/mkxl-catalog/filters/runtime",
    schema: "@mk-combos/mkxl-catalog/filters/schema",
    type: "@mk-combos/mkxl-catalog/filters/type",
    value: "@mk-combos/mkxl-catalog/filters/value",
  },
  selectors: {
    runtime: "@mk-combos/mkxl-catalog/selectors/runtime",
  },
  summary: {
    schema: "@mk-combos/mkxl-catalog/summary/schema",
    type: "@mk-combos/mkxl-catalog/summary/type",
    value: "@mk-combos/mkxl-catalog/summary/value",
  },
} as const;

export const mkCombosMkxlCatalog = {
  packageName: "@mk-combos/mkxl-catalog",
  groups: mkxlCatalogContractGroups,
  valueSets: {
    mkxlCatalogContextStatuses,
    mkxlCatalogFilterIds,
    mkxlCatalogFilterQueryKeys,
    mkxlCatalogMultiSelectFilterIds,
    mkxlCatalogOptionAvailabilities,
    mkxlCatalogRecoveryCodes,
    mkxlCatalogRouteStepEmphases,
    mkxlCatalogRouteStepKinds,
    mkxlCatalogSingleSelectFilterIds,
    mkxlCatalogSources,
  },
} as const;
