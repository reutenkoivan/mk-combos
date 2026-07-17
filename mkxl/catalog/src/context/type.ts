import type { z } from "zod/v4";

import type {
  MkxlCatalogCharacterOptionSchema,
  MkxlCatalogContextOptionsSchema,
  MkxlCatalogContextSchema,
  MkxlCatalogContextStatusSchema,
  MkxlCatalogOptionAvailabilitySchema,
  MkxlCatalogRecoveryCodeSchema,
  MkxlCatalogRecoverySchema,
  MkxlCatalogVariationOptionSchema,
} from "./schema";

export type MkxlCatalogContextStatus = z.output<typeof MkxlCatalogContextStatusSchema>;
export type MkxlCatalogOptionAvailability = z.output<typeof MkxlCatalogOptionAvailabilitySchema>;
export type MkxlCatalogRecoveryCode = z.output<typeof MkxlCatalogRecoveryCodeSchema>;
export type MkxlCatalogContext = z.output<typeof MkxlCatalogContextSchema>;
export type MkxlCatalogCharacterOption = z.output<typeof MkxlCatalogCharacterOptionSchema>;
export type MkxlCatalogVariationOption = z.output<typeof MkxlCatalogVariationOptionSchema>;
export type MkxlCatalogContextOptions = z.output<typeof MkxlCatalogContextOptionsSchema>;
export type MkxlCatalogRecovery = z.output<typeof MkxlCatalogRecoverySchema>;
