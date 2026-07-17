import { describe, expect, it } from "vitest";

import { parseCatalogSearch } from "./runtime";

describe("parseCatalogSearch", () => {
  it("normalizes TanStack scalar and repeated values for business route parsing", () => {
    expect(
      parseCatalogSearch({
        future: true,
        futureCount: 200,
        meter: [0, "1", false],
      }),
    ).toEqual({
      future: "true",
      futureCount: "200",
      meter: ["0", "1", "false"],
    });
  });

  it("drops unsupported values without leaking unvalidated objects", () => {
    expect(
      parseCatalogSearch({ empty: null, nested: { value: "unsafe" }, mixed: ["valid", null, {}] }),
    ).toEqual({ mixed: ["valid"] });
  });
});
