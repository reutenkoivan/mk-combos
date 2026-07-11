import { Upload } from "lucide-react";

import { createIconComponent } from "./create-icon";

export const uploadIcon = {
  accessibleLabel: "Upload",
  name: "upload",
} as const;

export const UploadIcon = createIconComponent(Upload, uploadIcon);
