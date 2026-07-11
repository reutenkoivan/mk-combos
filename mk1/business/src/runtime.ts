import { BuilderRuntimeSnapshotSchema } from "@mk-combos/builder-core/runtime/schema";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import type { ComboId } from "@mk-combos/contracts/identity/type";
import { err, ok } from "@mk-combos/contracts/result/runtime";
import type { AppError, AppResult, ValidationMessage } from "@mk-combos/contracts/result/type";
import type { LocalizedText } from "@mk-combos/contracts/settings/type";
import {
  composeMk1BuilderGraph,
  getMk1BuilderValidNextMoves,
} from "@mk-combos/mk1-builder/graph/runtime";
import {
  attemptMk1BuilderTransition,
  createMk1BuilderMovePath,
  replayMk1BuilderPath,
} from "@mk-combos/mk1-builder/replay/runtime";
import {
  createMk1BuilderInitialRuntime,
  getMk1BuilderComboState,
} from "@mk-combos/mk1-builder/state/runtime";
import {
  getMk1CatalogContextOptions,
  parseMk1CatalogRouteQuery,
  recoverMk1CatalogContext,
  selectMk1CatalogCharacter,
  selectMk1CatalogKameo,
  serializeMk1CatalogRouteQuery,
} from "@mk-combos/mk1-catalog/context/runtime";
import { Mk1CatalogContextSchema } from "@mk-combos/mk1-catalog/context/schema";
import type { Mk1CatalogPlainRouteQuery } from "@mk-combos/mk1-catalog/context/type";
import { recoverMk1CatalogFilters } from "@mk-combos/mk1-catalog/filters/runtime";
import type { Mk1CatalogFilters } from "@mk-combos/mk1-catalog/filters/type";
import {
  getMk1CatalogComboSummary,
  getMk1CatalogFilterFacets,
  selectMk1CatalogComboSummaries,
} from "@mk-combos/mk1-catalog/selectors/runtime";
import type { Mk1CatalogComboSummary } from "@mk-combos/mk1-catalog/summary/type";
import { mk1Game } from "@mk-combos/mk1-data/game/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import { mk1Moves } from "@mk-combos/mk1-data/movelists/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";
import { z } from "zod/v4";

import {
  Mk1BusinessBuilderStateSchema,
  Mk1BusinessComboLookupSchema,
  Mk1BusinessComboRefSchema,
  Mk1BusinessCustomComboSummarySchema,
  Mk1BusinessSliceSchema,
  Mk1BusinessValidationReportSchema,
  Mk1NamedListSchema,
  Mk1ResolvedNamedListSchema,
} from "./schema";
import type {
  Mk1BusinessBuilderContext,
  Mk1BusinessBuilderState,
  Mk1BusinessComboLookup,
  Mk1BusinessComboRef,
  Mk1BusinessCustomCombo,
  Mk1BusinessCustomComboSummary,
  Mk1BusinessSlice,
  Mk1BusinessValidationReport,
  Mk1ResolvedNamedList,
} from "./type";

type ZodIssueLike = {
  message: string;
  path: readonly PropertyKey[];
};

const MoveIdListSchema = z.array(z.string().min(1)).readonly();

const charactersById = new Map(mk1Characters.map((character) => [character.id, character]));
const kameosById = new Map(mk1Kameos.map((kameo) => [kameo.id, kameo]));
const movesById = new Map(mk1Moves.map((move) => [move.id, move]));

const toLocalizedFallback = (fallback: string): LocalizedText => ({
  fallback,
});

const message = (
  severity: ValidationMessage["severity"],
  code: string,
  text: string,
  path?: readonly string[],
): ValidationMessage => ({
  severity,
  code,
  message: text,
  path,
});

const zodMessages = (issues: readonly ZodIssueLike[], code: string): readonly ValidationMessage[] =>
  issues.map((issue) =>
    message(
      "error",
      code,
      issue.message,
      issue.path.length > 0 ? issue.path.map((segment) => String(segment)) : undefined,
    ),
  );

