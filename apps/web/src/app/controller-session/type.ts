import type { NotationDisplayMode } from "@mk-combos/contracts/settings/type";
import type {
  ControllerBridgeState,
  ControllerCommandEvent,
} from "@mk-combos/controller-bridge/bridge/type";
import type { ControllerBrowserEnvironment } from "@mk-combos/controller-bridge/capability/runtime";
import type { ControllerCapabilityReason } from "@mk-combos/controller-bridge/capability/type";
import type { ControllerCommandId } from "@mk-combos/controller-bridge/command/type";
import type { ReactNode } from "react";

import type { controllerCommandRibbonShellPolicies, controllerCommandScopeLayers } from "./value";

export type ControllerCommandScopeLayer =
  (typeof controllerCommandScopeLayers)[keyof typeof controllerCommandScopeLayers];

type ControllerCommandRibbonShellPolicy =
  (typeof controllerCommandRibbonShellPolicies)[keyof typeof controllerCommandRibbonShellPolicies];

export type ControllerCommandRibbonCommand = Readonly<{
  commandIds: readonly ControllerCommandId[];
  id: string;
  label: string;
}>;

export type ControllerCommandRibbonModel = Readonly<{
  accessibleLabel: string;
  commands: readonly ControllerCommandRibbonCommand[];
  notationDisplayModeOverride?: NotationDisplayMode;
  shellPolicy: ControllerCommandRibbonShellPolicy;
}>;

export type ControllerCommandScope = Readonly<{
  commandIds?: readonly ControllerCommandId[];
  enabled?: boolean;
  exclusive?: boolean;
  handleCommand: (event: ControllerCommandEvent) => boolean;
  id: string;
  layer: ControllerCommandScopeLayer;
  passThroughCommandIds?: readonly ControllerCommandId[];
  ribbon?: ControllerCommandRibbonModel;
}>;

type ControllerCommandDispatchResult =
  | Readonly<{ handled: false }>
  | Readonly<{ handled: true; scopeId: string }>;

export type ControllerCommandScopeRegistration = Readonly<{
  unregister: () => void;
  update: (scope: ControllerCommandScope) => void;
}>;

export type ControllerCommandScopeRegistry = Readonly<{
  clear: () => void;
  dispatch: (event: ControllerCommandEvent) => ControllerCommandDispatchResult;
  getCommandRibbonModel: () => ControllerCommandRibbonModel | null;
  register: (scope: ControllerCommandScope) => ControllerCommandScopeRegistration;
  subscribeCommandRibbon: (listener: () => void) => () => void;
}>;

type ControllerAnimationFrameCallback = (timestamp: number) => void;

export type ControllerSessionEnvironment = Readonly<{
  browser: ControllerBrowserEnvironment;
  cancelAnimationFrame?: (handle: number) => void;
  now: () => number;
  requestAnimationFrame?: (callback: ControllerAnimationFrameCallback) => number;
  subscribeVisibilityChange?: (listener: () => void) => () => void;
}>;

export type ControllerSessionObservableState = Readonly<
  ControllerBridgeState & {
    reason: ControllerCapabilityReason;
  }
>;

export type ControllerSessionSource = Readonly<{
  registerCommandScope: (scope: ControllerCommandScope) => ControllerCommandScopeRegistration;
  resume: () => void;
  suspend: () => void;
}>;

export type ControllerSession = Readonly<{
  getCommandRibbonModel: () => ControllerCommandRibbonModel | null;
  getObservableState: () => ControllerSessionObservableState;
  source: ControllerSessionSource;
  start: () => void;
  stop: () => void;
  subscribe: (listener: () => void) => () => void;
  subscribeCommandRibbon: (listener: () => void) => () => void;
}>;

export type CreateControllerSessionOptions = Readonly<{
  environment?: ControllerSessionEnvironment;
}>;

export type ControllerSessionProviderProps = Readonly<{
  children: ReactNode;
  environment?: ControllerSessionEnvironment;
}>;
