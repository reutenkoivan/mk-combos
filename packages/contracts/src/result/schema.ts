import { z } from "zod/v4";

import { validationSeverities } from "./value";

export { validationSeverities } from "./value";

export const ValidationSeveritySchema = z.enum(validationSeverities);

export const ValidationMessageSchema = z
  .object({
    severity: ValidationSeveritySchema,
    message: z.string().min(1),
    code: z.string().min(1).optional(),
    path: z.array(z.string()).readonly().optional(),
  })
  .strict();

export const AppErrorSchema = z
  .object({
    code: z.string().min(1),
    message: z.string().min(1),
    cause: z.unknown().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
    validationMessages: z.array(ValidationMessageSchema).readonly().optional(),
  })
  .strict();