const appError = (
  code: string,
  text: string,
  validationMessages?: readonly ValidationMessage[],
  cause?: unknown,
): AppError => ({
  code,
  message: text,
  cause,
  validationMessages,
});

const parseComboRef = (input: unknown): AppResult<Mk1BusinessComboRef> => {
  const parsed = Mk1BusinessComboRefSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(
    appError(
      "mk1.business.invalid_combo_ref",
      "MK1 combo reference is malformed.",
      zodMessages(parsed.error.issues, "mk1.business.invalid_combo_ref"),
      parsed.error,
    ),
  );
};

const createEmptyMk1BusinessSlice = (): Mk1BusinessSlice =>
  Mk1BusinessSliceSchema.parse({
    version: 1,
    customCombos: [],
    namedLists: [],
  });

const parseMk1BusinessSlice = (input: unknown): AppResult<Mk1BusinessSlice> => {
  const parsed = Mk1BusinessSliceSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(
    appError(
      "mk1.business.invalid_slice",
      "MK1 business slice is malformed.",
      zodMessages(parsed.error.issues, "mk1.business.invalid_slice"),
      parsed.error,
    ),
  );
};

const parseSliceOrEmpty = (input: unknown | undefined): AppResult<Mk1BusinessSlice> =>
  input === undefined ? ok(createEmptyMk1BusinessSlice()) : parseMk1BusinessSlice(input);

const customCombosById = (slice: Mk1BusinessSlice): ReadonlyMap<string, Mk1BusinessCustomCombo> =>
  new Map(slice.customCombos.map((combo) => [combo.id, combo]));

const contextFromSeededSummary = (summary: Mk1CatalogComboSummary): Mk1BusinessBuilderContext => ({
  characterId: summary.character.id,
  kameoId: summary.kameo.id,
});

const stateFromMoveIds = (input: {
  context: Mk1BusinessBuilderContext;
  movePath: readonly string[];
  runtime?: BuilderRuntimeSnapshot;
}) =>
  getMk1BuilderComboState({
    context: input.context,
    path: createMk1BuilderMovePath(input.movePath),
    initialRuntime: input.runtime,
  });

const customTitle = (combo: Mk1BusinessCustomCombo): LocalizedText =>
  combo.title ?? toLocalizedFallback(`Custom combo ${combo.id}`);

const entityLabel = (id: string, label: LocalizedText, shortLabel?: LocalizedText) => ({
  id,
  label,
  shortLabel,
});

const summarizeMk1CustomCombo = (combo: Mk1BusinessCustomCombo): Mk1BusinessCustomComboSummary => {
  const character = charactersById.get(combo.characterId);
  const kameo = kameosById.get(combo.kameoId);
  const context = {
    characterId: combo.characterId,
    kameoId: combo.kameoId,
  };

  return Mk1BusinessCustomComboSummarySchema.parse({
    ref: {
      gameId: "mk1",
      source: "custom",
      comboId: combo.id,
    },
    gameId: "mk1",
    source: "custom",
    title: customTitle(combo),
    character: entityLabel(
      character?.id ?? combo.characterId,
      character?.label ?? toLocalizedFallback(combo.characterId),
      character?.shortLabel,
    ),
    kameo: entityLabel(
      kameo?.id ?? combo.kameoId,
      kameo?.label ?? toLocalizedFallback(combo.kameoId),
      kameo?.shortLabel,
    ),
    movePath: combo.movePath,
    cachedNotation: combo.cachedNotation,
    metadata: combo.metadata,
    tags: combo.metadata?.tags ?? [],
    notes: combo.notes,
    gameVersion: combo.gameVersion,
    comboState: stateFromMoveIds({
      context,
      movePath: combo.movePath,
    }),
    createdAt: combo.createdAt,
    updatedAt: combo.updatedAt,
  });
};

