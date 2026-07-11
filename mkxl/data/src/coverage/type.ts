import type { z } from "zod/v4";

import type {
  MkxlCoverageTargetsSchema,
  MkxlDataValidationCountsSchema,
  MkxlDataValidationIssueSchema,
  MkxlDataValidationResultSchema,
} from "./schema";

export type MkxlCoverageTargets = z.output<typeof MkxlCoverageTargetsSchema>;

export type MkxlDataValidationIssue = z.output<typeof MkxlDataValidationIssueSchema>;

export type MkxlDataValidationCounts = z.output<typeof MkxlDataValidationCountsSchema>;

export type MkxlDataValidationResult = z.output<typeof MkxlDataValidationResultSchema>;
