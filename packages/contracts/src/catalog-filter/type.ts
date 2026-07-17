import type { z } from "zod/v4";

import type { CatalogFilterChangeKindSchema, CatalogFilterChangeSchema } from "./schema";

export { catalogFilterChangeKinds } from "./value";

export type CatalogFilterChangeKind = z.output<typeof CatalogFilterChangeKindSchema>;

export type CatalogFilterChange = z.output<typeof CatalogFilterChangeSchema>;
