import type { ValidationMessage } from "@mk-combos/contracts/result/type";

export const createMkxlBuilderMessage = (
  code: string,
  message: string,
  path: readonly string[],
): ValidationMessage => ({
  severity: "error",
  code,
  message,
  path,
});
