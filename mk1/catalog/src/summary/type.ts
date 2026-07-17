import type { z } from "zod/v4";

import type {
  Mk1CatalogComboSummarySchema,
  Mk1CatalogEntityLabelSchema,
  Mk1CatalogRouteStepEmphasisSchema,
  Mk1CatalogRouteStepKindSchema,
  Mk1CatalogRouteStepSchema,
} from "./schema";

export type Mk1CatalogEntityLabel = z.output<typeof Mk1CatalogEntityLabelSchema>;

export type Mk1CatalogComboSummary = z.output<typeof Mk1CatalogComboSummarySchema>;
export type Mk1CatalogRouteStepKind = z.output<typeof Mk1CatalogRouteStepKindSchema>;
export type Mk1CatalogRouteStepEmphasis = z.output<typeof Mk1CatalogRouteStepEmphasisSchema>;
export type Mk1CatalogRouteStep = z.output<typeof Mk1CatalogRouteStepSchema>;
