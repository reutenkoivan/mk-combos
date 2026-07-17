import { CatalogFilterChangeSchema } from "@mk-combos/contracts/catalog-filter/schema";
import type { CatalogFilterChange } from "@mk-combos/contracts/catalog-filter/type";
import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import { validationSeverities } from "@mk-combos/contracts/result/value";
import type { Mk1SeededCombo } from "@mk-combos/mk1-data/combos/type";

import {
  Mk1CatalogFilterIdSchema,
  Mk1CatalogFilterQuerySchema,
  Mk1CatalogFiltersSchema,
  Mk1CatalogPlainFilterQuerySchema,
} from "./schema";
import type {
  Mk1CatalogFilterFacet,
  Mk1CatalogFilterOption,
  Mk1CatalogFilterQuery,
  Mk1CatalogFilters,
  Mk1CatalogMultiSelectFilterId,
  Mk1CatalogSource,
} from "./type";
import { mk1CatalogMultiSelectFilterIds, mk1CatalogSources } from "./value";

const emptyMk1CatalogFilters = {} as const satisfies Mk1CatalogFilters;

type FilterRecovery = {
  readonly filters: Mk1CatalogFilters;
  readonly messages: readonly ValidationMessage[];
};

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

const parseNumbers = (
  value: string | readonly string[] | undefined,
  path: string,
  messages: ValidationMessage[],
): readonly number[] => {
  const numbers: number[] = [];

  for (const entry of presentUnique(value)) {
    if (!/^\d+$/u.test(entry)) {
      messages.push(toMessage("mk1.catalog.invalid_filter", `${path} must be an integer.`, [path]));
      continue;
    }
    numbers.push(Number(entry));
  }

  return numbers;
};

const withoutPersonalSource = (filters: Mk1CatalogFilters): FilterRecovery => {
  if (!filters.sources?.includes(mk1CatalogSources.personal)) {
    return { filters, messages: [] };
  }

  const sources = filters.sources.filter((source) => source !== mk1CatalogSources.personal);
  return {
    filters: {
      ...filters,
      sources: sources.length > 0 ? sources : undefined,
    },
    messages: [
      toMessage(
        "mk1.catalog.personal_source_unavailable",
        "Personal combos are not available in the catalog yet.",
        [mk1CatalogMultiSelectFilterIds.source],
      ),
    ],
  };
};

export const recoverMk1CatalogFilters = (input: unknown = {}): FilterRecovery => {
  const parsed = Mk1CatalogFiltersSchema.safeParse(input);
  if (!parsed.success) {
    return {
      filters: emptyMk1CatalogFilters,
      messages: parsed.error.issues.map((issue) =>
        toMessage(
          "mk1.catalog.invalid_filters",
          issue.message,
          issue.path.map((segment) => String(segment)),
        ),
      ),
    };
  }

  return withoutPersonalSource(parsed.data);
};

