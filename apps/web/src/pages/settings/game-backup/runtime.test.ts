import { languageCodes } from "@mk-combos/contracts/settings/value";
import { describe, expect, it } from "vitest";

import { installedGames } from "../../../game-business/installed-games/value";
import {
  createGameBackupDownload,
  formatGameBackupTimestamp,
  isMatchingGameBackupCandidate,
  validateGameBackupText,
} from "./runtime";
import { gameBackupValidationFailureKinds } from "./value";

const exportedAt = "2026-07-14T10:00:00.000Z";

describe("per-game backup runtime", () => {
  it("formats candidate timestamps for the active interface language", () => {
    const date = new Date(exportedAt);
    const options = { dateStyle: "medium", timeStyle: "short" } as const;

    expect(formatGameBackupTimestamp(exportedAt, languageCodes.EN)).toBe(
      new Intl.DateTimeFormat("en", options).format(date),
    );
    expect(formatGameBackupTimestamp(exportedAt, languageCodes.UA)).toBe(
      new Intl.DateTimeFormat("uk-UA", options).format(date),
    );
    expect(formatGameBackupTimestamp("not-a-date", languageCodes.EN)).toBe("");
  });

  it("exports exactly one target game envelope", () => {
    const business = installedGames[0];
    const result = createGameBackupDownload({
      business,
      exportedAt,
      slice: business.backup.createEmptySlice(),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const json = JSON.parse(result.download.json) as Record<string, unknown>;

    expect(Object.keys(json).sort()).toEqual(["exportedAt", "gameId", "slice", "version"]);
    expect(json.gameId).toBe(business.id);
    expect(json).not.toHaveProperty("settings");
    expect(json).not.toHaveProperty("games");
    expect(result.download.fileName).toMatch(/^mk-combos-mkxl-/u);
  });

  it("returns a validation failure when a game adapter produces a non-JSON slice", () => {
    const business = installedGames[0];
    const unsafeBusiness = {
      ...business,
      backup: {
        ...business.backup,
        serializeSlice: () => ({ ok: true, value: 1n }),
      },
    } as unknown as typeof business;

    const result = createGameBackupDownload({ business: unsafeBusiness, exportedAt, slice: {} });

    expect(result).toEqual({
      message: "The serialized game backup is not JSON-safe.",
      ok: false,
    });
  });

  it("validates only a matching business slice and creates a target-bound candidate", () => {
    const business = installedGames[1];
    const exported = createGameBackupDownload({
      business,
      exportedAt,
      slice: business.backup.createEmptySlice(),
    });

    expect(exported.ok).toBe(true);
    if (!exported.ok) {
      return;
    }

    const validation = validateGameBackupText({
      business,
      candidateId: "candidate-1",
      text: exported.download.json,
    });

    expect(validation.ok).toBe(true);
    if (validation.ok) {
      expect(validation.candidate.envelope.gameId).toBe("mk1");
      expect(isMatchingGameBackupCandidate(validation.candidate, "candidate-1", "mk1")).toBe(true);
      expect(isMatchingGameBackupCandidate(validation.candidate, "candidate-2", "mk1")).toBe(false);
      expect(isMatchingGameBackupCandidate(validation.candidate, "candidate-1", "mkxl")).toBe(
        false,
      );
    }
  });

  it("rejects malformed, mismatched, unsupported, and invalid slice inputs", () => {
    const business = installedGames[0];
    const baseEnvelope = {
      exportedAt,
      gameId: business.id,
      slice: business.backup.createEmptySlice(),
      version: 1,
    };
    const cases = [
      {
        expected: gameBackupValidationFailureKinds.invalidJson,
        text: "{broken",
      },
      {
        expected: gameBackupValidationFailureKinds.mismatchedGame,
        text: JSON.stringify({ ...baseEnvelope, gameId: installedGames[1].id }),
      },
      {
        expected: gameBackupValidationFailureKinds.unsupportedVersion,
        text: JSON.stringify({ ...baseEnvelope, version: 2 }),
      },
      {
        expected: gameBackupValidationFailureKinds.invalidSlice,
        text: JSON.stringify({ ...baseEnvelope, slice: {} }),
      },
    ] as const;

    for (const testCase of cases) {
      const validation = validateGameBackupText({
        business,
        candidateId: "candidate-invalid",
        text: testCase.text,
      });

      expect(validation.ok).toBe(false);
      if (!validation.ok) {
        expect(validation.kind).toBe(testCase.expected);
      }
    }
  });
});
