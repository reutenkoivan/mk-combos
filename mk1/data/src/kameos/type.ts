import type { z } from "zod/v4";

import type { Mk1KameoSchema } from "./schema";

export type Mk1Kameo = z.output<typeof Mk1KameoSchema>;
