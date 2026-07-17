import { CatalogFilterChangeSchema } from "@mk-combos/contracts/catalog-filter/schema";
import type { CatalogFilterChange } from "@mk-combos/contracts/catalog-filter/type";
import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import { validationSeverities } from "@mk-combos/contracts/result/value";
import type { LocalizedText } from "@mk-combos/contracts/settings/type";
import type { MkxlSeededCombo } from "@mk-combos/mkxl-data/combos/type";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";

import {
  MkxlCatalogFilterIdSchema,
  MkxlCatalogFilterQuerySchema,
  MkxlCatalogFiltersSchema,
  MkxlCatalogPlainFilterQuerySchema,
} from "./schema";
import type {
  MkxlCatalogFilterFacet,
  MkxlCatalogFilterOption,
  MkxlCatalogFilterQuery,
  MkxlCatalogFilters,
  MkxlCatalogMultiSelectFilterId,
  MkxlCatalogSource,
} from "./type";
import {
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogSingleSelectFilterIds,
  mkxlCatalogSources,
} from "./value";

const emptyMkxlCatalogFilters = {} as const satisfies MkxlCatalogFilters;

type FilterRecovery = {
  readonly filters: MkxlCatalogFilters;
  readonly messages: readonly ValidationMessage[];
};

const stageById = new Map(mkxlStages.map((stage) => [stage.id, stage]));
const interactableStageById = new Map<string, string>();
for (const stage of mkxlStages) {
  for (const interactable of stage.interactables) {
    interactableStageById.set(interactable.id, stage.id);
  }
}

const toMessage = (code: string, message: string, path: readonly string[]): ValidationMessage => ({
  severity: validationSeverities.warning,
  code,
  message,
  path,
});

const toList = (value: string | readonly string[] | undefined): readonly string[] =>
  value === undefined ? [] : typeof value === "string" ? [value] : value;

const presentUnique = (value: string | readonly string[] | undefined): readonly string[] => {
  const values: string[] = [];
  const seen = new Set<string>();
  for (const entry of toList(value)) {
    const trimmed = entry.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      values.push(trimmed);
    }
  }
  return values;
};

const firstPresent = (value: string | readonly string[] | undefined): string | undefined =>
  presentUnique(value)[0];

const parseNumbers = (
  value: string | readonly string[] | undefined,
  path: string,
  messages: ValidationMessage[],
): readonly number[] => {
  const numbers: number[] = [];
  for (const entry of presentUnique(value)) {
    if (!/^\d+$/u.test(entry)) {
      messages.push(
        toMessage("mkxl.catalog.invalid_filter", `${path} must be an integer.`, [path]),
      );
      continue;
    }
    numbers.push(Number(entry));
  }
  return numbers;
};

const recoverCanonicalFilters = (filters: MkxlCatalogFilters): FilterRecovery => {
  const messages: ValidationMessage[] = [];
  let stageId = filters.stageId;
  let interactableIds = filters.interactableIds;
  let sources = filters.sources;

  if (stageId && !stageById.has(stageId)) {
    messages.push(
      toMessage("mkxl.catalog.invalid_stage", "Stage does not exist in MKXL data.", ["stage"]),
    );
    stageId = undefined;
  }

  if (interactableIds && !stageId) {
    messages.push(
      toMessage(
        "mkxl.catalog.interactable_requires_stage",
        "Select a stage before selecting an interactable.",
        ["interactable"],
      ),
    );
    interactableIds = undefined;
  } else if (interactableIds && stageId) {
    const compatible = interactableIds.filter(
      (interactableId) => interactableStageById.get(interactableId) === stageId,
    );
    if (compatible.length !== interactableIds.length) {
      messages.push(
        toMessage(
          "mkxl.catalog.incompatible_interactable",
          "Interactable does not belong to the selected stage.",
          ["interactable"],
        ),
      );
    }
    interactableIds = compatible.length > 0 ? compatible : undefined;
  }

  if (sources?.includes(mkxlCatalogSources.personal)) {
    messages.push(
      toMessage(
        "mkxl.catalog.personal_source_unavailable",
        "Personal combos are not available in the catalog yet.",
        [mkxlCatalogMultiSelectFilterIds.source],
      ),
    );
    const availableSources = sources.filter((source) => source !== mkxlCatalogSources.personal);
    sources = availableSources.length > 0 ? availableSources : undefined;
  }

  return {
    filters: MkxlCatalogFiltersSchema.parse({
      ...filters,
      stageId,
      interactableIds,
      sources,
    }),
    messages,
  };
};

