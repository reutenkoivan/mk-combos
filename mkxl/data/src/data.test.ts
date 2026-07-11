import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import { validateMkxlData } from "@mk-combos/mkxl-data/coverage/runtime";
import { mkxlCoverageTargets } from "@mk-combos/mkxl-data/coverage/value";
import {
  mkxlInputNotationValues,
  mkxlMoveCategories,
  mkxlMovelists,
  mkxlMoveNotationValues,
  mkxlMoves,
} from "@mk-combos/mkxl-data/movelists/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import { mkxlInteractableIds, mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import { mkxlVariations } from "@mk-combos/mkxl-data/variations/value";
import { describe, expect, it } from "vitest";
import { mkxlComboFileRegistry } from "./combos/registry";
import { mkxlMovelistFileRegistry, mkxlMoveTreeRegistry } from "./movelists/registry";
import { MkxlInputNotationValueSchema, MkxlMoveNotationValueSchema } from "./movelists/schema";
import { compileMkxlDataPack } from "./packs/runtime";
import type { MkxlDataPack } from "./packs/type";
import { activeMkxlDataset } from "./packs/value";
import { mkxlXlFinalPack } from "./packs/xl-final";
import { mkxlXlFinalCharacterIds } from "./packs/xl-final/character-ids";
import { mkxlXlFinalGeneralMoves } from "./packs/xl-final/moves/characters/general";
import { scorpionMoves } from "./packs/xl-final/moves/characters/scorpion";
import { mkxlXlFinalFgcNotation, mkxlXlFinalInputNotationValues } from "./packs/xl-final/notation";

const authoredPackRootPath = join(process.cwd(), "src/packs/xl-final");
const comboCharactersRootPath = join(process.cwd(), "src/packs/xl-final/combos/characters");
const movelistCharactersRootPath = join(process.cwd(), "src/packs/xl-final/moves/characters");
const generalMoveOwnerId = "general";

const toCamelKey = (value: string) =>
  value.replace(/-([a-z0-9])/gu, (_match, char: string) => char.toUpperCase());

const toMkxlSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/gu, "and")
    .replace(/['.]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");

const getSourceFileText = (rootPath: string, sourcePath: string) =>
  readFileSync(join(rootPath, sourcePath.replace(/^characters\//u, "")), "utf8");

const splitTrimmedNonEmptyCsv = (value: string): readonly string[] => {
  const entries: string[] = [];

  for (const entry of value.split(",")) {
    const trimmedEntry = entry.trim();

    if (trimmedEntry) {
      entries.push(trimmedEntry);
    }
  }

  return entries;
};

const genericMoveLabels = new Set([
  "Starter string",
  "Launcher",
  "Combo ender",
  "Enhanced cashout",
]);

const createMoveLookup = (): ReadonlyMap<string, (typeof mkxlMoves)[number]> => {
  const movesById = new Map<string, (typeof mkxlMoves)[number]>();

  for (const move of mkxlMoves) {
    movesById.set(move.id, move);
  }

  return movesById;
};

const isUnknownRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isMoveRecord = (value: unknown): value is (typeof mkxlMoves)[number] =>
  isUnknownRecord(value) && typeof value.id === "string" && typeof value.characterId === "string";

const collectMoveTreeMovesInto = (value: unknown, moves: (typeof mkxlMoves)[number][]) => {
  if (isMoveRecord(value)) {
    moves.push(value);
    return;
  }

  if (!isUnknownRecord(value)) {
    return;
  }

  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      collectMoveTreeMovesInto(value[key], moves);
    }
  }
};

const collectMoveTreeMoves = (value: unknown): readonly (typeof mkxlMoves)[number][] => {
  const moves: (typeof mkxlMoves)[number][] = [];

  collectMoveTreeMovesInto(value, moves);

  return moves;
};

const collectUniqueMoveTreeMovesInto = (
  value: unknown,
  seenMoves: Set<(typeof mkxlMoves)[number]>,
  moves: (typeof mkxlMoves)[number][],
) => {
  if (isMoveRecord(value)) {
    if (seenMoves.has(value)) {
      return;
    }

    seenMoves.add(value);
    moves.push(value);
    return;
  }

  if (!isUnknownRecord(value)) {
    return;
  }

  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      collectUniqueMoveTreeMovesInto(value[key], seenMoves, moves);
    }
  }
};

const collectUniqueMoveTreeMoves = (value: unknown): readonly (typeof mkxlMoves)[number][] => {
  const moves: (typeof mkxlMoves)[number][] = [];

  collectUniqueMoveTreeMovesInto(value, new Set(), moves);

  return moves;
};

const collectCharacterSourcePathsInto = (
  rootPath: string,
  directoryPath: string,
  paths: string[],
) => {
  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      collectCharacterSourcePathsInto(rootPath, entryPath, paths);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".ts")) {
      continue;
    }

    paths.push(`characters/${relative(rootPath, entryPath).split(sep).join("/")}`);
  }
};

