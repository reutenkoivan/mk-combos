import { ChevronRight } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const chevronRightIcon = {
  accessibleLabel: "Next",
  name: "chevron-right",
} as const;

export const ChevronRightIcon = createIconComponent(ChevronRight, chevronRightIcon);
