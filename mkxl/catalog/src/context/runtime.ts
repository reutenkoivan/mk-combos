import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import { mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import { mkxlVariations, mkxlVariationsByCharacterId } from "@mk-combos/mkxl-data/variations/value";

import { recoverMkxlCatalogFilters } from "../filters/runtime";
import type { MkxlCatalogFilters } from "../filters/type";
import { MkxlCatalogContextSchema } from "./schema";
import type {
  MkxlCatalogCharacterOption,
  MkxlCatalogContext,
  MkxlCatalogContextOptions,
  MkxlCatalogContextStatus,
  MkxlCatalogRecovery,
  MkxlCatalogVariationOption,
} from "./type";
import { mkxlCatalogContextStatuses, mkxlCatalogOptionAvailabilities } from "./value";

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

const getCharacterOptions = (): readonly MkxlCatalogCharacterOption[] => {
  const options: MkxlCatalogCharacterOption[] = [];

  for (const character of mkxlCharacters) {
    const comboCount = comboCountByCharacterId.get(character.id) ?? 0;

    options.push({
      id: character.id,
      label: character.label,
      shortLabel: character.shortLabel,
      rosterOrder: character.rosterOrder,
      pickerSlot: character.pickerSlot,
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
