import type { z } from "zod/v4";

import type { MkxlDataSourceKindSchema, MkxlDataSourceSchema, MkxlGameSchema } from "./schema";

export type MkxlDataSourceKind = z.output<typeof MkxlDataSourceKindSchema>;

export type MkxlGame = z.output<typeof MkxlGameSchema>;

export type MkxlDataSource = z.output<typeof MkxlDataSourceSchema>;
