import type { Mk1SeededCombo } from "../../combos/type";
import type { Mk1DataSource, Mk1Game } from "../../game/type";
import type { Mk1CharacterGraph, Mk1GraphEdge, Mk1KameoGraphOverlay } from "../../graph/type";
import type { Mk1Kameo } from "../../kameos/type";
import { mk1InputNotationValues } from "../../movelists/constants";
import type { Mk1Move, Mk1Movelist } from "../../movelists/type";
import type { Mk1Character } from "../../roster/type";
import type { Mk1Label, Mk1PickerSlot } from "../../shared/type";

type CharacterSeed = readonly [id: string, label: string, release: Mk1Character["release"]];

type KameoSeed = readonly [id: string, label: string, release: Mk1Kameo["release"]];

const rosterSourceIds = ["wikipedia-mk1", "netherrealm-definitive-edition"] as const;
const curatedSourceIds = ["curated-route-seed"] as const;

const label = (value: string): Mk1Label => ({
  EN: value,
  fallback: value,
});

const pickerSlot = (input: {
  kind: "character" | "kameo";
  id: string;
  order: number;
  columns: number;
}): Mk1PickerSlot => {
  const zeroBasedIndex = input.order - 1;

  return {
    slotId: `${input.kind}-slot-${input.order}`,
    optionId: input.id,
    row: Math.floor(zeroBasedIndex / input.columns) + 1,
    column: (zeroBasedIndex % input.columns) + 1,
    compactOrder: input.order,
    status: "selectable",
  };
};

const characterSeeds = [
  ["ashrah", "Ashrah", "base"],
  ["baraka", "Baraka", "base"],
  ["general-shao", "General Shao", "base"],
  ["geras", "Geras", "base"],
  ["havik", "Havik", "unlockable"],
  ["johnny-cage", "Johnny Cage", "base"],
  ["kenshi", "Kenshi", "base"],
  ["kitana", "Kitana", "base"],
  ["kung-lao", "Kung Lao", "base"],
  ["li-mei", "Li Mei", "base"],
  ["liu-kang", "Liu Kang", "base"],
  ["mileena", "Mileena", "base"],
  ["nitara", "Nitara", "base"],
  ["raiden", "Raiden", "base"],
  ["rain", "Rain", "base"],
  ["reiko", "Reiko", "base"],
  ["reptile", "Reptile", "base"],
  ["scorpion", "Scorpion", "base"],
  ["shang-tsung", "Shang Tsung", "preorder"],
  ["sindel", "Sindel", "base"],
  ["smoke", "Smoke", "base"],
  ["sub-zero", "Sub-Zero", "base"],
  ["tanya", "Tanya", "base"],
  ["ermac", "Ermac", "kombatPack1"],
  ["homelander", "Homelander", "kombatPack1"],
  ["omni-man", "Omni-Man", "kombatPack1"],
  ["peacemaker", "Peacemaker", "kombatPack1"],
  ["quan-chi", "Quan Chi", "kombatPack1"],
  ["takeda", "Takeda", "kombatPack1"],
  ["conan", "Conan the Barbarian", "khaosReigns"],
  ["cyrax", "Cyrax", "khaosReigns"],
  ["ghostface", "Ghostface", "khaosReigns"],
  ["noob-saibot", "Noob Saibot", "khaosReigns"],
  ["sektor", "Sektor", "khaosReigns"],
  ["t-1000", "T-1000", "khaosReigns"],
] as const satisfies readonly CharacterSeed[];

