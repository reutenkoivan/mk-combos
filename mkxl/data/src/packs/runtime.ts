import type { MkxlSeededCombo } from "../combos/type";
import type { MkxlMove, MkxlMovelist, MkxlMoveTree } from "../movelists/type";
import type { MkxlVariation } from "../variations/type";
import type {
  MkxlAuthoredCharacterMoves,
  MkxlAuthoredVariationCombos,
  MkxlDataPack,
  MkxlMovePatch,
  MkxlResolvedCharacterMovelistFile,
  MkxlResolvedData,
  MkxlResolvedVariationComboFile,
} from "./type";

type MutableAuthoredCharacterMoves = {
  sourcePath: MkxlAuthoredCharacterMoves["sourcePath"];
  characterId: string;
  sourceIds: MkxlAuthoredCharacterMoves["sourceIds"];
  universal: Record<string, MkxlMove>;
  variations: Record<string, Record<string, MkxlMove>>;
};

type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];

type MutableNonEmptyArray<T> = [T, ...T[]];

type MkxlPackState = {
  sources: MkxlDataPack["sources"];
  game: MkxlDataPack["game"];
  roster: MkxlDataPack["roster"];
  variations: MkxlDataPack["variations"];
  stages: MkxlDataPack["stages"];
  inputNotationValues: MkxlDataPack["inputNotationValues"];
  movesByCharacterId: Map<string, MutableAuthoredCharacterMoves>;
  combosByVariationId: Map<string, MkxlAuthoredVariationCombos>;
};

type ResolvedEntityIds = {
  characterIds: string[];
  variationIds: string[];
  stageIds: string[];
  interactableIds: string[];
};

type ResolvedMovelistArtifacts = {
  movelistFiles: MkxlResolvedCharacterMovelistFile[];
  moveTreeRegistry: Record<string, MkxlResolvedCharacterMovelistFile>;
  movelists: MkxlMovelist[];
  moves: MkxlMove[];
  moveIds: string[];
};

type ResolvedComboArtifacts = {
  comboFiles: MkxlResolvedVariationComboFile[];
  seededCombos: MkxlSeededCombo[];
  seededComboIds: string[];
};

type ResolvedSeededComboRoute = Pick<MkxlSeededCombo, "route" | "movePath" | "notation">;

type MkxlAuthoredSeededCombo = MkxlAuthoredVariationCombos["combos"][number];

const createEmptyPackState = (): MkxlPackState => ({
  sources: undefined,
  game: undefined,
  roster: undefined,
  variations: undefined,
  stages: undefined,
  inputNotationValues: undefined,
  movesByCharacterId: new Map(),
  combosByVariationId: new Map(),
});

const toCamelKey = (value: string) =>
  value.replace(/-([a-z0-9])/gu, (_match, char: string) => char.toUpperCase());

const appendNonEmptyValue = <T>(
  values: MutableNonEmptyArray<T> | undefined,
  value: T,
): MutableNonEmptyArray<T> => {
  if (values === undefined) {
    return [value];
  }

  values.push(value);
  return values;
};

const mapNonEmptyReadonlyArray = <
  TInput extends NonNullable<unknown>,
  TOutput extends NonNullable<unknown>,
>(
  values: NonEmptyReadonlyArray<TInput>,
  mapper: (value: TInput, index: number) => TOutput,
): NonEmptyReadonlyArray<TOutput> => {
  let mappedValues: MutableNonEmptyArray<TOutput> | undefined;
  let index = 0;

  for (const value of values) {
    mappedValues = appendNonEmptyValue(mappedValues, mapper(value, index));
    index += 1;
  }

  if (mappedValues === undefined) {
    throw new Error("Non-empty array mapper received an empty array.");
  }

  return mappedValues;
};

const concatNonEmptyReadonlyArrays = <T>(
  firstValues: NonEmptyReadonlyArray<T>,
  secondValues: NonEmptyReadonlyArray<T>,
): NonEmptyReadonlyArray<T> => {
  let combinedValues: MutableNonEmptyArray<T> | undefined;

  for (const value of firstValues) {
    combinedValues = appendNonEmptyValue(combinedValues, value);
  }
  for (const value of secondValues) {
    combinedValues = appendNonEmptyValue(combinedValues, value);
  }

  if (combinedValues === undefined) {
    throw new Error("Cannot concatenate empty combo lists.");
  }

  return combinedValues;
};

