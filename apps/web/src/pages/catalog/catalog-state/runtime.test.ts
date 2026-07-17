import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import { languageCodes } from "@mk-combos/contracts/settings/value";
import {
  filterChoicePresentations,
  filterFacetKinds,
} from "@mk-combos/ui/components/filter-control-group";
import { uiToneModes } from "@mk-combos/ui/tokens/value";
import { describe, expect, it } from "vitest";

import { getAppCopy } from "../../../app/localization/runtime";
import type {
  InstalledCatalogFacet,
  InstalledGameCatalogAdapter,
} from "../../../game-business/installed-games/catalog-adapter/type";
import { installedCatalogSelectionStatuses } from "../../../game-business/installed-games/catalog-adapter/type";
import {
  installedGameCatalogAdapters,
  installedGames,
} from "../../../game-business/installed-games/value";
import {
  applyCatalogFilterChange,
  catalogSearchKey,
  isCatalogNavigationBusy,
  prepareCatalogCommandCard,
  resolveCatalogSnapshot,
  resolveCatalogValueTone,
  saveCatalogSnapshot,
} from "./runtime";

const copy = getAppCopy(languageCodes.EN).catalog;

function readyPath(adapter: InstalledGameCatalogAdapter) {
  const character = adapter.characterOptions().find((option) => option.available);

  if (!character) {
    throw new Error(`Expected ${adapter.gameId} character data.`);
  }

  const specification = adapter
    .specificationOptions(character.id)
    .find((option) => option.available);

  if (!specification) {
    throw new Error(`Expected ${adapter.gameId} specification data.`);
  }

  return { character, specification };
}

function readySnapshot(adapter: InstalledGameCatalogAdapter) {
  const path = readyPath(adapter);
  return {
    path,
    snapshot: resolveCatalogSnapshot({
      adapter,
      characterSlug: path.character.routeSlug,
      copy,
      language: languageCodes.EN,
      search: {},
      specificationSlug: path.specification.routeSlug,
    }),
  };
}

function snapshotWithFacets(
  adapter: InstalledGameCatalogAdapter,
  facets: readonly InstalledCatalogFacet[],
  language: (typeof languageCodes)[keyof typeof languageCodes],
) {
  const { path, snapshot } = readySnapshot(adapter);
  const syntheticAdapter: InstalledGameCatalogAdapter = {
    ...adapter,
    getFilterFacets: () => facets,
    resolvePath: () => snapshot.selection,
    selectSummaries: () => [],
  };

  return resolveCatalogSnapshot({
    adapter: syntheticAdapter,
    characterSlug: path.character.routeSlug,
    copy: getAppCopy(language).catalog,
    language,
    search: {},
    specificationSlug: path.specification.routeSlug,
  });
}

describe("catalog navigation state", () => {
  it("keeps controls busy until result search is canonicalized", () => {
    expect(
      isCatalogNavigationBusy({
        canonicalSearchKey: catalogSearchKey({ difficulty: ["easy"] }),
        incomingSearchKey: catalogSearchKey({}),
        pending: false,
      }),
    ).toBe(true);
    expect(
      isCatalogNavigationBusy({
        canonicalSearchKey: catalogSearchKey({}),
        incomingSearchKey: catalogSearchKey({}),
        pending: true,
      }),
    ).toBe(true);
    expect(
      isCatalogNavigationBusy({
        canonicalSearchKey: catalogSearchKey({}),
        incomingSearchKey: catalogSearchKey({}),
        pending: false,
      }),
    ).toBe(false);
  });
});

