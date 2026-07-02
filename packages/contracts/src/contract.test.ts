import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";
import { createViteConfig } from "@mk-combos/contracts/build/vite/config";
import { withStorybookViteConfig } from "@mk-combos/contracts/build/vite/storybook";
import * as contractEntry from "@mk-combos/contracts/contract";
import {
  type BackupEnvelope,
  type ComboDetailRouteParams,
  type ComboRef,
  contractGroups,
  type LocalizedText,
  mkCombosContract,
} from "@mk-combos/contracts/contract";
import { getMkCombosEnv } from "@mk-combos/contracts/env/runtime";
import type { MkCombosEnv } from "@mk-combos/contracts/env/type";
import { mkCombosEnv } from "@mk-combos/contracts/env/value";
import { comboSources as identitySchemaComboSources } from "@mk-combos/contracts/identity/schema";
import { comboSources as identityTypeComboSources } from "@mk-combos/contracts/identity/type";
import { err, ok } from "@mk-combos/contracts/result/runtime";
import { validationSeverities as resultSchemaValidationSeverities } from "@mk-combos/contracts/result/schema";
import type { AppResult } from "@mk-combos/contracts/result/type";
import { validationSeverities as resultTypeValidationSeverities } from "@mk-combos/contracts/result/type";
import {
  appRouteKinds as routesSchemaAppRouteKinds,
  gameRouteKinds as routesSchemaGameRouteKinds,
} from "@mk-combos/contracts/routes/schema";
import {
  appRouteKinds as routesTypeAppRouteKinds,
  gameRouteKinds as routesTypeGameRouteKinds,
} from "@mk-combos/contracts/routes/type";
import {
  languageCodes as settingsSchemaLanguageCodes,
  notationDisplayModes as settingsSchemaNotationDisplayModes,
} from "@mk-combos/contracts/settings/schema";
import {
  languageCodes as settingsTypeLanguageCodes,
  notationDisplayModes as settingsTypeNotationDisplayModes,
} from "@mk-combos/contracts/settings/type";
import { createE2eConfig } from "@mk-combos/contracts/test/e2e/config";
import {
  type APIRequestContext,
  createE2eRunId,
  createE2eSlug,
  type Page,
  type PlaywrightTestConfig,
  expect as playwrightExpect,
  request as playwrightRequest,
  test as playwrightTest,
} from "@mk-combos/contracts/test/e2e/test";
import { createUnitConfig } from "@mk-combos/contracts/test/unit/config";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@mk-combos/contracts/test/unit/react";
import { describe, expect, it } from "vitest";

const acceptsE2eTypes = (_contract: {
  config: PlaywrightTestConfig;
  context: APIRequestContext;
  page: Page;
}) => true;

