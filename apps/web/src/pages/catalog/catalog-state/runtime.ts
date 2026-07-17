import type { CatalogFilterChange } from "@mk-combos/contracts/catalog-filter/type";
import type { GameId } from "@mk-combos/contracts/identity/type";
import type { LanguageCode, LocalizedText } from "@mk-combos/contracts/settings/type";
import { languageCodes } from "@mk-combos/contracts/settings/value";
import { type ComboCardModel, comboCardActionKinds } from "@mk-combos/ui/components/combo-card";
import {
  type ActiveFilterChip,
  type FilterFacet,
  filterChoicePresentations,
  filterFacetKinds,
} from "@mk-combos/ui/components/filter-control-group";
import type { ComponentLabelValue, PickerOption, PickerSlot } from "@mk-combos/ui/components/type";
import { pickerSlotStatuses } from "@mk-combos/ui/components/value";
import type { UiToneMode } from "@mk-combos/ui/tokens/type";

import { formatCountCopy, resolveLocalizedText } from "../../../app/localization/runtime";
import type { AppCopy } from "../../../app/localization/type";
import type {
  InstalledCatalogFacet,
  InstalledCatalogOption,
  InstalledCatalogSelection,
  InstalledCatalogSummary,
  InstalledGameCatalogAdapter,
} from "../../../game-business/installed-games/catalog-adapter/type";
import { installedCatalogSelectionStatuses } from "../../../game-business/installed-games/catalog-adapter/type";
import { resolveInstalledCatalogOptionIcon } from "../../../game-business/installed-games/catalog-option-icon/runtime";
import { parseCatalogSearch } from "../search/runtime";
import type { CatalogSearch } from "../search/type";
import type { CatalogContextKind, CatalogSnapshot } from "./type";
import { catalogDifficultyToneByValue, catalogRouteToneByValue } from "./value";

type ResolveCatalogSnapshotInput = Readonly<{
  adapter: InstalledGameCatalogAdapter;
  characterSlug?: string;
  copy: AppCopy["catalog"];
  language: LanguageCode;
  search: CatalogSearch;
  specificationSlug?: string;
}>;

const catalogCommandMetricOrder = [
  "damage",
  "meter",
  "routeType",
  "position",
  "difficulty",
] as const;

function projectCatalogCommandMetadata(
  metadataItems: readonly ComponentLabelValue[],
): readonly ComponentLabelValue[] {
  const metadataById = new Map(metadataItems.map((item) => [item.id, item]));

  return catalogCommandMetricOrder.flatMap((id) => {
    const item = metadataById.get(id);
    return item ? [item] : [];
  });
}

export function prepareCatalogCommandCard(card: ComboCardModel): ComboCardModel {
  return {
    ...card,
    summary: {
      accessibleLabel: card.summary.accessibleLabel,
      contextItems: [],
      metadataItems: projectCatalogCommandMetadata(card.summary.metadataItems),
      notation: card.summary.notation,
      ref: card.summary.ref,
      routeSteps: card.summary.routeSteps,
      title: card.summary.title,
    },
  };
}

function humanizeToken(value: string): string {
  const normalized = value
    .replace(/([a-z0-9])([A-Z])/gu, "$1 $2")
    .replaceAll(/[-_]+/gu, " ")
    .trim();

  if (!normalized) {
    return value;
  }

  return normalized[0]?.toUpperCase() + normalized.slice(1);
}

function localizedValue(value: string, fallback: string, copy: AppCopy["catalog"]): string {
  return copy.valueLabels[value] ?? fallback;
}

function localizedFacetValue(
  value: LocalizedText | string,
  language: LanguageCode,
  fallback: string,
): string {
  return typeof value === "string" ? value : resolveLocalizedText(value, language, fallback);
}

