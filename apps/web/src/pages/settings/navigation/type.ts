import type { settingsTabs } from "./value";

export type SettingsTab = (typeof settingsTabs)[keyof typeof settingsTabs];
