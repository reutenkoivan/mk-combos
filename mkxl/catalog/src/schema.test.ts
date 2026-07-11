import {
  parseMkxlCatalogRouteQuery,
  selectMkxlCatalogCharacter,
  serializeMkxlCatalogRouteQuery,
} from "@mk-combos/mkxl-catalog/context/runtime";
import {
  MkxlCatalogContextSchema,
  MkxlCatalogRouteQuerySchema,
} from "@mk-combos/mkxl-catalog/context/schema";
import {
  clearMkxlCatalogFilters,
  parseMkxlCatalogFiltersFromRouteQuery,
  setMkxlCatalogStageFilter,
} from "@mk-combos/mkxl-catalog/filters/runtime";
import { MkxlCatalogFiltersSchema } from "@mk-combos/mkxl-catalog/filters/schema";
import { MkxlCatalogComboSummarySchema } from "@mk-combos/mkxl-catalog/summary/schema";
import { describe, expect, it } from "vitest";

describe("@mk-combos/mkxl-catalog schemas and recovery", () => {
  it("rejects unknown keys and invalid route/filter values at schema boundaries", () => {
    expect(
      MkxlCatalogRouteQuerySchema.safeParse({
        character: "scorpion",
        unknown: "value",
      }).success,
    ).toBe(false);
    expect(
      MkxlCatalogRouteQuerySchema.safeParse({
        position: ["not-a-position"],
      }).success,
    ).toBe(false);
    expect(
      MkxlCatalogRouteQuerySchema.safeParse({
        meter: ["one"],
      }).success,
    ).toBe(false);
    expect(
      MkxlCatalogFiltersSchema.safeParse({
        positions: ["not-a-position"],
      }).success,
    ).toBe(false);
    expect(
      MkxlCatalogContextSchema.safeParse({
        characterId: "scorpion",
        extra: true,
      }).success,
    ).toBe(false);
    expect(
      MkxlCatalogComboSummarySchema.safeParse({
        ref: {
          gameId: "mkxl",
          source: "seeded",
          comboId: "x",
        },
        gameId: "mkxl",
        source: "seeded",
        title: { fallback: "x" },
        character: { id: "scorpion", label: { fallback: "Scorpion" } },
        variation: {
          id: "scorpion:ninjutsu",
          characterId: "scorpion",
          label: { fallback: "Ninjutsu" },
        },
        stageContext: { kind: "stageAgnostic" },
        interactables: [],
        movePath: ["scorpion:f2"],
        cachedNotation: [["F", "2"]],
        metadata: {
          damage: 1,
          meter: 0,
          position: "midscreen",
          starter: "F2",
          routeType: "bnb",
          difficulty: "easy",
          tags: [],
        },
        tags: [],
        notes: { fallback: "x" },
        gameVersion: "XL-final",
        unknown: true,
      }).success,
    ).toBe(false);
  });

  it("parses, serializes, and round-trips documented catalog query keys", () => {
    const parsed = parseMkxlCatalogRouteQuery({
      character: "scorpion",
      variation: "scorpion:ninjutsu",
      starter: ["F2", "B2"],
      position: "midscreen",
      meter: ["0", "1"],
      damageMin: "27",
      damageMax: "35",
      difficulty: "easy",
      routeType: "bnb",
      tag: ["community", "beginner"],
      stage: "the-pit",
      interactable: "the-pit:position-escape",
    });
    const serialized = serializeMkxlCatalogRouteQuery(parsed.context, parsed.filters);

    expect(parsed.status).toBe("ready");
    expect(parsed.messages).toEqual([]);
    expect(serialized).toEqual({
      character: "scorpion",
      variation: "scorpion:ninjutsu",
      starter: ["F2", "B2"],
      position: ["midscreen"],
      meter: ["0", "1"],
      damageMin: "27",
      damageMax: "35",
      difficulty: ["easy"],
      routeType: ["bnb"],
      tag: ["community", "beginner"],
      stage: "the-pit",
      interactable: ["the-pit:position-escape"],
    });
    expect(parseMkxlCatalogRouteQuery(serialized).filters).toEqual(parsed.filters);
  });

  it("does not auto-select variation after character selection", () => {
    const selected = selectMkxlCatalogCharacter("scorpion");

    expect(selected.status).toBe("characterSelected");
    expect(selected.context).toEqual({ characterId: "scorpion" });
  });

  it("recovers invalid character and variation contexts", () => {
    expect(parseMkxlCatalogRouteQuery({ character: "not-real" })).toMatchObject({
      status: "empty",
      context: {},
    });
    expect(
      parseMkxlCatalogRouteQuery({
        character: "scorpion",
        variation: "sub-zero:grandmaster",
      }),
    ).toMatchObject({
      status: "characterSelected",
      context: { characterId: "scorpion" },
    });
  });

  it("drops invalid and incompatible stage/interactable filters with messages", () => {
    const invalid = parseMkxlCatalogFiltersFromRouteQuery({
      stage: "not-real-stage",
      interactable: ["not-real-interactable"],
    });
    const incompatible = setMkxlCatalogStageFilter(
      {
        stageId: "crossroads",
        interactableIds: ["crossroads:position-escape"],
      },
      "the-pit",
    );

    expect(invalid.filters).toEqual({});
    expect(invalid.messages.map((message) => message.code)).toEqual([
      "mkxl.catalog.invalid_stage",
      "mkxl.catalog.invalid_interactable",
    ]);
    expect(incompatible.filters).toEqual({ stageId: "the-pit" });
    expect(incompatible.messages.map((message) => message.code)).toEqual([
      "mkxl.catalog.incompatible_interactable",
    ]);
  });

  it("clears optional filters without touching required context", () => {
    const context = {
      characterId: "scorpion",
      variationId: "scorpion:ninjutsu",
    };
    const serialized = serializeMkxlCatalogRouteQuery(
      context,
      clearMkxlCatalogFilters({
        meter: [0],
        tags: ["community"],
      }),
    );

    expect(serialized).toEqual({
      character: "scorpion",
      variation: "scorpion:ninjutsu",
    });
  });
});