function pickerOption(
  input: Readonly<{
    gameId: GameId;
    imageKind: "character" | "kameo" | "variation";
    language: LanguageCode;
    noOptionData: string;
    option: InstalledCatalogOption;
    optionCountTemplate: string;
  }>,
): PickerOption {
  const label = resolveLocalizedText(
    input.option.label,
    input.language,
    humanizeToken(input.option.id),
  );
  const asset = resolveInstalledCatalogOptionIcon(input.gameId, input.imageKind, input.option.id);

  return {
    count: input.option.comboCount,
    countLabel: formatCountCopy(input.optionCountTemplate, input.option.comboCount),
    disabledReason: input.option.available ? undefined : input.noOptionData,
    id: input.option.id,
    imageAlt: asset?.accessibleLabel,
    imageSrc: asset?.src,
    label,
    shortLabel: input.option.shortLabel
      ? resolveLocalizedText(input.option.shortLabel, input.language, label)
      : undefined,
  };
}

function pickerSlots(options: readonly InstalledCatalogOption[]): readonly PickerSlot[] {
  return options.map((option) => ({
    column: option.slot?.column ?? 1,
    optionId: option.id,
    responsiveOrder: option.slot?.responsiveOrder ?? option.order,
    row: option.slot?.row ?? option.order,
    slotId: option.slot?.slotId ?? `catalog-${option.id}`,
    status: option.available
      ? pickerSlotStatuses.selectable
      : pickerSlotStatuses.disabledUnavailable,
  }));
}

function filterLabel(filterId: string, copy: AppCopy["catalog"]): string {
  return copy.filterLabels[filterId] ?? humanizeToken(filterId);
}

const filterChipPluralRules: Readonly<Record<LanguageCode, Intl.PluralRules>> = {
  [languageCodes.EN]: new Intl.PluralRules("en"),
  [languageCodes.UA]: new Intl.PluralRules("uk"),
};

function meterFilterChipLabel(
  value: string,
  copy: AppCopy["catalog"],
  language: LanguageCode,
): string | undefined {
  if (!/^(?:0|[1-9][0-9]*)$/u.test(value)) {
    return undefined;
  }

  const count = Number(value);
  if (!Number.isSafeInteger(count)) {
    return undefined;
  }

  const labels = copy.filterChipMeterLabels;
  if (count === 0) {
    return labels.zero;
  }

  const pluralCategory = filterChipPluralRules[language].select(count);
  const template =
    pluralCategory === "one"
      ? labels.one
      : pluralCategory === "few"
        ? labels.few
        : pluralCategory === "many"
          ? labels.many
          : labels.other;

  return formatCountCopy(template, count);
}

function filterChipLabel(
  filterId: string,
  value: string,
  optionLabel: string,
  copy: AppCopy["catalog"],
  language: LanguageCode,
): string {
  if (filterId === "meter") {
    const meterLabel = meterFilterChipLabel(value, copy, language);
    if (meterLabel) {
      return meterLabel;
    }
  }

  const semanticValue =
    filterId === "interactable" ? value.slice(value.lastIndexOf(":") + 1) || value : value;

  return copy.filterChipLabels[filterId]?.[semanticValue] ?? optionLabel;
}

export function resolveCatalogValueTone(fieldId: string, rawValue: string): UiToneMode | undefined {
  if (fieldId === "difficulty") {
    return catalogDifficultyToneByValue[rawValue as keyof typeof catalogDifficultyToneByValue];
  }

  if (fieldId === "routeClass" || fieldId === "routeType") {
    return catalogRouteToneByValue[rawValue as keyof typeof catalogRouteToneByValue];
  }

  return undefined;
}

