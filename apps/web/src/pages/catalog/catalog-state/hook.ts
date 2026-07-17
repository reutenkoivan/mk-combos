import type { CatalogFilterChange } from "@mk-combos/contracts/catalog-filter/type";
import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import type { ComboRef } from "@mk-combos/contracts/identity/type";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  type ComboListIntent,
  type ComboListProps,
  comboListActions,
  comboListStates,
} from "@mk-combos/ui/components/combo-list";
import {
  type FilterControlGroupIntent,
  type FilterControlGroupProps,
  filterControlFocusIds,
  filterControlGroupActions,
} from "@mk-combos/ui/components/filter-control-group";
import { comboPresentationModes } from "@mk-combos/ui/components/value";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  useControllerCommandScope,
  useControllerSessionObservableState,
} from "../../../app/controller-session/provider";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayers,
} from "../../../app/controller-session/value";
import {
  useLocalStateObservableState,
  useLocalStateSource,
} from "../../../app/local-state/provider";
import { localStatePersistenceStatuses } from "../../../app/local-state/value";
import { formatCountCopy, getAppCopy } from "../../../app/localization/runtime";
import { useAppResponsiveMode } from "../../../app/providers/provider";
import { useActiveGameBusiness } from "../../../game-business/active-game/provider";
import { installedCatalogSelectionStatuses } from "../../../game-business/installed-games/catalog-adapter/type";
import { resolveInstalledGameCatalogAdapter } from "../../../game-business/installed-games/runtime";
import {
  createCatalogFilterControllerTargets,
  resolveFilterFocusIndex,
  resolveLinearFocusIndex,
} from "../controller/runtime";
import type { CatalogSearch } from "../search/type";
import {
  applyCatalogFilterChange,
  catalogSearchKey,
  isCatalogNavigationBusy,
  prepareCatalogCommandCard,
  resolveCatalogSnapshot,
  saveCatalogSnapshot,
} from "./runtime";

const catalogSurface = "catalog-result";
const navigationCommandIds = [
  knownControllerCommandIds.navUp,
  knownControllerCommandIds.navDown,
  knownControllerCommandIds.navLeft,
  knownControllerCommandIds.navRight,
] as const;

type UseCatalogStateInput = Readonly<{
  characterSlug: string;
  preservedSearch: CatalogSearch;
  search: CatalogSearch;
  specificationSlug: string;
}>;

function resolveActiveFilterRemovalChange(
  snapshot: Pick<ReturnType<typeof resolveCatalogSnapshot>, "activeFilters" | "facets">,
  intent: Pick<FilterControlGroupIntent, "filterId" | "value">,
): CatalogFilterChange | undefined {
  if (!intent.filterId || intent.value === undefined) {
    return undefined;
  }

  const chip = snapshot.activeFilters.find(
    (candidate) => candidate.filterId === intent.filterId && candidate.value === intent.value,
  );

  if (!chip) {
    return undefined;
  }

  const facet = snapshot.facets.find((candidate) => candidate.id === chip.filterId);

  if (!facet) {
    return undefined;
  }

  const selectedOptionExists = facet.options.some(
    (option) => option.id === chip.value && facet.selectedValues.includes(option.id),
  );

  if (!selectedOptionExists) {
    return undefined;
  }

  return {
    filterId: chip.filterId,
    kind: catalogFilterChangeKinds.toggleOption,
    selected: false,
    value: chip.value,
  };
}

