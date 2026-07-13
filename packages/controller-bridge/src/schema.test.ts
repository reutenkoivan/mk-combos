import { ControllerCommandBindingSchema } from "@mk-combos/controller-bridge/bridge/schema";
import { ControllerBrowserSourceResultSchema } from "@mk-combos/controller-bridge/capability/schema";
import { ControllerCommandMetadataSchema } from "@mk-combos/controller-bridge/command/schema";
import {
  ControllerHintRequestSchema,
  ControllerHintRowSchema,
} from "@mk-combos/controller-bridge/hint/schema";
import {
  ControllerGamepadSnapshotSchema,
  ControllerInputConfigSchema,
  NormalizedControllerInputSnapshotSchema,
} from "@mk-combos/controller-bridge/input/schema";
import { getControllerProfile } from "@mk-combos/controller-bridge/profile/runtime";
import { ControllerProfileSchema } from "@mk-combos/controller-bridge/profile/schema";
import { describe, expect, it } from "vitest";

const baseGamepad = {
  id: "Generic Standard Gamepad",
  index: 0,
  connected: true,
  mapping: "standard",
  timestamp: 100,
  buttons: [{ pressed: true, value: 1 }],
  axes: [0, 0, 0, 0],
} as const;

describe("@mk-combos/controller-bridge schemas", () => {
  it("keeps controller capability payloads strict", () => {
    expect(
      ControllerBrowserSourceResultSchema.parse({
        gamepads: [],
        reason: "gestureRequired",
        state: "awaitingGesture",
      }),
    ).toEqual({ gamepads: [], reason: "gestureRequired", state: "awaitingGesture" });
    expect(
      ControllerBrowserSourceResultSchema.safeParse({
        gamepads: [],
        reason: "gestureRequired",
        state: "awaitingGesture",
        nativeEvent: {},
      }).success,
    ).toBe(false);
  });
  it("keeps command and binding ids forward-compatible but strictly wrapped", () => {
    expect(
      ControllerCommandMetadataSchema.parse({
        id: "futureCommand",
        group: "navigation",
        label: { fallback: "Future command" },
      }),
    ).toEqual({
      id: "futureCommand",
      group: "navigation",
      label: { fallback: "Future command" },
    });
    expect(
      ControllerCommandBindingSchema.parse({
        controlId: "futurePaddle",
        commandId: "futureCommand",
      }),
    ).toEqual({
      controlId: "futurePaddle",
      commandId: "futureCommand",
    });
    expect(
      ControllerCommandBindingSchema.safeParse({
        controlId: "faceSouth",
        commandId: "confirm",
        unexpected: true,
      }).success,
    ).toBe(false);
  });

  it("validates profiles, gamepad snapshots, and normalized input wrappers", () => {
    const standard = getControllerProfile("standard");
    const normalized = {
      gamepadId: baseGamepad.id,
      gamepadIndex: 0,
      connected: true,
      profileId: "standard",
      timestamp: 100,
      controls: [
        {
          id: "faceSouth",
          source: "button",
          pressed: true,
          value: 1,
          rawIndex: 0,
        },
      ],
      pressedControls: ["faceSouth"],
    } as const;

    expect(ControllerProfileSchema.parse(standard)).toEqual(standard);
    expect(ControllerGamepadSnapshotSchema.parse(baseGamepad)).toEqual(baseGamepad);
    expect(NormalizedControllerInputSnapshotSchema.parse(normalized)).toEqual(normalized);
    expect(
      ControllerProfileSchema.safeParse({
        ...standard,
        extra: true,
      }).success,
    ).toBe(false);
    expect(
      ControllerGamepadSnapshotSchema.safeParse({
        ...baseGamepad,
        buttons: [{ value: 1, nativeEvent: true }],
      }).success,
    ).toBe(false);
  });

  it("validates dead-zone thresholds and hint metadata", () => {
    expect(
      ControllerInputConfigSchema.parse({
        axisPressThreshold: 0.6,
        axisReleaseThreshold: 0.3,
        buttonPressThreshold: 0.5,
      }),
    ).toEqual({
      axisPressThreshold: 0.6,
      axisReleaseThreshold: 0.3,
      buttonPressThreshold: 0.5,
    });
    expect(
      ControllerInputConfigSchema.safeParse({
        axisPressThreshold: 0.4,
        axisReleaseThreshold: 0.5,
        buttonPressThreshold: 0.5,
      }).success,
    ).toBe(false);

    const hint = {
      commandId: "confirm",
      commandLabel: { EN: "Confirm", fallback: "Confirm" },
      controlId: "faceSouth",
      controlLabel: { EN: "A", fallback: "A" },
      profileId: "xbox",
      available: true,
    } as const;

    expect(ControllerHintRowSchema.parse(hint)).toEqual(hint);
    expect(
      ControllerHintRequestSchema.parse({
        profileId: "xbox",
        commandIds: ["confirm", "futureCommand"],
        availableCommandIds: ["confirm"],
      }),
    ).toEqual({
      profileId: "xbox",
      commandIds: ["confirm", "futureCommand"],
      availableCommandIds: ["confirm"],
    });
    expect(
      ControllerHintRowSchema.safeParse({
        ...hint,
        browserEvent: {},
      }).success,
    ).toBe(false);
  });
});
