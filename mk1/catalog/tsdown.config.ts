import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";

export default createTsdownConfig({
  entry: {
    "context/runtime": "src/context/runtime.ts",
    "context/schema": "src/context/schema.ts",
    "context/type": "src/context/type.ts",
    "context/value": "src/context/value.ts",
    contract: "src/contract.ts",
    "filters/runtime": "src/filters/runtime.ts",
    "filters/schema": "src/filters/schema.ts",
    "filters/type": "src/filters/type.ts",
    "filters/value": "src/filters/value.ts",
    "selectors/runtime": "src/selectors/runtime.ts",
    "summary/schema": "src/summary/schema.ts",
    "summary/type": "src/summary/type.ts",
  },
});
