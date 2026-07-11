import { Trash2 } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const trash2Icon = {
  accessibleLabel: "Delete",
  name: "trash-2",
} as const;

export const Trash2Icon = createIconComponent(Trash2, trash2Icon);
