import { Edit } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const editIcon = {
  accessibleLabel: "Edit",
  name: "edit",
} as const;

export const EditIcon = createIconComponent(Edit, editIcon);
