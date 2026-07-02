import type { z } from "zod/v4";

import type { AppErrorSchema, ValidationMessageSchema, ValidationSeveritySchema } from "./schema";

export { validationSeverities } from "./value";

export type ValidationSeverity = z.output<typeof ValidationSeveritySchema>;

export type ValidationMessage = z.output<typeof ValidationMessageSchema>;

export type AppError = z.output<typeof AppErrorSchema>;

export type AppOk<T> = {
  ok: true;
  value: T;
};

export type AppErr<E extends AppError = AppError> = {
  ok: false;
  error: E;
};

export type AppResult<T, E extends AppError = AppError> = AppOk<T> | AppErr<E>;
