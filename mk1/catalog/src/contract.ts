import {
  mk1CatalogContextStatuses,
  mk1CatalogOptionAvailabilities,
  mk1CatalogRecoveryCodes,
} from "./context/value";
import {
  mk1CatalogFilterIds,
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogRangeFilterIds,
} from "./filters/value";

export const mk1CatalogContractGroups = {
  context: {
    runtime: "@mk-combos/mk1-catalog/context/runtime",
    schema: "@mk-combos/mk1-catalog/context/schema",
    type: "@mk-combos/mk1-catalog/context/type",
    value: "@mk-combos/mk1-catalog/context/value",
  },
  filters: {
    runtime: "@mk-combos/mk1-catalog/filters/runtime",
    schema: "@mk-combos/mk1-catalog/filters/schema",
    type: "@mk-combos/mk1-catalog/filters/type",
    value: "@mk-combos/mk1-catalog/filters/value",
  },
  selectors: {
    runtime: "@mk-combos/mk1-catalog/selectors/runtime",
  },
  summary: {
    schema: "@mk-combos/mk1-catalog/summary/schema",
    type: "@mk-combos/mk1-catalog/summary/type",
  },
} as const;

export const mkCombosMk1Catalog = {
  packageName: "@mk-combos/mk1-catalog",
  groups: mk1CatalogContractGroups,
  valueSets: {
    mk1CatalogContextStatuses,
    mk1CatalogFilterIds,
    mk1CatalogMultiSelectFilterIds,
    mk1CatalogOptionAvailabilities,
    mk1CatalogRangeFilterIds,
    mk1CatalogRecoveryCodes,
  },
} as const;
