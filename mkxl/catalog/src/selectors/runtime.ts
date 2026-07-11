import type { ComboId } from "@mk-combos/contracts/identity/type";
import type { MkxlSeededCombo } from "@mk-combos/mkxl-data/combos/type";
import { mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import { mkxlVariations } from "@mk-combos/mkxl-data/variations/value";

import { recoverMkxlCatalogContext } from "../context/runtime";
import type { MkxlCatalogContext } from "../context/type";
import {
  comboMatchesMkxlCatalogFilters,
  createMkxlCatalogFilterFacets,
  recoverMkxlCatalogFilters,
} from "../filters/runtime";
import type { MkxlCatalogFilterFacet, MkxlCatalogFilters } from "../filters/type";
import type { MkxlCatalogComboSummary, MkxlCatalogEntityLabel } from "../summary/type";

type SelectMkxlCatalogCombosInput = {
  context: MkxlCatalogContext;
  filters?: MkxlCatalogFilters;
};

const charactersById = new Map<string, (typeof mkxlCharacters)[number]>();

for (const character of mkxlCharacters) {
  charactersById.set(character.id, character);
}

const variationsById = new Map<string, (typeof mkxlVariations)[number]>();

for (const variation of mkxlVariations) {
  variationsById.set(variation.id, variation);
}

const stagesById = new Map<string, (typeof mkxlStages)[number]>();

const interactablesById = new Map<string, (typeof mkxlStages)[number]["interactables"][number]>();

for (const stage of mkxlStages) {
  stagesById.set(stage.id, stage);
  for (const interactable of stage.interactables) {
    interactablesById.set(interactable.id, interactable);
  }
}

const comboById = new Map<string, MkxlSeededCombo>();

const combosByCharacterVariationId = new Map<string, Map<string, MkxlSeededCombo[]>>();

for (const combo of mkxlSeededCombos) {
  comboById.set(combo.id, combo);

  let combosByVariationId = combosByCharacterVariationId.get(combo.characterId);

  if (!combosByVariationId) {
    combosByVariationId = new Map();
    combosByCharacterVariationId.set(combo.characterId, combosByVariationId);
  }

  const contextCombos = combosByVariationId.get(combo.variationId);

  if (contextCombos) {
    contextCombos.push(combo);
  } else {
    combosByVariationId.set(combo.variationId, [combo]);
  }
}

const requiredContextCombos = (context: MkxlCatalogContext): readonly MkxlSeededCombo[] => {
  const recovered = recoverMkxlCatalogContext(context);

  if (recovered.status !== "ready") {
    return [];
  }

  const { characterId, variationId } = recovered.context;

  if (!characterId || !variationId) {
    return [];
  }

  return combosByCharacterVariationId.get(characterId)?.get(variationId) ?? [];
};

const entityLabel = (
  id: string,
  label: MkxlCatalogEntityLabel["label"],
): MkxlCatalogEntityLabel => ({
  id,
  label,
});

const summarizeStageInteractables = (
  interactableIds: readonly string[],
): readonly MkxlCatalogEntityLabel[] => {
  const interactables: MkxlCatalogEntityLabel[] = [];

  for (const interactableId of interactableIds) {
    const interactable = interactablesById.get(interactableId);

    if (interactable) {
      interactables.push(entityLabel(interactable.id, interactable.label));
    }
  }

  return interactables;
};

export const summarizeMkxlCatalogCombo = (combo: MkxlSeededCombo): MkxlCatalogComboSummary => {
  const character = charactersById.get(combo.characterId);
  const variation = variationsById.get(combo.variationId);
  const stage =
    combo.stageContext.kind === "stageSpecific"
      ? stagesById.get(combo.stageContext.stageId)
      : undefined;

  if (!character || !variation) {
    throw new Error(`MKXL combo ${combo.id} references missing catalog context.`);
  }

  return {
    ref: {
      gameId: "mkxl",
      source: "seeded",
      comboId: combo.id,
    },
    gameId: "mkxl",
    source: "seeded",
    title: combo.title,
    character: {
      ...entityLabel(character.id, character.label),
      shortLabel: character.shortLabel,
    },
    variation: {
      ...entityLabel(variation.id, variation.label),
      characterId: variation.characterId,
    },
    stageContext: combo.stageContext,
    stage: stage ? entityLabel(stage.id, stage.label) : undefined,
    interactables:
      combo.stageContext.kind === "stageSpecific"
        ? summarizeStageInteractables(combo.stageContext.interactableIds)
        : [],
    movePath: combo.movePath,
    cachedNotation: combo.notation,
    metadata: combo.metadata,
    tags: combo.metadata.tags,
    notes: combo.notes,
    gameVersion: combo.gameVersion,
  };
};

export const getMkxlCatalogComboSummary = (
  comboId: ComboId,
): MkxlCatalogComboSummary | undefined => {
  const combo = comboById.get(comboId);

  return combo ? summarizeMkxlCatalogCombo(combo) : undefined;
};

export const selectMkxlCatalogSeededCombos = ({
  context,
  filters = {},
}: SelectMkxlCatalogCombosInput): readonly MkxlSeededCombo[] => {
  const contextCombos = requiredContextCombos(context);
  const recoveredFilters = recoverMkxlCatalogFilters(filters).filters;
  const filteredCombos: MkxlSeededCombo[] = [];

  for (const combo of contextCombos) {
    if (comboMatchesMkxlCatalogFilters(combo, recoveredFilters)) {
      filteredCombos.push(combo);
    }
  }

  return filteredCombos;
};

export const selectMkxlCatalogComboSummaries = (
  input: SelectMkxlCatalogCombosInput,
): readonly MkxlCatalogComboSummary[] => {
  const summaries: MkxlCatalogComboSummary[] = [];

  for (const combo of selectMkxlCatalogSeededCombos(input)) {
    summaries.push(summarizeMkxlCatalogCombo(combo));
  }

  return summaries;
};

export const getMkxlCatalogFilterFacets = (
  context: MkxlCatalogContext,
  filters: MkxlCatalogFilters = {},
): readonly MkxlCatalogFilterFacet[] =>
  createMkxlCatalogFilterFacets(
    requiredContextCombos(context),
    recoverMkxlCatalogFilters(filters).filters,
  );
