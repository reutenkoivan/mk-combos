import { mkxlComboFileRegistry } from "../combos/registry";
import { mkxlSeededCombos } from "../combos/value";
import { mkxlDataSourceIds, mkxlDataSources, mkxlGame } from "../game/value";
import { mkxlStageGraphFragments, mkxlVariationGraphs } from "../graph/value";
import { mkxlMovelistFileRegistry, mkxlMoveTreeRegistry } from "../movelists/registry";
import { mkxlMovelists, mkxlMoveNotationValues, mkxlMoves } from "../movelists/value";
import { mkxlCharacters } from "../roster/value";
import type { MkxlLabel, MkxlSourceIdList } from "../shared/type";
import { mkxlInteractableIds, mkxlStages } from "../stages/value";
import { mkxlVariations, mkxlVariationsByCharacterId } from "../variations/value";
import type { MkxlDataValidationIssue, MkxlDataValidationResult } from "./type";
import { mkxlCoverageTargets, mkxlDataCounts } from "./value";

const createIssue = (
  code: string,
  message: string,
  path?: readonly string[],
): MkxlDataValidationIssue => ({
  code,
  message,
  path,
});

const hasReadableLabel = (label: MkxlLabel) =>
  Boolean(label.EN ?? label.UA ?? label.default ?? label.fallback);

const genericMoveLabels = new Set([
  "Starter string",
  "Launcher",
  "Combo ender",
  "Enhanced cashout",
]);

const knownSourceIds = new Set<string>(mkxlDataSourceIds);
const knownMoveNotationValues = new Set<string>(mkxlMoveNotationValues);
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

const assertUnique = (
  values: readonly string[],
  label: string,
  issues: MkxlDataValidationIssue[],
) => {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      issues.push(createIssue("mkxl.data.duplicate_id", `${label} id is duplicated: ${value}`));
    }
    seen.add(value);
  }
};

const assertKnownSources = (
  sourceIds: MkxlSourceIdList,
  path: readonly string[],
  issues: MkxlDataValidationIssue[],
) => {
  for (const sourceId of sourceIds) {
    if (!knownSourceIds.has(sourceId)) {
      issues.push(createIssue("mkxl.data.unknown_source", `Unknown source id: ${sourceId}`, path));
    }
  }
};

const assertLabel = (
  label: MkxlLabel,
  path: readonly string[],
  issues: MkxlDataValidationIssue[],
) => {
  if (!hasReadableLabel(label)) {
    issues.push(createIssue("mkxl.data.missing_label", "Record has no readable label.", path));
  }
};

const validateProvenance = (issues: MkxlDataValidationIssue[]) => {
  for (const source of mkxlDataSources) {
    assertLabel({ EN: source.label, fallback: source.label }, ["sources", source.id], issues);
  }

  assertKnownSources(mkxlGame.sourceIds, ["game", mkxlGame.id], issues);

  for (const character of mkxlCharacters) {
    assertKnownSources(character.sourceIds, ["roster", character.id], issues);
    assertLabel(character.label, ["roster", character.id], issues);
  }

  for (const variation of mkxlVariations) {
    assertKnownSources(variation.sourceIds, ["variations", variation.id], issues);
    assertLabel(variation.label, ["variations", variation.id], issues);
  }

  for (const movelist of mkxlMovelists) {
    assertKnownSources(movelist.sourceIds, ["movelists", movelist.characterId], issues);
    for (const move of movelist.movelist) {
      assertKnownSources(move.sourceIds, ["moves", move.id], issues);
      assertLabel(move.label, ["moves", move.id], issues);
    }
  }

  for (const combo of mkxlSeededCombos) {
    assertKnownSources(combo.sourceIds, ["combos", combo.id], issues);
    assertLabel(combo.title, ["combos", combo.id], issues);
    assertLabel(combo.notes, ["combos", combo.id, "notes"], issues);
  }

  for (const stage of mkxlStages) {
    assertKnownSources(stage.sourceIds, ["stages", stage.id], issues);
    assertLabel(stage.label, ["stages", stage.id], issues);
    for (const interactable of stage.interactables) {
      assertKnownSources(interactable.sourceIds, ["interactables", interactable.id], issues);
      assertLabel(interactable.label, ["interactables", interactable.id], issues);
    }
  }
};

