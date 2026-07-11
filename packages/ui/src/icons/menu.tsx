import { Menu } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const menuIcon = {
  accessibleLabel: "Menu",
  name: "menu",
} as const;

export const MenuIcon = createIconComponent(Menu, menuIcon);
