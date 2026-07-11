import type { ValidationMessage } from "@mk-combos/contracts/result/type";

export const createMk1BuilderMessage = (
  code: string,
  message: string,
  path: readonly string[],
): ValidationMessage => ({
  severity: "warning",
  code,
  message,
  path,
});