const validateCoverage = (issues: MkxlDataValidationIssue[]) => {
  if (mkxlCharacters.length !== mkxlCoverageTargets.expectedCharacterCount) {
    issues.push(
      createIssue(
        "mkxl.data.character_count",
        `Expected ${mkxlCoverageTargets.expectedCharacterCount} characters, got ${mkxlCharacters.length}.`,
      ),
    );
  }

  if (mkxlVariations.length !== mkxlCoverageTargets.expectedVariationCount) {
    issues.push(
      createIssue(
        "mkxl.data.variation_count",
        `Expected ${mkxlCoverageTargets.expectedVariationCount} variations, got ${mkxlVariations.length}.`,
      ),
    );
  }

  if (mkxlStages.length !== mkxlCoverageTargets.expectedStageCount) {
    issues.push(
      createIssue(
        "mkxl.data.stage_count",
        `Expected ${mkxlCoverageTargets.expectedStageCount} stages, got ${mkxlStages.length}.`,
      ),
    );
  }
};

type ReferenceValidationLookups = {
  characterIds: ReadonlySet<string>;
  characterIdValues: readonly string[];
  variationIds: ReadonlySet<string>;
  variationIdValues: readonly string[];
  moveById: ReadonlyMap<string, (typeof mkxlMoves)[number]>;
  moveIdValues: readonly string[];
  comboIdValues: readonly string[];
  stageIds: ReadonlySet<string>;
  stageIdValues: readonly string[];
  interactableIds: ReadonlySet<string>;
};

const createReferenceValidationLookups = (): ReferenceValidationLookups => {
  const characterIds = new Set<string>();
  const characterIdValues: string[] = [];
  const variationIds = new Set<string>();
  const variationIdValues: string[] = [];
  const moveById = new Map<string, (typeof mkxlMoves)[number]>();
  const moveIdValues: string[] = [];
  const comboIdValues: string[] = [];
  const stageIds = new Set<string>();
  const stageIdValues: string[] = [];
  const interactableIds = new Set(mkxlInteractableIds);

  for (const character of mkxlCharacters) {
    characterIds.add(character.id);
    characterIdValues.push(character.id);
  }
  for (const variation of mkxlVariations) {
    variationIds.add(variation.id);
    variationIdValues.push(variation.id);
  }
  for (const move of mkxlMoves) {
    moveById.set(move.id, move);
    moveIdValues.push(move.id);
  }
  for (const combo of mkxlSeededCombos) {
    comboIdValues.push(combo.id);
  }
  for (const stage of mkxlStages) {
    stageIds.add(stage.id);
    stageIdValues.push(stage.id);
  }

  return {
    characterIds,
    characterIdValues,
    variationIds,
    variationIdValues,
    moveById,
    moveIdValues,
    comboIdValues,
    stageIds,
    stageIdValues,
    interactableIds,
  };
};

const validateCharacterVariationCoverage = (issues: MkxlDataValidationIssue[]) => {
  for (const character of mkxlCharacters) {
    const variations = mkxlVariationsByCharacterId[character.id] ?? [];
    const expectedVariationCount = character.id === "triborg" ? 4 : 3;

    if (variations.length !== expectedVariationCount) {
      issues.push(
        createIssue(
          "mkxl.data.character_variation_count",
          `${character.id} expected ${expectedVariationCount} variations, got ${variations.length}.`,
          ["variations", character.id],
        ),
      );
    }
  }
};

const validateVariationCharacterReferences = (
  issues: MkxlDataValidationIssue[],
  lookups: ReferenceValidationLookups,
) => {
  for (const variation of mkxlVariations) {
    if (!lookups.characterIds.has(variation.characterId)) {
      issues.push(
        createIssue(
          "mkxl.data.variation_character_missing",
          `${variation.id} references missing character ${variation.characterId}.`,
          ["variations", variation.id],
        ),
      );
    }
  }
};

