import { languageCodes } from "@mk-combos/contracts/settings/value";

export const localStateStorageKey = "mk-combos:local-state";

export const localStateStorageVersion = 1;

export const htmlLanguageByAppLanguage = {
  [languageCodes.EN]: "en",
  [languageCodes.UA]: "uk",
} as const;

export const localStateHydrationStatuses = {
  pending: "pending",
  ready: "ready",
} as const;

export const localStatePersistenceStatuses = {
  pending: "pending",
  persistent: "persistent",
  sessionOnly: "sessionOnly",
} as const;

export const localGameSliceStatuses = {
  invalid: "invalid",
  valid: "valid",
} as const;

export const localStateErrorCodes = {
  invalidActionInput: "local-state.invalid-action-input",
  invalidGameSlice: "local-state.invalid-game-slice",
  malformedStorage: "local-state.malformed-storage",
  notHydrated: "local-state.not-hydrated",
  storageReadFailed: "local-state.storage-read-failed",
  storageUnavailable: "local-state.storage-unavailable",
  storageWriteFailed: "local-state.storage-write-failed",
  uninstalledGame: "local-state.uninstalled-game",
} as const;
