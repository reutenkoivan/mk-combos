import type { z } from "zod/v4";

import type {
  Mk1CoverageTargetsSchema,
  Mk1DataValidationCountsSchema,
  Mk1DataValidationIssueSchema,
  Mk1DataValidationResultSchema,
} from "./schema";

export type Mk1CoverageTargets = z.output<typeof Mk1CoverageTargetsSchema>;

export type Mk1DataValidationIssue = z.output<typeof Mk1DataValidationIssueSchema>;

export type Mk1DataValidationCounts = z.output<typeof Mk1DataValidationCountsSchema>;

export type Mk1DataValidationResult = z.output<typeof Mk1DataValidationResultSchema>;
