export type { APIRequestContext, Page, PlaywrightTestConfig } from "@playwright/test";
export { expect, request, test } from "@playwright/test";

const normalizeIdentifier = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createE2eRunId = (prefix = "e2e") => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8);

  return normalizeIdentifier(`${prefix}-${timestamp}-${random}`);
};

export const createE2eSlug = (runId: string, prefix = "e2e") =>
  normalizeIdentifier(`${prefix}-${runId}`);