export const recoverMkxlCatalogFilters = (input: unknown = {}): FilterRecovery => {
  const parsed = MkxlCatalogFiltersSchema.safeParse(input);
  if (!parsed.success) {
    return {
      filters: emptyMkxlCatalogFilters,
      messages: parsed.error.issues.map((issue) =>
        toMessage(
          "mkxl.catalog.invalid_filters",
          issue.message,
          issue.path.map((segment) => String(segment)),
        ),
      ),
    };
  }
  return recoverCanonicalFilters(parsed.data);
};

export const parseMkxlCatalogFilterQuery = (input: unknown): FilterRecovery => {
  const query = MkxlCatalogPlainFilterQuerySchema.safeParse(input);
  if (!query.success) {
    return {
      filters: emptyMkxlCatalogFilters,
      messages: query.error.issues.map((issue) =>
        toMessage(
          "mkxl.catalog.invalid_filter_query",
          issue.message,
          issue.path.map((segment) => String(segment)),
        ),
      ),
    };
  }

  const messages: ValidationMessage[] = [];
  const positions = presentUnique(query.data.position);
  const meter = parseNumbers(query.data.meter, "meter", messages);
  const difficulties = presentUnique(query.data.difficulty);
  const routeClasses = presentUnique(query.data.routeClass);
  const sources = presentUnique(query.data.source);
  const interactableIds = presentUnique(query.data.interactable);
  const stageId = firstPresent(query.data.stage);
  const candidate = {
    ...(positions.length > 0 ? { positions } : {}),
    ...(meter.length > 0 ? { meter } : {}),
    ...(difficulties.length > 0 ? { difficulties } : {}),
    ...(routeClasses.length > 0 ? { routeClasses } : {}),
    ...(sources.length > 0 ? { sources } : {}),
    ...(interactableIds.length > 0 ? { interactableIds } : {}),
    ...(stageId ? { stageId } : {}),
  };
  const recovered = recoverMkxlCatalogFilters(candidate);
  return { filters: recovered.filters, messages: [...messages, ...recovered.messages] };
};

export const serializeMkxlCatalogFilterQuery = (
  filters: MkxlCatalogFilters = {},
): MkxlCatalogFilterQuery => {
  const recovered = recoverMkxlCatalogFilters(filters).filters;
  return MkxlCatalogFilterQuerySchema.parse({
    position: recovered.positions,
    meter: recovered.meter?.map(String),
    difficulty: recovered.difficulties,
    routeClass: recovered.routeClasses,
    source: recovered.sources,
    stage: recovered.stageId,
    interactable: recovered.interactableIds,
  });
};

const setMkxlCatalogStageFilter = (
  filters: MkxlCatalogFilters,
  stageId: string | undefined,
): FilterRecovery => recoverMkxlCatalogFilters({ ...filters, stageId, interactableIds: undefined });

const toggleDesiredValue = <T>(
  values: readonly T[] | undefined,
  value: T,
  selected: boolean,
): readonly T[] | undefined => {
  const current = values ?? [];
  const next = selected
    ? current.includes(value)
      ? current
      : [...current, value]
    : current.filter((entry) => entry !== value);
  return next.length > 0 ? next : undefined;
};

const invalidChange = (
  filters: MkxlCatalogFilters,
  filterId: string | undefined,
  message: string,
): FilterRecovery => ({
  filters,
  messages: [
    toMessage("mkxl.catalog.invalid_filter_change", message, filterId ? [filterId] : ["filters"]),
  ],
});

