import { ControllerGamepadSnapshotSchema } from "../input/schema";
import { ControllerBrowserSourceResultSchema } from "./schema";
import type { ControllerBrowserSourceResult } from "./type";
import { controllerCapabilityReasons, controllerCapabilityStates } from "./value";

type BrowserButtonLike = {
  pressed: boolean;
  touched?: boolean;
  value: number;
};

type BrowserGamepadLike = {
  axes: ArrayLike<number>;
  buttons: ArrayLike<BrowserButtonLike>;
  connected: boolean;
  id: string;
  index: number;
  mapping: string;
  timestamp: number;
};

export type ControllerBrowserEnvironment = {
  document?: { visibilityState?: string };
  isSecureContext?: boolean;
  navigator?: {
    getGamepads?: () => ArrayLike<BrowserGamepadLike | null>;
  };
};

const result = (
  input: Omit<ControllerBrowserSourceResult, "gamepads"> & {
    gamepads?: ControllerBrowserSourceResult["gamepads"];
  },
) =>
  ControllerBrowserSourceResultSchema.parse({
    ...input,
    gamepads: input.gamepads ?? [],
  });

export function readControllerBrowserSource(
  environment: ControllerBrowserEnvironment = globalThis,
): ControllerBrowserSourceResult {
  if (environment.isSecureContext === false) {
    return result({
      reason: controllerCapabilityReasons.insecureContext,
      state: controllerCapabilityStates.unsupported,
    });
  }

  if (environment.document?.visibilityState === "hidden") {
    return result({
      reason: controllerCapabilityReasons.documentHidden,
      state: controllerCapabilityStates.suspended,
    });
  }

  const getGamepads = environment.navigator?.getGamepads;

  if (!getGamepads) {
    return result({
      reason: controllerCapabilityReasons.apiUnavailable,
      state: controllerCapabilityStates.unsupported,
    });
  }

  try {
    const nativeGamepads = getGamepads.call(environment.navigator);
    const gamepads = [];

    for (let index = 0; index < nativeGamepads.length; index += 1) {
      const gamepad = nativeGamepads[index];

      if (!gamepad) {
        continue;
      }

      gamepads.push(
        ControllerGamepadSnapshotSchema.parse({
          axes: Array.from(gamepad.axes),
          buttons: Array.from(gamepad.buttons, (button) => ({
            pressed: button.pressed,
            touched: button.touched ?? button.pressed,
            value: button.value,
          })),
          connected: gamepad.connected,
          id: gamepad.id,
          index: gamepad.index,
          mapping: gamepad.mapping,
          timestamp: gamepad.timestamp,
        }),
      );
    }

    return result({
      gamepads,
      reason:
        gamepads.length === 0
          ? controllerCapabilityReasons.gestureRequired
          : controllerCapabilityReasons.none,
      state:
        gamepads.length === 0
          ? controllerCapabilityStates.awaitingGesture
          : controllerCapabilityStates.ready,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "SecurityError") {
      return result({
        reason: controllerCapabilityReasons.permissionBlocked,
        state: controllerCapabilityStates.blocked,
      });
    }

    throw error;
  }
}
