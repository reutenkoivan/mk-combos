import { createControllerBridge } from "@mk-combos/controller-bridge/bridge/runtime";
import { buildControllerHints } from "@mk-combos/controller-bridge/hint/runtime";
import type { ControllerGamepadSnapshot } from "@mk-combos/controller-bridge/input/type";
import { describe, expect, it } from "vitest";

const createButtons = (pressedIndexes: readonly number[] = []) =>
  Array.from({ length: 17 }, (_, index) => ({
    pressed: pressedIndexes.includes(index),
    value: pressedIndexes.includes(index) ? 1 : 0,
  }));

const createGamepad = (
  input: {
    id?: string;
    index?: number;
    connected?: boolean;
    timestamp?: number;
    pressedButtons?: readonly number[];
    axes?: readonly number[];
  } = {},
): ControllerGamepadSnapshot => ({
  id: input.id ?? "Xbox Wireless Controller",
  index: input.index ?? 0,
  connected: input.connected ?? true,
  mapping: "standard",
  timestamp: input.timestamp ?? 0,
  buttons: createButtons(input.pressedButtons),
  axes: input.axes ?? [0, 0, 0, 0],
});

describe("@mk-combos/controller-bridge integration", () => {
  it("connects gamepad profile detection, normalization, and command emission", () => {
    const bridge = createControllerBridge();
    const activation = bridge.process({
      timestamp: 0,
      gamepads: [createGamepad({ id: "Xbox Wireless Controller", pressedButtons: [0] })],
    });
    bridge.process({
      timestamp: 10,
      gamepads: [createGamepad({ id: "Xbox Wireless Controller" })],
    });
    const result = bridge.process({
      timestamp: 20,
      gamepads: [createGamepad({ id: "Xbox Wireless Controller", pressedButtons: [0] })],
    });

    expect(activation.state).toMatchObject({
      connected: true,
      activeGamepadIndex: 0,
      lifecycleState: "awaitingNeutral",
      profileId: "xbox",
    });
    expect(activation.events).toEqual([]);
    expect(result.activeGamepad?.pressedControls).toContain("faceSouth");
    expect(result.events).toMatchObject([
      {
        commandId: "confirm",
        controlId: "faceSouth",
        phase: "press",
        profileId: "xbox",
      },
    ]);
  });

  it("keeps stick navigation active through release threshold and releases below it", () => {
    const bridge = createControllerBridge();
    bridge.process({
      timestamp: 0,
      gamepads: [createGamepad({ axes: [0.7, 0, 0, 0] })],
    });
    bridge.process({ timestamp: 10, gamepads: [createGamepad()] });
    const hardPress = bridge.process({
      timestamp: 20,
      gamepads: [createGamepad({ axes: [0.7, 0, 0, 0] })],
    });
    const softHeld = bridge.process({
      timestamp: 100,
      gamepads: [createGamepad({ axes: [0.4, 0, 0, 0] })],
    });
    const released = bridge.process({
      timestamp: 200,
      gamepads: [createGamepad({ axes: [0.2, 0, 0, 0] })],
    });
    const pressedAgain = bridge.process({
      timestamp: 300,
      gamepads: [createGamepad({ axes: [0.7, 0, 0, 0] })],
    });

    expect(hardPress.events).toMatchObject([{ commandId: "navRight", phase: "press" }]);
    expect(softHeld.activeGamepad?.pressedControls).toContain("leftStickRight");
    expect(softHeld.events).toEqual([]);
    expect(released.activeGamepad?.pressedControls).not.toContain("leftStickRight");
    expect(pressedAgain.events).toMatchObject([{ commandId: "navRight", phase: "press" }]);
  });

  it("emits repeat timing for held navigation and suppresses repeated action buttons", () => {
    const bridge = createControllerBridge({
      repeat: {
        initialDelayMs: 300,
        intervalMs: 100,
      },
    });
    const navigation = createGamepad({ pressedButtons: [12] });
    const action = createGamepad({ pressedButtons: [0] });

    bridge.process({ timestamp: 0, gamepads: [navigation] });
    bridge.process({ timestamp: 10, gamepads: [createGamepad()] });
    expect(bridge.process({ timestamp: 20, gamepads: [navigation] }).events).toMatchObject([
      { commandId: "navUp", phase: "press" },
    ]);
    expect(bridge.process({ timestamp: 319, gamepads: [navigation] }).events).toEqual([]);
    expect(bridge.process({ timestamp: 320, gamepads: [navigation] }).events).toMatchObject([
      { commandId: "navUp", phase: "repeat" },
    ]);

    bridge.reset();
    bridge.process({ timestamp: 0, gamepads: [action] });
    bridge.process({ timestamp: 10, gamepads: [createGamepad()] });
    expect(bridge.process({ timestamp: 20, gamepads: [action] }).events).toMatchObject([
      { commandId: "confirm", phase: "press" },
    ]);
    expect(bridge.process({ timestamp: 1000, gamepads: [action] }).events).toEqual([]);
  });

  it("clears held state on disconnect so reconnect does not inherit stale input", () => {
    const bridge = createControllerBridge();
    const heldAction = createGamepad({ pressedButtons: [0] });

    bridge.process({ timestamp: 0, gamepads: [heldAction] });
    bridge.process({ timestamp: 10, gamepads: [createGamepad()] });
    expect(bridge.process({ timestamp: 20, gamepads: [heldAction] }).events).toMatchObject([
      { commandId: "confirm", phase: "press" },
    ]);
    expect(bridge.process({ timestamp: 100, gamepads: [heldAction] }).events).toEqual([]);
    expect(
      bridge.process({
        timestamp: 200,
        gamepads: [createGamepad({ connected: false, pressedButtons: [0] })],
      }).state,
    ).toMatchObject({
      connected: false,
      lastDisconnectedAt: 200,
    });
    expect(bridge.process({ timestamp: 300, gamepads: [heldAction] }).events).toEqual([]);
    expect(bridge.getState().lifecycleState).toBe("awaitingNeutral");
    bridge.process({ timestamp: 310, gamepads: [createGamepad()] });
    expect(bridge.process({ timestamp: 320, gamepads: [heldAction] }).events).toMatchObject([
      { commandId: "confirm", phase: "press" },
    ]);
  });

  it("builds DualSense, Xbox, and standard hint labels from the same semantic commands", () => {
    expect(buildControllerHints({ profileId: "dualsense", commandIds: ["confirm"] })).toMatchObject(
      [{ commandId: "confirm", controlLabel: { EN: "Cross", fallback: "Cross" } }],
    );
    expect(buildControllerHints({ profileId: "xbox", commandIds: ["confirm"] })).toMatchObject([
      { commandId: "confirm", controlLabel: { EN: "A", fallback: "A" } },
    ]);
    expect(buildControllerHints({ profileId: "standard", commandIds: ["confirm"] })).toMatchObject([
      {
        commandId: "confirm",
        controlLabel: { EN: "South button", fallback: "South button" },
      },
    ]);
  });
});
