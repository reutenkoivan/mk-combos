import type { z } from "zod/v4";

import type {
  Mk1CatalogDamageRangeSchema,
  Mk1CatalogFilterIdSchema,
  Mk1CatalogFiltersSchema,
  Mk1CatalogMultiSelectFilterIdSchema,
  Mk1CatalogRangeFilterIdSchema,
} from "./schema";

export {
  mk1CatalogFilterIds,
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogRangeFilterIds,
} from "./value";

export type Mk1CatalogFilterId = z.output<typeof Mk1CatalogFilterIdSchema>;

export type Mk1CatalogMultiSelectFilterId = z.output<typeof Mk1CatalogMultiSelectFilterIdSchema>;

export type Mk1CatalogRangeFilterId = z.output<typeof Mk1CatalogRangeFilterIdSchema>;

export type Mk1CatalogDamageRange = z.output<typeof Mk1CatalogDamageRangeSchema>;

export type Mk1CatalogFilters = z.output<typeof Mk1CatalogFiltersSchema>;

export type Mk1CatalogMultiSelectFacet = {
  readonly kind: "multiSelect";
  readonly id: Mk1CatalogMultiSelectFilterId;
  readonly options: readonly {
    readonly value: string;
    readonly label: string;
    readonly count: number;
    readonly selected: boolean;
  }[];
};

export type Mk1CatalogRangeFacet = {
  readonly kind: "range";
  readonly id: Mk1CatalogRangeFilterId;
  readonly min: number;
  readonly max: number;
};

export type Mk1CatalogFilterFacet = Mk1CatalogMultiSelectFacet | Mk1CatalogRangeFacet;