const clearFacet = (filters: MkxlCatalogFilters, filterId: string): FilterRecovery => {
  const parsed = MkxlCatalogFilterIdSchema.safeParse(filterId);
  if (!parsed.success) {
    return invalidChange(filters, filterId, "MKXL catalog filter does not exist.");
  }
  switch (parsed.data) {
    case mkxlCatalogMultiSelectFilterIds.position:
      return { filters: { ...filters, positions: undefined }, messages: [] };
    case mkxlCatalogMultiSelectFilterIds.meter:
      return { filters: { ...filters, meter: undefined }, messages: [] };
    case mkxlCatalogMultiSelectFilterIds.difficulty:
      return { filters: { ...filters, difficulties: undefined }, messages: [] };
    case mkxlCatalogMultiSelectFilterIds.routeClass:
      return { filters: { ...filters, routeClasses: undefined }, messages: [] };
    case mkxlCatalogMultiSelectFilterIds.source:
      return { filters: { ...filters, sources: undefined }, messages: [] };
    case mkxlCatalogSingleSelectFilterIds.stage:
      return setMkxlCatalogStageFilter(filters, undefined);
    case mkxlCatalogMultiSelectFilterIds.interactable:
      return { filters: { ...filters, interactableIds: undefined }, messages: [] };
  }
};

const toggleOption = (
  filters: MkxlCatalogFilters,
  change: Extract<CatalogFilterChange, { kind: typeof catalogFilterChangeKinds.toggleOption }>,
): FilterRecovery => {
  const filterId = MkxlCatalogFilterIdSchema.safeParse(change.filterId);
  if (!filterId.success) {
    return invalidChange(filters, change.filterId, "MKXL catalog option filter does not exist.");
  }

  let candidate: unknown;
  switch (filterId.data) {
    case mkxlCatalogMultiSelectFilterIds.position:
      candidate = {
        ...filters,
        positions: toggleDesiredValue(filters.positions, change.value, change.selected),
      };
      break;
    case mkxlCatalogMultiSelectFilterIds.meter:
      if (!/^\d+$/u.test(change.value)) {
        return invalidChange(filters, change.filterId, "Meter must be a non-negative integer.");
      }
      candidate = {
        ...filters,
        meter: toggleDesiredValue(filters.meter, Number(change.value), change.selected),
      };
      break;
    case mkxlCatalogMultiSelectFilterIds.difficulty:
      candidate = {
        ...filters,
        difficulties: toggleDesiredValue(filters.difficulties, change.value, change.selected),
      };
      break;
    case mkxlCatalogMultiSelectFilterIds.routeClass:
      candidate = {
        ...filters,
        routeClasses: toggleDesiredValue(filters.routeClasses, change.value, change.selected),
      };
      break;
    case mkxlCatalogMultiSelectFilterIds.source:
      if (change.selected && change.value === mkxlCatalogSources.personal) {
        return invalidChange(filters, change.filterId, "Personal combos are not available yet.");
      }
      candidate = {
        ...filters,
        sources: toggleDesiredValue(filters.sources, change.value, change.selected),
      };
      break;
    case mkxlCatalogSingleSelectFilterIds.stage: {
      if (!stageById.has(change.value)) {
        return invalidChange(filters, change.filterId, "MKXL stage does not exist.");
      }
      const stageId = change.selected
        ? change.value
        : filters.stageId === change.value
          ? undefined
          : filters.stageId;
      return setMkxlCatalogStageFilter(filters, stageId);
    }
    case mkxlCatalogMultiSelectFilterIds.interactable:
      if (!filters.stageId) {
        return invalidChange(filters, change.filterId, "Select a stage first.");
      }
      if (interactableStageById.get(change.value) !== filters.stageId) {
        return invalidChange(
          filters,
          change.filterId,
          "Interactable does not belong to the selected stage.",
        );
      }
      candidate = {
        ...filters,
        interactableIds: toggleDesiredValue(filters.interactableIds, change.value, change.selected),
      };
      break;
  }

  const parsed = MkxlCatalogFiltersSchema.safeParse(candidate);
  return parsed.success
    ? recoverCanonicalFilters(parsed.data)
    : invalidChange(filters, change.filterId, parsed.error.issues[0]?.message ?? "Invalid option.");
};

