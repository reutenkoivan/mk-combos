import type { z } from "zod/v4";

import type { Mk1CatalogComboSummarySchema, Mk1CatalogEntityLabelSchema } from "./schema";

export type Mk1CatalogEntityLabel = z.output<typeof Mk1CatalogEntityLabelSchema>;

export type Mk1CatalogComboSummary = z.output<typeof Mk1CatalogComboSummarySchema>;
