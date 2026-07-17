import type { z } from "zod/v4";

import type {
  Mk1CatalogCharacterOptionSchema,
  Mk1CatalogContextOptionsSchema,
  Mk1CatalogContextSchema,
  Mk1CatalogContextStatusSchema,
  Mk1CatalogKameoOptionSchema,
  Mk1CatalogOptionAvailabilitySchema,
  Mk1CatalogRecoveryCodeSchema,
} from "./schema";

export type Mk1CatalogContextStatus = z.output<typeof Mk1CatalogContextStatusSchema>;
export type Mk1CatalogRecoveryCode = z.output<typeof Mk1CatalogRecoveryCodeSchema>;
export type Mk1CatalogContext = z.output<typeof Mk1CatalogContextSchema>;
export type Mk1CatalogOptionAvailability = z.output<typeof Mk1CatalogOptionAvailabilitySchema>;
export type Mk1CatalogCharacterOption = z.output<typeof Mk1CatalogCharacterOptionSchema>;
export type Mk1CatalogKameoOption = z.output<typeof Mk1CatalogKameoOptionSchema>;
export type Mk1CatalogContextOptions = z.output<typeof Mk1CatalogContextOptionsSchema>;

export type Mk1CatalogRecovery = {
  readonly status: Mk1CatalogContextStatus;
  readonly context: Mk1CatalogContext;
  readonly filters: import("../filters/type").Mk1CatalogFilters;
  readonly messages: readonly import("@mk-combos/contracts/result/type").ValidationMessage[];
};
