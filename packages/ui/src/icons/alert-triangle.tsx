import { AlertTriangle } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const alertTriangleIcon = {
  accessibleLabel: "Alert",
  name: "alert-triangle",
} as const;

export const AlertTriangleIcon = createIconComponent(AlertTriangle, alertTriangleIcon);
