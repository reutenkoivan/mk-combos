import { Plus } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const plusIcon = {
  accessibleLabel: "Add",
  name: "plus",
} as const;

export const PlusIcon = createIconComponent(Plus, plusIcon);
