import type { z } from "zod/v4";

import type { MkxlBuilderContextSchema, MkxlBuilderIdSchema } from "./schema";

export type MkxlBuilderId = z.output<typeof MkxlBuilderIdSchema>;

export type MkxlBuilderContext = z.output<typeof MkxlBuilderContextSchema>;
