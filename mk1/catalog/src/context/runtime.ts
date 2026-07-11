import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";

import {
  parseMk1CatalogFiltersFromRouteQuery,
  recoverMk1CatalogFilters,
  serializeMk1CatalogFiltersToRouteQuery,
} from "../filters/runtime";
import type { Mk1CatalogFilters } from "../filters/type";
import { Mk1CatalogContextSchema, Mk1CatalogRouteQuerySchema } from "./schema";
import type {
  Mk1CatalogCharacterOption,
  Mk1CatalogContext,
  Mk1CatalogContextOptions,
  Mk1CatalogContextStatus,
  Mk1CatalogKameoOption,
  Mk1CatalogPlainRouteQuery,
  Mk1CatalogRecovery,
  Mk1CatalogRouteQuery,
} from "./type";

const charactersById = new Map(mk1Characters.map((character) => [character.id, character]));
const kameosById = new Map(mk1Kameos.map((kameo) => [kameo.id, kameo]));
const comboCountByCharacterId = new Map<string, number>();
const comboCountByPairKey = new Map<string, number>();

for (const combo of mk1SeededCombos) {
  comboCountByCharacterId.set(
    combo.characterId,
    (comboCountByCharacterId.get(combo.characterId) ?? 0) + 1,
  );
  const pairKey = `${combo.characterId}\u0000${combo.kameoId}`;
  comboCountByPairKey.set(pairKey, (comboCountByPairKey.get(pairKey) ?? 0) + 1);
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
    const trimmed = entry.trim();

    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
};

const nonEmptyValues = (value: string | readonly string[] | undefined): readonly string[] => {
  const seenValues = new Set<string>();
  const entries: string[] = [];

  for (const entry of toList(value)) {
    const trimmed = entry.trim();

    if (!trimmed || seenValues.has(trimmed)) {
      continue;
    }

    seenValues.add(trimmed);
    entries.push(trimmed);
  }

  return entries;
};

const canonicalRouteQueryFromInput = (
  query: Mk1CatalogPlainRouteQuery,
): Mk1CatalogPlainRouteQuery => {
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
  addString("kameo", firstValue(query.kameo));
  addArray("starter", nonEmptyValues(query.starter));
  addArray("position", nonEmptyValues(query.position));
  addArray("meter", nonEmptyValues(query.meter));
  addString("damageMin", firstValue(query.damageMin));
  addString("damageMax", firstValue(query.damageMax));
  addArray("difficulty", nonEmptyValues(query.difficulty));
  addArray("routeType", nonEmptyValues(query.routeType));
  addArray("tag", nonEmptyValues(query.tag));

  return canonicalQuery;
};

const getCharacterOptions = (): readonly Mk1CatalogCharacterOption[] =>
  mk1Characters.map((character) => {
    const comboCount = comboCountByCharacterId.get(character.id) ?? 0;

    return {
      id: character.id,
      label: character.label,
      shortLabel: character.shortLabel,
      rosterOrder: character.rosterOrder,
      comboCount,
      availability: comboCount > 0 ? "available" : "disabledNoComboData",
    };
  });

const getKameoOptions = (characterId: string | undefined): readonly Mk1CatalogKameoOption[] => {
  if (!characterId) {
    return [];
  }

  return mk1Kameos.map((kameo) => {
    const comboCount = comboCountByPairKey.get(`${characterId}\u0000${kameo.id}`) ?? 0;

    return {
      id: kameo.id,
      label: kameo.label,
      shortLabel: kameo.shortLabel,
      kameoOrder: kameo.kameoOrder,
      comboCount,
      availability: comboCount > 0 ? "available" : "disabledNoComboData",
    };
  });
};

export const getMk1CatalogContextStatus = (context: Mk1CatalogContext): Mk1CatalogContextStatus => {
  if (context.characterId && context.kameoId) {
    return "ready";
  }
  if (context.characterId) {
    return "characterSelected";
  }

  return "empty";
};

export const getMk1CatalogContextOptions = (
  context: Mk1CatalogContext = {},
): Mk1CatalogContextOptions => ({
  characters: getCharacterOptions(),
  kameos: getKameoOptions(context.characterId),
});

export const recoverMk1CatalogContext = (
  context: Mk1CatalogContext,
  filters: Mk1CatalogFilters = {},
): Mk1CatalogRecovery => {
  const messages: ValidationMessage[] = [];
  const recoveredFilters = recoverMk1CatalogFilters(filters);
  let recoveredContext = Mk1CatalogContextSchema.parse(context);

  if (recoveredContext.characterId && !charactersById.has(recoveredContext.characterId)) {
    messages.push(
      toMessage("mk1.catalog.invalid_character", "Character context does not exist in MK1 data.", [
        "character",
      ]),
    );
    recoveredContext = {};
  }

  if (recoveredContext.kameoId && !kameosById.has(recoveredContext.kameoId)) {
    messages.push(
      toMessage("mk1.catalog.invalid_kameo", "Kameo context does not exist in MK1 data.", [
        "kameo",
      ]),
    );
    recoveredContext = {
      characterId: recoveredContext.characterId,
    };
  }

  return {
    status: getMk1CatalogContextStatus(recoveredContext),
    context: recoveredContext,
    filters: recoveredFilters.filters,
    messages: [...messages, ...recoveredFilters.messages],
  };
};

export const selectMk1CatalogCharacter = (characterId: string): Mk1CatalogRecovery =>
  recoverMk1CatalogContext({ characterId }, {});

export const selectMk1CatalogKameo = (
  context: Mk1CatalogContext,
  kameoId: string,
  filters: Mk1CatalogFilters = {},
): Mk1CatalogRecovery =>
  recoverMk1CatalogContext(
    {
      characterId: context.characterId,
      kameoId,
    },
    filters,
  );

export const parseMk1CatalogRouteQuery = (query: Mk1CatalogPlainRouteQuery): Mk1CatalogRecovery => {
  const canonicalQuery = canonicalRouteQueryFromInput(query);
  const parsedFilters = parseMk1CatalogFiltersFromRouteQuery(canonicalQuery);
  const recovered = recoverMk1CatalogContext(
    {
      characterId: firstValue(canonicalQuery.character),
      kameoId: firstValue(canonicalQuery.kameo),
    },
    parsedFilters.filters,
  );

  return {
    ...recovered,
    messages: [...parsedFilters.messages, ...recovered.messages],
  };
};

export const serializeMk1CatalogRouteQuery = (
  context: Mk1CatalogContext,
  filters: Mk1CatalogFilters = {},
): Mk1CatalogRouteQuery => {
  const recovered = recoverMk1CatalogContext(context, filters);
  const filterQuery = serializeMk1CatalogFiltersToRouteQuery(recovered.filters);

  return Mk1CatalogRouteQuerySchema.parse({
    ...filterQuery,
    character: recovered.context.characterId,
    kameo: recovered.context.kameoId,
  });
};
