import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type { Mk1SeededCombo } from "@mk-combos/mk1-data/combos/type";

import { Mk1CatalogFiltersSchema } from "./schema";
import type { Mk1CatalogFilterFacet, Mk1CatalogFilters } from "./type";

export const emptyMk1CatalogFilters = {} as const satisfies Mk1CatalogFilters;

const toMessage = (code: string, message: string, path: readonly string[]): ValidationMessage => ({
  severity: "warning",
  code,
  message,
  path,
});

const uniqueValues = (values: readonly string[]): readonly string[] => {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();

    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    unique.push(trimmed);
  }

  return unique;
};

const toList = (value: string | readonly string[] | undefined): readonly string[] => {
  if (value === undefined) {
    return [];
  }

  return typeof value === "string" ? [value] : value;
};

const numbersFromRoute = (
  values: readonly string[],
  path: string,
  messages: ValidationMessage[],
): readonly number[] => {
  const parsedValues: number[] = [];

  for (const value of values) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      messages.push(
        toMessage("mk1.catalog.invalid_filter", "Route filter number is invalid.", [path]),
      );
      continue;
    }

    parsedValues.push(parsed);
  }

  return [...new Set(parsedValues)];
};

const firstNumberFromRoute = (
  value: string | readonly string[] | undefined,
  path: string,
  messages: ValidationMessage[],
): number | undefined => {
  const first = toList(value).find((entry) => entry.trim().length > 0);

  if (!first) {
    return undefined;
  }

  const parsed = Number(first);

  if (!Number.isFinite(parsed)) {
    messages.push(
      toMessage("mk1.catalog.invalid_filter", "Route damage filter is invalid.", [path]),
    );
    return undefined;
  }

  return parsed;
};

export const recoverMk1CatalogFilters = (
  input: unknown = {},
): {
  readonly filters: Mk1CatalogFilters;
  readonly messages: readonly ValidationMessage[];
} => {
  const parsed = Mk1CatalogFiltersSchema.safeParse(input);

  if (parsed.success) {
    return {
      filters: parsed.data,
      messages: [],
    };
  }

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
};

export const parseMk1CatalogFiltersFromRouteQuery = (query: {
  starter?: string | readonly string[];
  position?: string | readonly string[];
  meter?: string | readonly string[];
  damageMin?: string | readonly string[];
  damageMax?: string | readonly string[];
  difficulty?: string | readonly string[];
  routeType?: string | readonly string[];
  tag?: string | readonly string[];
}) => {
  const messages: ValidationMessage[] = [];
  const filters = {
    starter: uniqueValues(toList(query.starter)),
    position: uniqueValues(toList(query.position)),
    meter: numbersFromRoute(uniqueValues(toList(query.meter)), "meter", messages),
    difficulty: uniqueValues(toList(query.difficulty)),
    routeType: uniqueValues(toList(query.routeType)),
    tags: uniqueValues(toList(query.tag)),
    damage: {
      min: firstNumberFromRoute(query.damageMin, "damageMin", messages),
      max: firstNumberFromRoute(query.damageMax, "damageMax", messages),
    },
  };
  const compactFilters = {
    ...(filters.starter.length > 0 ? { starter: filters.starter } : {}),
    ...(filters.position.length > 0 ? { position: filters.position } : {}),
    ...(filters.meter.length > 0 ? { meter: filters.meter } : {}),
    ...(filters.difficulty.length > 0 ? { difficulty: filters.difficulty } : {}),
    ...(filters.routeType.length > 0 ? { routeType: filters.routeType } : {}),
    ...(filters.tags.length > 0 ? { tags: filters.tags } : {}),
    ...(filters.damage.min !== undefined || filters.damage.max !== undefined
      ? { damage: filters.damage }
      : {}),
  };
  const recovered = recoverMk1CatalogFilters(compactFilters);

  return {
    filters: recovered.filters,
    messages: [...messages, ...recovered.messages],
  };
};

