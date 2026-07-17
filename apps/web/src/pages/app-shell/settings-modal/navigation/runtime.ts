import type { SettingsTab } from "./type";
import { settingsTabs } from "./value";

export function isSettingsTab(value: string): value is SettingsTab {
  return value === settingsTabs.backup || value === settingsTabs.interface;
}

export function withSettingsTabSearch(href: string, tab?: SettingsTab): string {
  const url = new URL(href, "https://mk-combos.invalid");

  if (tab === undefined) {
    url.searchParams.delete("settings");
  } else {
    url.searchParams.set("settings", tab);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
