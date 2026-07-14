import { describe, expect, it } from "vitest";
import { parseInstalledGamePathParams } from "./runtime";

describe("installed game path boundary", () => {
  it("accepts only installed open GameId values", () => {
    expect(parseInstalledGamePathParams({ gameId: "mkxl" })).toEqual({ gameId: "mkxl" });
    expect(parseInstalledGamePathParams({ gameId: "mk1" })).toEqual({ gameId: "mk1" });
    expect(parseInstalledGamePathParams({ gameId: "future-game" })).toBe(false);
    expect(parseInstalledGamePathParams({ gameId: "" })).toBe(false);
  });
});
