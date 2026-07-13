import type { LocalizedText } from "@mk-combos/contracts/settings/type";
import type { z } from "zod/v4";

import type {
  Mk1CatalogContextSchema,
  Mk1CatalogContextStatusSchema,
  Mk1CatalogPlainRouteQuerySchema,
  Mk1CatalogRecoveryCodeSchema,
  Mk1CatalogRequiredContextSchema,
  Mk1CatalogRouteQueryKeySchema,
  Mk1CatalogRouteQuerySchema,
} from "./schema";
import type { mk1CatalogOptionAvailabilities } from "./value";

export {
  mk1CatalogContextStatuses,
  mk1CatalogRecoveryCodes,
  mk1CatalogRouteQueryKeys,
} from "./value";

export type Mk1CatalogContextStatus = z.output<typeof Mk1CatalogContextStatusSchema>;

export type Mk1CatalogRecoveryCode = z.output<typeof Mk1CatalogRecoveryCodeSchema>;

export type Mk1CatalogRouteQueryKey = z.output<typeof Mk1CatalogRouteQueryKeySchema>;

export type Mk1CatalogContext = z.output<typeof Mk1CatalogContextSchema>;

export type Mk1CatalogRequiredContext = z.output<typeof Mk1CatalogRequiredContextSchema>;

export type Mk1CatalogPlainRouteQuery = z.output<typeof Mk1CatalogPlainRouteQuerySchema>;

export type Mk1CatalogRouteQuery = z.output<typeof Mk1CatalogRouteQuerySchema>;

export type Mk1CatalogOptionAvailability =
  (typeof mk1CatalogOptionAvailabilities)[keyof typeof mk1CatalogOptionAvailabilities];

export type Mk1CatalogCharacterOption = {
  readonly id: string;
  readonly label: LocalizedText;
  readonly shortLabel?: LocalizedText;
  readonly rosterOrder: number;
  readonly comboCount: number;
  readonly availability: Mk1CatalogOptionAvailability;
};

export type Mk1CatalogKameoOption = {
  readonly id: string;
  readonly label: LocalizedText;
  readonly shortLabel?: LocalizedText;
  readonly kameoOrder: number;
  readonly comboCount: number;
  readonly availability: Mk1CatalogOptionAvailability;
};

export type Mk1CatalogContextOptions = {
  readonly characters: readonly Mk1CatalogCharacterOption[];
  readonly kameos: readonly Mk1CatalogKameoOption[];
};

export type Mk1CatalogRecovery = {
  readonly status: Mk1CatalogContextStatus;
  readonly context: Mk1CatalogContext;
  readonly filters: import("../filters/type").Mk1CatalogFilters;
  readonly messages: readonly import("@mk-combos/contracts/result/type").ValidationMessage[];
};
