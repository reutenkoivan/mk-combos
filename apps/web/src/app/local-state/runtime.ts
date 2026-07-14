import type { GameId } from "@mk-combos/contracts/identity/type";
import { GameUserStateSchema, LocalAppStateSchema } from "@mk-combos/contracts/settings/schema";
import type {
  AppSettings,
  GameUserState,
  LanguageCode,
  LocalAppState,
} from "@mk-combos/contracts/settings/type";
import { languageCodes, notationDisplayModes } from "@mk-combos/contracts/settings/value";

import { resolveInstalledGame } from "../../game-business/installed-games/runtime";
import type { InstalledGameBusiness } from "../../game-business/installed-games/type";
import { installedGames } from "../../game-business/installed-games/value";
import { BrowserLocalePreferencesSchema, PersistedLocalStateSchema } from "./schema";
import type { LocalStateError, LocalStateInstalledGameSlice, PersistedLocalState } from "./type";
import { localGameSliceStatuses, localStateErrorCodes } from "./value";

export type PreparedLocalAppState = Readonly<{
  installedGameSlices: Readonly<Record<GameId, LocalStateInstalledGameSlice>>;
  recoveredMissingSlices: boolean;
  state: LocalAppState;
}>;

export type PersistedLocalStateParseResult =
  | Readonly<{ ok: true; value: PersistedLocalState }>
  | Readonly<{ error: LocalStateError; ok: false }>;

export function createLocalStateError(
  code: LocalStateError["code"],
  message: string,
  gameId?: GameId,
): LocalStateError {
  return gameId === undefined
    ? { code, message, recoverable: true }
    : { code, gameId, message, recoverable: true };
}

export function resolveBrowserLanguage(input: unknown): LanguageCode {
  const preferences = BrowserLocalePreferencesSchema.safeParse(input);

  if (!preferences.success) {
    return languageCodes.EN;
  }

  const locale = preferences.data.languages?.[0] ?? preferences.data.language;
  const normalizedLocale = locale?.toLowerCase();

  return normalizedLocale === "uk" || normalizedLocale?.startsWith("uk-") === true
    ? languageCodes.UA
    : languageCodes.EN;
}

export function resolveActiveGameId(settings: AppSettings): GameId {
  if (
    settings.lastActiveGameId !== undefined &&
    resolveInstalledGame(settings.lastActiveGameId) !== undefined
  ) {
    return settings.lastActiveGameId;
  }

  if (resolveInstalledGame(settings.defaultGameId) !== undefined) {
    return settings.defaultGameId;
  }

  return installedGames[0].id;
}

function validInstalledGameSlice(
  gameId: GameId,
  messages: LocalStateInstalledGameSlice["messages"],
): LocalStateInstalledGameSlice {
  return {
    gameId,
    messages,
    status: localGameSliceStatuses.valid,
  };
}

function createEmptyInstalledGameSlice(business: InstalledGameBusiness): Readonly<{
  slice: GameUserState;
  state: LocalStateInstalledGameSlice;
}> {
  const slice = GameUserStateSchema.parse(business.backup.createEmptySlice());
  const validation = business.backup.validateSlice(slice);

  if (!validation.ok) {
    throw new Error(`Installed game ${business.id} returned an invalid empty slice.`);
  }

  return {
    slice: GameUserStateSchema.parse(validation.value.slice),
    state: validInstalledGameSlice(business.id, validation.value.messages),
  };
}

function validateInstalledGameSlice(
  business: InstalledGameBusiness,
  input: GameUserState,
): Readonly<{
  slice: GameUserState;
  state: LocalStateInstalledGameSlice;
}> {
  const validation = business.backup.validateSlice(input);

  if (!validation.ok) {
    const error = createLocalStateError(
      localStateErrorCodes.invalidGameSlice,
      validation.error.message,
      business.id,
    );

    return {
      slice: input,
      state: {
        error,
        gameId: business.id,
        messages: validation.error.validationMessages ?? [],
        status: localGameSliceStatuses.invalid,
      },
    };
  }

  const slice = GameUserStateSchema.safeParse(validation.value.slice);

  if (!slice.success) {
    const error = createLocalStateError(
      localStateErrorCodes.invalidGameSlice,
      `Installed game ${business.id} returned a slice outside the app-local envelope.`,
      business.id,
    );

    return {
      slice: input,
      state: {
        error,
        gameId: business.id,
        messages: validation.value.messages,
        status: localGameSliceStatuses.invalid,
      },
    };
  }

  return {
    slice: slice.data,
    state: validInstalledGameSlice(business.id, validation.value.messages),
  };
}