const collectCharacterSourcePaths = (
  rootPath: string,
  directoryPath = rootPath,
): readonly string[] => {
  const paths: string[] = [];

  collectCharacterSourcePathsInto(rootPath, directoryPath, paths);

  return paths;
};

const collectTypeScriptSourcePathsInto = (
  rootPath: string,
  directoryPath: string,
  paths: string[],
) => {
  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      collectTypeScriptSourcePathsInto(rootPath, entryPath, paths);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".ts")) {
      continue;
    }

    paths.push(relative(rootPath, entryPath).split(sep).join("/"));
  }
};

const collectTypeScriptSourcePaths = (
  rootPath: string,
  directoryPath = rootPath,
): readonly string[] => {
  const paths: string[] = [];

  collectTypeScriptSourcePathsInto(rootPath, directoryPath, paths);

  return paths;
};

const createComboRegistrySnapshot = () => {
  const expectedVariationIds = new Set<string>();
  const registryVariationIds: string[] = [];
  const registrySourcePaths: string[] = [];
  const sourcePathsOnDisk = collectCharacterSourcePaths(comboCharactersRootPath);

  for (const variation of mkxlVariations) {
    expectedVariationIds.add(variation.id);
  }
  for (const entry of mkxlComboFileRegistry) {
    registryVariationIds.push(entry.variationId);
    registrySourcePaths.push(entry.sourcePath);
  }

  return {
    expectedVariationIds,
    registryVariationIds,
    registrySourcePaths,
    sourcePathsOnDisk,
  };
};

const parseComboSourceShape = (
  sourceText: string,
  entry: (typeof mkxlComboFileRegistry)[number],
) => {
  const routeBlocks = [...sourceText.matchAll(/route:\s*\[(?<body>[^\]]*)\]/gu)];
  const comboObjectDeclarations = [
    ...sourceText.matchAll(
      /const (?<name>[a-z][A-Za-z0-9]*Combo) = \{[\s\S]*?\n\} as const satisfies MkxlAuthoredSeededCombo;/gu,
    ),
  ];
  const comboObjectNames = new Set<string>();
  const expectedComboObjectNames = new Set<string>();
  const combosBlock = /combos:\s*\[(?<body>[\s\S]*?)\]/u.exec(sourceText);
  const comboRefs = splitTrimmedNonEmptyCsv(combosBlock?.groups?.body ?? "");

  for (const declaration of comboObjectDeclarations) {
    comboObjectNames.add(declaration.groups?.name ?? "");
  }
  for (const combo of entry.combos) {
    expectedComboObjectNames.add(`${toCamelKey(combo.id)}Combo`);
  }

  return {
    routeBlocks,
    comboObjectDeclarations,
    comboObjectNames,
    expectedComboObjectNames,
    combosBlock,
    comboRefs,
  };
};

