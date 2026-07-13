import { mk1SeededCombos } from "../combos/value";
import type { Mk1DataSource } from "../game/type";
import {
  mk1DataSourceIds,
  mk1DataSourceKinds,
  mk1DataSources,
  mk1ExactGameplayEvidenceSourceIds,
  mk1Game,
} from "../game/value";
import { mk1CharacterGraphs, mk1KameoGraphOverlays } from "../graph/value";
import { mk1Kameos } from "../kameos/value";
import type { Mk1Move } from "../movelists/type";
import {
  mk1Movelists,
  mk1MoveNotationValues,
  mk1MoveOwnerKinds,
  mk1Moves,
} from "../movelists/value";
import { mk1Characters } from "../roster/value";
import type { Mk1Label, Mk1SourceIdList } from "../shared/type";
import {
  createMk1ExactGameplayValidator,
  type Mk1ExactMoveIdentityCandidate,
  mk1VerifiedExactMoveIdentities,
} from "./exact-gameplay";
import type { Mk1DataValidationIssue, Mk1DataValidationResult } from "./type";
import { mk1CoverageTargets, mk1DataCounts } from "./value";

const createIssue = (
  code: string,
  message: string,
  path?: readonly string[],
): Mk1DataValidationIssue => ({
  code,
  message,
  path,
});

const hasReadableLabel = (value: Mk1Label) =>
  Boolean(value.EN ?? value.UA ?? value.default ?? value.fallback);

const assertLabel = (
  label: Mk1Label,
  path: readonly string[],
  issues: Mk1DataValidationIssue[],
) => {
  if (!hasReadableLabel(label)) {
    issues.push(createIssue("mk1.data.missing_label", "Record has no readable label.", path));
  }
};

const assertKnownSources = (
  sourceIds: Mk1SourceIdList,
  path: readonly string[],
  issues: Mk1DataValidationIssue[],
) => {
  const knownSourceIds = new Set<string>(mk1DataSourceIds);

  for (const sourceId of sourceIds) {
    if (!knownSourceIds.has(sourceId)) {
      issues.push(createIssue("mk1.data.unknown_source", `Unknown source id: ${sourceId}`, path));
    }
  }
};

const assertUnique = (
  values: readonly string[],
  label: string,
  issues: Mk1DataValidationIssue[],
) => {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      issues.push(createIssue("mk1.data.duplicate_id", `${label} id is duplicated: ${value}`));
    }
    seen.add(value);
  }
};

const dataSourcesById = new Map<string, Mk1DataSource>(
  mk1DataSources.map((source) => [source.id, source]),
);
const exactGameplayValidator = createMk1ExactGameplayValidator({
  dataSources: mk1DataSources,
  exactEvidenceSourceIds: mk1ExactGameplayEvidenceSourceIds,
  verifiedMoveIdentities: mk1VerifiedExactMoveIdentities,
});
const movesById = new Map<string, Mk1Move>(mk1Moves.map((move) => [move.id, move]));

const createExactMoveIdentity = (
  move: Mk1Move,
  context: Pick<Mk1ExactMoveIdentityCandidate, "characterId" | "kameoId"> = {},
): Mk1ExactMoveIdentityCandidate => ({
  moveId: move.id,
  gameVersion: mk1Game.gameVersion,
  ownerKind: move.ownerKind,
  ownerId: move.ownerId,
  characterId:
    context.characterId ??
    (move.ownerKind === mk1MoveOwnerKinds.character ? move.ownerId : undefined),
  kameoId:
    context.kameoId ?? (move.ownerKind === mk1MoveOwnerKinds.kameo ? move.ownerId : undefined),
  officialLabel: move.label.EN,
  notation: move.notation,
});

const assertExactGameplayEvidence = (
  sourceIds: Mk1SourceIdList,
  identity: Mk1ExactMoveIdentityCandidate | undefined,
  path: readonly string[],
  issues: Mk1DataValidationIssue[],
) => {
  assertKnownSources(sourceIds, path, issues);

  if (!identity) {
    issues.push(
      createIssue(
        "mk1.data.exact_identity_move_missing",
        "Exact gameplay fact references a missing move identity.",
        path,
      ),
    );
    return;
  }

  issues.push(...exactGameplayValidator.validateCandidate({ identity, sourceIds, path }));
};

