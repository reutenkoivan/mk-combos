import { gameRouteKinds } from "@mk-combos/contracts/routes/value";
import { languageCodes, notationDisplayModes } from "@mk-combos/contracts/settings/value";
import { describe, expect, it, vi } from "vitest";

import { installedGames } from "../../game-business/installed-games/value";
import { createDefaultLocalAppState } from "./runtime";
import { PersistedLocalStateSchema } from "./schema";
import { createLocalStateStore } from "./store";
import type { LocalStateStorage } from "./type";
import {
  localGameSliceStatuses,
  localStateErrorCodes,
  localStateHydrationStatuses,
  localStatePersistenceStatuses,
  localStateStorageKey,
} from "./value";

function createMemoryStorage(initialValue: string | null = null) {
  let value = initialValue;
  const storage: LocalStateStorage = {
    getItem: vi.fn((key: string) => (key === localStateStorageKey ? value : null)),
    setItem: vi.fn((key: string, nextValue: string) => {
      if (key === localStateStorageKey) {
        value = nextValue;
      }
    }),
  };

  return {
    read: () => value,
    storage,
  };
}

function parseStoredValue(read: () => string | null) {
  const value = read();

  if (value === null) {
    throw new Error("Expected local state to be stored.");
  }

  return PersistedLocalStateSchema.parse(JSON.parse(value));
}

