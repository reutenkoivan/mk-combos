import { describe, expect, it } from "vitest";

import { withSettingsTabSearch } from "./runtime";
import { settingsTabs } from "./value";

describe("withSettingsTabSearch", () => {
  it("opens Settings on the current href and preserves other search and hash state", () => {
    expect(
      withSettingsTabSearch("/mkxl/catalog?character=scorpion#moves", settingsTabs.interface),
    ).toBe("/mkxl/catalog?character=scorpion&settings=interface#moves");
  });

  it("switches tabs without adding a duplicate query key", () => {
    expect(withSettingsTabSearch("/mk1/lists?settings=interface", settingsTabs.backup)).toBe(
      "/mk1/lists?settings=backup",
    );
  });

  it("closes Settings without changing the working href", () => {
    expect(withSettingsTabSearch("/mkxl/catalog?settings=backup&tag=corner#saved")).toBe(
      "/mkxl/catalog?tag=corner#saved",
    );
  });
});
