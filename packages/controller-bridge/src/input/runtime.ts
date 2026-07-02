import { detectControllerProfile } from "../profile/runtime";
import { ControllerInputConfigSchema } from "./schema";
import type {
  ControllerControlId,
  ControllerControlState,
  ControllerGamepadButtonSnapshot,
  ControllerGamepadSnapshot,
  ControllerInputConfig,
  NormalizedControllerInputSnapshot,
} from "./type";
import {
  defaultControllerInputConfig,
  standardGamepadAxisControls,
  standardGamepadButtonControls,
} from "./value";

export type NormalizeGamepadSnapshotOptions = {
  config?: Partial<ControllerInputConfig>;
  heldControls?: readonly ControllerControlId[];
};

const resolveInputConfig = (config: Partial<ControllerInputConfig> = {}) =>
  ControllerInputConfigSchema.parse({
    ...defaultControllerInputConfig,
    ...config,
  });

const clampButtonValue = (button?: ControllerGamepadButtonSnapshot) => {
  if (button === undefined) {
    return 0;
  }

  return Math.max(button.value, button.pressed ? 1 : 0);
};

const getAxisDirectionValue = (
  axisValue: number | undefined,
  direction: "negative" | "positive",
) => {
  const value = axisValue ?? 0;
  return direction === "negative" ? Math.max(0, -value) : Math.max(0, value);
};

export function createGamepadSnapshot(gamepad: Gamepad): ControllerGamepadSnapshot {
  return {
    id: gamepad.id,
    index: gamepad.index,
    connected: gamepad.connected,
    mapping: gamepad.mapping,
    timestamp: gamepad.timestamp,
    buttons: gamepad.buttons.map((button) => ({
      pressed: button.pressed,
      touched: button.touched,
      value: button.value,
    })),
    axes: [...gamepad.axes],
  };
}

export function normalizeGamepadSnapshot(
  snapshot: ControllerGamepadSnapshot,
  options: NormalizeGamepadSnapshotOptions = {},
): NormalizedControllerInputSnapshot {
  const config = resolveInputConfig(options.config);
  const heldControls = new Set(options.heldControls ?? []);
  const profile = detectControllerProfile(snapshot);
  const controls: ControllerControlState[] = [];

  for (const control of standardGamepadButtonControls) {
    const value = clampButtonValue(snapshot.buttons[control.buttonIndex]);
    controls.push({
      id: control.id,
      source: "button",
      pressed: value >= config.buttonPressThreshold,
      value,
      rawIndex: control.buttonIndex,
    });
  }

  for (const control of standardGamepadAxisControls) {
    const value = getAxisDirectionValue(snapshot.axes[control.axisIndex], control.direction);
    const threshold = heldControls.has(control.id)
      ? config.axisReleaseThreshold
      : config.axisPressThreshold;

    controls.push({
      id: control.id,
      source: "axis",
      pressed: value >= threshold,
      value,
      rawIndex: control.axisIndex,
      direction: control.direction,
    });
  }

  return {
    gamepadId: snapshot.id,
    gamepadIndex: snapshot.index,
    connected: snapshot.connected,
    profileId: profile.id,
    timestamp: snapshot.timestamp,
    controls,
    pressedControls: controls.filter((control) => control.pressed).map((control) => control.id),
  };
}
