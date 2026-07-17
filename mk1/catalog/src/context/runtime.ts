import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";

import { recoverMk1CatalogFilters } from "../filters/runtime";
import type { Mk1CatalogFilters } from "../filters/type";
import { Mk1CatalogContextSchema } from "./schema";
import type {
  Mk1CatalogCharacterOption,
  Mk1CatalogContext,
  Mk1CatalogContextOptions,
  Mk1CatalogContextStatus,
  Mk1CatalogKameoOption,
  Mk1CatalogRecovery,
} from "./type";
import { mk1CatalogContextStatuses, mk1CatalogOptionAvailabilities } from "./value";

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

const getCharacterOptions = (): readonly Mk1CatalogCharacterOption[] =>
  mk1Characters.map((character) => {
    const comboCount = comboCountByCharacterId.get(character.id) ?? 0;

    return {
      id: character.id,
      label: character.label,
      shortLabel: character.shortLabel,
      rosterOrder: character.rosterOrder,
      pickerSlot: character.pickerSlot,
      comboCount,
      availability:
        comboCount > 0
          ? mk1CatalogOptionAvailabilities.available
          : mk1CatalogOptionAvailabilities.disabledNoComboData,
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
      pickerSlot: kameo.pickerSlot,
      comboCount,
      availability:
        comboCount > 0
          ? mk1CatalogOptionAvailabilities.available
          : mk1CatalogOptionAvailabilities.disabledNoComboData,
    };
  });
};

export const getMk1CatalogContextStatus = (context: Mk1CatalogContext): Mk1CatalogContextStatus => {
  if (context.characterId && context.kameoId) {
    return mk1CatalogContextStatuses.ready;
  }
  if (context.characterId) {
    return mk1CatalogContextStatuses.characterSelected;
  }

  return mk1CatalogContextStatuses.empty;
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