const validateCoverage = (issues: Mk1DataValidationIssue[]) => {
  if (mk1Characters.length !== mk1CoverageTargets.expectedCharacterCount) {
    issues.push(
      createIssue(
        "mk1.data.character_count",
        `Expected ${mk1CoverageTargets.expectedCharacterCount} characters, got ${mk1Characters.length}.`,
      ),
    );
  }
  if (mk1Kameos.length !== mk1CoverageTargets.expectedKameoCount) {
    issues.push(
      createIssue(
        "mk1.data.kameo_count",
        `Expected ${mk1CoverageTargets.expectedKameoCount} kameos, got ${mk1Kameos.length}.`,
      ),
    );
  }
  if (mk1SeededCombos.length !== mk1CoverageTargets.expectedPairComboCount) {
    issues.push(
      createIssue(
        "mk1.data.pair_combo_count",
        `Expected ${mk1CoverageTargets.expectedPairComboCount} pair combos, got ${mk1SeededCombos.length}.`,
      ),
    );
  }
};

const validateProvenance = (issues: Mk1DataValidationIssue[]) => {
  for (const sourceId of mk1ExactGameplayEvidenceSourceIds) {
    const source = dataSourcesById.get(sourceId);

    if (!source) {
      issues.push(
        createIssue(
          "mk1.data.exact_source_missing",
          `Exact-evidence source ${sourceId} has no source record.`,
          ["sources", sourceId],
        ),
      );
      continue;
    }
    if (source.kind !== mk1DataSourceKinds.manual && !source.url) {
      issues.push(
        createIssue(
          "mk1.data.exact_source_url_missing",
          `Exact-evidence web source ${sourceId} must provide a URL.`,
          ["sources", sourceId],
        ),
      );
    }
  }

  for (const source of mk1DataSources) {
    assertLabel({ EN: source.label, fallback: source.label }, ["sources", source.id], issues);
  }

  assertKnownSources(mk1Game.sourceIds, ["game", mk1Game.id], issues);
  for (const character of mk1Characters) {
    assertKnownSources(character.sourceIds, ["roster", character.id], issues);
    assertLabel(character.label, ["roster", character.id], issues);
  }
  for (const kameo of mk1Kameos) {
    assertKnownSources(kameo.sourceIds, ["kameos", kameo.id], issues);
    assertLabel(kameo.label, ["kameos", kameo.id], issues);
  }
  const tacticalFactIds: string[] = [];
  for (const movelist of mk1Movelists) {
    assertKnownSources(movelist.sourceIds, ["movelists", movelist.ownerId], issues);
    for (const move of movelist.movelist) {
      assertKnownSources(move.sourceIds, ["moves", move.id], issues);
      assertLabel(move.label, ["moves", move.id], issues);
      if (move.frameData) {
        assertExactGameplayEvidence(
          move.frameData.sourceIds,
          createExactMoveIdentity(move),
          ["moves", move.id, "frameData"],
          issues,
        );
      }
      for (const fact of move.tacticalFacts ?? []) {
        tacticalFactIds.push(fact.id);
        assertExactGameplayEvidence(
          fact.sourceIds,
          createExactMoveIdentity(move),
          ["moves", move.id, "tacticalFacts", fact.id],
          issues,
        );
      }
    }
  }
  assertUnique(tacticalFactIds, "Tactical fact", issues);
  for (const graph of mk1CharacterGraphs) {
    assertKnownSources(graph.sourceIds, ["graphs", graph.id], issues);
    for (const edge of graph.edges) {
      assertKnownSources(edge.sourceIds, ["graphs", graph.id, "edges", edge.id], issues);
      if (edge.timing) {
        const move = movesById.get(edge.moveId);
        assertExactGameplayEvidence(
          edge.timing.sourceIds,
          move
            ? createExactMoveIdentity(move, {
                characterId: graph.characterId,
              })
            : undefined,
          ["graphs", graph.id, "edges", edge.id, "timing"],
          issues,
        );
      }
    }
  }
  for (const overlay of mk1KameoGraphOverlays) {
    assertKnownSources(overlay.sourceIds, ["graphOverlays", overlay.id], issues);
    for (const edge of overlay.edges) {
      assertKnownSources(edge.sourceIds, ["graphOverlays", overlay.id, "edges", edge.id], issues);
      if (edge.timing) {
        const move = movesById.get(edge.moveId);
        assertExactGameplayEvidence(
          edge.timing.sourceIds,
          move
            ? createExactMoveIdentity(move, {
                characterId: overlay.characterId,
                kameoId: overlay.kameoId,
              })
            : undefined,
          ["graphOverlays", overlay.id, "edges", edge.id, "timing"],
          issues,
        );
      }
    }
  }
  for (const combo of mk1SeededCombos) {
    assertKnownSources(combo.sourceIds, ["combos", combo.id], issues);
    assertLabel(combo.title, ["combos", combo.id], issues);
    assertLabel(combo.notes, ["combos", combo.id, "notes"], issues);
  }
};

