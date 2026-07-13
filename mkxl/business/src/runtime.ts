import { BuilderRuntimeSnapshotSchema } from "@mk-combos/builder-core/runtime/schema";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import { builderComboStateStatuses } from "@mk-combos/builder-core/stale/value";
import type { ComboId } from "@mk-combos/contracts/identity/type";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { err, ok } from "@mk-combos/contracts/result/runtime";
import type { AppError, AppResult, ValidationMessage } from "@mk-combos/contracts/result/type";
import type { LocalizedText } from "@mk-combos/contracts/settings/type";
import {
  composeMkxlBuilderGraph,
  getMkxlBuilderValidNextMoves,
} from "@mk-combos/mkxl-builder/graph/runtime";
import {
  attemptMkxlBuilderTransition,
  createMkxlBuilderMovePath,
  replayMkxlBuilderPath,
} from "@mk-combos/mkxl-builder/replay/runtime";
import {
  createMkxlBuilderInitialRuntime,
  getMkxlBuilderComboState,
} from "@mk-combos/mkxl-builder/state/runtime";
import {
  getMkxlCatalogContextOptions,
  parseMkxlCatalogRouteQuery,
  recoverMkxlCatalogContext,
  selectMkxlCatalogCharacter,
  selectMkxlCatalogVariation,
  serializeMkxlCatalogRouteQuery,
} from "@mk-combos/mkxl-catalog/context/runtime";
import { MkxlCatalogContextSchema } from "@mk-combos/mkxl-catalog/context/schema";
import type { MkxlCatalogPlainRouteQuery } from "@mk-combos/mkxl-catalog/context/type";
import { recoverMkxlCatalogFilters } from "@mk-combos/mkxl-catalog/filters/runtime";
import type { MkxlCatalogFilters } from "@mk-combos/mkxl-catalog/filters/type";
import {
  getMkxlCatalogComboSummary,
  getMkxlCatalogFilterFacets,
  selectMkxlCatalogComboSummaries,
} from "@mk-combos/mkxl-catalog/selectors/runtime";
import type { MkxlCatalogComboSummary } from "@mk-combos/mkxl-catalog/summary/type";
import type { MkxlComboStageContext } from "@mk-combos/mkxl-data/combos/type";
import { mkxlGame } from "@mk-combos/mkxl-data/game/value";
import { mkxlMoves } from "@mk-combos/mkxl-data/movelists/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import { mkxlVariations } from "@mk-combos/mkxl-data/variations/value";
import { z } from "zod/v4";

import {
  MkxlBusinessBuilderStateSchema,
  MkxlBusinessComboLookupSchema,
  MkxlBusinessComboRefSchema,
  MkxlBusinessCustomComboSummarySchema,
  MkxlBusinessSliceSchema,
  MkxlBusinessValidationReportSchema,
  MkxlNamedListSchema,
  MkxlResolvedNamedListSchema,
} from "./schema";
import type {
  MkxlBusinessBuilderContext,
  MkxlBusinessBuilderState,
  MkxlBusinessComboLookup,
  MkxlBusinessComboRef,
  MkxlBusinessCustomCombo,
  MkxlBusinessCustomComboSummary,
  MkxlBusinessSlice,
  MkxlBusinessValidationReport,
  MkxlResolvedNamedList,
} from "./type";

type ZodIssueLike = {
  message: string;
  path: readonly PropertyKey[];
};

const MoveIdListSchema = z.array(z.string().min(1)).readonly();

const charactersById = new Map<string, (typeof mkxlCharacters)[number]>();

for (const character of mkxlCharacters) {
  charactersById.set(character.id, character);
}

const variationsById = new Map<string, (typeof mkxlVariations)[number]>();

for (const variation of mkxlVariations) {
  variationsById.set(variation.id, variation);
}

const movesById = new Map<string, (typeof mkxlMoves)[number]>();

for (const move of mkxlMoves) {
  movesById.set(move.id, move);
}

const stagesById = new Map<string, (typeof mkxlStages)[number]>();

const interactablesById = new Map<string, (typeof mkxlStages)[number]["interactables"][number]>();

