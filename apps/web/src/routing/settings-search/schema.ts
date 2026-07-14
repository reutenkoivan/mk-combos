import { z } from "zod/v4";

import { settingsSections } from "./value";

export const SettingsSectionSchema = z.enum(settingsSections);

export const SettingsSearchSchema = z.object({
  section: SettingsSectionSchema.optional(),
});
