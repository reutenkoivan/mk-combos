import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";

export default createTsdownConfig({
  entry: {
    contract: "src/contract.ts",
    "graph/schema": "src/graph/schema.ts",
    "graph/type": "src/graph/type.ts",
    "replay/runtime": "src/replay/runtime.ts",
    "replay/schema": "src/replay/schema.ts",
    "replay/type": "src/replay/type.ts",
    "replay/value": "src/replay/value.ts",
    "runtime/schema": "src/runtime/schema.ts",
    "runtime/type": "src/runtime/type.ts",
    "stale/runtime": "src/stale/runtime.ts",
    "stale/schema": "src/stale/schema.ts",
    "stale/type": "src/stale/type.ts",
    "stale/value": "src/stale/value.ts",
    "transition/runtime": "src/transition/runtime.ts",
    "transition/schema": "src/transition/schema.ts",
    "transition/type": "src/transition/type.ts",
    "transition/value": "src/transition/value.ts",
  },
});
