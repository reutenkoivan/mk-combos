import { describe, expect, expectTypeOf, it } from "vitest";
import { SettingsSearchSchema, SettingsSectionSchema } from "./schema";
import type { SettingsSearch, SettingsSection } from "./type";
import { settingsSections } from "./value";

describe("settings search contract", () => {
  it("publishes the optional backup section", () => {
    expect(settingsSections).toEqual({ backup: "backup" });
    expect(SettingsSectionSchema.parse(settingsSections.backup)).toBe("backup");
    expect(SettingsSearchSchema.parse({})).toEqual({});

    const search: SettingsSearch = SettingsSearchSchema.parse({
      section: settingsSections.backup,
    });

    expect(search).toEqual({ section: "backup" });
    expectTypeOf(search.section).toEqualTypeOf<SettingsSection | undefined>();
  });

  it("rejects unknown section values", () => {
    expect(SettingsSearchSchema.safeParse({ section: "interface" }).success).toBe(false);
    expect(SettingsSearchSchema.safeParse({ section: "future" }).success).toBe(false);
  });

  it("strips unrelated search keys", () => {
    expect(
      SettingsSearchSchema.parse({
        gameId: "mk1",
        section: settingsSections.backup,
        source: "deprecated",
      }),
    ).toEqual({ section: "backup" });
  });
});
