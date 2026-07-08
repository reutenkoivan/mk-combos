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
import { mkxlTransitions } from "@mk-combos/mkxl-data/transitions/value";
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
import { mkxlXlFinalTransitionRegistry as transitions } from "./packs/xl-final/transitions";

const authoredPackRootPath = join(process.cwd(), "src/packs/xl-final");
const comboCharactersRootPath = join(process.cwd(), "src/packs/xl-final/combos/characters");
const movelistCharactersRootPath = join(process.cwd(), "src/packs/xl-final/moves/characters");

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

const genericMoveLabels = new Set([
  "Starter string",
  "Launcher",
  "Combo ender",
  "Enhanced cashout",
]);

const isMoveRecord = (value: unknown): value is (typeof mkxlMoves)[number] => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return typeof record.id === "string" && typeof record.characterId === "string";
};

const collectMoveTreeMoves = (value: unknown): readonly (typeof mkxlMoves)[number][] => {
  if (isMoveRecord(value)) {
    return [value];
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  return Object.values(value as Record<string, unknown>).flatMap((child) =>
    collectMoveTreeMoves(child),
  );
};

const collectUniqueMoveTreeMoves = (
  value: unknown,
  seenMoves = new Set<(typeof mkxlMoves)[number]>(),
): readonly (typeof mkxlMoves)[number][] => {
  if (isMoveRecord(value)) {
    if (seenMoves.has(value)) {
      return [];
    }

    seenMoves.add(value);
    return [value];
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  return Object.values(value as Record<string, unknown>).flatMap((child) =>
    collectUniqueMoveTreeMoves(child, seenMoves),
  );
};

const collectCharacterSourcePaths = (
  rootPath: string,
  directoryPath = rootPath,
): readonly string[] =>
  readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return collectCharacterSourcePaths(rootPath, entryPath);
    }

    if (!entry.isFile() || !entry.name.endsWith(".ts")) {
      return [];
    }

    return [`characters/${relative(rootPath, entryPath).split(sep).join("/")}`];
  });

