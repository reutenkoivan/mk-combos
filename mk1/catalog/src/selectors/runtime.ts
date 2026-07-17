import type { ComboId } from "@mk-combos/contracts/identity/type";
import type { Mk1SeededCombo } from "@mk-combos/mk1-data/combos/type";
import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import type { Mk1Move } from "@mk-combos/mk1-data/movelists/type";
import { mk1MoveCategories, mk1Moves } from "@mk-combos/mk1-data/movelists/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";

import { recoverMk1CatalogContext } from "../context/runtime";
import type { Mk1CatalogContext } from "../context/type";
import { mk1CatalogContextStatuses } from "../context/value";
import {
  comboMatchesMk1CatalogFilters,
  createMk1CatalogFilterFacets,
  getMk1CatalogComboSource,
  recoverMk1CatalogFilters,
} from "../filters/runtime";
import type { Mk1CatalogFilterFacet, Mk1CatalogFilters } from "../filters/type";
import type {
  Mk1CatalogComboSummary,
  Mk1CatalogEntityLabel,
  Mk1CatalogRouteStep,
  Mk1CatalogRouteStepKind,
} from "../summary/type";
import { mk1CatalogRouteStepEmphases, mk1CatalogRouteStepKinds } from "../summary/value";

type SelectMk1CatalogCombosInput = {
  context: Mk1CatalogContext;
  filters?: Mk1CatalogFilters;
};

const charactersById = new Map(mk1Characters.map((character) => [character.id, character]));
const kameosById = new Map(mk1Kameos.map((kameo) => [kameo.id, kameo]));
const movesById = new Map<string, Mk1Move>(mk1Moves.map((move) => [move.id, move]));
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

  if (recovered.status !== mk1CatalogContextStatuses.ready) {
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

type RouteGroup = {
  readonly moveId: string;
  readonly notation: Mk1CatalogRouteStep["notation"];
  readonly repetitionCount: number;
};

const routeGroups = (combo: Mk1SeededCombo): readonly RouteGroup[] => {
  const groups: RouteGroup[] = [];

  for (const [index, moveId] of combo.movePath.entries()) {
    const notation = combo.notation[index];
    if (!notation) {
      throw new Error(`MK1 combo ${combo.id} is missing notation for route step ${index}.`);
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
): Mk1CatalogRouteStepKind => {
  const move = movesById.get(group.moveId);

  if (move?.tags.includes("cashout")) return mk1CatalogRouteStepKinds.cashout;
  if ((move?.meterCost ?? 0) > 0 || move?.tags.includes("meter")) {
    return mk1CatalogRouteStepKinds.meter;
  }
  if (index === lastIndex || move?.tags.includes("ender")) return mk1CatalogRouteStepKinds.finish;
  if (index === 0 || move?.tags.includes("starter")) return mk1CatalogRouteStepKinds.starter;
  if (move?.tags.includes("launcher")) return mk1CatalogRouteStepKinds.launcher;
  if (move?.category === mk1MoveCategories.special) return mk1CatalogRouteStepKinds.cancel;
  return mk1CatalogRouteStepKinds.link;
};

const summarizeRoute = (combo: Mk1SeededCombo): readonly Mk1CatalogRouteStep[] => {
  const groups = routeGroups(combo);
  const lastIndex = groups.length - 1;

  return groups.map((group, index) => {
    const kind = routeStepKind(group, index, lastIndex);
    return {
      kind,
      notation: group.notation,
      repetitionCount: group.repetitionCount,
      emphasis:
        kind === mk1CatalogRouteStepKinds.cashout ||
        kind === mk1CatalogRouteStepKinds.finish ||
        kind === mk1CatalogRouteStepKinds.meter
          ? mk1CatalogRouteStepEmphases.strong
          : mk1CatalogRouteStepEmphases.standard,
    };
  });
};

const summarizeMk1CatalogCombo = (combo: Mk1SeededCombo): Mk1CatalogComboSummary => {
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
    provenance: getMk1CatalogComboSource(combo),
    sourceIds: combo.sourceIds,
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
    routeSteps: summarizeRoute(combo),
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