function normalizeFacets(
  facets: readonly InstalledCatalogFacet[],
  copy: AppCopy["catalog"],
  gameId: GameId,
  language: LanguageCode,
): Readonly<{ activeFilters: readonly ActiveFilterChip[]; facets: readonly FilterFacet[] }> {
  const activeFilters: ActiveFilterChip[] = [];
  const preparedFacets: FilterFacet[] = [];

  for (const facet of facets) {
    const label = filterLabel(facet.id, copy);

    const options = facet.options.map((option) => {
      const accessibleOptionLabel = localizedValue(
        option.id,
        localizedFacetValue(option.label, language, humanizeToken(option.id)),
        copy,
      );
      const optionLabel = option.shortLabel
        ? localizedFacetValue(option.shortLabel, language, accessibleOptionLabel)
        : accessibleOptionLabel;
      const asset = facet.imageKind
        ? resolveInstalledCatalogOptionIcon(gameId, facet.imageKind, option.id)
        : undefined;
      const tone = resolveCatalogValueTone(facet.id, option.id);

      if (option.selected) {
        const chipLabel = filterChipLabel(facet.id, option.id, optionLabel, copy, language);

        activeFilters.push({
          filterId: facet.id,
          id: `${facet.id}-${option.id}`,
          label: chipLabel,
          removeLabel: copy.removeFilter.replaceAll("{filter}", `${label}: ${chipLabel}`),
          ...(tone ? { tone } : {}),
          value: option.id,
        });
      }

      return {
        ...(accessibleOptionLabel === optionLabel
          ? {}
          : { accessibleLabel: accessibleOptionLabel }),
        available: !option.disabled,
        count: option.count,
        countLabel: formatCountCopy(copy.comboCount, option.count),
        disabledReason: option.disabledReason
          ? localizedFacetValue(option.disabledReason, language, copy.noOptionData)
          : option.count === 0 && !option.selected
            ? copy.noOptionData
            : undefined,
        id: option.id,
        imageAlt: asset?.accessibleLabel,
        imageSrc: asset?.src,
        label: optionLabel,
        ...(tone ? { tone } : {}),
      };
    });

    preparedFacets.push({
      id: facet.id,
      kind:
        facet.kind === "singleSelect"
          ? filterFacetKinds.singleChoice
          : filterFacetKinds.multiChoice,
      label,
      message:
        options.length === 0 ? copy.emptyFilterOptions.replaceAll("{filter}", label) : undefined,
      options,
      presentation:
        facet.presentation === "visual"
          ? filterChoicePresentations.visual
          : filterChoicePresentations.compact,
      selectedValues: facet.options.filter((option) => option.selected).map((option) => option.id),
    });
  }

  return { activeFilters, facets: preparedFacets };
}

function localizedNotes(
  notes: LocalizedText | undefined,
  language: LanguageCode,
): string | undefined {
  if (!notes) {
    return undefined;
  }

  return resolveLocalizedText(notes, language, "") || undefined;
}

function summaryMetadata(
  metadata: InstalledCatalogSummary["metadata"],
  copy: AppCopy["catalog"],
): readonly ComponentLabelValue[] {
  const items: ComponentLabelValue[] = [];

  if (metadata.damage !== undefined) {
    items.push({ id: "damage", label: copy.damageLabel, value: String(metadata.damage) });
  }
  if (metadata.meter !== undefined) {
    items.push({ id: "meter", label: copy.meterLabel, value: String(metadata.meter) });
  }
  if (metadata.position) {
    items.push({
      id: "position",
      label: copy.positionLabel,
      value: localizedValue(metadata.position, humanizeToken(metadata.position), copy),
    });
  }
  if (metadata.difficulty) {
    const tone = resolveCatalogValueTone("difficulty", metadata.difficulty);
    items.push({
      id: "difficulty",
      label: copy.difficultyLabel,
      ...(tone ? { tone } : {}),
      value: localizedValue(metadata.difficulty, humanizeToken(metadata.difficulty), copy),
    });
  }
  if (metadata.routeType) {
    const tone = resolveCatalogValueTone("routeType", metadata.routeType);
    items.push({
      id: "routeType",
      label: copy.routeTypeLabel,
      ...(tone ? { tone } : {}),
      value: localizedValue(metadata.routeType, humanizeToken(metadata.routeType), copy),
    });
  }

  return items;
}

function summaryCard(
  summary: InstalledCatalogSummary,
  contextKind: CatalogContextKind,
  language: LanguageCode,
  copy: AppCopy["catalog"],
): ComboCardModel {
  const title = resolveLocalizedText(summary.title, language, copy.title);
  const notation = summary.routeSteps.map((step) => step.notation);

  return {
    actions: [
      {
        available: true,
        id: "view-combo",
        kind: comboCardActionKinds.openDetail,
        label: copy.viewCombo,
      },
    ],
    summary: {
      accessibleLabel: title,
      contextItems: [
        {
          id: "character",
          label: copy.characterLabel,
          value: resolveLocalizedText(
            summary.character.label,
            language,
            humanizeToken(summary.character.id),
          ),
        },
        {
          id: contextKind,
          label: copy.gameContextByKind[contextKind],
          value: resolveLocalizedText(
            summary.specification.label,
            language,
            humanizeToken(summary.specification.id),
          ),
        },
      ],
      metadataItems: [
        ...summaryMetadata(summary.metadata, copy),
        {
          id: "source",
          label: copy.sourceLabel,
          value: localizedValue(summary.provenance, humanizeToken(summary.provenance), copy),
        },
      ],
      notation: notation.length > 0 ? notation : summary.cachedNotation,
      notesSnippet: localizedNotes(summary.notes, language),
      ref: summary.ref,
      routeSteps: summary.routeSteps,
      title,
    },
  };
}

