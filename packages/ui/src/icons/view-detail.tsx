import { Eye } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const viewDetailIcon = {
  accessibleLabel: "View detail",
  name: "view-detail",
} as const;

export const ViewDetailIcon = createIconComponent(Eye, viewDetailIcon);