const foundSeededDetail = (summary: Mk1CatalogComboSummary): Mk1BusinessComboLookup => {
  const context = contextFromSeededSummary(summary);
  const comboState = stateFromMoveIds({
    context,
    movePath: summary.movePath,
  });
  const detail = {
    source: "seeded",
    ref: {
      gameId: "mk1",
      source: "seeded",
      comboId: summary.ref.comboId,
    },
    summary,
    comboState,
  };
  const messages =
    comboState.status === "fresh"
      ? []
      : [
          message(
            "warning",
            "mk1.business.seeded_combo_stale",
            "Seeded MK1 combo does not replay cleanly against current builder data.",
            ["comboId"],
          ),
        ];

  return Mk1BusinessComboLookupSchema.parse({
    status: "found",
    detail,
    messages,
  });
};

const foundCustomDetail = (combo: Mk1BusinessCustomCombo): Mk1BusinessComboLookup => {
  const summary = summarizeMk1CustomCombo(combo);
  const messages =
    summary.comboState.status === "fresh"
      ? []
      : [
          message(
            "warning",
            "mk1.business.custom_combo_stale",
            "Custom MK1 combo does not replay cleanly against current builder data.",
            ["customCombos", combo.id],
          ),
        ];

  return Mk1BusinessComboLookupSchema.parse({
    status: "found",
    detail: {
      source: "custom",
      ref: summary.ref,
      combo,
      summary,
    },
    messages,
  });
};

const notFoundLookup = (ref: Mk1BusinessComboRef): Mk1BusinessComboLookup => {
  const reason = message(
    "warning",
    "mk1.business.combo_not_found",
    "MK1 combo reference could not be resolved.",
    ["comboId"],
  );

  return Mk1BusinessComboLookupSchema.parse({
    status: "notFound",
    ref,
    reason,
    messages: [reason],
  });
};

const lookupMk1BusinessCombo = (input: {
  ref: unknown;
  slice?: unknown;
}): AppResult<Mk1BusinessComboLookup> => {
  const ref = parseComboRef(input.ref);

  if (!ref.ok) {
    return ref;
  }

  if (ref.value.source === "seeded") {
    const summary = getMk1CatalogComboSummary(ref.value.comboId);

    return ok(summary ? foundSeededDetail(summary) : notFoundLookup(ref.value));
  }

  const slice = parseSliceOrEmpty(input.slice);

  if (!slice.ok) {
    return slice;
  }

  const combo = customCombosById(slice.value).get(ref.value.comboId);

  return ok(combo ? foundCustomDetail(combo) : notFoundLookup(ref.value));
};

const deriveMk1CachedNotation = (
  movePath: readonly string[],
): AppResult<Mk1BusinessCustomCombo["cachedNotation"]> => {
  const parsedMovePath = MoveIdListSchema.safeParse(movePath);

  if (!parsedMovePath.success || parsedMovePath.data.length === 0) {
    return err(
      appError(
        "mk1.business.invalid_move_path",
        "MK1 move path must contain at least one move id.",
        parsedMovePath.success
          ? [
              message(
                "error",
                "mk1.business.invalid_move_path",
                "MK1 move path must contain at least one move id.",
                ["movePath"],
              ),
            ]
          : zodMessages(parsedMovePath.error.issues, "mk1.business.invalid_move_path"),
        parsedMovePath.success ? undefined : parsedMovePath.error,
      ),
    );
  }

  const cachedNotation: (typeof mk1Moves)[number]["notation"][] = [];

  for (const [index, moveId] of parsedMovePath.data.entries()) {
    const move = movesById.get(moveId);

    if (!move) {
      return err(
        appError("mk1.business.unknown_move", "MK1 move path references an unknown move.", [
          message(
            "error",
            "mk1.business.unknown_move",
            "MK1 move path references an unknown move.",
            ["movePath", String(index)],
          ),
        ]),
      );
    }

    cachedNotation.push(move.notation);
  }

  return ok(cachedNotation);
};

