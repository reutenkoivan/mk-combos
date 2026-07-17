import { GameBackupEnvelopeSchema } from "@mk-combos/contracts/backup/schema";
import type { GameId } from "@mk-combos/contracts/identity/type";
import type { LanguageCode } from "@mk-combos/contracts/settings/type";
import { languageCodes } from "@mk-combos/contracts/settings/value";

import type { InstalledGameBusiness } from "../../../../game-business/installed-games/type";
import type {
  GameBackupCandidate,
  GameBackupDownloadResult,
  GameBackupValidationResult,
} from "./type";
import { gameBackupValidationFailureKinds, gameBackupVersions } from "./value";

const backupDateLocaleByLanguage: Record<LanguageCode, string> = {
  [languageCodes.EN]: "en",
  [languageCodes.UA]: "uk-UA",
};

export function formatGameBackupTimestamp(exportedAt: string, language: LanguageCode): string {
  const timestamp = new Date(exportedAt);

  if (Number.isNaN(timestamp.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(backupDateLocaleByLanguage[language], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}

export function createGameBackupDownload(
  input: Readonly<{
    business: InstalledGameBusiness;
    exportedAt: string;
    slice: unknown;
  }>,
): GameBackupDownloadResult {
  const serialized = input.business.backup.serializeSlice(input.slice);

  if (!serialized.ok) {
    return { message: serialized.error.message, ok: false };
  }

  try {
    const envelope = GameBackupEnvelopeSchema.safeParse({
      exportedAt: input.exportedAt,
      gameId: input.business.id,
      slice: serialized.value,
      version: gameBackupVersions.v1,
    });

    if (!envelope.success) {
      return { message: "The serialized game backup is not JSON-safe.", ok: false };
    }

    const safeTimestamp = input.exportedAt.replaceAll(":", "-").replaceAll(".", "-");

    return {
      download: {
        fileName: `mk-combos-${input.business.id}-${safeTimestamp}.json`,
        gameId: input.business.id,
        json: `${JSON.stringify(envelope.data, undefined, 2)}\n`,
      },
      ok: true,
    };
  } catch {
    return { message: "The serialized game backup is not JSON-safe.", ok: false };
  }
}

export function validateGameBackupText(
  input: Readonly<{
    business: InstalledGameBusiness;
    candidateId: string;
    text: string;
  }>,
): GameBackupValidationResult {
  let json: unknown;

  try {
    json = JSON.parse(input.text);
  } catch {
    return { kind: gameBackupValidationFailureKinds.invalidJson, ok: false };
  }

  const envelope = GameBackupEnvelopeSchema.safeParse(json);

  if (!envelope.success) {
    return { kind: gameBackupValidationFailureKinds.invalidEnvelope, ok: false };
  }

  if (envelope.data.version !== gameBackupVersions.v1) {
    return { kind: gameBackupValidationFailureKinds.unsupportedVersion, ok: false };
  }

  if (envelope.data.gameId !== input.business.id) {
    return { kind: gameBackupValidationFailureKinds.mismatchedGame, ok: false };
  }

  const validation = input.business.backup.validateSlice(envelope.data.slice);

  if (!validation.ok) {
    return {
      kind: gameBackupValidationFailureKinds.invalidSlice,
      message: validation.error.message,
      ok: false,
    };
  }

  const candidate: GameBackupCandidate = {
    envelope: envelope.data,
    id: input.candidateId,
    messages: validation.value.messages,
    normalizedSlice: validation.value.slice,
  };

  return { candidate, ok: true };
}

export function isMatchingGameBackupCandidate(
  candidate: GameBackupCandidate | undefined,
  candidateId: string,
  gameId: GameId,
): candidate is GameBackupCandidate {
  return candidate?.id === candidateId && candidate.envelope.gameId === gameId;
}
