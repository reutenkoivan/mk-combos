import type { z } from "zod/v4";

import type { MkxlVariationSchema } from "./schema";

export type MkxlVariation = z.output<typeof MkxlVariationSchema>;