export const applyMkxlCatalogFilterChange = (
  input: unknown,
  change: CatalogFilterChange,
): FilterRecovery => {
  const recovered = recoverMkxlCatalogFilters(input);
  const parsedChange = CatalogFilterChangeSchema.safeParse(change);
  if (!parsedChange.success) {
    return {
      filters: recovered.filters,
      messages: [
        ...recovered.messages,
        ...invalidChange(recovered.filters, undefined, "Catalog filter change is invalid.")
          .messages,
      ],
    };
  }

  const changed = (() => {
    switch (parsedChange.data.kind) {
      case catalogFilterChangeKinds.clearAll:
        return { filters: emptyMkxlCatalogFilters, messages: [] } satisfies FilterRecovery;
      case catalogFilterChangeKinds.clearFacet:
        return clearFacet(recovered.filters, parsedChange.data.filterId);
      case catalogFilterChangeKinds.toggleOption:
        return toggleOption(recovered.filters, parsedChange.data);
    }
  })();

  return { filters: changed.filters, messages: [...recovered.messages, ...changed.messages] };
};

export const getMkxlCatalogComboSource = (combo: MkxlSeededCombo): MkxlCatalogSource =>
  combo.sourceIds.includes("community-combo-source")
    ? mkxlCatalogSources.community
    : mkxlCatalogSources.curated;

const createStringSet = (values: readonly string[] | undefined): ReadonlySet<string> | undefined =>
  values ? new Set(values) : undefined;
const createNumberSet = (values: readonly number[] | undefined): ReadonlySet<number> | undefined =>
  values ? new Set(values) : undefined;

export const comboMatchesMkxlCatalogFilters = (
  combo: MkxlSeededCombo,
  filters: MkxlCatalogFilters = {},
): boolean => {
  const recovered = recoverMkxlCatalogFilters(filters).filters;
  const positions = createStringSet(recovered.positions);
  const meter = createNumberSet(recovered.meter);
  const difficulties = createStringSet(recovered.difficulties);
  const routeClasses = createStringSet(recovered.routeClasses);
  const sources = createStringSet(recovered.sources);

  if (positions && !positions.has(combo.metadata.position)) return false;
  if (meter && !meter.has(combo.metadata.meter)) return false;
  if (difficulties && !difficulties.has(combo.metadata.difficulty)) return false;
  if (routeClasses && !routeClasses.has(combo.metadata.routeType)) return false;
  if (sources && !sources.has(getMkxlCatalogComboSource(combo))) return false;
  if (recovered.stageId) {
    if (
      combo.stageContext.kind !== "stageSpecific" ||
      combo.stageContext.stageId !== recovered.stageId
    ) {
      return false;
    }
  }
  if (recovered.interactableIds) {
    if (combo.stageContext.kind !== "stageSpecific") return false;
    if (!combo.stageContext.interactableIds.some((id) => recovered.interactableIds?.includes(id))) {
      return false;
    }
  }
  return true;
};

const localized = (label: string): LocalizedText => ({ default: label, fallback: label });

const option = (
  id: string,
  label: LocalizedText,
  count: number,
  selected: boolean,
  disabled = count === 0 && !selected,
  disabledReason?: string,
): MkxlCatalogFilterOption => ({
  id,
  label,
  count,
  selected,
  disabled,
  disabledReason: disabledReason ? localized(disabledReason) : undefined,
});

const increment = (counts: Map<string, number>, id: string) =>
  counts.set(id, (counts.get(id) ?? 0) + 1);

type Aggregation = {
  positions: Map<string, number>;
  meter: Map<string, number>;
  difficulties: Map<string, number>;
  routeClasses: Map<string, number>;
  sources: Map<string, number>;
  stages: Map<string, number>;
  interactables: Map<string, number>;
};

