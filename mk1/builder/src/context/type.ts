import type { z } from "zod/v4";

import type { Mk1BuilderContextSchema, Mk1BuilderIdSchema } from "./schema";

export type Mk1BuilderId = z.output<typeof Mk1BuilderIdSchema>;

export type Mk1BuilderContext = z.output<typeof Mk1BuilderContextSchema>;
