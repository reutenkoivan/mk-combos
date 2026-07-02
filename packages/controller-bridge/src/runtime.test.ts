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
    } as unknown as Gamepad);
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

  it("does not duplicate held non-repeat commands", () => {
    const bridge = createControllerBridge();
    const gamepad = createGamepad({ pressedButtons: [0] });

    expect(bridge.process({ timestamp: 0, gamepads: [gamepad] }).events).toMatchObject([
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

    expect(bridge.process({ timestamp: 0, gamepads: [gamepad] }).events).toMatchObject([
      { commandId: "navRight", phase: "press" },
    ]);
    expect(bridge.process({ timestamp: 250, gamepads: [gamepad] }).events).toEqual([]);
    expect(bridge.process({ timestamp: 300, gamepads: [gamepad] }).events).toMatchObject([
      { commandId: "navRight", phase: "repeat" },
    ]);
    expect(bridge.process({ timestamp: 350, gamepads: [gamepad] }).events).toEqual([]);
    expect(bridge.process({ timestamp: 400, gamepads: [gamepad] }).events).toMatchObject([
      { commandId: "navRight", phase: "repeat" },
    ]);
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