const validateMovelistCharacterReferences = (
  issues: MkxlDataValidationIssue[],
  lookups: ReferenceValidationLookups,
) => {
  for (const movelist of mkxlMovelists) {
    if (
      !lookups.characterIds.has(movelist.characterId) &&
      movelist.characterId !== generalMoveOwnerId
    ) {
      issues.push(
        createIssue(
          "mkxl.data.movelist_character_missing",
          `${movelist.characterId} has no roster entry.`,
          ["movelists", movelist.characterId],
        ),
      );
    }
  }
};

const validateMoveReferences = (
  issues: MkxlDataValidationIssue[],
  lookups: ReferenceValidationLookups,
) => {
  for (const move of mkxlMoves) {
    if (!lookups.characterIds.has(move.characterId) && move.characterId !== generalMoveOwnerId) {
      issues.push(
        createIssue(
          "mkxl.data.move_character_missing",
          `${move.id} references missing character ${move.characterId}.`,
          ["moves", move.id],
        ),
      );
    }
    for (const [index, notationValue] of move.notation.entries()) {
      if (!knownMoveNotationValues.has(notationValue)) {
        issues.push(
          createIssue(
            "mkxl.data.move_notation_unknown",
            `${move.id} references unknown notation value ${notationValue}.`,
            ["moves", move.id, `notation.${index}`],
          ),
        );
      }
    }
    if (move.availability.kind === "variation") {
      for (const variationId of move.availability.variationIds) {
        if (!lookups.variationIds.has(variationId)) {
          issues.push(
            createIssue(
              "mkxl.data.move_variation_missing",
              `${move.id} references missing variation ${variationId}.`,
              ["moves", move.id],
            ),
          );
        }
      }
    }
  }
};

const validateComboMovePathReferences = (
  combo: (typeof mkxlSeededCombos)[number],
  lookups: ReferenceValidationLookups,
  issues: MkxlDataValidationIssue[],
) => {
  for (const [index, moveId] of combo.movePath.entries()) {
    const move = lookups.moveById.get(moveId);

    if (!move) {
      issues.push(
        createIssue(
          "mkxl.data.combo_move_missing",
          `${combo.id} references missing move ${moveId}.`,
          ["combos", combo.id, `movePath.${index}`],
        ),
      );
      continue;
    }

    if (move.characterId !== combo.characterId && move.characterId !== generalMoveOwnerId) {
      issues.push(
        createIssue(
          "mkxl.data.combo_move_character_mismatch",
          `${combo.id} references ${move.id} owned by ${move.characterId}.`,
          ["combos", combo.id, `movePath.${index}`],
        ),
      );
    }
    if (
      move.availability.kind === "variation" &&
      !move.availability.variationIds.includes(combo.variationId)
    ) {
      issues.push(
        createIssue(
          "mkxl.data.combo_move_variation_mismatch",
          `${combo.id} references ${move.id} outside ${combo.variationId}.`,
          ["combos", combo.id, `movePath.${index}`],
        ),
      );
    }
  }
};

