import type { z } from "zod/v4";

import type {
  Mk1BusinessBuilderContextSchema,
  Mk1BusinessBuilderStateSchema,
  Mk1BusinessComboDetailSchema,
  Mk1BusinessComboLookupSchema,
  Mk1BusinessComboRefSchema,
  Mk1BusinessComboSourceSchema,
  Mk1BusinessCustomComboDetailSchema,
  Mk1BusinessCustomComboSchema,
  Mk1BusinessCustomComboSummarySchema,
  Mk1BusinessLastCatalogSchema,
  Mk1BusinessSeededComboDetailSchema,
  Mk1BusinessSliceSchema,
  Mk1BusinessValidationReportSchema,
  Mk1NamedListItemSchema,
  Mk1NamedListSchema,
  Mk1ResolvedNamedListItemSchema,
  Mk1ResolvedNamedListSchema,
} from "./schema";

export type Mk1BusinessComboSource = z.output<typeof Mk1BusinessComboSourceSchema>;

export type Mk1BusinessComboRef = z.output<typeof Mk1BusinessComboRefSchema>;

export type Mk1BusinessCustomCombo = z.output<typeof Mk1BusinessCustomComboSchema>;

export type Mk1NamedListItem = z.output<typeof Mk1NamedListItemSchema>;

export type Mk1NamedList = z.output<typeof Mk1NamedListSchema>;

export type Mk1BusinessLastCatalog = z.output<typeof Mk1BusinessLastCatalogSchema>;

export type Mk1BusinessSlice = z.output<typeof Mk1BusinessSliceSchema>;

export type Mk1BusinessCustomComboSummary = z.output<typeof Mk1BusinessCustomComboSummarySchema>;

export type Mk1BusinessSeededComboDetail = z.output<typeof Mk1BusinessSeededComboDetailSchema>;

export type Mk1BusinessCustomComboDetail = z.output<typeof Mk1BusinessCustomComboDetailSchema>;

export type Mk1BusinessComboDetail = z.output<typeof Mk1BusinessComboDetailSchema>;

export type Mk1BusinessComboLookup = z.output<typeof Mk1BusinessComboLookupSchema>;

export type Mk1ResolvedNamedListItem = z.output<typeof Mk1ResolvedNamedListItemSchema>;

export type Mk1ResolvedNamedList = z.output<typeof Mk1ResolvedNamedListSchema>;

export type Mk1BusinessValidationReport = z.output<typeof Mk1BusinessValidationReportSchema>;

export type Mk1BusinessBuilderContext = z.output<typeof Mk1BusinessBuilderContextSchema>;

export type Mk1BusinessBuilderState = z.output<typeof Mk1BusinessBuilderStateSchema>;
