import { controllerCommandMetadata } from "../command/value";
import { normalizeGamepadSnapshot } from "../input/runtime";
import type { ControllerControlState, ControllerGamepadSnapshot } from "../input/type";
import { detectControllerProfile } from "../profile/runtime";
import type {
  ControllerBridgeConfig,
  ControllerBridgePollInput,
  ControllerBridgePollResult,
  ControllerBridgeState,
  ControllerCommandBinding,
  ControllerCommandEvent,
  ControllerRepeatConfig,
} from "./type";

export const defaultControllerRepeatConfig = {
  initialDelayMs: 450,
  intervalMs: 90,
} as const satisfies ControllerRepeatConfig;

export const defaultControllerBindings = [
  { controlId: "dpadUp", commandId: "navUp", repeat: true },
  { controlId: "dpadDown", commandId: "navDown", repeat: true },
  { controlId: "dpadLeft", commandId: "navLeft", repeat: true },
  { controlId: "dpadRight", commandId: "navRight", repeat: true },
  { controlId: "leftStickUp", commandId: "navUp", repeat: true },
  { controlId: "leftStickDown", commandId: "navDown", repeat: true },
  { controlId: "leftStickLeft", commandId: "navLeft", repeat: true },
  { controlId: "leftStickRight", commandId: "navRight", repeat: true },
  { controlId: "faceSouth", commandId: "confirm" },
  { controlId: "faceEast", commandId: "back" },
  { controlId: "faceWest", commandId: "openActions" },
  { controlId: "faceNorth", commandId: "openFilters" },
  { controlId: "leftShoulder", commandId: "previousTab" },
  { controlId: "rightShoulder", commandId: "nextTab" },
  { controlId: "leftTrigger", commandId: "builderPreviousGroup" },
  { controlId: "rightTrigger", commandId: "builderNextGroup" },
  { controlId: "select", commandId: "closePanel" },
  { controlId: "start", commandId: "builderFinish" },
] as const satisfies readonly ControllerCommandBinding[];

type HeldBinding = {
  controlId: string;
  commandId: string;
  firstPressedAt: number;
  lastEmittedAt: number;
};

const repeatableCommandIds = new Set<string>();

for (const metadata of controllerCommandMetadata) {
  if ("repeatable" in metadata && metadata.repeatable) {
    repeatableCommandIds.add(metadata.id);
  }
}

const getBindingKey = (binding: ControllerCommandBinding) =>
  `${binding.controlId}:${binding.commandId}`;

const selectActiveGamepad = (
  snapshots: readonly ControllerGamepadSnapshot[],
  requestedIndex: number | undefined,
  previousIndex: number | undefined,
) => {
  let previous: ControllerGamepadSnapshot | undefined;
  let lowestIndexSnapshot: ControllerGamepadSnapshot | undefined;

  for (const snapshot of snapshots) {
    if (!snapshot.connected) {
      continue;
    }

    if (requestedIndex !== undefined && snapshot.index === requestedIndex) {
      return snapshot;
    }

    if (previous === undefined && previousIndex !== undefined && snapshot.index === previousIndex) {
      previous = snapshot;
    }

    if (lowestIndexSnapshot === undefined || snapshot.index < lowestIndexSnapshot.index) {
      lowestIndexSnapshot = snapshot;
    }
  }

  return previous ?? lowestIndexSnapshot;
};

const toControlStateMap = (controls: readonly ControllerControlState[]) => {
  const controlsById = new Map<string, ControllerControlState>();

  for (const control of controls) {
    controlsById.set(control.id, control);
  }

  return controlsById;
};

const collectHeldControlIds = (heldBindings: ReadonlyMap<string, HeldBinding>) => {
  const heldControlIds: string[] = [];
  const seenHeldControlIds = new Set<string>();

  for (const held of heldBindings.values()) {
    if (seenHeldControlIds.has(held.controlId)) {
      continue;
    }

    seenHeldControlIds.add(held.controlId);
    heldControlIds.push(held.controlId);
  }

  return heldControlIds;
};

