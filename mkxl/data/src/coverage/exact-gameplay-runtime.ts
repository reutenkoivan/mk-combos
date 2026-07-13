import type { MkxlDataSource, MkxlDataSourceKind } from "../game/type";
import type { MkxlMove } from "../movelists/type";
import type { MkxlDataValidationIssue } from "./type";

type MkxlExpectedMoveIdentity = {
  readonly fighterId: string;
  readonly contextIds: ReadonlySet<string>;
  readonly officialLabel: string | undefined;
  readonly notation: readonly string[];
};

export type MkxlExactGameplayIdentity = {
  readonly moveId: string | undefined;
  readonly gameVersion: string | undefined;
  readonly fighterId: string | undefined;
  readonly contextId: string | undefined;
  readonly officialLabel: string | undefined;
  readonly notation: readonly string[] | undefined;
  readonly ambiguousReason?: string;
};

export type MkxlExactGameplayValidationContext = {
  readonly expectedGameVersion: string;
  readonly dataSourcesById: ReadonlyMap<string, MkxlDataSource>;
  readonly exactEvidenceSourceIds: ReadonlySet<string>;
  readonly authoritativeSourceKinds: ReadonlySet<MkxlDataSourceKind>;
  readonly knownFighterIds: ReadonlySet<string>;
  readonly expectedMoveIdentitiesById: ReadonlyMap<string, MkxlExpectedMoveIdentity>;
};

type CreateMkxlExactGameplayValidationContextInput = {
  readonly expectedGameVersion: string;
  readonly dataSources: readonly MkxlDataSource[];
  readonly exactEvidenceSourceIds: readonly string[];
  readonly authoritativeSourceKinds: readonly MkxlDataSourceKind[];
  readonly fighterIds: readonly string[];
  readonly contextIdsByFighterId: ReadonlyMap<string, readonly string[]>;
  readonly moves: readonly MkxlMove[];
};

type ValidateMkxlExactGameplayClaimInput = {
  readonly sourceIds: readonly string[];
  readonly identity: MkxlExactGameplayIdentity;
  readonly path: readonly string[];
};

const createIssue = (
  code: string,
  message: string,
  path: readonly string[],
): MkxlDataValidationIssue => ({ code, message, path });

const getMoveContextIds = (
  move: MkxlMove,
  contextIdsByFighterId: ReadonlyMap<string, readonly string[]>,
): readonly string[] => {
  if (move.availability.kind === "variation") {
    return move.availability.variationIds;
  }
  if (move.availability.kind === "stage") {
    return move.availability.stageIds;
  }

  return [move.characterId, ...(contextIdsByFighterId.get(move.characterId) ?? [])];
};

const getDefaultMoveContextId = (move: MkxlMove): string | undefined => {
  if (move.availability.kind === "variation") {
    return move.availability.variationIds.length === 1
      ? move.availability.variationIds[0]
      : undefined;
  }
  if (move.availability.kind === "stage") {
    return move.availability.stageIds.length === 1 ? move.availability.stageIds[0] : undefined;
  }

  return move.characterId;
};

