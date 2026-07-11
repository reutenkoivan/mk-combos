import { Download } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const downloadIcon = {
  accessibleLabel: "Download",
  name: "download",
} as const;

export const DownloadIcon = createIconComponent(Download, downloadIcon);
