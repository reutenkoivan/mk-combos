import type { GameId } from "@mk-combos/contracts/identity/type";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type {
  AppSettings,
  GameUserState,
  LanguageCode,
  NotationDisplayMode,
  ThemePreference,
} from "@mk-combos/contracts/settings/type";
import type { ReactNode } from "react";
import type { z } from "zod/v4";

import type { PersistedLocalStateSchema } from "./schema";
import type {
  localGameSliceStatuses,
  localStateErrorCodes,
  localStateHydrationStatuses,
  localStatePersistenceStatuses,
} from "./value";

export type PersistedLocalState = z.output<typeof PersistedLocalStateSchema>;

type LocalStateHydrationStatus =
  (typeof localStateHydrationStatuses)[keyof typeof localStateHydrationStatuses];

export type LocalStatePersistenceStatus =
  (typeof localStatePersistenceStatuses)[keyof typeof localStatePersistenceStatuses];

type LocalGameSliceStatus = (typeof localGameSliceStatuses)[keyof typeof localGameSliceStatuses];

type LocalStateErrorCode = (typeof localStateErrorCodes)[keyof typeof localStateErrorCodes];

export type LocalStateError = Readonly<{
  code: LocalStateErrorCode;
  gameId?: GameId;
  message: string;
  recoverable: true;
}>;

export type LocalStateInstalledGameSlice = Readonly<{
  error?: LocalStateError;
  gameId: GameId;
  messages: readonly ValidationMessage[];
  status: LocalGameSliceStatus;
}>;

export type LocalStateActionResult =
  | Readonly<{
      ok: true;
      persistenceStatus: LocalStatePersistenceStatus;
    }>
  | Readonly<{
      error: LocalStateError;
      ok: false;
    }>;

export type LocalStateObservableState = Readonly<{
  appliedSettings: AppSettings;
  error?: LocalStateError;
  firstLaunchCompleted: boolean;
  games: Readonly<Record<GameId, GameUserState>>;
  hydrationStatus: LocalStateHydrationStatus;
  installedGameSlices: Readonly<Record<GameId, LocalStateInstalledGameSlice>>;
  persistenceStatus: LocalStatePersistenceStatus;
  resolvedActiveGameId: GameId;
}>;

export type LocalStateSource = Readonly<{
  autoCompleteFromDeepLink: (gameId: GameId) => LocalStateActionResult;
  completeFirstLaunch: (settings: AppSettings) => LocalStateActionResult;
  rememberLastActiveGame: (gameId: GameId) => LocalStateActionResult;
  replaceGameSlice: (gameId: GameId, slice: unknown) => LocalStateActionResult;
  updateSettings: (update: {
    language?: LanguageCode;
    notationDisplayMode?: NotationDisplayMode;
    themePreference?: ThemePreference;
  }) => LocalStateActionResult;
}>;

export type LocalStateStorage = Readonly<{
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}>;

export type LocalStateEnvironment = Readonly<{
  browserLocalePreferences?: unknown;
  storage: LocalStateStorage | null;
}>;

export type LocalStateProviderProps = Readonly<{
  children: ReactNode;
  environment?: LocalStateEnvironment;
}>;
