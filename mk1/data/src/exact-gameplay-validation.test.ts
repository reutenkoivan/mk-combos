import { describe, expect, it } from "vitest";
import {
  createMk1ExactGameplayValidator,
  type Mk1ExactMoveIdentity,
  type Mk1ExactMoveIdentityCandidate,
  mk1VerifiedExactMoveIdentities,
} from "./coverage/exact-gameplay";
import { mk1DataSources, mk1ExactGameplayEvidenceSourceIds, mk1Game } from "./game/value";
import type { Mk1Move } from "./movelists/type";
import { mk1MoveOwnerKinds, mk1Moves } from "./movelists/value";

const expectPresent = <Value>(value: Value | undefined, label: string): Value => {
  if (value === undefined) {
    throw new Error(`Missing ${label}.`);
  }

  return value;
};

const createIdentity = (move: Mk1Move): Mk1ExactMoveIdentity => ({
  moveId: move.id,
  gameVersion: mk1Game.gameVersion,
  ownerKind: move.ownerKind,
  ownerId: move.ownerId,
  characterId: move.ownerKind === mk1MoveOwnerKinds.character ? move.ownerId : undefined,
  kameoId: move.ownerKind === mk1MoveOwnerKinds.kameo ? move.ownerId : undefined,
  officialLabel: expectPresent(move.label.EN, `${move.id} English label`),
  notation: move.notation,
});

const fixtureMove = expectPresent(mk1Moves[0], "MK1 fixture move");
const fixtureIdentity = createIdentity(fixtureMove);
const path = ["moves", fixtureMove.id, "frameData"] as const;

const createValidator = (input?: {
  verifiedMoveIdentities?: readonly Mk1ExactMoveIdentity[];
  exactEvidenceSourceIds?: readonly string[];
}) =>
  createMk1ExactGameplayValidator({
    dataSources: mk1DataSources,
    exactEvidenceSourceIds: input?.exactEvidenceSourceIds ?? mk1ExactGameplayEvidenceSourceIds,
    verifiedMoveIdentities: input?.verifiedMoveIdentities ?? [fixtureIdentity],
  });

const validate = (
  validator: ReturnType<typeof createValidator>,
  input?: {
    identity?: Mk1ExactMoveIdentityCandidate;
    sourceIds?: readonly string[];
  },
) =>
  validator.validateCandidate({
    identity: input?.identity ?? fixtureIdentity,
    sourceIds: input?.sourceIds ?? ["in-game-practice-mode"],
    path,
  });

describe("MK1 exact gameplay validation", () => {
  it("rejects untrusted and insufficient exact evidence", () => {
    const issues = validate(createValidator(), {
      sourceIds: ["curated-route-seed"],
    });

    expect(issues.map((issue) => issue.code)).toEqual([
      "mk1.data.untrusted_exact_source",
      "mk1.data.insufficient_exact_evidence",
    ]);
  });

  it("rejects one allowlisted web source as insufficient evidence", () => {
    const issues = validate(
      createValidator({
        exactEvidenceSourceIds: ["wikipedia-mk1"],
      }),
      { sourceIds: ["wikipedia-mk1"] },
    );

    expect(issues.map((issue) => issue.code)).toEqual(["mk1.data.insufficient_exact_evidence"]);
  });

  it.each([
    ["game version", { ...fixtureIdentity, gameVersion: "" }],
    ["fighter context", { ...fixtureIdentity, characterId: undefined }],
    ["official label", { ...fixtureIdentity, officialLabel: undefined }],
    ["notation", { ...fixtureIdentity, notation: [] }],
  ] as const)("rejects an incomplete %s", (_axis, identity) => {
    const issues = validate(createValidator(), { identity });

    expect(issues.map((issue) => issue.code)).toEqual(["mk1.data.incomplete_exact_identity"]);
  });

  it.each([
    ["game version", { ...fixtureIdentity, gameVersion: "different-version" }],
    ["fighter context", { ...fixtureIdentity, characterId: "different-fighter" }],
    ["official label", { ...fixtureIdentity, officialLabel: "Different official label" }],
    ["notation", { ...fixtureIdentity, notation: ["2"] }],
  ] as const)("rejects a mismatched %s", (_axis, identity) => {
    const issues = validate(createValidator(), { identity });

    expect(issues.map((issue) => issue.code)).toEqual(["mk1.data.exact_identity_mismatch"]);
  });

  it("rejects an ambiguous verified identity", () => {
    const issues = validate(
      createValidator({
        verifiedMoveIdentities: [fixtureIdentity, { ...fixtureIdentity }],
      }),
    );

    expect(issues.map((issue) => issue.code)).toEqual(["mk1.data.ambiguous_exact_identity"]);
  });

  it("rejects every current synthetic MK1 move even with an authoritative fact source", () => {
    const validator = createValidator({
      verifiedMoveIdentities: mk1VerifiedExactMoveIdentities,
    });

    for (const move of mk1Moves) {
      const issues = validator.validateCandidate({
        identity: createIdentity(move),
        sourceIds: ["in-game-practice-mode"],
        path: ["moves", move.id, "frameData"],
      });

      expect(issues.map((issue) => issue.code)).toEqual(["mk1.data.unverified_exact_identity"]);
    }
  });
});
