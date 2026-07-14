import type { z } from "zod/v4";
import type { InstalledGamePathParamsSchema } from "./schema";

export type InstalledGamePathParams = z.output<typeof InstalledGamePathParamsSchema>;
