import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type { MkxlSeededCombo } from "@mk-combos/mkxl-data/combos/type";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";

import { MkxlCatalogFiltersSchema } from "./schema";
import type { MkxlCatalogFilterFacet, MkxlCatalogFilterOption, MkxlCatalogFilters } from "./type";

type PlainRouteQuery = Readonly<Record<string, string | readonly string[] | undefined>>;

type FilterRecoveryResult = {
  filters: MkxlCatalogFilters;
  messages: readonly ValidationMessage[];
};

type FilterQueryOutput = {
  starter?: readonly string[];
  position?: readonly string[];
  meter?: readonly string[];
  damageMin?: string;
  damageMax?: string;
  difficulty?: readonly string[];
  routeType?: readonly string[];
  tag?: readonly string[];
  stage?: string;
  interactable?: readonly string[];
};

const stageIds = new Set<string>();

const interactableStageById = new Map<string, string>();

for (const stage of mkxlStages) {
  stageIds.add(stage.id);
  for (const interactable of stage.interactables) {
    interactableStageById.set(interactable.id, stage.id);
  }
}

const toMessage = (code: string, message: string, path: readonly string[]): ValidationMessage => ({
  severity: "warning",
  code,
  message,
  path,
});

const toList = (value: string | readonly string[] | undefined): readonly string[] => {
  if (value === undefined) {
    return [];
  }

  return typeof value === "string" ? [value] : value;
};

const unique = <T>(values: readonly T[]): readonly T[] => [...new Set(values)];

const presentStrings = (values: readonly string[]): readonly string[] => {
  const seenValues = new Set<string>();
  const presentValues: string[] = [];

  for (const value of values) {
    const trimmedValue = value.trim();

    if (!trimmedValue || seenValues.has(trimmedValue)) {
      continue;
    }

    seenValues.add(trimmedValue);
    presentValues.push(trimmedValue);
  }

  return presentValues;
};

const numberStringsToNumbers = (
  values: readonly string[],
  path: string,
): { values: readonly number[]; messages: readonly ValidationMessage[] } => {
  const parsedValues: number[] = [];
  const messages: ValidationMessage[] = [];
  const seenValues = new Set<number>();

  for (const value of values) {
    if (!/^\d+$/u.test(value)) {
      messages.push(
        toMessage("mkxl.catalog.invalid_filter_value", `Invalid ${path} filter value.`, [path]),
      );
      continue;
    }

    const parsedValue = Number(value);

    if (seenValues.has(parsedValue)) {
      continue;
    }

    seenValues.add(parsedValue);
    parsedValues.push(parsedValue);
  }

  return {
    values: parsedValues,
    messages,
  };
};

const enumStrings = <T extends string>(
  values: readonly string[],
  allowedValues: readonly T[],
  path: string,
): { values: readonly T[]; messages: readonly ValidationMessage[] } => {
  const allowed = new Set<string>(allowedValues);
  const parsedValues: T[] = [];
  const messages: ValidationMessage[] = [];
  const seenValues = new Set<string>();
  const isAllowedValue = (value: string): value is T => allowed.has(value);

  for (const value of values) {
    if (!isAllowedValue(value)) {
      messages.push(
        toMessage("mkxl.catalog.invalid_filter_value", `Invalid ${path} filter value.`, [path]),
      );
      continue;
    }

    if (seenValues.has(value)) {
      continue;
    }

    seenValues.add(value);
    parsedValues.push(value);
  }

  return {
    values: parsedValues,
    messages,
  };
};

const addArray = <T>(target: Record<string, unknown>, key: string, values: readonly T[]) => {
  if (values.length > 0) {
    target[key] = values;
  }
};

const normalizeDamageRange = (
  minValue: string | undefined,
  maxValue: string | undefined,
): { damage?: MkxlCatalogFilters["damage"]; messages: readonly ValidationMessage[] } => {
  const messages: ValidationMessage[] = [];
  const parseBound = (value: string | undefined, path: string) => {
    if (value === undefined) {
      return undefined;
    }
    if (!/^\d+$/u.test(value)) {
      messages.push(
        toMessage("mkxl.catalog.invalid_filter_value", `Invalid ${path} filter value.`, [path]),
      );
      return undefined;
    }

    return Number(value);
  };

  const min = parseBound(minValue, "damageMin");
  const max = parseBound(maxValue, "damageMax");

  if (min !== undefined && max !== undefined && min > max) {
    messages.push(
      toMessage(
        "mkxl.catalog.invalid_damage_range",
        "Damage minimum cannot be greater than damage maximum.",
        ["damage"],
      ),
    );
    return { messages };
  }

  const damage = { min, max };

  return min === undefined && max === undefined ? { messages } : { damage, messages };
};

