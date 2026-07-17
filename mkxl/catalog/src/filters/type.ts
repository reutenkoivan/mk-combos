import type { z } from "zod/v4";

import type {
  MkxlCatalogFilterFacetSchema,
  MkxlCatalogFilterIdSchema,
  MkxlCatalogFilterOptionSchema,
  MkxlCatalogFilterQueryKeySchema,
  MkxlCatalogFilterQuerySchema,
  MkxlCatalogFiltersSchema,
  MkxlCatalogMultiSelectFilterIdSchema,
  MkxlCatalogSingleSelectFilterIdSchema,
  MkxlCatalogSourceSchema,
} from "./schema";

export type MkxlCatalogFilterId = z.output<typeof MkxlCatalogFilterIdSchema>;
export type MkxlCatalogMultiSelectFilterId = z.output<typeof MkxlCatalogMultiSelectFilterIdSchema>;
export type MkxlCatalogSingleSelectFilterId = z.output<
  typeof MkxlCatalogSingleSelectFilterIdSchema
>;
export type MkxlCatalogSource = z.output<typeof MkxlCatalogSourceSchema>;
export type MkxlCatalogFilterQueryKey = z.output<typeof MkxlCatalogFilterQueryKeySchema>;
export type MkxlCatalogFilters = z.output<typeof MkxlCatalogFiltersSchema>;
export type MkxlCatalogFilterQuery = z.output<typeof MkxlCatalogFilterQuerySchema>;
export type MkxlCatalogFilterOption = z.output<typeof MkxlCatalogFilterOptionSchema>;
export type MkxlCatalogFilterFacet = z.output<typeof MkxlCatalogFilterFacetSchema>;
