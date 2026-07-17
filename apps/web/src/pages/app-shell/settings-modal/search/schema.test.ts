import { describe, expect, expectTypeOf, it } from "vitest";
import type { SettingsTab } from "../navigation/type";
import { settingsTabs } from "../navigation/value";
import { SettingsModalSearchSchema, SettingsTabSchema } from "./schema";
import type { SettingsModalSearch } from "./type";

describe("Settings modal search contract", () => {
  it("publishes both tabs and keeps Settings closed when the query is absent", () => {
    expect(settingsTabs).toEqual({ backup: "backup", interface: "interface" });
    expect(SettingsTabSchema.parse(settingsTabs.interface)).toBe("interface");
    expect(SettingsTabSchema.parse(settingsTabs.backup)).toBe("backup");
    expect(SettingsModalSearchSchema.parse({})).toEqual({});

    const search: SettingsModalSearch = SettingsModalSearchSchema.parse({
      settings: settingsTabs.backup,
    });

    expect(search).toEqual({ settings: "backup" });
    expectTypeOf(search.settings).toEqualTypeOf<SettingsTab | undefined>();
  });

  it("rejects unknown or structurally invalid tab values", () => {
    expect(SettingsModalSearchSchema.safeParse({ settings: "future" }).success).toBe(false);
    expect(
      SettingsModalSearchSchema.safeParse({ settings: [settingsTabs.interface] }).success,
    ).toBe(false);
  });

  it("strips unrelated search keys", () => {
    expect(
      SettingsModalSearchSchema.parse({
        gameId: "mk1",
        settings: settingsTabs.interface,
        source: "deprecated",
      }),
    ).toEqual({ settings: "interface" });
  });
});