export const serializeMk1CatalogFiltersToRouteQuery = (
  filters: Mk1CatalogFilters = {},
): Record<string, string | readonly string[]> => {
  const recovered = recoverMk1CatalogFilters(filters).filters;
  const query: Record<string, string | readonly string[]> = {};

  if (recovered.starter?.length) {
    query.starter = recovered.starter;
  }
  if (recovered.position?.length) {
    query.position = recovered.position;
  }
  if (recovered.meter?.length) {
    query.meter = recovered.meter.map((value) => String(value));
  }
  if (recovered.difficulty?.length) {
    query.difficulty = recovered.difficulty;
  }
  if (recovered.routeType?.length) {
    query.routeType = recovered.routeType;
  }
  if (recovered.tags?.length) {
    query.tag = recovered.tags;
  }
  if (recovered.damage?.min !== undefined) {
    query.damageMin = String(recovered.damage.min);
  }
  if (recovered.damage?.max !== undefined) {
    query.damageMax = String(recovered.damage.max);
  }

  return query;
};

const includesIfPresent = <T>(values: readonly T[] | undefined, value: T) =>
  values === undefined || values.length === 0 || values.includes(value);

const intersectsIfPresent = (
  values: readonly string[] | undefined,
  candidates: readonly string[],
) =>
  values === undefined ||
  values.length === 0 ||
  candidates.some((candidate) => values.includes(candidate));

export const comboMatchesMk1CatalogFilters = (
  combo: Mk1SeededCombo,
  filters: Mk1CatalogFilters = {},
): boolean => {
  const recovered = recoverMk1CatalogFilters(filters).filters;
  const damage = combo.metadata.damage;

  if (!includesIfPresent(recovered.starter, combo.metadata.starter)) {
    return false;
  }
  if (!includesIfPresent(recovered.position, combo.metadata.position)) {
    return false;
  }
  if (!includesIfPresent(recovered.meter, combo.metadata.meter)) {
    return false;
  }
  if (!includesIfPresent(recovered.difficulty, combo.metadata.difficulty)) {
    return false;
  }
  if (!includesIfPresent(recovered.routeType, combo.metadata.routeType)) {
    return false;
  }
  if (!intersectsIfPresent(recovered.tags, combo.metadata.tags)) {
    return false;
  }
  if (recovered.damage?.min !== undefined && damage < recovered.damage.min) {
    return false;
  }
  if (recovered.damage?.max !== undefined && damage > recovered.damage.max) {
    return false;
  }

  return true;
};

const multiSelectFacet = (
  combos: readonly Mk1SeededCombo[],
  filters: Mk1CatalogFilters,
  id: "starter" | "position" | "meter" | "difficulty" | "routeType" | "tag",
): Mk1CatalogFilterFacet => {
  const counts = new Map<string, number>();
  const selectedValues =
    id === "tag"
      ? (filters.tags ?? [])
      : id === "meter"
        ? (filters.meter ?? []).map((value) => String(value))
        : (filters[id] ?? []).map((value) => String(value));

  for (const combo of combos) {
    const values =
      id === "tag"
        ? combo.metadata.tags
        : id === "meter"
          ? [String(combo.metadata.meter)]
          : [String(combo.metadata[id])];

    for (const value of values) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return {
    kind: "multiSelect",
    id,
    options: [...counts.entries()].map(([value, count]) => ({
      value,
      label: value,
      count,
      selected: selectedValues.includes(value),
    })),
  };
};

export const createMk1CatalogFilterFacets = (
  combos: readonly Mk1SeededCombo[],
  filters: Mk1CatalogFilters = {},
): readonly Mk1CatalogFilterFacet[] => {
  const recovered = recoverMk1CatalogFilters(filters).filters;
  const damageValues = combos.map((combo) => combo.metadata.damage);
  const minDamage = damageValues.length > 0 ? Math.min(...damageValues) : 0;
  const maxDamage = damageValues.length > 0 ? Math.max(...damageValues) : 0;

  return [
    multiSelectFacet(combos, recovered, "starter"),
    multiSelectFacet(combos, recovered, "position"),
    multiSelectFacet(combos, recovered, "meter"),
    {
      kind: "range",
      id: "damage",
      min: minDamage,
      max: maxDamage,
    },
    multiSelectFacet(combos, recovered, "difficulty"),
    multiSelectFacet(combos, recovered, "routeType"),
    multiSelectFacet(combos, recovered, "tag"),
  ];
};
