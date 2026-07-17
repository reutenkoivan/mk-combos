import { createControllerBridge } from "@mk-combos/controller-bridge/bridge/runtime";
import type { ControllerBridgeState } from "@mk-combos/controller-bridge/bridge/type";
import { readControllerBrowserSource } from "@mk-combos/controller-bridge/capability/runtime";
import type {
  ControllerBrowserSourceResult,
  ControllerCapabilityReason,
} from "@mk-combos/controller-bridge/capability/type";
import {
  controllerCapabilityReasons,
  controllerCapabilityStates,
} from "@mk-combos/controller-bridge/capability/value";
import type { ControllerCommandId } from "@mk-combos/controller-bridge/command/type";

import type {
  ControllerCommandRibbonCommand,
  ControllerCommandRibbonModel,
  ControllerCommandScope,
  ControllerCommandScopeLayer,
  ControllerCommandScopeRegistry,
  ControllerSessionEnvironment,
  ControllerSessionObservableState,
  CreateControllerSessionOptions,
} from "./type";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayerSequence,
  controllerCommandScopeLayers,
} from "./value";

type RegisteredControllerCommandScope = {
  commandIds?: ReadonlySet<ControllerCommandId>;
  enabled: boolean;
  exclusive: boolean;
  handleCommand: ControllerCommandScope["handleCommand"];
  id: string;
  layer: ControllerCommandScopeLayer;
  passThroughCommandIds: ReadonlySet<ControllerCommandId>;
  ribbon?: ControllerCommandRibbonModel;
  token: symbol;
};

const createLayerRegistry = () =>
  new Map<ControllerCommandScopeLayer, RegisteredControllerCommandScope[]>(
    controllerCommandScopeLayerSequence.map((layer) => [layer, []]),
  );

function copyCommandRibbonModel(
  ribbon: ControllerCommandRibbonModel | undefined,
): ControllerCommandRibbonModel | undefined {
  if (ribbon === undefined) {
    return undefined;
  }

  return {
    accessibleLabel: ribbon.accessibleLabel,
    commands: ribbon.commands.map((command) => ({
      commandIds: [...command.commandIds],
      id: command.id,
      label: command.label,
    })),
    notationDisplayModeOverride: ribbon.notationDisplayModeOverride,
    shellPolicy: ribbon.shellPolicy,
  };
}

function sameCommandRibbonModel(
  left: ControllerCommandRibbonModel | null,
  right: ControllerCommandRibbonModel | null,
): boolean {
  if (left === right) {
    return true;
  }

  if (
    left === null ||
    right === null ||
    left.accessibleLabel !== right.accessibleLabel ||
    left.notationDisplayModeOverride !== right.notationDisplayModeOverride ||
    left.shellPolicy !== right.shellPolicy ||
    left.commands.length !== right.commands.length
  ) {
    return false;
  }

  return left.commands.every((leftCommand, commandIndex) => {
    const rightCommand = right.commands[commandIndex];

    return (
      rightCommand !== undefined &&
      leftCommand.id === rightCommand.id &&
      leftCommand.label === rightCommand.label &&
      leftCommand.commandIds.length === rightCommand.commandIds.length &&
      leftCommand.commandIds.every(
        (commandId, commandIdIndex) => commandId === rightCommand.commandIds[commandIdIndex],
      )
    );
  });
}

function appendUniqueCommands(
  target: ControllerCommandRibbonCommand[],
  commands: readonly ControllerCommandRibbonCommand[],
) {
  const stableIds = new Set(target.map((command) => command.id));
  const emittedCommandIds = new Set(target.flatMap((command) => command.commandIds));

  for (const command of commands) {
    if (
      stableIds.has(command.id) ||
      command.commandIds.some((commandId) => emittedCommandIds.has(commandId))
    ) {
      continue;
    }

    stableIds.add(command.id);
    for (const commandId of command.commandIds) {
      emittedCommandIds.add(commandId);
    }
    target.push(command);
  }
}

