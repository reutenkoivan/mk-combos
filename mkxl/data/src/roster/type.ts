import type { z } from "zod/v4";

import type { MkxlCharacterReleaseKindSchema, MkxlCharacterSchema } from "./schema";

export type MkxlCharacterReleaseKind = z.output<typeof MkxlCharacterReleaseKindSchema>;

export type MkxlCharacter = z.output<typeof MkxlCharacterSchema>;
