import { comboSources } from "@mk-combos/contracts/identity/value";
import { mk1Business } from "@mk-combos/mk1-business";
import { mkxlBusiness } from "@mk-combos/mkxl-business";

import {
  type InstalledCatalogOption,
  type InstalledCatalogSearch,
  type InstalledCatalogSelection,
  type InstalledGameCatalogAdapter,
  installedCatalogSelectionStatuses,
} from "./catalog-adapter/type";

export const installedGames = [mkxlBusiness, mk1Business] as const;

const mkxlRootPath = "/mkxl/catalog";
type MkxlCatalogRecovery = ReturnType<typeof mkxlBusiness.catalog.recoverContext>;
type MkxlCatalogContext = MkxlCatalogRecovery["context"];
type MkxlCatalogFilters = MkxlCatalogRecovery["filters"];

const mkxlCharacterOptions = (): readonly InstalledCatalogOption[] =>
  mkxlBusiness.catalog
    .getContextOptions()
    .characters.map((option) => ({
      available: option.comboCount > 0,
      comboCount: option.comboCount,
      id: option.id,
      label: option.label,
      order: option.rosterOrder,
      routeSlug: option.id,
      shortLabel: option.shortLabel,
      slot: {
        column: option.pickerSlot.column,
        responsiveOrder: option.pickerSlot.compactOrder ?? option.rosterOrder,
        row: option.pickerSlot.row,
        slotId: option.pickerSlot.slotId,
      },
    }))
    .sort((left, right) => left.order - right.order);

const mkxlSpecificationSlug = (characterId: string, specificationId: string): string => {
  const prefix = `${characterId}:`;
  return specificationId.startsWith(prefix)
    ? specificationId.slice(prefix.length)
    : specificationId;
};

const mkxlInteractableShortLabel = (interactableId: string): string => {
  const separatorIndex = interactableId.indexOf(":");
  const token = separatorIndex >= 0 ? interactableId.slice(separatorIndex + 1) : interactableId;
  const words = token.replaceAll(/[-_]+/gu, " ").trim();

  return words ? (words[0]?.toUpperCase() ?? "") + words.slice(1) : interactableId;
};

const mkxlSpecificationOptions = (characterId: string): readonly InstalledCatalogOption[] =>
  mkxlBusiness.catalog
    .getContextOptions({ characterId })
    .variations.map((option) => ({
      available: option.comboCount > 0,
      comboCount: option.comboCount,
      id: option.id,
      label: option.label,
      order: option.variationOrder,
      routeSlug: mkxlSpecificationSlug(characterId, option.id),
      slot: {
        column: option.pickerSlot.column,
        responsiveOrder: option.pickerSlot.compactOrder ?? option.variationOrder,
        row: option.pickerSlot.row,
        slotId: option.pickerSlot.slotId,
      },
    }))
    .sort((left, right) => left.order - right.order);

function resolveMkxlComboRef(
  input: Parameters<InstalledGameCatalogAdapter["resolveComboRef"]>[0],
): ReturnType<InstalledGameCatalogAdapter["resolveComboRef"]> {
  const characterOption = mkxlCharacterOptions().find(
    (option) => option.routeSlug === input.characterSlug,
  );
  const specificationOption = characterOption
    ? mkxlSpecificationOptions(characterOption.id).find(
        (option) => option.routeSlug === input.specificationSlug,
      )
    : undefined;

  if (!characterOption || !specificationOption) {
    return undefined;
  }

  const matches = [];

  for (const source of [comboSources.seeded, comboSources.custom]) {
    const ref = { comboId: input.comboId, gameId: "mkxl", source } as const;
    const result = mkxlBusiness.detail.lookup({ ref, slice: input.slice });

    if (!result.ok || result.value.status !== "found") {
      continue;
    }

    const { character, variation } = result.value.detail.summary;

    if (character.id === characterOption.id && variation.id === specificationOption.id) {
      matches.push(ref);
    }
  }

  return matches.length === 1 ? matches[0] : undefined;
}

