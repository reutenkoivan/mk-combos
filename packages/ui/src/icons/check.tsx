import { Check } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const checkIcon = {
  accessibleLabel: "Check",
  name: "check",
} as const;

export const CheckIcon = createIconComponent(Check, checkIcon);