export function createDefaultLocalAppState(language: LanguageCode): PreparedLocalAppState {
  const games: Record<GameId, GameUserState> = {};
  const installedGameSlices: Record<GameId, LocalStateInstalledGameSlice> = {};

  for (const business of installedGames) {
    const empty = createEmptyInstalledGameSlice(business);

    games[business.id] = empty.slice;
    installedGameSlices[business.id] = empty.state;
  }

  return {
    installedGameSlices,
    recoveredMissingSlices: false,
    state: LocalAppStateSchema.parse({
      games,
      settings: {
        defaultGameId: installedGames[0].id,
        language,
        notationDisplayMode: notationDisplayModes.FGC,
      },
    }),
  };
}

export function preparePersistedLocalAppState(
  persisted: PersistedLocalState,
): PreparedLocalAppState {
  const games: Record<GameId, GameUserState> = { ...persisted.state.games };
  const installedGameSlices: Record<GameId, LocalStateInstalledGameSlice> = {};
  let recoveredMissingSlices = false;

  for (const business of installedGames) {
    const storedSlice = games[business.id];

    if (storedSlice === undefined) {
      const empty = createEmptyInstalledGameSlice(business);

      games[business.id] = empty.slice;
      installedGameSlices[business.id] = empty.state;
      recoveredMissingSlices = true;
      continue;
    }

    const prepared = validateInstalledGameSlice(business, storedSlice);

    games[business.id] = prepared.slice;
    installedGameSlices[business.id] = prepared.state;
  }

  return {
    installedGameSlices,
    recoveredMissingSlices,
    state: LocalAppStateSchema.parse({
      games,
      settings: persisted.state.settings,
    }),
  };
}

export function parsePersistedLocalStateText(input: string): PersistedLocalStateParseResult {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(input);
  } catch {
    return {
      error: createLocalStateError(
        localStateErrorCodes.malformedStorage,
        "Saved local state is not valid JSON. The original value was left untouched.",
      ),
      ok: false,
    };
  }

  const persisted = PersistedLocalStateSchema.safeParse(parsedJson);

  if (!persisted.success) {
    return {
      error: createLocalStateError(
        localStateErrorCodes.malformedStorage,
        "Saved local state does not match the supported format. The original value was left untouched.",
      ),
      ok: false,
    };
  }

  return { ok: true, value: persisted.data };
}

export function validateReplacementGameSlice(
  gameId: GameId,
  input: unknown,
):
  | Readonly<{
      ok: true;
      slice: GameUserState;
      state: LocalStateInstalledGameSlice;
    }>
  | Readonly<{ error: LocalStateError; ok: false }> {
  const business = resolveInstalledGame(gameId);

  if (business === undefined) {
    return {
      error: createLocalStateError(
        localStateErrorCodes.uninstalledGame,
        `Game ${gameId} is not installed.`,
        gameId,
      ),
      ok: false,
    };
  }

  const genericSlice = GameUserStateSchema.safeParse(input);

  if (!genericSlice.success) {
    return {
      error: createLocalStateError(
        localStateErrorCodes.invalidGameSlice,
        `The ${business.label} slice is outside the app-local envelope.`,
        business.id,
      ),
      ok: false,
    };
  }

  const prepared = validateInstalledGameSlice(business, genericSlice.data);

  if (prepared.state.status === localGameSliceStatuses.invalid) {
    return {
      error:
        prepared.state.error ??
        createLocalStateError(
          localStateErrorCodes.invalidGameSlice,
          `The ${business.label} slice is invalid.`,
          business.id,
        ),
      ok: false,
    };
  }

  return {
    ok: true,
    slice: prepared.slice,
    state: prepared.state,
  };
}