const collectRetainedCombos = (
  combos: NonEmptyReadonlyArray<MkxlAuthoredSeededCombo>,
  retiredIds: ReadonlySet<string>,
): NonEmptyReadonlyArray<MkxlAuthoredSeededCombo> | undefined => {
  let retainedCombos: MutableNonEmptyArray<MkxlAuthoredSeededCombo> | undefined;

  for (const combo of combos) {
    if (!retiredIds.has(combo.id)) {
      retainedCombos = appendNonEmptyValue(retainedCombos, combo);
    }
  }

  return retainedCombos;
};

const cloneVariationMoveMaps = (
  variations: MutableAuthoredCharacterMoves["variations"],
): MutableAuthoredCharacterMoves["variations"] => {
  const clonedVariations: MutableAuthoredCharacterMoves["variations"] = {};

  for (const variationKey in variations) {
    if (!Object.hasOwn(variations, variationKey)) {
      continue;
    }

    const moves = variations[variationKey];

    if (moves) {
      clonedVariations[variationKey] = { ...moves };
    }
  }

  return clonedVariations;
};

const cloneCharacterMoves = (entry: MkxlAuthoredCharacterMoves): MutableAuthoredCharacterMoves => ({
  sourcePath: entry.sourcePath,
  characterId: entry.characterId,
  sourceIds: entry.sourceIds,
  universal: { ...entry.universal },
  variations: cloneVariationMoveMaps(entry.variations),
});

const clonePackState = (state: MkxlPackState): MkxlPackState => {
  const movesByCharacterId = new Map<string, MutableAuthoredCharacterMoves>();

  for (const [characterId, entry] of state.movesByCharacterId) {
    movesByCharacterId.set(characterId, cloneCharacterMoves(entry));
  }

  return {
    sources: state.sources,
    game: state.game,
    roster: state.roster,
    variations: state.variations,
    stages: state.stages,
    inputNotationValues: state.inputNotationValues,
    movesByCharacterId,
    combosByVariationId: new Map(state.combosByVariationId),
  };
};

const mergeCharacterMoves = (state: MkxlPackState, entry: MkxlAuthoredCharacterMoves) => {
  const existing = state.movesByCharacterId.get(entry.characterId);

  if (!existing) {
    state.movesByCharacterId.set(entry.characterId, cloneCharacterMoves(entry));
    return;
  }

  const variations: MutableAuthoredCharacterMoves["variations"] = { ...existing.variations };

  for (const variationKey in entry.variations) {
    if (!Object.hasOwn(entry.variations, variationKey)) {
      continue;
    }

    const moves = entry.variations[variationKey];

    if (moves) {
      variations[variationKey] = {
        ...(existing.variations[variationKey] ?? {}),
        ...moves,
      };
    }
  }

  state.movesByCharacterId.set(entry.characterId, {
    ...existing,
    sourceIds: [...new Set([...existing.sourceIds, ...entry.sourceIds])],
    universal: {
      ...existing.universal,
      ...entry.universal,
    },
    variations,
  });
};

const applyMovePatch = (state: MkxlPackState, patch: MkxlMovePatch) => {
  const entry = state.movesByCharacterId.get(patch.characterId);

  if (!entry) {
    throw new Error(`${patch.characterId} has no authored move pack.`);
  }

  let target: Record<string, MkxlMove>;

  if (patch.scope === "universal") {
    target = entry.universal;
  } else {
    target = entry.variations[patch.variationKey] ?? {};
    entry.variations[patch.variationKey] = target;
  }

  if (patch.action === "retire") {
    delete target[patch.key];
    return;
  }

  target[patch.key] = patch.move;
};

const mergeComboAddPatch = (state: MkxlPackState, comboPatch: MkxlAuthoredVariationCombos) => {
  const existing = state.combosByVariationId.get(comboPatch.variationId);

  if (!existing) {
    state.combosByVariationId.set(comboPatch.variationId, comboPatch);
    return;
  }

  state.combosByVariationId.set(comboPatch.variationId, {
    ...existing,
    combos: concatNonEmptyReadonlyArrays(existing.combos, comboPatch.combos),
  });
};

const applyComboRetirePatch = (state: MkxlPackState, retireIds: readonly string[]) => {
  const retiredIds = new Set(retireIds);

  for (const [variationId, entry] of state.combosByVariationId) {
    const combos = collectRetainedCombos(entry.combos, retiredIds);

    if (combos === undefined) {
      state.combosByVariationId.delete(variationId);
      continue;
    }

    state.combosByVariationId.set(variationId, {
      ...entry,
      combos,
    });
  }
};

