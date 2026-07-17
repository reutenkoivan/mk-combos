import { ArrowLeft } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const returnIcon = {
  accessibleLabel: "Return",
  name: "return",
} as const;

export const ReturnIcon = createIconComponent(ArrowLeft, returnIcon);