const createMovelistAlignmentSnapshot = () => {
  const expectedMoveOwnerIds = new Set<string>([generalMoveOwnerId]);
  const registryCharacterIds: string[] = [];
  const registrySourcePaths: string[] = [];
  const sourcePathsOnDisk = collectCharacterSourcePaths(movelistCharactersRootPath);
  const moveTreeRegistryEntries = Object.entries(mkxlMoveTreeRegistry);
  const moveNotationValues = new Set(mkxlMoveNotationValues);
  const moveTreeByCharacterId = new Map<string, unknown>();
  const movelistByCharacterId = new Map<string, (typeof mkxlMovelistFileRegistry)[number]>();
  const moveTreeCharacterIds = new Set<string>();
  const moveTreeRegistryKeys = new Set<string>();
  const expectedMoveOwnerKeys = new Set<string>();
  const movelistCharacterIds = new Set<string>();
  const aggregateMoveIdsByCharacterId = new Map<string, Set<string>>();
  const variationsByCharacterId = new Map<string, (typeof mkxlVariations)[number][]>();

  for (const character of mkxlCharacters) {
    expectedMoveOwnerIds.add(character.id);
    expectedMoveOwnerKeys.add(toCamelKey(character.id));
  }
  expectedMoveOwnerKeys.add(toCamelKey(generalMoveOwnerId));
  for (const entry of mkxlMovelistFileRegistry) {
    registryCharacterIds.push(entry.characterId);
    registrySourcePaths.push(entry.sourcePath);
    movelistByCharacterId.set(entry.characterId, entry);
  }
  for (const [registryKey, entry] of moveTreeRegistryEntries) {
    moveTreeCharacterIds.add(entry.characterId);
    moveTreeRegistryKeys.add(registryKey);
    moveTreeByCharacterId.set(entry.characterId, entry.moves);
  }
  for (const movelist of mkxlMovelists) {
    let aggregateMoveIds = aggregateMoveIdsByCharacterId.get(movelist.characterId);

    if (!aggregateMoveIds) {
      aggregateMoveIds = new Set();
      aggregateMoveIdsByCharacterId.set(movelist.characterId, aggregateMoveIds);
    }

    movelistCharacterIds.add(movelist.characterId);
    for (const move of movelist.movelist) {
      aggregateMoveIds.add(move.id);
    }
  }
  for (const variation of mkxlVariations) {
    let characterVariations = variationsByCharacterId.get(variation.characterId);

    if (!characterVariations) {
      characterVariations = [];
      variationsByCharacterId.set(variation.characterId, characterVariations);
    }

    characterVariations.push(variation);
  }

  return {
    expectedMoveOwnerIds,
    registryCharacterIds,
    registrySourcePaths,
    sourcePathsOnDisk,
    moveTreeRegistryEntries,
    moveNotationValues,
    moveTreeByCharacterId,
    movelistByCharacterId,
    moveTreeCharacterIds,
    moveTreeRegistryKeys,
    expectedMoveOwnerKeys,
    movelistCharacterIds,
    aggregateMoveIdsByCharacterId,
    variationsByCharacterId,
  };
};

const expectMoveTreeAlignment = (
  entry: (typeof mkxlMovelistFileRegistry)[number],
  sourceText: string,
  snapshot: ReturnType<typeof createMovelistAlignmentSnapshot>,
) => {
  const characterMoveTree = snapshot.moveTreeByCharacterId.get(entry.characterId) as
    | Record<string, unknown>
    | undefined;
  const aggregateMoveRefs = new Set(entry.movelist);
  const treeMoves = collectMoveTreeMoves(characterMoveTree);
  const uniqueTreeMoves = collectUniqueMoveTreeMoves(characterMoveTree);
  const treeMoveIds = new Set<string>();
  const entryMovelistIds = new Set<string>();

  for (const move of treeMoves) {
    treeMoveIds.add(move.id);
  }
  for (const move of entry.movelist) {
    entryMovelistIds.add(move.id);
  }

  expect(entry.movelist).toEqual(uniqueTreeMoves);
  expect(treeMoveIds).toEqual(entryMovelistIds);

  for (const move of treeMoves) {
    expect(aggregateMoveRefs.has(move)).toBe(true);
  }

  for (const variation of snapshot.variationsByCharacterId.get(entry.characterId) ?? []) {
    const variationSlug = variation.id.split(":")[1] ?? "";
    const variationKey = toCamelKey(variationSlug);

    expect(sourceText).toContain(`${variationKey}: {`);
    expect(characterMoveTree?.[variationKey]).toBeDefined();
  }
};

const expectAuthoredMoveNamingPolicy = (
  entry: (typeof mkxlMovelistFileRegistry)[number],
  move: (typeof mkxlMoves)[number],
  aggregateMoveIds: ReadonlySet<string>,
  moveNotationValues: ReadonlySet<string>,
  isGeneralMoveOwner: boolean,
) => {
  const labelEn = move.label.EN;
  const labelSlug = labelEn ? toMkxlSlug(labelEn) : "";

  expect(move.characterId).toBe(entry.characterId);
  expect(aggregateMoveIds.has(move.id)).toBe(true);
  expect(Array.isArray(move.notation)).toBe(true);
  for (const notationValue of move.notation) {
    expect(moveNotationValues.has(notationValue)).toBe(true);
  }
  expect(labelEn).toBeDefined();
  if (!isGeneralMoveOwner) {
    expect(genericMoveLabels.has(labelEn ?? "")).toBe(false);
    expect(labelEn ?? "").not.toMatch(/\bsignature\b/iu);
  }
  if (move.sourceIds.includes("community-combo-source")) {
    expect(move.tags).toContain("route-source");
  }

  if (move.availability.kind === "variation") {
    const variationId = move.availability.variationIds[0];
    const variationSlug = variationId?.split(":")[1];

    expect(move.id).toBe(`${entry.characterId}:${variationSlug}:${labelSlug}`);
    for (const variationId of move.availability.variationIds) {
      expect(variationId.split(":")[0]).toBe(entry.characterId);
    }
  } else if (move.availability.kind === "universal") {
    const expectedId = move.tags.includes("route-source")
      ? `${entry.characterId}:universal:${labelSlug}`
      : `${entry.characterId}:${labelSlug}`;

    expect(move.id).toBe(expectedId);
  }
};

