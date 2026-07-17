import { z } from "zod/v4";

import { settingsTabs } from "../navigation/value";

export const SettingsTabSchema = z.enum(settingsTabs);

export const SettingsModalSearchSchema = z.object({
  settings: SettingsTabSchema.optional(),
});