export const parseMk1CatalogFilterQuery = (input: unknown): FilterRecovery => {
  const query = Mk1CatalogPlainFilterQuerySchema.safeParse(input);
  if (!query.success) {
    return {
      filters: emptyMk1CatalogFilters,
      messages: query.error.issues.map((issue) =>
        toMessage(
          "mk1.catalog.invalid_filter_query",
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
  const candidate = {
    ...(positions.length > 0 ? { positions } : {}),
    ...(meter.length > 0 ? { meter } : {}),
    ...(difficulties.length > 0 ? { difficulties } : {}),
    ...(routeClasses.length > 0 ? { routeClasses } : {}),
    ...(sources.length > 0 ? { sources } : {}),
  };
  const recovered = recoverMk1CatalogFilters(candidate);

  return { filters: recovered.filters, messages: [...messages, ...recovered.messages] };
};

export const serializeMk1CatalogFilterQuery = (
  filters: Mk1CatalogFilters = {},
): Mk1CatalogFilterQuery => {
  const recovered = recoverMk1CatalogFilters(filters).filters;
  return Mk1CatalogFilterQuerySchema.parse({
    position: recovered.positions,
    meter: recovered.meter?.map(String),
    difficulty: recovered.difficulties,
    routeClass: recovered.routeClasses,
    source: recovered.sources,
  });
};

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
  filters: Mk1CatalogFilters,
  filterId: string | undefined,
  message: string,
): FilterRecovery => ({
  filters,
  messages: [
    toMessage("mk1.catalog.invalid_filter_change", message, filterId ? [filterId] : ["filters"]),
  ],
});

const clearFacet = (filters: Mk1CatalogFilters, filterId: string): FilterRecovery => {
  const parsed = Mk1CatalogFilterIdSchema.safeParse(filterId);
  if (!parsed.success) {
    return invalidChange(filters, filterId, "MK1 catalog filter does not exist.");
  }
  switch (parsed.data) {
    case mk1CatalogMultiSelectFilterIds.position:
      return { filters: { ...filters, positions: undefined }, messages: [] };
    case mk1CatalogMultiSelectFilterIds.meter:
      return { filters: { ...filters, meter: undefined }, messages: [] };
    case mk1CatalogMultiSelectFilterIds.difficulty:
      return { filters: { ...filters, difficulties: undefined }, messages: [] };
    case mk1CatalogMultiSelectFilterIds.routeClass:
      return { filters: { ...filters, routeClasses: undefined }, messages: [] };
    case mk1CatalogMultiSelectFilterIds.source:
      return { filters: { ...filters, sources: undefined }, messages: [] };
  }
};

const toggleOption = (
  filters: Mk1CatalogFilters,
  change: Extract<CatalogFilterChange, { kind: typeof catalogFilterChangeKinds.toggleOption }>,
): FilterRecovery => {
  const filterId = Mk1CatalogFilterIdSchema.safeParse(change.filterId);
  if (!filterId.success) {
    return invalidChange(filters, change.filterId, "MK1 catalog option filter does not exist.");
  }

  let candidate: unknown;
  switch (filterId.data) {
    case mk1CatalogMultiSelectFilterIds.position:
      candidate = {
        ...filters,
        positions: toggleDesiredValue(filters.positions, change.value, change.selected),
      };
      break;
    case mk1CatalogMultiSelectFilterIds.meter: {
      if (!/^\d+$/u.test(change.value)) {
        return invalidChange(filters, change.filterId, "Meter must be a non-negative integer.");
      }
      candidate = {
        ...filters,
        meter: toggleDesiredValue(filters.meter, Number(change.value), change.selected),
      };
      break;
    }
    case mk1CatalogMultiSelectFilterIds.difficulty:
      candidate = {
        ...filters,
        difficulties: toggleDesiredValue(filters.difficulties, change.value, change.selected),
      };
      break;
    case mk1CatalogMultiSelectFilterIds.routeClass:
      candidate = {
        ...filters,
        routeClasses: toggleDesiredValue(filters.routeClasses, change.value, change.selected),
      };
      break;
    case mk1CatalogMultiSelectFilterIds.source:
      if (change.selected && change.value === mk1CatalogSources.personal) {
        return invalidChange(filters, change.filterId, "Personal combos are not available yet.");
      }
      candidate = {
        ...filters,
        sources: toggleDesiredValue(filters.sources, change.value, change.selected),
      };
      break;
  }

  const parsed = Mk1CatalogFiltersSchema.safeParse(candidate);
  return parsed.success
    ? withoutPersonalSource(parsed.data)
    : invalidChange(filters, change.filterId, parsed.error.issues[0]?.message ?? "Invalid option.");
};

export const applyMk1CatalogFilterChange = (
  input: unknown,
  change: CatalogFilterChange,
): FilterRecovery => {
  const recovered = recoverMk1CatalogFilters(input);
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
        return { filters: emptyMk1CatalogFilters, messages: [] } satisfies FilterRecovery;
      case catalogFilterChangeKinds.clearFacet:
        return clearFacet(recovered.filters, parsedChange.data.filterId);
      case catalogFilterChangeKinds.toggleOption:
        return toggleOption(recovered.filters, parsedChange.data);
    }
  })();

  return { filters: changed.filters, messages: [...recovered.messages, ...changed.messages] };
};