const validateComboDerivedRouteFields = (
  combo: (typeof mkxlSeededCombos)[number],
  lookups: ReferenceValidationLookups,
  issues: MkxlDataValidationIssue[],
) => {
  const expectedMovePath: string[] = [];
  const expectedNotation: (readonly string[])[] = [];

  for (const [index, step] of combo.route.entries()) {
    const move = lookups.moveById.get(step.moveId);
    expectedMovePath.push(step.moveId);
    expectedNotation.push(move?.notation ?? []);

    if (!move) {
      issues.push(
        createIssue(
          "mkxl.data.combo_route_move_missing",
          `${combo.id} references missing move ${step.moveId}.`,
          ["combos", combo.id, `route.${index}`],
        ),
      );
      continue;
    }

    if (move.characterId !== combo.characterId && move.characterId !== generalMoveOwnerId) {
      issues.push(
        createIssue(
          "mkxl.data.combo_route_move_character_mismatch",
          `${combo.id} references ${move.id} owned by ${move.characterId}.`,
          ["combos", combo.id, `route.${index}`],
        ),
      );
    }
    if (
      move.availability.kind === "variation" &&
      !move.availability.variationIds.includes(combo.variationId)
    ) {
      issues.push(
        createIssue(
          "mkxl.data.combo_route_move_variation_mismatch",
          `${combo.id} references ${move.id} outside ${combo.variationId}.`,
          ["combos", combo.id, `route.${index}`],
        ),
      );
    }
  }

  if (JSON.stringify(combo.movePath) !== JSON.stringify(expectedMovePath)) {
    issues.push(
      createIssue(
        "mkxl.data.combo_move_path_mismatch",
        `${combo.id} move path must be derived from its route moves.`,
        ["combos", combo.id, "movePath"],
      ),
    );
  }

  if (
    expectedNotation.length > 0 &&
    JSON.stringify(combo.notation) !== JSON.stringify(expectedNotation)
  ) {
    issues.push(
      createIssue(
        "mkxl.data.combo_notation_mismatch",
        `${combo.id} notation must be derived from its route moves.`,
        ["combos", combo.id, "notation"],
      ),
    );
  }
};

const validateComboStageContext = (
  combo: (typeof mkxlSeededCombos)[number],
  lookups: ReferenceValidationLookups,
  issues: MkxlDataValidationIssue[],
) => {
  if (combo.stageContext.kind !== "stageSpecific") {
    return;
  }

  if (!lookups.stageIds.has(combo.stageContext.stageId)) {
    issues.push(
      createIssue(
        "mkxl.data.combo_stage_missing",
        `${combo.id} references missing stage ${combo.stageContext.stageId}.`,
        ["combos", combo.id],
      ),
    );
  }
  for (const interactableId of combo.stageContext.interactableIds) {
    if (!lookups.interactableIds.has(interactableId)) {
      issues.push(
        createIssue(
          "mkxl.data.combo_interactable_missing",
          `${combo.id} references missing interactable ${interactableId}.`,
          ["combos", combo.id],
        ),
      );
    }
  }
};

const validateComboReferences = (
  issues: MkxlDataValidationIssue[],
  lookups: ReferenceValidationLookups,
) => {
  for (const combo of mkxlSeededCombos) {
    if (!lookups.characterIds.has(combo.characterId)) {
      issues.push(
        createIssue(
          "mkxl.data.combo_character_missing",
          `${combo.id} references missing character ${combo.characterId}.`,
          ["combos", combo.id],
        ),
      );
    }
    if (!lookups.variationIds.has(combo.variationId)) {
      issues.push(
        createIssue(
          "mkxl.data.combo_variation_missing",
          `${combo.id} references missing variation ${combo.variationId}.`,
          ["combos", combo.id],
        ),
      );
    }

    validateComboMovePathReferences(combo, lookups, issues);
    validateComboDerivedRouteFields(combo, lookups, issues);
    validateComboStageContext(combo, lookups, issues);
  }
};

const validateReferences = (issues: MkxlDataValidationIssue[]) => {
  const lookups = createReferenceValidationLookups();

  assertUnique(lookups.characterIdValues, "Character", issues);
  assertUnique(lookups.variationIdValues, "Variation", issues);
  assertUnique(lookups.moveIdValues, "Move", issues);
  assertUnique(lookups.comboIdValues, "Combo", issues);
  assertUnique(lookups.stageIdValues, "Stage", issues);
  assertUnique(mkxlInteractableIds, "Interactable", issues);

  validateCharacterVariationCoverage(issues);
  validateVariationCharacterReferences(issues, lookups);
  validateMovelistCharacterReferences(issues, lookups);
  validateMoveReferences(issues, lookups);
  validateComboReferences(issues, lookups);
};

