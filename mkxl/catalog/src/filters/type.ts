import type { z } from "zod/v4";

import type {
  MkxlCatalogDamageRangeSchema,
  MkxlCatalogFilterFacetSchema,
  MkxlCatalogFilterIdSchema,
  MkxlCatalogFilterOptionSchema,
  MkxlCatalogFiltersSchema,
  MkxlCatalogMultiSelectFacetSchema,
  MkxlCatalogMultiSelectFilterIdSchema,
  MkxlCatalogRangeFacetSchema,
  MkxlCatalogRangeFilterIdSchema,
} from "./schema";

export {
  mkxlCatalogFilterIds,
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogRangeFilterIds,
} from "./value";

export type MkxlCatalogFilterId = z.output<typeof MkxlCatalogFilterIdSchema>;

export type MkxlCatalogMultiSelectFilterId = z.output<typeof MkxlCatalogMultiSelectFilterIdSchema>;

export type MkxlCatalogRangeFilterId = z.output<typeof MkxlCatalogRangeFilterIdSchema>;

export type MkxlCatalogDamageRange = z.output<typeof MkxlCatalogDamageRangeSchema>;

export type MkxlCatalogFilters = z.output<typeof MkxlCatalogFiltersSchema>;

export type MkxlCatalogFilterOption = z.output<typeof MkxlCatalogFilterOptionSchema>;

export type MkxlCatalogMultiSelectFacet = z.output<typeof MkxlCatalogMultiSelectFacetSchema>;

export type MkxlCatalogRangeFacet = z.output<typeof MkxlCatalogRangeFacetSchema>;

export type MkxlCatalogFilterFacet = z.output<typeof MkxlCatalogFilterFacetSchema>;
