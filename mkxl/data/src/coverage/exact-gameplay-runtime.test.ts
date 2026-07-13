import { describe, expect, it } from "vitest";
import {
  mkxlDataSourceKinds,
  mkxlDataSources,
  mkxlExactGameplayEvidenceSourceIds,
  mkxlGame,
} from "../game/value";
import { mkxlMoves } from "../movelists/value";
import { activeMkxlDataset } from "../packs/value";
import { mkxlCharacters } from "../roster/value";
import { mkxlVariations } from "../variations/value";
import {
  createMkxlExactGameplayIdentity,
  createMkxlExactGameplayValidationContext,
  type MkxlExactGameplayIdentity,
  validateMkxlExactGameplayClaim,
} from "./exact-gameplay-runtime";

const expectPresent = <T>(value: T | undefined, label: string): T => {
  expect(value, label).toBeDefined();
  if (value === undefined) {
    throw new Error(`${label} is required by this test fixture.`);
  }

  return value;
};

const contextIdsByFighterId = new Map<string, string[]>();

for (const variation of mkxlVariations) {
  const contextIds = contextIdsByFighterId.get(variation.characterId) ?? [];

  contextIds.push(variation.id);
  contextIdsByFighterId.set(variation.characterId, contextIds);
}

const validationContext = createMkxlExactGameplayValidationContext({
  expectedGameVersion: activeMkxlDataset.gameVersion,
  dataSources: mkxlDataSources,
  exactEvidenceSourceIds: mkxlExactGameplayEvidenceSourceIds,
  authoritativeSourceKinds: [mkxlDataSourceKinds.manualVerification, mkxlDataSourceKinds.official],
  fighterIds: mkxlCharacters.map((character) => character.id),
  contextIdsByFighterId,
  moves: mkxlMoves,
});

const verifiedIdentityMove = expectPresent(
  mkxlMoves.find(
    (move) =>
      move.characterId !== "general" &&
      !move.tags.includes("route-source") &&
      move.label.EN !== undefined,
  ),
  "verified-identity move",
);
const verifiedIdentity = createMkxlExactGameplayIdentity(
  verifiedIdentityMove,
  mkxlGame.gameVersion,
);
const claimPath = ["moves", verifiedIdentityMove.id, "frameData"] as const;

const validateClaim = (
  sourceIds: readonly string[],
  identity: MkxlExactGameplayIdentity = verifiedIdentity,
) =>
  validateMkxlExactGameplayClaim(
    {
      sourceIds,
      identity,
      path: claimPath,
    },
    validationContext,
  );

const getIssueCodes = (sourceIds: readonly string[], identity?: MkxlExactGameplayIdentity) =>
  new Set(validateClaim(sourceIds, identity).map((issue) => issue.code));

describe("MKXL exact gameplay validation", () => {
  it("rejects untrusted and insufficient exact-gameplay evidence", () => {
    const untrustedCodes = getIssueCodes(["community-combo-source"]);

    expect(untrustedCodes).toContain("mkxl.data.untrusted_exact_source");
    expect(untrustedCodes).toContain("mkxl.data.insufficient_exact_evidence");

    const singleWebSourceCodes = getIssueCodes(["testyourmight-mkx-frame-data"]);

    expect(singleWebSourceCodes).not.toContain("mkxl.data.untrusted_exact_source");
    expect(singleWebSourceCodes).toContain("mkxl.data.insufficient_exact_evidence");
  });

  it("rejects incomplete or mismatched version, fighter/context, label, and notation", () => {
    const authoritativeSourceIds = ["in-game-practice-mode"] as const;
    const mismatchedContext = expectPresent(
      mkxlVariations.find((variation) => variation.characterId !== verifiedIdentity.fighterId),
      "mismatched fighter context",
    ).id;
    const cases = [
      {
        identity: { ...verifiedIdentity, gameVersion: "MKX-base" },
        issueCode: "mkxl.data.exact_identity_game_version",
      },
      {
        identity: { ...verifiedIdentity, contextId: mismatchedContext },
        issueCode: "mkxl.data.exact_identity_fighter_context",
      },
      {
        identity: { ...verifiedIdentity, officialLabel: undefined },
        issueCode: "mkxl.data.exact_identity_official_label",
      },
      {
        identity: { ...verifiedIdentity, notation: [] },
        issueCode: "mkxl.data.exact_identity_notation",
      },
    ] as const;

    for (const testCase of cases) {
      expect(getIssueCodes(authoritativeSourceIds, testCase.identity)).toContain(
        testCase.issueCode,
      );
    }
  });

  it("rejects current route-source moves even with authoritative evidence", () => {
    const routeSourceMove = expectPresent(
      mkxlMoves.find((move) => move.tags.includes("route-source")),
      "current route-source move",
    );
    const routeSourceIdentity = createMkxlExactGameplayIdentity(
      routeSourceMove,
      mkxlGame.gameVersion,
    );
    const codes = getIssueCodes(["in-game-practice-mode"], routeSourceIdentity);

    expect(routeSourceIdentity.ambiguousReason).toContain("route-source");
    expect(codes).toContain("mkxl.data.ambiguous_exact_identity");
  });
});