const validateMoveNamePolicy = (issues: MkxlDataValidationIssue[]) => {
  for (const move of mkxlMoves) {
    const labelEn = move.label.EN;

    if (move.sourceIds.includes("community-combo-source") && !move.tags.includes("route-source")) {
      issues.push(
        createIssue(
          "mkxl.data.move_community_source",
          `${move.id} must not use community combo source as move provenance.`,
          ["moves", move.id],
        ),
      );
    }

    if (!labelEn) {
      issues.push(
        createIssue(
          "mkxl.data.move_official_name_missing",
          `${move.id} must provide an English official move name.`,
          ["moves", move.id],
        ),
      );
      continue;
    }

    if (genericMoveLabels.has(labelEn) || /\bsignature\b/iu.test(labelEn)) {
      issues.push(
        createIssue(
          "mkxl.data.move_placeholder_name",
          `${move.id} still uses a generic move label: ${labelEn}.`,
          ["moves", move.id],
        ),
      );
    }

    const labelSlug = toMkxlSlug(labelEn);

    if (move.availability.kind === "variation") {
      const variationId = move.availability.variationIds[0];
      const variationSlug = variationId?.split(":")[1];
      const expectedId = `${move.characterId}:${variationSlug}:${labelSlug}`;

      if (move.id !== expectedId) {
        issues.push(
          createIssue(
            "mkxl.data.move_id_official_name_slug",
            `${move.id} must use official-name slug id ${expectedId}.`,
            ["moves", move.id],
          ),
        );
      }
      continue;
    }

    if (move.availability.kind === "universal") {
      const expectedId = move.tags.includes("route-source")
        ? `${move.characterId}:universal:${labelSlug}`
        : `${move.characterId}:${labelSlug}`;

      if (move.id !== expectedId) {
        issues.push(
          createIssue(
            "mkxl.data.move_id_official_name_slug",
            `${move.id} must use official-name slug id ${expectedId}.`,
            ["moves", move.id],
          ),
        );
      }
    }
  }
};

const validateComboFileRegistry = (issues: MkxlDataValidationIssue[]) => {
  const variationIds = new Set<string>();
  const registryCountsByVariation = new Map<string, number>();
  const sourcePaths = new Set<string>();

  for (const variation of mkxlVariations) {
    variationIds.add(variation.id);
  }

  for (const entry of mkxlComboFileRegistry) {
    registryCountsByVariation.set(
      entry.variationId,
      (registryCountsByVariation.get(entry.variationId) ?? 0) + 1,
    );

    if (sourcePaths.has(entry.sourcePath)) {
      issues.push(
        createIssue(
          "mkxl.data.combo_file_duplicate",
          `${entry.sourcePath} is registered more than once.`,
          ["combos", entry.sourcePath],
        ),
      );
    }
    sourcePaths.add(entry.sourcePath);

    const [root, pathCharacterId, fileName, extra] = entry.sourcePath.split("/");
    const pathVariationSlug = fileName?.replace(/\.ts$/, "");

    if (
      root !== "characters" ||
      extra !== undefined ||
      pathCharacterId !== entry.characterId ||
      pathVariationSlug !== entry.variationSlug
    ) {
      issues.push(
        createIssue(
          "mkxl.data.combo_file_path",
          `${entry.sourcePath} does not match ${entry.characterId}/${entry.variationSlug}.`,
          ["combos", entry.sourcePath],
        ),
      );
    }

    if (entry.variationId !== `${entry.characterId}:${entry.variationSlug}`) {
      issues.push(
        createIssue(
          "mkxl.data.combo_file_variation_id",
          `${entry.sourcePath} variation id does not match its character and slug.`,
          ["combos", entry.sourcePath],
        ),
      );
    }

    if (!variationIds.has(entry.variationId)) {
      issues.push(
        createIssue(
          "mkxl.data.combo_file_variation_missing",
          `${entry.sourcePath} references missing variation ${entry.variationId}.`,
          ["combos", entry.sourcePath],
        ),
      );
    }

    for (const combo of entry.combos) {
      if (combo.characterId !== entry.characterId || combo.variationId !== entry.variationId) {
        issues.push(
          createIssue(
            "mkxl.data.combo_file_combo_mismatch",
            `${combo.id} does not belong to ${entry.sourcePath}.`,
            ["combos", entry.sourcePath, combo.id],
          ),
        );
      }
    }
  }

  for (const variation of mkxlVariations) {
    const registryCount = registryCountsByVariation.get(variation.id) ?? 0;
    if (registryCount !== 1) {
      issues.push(
        createIssue(
          "mkxl.data.combo_file_variation_coverage",
          `${variation.id} has ${registryCount} combo file registry entries.`,
          ["combos", variation.id],
        ),
      );
    }
  }
};