export const getMk1CatalogComboSource = (combo: Mk1SeededCombo): Mk1CatalogSource =>
  combo.sourceIds.includes("community-combo-source")
    ? mk1CatalogSources.community
    : mk1CatalogSources.curated;

const includesIfPresent = <T>(values: readonly T[] | undefined, value: T) =>
  values === undefined || values.includes(value);

export const comboMatchesMk1CatalogFilters = (
  combo: Mk1SeededCombo,
  filters: Mk1CatalogFilters = {},
): boolean => {
  const recovered = recoverMk1CatalogFilters(filters).filters;
  return (
    includesIfPresent(recovered.positions, combo.metadata.position) &&
    includesIfPresent(recovered.meter, combo.metadata.meter) &&
    includesIfPresent(recovered.difficulties, combo.metadata.difficulty) &&
    includesIfPresent(recovered.routeClasses, combo.metadata.routeType) &&
    includesIfPresent(recovered.sources, getMk1CatalogComboSource(combo))
  );
};

const localized = (label: string) => ({ default: label, fallback: label });

const option = (
  id: string,
  count: number,
  selected: boolean,
  label = id,
  disabled = count === 0 && !selected,
  disabledReason?: string,
): Mk1CatalogFilterOption => ({
  id,
  label: localized(label),
  count,
  selected,
  disabled,
  disabledReason: disabledReason ? localized(disabledReason) : undefined,
});

const countBy = (combos: readonly Mk1SeededCombo[], value: (combo: Mk1SeededCombo) => string) => {
  const counts = new Map<string, number>();
  for (const combo of combos) {
    const id = value(combo);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
};

const facetFromCounts = (
  id: Mk1CatalogMultiSelectFilterId,
  counts: ReadonlyMap<string, number>,
  selected: ReadonlySet<string>,
): Mk1CatalogFilterFacet => ({
  kind: "multiSelect",
  id,
  options: [...counts].map(([value, count]) => option(value, count, selected.has(value))),
});

export const createMk1CatalogFilterFacets = (
  combos: readonly Mk1SeededCombo[],
  filters: Mk1CatalogFilters = {},
): readonly Mk1CatalogFilterFacet[] => {
  const recovered = recoverMk1CatalogFilters(filters).filters;
  const sourceCounts = countBy(combos, getMk1CatalogComboSource);

  return [
    facetFromCounts(
      mk1CatalogMultiSelectFilterIds.position,
      countBy(combos, (combo) => combo.metadata.position),
      new Set(recovered.positions),
    ),
    facetFromCounts(
      mk1CatalogMultiSelectFilterIds.meter,
      countBy(combos, (combo) => String(combo.metadata.meter)),
      new Set(recovered.meter?.map(String)),
    ),
    facetFromCounts(
      mk1CatalogMultiSelectFilterIds.difficulty,
      countBy(combos, (combo) => combo.metadata.difficulty),
      new Set(recovered.difficulties),
    ),
    facetFromCounts(
      mk1CatalogMultiSelectFilterIds.routeClass,
      countBy(combos, (combo) => combo.metadata.routeType),
      new Set(recovered.routeClasses),
    ),
    {
      kind: "multiSelect",
      id: mk1CatalogMultiSelectFilterIds.source,
      options: Object.values(mk1CatalogSources).map((source) =>
        source === mk1CatalogSources.personal
          ? option(source, 0, false, "Personal", true, "Personal combos are coming later.")
          : option(
              source,
              sourceCounts.get(source) ?? 0,
              recovered.sources?.includes(source) ?? false,
              source === mk1CatalogSources.curated ? "Curated" : "Community",
            ),
      ),
    },
  ];
};