const kameoSeeds = [
  ["cyrax", "Cyrax", "base"],
  ["darrius", "Darrius", "base"],
  ["frost", "Frost", "base"],
  ["goro", "Goro", "base"],
  ["jax", "Jax", "base"],
  ["kano", "Kano", "base"],
  ["kung-lao", "Kung Lao", "unlockable"],
  ["motaro", "Motaro", "unlockable"],
  ["sareena", "Sareena", "base"],
  ["scorpion", "Scorpion", "unlockable"],
  ["sektor", "Sektor", "base"],
  ["shujinko", "Shujinko", "unlockable"],
  ["sonya-blade", "Sonya Blade", "base"],
  ["stryker", "Stryker", "base"],
  ["sub-zero", "Sub-Zero", "unlockable"],
  ["ferra", "Ferra", "kombatPack1"],
  ["janet-cage", "Janet Cage", "kombatPack1"],
  ["khameleon", "Khameleon", "kombatPack1"],
  ["mavado", "Mavado", "kombatPack1"],
  ["tremor", "Tremor", "kombatPack1"],
  ["madam-bo", "Madam Bo", "khaosReigns"],
] as const satisfies readonly KameoSeed[];

const characterMoveIds = (characterId: string) =>
  ({
    quickStrike: `${characterId}:quick-strike`,
    risingLauncher: `${characterId}:rising-launcher`,
    finisher: `${characterId}:finisher`,
  }) as const;

const kameoAssistMoveId = (kameoId: string) => `kameo:${kameoId}:assist`;

const createCharacterMovelist = (character: Mk1Character): Mk1Movelist => {
  const moveIds = characterMoveIds(character.id);
  const sourceIds = curatedSourceIds;
  const quickStrike: Mk1Move = {
    id: moveIds.quickStrike,
    ownerId: character.id,
    ownerKind: "character",
    label: label(`${character.label.EN ?? character.id} Quick Strike`),
    notation: ["1", "1"],
    category: "normal",
    availability: {
      kind: "character",
      characterIds: [character.id],
    },
    tags: ["starter"],
    sourceIds,
  };
  const risingLauncher: Mk1Move = {
    id: moveIds.risingLauncher,
    ownerId: character.id,
    ownerKind: "character",
    label: label(`${character.label.EN ?? character.id} Rising Launcher`),
    notation: ["D", "2"],
    category: "normal",
    availability: {
      kind: "character",
      characterIds: [character.id],
    },
    tags: ["launcher"],
    sourceIds,
  };
  const finisher: Mk1Move = {
    id: moveIds.finisher,
    ownerId: character.id,
    ownerKind: "character",
    label: label(`${character.label.EN ?? character.id} Finisher`),
    notation: ["F", "4"],
    category: "special",
    availability: {
      kind: "character",
      characterIds: [character.id],
    },
    tags: ["ender"],
    sourceIds,
  };

  return {
    ownerId: character.id,
    ownerKind: "character",
    moves: {
      quickStrike,
      risingLauncher,
      finisher,
    },
    movelist: [quickStrike, risingLauncher, finisher],
    sourceIds,
  };
};

const createKameoMovelist = (kameo: Mk1Kameo): Mk1Movelist => {
  const assist: Mk1Move = {
    id: kameoAssistMoveId(kameo.id),
    ownerId: kameo.id,
    ownerKind: "kameo",
    label: label(`${kameo.label.EN ?? kameo.id} Kameo Assist`),
    notation: ["K"],
    category: "kameo",
    availability: {
      kind: "kameo",
      kameoIds: [kameo.id],
    },
    kameoCost: 1,
    tags: ["assist"],
    sourceIds: curatedSourceIds,
  };

  return {
    ownerId: kameo.id,
    ownerKind: "kameo",
    moves: {
      assist,
    },
    movelist: [assist],
    sourceIds: curatedSourceIds,
  };
};

