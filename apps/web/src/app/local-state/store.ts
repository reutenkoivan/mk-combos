import { GameIdSchema } from "@mk-combos/contracts/identity/schema";
import type { GameId } from "@mk-combos/contracts/identity/type";
import { AppSettingsSchema } from "@mk-combos/contracts/settings/schema";
import type { AppSettings, LanguageCode } from "@mk-combos/contracts/settings/type";
import { languageCodes, notationDisplayModes } from "@mk-combos/contracts/settings/value";
import { createStore, type StoreApi } from "zustand/vanilla";

import { resolveInstalledGame } from "../../game-business/installed-games/runtime";
import {
  createDefaultLocalAppState,
  createLocalStateError,
  parsePersistedLocalStateText,
  preparePersistedLocalAppState,
  resolveActiveGameId,
  resolveBrowserLanguage,
  validateReplacementGameSlice,
} from "./runtime";
import {
  BrowserLocalePreferencesSchema,
  LocalStateSettingsUpdateSchema,
  PersistedLocalStateSchema,
  SettingsReturnTargetSchema,
} from "./schema";
import type {
  LocalStateActionResult,
  LocalStateEnvironment,
  LocalStateError,
  LocalStateObservableState,
  LocalStateSource,
  LocalStateStorage,
} from "./type";
import {
  localStateErrorCodes,
  localStateHydrationStatuses,
  localStatePersistenceStatuses,
  localStateStorageKey,
  localStateStorageVersion,
} from "./value";

type LocalStateStoreState = Readonly<{
  hydrate: () => void;
  observable: LocalStateObservableState;
  source: LocalStateSource;
}>;

export type LocalStateStore = StoreApi<LocalStateStoreState>;

type CreateLocalStateStoreOptions = Readonly<{
  environment?: LocalStateEnvironment;
}>;

type CommitObservableOptions = Readonly<{
  keepFirstLaunchGateOnWriteFailure?: boolean;
}>;

const successfulAction = (
  persistenceStatus: LocalStateObservableState["persistenceStatus"],
): LocalStateActionResult => ({ ok: true, persistenceStatus });

const rejectedAction = (error: LocalStateError): LocalStateActionResult => ({ error, ok: false });

function readBrowserLocalePreferences(): unknown {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  try {
    return BrowserLocalePreferencesSchema.parse({
      language: navigator.language,
      languages: Array.from(navigator.languages),
    });
  } catch {
    return undefined;
  }
}

function resolveBrowserStorage(): LocalStateStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function serializedSnapshot(observable: LocalStateObservableState): string {
  const persisted = PersistedLocalStateSchema.parse({
    firstLaunchCompleted: observable.firstLaunchCompleted,
    state: {
      games: observable.games,
      settings: observable.appliedSettings,
    },
    version: localStateStorageVersion,
  });

  return JSON.stringify(persisted);
}

function invalidInstalledGame(gameId: GameId): LocalStateError | undefined {
  const parsedGameId = GameIdSchema.safeParse(gameId);

  if (parsedGameId.success && resolveInstalledGame(parsedGameId.data) !== undefined) {
    return undefined;
  }

  return createLocalStateError(
    localStateErrorCodes.uninstalledGame,
    `Game ${String(gameId)} is not installed.`,
    parsedGameId.success ? parsedGameId.data : undefined,
  );
}

function validateFirstLaunchSettings(
  settings: AppSettings,
): Readonly<{ ok: true; settings: AppSettings }> | Readonly<{ error: LocalStateError; ok: false }> {
  const parsed = AppSettingsSchema.safeParse(settings);

  if (!parsed.success) {
    return {
      error: createLocalStateError(
        localStateErrorCodes.invalidActionInput,
        "First-launch settings are malformed.",
      ),
      ok: false,
    };
  }

  const defaultGameError = invalidInstalledGame(parsed.data.defaultGameId);

  if (defaultGameError !== undefined) {
    return { error: defaultGameError, ok: false };
  }

  if (parsed.data.lastActiveGameId !== undefined) {
    const lastActiveGameError = invalidInstalledGame(parsed.data.lastActiveGameId);

    if (lastActiveGameError !== undefined) {
      return { error: lastActiveGameError, ok: false };
    }
  }

  return {
    ok: true,
    settings: AppSettingsSchema.parse({
      ...parsed.data,
      lastActiveGameId: parsed.data.lastActiveGameId ?? parsed.data.defaultGameId,
    }),
  };
}

