import type { z } from "zod/v4";
import type { SettingsSearchSchema, SettingsSectionSchema } from "./schema";

export type SettingsSection = z.output<typeof SettingsSectionSchema>;

export type SettingsSearch = z.output<typeof SettingsSearchSchema>;
