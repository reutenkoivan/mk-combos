import { MkxlBuilderContextSchema } from "@mk-combos/mkxl-builder/context/schema";
import { MkxlBuilderMoveChoiceSchema } from "@mk-combos/mkxl-builder/graph/schema";
import { describe, expect, it } from "vitest";

describe("@mk-combos/mkxl-builder schemas", () => {
  it("rejects unknown keys and invalid MKXL ids at context boundaries", () => {
    expect(
      MkxlBuilderContextSchema.parse({
        characterId: "scorpion",
        variationId: "scorpion:ninjutsu",
      }),
    ).toEqual({
      characterId: "scorpion",
      variationId: "scorpion:ninjutsu",
    });
    expect(
      MkxlBuilderContextSchema.safeParse({
        characterId: "Scorpion",
        variationId: "scorpion:ninjutsu",
      }).success,
    ).toBe(false);
    expect(
      MkxlBuilderContextSchema.safeParse({
        characterId: "scorpion",
        variationId: "scorpion:ninjutsu",
        extra: true,
      }).success,
    ).toBe(false);
  });

  it("keeps move choices strict and candidate-backed", () => {
    const choice = {
      id: "scorpion:opening-assault",
      kind: "move",
      moveId: "scorpion:opening-assault",
      label: "Opening Assault",
      candidates: [
        {
          edgeId: "edge-1",
          fromNodeId: "start",
          toNodeId: "after-first",
          moveId: "scorpion:opening-assault",
        },
      ],
    } as const;

    expect(MkxlBuilderMoveChoiceSchema.parse(choice)).toEqual(choice);
    expect(
      MkxlBuilderMoveChoiceSchema.safeParse({
        ...choice,
        candidates: [],
      }).success,
    ).toBe(false);
    expect(
      MkxlBuilderMoveChoiceSchema.safeParse({
        ...choice,
        unknown: true,
      }).success,
    ).toBe(false);
  });
});
