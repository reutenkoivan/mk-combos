import type { z } from "zod/v4";

import type { Mk1CharacterSchema } from "./schema";

export type Mk1Character = z.output<typeof Mk1CharacterSchema>;
