import type { z } from "zod/v4";

import type { MkxlTransitionSchema } from "./schema";

export type MkxlTransition = z.output<typeof MkxlTransitionSchema>;