export function createControllerCommandScopeRegistry(): ControllerCommandScopeRegistry {
  const scopesByLayer = createLayerRegistry();
  const scopesById = new Map<string, RegisteredControllerCommandScope>();
  const commandRibbonListeners = new Set<() => void>();
  let commandRibbonModel: ControllerCommandRibbonModel | null = null;

  const findLatestEnabledScope = (layer: ControllerCommandScopeLayer) => {
    const scopes = scopesByLayer.get(layer);

    if (scopes === undefined) {
      return undefined;
    }

    for (let index = scopes.length - 1; index >= 0; index -= 1) {
      const scope = scopes[index];

      if (scope?.enabled) {
        return scope;
      }
    }

    return undefined;
  };

  const resolveCommandRibbonModel = (): ControllerCommandRibbonModel | null => {
    const overlayScope = findLatestEnabledScope(controllerCommandScopeLayers.overlay);
    const contextScope = overlayScope ?? findLatestEnabledScope(controllerCommandScopeLayers.page);
    const shellScope = findLatestEnabledScope(controllerCommandScopeLayers.shell);
    const contextRibbon = contextScope?.ribbon;
    const shellRibbon = shellScope?.ribbon;

    if (overlayScope !== undefined && contextRibbon === undefined) {
      return null;
    }

    if (contextRibbon === undefined && shellRibbon === undefined) {
      return null;
    }

    const resolvedCommands: ControllerCommandRibbonCommand[] = [];

    if (contextRibbon !== undefined) {
      appendUniqueCommands(resolvedCommands, contextRibbon.commands);

      if (
        contextRibbon.shellPolicy === controllerCommandRibbonShellPolicies.append &&
        shellRibbon !== undefined
      ) {
        appendUniqueCommands(resolvedCommands, shellRibbon.commands);
      }
    } else if (shellRibbon !== undefined) {
      appendUniqueCommands(resolvedCommands, shellRibbon.commands);
    }

    if (resolvedCommands.length === 0) {
      return null;
    }

    const ownerRibbon = contextRibbon ?? shellRibbon;

    if (ownerRibbon === undefined) {
      return null;
    }

    return {
      accessibleLabel: ownerRibbon.accessibleLabel,
      commands: resolvedCommands,
      notationDisplayModeOverride:
        contextRibbon?.notationDisplayModeOverride ?? shellRibbon?.notationDisplayModeOverride,
      shellPolicy: ownerRibbon.shellPolicy,
    };
  };

  const publishCommandRibbon = () => {
    const nextCommandRibbonModel = resolveCommandRibbonModel();

    if (sameCommandRibbonModel(commandRibbonModel, nextCommandRibbonModel)) {
      return;
    }

    commandRibbonModel = nextCommandRibbonModel;

    for (const listener of commandRibbonListeners) {
      listener();
    }
  };

  const remove = (scope: RegisteredControllerCommandScope) => {
    const layerScopes = scopesByLayer.get(scope.layer);

    if (layerScopes === undefined) {
      return;
    }

    const scopeIndex = layerScopes.indexOf(scope);

    if (scopeIndex >= 0) {
      layerScopes.splice(scopeIndex, 1);
    }

    if (scopesById.get(scope.id)?.token === scope.token) {
      scopesById.delete(scope.id);
    }
  };

  const updateRegisteredScope = (
    registeredScope: RegisteredControllerCommandScope,
    scope: ControllerCommandScope,
  ) => {
    registeredScope.commandIds =
      scope.commandIds === undefined ? undefined : new Set(scope.commandIds);
    registeredScope.enabled = scope.enabled ?? true;
    registeredScope.exclusive = scope.exclusive ?? false;
    registeredScope.handleCommand = scope.handleCommand;
    registeredScope.passThroughCommandIds = new Set(scope.passThroughCommandIds ?? []);
    registeredScope.ribbon = copyCommandRibbonModel(scope.ribbon);
  };

  return {
    clear: () => {
      scopesById.clear();

      for (const scopes of scopesByLayer.values()) {
        scopes.length = 0;
      }

      publishCommandRibbon();
    },
    dispatch: (event) => {
      for (const layer of controllerCommandScopeLayerSequence) {
        const scopes = scopesByLayer.get(layer);

        if (scopes === undefined) {
          continue;
        }

        for (let index = scopes.length - 1; index >= 0; index -= 1) {
          const scope = scopes[index];

          if (scope === undefined || !scope.enabled) {
            continue;
          }

          const acceptsCommand =
            scope.commandIds === undefined || scope.commandIds.has(event.commandId);

          if (acceptsCommand && scope.handleCommand(event)) {
            return { handled: true, scopeId: scope.id };
          }

          if (
            layer === controllerCommandScopeLayers.overlay &&
            scope.exclusive &&
            !scope.passThroughCommandIds.has(event.commandId)
          ) {
            return { handled: false };
          }
        }
      }

      return { handled: false };
    },
    getCommandRibbonModel: () => commandRibbonModel,
    register: (scope) => {
      if (scope.id.trim().length === 0) {
        throw new Error("Controller command scope id must not be empty.");
      }

      const layerScopes = scopesByLayer.get(scope.layer);

      if (layerScopes === undefined) {
        throw new Error(`Unknown controller command scope layer: ${scope.layer}`);
      }

      const previousScope = scopesById.get(scope.id);

      if (previousScope !== undefined) {
        remove(previousScope);
      }

      const registeredScope: RegisteredControllerCommandScope = {
        enabled: true,
        exclusive: false,
        handleCommand: scope.handleCommand,
        id: scope.id,
        layer: scope.layer,
        passThroughCommandIds: new Set(),
        token: Symbol(scope.id),
      };

      updateRegisteredScope(registeredScope, scope);

      layerScopes.push(registeredScope);
      scopesById.set(registeredScope.id, registeredScope);
      publishCommandRibbon();

      return {
        unregister: () => {
          if (scopesById.get(registeredScope.id)?.token !== registeredScope.token) {
            return;
          }

          remove(registeredScope);
          publishCommandRibbon();
        },
        update: (nextScope) => {
          if (scopesById.get(registeredScope.id)?.token !== registeredScope.token) {
            return;
          }

          if (nextScope.id !== registeredScope.id || nextScope.layer !== registeredScope.layer) {
            throw new Error(
              "Controller command scope update cannot change the registered id or layer.",
            );
          }

          updateRegisteredScope(registeredScope, nextScope);
          publishCommandRibbon();
        },
      };
    },
    subscribeCommandRibbon: (listener) => {
      commandRibbonListeners.add(listener);

      return () => commandRibbonListeners.delete(listener);
    },
  };
}

