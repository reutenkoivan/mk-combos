import type { z } from "zod/v4";

import type {
  MkxlBusinessBuilderContextSchema,
  MkxlBusinessBuilderStateSchema,
  MkxlBusinessComboDetailSchema,
  MkxlBusinessComboLookupSchema,
  MkxlBusinessComboRefSchema,
  MkxlBusinessComboSourceSchema,
  MkxlBusinessCustomComboDetailSchema,
  MkxlBusinessCustomComboSchema,
  MkxlBusinessCustomComboSummarySchema,
  MkxlBusinessLastCatalogSchema,
  MkxlBusinessSeededComboDetailSchema,
  MkxlBusinessSliceSchema,
  MkxlBusinessValidationReportSchema,
  MkxlNamedListItemSchema,
  MkxlNamedListSchema,
  MkxlResolvedNamedListItemSchema,
  MkxlResolvedNamedListSchema,
} from "./schema";

export type MkxlBusinessComboSource = z.output<typeof MkxlBusinessComboSourceSchema>;

export type MkxlBusinessComboRef = z.output<typeof MkxlBusinessComboRefSchema>;

export type MkxlBusinessCustomCombo = z.output<typeof MkxlBusinessCustomComboSchema>;

export type MkxlNamedListItem = z.output<typeof MkxlNamedListItemSchema>;

export type MkxlNamedList = z.output<typeof MkxlNamedListSchema>;

export type MkxlBusinessLastCatalog = z.output<typeof MkxlBusinessLastCatalogSchema>;

export type MkxlBusinessSlice = z.output<typeof MkxlBusinessSliceSchema>;

export type MkxlBusinessCustomComboSummary = z.output<typeof MkxlBusinessCustomComboSummarySchema>;

export type MkxlBusinessSeededComboDetail = z.output<typeof MkxlBusinessSeededComboDetailSchema>;

export type MkxlBusinessCustomComboDetail = z.output<typeof MkxlBusinessCustomComboDetailSchema>;

export type MkxlBusinessComboDetail = z.output<typeof MkxlBusinessComboDetailSchema>;

export type MkxlBusinessComboLookup = z.output<typeof MkxlBusinessComboLookupSchema>;

export type MkxlResolvedNamedListItem = z.output<typeof MkxlResolvedNamedListItemSchema>;

export type MkxlResolvedNamedList = z.output<typeof MkxlResolvedNamedListSchema>;

export type MkxlBusinessValidationReport = z.output<typeof MkxlBusinessValidationReportSchema>;

export type MkxlBusinessBuilderContext = z.output<typeof MkxlBusinessBuilderContextSchema>;

export type MkxlBusinessBuilderState = z.output<typeof MkxlBusinessBuilderStateSchema>;