const createMk1BusinessBuilderState = (input: {
  context: unknown;
  movePath?: readonly string[];
  runtime?: unknown;
}): AppResult<Mk1BusinessBuilderState> => {
  const context = Mk1BusinessBuilderStateSchema.shape.context.safeParse(input.context);

  if (!context.success) {
    return err(
      appError(
        "mk1.business.invalid_builder_context",
        "MK1 builder context is malformed.",
        zodMessages(context.error.issues, "mk1.business.invalid_builder_context"),
        context.error,
      ),
    );
  }

  const movePath = MoveIdListSchema.safeParse(input.movePath ?? []);

  if (!movePath.success) {
    return err(
      appError(
        "mk1.business.invalid_move_path",
        "MK1 builder move path is malformed.",
        zodMessages(movePath.error.issues, "mk1.business.invalid_move_path"),
        movePath.error,
      ),
    );
  }

  const runtime =
    input.runtime === undefined ? undefined : BuilderRuntimeSnapshotSchema.safeParse(input.runtime);

  if (runtime && !runtime.success) {
    return err(
      appError(
        "mk1.business.invalid_runtime",
        "MK1 builder runtime snapshot is malformed.",
        zodMessages(runtime.error.issues, "mk1.business.invalid_runtime"),
        runtime.error,
      ),
    );
  }

  const builderPath = createMk1BuilderMovePath(movePath.data);
  const cachedNotation = movePath.data.length > 0 ? deriveMk1CachedNotation(movePath.data) : ok([]);

  if (!cachedNotation.ok) {
    return cachedNotation;
  }

  return ok(
    Mk1BusinessBuilderStateSchema.parse({
      context: context.data,
      movePath: movePath.data,
      builderPath,
      cachedNotation: cachedNotation.value,
      comboState: getMk1BuilderComboState({
        context: context.data,
        path: builderPath,
        initialRuntime: runtime?.data,
      }),
      runtime: runtime?.data,
      validNextMoves: getMk1BuilderValidNextMoves({
        context: context.data,
        runtime: runtime?.data,
      }),
    }),
  );
};

const resolveMk1NamedList = (input: {
  list: unknown;
  slice?: unknown;
}): AppResult<Mk1ResolvedNamedList> => {
  const list = Mk1NamedListSchema.safeParse(input.list);

  if (!list.success) {
    return err(
      appError(
        "mk1.business.invalid_named_list",
        "MK1 named list is malformed.",
        zodMessages(list.error.issues, "mk1.business.invalid_named_list"),
        list.error,
      ),
    );
  }

  const slice = parseSliceOrEmpty(input.slice);

  if (!slice.ok) {
    return slice;
  }

  const items = [];
  const messages: ValidationMessage[] = [];

  for (const item of list.data.items) {
    const lookup = lookupMk1BusinessCombo({
      ref: item.ref,
      slice: slice.value,
    });

    if (!lookup.ok) {
      return lookup;
    }

    messages.push(...lookup.value.messages);

    if (lookup.value.status === "found") {
      items.push({
        status: "found",
        item,
        detail: lookup.value.detail,
        messages: lookup.value.messages,
      });
      continue;
    }

    items.push({
      status: "unresolved",
      item,
      reason: lookup.value.reason,
      messages: lookup.value.messages,
    });
  }

  return ok(
    Mk1ResolvedNamedListSchema.parse({
      list: list.data,
      items,
      messages,
    }),
  );
};

const resolveMk1NamedLists = (sliceInput: unknown): AppResult<readonly Mk1ResolvedNamedList[]> => {
  const slice = parseMk1BusinessSlice(sliceInput);

  if (!slice.ok) {
    return slice;
  }

  const resolvedLists: Mk1ResolvedNamedList[] = [];

  for (const list of slice.value.namedLists) {
    const resolved = resolveMk1NamedList({
      list,
      slice: slice.value,
    });

    if (!resolved.ok) {
      return resolved;
    }

    resolvedLists.push(resolved.value);
  }

  return ok(resolvedLists);
};

