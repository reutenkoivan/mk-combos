import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type { ComboCardModel } from "@mk-combos/ui/components/combo-card";
import type { ActiveFilterChip, FilterFacet } from "@mk-combos/ui/components/filter-control-group";
import type { PickerOption, PickerSlot } from "@mk-combos/ui/components/type";

import type {
  InstalledCatalogSelection,
  InstalledCatalogSelectionStatus,
} from "../../../game-business/installed-games/catalog-adapter/type";
import type { CatalogSearch } from "../search/type";

export type CatalogContextKind = "kameo" | "variation";

export type CatalogSnapshot = Readonly<{
  activeFilters: readonly ActiveFilterChip[];
  canonicalSearch: CatalogSearch;
  cards: readonly ComboCardModel[];
  characterId?: string;
  characterOptions: readonly PickerOption[];
  characterSlots: readonly PickerSlot[];
  characterSlug?: string;
  contextId?: string;
  contextKind: CatalogContextKind;
  contextOptions: readonly PickerOption[];
  contextSlots: readonly PickerSlot[];
  contextSlug?: string;
  filters: unknown;
  facets: readonly FilterFacet[];
  messages: readonly ValidationMessage[];
  rawContext: unknown;
  restoreFailed: boolean;
  selection: InstalledCatalogSelection;
  selectionStatus: InstalledCatalogSelectionStatus;
}>;
