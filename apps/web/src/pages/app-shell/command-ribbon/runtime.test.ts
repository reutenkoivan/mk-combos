import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import { describe, expect, it } from "vitest";

import { resolveRibbonCommandPresentation } from "./runtime";

describe("controller command ribbon presentation", () => {
  it("keeps navigation textual and maps actions through notation tokens", () => {
    expect(
      resolveRibbonCommandPresentation([
        knownControllerCommandIds.navUp,
        knownControllerCommandIds.navDown,
      ]),
    ).toEqual({ kind: "text", value: "D-Pad" });
    expect(resolveRibbonCommandPresentation([knownControllerCommandIds.openActions])).toEqual({
      kind: "notation",
      token: "1",
    });
    expect(resolveRibbonCommandPresentation([knownControllerCommandIds.openFilters])).toEqual({
      kind: "notation",
      token: "2",
    });
    expect(resolveRibbonCommandPresentation([knownControllerCommandIds.confirm])).toEqual({
      kind: "notation",
      token: "3",
    });
    expect(resolveRibbonCommandPresentation([knownControllerCommandIds.back])).toEqual({
      kind: "notation",
      token: "4",
    });
    expect(resolveRibbonCommandPresentation([knownControllerCommandIds.previousTab])).toEqual({
      kind: "notation",
      token: "leftShoulder",
    });
    expect(resolveRibbonCommandPresentation([knownControllerCommandIds.nextTab])).toEqual({
      kind: "notation",
      token: "rightShoulder",
    });
    expect(resolveRibbonCommandPresentation([knownControllerCommandIds.openGlobalMenu])).toEqual({
      kind: "notation",
      token: "start",
    });
  });
});
