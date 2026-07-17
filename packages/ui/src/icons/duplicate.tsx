import { Copy } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const duplicateIcon = {
  accessibleLabel: "Duplicate",
  name: "duplicate",
} as const;

export const DuplicateIcon = createIconComponent(Copy, duplicateIcon);
