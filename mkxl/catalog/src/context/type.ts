import type { z } from "zod/v4";

import type {
  MkxlCatalogCharacterOptionSchema,
  MkxlCatalogContextOptionsSchema,
  MkxlCatalogContextSchema,
  MkxlCatalogContextStatusSchema,
  MkxlCatalogOptionAvailabilitySchema,
  MkxlCatalogRecoveryCodeSchema,
  MkxlCatalogRecoverySchema,
  MkxlCatalogRequiredContextSchema,
  MkxlCatalogRouteQueryKeySchema,
  MkxlCatalogRouteQuerySchema,
  MkxlCatalogVariationOptionSchema,
} from "./schema";

export {
  mkxlCatalogContextStatuses,
  mkxlCatalogRecoveryCodes,
  mkxlCatalogRouteQueryKeys,
} from "./value";

export type MkxlCatalogContextStatus = z.output<typeof MkxlCatalogContextStatusSchema>;
export type MkxlCatalogOptionAvailability = z.output<typeof MkxlCatalogOptionAvailabilitySchema>;

export type MkxlCatalogRecoveryCode = z.output<typeof MkxlCatalogRecoveryCodeSchema>;

export type MkxlCatalogRouteQueryKey = z.output<typeof MkxlCatalogRouteQueryKeySchema>;

export type MkxlCatalogRequiredContext = z.output<typeof MkxlCatalogRequiredContextSchema>;

export type MkxlCatalogContext = z.output<typeof MkxlCatalogContextSchema>;

export type MkxlCatalogCharacterOption = z.output<typeof MkxlCatalogCharacterOptionSchema>;

export type MkxlCatalogVariationOption = z.output<typeof MkxlCatalogVariationOptionSchema>;

export type MkxlCatalogContextOptions = z.output<typeof MkxlCatalogContextOptionsSchema>;

export type MkxlCatalogRouteQuery = z.output<typeof MkxlCatalogRouteQuerySchema>;

export type MkxlCatalogRecovery = z.output<typeof MkxlCatalogRecoverySchema>;

export type MkxlCatalogPlainRouteQuery = Readonly<
  Record<string, string | readonly string[] | undefined>
>;