const collectTypeScriptSourcePaths = (
  rootPath: string,
  directoryPath = rootPath,
): readonly string[] =>
  readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return collectTypeScriptSourcePaths(rootPath, entryPath);
    }

    if (!entry.isFile() || !entry.name.endsWith(".ts")) {
      return [];
    }

    return [relative(rootPath, entryPath).split(sep).join("/")];
  });

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
    const rosterCharacterIds = mkxlCharacters.map((character) => character.id);

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

  it("keeps general moves reusable through transitions without character-owned clones", () => {
    const movesById = new Map(mkxlMoves.map((move) => [move.id, move]));
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
    const comboVariationIds = new Set(mkxlSeededCombos.map((combo) => combo.variationId));

    expect(mkxlSeededCombos).toHaveLength(362);
    expect(comboVariationIds.size).toBe(mkxlVariations.length);
    for (const variation of mkxlVariations) {
      expect(comboVariationIds.has(variation.id)).toBe(true);
    }
  });

  it("keeps seeded combo files aligned with the variation registry", () => {
    const expectedVariationIds = new Set(mkxlVariations.map((variation) => variation.id));
    const registryVariationIds = mkxlComboFileRegistry.map((entry) => entry.variationId);
    const registrySourcePaths = mkxlComboFileRegistry.map((entry) => entry.sourcePath);
    const sourcePathsOnDisk = collectCharacterSourcePaths(comboCharactersRootPath);

    expect(mkxlComboFileRegistry).toHaveLength(mkxlVariations.length);
    expect(new Set(registryVariationIds)).toEqual(expectedVariationIds);
    expect(new Set(registrySourcePaths).size).toBe(registrySourcePaths.length);
    expect(new Set(sourcePathsOnDisk)).toEqual(new Set(registrySourcePaths));

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

  it("keeps authored combo routes sourced only from transitions", () => {
    for (const entry of mkxlComboFileRegistry) {
      const sourceText = getSourceFileText(comboCharactersRootPath, entry.sourcePath);
      const characterKey = toCamelKey(entry.characterId);
      const expectedCharacterIdsImport =
        'import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";';
      const expectedTransitionImport =
        'import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";';
      const routeBlocks = [...sourceText.matchAll(/route:\s*\[(?<body>[^\]]*)\]/gu)];
      const comboObjectDeclarations = [
        ...sourceText.matchAll(
          /const (?<name>[a-z][A-Za-z0-9]*Combo) = \{[\s\S]*?\n\} as const satisfies MkxlAuthoredSeededCombo;/gu,
        ),
      ];
      const comboObjectNames = new Set(
        comboObjectDeclarations.map((declaration) => declaration.groups?.name ?? ""),
      );
      const expectedComboObjectNames = new Set(
        entry.combos.map((combo) => `${toCamelKey(combo.id)}Combo`),
      );
      const combosBlock = /combos:\s*\[(?<body>[\s\S]*?)\]/u.exec(sourceText);
      const comboRefs = (combosBlock?.groups?.body ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
      const transitionReferencePattern = /^transitions(?:\.[a-z][A-Za-z0-9]*){2,3},?$/u;

      expect(sourceText).toContain(expectedCharacterIdsImport);
      expect(sourceText).toContain(expectedTransitionImport);
      expect(sourceText).not.toContain("Moves.");
      expect(sourceText).not.toContain("globalMoves.");
      expect(sourceText).not.toContain("routeTransitions.");
      expect(sourceText).toContain("MkxlAuthoredSeededCombo");
      expect(sourceText).toContain(`const characterId = characterIds.${characterKey};`);
      expect(sourceText).toContain(`const variationSlug = "${entry.variationSlug}";`);
      expect(sourceText).toMatch(
        /const variationId = `\$\{characterId\}:\$\{variationSlug\}` as const;/u,
      );
      expect(sourceText).toContain("characterId,");
      expect(sourceText).toContain("variationSlug,");
      expect(sourceText).toContain("variationId,");
      expect(comboObjectDeclarations).toHaveLength(entry.combos.length);
      expect(comboObjectNames).toEqual(expectedComboObjectNames);
      expect(combosBlock).not.toBeNull();
      expect(combosBlock?.groups?.body ?? "").not.toMatch(/["'{}]/u);
      expect(comboRefs).toHaveLength(entry.combos.length);
      for (const comboRef of comboRefs) {
        expect(comboRef).toMatch(/^[a-z][A-Za-z0-9]*Combo$/u);
        expect(comboObjectNames.has(comboRef)).toBe(true);
      }
      expect(routeBlocks).toHaveLength(entry.combos.length);
      for (const routeBlock of routeBlocks) {
        const routeBody = routeBlock.groups?.body ?? "";
        const routeEntries = routeBody
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean);

        expect(routeEntries.length).toBeGreaterThan(0);
        expect(routeBody).not.toMatch(/\bid\s*:/u);
        expect(routeBody).not.toMatch(/\bmoveId\s*:/u);
        expect(routeBody).not.toMatch(/["'{}]/u);
        for (const routeEntry of routeEntries) {
          expect(transitionReferencePattern.test(routeEntry)).toBe(true);
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
        const notationRefs = (notationBlock.groups?.body ?? "")
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean);

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
    const generalMoveOwnerId = "general";
    const expectedRosterCharacterIds = new Set(mkxlCharacters.map((character) => character.id));
    const expectedMoveOwnerIds = new Set([...expectedRosterCharacterIds, generalMoveOwnerId]);
    const registryCharacterIds = mkxlMovelistFileRegistry.map((entry) => entry.characterId);
    const registrySourcePaths = mkxlMovelistFileRegistry.map((entry) => entry.sourcePath);
    const sourcePathsOnDisk = collectCharacterSourcePaths(movelistCharactersRootPath);
    const moveTreeRegistryEntries = Object.entries(mkxlMoveTreeRegistry);
    const moveNotationValues = new Set(mkxlMoveNotationValues);
    const moveTreeByCharacterId = new Map(
      moveTreeRegistryEntries.map(([_registryKey, entry]) => [entry.characterId, entry.moves]),
    );
    const movelistByCharacterId = new Map(
      mkxlMovelistFileRegistry.map((entry) => [entry.characterId, entry]),
    );

    expect(mkxlMovelistFileRegistry).toHaveLength(expectedMoveOwnerIds.size);
    expect(moveTreeRegistryEntries).toHaveLength(expectedMoveOwnerIds.size);
    expect(new Set(registryCharacterIds)).toEqual(expectedMoveOwnerIds);
    expect(
      new Set(moveTreeRegistryEntries.map(([_registryKey, entry]) => entry.characterId)),
    ).toEqual(expectedMoveOwnerIds);
    expect(new Set(moveTreeRegistryEntries.map(([registryKey]) => registryKey))).toEqual(
      new Set([...expectedMoveOwnerIds].map((characterId) => toCamelKey(characterId))),
    );
    for (const [registryKey, entry] of moveTreeRegistryEntries) {
      expect(registryKey).toBe(toCamelKey(entry.characterId));
      expect(movelistByCharacterId.get(entry.characterId)).toBe(entry);
    }
    expect(new Set(registrySourcePaths).size).toBe(registrySourcePaths.length);
    expect(new Set(sourcePathsOnDisk)).toEqual(new Set(registrySourcePaths));
    expect(new Set(mkxlMovelists.map((movelist) => movelist.characterId))).toEqual(
      expectedMoveOwnerIds,
    );

    for (const movelist of mkxlMovelists) {
      expect("sourcePath" in movelist).toBe(false);
    }

    for (const entry of mkxlMovelistFileRegistry) {
      const [root, fileName, extra] = entry.sourcePath.split("/");
      const sourceText = getSourceFileText(movelistCharactersRootPath, entry.sourcePath);
      const characterKey = toCamelKey(entry.characterId);
      const isGeneralMoveOwner = entry.characterId === generalMoveOwnerId;
      const characterMoveTree = moveTreeByCharacterId.get(entry.characterId) as
        | Record<string, unknown>
        | undefined;
      const aggregateMoveRefs = new Set(entry.movelist);
      const aggregateMoveIds = new Set(
        mkxlMovelists
          .filter((movelist) => movelist.characterId === entry.characterId)
          .flatMap((movelist) => movelist.movelist.map((move) => move.id)),
      );
      const treeMoves = collectMoveTreeMoves(characterMoveTree);
      const uniqueTreeMoves = collectUniqueMoveTreeMoves(characterMoveTree);

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
      expect(entry.movelist).toEqual(uniqueTreeMoves);
      expect(new Set(treeMoves.map((move) => move.id))).toEqual(
        new Set(entry.movelist.map((move) => move.id)),
      );

      for (const move of treeMoves) {
        expect(aggregateMoveRefs.has(move)).toBe(true);
      }

      for (const variation of mkxlVariations.filter(
        (candidate) => candidate.characterId === entry.characterId,
      )) {
        const variationSlug = variation.id.split(":")[1] ?? "";
        const variationKey = toCamelKey(variationSlug);

        expect(sourceText).toContain(`${variationKey}: {`);
        expect(characterMoveTree?.[variationKey]).toBeDefined();
      }

      for (const move of entry.movelist) {
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
          expect(move.tags).toContain("transition-source");
        }

        if (move.availability.kind === "variation") {
          const variationId = move.availability.variationIds[0];
          const variationSlug = variationId?.split(":")[1];

          expect(move.id).toBe(`${entry.characterId}:${variationSlug}:${labelSlug}`);
          for (const variationId of move.availability.variationIds) {
            expect(variationId.split(":")[0]).toBe(entry.characterId);
          }
        } else if (move.availability.kind === "universal") {
          const expectedId = move.tags.includes("transition-source")
            ? `${entry.characterId}:universal:${labelSlug}`
            : `${entry.characterId}:${labelSlug}`;

          expect(move.id).toBe(expectedId);
        }
      }
    }
  });

  it("keeps transitions built from moves and combo routes built from transitions", () => {
    const movesById = new Map(mkxlMoves.map((move) => [move.id, move]));
    const transitionsById = new Map(
      mkxlTransitions.map((transition) => [transition.id, transition]),
    );
    const moveNotationValues = new Set(mkxlMoveNotationValues);
    const usedTransitionIds = new Set<string>();

    expect(mkxlTransitions.length).toBeGreaterThan(366);

    for (const transition of mkxlTransitions) {
      const expectedMovePath = [];
      const expectedNotation = [];

      for (const step of transition.route) {
        const move = movesById.get(step.moveId);

        expect(move).toBeDefined();
        if (!move) {
          continue;
        }

        expectedMovePath.push(move.id);
        expectedNotation.push(move.notation);
      }

      expect(transition.movePath).toEqual(expectedMovePath);
      expect(transition.notation).toEqual(expectedNotation);
    }

    for (const combo of mkxlSeededCombos) {
      const expectedMovePath = [];
      const expectedNotation = [];
      for (const step of combo.route) {
        const transition = transitionsById.get(step.transitionId);

        expect(transition).toBeDefined();
        if (!transition) {
          continue;
        }

        usedTransitionIds.add(transition.id);
        expectedMovePath.push(...transition.movePath);
        expectedNotation.push(...transition.notation);
      }
      expect(combo.movePath).toEqual(expectedMovePath);
      expect(combo.notation).toEqual(expectedNotation);
      for (const notationValues of combo.notation) {
        for (const notationValue of notationValues) {
          expect(moveNotationValues.has(notationValue)).toBe(true);
        }
      }
    }

    expect(usedTransitionIds).toEqual(new Set(mkxlTransitions.map((transition) => transition.id)));
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
    const patchTransition = {
      id: "scorpion:hellfire:test-patch-technique",
      label: patchMove.label,
      route: [patchMove],
      tags: patchMove.tags,
      sourceIds: patchMove.sourceIds,
    } as const;
    const patchPack = {
      id: "test-patch",
      gameVersion: "test-patch",
      extends: mkxlXlFinalPack,
      transitions: [patchTransition],
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
                  transitions.scorpion.universal.openingAssault,
                  patchTransition,
                  transitions.scorpion.universal.closingStrike,
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
    const stagesById = new Map(mkxlStages.map((stage) => [stage.id, stage]));
    const interactableIds = new Set(mkxlInteractableIds);
    const stageSpecificCombos = mkxlSeededCombos.filter(
      (combo) => combo.stageContext.kind === "stageSpecific",
    );

    expect(stageSpecificCombos.length).toBeGreaterThan(0);
    for (const combo of stageSpecificCombos) {
      if (combo.stageContext.kind !== "stageSpecific") {
        continue;
      }
      const stage = stagesById.get(combo.stageContext.stageId);

      expect(stage).toBeDefined();
      for (const interactableId of combo.stageContext.interactableIds) {
        expect(interactableIds.has(interactableId)).toBe(true);
        expect(
          stage?.interactables.some((interactable) => interactable.id === interactableId),
        ).toBe(true);
      }
    }
  });

  it("keeps MKXL roster complete without story or mobile-only NPCs", () => {
    const characterIds = new Set(mkxlCharacters.map((character) => character.id));

    expect(characterIds.has("baraka")).toBe(false);
    expect(characterIds.has("rain")).toBe(false);
    expect(characterIds.has("sindel")).toBe(false);
    expect(characterIds.has("triborg")).toBe(true);
    expect(mkxlVariations.some((variation) => variation.id === "triborg:cyber-sub-zero")).toBe(
      true,
    );
  });
});