export function createControllerBridge(options: ControllerBridgeConfig = {}) {
  let bridgeState: ControllerBridgeState = {
    connected: false,
  };
  let activeGamepadId: string | undefined;
  let heldBindings = new Map<string, HeldBinding>();
  let sequence = 0;

  const resetHeldState = () => {
    heldBindings = new Map();
  };

  const emitCommand = (
    binding: ControllerCommandBinding,
    control: ControllerControlState,
    gamepad: ControllerGamepadSnapshot,
    phase: ControllerCommandEvent["phase"],
    timestamp: number,
  ): ControllerCommandEvent => {
    const profile = detectControllerProfile(gamepad);
    const event: ControllerCommandEvent = {
      sequence,
      commandId: binding.commandId,
      controlId: binding.controlId,
      gamepadId: gamepad.id,
      gamepadIndex: gamepad.index,
      profileId: profile.id,
      phase,
      timestamp,
      value: control.value,
    };

    sequence += 1;

    if (binding.metadata !== undefined) {
      event.metadata = binding.metadata;
    }

    return event;
  };

  const process = (input: ControllerBridgePollInput): ControllerBridgePollResult => {
    const timestamp = input.timestamp;
    const activeGamepad = selectActiveGamepad(
      input.gamepads,
      input.activeGamepadIndex ?? options.activeGamepadIndex,
      bridgeState.activeGamepadIndex,
    );

    if (activeGamepad === undefined) {
      const lastDisconnectedAt = bridgeState.connected ? timestamp : bridgeState.lastDisconnectedAt;
      bridgeState = {
        connected: false,
        lastConnectedAt: bridgeState.lastConnectedAt,
        lastDisconnectedAt,
      };
      activeGamepadId = undefined;
      resetHeldState();

      return {
        state: bridgeState,
        events: [],
      };
    }

    if (
      activeGamepadId !== activeGamepad.id ||
      bridgeState.activeGamepadIndex !== activeGamepad.index
    ) {
      resetHeldState();
    }

    const profile = detectControllerProfile(activeGamepad);
    const normalized = normalizeGamepadSnapshot(activeGamepad, {
      config: options.input,
      heldControls: collectHeldControlIds(heldBindings),
    });
    const controls = toControlStateMap(normalized.controls);
    const bindings: readonly ControllerCommandBinding[] =
      input.bindings ?? options.bindings ?? defaultControllerBindings;
    const pressedBindingKeys = new Set<string>();
    const events: ControllerCommandEvent[] = [];

    bridgeState = {
      connected: true,
      activeGamepadIndex: activeGamepad.index,
      profileId: profile.id,
      lastConnectedAt: bridgeState.lastConnectedAt ?? timestamp,
      lastDisconnectedAt: bridgeState.lastDisconnectedAt,
    };
    activeGamepadId = activeGamepad.id;

    for (const binding of bindings) {
      const control = controls.get(binding.controlId);
      if (control === undefined || !control.pressed) {
        continue;
      }

      const key = getBindingKey(binding);
      pressedBindingKeys.add(key);
      const held = heldBindings.get(key);

      if (held === undefined) {
        heldBindings.set(key, {
          controlId: binding.controlId,
          commandId: binding.commandId,
          firstPressedAt: timestamp,
          lastEmittedAt: timestamp,
        });
        events.push(emitCommand(binding, control, activeGamepad, "press", timestamp));
        continue;
      }

      const repeat = binding.repeat ?? repeatableCommandIds.has(binding.commandId);
      const repeatConfig = options.repeat ?? defaultControllerRepeatConfig;
      const pastInitialDelay = timestamp - held.firstPressedAt >= repeatConfig.initialDelayMs;
      const pastRepeatInterval = timestamp - held.lastEmittedAt >= repeatConfig.intervalMs;

      if (repeat && pastInitialDelay && pastRepeatInterval) {
        held.lastEmittedAt = timestamp;
        events.push(emitCommand(binding, control, activeGamepad, "repeat", timestamp));
      }
    }

    for (const key of heldBindings.keys()) {
      if (!pressedBindingKeys.has(key)) {
        heldBindings.delete(key);
      }
    }

    return {
      state: bridgeState,
      activeGamepad: normalized,
      events,
    };
  };

  return {
    getState: () => ({ ...bridgeState }),
    process,
    reset: () => {
      bridgeState = {
        connected: false,
      };
      activeGamepadId = undefined;
      resetHeldState();
      sequence = 0;
    },
  };
}
