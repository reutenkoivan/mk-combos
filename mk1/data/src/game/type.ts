import type { z } from "zod/v4";

import type { Mk1DataSourceKindSchema, Mk1DataSourceSchema, Mk1GameSchema } from "./schema";

export type Mk1DataSourceKind = z.output<typeof Mk1DataSourceKindSchema>;

export type Mk1DataSource = z.output<typeof Mk1DataSourceSchema>;

export type Mk1Game = z.output<typeof Mk1GameSchema>;
