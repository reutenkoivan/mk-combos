import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import { mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import { mkxlVariations, mkxlVariationsByCharacterId } from "@mk-combos/mkxl-data/variations/value";

import {
  parseMkxlCatalogFiltersFromRouteQuery,
  recoverMkxlCatalogFilters,
  serializeMkxlCatalogFiltersToRouteQuery,
} from "../filters/runtime";
import type { MkxlCatalogFilters } from "../filters/type";
import { MkxlCatalogContextSchema, MkxlCatalogRouteQuerySchema } from "./schema";
import type {
  MkxlCatalogCharacterOption,
  MkxlCatalogContext,
  MkxlCatalogContextOptions,
  MkxlCatalogContextStatus,
  MkxlCatalogPlainRouteQuery,
  MkxlCatalogRecovery,
  MkxlCatalogRouteQuery,
  MkxlCatalogVariationOption,
} from "./type";
import {
  mkxlCatalogContextStatuses,
  mkxlCatalogOptionAvailabilities,
  mkxlCatalogRouteQueryKeys,
} from "./value";

const charactersById = new Map<string, (typeof mkxlCharacters)[number]>();

for (const character of mkxlCharacters) {
  charactersById.set(character.id, character);
}

const variationsById = new Map<string, (typeof mkxlVariations)[number]>();

for (const variation of mkxlVariations) {
  variationsById.set(variation.id, variation);
}

const comboCountByCharacterId = new Map<string, number>();

const comboCountByVariationId = new Map<string, number>();

for (const combo of mkxlSeededCombos) {
  comboCountByCharacterId.set(
    combo.characterId,
    (comboCountByCharacterId.get(combo.characterId) ?? 0) + 1,
  );
  comboCountByVariationId.set(
    combo.variationId,
    (comboCountByVariationId.get(combo.variationId) ?? 0) + 1,
  );
}

const toMessage = (code: string, message: string, path: readonly string[]): ValidationMessage => ({
  severity: "warning",
  code,
  message,
  path,
});

const toList = (value: string | readonly string[] | undefined): readonly string[] => {
  if (value === undefined) {
    return [];
  }

  return typeof value === "string" ? [value] : value;
};

const firstValue = (value: string | readonly string[] | undefined): string | undefined => {
  for (const entry of toList(value)) {
    const trimmedEntry = entry.trim();

    if (trimmedEntry) {
      return trimmedEntry;
    }
  }

  return undefined;
};

const nonEmptyValues = (value: string | readonly string[] | undefined): readonly string[] => {
  const seenValues = new Set<string>();
  const entries: string[] = [];

  for (const entry of toList(value)) {
    const trimmedEntry = entry.trim();

    if (!trimmedEntry || seenValues.has(trimmedEntry)) {
      continue;
    }

    seenValues.add(trimmedEntry);
    entries.push(trimmedEntry);
  }

  return entries;
};

const getCharacterOptions = (): readonly MkxlCatalogCharacterOption[] => {
  const options: MkxlCatalogCharacterOption[] = [];

  for (const character of mkxlCharacters) {
    const comboCount = comboCountByCharacterId.get(character.id) ?? 0;

    options.push({
      id: character.id,
      label: character.label,
      shortLabel: character.shortLabel,
      rosterOrder: character.rosterOrder,
      comboCount,
      availability:
        comboCount > 0
          ? mkxlCatalogOptionAvailabilities.available
          : mkxlCatalogOptionAvailabilities.disabledNoComboData,
    });
  }

  return options;
};

const getVariationOptions = (
  characterId: string | undefined,
): readonly MkxlCatalogVariationOption[] => {
  if (!characterId) {
    return [];
  }

  const options: MkxlCatalogVariationOption[] = [];

  for (const variation of mkxlVariationsByCharacterId[characterId] ?? []) {
    const comboCount = comboCountByVariationId.get(variation.id) ?? 0;

    options.push({
      id: variation.id,
      characterId: variation.characterId,
      label: variation.label,
      variationOrder: variation.variationOrder,
      pickerSlot: variation.pickerSlot,
      comboCount,
      availability:
        comboCount > 0
          ? mkxlCatalogOptionAvailabilities.available
          : mkxlCatalogOptionAvailabilities.disabledNoComboData,
    });
  }

  return options;
};

const canonicalRouteQueryFromInput = (
  query: MkxlCatalogPlainRouteQuery,
): MkxlCatalogPlainRouteQuery => {
  const canonicalQuery: Record<string, string | readonly string[]> = {};
  const addString = (key: string, value: string | undefined) => {
    if (value !== undefined) {
      canonicalQuery[key] = value;
    }
  };
  const addArray = (key: string, values: readonly string[]) => {
    if (values.length > 0) {
      canonicalQuery[key] = values;
    }
  };

  addString("character", firstValue(query.character));
  addString("variation", firstValue(query.variation));
  addArray(mkxlCatalogRouteQueryKeys.starter, nonEmptyValues(query.starter));
  addArray(mkxlCatalogRouteQueryKeys.position, nonEmptyValues(query.position));
  addArray(mkxlCatalogRouteQueryKeys.meter, nonEmptyValues(query.meter));
  addString("damageMin", firstValue(query.damageMin));
  addString("damageMax", firstValue(query.damageMax));
  addArray(mkxlCatalogRouteQueryKeys.difficulty, nonEmptyValues(query.difficulty));
  addArray(mkxlCatalogRouteQueryKeys.routeType, nonEmptyValues(query.routeType));
  addArray(mkxlCatalogRouteQueryKeys.tag, nonEmptyValues(query.tag));
  addString(mkxlCatalogRouteQueryKeys.stage, firstValue(query.stage));
  addArray(mkxlCatalogRouteQueryKeys.interactable, nonEmptyValues(query.interactable));

  return canonicalQuery;
};

export const getMkxlCatalogContextStatus = (
  context: MkxlCatalogContext,
): MkxlCatalogContextStatus => {
  if (context.characterId && context.variationId) {
    return mkxlCatalogContextStatuses.ready;
  }
  if (context.characterId) {
    return mkxlCatalogContextStatuses.characterSelected;
  }

  return mkxlCatalogContextStatuses.empty;
};

export const getMkxlCatalogContextOptions = (
  context: MkxlCatalogContext = {},
): MkxlCatalogContextOptions => ({
  characters: getCharacterOptions(),
  variations: getVariationOptions(context.characterId),
});

export const recoverMkxlCatalogContext = (
  context: MkxlCatalogContext,
  filters: MkxlCatalogFilters = {},
): MkxlCatalogRecovery => {
  const messages: ValidationMessage[] = [];
  const recoveredFilters = recoverMkxlCatalogFilters(filters);
  let recoveredContext = MkxlCatalogContextSchema.parse(context);

  if (recoveredContext.characterId && !charactersById.has(recoveredContext.characterId)) {
    messages.push(
      toMessage(
        "mkxl.catalog.invalid_character",
        "Character context does not exist in MKXL data.",
        ["character"],
      ),
    );
    recoveredContext = {};
  }

  if (recoveredContext.variationId) {
    const variation = variationsById.get(recoveredContext.variationId);

    if (!variation || variation.characterId !== recoveredContext.characterId) {
      messages.push(
        toMessage(
          "mkxl.catalog.invalid_variation",
          "Variation context is not valid for character.",
          ["variation"],
        ),
      );
      recoveredContext = {
        characterId: recoveredContext.characterId,
      };
    }
  }

  return {
    status: getMkxlCatalogContextStatus(recoveredContext),
    context: recoveredContext,
    filters: recoveredFilters.filters,
    messages: [...messages, ...recoveredFilters.messages],
  };
};

export const selectMkxlCatalogCharacter = (characterId: string): MkxlCatalogRecovery =>
  recoverMkxlCatalogContext({ characterId }, {});

export const selectMkxlCatalogVariation = (
  context: MkxlCatalogContext,
  variationId: string,
  filters: MkxlCatalogFilters = {},
): MkxlCatalogRecovery =>
  recoverMkxlCatalogContext(
    {
      characterId: context.characterId,
      variationId,
    },
    filters,
  );

export const parseMkxlCatalogRouteQuery = (
  query: MkxlCatalogPlainRouteQuery,
): MkxlCatalogRecovery => {
  const canonicalQuery = canonicalRouteQueryFromInput(query);
  const parsedFilters = parseMkxlCatalogFiltersFromRouteQuery(canonicalQuery);
  const recovered = recoverMkxlCatalogContext(
    {
      characterId: firstValue(canonicalQuery.character),
      variationId: firstValue(canonicalQuery.variation),
    },
    parsedFilters.filters,
  );

  return {
    ...recovered,
    messages: [...parsedFilters.messages, ...recovered.messages],
  };
};

export const serializeMkxlCatalogRouteQuery = (
  context: MkxlCatalogContext,
  filters: MkxlCatalogFilters = {},
): MkxlCatalogRouteQuery => {
  const recovered = recoverMkxlCatalogContext(context, filters);
  const filterQuery = serializeMkxlCatalogFiltersToRouteQuery(recovered.filters);

  return MkxlCatalogRouteQuerySchema.parse({
    ...filterQuery,
    character: recovered.context.characterId,
    variation: recovered.context.variationId,
  });
};