const createReferenceLookups = () => ({
  characterIds: new Set(mk1Characters.map((character) => character.id)),
  kameoIds: new Set(mk1Kameos.map((kameo) => kameo.id)),
  moveIds: new Set(mk1Moves.map((move) => move.id)),
  comboIds: mk1SeededCombos.map((combo) => combo.id),
  movesById: new Map(mk1Moves.map((move) => [move.id, move])),
  notationValues: new Set<string>(Object.values(mk1MoveNotationValues)),
});

const validateMoves = (
  issues: Mk1DataValidationIssue[],
  lookups: ReturnType<typeof createReferenceLookups>,
) => {
  for (const move of mk1Moves) {
    if (move.ownerKind === mk1MoveOwnerKinds.character && !lookups.characterIds.has(move.ownerId)) {
      issues.push(
        createIssue("mk1.data.move_character_missing", `${move.id} owner is missing.`, [
          "moves",
          move.id,
        ]),
      );
    }
    if (move.ownerKind === mk1MoveOwnerKinds.kameo && !lookups.kameoIds.has(move.ownerId)) {
      issues.push(
        createIssue("mk1.data.move_kameo_missing", `${move.id} owner is missing.`, [
          "moves",
          move.id,
        ]),
      );
    }
    for (const [index, notationValue] of move.notation.entries()) {
      if (!lookups.notationValues.has(notationValue)) {
        issues.push(
          createIssue(
            "mk1.data.move_notation_unknown",
            `${move.id} references unknown notation value ${notationValue}.`,
            ["moves", move.id, `notation.${index}`],
          ),
        );
      }
    }
  }
};

