import { controllerCapabilityStates } from "../capability/value";
import { controllerCommandMetadata, knownControllerCommandIds } from "../command/value";
import { normalizeGamepadSnapshot } from "../input/runtime";
import type { ControllerControlState, ControllerGamepadSnapshot } from "../input/type";
import { controllerControlIds } from "../input/value";
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
import { controllerCommandEventPhases } from "./value";

export const defaultControllerRepeatConfig = {
  initialDelayMs: 450,
  intervalMs: 90,
} as const satisfies ControllerRepeatConfig;

export const defaultControllerBindings = [
  {
    controlId: controllerControlIds.dpadUp,
    commandId: knownControllerCommandIds.navUp,
    repeat: true,
  },
  {
    controlId: controllerControlIds.dpadDown,
    commandId: knownControllerCommandIds.navDown,
    repeat: true,
  },
  {
    controlId: controllerControlIds.dpadLeft,
    commandId: knownControllerCommandIds.navLeft,
    repeat: true,
  },
  {
    controlId: controllerControlIds.dpadRight,
    commandId: knownControllerCommandIds.navRight,
    repeat: true,
  },
  {
    controlId: controllerControlIds.leftStickUp,
    commandId: knownControllerCommandIds.navUp,
    repeat: true,
  },
  {
    controlId: controllerControlIds.leftStickDown,
    commandId: knownControllerCommandIds.navDown,
    repeat: true,
  },
  {
    controlId: controllerControlIds.leftStickLeft,
    commandId: knownControllerCommandIds.navLeft,
    repeat: true,
  },
  {
    controlId: controllerControlIds.leftStickRight,
    commandId: knownControllerCommandIds.navRight,
    repeat: true,
  },
  { controlId: controllerControlIds.faceSouth, commandId: knownControllerCommandIds.confirm },
  { controlId: controllerControlIds.faceEast, commandId: knownControllerCommandIds.back },
  { controlId: controllerControlIds.faceWest, commandId: knownControllerCommandIds.openActions },
  { controlId: controllerControlIds.faceNorth, commandId: knownControllerCommandIds.openFilters },
  {
    controlId: controllerControlIds.leftShoulder,
    commandId: knownControllerCommandIds.previousTab,
  },
  { controlId: controllerControlIds.rightShoulder, commandId: knownControllerCommandIds.nextTab },
  {
    controlId: controllerControlIds.leftTrigger,
    commandId: knownControllerCommandIds.builderPreviousGroup,
  },
  {
    controlId: controllerControlIds.rightTrigger,
    commandId: knownControllerCommandIds.builderNextGroup,
  },
  {
    controlId: controllerControlIds.select,
    commandId: knownControllerCommandIds.openControllerHelp,
  },
  { controlId: controllerControlIds.start, commandId: knownControllerCommandIds.openGlobalMenu },
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
  let gesturingSnapshot: ControllerGamepadSnapshot | undefined;

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

    if (gesturingSnapshot === undefined) {
      const normalized = normalizeGamepadSnapshot(snapshot);

      if (normalized.pressedControls.length > 0) {
        gesturingSnapshot = snapshot;
      }
    }
  }

  return previous ?? gesturingSnapshot;
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
    lifecycleState: controllerCapabilityStates.awaitingGesture,
  };
  let activeGamepadId: string | undefined;
  let heldBindings = new Map<string, HeldBinding>();
  let sequence = 0;
  let hasConnected = false;

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
    const sourceState = input.sourceState ?? controllerCapabilityStates.ready;

    if (sourceState !== controllerCapabilityStates.ready) {
      const lifecycleState =
        sourceState === controllerCapabilityStates.awaitingNeutral
          ? controllerCapabilityStates.awaitingNeutral
          : sourceState;
      bridgeState = {
        connected: false,
        lastConnectedAt: bridgeState.lastConnectedAt,
        lastDisconnectedAt: bridgeState.lastDisconnectedAt,
        lifecycleState,
      };
      activeGamepadId = undefined;
      resetHeldState();

      return { events: [], state: bridgeState };
    }

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
        lifecycleState: hasConnected
          ? controllerCapabilityStates.disconnected
          : controllerCapabilityStates.awaitingGesture,
      };
      activeGamepadId = undefined;
      resetHeldState();

      return {
        state: bridgeState,
        events: [],
      };
    }

    const changedController =
      activeGamepadId !== activeGamepad.id ||
      bridgeState.activeGamepadIndex !== activeGamepad.index;

    if (changedController) {
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

    const hasPressedControls = normalized.pressedControls.length > 0;
    const requiresNeutral =
      changedController || bridgeState.lifecycleState !== controllerCapabilityStates.ready;

    if (requiresNeutral) {
      bridgeState = {
        connected: true,
        activeGamepadIndex: activeGamepad.index,
        profileId: profile.id,
        lastConnectedAt: bridgeState.lastConnectedAt ?? timestamp,
        lastDisconnectedAt: bridgeState.lastDisconnectedAt,
        lifecycleState: hasPressedControls
          ? controllerCapabilityStates.awaitingNeutral
          : controllerCapabilityStates.ready,
      };
      activeGamepadId = activeGamepad.id;
      hasConnected = true;
      resetHeldState();

      return { activeGamepad: normalized, events: [], state: bridgeState };
    }

    bridgeState = {
      connected: true,
      activeGamepadIndex: activeGamepad.index,
      profileId: profile.id,
      lastConnectedAt: bridgeState.lastConnectedAt ?? timestamp,
      lastDisconnectedAt: bridgeState.lastDisconnectedAt,
      lifecycleState: controllerCapabilityStates.ready,
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
        events.push(
          emitCommand(
            binding,
            control,
            activeGamepad,
            controllerCommandEventPhases.press,
            timestamp,
          ),
        );
        continue;
      }

      const repeat = binding.repeat ?? repeatableCommandIds.has(binding.commandId);
      const repeatConfig = options.repeat ?? defaultControllerRepeatConfig;
      const pastInitialDelay = timestamp - held.firstPressedAt >= repeatConfig.initialDelayMs;
      const pastRepeatInterval = timestamp - held.lastEmittedAt >= repeatConfig.intervalMs;

      if (repeat && pastInitialDelay && pastRepeatInterval) {
        held.lastEmittedAt = timestamp;
        events.push(
          emitCommand(
            binding,
            control,
            activeGamepad,
            controllerCommandEventPhases.repeat,
            timestamp,
          ),
        );
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
        lifecycleState: controllerCapabilityStates.awaitingGesture,
      };
      activeGamepadId = undefined;
      resetHeldState();
      sequence = 0;
      hasConnected = false;
    },
  };
}