const recoverStageAndInteractables = (filters: MkxlCatalogFilters): FilterRecoveryResult => {
  const messages: ValidationMessage[] = [];
  let stageId = filters.stageId;
  let interactableIds = filters.interactableIds;

  if (stageId && !stageIds.has(stageId)) {
    messages.push(
      toMessage("mkxl.catalog.invalid_stage", "Stage filter does not exist in MKXL data.", [
        "stage",
      ]),
    );
    stageId = undefined;
  }

  if (interactableIds) {
    const validInteractables: string[] = [];

    for (const interactableId of interactableIds) {
      const interactableStageId = interactableStageById.get(interactableId);

      if (!interactableStageId) {
        messages.push(
          toMessage(
            "mkxl.catalog.invalid_interactable",
            "Interactable filter does not exist in MKXL data.",
            ["interactable"],
          ),
        );
        continue;
      }

      if (stageId && interactableStageId !== stageId) {
        messages.push(
          toMessage(
            "mkxl.catalog.incompatible_interactable",
            "Interactable filter does not belong to the selected stage.",
            ["interactable"],
          ),
        );
        continue;
      }

      validInteractables.push(interactableId);
    }

    interactableIds = validInteractables.length > 0 ? unique(validInteractables) : undefined;
  }

  const recovered = MkxlCatalogFiltersSchema.parse({
    ...filters,
    stageId,
    interactableIds,
  });

  return {
    filters: recovered,
    messages,
  };
};

export const emptyMkxlCatalogFilters = {} as const satisfies MkxlCatalogFilters;

export const clearMkxlCatalogFilters = (_filters: MkxlCatalogFilters): MkxlCatalogFilters =>
  emptyMkxlCatalogFilters;

export const recoverMkxlCatalogFilters = (filters: MkxlCatalogFilters): FilterRecoveryResult =>
  recoverStageAndInteractables(MkxlCatalogFiltersSchema.parse(filters));

export const parseMkxlCatalogFiltersFromRouteQuery = (
  query: PlainRouteQuery,
): FilterRecoveryResult => {
  const messages: ValidationMessage[] = [];
  const filterInput: Record<string, unknown> = {};
  const starters = presentStrings(toList(query.starter));
  const tags = presentStrings(toList(query.tag));
  const interactables = presentStrings(toList(query.interactable));
  const meter = numberStringsToNumbers(toList(query.meter), "meter");
  const damage = normalizeDamageRange(
    typeof query.damageMin === "string" ? query.damageMin : undefined,
    typeof query.damageMax === "string" ? query.damageMax : undefined,
  );
  const positions = enumStrings(
    toList(query.position),
    ["midscreen", "corner", "antiAir"],
    "position",
  );
  const difficulties = enumStrings(
    toList(query.difficulty),
    ["easy", "medium", "hard"],
    "difficulty",
  );
  const routeTypes = enumStrings(
    toList(query.routeType),
    ["bnb", "punish", "metered", "stage"],
    "routeType",
  );

  addArray(filterInput, "starters", starters);
  addArray(filterInput, "tags", tags);
  addArray(filterInput, "interactableIds", interactables);
  addArray(filterInput, "meter", meter.values);
  addArray(filterInput, "positions", positions.values);
  addArray(filterInput, "difficulties", difficulties.values);
  addArray(filterInput, "routeTypes", routeTypes.values);

  if (typeof query.stage === "string" && query.stage.trim()) {
    filterInput.stageId = query.stage.trim();
  }
  if (damage.damage) {
    filterInput.damage = damage.damage;
  }

  messages.push(
    ...meter.messages,
    ...damage.messages,
    ...positions.messages,
    ...difficulties.messages,
    ...routeTypes.messages,
  );

  const recovered = recoverStageAndInteractables(MkxlCatalogFiltersSchema.parse(filterInput));

  return {
    filters: recovered.filters,
    messages: [...messages, ...recovered.messages],
  };
};