const createCharacterGraph = (character: Mk1Character): Mk1CharacterGraph => {
  const moveIds = characterMoveIds(character.id);
  const nodes = [
    {
      id: `${character.id}:start`,
      label: label("Start"),
      kind: "start",
    },
    {
      id: `${character.id}:after-quick-strike`,
      label: label("After quick strike"),
      kind: "move",
    },
    {
      id: `${character.id}:after-rising-launcher`,
      label: label("After launcher"),
      kind: "move",
    },
    {
      id: `${character.id}:after-kameo-assist`,
      label: label("After kameo assist"),
      kind: "kameo",
    },
    {
      id: `${character.id}:end`,
      label: label("End"),
      kind: "end",
    },
  ] as const;
  const edges = [
    {
      id: `${character.id}:edge-quick-strike`,
      fromNodeId: `${character.id}:start`,
      toNodeId: `${character.id}:after-quick-strike`,
      moveId: moveIds.quickStrike,
      tags: ["starter"],
      sourceIds: curatedSourceIds,
    },
    {
      id: `${character.id}:edge-rising-launcher`,
      fromNodeId: `${character.id}:after-quick-strike`,
      toNodeId: `${character.id}:after-rising-launcher`,
      moveId: moveIds.risingLauncher,
      tags: ["launcher"],
      sourceIds: curatedSourceIds,
    },
    {
      id: `${character.id}:edge-finisher`,
      fromNodeId: `${character.id}:after-kameo-assist`,
      toNodeId: `${character.id}:end`,
      moveId: moveIds.finisher,
      tags: ["ender"],
      sourceIds: curatedSourceIds,
    },
  ] as const satisfies readonly Mk1GraphEdge[];

  return {
    id: `${character.id}:base-graph`,
    characterId: character.id,
    startNodeId: `${character.id}:start`,
    nodes,
    edges,
    sourceIds: curatedSourceIds,
  };
};

const createKameoGraphOverlay = (
  character: Mk1Character,
  kameo: Mk1Kameo,
): Mk1KameoGraphOverlay => ({
  id: `${character.id}:${kameo.id}:kameo-overlay`,
  characterId: character.id,
  kameoId: kameo.id,
  nodes: [
    {
      id: `${character.id}:after-kameo-assist`,
      label: label("After kameo assist"),
      kind: "kameo",
    },
  ],
  edges: [
    {
      id: `${character.id}:${kameo.id}:edge-kameo-assist`,
      fromNodeId: `${character.id}:after-rising-launcher`,
      toNodeId: `${character.id}:after-kameo-assist`,
      moveId: kameoAssistMoveId(kameo.id),
      kameoCost: 1,
      tags: ["kameo"],
      sourceIds: curatedSourceIds,
    },
  ],
  sourceIds: curatedSourceIds,
});

const moveLookup = (moves: readonly Mk1Move[]): ReadonlyMap<string, Mk1Move> => {
  const movesById = new Map<string, Mk1Move>();

  for (const move of moves) {
    movesById.set(move.id, move);
  }

  return movesById;
};

const createPairCombo = (
  character: Mk1Character,
  kameo: Mk1Kameo,
  movesById: ReadonlyMap<string, Mk1Move>,
): Mk1SeededCombo => {
  const characterMoves = characterMoveIds(character.id);
  const movePath = [
    characterMoves.quickStrike,
    characterMoves.risingLauncher,
    kameoAssistMoveId(kameo.id),
    characterMoves.finisher,
  ];
  const notation = movePath.map((moveId) => {
    const move = movesById.get(moveId);

    if (!move) {
      throw new Error(`MK1 definitive pack references missing move ${moveId}.`);
    }

    return move.notation;
  });
  const characterLabel = character.label.EN ?? character.id;
  const kameoLabel = kameo.label.EN ?? kameo.id;

  return {
    id: `${character.id}-${kameo.id}-seed-001`,
    source: "seeded",
    gameId: "mk1",
    title: label(`${characterLabel} / ${kameoLabel} route`),
    characterId: character.id,
    kameoId: kameo.id,
    route: movePath.map((moveId) => ({
      kind: "move",
      moveId,
    })),
    movePath,
    notation,
    metadata: {
      damage: 32,
      meter: 1,
      position: "midscreen",
      starter: "Quick Strike",
      routeType: "kameo",
      difficulty: "easy",
      tags: ["definitive", "pair-coverage"],
    },
    notes: label("Curated MK1 no-UI route coverage for this main fighter and kameo pair."),
    gameVersion: "definitive",
    sourceIds: curatedSourceIds,
  };
};

