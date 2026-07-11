import { createTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";

export default createTsdownConfig({
  entry: {
    index: "src/index.ts",
    contract: "src/contract.ts",
    runtime: "src/runtime.ts",
    schema: "src/schema.ts",
    type: "src/type.ts",
  },
});