function mkxlSelectionFromRecovery(
  recovery: MkxlCatalogRecovery,
  requestedStatus?: InstalledCatalogSelection["status"],
): InstalledCatalogSelection {
  const characterId = recovery.context.characterId;
  const specificationId = recovery.context.variationId;

  return {
    canonicalSearch: mkxlBusiness.catalog.serializeFilterQuery(recovery.filters),
    characterId,
    characterSlug: characterId,
    filters: recovery.filters,
    messages: recovery.messages,
    rawContext: recovery.context,
    specificationId,
    specificationSlug:
      characterId && specificationId
        ? mkxlSpecificationSlug(characterId, specificationId)
        : undefined,
    status:
      requestedStatus ??
      (characterId && specificationId
        ? installedCatalogSelectionStatuses.ready
        : characterId
          ? installedCatalogSelectionStatuses.character
          : installedCatalogSelectionStatuses.empty),
  };
}

function resolveMkxlPath(
  input: Readonly<{
    characterSlug?: string;
    search?: InstalledCatalogSearch;
    specificationSlug?: string;
  }>,
): InstalledCatalogSelection {
  const parsedFilters = mkxlBusiness.catalog.parseFilterQuery(input.search ?? {});
  const recover = (context: MkxlCatalogContext) => {
    const recovered = mkxlBusiness.catalog.recoverContext(context, parsedFilters.filters);

    return {
      ...recovered,
      messages: [...parsedFilters.messages, ...recovered.messages],
    };
  };
  const character = input.characterSlug
    ? mkxlCharacterOptions().find((option) => option.routeSlug === input.characterSlug)
    : undefined;

  if (input.characterSlug && !character) {
    return mkxlSelectionFromRecovery(
      recover({}),
      installedCatalogSelectionStatuses.invalidCharacter,
    );
  }

  if (!character) {
    return mkxlSelectionFromRecovery(recover({}));
  }

  const specification = input.specificationSlug
    ? mkxlSpecificationOptions(character.id).find(
        (option) => option.routeSlug === input.specificationSlug,
      )
    : undefined;

  if (input.specificationSlug && !specification) {
    return mkxlSelectionFromRecovery(
      recover({ characterId: character.id }),
      installedCatalogSelectionStatuses.invalidSpecification,
    );
  }

  return mkxlSelectionFromRecovery(
    recover({ characterId: character.id, variationId: specification?.id }),
  );
}

const mkxlCatalogAdapter = {
  applyFilterChange: (selection, change) => {
    const recovered = mkxlBusiness.catalog.applyFilterChange({
      change,
      context: selection.rawContext as MkxlCatalogContext,
      filters: selection.filters as MkxlCatalogFilters,
    });
    return mkxlSelectionFromRecovery(recovered);
  },
  buildCharacterPath: (characterSlug) => `${mkxlRootPath}/${characterSlug}`,
  buildResultPath: (characterSlug, specificationSlug) =>
    `${mkxlRootPath}/${characterSlug}/${specificationSlug}`,
  characterOptions: mkxlCharacterOptions,
  contextKind: "variation",
  filterSearchKeys: [
    "position",
    "meter",
    "difficulty",
    "routeClass",
    "source",
    "stage",
    "interactable",
  ],
  gameId: "mkxl",
  getFilterFacets: (selection) =>
    mkxlBusiness.catalog
      .getFilterFacets(
        selection.rawContext as MkxlCatalogContext,
        selection.filters as MkxlCatalogFilters,
      )
      .map((facet) => ({
        id: facet.id,
        ...(facet.kind === "singleSelect"
          ? { imageKind: "stage" as const }
          : facet.id === "interactable"
            ? { imageKind: "interactable" as const }
            : {}),
        kind: facet.kind,
        options: facet.options.map((option) => ({
          count: option.count,
          disabled: option.disabled,
          disabledReason: option.disabledReason,
          id: option.id,
          label: option.label,
          selected: option.selected,
          ...(facet.id === "interactable"
            ? { shortLabel: mkxlInteractableShortLabel(option.id) }
            : {}),
        })),
        presentation:
          facet.kind === "singleSelect" || facet.id === "interactable"
            ? ("visual" as const)
            : ("compact" as const),
      })),
  resolveComboRef: resolveMkxlComboRef,
  resolvePath: resolveMkxlPath,
  restoreLastCatalog: (slice) => {
    const restored = mkxlBusiness.catalog.restoreLastCatalog(slice);
    return restored.ok
      ? { ok: true, selection: mkxlSelectionFromRecovery(restored.value) }
      : { ok: false };
  },
  rootPath: mkxlRootPath,
  saveLastCatalog: (slice, selection) =>
    mkxlBusiness.catalog.saveLastCatalog({
      context: selection.rawContext as MkxlCatalogContext,
      filters: selection.filters as MkxlCatalogFilters,
      slice,
    }),
  selectSummaries: (selection) =>
    mkxlBusiness.catalog
      .selectSeededSummaries({
        context: selection.rawContext as MkxlCatalogContext,
        filters: selection.filters as MkxlCatalogFilters,
      })
      .map((summary) => ({
        cachedNotation: summary.cachedNotation,
        character: summary.character,
        metadata: summary.metadata,
        notes: summary.notes,
        provenance: summary.provenance,
        ref: summary.ref,
        routeSteps: summary.routeSteps,
        sourceIds: summary.sourceIds,
        specification: summary.variation,
        title: summary.title,
      })),
  specificationOptions: mkxlSpecificationOptions,
} satisfies InstalledGameCatalogAdapter;

