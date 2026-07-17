import { languageCodes } from "@mk-combos/contracts/settings/value";
import { describe, expect, it } from "vitest";

import { formatCountCopy, resolveLocalizedText } from "./runtime";

describe("localization runtime", () => {
  it("uses deterministic localized text fallbacks and ignores blank values", () => {
    expect(
      resolveLocalizedText(
        { EN: "English", UA: " Українська ", fallback: "Fallback" },
        languageCodes.UA,
        "id",
      ),
    ).toBe("Українська");
    expect(
      resolveLocalizedText(
        { EN: "English", UA: " ", fallback: "Fallback" },
        languageCodes.UA,
        "id",
      ),
    ).toBe("Fallback");
    expect(resolveLocalizedText({ EN: "English" }, languageCodes.UA, "id")).toBe("English");
    expect(resolveLocalizedText(undefined, languageCodes.EN, "id")).toBe("id");
  });

  it("formats prepared count copy", () => {
    expect(formatCountCopy("{count} found", 12)).toBe("12 found");
  });
});
