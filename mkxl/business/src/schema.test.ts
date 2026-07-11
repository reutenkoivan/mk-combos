import {
  MkxlBusinessCustomComboSchema,
  MkxlBusinessSliceSchema,
  MkxlNamedListSchema,
} from "@mk-combos/mkxl-business/schema";
import { describe, expect, it } from "vitest";

const now = "2026-07-11T00:00:00.000Z";

const validCustomCombo = {
  id: "local-1",
  gameId: "mkxl",
  source: "custom",
  title: { fallback: "Local Scorpion route" },
  characterId: "scorpion",
  variationId: "scorpion:ninjutsu",
  stageContext: { kind: "stageAgnostic" },
  movePath: ["scorpion:forward-strike"],
  cachedNotation: [["F", "2"]],
  metadata: {
    damage: 10,
    meter: 0,
    position: "midscreen",
    starter: "F2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["practice"],
  },
  notes: { fallback: "Practice route" },
  gameVersion: "XL-final",
  createdAt: now,
  updatedAt: now,
} as const;

const validNamedList = {
  id: "practice",
  gameId: "mkxl",
  name: "Practice",
  items: [
    {
      ref: {
        gameId: "mkxl",
        source: "custom",
        comboId: "local-1",
      },
      addedAt: now,
    },
  ],
  createdAt: now,
  updatedAt: now,
} as const;

describe("@mk-combos/mkxl-business schemas", () => {
  it("parses the v1 business slice shape", () => {
    const parsed = MkxlBusinessSliceSchema.parse({
      version: 1,
      customCombos: [validCustomCombo],
      namedLists: [validNamedList],
      lastCatalog: {
        context: {
          characterId: "scorpion",
          variationId: "scorpion:ninjutsu",
        },
        filters: {
          meter: [0],
        },
      },
    });

    expect(parsed.version).toBe(1);
    expect(parsed.customCombos[0]?.id).toBe("local-1");
    expect(parsed.namedLists[0]?.items[0]?.ref.comboId).toBe("local-1");
  });

  it("rejects unknown keys, wrong game, invalid source, and notation/path mismatch", () => {
    expect(
      MkxlBusinessCustomComboSchema.safeParse({
        ...validCustomCombo,
        unknown: true,
      }).success,
    ).toBe(false);
    expect(
      MkxlBusinessCustomComboSchema.safeParse({
        ...validCustomCombo,
        gameId: "mk1",
      }).success,
    ).toBe(false);
    expect(
      MkxlBusinessCustomComboSchema.safeParse({
        ...validCustomCombo,
        source: "seeded",
      }).success,
    ).toBe(false);
    expect(
      MkxlBusinessCustomComboSchema.safeParse({
        ...validCustomCombo,
        cachedNotation: [
          ["F", "2"],
          ["B", "2"],
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects malformed named list references and duplicate list items", () => {
    expect(
      MkxlNamedListSchema.safeParse({
        ...validNamedList,
        items: [
          {
            ref: {
              gameId: "mk1",
              source: "custom",
              comboId: "local-1",
            },
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      MkxlNamedListSchema.safeParse({
        ...validNamedList,
        items: [validNamedList.items[0], validNamedList.items[0]],
      }).success,
    ).toBe(false);
  });

  it("rejects duplicate custom combo ids and named list ids at the slice boundary", () => {
    expect(
      MkxlBusinessSliceSchema.safeParse({
        version: 1,
        customCombos: [validCustomCombo, validCustomCombo],
        namedLists: [],
      }).success,
    ).toBe(false);
    expect(
      MkxlBusinessSliceSchema.safeParse({
        version: 1,
        customCombos: [],
        namedLists: [validNamedList, validNamedList],
      }).success,
    ).toBe(false);
  });
});
