import type { z } from "zod/v4";

import type { CatalogSearchSchema } from "./schema";

export type CatalogSearch = z.output<typeof CatalogSearchSchema>;