describe("local-state store", () => {
  it("hydrates browser defaults without writing before first-launch completion", () => {
    const memory = createMemoryStorage();
    const store = createLocalStateStore({
      environment: {
        browserLocalePreferences: { languages: ["uk-UA"] },
        storage: memory.storage,
      },
    });

    expect(store.getState().observable.hydrationStatus).toBe(localStateHydrationStatuses.pending);

    store.getState().hydrate();
    const observable = store.getState().observable;

    expect(observable.hydrationStatus).toBe(localStateHydrationStatuses.ready);
    expect(observable.persistenceStatus).toBe(localStatePersistenceStatuses.persistent);
    expect(observable.firstLaunchCompleted).toBe(false);
    expect(observable.appliedSettings).toEqual({
      defaultGameId: "mkxl",
      language: languageCodes.UA,
      notationDisplayMode: notationDisplayModes.FGC,
    });
    expect(memory.storage.setItem).not.toHaveBeenCalled();
  });

  it("rejects mutations until hydration is ready", () => {
    const store = createLocalStateStore({
      environment: { storage: createMemoryStorage().storage },
    });

    const result = store.getState().source.updateSettings({ language: languageCodes.UA });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(localStateErrorCodes.notHydrated);
    }
  });

  it("persists explicit first-launch settings in the strict private wrapper", () => {
    const memory = createMemoryStorage();
    const store = createLocalStateStore({ environment: { storage: memory.storage } });
    store.getState().hydrate();

    const result = store.getState().source.completeFirstLaunch({
      defaultGameId: "mk1",
      language: languageCodes.UA,
      notationDisplayMode: notationDisplayModes.Xbox,
    });
    const persisted = parseStoredValue(memory.read);

    expect(result).toEqual({
      ok: true,
      persistenceStatus: localStatePersistenceStatuses.persistent,
    });
    expect(persisted.firstLaunchCompleted).toBe(true);
    expect(persisted.state.settings).toEqual({
      defaultGameId: "mk1",
      language: languageCodes.UA,
      lastActiveGameId: "mk1",
      notationDisplayMode: notationDisplayModes.Xbox,
    });
    expect(Object.keys(persisted.state.games)).toEqual(installedGames.map((game) => game.id));
  });

  it("auto-completes a valid deep link with browser defaults", () => {
    const memory = createMemoryStorage();
    const store = createLocalStateStore({
      environment: {
        browserLocalePreferences: { language: "uk" },
        storage: memory.storage,
      },
    });
    store.getState().hydrate();

    const result = store.getState().source.autoCompleteFromDeepLink("mk1");
    const observable = store.getState().observable;

    expect(result.ok).toBe(true);
    expect(observable.firstLaunchCompleted).toBe(true);
    expect(observable.appliedSettings).toEqual({
      defaultGameId: "mk1",
      language: languageCodes.UA,
      lastActiveGameId: "mk1",
      notationDisplayMode: notationDisplayModes.FGC,
    });
    expect(observable.resolvedActiveGameId).toBe("mk1");
  });

  it("autosaves setting changes and remembers active game without changing the default", () => {
    const memory = createMemoryStorage();
    const store = createLocalStateStore({ environment: { storage: memory.storage } });
    store.getState().hydrate();
    store.getState().source.completeFirstLaunch({
      defaultGameId: "mkxl",
      language: languageCodes.EN,
      notationDisplayMode: notationDisplayModes.FGC,
    });

    store.getState().source.updateSettings({
      language: languageCodes.UA,
      notationDisplayMode: notationDisplayModes.PlayStation,
    });
    store.getState().source.rememberLastActiveGame("mk1");

    expect(store.getState().observable.appliedSettings).toEqual({
      defaultGameId: "mkxl",
      language: languageCodes.UA,
      lastActiveGameId: "mk1",
      notationDisplayMode: notationDisplayModes.PlayStation,
    });
    expect(store.getState().observable.resolvedActiveGameId).toBe("mk1");
    expect(parseStoredValue(memory.read).state.settings.defaultGameId).toBe("mkxl");
  });

  it("keeps applied changes in session when a synchronous write fails", () => {
    const storage: LocalStateStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error("quota exceeded");
      }),
    };
    const store = createLocalStateStore({ environment: { storage } });
    store.getState().hydrate();

    const result = store.getState().source.updateSettings({ language: languageCodes.UA });
    const observable = store.getState().observable;

    expect(result).toEqual({
      ok: true,
      persistenceStatus: localStatePersistenceStatuses.sessionOnly,
    });
    expect(observable.appliedSettings.language).toBe(languageCodes.UA);
    expect(observable.persistenceStatus).toBe(localStatePersistenceStatuses.sessionOnly);
    expect(observable.error?.code).toBe(localStateErrorCodes.storageWriteFailed);
  });

  it("keeps the first-launch gate open after a write failure and allows explicit session-only continuation", () => {
    const storage: LocalStateStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error("quota exceeded");
      }),
    };
    const store = createLocalStateStore({ environment: { storage } });
    store.getState().hydrate();
    const settings = {
      defaultGameId: "mk1",
      language: languageCodes.UA,
      notationDisplayMode: notationDisplayModes.Xbox,
    } as const;

    const failedPersistence = store.getState().source.completeFirstLaunch(settings);

    expect(failedPersistence).toEqual({
      ok: true,
      persistenceStatus: localStatePersistenceStatuses.sessionOnly,
    });
    expect(store.getState().observable.firstLaunchCompleted).toBe(false);
    expect(store.getState().observable.appliedSettings).toMatchObject(settings);
    expect(store.getState().observable.error?.code).toBe(localStateErrorCodes.storageWriteFailed);

    const sessionOnlyContinuation = store.getState().source.completeFirstLaunch(settings);

    expect(sessionOnlyContinuation).toEqual({
      ok: true,
      persistenceStatus: localStatePersistenceStatuses.sessionOnly,
    });
    expect(store.getState().observable.firstLaunchCompleted).toBe(true);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("does not overwrite malformed storage and switches to session-only recovery", () => {
    const memory = createMemoryStorage("{broken");
    const store = createLocalStateStore({
      environment: {
        browserLocalePreferences: { language: "uk-UA" },
        storage: memory.storage,
      },
    });

    store.getState().hydrate();
    const observable = store.getState().observable;

    expect(observable.hydrationStatus).toBe(localStateHydrationStatuses.ready);
    expect(observable.persistenceStatus).toBe(localStatePersistenceStatuses.sessionOnly);
    expect(observable.appliedSettings.language).toBe(languageCodes.UA);
    expect(observable.error?.code).toBe(localStateErrorCodes.malformedStorage);
    expect(memory.read()).toBe("{broken");
    expect(memory.storage.setItem).not.toHaveBeenCalled();
  });

  it("recovers missing installed slices and preserves future game keys", () => {
    const stored = PersistedLocalStateSchema.parse({
      firstLaunchCompleted: true,
      state: {
        games: {
          "future-game": { opaque: { value: 1 } },
          mkxl: installedGames[0].backup.createEmptySlice(),
        },
        settings: {
          defaultGameId: "mkxl",
          language: languageCodes.EN,
          notationDisplayMode: notationDisplayModes.FGC,
        },
      },
      version: 1,
    });
    const memory = createMemoryStorage(JSON.stringify(stored));
    const store = createLocalStateStore({ environment: { storage: memory.storage } });

    store.getState().hydrate();
    const repaired = parseStoredValue(memory.read);

    expect(repaired.state.games["future-game"]).toEqual({ opaque: { value: 1 } });
    expect(installedGames[1].backup.validateSlice(repaired.state.games.mk1).ok).toBe(true);
    expect(memory.storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("retains invalid known data until an explicit valid replacement", () => {
    const invalidMkxlSlice = { customCombos: "invalid", namedLists: [], version: 1 };
    const mk1Slice = installedGames[1].backup.createEmptySlice();
    const stored = PersistedLocalStateSchema.parse({
      firstLaunchCompleted: true,
      state: {
        games: {
          "future-game": { retained: true },
          mk1: mk1Slice,
          mkxl: invalidMkxlSlice,
        },
        settings: {
          defaultGameId: "mk1",
          language: languageCodes.UA,
          lastActiveGameId: "mk1",
          notationDisplayMode: notationDisplayModes.Xbox,
        },
      },
      version: 1,
    });
    const memory = createMemoryStorage(JSON.stringify(stored));
    const store = createLocalStateStore({ environment: { storage: memory.storage } });
    store.getState().hydrate();

    expect(store.getState().observable.games.mkxl).toEqual(invalidMkxlSlice);
    expect(store.getState().observable.installedGameSlices.mkxl?.status).toBe(
      localGameSliceStatuses.invalid,
    );
    expect(memory.storage.setItem).not.toHaveBeenCalled();

    const invalidReplacement = store.getState().source.replaceGameSlice("mkxl", {});
    expect(invalidReplacement.ok).toBe(false);
    expect(store.getState().observable.games.mkxl).toEqual(invalidMkxlSlice);

    const validReplacement = installedGames[0].backup.createEmptySlice();
    expect(store.getState().source.replaceGameSlice("mkxl", validReplacement).ok).toBe(true);

    const persisted = parseStoredValue(memory.read);
    expect(persisted.state.games.mk1).toEqual(mk1Slice);
    expect(persisted.state.games["future-game"]).toEqual({ retained: true });
    expect(persisted.state.settings).toEqual(stored.state.settings);
    expect(store.getState().observable.installedGameSlices.mkxl?.status).toBe(
      localGameSliceStatuses.valid,
    );
  });

  it("keeps the Settings return target ephemeral and clearable", () => {
    const memory = createMemoryStorage();
    const store = createLocalStateStore({ environment: { storage: memory.storage } });
    store.getState().hydrate();
    const target = { gameId: "mk1", kind: gameRouteKinds.catalog } as const;

    expect(store.getState().source.setSettingsReturnTarget(target).ok).toBe(true);
    expect(store.getState().observable.settingsReturnTarget).toEqual(target);
    expect(memory.storage.setItem).not.toHaveBeenCalled();

    store.getState().source.clearSettingsReturnTarget();
    expect(store.getState().observable.settingsReturnTarget).toBeUndefined();
  });

  it("uses the first installed game when stored active and default ids are unavailable", () => {
    const defaultState = createDefaultLocalAppState(languageCodes.EN).state;
    const stored = PersistedLocalStateSchema.parse({
      firstLaunchCompleted: true,
      state: {
        games: defaultState.games,
        settings: {
          defaultGameId: "future-default",
          language: languageCodes.EN,
          lastActiveGameId: "future-last",
          notationDisplayMode: notationDisplayModes.FGC,
        },
      },
      version: 1,
    });
    const store = createLocalStateStore({
      environment: { storage: createMemoryStorage(JSON.stringify(stored)).storage },
    });

    store.getState().hydrate();

    expect(store.getState().observable.resolvedActiveGameId).toBe(installedGames[0].id);
  });
});