const createMoveTreeRegistry = (
  movelists: readonly Mk1Movelist[],
): Readonly<Record<string, Mk1Movelist>> => {
  const registry: Record<string, Mk1Movelist> = {};

  for (const movelist of movelists) {
    registry[`${movelist.ownerKind}:${movelist.ownerId}`] = movelist;
  }

  return registry;
};

const sourceIds = [
  "wikipedia-mk1",
  "netherrealm-definitive-edition",
  "in-game-practice-mode",
  "curated-route-seed",
  "netherrealm-patch-notes",
] as const;

const sources = [
  {
    id: "wikipedia-mk1",
    label: "English Wikipedia Mortal Kombat 1 page",
    url: "https://en.wikipedia.org/wiki/Mortal_Kombat_1",
    kind: "reference",
  },
  {
    id: "netherrealm-definitive-edition",
    label: "Mortal Kombat 1 Definitive Edition content cut",
    kind: "official",
  },
  {
    id: "in-game-practice-mode",
    label: "Manual in-game or practice-mode verification",
    kind: "manual",
  },
  {
    id: "curated-route-seed",
    label: "Project curated route coverage seed",
    kind: "curated",
  },
  {
    id: "netherrealm-patch-notes",
    label: "NetherRealm Studios Mortal Kombat patch notes",
    url: "https://www.mortalkombat.com/index.php/en-gb/patch-notes",
    kind: "official",
  },
] as const satisfies readonly Mk1DataSource[];

const characters = characterSeeds.map(
  ([id, readableLabel, release], index): Mk1Character => ({
    id,
    label: label(readableLabel),
    rosterOrder: index + 1,
    release,
    pickerSlot: pickerSlot({
      kind: "character",
      id,
      order: index + 1,
      columns: 8,
    }),
    sourceIds: rosterSourceIds,
  }),
);

const kameos = kameoSeeds.map(
  ([id, readableLabel, release], index): Mk1Kameo => ({
    id,
    label: label(readableLabel),
    kameoOrder: index + 1,
    release,
    pickerSlot: pickerSlot({
      kind: "kameo",
      id,
      order: index + 1,
      columns: 7,
    }),
    sourceIds: rosterSourceIds,
  }),
);

const game: Mk1Game = {
  id: "mk1",
  label: "MK1",
  title: "Mortal Kombat 1",
  gameVersion: "definitive",
  sourceIds: ["wikipedia-mk1", "netherrealm-definitive-edition"],
  defaultCharacterId: "scorpion",
  defaultKameoId: "cyrax",
};

const characterMovelists = characters.map(createCharacterMovelist);
const kameoMovelists = kameos.map(createKameoMovelist);
const movelists = [...characterMovelists, ...kameoMovelists];
const moves = movelists.flatMap((movelist) => movelist.movelist);
const movesById = moveLookup(moves);
const seededCombos = characters.flatMap((character) =>
  kameos.map((kameo) => createPairCombo(character, kameo, movesById)),
);
const characterGraphs = characters.map(createCharacterGraph);
const kameoGraphOverlays = characters.flatMap((character) =>
  kameos.map((kameo) => createKameoGraphOverlay(character, kameo)),
);

export const definitiveMk1Dataset = {
  packId: "definitive",
  gameVersion: "definitive",
  sources,
  sourceIds,
  game,
  characters,
  characterIds: characters.map((character) => character.id),
  kameos,
  kameoIds: kameos.map((kameo) => kameo.id),
  inputNotationValues: mk1InputNotationValues,
  characterMovelists,
  kameoMovelists,
  movelists,
  moveTreeRegistry: createMoveTreeRegistry(movelists),
  moves,
  moveIds: moves.map((move) => move.id),
  seededCombos,
  seededComboIds: seededCombos.map((combo) => combo.id),
  characterGraphs,
  characterGraphIds: characterGraphs.map((graph) => graph.id),
  kameoGraphOverlays,
  kameoGraphOverlayIds: kameoGraphOverlays.map((overlay) => overlay.id),
} as const;
