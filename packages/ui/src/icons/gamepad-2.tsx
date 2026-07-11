import { Gamepad2 } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const gamepad2Icon = {
  accessibleLabel: "Controller",
  name: "gamepad-2",
} as const;

export const Gamepad2Icon = createIconComponent(Gamepad2, gamepad2Icon);