function normalizedOptions(
  input: Readonly<{
    adapter: InstalledGameCatalogAdapter;
    copy: AppCopy["catalog"];
    kind: "character" | "kameo" | "variation";
    language: LanguageCode;
    options: readonly InstalledCatalogOption[];
  }>,
): readonly PickerOption[] {
  return input.options.map((option) =>
    pickerOption({
      gameId: input.adapter.gameId,
      imageKind: input.kind,
      language: input.language,
      noOptionData: input.copy.noOptionData,
      option,
      optionCountTemplate: input.copy.comboCount,
    }),
  );
}

export function resolveCatalogSnapshot(input: ResolveCatalogSnapshotInput): CatalogSnapshot {
  const selection = input.adapter.resolvePath({
    characterSlug: input.characterSlug,
    search: input.search,
    specificationSlug: input.specificationSlug,
  });
  const characterSourceOptions = input.adapter.characterOptions();
  const specificationSourceOptions = selection.characterId
    ? input.adapter.specificationOptions(selection.characterId)
    : [];
  const characterOptions = normalizedOptions({
    adapter: input.adapter,
    copy: input.copy,
    kind: "character",
    language: input.language,
    options: characterSourceOptions,
  });
  const contextOptions = normalizedOptions({
    adapter: input.adapter,
    copy: input.copy,
    kind: input.adapter.contextKind,
    language: input.language,
    options: specificationSourceOptions,
  });
  const rawFacets =
    selection.status === installedCatalogSelectionStatuses.ready
      ? input.adapter.getFilterFacets(selection)
      : [];
  const preparedFacets = normalizeFacets(
    rawFacets,
    input.copy,
    input.adapter.gameId,
    input.language,
  );
  const summaries =
    selection.status === installedCatalogSelectionStatuses.ready
      ? input.adapter.selectSummaries(selection)
      : [];

  return {
    ...preparedFacets,
    canonicalSearch: parseCatalogSearch(selection.canonicalSearch),
    cards: summaries.map((summary) =>
      summaryCard(summary, input.adapter.contextKind, input.language, input.copy),
    ),
    characterId: selection.characterId,
    characterOptions,
    characterSlots: pickerSlots(characterSourceOptions),
    characterSlug: selection.characterSlug,
    contextId: selection.specificationId,
    contextKind: input.adapter.contextKind,
    contextOptions,
    contextSlots: pickerSlots(specificationSourceOptions),
    contextSlug: selection.specificationSlug,
    facets: preparedFacets.facets,
    filters: selection.filters,
    messages: selection.messages,
    rawContext: selection.rawContext,
    restoreFailed: false,
    selection,
    selectionStatus: selection.status,
  };
}

export function applyCatalogFilterChange(
  adapter: InstalledGameCatalogAdapter,
  selection: InstalledCatalogSelection,
  change: CatalogFilterChange,
): CatalogSearch {
  return parseCatalogSearch(adapter.applyFilterChange(selection, change).canonicalSearch);
}

export function catalogSearchKey(search: CatalogSearch): string {
  return JSON.stringify(
    Object.entries(search)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]),
  );
}

export function isCatalogNavigationBusy(
  input: Readonly<{
    canonicalSearchKey: string;
    incomingSearchKey: string;
    pending: boolean;
  }>,
): boolean {
  return input.pending || input.incomingSearchKey !== input.canonicalSearchKey;
}

export function saveCatalogSnapshot(
  adapter: InstalledGameCatalogAdapter,
  slice: unknown,
  snapshot: CatalogSnapshot,
) {
  return adapter.saveLastCatalog(slice, snapshot.selection);
}
