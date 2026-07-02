import type { z } from "zod/v4";

import type { BackupEnvelopeSchema } from "./schema";

export type BackupEnvelope = z.output<typeof BackupEnvelopeSchema>;
