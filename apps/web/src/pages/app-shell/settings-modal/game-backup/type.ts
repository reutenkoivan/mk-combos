import type { GameBackupEnvelope } from "@mk-combos/contracts/backup/type";
import type { GameId } from "@mk-combos/contracts/identity/type";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";

import type { gameBackupValidationFailureKinds } from "./value";

export type GameBackupValidationFailureKind =
  (typeof gameBackupValidationFailureKinds)[keyof typeof gameBackupValidationFailureKinds];

export type GameBackupCandidate = Readonly<{
  envelope: GameBackupEnvelope;
  id: string;
  messages: readonly ValidationMessage[];
  normalizedSlice: unknown;
}>;

export type GameBackupValidationResult =
  | Readonly<{
      candidate: GameBackupCandidate;
      ok: true;
    }>
  | Readonly<{
      kind: GameBackupValidationFailureKind;
      message?: string;
      ok: false;
    }>;

export type GameBackupDownload = Readonly<{
  fileName: string;
  gameId: GameId;
  json: string;
}>;

export type GameBackupDownloadResult =
  | Readonly<{ download: GameBackupDownload; ok: true }>
  | Readonly<{ message: string; ok: false }>;
