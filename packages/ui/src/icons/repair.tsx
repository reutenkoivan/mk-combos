import { Wrench } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const repairIcon = {
  accessibleLabel: "Repair",
  name: "repair",
} as const;

export const RepairIcon = createIconComponent(Wrench, repairIcon);
