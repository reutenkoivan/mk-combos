import type { z } from "zod/v4";

import type {
  ControllerCommandGroupSchema,
  ControllerCommandIdSchema,
  ControllerCommandMetadataListSchema,
  ControllerCommandMetadataSchema,
  KnownControllerCommandIdSchema,
} from "./schema";

export {
  controllerCommandGroups,
  controllerCommandMetadata,
  knownControllerCommandIds,
} from "./value";

export type KnownControllerCommandId = z.output<typeof KnownControllerCommandIdSchema>;

export type ControllerCommandId = z.output<typeof ControllerCommandIdSchema>;

export type ControllerCommandGroup = z.output<typeof ControllerCommandGroupSchema>;

export type ControllerCommandMetadata = z.output<typeof ControllerCommandMetadataSchema>;

export type ControllerCommandMetadataList = z.output<typeof ControllerCommandMetadataListSchema>;