for (const stage of mkxlStages) {
  stagesById.set(stage.id, stage);

  for (const interactable of stage.interactables) {
    interactablesById.set(interactable.id, interactable);
  }
}

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

const parseComboRef = (input: unknown): AppResult<MkxlBusinessComboRef> => {
  const parsed = MkxlBusinessComboRefSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(
    appError(
      "mkxl.business.invalid_combo_ref",
      "MKXL combo reference is malformed.",
      zodMessages(parsed.error.issues, "mkxl.business.invalid_combo_ref"),
      parsed.error,
    ),
  );
};

const createEmptyMkxlBusinessSlice = (): MkxlBusinessSlice =>
  MkxlBusinessSliceSchema.parse({
    version: 1,
    customCombos: [],
    namedLists: [],
  });

const parseMkxlBusinessSlice = (input: unknown): AppResult<MkxlBusinessSlice> => {
  const parsed = MkxlBusinessSliceSchema.safeParse(input);

  if (parsed.success) {
    return ok(parsed.data);
  }

  return err(
    appError(
      "mkxl.business.invalid_slice",
      "MKXL business slice is malformed.",
      zodMessages(parsed.error.issues, "mkxl.business.invalid_slice"),
      parsed.error,
    ),
  );
};

const parseSliceOrEmpty = (input: unknown | undefined): AppResult<MkxlBusinessSlice> =>
  input === undefined ? ok(createEmptyMkxlBusinessSlice()) : parseMkxlBusinessSlice(input);

const customCombosById = (slice: MkxlBusinessSlice): ReadonlyMap<string, MkxlBusinessCustomCombo> =>
  new Map(slice.customCombos.map((combo) => [combo.id, combo]));

const contextFromStageContext = (input: {
  characterId: string;
  variationId: string;
  stageContext: MkxlComboStageContext;
}): MkxlBusinessBuilderContext => {
  const context = {
    characterId: input.characterId,
    variationId: input.variationId,
    stageId: input.stageContext.kind === "stageSpecific" ? input.stageContext.stageId : undefined,
  };

  return context.stageId
    ? {
        characterId: context.characterId,
        variationId: context.variationId,
        stageId: context.stageId,
      }
    : {
        characterId: context.characterId,
        variationId: context.variationId,
      };
};

const contextFromSeededSummary = (summary: MkxlCatalogComboSummary): MkxlBusinessBuilderContext =>
  contextFromStageContext({
    characterId: summary.character.id,
    variationId: summary.variation.id,
    stageContext: summary.stageContext,
  });

const stateFromMoveIds = (input: {
  context: MkxlBusinessBuilderContext;
  movePath: readonly string[];
  runtime?: BuilderRuntimeSnapshot;
}) =>
  getMkxlBuilderComboState({
    context: input.context,
    path: createMkxlBuilderMovePath(input.movePath),
    initialRuntime: input.runtime,
  });

const customTitle = (combo: MkxlBusinessCustomCombo): LocalizedText =>
  combo.title ?? toLocalizedFallback(`Custom combo ${combo.id}`);

const entityLabel = (id: string, label: LocalizedText) => ({
  id,
  label,
});