const validateMovelistFileRegistry = (issues: MkxlDataValidationIssue[]) => {
  const characterIds = new Set<string>();
  const variationsById = new Map<string, (typeof mkxlVariations)[number]>();
  const registryCountsByCharacter = new Map<string, number>();
  const aggregateCountsByCharacter = new Map<string, number>();
  const sourcePaths = new Set<string>();

  for (const character of mkxlCharacters) {
    characterIds.add(character.id);
  }
  for (const variation of mkxlVariations) {
    variationsById.set(variation.id, variation);
  }

  for (const movelist of mkxlMovelists) {
    aggregateCountsByCharacter.set(
      movelist.characterId,
      (aggregateCountsByCharacter.get(movelist.characterId) ?? 0) + 1,
    );
  }

  for (const entry of mkxlMovelistFileRegistry) {
    registryCountsByCharacter.set(
      entry.characterId,
      (registryCountsByCharacter.get(entry.characterId) ?? 0) + 1,
    );

    if (sourcePaths.has(entry.sourcePath)) {
      issues.push(
        createIssue(
          "mkxl.data.movelist_file_duplicate",
          `${entry.sourcePath} is registered more than once.`,
          ["movelists", entry.sourcePath],
        ),
      );
    }
    sourcePaths.add(entry.sourcePath);

    const [root, fileName, extra] = entry.sourcePath.split("/");
    const pathCharacterId = fileName?.replace(/\.ts$/, "");

    if (
      root !== "characters" ||
      extra !== undefined ||
      !fileName?.endsWith(".ts") ||
      pathCharacterId !== entry.characterId
    ) {
      issues.push(
        createIssue(
          "mkxl.data.movelist_file_path",
          `${entry.sourcePath} does not match ${entry.characterId}.`,
          ["movelists", entry.sourcePath],
        ),
      );
    }

    if (!characterIds.has(entry.characterId) && entry.characterId !== generalMoveOwnerId) {
      issues.push(
        createIssue(
          "mkxl.data.movelist_file_character_missing",
          `${entry.sourcePath} references missing character ${entry.characterId}.`,
          ["movelists", entry.sourcePath],
        ),
      );
    }

    for (const move of entry.movelist) {
      if (move.characterId !== entry.characterId) {
        issues.push(
          createIssue(
            "mkxl.data.movelist_file_move_mismatch",
            `${move.id} does not belong to ${entry.sourcePath}.`,
            ["movelists", entry.sourcePath, move.id],
          ),
        );
      }

      if (move.availability.kind === "variation") {
        for (const variationId of move.availability.variationIds) {
          const variation = variationsById.get(variationId);
          if (variation && variation.characterId !== entry.characterId) {
            issues.push(
              createIssue(
                "mkxl.data.movelist_file_variation_character_mismatch",
                `${move.id} references variation ${variationId} owned by ${variation.characterId}.`,
                ["movelists", entry.sourcePath, move.id],
              ),
            );
          }
        }
      }
    }
  }

  for (const character of mkxlCharacters) {
    const registryCount = registryCountsByCharacter.get(character.id) ?? 0;
    if (registryCount !== 1) {
      issues.push(
        createIssue(
          "mkxl.data.movelist_file_character_coverage",
          `${character.id} has ${registryCount} movelist file registry entries.`,
          ["movelists", character.id],
        ),
      );
    }

    const aggregateCount = aggregateCountsByCharacter.get(character.id) ?? 0;
    if (aggregateCount !== 1) {
      issues.push(
        createIssue(
          "mkxl.data.movelist_character_coverage",
          `${character.id} has ${aggregateCount} aggregate movelists.`,
          ["movelists", character.id],
        ),
      );
    }
  }
};

