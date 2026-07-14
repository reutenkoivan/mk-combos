import type { SettingsTab } from "./type";
import { settingsTabs } from "./value";

export function isSettingsTab(value: string): value is SettingsTab {
  return value === settingsTabs.backup || value === settingsTabs.interface;
}