const aggregate = (combos: readonly MkxlSeededCombo[]): Aggregation => {
  const result: Aggregation = {
    positions: new Map(),
    meter: new Map(),
    difficulties: new Map(),
    routeClasses: new Map(),
    sources: new Map(),
    stages: new Map(),
    interactables: new Map(),
  };
  for (const combo of combos) {
    increment(result.positions, combo.metadata.position);
    increment(result.meter, String(combo.metadata.meter));
    increment(result.difficulties, combo.metadata.difficulty);
    increment(result.routeClasses, combo.metadata.routeType);
    increment(result.sources, getMkxlCatalogComboSource(combo));
    if (combo.stageContext.kind === "stageSpecific") {
      increment(result.stages, combo.stageContext.stageId);
      for (const id of new Set(combo.stageContext.interactableIds))
        increment(result.interactables, id);
    }
  }
  return result;
};

const optionsFromCounts = (
  counts: ReadonlyMap<string, number>,
  selected: ReadonlySet<string>,
): readonly MkxlCatalogFilterOption[] =>
  [...counts].map(([id, count]) => option(id, localized(id), count, selected.has(id)));

const facet = (
  id: MkxlCatalogMultiSelectFilterId,
  options: readonly MkxlCatalogFilterOption[],
): MkxlCatalogFilterFacet => ({ kind: "multiSelect", id, options });

export const createMkxlCatalogFilterFacets = (
  combos: readonly MkxlSeededCombo[],
  filters: MkxlCatalogFilters = {},
): readonly MkxlCatalogFilterFacet[] => {
  const recovered = recoverMkxlCatalogFilters(filters).filters;
  const counts = aggregate(combos);
  const selectedStage = recovered.stageId ? stageById.get(recovered.stageId) : undefined;
  const interactableOptions = (selectedStage?.interactables ?? [])
    .map((interactable) =>
      option(
        interactable.id,
        interactable.label,
        counts.interactables.get(interactable.id) ?? 0,
        recovered.interactableIds?.includes(interactable.id) ?? false,
      ),
    )
    .filter((entry) => entry.count > 0 || entry.selected);
  const stageOptions = mkxlStages
    .map((stage) =>
      option(
        stage.id,
        stage.label,
        counts.stages.get(stage.id) ?? 0,
        recovered.stageId === stage.id,
      ),
    )
    .filter((entry) => entry.count > 0 || entry.selected);

  return [
    facet(
      mkxlCatalogMultiSelectFilterIds.position,
      optionsFromCounts(counts.positions, new Set(recovered.positions)),
    ),
    facet(
      mkxlCatalogMultiSelectFilterIds.meter,
      optionsFromCounts(counts.meter, new Set(recovered.meter?.map(String))),
    ),
    facet(
      mkxlCatalogMultiSelectFilterIds.difficulty,
      optionsFromCounts(counts.difficulties, new Set(recovered.difficulties)),
    ),
    facet(
      mkxlCatalogMultiSelectFilterIds.routeClass,
      optionsFromCounts(counts.routeClasses, new Set(recovered.routeClasses)),
    ),
    facet(
      mkxlCatalogMultiSelectFilterIds.source,
      Object.values(mkxlCatalogSources).map((source) =>
        source === mkxlCatalogSources.personal
          ? option(
              source,
              localized("Personal"),
              0,
              false,
              true,
              "Personal combos are coming later.",
            )
          : option(
              source,
              localized(source === mkxlCatalogSources.curated ? "Curated" : "Community"),
              counts.sources.get(source) ?? 0,
              recovered.sources?.includes(source) ?? false,
            ),
      ),
    ),
    {
      kind: "singleSelect",
      id: mkxlCatalogSingleSelectFilterIds.stage,
      options: stageOptions,
    },
    ...(selectedStage
      ? [facet(mkxlCatalogMultiSelectFilterIds.interactable, interactableOptions)]
      : []),
  ];
};
