import { recoverMkxlCatalogContext } from "@mk-combos/mkxl-catalog/context/runtime";
import { MkxlCatalogContextSchema } from "@mk-combos/mkxl-catalog/context/schema";
import {
  parseMkxlCatalogFilterQuery,
  recoverMkxlCatalogFilters,
} from "@mk-combos/mkxl-catalog/filters/runtime";
import { MkxlCatalogFiltersSchema } from "@mk-combos/mkxl-catalog/filters/schema";
import { describe, expect, it } from "vitest";

describe("MKXL catalog schemas", () => {
  it("keeps pathname context and optional search filters as separate strict boundaries", () => {
    expect(
      MkxlCatalogContextSchema.safeParse({
        characterId: "scorpion",
        variationId: "scorpion:ninjutsu",
      }).success,
    ).toBe(true);
    expect(MkxlCatalogContextSchema.safeParse({ character: "scorpion" }).success).toBe(false);
    expect(
      MkxlCatalogFiltersSchema.safeParse({ routeClasses: ["bnb"], sources: ["community"] }).success,
    ).toBe(true);
    expect(MkxlCatalogFiltersSchema.safeParse({ starters: ["F2"] }).success).toBe(false);
  });

  it("recovers invalid path context and filter cascades independently", () => {
    expect(
      recoverMkxlCatalogContext({ characterId: "scorpion", variationId: "sub-zero:grandmaster" }),
    ).toMatchObject({
      status: "characterSelected",
      context: { characterId: "scorpion" },
    });
    expect(
      recoverMkxlCatalogFilters({ interactableIds: ["crossroads:position-escape"] }),
    ).toMatchObject({
      filters: {},
    });
    expect(parseMkxlCatalogFilterQuery({ character: "scorpion" }).messages.length).toBeGreaterThan(
      0,
    );
  });
});
