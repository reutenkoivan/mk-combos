import {
  createGameBackupEnvelopeSchema,
  GameBackupEnvelopeSchema,
} from "@mk-combos/contracts/backup/schema";
import { CatalogFilterChangeSchema } from "@mk-combos/contracts/catalog-filter/schema";
import { catalogFilterChangeKinds } from "@mk-combos/contracts/catalog-filter/value";
import { ComboRefSchema, ComboSourceSchema } from "@mk-combos/contracts/identity/schema";
import { AppErrorSchema, ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { ComboDetailRouteParamsSchema, GameRouteSchema } from "@mk-combos/contracts/routes/schema";
import { gameRouteKinds } from "@mk-combos/contracts/routes/value";
import { AppSettingsSchema } from "@mk-combos/contracts/settings/schema";
import { describe, expect, it } from "vitest";
import { z } from "zod/v4";

const validSettings = {
  language: "EN",
  defaultGameId: "future-game",
  notationDisplayMode: "FGC",
  themePreference: "system",
} as const;

describe("@mk-combos/contracts schemas", () => {
  it("validates strict semantic catalog filter changes", () => {
    expect(
      CatalogFilterChangeSchema.parse({
        kind: catalogFilterChangeKinds.clearAll,
      }),
    ).toEqual({ kind: catalogFilterChangeKinds.clearAll });
    expect(
      CatalogFilterChangeSchema.parse({
        kind: catalogFilterChangeKinds.clearFacet,
        filterId: "  tag  ",
      }),
    ).toEqual({ kind: catalogFilterChangeKinds.clearFacet, filterId: "tag" });
    expect(
      CatalogFilterChangeSchema.parse({
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: "meter",
        value: "  1  ",
        selected: true,
      }),
    ).toEqual({
      kind: catalogFilterChangeKinds.toggleOption,
      filterId: "meter",
      value: "1",
      selected: true,
    });
    expect(
      CatalogFilterChangeSchema.safeParse({
        kind: catalogFilterChangeKinds.clearFacet,
        filterId: " ",
      }).success,
    ).toBe(false);
    expect(
      CatalogFilterChangeSchema.safeParse({
        kind: catalogFilterChangeKinds.toggleOption,
        filterId: "tag",
        value: "practice",
        selected: true,
        extra: true,
      }).success,
    ).toBe(false);
  });

  it("validates combo sources and combo refs", () => {
    expect(ComboSourceSchema.parse("seeded")).toBe("seeded");
    expect(ComboSourceSchema.safeParse("dlc").success).toBe(false);

    expect(
      ComboRefSchema.parse({
        gameId: "future-game",
        source: "custom",
        comboId: "starter-001",
      }),
    ).toEqual({
      gameId: "future-game",
      source: "custom",
      comboId: "starter-001",
    });
    expect(
      ComboRefSchema.safeParse({
        gameId: "future-game",
        source: "custom",
        comboId: "",
      }).success,
    ).toBe(false);
    expect(
      ComboRefSchema.safeParse({
        gameId: "future-game",
        source: "custom",
        comboId: "starter-001",
        extra: true,
      }).success,
    ).toBe(false);
  });

  it("keeps game routes source-neutral, catalog-contextual, and game-scoped", () => {
    const routeParams = {
      characterSlug: "fighter",
      comboId: "starter-001",
      gameId: "future-game",
      specificationSlug: "context",
    };

    expect(ComboDetailRouteParamsSchema.parse(routeParams)).toEqual(routeParams);
    expect(
      ComboDetailRouteParamsSchema.safeParse({
        ...routeParams,
        source: "seeded",
      }).success,
    ).toBe(false);
    expect(
      GameRouteSchema.parse({
        gameId: "another-future-game",
        kind: gameRouteKinds.catalog,
      }),
    ).toEqual({
      gameId: "another-future-game",
      kind: gameRouteKinds.catalog,
    });
    expect(GameRouteSchema.safeParse({ kind: "settings" }).success).toBe(false);
  });

  it("validates app settings with strict shared options", () => {
    expect(AppSettingsSchema.parse(validSettings)).toEqual(validSettings);
    expect(
      AppSettingsSchema.safeParse({
        ...validSettings,
        language: "PL",
      }).success,
    ).toBe(false);
    expect(
      AppSettingsSchema.safeParse({
        ...validSettings,
        themePreference: "sepia",
      }).success,
    ).toBe(false);
    expect(
      AppSettingsSchema.safeParse({
        ...validSettings,
        unknown: true,
      }).success,
    ).toBe(false);
  });

  it("accepts strict per-game backup envelopes with open game ids and opaque slices", () => {
    const envelope = {
      version: 1,
      exportedAt: "2026-07-02T00:00:00.000Z",
      gameId: "future-game",
      slice: { customCombos: [{ id: "local-1" }] },
    };
    const parsed = GameBackupEnvelopeSchema.parse(envelope);

    expect(parsed).toEqual(envelope);
    expect(
      GameBackupEnvelopeSchema.parse({
        ...envelope,
        gameId: "another-future-game",
        slice: ["opaque", "slice"],
      }).slice,
    ).toEqual(["opaque", "slice"]);
    expect(
      GameBackupEnvelopeSchema.safeParse({ ...envelope, exportedAt: "not-a-date" }).success,
    ).toBe(false);
    expect(GameBackupEnvelopeSchema.safeParse({ ...envelope, version: 0 }).success).toBe(false);
    expect(GameBackupEnvelopeSchema.safeParse({ ...envelope, version: 1.5 }).success).toBe(false);
    expect(GameBackupEnvelopeSchema.safeParse({ ...envelope, gameId: "" }).success).toBe(false);
    expect(GameBackupEnvelopeSchema.safeParse({ ...envelope, extra: true }).success).toBe(false);
    expect(
      GameBackupEnvelopeSchema.safeParse({
        version: envelope.version,
        exportedAt: envelope.exportedAt,
        gameId: envelope.gameId,
      }).success,
    ).toBe(false);
    expect(GameBackupEnvelopeSchema.safeParse({ ...envelope, slice: undefined }).success).toBe(
      false,
    );
    expect(
      GameBackupEnvelopeSchema.safeParse({ ...envelope, slice: () => undefined }).success,
    ).toBe(false);
    expect(
      GameBackupEnvelopeSchema.safeParse({ ...envelope, slice: Symbol("slice") }).success,
    ).toBe(false);
    expect(GameBackupEnvelopeSchema.safeParse({ ...envelope, slice: 1n }).success).toBe(false);
    expect(
      GameBackupEnvelopeSchema.safeParse({
        version: 1,
        exportedAt: envelope.exportedAt,
        settings: validSettings,
        games: { "future-game": envelope.slice },
      }).success,
    ).toBe(false);
  });

  it("validates a per-game backup slice when a custom schema is provided", () => {
    const sliceSchema = z
      .object({
        customCombos: z.array(z.string()),
      })
      .strict();
    const backupSchema = createGameBackupEnvelopeSchema(sliceSchema);

    const parsed = backupSchema.parse({
      version: 1,
      exportedAt: "2026-07-02T00:00:00.000Z",
      gameId: "future-game",
      slice: {
        customCombos: ["local-1"],
      },
    });

    expect(parsed.slice.customCombos).toEqual(["local-1"]);
    expect(
      backupSchema.safeParse({
        version: 1,
        exportedAt: "2026-07-02T00:00:00.000Z",
        gameId: "future-game",
        slice: {
          customCombos: [1],
        },
      }).success,
    ).toBe(false);
  });

  it("validates serializable result error payloads", () => {
    expect(
      ValidationMessageSchema.parse({
        severity: "warning",
        message: "Combo route is missing a source.",
        code: "route.source_missing",
        path: ["source"],
      }),
    ).toEqual({
      severity: "warning",
      message: "Combo route is missing a source.",
      code: "route.source_missing",
      path: ["source"],
    });

    expect(ValidationMessageSchema.safeParse({ severity: "error", message: "" }).success).toBe(
      false,
    );
    expect(
      AppErrorSchema.parse({
        code: "backup.invalid",
        message: "Backup envelope is invalid.",
        validationMessages: [
          {
            severity: "error",
            message: "Unknown setting value.",
          },
        ],
      }),
    ).toEqual({
      code: "backup.invalid",
      message: "Backup envelope is invalid.",
      validationMessages: [
        {
          severity: "error",
          message: "Unknown setting value.",
        },
      ],
    });
    expect(AppErrorSchema.safeParse({ code: "", message: "Invalid." }).success).toBe(false);
  });
});