const mk1RootPath = "/mk1/catalog";
type Mk1CatalogRecovery = ReturnType<typeof mk1Business.catalog.recoverContext>;
type Mk1CatalogContext = Mk1CatalogRecovery["context"];
type Mk1CatalogFilters = Mk1CatalogRecovery["filters"];

const mk1CharacterOptions = (): readonly InstalledCatalogOption[] =>
  mk1Business.catalog
    .getContextOptions()
    .characters.map((option) => ({
      available: option.comboCount > 0,
      comboCount: option.comboCount,
      id: option.id,
      label: option.label,
      order: option.rosterOrder,
      routeSlug: option.id,
      shortLabel: option.shortLabel,
      slot: {
        column: option.pickerSlot.column,
        responsiveOrder: option.pickerSlot.compactOrder ?? option.rosterOrder,
        row: option.pickerSlot.row,
        slotId: option.pickerSlot.slotId,
      },
    }))
    .sort((left, right) => left.order - right.order);

const mk1SpecificationOptions = (characterId: string): readonly InstalledCatalogOption[] =>
  mk1Business.catalog
    .getContextOptions({ characterId })
    .kameos.map((option) => ({
      available: option.comboCount > 0,
      comboCount: option.comboCount,
      id: option.id,
      label: option.label,
      order: option.kameoOrder,
      routeSlug: option.id,
      shortLabel: option.shortLabel,
      slot: {
        column: option.pickerSlot.column,
        responsiveOrder: option.pickerSlot.compactOrder ?? option.kameoOrder,
        row: option.pickerSlot.row,
        slotId: option.pickerSlot.slotId,
      },
    }))
    .sort((left, right) => left.order - right.order);

function resolveMk1ComboRef(
  input: Parameters<InstalledGameCatalogAdapter["resolveComboRef"]>[0],
): ReturnType<InstalledGameCatalogAdapter["resolveComboRef"]> {
  const characterOption = mk1CharacterOptions().find(
    (option) => option.routeSlug === input.characterSlug,
  );
  const specificationOption = characterOption
    ? mk1SpecificationOptions(characterOption.id).find(
        (option) => option.routeSlug === input.specificationSlug,
      )
    : undefined;

  if (!characterOption || !specificationOption) {
    return undefined;
  }

  const matches = [];

  for (const source of [comboSources.seeded, comboSources.custom]) {
    const ref = { comboId: input.comboId, gameId: "mk1", source } as const;
    const result = mk1Business.detail.lookup({ ref, slice: input.slice });

    if (!result.ok || result.value.status !== "found") {
      continue;
    }

    const { character, kameo } = result.value.detail.summary;

    if (character.id === characterOption.id && kameo.id === specificationOption.id) {
      matches.push(ref);
    }
  }

  return matches.length === 1 ? matches[0] : undefined;
}

function mk1SelectionFromRecovery(
  recovery: Mk1CatalogRecovery,
  requestedStatus?: InstalledCatalogSelection["status"],
): InstalledCatalogSelection {
  const characterId = recovery.context.characterId;
  const specificationId = recovery.context.kameoId;

  return {
    canonicalSearch: mk1Business.catalog.serializeFilterQuery(recovery.filters),
    characterId,
    characterSlug: characterId,
    filters: recovery.filters,
    messages: recovery.messages,
    rawContext: recovery.context,
    specificationId,
    specificationSlug: specificationId,
    status:
      requestedStatus ??
      (characterId && specificationId
        ? installedCatalogSelectionStatuses.ready
        : characterId
          ? installedCatalogSelectionStatuses.character
          : installedCatalogSelectionStatuses.empty),
  };
}

