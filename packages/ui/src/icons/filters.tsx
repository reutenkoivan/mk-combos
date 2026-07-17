import { ListFilter } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const filtersIcon = {
  accessibleLabel: "Filters",
  name: "filters",
} as const;

export const FiltersIcon = createIconComponent(ListFilter, filtersIcon);
