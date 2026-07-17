import { themePreferences } from "@mk-combos/contracts/settings/value";
import { uiThemeModes } from "@mk-combos/ui/tokens/value";
import { describe, expect, it } from "vitest";

import { resolveThemePreference } from "./runtime";

describe("theme runtime", () => {
  it("resolves explicit preferences independently from the system theme", () => {
    expect(resolveThemePreference(themePreferences.dark, uiThemeModes.light)).toBe(
      uiThemeModes.dark,
    );
    expect(resolveThemePreference(themePreferences.light, uiThemeModes.dark)).toBe(
      uiThemeModes.light,
    );
  });

  it("projects the observed theme for the system preference", () => {
    expect(resolveThemePreference(themePreferences.system, uiThemeModes.dark)).toBe(
      uiThemeModes.dark,
    );
    expect(resolveThemePreference(themePreferences.system, uiThemeModes.light)).toBe(
      uiThemeModes.light,
    );
  });
});