export const serializeMkxlCatalogFiltersToRouteQuery = (
  filters: MkxlCatalogFilters,
): FilterQueryOutput => {
  const recovered = recoverMkxlCatalogFilters(filters).filters;
  const query: FilterQueryOutput = {};

  if (recovered.starters) {
    query.starter = recovered.starters;
  }
  if (recovered.positions) {
    query.position = recovered.positions;
  }
  if (recovered.meter) {
    const meterValues: string[] = [];

    for (const meterValue of recovered.meter) {
      meterValues.push(String(meterValue));
    }

    query.meter = meterValues;
  }
  if (recovered.damage?.min !== undefined) {
    query.damageMin = String(recovered.damage.min);
  }
  if (recovered.damage?.max !== undefined) {
    query.damageMax = String(recovered.damage.max);
  }
  if (recovered.difficulties) {
    query.difficulty = recovered.difficulties;
  }
  if (recovered.routeTypes) {
    query.routeType = recovered.routeTypes;
  }
  if (recovered.tags) {
    query.tag = recovered.tags;
  }
  if (recovered.stageId) {
    query.stage = recovered.stageId;
  }
  if (recovered.interactableIds) {
    query.interactable = recovered.interactableIds;
  }

  return query;
};

export const setMkxlCatalogStageFilter = (
  filters: MkxlCatalogFilters,
  stageId: string | undefined,
): FilterRecoveryResult =>
  recoverStageAndInteractables({
    ...filters,
    stageId,
    interactableIds: stageId ? filters.interactableIds : undefined,
  });

export const comboMatchesMkxlCatalogFilters = (
  combo: MkxlSeededCombo,
  filters: MkxlCatalogFilters,
): boolean => {
  const lookups = filterLookupCache.get(filters) ?? createFilterLookups(filters);
  filterLookupCache.set(filters, lookups);

  return comboMatchesFilterLookups(combo, filters, lookups);
};

type FilterLookups = {
  starters?: ReadonlySet<string>;
  positions?: ReadonlySet<string>;
  meter?: ReadonlySet<number>;
  difficulties?: ReadonlySet<string>;
  routeTypes?: ReadonlySet<string>;
  tags?: readonly string[];
  interactableIds?: ReadonlySet<string>;
};

const filterLookupCache = new WeakMap<MkxlCatalogFilters, FilterLookups>();

const createStringSet = (values: readonly string[] | undefined): ReadonlySet<string> | undefined =>
  values ? new Set(values) : undefined;

const createNumberSet = (values: readonly number[] | undefined): ReadonlySet<number> | undefined =>
  values ? new Set(values) : undefined;

const createFilterLookups = (filters: MkxlCatalogFilters): FilterLookups => ({
  starters: createStringSet(filters.starters),
  positions: createStringSet(filters.positions),
  meter: createNumberSet(filters.meter),
  difficulties: createStringSet(filters.difficulties),
  routeTypes: createStringSet(filters.routeTypes),
  tags: filters.tags,
  interactableIds: createStringSet(filters.interactableIds),
});

const comboMatchesFilterLookups = (
  combo: MkxlSeededCombo,
  filters: MkxlCatalogFilters,
  lookups: FilterLookups,
): boolean => {
  const metadata = combo.metadata;

  if (lookups.starters && !lookups.starters.has(metadata.starter)) {
    return false;
  }
  if (lookups.positions && !lookups.positions.has(metadata.position)) {
    return false;
  }
  if (lookups.meter && !lookups.meter.has(metadata.meter)) {
    return false;
  }
  if (filters.damage?.min !== undefined && metadata.damage < filters.damage.min) {
    return false;
  }
  if (filters.damage?.max !== undefined && metadata.damage > filters.damage.max) {
    return false;
  }
  if (lookups.difficulties && !lookups.difficulties.has(metadata.difficulty)) {
    return false;
  }
  if (lookups.routeTypes && !lookups.routeTypes.has(metadata.routeType)) {
    return false;
  }
  if (lookups.tags) {
    for (const tag of lookups.tags) {
      if (!metadata.tags.includes(tag)) {
        return false;
      }
    }
  }
  if (filters.stageId) {
    if (
      combo.stageContext.kind !== "stageSpecific" ||
      combo.stageContext.stageId !== filters.stageId
    ) {
      return false;
    }
  }
  if (lookups.interactableIds) {
    const { stageContext } = combo;

    if (stageContext.kind !== "stageSpecific") {
      return false;
    }
    let hasSelectedInteractable = false;

    for (const interactableId of stageContext.interactableIds) {
      if (lookups.interactableIds.has(interactableId)) {
        hasSelectedInteractable = true;
        break;
      }
    }

    if (!hasSelectedInteractable) {
      return false;
    }
  }

  return true;
};