const applyPack = (inputState: MkxlPackState, pack: MkxlDataPack): MkxlPackState => {
  const state = clonePackState(inputState);

  if (pack.sources) {
    state.sources = pack.sources;
  }
  if (pack.game) {
    state.game = pack.game;
  }
  if (pack.roster) {
    state.roster = pack.roster;
  }
  if (pack.variations) {
    state.variations = pack.variations;
  }
  if (pack.stages) {
    state.stages = pack.stages;
  }
  if (pack.inputNotationValues) {
    state.inputNotationValues = pack.inputNotationValues;
  }
  if (pack.moves) {
    for (const entry of pack.moves) {
      mergeCharacterMoves(state, entry);
    }
  }
  if (pack.combos) {
    for (const entry of pack.combos) {
      state.combosByVariationId.set(entry.variationId, entry);
    }
  }
  if (pack.movePatches) {
    for (const patch of pack.movePatches) {
      applyMovePatch(state, patch);
    }
  }
  if (pack.comboPatches?.replace) {
    for (const replacement of pack.comboPatches.replace) {
      state.combosByVariationId.set(replacement.variationId, replacement);
    }
  }
  if (pack.comboPatches?.add) {
    for (const addition of pack.comboPatches.add) {
      mergeComboAddPatch(state, addition);
    }
  }
  if (pack.comboPatches?.retireIds) {
    applyComboRetirePatch(state, pack.comboPatches.retireIds);
  }

  return state;
};

const resolvePackState = (pack: MkxlDataPack): MkxlPackState => {
  const baseState = pack.extends ? resolvePackState(pack.extends) : createEmptyPackState();

  return applyPack(baseState, pack);
};

const requirePackValue = <T>(packId: string, label: string, value: T | undefined): T => {
  if (!value) {
    throw new Error(`${packId} data pack is missing ${label}.`);
  }

  return value;
};

const collectMovelist = (entry: MutableAuthoredCharacterMoves): readonly MkxlMove[] => {
  const seenMoves = new Set<MkxlMove>();
  const movelist: MkxlMove[] = [];

  const addMove = (move: MkxlMove) => {
    if (seenMoves.has(move)) {
      return;
    }

    seenMoves.add(move);
    movelist.push(move);
  };

  for (const move of Object.values(entry.universal)) {
    addMove(move);
  }
  for (const variationMoves of Object.values(entry.variations)) {
    for (const move of Object.values(variationMoves)) {
      addMove(move);
    }
  }

  return movelist;
};

const resolveVariationMoveTree = (entry: MutableAuthoredCharacterMoves): MkxlMoveTree => {
  const moveTree: MkxlMoveTree = {};

  for (const variationKey in entry.variations) {
    if (!Object.hasOwn(entry.variations, variationKey)) {
      continue;
    }

    const variationMoves = entry.variations[variationKey];

    if (variationMoves) {
      moveTree[variationKey] = {
        ...entry.universal,
        ...variationMoves,
      };
    }
  }

  return moveTree;
};

const resolveMoveTree = (entry: MutableAuthoredCharacterMoves): MkxlMoveTree =>
  Object.keys(entry.variations).length === 0
    ? { universal: entry.universal }
    : resolveVariationMoveTree(entry);

const resolveMovelistFile = (
  entry: MutableAuthoredCharacterMoves,
): MkxlResolvedCharacterMovelistFile => ({
  sourcePath: entry.sourcePath,
  characterId: entry.characterId,
  moves: resolveMoveTree(entry),
  movelist: collectMovelist(entry),
  sourceIds: entry.sourceIds,
});

const resolveSeededComboRoute = (
  route: MkxlAuthoredVariationCombos["combos"][number]["route"],
): ResolvedSeededComboRoute => {
  const resolvedRoute: MkxlSeededCombo["route"][number][] = [];
  const movePath: string[] = [];
  const notation: MkxlSeededCombo["notation"][number][] = [];

  for (const move of route) {
    resolvedRoute.push({
      kind: "move",
      moveId: move.id,
    });
    movePath.push(move.id);
    notation.push(move.notation);
  }

  return {
    route: resolvedRoute,
    movePath,
    notation,
  };
};

const resolveComboFile = (entry: MkxlAuthoredVariationCombos): MkxlResolvedVariationComboFile => ({
  sourcePath: entry.sourcePath,
  characterId: entry.characterId,
  variationSlug: entry.variationSlug,
  variationId: entry.variationId,
  combos: mapNonEmptyReadonlyArray(entry.combos, (combo) => {
    const { route, ...seededCombo } = combo;
    const resolvedRoute = resolveSeededComboRoute(route);

    return {
      ...seededCombo,
      characterId: entry.characterId,
      variationId: entry.variationId,
      route: resolvedRoute.route,
      movePath: resolvedRoute.movePath,
      notation: resolvedRoute.notation,
    } satisfies MkxlSeededCombo;
  }),
});

