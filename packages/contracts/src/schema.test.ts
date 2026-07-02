import {
  BackupEnvelopeSchema,
  createBackupEnvelopeSchema,
} from "@mk-combos/contracts/backup/schema";
import { ComboRefSchema, ComboSourceSchema } from "@mk-combos/contracts/identity/schema";
import { AppErrorSchema, ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { ComboDetailRouteParamsSchema } from "@mk-combos/contracts/routes/schema";
import { AppSettingsSchema } from "@mk-combos/contracts/settings/schema";
import { describe, expect, it } from "vitest";
import { z } from "zod/v4";

const validSettings = {
  language: "EN",
  defaultGameId: "future-game",
  notationDisplayMode: "FGC",
} as const;

describe("@mk-combos/contracts schemas", () => {
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

  it("keeps route detail params aligned with combo refs", () => {
    const comboRef = ComboRefSchema.parse({
      gameId: "future-game",
      source: "seeded",
      comboId: "starter-001",
    });

    expect(ComboDetailRouteParamsSchema.parse(comboRef)).toEqual(comboRef);
    expect(
      ComboDetailRouteParamsSchema.safeParse({
        ...comboRef,
        source: "dlc",
      }).success,
    ).toBe(false);
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
        unknown: true,
      }).success,
    ).toBe(false);
  });

  it("accepts backup envelopes with open game ids and opaque game slices", () => {
    const parsed = BackupEnvelopeSchema.parse({
      version: 1,
      exportedAt: "2026-07-02T00:00:00.000Z",
      settings: validSettings,
      games: {
        "future-game": { customCombos: [{ id: "local-1" }] },
        "another-future-game": ["opaque", "slice"],
      },
    });

    expect(parsed.games["future-game"]).toEqual({ customCombos: [{ id: "local-1" }] });
    expect(parsed.games["another-future-game"]).toEqual(["opaque", "slice"]);
    expect(
      BackupEnvelopeSchema.safeParse({
        version: 1,
        exportedAt: "not-a-date",
        settings: validSettings,
        games: {},
      }).success,
    ).toBe(false);
  });

  it("validates backup game slices when a custom slice schema is provided", () => {
    const sliceSchema = z
      .object({
        customCombos: z.array(z.string()),
      })
      .strict();
    const backupSchema = createBackupEnvelopeSchema(sliceSchema);

    const parsed = backupSchema.parse({
      version: 1,
      exportedAt: "2026-07-02T00:00:00.000Z",
      settings: validSettings,
      games: {
        "future-game": {
          customCombos: ["local-1"],
        },
      },
    });

    expect(parsed.games["future-game"]?.customCombos).toEqual(["local-1"]);
    expect(
      backupSchema.safeParse({
        version: 1,
        exportedAt: "2026-07-02T00:00:00.000Z",
        settings: validSettings,
        games: {
          "future-game": {
            customCombos: [1],
          },
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
