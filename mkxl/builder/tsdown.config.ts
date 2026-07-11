import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";

export default createTsdownConfig({
  entry: {
    contract: "src/contract.ts",
    "context/schema": "src/context/schema.ts",
    "context/type": "src/context/type.ts",
    "graph/runtime": "src/graph/runtime.ts",
    "graph/schema": "src/graph/schema.ts",
    "graph/type": "src/graph/type.ts",
    "replay/runtime": "src/replay/runtime.ts",
    "state/runtime": "src/state/runtime.ts",
  },
});
