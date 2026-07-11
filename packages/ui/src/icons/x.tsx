import { X } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const xIcon = {
  accessibleLabel: "Close",
  name: "x",
} as const;

export const XIcon = createIconComponent(X, xIcon);
