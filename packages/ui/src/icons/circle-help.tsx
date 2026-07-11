import { CircleHelp } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const circleHelpIcon = {
  accessibleLabel: "Help",
  name: "circle-help",
} as const;

export const CircleHelpIcon = createIconComponent(CircleHelp, circleHelpIcon);
