import type { z } from "zod/v4";

import type { GameBackupEnvelopeSchema } from "./schema";

export type GameBackupEnvelope = z.output<typeof GameBackupEnvelopeSchema>;
