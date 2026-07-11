import { ChevronLeft } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const chevronLeftIcon = {
  accessibleLabel: "Previous",
  name: "chevron-left",
} as const;

export const ChevronLeftIcon = createIconComponent(ChevronLeft, chevronLeftIcon);
