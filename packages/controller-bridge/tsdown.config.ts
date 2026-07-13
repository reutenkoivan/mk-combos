import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";

export default createTsdownConfig({
  entry: {
    "capability/runtime": "src/capability/runtime.ts",
    "capability/schema": "src/capability/schema.ts",
    "capability/type": "src/capability/type.ts",
    "capability/value": "src/capability/value.ts",
    "bridge/runtime": "src/bridge/runtime.ts",
    "bridge/schema": "src/bridge/schema.ts",
    "bridge/type": "src/bridge/type.ts",
    "bridge/value": "src/bridge/value.ts",
    "command/schema": "src/command/schema.ts",
    "command/type": "src/command/type.ts",
    "command/value": "src/command/value.ts",
    contract: "src/contract.ts",
    "hint/runtime": "src/hint/runtime.ts",
    "hint/schema": "src/hint/schema.ts",
    "hint/type": "src/hint/type.ts",
    "input/runtime": "src/input/runtime.ts",
    "input/schema": "src/input/schema.ts",
    "input/type": "src/input/type.ts",
    "input/value": "src/input/value.ts",
    "profile/runtime": "src/profile/runtime.ts",
    "profile/schema": "src/profile/schema.ts",
    "profile/type": "src/profile/type.ts",
    "profile/value": "src/profile/value.ts",
  },
});
