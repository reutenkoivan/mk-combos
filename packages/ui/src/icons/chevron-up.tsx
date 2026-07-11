import { ChevronUp } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const chevronUpIcon = {
  accessibleLabel: "Collapse",
  name: "chevron-up",
} as const;

export const ChevronUpIcon = createIconComponent(ChevronUp, chevronUpIcon);
