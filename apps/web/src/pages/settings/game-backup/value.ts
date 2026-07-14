export const gameBackupVersions = {
  v1: 1,
} as const;

export const gameBackupValidationFailureKinds = {
  invalidEnvelope: "invalidEnvelope",
  invalidJson: "invalidJson",
  invalidSlice: "invalidSlice",
  mismatchedGame: "mismatchedGame",
  unsupportedVersion: "unsupportedVersion",
} as const;
