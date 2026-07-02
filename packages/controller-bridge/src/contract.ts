import { knownControllerCommandIds } from "./command/value";
import { controllerControlIds } from "./input/value";
import { controllerProfileIds } from "./profile/value";

export const controllerBridgeContractGroups = {
  bridge: {
    runtime: "@mk-combos/controller-bridge/bridge/runtime",
    schema: "@mk-combos/controller-bridge/bridge/schema",
    type: "@mk-combos/controller-bridge/bridge/type",
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
    controllerControlIds,
    controllerProfileIds,
    knownControllerCommandIds,
  },
} as const;