const summarizeMkxlCustomCombo = (
  combo: MkxlBusinessCustomCombo,
): MkxlBusinessCustomComboSummary => {
  const character = charactersById.get(combo.characterId);
  const variation = variationsById.get(combo.variationId);
  const stage =
    combo.stageContext.kind === "stageSpecific"
      ? stagesById.get(combo.stageContext.stageId)
      : undefined;
  const interactables =
    combo.stageContext.kind === "stageSpecific"
      ? combo.stageContext.interactableIds.flatMap((interactableId) => {
          const interactable = interactablesById.get(interactableId);

          return interactable ? [entityLabel(interactable.id, interactable.label)] : [];
        })
      : [];
  const context = contextFromStageContext({
    characterId: combo.characterId,
    variationId: combo.variationId,
    stageContext: combo.stageContext,
  });

  return MkxlBusinessCustomComboSummarySchema.parse({
    ref: {
      gameId: "mkxl",
      source: comboSources.custom,
      comboId: combo.id,
    },
    gameId: "mkxl",
    source: comboSources.custom,
    title: customTitle(combo),
    character: {
      ...entityLabel(
        character?.id ?? combo.characterId,
        character?.label ?? toLocalizedFallback(combo.characterId),
      ),
      shortLabel: character?.shortLabel,
    },
    variation: {
      ...entityLabel(
        variation?.id ?? combo.variationId,
        variation?.label ?? toLocalizedFallback(combo.variationId),
      ),
      characterId: variation?.characterId ?? combo.characterId,
    },
    stageContext: combo.stageContext,
    stage: stage ? entityLabel(stage.id, stage.label) : undefined,
    interactables,
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

const foundSeededDetail = (summary: MkxlCatalogComboSummary): MkxlBusinessComboLookup => {
  const context = contextFromSeededSummary(summary);
  const comboState = stateFromMoveIds({
    context,
    movePath: summary.movePath,
  });
  const detail = {
    source: comboSources.seeded,
    ref: {
      gameId: "mkxl",
      source: comboSources.seeded,
      comboId: summary.ref.comboId,
    },
    summary,
    comboState,
  };
  const messages =
    comboState.status === builderComboStateStatuses.fresh
      ? []
      : [
          message(
            "warning",
            "mkxl.business.seeded_combo_stale",
            "Seeded MKXL combo does not replay cleanly against current builder data.",
            ["comboId"],
          ),
        ];

  return MkxlBusinessComboLookupSchema.parse({
    status: "found",
    detail,
    messages,
  });
};

const foundCustomDetail = (combo: MkxlBusinessCustomCombo): MkxlBusinessComboLookup => {
  const summary = summarizeMkxlCustomCombo(combo);
  const messages =
    summary.comboState.status === builderComboStateStatuses.fresh
      ? []
      : [
          message(
            "warning",
            "mkxl.business.custom_combo_stale",
            "Custom MKXL combo does not replay cleanly against current builder data.",
            ["customCombos", combo.id],
          ),
        ];

  return MkxlBusinessComboLookupSchema.parse({
    status: "found",
    detail: {
      source: comboSources.custom,
      ref: summary.ref,
      combo,
      summary,
    },
    messages,
  });
};

const notFoundLookup = (ref: MkxlBusinessComboRef): MkxlBusinessComboLookup => {
  const reason = message(
    "warning",
    "mkxl.business.combo_not_found",
    "MKXL combo reference could not be resolved.",
    ["comboId"],
  );

  return MkxlBusinessComboLookupSchema.parse({
    status: "notFound",
    ref,
    reason,
    messages: [reason],
  });
};

const lookupMkxlBusinessCombo = (input: {
  ref: unknown;
  slice?: unknown;
}): AppResult<MkxlBusinessComboLookup> => {
  const ref = parseComboRef(input.ref);

  if (!ref.ok) {
    return ref;
  }

  if (ref.value.source === comboSources.seeded) {
    const summary = getMkxlCatalogComboSummary(ref.value.comboId);

    return ok(summary ? foundSeededDetail(summary) : notFoundLookup(ref.value));
  }

  const slice = parseSliceOrEmpty(input.slice);

  if (!slice.ok) {
    return slice;
  }

  const combo = customCombosById(slice.value).get(ref.value.comboId);

  return ok(combo ? foundCustomDetail(combo) : notFoundLookup(ref.value));
};

const deriveMkxlCachedNotation = (
  movePath: readonly string[],
): AppResult<MkxlBusinessCustomCombo["cachedNotation"]> => {
  const parsedMovePath = MoveIdListSchema.safeParse(movePath);

  if (!parsedMovePath.success || parsedMovePath.data.length === 0) {
    return err(
      appError(
        "mkxl.business.invalid_move_path",
        "MKXL move path must contain at least one move id.",
        parsedMovePath.success
          ? [
              message(
                "error",
                "mkxl.business.invalid_move_path",
                "MKXL move path must contain at least one move id.",
                ["movePath"],
              ),
            ]
          : zodMessages(parsedMovePath.error.issues, "mkxl.business.invalid_move_path"),
        parsedMovePath.success ? undefined : parsedMovePath.error,
      ),
    );
  }

  const cachedNotation: (typeof mkxlMoves)[number]["notation"][] = [];

  for (const [index, moveId] of parsedMovePath.data.entries()) {
    const move = movesById.get(moveId);

    if (!move) {
      return err(
        appError("mkxl.business.unknown_move", "MKXL move path references an unknown move.", [
          message(
            "error",
            "mkxl.business.unknown_move",
            "MKXL move path references an unknown move.",
            ["movePath", String(index)],
          ),
        ]),
      );
    }

    cachedNotation.push(move.notation);
  }

  return ok(cachedNotation);
};

const createMkxlBusinessBuilderState = (input: {
  context: unknown;
  movePath?: readonly string[];
  runtime?: unknown;
}): AppResult<MkxlBusinessBuilderState> => {
  const context = MkxlBusinessBuilderStateSchema.shape.context.safeParse(input.context);

  if (!context.success) {
    return err(
      appError(
        "mkxl.business.invalid_builder_context",
        "MKXL builder context is malformed.",
        zodMessages(context.error.issues, "mkxl.business.invalid_builder_context"),
        context.error,
      ),
    );
  }

  const movePath = MoveIdListSchema.safeParse(input.movePath ?? []);

  if (!movePath.success) {
    return err(
      appError(
        "mkxl.business.invalid_move_path",
        "MKXL builder move path is malformed.",
        zodMessages(movePath.error.issues, "mkxl.business.invalid_move_path"),
        movePath.error,
      ),
    );
  }

  const runtime =
    input.runtime === undefined ? undefined : BuilderRuntimeSnapshotSchema.safeParse(input.runtime);

  if (runtime && !runtime.success) {
    return err(
      appError(
        "mkxl.business.invalid_runtime",
        "MKXL builder runtime snapshot is malformed.",
        zodMessages(runtime.error.issues, "mkxl.business.invalid_runtime"),
        runtime.error,
      ),
    );
  }

  const builderPath = createMkxlBuilderMovePath(movePath.data);
  const cachedNotation =
    movePath.data.length > 0 ? deriveMkxlCachedNotation(movePath.data) : ok([]);

  if (!cachedNotation.ok) {
    return cachedNotation;
  }

  return ok(
    MkxlBusinessBuilderStateSchema.parse({
      context: context.data,
      movePath: movePath.data,
      builderPath,
      cachedNotation: cachedNotation.value,
      comboState: getMkxlBuilderComboState({
        context: context.data,
        path: builderPath,
        initialRuntime: runtime?.data,
      }),
      runtime: runtime?.data,
      validNextMoves: getMkxlBuilderValidNextMoves({
        context: context.data,
        runtime: runtime?.data,
      }),
    }),
  );
};

const resolveMkxlNamedList = (input: {
  list: unknown;
  slice?: unknown;
}): AppResult<MkxlResolvedNamedList> => {
  const list = MkxlNamedListSchema.safeParse(input.list);

  if (!list.success) {
    return err(
      appError(
        "mkxl.business.invalid_named_list",
        "MKXL named list is malformed.",
        zodMessages(list.error.issues, "mkxl.business.invalid_named_list"),
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
    const lookup = lookupMkxlBusinessCombo({
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
    MkxlResolvedNamedListSchema.parse({
      list: list.data,
      items,
      messages,
    }),
  );
};

const resolveMkxlNamedLists = (
  sliceInput: unknown,
): AppResult<readonly MkxlResolvedNamedList[]> => {
  const slice = parseMkxlBusinessSlice(sliceInput);

  if (!slice.ok) {
    return slice;
  }

  const resolvedLists: MkxlResolvedNamedList[] = [];

  for (const list of slice.value.namedLists) {
    const resolved = resolveMkxlNamedList({
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

const validateMkxlBusinessSlice = (input: unknown): AppResult<MkxlBusinessValidationReport> => {
  const parsed = parseMkxlBusinessSlice(input);

  if (!parsed.ok) {
    return parsed;
  }

  const messages: ValidationMessage[] = [];

  for (const combo of parsed.value.customCombos) {
    const lookup = foundCustomDetail(combo);

    messages.push(...lookup.messages);
  }

  const resolvedLists = resolveMkxlNamedLists(parsed.value);

  if (!resolvedLists.ok) {
    return resolvedLists;
  }

  for (const resolvedList of resolvedLists.value) {
    messages.push(...resolvedList.messages);
  }

  return ok(
    MkxlBusinessValidationReportSchema.parse({
      slice: parsed.value,
      messages,
    }),
  );
};

const serializeMkxlBusinessSlice = (input: unknown): AppResult<MkxlBusinessSlice> =>
  parseMkxlBusinessSlice(input);

const routeRef = (ref: unknown): AppResult<MkxlBusinessComboRef> => parseComboRef(ref);

const mkxlBusinessRoutes = {
  catalog: () => "/mkxl/catalog",
  comboDetail: (refInput: unknown): AppResult<string> => {
    const ref = routeRef(refInput);

    if (!ref.ok) {
      return ref;
    }

    return ok(`/mkxl/combos/${ref.value.source}/${ref.value.comboId}`);
  },
  lists: () => "/mkxl/lists",
  builder: () => "/mkxl/builder",
} as const;

const mkxlBusinessCatalog = {
  parseRouteQuery: (query: MkxlCatalogPlainRouteQuery) => parseMkxlCatalogRouteQuery(query),
  serializeRouteQuery: serializeMkxlCatalogRouteQuery,
  recoverContext: recoverMkxlCatalogContext,
  recoverFilters: recoverMkxlCatalogFilters,
  getContextOptions: getMkxlCatalogContextOptions,
  selectCharacter: selectMkxlCatalogCharacter,
  selectVariation: selectMkxlCatalogVariation,
  getFilterFacets: getMkxlCatalogFilterFacets,
  selectSeededSummaries: (input: { context: unknown; filters?: MkxlCatalogFilters }) =>
    selectMkxlCatalogComboSummaries({
      context: MkxlCatalogContextSchema.parse(input.context),
      filters: input.filters,
    }),
  getSeededSummary: (comboId: ComboId) => getMkxlCatalogComboSummary(comboId),
} as const;

const mkxlBusinessDetail = {
  lookup: lookupMkxlBusinessCombo,
  summarizeCustomCombo: summarizeMkxlCustomCombo,
} as const;

const mkxlBusinessLists = {
  resolveList: resolveMkxlNamedList,
  resolveLists: resolveMkxlNamedLists,
} as const;

const mkxlBusinessBuilder = {
  composeGraph: composeMkxlBuilderGraph,
  getValidNextMoves: getMkxlBuilderValidNextMoves,
  attemptTransition: attemptMkxlBuilderTransition,
  createMovePath: createMkxlBuilderMovePath,
  replayPath: replayMkxlBuilderPath,
  getComboState: getMkxlBuilderComboState,
  createInitialRuntime: createMkxlBuilderInitialRuntime,
  deriveCachedNotation: deriveMkxlCachedNotation,
  createState: createMkxlBusinessBuilderState,
} as const;

const mkxlBusinessBackup = {
  createEmptySlice: createEmptyMkxlBusinessSlice,
  parseSlice: parseMkxlBusinessSlice,
  serializeSlice: serializeMkxlBusinessSlice,
  validateSlice: validateMkxlBusinessSlice,
} as const;

const mkxlBusinessValidation = {
  parseSlice: parseMkxlBusinessSlice,
  validateSlice: validateMkxlBusinessSlice,
  lookupCombo: lookupMkxlBusinessCombo,
  resolveList: resolveMkxlNamedList,
} as const;

export const mkxlBusiness = {
  id: "mkxl",
  label: "MKXL",
  game: mkxlGame,
  routes: mkxlBusinessRoutes,
  catalog: mkxlBusinessCatalog,
  detail: mkxlBusinessDetail,
  lists: mkxlBusinessLists,
  builder: mkxlBusinessBuilder,
  backup: mkxlBusinessBackup,
  validation: mkxlBusinessValidation,
} as const;
