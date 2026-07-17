import { describe, expect, it } from "vitest";

import { createSettingsControllerFocusScope } from "./runtime";

describe("createSettingsControllerFocusScope", () => {
  it("connects rows vertically and options horizontally without DOM geometry", () => {
    const scope = createSettingsControllerFocusScope({
      entryTargetId: "close",
      fallbackTargetId: "close",
      id: "settings",
      rows: [
        [{ id: "close" }],
        [{ id: "interface" }, { id: "backup" }],
        [{ id: "light" }, { id: "dark" }, { id: "system" }],
      ],
    });

    expect(scope.targets).toEqual([
      {
        disabled: undefined,
        id: "close",
        neighbors: { down: "interface", left: undefined, right: undefined, up: undefined },
      },
      {
        disabled: undefined,
        id: "interface",
        neighbors: { down: "light", left: undefined, right: "backup", up: "close" },
      },
      {
        disabled: undefined,
        id: "backup",
        neighbors: { down: "dark", left: "interface", right: undefined, up: "close" },
      },
      {
        disabled: undefined,
        id: "light",
        neighbors: { down: undefined, left: undefined, right: "dark", up: "interface" },
      },
      {
        disabled: undefined,
        id: "dark",
        neighbors: { down: undefined, left: "light", right: "system", up: "backup" },
      },
      {
        disabled: undefined,
        id: "system",
        neighbors: { down: undefined, left: "dark", right: undefined, up: "backup" },
      },
    ]);
  });

  it("preserves disabled dialog targets so focus resolution can skip busy actions", () => {
    const scope = createSettingsControllerFocusScope({
      entryTargetId: "cancel",
      fallbackTargetId: "cancel",
      id: "dialog",
      rows: [
        [
          { disabled: true, id: "cancel" },
          { disabled: true, id: "confirm" },
        ],
      ],
    });

    expect(scope.targets.map(({ disabled, id }) => ({ disabled, id }))).toEqual([
      { disabled: true, id: "cancel" },
      { disabled: true, id: "confirm" },
    ]);
  });
});