export function useCatalogState(input: UseCatalogStateInput) {
  const business = useActiveGameBusiness();
  const controllerSession = useControllerSessionObservableState();
  const adapter = resolveInstalledGameCatalogAdapter(business.id);

  if (!adapter) {
    throw new Error(`Missing catalog adapter for installed game ${business.id}.`);
  }

  const localState = useLocalStateObservableState();
  const localStateSource = useLocalStateSource();
  const responsiveMode = useAppResponsiveMode();
  const navigate = useNavigate();
  const [pending, beginNavigation] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftSearch, setDraftSearch] = useState<CatalogSearch>(input.search);
  const [saveWarning, setSaveWarning] = useState(false);
  const [focusedComboIndex, setFocusedComboIndex] = useState(0);
  const [focusedFilterTargetId, setFocusedFilterTargetId] = useState<string>(
    filterControlFocusIds.discard,
  );
  const savedCatalogKey = useRef<string | undefined>(undefined);
  const language = localState.appliedSettings.language;
  const copy = getAppCopy(language).catalog;
  const slice = localState.games[business.id];
  const appliedSnapshot = useMemo(
    () =>
      resolveCatalogSnapshot({
        adapter,
        characterSlug: input.characterSlug,
        copy,
        language,
        search: input.search,
        specificationSlug: input.specificationSlug,
      }),
    [adapter, copy, input.characterSlug, input.search, input.specificationSlug, language],
  );
  const previewSnapshot = useMemo(
    () =>
      filtersOpen
        ? resolveCatalogSnapshot({
            adapter,
            characterSlug: input.characterSlug,
            copy,
            language,
            search: draftSearch,
            specificationSlug: input.specificationSlug,
          })
        : appliedSnapshot,
    [
      adapter,
      appliedSnapshot,
      copy,
      draftSearch,
      filtersOpen,
      input.characterSlug,
      input.specificationSlug,
      language,
    ],
  );
  const incomingSearchKey = catalogSearchKey(input.search);
  const canonicalSearchKey = catalogSearchKey(appliedSnapshot.canonicalSearch);
  const unknownOnlySearch =
    Object.keys(input.search).length > 0 &&
    Object.keys(input.search).every((key) => !adapter.filterSearchKeys.includes(key));
  const canonicalPersistenceKey = `${business.id}:${input.characterSlug}:${input.specificationSlug}:${canonicalSearchKey}`;
  const navigationBusy = isCatalogNavigationBusy({
    canonicalSearchKey,
    incomingSearchKey,
    pending,
  });

  const navigateToResult = useCallback(
    (search: CatalogSearch, replace = true) =>
      navigate({
        params: {
          character: input.characterSlug,
          gameId: business.id,
          specification: input.specificationSlug,
        },
        replace,
        search: { ...input.preservedSearch, ...search },
        to: "/$gameId/catalog/$character/$specification",
      }),
    [business.id, input.characterSlug, input.preservedSearch, input.specificationSlug, navigate],
  );

  useEffect(() => {
    if (
      appliedSnapshot.selectionStatus === installedCatalogSelectionStatuses.ready &&
      incomingSearchKey !== canonicalSearchKey
    ) {
      if (unknownOnlySearch) {
        savedCatalogKey.current = canonicalPersistenceKey;
      }
      beginNavigation(() => navigateToResult(appliedSnapshot.canonicalSearch));
    }
  }, [
    appliedSnapshot.canonicalSearch,
    appliedSnapshot.selectionStatus,
    canonicalSearchKey,
    incomingSearchKey,
    navigateToResult,
    canonicalPersistenceKey,
    unknownOnlySearch,
  ]);

  const persistSnapshot = useCallback(
    (snapshot: typeof appliedSnapshot) => {
      if (snapshot.selectionStatus !== installedCatalogSelectionStatuses.ready) {
        return false;
      }

      const preparedSlice = saveCatalogSnapshot(adapter, slice, snapshot);

      if (!preparedSlice.ok) {
        setSaveWarning(true);
        return false;
      }

      const result = localStateSource.replaceGameSlice(business.id, preparedSlice.value);
      const persistent =
        result.ok && result.persistenceStatus === localStatePersistenceStatuses.persistent;
      setSaveWarning(!persistent);
      return result.ok;
    },
    [adapter, business.id, localStateSource, slice],
  );

  useEffect(() => {
    if (
      appliedSnapshot.selectionStatus !== installedCatalogSelectionStatuses.ready ||
      incomingSearchKey !== canonicalSearchKey
    ) {
      return;
    }

    const key = canonicalPersistenceKey;

    if (savedCatalogKey.current === key) {
      return;
    }

    savedCatalogKey.current = key;
    persistSnapshot(appliedSnapshot);
  }, [
    appliedSnapshot,
    canonicalSearchKey,
    canonicalPersistenceKey,
    incomingSearchKey,
    persistSnapshot,
  ]);

  const openFilters = useCallback(() => {
    setDraftSearch(appliedSnapshot.canonicalSearch);
    setFocusedFilterTargetId(filterControlFocusIds.discard);
    setFiltersOpen(true);
  }, [appliedSnapshot]);

  const discardDraftFilters = useCallback(() => {
    setDraftSearch(appliedSnapshot.canonicalSearch);
    setFiltersOpen(false);
  }, [appliedSnapshot]);

  const applyDraftChange = useCallback(
    (change: Parameters<typeof applyCatalogFilterChange>[2]) => {
      setDraftSearch(applyCatalogFilterChange(adapter, previewSnapshot.selection, change));
    },
    [adapter, previewSnapshot.selection],
  );

  const commitAppliedFilterChange = useCallback(
    (change: CatalogFilterChange) => {
      const search = applyCatalogFilterChange(adapter, appliedSnapshot.selection, change);
      beginNavigation(() => navigateToResult(search));
    },
    [adapter, appliedSnapshot.selection, navigateToResult],
  );

  const handleFilterAction = useCallback(
    (intent: FilterControlGroupIntent) => {
      switch (intent.action) {
        case filterControlGroupActions.openFilterGroup:
          openFilters();
          return;
        case filterControlGroupActions.discardDraftFilters:
          discardDraftFilters();
          return;
        case filterControlGroupActions.applyFilters:
          beginNavigation(async () => {
            await navigateToResult(draftSearch);
            setFiltersOpen(false);
          });
          return;
        case filterControlGroupActions.resetDraftFilters:
          applyDraftChange({ kind: catalogFilterChangeKinds.clearAll });
          return;
        case filterControlGroupActions.clearAppliedFilters:
          commitAppliedFilterChange({ kind: catalogFilterChangeKinds.clearAll });
          return;
        case filterControlGroupActions.removeAppliedFilter: {
          const change = resolveActiveFilterRemovalChange(appliedSnapshot, intent);

          if (change) {
            commitAppliedFilterChange(change);
          }
          return;
        }
        case filterControlGroupActions.removeDraftFilter: {
          const change = resolveActiveFilterRemovalChange(previewSnapshot, intent);

          if (!change) {
            return;
          }

          applyDraftChange(change);
          return;
        }
        case filterControlGroupActions.toggleDraftOption:
          if (!intent.filterId) {
            return;
          }
          if (intent.value !== undefined && intent.selected !== undefined) {
            applyDraftChange({
              filterId: intent.filterId,
              kind: catalogFilterChangeKinds.toggleOption,
              selected: intent.selected,
              value: intent.value,
            });
          }
          return;
      }
    },
    [
      appliedSnapshot,
      applyDraftChange,
      commitAppliedFilterChange,
      discardDraftFilters,
      draftSearch,
      navigateToResult,
      openFilters,
      previewSnapshot,
    ],
  );

  const openDetail = useCallback(
    (ref: ComboRef) => {
      beginNavigation(async () => {
        await navigate({
          params: {
            character: input.characterSlug,
            comboId: ref.comboId,
            gameId: business.id,
            specification: input.specificationSlug,
          },
          search: {},
          to: "/$gameId/catalog/$character/$specification/$comboId",
        });
      });
    },
    [business.id, input.characterSlug, input.specificationSlug, navigate],
  );

  const handleListAction = useCallback(
    (intent: ComboListIntent) => {
      if (filtersOpen) {
        return;
      }

      switch (intent.action) {
        case comboListActions.openComboDetail:
          if (intent.comboRef) {
            openDetail(intent.comboRef);
          }
          return;
        case comboListActions.clearFilters:
          beginNavigation(() => navigateToResult({}));
          return;
        case comboListActions.focusCombo:
          if (intent.comboRef) {
            const index = appliedSnapshot.cards.findIndex(
              (card) =>
                card.summary.ref.comboId === intent.comboRef?.comboId &&
                card.summary.ref.source === intent.comboRef.source,
            );

            if (index >= 0) {
              setFocusedComboIndex(index);
            }
          }
          return;
        case comboListActions.addToList:
        case comboListActions.duplicateToCustomCombo:
        case comboListActions.openComboActions:
        case comboListActions.returnFocusToConfig:
          return;
      }
    },
    [appliedSnapshot.cards, filtersOpen, navigateToResult, openDetail],
  );

  const visibleSnapshot = filtersOpen ? previewSnapshot : appliedSnapshot;
  const boundedFocusedComboIndex = Math.min(
    Math.max(0, focusedComboIndex),
    Math.max(0, visibleSnapshot.cards.length - 1),
  );
  const preparedFacets = visibleSnapshot.facets;
  const filterControllerTargets = createCatalogFilterControllerTargets({
    clearAvailable: visibleSnapshot.activeFilters.length > 0,
    facets: preparedFacets,
    responsiveMode,
  });
  const requestedFilterFocusIndex = filterControllerTargets.findIndex(
    (target) => target.id === focusedFilterTargetId,
  );
  const boundedFilterFocusIndex = requestedFilterFocusIndex >= 0 ? requestedFilterFocusIndex : 0;
  const focusedFilterTarget = filterControllerTargets[boundedFilterFocusIndex];
  const filters: FilterControlGroupProps = {
    applied: {
      activeFilters: appliedSnapshot.activeFilters,
      activeFiltersLabel: copy.activeFiltersLabel,
      clearLabel: copy.clearFilters,
      resultCountLabel: formatCountCopy(copy.resultCount, appliedSnapshot.cards.length),
    },
    busy: navigationBusy,
    controllerFocusedControlId:
      controllerSession.connected && filtersOpen ? focusedFilterTarget?.id : undefined,
    disabled: visibleSnapshot.selectionStatus !== installedCatalogSelectionStatuses.ready,
    draft: {
      activeFilters: visibleSnapshot.activeFilters,
      activeFiltersLabel: copy.activeFiltersLabel,
      applyLabel: copy.applyFilters,
      discardLabel: copy.discardFilterChanges,
      facets: preparedFacets,
      loadingLabel: copy.loadingFilters,
      resetLabel: copy.resetFilters,
      resultCountLabel: formatCountCopy(copy.resultCount, visibleSnapshot.cards.length),
    },
    label: copy.filtersLabel,
    onRequestAction: handleFilterAction,
    open: filtersOpen,
    responsiveMode,
    sourceSurface: catalogSurface,
  };

  let listState: ComboListProps["state"];
  let emptyState: ComboListProps["emptyState"];

  if (visibleSnapshot.cards.length === 0 && visibleSnapshot.activeFilters.length > 0) {
    listState = comboListStates.noFilterResults;
    emptyState = {
      actions: [
        {
          available: true,
          id: comboListActions.clearFilters,
          label: copy.clearFilters,
        },
      ],
      message: copy.noFilterResultsDescription,
      stateToken: "catalog-no-filter-results",
      title: copy.noFilterResultsTitle,
    };
  } else if (visibleSnapshot.cards.length === 0) {
    listState = comboListStates.noCombos;
    emptyState = {
      actions: [],
      message: copy.noCombosDescription,
      stateToken: "catalog-no-combos",
      title: copy.noCombosTitle,
    };
  } else {
    listState =
      visibleSnapshot.activeFilters.length > 0
        ? comboListStates.filteredList
        : comboListStates.comboListReady;
  }

  const list: ComboListProps = {
    accessibleLabel: copy.combosLabel,
    disabledReason: navigationBusy ? copy.loadingFilters : undefined,
    emptyState,
    items: visibleSnapshot.cards.map((card, index) => ({
      ...prepareCatalogCommandCard(card),
      focused: controllerSession.connected && !filtersOpen && index === boundedFocusedComboIndex,
    })),
    notationDisplayMode: localState.appliedSettings.notationDisplayMode,
    onRequestAction: handleListAction,
    presentation: comboPresentationModes.commandDeck,
    sourceSurface: catalogSurface,
    state:
      navigationBusy && visibleSnapshot.cards.length > 0
        ? comboListStates.loadingCombos
        : listState,
    statusMessage:
      visibleSnapshot.messages.length > 0 && !navigationBusy ? copy.recoveryWarning : undefined,
  };
  const changeCharacter = useCallback(() => {
    beginNavigation(() =>
      navigate({
        params: { gameId: business.id },
        search: {},
        to: "/$gameId/catalog",
      }),
    );
  }, [business.id, navigate]);

  const changeSpecification = useCallback(() => {
    beginNavigation(() =>
      navigate({
        params: { character: input.characterSlug, gameId: business.id },
        search: {},
        to: "/$gameId/catalog/$character",
      }),
    );
  }, [business.id, input.characterSlug, navigate]);

  useEffect(() => {
    if (focusedComboIndex !== boundedFocusedComboIndex) {
      setFocusedComboIndex(boundedFocusedComboIndex);
    }
    if (focusedFilterTarget && focusedFilterTarget.id !== focusedFilterTargetId) {
      setFocusedFilterTargetId(focusedFilterTarget.id);
    }
  }, [boundedFocusedComboIndex, focusedComboIndex, focusedFilterTarget, focusedFilterTargetId]);

  const invalidCharacter =
    appliedSnapshot.selectionStatus === installedCatalogSelectionStatuses.invalidCharacter;
  const invalidSpecification =
    appliedSnapshot.selectionStatus === installedCatalogSelectionStatuses.invalidSpecification;
  const invalidSelection = invalidCharacter || invalidSpecification;
  const resultHasCards = appliedSnapshot.cards.length > 0;
  const resultHasActiveFilters = appliedSnapshot.activeFilters.length > 0;
  const focusedFilterConfirmLabel = (() => {
    if (!focusedFilterTarget) {
      return undefined;
    }

    if (focusedFilterTarget.kind === "option") {
      const facet = preparedFacets.find(
        (candidate) => candidate.id === focusedFilterTarget.filterId,
      );
      const option = facet?.options.find((candidate) => candidate.id === focusedFilterTarget.value);
      return (
        option?.label ?? copy.valueLabels[focusedFilterTarget.value] ?? focusedFilterTarget.value
      );
    }

    switch (focusedFilterTarget.action) {
      case "apply":
        return copy.applyFilters;
      case "reset":
        return copy.resetFilters;
      case "discard":
        return copy.discardFilterChanges;
    }
  })();

  useControllerCommandScope({
    commandIds: invalidSelection
      ? [knownControllerCommandIds.confirm]
      : [
          ...(resultHasCards ? [...navigationCommandIds, knownControllerCommandIds.confirm] : []),
          knownControllerCommandIds.back,
          knownControllerCommandIds.openFilters,
          ...(resultHasActiveFilters ? [knownControllerCommandIds.openActions] : []),
        ],
    enabled: !navigationBusy && !filtersOpen,
    handleCommand: (event) => {
      if (invalidSelection) {
        if (event.commandId !== knownControllerCommandIds.confirm) {
          return false;
        }
        if (invalidCharacter) {
          changeCharacter();
        } else {
          changeSpecification();
        }
        return true;
      }

      switch (event.commandId) {
        case knownControllerCommandIds.navDown:
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navRight:
        case knownControllerCommandIds.navUp:
          setFocusedComboIndex((currentIndex) =>
            resolveLinearFocusIndex({
              commandId: event.commandId,
              currentIndex,
              itemCount: appliedSnapshot.cards.length,
            }),
          );
          return resultHasCards;
        case knownControllerCommandIds.confirm: {
          const focusedCard = appliedSnapshot.cards[boundedFocusedComboIndex];

          if (!focusedCard) {
            return false;
          }

          openDetail(focusedCard.summary.ref);
          return true;
        }
        case knownControllerCommandIds.back:
          changeSpecification();
          return true;
        case knownControllerCommandIds.openFilters:
          openFilters();
          return true;
        case knownControllerCommandIds.openActions:
          if (!resultHasActiveFilters) {
            return false;
          }
          beginNavigation(() => navigateToResult({}));
          return true;
        default:
          return false;
      }
    },
    id: `catalog-${business.id}-result`,
    layer: controllerCommandScopeLayers.page,
    ribbon: {
      accessibleLabel: `${business.label} ${copy.title}`,
      commands: invalidSelection
        ? [
            {
              commandIds: [knownControllerCommandIds.confirm],
              id: "catalog-recover",
              label: invalidCharacter ? copy.backToCharacter : copy.chooseContextTitle,
            },
          ]
        : [
            ...(resultHasCards
              ? [
                  {
                    commandIds: navigationCommandIds,
                    id: "catalog-navigation",
                    label: copy.navigateCommand,
                  },
                  {
                    commandIds: [knownControllerCommandIds.confirm],
                    id: "catalog-view-combo",
                    label: copy.viewCombo,
                  },
                ]
              : []),
            {
              commandIds: [knownControllerCommandIds.back],
              id: "catalog-change-context",
              label: copy.changeContext,
            },
            {
              commandIds: [knownControllerCommandIds.openFilters],
              id: "catalog-filters",
              label: copy.filtersLabel,
            },
            ...(resultHasActiveFilters
              ? [
                  {
                    commandIds: [knownControllerCommandIds.openActions],
                    id: "catalog-clear-filters",
                    label: copy.clearFilters,
                  },
                ]
              : []),
          ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  });

  useControllerCommandScope({
    commandIds: [
      ...navigationCommandIds,
      ...(focusedFilterConfirmLabel ? [knownControllerCommandIds.confirm] : []),
      knownControllerCommandIds.back,
      knownControllerCommandIds.openFilters,
      ...(visibleSnapshot.activeFilters.length > 0 ? [knownControllerCommandIds.openActions] : []),
    ],
    enabled:
      !navigationBusy &&
      filtersOpen &&
      appliedSnapshot.selectionStatus === installedCatalogSelectionStatuses.ready,
    exclusive: true,
    handleCommand: (event) => {
      switch (event.commandId) {
        case knownControllerCommandIds.navDown:
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navRight:
        case knownControllerCommandIds.navUp:
          setFocusedFilterTargetId((currentTargetId) => {
            const currentIndex = filterControllerTargets.findIndex(
              (target) => target.id === currentTargetId,
            );
            const nextIndex = resolveFilterFocusIndex({
              commandId: event.commandId,
              currentIndex,
              targets: filterControllerTargets,
            });

            return filterControllerTargets[nextIndex]?.id ?? currentTargetId;
          });
          return filterControllerTargets.length > 0;
        case knownControllerCommandIds.confirm:
          if (!focusedFilterTarget) {
            return false;
          }
          if (focusedFilterTarget.kind === "option") {
            applyDraftChange({
              filterId: focusedFilterTarget.filterId,
              kind: catalogFilterChangeKinds.toggleOption,
              selected: !focusedFilterTarget.selected,
              value: focusedFilterTarget.value,
            });
            return true;
          }
          if (focusedFilterTarget.action === "discard") {
            discardDraftFilters();
            return true;
          }
          if (focusedFilterTarget.action === "reset") {
            applyDraftChange({ kind: catalogFilterChangeKinds.clearAll });
            return true;
          }
          beginNavigation(async () => {
            await navigateToResult(draftSearch);
            setFiltersOpen(false);
          });
          return true;
        case knownControllerCommandIds.back:
          discardDraftFilters();
          return true;
        case knownControllerCommandIds.openFilters:
          discardDraftFilters();
          return true;
        case knownControllerCommandIds.openActions:
          if (visibleSnapshot.activeFilters.length === 0) {
            return false;
          }
          applyDraftChange({ kind: catalogFilterChangeKinds.clearAll });
          return true;
        default:
          return false;
      }
    },
    id: `catalog-${business.id}-filter-drawer`,
    layer: controllerCommandScopeLayers.overlay,
    passThroughCommandIds: [knownControllerCommandIds.openGlobalMenu],
    ribbon: {
      accessibleLabel: copy.filtersLabel,
      commands: [
        {
          commandIds: navigationCommandIds,
          id: "catalog-filter-navigation",
          label: copy.navigateCommand,
        },
        ...(focusedFilterConfirmLabel
          ? [
              {
                commandIds: [knownControllerCommandIds.confirm],
                id: "catalog-filter-confirm",
                label: focusedFilterConfirmLabel,
              },
            ]
          : []),
        {
          commandIds: [knownControllerCommandIds.back],
          id: "catalog-filter-discard",
          label: copy.discardFilterChanges,
        },
        {
          commandIds: [knownControllerCommandIds.openFilters],
          id: "catalog-filter-close",
          label: copy.discardFilterChanges,
        },
        ...(visibleSnapshot.activeFilters.length > 0
          ? [
              {
                commandIds: [knownControllerCommandIds.openActions],
                id: "catalog-filter-clear",
                label: copy.resetFilters,
              },
            ]
          : []),
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  });

  return {
    changeCharacter,
    changeSpecification,
    copy,
    filters,
    filtersOpen,
    invalidCharacter,
    invalidSpecification,
    list,
    persistenceWarning:
      saveWarning || localState.persistenceStatus === localStatePersistenceStatuses.sessionOnly,
  };
}