describe("@mk-combos/contracts", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual(["contractGroups", "mkCombosContract"]);
    expect(mkCombosContract.groups).toBe(contractGroups);
    expect(contractGroups.identity).toEqual({
      schema: "@mk-combos/contracts/identity/schema",
      type: "@mk-combos/contracts/identity/type",
    });
    expect(contractGroups.routes).toEqual({
      schema: "@mk-combos/contracts/routes/schema",
      type: "@mk-combos/contracts/routes/type",
    });
    expect(contractGroups.settings).toEqual({
      schema: "@mk-combos/contracts/settings/schema",
      type: "@mk-combos/contracts/settings/type",
    });
    expect(contractGroups.backup).toEqual({
      schema: "@mk-combos/contracts/backup/schema",
      type: "@mk-combos/contracts/backup/type",
    });
    expect(contractGroups.result).toEqual({
      runtime: "@mk-combos/contracts/result/runtime",
      schema: "@mk-combos/contracts/result/schema",
      type: "@mk-combos/contracts/result/type",
    });
    expect(contractGroups.env).toEqual({
      runtime: "@mk-combos/contracts/env/runtime",
      type: "@mk-combos/contracts/env/type",
      value: "@mk-combos/contracts/env/value",
    });
    expect(contractGroups.env).not.toHaveProperty("schema");
  });

  it("keeps combo references game-agnostic", () => {
    const comboRef = {
      gameId: "future-game",
      source: "seeded",
      comboId: "starter-001",
    } satisfies ComboRef;

    const routeParams = {
      gameId: comboRef.gameId,
      source: comboRef.source,
      comboId: comboRef.comboId,
    } satisfies ComboDetailRouteParams;

    expect(routeParams).toEqual(comboRef);
  });

  it("supports localized text with optional fallback copy", () => {
    const text = {
      EN: "Combo",
      fallback: "Combo",
    } satisfies LocalizedText;

    expect(text.EN).toBe("Combo");
    expect(text.fallback).toBe("Combo");
  });

  it("models backup envelopes keyed by open game ids", () => {
    const backup = {
      version: 1,
      exportedAt: "2026-07-02T00:00:00.000Z",
      settings: {
        language: "EN",
        defaultGameId: "future-game",
        notationDisplayMode: "FGC",
      },
      games: {
        "future-game": { customCombos: [] },
      },
    } satisfies BackupEnvelope;

    expect(backup.games["future-game"]).toEqual({ customCombos: [] });
  });

  it("creates result helpers with stable discriminants", () => {
    const success: AppResult<number> = ok(7);
    const failure: AppResult<number> = err({
      code: "backup.invalid",
      message: "Backup envelope is invalid.",
    });

    expect(success.ok).toBe(true);
    expect(failure.ok).toBe(false);
    if (!failure.ok) {
      expect(failure.error.code).toBe("backup.invalid");
    }
  });

  it("resolves build and test contract subpaths", () => {
    expect(typeof createTsdownConfig).toBe("function");
    expect(typeof createViteConfig).toBe("function");
    expect(typeof withStorybookViteConfig).toBe("function");
    expect(typeof getMkCombosEnv).toBe("function");
    const resolvedEnv = mkCombosEnv satisfies MkCombosEnv;
    expect(resolvedEnv).toEqual(expect.objectContaining({ isCi: expect.any(Boolean) }));
    expect(typeof createUnitConfig).toBe("function");
    expect(typeof createE2eConfig).toBe("function");
    expect(createE2eRunId("mk-combos")).toMatch(/^mk-combos-\d{14}-[a-z0-9]{6}$/u);
  });

  it("keeps public value-set re-exports intentional", () => {
    expect(identitySchemaComboSources).toEqual(["seeded", "custom"]);
    expect(identityTypeComboSources).toBe(identitySchemaComboSources);
    expect(resultSchemaValidationSeverities).toEqual(["info", "warning", "error"]);
    expect(resultTypeValidationSeverities).toBe(resultSchemaValidationSeverities);
    expect(routesSchemaGameRouteKinds).toEqual(["catalog", "comboDetail", "lists", "builder"]);
    expect(routesTypeGameRouteKinds).toEqual(routesSchemaGameRouteKinds);
    expect(routesSchemaAppRouteKinds).toEqual([
      "catalog",
      "comboDetail",
      "lists",
      "builder",
      "settings",
    ]);
    expect(routesTypeAppRouteKinds).toEqual(routesSchemaAppRouteKinds);
    expect(settingsSchemaLanguageCodes).toEqual(["EN", "UA"]);
    expect(settingsTypeLanguageCodes).toBe(settingsSchemaLanguageCodes);
    expect(settingsSchemaNotationDisplayModes).toEqual(["FGC", "PlayStation", "Xbox"]);
    expect(settingsTypeNotationDisplayModes).toBe(settingsSchemaNotationDisplayModes);
  });

  it("keeps test helper re-exports intentional", () => {
    expect(typeof playwrightExpect).toBe("function");
    expect(typeof playwrightRequest.newContext).toBe("function");
    expect(typeof playwrightTest).toBe("function");
    expect(createE2eSlug("Run 01", "Spec")).toBe("spec-run-01");
    expect(
      acceptsE2eTypes({
        config: {},
        context: undefined as unknown as APIRequestContext,
        page: undefined as unknown as Page,
      }),
    ).toBe(true);

    expect(typeof act).toBe("function");
    expect(typeof cleanup).toBe("function");
    expect(typeof fireEvent).toBe("function");
    expect(typeof render).toBe("function");
    expect(typeof screen.getByText).toBe("function");
    expect(typeof userEvent.setup).toBe("function");
    expect(typeof waitFor).toBe("function");
    expect(typeof within).toBe("function");
  });
});
