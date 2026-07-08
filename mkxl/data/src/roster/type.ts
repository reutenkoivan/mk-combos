import type { z } from "zod/v4";

import type { MkxlCharacterSchema } from "./schema";

export type MkxlCharacter = z.output<typeof MkxlCharacterSchema>;