describe("catalog state runtime", () => {
  it("owns exact neutral filter chip copy separately from facet option copy", () => {
    expect(getAppCopy(languageCodes.EN).catalog.filterChipLabels).toEqual({
      difficulty: {
        easy: "Easy",
        hard: "Hard",
        medium: "Medium",
      },
      interactable: {
        "corner-attack": "Corner attack",
        "position-escape": "Position escape",
      },
      position: {
        antiAir: "Anti-air",
        corner: "In the corner",
        midscreen: "Center",
      },
      routeClass: {
        bnb: "Basic",
        kameo: "With Kameo",
        metered: "With meter",
        punish: "Punish",
        stage: "With a stage object",
      },
      source: {
        community: "From players",
        curated: "From editors",
        personal: "Mine",
      },
    });
    expect(getAppCopy(languageCodes.UA).catalog.filterChipLabels).toEqual({
      difficulty: {
        easy: "Легке",
        hard: "Складне",
        medium: "Середнє",
      },
      interactable: {
        "corner-attack": "Атака в куті",
        "position-escape": "Зміна позиції",
      },
      position: {
        antiAir: "Проти стрибка",
        corner: "У куті",
        midscreen: "По центру",
      },
      routeClass: {
        bnb: "Базове",
        kameo: "З камео",
        metered: "Зі шкалою",
        punish: "Покарання",
        stage: "З об’єктом арени",
      },
      source: {
        community: "Від гравців",
        curated: "Від редакції",
        personal: "Мої",
      },
    });
  });

  it("prepares category-free localized chips and qualified remove labels in every game", () => {
    const selectedOptions = (ids: readonly string[]) =>
      ids.map((id) => ({ count: 1, id, label: id, selected: true }));
    const facets: readonly InstalledCatalogFacet[] = [
      {
        id: "position",
        kind: "multiSelect",
        options: selectedOptions(["midscreen", "corner", "antiAir"]),
        presentation: "compact",
      },
      {
        id: "meter",
        kind: "multiSelect",
        options: selectedOptions(["0", "1", "2", "3", "21", "22", "25"]),
        presentation: "compact",
      },
      {
        id: "difficulty",
        kind: "multiSelect",
        options: selectedOptions(["easy", "medium", "hard"]),
        presentation: "compact",
      },
      {
        id: "routeClass",
        kind: "multiSelect",
        options: selectedOptions(["bnb", "kameo", "metered", "punish", "stage"]),
        presentation: "compact",
      },
      {
        id: "source",
        kind: "multiSelect",
        options: selectedOptions(["community", "curated", "personal"]),
        presentation: "compact",
      },
      {
        id: "stage",
        kind: "singleSelect",
        options: [
          {
            count: 1,
            id: "the-pit",
            label: { EN: "The Pit", UA: "Яма" },
            selected: true,
          },
        ],
        presentation: "visual",
      },
      {
        id: "interactable",
        kind: "multiSelect",
        options: selectedOptions(["crossroads:position-escape", "crossroads:corner-attack"]),
        presentation: "visual",
      },
      {
        id: "futureFacet",
        kind: "multiSelect",
        options: [
          {
            count: 1,
            id: "future-short",
            label: { EN: "Future full", UA: "Майбутнє повне" },
            selected: true,
            shortLabel: { EN: "Future short", UA: "Майбутнє" },
          },
          {
            count: 1,
            id: "future-full",
            label: { EN: "Future full", UA: "Майбутнє повне" },
            selected: true,
          },
        ],
        presentation: "compact",
      },
    ];
    const expectedByLanguage = {
      [languageCodes.EN]: {
        "difficulty-easy": "Easy",
        "difficulty-hard": "Hard",
        "difficulty-medium": "Medium",
        "futureFacet-future-full": "Future full",
        "futureFacet-future-short": "Future short",
        "interactable-crossroads:corner-attack": "Corner attack",
        "interactable-crossroads:position-escape": "Position escape",
        "meter-0": "No meter",
        "meter-1": "1 bar",
        "meter-2": "2 bars",
        "meter-3": "3 bars",
        "meter-21": "21 bars",
        "meter-22": "22 bars",
        "meter-25": "25 bars",
        "position-antiAir": "Anti-air",
        "position-corner": "In the corner",
        "position-midscreen": "Center",
        "routeClass-bnb": "Basic",
        "routeClass-kameo": "With Kameo",
        "routeClass-metered": "With meter",
        "routeClass-punish": "Punish",
        "routeClass-stage": "With a stage object",
        "source-community": "From players",
        "source-curated": "From editors",
        "source-personal": "Mine",
        "stage-the-pit": "The Pit",
      },
      [languageCodes.UA]: {
        "difficulty-easy": "Легке",
        "difficulty-hard": "Складне",
        "difficulty-medium": "Середнє",
        "futureFacet-future-full": "Майбутнє повне",
        "futureFacet-future-short": "Майбутнє",
        "interactable-crossroads:corner-attack": "Атака в куті",
        "interactable-crossroads:position-escape": "Зміна позиції",
        "meter-0": "Без шкали",
        "meter-1": "1 поділка",
        "meter-2": "2 поділки",
        "meter-3": "3 поділки",
        "meter-21": "21 поділка",
        "meter-22": "22 поділки",
        "meter-25": "25 поділок",
        "position-antiAir": "Проти стрибка",
        "position-corner": "У куті",
        "position-midscreen": "По центру",
        "routeClass-bnb": "Базове",
        "routeClass-kameo": "З камео",
        "routeClass-metered": "Зі шкалою",
        "routeClass-punish": "Покарання",
        "routeClass-stage": "З об’єктом арени",
        "source-community": "Від гравців",
        "source-curated": "Від редакції",
        "source-personal": "Мої",
        "stage-the-pit": "Яма",
      },
    } as const;

    for (const adapter of installedGameCatalogAdapters) {
      for (const language of Object.values(languageCodes)) {
        const snapshot = snapshotWithFacets(adapter, facets, language);
        const expected = expectedByLanguage[language];

        expect(
          Object.fromEntries(snapshot.activeFilters.map((chip) => [chip.id, chip.label])),
        ).toEqual(expected);
        expect(snapshot.activeFilters.every((chip) => !chip.label.includes(": "))).toBe(true);
        expect(snapshot.activeFilters.every((chip) => chip.removeLabel.includes(": "))).toBe(true);
        expect(
          snapshot.activeFilters.find((chip) => chip.id === "position-midscreen")?.removeLabel,
        ).toBe(
          language === languageCodes.EN
            ? "Remove filter “Position: Center”"
            : "Прибрати фільтр «Позиція: По центру»",
        );
      }
    }
  });

  it("uses one raw-value tone contract for route and difficulty metadata", () => {
    expect([
      resolveCatalogValueTone("difficulty", "easy"),
      resolveCatalogValueTone("difficulty", "medium"),
      resolveCatalogValueTone("difficulty", "hard"),
    ]).toEqual([uiToneModes.success, uiToneModes.warning, uiToneModes.destructive]);
    expect(resolveCatalogValueTone("routeClass", "bnb")).toBe(uiToneModes.success);
    expect(resolveCatalogValueTone("routeType", "metered")).toBe(uiToneModes.warning);
    expect(resolveCatalogValueTone("routeClass", "punish")).toBe(uiToneModes.destructive);
    expect(resolveCatalogValueTone("routeType", "stage")).toBe(uiToneModes.accent);
    expect(resolveCatalogValueTone("routeClass", "kameo")).toBe(uiToneModes.accent);
    expect(resolveCatalogValueTone("source", "curated")).toBeUndefined();
    expect(resolveCatalogValueTone("difficulty", "future-value")).toBeUndefined();
  });

  it("keeps active filter and localized row tones aligned in every installed game", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { path, snapshot: initial } = readySnapshot(adapter);

      for (const [filterId, metadataId] of [
        ["difficulty", "difficulty"],
        ["routeClass", "routeType"],
      ] as const) {
        const facet = initial.facets.find((candidate) => candidate.id === filterId);

        expect(facet?.kind).toBe(filterFacetKinds.multiChoice);
        if (!facet || facet.kind !== filterFacetKinds.multiChoice) {
          continue;
        }

        const option = facet.options.find((candidate) => candidate.available);
        expect(option).toBeTruthy();
        if (!option) {
          continue;
        }

        const filteredSearch = applyCatalogFilterChange(adapter, initial.selection, {
          filterId,
          kind: catalogFilterChangeKinds.toggleOption,
          selected: true,
          value: option.id,
        });
        const filtered = resolveCatalogSnapshot({
          adapter,
          characterSlug: path.character.routeSlug,
          copy,
          language: languageCodes.EN,
          search: filteredSearch,
          specificationSlug: path.specification.routeSlug,
        });
        const chip = filtered.activeFilters.find(
          (candidate) => candidate.filterId === filterId && candidate.value === option.id,
        );

        expect(chip?.tone).toBe(resolveCatalogValueTone(filterId, option.id));
        expect(filtered.cards.length).toBeGreaterThan(0);
        for (const card of filtered.cards) {
          expect(card.summary.metadataItems.find((item) => item.id === metadataId)?.tone).toBe(
            chip?.tone,
          );
        }
      }

      expect(
        initial.cards[0]?.summary.metadataItems.find((item) => item.id === "source")?.tone,
      ).toBeUndefined();
    }
  });

  it("prepares readable result snapshots without game branching", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { snapshot } = readySnapshot(adapter);

      expect(snapshot.selectionStatus).toBe(installedCatalogSelectionStatuses.ready);
      expect(snapshot.characterId).toBeTruthy();
      expect(snapshot.contextId).toBeTruthy();
      expect(snapshot.cards.length).toBeGreaterThan(0);
      expect(snapshot.cards[0]?.summary.notation.length).toBeGreaterThan(0);
      expect(snapshot.cards[0]?.summary.metadataItems).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: "source", value: "Curated" })]),
      );
      expect(snapshot.facets.length).toBeGreaterThan(0);
      expect(snapshot.canonicalSearch).not.toHaveProperty("character");
      expect(snapshot.canonicalSearch).not.toHaveProperty(adapter.contextKind);
    }
  });

  it("projects ordered command metadata for every installed game without mutating sources", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { snapshot } = readySnapshot(adapter);
      const sourceCard = snapshot.cards[0];

      expect(sourceCard).toBeTruthy();
      if (!sourceCard) {
        continue;
      }

      const sourceBeforeProjection = structuredClone(sourceCard);
      const sourceMetadataItems = sourceCard.summary.metadataItems;
      const projected = prepareCatalogCommandCard(sourceCard);

      expect(projected.summary.contextItems).toEqual([]);
      expect(projected.summary.metadataItems.map((item) => item.id)).toEqual([
        "damage",
        "meter",
        "routeType",
        "position",
        "difficulty",
      ]);
      expect(projected.summary.metadataItems.every((item) => item.id !== "source")).toBe(true);
      expect(projected.summary.notesSnippet).toBeUndefined();
      expect(sourceCard).toEqual(sourceBeforeProjection);
      expect(sourceCard.summary.metadataItems).toBe(sourceMetadataItems);
      expect(sourceCard.summary.contextItems.length).toBeGreaterThan(0);
      expect(sourceCard.summary.metadataItems.some((item) => item.id === "source")).toBe(true);
    }
  });

  it("omits missing command metadata instead of inserting placeholders", () => {
    const { snapshot } = readySnapshot(installedGameCatalogAdapters[0]);
    const sourceCard = snapshot.cards[0];

    expect(sourceCard).toBeTruthy();
    if (!sourceCard) {
      return;
    }

    const sparseCard = {
      ...sourceCard,
      summary: {
        ...sourceCard.summary,
        metadataItems: sourceCard.summary.metadataItems
          .filter((item) => ["damage", "difficulty", "source"].includes(item.id))
          .reverse(),
      },
    };
    const projected = prepareCatalogCommandCard(sparseCard);

    expect(projected.summary.metadataItems.map((item) => item.id)).toEqual([
      "damage",
      "difficulty",
    ]);
  });

  it("keeps Personal visible but disabled in every game source facet", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { snapshot } = readySnapshot(adapter);
      const source = snapshot.facets.find((facet) => facet.id === "source");

      expect(source?.kind).toBe(filterFacetKinds.multiChoice);
      if (!source || source.kind !== filterFacetKinds.multiChoice) {
        continue;
      }

      expect(source.options.find((option) => option.id === "personal")).toMatchObject({
        available: false,
        count: 0,
        disabledReason: expect.any(String),
      });
    }
  });

  it("prepares MKXL Arena and dependent Interactables as visual choice facets", () => {
    const adapter = installedGameCatalogAdapters.find((candidate) => candidate.gameId === "mkxl");
    expect(adapter).toBeDefined();
    if (!adapter) return;

    const initial = resolveCatalogSnapshot({
      adapter,
      characterSlug: "alien",
      copy,
      language: languageCodes.EN,
      search: {},
      specificationSlug: "tarkatan",
    });
    const arena = initial.facets.find((facet) => facet.id === "stage");

    expect(initial.facets.some((facet) => facet.id === "damage")).toBe(false);
    expect(initial.facets.some((facet) => facet.id === "interactable")).toBe(false);
    expect(arena).toMatchObject({
      kind: filterFacetKinds.singleChoice,
      presentation: filterChoicePresentations.visual,
    });
    expect(arena?.options[0]).toMatchObject({
      id: "crossroads",
      imageAlt: expect.any(String),
      imageSrc: expect.any(String),
    });

    const selectedArenaSearch = applyCatalogFilterChange(adapter, initial.selection, {
      filterId: "stage",
      kind: catalogFilterChangeKinds.toggleOption,
      selected: true,
      value: "crossroads",
    });
    const selectedArena = resolveCatalogSnapshot({
      adapter,
      characterSlug: "alien",
      copy,
      language: languageCodes.EN,
      search: selectedArenaSearch,
      specificationSlug: "tarkatan",
    });
    const interactables = selectedArena.facets.find((facet) => facet.id === "interactable");

    expect(interactables).toMatchObject({
      kind: filterFacetKinds.multiChoice,
      presentation: filterChoicePresentations.visual,
    });
    expect(interactables?.options).toEqual([
      expect.objectContaining({
        accessibleLabel: "Crossroads position escape",
        id: "crossroads:position-escape",
        imageSrc: undefined,
        label: "Position escape",
      }),
    ]);
  });

  it("localizes an empty dependent visual facet", () => {
    const adapter = installedGameCatalogAdapters.find((candidate) => candidate.gameId === "mkxl");
    expect(adapter).toBeDefined();
    if (!adapter) return;

    const snapshot = resolveCatalogSnapshot({
      adapter,
      characterSlug: "alien",
      copy,
      language: languageCodes.EN,
      search: { stage: "dead-woods" },
      specificationSlug: "tarkatan",
    });
    const interactables = snapshot.facets.find((facet) => facet.id === "interactable");

    expect(interactables).toMatchObject({
      message: "No options are available for Interactables with the current selection.",
      options: [],
      presentation: filterChoicePresentations.visual,
    });
  });

  it("preserves adapter-authored desktop and compact slot coordinates", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { path, snapshot } = readySnapshot(adapter);
      const authored = adapter
        .specificationOptions(path.character.id)
        .find((option) => option.id === path.specification.id)?.slot;
      const prepared = snapshot.contextSlots.find(
        (option) => option.optionId === path.specification.id,
      );

      expect(authored).toBeDefined();
      expect(prepared).toMatchObject({
        column: authored?.column,
        responsiveOrder: authored?.responsiveOrder,
        row: authored?.row,
        slotId: authored?.slotId,
      });
    }
  });

  it("keeps invalid path contexts recoverable and out of persistence", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const path = readyPath(adapter);
      const invalidCharacter = resolveCatalogSnapshot({
        adapter,
        characterSlug: "missing-fighter",
        copy,
        language: languageCodes.EN,
        search: {},
      });
      const invalidSpecification = resolveCatalogSnapshot({
        adapter,
        characterSlug: path.character.routeSlug,
        copy,
        language: languageCodes.EN,
        search: {},
        specificationSlug: "missing-specification",
      });

      expect(invalidCharacter.selectionStatus).toBe(
        installedCatalogSelectionStatuses.invalidCharacter,
      );
      expect(invalidSpecification).toMatchObject({
        characterId: path.character.id,
        selectionStatus: installedCatalogSelectionStatuses.invalidSpecification,
      });
      expect(invalidCharacter.cards).toHaveLength(0);
      expect(invalidSpecification.cards).toHaveLength(0);
    }
  });

  it("saves and restores only ready pathname context", () => {
    for (const [index, adapter] of installedGameCatalogAdapters.entries()) {
      const business = installedGames[index];
      const { snapshot } = readySnapshot(adapter);
      const emptySlice = business?.backup.createEmptySlice();
      const saved = saveCatalogSnapshot(adapter, emptySlice, snapshot);

      expect(saved.ok).toBe(true);
      if (!saved.ok) {
        continue;
      }

      const restored = adapter.restoreLastCatalog(saved.value);
      expect(restored.ok).toBe(true);
      if (!restored.ok) {
        continue;
      }

      expect(restored.selection).toMatchObject({
        characterId: snapshot.characterId,
        specificationId: snapshot.contextId,
        status: installedCatalogSelectionStatuses.ready,
      });
    }
  });

  it("applies game-owned filters while keeping pathname context out of search", () => {
    for (const adapter of installedGameCatalogAdapters) {
      const { path, snapshot: initial } = readySnapshot(adapter);
      const facet = initial.facets.find(
        (candidate) =>
          candidate.kind === filterFacetKinds.multiChoice &&
          candidate.options.some((option) => option.available),
      );

      expect(facet?.kind).toBe(filterFacetKinds.multiChoice);
      if (!facet || facet.kind !== filterFacetKinds.multiChoice) {
        continue;
      }

      const option = facet.options.find((candidate) => candidate.available);
      expect(option).toBeDefined();
      if (!option) {
        continue;
      }

      const filteredSearch = applyCatalogFilterChange(adapter, initial.selection, {
        filterId: facet.id,
        kind: catalogFilterChangeKinds.toggleOption,
        selected: true,
        value: option.id,
      });
      const filtered = resolveCatalogSnapshot({
        adapter,
        characterSlug: path.character.routeSlug,
        copy,
        language: languageCodes.EN,
        search: filteredSearch,
        specificationSlug: path.specification.routeSlug,
      });

      expect(filtered.canonicalSearch).not.toHaveProperty("character");
      expect(filtered.canonicalSearch).not.toHaveProperty(adapter.contextKind);
      expect(filtered.activeFilters).toEqual(
        expect.arrayContaining([expect.objectContaining({ filterId: facet.id, value: option.id })]),
      );
    }
  });
});