export function createLocalStateStore(options: CreateLocalStateStoreOptions = {}): LocalStateStore {
  const initial = createDefaultLocalAppState(languageCodes.EN);
  let activeStorage: LocalStateStorage | null = null;
  let browserLanguage: LanguageCode = languageCodes.EN;

  const initialObservable: LocalStateObservableState = {
    appliedSettings: initial.state.settings,
    firstLaunchCompleted: false,
    games: initial.state.games,
    hydrationStatus: localStateHydrationStatuses.pending,
    installedGameSlices: initial.installedGameSlices,
    persistenceStatus: localStatePersistenceStatuses.pending,
    resolvedActiveGameId: resolveActiveGameId(initial.state.settings),
  };

  return createStore<LocalStateStoreState>((set, get) => {
    const requireHydrated = (): LocalStateError | undefined =>
      get().observable.hydrationStatus === localStateHydrationStatuses.ready
        ? undefined
        : createLocalStateError(
            localStateErrorCodes.notHydrated,
            "Local state is not hydrated yet.",
          );

    const commitObservable = (
      nextInput: LocalStateObservableState,
      options: CommitObservableOptions = {},
    ): LocalStateActionResult => {
      const current = get().observable;
      let next: LocalStateObservableState = {
        ...nextInput,
        resolvedActiveGameId: resolveActiveGameId(nextInput.appliedSettings),
      };

      if (
        current.persistenceStatus === localStatePersistenceStatuses.persistent &&
        activeStorage !== null
      ) {
        try {
          activeStorage.setItem(localStateStorageKey, serializedSnapshot(next));
          next = { ...next, error: undefined };
        } catch {
          next = {
            ...next,
            error: createLocalStateError(
              localStateErrorCodes.storageWriteFailed,
              "Local changes are applied for this session but could not be saved.",
            ),
            firstLaunchCompleted: options.keepFirstLaunchGateOnWriteFailure
              ? current.firstLaunchCompleted
              : next.firstLaunchCompleted,
            persistenceStatus: localStatePersistenceStatuses.sessionOnly,
          };
          activeStorage = null;
        }
      }

      set({ observable: next });

      return successfulAction(next.persistenceStatus);
    };

    const completeFirstLaunch: LocalStateSource["completeFirstLaunch"] = (settings) => {
      const hydrationError = requireHydrated();

      if (hydrationError !== undefined) {
        return rejectedAction(hydrationError);
      }

      const validated = validateFirstLaunchSettings(settings);

      if (!validated.ok) {
        return rejectedAction(validated.error);
      }

      return commitObservable(
        {
          ...get().observable,
          appliedSettings: validated.settings,
          firstLaunchCompleted: true,
        },
        { keepFirstLaunchGateOnWriteFailure: true },
      );
    };

    const autoCompleteFromDeepLink: LocalStateSource["autoCompleteFromDeepLink"] = (gameId) => {
      const hydrationError = requireHydrated();

      if (hydrationError !== undefined) {
        return rejectedAction(hydrationError);
      }

      const gameError = invalidInstalledGame(gameId);

      if (gameError !== undefined) {
        return rejectedAction(gameError);
      }

      return commitObservable({
        ...get().observable,
        appliedSettings: AppSettingsSchema.parse({
          defaultGameId: gameId,
          language: browserLanguage,
          lastActiveGameId: gameId,
          notationDisplayMode: notationDisplayModes.FGC,
        }),
        firstLaunchCompleted: true,
      });
    };

    const rememberLastActiveGame: LocalStateSource["rememberLastActiveGame"] = (gameId) => {
      const hydrationError = requireHydrated();

      if (hydrationError !== undefined) {
        return rejectedAction(hydrationError);
      }

      const gameError = invalidInstalledGame(gameId);

      if (gameError !== undefined) {
        return rejectedAction(gameError);
      }

      const observable = get().observable;

      return commitObservable({
        ...observable,
        appliedSettings: AppSettingsSchema.parse({
          ...observable.appliedSettings,
          lastActiveGameId: gameId,
        }),
      });
    };

    const updateSettings: LocalStateSource["updateSettings"] = (update) => {
      const hydrationError = requireHydrated();

      if (hydrationError !== undefined) {
        return rejectedAction(hydrationError);
      }

      const parsed = LocalStateSettingsUpdateSchema.safeParse(update);

      if (!parsed.success) {
        return rejectedAction(
          createLocalStateError(
            localStateErrorCodes.invalidActionInput,
            "The settings update is malformed.",
          ),
        );
      }

      const observable = get().observable;

      return commitObservable({
        ...observable,
        appliedSettings: AppSettingsSchema.parse({
          ...observable.appliedSettings,
          ...parsed.data,
        }),
      });
    };

    const replaceGameSlice: LocalStateSource["replaceGameSlice"] = (gameId, slice) => {
      const hydrationError = requireHydrated();

      if (hydrationError !== undefined) {
        return rejectedAction(hydrationError);
      }

      const replacement = validateReplacementGameSlice(gameId, slice);

      if (!replacement.ok) {
        return rejectedAction(replacement.error);
      }

      const observable = get().observable;

      return commitObservable({
        ...observable,
        games: {
          ...observable.games,
          [gameId]: replacement.slice,
        },
        installedGameSlices: {
          ...observable.installedGameSlices,
          [gameId]: replacement.state,
        },
      });
    };

    const setSettingsReturnTarget: LocalStateSource["setSettingsReturnTarget"] = (target) => {
      const parsed = SettingsReturnTargetSchema.safeParse(target);

      if (!parsed.success) {
        return rejectedAction(
          createLocalStateError(
            localStateErrorCodes.invalidActionInput,
            "The Settings return target is malformed.",
          ),
        );
      }

      const gameError = invalidInstalledGame(parsed.data.gameId);

      if (gameError !== undefined) {
        return rejectedAction(gameError);
      }

      const observable = get().observable;

      set({
        observable: {
          ...observable,
          settingsReturnTarget: parsed.data,
        },
      });

      return successfulAction(observable.persistenceStatus);
    };

    const clearSettingsReturnTarget: LocalStateSource["clearSettingsReturnTarget"] = () => {
      const observable = get().observable;

      set({
        observable: {
          ...observable,
          settingsReturnTarget: undefined,
        },
      });

      return successfulAction(observable.persistenceStatus);
    };

    const hydrate = () => {
      if (get().observable.hydrationStatus === localStateHydrationStatuses.ready) {
        return;
      }

      const localeInput =
        options.environment === undefined
          ? readBrowserLocalePreferences()
          : options.environment.browserLocalePreferences;
      browserLanguage = resolveBrowserLanguage(localeInput);
      const fallback = createDefaultLocalAppState(browserLanguage);
      const fallbackObservable: LocalStateObservableState = {
        appliedSettings: fallback.state.settings,
        firstLaunchCompleted: false,
        games: fallback.state.games,
        hydrationStatus: localStateHydrationStatuses.ready,
        installedGameSlices: fallback.installedGameSlices,
        persistenceStatus: localStatePersistenceStatuses.sessionOnly,
        resolvedActiveGameId: resolveActiveGameId(fallback.state.settings),
      };

      try {
        activeStorage =
          options.environment === undefined ? resolveBrowserStorage() : options.environment.storage;
      } catch {
        activeStorage = null;
        set({
          observable: {
            ...fallbackObservable,
            error: createLocalStateError(
              localStateErrorCodes.storageReadFailed,
              "Browser storage could not be opened. Changes will stay in this session.",
            ),
          },
        });
        return;
      }

      if (activeStorage === null) {
        set({
          observable: {
            ...fallbackObservable,
            error: createLocalStateError(
              localStateErrorCodes.storageUnavailable,
              "Browser storage is unavailable. Changes will stay in this session.",
            ),
          },
        });
        return;
      }

      let storedText: string | null;

      try {
        storedText = activeStorage.getItem(localStateStorageKey);
      } catch {
        activeStorage = null;
        set({
          observable: {
            ...fallbackObservable,
            error: createLocalStateError(
              localStateErrorCodes.storageReadFailed,
              "Saved local state could not be read. The stored value was left untouched.",
            ),
          },
        });
        return;
      }

      if (storedText === null) {
        set({
          observable: {
            ...fallbackObservable,
            persistenceStatus: localStatePersistenceStatuses.persistent,
          },
        });
        return;
      }

      const parsed = parsePersistedLocalStateText(storedText);

      if (!parsed.ok) {
        activeStorage = null;
        set({ observable: { ...fallbackObservable, error: parsed.error } });
        return;
      }

      const prepared = preparePersistedLocalAppState(parsed.value);
      let hydrated: LocalStateObservableState = {
        appliedSettings: prepared.state.settings,
        firstLaunchCompleted: parsed.value.firstLaunchCompleted,
        games: prepared.state.games,
        hydrationStatus: localStateHydrationStatuses.ready,
        installedGameSlices: prepared.installedGameSlices,
        persistenceStatus: localStatePersistenceStatuses.persistent,
        resolvedActiveGameId: resolveActiveGameId(prepared.state.settings),
      };

      if (prepared.recoveredMissingSlices) {
        try {
          activeStorage.setItem(localStateStorageKey, serializedSnapshot(hydrated));
        } catch {
          activeStorage = null;
          hydrated = {
            ...hydrated,
            error: createLocalStateError(
              localStateErrorCodes.storageWriteFailed,
              "Missing game state was recovered for this session but could not be saved.",
            ),
            persistenceStatus: localStatePersistenceStatuses.sessionOnly,
          };
        }
      }

      set({ observable: hydrated });
    };

    return {
      hydrate,
      observable: initialObservable,
      source: {
        autoCompleteFromDeepLink,
        clearSettingsReturnTarget,
        completeFirstLaunch,
        rememberLastActiveGame,
        replaceGameSlice,
        setSettingsReturnTarget,
        updateSettings,
      },
    };
  });
}
