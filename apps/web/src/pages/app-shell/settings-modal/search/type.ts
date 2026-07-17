import type { z } from "zod/v4";

import type { SettingsModalSearchSchema } from "./schema";

export type SettingsModalSearch = z.output<typeof SettingsModalSearchSchema>;
