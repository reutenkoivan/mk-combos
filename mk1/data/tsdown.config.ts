import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";

export default createTsdownConfig({
  entry: {
    "combos/schema": "src/combos/schema.ts",
    "combos/type": "src/combos/type.ts",
    "combos/value": "src/combos/value.ts",
    contract: "src/contract.ts",
    "coverage/runtime": "src/coverage/runtime.ts",
    "coverage/schema": "src/coverage/schema.ts",
    "coverage/type": "src/coverage/type.ts",
    "coverage/value": "src/coverage/value.ts",
    "game/schema": "src/game/schema.ts",
    "game/type": "src/game/type.ts",
    "game/value": "src/game/value.ts",
    "graph/schema": "src/graph/schema.ts",
    "graph/type": "src/graph/type.ts",
    "graph/value": "src/graph/value.ts",
    "kameos/schema": "src/kameos/schema.ts",
    "kameos/type": "src/kameos/type.ts",
    "kameos/value": "src/kameos/value.ts",
    "movelists/schema": "src/movelists/schema.ts",
    "movelists/type": "src/movelists/type.ts",
    "movelists/value": "src/movelists/value.ts",
    "roster/schema": "src/roster/schema.ts",
    "roster/type": "src/roster/type.ts",
    "roster/value": "src/roster/value.ts",
  },
});