function createBrowserEnvironment(): ControllerSessionEnvironment {
  if (typeof window === "undefined") {
    return {
      browser: {},
      now: () => Date.now(),
    };
  }

  const browser = {
    document: window.document,
    isSecureContext: window.isSecureContext,
    navigator: window.navigator,
  };
  const requestFrame = window.requestAnimationFrame?.bind(window);
  const cancelFrame = window.cancelAnimationFrame?.bind(window);

  return {
    browser,
    cancelAnimationFrame: cancelFrame,
    now: () => window.performance.now(),
    requestAnimationFrame: requestFrame,
    subscribeVisibilityChange: (listener) => {
      window.document.addEventListener("visibilitychange", listener);

      return () => window.document.removeEventListener("visibilitychange", listener);
    },
  };
}

function resolveCapabilityReason(
  state: ControllerBridgeState["lifecycleState"],
  browserReason: ControllerCapabilityReason,
): ControllerCapabilityReason {
  switch (state) {
    case controllerCapabilityStates.awaitingGesture:
      return controllerCapabilityReasons.gestureRequired;
    case controllerCapabilityStates.awaitingNeutral:
      return controllerCapabilityReasons.neutralRequired;
    case controllerCapabilityStates.disconnected:
      return controllerCapabilityReasons.controllerDisconnected;
    case controllerCapabilityStates.suspended:
      return controllerCapabilityReasons.documentHidden;
    case controllerCapabilityStates.blocked:
    case controllerCapabilityStates.checking:
    case controllerCapabilityStates.ready:
    case controllerCapabilityStates.unsupported:
      return browserReason;
  }
}

