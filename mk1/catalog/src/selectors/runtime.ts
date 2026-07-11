import type { ComboId } from "@mk-combos/contracts/identity/type";
import type { Mk1SeededCombo } from "@mk-combos/mk1-data/combos/type";
import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";

import { recoverMk1CatalogContext } from "../context/runtime";
import type { Mk1CatalogContext } from "../context/type";
import {
  comboMatchesMk1CatalogFilters,
  createMk1CatalogFilterFacets,
  recoverMk1CatalogFilters,
} from "../filters/runtime";
import type { Mk1CatalogFilterFacet, Mk1CatalogFilters } from "../filters/type";
import type { Mk1CatalogComboSummary, Mk1CatalogEntityLabel } from "../summary/type";

type SelectMk1CatalogCombosInput = {
  context: Mk1CatalogContext;
  filters?: Mk1CatalogFilters;
};

const charactersById = new Map(mk1Characters.map((character) => [character.id, character]));
const kameosById = new Map(mk1Kameos.map((kameo) => [kameo.id, kameo]));
const comboById = new Map<string, Mk1SeededCombo>();
const combosByPairKey = new Map<string, Mk1SeededCombo[]>();

for (const combo of mk1SeededCombos) {
  comboById.set(combo.id, combo);
  const pairKey = `${combo.characterId}\u0000${combo.kameoId}`;
  const pairCombos = combosByPairKey.get(pairKey);

  if (pairCombos) {
    pairCombos.push(combo);
  } else {
    combosByPairKey.set(pairKey, [combo]);
  }
}

const requiredContextCombos = (context: Mk1CatalogContext): readonly Mk1SeededCombo[] => {
  const recovered = recoverMk1CatalogContext(context);

  if (recovered.status !== "ready") {
    return [];
  }

  const { characterId, kameoId } = recovered.context;

  if (!characterId || !kameoId) {
    return [];
  }

  return combosByPairKey.get(`${characterId}\u0000${kameoId}`) ?? [];
};

const entityLabel = (id: string, label: Mk1CatalogEntityLabel["label"]) => ({
  id,
  label,
});

export const summarizeMk1CatalogCombo = (combo: Mk1SeededCombo): Mk1CatalogComboSummary => {
  const character = charactersById.get(combo.characterId);
  const kameo = kameosById.get(combo.kameoId);

  if (!character || !kameo) {
    throw new Error(`MK1 combo ${combo.id} references missing catalog context.`);
  }

  return {
    ref: {
      gameId: "mk1",
      source: "seeded",
      comboId: combo.id,
    },
    gameId: "mk1",
    source: "seeded",
    title: combo.title,
    character: {
      ...entityLabel(character.id, character.label),
      shortLabel: character.shortLabel,
    },
    kameo: {
      ...entityLabel(kameo.id, kameo.label),
      shortLabel: kameo.shortLabel,
    },
    movePath: combo.movePath,
    cachedNotation: combo.notation,
    metadata: combo.metadata,
    tags: combo.metadata.tags,
    notes: combo.notes,
    gameVersion: combo.gameVersion,
  };
};

export const getMk1CatalogComboSummary = (comboId: ComboId): Mk1CatalogComboSummary | undefined => {
  const combo = comboById.get(comboId);

  return combo ? summarizeMk1CatalogCombo(combo) : undefined;
};

export const selectMk1CatalogSeededCombos = ({
  context,
  filters = {},
}: SelectMk1CatalogCombosInput): readonly Mk1SeededCombo[] => {
  const contextCombos = requiredContextCombos(context);
  const recoveredFilters = recoverMk1CatalogFilters(filters).filters;
  const filteredCombos: Mk1SeededCombo[] = [];

  for (const combo of contextCombos) {
    if (comboMatchesMk1CatalogFilters(combo, recoveredFilters)) {
      filteredCombos.push(combo);
    }
  }

  return filteredCombos;
};

export const selectMk1CatalogComboSummaries = (
  input: SelectMk1CatalogCombosInput,
): readonly Mk1CatalogComboSummary[] => {
  const summaries: Mk1CatalogComboSummary[] = [];

  for (const combo of selectMk1CatalogSeededCombos(input)) {
    summaries.push(summarizeMk1CatalogCombo(combo));
  }

  return summaries;
};

export const getMk1CatalogFilterFacets = (
  context: Mk1CatalogContext,
  filters: Mk1CatalogFilters = {},
): readonly Mk1CatalogFilterFacet[] =>
  createMk1CatalogFilterFacets(
    requiredContextCombos(context),
    recoverMk1CatalogFilters(filters).filters,
  );
