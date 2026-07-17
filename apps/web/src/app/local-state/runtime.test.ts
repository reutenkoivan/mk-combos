import {
  languageCodes,
  notationDisplayModes,
  themePreferences,
} from "@mk-combos/contracts/settings/value";
import { describe, expect, it } from "vitest";

import { installedGames } from "../../game-business/installed-games/value";
import {
  createDefaultLocalAppState,
  parsePersistedLocalStateText,
  preparePersistedLocalAppState,
  resolveActiveGameId,
  resolveBrowserLanguage,
} from "./runtime";
import { PersistedLocalStateSchema, PersistedLocalStateV1Schema } from "./schema";
import {
  legacyLocalStateStorageVersion,
  localGameSliceStatuses,
  localStateErrorCodes,
  localStateStorageVersion,
} from "./value";

describe("local-state runtime", () => {
  it("normalizes exact Ukrainian browser locales", () => {
    expect(resolveBrowserLanguage({ language: "uk" })).toBe(languageCodes.UA);
    expect(resolveBrowserLanguage({ language: "UK" })).toBe(languageCodes.UA);
    expect(resolveBrowserLanguage({ languages: ["uk-UA", "en-US"] })).toBe(languageCodes.UA);
    expect(resolveBrowserLanguage({ language: "uk-Latn" })).toBe(languageCodes.UA);
  });

  it("does not treat strings that merely start with uk as Ukrainian locales", () => {
    expect(resolveBrowserLanguage({ language: "ukrainian" })).toBe(languageCodes.EN);
    expect(resolveBrowserLanguage({ language: "uk2" })).toBe(languageCodes.EN);
    expect(resolveBrowserLanguage({ language: "uk_UA" })).toBe(languageCodes.EN);
    expect(resolveBrowserLanguage({ languages: ["en-GB", "uk-UA"] })).toBe(languageCodes.EN);
    expect(resolveBrowserLanguage({ languages: "uk-UA" })).toBe(languageCodes.EN);
    expect(resolveBrowserLanguage(undefined)).toBe(languageCodes.EN);
  });

  it("creates a validated empty slice for every installed game", () => {
    const prepared = createDefaultLocalAppState(languageCodes.UA);

    expect(prepared.state.settings).toEqual({
      defaultGameId: installedGames[0].id,
      language: languageCodes.UA,
      notationDisplayMode: notationDisplayModes.FGC,
      themePreference: themePreferences.system,
    });
    expect(Object.keys(prepared.state.games)).toEqual(installedGames.map((game) => game.id));

    for (const business of installedGames) {
      expect(business.backup.validateSlice(prepared.state.games[business.id]).ok).toBe(true);
      expect(prepared.installedGameSlices[business.id]?.status).toBe(localGameSliceStatuses.valid);
    }
  });

  it("recovers absent installed slices while preserving future game data", () => {
    const mkxlSlice = installedGames[0].backup.createEmptySlice();
    const persisted = PersistedLocalStateSchema.parse({
      firstLaunchCompleted: true,
      state: {
        games: {
          "future-game": { futureField: "preserved" },
          mkxl: mkxlSlice,
        },
        settings: {
          defaultGameId: "future-game",
          language: languageCodes.EN,
          notationDisplayMode: notationDisplayModes.PlayStation,
          themePreference: themePreferences.light,
        },
      },
      version: localStateStorageVersion,
    });

    const prepared = preparePersistedLocalAppState(persisted);

    expect(prepared.recoveredMissingSlices).toBe(true);
    expect(prepared.state.games["future-game"]).toEqual({ futureField: "preserved" });
    expect(installedGames[1].backup.validateSlice(prepared.state.games.mk1).ok).toBe(true);
    expect(resolveActiveGameId(prepared.state.settings)).toBe(installedGames[0].id);
  });

  it("retains an invalid known slice and reports it instead of destructively recovering", () => {
    const invalidMkxlSlice = {
      customCombos: "invalid",
      namedLists: [],
      version: 1,
    };
    const persisted = PersistedLocalStateSchema.parse({
      firstLaunchCompleted: true,
      state: {
        games: {
          mk1: installedGames[1].backup.createEmptySlice(),
          mkxl: invalidMkxlSlice,
        },
        settings: {
          defaultGameId: "mkxl",
          language: languageCodes.EN,
          notationDisplayMode: notationDisplayModes.FGC,
          themePreference: themePreferences.dark,
        },
      },
      version: localStateStorageVersion,
    });

    const prepared = preparePersistedLocalAppState(persisted);

    expect(prepared.recoveredMissingSlices).toBe(false);
    expect(prepared.state.games.mkxl).toEqual(invalidMkxlSlice);
    expect(prepared.installedGameSlices.mkxl?.status).toBe(localGameSliceStatuses.invalid);
    expect(prepared.installedGameSlices.mkxl?.error?.code).toBe(
      localStateErrorCodes.invalidGameSlice,
    );
  });

  it("rejects malformed JSON and strict-wrapper violations", () => {
    const malformedJson = parsePersistedLocalStateText("{broken");
    const extraWrapperKey = parsePersistedLocalStateText(
      JSON.stringify({
        extra: true,
        firstLaunchCompleted: false,
        state: createDefaultLocalAppState(languageCodes.EN).state,
        version: localStateStorageVersion,
      }),
    );

    expect(malformedJson.ok).toBe(false);
    expect(extraWrapperKey.ok).toBe(false);

    if (!malformedJson.ok && !extraWrapperKey.ok) {
      expect(malformedJson.error.code).toBe(localStateErrorCodes.malformedStorage);
      expect(extraWrapperKey.error.code).toBe(localStateErrorCodes.malformedStorage);
    }
  });

  it("migrates a strict v1 payload to v2 without changing existing settings or game data", () => {
    const legacy = PersistedLocalStateV1Schema.parse({
      firstLaunchCompleted: true,
      state: {
        games: {
          "future-game": { opaque: { retained: true } },
          mk1: installedGames[1].backup.createEmptySlice(),
          mkxl: installedGames[0].backup.createEmptySlice(),
        },
        settings: {
          defaultGameId: "mk1",
          language: languageCodes.UA,
          lastActiveGameId: "mk1",
          notationDisplayMode: notationDisplayModes.Xbox,
        },
      },
      version: legacyLocalStateStorageVersion,
    });

    const parsed = parsePersistedLocalStateText(JSON.stringify(legacy));

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.migrationApplied).toBe(true);
    expect(parsed.value.version).toBe(localStateStorageVersion);
    expect(parsed.value.firstLaunchCompleted).toBe(true);
    expect(parsed.value.state.games).toEqual(legacy.state.games);
    expect(parsed.value.state.settings).toEqual({
      ...legacy.state.settings,
      themePreference: themePreferences.system,
    });
  });
});