const hasSameNotation = (left: readonly string[] | undefined, right: readonly string[]) => {
  if (!left || left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
};

export const createMkxlExactGameplayValidationContext = (
  input: CreateMkxlExactGameplayValidationContextInput,
): MkxlExactGameplayValidationContext => {
  const expectedMoveIdentitiesById = new Map<string, MkxlExpectedMoveIdentity>();

  for (const move of input.moves) {
    expectedMoveIdentitiesById.set(move.id, {
      fighterId: move.characterId,
      contextIds: new Set(getMoveContextIds(move, input.contextIdsByFighterId)),
      officialLabel: move.label.EN,
      notation: move.notation,
    });
  }

  return {
    expectedGameVersion: input.expectedGameVersion,
    dataSourcesById: new Map(input.dataSources.map((source) => [source.id, source])),
    exactEvidenceSourceIds: new Set(input.exactEvidenceSourceIds),
    authoritativeSourceKinds: new Set(input.authoritativeSourceKinds),
    knownFighterIds: new Set(input.fighterIds),
    expectedMoveIdentitiesById,
  };
};

export const createMkxlExactGameplayIdentity = (
  move: MkxlMove,
  gameVersion: string,
  contextId = getDefaultMoveContextId(move),
): MkxlExactGameplayIdentity => ({
  moveId: move.id,
  gameVersion,
  fighterId: move.characterId,
  contextId,
  officialLabel: move.label.EN,
  notation: move.notation,
  ambiguousReason: move.tags.includes("route-source")
    ? "route-source move identity is not verified against an official move"
    : undefined,
});

export const validateMkxlExactGameplayClaim = (
  input: ValidateMkxlExactGameplayClaimInput,
  context: MkxlExactGameplayValidationContext,
): readonly MkxlDataValidationIssue[] => {
  const issues: MkxlDataValidationIssue[] = [];
  let hasAuthoritativeSource = false;
  let webSourceCount = 0;

  for (const sourceId of new Set(input.sourceIds)) {
    const source = context.dataSourcesById.get(sourceId);

    if (!source) {
      issues.push(
        createIssue("mkxl.data.unknown_source", `Unknown source id: ${sourceId}`, input.path),
      );
    }
    if (!source || !context.exactEvidenceSourceIds.has(sourceId)) {
      issues.push(
        createIssue(
          "mkxl.data.untrusted_exact_source",
          `${sourceId} is not allowlisted for exact gameplay facts.`,
          input.path,
        ),
      );
      continue;
    }
    if (context.authoritativeSourceKinds.has(source.kind)) {
      hasAuthoritativeSource = true;
    } else if (source.url) {
      webSourceCount += 1;
    }
  }

  if (!hasAuthoritativeSource && webSourceCount < 2) {
    issues.push(
      createIssue(
        "mkxl.data.insufficient_exact_evidence",
        "Exact gameplay facts require one official/manual source or two allowlisted web sources.",
        input.path,
      ),
    );
  }

  const expectedIdentity = input.identity.moveId
    ? context.expectedMoveIdentitiesById.get(input.identity.moveId)
    : undefined;

  if (input.identity.gameVersion !== context.expectedGameVersion) {
    issues.push(
      createIssue(
        "mkxl.data.exact_identity_game_version",
        `Exact gameplay identity must match game version ${context.expectedGameVersion}.`,
        input.path,
      ),
    );
  }

  if (
    !expectedIdentity ||
    !input.identity.fighterId ||
    !context.knownFighterIds.has(input.identity.fighterId) ||
    input.identity.fighterId !== expectedIdentity.fighterId ||
    !input.identity.contextId ||
    !expectedIdentity.contextIds.has(input.identity.contextId)
  ) {
    issues.push(
      createIssue(
        "mkxl.data.exact_identity_fighter_context",
        "Exact gameplay identity must match a known fighter and move context.",
        input.path,
      ),
    );
  }

  if (
    !expectedIdentity?.officialLabel ||
    !input.identity.officialLabel ||
    input.identity.officialLabel !== expectedIdentity.officialLabel
  ) {
    issues.push(
      createIssue(
        "mkxl.data.exact_identity_official_label",
        "Exact gameplay identity must match the official English move label.",
        input.path,
      ),
    );
  }

  if (!expectedIdentity || !hasSameNotation(input.identity.notation, expectedIdentity.notation)) {
    issues.push(
      createIssue(
        "mkxl.data.exact_identity_notation",
        "Exact gameplay identity must match the complete canonical move notation.",
        input.path,
      ),
    );
  }

  if (input.identity.ambiguousReason) {
    issues.push(
      createIssue(
        "mkxl.data.ambiguous_exact_identity",
        `Exact gameplay identity is ambiguous: ${input.identity.ambiguousReason}.`,
        input.path,
      ),
    );
  }

  return issues;
};
