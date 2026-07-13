import {
  createControllerBridge,
  defaultControllerRepeatConfig,
} from "@mk-combos/controller-bridge/bridge/runtime";
import { buildControllerHints } from "@mk-combos/controller-bridge/hint/runtime";
import {
  createGamepadSnapshot,
  normalizeGamepadSnapshot,
} from "@mk-combos/controller-bridge/input/runtime";
import type { ControllerGamepadSnapshot } from "@mk-combos/controller-bridge/input/type";
import {
  detectControllerProfile,
  getControllerButtonLabel,
} from "@mk-combos/controller-bridge/profile/runtime";
import { describe, expect, it } from "vitest";

const createButtons = (pressedIndexes: readonly number[] = []) =>
  Array.from({ length: 17 }, (_, index) => ({
    pressed: pressedIndexes.includes(index),
    touched: false,
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

const processActiveGamepadIndex = (input: {
  bridge?: ReturnType<typeof createControllerBridge>;
  timestamp?: number;
  activeGamepadIndex?: number;
  gamepads: readonly ControllerGamepadSnapshot[];
}) => {
  const bridge = input.bridge ?? createControllerBridge();
  const pollInput: Parameters<ReturnType<typeof createControllerBridge>["process"]>[0] = {
    timestamp: input.timestamp ?? 0,
    gamepads: input.gamepads,
  };

  if (input.activeGamepadIndex !== undefined) {
    pollInput.activeGamepadIndex = input.activeGamepadIndex;
  }

  return bridge.process(pollInput).state.activeGamepadIndex;
};

describe("@mk-combos/controller-bridge runtime", () => {
  it("detects DualSense, Xbox, and standard profiles", () => {
    expect(detectControllerProfile(createGamepad({ id: "DualSense Wireless Controller" })).id).toBe(
      "dualsense",
    );
    expect(detectControllerProfile(createGamepad({ id: "Xbox 360 Controller XInput" })).id).toBe(
      "xbox",
    );
    expect(detectControllerProfile(createGamepad({ id: "Unknown USB Controller" })).id).toBe(
      "standard",
    );
  });

  it("normalizes buttons, sticks, and axis release threshold", () => {
    const nativeSnapshot = createGamepadSnapshot({
      id: "Native Standard Gamepad",
      index: 2,
      connected: true,
      mapping: "standard",
      timestamp: 7,
      buttons: createButtons([1]),
      axes: [0, 0, 0, 0],
    });
    const pressed = normalizeGamepadSnapshot(
      createGamepad({
        pressedButtons: [0],
        axes: [0.7, -0.8, 0, 0],
      }),
    );
    const softAxis = normalizeGamepadSnapshot(
      createGamepad({
        axes: [0.4, 0, 0, 0],
      }),
      {
        heldControls: ["leftStickRight"],
      },
    );
    const softAxisWithoutHold = normalizeGamepadSnapshot(
      createGamepad({
        axes: [0.4, 0, 0, 0],
      }),
    );

    expect(nativeSnapshot).toMatchObject({
      id: "Native Standard Gamepad",
      index: 2,
      buttons: expect.arrayContaining([expect.objectContaining({ value: 1 })]),
    });
    expect(pressed.pressedControls).toEqual(
      expect.arrayContaining(["faceSouth", "leftStickRight", "leftStickUp"]),
    );
    expect(softAxis.pressedControls).toContain("leftStickRight");
    expect(softAxisWithoutHold.pressedControls).not.toContain("leftStickRight");
  });

  it("preserves pressed control order while normalizing in one pass", () => {
    const pressed = normalizeGamepadSnapshot(
      createGamepad({
        pressedButtons: [0, 1, 15],
        axes: [0.7, -0.8, 0, 0],
      }),
    );

    expect(pressed.pressedControls).toEqual([
      "faceSouth",
      "faceEast",
      "dpadRight",
      "leftStickRight",
      "leftStickUp",
    ]);
  });

  it("selects active gamepad by requested, previous, then first controller gesture", () => {
    const requestedIndex = processActiveGamepadIndex({
      activeGamepadIndex: 5,
      gamepads: [
        createGamepad({ id: "Previous", index: 3 }),
        createGamepad({ id: "Lowest", index: 1 }),
        createGamepad({ id: "Requested", index: 5 }),
      ],
    });
    const previousBridge = createControllerBridge();

    processActiveGamepadIndex({
      bridge: previousBridge,
      activeGamepadIndex: 3,
      gamepads: [createGamepad({ id: "Previous", index: 3 })],
    });

    const previousIndex = processActiveGamepadIndex({
      bridge: previousBridge,
      timestamp: 10,
      gamepads: [
        createGamepad({ id: "Lowest", index: 1 }),
        createGamepad({ id: "Previous", index: 3 }),
      ],
    });
    const gesturingIndex = processActiveGamepadIndex({
      gamepads: [
        createGamepad({ id: "High", index: 7 }),
        createGamepad({ id: "Disconnected", index: 0, connected: false }),
        createGamepad({ id: "Gesturing", index: 2, pressedButtons: [0] }),
      ],
    });

    expect(requestedIndex).toBe(5);
    expect(previousIndex).toBe(3);
    expect(gesturingIndex).toBe(2);
  });

  it("does not duplicate held non-repeat commands", () => {
    const bridge = createControllerBridge();
    const gamepad = createGamepad({ pressedButtons: [0] });

    expect(bridge.process({ timestamp: 0, gamepads: [gamepad] }).events).toEqual([]);
    expect(bridge.getState().lifecycleState).toBe("awaitingNeutral");
    expect(
      bridge.process({ timestamp: 10, gamepads: [createGamepad()] }).state.lifecycleState,
    ).toBe("ready");
    expect(bridge.process({ timestamp: 20, gamepads: [gamepad] }).events).toMatchObject([
      { commandId: "confirm", phase: "press" },
    ]);
    expect(bridge.process({ timestamp: 1000, gamepads: [gamepad] }).events).toEqual([]);
  });

  it("emits held repeat commands only after delay and interval", () => {
    expect(defaultControllerRepeatConfig).toEqual({
      initialDelayMs: 450,
      intervalMs: 90,
    });
    const bridge = createControllerBridge({
      repeat: {
        initialDelayMs: 300,
        intervalMs: 100,
      },
    });
    const gamepad = createGamepad({ pressedButtons: [15] });

    bridge.process({ timestamp: 0, gamepads: [gamepad] });
    bridge.process({ timestamp: 10, gamepads: [createGamepad()] });
    expect(bridge.process({ timestamp: 20, gamepads: [gamepad] }).events).toMatchObject([
      { commandId: "navRight", phase: "press" },
    ]);
    expect(bridge.process({ timestamp: 270, gamepads: [gamepad] }).events).toEqual([]);
    expect(bridge.process({ timestamp: 320, gamepads: [gamepad] }).events).toMatchObject([
      { commandId: "navRight", phase: "repeat" },
    ]);
    expect(bridge.process({ timestamp: 370, gamepads: [gamepad] }).events).toEqual([]);
    expect(bridge.process({ timestamp: 420, gamepads: [gamepad] }).events).toMatchObject([
      { commandId: "navRight", phase: "repeat" },
    ]);
  });

  it("keeps session ownership and requires neutral after visibility resume", () => {
    const bridge = createControllerBridge();
    const ownerGesture = createGamepad({ id: "Owner", index: 4, pressedButtons: [0] });
    const secondGesture = createGamepad({ id: "Second", index: 1, pressedButtons: [1] });

    bridge.process({ timestamp: 0, gamepads: [ownerGesture, secondGesture] });
    expect(bridge.getState().activeGamepadIndex).toBe(4);
    bridge.process({
      timestamp: 10,
      gamepads: [createGamepad({ id: "Owner", index: 4 }), secondGesture],
    });
    expect(bridge.getState().lifecycleState).toBe("ready");

    const suspended = bridge.process({
      gamepads: [],
      sourceState: "suspended",
      timestamp: 20,
    });
    expect(suspended.state.lifecycleState).toBe("suspended");
    expect(bridge.process({ timestamp: 30, gamepads: [ownerGesture] }).events).toEqual([]);
    expect(bridge.getState().lifecycleState).toBe("awaitingNeutral");
    bridge.process({ timestamp: 40, gamepads: [createGamepad({ id: "Owner", index: 4 })] });
    expect(bridge.getState().lifecycleState).toBe("ready");
  });

  it("builds profile-specific hint labels", () => {
    const xboxHints = buildControllerHints({ profileId: "xbox", commandIds: ["confirm"] });
    const dualSenseHints = buildControllerHints({
      profileId: "dualsense",
      commandIds: ["confirm"],
    });

    expect(xboxHints).toMatchObject([
      {
        commandId: "confirm",
        controlId: "faceSouth",
        controlLabel: { EN: "A", fallback: "A" },
      },
    ]);
    expect(dualSenseHints).toMatchObject([
      {
        commandId: "confirm",
        controlId: "faceSouth",
        controlLabel: { EN: "Cross", fallback: "Cross" },
      },
    ]);
    expect(getControllerButtonLabel("missing-profile", "futurePaddle")).toEqual({
      fallback: "futurePaddle",
    });
  });
});
