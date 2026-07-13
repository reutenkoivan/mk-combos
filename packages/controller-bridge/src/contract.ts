import { controllerCommandEventPhases } from "./bridge/value";
import { controllerCapabilityReasons, controllerCapabilityStates } from "./capability/value";
import { controllerCommandGroups, knownControllerCommandIds } from "./command/value";
import {
  controllerAxisDirections,
  controllerControlIds,
  controllerControlSources,
} from "./input/value";
import { controllerProfileIds } from "./profile/value";

export const controllerBridgeContractGroups = {
  capability: {
    runtime: "@mk-combos/controller-bridge/capability/runtime",
    schema: "@mk-combos/controller-bridge/capability/schema",
    type: "@mk-combos/controller-bridge/capability/type",
    value: "@mk-combos/controller-bridge/capability/value",
  },
  bridge: {
    runtime: "@mk-combos/controller-bridge/bridge/runtime",
    schema: "@mk-combos/controller-bridge/bridge/schema",
    type: "@mk-combos/controller-bridge/bridge/type",
    value: "@mk-combos/controller-bridge/bridge/value",
  },
  command: {
    schema: "@mk-combos/controller-bridge/command/schema",
    type: "@mk-combos/controller-bridge/command/type",
    value: "@mk-combos/controller-bridge/command/value",
  },
  hint: {
    runtime: "@mk-combos/controller-bridge/hint/runtime",
    schema: "@mk-combos/controller-bridge/hint/schema",
    type: "@mk-combos/controller-bridge/hint/type",
  },
  input: {
    runtime: "@mk-combos/controller-bridge/input/runtime",
    schema: "@mk-combos/controller-bridge/input/schema",
    type: "@mk-combos/controller-bridge/input/type",
    value: "@mk-combos/controller-bridge/input/value",
  },
  profile: {
    runtime: "@mk-combos/controller-bridge/profile/runtime",
    schema: "@mk-combos/controller-bridge/profile/schema",
    type: "@mk-combos/controller-bridge/profile/type",
    value: "@mk-combos/controller-bridge/profile/value",
  },
} as const;

export const mkCombosControllerBridge = {
  packageName: "@mk-combos/controller-bridge",
  groups: controllerBridgeContractGroups,
  valueSets: {
    controllerCapabilityStates,
    controllerCapabilityReasons,
    controllerCommandEventPhases,
    controllerCommandGroups,
    controllerAxisDirections,
    controllerControlIds,
    controllerControlSources,
    controllerProfileIds,
    knownControllerCommandIds,
  },
} as const;
