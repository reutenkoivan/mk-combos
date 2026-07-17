import type { z } from "zod/v4";

import type {
  MkxlCatalogComboSummarySchema,
  MkxlCatalogEntityLabelSchema,
  MkxlCatalogRouteStepEmphasisSchema,
  MkxlCatalogRouteStepKindSchema,
  MkxlCatalogRouteStepSchema,
} from "./schema";

export type MkxlCatalogEntityLabel = z.output<typeof MkxlCatalogEntityLabelSchema>;

export type MkxlCatalogComboSummary = z.output<typeof MkxlCatalogComboSummarySchema>;
export type MkxlCatalogRouteStepKind = z.output<typeof MkxlCatalogRouteStepKindSchema>;
export type MkxlCatalogRouteStepEmphasis = z.output<typeof MkxlCatalogRouteStepEmphasisSchema>;
export type MkxlCatalogRouteStep = z.output<typeof MkxlCatalogRouteStepSchema>;
