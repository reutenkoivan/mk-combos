import { ListPlus } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const addToListIcon = {
  accessibleLabel: "Add to list",
  name: "add-to-list",
} as const;

export const AddToListIcon = createIconComponent(ListPlus, addToListIcon);