describe("MKXL seeded data", () => {
  it("passes source, coverage, and reference validation", () => {
    const result = validateMkxlData();

    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.counts.characters).toBe(mkxlCoverageTargets.expectedCharacterCount);
    expect(result.counts.variations).toBe(mkxlCoverageTargets.expectedVariationCount);
    expect(result.counts.stages).toBe(mkxlCoverageTargets.expectedStageCount);
  });

  it("keeps authored pack files explicit and free of generated static entity rows", () => {
    const authoredSourcePaths = collectTypeScriptSourcePaths(authoredPackRootPath);

    expect(authoredSourcePaths.length).toBeGreaterThan(0);
    for (const sourcePath of authoredSourcePaths) {
      const sourceText = readFileSync(join(authoredPackRootPath, sourcePath), "utf8");

      expect(sourceText).not.toMatch(/\bdefineMkxl[A-Za-z0-9]*\b/u);
      expect(sourceText).not.toMatch(/\b(toReadableEn|toMkxlSlug)\s*\(/u);
      expect(sourceText).not.toMatch(/\.(map|flatMap)\s*\(/u);
    }
  });

  it("keeps the xl-final character id registry explicit and active", () => {
    const characterIdValues = Object.values(mkxlXlFinalCharacterIds);
    const rosterCharacterIds: string[] = [];

    for (const character of mkxlCharacters) {
      rosterCharacterIds.push(character.id);
    }

    expect(new Set(characterIdValues).size).toBe(characterIdValues.length);
    expect(new Set(characterIdValues)).toEqual(new Set(rosterCharacterIds));
    expect(characterIdValues).toEqual(rosterCharacterIds);
  });

  it("keeps the xl-final FGC notation registry explicit and controller-atomic", () => {
    const notationSourceText = readFileSync(join(authoredPackRootPath, "notation.ts"), "utf8");
    const registryValues = Object.values(mkxlXlFinalFgcNotation);

    expect(notationSourceText).toContain("mkxlXlFinalFgcNotation");
    expect(notationSourceText).toContain("mkxlXlFinalInputNotationValues");
    expect(notationSourceText).not.toContain("mkxlXlFinalStandardMoveNotation");
    expect(notationSourceText).not.toContain("mkxlXlFinalStandardMoveNotationValues");
    expect(notationSourceText).not.toMatch(/\bObject\.values\s*\(/u);
    expect(notationSourceText).not.toMatch(/\.(map|flatMap)\s*\(/u);
    expect(Object.keys(mkxlXlFinalFgcNotation).some((key) => key.startsWith("community"))).toBe(
      false,
    );
    expect(new Set(registryValues).size).toBe(registryValues.length);
    expect(new Set(mkxlXlFinalInputNotationValues)).toEqual(new Set(registryValues));
    expect(mkxlInputNotationValues).toBe(mkxlXlFinalInputNotationValues);
    expect(activeMkxlDataset.inputNotationValues).toBe(mkxlXlFinalInputNotationValues);
    expect(mkxlInputNotationValues).toEqual([
      "1",
      "2",
      "3",
      "4",
      "BLK",
      "SS",
      "INT",
      "AMP",
      "U",
      "D",
      "B",
      "F",
    ]);
    expect(mkxlInputNotationValues).toContain(mkxlXlFinalFgcNotation.amplify);
    expect(mkxlInputNotationValues).not.toContain("RUN");
    expect(mkxlInputNotationValues).not.toContain("BF2");
    expect(mkxlInputNotationValues).not.toContain("BF4+BLK");
    expect(mkxlMoveNotationValues).toEqual(mkxlInputNotationValues);
    expect(MkxlInputNotationValueSchema.safeParse("RUN").success).toBe(false);
    expect(MkxlInputNotationValueSchema.safeParse("BF2").success).toBe(false);
    expect(MkxlInputNotationValueSchema.safeParse("BF4+BLK").success).toBe(false);
    expect(MkxlInputNotationValueSchema.safeParse("AMP").success).toBe(true);
    expect(MkxlMoveNotationValueSchema.safeParse("RUN").success).toBe(false);
    expect(MkxlMoveNotationValueSchema.safeParse(mkxlXlFinalFgcNotation.amplify).success).toBe(
      true,
    );
  });

  it("keeps xl-final general moves explicit and input-derived", () => {
    const generalMoveSourceText = readFileSync(
      join(authoredPackRootPath, "moves/characters/general.ts"),
      "utf8",
    );

    expect(generalMoveSourceText).toContain("mkxlXlFinalGeneralMoves");
    expect(generalMoveSourceText).not.toMatch(/\bObject\.values\s*\(/u);
    expect(generalMoveSourceText).not.toMatch(/\.(map|flatMap)\s*\(/u);
    expect(Object.keys(mkxlXlFinalGeneralMoves.universal)).toEqual(["run", "dash", "xray"]);
    expect(mkxlXlFinalGeneralMoves.universal.run).toMatchObject({
      id: "general:run",
      category: "mechanic",
      notation: [mkxlXlFinalFgcNotation.forward, mkxlXlFinalFgcNotation.forward, "BLK"],
      sourceIds: ["in-game-practice-mode"],
    });
  });

  it("keeps general moves reusable through combo routes without character-owned clones", () => {
    const movesById = createMoveLookup();
    const generalMovelist = mkxlMovelists.find((movelist) => movelist.characterId === "general");
    const runMove = movesById.get("general:run");
    const combo = mkxlSeededCombos.find(
      (combo) => combo.id === "raiden-thunder-god-community-beginner-017",
    );

    expect(mkxlMoveCategories).toContain("mechanic");
    expect(runMove).toMatchObject({
      id: "general:run",
      characterId: "general",
      category: "mechanic",
      notation: [mkxlXlFinalFgcNotation.forward, mkxlXlFinalFgcNotation.forward, "BLK"],
      sourceIds: ["in-game-practice-mode"],
    });
    expect(movesById.has("scorpion:run")).toBe(false);
    expect(movesById.has("scorpion:cansrun")).toBe(false);
    expect(movesById.has("raiden:run")).toBe(false);
    expect(movesById.has("raiden:cansrun")).toBe(false);
    expect(generalMovelist?.movelist).toContain(runMove);
    expect(combo?.movePath).toContain("general:run");
    expect(combo?.notation).toContainEqual([
      mkxlXlFinalFgcNotation.forward,
      mkxlXlFinalFgcNotation.forward,
      "BLK",
    ]);
  });

  it("covers every selectable variation with a seeded combo", () => {
    const comboVariationIds = new Set<string>();

    for (const combo of mkxlSeededCombos) {
      comboVariationIds.add(combo.variationId);
    }

    expect(mkxlSeededCombos).toHaveLength(362);
    expect(comboVariationIds.size).toBe(mkxlVariations.length);
    for (const variation of mkxlVariations) {
      expect(comboVariationIds.has(variation.id)).toBe(true);
    }
  });

  it("keeps seeded combo files aligned with the variation registry", () => {
    const snapshot = createComboRegistrySnapshot();

    expect(mkxlComboFileRegistry).toHaveLength(mkxlVariations.length);
    expect(new Set(snapshot.registryVariationIds)).toEqual(snapshot.expectedVariationIds);
    expect(new Set(snapshot.registrySourcePaths).size).toBe(snapshot.registrySourcePaths.length);
    expect(new Set(snapshot.sourcePathsOnDisk)).toEqual(new Set(snapshot.registrySourcePaths));

    for (const entry of mkxlComboFileRegistry) {
      const [root, characterId, fileName] = entry.sourcePath.split("/");

      expect(root).toBe("characters");
      expect(entry.characterId).toBe(characterId);
      expect(entry.variationSlug).toBe(fileName?.replace(/\.ts$/, ""));
      expect(entry.variationId).toBe(`${entry.characterId}:${entry.variationSlug}`);
      expect(entry.combos.length).toBeGreaterThan(0);

      for (const combo of entry.combos) {
        expect(combo.characterId).toBe(entry.characterId);
        expect(combo.variationId).toBe(entry.variationId);
      }
    }
  });

  it("keeps authored combo routes sourced only from moves", () => {
    for (const entry of mkxlComboFileRegistry) {
      const sourceText = getSourceFileText(comboCharactersRootPath, entry.sourcePath);
      const characterKey = toCamelKey(entry.characterId);
      const expectedCharacterIdsImport =
        'import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";';
      const expectedMoveImport =
        'import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";';
      const sourceShape = parseComboSourceShape(sourceText, entry);
      const moveReferencePattern = /^moves(?:\.[a-z][A-Za-z0-9]*){3},?$/u;

      expect(sourceText).toContain(expectedCharacterIdsImport);
      expect(sourceText).toContain(expectedMoveImport);
      expect(sourceText).not.toContain("Moves.");
      expect(sourceText).not.toContain("globalMoves.");
      expect(sourceText).toContain("MkxlAuthoredSeededCombo");
      expect(sourceText).toContain(`const characterId = characterIds.${characterKey};`);
      expect(sourceText).toContain(`const variationSlug = "${entry.variationSlug}";`);
      expect(sourceText).toMatch(
        /const variationId = `\$\{characterId\}:\$\{variationSlug\}` as const;/u,
      );
      expect(sourceText).toContain("characterId,");
      expect(sourceText).toContain("variationSlug,");
      expect(sourceText).toContain("variationId,");
      expect(sourceShape.comboObjectDeclarations).toHaveLength(entry.combos.length);
      expect(sourceShape.comboObjectNames).toEqual(sourceShape.expectedComboObjectNames);
      expect(sourceShape.combosBlock).not.toBeNull();
      expect(sourceShape.combosBlock?.groups?.body ?? "").not.toMatch(/["'{}]/u);
      expect(sourceShape.comboRefs).toHaveLength(entry.combos.length);
      for (const comboRef of sourceShape.comboRefs) {
        expect(comboRef).toMatch(/^[a-z][A-Za-z0-9]*Combo$/u);
        expect(sourceShape.comboObjectNames.has(comboRef)).toBe(true);
      }
      expect(sourceShape.routeBlocks).toHaveLength(entry.combos.length);
      for (const routeBlock of sourceShape.routeBlocks) {
        const routeBody = routeBlock.groups?.body ?? "";
        const routeEntries = splitTrimmedNonEmptyCsv(routeBody);

        expect(routeEntries.length).toBeGreaterThan(0);
        expect(routeBody).not.toMatch(/\bid\s*:/u);
        expect(routeBody).not.toMatch(/\bmoveId\s*:/u);
        expect(routeBody).not.toMatch(/["'{}]/u);
        for (const routeEntry of routeEntries) {
          expect(moveReferencePattern.test(routeEntry)).toBe(true);
        }
      }
      expect(sourceText).not.toMatch(/\bmovePath\s*:/u);
      expect(sourceText).not.toMatch(/\bmoveId\s*:/u);
      expect(sourceText).not.toContain("mkxlMoveTreeRegistry");
      expect(sourceText).not.toContain("movelists/value");
      expect(sourceText).not.toContain("mkxlMoves");
      expect(sourceText).not.toContain("cachedNotation:");
      expect(sourceText).not.toContain("routeNotation.");
      expect(sourceText).not.toMatch(/starterString|launcher|ender|enhancedCashout/u);
      expect(sourceText).not.toMatch(/[Ss]ignature/u);
      expect(sourceText).not.toMatch(/combos:\s*\[\s*\{/u);
      expect(sourceText).not.toMatch(/\.(find|filter)\s*\(/u);
      expect(sourceText).not.toMatch(/new\s+Map\s*\(/u);
    }
  });

  it("keeps authored move notation sourced from the xl-final registry", () => {
    const registryKeys = new Set(Object.keys(mkxlXlFinalFgcNotation));
    const sourcePathsOnDisk = collectCharacterSourcePaths(movelistCharactersRootPath);

    for (const sourcePath of sourcePathsOnDisk) {
      const sourceText = getSourceFileText(movelistCharactersRootPath, sourcePath);
      const notationBlocks = [...sourceText.matchAll(/notation:\s*\[(?<body>[\s\S]*?)\]/gu)];

      expect(sourceText).toContain(
        'import { mkxlXlFinalFgcNotation as fgcNotation } from "../../notation";',
      );
      expect(sourceText).not.toMatch(/notation:\s*\[\s*["']/u);
      expect(notationBlocks.length).toBeGreaterThan(0);
      for (const notationBlock of notationBlocks) {
        const notationRefs = splitTrimmedNonEmptyCsv(notationBlock.groups?.body ?? "");

        expect(notationRefs.length).toBeGreaterThan(0);
        for (const notationRef of notationRefs) {
          const match = /^fgcNotation\.(?<key>[a-z][A-Za-z0-9]*)$/u.exec(notationRef);

          expect(match).not.toBeNull();
          expect(registryKeys.has(match?.groups?.key ?? "")).toBe(true);
        }
      }
    }
  });

  it("keeps movelist files aligned with the roster registry", () => {
    const snapshot = createMovelistAlignmentSnapshot();

    expect(mkxlMovelistFileRegistry).toHaveLength(snapshot.expectedMoveOwnerIds.size);
    expect(snapshot.moveTreeRegistryEntries).toHaveLength(snapshot.expectedMoveOwnerIds.size);
    expect(new Set(snapshot.registryCharacterIds)).toEqual(snapshot.expectedMoveOwnerIds);
    expect(snapshot.moveTreeCharacterIds).toEqual(snapshot.expectedMoveOwnerIds);
    expect(snapshot.moveTreeRegistryKeys).toEqual(snapshot.expectedMoveOwnerKeys);
    for (const [registryKey, entry] of snapshot.moveTreeRegistryEntries) {
      expect(registryKey).toBe(toCamelKey(entry.characterId));
      expect(snapshot.movelistByCharacterId.get(entry.characterId)).toBe(entry);
    }
    expect(new Set(snapshot.registrySourcePaths).size).toBe(snapshot.registrySourcePaths.length);
    expect(new Set(snapshot.sourcePathsOnDisk)).toEqual(new Set(snapshot.registrySourcePaths));
    expect(snapshot.movelistCharacterIds).toEqual(snapshot.expectedMoveOwnerIds);

    for (const movelist of mkxlMovelists) {
      expect("sourcePath" in movelist).toBe(false);
    }

    for (const entry of mkxlMovelistFileRegistry) {
      const [root, fileName, extra] = entry.sourcePath.split("/");
      const sourceText = getSourceFileText(movelistCharactersRootPath, entry.sourcePath);
      const characterKey = toCamelKey(entry.characterId);
      const isGeneralMoveOwner = entry.characterId === generalMoveOwnerId;
      const aggregateMoveIds =
        snapshot.aggregateMoveIdsByCharacterId.get(entry.characterId) ?? new Set();

      expect(root).toBe("characters");
      expect(extra).toBeUndefined();
      expect(entry.characterId).toBe(fileName?.replace(/\.ts$/, ""));
      expect(entry.movelist.length).toBeGreaterThan(0);
      if (isGeneralMoveOwner) {
        expect(sourceText).not.toContain("mkxlXlFinalCharacterIds");
        expect(sourceText).toContain('const characterId = "general";');
      } else {
        expect(sourceText).toContain(
          'import { mkxlXlFinalCharacterIds as characterIds } from "../../character-ids";',
        );
        expect(sourceText).toContain(`const characterId = characterIds.${characterKey};`);
      }
      expect(sourceText).toContain("universal: {");
      expect(sourceText).toContain("variations: {");
      expect(sourceText).not.toMatch(/\bdefineMkxl[A-Za-z0-9]*\b/u);
      expect(sourceText).not.toContain("movelist: [");
      expect(sourceText).not.toContain("moves: {");
      expect(sourceText).not.toMatch(/\bcommunity[A-Z0-9][A-Za-z0-9]*\s*:/u);
      expect(sourceText).not.toMatch(/\b(toReadableEn|toMkxlSlug)\s*\(/u);
      expect(sourceText).not.toMatch(/\.(map|flatMap)\s*\(/u);
      expectMoveTreeAlignment(entry, sourceText, snapshot);

      for (const move of entry.movelist) {
        expectAuthoredMoveNamingPolicy(
          entry,
          move,
          aggregateMoveIds,
          snapshot.moveNotationValues,
          isGeneralMoveOwner,
        );
      }
    }
  });

  it("keeps combo routes built from moves", () => {
    const movesById = createMoveLookup();
    const moveNotationValues = new Set(mkxlMoveNotationValues);

    for (const combo of mkxlSeededCombos) {
      const expectedMovePath = [];
      const expectedNotation = [];
      for (const step of combo.route) {
        const move = movesById.get(step.moveId);

        expect(move).toBeDefined();
        if (!move) {
          continue;
        }

        expectedMovePath.push(move.id);
        expectedNotation.push(move.notation);
      }
      expect(combo.movePath).toEqual(expectedMovePath);
      expect(combo.notation).toEqual(expectedNotation);
      for (const notationValues of combo.notation) {
        for (const notationValue of notationValues) {
          expect(moveNotationValues.has(notationValue)).toBe(true);
        }
      }
    }
  });

  it("compiles a patch pack that adds a move and combo without rewriting base data", () => {
    const patchMove = {
      id: "scorpion:hellfire:test-patch-technique",
      characterId: "scorpion",
      label: {
        EN: "Test Patch Technique",
        fallback: "Test Patch Technique",
      },
      notation: [
        mkxlXlFinalFgcNotation.down,
        mkxlXlFinalFgcNotation.back,
        mkxlXlFinalFgcNotation.one,
      ],
      category: "variation",
      availability: {
        kind: "variation",
        variationIds: ["scorpion:hellfire"],
      },
      tags: ["variation", "patch-test"],
      sourceIds: ["in-game-practice-mode"],
    } as const;
    const patchPack = {
      id: "test-patch",
      gameVersion: "test-patch",
      extends: mkxlXlFinalPack,
      movePatches: [
        {
          action: "add",
          characterId: "scorpion",
          scope: "variation",
          variationKey: "hellfire",
          key: "testPatchTechnique",
          move: patchMove,
        },
      ],
      comboPatches: {
        add: [
          {
            sourcePath: "characters/scorpion/hellfire-test.ts",
            characterId: "scorpion",
            variationSlug: "hellfire",
            variationId: "scorpion:hellfire",
            combos: [
              {
                id: "scorpion-hellfire-test-patch-001",
                source: "seeded",
                gameId: "mkxl",
                title: {
                  EN: "Scorpion Hellfire test patch route",
                  fallback: "Scorpion Hellfire test patch route",
                },
                stageContext: {
                  kind: "stageAgnostic",
                },
                metadata: {
                  damage: 1,
                  meter: 0,
                  position: "midscreen",
                  starter: "Opening Assault",
                  routeType: "bnb",
                  difficulty: "easy",
                  tags: ["patch-test"],
                },
                notes: {
                  EN: "Patch-pack compile coverage.",
                  fallback: "Patch-pack compile coverage.",
                },
                gameVersion: "test-patch",
                sourceIds: ["in-game-practice-mode"],
                route: [
                  scorpionMoves.universal.openingAssault,
                  patchMove,
                  scorpionMoves.universal.closingStrike,
                ],
              },
            ],
          },
        ],
      },
    } as const satisfies MkxlDataPack;

    const patchedDataset = compileMkxlDataPack(patchPack);
    const patchedCombo = patchedDataset.seededCombos.find(
      (combo) => combo.id === "scorpion-hellfire-test-patch-001",
    );

    expect(patchedDataset.moves.some((move) => move.id === patchMove.id)).toBe(true);
    expect(patchedCombo?.movePath).toEqual([
      scorpionMoves.universal.openingAssault.id,
      patchMove.id,
      scorpionMoves.universal.closingStrike.id,
    ]);
    expect(patchedCombo?.notation[1]).toEqual(patchMove.notation);
  });

  it("keeps stage-specific combos inside one stage registry", () => {
    const stagesById = new Map<string, (typeof mkxlStages)[number]>();
    const interactableIds = new Set(mkxlInteractableIds);
    let stageSpecificComboCount = 0;

    for (const stage of mkxlStages) {
      stagesById.set(stage.id, stage);
    }
    for (const combo of mkxlSeededCombos) {
      if (combo.stageContext.kind !== "stageSpecific") {
        continue;
      }
      stageSpecificComboCount += 1;
      const stage = stagesById.get(combo.stageContext.stageId);

      expect(stage).toBeDefined();
      for (const interactableId of combo.stageContext.interactableIds) {
        expect(interactableIds.has(interactableId)).toBe(true);
        expect(
          stage?.interactables.some((interactable) => interactable.id === interactableId),
        ).toBe(true);
      }
    }

    expect(stageSpecificComboCount).toBeGreaterThan(0);
  });

  it("keeps MKXL roster complete without story or mobile-only NPCs", () => {
    const characterIds = new Set<string>();

    for (const character of mkxlCharacters) {
      characterIds.add(character.id);
    }

    expect(characterIds.has("baraka")).toBe(false);
    expect(characterIds.has("rain")).toBe(false);
    expect(characterIds.has("sindel")).toBe(false);
    expect(characterIds.has("triborg")).toBe(true);
    expect(mkxlVariations.some((variation) => variation.id === "triborg:cyber-sub-zero")).toBe(
      true,
    );
  });
});
