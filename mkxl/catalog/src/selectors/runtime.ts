import type { ComboId } from "@mk-combos/contracts/identity/type";
import type { MkxlSeededCombo } from "@mk-combos/mkxl-data/combos/type";
import { mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import type { MkxlMove } from "@mk-combos/mkxl-data/movelists/type";
import { mkxlMoveCategories, mkxlMoves } from "@mk-combos/mkxl-data/movelists/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import { mkxlVariations } from "@mk-combos/mkxl-data/variations/value";

import { recoverMkxlCatalogContext } from "../context/runtime";
import type { MkxlCatalogContext } from "../context/type";
import { mkxlCatalogContextStatuses } from "../context/value";
import {
  comboMatchesMkxlCatalogFilters,
  createMkxlCatalogFilterFacets,
  getMkxlCatalogComboSource,
  recoverMkxlCatalogFilters,
} from "../filters/runtime";
import type { MkxlCatalogFilterFacet, MkxlCatalogFilters } from "../filters/type";
import type {
  MkxlCatalogComboSummary,
  MkxlCatalogEntityLabel,
  MkxlCatalogRouteStep,
  MkxlCatalogRouteStepKind,
} from "../summary/type";
import { mkxlCatalogRouteStepEmphases, mkxlCatalogRouteStepKinds } from "../summary/value";

type SelectMkxlCatalogCombosInput = {
  context: MkxlCatalogContext;
  filters?: MkxlCatalogFilters;
};

const charactersById = new Map<string, (typeof mkxlCharacters)[number]>();

for (const character of mkxlCharacters) {
  charactersById.set(character.id, character);
}

const variationsById = new Map<string, (typeof mkxlVariations)[number]>();
const movesById = new Map<string, MkxlMove>(mkxlMoves.map((move) => [move.id, move]));

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

  if (recovered.status !== mkxlCatalogContextStatuses.ready) {
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

type RouteGroup = {
  readonly moveId: string;
  readonly notation: MkxlCatalogRouteStep["notation"];
  readonly repetitionCount: number;
};

const routeGroups = (combo: MkxlSeededCombo): readonly RouteGroup[] => {
  const groups: RouteGroup[] = [];
  for (const [index, moveId] of combo.movePath.entries()) {
    const notation = combo.notation[index];
    if (!notation) {
      throw new Error(`MKXL combo ${combo.id} is missing notation for route step ${index}.`);
    }
    const previous = groups.at(-1);
    if (previous?.moveId === moveId) {
      groups[groups.length - 1] = { ...previous, repetitionCount: previous.repetitionCount + 1 };
    } else {
      groups.push({ moveId, notation, repetitionCount: 1 });
    }
  }
  return groups;
};

const routeStepKind = (
  group: RouteGroup,
  index: number,
  lastIndex: number,
): MkxlCatalogRouteStepKind => {
  const move = movesById.get(group.moveId);

  if (move?.tags.includes("cashout") || move?.category === mkxlMoveCategories.stage) {
    return mkxlCatalogRouteStepKinds.cashout;
  }
  if (
    (move?.meterCost ?? 0) > 0 ||
    move?.tags.includes("meter") ||
    move?.category === mkxlMoveCategories.enhanced ||
    move?.category === mkxlMoveCategories.xray
  ) {
    return mkxlCatalogRouteStepKinds.meter;
  }
  if (index === lastIndex) return mkxlCatalogRouteStepKinds.finish;
  if (move?.tags.includes("launcher")) return mkxlCatalogRouteStepKinds.launcher;
  if (index === 0) {
    return move?.category === mkxlMoveCategories.string && group.notation.length >= 3
      ? mkxlCatalogRouteStepKinds.string
      : mkxlCatalogRouteStepKinds.starter;
  }
  if (move?.category === mkxlMoveCategories.string) {
    return group.repetitionCount > 1 || group.notation.length <= 2
      ? mkxlCatalogRouteStepKinds.link
      : mkxlCatalogRouteStepKinds.string;
  }
  if (
    move?.category === mkxlMoveCategories.special ||
    move?.category === mkxlMoveCategories.variation
  ) {
    return mkxlCatalogRouteStepKinds.cancel;
  }
  return mkxlCatalogRouteStepKinds.link;
};

const summarizeRoute = (combo: MkxlSeededCombo): readonly MkxlCatalogRouteStep[] => {
  const groups = routeGroups(combo);
  const lastIndex = groups.length - 1;
  return groups.map((group, index) => {
    const kind = routeStepKind(group, index, lastIndex);
    return {
      kind,
      notation: group.notation,
      repetitionCount: group.repetitionCount,
      emphasis:
        kind === mkxlCatalogRouteStepKinds.cashout ||
        kind === mkxlCatalogRouteStepKinds.finish ||
        kind === mkxlCatalogRouteStepKinds.meter
          ? mkxlCatalogRouteStepEmphases.strong
          : mkxlCatalogRouteStepEmphases.standard,
    };
  });
};

const summarizeMkxlCatalogCombo = (combo: MkxlSeededCombo): MkxlCatalogComboSummary => {
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
    provenance: getMkxlCatalogComboSource(combo),
    sourceIds: combo.sourceIds,
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
    routeSteps: summarizeRoute(combo),
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
