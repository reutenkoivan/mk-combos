import type { z } from "zod/v4";

import type { MkxlCatalogComboSummarySchema, MkxlCatalogEntityLabelSchema } from "./schema";

export type MkxlCatalogEntityLabel = z.output<typeof MkxlCatalogEntityLabelSchema>;

export type MkxlCatalogComboSummary = z.output<typeof MkxlCatalogComboSummarySchema>;
