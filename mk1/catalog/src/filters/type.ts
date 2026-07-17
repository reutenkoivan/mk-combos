import type { z } from "zod/v4";

import type {
  Mk1CatalogFilterFacetSchema,
  Mk1CatalogFilterIdSchema,
  Mk1CatalogFilterOptionSchema,
  Mk1CatalogFilterQueryKeySchema,
  Mk1CatalogFilterQuerySchema,
  Mk1CatalogFiltersSchema,
  Mk1CatalogMultiSelectFilterIdSchema,
  Mk1CatalogSourceSchema,
} from "./schema";

export type Mk1CatalogFilterId = z.output<typeof Mk1CatalogFilterIdSchema>;
export type Mk1CatalogMultiSelectFilterId = z.output<typeof Mk1CatalogMultiSelectFilterIdSchema>;
export type Mk1CatalogSource = z.output<typeof Mk1CatalogSourceSchema>;
export type Mk1CatalogFilterQueryKey = z.output<typeof Mk1CatalogFilterQueryKeySchema>;
export type Mk1CatalogFilters = z.output<typeof Mk1CatalogFiltersSchema>;
export type Mk1CatalogFilterQuery = z.output<typeof Mk1CatalogFilterQuerySchema>;
export type Mk1CatalogFilterOption = z.output<typeof Mk1CatalogFilterOptionSchema>;
export type Mk1CatalogFilterFacet = z.output<typeof Mk1CatalogFilterFacetSchema>;