const incrementCount = (counts: Map<string, number>, id: string) => {
  counts.set(id, (counts.get(id) ?? 0) + 1);
};

type FacetAggregation = {
  starterCounts: Map<string, number>;
  positionCounts: Map<string, number>;
  meterCounts: Map<string, number>;
  difficultyCounts: Map<string, number>;
  routeTypeCounts: Map<string, number>;
  tagCounts: Map<string, number>;
  stageCounts: Map<string, number>;
  interactableCounts: Map<string, number>;
  minDamage: number;
  maxDamage: number;
  hasDamage: boolean;
};

const createEmptyFacetAggregation = (): FacetAggregation => ({
  starterCounts: new Map(),
  positionCounts: new Map(),
  meterCounts: new Map(),
  difficultyCounts: new Map(),
  routeTypeCounts: new Map(),
  tagCounts: new Map(),
  stageCounts: new Map(),
  interactableCounts: new Map(),
  minDamage: 0,
  maxDamage: 0,
  hasDamage: false,
});

const updateDamageBounds = (aggregation: FacetAggregation, damage: number) => {
  if (!aggregation.hasDamage) {
    aggregation.minDamage = damage;
    aggregation.maxDamage = damage;
    aggregation.hasDamage = true;
    return;
  }

  aggregation.minDamage = Math.min(aggregation.minDamage, damage);
  aggregation.maxDamage = Math.max(aggregation.maxDamage, damage);
};

const addStageSpecificComboToFacetAggregation = (
  aggregation: FacetAggregation,
  stageContext: Extract<MkxlSeededCombo["stageContext"], { kind: "stageSpecific" }>,
) => {
  incrementCount(aggregation.stageCounts, stageContext.stageId);

  if (stageContext.interactableIds.length === 1) {
    const [interactableId] = stageContext.interactableIds;

    if (interactableId) {
      incrementCount(aggregation.interactableCounts, interactableId);
    }
    return;
  }

  const countedInteractables = new Set<string>();

  for (const interactableId of stageContext.interactableIds) {
    if (countedInteractables.has(interactableId)) {
      continue;
    }

    countedInteractables.add(interactableId);
    incrementCount(aggregation.interactableCounts, interactableId);
  }
};

const addComboToFacetAggregation = (aggregation: FacetAggregation, combo: MkxlSeededCombo) => {
  const { metadata, stageContext } = combo;

  incrementCount(aggregation.starterCounts, metadata.starter);
  incrementCount(aggregation.positionCounts, metadata.position);
  incrementCount(aggregation.meterCounts, String(metadata.meter));
  incrementCount(aggregation.difficultyCounts, metadata.difficulty);
  incrementCount(aggregation.routeTypeCounts, metadata.routeType);

  for (const tag of metadata.tags) {
    incrementCount(aggregation.tagCounts, tag);
  }

  updateDamageBounds(aggregation, metadata.damage);

  if (stageContext.kind === "stageSpecific") {
    addStageSpecificComboToFacetAggregation(aggregation, stageContext);
  }
};

const stageLabel = (stage: (typeof mkxlStages)[number]) =>
  stage.label.default ?? stage.label.EN ?? stage.label.UA ?? stage.label.fallback ?? stage.id;

const interactableLabel = (interactable: (typeof mkxlStages)[number]["interactables"][number]) =>
  interactable.label.default ??
  interactable.label.EN ??
  interactable.label.UA ??
  interactable.label.fallback ??
  interactable.id;

const createFilterOption = (
  id: string,
  count: number,
  selected: boolean,
  label = id,
): MkxlCatalogFilterOption => ({
  id,
  label: { default: label, fallback: label },
  count,
  selected,
});

const createOptionsFromCounts = (
  counts: ReadonlyMap<string, number>,
  selectedValues: ReadonlySet<string> | undefined,
): readonly MkxlCatalogFilterOption[] => {
  const options: MkxlCatalogFilterOption[] = [];

  for (const [id, count] of counts) {
    options.push(createFilterOption(id, count, Boolean(selectedValues?.has(id))));
  }

  return options;
};

