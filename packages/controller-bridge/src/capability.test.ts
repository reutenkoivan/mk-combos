import { readControllerBrowserSource } from "@mk-combos/controller-bridge/capability/runtime";
import { describe, expect, it } from "vitest";

const gamepad = {
  axes: [0, 0, 0, 0],
  buttons: [{ pressed: false, touched: false, value: 0 }],
  connected: true,
  id: "Standard Controller",
  index: 0,
  mapping: "standard" as const,
  timestamp: 10,
};

describe("controller browser capability", () => {
  it("reports unsupported and suspended browser boundaries", () => {
    expect(readControllerBrowserSource({ isSecureContext: false }).state).toBe("unsupported");
    expect(
      readControllerBrowserSource({
        document: { visibilityState: "hidden" },
        isSecureContext: true,
      }).state,
    ).toBe("suspended");
  });

  it("requires a gesture until the browser exposes a controller", () => {
    expect(
      readControllerBrowserSource({
        isSecureContext: true,
        navigator: { getGamepads: () => [] },
      }),
    ).toMatchObject({ reason: "gestureRequired", state: "awaitingGesture" });
  });

  it("normalizes browser snapshots without leaking native objects", () => {
    const source = readControllerBrowserSource({
      isSecureContext: true,
      navigator: { getGamepads: () => [gamepad] },
    });

    expect(source.state).toBe("ready");
    expect(source.gamepads[0]).toMatchObject({ id: "Standard Controller", mapping: "standard" });
  });

  it("normalizes permission policy failures as blocked capability", () => {
    const source = readControllerBrowserSource({
      isSecureContext: true,
      navigator: {
        getGamepads: () => {
          throw new DOMException("Blocked", "SecurityError");
        },
      },
    });

    expect(source).toMatchObject({ reason: "permissionBlocked", state: "blocked" });
  });
});