function resolveMk1Path(
  input: Readonly<{
    characterSlug?: string;
    search?: InstalledCatalogSearch;
    specificationSlug?: string;
  }>,
): InstalledCatalogSelection {
  const parsedFilters = mk1Business.catalog.parseFilterQuery(input.search ?? {});
  const recover = (context: Mk1CatalogContext) => {
    const recovered = mk1Business.catalog.recoverContext(context, parsedFilters.filters);

    return {
      ...recovered,
      messages: [...parsedFilters.messages, ...recovered.messages],
    };
  };
  const character = input.characterSlug
    ? mk1CharacterOptions().find((option) => option.routeSlug === input.characterSlug)
    : undefined;

  if (input.characterSlug && !character) {
    return mk1SelectionFromRecovery(
      recover({}),
      installedCatalogSelectionStatuses.invalidCharacter,
    );
  }

  if (!character) {
    return mk1SelectionFromRecovery(recover({}));
  }

  const specification = input.specificationSlug
    ? mk1SpecificationOptions(character.id).find(
        (option) => option.routeSlug === input.specificationSlug,
      )
    : undefined;

  if (input.specificationSlug && !specification) {
    return mk1SelectionFromRecovery(
      recover({ characterId: character.id }),
      installedCatalogSelectionStatuses.invalidSpecification,
    );
  }

  return mk1SelectionFromRecovery(
    recover({ characterId: character.id, kameoId: specification?.id }),
  );
}

const mk1CatalogAdapter = {
  applyFilterChange: (selection, change) => {
    const recovered = mk1Business.catalog.applyFilterChange({
      change,
      context: selection.rawContext as Mk1CatalogContext,
      filters: selection.filters as Mk1CatalogFilters,
    });
    return mk1SelectionFromRecovery(recovered);
  },
  buildCharacterPath: (characterSlug) => `${mk1RootPath}/${characterSlug}`,
  buildResultPath: (characterSlug, specificationSlug) =>
    `${mk1RootPath}/${characterSlug}/${specificationSlug}`,
  characterOptions: mk1CharacterOptions,
  contextKind: "kameo",
  filterSearchKeys: ["position", "meter", "difficulty", "routeClass", "source"],
  gameId: "mk1",
  getFilterFacets: (selection) =>
    mk1Business.catalog
      .getFilterFacets(
        selection.rawContext as Mk1CatalogContext,
        selection.filters as Mk1CatalogFilters,
      )
      .map((facet) => ({
        id: facet.id,
        kind: facet.kind,
        options: facet.options.map((option) => ({
          count: option.count,
          disabled: option.disabled,
          disabledReason: option.disabledReason,
          id: option.id,
          label: option.label,
          selected: option.selected,
        })),
        presentation: "compact" as const,
      })),
  resolveComboRef: resolveMk1ComboRef,
  resolvePath: resolveMk1Path,
  restoreLastCatalog: (slice) => {
    const restored = mk1Business.catalog.restoreLastCatalog(slice);
    return restored.ok
      ? { ok: true, selection: mk1SelectionFromRecovery(restored.value) }
      : { ok: false };
  },
  rootPath: mk1RootPath,
  saveLastCatalog: (slice, selection) =>
    mk1Business.catalog.saveLastCatalog({
      context: selection.rawContext as Mk1CatalogContext,
      filters: selection.filters as Mk1CatalogFilters,
      slice,
    }),
  selectSummaries: (selection) =>
    mk1Business.catalog
      .selectSeededSummaries({
        context: selection.rawContext as Mk1CatalogContext,
        filters: selection.filters as Mk1CatalogFilters,
      })
      .map((summary) => ({
        cachedNotation: summary.cachedNotation,
        character: summary.character,
        metadata: summary.metadata,
        notes: summary.notes,
        provenance: summary.provenance,
        ref: summary.ref,
        routeSteps: summary.routeSteps,
        sourceIds: summary.sourceIds,
        specification: summary.kameo,
        title: summary.title,
      })),
  specificationOptions: mk1SpecificationOptions,
} satisfies InstalledGameCatalogAdapter;

export const installedGameCatalogAdapters = [mkxlCatalogAdapter, mk1CatalogAdapter] as const;
