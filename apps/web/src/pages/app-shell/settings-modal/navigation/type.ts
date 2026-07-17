import type { z } from "zod/v4";

import type { SettingsTabSchema } from "../search/schema";

export type SettingsTab = z.output<typeof SettingsTabSchema>;