function sameObservableState(
  left: ControllerSessionObservableState,
  right: ControllerSessionObservableState,
) {
  return (
    left.activeGamepadIndex === right.activeGamepadIndex &&
    left.connected === right.connected &&
    left.lastConnectedAt === right.lastConnectedAt &&
    left.lastDisconnectedAt === right.lastDisconnectedAt &&
    left.lifecycleState === right.lifecycleState &&
    left.profileId === right.profileId &&
    left.reason === right.reason
  );
}

export function createControllerSession(options: CreateControllerSessionOptions = {}) {
  const environment = options.environment ?? createBrowserEnvironment();
  const bridge = createControllerBridge();
  const commandScopes = createControllerCommandScopeRegistry();
  const listeners = new Set<() => void>();
  let observable: ControllerSessionObservableState = {
    connected: false,
    lifecycleState: controllerCapabilityStates.checking,
    reason: controllerCapabilityReasons.none,
  };
  let frameHandle: number | undefined;
  let removeVisibilityListener: (() => void) | undefined;
  let manuallySuspended = false;
  let started = false;

  const publish = (
    bridgeState: ControllerBridgeState,
    browserReason: ControllerCapabilityReason,
  ) => {
    const nextObservable: ControllerSessionObservableState = {
      ...bridgeState,
      reason: resolveCapabilityReason(bridgeState.lifecycleState, browserReason),
    };

    if (sameObservableState(observable, nextObservable)) {
      return;
    }

    observable = nextObservable;

    for (const listener of listeners) {
      listener();
    }
  };

  const cancelScheduledFrame = () => {
    if (frameHandle === undefined) {
      return;
    }

    environment.cancelAnimationFrame?.(frameHandle);
    frameHandle = undefined;
  };

  const processSource = (source: ControllerBrowserSourceResult, timestamp: number) => {
    const result = bridge.process({
      gamepads: source.gamepads,
      sourceState: source.state,
      timestamp,
    });

    publish(result.state, source.reason);

    for (const event of result.events) {
      commandScopes.dispatch(event);
    }
  };

  const processSuspended = (timestamp: number) => {
    processSource(
      {
        gamepads: [],
        reason: controllerCapabilityReasons.documentHidden,
        state: controllerCapabilityStates.suspended,
      },
      timestamp,
    );
  };

  const scheduleFrame = () => {
    if (
      !started ||
      manuallySuspended ||
      frameHandle !== undefined ||
      environment.requestAnimationFrame === undefined
    ) {
      return;
    }

    frameHandle = environment.requestAnimationFrame((timestamp) => {
      frameHandle = undefined;
      poll(timestamp);
    });
  };

  const poll = (timestamp: number) => {
    if (!started) {
      return;
    }

    if (manuallySuspended) {
      processSuspended(timestamp);
      return;
    }

    const source = readControllerBrowserSource(environment.browser);
    processSource(source, timestamp);

    if (source.state !== controllerCapabilityStates.suspended) {
      scheduleFrame();
    }
  };

  const handleVisibilityChange = () => {
    cancelScheduledFrame();
    poll(environment.now());
  };

  const suspend = () => {
    manuallySuspended = true;
    cancelScheduledFrame();

    if (started) {
      processSuspended(environment.now());
    }
  };

  const resume = () => {
    if (!manuallySuspended) {
      return;
    }

    manuallySuspended = false;

    if (started) {
      poll(environment.now());
    }
  };

  const source = {
    registerCommandScope: commandScopes.register,
    resume,
    suspend,
  } as const;

  return {
    getCommandRibbonModel: commandScopes.getCommandRibbonModel,
    getObservableState: () => observable,
    source,
    start: () => {
      if (started) {
        return;
      }

      started = true;
      manuallySuspended = false;
      removeVisibilityListener = environment.subscribeVisibilityChange?.(handleVisibilityChange);
      poll(environment.now());
    },
    stop: () => {
      if (!started) {
        return;
      }

      started = false;
      manuallySuspended = false;
      cancelScheduledFrame();
      removeVisibilityListener?.();
      removeVisibilityListener = undefined;
      processSuspended(environment.now());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
    subscribeCommandRibbon: commandScopes.subscribeCommandRibbon,
  } as const;
}
