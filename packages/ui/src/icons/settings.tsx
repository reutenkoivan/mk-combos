import { Settings } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const settingsIcon = {
  accessibleLabel: "Settings",
  name: "settings",
} as const;

export const SettingsIcon = createIconComponent(Settings, settingsIcon);