const validateMoveTreeRegistryEntry = (
  registryKey: string,
  entry: (typeof mkxlMovelistFileRegistry)[number],
  movelistByCharacter: ReadonlyMap<string, (typeof mkxlMovelistFileRegistry)[number]>,
  treeCountsByCharacter: Map<string, number>,
  issues: MkxlDataValidationIssue[],
) => {
  treeCountsByCharacter.set(
    entry.characterId,
    (treeCountsByCharacter.get(entry.characterId) ?? 0) + 1,
  );

  const characterKey = toCamelKey(entry.characterId);
  if (registryKey !== characterKey) {
    issues.push(
      createIssue(
        "mkxl.data.move_tree_registry_key",
        `${entry.characterId} move tree registry key must be ${characterKey}.`,
        ["movelists", entry.characterId],
      ),
    );
  }

  const movelist = movelistByCharacter.get(entry.characterId);
  if (movelist && movelist !== entry) {
    issues.push(
      createIssue(
        "mkxl.data.move_tree_registry_wrapper",
        `${entry.characterId} move tree registry must reference the character movelist object directly.`,
        ["movelists", entry.characterId],
      ),
    );
  }

  const aggregateMoveRefs = new Set(movelist?.movelist ?? []);
  const aggregateMoveIds = new Set<string>();
  const treeMoveIds = new Set<string>();

  for (const move of movelist?.movelist ?? []) {
    aggregateMoveIds.add(move.id);
  }
  for (const move of collectMoveTreeMoves(entry.moves)) {
    treeMoveIds.add(move.id);
  }

  for (const moveId of aggregateMoveIds) {
    if (!treeMoveIds.has(moveId)) {
      issues.push(
        createIssue(
          "mkxl.data.move_tree_aggregate_missing",
          `${entry.characterId} aggregate movelist contains ${moveId} outside the move tree.`,
          ["movelists", entry.characterId, moveId],
        ),
      );
    }
  }

  for (const variation of mkxlVariationsByCharacterId[entry.characterId] ?? []) {
    const variationSlug = variation.id.split(":")[1] ?? "";
    const variationKey = toCamelKey(variationSlug);
    const variationBranch = entry.moves[variationKey];

    if (!variationBranch) {
      issues.push(
        createIssue(
          "mkxl.data.move_tree_variation_missing",
          `${entry.characterId} move tree must expose ${variationKey}.`,
          ["movelists", entry.characterId, variation.id],
        ),
      );
      continue;
    }

    for (const move of collectMoveTreeMoves(variationBranch)) {
      if (!aggregateMoveRefs.has(move)) {
        issues.push(
          createIssue(
            "mkxl.data.move_tree_reference_mismatch",
            `${move.id} in ${variation.id} is not the aggregate movelist object reference.`,
            ["movelists", entry.characterId, variation.id, move.id],
          ),
        );
      }

      if (
        move.availability.kind === "variation" &&
        !move.availability.variationIds.includes(variation.id)
      ) {
        issues.push(
          createIssue(
            "mkxl.data.move_tree_variation_mismatch",
            `${move.id} appears under ${variation.id} but is available to ${move.availability.variationIds.join(", ")}.`,
            ["movelists", entry.characterId, variation.id, move.id],
          ),
        );
      }
    }
  }
};

const validateMoveTreeRegistry = (issues: MkxlDataValidationIssue[]) => {
  const treeCountsByCharacter = new Map<string, number>();
  const movelistByCharacter = new Map<string, (typeof mkxlMovelistFileRegistry)[number]>();

  for (const entry of mkxlMovelistFileRegistry) {
    movelistByCharacter.set(entry.characterId, entry);
  }

  for (const [registryKey, entry] of Object.entries(mkxlMoveTreeRegistry)) {
    validateMoveTreeRegistryEntry(
      registryKey,
      entry,
      movelistByCharacter,
      treeCountsByCharacter,
      issues,
    );
  }

  for (const character of mkxlCharacters) {
    const treeCount = treeCountsByCharacter.get(character.id) ?? 0;

    if (treeCount !== 1) {
      issues.push(
        createIssue(
          "mkxl.data.move_tree_character_coverage",
          `${character.id} has ${treeCount} move tree registry entries.`,
          ["movelists", character.id],
        ),
      );
    }
  }
};