const validateCombos = (
  issues: Mk1DataValidationIssue[],
  lookups: ReturnType<typeof createReferenceLookups>,
) => {
  const comboCountByPair = new Map<string, number>();

  for (const combo of mk1SeededCombos) {
    const pairKey = `${combo.characterId}\u0000${combo.kameoId}`;
    const expectedMovePath: string[] = [];
    const expectedNotation: (readonly string[])[] = [];

    comboCountByPair.set(pairKey, (comboCountByPair.get(pairKey) ?? 0) + 1);

    if (!lookups.characterIds.has(combo.characterId)) {
      issues.push(
        createIssue("mk1.data.combo_character_missing", `${combo.id} character is missing.`, [
          "combos",
          combo.id,
        ]),
      );
    }
    if (!lookups.kameoIds.has(combo.kameoId)) {
      issues.push(
        createIssue("mk1.data.combo_kameo_missing", `${combo.id} kameo is missing.`, [
          "combos",
          combo.id,
        ]),
      );
    }

    for (const [index, step] of combo.route.entries()) {
      const move = lookups.movesById.get(step.moveId);
      expectedMovePath.push(step.moveId);
      expectedNotation.push(move?.notation ?? []);

      if (!move) {
        issues.push(
          createIssue(
            "mk1.data.combo_route_move_missing",
            `${combo.id} references missing move ${step.moveId}.`,
            ["combos", combo.id, `route.${index}`],
          ),
        );
        continue;
      }

      if (
        move.availability.kind === "character" &&
        !move.availability.characterIds.includes(combo.characterId)
      ) {
        issues.push(
          createIssue("mk1.data.combo_move_character_mismatch", `${combo.id} uses ${move.id}.`, [
            "combos",
            combo.id,
            `route.${index}`,
          ]),
        );
      }
      if (
        move.availability.kind === "kameo" &&
        !move.availability.kameoIds.includes(combo.kameoId)
      ) {
        issues.push(
          createIssue("mk1.data.combo_move_kameo_mismatch", `${combo.id} uses ${move.id}.`, [
            "combos",
            combo.id,
            `route.${index}`,
          ]),
        );
      }
    }

    if (JSON.stringify(combo.movePath) !== JSON.stringify(expectedMovePath)) {
      issues.push(
        createIssue("mk1.data.combo_move_path_mismatch", `${combo.id} movePath is not derived.`, [
          "combos",
          combo.id,
          "movePath",
        ]),
      );
    }
    if (JSON.stringify(combo.notation) !== JSON.stringify(expectedNotation)) {
      issues.push(
        createIssue("mk1.data.combo_notation_mismatch", `${combo.id} notation is not derived.`, [
          "combos",
          combo.id,
          "notation",
        ]),
      );
    }
  }

  for (const character of mk1Characters) {
    for (const kameo of mk1Kameos) {
      const pairKey = `${character.id}\u0000${kameo.id}`;
      const comboCount = comboCountByPair.get(pairKey) ?? 0;

      if (comboCount < mk1CoverageTargets.minimumCombosPerPair) {
        issues.push(
          createIssue(
            "mk1.data.combo_pair_coverage",
            `${character.id} + ${kameo.id} has ${comboCount} seeded combos.`,
            ["combos", character.id, kameo.id],
          ),
        );
      }
    }
  }
};

const validateGraphs = (
  issues: Mk1DataValidationIssue[],
  lookups: ReturnType<typeof createReferenceLookups>,
) => {
  for (const graph of mk1CharacterGraphs) {
    const nodeIds = new Set(graph.nodes.map((node) => node.id));

    if (!lookups.characterIds.has(graph.characterId)) {
      issues.push(createIssue("mk1.data.graph_character_missing", `${graph.id} owner missing.`));
    }
    if (!nodeIds.has(graph.startNodeId)) {
      issues.push(createIssue("mk1.data.graph_start_missing", `${graph.id} start missing.`));
    }
    for (const edge of graph.edges) {
      if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
        issues.push(createIssue("mk1.data.graph_edge_node_missing", `${edge.id} node missing.`));
      }
      if (!lookups.moveIds.has(edge.moveId)) {
        issues.push(createIssue("mk1.data.graph_edge_move_missing", `${edge.id} move missing.`));
      }
    }
  }

  for (const overlay of mk1KameoGraphOverlays) {
    if (!lookups.characterIds.has(overlay.characterId)) {
      issues.push(
        createIssue("mk1.data.overlay_character_missing", `${overlay.id} character missing.`),
      );
    }
    if (!lookups.kameoIds.has(overlay.kameoId)) {
      issues.push(createIssue("mk1.data.overlay_kameo_missing", `${overlay.id} kameo missing.`));
    }
    for (const edge of overlay.edges) {
      if (!lookups.moveIds.has(edge.moveId)) {
        issues.push(createIssue("mk1.data.overlay_move_missing", `${edge.id} move missing.`));
      }
    }
  }
};

const validateReferences = (issues: Mk1DataValidationIssue[]) => {
  const lookups = createReferenceLookups();

  assertUnique([...lookups.characterIds], "Character", issues);
  assertUnique([...lookups.kameoIds], "Kameo", issues);
  assertUnique([...lookups.moveIds], "Move", issues);
  assertUnique(lookups.comboIds, "Combo", issues);
  validateMoves(issues, lookups);
  validateCombos(issues, lookups);
  validateGraphs(issues, lookups);
};

export const validateMk1Data = (): Mk1DataValidationResult => {
  const issues: Mk1DataValidationIssue[] = [];

  validateCoverage(issues);
  validateProvenance(issues);
  validateReferences(issues);

  return {
    ok: issues.length === 0,
    counts: mk1DataCounts,
    issues,
  };
};
