import type { CatalogFilterChange } from "@mk-combos/contracts/catalog-filter/type";
import type { ComboRef, GameId } from "@mk-combos/contracts/identity/type";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type { LocalizedText } from "@mk-combos/contracts/settings/type";

type InstalledCatalogContextKind = "kameo" | "variation";

export type InstalledCatalogSearch = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

type InstalledCatalogPickerSlot = Readonly<{
  column: number;
  responsiveOrder: number;
  row: number;
  slotId: string;
}>;

export type InstalledCatalogOption = Readonly<{
  available: boolean;
  comboCount: number;
  id: string;
  label: LocalizedText;
  order: number;
  routeSlug: string;
  shortLabel?: LocalizedText;
  slot?: InstalledCatalogPickerSlot;
}>;

export type InstalledCatalogFacet = Readonly<{
  id: string;
  imageKind?: "interactable" | "stage";
  kind: "multiSelect" | "singleSelect";
  options: readonly Readonly<{
    count: number;
    disabled?: boolean;
    disabledReason?: LocalizedText;
    id: string;
    label: LocalizedText | string;
    selected: boolean;
    shortLabel?: LocalizedText | string;
  }>[];
  presentation: "compact" | "visual";
}>;

export type InstalledCatalogSummary = Readonly<{
  cachedNotation: readonly (readonly string[])[];
  character: Readonly<{
    id: string;
    label: LocalizedText;
  }>;
  metadata: Readonly<{
    damage?: number;
    difficulty?: string;
    meter?: number;
    position?: string;
    routeType?: string;
  }>;
  notes?: LocalizedText;
  provenance: string;
  ref: ComboRef;
  routeSteps: readonly Readonly<{
    emphasis: string;
    kind: string;
    notation: readonly string[];
    repetitionCount: number;
  }>[];
  sourceIds: readonly string[];
  specification: Readonly<{
    id: string;
    label: LocalizedText;
  }>;
  title: LocalizedText;
}>;

export const installedCatalogSelectionStatuses = {
  character: "character",
  empty: "empty",
  invalidCharacter: "invalidCharacter",
  invalidSpecification: "invalidSpecification",
  ready: "ready",
} as const;

export type InstalledCatalogSelectionStatus =
  (typeof installedCatalogSelectionStatuses)[keyof typeof installedCatalogSelectionStatuses];

export type InstalledCatalogSelection = Readonly<{
  canonicalSearch: InstalledCatalogSearch;
  characterId?: string;
  characterSlug?: string;
  filters: unknown;
  messages: readonly ValidationMessage[];
  rawContext: unknown;
  specificationId?: string;
  specificationSlug?: string;
  status: InstalledCatalogSelectionStatus;
}>;

type InstalledCatalogRestoreResult =
  | Readonly<{ ok: true; selection: InstalledCatalogSelection }>
  | Readonly<{ ok: false }>;

type InstalledCatalogSaveResult = Readonly<{ ok: true; value: unknown }> | Readonly<{ ok: false }>;

export type InstalledGameCatalogAdapter = Readonly<{
  applyFilterChange: (
    selection: InstalledCatalogSelection,
    change: CatalogFilterChange,
  ) => InstalledCatalogSelection;
  buildCharacterPath: (characterSlug: string) => string;
  buildResultPath: (characterSlug: string, specificationSlug: string) => string;
  characterOptions: () => readonly InstalledCatalogOption[];
  contextKind: InstalledCatalogContextKind;
  filterSearchKeys: readonly string[];
  gameId: GameId;
  getFilterFacets: (selection: InstalledCatalogSelection) => readonly InstalledCatalogFacet[];
  resolveComboRef: (
    input: Readonly<{
      characterSlug: string;
      comboId: ComboRef["comboId"];
      slice: unknown;
      specificationSlug: string;
    }>,
  ) => ComboRef | undefined;
  resolvePath: (
    input: Readonly<{
      characterSlug?: string;
      search?: InstalledCatalogSearch;
      specificationSlug?: string;
    }>,
  ) => InstalledCatalogSelection;
  restoreLastCatalog: (slice: unknown) => InstalledCatalogRestoreResult;
  rootPath: string;
  saveLastCatalog: (
    slice: unknown,
    selection: InstalledCatalogSelection,
  ) => InstalledCatalogSaveResult;
  selectSummaries: (selection: InstalledCatalogSelection) => readonly InstalledCatalogSummary[];
  specificationOptions: (characterId: string) => readonly InstalledCatalogOption[];
}>;