const validateVariationGraphCoverage = (issues: MkxlDataValidationIssue[]) => {
  const graphVariationIds = new Set<string>();

  for (const graph of mkxlVariationGraphs) {
    graphVariationIds.add(graph.variationId);
  }
  for (const variation of mkxlVariations) {
    if (!graphVariationIds.has(variation.id)) {
      issues.push(
        createIssue(
          "mkxl.data.graph_variation_coverage",
          `${variation.id} has no variation graph.`,
          ["graph", variation.id],
        ),
      );
    }
  }
};

const validateGraphEdges = (issues: MkxlDataValidationIssue[], moveIds: ReadonlySet<string>) => {
  for (const graph of mkxlVariationGraphs) {
    const nodeIds = new Set<string>();

    for (const node of graph.nodes) {
      nodeIds.add(node.id);
    }
    if (!nodeIds.has(graph.startNodeId)) {
      issues.push(
        createIssue("mkxl.data.graph_start_missing", `${graph.id} start node is missing.`, [
          "graph",
          graph.id,
        ]),
      );
    }
    for (const edge of graph.edges) {
      if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
        issues.push(
          createIssue(
            "mkxl.data.graph_edge_node_missing",
            `${edge.id} references a missing node.`,
            ["graph", graph.id, edge.id],
          ),
        );
      }
      if (edge.moveId && !moveIds.has(edge.moveId)) {
        issues.push(
          createIssue(
            "mkxl.data.graph_edge_move_missing",
            `${edge.id} references missing move ${edge.moveId}.`,
            ["graph", graph.id, edge.id],
          ),
        );
      }
    }
  }
};

const validateStageGraphEdges = (
  issues: MkxlDataValidationIssue[],
  interactableIds: ReadonlySet<string>,
) => {
  for (const fragment of mkxlStageGraphFragments) {
    for (const edge of fragment.edges) {
      if (edge.interactableId && !interactableIds.has(edge.interactableId)) {
        issues.push(
          createIssue(
            "mkxl.data.stage_graph_interactable_missing",
            `${edge.id} references missing interactable ${edge.interactableId}.`,
            ["graph", fragment.id, edge.id],
          ),
        );
      }
    }
  }
};

const validateComboAndGraphCoverage = (issues: MkxlDataValidationIssue[]) => {
  const combosByVariation = new Map<string, number>();
  for (const combo of mkxlSeededCombos) {
    combosByVariation.set(combo.variationId, (combosByVariation.get(combo.variationId) ?? 0) + 1);
  }

  for (const variation of mkxlVariations) {
    const comboCount = combosByVariation.get(variation.id) ?? 0;
    if (comboCount < mkxlCoverageTargets.minimumCombosPerVariation) {
      issues.push(
        createIssue(
          "mkxl.data.combo_variation_coverage",
          `${variation.id} has ${comboCount} seeded combos.`,
          ["combos", variation.id],
        ),
      );
    }
  }

  validateVariationGraphCoverage(issues);

  const moveIds = new Set<string>();
  const interactableIds = new Set(mkxlInteractableIds);

  for (const move of mkxlMoves) {
    moveIds.add(move.id);
  }

  validateGraphEdges(issues, moveIds);
  validateStageGraphEdges(issues, interactableIds);
};

export const validateMkxlData = (): MkxlDataValidationResult => {
  const issues: MkxlDataValidationIssue[] = [];

  validateCoverage(issues);
  validateProvenance(issues);
  validateComboFileRegistry(issues);
  validateMovelistFileRegistry(issues);
  validateMoveTreeRegistry(issues);
  validateReferences(issues);
  validateMoveNamePolicy(issues);
  validateComboAndGraphCoverage(issues);

  return {
    ok: issues.length === 0,
    counts: mkxlDataCounts,
    issues,
  };
};