const collectResolvedEntityIds = (
  characters: NonNullable<MkxlDataPack["roster"]>,
  variations: NonNullable<MkxlDataPack["variations"]>,
  stages: NonNullable<MkxlDataPack["stages"]>,
): ResolvedEntityIds => {
  const characterIds: string[] = [];
  const variationIds: string[] = [];
  const stageIds: string[] = [];
  const interactableIds: string[] = [];

  for (const character of characters) {
    characterIds.push(character.id);
  }
  for (const variation of variations) {
    variationIds.push(variation.id);
  }
  for (const stage of stages) {
    stageIds.push(stage.id);
    for (const interactable of stage.interactables) {
      interactableIds.push(interactable.id);
    }
  }

  return {
    characterIds,
    variationIds,
    stageIds,
    interactableIds,
  };
};

const resolveMovelistArtifacts = (
  entries: Iterable<MutableAuthoredCharacterMoves>,
): ResolvedMovelistArtifacts => {
  const movelistFiles: MkxlResolvedCharacterMovelistFile[] = [];
  const moveTreeRegistry: Record<string, MkxlResolvedCharacterMovelistFile> = {};
  const movelists: MkxlMovelist[] = [];
  const moves: MkxlMove[] = [];
  const moveIds: string[] = [];

  for (const entry of entries) {
    const movelistFile = resolveMovelistFile(entry);
    movelistFiles.push(movelistFile);
    moveTreeRegistry[toCamelKey(movelistFile.characterId)] = movelistFile;
    movelists.push({
      characterId: movelistFile.characterId,
      moves: movelistFile.moves,
      movelist: movelistFile.movelist,
      sourceIds: movelistFile.sourceIds,
    });

    for (const move of movelistFile.movelist) {
      moves.push(move);
      moveIds.push(move.id);
    }
  }

  return {
    movelistFiles,
    moveTreeRegistry,
    movelists,
    moves,
    moveIds,
  };
};

const resolveComboArtifacts = (
  entries: Iterable<MkxlAuthoredVariationCombos>,
): ResolvedComboArtifacts => {
  const comboFiles: MkxlResolvedVariationComboFile[] = [];
  const seededCombos: MkxlSeededCombo[] = [];
  const seededComboIds: string[] = [];

  for (const entry of entries) {
    const comboFile = resolveComboFile(entry);
    comboFiles.push(comboFile);

    for (const combo of comboFile.combos) {
      seededCombos.push(combo);
      seededComboIds.push(combo.id);
    }
  }

  return {
    comboFiles,
    seededCombos,
    seededComboIds,
  };
};

const buildVariationsByCharacterId = (
  characters: readonly { readonly id: string }[],
  variations: readonly MkxlVariation[],
): Readonly<Record<string, readonly MkxlVariation[]>> => {
  const variationsByCharacterId: Record<string, MkxlVariation[]> = {};

  for (const character of characters) {
    variationsByCharacterId[character.id] = [];
  }

  for (const variation of variations) {
    variationsByCharacterId[variation.characterId]?.push(variation);
  }

  return variationsByCharacterId;
};

export const compileMkxlDataPack = (pack: MkxlDataPack): MkxlResolvedData => {
  const state = resolvePackState(pack);
  const sources = requirePackValue(pack.id, "sources", state.sources);
  const game = requirePackValue(pack.id, "game", state.game);
  const characters = requirePackValue(pack.id, "roster", state.roster);
  const variations = requirePackValue(pack.id, "variations", state.variations);
  const stages = requirePackValue(pack.id, "stages", state.stages);
  const inputNotationValues = requirePackValue(
    pack.id,
    "input notation values",
    state.inputNotationValues,
  );
  const entityIds = collectResolvedEntityIds(characters, variations, stages);
  const movelistArtifacts = resolveMovelistArtifacts(state.movesByCharacterId.values());
  const comboArtifacts = resolveComboArtifacts(state.combosByVariationId.values());

  return {
    packId: pack.id,
    gameVersion: pack.gameVersion,
    sources,
    game,
    characters,
    characterIds: entityIds.characterIds,
    variations,
    variationIds: entityIds.variationIds,
    variationsByCharacterId: buildVariationsByCharacterId(characters, variations),
    stages,
    stageIds: entityIds.stageIds,
    interactableIds: entityIds.interactableIds,
    inputNotationValues,
    movelistFiles: movelistArtifacts.movelistFiles,
    moveTreeRegistry: movelistArtifacts.moveTreeRegistry,
    movelists: movelistArtifacts.movelists,
    moves: movelistArtifacts.moves,
    moveIds: movelistArtifacts.moveIds,
    comboFiles: comboArtifacts.comboFiles,
    seededCombos: comboArtifacts.seededCombos,
    seededComboIds: comboArtifacts.seededComboIds,
  };
};