const createMeterOptions = (
  meterCounts: ReadonlyMap<string, number>,
  selectedMeter: ReadonlySet<number> | undefined,
): readonly MkxlCatalogFilterOption[] => {
  const options: MkxlCatalogFilterOption[] = [];

  for (const [id, count] of meterCounts) {
    options.push(createFilterOption(id, count, Boolean(selectedMeter?.has(Number(id)))));
  }

  return options;
};

const createStageAndInteractableOptions = (
  aggregation: FacetAggregation,
  filters: MkxlCatalogFilters,
  selectedInteractables: ReadonlySet<string> | undefined,
): {
  stageOptions: readonly MkxlCatalogFilterOption[];
  interactableOptions: readonly MkxlCatalogFilterOption[];
} => {
  const stageOptions: MkxlCatalogFilterOption[] = [];
  const interactableOptions: MkxlCatalogFilterOption[] = [];

  for (const stage of mkxlStages) {
    stageOptions.push(
      createFilterOption(
        stage.id,
        aggregation.stageCounts.get(stage.id) ?? 0,
        filters.stageId === stage.id,
        stageLabel(stage),
      ),
    );

    if (filters.stageId && stage.id !== filters.stageId) {
      continue;
    }

    for (const interactable of stage.interactables) {
      interactableOptions.push(
        createFilterOption(
          interactable.id,
          aggregation.interactableCounts.get(interactable.id) ?? 0,
          Boolean(selectedInteractables?.has(interactable.id)),
          interactableLabel(interactable),
        ),
      );
    }
  }

  return {
    stageOptions,
    interactableOptions,
  };
};

const createFacetDescriptors = (
  aggregation: FacetAggregation,
  filters: MkxlCatalogFilters,
): readonly MkxlCatalogFilterFacet[] => {
  const selectedStarters = createStringSet(filters.starters);
  const selectedPositions = createStringSet(filters.positions);
  const selectedMeter = createNumberSet(filters.meter);
  const selectedDifficulties = createStringSet(filters.difficulties);
  const selectedRouteTypes = createStringSet(filters.routeTypes);
  const selectedTags = createStringSet(filters.tags);
  const selectedInteractables = createStringSet(filters.interactableIds);
  const { stageOptions, interactableOptions } = createStageAndInteractableOptions(
    aggregation,
    filters,
    selectedInteractables,
  );

  return [
    {
      kind: "multiSelect",
      id: "starter",
      options: createOptionsFromCounts(aggregation.starterCounts, selectedStarters),
    },
    {
      kind: "multiSelect",
      id: "position",
      options: createOptionsFromCounts(aggregation.positionCounts, selectedPositions),
    },
    {
      kind: "multiSelect",
      id: "meter",
      options: createMeterOptions(aggregation.meterCounts, selectedMeter),
    },
    {
      kind: "range",
      id: "damage",
      min: aggregation.minDamage,
      max: aggregation.maxDamage,
      selectedMin: filters.damage?.min,
      selectedMax: filters.damage?.max,
    },
    {
      kind: "multiSelect",
      id: "difficulty",
      options: createOptionsFromCounts(aggregation.difficultyCounts, selectedDifficulties),
    },
    {
      kind: "multiSelect",
      id: "routeType",
      options: createOptionsFromCounts(aggregation.routeTypeCounts, selectedRouteTypes),
    },
    {
      kind: "multiSelect",
      id: "tags",
      options: createOptionsFromCounts(aggregation.tagCounts, selectedTags),
    },
    {
      kind: "multiSelect",
      id: "stage",
      options: stageOptions,
    },
    {
      kind: "multiSelect",
      id: "interactable",
      options: interactableOptions,
    },
  ] satisfies readonly MkxlCatalogFilterFacet[];
};

export const createMkxlCatalogFilterFacets = (
  combos: readonly MkxlSeededCombo[],
  filters: MkxlCatalogFilters,
): readonly MkxlCatalogFilterFacet[] => {
  const aggregation = createEmptyFacetAggregation();

  for (const combo of combos) {
    addComboToFacetAggregation(aggregation, combo);
  }

  return createFacetDescriptors(aggregation, filters);
};
