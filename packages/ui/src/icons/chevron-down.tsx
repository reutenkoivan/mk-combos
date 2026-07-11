import { ChevronDown } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const chevronDownIcon = {
  accessibleLabel: "Expand",
  name: "chevron-down",
} as const;

export const ChevronDownIcon = createIconComponent(ChevronDown, chevronDownIcon);
