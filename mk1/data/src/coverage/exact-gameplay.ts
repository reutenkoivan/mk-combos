import type { Mk1DataSource } from "../game/type";
import { mk1DataSourceKinds } from "../game/value";
import type { Mk1MoveOwnerKind } from "../movelists/type";
import { mk1MoveOwnerKinds } from "../movelists/value";
import type { Mk1SourceIdList } from "../shared/type";
import type { Mk1DataValidationIssue } from "./type";

export type Mk1ExactMoveIdentity = {
  readonly moveId: string;
  readonly gameVersion: string;
  readonly ownerKind: Mk1MoveOwnerKind;
  readonly ownerId: string;
  readonly characterId?: string;
  readonly kameoId?: string;
  readonly officialLabel: string;
  readonly notation: readonly string[];
};

export type Mk1ExactMoveIdentityCandidate = Omit<
  Mk1ExactMoveIdentity,
  "officialLabel" | "notation"
> & {
  readonly officialLabel?: string;
  readonly notation?: readonly string[];
};

type Mk1ExactGameplayValidatorOptions = {
  readonly dataSources: readonly Mk1DataSource[];
  readonly exactEvidenceSourceIds: readonly string[];
  readonly verifiedMoveIdentities: readonly Mk1ExactMoveIdentity[];
};

type Mk1ExactGameplayCandidate = {
  readonly identity: Mk1ExactMoveIdentityCandidate;
  readonly sourceIds: Mk1SourceIdList;
  readonly path: readonly string[];
};

const createIssue = (
  code: string,
  message: string,
  path: readonly string[],
): Mk1DataValidationIssue => ({
  code,
  message,
  path,
});

const sameNotation = (left: readonly string[], right: readonly string[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const isCompleteIdentity = (
  identity: Mk1ExactMoveIdentityCandidate,
): identity is Mk1ExactMoveIdentity =>
  identity.moveId.length > 0 &&
  identity.gameVersion.length > 0 &&
  identity.ownerId.length > 0 &&
  (identity.ownerKind !== mk1MoveOwnerKinds.character || Boolean(identity.characterId)) &&
  (identity.ownerKind !== mk1MoveOwnerKinds.kameo || Boolean(identity.kameoId)) &&
  Boolean(identity.officialLabel?.trim()) &&
  Boolean(identity.notation?.length) &&
  identity.notation?.every((value) => value.length > 0) === true;

const sameIdentity = (left: Mk1ExactMoveIdentity, right: Mk1ExactMoveIdentity) =>
  left.moveId === right.moveId &&
  left.gameVersion === right.gameVersion &&
  left.ownerKind === right.ownerKind &&
  left.ownerId === right.ownerId &&
  left.characterId === right.characterId &&
  left.kameoId === right.kameoId &&
  left.officialLabel === right.officialLabel &&
  sameNotation(left.notation, right.notation);

/**
 * Exact facts stay unavailable until an identity has been checked independently of the
 * synthetic route seed. Add entries only after version, context, official label, and notation
 * have all been matched to trusted evidence.
 */
export const mk1VerifiedExactMoveIdentities = [] as const satisfies readonly Mk1ExactMoveIdentity[];

export const createMk1ExactGameplayValidator = (options: Mk1ExactGameplayValidatorOptions) => {
  const dataSourcesById = new Map<string, Mk1DataSource>(
    options.dataSources.map((source) => [source.id, source]),
  );
  const exactEvidenceSourceIds = new Set(options.exactEvidenceSourceIds);
  const verifiedIdentitiesByMoveId = new Map<string, Mk1ExactMoveIdentity[]>();

  for (const identity of options.verifiedMoveIdentities) {
    const identities = verifiedIdentitiesByMoveId.get(identity.moveId) ?? [];
    identities.push(identity);
    verifiedIdentitiesByMoveId.set(identity.moveId, identities);
  }

  const validateEvidence = (
    sourceIds: Mk1SourceIdList,
    path: readonly string[],
  ): Mk1DataValidationIssue[] => {
    const issues: Mk1DataValidationIssue[] = [];
    let hasAuthoritativeSource = false;
    let webSourceCount = 0;

    for (const sourceId of new Set(sourceIds)) {
      const source = dataSourcesById.get(sourceId);

      if (!source || !exactEvidenceSourceIds.has(sourceId)) {
        issues.push(
          createIssue(
            "mk1.data.untrusted_exact_source",
            `${sourceId} is not allowlisted for exact gameplay facts.`,
            path,
          ),
        );
        continue;
      }

      if (
        source.kind === mk1DataSourceKinds.manual ||
        source.kind === mk1DataSourceKinds.official
      ) {
        hasAuthoritativeSource = true;
      } else if (source.url) {
        webSourceCount += 1;
      }
    }

    if (!hasAuthoritativeSource && webSourceCount < 2) {
      issues.push(
        createIssue(
          "mk1.data.insufficient_exact_evidence",
          "Exact gameplay facts require one official/manual source or two allowlisted web sources.",
          path,
        ),
      );
    }

    return issues;
  };

  const validateCandidate = (candidate: Mk1ExactGameplayCandidate) => {
    const issues = validateEvidence(candidate.sourceIds, candidate.path);
    const identity = candidate.identity;

    if (!isCompleteIdentity(identity)) {
      issues.push(
        createIssue(
          "mk1.data.incomplete_exact_identity",
          "Exact gameplay identity requires game version, fighter or kameo context, official label, and notation.",
          candidate.path,
        ),
      );
      return issues;
    }

    const verifiedIdentities = verifiedIdentitiesByMoveId.get(identity.moveId) ?? [];

    if (verifiedIdentities.length === 0) {
      issues.push(
        createIssue(
          "mk1.data.unverified_exact_identity",
          `${identity.moveId} has no verified exact identity.`,
          candidate.path,
        ),
      );
      return issues;
    }

    const matchingIdentities = verifiedIdentities.filter((verifiedIdentity) =>
      sameIdentity(verifiedIdentity, identity),
    );

    if (matchingIdentities.length === 0) {
      issues.push(
        createIssue(
          "mk1.data.exact_identity_mismatch",
          `${identity.moveId} does not match the verified game version, context, official label, and notation.`,
          candidate.path,
        ),
      );
    } else if (matchingIdentities.length > 1) {
      issues.push(
        createIssue(
          "mk1.data.ambiguous_exact_identity",
          `${identity.moveId} matches more than one verified exact identity.`,
          candidate.path,
        ),
      );
    }

    return issues;
  };

  return { validateCandidate } as const;
};