const validateMk1BusinessSlice = (input: unknown): AppResult<Mk1BusinessValidationReport> => {
  const parsed = parseMk1BusinessSlice(input);

  if (!parsed.ok) {
    return parsed;
  }

  const messages: ValidationMessage[] = [];

  for (const combo of parsed.value.customCombos) {
    const lookup = foundCustomDetail(combo);

    messages.push(...lookup.messages);
  }

  const resolvedLists = resolveMk1NamedLists(parsed.value);

  if (!resolvedLists.ok) {
    return resolvedLists;
  }

  for (const resolvedList of resolvedLists.value) {
    messages.push(...resolvedList.messages);
  }

  return ok(
    Mk1BusinessValidationReportSchema.parse({
      slice: parsed.value,
      messages,
    }),
  );
};

const serializeMk1BusinessSlice = (input: unknown): AppResult<Mk1BusinessSlice> =>
  parseMk1BusinessSlice(input);

const routeRef = (refInput: unknown): AppResult<Mk1BusinessComboRef> => parseComboRef(refInput);

const mk1BusinessRoutes = {
  catalog: () => "/mk1/catalog",
  comboDetail: (refInput: unknown): AppResult<string> => {
    const ref = routeRef(refInput);

    if (!ref.ok) {
      return ref;
    }

    return ok(`/mk1/combos/${ref.value.source}/${ref.value.comboId}`);
  },
  lists: () => "/mk1/lists",
  builder: () => "/mk1/builder",
} as const;

const mk1BusinessCatalog = {
  parseRouteQuery: (query: Mk1CatalogPlainRouteQuery) => parseMk1CatalogRouteQuery(query),
  serializeRouteQuery: serializeMk1CatalogRouteQuery,
  recoverContext: recoverMk1CatalogContext,
  recoverFilters: recoverMk1CatalogFilters,
  getContextOptions: getMk1CatalogContextOptions,
  selectCharacter: selectMk1CatalogCharacter,
  selectKameo: selectMk1CatalogKameo,
  getFilterFacets: getMk1CatalogFilterFacets,
  selectSeededSummaries: (input: { context: unknown; filters?: Mk1CatalogFilters }) =>
    selectMk1CatalogComboSummaries({
      context: Mk1CatalogContextSchema.parse(input.context),
      filters: input.filters,
    }),
  getSeededSummary: (comboId: ComboId) => getMk1CatalogComboSummary(comboId),
} as const;

const mk1BusinessDetail = {
  lookup: lookupMk1BusinessCombo,
  summarizeCustomCombo: summarizeMk1CustomCombo,
} as const;

const mk1BusinessLists = {
  resolveList: resolveMk1NamedList,
  resolveLists: resolveMk1NamedLists,
} as const;

const mk1BusinessBuilder = {
  composeGraph: composeMk1BuilderGraph,
  getValidNextMoves: getMk1BuilderValidNextMoves,
  attemptTransition: attemptMk1BuilderTransition,
  createMovePath: createMk1BuilderMovePath,
  replayPath: replayMk1BuilderPath,
  getComboState: getMk1BuilderComboState,
  createInitialRuntime: createMk1BuilderInitialRuntime,
  deriveCachedNotation: deriveMk1CachedNotation,
  createState: createMk1BusinessBuilderState,
} as const;

const mk1BusinessBackup = {
  createEmptySlice: createEmptyMk1BusinessSlice,
  parseSlice: parseMk1BusinessSlice,
  serializeSlice: serializeMk1BusinessSlice,
  validateSlice: validateMk1BusinessSlice,
} as const;

const mk1BusinessValidation = {
  parseSlice: parseMk1BusinessSlice,
  validateSlice: validateMk1BusinessSlice,
  lookupCombo: lookupMk1BusinessCombo,
  resolveList: resolveMk1NamedList,
} as const;

export const mk1Business = {
  id: "mk1",
  label: "MK1",
  game: mk1Game,
  routes: mk1BusinessRoutes,
  catalog: mk1BusinessCatalog,
  detail: mk1BusinessDetail,
  lists: mk1BusinessLists,
  builder: mk1BusinessBuilder,
  backup: mk1BusinessBackup,
  validation: mk1BusinessValidation,
} as const;
