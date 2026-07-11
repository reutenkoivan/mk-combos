import { Search } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const searchIcon = {
  accessibleLabel: "Search",
  name: "search",
} as const;

export const SearchIcon = createIconComponent(Search, searchIcon);
