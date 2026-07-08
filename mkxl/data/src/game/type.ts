import type { z } from "zod/v4";

import type { MkxlDataSourceSchema, MkxlGameSchema } from "./schema";

export type MkxlGame = z.output<typeof MkxlGameSchema>;

export type MkxlDataSource = z.output<typeof MkxlDataSourceSchema>;
