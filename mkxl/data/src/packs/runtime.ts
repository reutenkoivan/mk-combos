import type { MkxlSeededCombo } from "../combos/type";
import type { MkxlMove, MkxlMoveTree } from "../movelists/type";
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

const toNonEmptyReadonlyArray = <T extends NonNullable<unknown>>(
  values: readonly T[],
  label: string,
): NonEmptyReadonlyArray<T> => {
  const [first, ...rest] = values;

  if (first === undefined) {
    throw new Error(`${label} must not be empty.`);
  }

  return [first, ...rest];
};

const mapNonEmptyReadonlyArray = <
  TInput extends NonNullable<unknown>,
  TOutput extends NonNullable<unknown>,
>(
  values: NonEmptyReadonlyArray<TInput>,
  mapper: (value: TInput, index: number) => TOutput,
): NonEmptyReadonlyArray<TOutput> => {
  const [first, ...rest] = values;

  return [mapper(first, 0), ...rest.map((value, index) => mapper(value, index + 1))];
};

const cloneCharacterMoves = (entry: MkxlAuthoredCharacterMoves): MutableAuthoredCharacterMoves => ({
  sourcePath: entry.sourcePath,
  characterId: entry.characterId,
  sourceIds: entry.sourceIds,
  universal: { ...entry.universal },
  variations: Object.fromEntries(
    Object.entries(entry.variations).map(([variationKey, moves]) => [variationKey, { ...moves }]),
  ),
});

const clonePackState = (state: MkxlPackState): MkxlPackState => ({
  sources: state.sources,
  game: state.game,
  roster: state.roster,
  variations: state.variations,
  stages: state.stages,
  inputNotationValues: state.inputNotationValues,
  movesByCharacterId: new Map(
    [...state.movesByCharacterId].map(([characterId, entry]) => [
      characterId,
      {
        ...entry,
        universal: { ...entry.universal },
        variations: Object.fromEntries(
          Object.entries(entry.variations).map(([variationKey, moves]) => [
            variationKey,
            { ...moves },
          ]),
        ),
      },
    ]),
  ),
  combosByVariationId: new Map(state.combosByVariationId),
});

const mergeCharacterMoves = (state: MkxlPackState, entry: MkxlAuthoredCharacterMoves) => {
  const existing = state.movesByCharacterId.get(entry.characterId);

  if (!existing) {
    state.movesByCharacterId.set(entry.characterId, cloneCharacterMoves(entry));
    return;
  }

  state.movesByCharacterId.set(entry.characterId, {
    ...existing,
    sourceIds: [...new Set([...existing.sourceIds, ...entry.sourceIds])],
    universal: {
      ...existing.universal,
      ...entry.universal,
    },
    variations: {
      ...existing.variations,
      ...Object.fromEntries(
        Object.entries(entry.variations).map(([variationKey, moves]) => [
          variationKey,
          {
            ...(existing.variations[variationKey] ?? {}),
            ...moves,
          },
        ]),
      ),
    },
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
    combos: [...existing.combos, ...comboPatch.combos] as MkxlAuthoredVariationCombos["combos"],
  });
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
    const retiredIds = new Set(pack.comboPatches.retireIds);

    for (const [variationId, entry] of state.combosByVariationId) {
      const combos = entry.combos.filter((combo) => !retiredIds.has(combo.id));

      if (combos.length === 0) {
        state.combosByVariationId.delete(variationId);
        continue;
      }

      state.combosByVariationId.set(variationId, {
        ...entry,
        combos: toNonEmptyReadonlyArray(combos, `${variationId} combos`),
      });
    }
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

const resolveMoveTree = (entry: MutableAuthoredCharacterMoves): MkxlMoveTree =>
  Object.keys(entry.variations).length === 0
    ? { universal: entry.universal }
    : Object.fromEntries(
        Object.entries(entry.variations).map(([variationKey, variationMoves]) => [
          variationKey,
          {
            ...entry.universal,
            ...variationMoves,
          },
        ]),
      );

const resolveMovelistFile = (
  entry: MutableAuthoredCharacterMoves,
): MkxlResolvedCharacterMovelistFile => ({
  sourcePath: entry.sourcePath,
  characterId: entry.characterId,
  moves: resolveMoveTree(entry),
  movelist: collectMovelist(entry),
  sourceIds: entry.sourceIds,
});

const resolveComboFile = (entry: MkxlAuthoredVariationCombos): MkxlResolvedVariationComboFile => ({
  sourcePath: entry.sourcePath,
  characterId: entry.characterId,
  variationSlug: entry.variationSlug,
  variationId: entry.variationId,
  combos: mapNonEmptyReadonlyArray(entry.combos, (combo) => {
    const { route, ...seededCombo } = combo;

    return {
      ...seededCombo,
      characterId: entry.characterId,
      variationId: entry.variationId,
      route: route.map((move) => ({
        kind: "move",
        moveId: move.id,
      })),
      movePath: route.map((move) => move.id),
      notation: route.map((move) => move.notation),
    } satisfies MkxlSeededCombo;
  }),
});

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
  const movelistFiles = [...state.movesByCharacterId.values()].map(resolveMovelistFile);
  const movelists = movelistFiles.map(({ characterId, moves, movelist, sourceIds }) => ({
    characterId,
    moves,
    movelist,
    sourceIds,
  }));
  const comboFiles = [...state.combosByVariationId.values()].map(resolveComboFile);
  const seededCombos = comboFiles.flatMap((entry) => entry.combos);
  const moveTreeRegistry = Object.fromEntries(
    movelistFiles.map((entry) => [toCamelKey(entry.characterId), entry]),
  );

  return {
    packId: pack.id,
    gameVersion: pack.gameVersion,
    sources,
    game,
    characters,
    characterIds: characters.map((character) => character.id),
    variations,
    variationIds: variations.map((variation) => variation.id),
    variationsByCharacterId: Object.fromEntries(
      characters.map((character) => [
        character.id,
        variations.filter((variation) => variation.characterId === character.id),
      ]),
    ),
    stages,
    stageIds: stages.map((stage) => stage.id),
    interactableIds: stages.flatMap((stage) =>
      stage.interactables.map((interactable) => interactable.id),
    ),
    inputNotationValues,
    movelistFiles,
    moveTreeRegistry,
    movelists,
    moves: movelists.flatMap((movelist) => movelist.movelist),
    moveIds: movelists.flatMap((movelist) => movelist.movelist.map((move) => move.id)),
    comboFiles,
    seededCombos,
    seededComboIds: seededCombos.map((combo) => combo.id),
  };
};
